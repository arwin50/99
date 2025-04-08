"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";

export default function WinnerModal({
  winner,
  resetGame,
}: {
  winner: string;
  resetGame: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  // Function to reset the game
  const playAgain = () => {
    setIsVisible(false);
    // Reset the game state
    setTimeout(() => {
      resetGame(); // Call the resetGame function passed from the parent
      setIsVisible(true);
    }, 1000); // Add a delay before resetting the game
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      {/* Game background (placeholder) */}
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>

      {/* Modal */}
      {isVisible && (
        <div className="relative z-10">
          {/* Confetti elements */}
          <div className="absolute -top-10 -left-10 w-4 h-12 bg-yellow-400 rotate-45 animate-bounce"></div>
          <div className="absolute -top-8 left-10 w-3 h-8 bg-purple-500 rotate-12 animate-bounce delay-100"></div>
          <div className="absolute -top-12 right-10 w-4 h-10 bg-green-400 -rotate-45 animate-bounce delay-200"></div>
          <div className="absolute -top-10 -right-5 w-3 h-8 bg-pink-500 -rotate-12 animate-bounce delay-300"></div>

          {/* Modal container */}
          <div className="w-80 md:w-96 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-2xl overflow-hidden">
            {/* Trophy header */}
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 p-6 flex justify-center">
              <div className="bg-yellow-300 rounded-full p-4 shadow-inner">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                Congratulations!
              </div>
              <div className="text-3xl font-extrabold text-amber-600 mb-6 capitalize">
                {winner} Wins!
              </div>

              {/* Play again button */}
              <button
                onClick={playAgain}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center"
              >
                Play Again
              </button>
            </div>

            {/* Bottom decoration */}
            <div className="h-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500"></div>
          </div>

          {/* More confetti elements */}
          <div className="absolute -bottom-10 -left-8 w-3 h-10 bg-blue-400 rotate-45 animate-bounce delay-150"></div>
          <div className="absolute -bottom-8 left-12 w-4 h-8 bg-red-500 rotate-12 animate-bounce delay-250"></div>
          <div className="absolute -bottom-12 right-8 w-3 h-10 bg-teal-400 -rotate-45 animate-bounce delay-200"></div>
          <div className="absolute -bottom-10 -right-8 w-4 h-8 bg-indigo-500 -rotate-12 animate-bounce delay-300"></div>
        </div>
      )}
    </div>
  );
}
