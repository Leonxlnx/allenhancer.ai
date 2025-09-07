import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Language } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicIcon, SendIcon } from './Icons';
import Loader from './Loader';

interface ChatInterfaceProps {
  history: ChatMessage[];
  onSubmit: (answer: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, onSubmit, isLoading }) => {
  const [answer, setAnswer] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleTranscriptChange = (transcript: string) => {
    setAnswer(prev => prev + transcript + ' ');
  };

  const { isListening, startListening, stopListening, language, setLanguage, hasSupport } = useSpeechRecognition(handleTranscriptChange);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !isLoading) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh]">
      <div className="flex-1 overflow-y-auto pr-2">
        {history.map((msg, index) => (
          <div key={index} className={`flex mb-4 ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'ai' ? 'bg-gray-700 rounded-bl-none' : 'bg-purple-600 text-white rounded-br-none'}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start mb-4">
                 <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-700 rounded-bl-none">
                    <Loader message="Thinking..."/>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="mt-4 border-t border-gray-700 pt-4">
        {hasSupport && (
          <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Voice Language:</span>
              <div>
                  <button onClick={() => setLanguage('en-US')} className={`px-2 py-1 text-sm rounded ${language === 'en-US' ? 'bg-cyan-500 text-white' : 'bg-gray-700'}`}>EN</button>
                  <button onClick={() => setLanguage('de-DE')} className={`ml-2 px-2 py-1 text-sm rounded ${language === 'de-DE' ? 'bg-cyan-500 text-white' : 'bg-gray-700'}`}>DE</button>
              </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 p-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            disabled={isLoading}
          />
          {hasSupport && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-full transition-colors duration-200 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-cyan-500 text-white'}`}
            >
              <MicIcon className="w-6 h-6" />
            </button>
          )}
          <button type="submit" disabled={!answer.trim() || isLoading} className="p-3 bg-purple-600 text-white rounded-full disabled:bg-gray-600">
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
