// components/BookContent.tsx
"use client";
import React from "react";

export const BookContent = ({
  props: { bookContent, copyOriginalContent, handleReviewText },
}: any) => (
  <div className="book-content">
    <h2>Generated Book:</h2>
    <pre>{bookContent}</pre>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={copyOriginalContent} className="copy-button">
        Copy Original Content
      </button>
      <button onClick={handleReviewText} className="review-button">
        Review and Rewrite Text
      </button>
    </div>{" "}
    <style jsx>{`
      .book-content {
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
