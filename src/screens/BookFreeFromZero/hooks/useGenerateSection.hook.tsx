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
      const reactNativeChapters = [
        "Introdução ao React Native",
        "O que é React Native?",
        "Instalação do React Native",
        "Configuração do Ambiente de Desenvolvimento",
        "Criando um Novo Projeto React Native",
        "Estrutura de Pastas no React Native",
        "Diferenças entre React e React Native",
        "Componentes Básicos no React Native",
        "Utilizando o componente View",
        "Trabalhando com Text",
        "Componentes de Imagem no React Native",
        "Estilos no React Native",
        "Flexbox no React Native",
        "Posicionamento de Componentes",
        "Estilos Dinâmicos",
        "Uso de ScrollView",
        "FlatList: Listas Performáticas",
        "Seções em Listas: SectionList",
        "Botões no React Native",
        "Input de Texto com TextInput",
        "Manipulando Inputs",
        "Tratamento de Eventos",
        "Componentes Controlados e Não Controlados",
        "State e Props no React Native",
        "Hook useState",
        "Hook useEffect",
        "Context API no React Native",
        "Navegação com React Navigation",
        "Stack Navigator",
        "Tab Navigator",
        "Drawer Navigator",
        "Navegação aninhada",
        "Passando parâmetros entre telas",
        "Redux no React Native",
        "Implementando Redux",
        "Ações e Redutores",
        "Thunk e Middleware",
        "Persistência de Estado com Redux Persist",
        "Gerenciamento de Estados com MobX",
        "React Query no React Native",
        "Hooks personalizados",
        "Animações Básicas",
        "Animando Componentes com Animated",
        "Animando Layouts com LayoutAnimation",
        "Gesture Handler",
        "Trabalhando com PanResponder",
        "Swipe para Remover Itens",
        "Touchables no React Native",
        "Criação de Modais",
        "Acessando APIs com Fetch",
        "Uso de Axios para Requisições HTTP",
        "Consumindo APIs REST",
        "Autenticação com JWT",
        "Implementando Autenticação com Firebase",
        "Autenticação via OAuth",
        "Protegendo Rotas no React Native",
        "Autenticação Biométrica",
        "Persistência de Dados com AsyncStorage",
        "Uso de SQLite no React Native",
        "Trabalhando com Realm Database",
        "Salvando Arquivos Localmente",
        "Manipulando Arquivos e Uploads",
        "Trabalhando com Mapas",
        "Geolocalização no React Native",
        "Integração com Google Maps",
        "Renderizando Mapas com react-native-maps",
        "Exibindo Pins e Marcadores no Mapa",
        "Calculando Rotas com Google Maps API",
        "Notificações Push com Firebase",
        "Implementando Notificações Locais",
        "Deep Linking no React Native",
        "Acessando Câmera com expo-camera",
        "Manipulação de Imagens",
        "Leitura de Códigos QR",
        "Usando a API de Sensores",
        "Integração com Acelerômetro",
        "Trabalhando com Giroscópio",
        "Vibração do Dispositivo",
        "Uso de Audio e Video no React Native",
        "Gravação de Áudio",
        "Reprodução de Vídeos",
        "Background Tasks no React Native",
        "Uso do Bluetooth",
        "Comunicação com Dispositivos IoT",
        "Integração com WebSocket",
        "Criando um Chat com React Native",
        "Uso de Context API para Chat",
        "Integração com Firebase para Real-time",
        "Construção de UIs Responsivas",
        "Uso de Dimensions e Media Queries",
        "Estilos para Diferentes Plataformas",
        "Uso de Platform API",
        "Detecção de Versão do Sistema Operacional",
        "Integração com WebView",
        "Carregando Páginas Web no App",
        "Deep Linking para Web e App",
        "Publicação de App na Google Play Store",
        "Publicação de App na Apple App Store",
        "Gerenciamento de Certificados iOS",
        "Uso de Fastlane para Automação de Deploy",
        "Testes Unitários com Jest",
        "Testes de Integração no React Native",
        "Testes End-to-End com Detox",
        "Debugging no React Native",
        "Uso de Flipper para Depuração",
        "Performance no React Native",
        "Otimização de Listas com FlatList",
        "Memoization com React.memo",
        "Uso do useCallback e useMemo",
        "Lazy Loading de Componentes",
        "Gestão de Memória no React Native",
        "Uso de Hooks Avançados",
        "Customização de Componentes Nativos",
        "Integração com Módulos Nativos",
        "Criando Módulos Nativos para Android",
        "Criando Módulos Nativos para iOS",
        "Uso de Expo no Desenvolvimento",
        "Transição de Expo para React Native CLI",
        "Configuração de Tipografia",
        "Acessibilidade no React Native",
        "Internacionalização e Localização",
        "Tradução de Apps com react-i18next",
        "Temas Dinâmicos no React Native",
        "Modo Escuro e Modo Claro",
        "Uso de Lottie para Animações",
        "Integração com Serviços de Pagamento",
        "Pagamentos com Stripe",
        "Integração com PayPal",
        "Criação de Assinaturas Recorrentes",
        "Boas Práticas de Segurança",
        "Criptografia de Dados Locais",
        "Uso de SSL/TLS em Requisições",
        "Monitoramento de Erros com Sentry",
        "Logging de Erros no Servidor",
        "Análises de Uso com Firebase Analytics",
        "Uso de Google Analytics no React Native",
        "Estratégias de Monetização",
        "Publicidade no App com AdMob",
        "Implementação de Recursos Offline",
        "Sincronização de Dados Offline",
        "Detecção de Conectividade",
        "Uso de AppState para Gerenciar Estados",
        "Otimização de Consumo de Bateria",
        "Automação de Build e Testes",
        "Uso de CI/CD com GitHub Actions",
        "Automação de Build com Bitrise",
        "Melhores Práticas de Versionamento",
        "Manutenção de Apps em Produção",
      ];

      const prompts = [
        `Escreve um prefácio de no mínimo 10000 caracteres de um livro sobre "${about}"`,
        `Escreve uma introdução de no mínimo 10000 caracteres de um livro sobre "${about}"`,
        `Escreve no mínimo 10000 caracteres no Capítulo ${chapterNumber} sobre ${
          reactNativeChapters[chapterNumber - 1]
        }. Incluir exemplos concretos e citações de especialistas para apoiar as tuas afirmações.`,
      ];

      return (
        prompts[chapterNumber] ||
        `Escreve no mínimo 10000 caracteres no Capítulo ${chapterNumber} sobre ${
          reactNativeChapters[chapterNumber - 1]
        }. Incluir exemplos concretos e citações de especialistas para apoiar as tuas afirmações.`
        //`Rewrite code "${bookContentJson[previousChapter]}" using ${technology}. No further instructions. Just code ${chapters} improvements.`
      );
    },
    [formValues, sumario, bookContentJson],
  );

  const fetchSectionContent = useCallback(async (prompt: string) => {
    for (let attempt = 0; attempt < 3; attempt++) {
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
      const retryLimit = 5; // Define um limite de tentativas para evitar loop infinito
      let retries = 0;
      const promptReady = true;

      while (promptReady && retries < retryLimit) {
        const prompt = buildPrompt(chapterNumber);
        const data = await fetchSectionContent(prompt);

        if (!data) return;

        if (chapterNumber === 0) setSumario(data.sectionContent);
        setCusto((prev) => prev + data.costInDollars);

        // Verifica se o conteúdo não contém "desculpe" ou "desculpa"
        if (
          !data?.sectionContent?.includes?.("desculpe") &&
          !data?.sectionContent?.includes?.("desculpa")
        ) {
          console.log("DEU CERTO");
          return data.sectionContent;
        }
        console.log("NÃO DEU CERTO");

        retries++; // Incrementa o contador de tentativas
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
