"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WinnerModal from "@/components/winner-modal";

const deck = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

type GameState = {
  total: number;
  aiHand: string[];
  playerHand: string[];
  isAITurn: boolean;
};

const getCardValue = (card: string) => {
  if (!isNaN(Number.parseInt(card))) return Number.parseInt(card); // 2–10
  switch (card) {
    case "A":
      return 1;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    default:
      return 0;
  }
};

const minimax = (
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number => {
  if (state.total >= 99) {
    return isMaximizing ? -1 : 1; // AI loses if it's its turn
  }

  const hand = isMaximizing ? state.aiHand : state.playerHand;

  if (hand.length === 0 || depth === 0) return 0;

  let best = isMaximizing ? -Infinity : Infinity;

  for (let card of hand) {
    const cardValue = getCardValue(card);
    const newTotal = state.total + cardValue;

    if (newTotal > 99) continue;

    const newHand = hand.filter((c) => c !== card);
    const nextState: GameState = {
      total: newTotal,
      aiHand: isMaximizing ? newHand : state.aiHand,
      playerHand: isMaximizing ? state.playerHand : newHand,
      isAITurn: !state.isAITurn,
    };

    const value = minimax(nextState, depth - 1, alpha, beta, !isMaximizing);

    if (isMaximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, value);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, value);
    }

    if (beta <= alpha) break; // Prune
  }

  return best;
};

const bestAIMove = (
  total: number,
  aiHand: string[],
  playerHand: string[],
  depth: number = 3
): string => {
  let bestScore = -Infinity;
  let bestCard = aiHand[0];

  for (let card of aiHand) {
    const cardValue = getCardValue(card);
    const newTotal = total + cardValue;

    if (newTotal > 99) continue;

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

  return bestCard;
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

  const drawRandomCards = (
    deck: string[],
    count: number,
    excludedCards: string[] = []
  ) => {
    const drawn = [];

    // Filter the deck to remove cards that are in the excludedCards array
    const availableDeck = deck.filter((card) => !excludedCards.includes(card));

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableDeck.length);
      drawn.push(availableDeck[randomIndex]);
      // Optionally, you can remove the card from availableDeck to avoid drawing duplicates
      availableDeck.splice(randomIndex, 1);
    }

    return drawn;
  };

  const handleCardPick = (card: string) => {
    if (!isPlayerTurn || currentTotal >= 99) return;

    const value = getCardValue(card);
    const newTotal = currentTotal + value;

    if (newTotal >= 99) {
      setWinner("AI"); // AI wins
      setIsGameOver(true);
      return;
    }

    setCurrentTotal(newTotal);
    setPlayerPick(card);
    addToHistory(`You added ${card} (${value}), total: ${newTotal}`);

    setPlayerHand((prev) => {
      const newHand = prev.filter((c) => c !== card);
      const replenished =
        newHand.length === 1
          ? [
              ...newHand,
              ...drawRandomCards(deck, 2, [...newHand]), // Exclude Player's current cards from being drawn
            ]
          : newHand;

      return replenished;
    });

    setIsPlayerTurn(false);
  };

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

  const addToHistory = (message: string) => {
    setGameHistory((prev) => [message, ...prev].slice(0, 5));
  };

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

    const player = drawUniqueHand(deck, 3);
    const ai = drawUniqueHand(deck, 3);
    setPlayerHand(player);
    setAiHand(ai);
  }, []);

  useEffect(() => {
    if (!isPlayerTurn && aiHand.length > 0 && currentTotal < 99) {
      const timer = setTimeout(() => {
        const card = bestAIMove(currentTotal, aiHand, playerHand);
        const value = getCardValue(card);
        const newTotal = currentTotal + value;

        if (newTotal >= 99) {
          setWinner("player"); // Player wins
          setIsGameOver(true);
          return;
        }

        setCurrentTotal(newTotal);
        setAiPick(card);
        addToHistory(`AI added ${card} (${value}), total: ${newTotal}`);

        setAiHand((prev) => {
          const newHand = prev.filter((c) => c !== card);
          const replenished =
            newHand.length === 1
              ? [...newHand, ...drawRandomCards(deck, 2, [...newHand])]
              : newHand;

          return replenished;
        });

        setIsPlayerTurn(true);
      }, 1000);

      return () => clearTimeout(timer);
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
