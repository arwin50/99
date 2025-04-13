// pages/99game.tsx
"use client";

import React from "react";
import Game99 from "../components/Game99";
import HowToPlay from "../components/how-to-play";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"menu" | "game" | "howToPlay">(
    "menu"
  );

  const renderView = () => {
    switch (currentView) {
      case "game":
        return <Game99 />;
      case "howToPlay":
        return <HowToPlay onBack={() => setCurrentView("menu")} />;
      default:
        return (
          <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white flex flex-col items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md p-8 flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-indigo-800/40 to-purple-800/40 backdrop-blur-sm border border-indigo-700/50 shadow-2xl"
            >
              {/* Game Title */}
              <div className="relative">
                <motion.h1
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                >
                  99
                </motion.h1>
                <motion.div
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 12, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -top-4 -right-8 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transform shadow-lg border-2 border-white"
                >
                  <span className="text-white font-bold text-xl">MAX</span>
                </motion.div>
              </div>

              <p className="text-center text-lg text-indigo-200 mb-4">
                A strategic card game where every move counts!
              </p>

              {/* Menu Buttons */}
              <div className="flex flex-col w-full gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView("game")}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-amber-500/30 border-2 border-amber-300 transition-all duration-200"
                >
                  Start Game
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView("howToPlay")}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/30 border-2 border-blue-300 transition-all duration-200"
                >
                  How To Play
                </motion.button>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return renderView();
}
