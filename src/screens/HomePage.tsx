"use client";
import React, { useState } from "react";

export function HomePage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [chapters, setChapters] = useState(5);
  const [bookContent, setBookContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(3); // Limite de seções por capítulo

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
        title,
        genre,
        description,
        chapter: chapterNumber,
        section: sectionNumber,
      }),
    });

    const data = await response.json();
    return data.sectionContent;
  };

  // Função que gera todos os capítulos e suas seções
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setBookContent(""); // Reset previous book content
    setCurrentChapter(0); // Reset current chapter
    setCurrentSection(0); // Reset current section

    for (let chapter = 1; chapter <= chapters; chapter++) {
      setCurrentChapter(chapter); // Update current chapter progress

      let chapterContent = ""; // Armazena o conteúdo do capítulo atual

      for (let section = 1; section <= totalSections; section++) {
        setCurrentSection(section); // Atualiza a seção atual
        const sectionContent = await generateSection(chapter, section); // Gera uma seção
        chapterContent += `\n\n${sectionContent}`; // Adiciona o conteúdo da seção ao capítulo
      }

      setBookContent((prevContent) => prevContent + `${chapterContent}`);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Generate Your Ebook</h1>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Genre</label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Number of Chapters</label>
        <input
          type="number"
          value={chapters}
          onChange={(e) => setChapters(Number(e.target.value))}
          min="1"
          max="20"
        />

        <label>Number of Sections per Chapter</label>
        <input
          type="number"
          value={totalSections}
          onChange={(e) => setTotalSections(Number(e.target.value))}
          min="1"
          max="10" // Limite para evitar muitas seções por capítulo
        />

        <button type="submit" disabled={loading}>
          Generate Ebook
        </button>
      </form>

      {loading && (
        <>
          <p>
            Generating chapter {currentChapter}, section {currentSection}...
            please wait.
          </p>
        </>
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
