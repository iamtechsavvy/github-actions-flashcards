import { useState } from 'react'
<<<<<<< HEAD
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
=======

interface TicketDetails {
  summary: string;
  description: string;
  acceptanceCriteria: string[];
  technicalDetails: string;
  dependencies: string;
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
}

function App() {
  const [ticketDetails, setTicketDetails] = useState<TicketDetails>({
    summary: 'Implement user authentication system',
    description: 'Create a secure authentication system with email/password login, social login options, and password reset functionality',
    acceptanceCriteria: [
      'User should be able to register with email and password',
      'User should be able to login with social media accounts',
      'Password reset functionality should work via email',
      'Session should persist across page refreshes',
      'Error messages should be user-friendly'
    ],
    technicalDetails: 'Use JWT for authentication, implement OAuth2 for social login, and use bcrypt for password hashing',
    dependencies: 'Backend API, User database, Email service',
    priority: 'High',
    storyPoints: 5
  });

  const [generatedTickets, setGeneratedTickets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jiraTickets, setJiraTickets] = useState<{ key: string; url: string }[]>([]);

  const handleInputChange = (field: keyof TicketDetails, value: string | number) => {
    setTicketDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAcceptanceCriteriaChange = (index: number, value: string) => {
    const newCriteria = [...ticketDetails.acceptanceCriteria];
    newCriteria[index] = value;
    setTicketDetails(prev => ({
      ...prev,
      acceptanceCriteria: newCriteria
    }));
  };

  const addAcceptanceCriteria = () => {
    setTicketDetails(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }));
  };

  const createMockTicket = async (ticket: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/jira/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          summary: ticket,
          description: ticketDetails.description,
          acceptanceCriteria: ticketDetails.acceptanceCriteria,
          technicalDetails: ticketDetails.technicalDetails,
          dependencies: ticketDetails.dependencies,
          priority: ticketDetails.priority,
          storyPoints: ticketDetails.storyPoints
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create mock ticket');
      }

      const data = await response.json();
      return data.key;
    } catch (error) {
      console.error('Error creating mock ticket:', error);
      throw error;
    }
  };

  const generateTickets = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedTickets([]);
    setJiraTickets([]);

    try {
      // Generate content using OpenAI
      const prompt = `Create a detailed JIRA ticket with the following information:
Summary: ${ticketDetails.summary}
Description: ${ticketDetails.description}
Acceptance Criteria: ${ticketDetails.acceptanceCriteria.join('\n')}
Technical Details: ${ticketDetails.technicalDetails}
Dependencies: ${ticketDetails.dependencies}
Priority: ${ticketDetails.priority}
Story Points: ${ticketDetails.storyPoints}`;

      const response = await fetch('http://localhost:3001/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const generatedContent = data.content;

      // Create JIRA ticket
      const jiraResponse = await fetch('http://localhost:3001/api/jira/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: ticketDetails.summary,
          description: generatedContent,
          priority: { name: ticketDetails.priority },
          storyPoints: ticketDetails.storyPoints,
        }),
      });

      if (!jiraResponse.ok) {
        throw new Error('Failed to create JIRA ticket');
      }

      const jiraTicket = await jiraResponse.json();
      setGeneratedTickets([generatedContent]);
      setJiraTickets([jiraTicket]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            JIRA Ticket Generator
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create detailed JIRA tickets with AI assistance
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brief Summary
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={ticketDetails.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter a brief summary"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Detailed Description
              </label>
              <div className="mt-1">
                <textarea
                  value={ticketDetails.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[120px]"
                  placeholder="Provide more details"
                />
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Acceptance Criteria
              </label>
              <div className="mt-1 space-y-2">
                {ticketDetails.acceptanceCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-md flex items-center justify-center border border-gray-300">
                      <span className="text-gray-500 text-sm">{index + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={criteria}
                      onChange={(e) => handleAcceptanceCriteriaChange(index, e.target.value)}
                      className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={`Criterion ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addAcceptanceCriteria}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Criterion
              </button>
            </div>

            {/* Technical Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Technical Details
              </label>
              <div className="mt-1">
                <textarea
                  value={ticketDetails.technicalDetails}
                  onChange={(e) => handleInputChange('technicalDetails', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[100px]"
                  placeholder="Technical implementation details"
                />
              </div>
            </div>

            {/* Dependencies */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dependencies
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={ticketDetails.dependencies}
                  onChange={(e) => handleInputChange('dependencies', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="List dependencies"
                />
              </div>
            </div>

            {/* Priority and Story Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-1">
                  <select
                    value={ticketDetails.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value as TicketDetails['priority'])}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Story Points
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    value={ticketDetails.storyPoints}
                    onChange={(e) => handleInputChange('storyPoints', parseInt(e.target.value))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="1"
                    max="13"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={generateTickets}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Tickets</span>
                  </div>
                )}
              </button>
>>>>>>> cf0a4d45e91addaa8a6f32eb20bf3cb93c5f3736
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
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
=======

      {generatedTickets.length > 0 && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Generated Tickets
            </h2>
            <div className="space-y-4">
              {generatedTickets.map((ticket, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center border border-gray-300">
                      <span className="text-gray-500 text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{ticket}</p>
                      {jiraTickets[index] && (
                        <a
                          href={jiraTickets[index].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                        >
                          <span>View in JIRA ({jiraTickets[index].key})</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
>>>>>>> cf0a4d45e91addaa8a6f32eb20bf3cb93c5f3736
