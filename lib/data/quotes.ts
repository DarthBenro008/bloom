/**
 * Curated motivational quotes for the Bloom app
 * Focused on themes: growth, productivity, gardening, progress, and starting tasks
 */

export interface Quote {
  text: string;
  author: string;
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "What you plant now, you will harvest later.",
    author: "Og Mandino"
  },
  {
    text: "Small daily improvements lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    text: "Progress is progress, no matter how small.",
    author: "Unknown"
  },
  {
    text: "A garden requires patient labor and attention. Plants do not grow merely to satisfy ambitions or to fulfill good intentions. They thrive because someone expended effort on them.",
    author: "Liberty Hyde Bailey"
  },
  {
    text: "To plant a garden is to believe in tomorrow.",
    author: "Audrey Hepburn"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Growth is never by mere chance; it is the result of forces working together.",
    author: "James Cash Penney"
  },
  {
    text: "A little progress each day adds up to big results.",
    author: "Satya Nani"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "Gardens are not made by singing 'Oh, how beautiful!' and sitting in the shade.",
    author: "Rudyard Kipling"
  },
  {
    text: "Patience is not simply the ability to wait - it's how we behave while we're waiting.",
    author: "Joyce Meyer"
  }
];

/**
 * Get a random motivational quote
 */
export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
}

/**
 * Get a daily quote (same quote for the entire day based on date)
 */
export function getDailyQuote(): Quote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}
