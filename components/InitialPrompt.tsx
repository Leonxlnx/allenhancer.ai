import React, { useState } from 'react';

const InitialPrompt = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  // FIX: Extract textarea props to a variable to bypass TypeScript's strict object literal checking which was causing an error with the 'value' prop.
  const textareaProps = {
    value: prompt,
    onChange: (e) => setPrompt(e.target.value),
    placeholder: "e.g., 'a logo for a coffee shop' or 'a marketing plan for a new app'",
    className: "w-full h-28 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
  };

  return React.createElement("div", { className: "flex flex-col items-center justify-center text-center" },
    React.createElement("h2", { className: "text-2xl font-semibold mb-4 text-gray-200" }, "Start with your core idea"),
    React.createElement("p", { className: "text-gray-400 mb-6 max-w-md" }, "Enter a simple sentence or a few keywords. The AI will ask follow-up questions to build a professional prompt."),
    React.createElement("form", { onSubmit: handleSubmit, className: "w-full" },
      React.createElement("textarea", textareaProps),
      React.createElement("button", {
        type: "submit",
        disabled: !prompt.trim(),
        className: "mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform duration-200"
      }, "Start Enhancing")
    )
  );
};

export default InitialPrompt;
