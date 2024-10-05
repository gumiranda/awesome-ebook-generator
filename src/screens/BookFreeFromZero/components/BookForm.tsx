import { FormInput } from "./FormInput";

export const BookForm = ({
  props: { handleSubmit, handleInputChange, formValues, loading },
}: any) => {
  return (
    <form onSubmit={handleSubmit} className="form">
      <label>tema do livro (ex filosofia pra cachorros)</label>
      <textarea
        value={formValues.about}
        onChange={handleInputChange}
        name="about"
      />
      <label>capitulos separados por virgula</label>
      <textarea
        value={formValues.chaptersArray}
        onChange={handleInputChange}
        name="chaptersArray"
      />
      <FormInput
        label="prompts adicionais que vc queira incluir"
        value={formValues.technology}
        onChange={handleInputChange}
        name="technology"
        required={false}
      />

      <FormInput
        label="Número de capítulos "
        type="number"
        value={formValues.chapters}
        onChange={handleInputChange}
        name="chapters"
        min="1"
        max="500"
      />

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? "Generating..." : "Generate Ebook"}
      </button>
      <style jsx>{`
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
      `}</style>
    </form>
  );
};
