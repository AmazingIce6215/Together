export type QuestionType = "multiple_choice" | "would_you_rather" | "open_ended";

export interface Question {
  id: string;
  category: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correct_answer?: string | null;
}

export const QUESTIONS: Question[] = [
  // ── Romantic ─────────────────────────────────────
  {
    id: "r001",
    category: "romantic",
    type: "multiple_choice",
    question: "What is your partner's love language?",
    options: [
      "Words of affirmation",
      "Physical touch",
      "Quality time",
      "Acts of service",
      "Receiving gifts",
    ],
  },
  {
    id: "r002",
    category: "romantic",
    type: "multiple_choice",
    question: "What was the best date you've ever had together?",
    options: [
      "Our first date",
      "A fancy dinner out",
      "A cozy night in",
      "A spontaneous trip",
      "A simple walk/hike",
    ],
  },
  {
    id: "r003",
    category: "romantic",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Cuddle all night and watch movies", "Have a deep conversation until dawn"],
  },
  {
    id: "r004",
    category: "romantic",
    type: "open_ended",
    question: "Describe the moment you knew this relationship was special.",
  },
  {
    id: "r005",
    category: "romantic",
    type: "multiple_choice",
    question: "What makes your partner feel most appreciated?",
    options: ["Surprise gestures", "Verbal praise", "Quality time", "Physical affection", "Thoughtful gifts"],
  },
  {
    id: "r006",
    category: "romantic",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Plan a surprise weekend getaway", "Recreate your first date exactly"],
  },
  {
    id: "r007",
    category: "romantic",
    type: "open_ended",
    question: "What is a small thing your partner does that always makes you smile?",
  },
  {
    id: "r008",
    category: "romantic",
    type: "multiple_choice",
    question: "How do you prefer to say 'I love you' without words?",
    options: ["A long hug", "Making their favorite meal", "Leaving a sweet note", "Doing a chore for them", "A surprise gift"],
  },

  // ── Funny ────────────────────────────────────────
  {
    id: "f001",
    category: "funny",
    type: "multiple_choice",
    question: "What is your partner's most annoying but secretly adorable habit?",
    options: [
      "Leaving dishes in the sink",
      "Stealing the blankets at night",
      "Singing off-key in the shower",
      "Talking to pets/plants",
      "Taking forever to get ready",
    ],
  },
  {
    id: "f002",
    category: "funny",
    type: "open_ended",
    question: "What's the funniest misunderstanding you've ever had with your partner?",
  },
  {
    id: "f003",
    category: "funny",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Have your partner tell your most embarrassing story at a party", "Have them imitate you in front of your friends"],
  },
  {
    id: "f004",
    category: "funny",
    type: "multiple_choice",
    question: "What weird food combination does your partner secretly enjoy?",
    options: [
      "Pineapple on pizza",
      "Fries dipped in ice cream",
      "Pickles and peanut butter",
      "Ketchup on everything",
      "Mixing sweet and salty randomly",
    ],
  },
  {
    id: "f005",
    category: "funny",
    type: "open_ended",
    question: "What inside joke never fails to make you both laugh?",
  },
  {
    id: "f006",
    category: "funny",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Be stuck in an elevator with your partner for 6 hours", "Have them be your only conversation partner for a week straight"],
  },
  {
    id: "f007",
    category: "funny",
    type: "multiple_choice",
    question: "Who is more likely to cry during a movie?",
    options: ["Me", "My partner", "Neither — we're both tough", "Both of us!"],
  },
  {
    id: "f008",
    category: "funny",
    type: "open_ended",
    question: "What's the worst date idea your partner has ever suggested?",
  },

  // ── Spicy ────────────────────────────────────────
  {
    id: "s001",
    category: "spicy",
    type: "multiple_choice",
    question: "What type of date makes your partner feel most connected?",
    options: [
      "A candlelit dinner at home",
      "Dancing together",
      "A long drive with good music",
      "Cuddling under the stars",
      "A cozy night with wine",
    ],
  },
  {
    id: "s002",
    category: "spicy",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Slow and intimate", "Quick and spontaneous"],
  },
  {
    id: "s003",
    category: "spicy",
    type: "open_ended",
    question: "What's one thing you wish your partner would do more often?",
  },
  {
    id: "s004",
    category: "spicy",
    type: "multiple_choice",
    question: "What makes your partner feel most desired?",
    options: [
      "Compliments about their appearance",
      "Physical touch throughout the day",
      "Undivided attention",
      "Surprise romantic gestures",
      "Flirty texts",
    ],
  },
  {
    id: "s005",
    category: "spicy",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Be teased playfully all day", "Receive romantic compliments all day"],
  },
  {
    id: "s006",
    category: "spicy",
    type: "open_ended",
    question: "What is your favorite physical feature of your partner?",
  },
  {
    id: "s007",
    category: "spicy",
    type: "multiple_choice",
    question: "What's the best way to set the mood?",
    options: [
      "Music and candles",
      "A shared shower",
      "A deep conversation first",
      "Surprise initiation",
      "A relaxing massage",
    ],
  },
  {
    id: "s008",
    category: "spicy",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Be surprised in the morning", "Plan something special for the evening"],
  },

  // ── Trivia (seeded examples; AI generates more on demand) ──
  {
    id: "t001",
    category: "trivia",
    type: "multiple_choice",
    question: "What planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct_answer: "Mars",
  },
  {
    id: "t002",
    category: "trivia",
    type: "multiple_choice",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct_answer: "Pacific",
  },
  {
    id: "t003",
    category: "trivia",
    type: "multiple_choice",
    question: "What year did the Berlin Wall fall?",
    options: ["1987", "1989", "1991", "1985"],
    correct_answer: "1989",
  },
  {
    id: "t004",
    category: "trivia",
    type: "multiple_choice",
    question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],
    correct_answer: "Leonardo da Vinci",
  },
  {
    id: "t005",
    category: "trivia",
    type: "multiple_choice",
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct_answer: "Au",
  },
  {
    id: "t006",
    category: "trivia",
    type: "multiple_choice",
    question: "Which animal is the fastest on land?",
    options: ["Lion", "Cheetah", "Gazelle", "Horse"],
    correct_answer: "Cheetah",
  },
  {
    id: "t007",
    category: "trivia",
    type: "multiple_choice",
    question: "How many bones are in the human body?",
    options: ["106", "206", "306", "406"],
    correct_answer: "206",
  },
  {
    id: "t008",
    category: "trivia",
    type: "multiple_choice",
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Bangkok", "Tokyo"],
    correct_answer: "Tokyo",
  },
];

export function getQuestionsForCategory(category: string): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}
