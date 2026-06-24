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
  {
    id: "r009",
    category: "romantic",
    type: "multiple_choice",
    question: "What's your partner's favorite way to spend a Sunday?",
    options: ["Sleeping in", "Going on an adventure", "Cooking together", "Watching movies in bed", "Seeing friends"],
  },
  {
    id: "r010",
    category: "romantic",
    type: "multiple_choice",
    question: "What song reminds your partner most of you?",
    options: ["A slow love song", "Our song", "Something upbeat", "A throwback hit", "They don't have one"],
  },
  {
    id: "r011",
    category: "romantic",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Write each other love letters", "Record voice notes for each other"],
  },
  {
    id: "r012",
    category: "romantic",
    type: "open_ended",
    question: "What's a promise you want to make to your partner today?",
  },
  {
    id: "r013",
    category: "romantic",
    type: "multiple_choice",
    question: "What kind of vacation does your partner dream about?",
    options: ["Beach getaway", "Mountain cabin", "European city tour", "Road trip across the country", "Tropical island resort"],
  },
  {
    id: "r014",
    category: "romantic",
    type: "multiple_choice",
    question: "How does your partner most often show they love you?",
    options: ["Through acts of service", "By spending time with you", "With words of encouragement", "By being physically affectionate", "With thoughtful surprises"],
  },
  {
    id: "r015",
    category: "romantic",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Relive your favorite memory together", "Create a brand new memory"],
  },
  {
    id: "r016",
    category: "romantic",
    type: "multiple_choice",
    question: "What's the most romantic gesture your partner has ever done?",
    options: ["A surprise date", "A heartfelt gift", "A thoughtful note", "A public declaration", "A trip they planned"],
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
  {
    id: "f009",
    category: "funny",
    type: "multiple_choice",
    question: "If your partner were a reality TV star, what show would they be on?",
    options: ["A cooking competition", "A dating show (ironically)", "A survival challenge", "A home renovation show", "A talk show"],
  },
  {
    id: "f010",
    category: "funny",
    type: "multiple_choice",
    question: "What's the most ridiculous thing your partner has googled?",
    options: ["How to fold a fitted sheet", "Can fish drown", "Why is the sky blue (again)", "How to talk to squirrels", "Random celebrity heights"],
  },
  {
    id: "f011",
    category: "funny",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Have your partner's browser history made public", "Have your own browser history made public"],
  },
  {
    id: "f012",
    category: "funny",
    type: "open_ended",
    question: "Describe your partner's 'guilty pleasure' in one sentence.",
  },
  {
    id: "f013",
    category: "funny",
    type: "multiple_choice",
    question: "What's your partner's go-to karaoke song?",
    options: ["A power ballad", "A 90s throwback", "Something no one knows", "A rap song (badly)", "They refuse to sing"],
  },
  {
    id: "f014",
    category: "funny",
    type: "multiple_choice",
    question: "How does your partner react when they get startled?",
    options: ["A dramatic scream", "A jump and laugh", "They throw something", "They pretend it didn't happen", "They get annoyed"],
  },
  {
    id: "f015",
    category: "funny",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Have your partner set your morning alarm for a month", "Have them pick your outfit every day for a month"],
  },
  {
    id: "f016",
    category: "funny",
    type: "multiple_choice",
    question: "What would your partner's 'dad joke' specialty be?",
    options: ["Puns about food", "Terrible wordplay", "Knock-knock jokes", "One-liners that flop", "They'd deny telling jokes at all"],
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
  {
    id: "s009",
    category: "spicy",
    type: "multiple_choice",
    question: "What does your partner find most attractive about you?",
    options: ["Your smile", "Your sense of humor", "Your confidence", "Your eyes", "Your kindness"],
  },
  {
    id: "s010",
    category: "spicy",
    type: "multiple_choice",
    question: "What's your partner's favorite way to unwind after a long day?",
    options: ["A hot shower", "Cuddling in silence", "Talking about their day", "Listening to music", "A glass of wine together"],
  },
  {
    id: "s011",
    category: "spicy",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Send something flirty during the day", "Save it all for when you're together"],
  },
  {
    id: "s012",
    category: "spicy",
    type: "open_ended",
    question: "What's something you've always wanted to tell your partner but haven't?",
  },
  {
    id: "s013",
    category: "spicy",
    type: "multiple_choice",
    question: "Where does your partner love being kissed most?",
    options: ["On the lips", "On the neck", "On the forehead", "On the cheek", "On the hand"],
  },
  {
    id: "s014",
    category: "spicy",
    type: "multiple_choice",
    question: "What's the most attractive outfit your partner loves seeing you in?",
    options: ["Something casual and cozy", "Something elegant and dressed up", "Something fitted and bold", "Pajamas / loungewear", "A specific color they love on you"],
  },
  {
    id: "s015",
    category: "spicy",
    type: "would_you_rather",
    question: "Would you rather...",
    options: ["Be told exactly what your partner wants", "Have them show you without words"],
  },
  {
    id: "s016",
    category: "spicy",
    type: "multiple_choice",
    question: "What time of day does your partner feel most romantic?",
    options: ["Early morning", "Afternoon", "Evening / sunset", "Late night", "Spontaneously — any time"],
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestionsForCategory(
  category: string,
  mode?: "solo" | "versus"
): Question[] {
  const catQuestions = QUESTIONS.filter((q) => q.category === category);

  if (mode === "solo") {
    // Solo mode: only multiple_choice
    const mcOnly = catQuestions.filter((q) => q.type === "multiple_choice");
    return shuffle(mcOnly);
  }

  // Versus mode: include all types
  return shuffle(catQuestions);
}
