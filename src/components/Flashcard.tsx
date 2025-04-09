import { useState, useEffect, TouchEvent } from 'react';

interface FlashcardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  onNext: () => void;
  onPrevious: () => void;
  onCorrect: () => void;
  isFirstCard: boolean;
  isLastCard: boolean;
}

export default function Flashcard({
  question,
  options,
  correctAnswer,
  explanation,
  onNext,
  onPrevious,
  onCorrect,
  isFirstCard,
  isLastCard,
}: FlashcardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasViewedExplanation, setHasViewedExplanation] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setShowExplanation(false);
    setHasViewedExplanation(false);
  }, [question]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isLastCard) {
        // Swipe left
        onNext();
      } else if (diff < 0 && !isFirstCard) {
        // Swipe right
        onPrevious();
      }
    }

    setTouchStart(null);
  };

  const getOptionStyle = (option: string) => {
    if (!selectedOption) return 'bg-white text-gray-700 hover:bg-gray-50';
    if (option === correctAnswer) return 'bg-green-100 text-green-700 border-green-500';
    if (option === selectedOption) return 'bg-red-100 text-red-700 border-red-500';
    return 'bg-white text-gray-400';
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === correctAnswer) {
      onCorrect();
      setShowExplanation(true);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setHasViewedExplanation(false);
  };

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto perspective-1000"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`relative w-full transform transition-transform duration-500 ${
        showExplanation ? 'rotate-y-180' : ''
      } preserve-3d`}>
        {/* Front of card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            {question}
          </h2>
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={!!selectedOption}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors duration-200 ${getOptionStyle(
                  option
                )}`}
              >
                <span className="text-sm md:text-base">{option}</span>
              </button>
            ))}
          </div>
          {selectedOption && (
            <div className="mt-6 flex flex-col items-center space-y-4">
              {selectedOption === correctAnswer && (
                <p className="text-lg font-medium text-green-600">
                  ✅ Correct!
                </p>
              )}
              <button
                onClick={handleRetry}
                className="mt-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Back of card */}
        {showExplanation && (
          <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-6 md:p-8 backface-hidden rotate-y-180">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Explanation
            </h3>
            <p className="text-gray-600 text-sm md:text-base whitespace-pre-wrap">
              {explanation}
            </p>
            <button
              onClick={() => setShowExplanation(false)}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
            >
              Back to Question
            </button>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onPrevious}
          disabled={isFirstCard}
          className={`px-4 py-2 rounded-lg ${
            isFirstCard
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors text-sm md:text-base`}
        >
          ← Previous
        </button>
        {selectedOption === correctAnswer && hasViewedExplanation && !isLastCard && (
          <button
            onClick={onNext}
            className={`px-4 py-2 rounded-lg ${
              isLastCard
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors text-sm md:text-base`}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
} 