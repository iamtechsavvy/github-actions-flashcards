import { useState, useEffect } from 'react'
import Flashcard from './components/Flashcard'
import flashcardsData from './data/flashcards.json'

interface Flashcard {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize with shuffled flashcards
    shuffleAndSetFlashcards()
  }, [])

  const shuffleAndSetFlashcards = () => {
    setIsLoading(true)
    const shuffled = [...flashcardsData.flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
    setCurrentCardIndex(0)
    setScore(0)
    setIsComplete(false)
    setIsLoading(false)
  }

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const handleCorrect = () => {
    setScore(score + 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mb-6">
              Your score: {score} out of {flashcards.length}
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {score === flashcards.length
                ? "Perfect score! 🎉"
                : score >= flashcards.length * 0.7
                ? "Great job! 🌟"
                : "Keep practicing! 💪"}
            </p>
            <button
              onClick={shuffleAndSetFlashcards}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              Try Again with New Questions
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentCardIndex]

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">No cards available</h2>
            <button
              onClick={shuffleAndSetFlashcards}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              Reload Cards
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GitHub Actions Flashcards</h1>
          <p className="mt-2 text-gray-600">
            Card {currentCardIndex + 1} of {flashcards.length}
          </p>
        </div>
        <Flashcard
          question={currentCard.question}
          options={currentCard.options}
          correctAnswer={currentCard.correctAnswer}
          explanation={currentCard.explanation}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCorrect={handleCorrect}
          isFirstCard={currentCardIndex === 0}
          isLastCard={currentCardIndex === flashcards.length - 1}
        />
      </div>
    </div>
  )
}

export default App
