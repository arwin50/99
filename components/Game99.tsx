"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WinnerModal from "@/components/winner-modal";

const deck = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Defining the GameState type which holds the game data
type GameState = {
  total: number; // The current total of the game
  aiHand: string[]; // The AI's current hand of cards
  playerHand: string[]; // The player's current hand of cards
  isAITurn: boolean; // Whether it's the AI's turn
};

// A helper function to get the numeric value of a card
const getCardValue = (card: string) => {
  if (!isNaN(Number.parseInt(card))) return Number.parseInt(card); // For numbers 2–10
  switch (card) {
    case "A":
      return 1; // Ace is worth 1
    case "J":
      return 11; // Jack is worth 11
    case "Q":
      return 12; // Queen is worth 12
    case "K":
      return 13; // King is worth 13
    default:
      return 0; // In case of unexpected cards
  }
};

// Minimax algorithm with alpha-beta pruning to determine the best move for AI
const minimax = (
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number => {
  if (state.total >= 99) {
    return isMaximizing ? -1 : 1; // If the total exceeds or equals 99, the game is over (AI loses if it's its turn)
  }

  const hand = isMaximizing ? state.aiHand : state.playerHand; // Determine whose turn it is

  if (hand.length === 0 || depth === 0) return 0; // If no cards left or depth limit reached, return 0

  let best = isMaximizing ? -Infinity : Infinity;

  // Loop over each card in the hand
  for (let card of hand) {
    const cardValue = getCardValue(card); // Get the card's value
    const newTotal = state.total + cardValue; // Calculate the new total

    if (newTotal > 99) continue; // Skip moves that would cause the total to exceed 99

    const newHand = hand.filter((c) => c !== card); // Remove the used card from the hand
    const nextState: GameState = {
      total: newTotal,
      aiHand: isMaximizing ? newHand : state.aiHand,
      playerHand: isMaximizing ? state.playerHand : newHand,
      isAITurn: !state.isAITurn, // Switch turns
    };

    const value = minimax(nextState, depth - 1, alpha, beta, !isMaximizing); // Recursively call minimax

    if (isMaximizing) {
      best = Math.max(best, value); // Maximize the score for the AI
      alpha = Math.max(alpha, value); // Alpha pruning
    } else {
      best = Math.min(best, value); // Minimize the score for the player
      beta = Math.min(beta, value); // Beta pruning
    }

    if (beta <= alpha) break; // Prune the branch if it’s no longer beneficial
  }

  return best; // Return the best score
};

// Function to get the best card for AI based on the minimax algorithm
const bestAIMove = (
  total: number,
  aiHand: string[],
  playerHand: string[],
  depth: number = 3
): string => {
  let bestScore = -Infinity;
  let bestCard = aiHand[0]; // Start by picking the first card

  // Loop over each card in the AI's hand
  for (let card of aiHand) {
    const cardValue = getCardValue(card);
    const newTotal = total + cardValue;

    if (newTotal > 99) continue; // Skip moves that would cause the total to exceed 99

    const newHand = aiHand.filter((c) => c !== card);
    const result = minimax(
      {
        total: newTotal,
        aiHand: newHand,
        playerHand,
        isAITurn: false,
      },
      depth,
      -Infinity,
      Infinity,
      false
    );

    if (result > bestScore) {
      bestScore = result;
      bestCard = card;
    }
  }

  return bestCard; // Return the best card for AI to play
};

export default function Game99() {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [aiHand, setAiHand] = useState<string[]>([]);
  const [playerPick, setPlayerPick] = useState<string | null>(null);
  const [aiPick, setAiPick] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<string[]>([]);

  // Function to draw random cards from the deck
  const drawRandomCards = (
    deck: string[],
    count: number,
    excludedCards: string[] = []
  ) => {
    const drawn = [];

    // Filter the deck to exclude already drawn cards
    const availableDeck = deck.filter((card) => !excludedCards.includes(card));

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableDeck.length);
      drawn.push(availableDeck[randomIndex]);
      availableDeck.splice(randomIndex, 1); // Remove drawn card from deck
    }

    return drawn;
  };

  // Function to handle the player's card pick
  const handleCardPick = (card: string) => {
    if (!isPlayerTurn || currentTotal >= 99) return; // Player can't pick if it's not their turn or game is over

    const value = getCardValue(card);
    const newTotal = currentTotal + value;

    if (newTotal >= 99) {
      setWinner("AI"); // AI wins if the total reaches or exceeds 99
      setIsGameOver(true);
      return;
    }

    setCurrentTotal(newTotal); // Update the total
    setPlayerPick(card); // Store the player's pick
    addToHistory(`You added ${card} (${value}), total: ${newTotal}`); // Add to game history

    // Update player's hand
    setPlayerHand((prev) => {
      const newHand = prev.filter((c) => c !== card);
      const replenished =
        newHand.length === 1
          ? [...newHand, ...drawRandomCards(deck, 2, [...newHand])] // Draw 2 new cards if only 1 card left
          : newHand;

      return replenished;
    });

    setIsPlayerTurn(false); // Switch turn to AI
  };

  // Reset the game to start over
  const resetGame = () => {
    setCurrentTotal(0);
    setPlayerHand(drawRandomCards(deck, 3));
    setAiHand(drawRandomCards(deck, 3));
    setIsPlayerTurn(true);
    setIsGameOver(false);
    setWinner(null);
    setGameHistory([]);
    setPlayerPick(null);
    setAiPick(null);
  };

  // Add game messages to the history
  const addToHistory = (message: string) => {
    setGameHistory((prev) => [message, ...prev].slice(0, 5)); // Keep only the last 5 moves in the history
  };

  // Initialize the game state when the component first loads
  useEffect(() => {
    const drawUniqueHand = (deck: string[], count: number) => {
      const tempDeck = [...deck];
      const hand = [];

      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * tempDeck.length);
        hand.push(tempDeck.splice(randomIndex, 1)[0]);
      }

      return hand;
    };

    const player = drawUniqueHand(deck, 3); // Draw 3 cards for the player
    const ai = drawUniqueHand(deck, 3); // Draw 3 cards for the AI
    setPlayerHand(player);
    setAiHand(ai);
  }, []);

  // Handle AI's turn using a timeout to simulate thinking
  useEffect(() => {
    if (!isPlayerTurn && aiHand.length > 0 && currentTotal < 99) {
      console.log(aiHand);
      const timer = setTimeout(() => {
        const card = bestAIMove(currentTotal, aiHand, playerHand);
        const value = getCardValue(card);
        const newTotal = currentTotal + value;

        if (newTotal >= 99) {
          setWinner("player"); // Player wins if AI exceeds or equals 99
          setIsGameOver(true);
          return;
        }

        setCurrentTotal(newTotal); // Update total
        setAiPick(card); // Store AI's pick
        addToHistory(`AI added ${card} (${value}), total: ${newTotal}`); // Add to history

        // Update AI's hand
        setAiHand((prev) => {
          const newHand = prev.filter((c) => c !== card);
          const replenished =
            newHand.length === 1
              ? [...newHand, ...drawRandomCards(deck, 2, [...newHand])] // Draw 2 new cards if only 1 card left
              : newHand;

          return replenished;
        });

        setIsPlayerTurn(true); // Switch turn to player
      }, 1000); // Delay for AI to think

      return () => clearTimeout(timer); // Clean up timeout
    }
  }, [isPlayerTurn, aiHand, playerHand, currentTotal]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {!isGameOver ? (
          <div className="p-8 w-full flex flex-col items-center gap-6 rounded-2xl bg-gradient-to-br from-indigo-800/40 to-purple-800/40 backdrop-blur-sm border border-indigo-700/50 shadow-2xl">
            {/* Game Title */}
            <div className="relative">
              <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                99
              </h1>
              <div className="absolute -top-4 -right-8 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transform rotate-12 shadow-lg border-2 border-white">
                <span className="text-white font-bold text-xl">MAX</span>
              </div>
            </div>

            {/* Turn Indicator */}
            <div
              className={`px-8 py-3 mb-2 rounded-full text-white font-bold text-xl shadow-lg border-2 ${
                isPlayerTurn
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 border-blue-300 animate-pulse"
                  : "bg-gradient-to-r from-red-600 to-red-400 border-red-300"
              }`}
            >
              {isPlayerTurn ? "Your Turn" : "AI's Turn"}
            </div>

            {/* Current Total */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-75"></div>
              <div className="relative bg-black/30 backdrop-blur-sm px-8 py-4 rounded-lg border border-indigo-400/50">
                <h2 className="font-bold text-3xl text-center">
                  Current Total:{" "}
                  <span className="text-yellow-300">{currentTotal}</span>
                </h2>
              </div>
            </div>

            {/* Player Hand */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <AnimatePresence>
                {playerHand.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleCardPick(card)}
                    whileHover={{
                      y: -15,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                    className={`relative w-40 h-56 rounded-xl shadow-xl cursor-pointer transform transition-all duration-300
                      ${
                        !isPlayerTurn
                          ? "opacity-50 pointer-events-none"
                          : "hover:border-yellow-400"
                      }`}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white to-gray-200 border-4 border-white overflow-hidden">
                      {/* Card Content */}
                      <div className="absolute top-2 left-2 text-2xl font-bold text-indigo-700">
                        {card}
                      </div>
                      <div className="absolute bottom-2 right-2 text-2xl font-bold text-indigo-700 transform rotate-180">
                        {card}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-extrabold text-indigo-600">
                          {card}
                        </span>
                      </div>

                      {/* Card Pattern */}
                      <div className="absolute inset-0 opacity-10 bg-pattern-diamonds"></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Game History */}
            <div className="w-full max-w-md bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/30">
              <h3 className="text-center font-semibold mb-2 text-indigo-200">
                Game History
              </h3>
              <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-300/10">
                {gameHistory.length > 0 ? (
                  gameHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-300 py-1 px-2 rounded bg-white/5"
                    >
                      {entry}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 text-center italic">
                    Game just started
                  </div>
                )}
              </div>
            </div>

            {/* Last Picks */}
            <div className="flex justify-center gap-8 mb-4">
              {playerPick && !isPlayerTurn && (
                <div className="px-4 py-2 bg-blue-600/30 backdrop-blur-sm rounded-lg border border-blue-400/50">
                  <p className="font-medium text-blue-200">
                    You picked:{" "}
                    <span className="text-white font-bold">{playerPick}</span>
                  </p>
                </div>
              )}
              {aiPick && isPlayerTurn && (
                <div className="px-4 py-2 bg-red-600/30 backdrop-blur-sm rounded-lg border border-red-400/50">
                  <p className="font-medium text-red-200">
                    AI picked:{" "}
                    <span className="text-white font-bold">{aiPick}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-amber-500/30 border-2 border-amber-300 transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              Reset Game
            </button>
          </div>
        ) : (
          <WinnerModal winner={winner || ""} resetGame={resetGame} />
        )}
      </div>
    </div>
  );
}
