/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

type BookContentJson = {
  [chapter: number]: string;
};
export const useGenerateSection = () => {
  const [formValues, setFormValues] = useState({
    about: "",
    chapters: 5,
    technology: "",
  });
  const [ativarReview, setAtivarReview] = useState(0);
  const [custo, setCusto] = useState(0);
  const [bookContent, setBookContent] = useState("");
  const [revisedContent, setRevisedContent] = useState("");
  const [sumario, setSumario] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    currentChapter: -1,
  });
  const [progress2, setProgress2] = useState({
    currentChapter: -1,
  });
  const [bookContentJson, setBookContentJson] = useState<BookContentJson>({});

  const generateSection = async (chapterNumber: number) => {
    const { about, chapters, technology } = formValues;
    const previousChapter = chapterNumber - 1;
    const prompt =
      chapterNumber === 0
        ? `liste por extenso ${chapters} coisas que ${about} precisa ter.`
        : `Escreva o código usando ${technology} para o item ${chapterNumber} da lista "${sumario}" ${
            chapterNumber > 1
              ? ` juntando e melhorando o código anterior ${bookContentJson[previousChapter]}`
              : ""
          }. Não diga nada, apenas escreva o código.`;

    let attempts = 0;
    const maxAttempts = 15;
    let success = false;
    let data: any;

    while (attempts < maxAttempts && !success) {
      try {
        const response = await fetch("/api/generateSection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Erro na resposta da API");
        }

        data = await response.json();
        success = true; // Se a resposta for bem-sucedida, encerra o loop.
      } catch (error: any) {
        attempts++;
        console.error(error);
        alert(`Tentativa ${attempts} falhou. Tentando novamente...`);
        if (attempts >= maxAttempts) {
          alert("Falha ao gerar a seção após várias tentativas.");
          throw new Error("Erro persistente ao gerar a seção.");
        }
      }
    }

    if (chapterNumber === 0) {
      setSumario(data.sectionContent);
    }
    setCusto((prev) => prev + data.costInDollars);
    return data.sectionContent;
  };

  useEffect(() => {
    const generateNextSection = async () => {
      const { currentChapter } = progress;
      if (currentChapter === -1 || loading === false) return;

      if (currentChapter <= Number(formValues.chapters)) {
        const sectionContent = await generateSection(currentChapter);
        setBookContentJson((prev) => ({
          ...prev,
          [currentChapter]: sectionContent,
        }));
        setBookContent((prev) => prev + `\n\n${sectionContent}`);
        setProgress((prev) => ({
          currentChapter: prev.currentChapter + 1,
        }));
      } else if (currentChapter < Number(formValues.chapters)) {
        setProgress((prev) => ({
          currentChapter: prev.currentChapter + 1,
        }));
      } else {
        setLoading(false);
      }
    };

    if (loading) {
      generateNextSection();
    }
  }, [progress, formValues, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookContent(""); // Reset previous book content
    setRevisedContent(""); // Reset revised content
    setLoading(true);
    setProgress({ currentChapter: 0 }); // Start from chapter 1,
  };

  const handleReviewText = async () => {
    setAtivarReview((prev) => prev + 1);
    setLoading(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyContent = () => {
    if (revisedContent) {
      navigator.clipboard.writeText(revisedContent).then(
        () => {
          alert("Conteúdo revisado copiado para a área de transferência!");
        },
        () => {
          alert("Falha ao copiar o conteúdo revisado. Tente novamente.");
        },
      );
    }
  };
  const handleCopyContentOriginal = () => {
    if (bookContent) {
      navigator.clipboard.writeText(bookContent).then(
        () => {
          alert("Conteúdo original copiado para a área de transferência!");
        },
        () => {
          alert("Falha ao copiar o conteúdo original. Tente novamente.");
        },
      );
    }
  };
  return {
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
    progress2,
    setProgress2,
    setRevisedContent,
    setBookContent,
    setLoading,
    setProgress,
    ativarReview,
    setAtivarReview,
    bookContentJson,
  };
};
