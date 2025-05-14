import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MoveRight,
  LucideMoveRight,
  MoveLeftIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Latex from "react-latex-next";
import { ExplanationText } from "@/types/learning";

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    image?: string;
    explanation: string | string[] | ExplanationText;
    type: "markdown" | "latex";
  };
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  // Build an array of paragraph strings
  let paragraphs: string[] = [];

  if (typeof content.explanation === "string") {
    try {
      const obj = JSON.parse(content.explanation) as ExplanationText;
      paragraphs = Object.values(obj)
        .filter((t) => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.replace(/\\n\\n/g, "\n\n"));
    } catch {
      paragraphs = content.explanation
        .replace(/\\n\\n/g, "\n\n")
        .split(/\n{2,}/g);
    }
  } else {
    paragraphs = Object.values(content.explanation)
      .filter((t) => typeof t === "string" && t.trim().length > 0)
      .map((t) => t.replace(/\\n\\n/g, "\n\n"));
  }

  const [currentIdx, setCurrentIdx] = useState(0);
  const total = paragraphs.length;
  const hasMultiple = total > 1;
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === total - 1;

  const handlePrev = () => {
    if (!isFirst) setCurrentIdx((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!isLast) setCurrentIdx((prev) => prev + 1);
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }
      `}
    >
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-2xl w-full sm:w-[400px] md:w-[500px] lg:w-[600px] overflow-hidden
          transform transition-all duration-500 ease-out
          ${
            isOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }
        `}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Sharraxaad</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative px-6 pb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100 text-black">
            {/* <AnimatePresence initial={false} exitBeforeEnter> */}
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="prose prose-sm max-w-none space-y-4 p-4"
            >
              {content.type === "latex" ? (
                <Latex>{paragraphs[currentIdx]}</Latex>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {paragraphs[currentIdx]}
                </ReactMarkdown>
              )}

              {content.image && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={content.image}
                    alt="Explanation visual"
                    width={400}
                    height={200}
                    className="rounded-lg max-h-32 object-contain"
                  />
                </div>
              )}
            </motion.div>
            {/* </AnimatePresence> */}

            {/* Controls (arrows + dots) */}
            {hasMultiple && (
              <div className="flex items-center justify-center mt-2 space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={isFirst}
                  className={`p-1 rounded-full transition-colors ${
                    isFirst
                      ? "text-gray-400"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <MoveLeftIcon className="w-4 h-4" />
                </button>

                <div className="flex space-x-2">
                  {paragraphs.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${
                        idx === currentIdx ? "bg-gray-800" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={isLast}
                  className={`p-1 rounded-full transition-colors ${
                    isLast ? "text-gray-400" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <LucideMoveRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
