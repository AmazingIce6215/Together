export interface ResourceItem {
  title: string;
  description: string;
  url: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  pillar: "watch" | "read" | "practice";
  items: ResourceItem[];
}

export const resources: ResourceCategory[] = [
  // ── Watch ───────────────────────────────────────────
  {
    id: "lecturio",
    title: "Lecturio",
    description: "Comprehensive video lectures for medical students",
    pillar: "watch",
    items: [
      { title: "All Lecturio Videos", description: "Full library of medical lectures", url: "https://mega.nz/folder/S4E2CRCS#yjLrqmg1OzGjYJ-Rh8BE1g" },
    ],
  },
  {
    id: "dr-najeeb",
    title: "Dr. Najeeb",
    description: "Detailed medical lectures with hand-drawn illustrations",
    pillar: "watch",
    items: [
      { title: "All Dr. Najeeb Videos", description: "Complete video collection", url: "https://mega.nz/folder/PrpDAASA#-EezJNXMZV_3TXf_3T84JQ" },
    ],
  },
  {
    id: "osmosis",
    title: "Osmosis",
    description: "Visual medical explanations and concept maps",
    pillar: "watch",
    items: [
      { title: "All Osmosis Videos", description: "Full library of visual explanations", url: "https://mega.nz/folder/Fz9WxI6K#DrmeElAyPoO_siJLuDXqSA" },
      { title: "Anatomy", description: "Osmosis anatomy collection", url: "https://mega.nz/folder/icZ0DDoR#3CXalW0uq3A5gwSVBG5F7Q" },
      { title: "Histology", description: "Osmosis histology collection", url: "https://mega.nz/folder/bywUSZpD#JqwlX9CPlT6-2p--OsUWzw" },
      { title: "Internal Medicine & Surgery", description: "Osmosis IM & surgery collection", url: "https://mega.nz/folder/WEBknTzZ#KksgbgkmeqgW_sbKHf_h6g" },
      { title: "Clinical Skills", description: "Osmosis clinical skills collection", url: "https://mega.nz/folder/43ogXDaL#Ns2yaQ0Kg2NO5kMx6XX6Q" },
      { title: "Microbiology", description: "Osmosis microbiology collection", url: "https://mega.nz/folder/uBYBSKQB#Uag8Dl5vg5pDeuPijul13Q" },
    ],
  },
  {
    id: "sketchy",
    title: "Sketchy",
    description: "Memorable visual stories for medical concepts",
    pillar: "watch",
    items: [
      { title: "All Sketchy Videos", description: "Complete sketchy collection", url: "https://mega.nz/folder/7hoGADpI#9C7d793EFcLOQVA2f640lg" },
    ],
  },
  {
    id: "pixorize",
    title: "Pixorize",
    description: "Visual mnemonics for biochemistry and more",
    pillar: "watch",
    items: [
      { title: "All Pixorize Videos", description: "Complete pixorize collection", url: "https://mega.nz/folder/tn8RgBaB#b2z3lE8UjaDDDATiyw70vg" },
    ],
  },
  {
    id: "bnb",
    title: "Boards & Beyond",
    description: "USMLE-focused video lectures by Dr. Ryan",
    pillar: "watch",
    items: [
      { title: "All BnB Videos", description: "Complete Boards & Beyond library", url: "https://mega.nz/folder/0gEUWIQa#YXx5OQDpLZx3BNW6Oh1UEw" },
      { title: "BnB via Telegram", description: "Telegram BnB resource link", url: "https://t.me/alahyaatedu743/5683" },
    ],
  },
  {
    id: "kaplan-videos",
    title: "Kaplan",
    description: "Kaplan video lectures for Gynecology and Obstetrics",
    pillar: "watch",
    items: [
      { title: "Kaplan Gynecology", description: "Kaplan Gyn video lectures", url: "https://mega.nz/folder/c6ZQDQ5J#2zy7mcXLkOlek6T-mhbGjw" },
      { title: "Kaplan Obstetrics", description: "Kaplan Obs video lectures", url: "https://mega.nz/folder/ojw2mRZD#Xh-YTykOUQNkr8US4ruyVg" },
    ],
  },
  {
    id: "kaplan-2-3",
    title: "Kaplan (2nd & 3rd Year)",
    description: "Kaplan resources for preclinical and clinical years",
    pillar: "watch",
    items: [
      { title: "Kaplan 2nd & 3rd Year", description: "Kaplan lectures for years 2-3", url: "https://mega.nz/folder/9uUBFSrL#Yu4Z_pncuHHZfs8C14_YRg" },
    ],
  },

  // ── Read ────────────────────────────────────────────
  {
    id: "medschoolbro",
    title: "MedSchoolBro Notes",
    description: "Comprehensive medical school notes",
    pillar: "read",
    items: [
      { title: "MedSchoolBro Notes", description: "Full notes collection", url: "https://drive.google.com/drive/mobile/folders/1t6l3R73FSCT1-93cYl_sNqv7XbYB5B5e/1_P9WIbkOzrn-57pZ27sJFG9jmE6K7n8" },
    ],
  },
  {
    id: "history-taking",
    title: "History Taking Notes",
    description: "Indian history taking templates and guides",
    pillar: "read",
    items: [
      { title: "History Taking Notes", description: "History taking templates", url: "https://drive.google.com/drive/mobile/folders/1HJhiX6VOmTXfEt5jqLYjKnGZ_td16SDz" },
    ],
  },
  {
    id: "textbooks",
    title: "All Textbooks",
    description: "Comprehensive collection of medical textbooks",
    pillar: "read",
    items: [
      { title: "All Textbooks", description: "Full textbook library", url: "https://drive.google.com/drive/folders/1cZRSLideXzQi6DhoyU0ZWhNBNrgrxjv" },
    ],
  },
  {
    id: "radiology",
    title: "Radiology",
    description: "Echo, ultrasound, and X-ray learning resources",
    pillar: "read",
    items: [
      { title: "Echo & Ultrasound (123 Sonography)", description: "Complete sonography course", url: "https://mega.nz/folder/3d8jQZxS#i3dkY2Tu4WtAr6eXLcgmUw" },
      { title: "GynObs Ultrasound (Gulfcoast)", description: "Ultrasound in gynecology and obstetrics", url: "https://mega.nz/folder/qY1gyBiS#oARu1ZYGoxIaE4OSDHS04g" },
      { title: "Echo Manual (4th Edition)", description: "Echocardiography reference", url: "https://mega.nz/folder/zIdCxDoB#YjmsZaw-sDqtKOgDsCukw" },
      { title: "X-ray (MedMastery)", description: "X-ray interpretation course", url: "https://mega.nz/folder/c8wUVSjR#f1My5RqPOqbRNlYzy_HQfA" },
    ],
  },

  // ── Practice ────────────────────────────────────────
  {
    id: "amboss",
    title: "AMBOSS Qbank",
    description: "Comprehensive question bank with detailed explanations",
    pillar: "practice",
    items: [
      { title: "AMBOSS Qbank (Mega)", description: "Full AMBOSS question bank", url: "https://mega.nz/folder/pvcQXAQZ#5MXca154HJAlYiK2ZFtiiQ" },
      { title: "AMBOSS Qbank (Telegram)", description: "Via Telegram channel", url: "https://t.me/alahyaatedu743/3886" },
    ],
  },
  {
    id: "uworld",
    title: "UWorld Qbank",
    description: "Gold-standard question bank for USMLE prep",
    pillar: "practice",
    items: [
      { title: "UWorld Qbank", description: "Full UWorld question bank", url: "https://mega.nz/folder/xEtQXK7J#HfNTWMox5dOAQxaniInurA" },
    ],
  },
  {
    id: "nbme",
    title: "NBME",
    description: "Official NBME practice exams and forms",
    pillar: "practice",
    items: [
      { title: "NBME Resources", description: "NBME practice forms via Telegram", url: "https://t.me/alahyaatedu743/2737" },
    ],
  },
  {
    id: "anking",
    title: "AnKing",
    description: "Premade Anki flashcards for USMLE",
    pillar: "practice",
    items: [
      { title: "AnKing Deck", description: "AnKing flashcard collection", url: "https://t.me/alahyaatedu743/2117" },
    ],
  },
  {
    id: "pathoma",
    title: "Pathoma",
    description: "Fundamentals of pathology by Dr. Sattar",
    pillar: "practice",
    items: [
      { title: "Pathoma Resources", description: "Full pathology collection", url: "https://mega.nz/folder/RvNnHJIB#WFc3hdJuEMtJiQKRRyjuVA" },
    ],
  },
  {
    id: "qbanks-bundle",
    title: "Qbanks Bundle",
    description: "Bundled question banks (UWorld, Kaplan, AMBOSS)",
    pillar: "practice",
    items: [
      { title: "All Qbanks Bundle", description: "UW, Kaplan, AMBOSS combined", url: "https://mega.nz/folder/wvN10Z5C#mexPnK8f6686SXwcdPrNnw" },
    ],
  },
  {
    id: "more-resources",
    title: "More Resources",
    description: "Additional USMLE and medical resources",
    pillar: "practice",
    items: [
      { title: "More Resources (Telegram)", description: "Telegram channel with additional resources", url: "https://t.me/alahyaatedu743" },
    ],
  },
];
