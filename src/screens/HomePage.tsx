"use client";
import React from "react";
import { useState } from "react";

export function HomePage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [chapters, setChapters] = useState(5);
  const [bookContent, setBookContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setBookContent(""); // Reset previous book content

    // Send request to backend API to generate book
    const response = await fetch("/api/generateBook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        genre,
        description,
        chapters,
      }),
    });

    const data = await response.json();
    setBookContent(data.content);
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

        <button type="submit">Generate Ebook</button>
      </form>

      {loading && <p>Generating your book... please wait.</p>}

      {!loading && bookContent && (
        <>
          <h2>Your Generated Book:</h2>
          <pre>{bookContent}</pre>
        </>
      )}
    </div>
  );
}
