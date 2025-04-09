import { useState } from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
  options: string[];
  explanation: string;
  onNext: () => void;
  onCorrect: () => void;
  onPrevious: () => void;
  isFirstCard: boolean;
  isLastCard: boolean;
}

export default function Flashcard({ 
  question, 
  answer, 
  options, 
  explanation, 
  onNext,
  onPrevious,
  isFirstCard,
  isLastCard,
  onCorrect
}: FlashcardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasViewedExplanation, setHasViewedExplanation] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (option === answer) {
      onCorrect();
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setHasViewedExplanation(false);
    onNext();
  };

  const handlePrevious = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setHasViewedExplanation(false);
    onPrevious();
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setHasViewedExplanation(false);
  };

  const handleAcknowledge = () => {
    setHasViewedExplanation(true);
    handleNext();
  };

  const getOptionStyle = (option: string) => {
    if (!selectedOption) return 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800';
    if (option === selectedOption && option === answer) return 'bg-green-100 border-green-500 text-green-800';
    if (option === selectedOption && option !== answer) return 'bg-red-100 border-red-500 text-red-800';
    return 'bg-white border-gray-200 text-gray-800';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{question}</h2>
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-3 rounded-lg text-left transition-colors border ${getOptionStyle(option)}`}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
            >
              {option}
            </button>
          ))}
        </div>
        {selectedOption && (
          <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
            selectedOption === answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {selectedOption === answer ? 'Correct! 🎉' : 'Incorrect 😕'}
            {selectedOption !== answer && (
              <button 
                className="ml-2 text-sm underline"
                onClick={handleRetry}
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Explanation Panel */}
      {showExplanation && (
        <div className="mt-4 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Explanation</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap">{explanation}</p>
          </div>
          {!hasViewedExplanation && (
            <button
              onClick={handleAcknowledge}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLastCard ? 'I Understand - Show Results' : 'I Understand - Continue to Next Question'}
            </button>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={isFirstCard}
          className={`px-4 py-2 rounded-lg ${
            isFirstCard
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={isLastCard || (showExplanation && !hasViewedExplanation)}
          className={`px-4 py-2 rounded-lg ${
            isLastCard || (showExplanation && !hasViewedExplanation)
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLastCard ? 'Finish Quiz' : 'Next →'}
        </button>
      </div>
    </div>
  );
} 