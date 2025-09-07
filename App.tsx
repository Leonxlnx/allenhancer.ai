import React, { useState, useEffect, useCallback } from 'react';
import { AppPhase, ChatMessage } from './types';
import { askFollowUpQuestion } from './services/geminiService';
import { generateFinalPrompt } from './services/openRouterService';

import InitialPrompt from './components/InitialPrompt';
import ChatInterface from './components/ChatInterface';
import FinalPrompt from './components/FinalPrompt';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.INITIAL);
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [finalPrompt, setFinalPrompt] = useState<string>('');
  const [originalFinalPrompt, setOriginalFinalPrompt] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitialSubmit = async (prompt: string) => {
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

  const handleAnswerSubmit = async (answer: string) => {
    setIsLoading(true);
    setError(null);

    const newHistory: ChatMessage[] = [
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

  const generateAndFinalizePrompt = useCallback(async (currentHistory: ChatMessage[]) => {
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
      return <Loader message={phase === AppPhase.CHATTING ? "Thinking of a question..." : "Generating final prompt..."}/>;
    }

    switch (phase) {
      case AppPhase.INITIAL:
        return <InitialPrompt onSubmit={handleInitialSubmit} />;
      case AppPhase.CHATTING:
        return <ChatInterface history={chatHistory} onSubmit={handleAnswerSubmit} isLoading={isLoading} />;
      case AppPhase.FINAL:
        return <FinalPrompt 
                  prompt={finalPrompt} 
                  setPrompt={setFinalPrompt}
                  originalPrompt={originalFinalPrompt}
                  onRestart={handleReset} 
                />;
      default:
        return <InitialPrompt onSubmit={handleInitialSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Prompt Enhancer
          </h1>
          <p className="text-gray-400 mt-2">Craft the perfect prompt through an intelligent conversation.</p>
        </header>
        <main className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 md:p-8 transition-all duration-500 min-h-[400px] flex flex-col justify-center">
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini & OpenRouter</p>
        </footer>
      </div>
    </div>
  );
};

export default App;