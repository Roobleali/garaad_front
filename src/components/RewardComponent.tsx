"use client";

import type React from "react";

import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementCardProps {
  title?: string;
  subtitle?: string;
  points?: string;
  icon?: React.ReactNode;
  onContinue?: () => void;
  showConfetti?: boolean;
}

export default function RewardComponent({
  title = "Practice complete!",
  subtitle = "Great job finishing this exercise",
  points,
  icon = <CheckCircle className="h-6 w-6" />,
  onContinue,
  showConfetti = true,
}: AchievementCardProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      {/* <Card className="max-w-md w-full  overflow-hidden mx-auto"> */}
      <div className="relative">
        <div className="relative flex flex-col items-center text-center p-8 pt-12">
          {/* Achievement Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-green-400 rounded-xl blur-md opacity-30 scale-110" />
            <div className="relative bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-md">
              {icon}
            </div>

            {showConfetti && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -10, y: -10 }}
                  animate={{ opacity: 1, x: -20, y: -20 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute text-green-400"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10, y: -10 }}
                  animate={{ opacity: 1, x: 20, y: -20 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute text-green-400"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Achievement Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-500 mb-8">{subtitle}</p>
          </motion.div>

          {/* Points */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <div className="text-xs uppercase text-gray-400 tracking-wider mb-1">
              Total XP
            </div>
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold">{points}</span>
              <motion.span
                initial={{ rotate: -30, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-green-400 ml-1"
              >
                <Award className="h-5 w-5" />
              </motion.span>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-full"
          >
            <Button
              onClick={onContinue}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Continue
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
      {/* </Card> */}
    </div>
  );
}
