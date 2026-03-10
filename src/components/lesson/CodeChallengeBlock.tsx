"use client";

/**
 * Code challenge block for question_type === 'code'.
 * Expects Problem.content (JSONField) with:
 *   starter_code, function_name, language, test_cases (args, expected, label?, hint?).
 * Set Problem.correct_answer to "passed" (or [{"text": "passed"}]) so the
 * lesson progression marks the challenge complete when all tests pass.
 */
import React, { useState, useCallback } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "./CodeEditor";
import { TestResults } from "./TestResults";
import { runCode, evaluateResults } from "@/lib/codeRunner";
import type { TestCase, TestResult } from "@/lib/codeRunner";
import { cn } from "@/lib/utils";

export interface CodeChallengeBlockProps {
  questionText: string;
  explanation: string;
  starterCode: string;
  functionName: string;
  language: string;
  testCases: TestCase[];
  onCorrect: () => void;
  onIncorrect: () => void;
}

const DEFAULT_STARTER = `function solution() {\n  // Halkan code-kaaga ku qor\n  \n}`;

export function CodeChallengeBlock({
  questionText,
  explanation,
  starterCode = DEFAULT_STARTER,
  functionName = "solution",
  language = "javascript",
  testCases,
  onCorrect,
  onIncorrect,
}: CodeChallengeBlockProps) {
  const [code, setCode] = useState(starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [allPassed, setAllPassed] = useState(false);

  const hintFromStarter = starterCode.includes("//")
    ? starterCode
        .split("\n")
        .find((line) => line.trim().startsWith("//"))
        ?.replace(/^\s*\/\/\s*/, "")
    : null;

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setHasRun(true);
    try {
      const runResults = await runCode(
        code,
        functionName,
        testCases.map((tc) => tc.args)
      );
      const evaluated = evaluateResults(runResults, testCases);
      setTestResults(evaluated);
      const passed = evaluated.every((r) => r.passed);
      setAllPassed(passed);
      if (passed) {
        onCorrect();
      } else {
        onIncorrect();
      }
    } catch (err) {
      setTestResults([
        {
          passed: false,
          label: "Khalad",
          expected: null,
          received: null,
          error: err instanceof Error ? err.message : "Khalad la garanwaayo",
          logs: [],
        },
      ]);
      onIncorrect();
    } finally {
      setIsRunning(false);
    }
  }, [code, functionName, testCases, onCorrect, onIncorrect]);

  const handleReset = useCallback(() => {
    setCode(starterCode);
    setTestResults(null);
    setHasRun(false);
    setAllPassed(false);
  }, [starterCode]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-12">
      <div className="overflow-hidden rounded-3xl bg-white/5 dark:bg-black/40 backdrop-blur-sm border border-black/5 dark:border-white/5 relative shadow-xl">
        <div className="p-6 md:p-10 space-y-8">
          {/* Question header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                JavaScript
              </span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight text-left"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {questionText}
            </h2>
          </div>

          {/* Optional starter hint */}
          {hintFromStarter && (
            <div className="rounded-r-xl border-l-4 border-amber-500/60 bg-zinc-900 px-4 py-3">
              <p className="text-sm italic text-zinc-400">{hintFromStarter}</p>
            </div>
          )}

          {/* Code editor */}
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            disabled={isRunning}
            minLines={10}
          />

          {/* Action row */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Socda...
                </>
              ) : (
                "Orod Tijaaboyinka"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleReset}
              disabled={isRunning}
              className="h-11 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Dib u bilow
            </Button>
          </div>

          {/* Test results (after first run) */}
          {hasRun && testResults && (
            <TestResults results={testResults} isRunning={isRunning} />
          )}

          {/* Explanation (after all passed) */}
          {allPassed && explanation && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 transition-opacity duration-500 opacity-100">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                Sharaxaad:
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
