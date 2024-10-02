"use client";
import React from "react";
import { BookForm } from "./components/BookForm";
import { Container } from "./components/Container";
import { BookContent } from "./components/BookContent";
import { useGenerateSection } from "./hooks/useGenerateSection.hook";

export function CodeRefactor() {
  const {
    custo,
    handleSubmit,
    handleInputChange,
    formValues,
    loading,
    bookContent,
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
        <p>Generating chapter {progress.currentChapter} ... please wait.</p>
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
    </Container>
  );
}
