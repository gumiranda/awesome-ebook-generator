import { useEffect, useState, useCallback } from "react";

// Custom hook for form state management
const useForm = (initialValues: {
  about: string;
  chapters: number;
  technology: string;
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = useCallback(({ target: { name, value } }: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return [formValues, handleInputChange];
};

// Helper function for making authorized API requests
const fetchUrl = async (url: string | URL | Request, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (!result || typeof result !== "object") {
    throw new Error("Invalid response format");
  }

  return result;
};

// Custom hook for managing progress state and chapter generation logic
interface FormValues {
  about: string;
  chapters: number;
  technology: string;
}

const useProgress = (
  formValues: FormValues,
  initialSumario = "",
  initialBookContentJson: { [key: number]: string } = {},
) => {
  const [progress, setProgress] = useState({ currentChapter: -1 });
  const [bookContent, setBookContent] = useState("");
  const [sumario, setSumario] = useState(initialSumario);
  const [loading, setLoading] = useState(false);
  const [custo, setCusto] = useState(0);
  const [bookContentJson, setBookContentJson] = useState(
    initialBookContentJson,
  );

  const buildPrompt = useCallback(
    (chapterNumber: any) => {
      const { about, technology, chapters } = formValues;
      const previousChapter = chapterNumber - 1;

      const prompts = [
        `Rewrite the code below following the clean code principles for ${technology}: "${about}". No further instructions. Just code`,
        `Refactor the following code into multiple methods to improve readability and maintainability: "${sumario}". No further instructions. Just code`,
        `Refactor each method into multiple methods to improve readability and maintainability: "${sumario}". No further instructions. Just code`,
        `Refactor the following code to improve DX (developer experience): "${bookContentJson[previousChapter]}". No further instructions. Just code`,
        //`Please write unit tests to ensure its proper functioning in ${technology}: ${bookContentJson[previousChapter]}`,
      ];

      return (
        prompts[chapterNumber] ||
        `Rewrite code "${bookContentJson[previousChapter]}" using ${technology}. No further instructions. Just code ${chapters} improvements.`
      );
    },
    [formValues, sumario, bookContentJson],
  );

  const fetchSectionContent = useCallback(async (prompt: string) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const data = await fetchUrl("/api/generateSection", {
          method: "POST",
          body: JSON.stringify({ prompt }),
        });
        return data;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === 2)
          alert("Failed to generate section after multiple attempts");
      }
    }
    throw new Error("Persistent error generating section");
  }, []);

  const generateSection = useCallback(
    async (chapterNumber: number) => {
      const prompt = buildPrompt(chapterNumber);
      const data = await fetchSectionContent(prompt);
      if (!data) return;

      if (chapterNumber === 0) setSumario(data.sectionContent);
      setCusto((prev) => prev + data.costInDollars);
      return data.sectionContent;
    },
    [buildPrompt, fetchSectionContent],
  );

  const generateNextSection = useCallback(async () => {
    if (progress.currentChapter === -1 || !loading) return;

    const maxChapters = Number(formValues.chapters);
    if (progress.currentChapter < maxChapters) {
      try {
        const sectionContent = await generateSection(progress.currentChapter);
        if (sectionContent) {
          setBookContentJson((prev) => ({
            ...prev,
            [progress.currentChapter]: sectionContent,
          }));
          setBookContent((prev) => `${prev}\n\n${sectionContent}`);
          setProgress((prev) => ({
            currentChapter: prev.currentChapter + 1,
          }));
        }
      } catch (error) {
        console.error("Error generating section:", error);
      }
    } else {
      setLoading(false);
    }
  }, [
    progress,
    formValues,
    loading,
    generateSection,
    setBookContentJson,
    setBookContent,
  ]);

  return {
    progress,
    setProgress,
    loading,
    setLoading,
    bookContent,
    setBookContent,
    custo,
    sumario,
    generateNextSection,
  };
};

export const useGenerateSection = () => {
  const [formValues, handleInputChange] = useForm({
    about: "",
    chapters: 5,
    technology: "",
  });
  const [revisedContent, setRevisedContent] = useState("");
  const [ativarReview, setAtivarReview] = useState(0);

  const {
    progress,
    setProgress,
    loading,
    setLoading,
    bookContent,
    setBookContent,
    custo,
    generateNextSection,
  } = useProgress(formValues as any);

  const copyToClipboard = useCallback(
    async (content: string, alertMessage: any) => {
      try {
        await navigator.clipboard.writeText(content);
        alert(alertMessage);
      } catch {
        alert("Failed to copy content. Please try again.");
      }
    },
    [],
  );

  useEffect(() => {
    if (loading) generateNextSection();
  }, [generateNextSection, loading]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setBookContent("");
    setRevisedContent("");
    setLoading(true);
    setProgress({ currentChapter: 0 });
  };

  const handleReviewText = useCallback(() => {
    setAtivarReview((prev) => prev + 1);
    setLoading(true);
  }, [setLoading]);

  return {
    custo,
    formValues,
    loading,
    bookContent,
    revisedContent,
    handleInputChange,
    handleSubmit,
    handleReviewText,
    progress,
    ativarReview,
    copyOriginalContent: () =>
      copyToClipboard(bookContent, "Original content copied to clipboard!"),
    copyRevisedContent: () =>
      copyToClipboard(revisedContent, "Revised content copied to clipboard!"),
    setRevisedContent,
    setBookContent,
    setLoading,
    setProgress,
    setAtivarReview,
    bookContentJson: {},
  };
};
