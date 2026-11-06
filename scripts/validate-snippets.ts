/**
 * Validates the snippet library:
 *  1. format rules (metadata line, ASCII only, line length, size, unique ids)
 *  2. real compilation / syntax checks with every toolchain found on this machine
 *
 * Usage: npm run validate:snippets [-- --lang python]
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { normalizeCode, parseSource } from '../src/engine/normalize';
import { LANGUAGES, type LangId } from '../src/snippets/languages';

const ROOT = resolve(import.meta.dirname, '..');
const SNIPPETS = join(ROOT, 'snippets');
const TMP = join(ROOT, '.validate-tmp');
const MAX_COLS = 90;
const MIN_LINES = 5;
const MAX_LINES = 44;

const onlyLang = (() => {
  const i = process.argv.indexOf('--lang');
  return i > -1 ? process.argv[i + 1] : null;
})();

const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

interface Problem {
  file: string;
  message: string;
}
const problems: Problem[] = [];
const skipped: string[] = [];
const fail = (file: string, message: string) => problems.push({ file, message });

function has(cmd: string, args: string[] = ['--version']): boolean {
  const r = spawnSync(cmd, args, { encoding: 'utf8', shell: process.platform === 'win32' });
  return r.status === 0;
}

function run(cmd: string, args: string[], opts: { cwd?: string; input?: string } = {}) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    cwd: opts.cwd,
    input: opts.input,
    shell: process.platform === 'win32',
    maxBuffer: 16 * 1024 * 1024,
  });
  return { ok: r.status === 0, out: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() };
}

const q = (p: string) => (process.platform === 'win32' ? `"${p}"` : p);

// ---------------------------------------------------------------- format
const files: Record<LangId, string[]> = {} as Record<LangId, string[]>;
let total = 0;
for (const lang of LANGUAGES) {
  if (onlyLang && lang.id !== onlyLang) continue;
  const dir = join(SNIPPETS, lang.id);
  const list = existsSync(dir) ? readdirSync(dir).map((f) => join(dir, f)) : [];
  files[lang.id] = list;
  const seen = new Set<string>();
  for (const file of list) {
    total++;
    const rel = `${lang.id}/${basename(file)}`;
    if (seen.has(basename(file).toLowerCase())) fail(rel, 'duplicate file name');
    seen.add(basename(file).toLowerCase());
    const raw = readFileSync(file, 'utf8');
    const parsed = parseSource(raw);
    if (!parsed) {
      fail(rel, 'missing "@codetype <easy|medium|hard> | <description>" line');
      continue;
    }
    if (parsed.description.length < 10) fail(rel, 'description is too short');
    const code = normalizeCode(parsed.body, lang.indent);
    const lines = code.split('\n');
    if (lines.length < MIN_LINES || lines.length > MAX_LINES) {
      fail(rel, `has ${lines.length} lines (allowed ${MIN_LINES}-${MAX_LINES})`);
    }
    lines.forEach((line, i) => {
      if (line.length > MAX_COLS) fail(rel, `line ${i + 1} is ${line.length} chars (max ${MAX_COLS})`);
      // eslint-disable-next-line no-control-regex
      if (/[^\x20-\x7e]/.test(line)) fail(rel, `line ${i + 1} contains non-ASCII characters`);
    });
  }
}

// ---------------------------------------------------------------- compile
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

type Checker = (list: string[]) => void;

const checkers: Partial<Record<LangId, { tool: () => boolean; label: string; check: Checker }>> = {
  javascript: {
    label: 'node --check',
    tool: () => true,
    check: (list) => {
      for (const f of list) {
        const copy = join(TMP, basename(f).replace(/\.js$/, '.mjs'));
        writeFileSync(copy, readFileSync(f));
        const r = run('node', ['--check', q(copy)]);
        if (!r.ok) fail(`javascript/${basename(f)}`, r.out);
      }
    },
  },
  typescript: {
    label: 'tsc --strict',
    tool: () => true,
    check: () => {
      const cfg = join(TMP, 'tsconfig.json');
      writeFileSync(
        cfg,
        JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            lib: ['ES2022', 'DOM'],
            module: 'ESNext',
            moduleResolution: 'bundler',
            moduleDetection: 'force',
            strict: true,
            noEmit: true,
            skipLibCheck: true,
            types: ['node'],
          },
          include: ['../snippets/typescript/*.ts'],
        }),
      );
      const r = run('npx', ['tsc', '-p', q(cfg)], { cwd: ROOT });
      if (!r.ok) {
        for (const line of r.out.split('\n')) {
          const m = line.match(/snippets[\\/]typescript[\\/]([^(]+)\((.*)/);
          if (m) fail(`typescript/${m[1]}`, m[2]);
        }
        if (!problems.some((p) => p.file.startsWith('typescript/'))) fail('typescript', r.out);
      }
    },
  },
  python: {
    label: 'python compile()',
    tool: () => has('python'),
    check: (list) => {
      const script = [
        'import sys, json',
        'bad = {}',
        'for p in json.loads(sys.stdin.read()):',
        '    try:',
        '        compile(open(p, encoding="utf-8").read(), p, "exec")',
        '    except SyntaxError as e:',
        '        bad[p] = f"line {e.lineno}: {e.msg}"',
        'print(json.dumps(bad))',
      ].join('\n');
      writeFileSync(join(TMP, 'pycheck.py'), script);
      const r = run('python', ['-I', q(join(TMP, 'pycheck.py'))], { input: JSON.stringify(list) });
      const bad = JSON.parse(r.out || '{}') as Record<string, string>;
      for (const [p, msg] of Object.entries(bad)) fail(`python/${basename(p)}`, msg);
    },
  },
  java: {
    label: 'javac',
    tool: () => has('javac', ['-version']),
    check: (list) => {
      for (const f of list) {
        const out = join(TMP, 'java', basename(f, '.java'));
        mkdirSync(out, { recursive: true });
        const r = run('javac', ['-Xlint:none', '-d', q(out), q(f)]);
        if (!r.ok) fail(`java/${basename(f)}`, r.out);
      }
    },
  },
  php: {
    label: 'php -l',
    tool: () => has('php', ['-v']),
    check: (list) => {
      for (const f of list) {
        const r = run('php', ['-l', q(f)]);
        if (!r.ok) fail(`php/${basename(f)}`, r.out);
      }
    },
  },
  sql: {
    label: 'sqlite3 (python)',
    tool: () => has('python'),
    check: (list) => {
      const script = String.raw`
import sys, json, re, sqlite3
FIXTURE = {
  "users": "CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, name TEXT, role TEXT, created_at TEXT)",
  "customers": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT)",
  "orders": "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INT, total REAL, status TEXT, created_at TEXT)",
  "departments": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT)",
  "employees": "CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL, department_id INT, manager_id INT)",
  "products": "CREATE TABLE products (id INTEGER PRIMARY KEY, sku TEXT UNIQUE, name TEXT, stock INT, price REAL, category TEXT, discontinued INT DEFAULT 0, updated_at TEXT)",
  "order_items": "CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INT, product_id INT, quantity INT)",
  "accounts": "CREATE TABLE accounts (id INTEGER PRIMARY KEY, balance REAL)",
  "transfers": "CREATE TABLE transfers (id INTEGER PRIMARY KEY, from_account INT, to_account INT, amount REAL)",
}
bad = {}
for p in json.loads(sys.stdin.read()):
    sql = open(p, encoding="utf-8").read()
    created = {m.lower() for m in re.findall(r"CREATE\s+TABLE\s+(\w+)", sql, re.I)}
    db = sqlite3.connect(":memory:")
    for name, ddl in FIXTURE.items():
        if name not in created:
            db.execute(ddl)
    try:
        db.executescript(sql)
    except sqlite3.Error as e:
        bad[p] = str(e)
print(json.dumps(bad))
`;
      writeFileSync(join(TMP, 'sqlcheck.py'), script);
      const r = run('python', ['-I', q(join(TMP, 'sqlcheck.py'))], { input: JSON.stringify(list) });
      const bad = JSON.parse(r.out || '{}') as Record<string, string>;
      for (const [p, msg] of Object.entries(bad)) fail(`sql/${basename(p)}`, msg);
    },
  },
  c: {
    label: 'gcc -fsyntax-only',
    tool: () => has('gcc'),
    check: (list) => {
      for (const f of list) {
        const r = run('gcc', ['-std=c11', '-Wall', '-fsyntax-only', q(f)]);
        if (!r.ok) fail(`c/${basename(f)}`, r.out);
      }
    },
  },
  cpp: {
    label: 'g++ -fsyntax-only',
    tool: () => has('g++'),
    check: (list) => {
      for (const f of list) {
        const r = run('g++', ['-std=c++20', '-Wall', '-fsyntax-only', q(f)]);
        if (!r.ok) fail(`cpp/${basename(f)}`, r.out);
      }
    },
  },
  go: {
    label: 'go vet',
    tool: () => has('go', ['version']),
    check: (list) => {
      for (const f of list) {
        const r = run('go', ['vet', q(f)]);
        if (!r.ok) fail(`go/${basename(f)}`, r.out);
      }
    },
  },
  rust: {
    label: 'rustc',
    tool: () => has('rustc'),
    check: (list) => {
      for (const f of list) {
        const src = readFileSync(f, 'utf8');
        const type = /\bfn main\s*\(/.test(src) ? 'bin' : 'lib';
        const r = run('rustc', ['--edition', '2021', '--crate-type', type, '--emit=metadata', '-A', 'dead_code', '--out-dir', q(TMP), q(f)]);
        if (!r.ok) fail(`rust/${basename(f)}`, r.out);
      }
    },
  },
  kotlin: {
    label: 'kotlinc',
    tool: () => has('kotlinc', ['-version']),
    check: (list) => {
      for (const f of list) {
        const r = run('kotlinc', [q(f), '-d', q(join(TMP, 'kt'))]);
        if (!r.ok) fail(`kotlin/${basename(f)}`, r.out);
      }
    },
  },
  csharp: {
    label: 'dotnet build',
    tool: () => {
      const r = run('dotnet', ['--list-sdks']);
      return r.ok && r.out.length > 0;
    },
    check: (list) => {
      const dir = join(TMP, 'cs');
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, 'Snippets.csproj'),
        `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><TargetFramework>net8.0</TargetFramework><OutputType>Library</OutputType><Nullable>enable</Nullable></PropertyGroup><ItemGroup>${list
          .map((f) => `<Compile Include="${f}" />`)
          .join('')}</ItemGroup></Project>`,
      );
      const r = run('dotnet', ['build', q(dir), '-nologo', '-v', 'q']);
      if (!r.ok) fail('csharp', r.out);
    },
  },
};

const compiled: string[] = [];
for (const lang of LANGUAGES) {
  const list = files[lang.id];
  if (!list || list.length === 0) continue;
  const checker = checkers[lang.id];
  if (!checker || !checker.tool()) {
    skipped.push(`${lang.name} (${list.length} files, toolchain not installed)`);
    continue;
  }
  process.stdout.write(c.dim(`checking ${lang.name.padEnd(11)} with ${checker.label}...`));
  const before = problems.length;
  checker.check(list);
  const n = problems.length - before;
  process.stdout.write(n ? ` ${c.red(`${n} problem(s)`)}\n` : ` ${c.green('ok')}\n`);
  compiled.push(lang.name);
}
rmSync(TMP, { recursive: true, force: true });

// ---------------------------------------------------------------- report
console.log();
for (const p of problems) {
  console.log(`${c.red('✗')} ${c.bold(p.file)}: ${p.message.split('\n').slice(0, 6).join('\n    ')}`);
}
for (const s of skipped) console.log(`${c.yellow('!')} skipped compile check for ${s}`);
console.log(
  `\n${total} snippets · compiled: ${compiled.join(', ') || 'none'} · ${
    problems.length ? c.red(`${problems.length} problem(s)`) : c.green('all good')
  }`,
);
process.exit(problems.length ? 1 : 0);
