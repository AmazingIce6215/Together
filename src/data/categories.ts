export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "romantic",
    name: "Romantic",
    description: "Love, memories, and what makes your relationship special",
    icon: "heart",
    color: "#FF6B9D",
  },
  {
    slug: "funny",
    name: "Funny",
    description: "Quirky habits, inside jokes, and laugh-out-loud moments",
    icon: "laugh",
    color: "#FFD93D",
  },
  {
    slug: "spicy",
    name: "Spicy",
    description: "Heat things up with bold questions and steamy confessions",
    icon: "flame",
    color: "#FF4757",
  },
  {
    slug: "trivia",
    name: "Trivia",
    description: "Test your knowledge with fun facts and brain-teasers",
    icon: "brain",
    color: "#6C5CE7",
  },
];
