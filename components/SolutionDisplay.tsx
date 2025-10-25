import React, { useState, useEffect } from 'react';

interface SolutionDisplayProps {
  solution: string;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(solution);
    setCopied(true);
  };

  if (!solution) return null;

  return (
    <div className="mt-8 w-full animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Solution</h2>
      <div className="bg-gray-900/50 rounded-lg shadow-lg relative group border border-gray-700">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-gray-800/70 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </button>
        <pre className="p-6 text-gray-300 overflow-x-auto text-sm md:text-base">
          <code className="font-mono whitespace-pre-wrap break-words">{solution}</code>
        </pre>
      </div>
    </div>
  );
};

export default SolutionDisplay;