import React, { useState } from 'react';

interface InitialPromptProps {
  onSubmit: (prompt: string) => void;
}

const InitialPrompt: React.FC<InitialPromptProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Start with your core idea</h2>
      <p className="text-gray-400 mb-6 max-w-md">Enter a simple sentence or a few keywords. The AI will ask follow-up questions to build a professional prompt.</p>
      <form onSubmit={handleSubmit} className="w-full">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'a logo for a coffee shop' or 'a marketing plan for a new app'"
          className="w-full h-28 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
        />
        <button
          type="submit"
          disabled={!prompt.trim()}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform duration-200"
        >
          Start Enhancing
        </button>
      </form>
    </div>
  );
};

export default InitialPrompt;