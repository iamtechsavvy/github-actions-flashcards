export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  options: string[];
  explanation: string;
}

export const flashcards: Flashcard[] = [
  {
    id: 1,
    question: "What is the purpose of a GitHub Actions workflow file?",
    answer: "To define automated processes that run in response to specific events",
    options: [
      "To define automated processes that run in response to specific events",
      "To store GitHub repository settings",
      "To manage user permissions",
      "To track code changes"
    ],
    explanation: "A GitHub Actions workflow file (typically .yml or .yaml) defines automated processes that run in response to specific events in your repository. It contains the steps that GitHub Actions should execute when triggered by events like pushes, pull requests, or scheduled times."
  },
  {
    id: 2,
    question: "Which of these is NOT a valid GitHub Actions event trigger?",
    answer: "git commit",
    options: [
      "push",
      "pull_request",
      "git commit",
      "schedule"
    ],
    explanation: "While 'git commit' is a Git command, it's not a valid GitHub Actions event trigger. The valid event triggers include push, pull_request, schedule, workflow_dispatch, and many others. GitHub Actions responds to repository events, not individual Git commands."
  },
  {
    id: 3,
    question: "What is the purpose of GitHub Actions secrets?",
    answer: "To securely store sensitive information like API keys and passwords",
    options: [
      "To store public configuration values",
      "To track user activity",
      "To securely store sensitive information like API keys and passwords",
      "To manage repository access"
    ],
    explanation: "GitHub Actions secrets are encrypted environment variables that you can use to store sensitive information like API keys, passwords, or tokens. They are not visible in the workflow logs and are securely stored in your repository settings."
  }
]; 