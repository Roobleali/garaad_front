"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  disabled?: boolean;
  minLines?: number;
}

const LINE_NUM_WIDTH = 48;
const FONT_SIZE_PX = 14;
const LINE_HEIGHT = 1.6;

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  placeholder,
  disabled = false,
  minLines = 8,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tabCursorRef = useRef<{ start: number; end: number } | null>(null);

  const lineCount = value ? value.split("\n").length : 1;
  const displayLines = Math.max(minLines, lineCount);
  const minHeightPx = displayLines * LINE_HEIGHT * FONT_SIZE_PX;

  const restoreCursor = useCallback(() => {
    if (tabCursorRef.current && textareaRef.current) {
      const { start, end } = tabCursorRef.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
      tabCursorRef.current = null;
    }
  }, []);

  useEffect(() => {
    restoreCursor();
  }, [value, restoreCursor]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = value.slice(0, start) + "  " + value.slice(end);
    tabCursorRef.current = { start: start + 2, end: start + 2 };
    onChange(newVal);
  };

  return (
    <div className="w-full overflow-hidden rounded-b-xl border border-t-0 border-[#27272a] bg-[#09090b]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2.5 rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500" style={{ fontFamily: "Inter, sans-serif" }}>
          {language}
        </span>
      </div>

      {/* Editor area with line numbers */}
      <div className="relative flex">
        <div
          className="shrink-0 py-5 pr-2 text-right select-none text-zinc-600"
          style={{
            width: LINE_NUM_WIDTH,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontSize: FONT_SIZE_PX,
            lineHeight: LINE_HEIGHT,
          }}
          aria-hidden
        >
          {Array.from({ length: displayLines }, (_, i) => i + 1).map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className={cn(
            "flex-1 min-w-0 resize-y rounded-b-xl border bg-transparent py-5 pr-5 pl-2 outline-none transition-colors duration-200",
            "border-[#27272a] focus:ring-0 focus:border-purple-500/60",
            disabled && "cursor-not-allowed opacity-70"
          )}
          style={{
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontSize: FONT_SIZE_PX,
            lineHeight: LINE_HEIGHT,
            color: "#34d399",
            background: "#09090b",
            marginLeft: -LINE_NUM_WIDTH,
            paddingLeft: LINE_NUM_WIDTH + 8,
            minHeight: minHeightPx,
            tabSize: 2,
          } as React.CSSProperties}
          data-enable-grammarly="false"
        />
      </div>
    </div>
  );
}
