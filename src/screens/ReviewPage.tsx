"use client";

import React, { useState, useEffect } from "react";

export function ReviewPage() {
  const [formValues, setFormValues] = useState({
    title: "",
    genre: "",
    description: "",
    chapters: 5,
    totalSections: 3,
    fullText: "", // Full text field
  });

  const [custo, setCusto] = useState(0); // Cost tracking
  const [revisedContent, setRevisedContent] = useState(""); // Revised content storage
  const [loading, setLoading] = useState(false); // Track if the process is ongoing
  const [progress, setProgress] = useState(0); // Track progress of the review process

  const MAX_CHUNK_SIZE = 14000; // Max chunk size (14,000 characters)
  const [textChunks, setTextChunks] = useState<string[]>([]); // To store text chunks

  // Function to divide the text into smaller chunks up to 14,000 characters
  const divideTextIntoChunks = (text: string, chunkSize: number): string[] => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Review a chunk of text asynchronously
  const reviewText = async (text: string, chunkIndex: number) => {
    const response = await fetch("/api/reviewSplitText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promptRewrite: `This is the ${chunkIndex} part of my text.  Rewrite the following text to improve its readability and coherence:\n\n${text}\n Ensure the new text part flows naturally from the previous content, providing a smooth transition. 
    The section should hint at future developments to maintain reader engagement.`,
      }),
    });

    const data = await response.json();
    setCusto((prev) => prev + data.costInDollars);

    return data.sectionContent;
  };

  // Automatically process chunks when the progress changes
  useEffect(() => {
    const processText = async () => {
      if (!loading || progress >= textChunks.length) return;

      const chunk = textChunks[progress];
      const sectionContent = await reviewText(chunk, progress);

      setRevisedContent((prev) => prev + `\n\n${sectionContent}`);
      setProgress((prev) => prev + 1);
      if (progress === textChunks.length - 1) {
        setLoading(false);
      }
    };

    processText();
  }, [progress, textChunks, loading]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.fullText.trim()) return; // Early return if text is empty

    setRevisedContent(""); // Reset the revised content
    setLoading(true); // Mark as loading

    // Split text into chunks
    const chunks = divideTextIntoChunks(formValues.fullText, MAX_CHUNK_SIZE);
    setTextChunks(chunks); // Store chunks
    setProgress(0); // Reset progress
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleCopyContentOriginal = () => {
    if (revisedContent) {
      navigator.clipboard.writeText(revisedContent).then(
        () => {
          alert("Conteúdo original copiado para a área de transferência!");
        },
        () => {
          alert("Falha ao copiar o conteúdo original. Tente novamente.");
        },
      );
    }
  };
  return (
    <div className="container">
      <h1>Rewrite Your Ebook</h1>
      <form onSubmit={handleSubmit} className="form">
        {/* Full text field */}
        <div className="input-container">
          <label>Text</label>
          <textarea
            name="fullText"
            value={formValues.fullText}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading
            ? `Processing ${progress}/${textChunks.length}...`
            : "Rewrite Text"}
        </button>
      </form>

      <h1>Custo atual (em dólares): {custo.toFixed(2)}</h1>

      {revisedContent && (
        <div className="revised-content">
          <h2>Revised Book Content:</h2>
          <pre>{revisedContent}</pre>
          <button
            onClick={() => handleCopyContentOriginal()}
            className="copy-button"
          >
            Copy Original Content
          </button>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f7f7f7;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
          color: #333;
        }
        h1 {
          text-align: center;
          font-size: 2rem;
          color: #333;
          margin-bottom: 2rem;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        textarea {
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          background-color: #f9f9f9;
          font-size: 1rem;
          min-height: 120px;
          resize: vertical;
          transition: border-color 0.3s ease;
          color: #333;
        }
        textarea:disabled {
          background-color: #eee;
        }
        .submit-button {
          padding: 1rem 2rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .submit-button:hover {
          background-color: #005bb5;
        }
        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          color: #333;
        }
        .revised-content {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-size: 1rem;
          color: #333;
          white-space: pre-wrap;
          word-wrap: break-word;
          max-width: 100%;
          overflow-wrap: break-word;
        }
        pre {
          font-family: monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #333;
          white-space: break-spaces;
        }
        .copy-button,
        .review-button {
          margin-top: 1rem;
          padding: 0.7rem 1.5rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }
        .copy-button:hover,
        .review-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
}
