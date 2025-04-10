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
  disablePrevious: boolean;
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
  disablePrevious,
}: FlashcardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(null);
    setShowExplanation(false);
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
      } else if (diff < 0 && !isFirstCard && !disablePrevious) {
        // Swipe right
        onPrevious();
      }
    }

    setTouchStart(null);
  };

  const getOptionStyle = (option: string) => {
    if (!selectedOption) return 'bg-white text-gray-700 hover:bg-gray-50';
    if (option === selectedOption && option === correctAnswer) {
      return 'bg-green-100 text-green-700 border-green-500';
    }
    if (option === selectedOption) {
      return 'bg-red-100 text-red-700 border-red-500';
    }
    if (option === correctAnswer && selectedOption !== correctAnswer) {
      return 'bg-green-100 text-green-700 border-green-500';
    }
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

  if (!question || !options || !correctAnswer || !explanation) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mx-auto max-w-2xl">
        <p className="text-gray-600 text-center">Loading card...</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">
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
            {selectedOption === correctAnswer ? (
              <>
                <p className="text-lg font-medium text-green-600">
                  ✅ Correct!
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Explanation:</h3>
                  <p className="text-gray-600 text-sm md:text-base whitespace-pre-wrap">
                    {explanation}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-red-600">
                  ❌ Incorrect. The correct answer is highlighted in green.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Explanation:</h3>
                  <p className="text-gray-600 text-sm md:text-base whitespace-pre-wrap">
                    {explanation}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onPrevious}
            disabled={isFirstCard || disablePrevious}
            className={`px-4 py-2 rounded-lg ${
              isFirstCard || disablePrevious
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors text-sm md:text-base`}
          >
            ← Previous
          </button>
          {selectedOption && (
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm md:text-base"
            >
              {isLastCard ? 'Finish Quiz' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 