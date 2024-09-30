import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Função que gera uma única seção do capítulo com limite de 1024 tokens
export async function POST(request: NextRequest) {
  try {
    const { title, genre, description, chapter, section, previousSection } =
      await request.json();

    // Novo prompt com informações de continuidade
    const prompt =
      chapter === 0 && section === 0
        ? `
    Write a book titled "${title}" in the genre "${genre}".
    The book has the following description: "${description}".   
  `
        : `
    Write section ${section} for chapter ${chapter} of a book titled "${title}" in the genre "${genre}".
    The book has the following description: "${description}". 
    
    Continue from the previous section: "${previousSection}".
    Ensure the new section flows naturally from the previous content, providing a smooth transition. 
    The section should hint at future developments to maintain reader engagement.  
  `;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const sectionContent = completion.choices[0].message.content;
    return NextResponse.json({ sectionContent });
  } catch (error) {
    console.error("Error generating section", error);
    return NextResponse.json({ error: "Error generating section" });
  }
}
/**
 * 
 *  const prompt = `
      Write section ${section} for chapter ${chapter} of a book titled "${title}" in the genre "${genre}".
      The book has the following description: "${description}". 
      
      Continue from the previous section: "${previousSection}".
      Ensure the new section flows naturally from the previous content, providing a smooth transition. 
      The section should hint at future developments to maintain reader engagement. 
      Limit the response to 1024 tokens.
    `;

        const prompt =
      section === 0
        ? `
    Escreva a seção ${section} do capítulo ${chapter} de um livro intitulado "${title}" no gênero "${genre}". 
    O livro tem a seguinte descrição: "${description}".  3. Escreva como um ser humano, para seres humanos. Seja simples, claro, direto. Seja fluente. Autenticidade e familiaridade são ingredientes essenciais. Ajudam as pessoas a se abrir para ouvir e memorizar o que você disse.

4. Escreva aquela única coisa que você deseja que o leitor, espectador ou ouvinte memorize. Escreva isso antes de qualquer outro ponto. Em seguida, tente encurtar a mensagem para menos de uma dúzia de palavras – menos é mais. Deve ser uma frase afirmativa ou uma informação, não uma pergunta. Certifique-se de que essas palavras transmitam uma novidade ou uma informação essencial. Dispense as palavras fracas e exclua verbos ou adjetivos supérfluos. 
5. Então pare. Se não sabemos de fato o que queremos dizer – ou, o mais provável, se não entendemos de verdade sobre o que estamos escrevendo –, disfarçamos falando demais. Fazemos a mesma coisa quando terminamos um relacionamento, pedimos aumento, confessamos um erro. Não paramos de falar. É da natureza humana. E isso acaba com os relacionamentos – e com a comunicação. Então pare.

6. Liste os pontos mais importantes que você precisa apresentar. Escreva-os em ordem de importância. O primeiro é o que tem mais chance de ser lembrado.

7. Se possível, reduza sua lista de pontos importantes a um ou dois. Caso contrário, escreva-os em tópicos, não em blocos de texto.

8. Corte palavras, frases ou sentenças redundantes que existam em seções anteriores. Foque em entregar uma seção concisa e memorável que agregue valor sem explicações excessivas.
 
8. Faça uma revisão rigorosa. Tal ponto, detalhe ou conceito é essencial? Se for, existe uma forma mais simples de comunicá-lo? 

9. Corte, corte, corte. Que palavras, frases ou parágrafos você pode eliminar antes de enviar? Cada palavra ou frase que puder cortar economiza tempo do outro. Menos é mais.


10. Já comece parando. Pare de usar palavras em excesso em um título ou campo de assunto. Limite-se a no máximo seis palavras. Pare de ser engraçadinho. Ou irônico. Ou enigmático. Isso confunde e não é inteligente. Pare de usar palavras complicadas ou jargão corporativo. 

11. Depois de se desfazer dos maus hábitos, desenvolva novos hábitos saudáveis. Usando seis palavras ou menos, deixe claro o motivo pelo qual você decidiu escrever algo. Escreva da forma mais provocativa e precisa possível. Palavras curtas são fortes.
 Regra de ouro: uma palavra de duas sílabas é mais forte do que uma palavra de três sílabas, que é mais forte do que uma palavra de quatro. Palavras fortes são melhores do que palavras fracas e supérfluas. Use SEMPRE a voz ativa. 


12. Identifique e saliente UMA coisa que você quer que as pessoas fiquem sabendo. E faça isso em UMA única frase forte. Senão ninguém jamais se lembrará dela. Este é o ponto mais importante


13. Não repita a provocação tal como escreveu antes. (Caso tenha usado uma.)
 14. Elimine advérbios, palavras fracas e palavras difíceis. Está direto, sucinto e claro? 

15. Agora pergunte a si mesmo: Se essa for a ÚNICA coisa que a pessoa vai ler ou ouvir, é exatamente o que você quer transmitir? Se for, continue.

16. Use esses axiomas : porque isso é importante • Panorama geral • O que vem por aí • O que temos visto • O que temos escutado • As entrelinhas • Pano de fundo • Atualização rápida • Em detalhes • Em perspectiva 

17. “Por que isso é importante” é o axioma mais recorrente e eficaz. As pessoas estão ocupadas e com a mente confusa. Elas anseiam por contexto, mesmo que não saibam nem manifestem isso. Coloque em negrito as palavras “Por que isso é importante”.
18. Depois de “Por que isso é importante”, explique em uma frase – ou no máximo duas – por que as informações em sua frase principal são relevantes. O que vai mudar? Uma política, um ramo de negócios, uma estratégia, uma abordagem? O que isso indica? Uma mudança de paradigma, uma tendência? Qual é o contexto mais amplo? É algo inesperado, intrigante, marcante? É relevante para algo que já foi discutido? 

19.A frase – ou as frases – deve ser direta e assertiva. NÃO se pode ser redundante na frase de abertura. Ela deve acrescentar alguma coisa e oferecer perspectiva. Repita em voz alta o lide e o axioma. Se alguém ouvir apenas os dois, vai captar a essência da sua mensagem? Conceito de sucesso: dizer ou escrever algo tão novo, essencial e fascinante que seu público ficou querendo mais. 

20. Agora, leia as três partes juntas: título, primeira frase e axioma. Se essas palavras forem tudo que uma pessoa irá ler, elas transmitem o que mais importa da forma mais direta e compreensível possível? Se a resposta for sim, você fez mais com 200 palavras do que a maioria das pessoas faz com 20 mil.

21. Use tópicos sempre que for preciso. São uma ótima forma de isolar fatos ou ideias importantes. Pense em como você passa os olhos procurando por algo que salte à vista. Um tópico quebra o texto e se destaca pelo espaçamento e pelo ritmo que impõe. Regra de Ouro dos Tópicos: ninguém quer ficar olhando para um amontoado de palavras e números. Se você quer explicar três ou mais dados diferentes ou ideias relacionadas, divida-os em tópicos. Fica bem mais amigável.

 22.Dê destaque. A esta altura, você já entendeu que a maioria das pessoas está só passando os olhos pelo que você escreve. Se você quer que um axioma, uma palavra ou um dado específico se destaque, coloque-o em negrito. É mais forte e mais perceptível do que o itálico – e se destaca visivelmente do texto padrão. Ele grita: “Preste atenção aqui!” 

23. Misture tudo. Fuja de parágrafos extensos. Atenha-se a duas ou três frases no máximo. Tente evitar longos parágrafos consecutivos. Use negrito, tópicos, gráficos e axiomas para quebrar o fluxo da leitura. Massas de texto muito grandes são maçantes. 

24. Apenas pare. O maior erro nas comunicações, o que mais desperdiça tempo, é falar ou escrever demais. Seja um monge na disciplina com as palavras e zen na alegria interior de dizer mais com menos. Isso não é natural nem fácil, mas pode ser aprendido com a prática. Lembre-se de que você está poupando o tempo dos outros – e o seu – para atividades mais significativas. Essa deve ser a sua bússola. A melhor comunicação costuma ser o silêncio.  
    `
        : ` Continue o livro "${title}" da seção anterior: "${previousSection}" 
  
    Comece com uma provocação poderosa de seis palavras para capturar a atenção. 
    Em seguida, continue com uma frase de abertura forte, direta, clara e envolvente, revelando algo novo, surpreendente ou essencial. 
  
    Após a abertura, explique em uma ou duas frases concisas por que essa seção é relevante no contexto maior do assunto. Isso ajudará o leitor a entender sua importância sem se sentir sobrecarregado.
 Concentre-se em UMA pessoa com quem quer se comunicar.  Determine UMA coisa que você quer que ela memorize.
 
    .
    `;
 */
