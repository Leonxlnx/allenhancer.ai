import React, { useState, useEffect, useCallback } from 'react';
import { AppPhase } from './types';
import { askFollowUpQuestion } from './services/geminiService';
import { generateFinalPrompt } from './services/openRouterService';

import InitialPrompt from './components/InitialPrompt';
import ChatInterface from './components/ChatInterface';
import FinalPrompt from './components/FinalPrompt';
import Loader from './components/Loader';

const App = () => {
  const [phase, setPhase] = useState(AppPhase.INITIAL);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [originalFinalPrompt, setOriginalFinalPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInitialSubmit = async (prompt) => {
    setIsLoading(true);
    setError(null);
    setInitialPrompt(prompt);
    setPhase(AppPhase.CHATTING);

    try {
      const firstQuestion = await askFollowUpQuestion(prompt, []);
      setChatHistory([{ role: 'ai', content: firstQuestion }]);
    } catch (e) {
      setError('Failed to get the first question. Please try again.');
      setPhase(AppPhase.INITIAL);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer) => {
    setIsLoading(true);
    setError(null);

    const newHistory = [
      ...chatHistory,
      { role: 'user', content: answer },
    ];
    setChatHistory(newHistory);

    try {
      const nextQuestion = await askFollowUpQuestion(initialPrompt, newHistory);
      if (nextQuestion.trim().toUpperCase() === 'DONE') {
        await generateAndFinalizePrompt(newHistory);
      } else {
        setChatHistory([...newHistory, { role: 'ai', content: nextQuestion }]);
      }
    } catch (e) {
      setError('An error occurred during the chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAndFinalizePrompt = useCallback(async (currentHistory) => {
    setIsLoading(true);
    setError(null);
    try {
      const answers = currentHistory.filter(msg => msg.role === 'user').map(msg => msg.content).join(' ');
      const finalGeneratedPrompt = await generateFinalPrompt(initialPrompt, answers);
      setFinalPrompt(finalGeneratedPrompt);
      setOriginalFinalPrompt(finalGeneratedPrompt);
      setPhase(AppPhase.FINAL);
    } catch (e) {
      setError('Failed to generate the final prompt. Please try again.');
      setPhase(AppPhase.CHATTING);
    } finally {
      setIsLoading(false);
    }
  }, [initialPrompt]);

  const handleReset = () => {
    setPhase(AppPhase.INITIAL);
    setInitialPrompt('');
    setChatHistory([]);
    setFinalPrompt('');
    setOriginalFinalPrompt('');
    setError(null);
  };
  
  const renderContent = () => {
    if (isLoading && phase !== AppPhase.CHATTING) {
      return React.createElement(Loader, { message: phase === AppPhase.INITIAL ? "Thinking of a question..." : "Generating final prompt..." });
    }

    switch (phase) {
      case AppPhase.INITIAL:
        return React.createElement(InitialPrompt, { onSubmit: handleInitialSubmit });
      case AppPhase.CHATTING:
        return React.createElement(ChatInterface, { history: chatHistory, onSubmit: handleAnswerSubmit, isLoading: isLoading });
      case AppPhase.FINAL:
        return React.createElement(FinalPrompt, { 
                  prompt: finalPrompt, 
                  setPrompt: setFinalPrompt,
                  originalPrompt: originalFinalPrompt,
                  onRestart: handleReset 
                });
      default:
        return React.createElement(InitialPrompt, { onSubmit: handleInitialSubmit });
    }
  };

  return React.createElement("div", { className: "min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans" },
    React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
      React.createElement("header", { className: "text-center mb-8" },
        React.createElement("h1", { className: "text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400" },
          "AI Prompt Enhancer"
        ),
        React.createElement("p", { className: "text-gray-400 mt-2" }, "Craft the perfect prompt through an intelligent conversation.")
      ),
      React.createElement("main", { className: "bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 md:p-8 transition-all duration-500 min-h-[400px] flex flex-col justify-center" },
        error && React.createElement("div", { className: "bg-red-500/20 text-red-300 p-3 rounded-lg mb-4" }, error),
        renderContent()
      ),
      React.createElement("footer", { className: "text-center mt-8 text-gray-500 text-sm" },
        React.createElement("p", null, "Powered by Gemini & OpenRouter")
      )
    )
  );
};

export default App;
