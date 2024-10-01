import { useEffect, useState } from "react";
// Componente para os inputs do formulário com estilização

type BookContentJson = {
  [chapter: number]: {
    [section: number]: string;
  };
};
export const useGenerateSection = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    genre: "",
    description: "",
    chapters: 5,
    totalSections: 3,
  });
  const [ativarReview, setAtivarReview] = useState(0);
  const [custo, setCusto] = useState(0);
  const [bookContent, setBookContent] = useState("");
  const [revisedContent, setRevisedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    currentChapter: 0,
    currentSection: 0,
  });
  const [progress2, setProgress2] = useState({
    currentChapter: 1,
    currentSection: 1,
  });
  const [bookContentJson, setBookContentJson] = useState<BookContentJson>({});

  const generateSection = async (
    chapterNumber: number,
    sectionNumber: number,
  ) => {
    const { title, genre, description } = formValues;
    const previousSection = sectionNumber - 1;
    const prompt =
      chapterNumber === 1 && sectionNumber === 1
        ? `
Write a book titled "${title}" in the genre "${genre}".
The book has the following description: "${description}".   
`
        : `
Write section ${sectionNumber} for chapter ${chapterNumber} of a book titled "${title}" in the genre "${genre}".
The book has the following description: "${description}". 

Continue from the previous section: "${previousSection}".
Ensure the new section flows naturally from the previous content, providing a smooth transition. 
The section should hint at future developments to maintain reader engagement.  
`;
    const response = await fetch("/api/generateSection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setCusto((prev) => prev + data.costInDollars);
    return data.sectionContent;
  };

  const reviewText = async ({ currentChapter, currentSection, text }: any) => {
    const response = await fetch("/api/reviewText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formValues,
        text,
        currentChapter,
        currentSection,
        previousSection: currentSection - 1,
      }),
    });

    const data = await response.json();
    setCusto((prev) => prev + data.costInDollars);

    return data.sectionContent;
  };

  useEffect(() => {
    const generateNextSection = async () => {
      const { currentChapter, currentSection } = progress;
      if (currentChapter === 0 || loading === false) return;

      if (currentChapter <= Number(formValues.chapters)) {
        if (currentSection <= Number(formValues.totalSections)) {
          const sectionContent = await generateSection(
            currentChapter,
            currentSection,
          );
          setBookContentJson((prev) => ({
            ...prev,
            [currentChapter]: {
              ...(prev[currentChapter] ?? {}),
              [currentSection]: sectionContent,
            },
          }));
          setBookContent((prev) => prev + `\n\n${sectionContent}`);

          setProgress((prev) => ({
            ...prev,
            currentSection: prev.currentSection + 1,
          }));
        } else if (currentChapter < Number(formValues.chapters)) {
          setProgress((prev) => ({
            currentChapter: prev.currentChapter + 1,
            currentSection: 1,
          }));
        } else {
          setLoading(false);
        }
      }
    };

    if (loading && ativarReview < 1) {
      generateNextSection();
    }
  }, [progress, formValues, loading, ativarReview]);
  useEffect(() => {
    const generateNextSectionReview = async () => {
      const { currentChapter, currentSection } = progress2;

      if (currentChapter === 0 || loading === false) return;

      if (currentChapter <= Number(formValues.chapters)) {
        if (currentSection <= Number(formValues.totalSections)) {
          const text = bookContentJson[currentChapter][currentSection];
          const sectionContent = await reviewText({
            currentChapter,
            currentSection,
            text,
          });
          setRevisedContent((prev) => prev + `\n\n${sectionContent}`);

          setProgress2((prev) => ({
            ...prev,
            currentSection: prev.currentSection + 1,
          }));
        } else if (currentChapter < Number(formValues.chapters)) {
          setProgress2((prev) => ({
            currentChapter: prev.currentChapter + 1,
            currentSection: 1,
          }));
        } else {
          setLoading(false);
        }
      }
    };
    console.log(progress2, loading, ativarReview);
    if (ativarReview > 0 && loading) {
      generateNextSectionReview();
    }
  }, [progress2, formValues, loading, ativarReview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookContent(""); // Reset previous book content
    setRevisedContent(""); // Reset revised content
    setLoading(true);
    setProgress({ currentChapter: 1, currentSection: 1 }); // Start from chapter 1, section 1
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
    reviewText,
  };
};
