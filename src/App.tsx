import { useState } from 'react'
import Flashcard from './components/Flashcard'
import { flashcards } from './data/flashcards'

function App() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [shuffledCards, setShuffledCards] = useState(flashcards)

  // Function to shuffle array
  const shuffleArray = (array: typeof flashcards) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleNext = () => {
    if (currentCardIndex === shuffledCards.length - 1) {
      setIsComplete(true)
    } else {
      setCurrentCardIndex(prevIndex => prevIndex + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentCardIndex(prev => Math.max(0, prev - 1))
  }

  const handleCorrectAnswer = () => {
    setScore(prevScore => prevScore + 1)
  }

  const resetQuiz = () => {
    setShuffledCards(shuffleArray(flashcards))
    setCurrentCardIndex(0)
    setScore(0)
    setIsComplete(false)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">
            Quiz Complete! 🎉
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Score</h2>
            <p className="text-4xl font-bold text-blue-600 mb-6">
              {score} / {shuffledCards.length}
            </p>
            <p className="text-gray-600 mb-6">
              {score === shuffledCards.length 
                ? "Perfect score! You're a GitHub Actions expert! 🎯"
                : score >= shuffledCards.length / 2
                ? "Good job! You're getting there! 👍"
                : "Keep practicing! You'll get better! 💪"}
            </p>
            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again with New Questions
              </button>
              <p className="text-sm text-gray-500">
                Questions will be shuffled for a fresh challenge!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          GitHub Actions Flashcards
        </h1>
        
        <div className="mb-8">
          <Flashcard 
            {...shuffledCards[currentCardIndex]} 
            onNext={handleNext}
            onCorrect={handleCorrectAnswer}
            onPrevious={handlePrevious}
            isFirstCard={currentCardIndex === 0}
            isLastCard={currentCardIndex === shuffledCards.length - 1}
          />
        </div>

        <div className="text-center text-gray-600">
          Card {currentCardIndex + 1} of {shuffledCards.length}
        </div>
      </div>
    </div>
  )
}

export default App
