// SVG strings for facial components. Crisp, schematic, blueprint feel.
export type PartCategory = "face" | "eyes" | "nose" | "mouth" | "hair" | "brows" | "ears" | "accessories";

export type FacialPart = {
  id: string;
  category: PartCategory;
  label: string;
  svg: string;
  defaultW: number;
  defaultH: number;
};

const stroke = "#FAFAFA";
const sw = 2;

const pencilFilter = `
  <defs>
    <filter id="pencil" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
`;

const wrap = (inner: string, w = 120, h = 120) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" filter="url(#pencil)">${pencilFilter}${inner}</svg>`;

export const FACIAL_PARTS: FacialPart[] = [
  // Face shapes
  { id: "face-oval", category: "face", label: "Oval", defaultW: 240, defaultH: 320,
    svg: wrap(`<ellipse cx="60" cy="60" rx="42" ry="55"/>`) },
  { id: "face-square", category: "face", label: "Square", defaultW: 240, defaultH: 300,
    svg: wrap(`<path d="M20 30 Q20 18 32 18 H88 Q100 18 100 30 V78 Q100 102 60 105 Q20 102 20 78 Z"/>`) },
  { id: "face-round", category: "face", label: "Round", defaultW: 240, defaultH: 280,
    svg: wrap(`<circle cx="60" cy="60" r="46"/>`) },
  { id: "face-heart", category: "face", label: "Heart", defaultW: 240, defaultH: 300,
    svg: wrap(`<path d="M60 110 Q20 80 15 40 Q30 10 60 30 Q90 10 105 40 Q100 80 60 110 Z"/>`) },
  { id: "face-diamond", category: "face", label: "Diamond", defaultW: 240, defaultH: 320,
    svg: wrap(`<polygon points="60,10 100,50 60,110 20,50"/>`) },

  // Eyes
  { id: "eyes-almond", category: "eyes", label: "Almond", defaultW: 180, defaultH: 60,
    svg: wrap(`<path d="M10 30 Q30 12 50 30 Q30 48 10 30 Z"/><circle cx="30" cy="30" r="6" fill="${stroke}"/><path d="M70 30 Q90 12 110 30 Q90 48 70 30 Z"/><circle cx="90" cy="30" r="6" fill="${stroke}"/>`, 120, 60) },
  { id: "eyes-round", category: "eyes", label: "Round", defaultW: 180, defaultH: 60,
    svg: wrap(`<circle cx="30" cy="30" r="14"/><circle cx="30" cy="30" r="5" fill="${stroke}"/><circle cx="90" cy="30" r="14"/><circle cx="90" cy="30" r="5" fill="${stroke}"/>`, 120, 60) },
  { id: "eyes-narrow", category: "eyes", label: "Narrow", defaultW: 180, defaultH: 40,
    svg: wrap(`<path d="M10 20 Q30 10 50 20 Q30 30 10 20 Z"/><path d="M70 20 Q90 10 110 20 Q90 30 70 20 Z"/>`, 120, 40) },
  { id: "eyes-hooded", category: "eyes", label: "Hooded", defaultW: 180, defaultH: 50,
    svg: wrap(`<path d="M10 30 Q30 20 50 30 Q30 40 10 30 Z"/><path d="M5 24 Q30 12 55 24"/><circle cx="30" cy="30" r="4" fill="${stroke}"/><path d="M70 30 Q90 20 110 30 Q90 40 70 30 Z"/><path d="M65 24 Q90 12 115 24"/><circle cx="90" cy="30" r="4" fill="${stroke}"/>`, 120, 60) },
  { id: "eyes-monolid", category: "eyes", label: "Monolid", defaultW: 180, defaultH: 40,
    svg: wrap(`<path d="M10 30 L50 30 Q30 40 10 30 Z"/><path d="M70 30 L110 30 Q90 40 70 30 Z"/><circle cx="30" cy="30" r="3" fill="${stroke}"/><circle cx="90" cy="30" r="3" fill="${stroke}"/>`, 120, 50) },

  // Brows
  { id: "brows-straight", category: "brows", label: "Straight", defaultW: 180, defaultH: 24,
    svg: wrap(`<path d="M8 12 H50"/><path d="M70 12 H112"/>`, 120, 24) },
  { id: "brows-arched", category: "brows", label: "Arched", defaultW: 180, defaultH: 24,
    svg: wrap(`<path d="M8 16 Q30 4 50 14"/><path d="M70 14 Q90 4 112 16"/>`, 120, 24) },
  { id: "brows-thick", category: "brows", label: "Thick", defaultW: 180, defaultH: 28,
    svg: wrap(`<path d="M8 14 Q30 6 50 12 Q30 22 8 18 Z" fill="${stroke}"/><path d="M70 12 Q90 6 112 14 Q90 22 70 18 Z" fill="${stroke}"/>`, 120, 28) },
  { id: "brows-rounded", category: "brows", label: "Rounded", defaultW: 180, defaultH: 26,
    svg: wrap(`<path d="M8 20 Q30 4 50 20"/><path d="M70 20 Q90 4 112 20"/>`, 120, 26) },
  { id: "brows-flat", category: "brows", label: "Flat", defaultW: 180, defaultH: 22,
    svg: wrap(`<path d="M8 12 L50 12"/><path d="M70 12 L112 12"/>`, 120, 22) },

  // Nose
  { id: "nose-straight", category: "nose", label: "Straight", defaultW: 60, defaultH: 110,
    svg: wrap(`<path d="M30 8 L24 70 Q24 84 30 86 Q36 84 36 70 Z"/><path d="M22 78 Q30 86 38 78"/>`, 60, 100) },
  { id: "nose-button", category: "nose", label: "Button", defaultW: 60, defaultH: 90,
    svg: wrap(`<path d="M30 16 Q22 50 22 64 Q22 78 30 78 Q38 78 38 64 Q38 50 30 16 Z"/>`, 60, 90) },
  { id: "nose-aquiline", category: "nose", label: "Aquiline", defaultW: 60, defaultH: 120,
    svg: wrap(`<path d="M28 10 Q22 30 20 60 Q20 86 30 90 Q40 86 40 70 L36 60 Z"/>`, 60, 110) },
  { id: "nose-broad", category: "nose", label: "Broad", defaultW: 60, defaultH: 100,
    svg: wrap(`<path d="M30 15 L30 70"/><path d="M15 80 Q30 90 45 80 Q30 75 15 80 Z"/>`, 60, 100) },
  { id: "nose-hooked", category: "nose", label: "Hooked", defaultW: 60, defaultH: 120,
    svg: wrap(`<path d="M25 15 Q40 50 30 85 Q20 100 40 95"/><path d="M25 80 Q20 90 25 100"/>`, 60, 110) },

  // Mouth
  { id: "mouth-neutral", category: "mouth", label: "Neutral", defaultW: 140, defaultH: 40,
    svg: wrap(`<path d="M10 20 Q40 28 60 20 Q80 28 110 20"/><path d="M10 20 Q40 12 60 20 Q80 12 110 20"/>`, 120, 40) },
  { id: "mouth-full", category: "mouth", label: "Full", defaultW: 140, defaultH: 50,
    svg: wrap(`<path d="M10 25 Q40 8 60 22 Q80 8 110 25 Q80 42 60 30 Q40 42 10 25 Z"/>`, 120, 50) },
  { id: "mouth-thin", category: "mouth", label: "Thin", defaultW: 140, defaultH: 24,
    svg: wrap(`<path d="M10 12 Q60 18 110 12"/>`, 120, 24) },
  { id: "mouth-wide", category: "mouth", label: "Wide", defaultW: 160, defaultH: 30,
    svg: wrap(`<path d="M5 20 Q60 25 115 20"/><path d="M5 20 Q60 15 115 20"/>`, 120, 30) },
  { id: "mouth-pursed", category: "mouth", label: "Pursed", defaultW: 100, defaultH: 40,
    svg: wrap(`<circle cx="60" cy="20" r="10"/><path d="M50 20 H70"/>`, 120, 40) },

  // Hair
  { id: "hair-short", category: "hair", label: "Short", defaultW: 260, defaultH: 140,
    svg: wrap(`<path d="M10 70 Q10 20 60 16 Q110 20 110 70 Q100 50 80 50 Q60 36 40 50 Q20 50 10 70 Z"/>`, 120, 80) },
  { id: "hair-long", category: "hair", label: "Long", defaultW: 280, defaultH: 240,
    svg: wrap(`<path d="M14 50 Q10 16 60 12 Q110 16 106 50 L112 140 Q90 130 90 100 Q60 80 30 100 Q30 130 8 140 Z"/>`, 120, 150) },
  { id: "hair-buzz", category: "hair", label: "Buzz", defaultW: 240, defaultH: 80,
    svg: wrap(`<path d="M16 60 Q16 28 60 24 Q104 28 104 60 Q60 50 16 60 Z" stroke-dasharray="2 3"/>`, 120, 70) },
  { id: "hair-curly", category: "hair", label: "Curly", defaultW: 280, defaultH: 160,
    svg: wrap(`<path d="M20 70 Q10 40 30 25 Q50 5 70 15 Q90 5 110 25 Q130 40 100 70" fill="none"/>`, 120, 80) },
  { id: "hair-bald", category: "hair", label: "Bald", defaultW: 240, defaultH: 80,
    svg: wrap(`<path d="M10 70 Q10 10 60 10 Q110 10 110 70" stroke-dasharray="1 5"/>`, 120, 70) },

  // Ears
  { id: "ears-attached", category: "ears", label: "Attached", defaultW: 260, defaultH: 100,
    svg: wrap(`<path d="M10 20 Q0 50 10 80 Q20 50 10 20 Z"/><path d="M110 20 Q120 50 110 80 Q100 50 110 20 Z"/>`, 120, 100) },
  { id: "ears-detached", category: "ears", label: "Detached", defaultW: 260, defaultH: 100,
    svg: wrap(`<path d="M15 10 Q-5 40 10 80 Q25 40 15 10 Z"/><path d="M105 10 Q125 40 110 80 Q95 40 105 10 Z"/>`, 120, 100) },
  { id: "ears-pointed", category: "ears", label: "Pointed", defaultW: 260, defaultH: 120,
    svg: wrap(`<path d="M25 80 L5 10 L15 60 Z"/><path d="M95 80 L115 10 L105 60 Z"/>`, 120, 100) },

  // Accessories
  { id: "acc-glasses", category: "accessories", label: "Glasses", defaultW: 200, defaultH: 60,
    svg: wrap(`<rect x="10" y="20" width="40" height="30" rx="4"/><rect x="70" y="20" width="40" height="30" rx="4"/><line x1="50" y1="30" x2="70" y2="30"/><line x1="10" y1="30" x2="0" y2="20"/><line x1="110" y1="30" x2="120" y2="20"/>`, 120, 60) },
  { id: "acc-shades", category: "accessories", label: "Shades", defaultW: 200, defaultH: 60,
    svg: wrap(`<path d="M10 20 L50 20 L45 50 Q30 60 10 50 Z" fill="${stroke}"/><path d="M70 20 L110 20 L110 50 Q90 60 75 50 Z" fill="${stroke}"/><line x1="50" y1="25" x2="70" y2="25"/>`, 120, 60) },
  { id: "acc-earring", category: "accessories", label: "Earring", defaultW: 260, defaultH: 120,
    svg: wrap(`<circle cx="10" cy="80" r="8"/><circle cx="110" cy="80" r="8"/>`, 120, 100) },
  { id: "acc-bandana", category: "accessories", label: "Bandana", defaultW: 260, defaultH: 80,
    svg: wrap(`<path d="M0 40 Q60 60 120 40 L120 20 Q60 40 0 20 Z"/><circle cx="60" cy="30" r="4"/><path d="M110 30 L130 50 L110 70 Z" fill="${stroke}"/>`, 140, 80) },
];

export const CATEGORIES: { id: PartCategory; label: string }[] = [
  { id: "face", label: "Face" },
  { id: "hair", label: "Hair" },
  { id: "brows", label: "Brows" },
  { id: "eyes", label: "Eyes" },
  { id: "nose", label: "Nose" },
  { id: "mouth", label: "Mouth" },
  { id: "ears", label: "Ears" },
  { id: "accessories", label: "Extras" },
];
