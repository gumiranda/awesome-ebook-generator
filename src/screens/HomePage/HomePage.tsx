"use client";
import React from "react";
import { BookForm } from "./components/BookForm";
import { RevisedContent } from "./components/RevisedContent";
import { Container } from "./components/Container";
import { BookContent } from "./components/BookContent";
import { useGenerateSection } from "./hooks/useGenerateSection.hook";

export function HomePage() {
  const {
    custo,
    handleSubmit,
    handleInputChange,
    formValues,
    loading,
    bookContent,
    revisedContent,
    handleCopyContent,
    handleCopyContentOriginal,
    handleReviewText,
    progress,
  } = useGenerateSection();
  return (
    <Container custo={custo}>
      <BookForm
        props={{ handleSubmit, handleInputChange, formValues, loading }}
      />
      {loading && (
        <p>
          Generating chapter {progress.currentChapter}, section{" "}
          {progress.currentSection}... please wait.
        </p>
      )}

      {bookContent && (
        <BookContent
          props={{
            bookContent,
            handleCopyContentOriginal,
            handleReviewText,
          }}
        />
      )}

      {revisedContent && (
        <RevisedContent
          revisedContent={revisedContent}
          handleCopyContent={handleCopyContent}
        />
      )}
    </Container>
  );
}
