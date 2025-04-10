declare module "*.json" {
  const value: {
    flashcards: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  };
  export default value;
} 