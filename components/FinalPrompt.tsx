import React, { useState } from 'react';
import { CopyIcon, ResetIcon, RestartIcon } from './Icons';

const FinalPrompt = ({ prompt, setPrompt, originalPrompt, onRestart }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  const handleReset = () => {
    setPrompt(originalPrompt);
  };

  // FIX: Extract textarea props to a variable to bypass TypeScript's strict object literal checking which was causing an error with the 'value' prop.
  const textareaProps = {
    value: prompt,
    onChange: (e) => setPrompt(e.target.value),
    className: "w-full h-72 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-y font-mono text-sm leading-relaxed"
  };

  return React.createElement("div", { className: "flex flex-col" },
    React.createElement("h2", { className: "text-2xl font-semibold mb-4 text-center text-gray-200" }, "Your Enhanced Prompt"),
    React.createElement("div", { className: "relative" },
      React.createElement("textarea", textareaProps)
    ),
    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4" },
      React.createElement("button", {
        onClick: handleCopy,
        className: "flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors duration-200"
      }, React.createElement(CopyIcon, { className: "w-5 h-5" }), ` ${copyStatus}`),
      React.createElement("button", {
        onClick: handleReset,
        className: "flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
      }, React.createElement(ResetIcon, { className: "w-5 h-5" }), " Reset"),
      React.createElement("button", {
        onClick: onRestart,
        className: "flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
      }, React.createElement(RestartIcon, { className: "w-5 h-5" }), " Start New")
    )
  );
};

export default FinalPrompt;
