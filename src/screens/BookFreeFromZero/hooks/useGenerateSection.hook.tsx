import { useEffect, useState, useCallback } from "react";
import { reactNativeChapters } from "../chapters";

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
        `Escreve um prefácio de no mínimo 10000 caracteres de um livro sobre "${about}"`,
        `Escreve uma introdução de no mínimo 10000 caracteres de um livro sobre "${about}"`,
        `Escreve no mínimo 10000 caracteres no Capítulo ${chapterNumber} sobre ${
          reactNativeChapters[chapterNumber - 1]
        } num livro que aborda "${about}". Incluir exemplos concretos e citações de especialistas para apoiar as tuas afirmações.`,
      ];

      return (
        prompts[chapterNumber] ||
        `Escreve no mínimo 10000 caracteres no Capítulo ${chapterNumber} sobre ${
          reactNativeChapters[chapterNumber - 1]
        } num livro que aborda "${about}". Incluir exemplos concretos e citações de especialistas para apoiar as tuas afirmações.`
        //`Rewrite code "${bookContentJson[previousChapter]}" using ${technology}. No further instructions. Just code ${chapters} improvements.`
      );
    },
    [formValues, sumario, bookContentJson],
  );

  const fetchSectionContent = useCallback(async (prompt: string) => {
    for (let attempt = 0; attempt < 3000; attempt++) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate API call

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
      const retryLimit = 5000; // Define um limite de tentativas para evitar loop infinito
      let retries = 0;
      const promptReady = true;

      while (promptReady && retries < retryLimit) {
        const prompt = buildPrompt(chapterNumber);
        const data = await fetchSectionContent(prompt);

        if (!data) {
          retries++;
        } else {
          if (chapterNumber === 0) setSumario(data.sectionContent);
          setCusto((prev) => prev + data.costInDollars);

          // Verifica se o conteúdo não contém "desculpe" ou "desculpa"
          if (
            !data?.sectionContent?.includes?.("undefined") &&
            !data?.sectionContent?.includes?.("Lamento") &&
            !data?.sectionContent?.includes?.("Desculpe") &&
            !data?.sectionContent?.includes?.("Desculpa") &&
            !data?.sectionContent?.includes?.("lamento") &&
            !data?.sectionContent?.includes?.("desculpe") &&
            !data?.sectionContent?.includes?.("desculpa")
          ) {
            console.log("DEU CERTO");
            return data.sectionContent;
          }
          console.log("NÃO DEU CERTO");

          retries++; // Incrementa o contador de tentativas}
        }
      }
      console.warn("Número máximo de tentativas atingido");
      return null; // Retorna null caso o limite de tentativas seja atingido
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
