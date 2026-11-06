# CodeType

Typing test berisi **potongan kode asli**. Kode yang kamu ketik menumbuhkan pohon.

- **Struktur kode menentukan bentuk pohon.** Blok jadi dahan, dan blok bersarang bercabang
  dari baris yang membukanya.
- **Warna daun berasal dari syntax highlight** baris tempat daun itu tumbuh.
- **Salah ketik jadi bug.** Serangga melompat dari huruf yang salah ke pohon, dan pecah saat
  huruf itu dihapus dengan Backspace.
- **Bahasa adalah spesies.** Python jadi willow, JavaScript jadi cherry, Rust jadi copper
  beech, dan seterusnya untuk 12 bahasa.
- **Riwayat adalah hutan.** Setiap run tersimpan sebagai satu pohon: makin cepat makin tinggi,
  makin akurat makin rimbun, dan personal best membawa lentera.

## Menjalankan

```bash
npm install
npm run dev                 # http://localhost:5173
npm run build               # build produksi ke dist/
npm test                    # unit test engine, pohon, warna, migrasi
npm run validate:snippets   # cek format + kompilasi semua snippet
```

## Fitur

- **213 snippet** di 12 bahasa: JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, PHP,
  C#, SQL, Kotlin. Semuanya kode yang berfungsi dengan level easy / medium / hard.
- Snippet diambil **acak** (shuffle bag, tidak berulang sebelum semua keluar), atau pilih
  sendiri dari Library (`Ctrl+B`) dan `Ctrl+P`.
- **5 dunia**: Dusk, Aurora, Tide, Autumn, Meadow. Warna syntax memakai Shiki dan diangkat
  otomatis sampai kontrasnya minimal 4.5:1 di latar tiap dunia.
- Mode **Snippet** (selesaikan satu kode) atau **Timed** 15/30/60/120 detik. Di mode Timed,
  pohon yang selesai pindah ke latar dan benih baru langsung tumbuh.
- Auto-indent (bisa dimatikan untuk mengetik semua spasi; `Tab` didukung).
- Hasil: WPM, raw, akurasi, konsistensi, error, grafik kecepatan, daftar karakter yang salah,
  personal best per bahasa, dan riwayat (localStorage).
- Command palette (`Ctrl+Shift+P`), responsif sampai layar HP.
- **Calm scene** di Settings mematikan angin, partikel, dan huruf yang memantul. Setting ini
  juga otomatis aktif mengikuti `prefers-reduced-motion`.

## Shortcut

| Tombol | Aksi |
| --- | --- |
| `Esc` | Ulangi tes, atau tutup panel yang terbuka |
| `Ctrl+Enter` | Snippet acak berikutnya |
| `Enter` (setelah selesai) | Snippet berikutnya |
| `Ctrl+B` | Library |
| `Ctrl+J` | Forest |
| `Ctrl+,` | Settings |
| `Ctrl+Shift+P` / `Ctrl+P` | Semua perintah / cari snippet |
| `Ctrl+Backspace` | Hapus satu kata |
| `Ctrl+=` / `Ctrl+-` | Ukuran font |

## Menambah snippet

Buat file di `snippets/<bahasa>/<nama-file>` dengan baris metadata di bagian atas
(baris ini tidak ikut diketik):

```js
// @codetype medium | Deskripsi singkat snippet
export function contoh() {
  // ...
}
```

Lalu jalankan `npm run validate:snippets`. Validator mengecek format (ASCII, panjang baris
maks. 90, 5–44 baris) dan mengompilasi snippet dengan toolchain yang terpasang
(node, tsc, python, javac, php, sqlite; gcc/g++/go/rustc/kotlinc/dotnet jika ada).

## Struktur

```
snippets/<bahasa>/*        library snippet (file sumber asli)
src/engine/                engine mengetik (pure), metrik, layout, normalisasi
src/highlight/             Shiki highlighter
src/garden/                pohon dari kode (tree.ts), spesies, dunia, warna, scene canvas
src/store/                 state (zustand): settings, test, history, ui, migrasi settings
src/components/stage/      TopBar, TypingStage, Hud
src/components/results/    ResultScreen, grafik WPM
src/components/overlays/   Library, Forest, SettingsSheet
scripts/validate-snippets.ts
```
