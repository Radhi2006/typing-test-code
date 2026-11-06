export type ShikiThemeId =
  | 'rose-pine-moon'
  | 'nord'
  | 'night-owl'
  | 'monokai'
  | 'github-light-default';

export type WorldId = 'dusk' | 'aurora' | 'tide' | 'autumn' | 'meadow';

export interface World {
  id: WorldId;
  name: string;
  blurb: string;
  kind: 'dark' | 'light';
  shiki: ShikiThemeId;
  /** flat color behind the code; every syntax color is checked against it */
  plate: string;
  sky: string;
  horizon: string;
  text: string;
  muted: string;
  accent: string;
  /** text placed on top of `accent` */
  accentInk: string;
  bug: string;
  firefly: string;
  hills: [far: string, mid: string, near: string];
  bark: string;
  /** light catching the side of the trunk */
  rim: string;
  paper: string;
  paperEdge: string;
  /** moon, or the sun in a light world */
  orb: string;
  /** leaf colors for trees grown without syntax colors (the forest) */
  leaves: string[];
  /** opacity of code that has not been typed yet */
  untyped: number;
}

export const WORLDS: World[] = [
  {
    id: 'dusk',
    name: 'Dusk',
    blurb: 'Violet evening with a peach horizon',
    kind: 'dark',
    shiki: 'rose-pine-moon',
    plate: '#1C1846',
    sky: '#3B2463',
    horizon: '#FF9F7C',
    text: '#F3EEFF',
    muted: '#B9AEDD',
    accent: '#8FE3B0',
    accentInk: '#10302A',
    bug: '#FF5470',
    firefly: '#FFD36E',
    hills: ['#46307A', '#2C2060', '#15103A'],
    bark: '#120D30',
    rim: '#FF9F7C',
    paper: '#262058',
    paperEdge: '#0F0B2C',
    orb: '#FBE7C6',
    leaves: ['#8FE3B0', '#F6C177', '#EB9FBC', '#9CCFD8', '#C4A7E7'],
    untyped: 0.72,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    blurb: 'Polar night, green light low in the sky',
    kind: 'dark',
    shiki: 'nord',
    plate: '#0F1F2B',
    sky: '#14424A',
    horizon: '#6DF2C4',
    text: '#ECF4F4',
    muted: '#A3BDC4',
    accent: '#7CF0CB',
    accentInk: '#0B2B2A',
    bug: '#FF6B81',
    firefly: '#D6FF8A',
    hills: ['#1F5259', '#153A45', '#0A1C27'],
    bark: '#07141D',
    rim: '#6DF2C4',
    paper: '#16303D',
    paperEdge: '#07141D',
    orb: '#DDF6F0',
    leaves: ['#7CF0CB', '#88C0D0', '#B48EAD', '#EBCB8B', '#A3BE8C'],
    untyped: 0.74,
  },
  {
    id: 'tide',
    name: 'Tide',
    blurb: 'Deep blue water under a clear night',
    kind: 'dark',
    shiki: 'night-owl',
    plate: '#04142B',
    sky: '#0E3562',
    horizon: '#58C8F0',
    text: '#E6F1FF',
    muted: '#9DB4D0',
    accent: '#7FDBCA',
    accentInk: '#06252A',
    bug: '#FF6A88',
    firefly: '#FFE08A',
    hills: ['#17477C', '#0E305C', '#061A36'],
    bark: '#030E20',
    rim: '#58C8F0',
    paper: '#0C2747',
    paperEdge: '#020B1A',
    orb: '#E2F3FF',
    leaves: ['#7FDBCA', '#82AAFF', '#C792EA', '#ECC48D', '#ADDB67'],
    untyped: 0.74,
  },
  {
    id: 'autumn',
    name: 'Autumn',
    blurb: 'Rust and amber after sunset',
    kind: 'dark',
    shiki: 'monokai',
    plate: '#1F150E',
    sky: '#55281A',
    horizon: '#FFB347',
    text: '#FBF1E3',
    muted: '#CFB9A0',
    accent: '#F2D16B',
    accentInk: '#33230A',
    bug: '#FF5A5F',
    firefly: '#FFE3A1',
    hills: ['#6E3620', '#472314', '#20120B'],
    bark: '#150D08',
    rim: '#FFB347',
    paper: '#34211A',
    paperEdge: '#120A06',
    orb: '#FFE0AE',
    leaves: ['#F2D16B', '#F4845F', '#E9633F', '#C8B05A', '#F9A03F'],
    untyped: 0.74,
  },
  {
    id: 'meadow',
    name: 'Meadow',
    blurb: 'Bright noon over green hills',
    kind: 'light',
    shiki: 'github-light-default',
    plate: '#EAF7F6',
    sky: '#A9E2F2',
    horizon: '#FFE27A',
    text: '#12332E',
    muted: '#355A52',
    accent: '#0B7A5C',
    accentInk: '#F2FFFA',
    bug: '#A80F35',
    firefly: '#E8A200',
    hills: ['#D2F1C8', '#B6E7B2', '#A4E2B0'],
    bark: '#3F3128',
    rim: '#FFE27A',
    paper: '#FFFFFF',
    paperEdge: '#7DB8A8',
    orb: '#FFF3B0',
    leaves: ['#2FA36B', '#E86A92', '#F2A93B', '#3C8DD9', '#8B5FD6'],
    untyped: 0.82,
  },
];

export const DEFAULT_WORLD: WorldId = 'dusk';

export const WORLD_BY_ID = Object.fromEntries(WORLDS.map((w) => [w.id, w])) as Record<WorldId, World>;

export function worldCssVars(w: World): Record<string, string> {
  return {
    '--plate': w.plate,
    '--sky': w.sky,
    '--horizon': w.horizon,
    '--text': w.text,
    '--muted': w.muted,
    '--accent': w.accent,
    '--accent-ink': w.accentInk,
    '--bug': w.bug,
    '--firefly': w.firefly,
    '--hill-near': w.hills[2],
    '--paper': w.paper,
    '--paper-edge': w.paperEdge,
    '--untyped': String(w.untyped),
  };
}
