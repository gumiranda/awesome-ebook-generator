"use client";
import React, { useState, useEffect } from "react";

// Componente para os inputs do formulário com estilização
export function ReviewPage() {
  const [formValues, setFormValues] = useState({
    title: "",
    genre: "",
    description: "",
    chapters: 5,
    totalSections: 3,
    fullText: "", // Campo para o texto completo
  });
  const [custo, setCusto] = useState(0);
  const [revisedContent, setRevisedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const MAX_CHUNK_SIZE = 14000; // Tamanho máximo do chunk (14.000 caracteres)
  const [textChunks, setTextChunks] = useState<string[]>([]); // Para armazenar os pedaços de texto

  // Função para dividir o texto em pedaços menores de até 14.000 caracteres
  const divideTextIntoChunks = (text: string, chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const reviewText = async (text: string, chunkIndex: number) => {
    const response = await fetch("/api/reviewSplitText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promptRewrite: `This is the ${chunkIndex} part of my text. Rewrite the following text to improve its readability and coherence:\n\n${text}`,
      }),
    });

    const data = await response.json();
    setCusto((prev) => prev + data.costInDollars);

    return data.sectionContent;
  };

  useEffect(() => {
    const processText = async () => {
      if (!loading || progress >= textChunks.length) return;

      const chunk = textChunks[progress]; // Pega o pedaço atual
      const sectionContent = await reviewText(chunk, progress);

      setRevisedContent((prev) => prev + `\n\n${sectionContent}`);
      setProgress((prev) => prev + 1);
    };

    processText();
  }, [progress, textChunks, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRevisedContent(""); // Resetar o conteúdo revisado
    setLoading(true);

    // Dividir o texto em pedaços de até 14.000 caracteres
    const chunks = divideTextIntoChunks(formValues.fullText, MAX_CHUNK_SIZE);
    setTextChunks(chunks); // Armazena os pedaços
    setProgress(0); // Inicia o processamento do primeiro pedaço
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h1>Generate and Review Your Ebook</h1>
      <form onSubmit={handleSubmit} className="form">
        {/* Campo para texto completo */}
        <div className="input-container">
          <label>Full Text</label>
          <textarea
            name="fullText"
            value={formValues.fullText}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Generating..." : "Generate and Review"}
        </button>
      </form>

      <h1>Custo atual (em dólares): {custo}</h1>

      {revisedContent && (
        <div className="revised-content">
          <h2>Revised Book Content:</h2>
          <pre>{revisedContent}</pre>
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
        textarea:focus {
          border-color: #0070f3;
          outline: none;
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
      `}</style>
    </div>
  );
}
