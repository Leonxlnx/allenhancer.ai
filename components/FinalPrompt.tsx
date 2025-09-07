import React, { useState } from 'react';
import { CopyIcon, ResetIcon, RestartIcon } from './Icons';

interface FinalPromptProps {
  prompt: string;
  setPrompt: (value: string) => void;
  originalPrompt: string;
  onRestart: () => void;
}

const FinalPrompt: React.FC<FinalPromptProps> = ({ prompt, setPrompt, originalPrompt, onRestart }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  const handleReset = () => {
    setPrompt(originalPrompt);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-200">Your Enhanced Prompt</h2>
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-72 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-y font-mono text-sm leading-relaxed"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-200"
        >
          <CopyIcon className="w-5 h-5" /> {copyStatus}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <ResetIcon className="w-5 h-5" /> Reset
        </button>
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <RestartIcon className="w-5 h-5" /> Start New
        </button>
      </div>
    </div>
  );
};

export default FinalPrompt;
