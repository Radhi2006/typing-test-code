import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, Target, Clock, Keyboard, RotateCcw, ArrowRight, Trophy, Copy, Check } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { useGameContext } from '../../context/GameContext';
import { LANGUAGE_DISPLAY_NAMES } from '../../types/snippet';

export const ResultsModal: React.FC = () => {
  const { theme } = useThemeContext();
  const { state, retryTest, loadNewSnippet, dismissResults } = useGameContext();
  const [copied, setCopied] = useState(false);
  const c = theme.colors;
  const result = state.lastResult;

  if (!result) return null;

  const maxWpm = Math.max(...result.wpmOverTime.map((w) => w.wpm), result.wpm, 1);

  const copyStats = () => {
    const text = `💻 CodeType Test Result:\n🚀 ${Math.round(result.wpm)} WPM (${Math.round(result.rawWpm)} Raw)\n🎯 ${result.accuracy.toFixed(1)}% Accuracy\n⏱ ${Math.round(result.timeElapsed)}s | Language: ${LANGUAGE_DISPLAY_NAMES[result.language]} (${result.difficulty})\n📄 Snippet: ${result.snippetTitle}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: `${c.editorBg}e0` }}
      onClick={dismissResults}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="rounded-lg shadow-2xl w-[480px] max-h-[90vh] overflow-y-auto custom-scrollbar font-mono"
        style={{
          backgroundColor: c.sidebarBg,
          border: `1px solid ${c.border}`,
          color: c.sidebarFg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: c.border }}>
          <div className="flex items-center gap-2">
            <Trophy size={18} style={{ color: c.buttonBg }} />
            <span className="font-semibold text-sm">Coding Test Complete</span>
          </div>
          <button
            onClick={dismissResults}
            className="opacity-60 hover:opacity-100 p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main Score Hero */}
        <div className="text-center py-5">
          <div className="text-6xl font-extrabold tracking-tight" style={{ color: c.buttonBg }}>
            {Math.round(result.wpm)}
          </div>
          <div className="text-xs uppercase tracking-widest opacity-60 mt-1 font-semibold">
            Words Per Minute
          </div>
        </div>

        {/* Quick Grid */}
        <div className="grid grid-cols-2 gap-2.5 px-6 pb-4">
          <StatBox icon={<Zap size={14} className="text-yellow-400" />} label="Raw WPM" value={`${Math.round(result.rawWpm)}`} colors={c} />
          <StatBox icon={<Target size={14} className="text-emerald-400" />} label="Accuracy" value={`${result.accuracy.toFixed(1)}%`} colors={c} />
          <StatBox icon={<Clock size={14} className="text-blue-400" />} label="Time Elapsed" value={`${Math.round(result.timeElapsed)}s`} colors={c} />
          <StatBox icon={<Keyboard size={14} className="text-purple-400" />} label="Chars Typed" value={`${result.correctChars}/${result.totalChars}`} colors={c} />
        </div>

        {/* Breakdown Details */}
        <div className="px-6 pb-4 text-xs space-y-1.5 opacity-80 border-t pt-3" style={{ borderColor: c.border }}>
          <div className="flex justify-between">
            <span className="opacity-60">Language:</span>
            <span className="font-semibold">{LANGUAGE_DISPLAY_NAMES[result.language]}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Difficulty:</span>
            <span className="font-semibold capitalize">{result.difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Snippet:</span>
            <span className="font-semibold truncate max-w-[240px]">{result.snippetTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Errors:</span>
            <span className="font-semibold text-red-400">{result.incorrectChars}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Corrections:</span>
            <span className="font-semibold">{result.corrections}</span>
          </div>
        </div>

        {/* WPM Chart */}
        {result.wpmOverTime.length > 1 && (
          <div className="px-6 pb-4">
            <div className="text-[10px] opacity-60 mb-1.5 uppercase font-semibold tracking-wider">
              WPM Progression
            </div>
            <div
              className="flex items-end gap-[3px] h-[64px] rounded p-1.5 overflow-hidden"
              style={{ backgroundColor: c.inputBg }}
            >
              {result.wpmOverTime.map((point, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  title={`${Math.round(point.wpm)} WPM at ${point.time}s`}
                  style={{
                    height: `${Math.max(4, (point.wpm / maxWpm) * 100)}%`,
                    backgroundColor: c.buttonBg,
                    opacity: 0.6 + (i / result.wpmOverTime.length) * 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center gap-2 p-4 border-t" style={{ borderColor: c.border }}>
          <button
            onClick={copyStats}
            className="p-2 rounded text-xs transition-colors flex items-center justify-center border"
            style={{
              backgroundColor: c.inputBg,
              borderColor: c.inputBorder,
              color: c.inputFg,
            }}
            title="Copy Result Summary"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          <button
            onClick={() => {
              retryTest();
              dismissResults();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-medium transition-colors border"
            style={{
              backgroundColor: c.inputBg,
              borderColor: c.inputBorder,
              color: c.inputFg,
            }}
          >
            <RotateCcw size={13} />
            Retry Snippet
          </button>

          <button
            onClick={() => {
              loadNewSnippet();
              dismissResults();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: c.buttonBg, color: c.buttonFg }}
          >
            Next Snippet
            <ArrowRight size={13} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  colors: Record<string, string>;
}> = ({ icon, label, value, colors }) => (
  <div
    className="rounded p-2.5 text-center border"
    style={{
      backgroundColor: colors.inputBg,
      borderColor: colors.inputBorder,
    }}
  >
    <div className="flex items-center justify-center gap-1 text-[10px] opacity-60 mb-0.5">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-base font-bold">{value}</div>
  </div>
);
