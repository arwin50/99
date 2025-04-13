"use client"

import { motion } from "framer-motion"

interface HowToPlayProps {
  onBack: () => void
}

export default function HowToPlay({ onBack }: HowToPlayProps) {
  const rules = [
    {
      title: "Objective",
      content:
        "The goal is to make your opponent exceed the total of 99. If you reach or exceed 99 on your turn, you lose!",
    },
    {
      title: "Setup",
      content: "Each player starts with 3 cards drawn from a standard deck (A, 2-10, J, Q, K).",
    },
    {
      title: "Card Values",
      content: "A = 1, 2-10 = face value, J = 11, Q = 12, K = 13",
    },
    {
      title: "Gameplay",
      content:
        "Players take turns adding one card to the running total. After playing a card, you draw a new card if you have fewer than 3 cards in your hand.",
    },
    {
      title: "Strategy",
      content: "Plan your moves carefully! Try to force your opponent into a position where they must exceed 99.",
    },
    {
      title: "AI Opponent",
      content: "The AI uses a minimax algorithm to make optimal decisions, making it a challenging opponent.",
    },
  ]

  const examples = [
    {
      scenario: "Current total is 85",
      move: "Playing a 10 would make the total 95, leaving your opponent in a difficult position.",
    },
    {
      scenario: "Current total is 90",
      move: "Playing a 9 would make the total 99, forcing your opponent to exceed the limit and lose.",
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-8 rounded-2xl bg-gradient-to-br from-indigo-800/40 to-purple-800/40 backdrop-blur-sm border border-indigo-700/50 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
            How To Play
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-blue-500/30 border border-blue-300 transition-all duration-200"
          >
            Back to Menu
          </motion.button>
        </div>

        <div className="space-y-6">
          {/* Game Rules */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-200">Game Rules</h2>
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/30"
                >
                  <h3 className="text-xl font-medium text-yellow-300 mb-2">{rule.title}</h3>
                  <p className="text-indigo-100">{rule.content}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Strategy Examples */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-200">Strategy Examples</h2>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (rules.length + index) * 0.1, duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/30"
                >
                  <h3 className="text-xl font-medium text-yellow-300 mb-2">Example {index + 1}</h3>
                  <p className="text-indigo-100 mb-2">
                    <strong>Scenario:</strong> {example.scenario}
                  </p>
                  <p className="text-indigo-100">
                    <strong>Strategic Move:</strong> {example.move}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-200">Pro Tips</h2>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (rules.length + examples.length) * 0.1, duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/30"
            >
              <ul className="list-disc list-inside space-y-2 text-indigo-100">
                <li>Pay attention to your opponent's hand size to anticipate their options</li>
                <li>Try to keep cards that can get you to exactly 99</li>
                <li>
                  When possible, try to keep the total at a number that makes it difficult for your opponent to play
                  safely
                </li>
                <li>Remember that the AI uses advanced strategy, so think several moves ahead</li>
              </ul>
            </motion.div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
