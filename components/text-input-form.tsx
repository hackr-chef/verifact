'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface TextInputFormProps {
  onSubmit: (text: string, file: File | null) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export default function TextInputForm({
  onSubmit,
  isLoading = false,
  placeholder = 'Paste your text, statement, or article to fact-check',
  maxLength = 5000,
}: TextInputFormProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tone, setTone] = useState<'friendly' | 'critical'>('friendly');
  const [format, setFormat] = useState<'essay' | 'post' | 'pitch' | 'casual'>('essay');
  const [charCount, setCharCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // More attractive and friendly color palette
  const colors = {
    primary: '#4F46E5',    // Indigo as primary color
    secondary: '#1E293B',  // Deep slate for secondary elements
    background: '#F8FAFC', // Light background
    text: '#334155',       // Main text color
    lightText: '#64748B',  // Lighter text for less important elements
    border: '#E2E8F0',     // Border color
    primaryLight: 'rgba(79, 70, 229, 0.1)' // Light primary for backgrounds
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
      setCharCount(newText.length);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text, file);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.secondary }}>
          Verify Your Facts
        </h2>
        <p className="mb-6 text-sm" style={{ color: colors.text }}>
          Enter your text below and we'll analyze it for factual accuracy, providing detailed feedback on what's accurate and what needs correction.
        </p>
        
        {/* Text Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg transition-colors ${
            dragActive ? 'border-primary' : 'border-gray-200'
          }`}
          style={{ 
            borderColor: dragActive ? colors.primary : colors.border,
            background: dragActive ? colors.primaryLight : 'white'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <textarea
            className="w-full h-64 p-4 rounded-lg outline-none resize-none bg-transparent"
            style={{ 
              color: colors.text,
              caretColor: colors.primary
            }}
            placeholder={placeholder}
            value={text}
            onChange={handleTextChange}
          ></textarea>
          
          {dragActive && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <div style={{ color: colors.primary }} className="font-medium">
                Drop your file here
              </div>
            </div>
          )}
          
          <div className="flex justify-between text-xs px-4 pb-2" style={{ color: colors.lightText }}>
            <span>{charCount} / {maxLength} characters</span>
            <span>Drag & drop a file or <button 
              type="button" 
              style={{ color: colors.primary }}
              className="hover:underline"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button></span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.pdf,.doc,.docx"
            />
          </div>
        </div>
        
        {/* File Preview */}
        {file && (
          <div className="mt-3 p-3 rounded-md flex items-center justify-between" 
               style={{ background: colors.primaryLight }}>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" 
                   style={{ color: colors.primary }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="text-sm truncate max-w-xs" style={{ color: colors.text }}>{file.name}</span>
            </div>
            <button
              type="button"
              onClick={removeFile}
              style={{ color: colors.lightText }}
              className="hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Controls */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Tone Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: colors.lightText }}>Tone:</span>
              <div className="relative inline-flex items-center">
                <div className="w-36 h-8 flex items-center rounded-full p-1" style={{ background: '#F1F5F9' }}>
                  <button
                    type="button"
                    className={`flex-1 h-6 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
                      tone === 'friendly' ? 'shadow' : ''
                    }`}
                    style={{ 
                      background: tone === 'friendly' ? 'white' : 'transparent',
                      color: tone === 'friendly' ? colors.primary : colors.lightText
                    }}
                    onClick={() => setTone('friendly')}
                  >
                    Friendly
                  </button>
                  <button
                    type="button"
                    className={`flex-1 h-6 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
                      tone === 'critical' ? 'shadow' : ''
                    }`}
                    style={{ 
                      background: tone === 'critical' ? 'white' : 'transparent',
                      color: tone === 'critical' ? colors.primary : colors.lightText
                    }}
                    onClick={() => setTone('critical')}
                  >
                    Critical
                  </button>
                </div>
              </div>
            </div>
            
            {/* Format Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: colors.lightText }}>Format:</span>
              <select
                className="h-8 pl-3 pr-8 text-sm border rounded-md outline-none bg-white"
                style={{ 
                  color: colors.text,
                  borderColor: colors.border
                }}
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
              >
                <option value="essay">Essay</option>
                <option value="post">Post</option>
                <option value="pitch">Pitch</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>
          
          {/* Check Button */}
          <button
            type="submit"
            disabled={isLoading || (text.trim() === '' && !file)}
            className={`px-6 py-3 rounded-md transition-colors flex items-center justify-center shadow-sm ${
              isLoading || (text.trim() === '' && !file)
                ? 'cursor-not-allowed opacity-70'
                : 'hover:opacity-90'
            }`}
            style={{ 
              background: colors.primary,
              color: 'white'
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Check Facts
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
