"use client";
import React, { useState, useEffect } from "react";

// Componente para os inputs do formulário com estilização
const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  name,
}: any) => (
  <div className="input-container">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      min={min}
      max={max}
      name={name}
    />
    <style jsx>{`
      .input-container {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        color: #333;
      }
      label {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #333;
      }
      input {
        padding: 0.7rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 1rem;
        background-color: #f9f9f9;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s ease;
        color: #333;
      }
      input:focus {
        border-color: #0070f3;
        outline: none;
      }
    `}</style>
  </div>
);

export function HomePage() {
  const [formValues, setFormValues] = useState({
    title: "",
    genre: "",
    description: "",
    chapters: 5,
    totalSections: 3, // Limite de seções por capítulo
  });

  const [bookContent, setBookContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    currentChapter: 0,
    currentSection: 0,
  });

  const generateSection = async (
    chapterNumber: number,
    sectionNumber: number,
  ) => {
    const response = await fetch("/api/generateSection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formValues,
        chapter: chapterNumber,
        section: sectionNumber,
      }),
    });

    const data = await response.json();
    return data.sectionContent;
  };

  useEffect(() => {
    const generateNextSection = async () => {
      const { currentChapter, currentSection } = progress;
      if (currentChapter === 0 || loading === false) return;

      if (currentChapter <= Number(formValues.chapters)) {
        if (currentSection <= Number(formValues.totalSections)) {
          const sectionContent = await generateSection(
            currentChapter,
            currentSection,
          );
          setBookContent((prev) => prev + `\n\n${sectionContent}`);

          setProgress((prev) => ({
            ...prev,
            currentSection: prev.currentSection + 1,
          }));
        } else if (currentChapter < Number(formValues.chapters)) {
          setProgress((prev) => ({
            currentChapter: prev.currentChapter + 1,
            currentSection: 1,
          }));
        } else {
          setLoading(false);
        }
      }
    };

    if (loading) {
      generateNextSection();
    }
  }, [progress, formValues, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookContent(""); // Reset previous book content
    setLoading(true); // Inicia o loading
    setProgress({ currentChapter: 1, currentSection: 1 }); // Começa do capítulo 1, seção 1
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h1>Generate Your Ebook</h1>
      <form onSubmit={handleSubmit} className="form">
        <FormInput
          label="Title"
          value={formValues.title}
          onChange={handleInputChange}
          name="title"
        />
        <FormInput
          label="Genre"
          value={formValues.genre}
          onChange={handleInputChange}
          name="genre"
        />
        <div className="input-container">
          <label>Description</label>
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <FormInput
          label="Number of Chapters"
          type="number"
          value={formValues.chapters}
          onChange={handleInputChange}
          name="chapters"
          min="1"
          max="20"
        />
        <FormInput
          label="Number of Sections per Chapter"
          type="number"
          value={formValues.totalSections}
          onChange={handleInputChange}
          name="totalSections"
          min="1"
          max="10"
        />

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Generating..." : "Generate Ebook"}
        </button>
      </form>

      {loading && (
        <p>
          Generating chapter {progress.currentChapter}, section{" "}
          {progress.currentSection}... please wait.
        </p>
      )}

      {bookContent && (
        <div className="book-content">
          <h2>Your Generated Book:</h2>
          <pre>{bookContent}</pre>
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
        .book-content {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-size: 1rem;
          color: #333;
          white-space: pre-wrap; /* Mantém as quebras de linha */
          word-wrap: break-word; /* Quebra palavras longas */
          max-width: 100%; /* Limita a largura máxima ao tamanho do container */
          overflow-wrap: break-word; /* Para garantir que longas palavras sejam quebradas */
        }
        pre {
          font-family: monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #333;
          white-space: break-spaces; /* Mantém as quebras de linha */
        }
      `}</style>
    </div>
  );
}
