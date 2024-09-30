"use client";
import React, { useState, useEffect } from "react";

// Componente para os inputs do formulário
const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  name,
}: any) => (
  <>
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
  </>
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

  // Função para gerar uma seção específica de um capítulo
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

  // UseEffect para gerar seções e capítulos de forma progressiva
  useEffect(() => {
    const generateNextSection = async () => {
      const { currentChapter, currentSection } = progress;

      // Verifica se atingiu o número total de capítulos e seções
      if (currentChapter === 0 || loading === false) return;

      if (currentChapter <= Number(formValues.chapters)) {
        if (currentSection <= Number(formValues.totalSections)) {
          const sectionContent = await generateSection(
            currentChapter,
            currentSection,
          );
          setBookContent((prev) => prev + `\n\n${sectionContent}`);

          // Avança para a próxima seção
          setProgress((prev) => ({
            ...prev,
            currentSection: prev.currentSection + 1,
          }));
        } else if (currentChapter < Number(formValues.chapters)) {
          // Quando terminar as seções do capítulo atual, avança para o próximo capítulo
          setProgress((prev) => ({
            currentChapter: prev.currentChapter + 1,
            currentSection: 1,
          }));
        } else {
          // Fim do processo
          setLoading(false);
        }
      }
    };

    if (loading) {
      generateNextSection();
    }
  }, [progress, formValues, loading]);

  // Dispara a geração ao submeter o formulário
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
    <div>
      <h1>Generate Your Ebook</h1>
      <form onSubmit={handleSubmit}>
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
        <label>Description</label>
        <textarea
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          required
        />
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

        <button type="submit" disabled={loading}>
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
        <>
          <h2>Your Generated Book:</h2>
          <pre>{bookContent}</pre>
        </>
      )}
    </div>
  );
}
