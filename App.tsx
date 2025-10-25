import React, { useState } from 'react';
import { InputType, ImageFile } from './types';
import { solveProblem } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import SolutionDisplay from './components/SolutionDisplay';

// Icons
const TextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-8 h-8"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V8.25c0-1.12 0-1.68.218-2.108a2.25 2.25 0 01.874-.874C4.57 5.042 5.13 5.042 6.25 5.042h11.5c1.12 0 1.68 0 2.108.218a2.25 2.25 0 01.874.874c.218.428.218.988.218 2.108v9c0 1.12 0 1.68-.218 2.108a2.25 2.25 0 01-.874.874c-.428.218-.988.218-2.108.218H6.25c-1.12 0-1.68 0-2.108-.218a2.25 2.25 0 01-.874-.874C3 18.93 3 18.37 3 17.25z" />
    </svg>
);


const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const App: React.FC = () => {
  const [inputType, setInputType] = useState<InputType>(InputType.TEXT);
  const [promptText, setPromptText] = useState('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setError("Image size should not exceed 2MB.");
          return;
      }
      try {
        setError('');
        const base64 = await fileToBase64(file);
        setImageFile({
          base64,
          mimeType: file.type,
          name: file.name,
        });
      } catch (err) {
        setError("Failed to process image file.");
        console.error(err);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText && !imageFile) {
      setError("Please provide a problem description or an image.");
      return;
    }

    setIsLoading(true);
    setSolution('');
    setError('');

    try {
        const result = await solveProblem(promptText, imageFile);
        if (result.startsWith("An error occurred:") || result.startsWith("An unknown error occurred")) {
            setError(result);
        } else {
            setSolution(result);
        }
    } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || (!promptText.trim() && !imageFile);

  return (
    <div className="min-h-full flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <Header />
        <main className="max-w-4xl mx-auto mt-8">
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/50 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-center mb-6">
              <div className="bg-black/50 p-1 rounded-full flex items-center space-x-1">
                <button
                  onClick={() => setInputType(InputType.TEXT)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${inputType === InputType.TEXT ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600/50'}`}
                  aria-pressed={inputType === InputType.TEXT}
                >
                    <TextIcon className="w-5 h-5 inline-block mr-2 align-middle" />
                    Text
                </button>
                <button
                  onClick={() => setInputType(InputType.IMAGE)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${inputType === InputType.IMAGE ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600/50'}`}
                  aria-pressed={inputType === InputType.IMAGE}
                >
                    <ImageIcon className="w-5 h-5 inline-block mr-2 align-middle" />
                    Image
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {inputType === InputType.TEXT && (
                 <div>
                    <label htmlFor="prompt-text" className="block text-sm font-medium text-gray-300 mb-2">
                        Describe your programming problem:
                    </label>
                    <textarea
                        id="prompt-text"
                        rows={6}
                        className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="e.g., 'Write a Python function to check if a string is a palindrome.'"
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                    />
                 </div>
              )}

              {inputType === InputType.IMAGE && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Upload an image of your problem:
                    </label>
                    {!imageFile ? (
                        <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-black/30 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                                <UploadIcon />
                                <p className="mb-2 text-sm">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs">PNG, JPG, or GIF (MAX. 2MB)</p>
                            </div>
                            <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} />
                        </label>
                    ) : (
                        <div className="mt-4 relative">
                            <img src={`data:${imageFile.mimeType};base64,${imageFile.base64}`} alt="Problem preview" className="max-h-60 w-auto mx-auto rounded-lg shadow-md" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-3 -right-3 bg-gray-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                aria-label="Remove image"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <textarea
                        rows={2}
                        className="mt-4 w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Add any additional context or requirements here (optional)..."
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                    />
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-gray-700/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? 'Solving...' : 'Get Solution'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">{error}</div>}
            {solution && !isLoading && <SolutionDisplay solution={solution} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;