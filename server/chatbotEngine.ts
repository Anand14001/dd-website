import { GoogleGenAI } from '@google/genai';
import { retrieveKnowledgeChunks, KnowledgeChunk } from './knowledgeBase';
import { DIGITAL_DUDE_SYSTEM_PROMPT } from './systemPrompt';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatEngineResponse {
  reply: string;
  retrievedChunks: { id: string; title: string; category: string }[];
  mode: 'gemini' | 'rule_fallback';
}

/** Server-side Gemini client using @google/genai */
function getGeminiClient(): GoogleGenAI | null {
  let apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  // Strip accidental enclosing quotes or curlies if pasted as '{key}' or "'key'"
  if (
    (apiKey.startsWith("'") && apiKey.endsWith("'")) ||
    (apiKey.startsWith('"') && apiKey.endsWith('"')) ||
    (apiKey.startsWith('{') && apiKey.endsWith('}'))
  ) {
    apiKey = apiKey.slice(1, -1).trim();
  }
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Deterministic fallback responder strictly adhering to the 18 System Prompt rules
 * if the Gemini API key is not present or an API failure occurs.
 */
function generateGroundedFallbackResponse(
  userQuery: string,
  chunks: KnowledgeChunk[]
): string {
  const q = userQuery.toLowerCase().trim();

  // Multi-part detection: Website + Pricing ("Do you build websites and how much does it cost?" / "Website panna mudiyuma evlo cost aagum?")
  if (
    (q.includes('website') || q.includes('site')) &&
    (q.includes('cost') || q.includes('how much') || q.includes('price') || q.includes('evlo'))
  ) {
    return (
      'Yes, Digital Dude provides website development.\n\n' +
      'Digital Dude does not have fixed pricing; the cost depends on your requirements, project scope, complexity, and deliverables. ' +
      'The final price is determined after understanding your project and is confirmed by Digital Dude before the project begins.'
    );
  }

  // Multi-part: Social media / Reels + count ("How many reels do you create per month?")
  if (
    (q.includes('reel') || q.includes('post')) &&
    (q.includes('how many') || q.includes('count') || q.includes('per month') || q.includes('monthly') || q.includes('ethana'))
  ) {
    return (
      'Digital Dude provides Reels and short-form video production, as well as social media marketing and management. ' +
      "However, I don't have a confirmed monthly reel or post count for Digital Dude. " +
      'The deliverables may depend on your project requirements, but I do not have a confirmed quantity in my current information. ' +
      'Please contact Digital Dude directly for the exact deliverables.'
    );
  }

  // Pricing queries: rule 4
  if (
    q.includes('how much') ||
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('pricing') ||
    q.includes('charge') ||
    q.includes('rate') ||
    q.includes('budget') ||
    q.includes('evlo') ||
    q.includes('vilai')
  ) {
    return (
      'Digital Dude does not have fixed pricing.\n\n' +
      'The cost varies depending on:\n' +
      '• Client requirements\n' +
      '• Project scope\n' +
      '• Project complexity\n' +
      '• Deliverables\n' +
      '• Other project-specific needs\n\n' +
      'The final price is determined after understanding your specific requirements and is confirmed by Digital Dude before the project begins. Please contact Digital Dude directly to discuss your project scope.'
    );
  }

  // Working hours queries: rule 5
  if (
    q.includes('working hour') ||
    q.includes('hours') ||
    q.includes('timings') ||
    q.includes('timing') ||
    q.includes('open') ||
    q.includes('close') ||
    q.includes('24/7') ||
    q.includes('neram') ||
    q.includes('schedule')
  ) {
    return (
      "Digital Dude's regular working hours are 9:30 AM to 5:30 PM.\n\n" +
      'Customer enquiries, communication, and support are handled during these working hours. ' +
      'Digital Dude does not provide 24/7 support.'
    );
  }

  // Tanglish: Website panna mudiyuma?
  if (q.includes('website panna mudiyuma') || q.includes('site panna mudiyuma')) {
    return (
      'Yes, Digital Dude provides website development, landing page development, web application development, and e-commerce development. ' +
      'Pricing is not fixed and depends on your project requirements and scope. Please contact Digital Dude directly for exact project details.'
    );
  }

  // Tanglish: Instagram manage pannuveengala?
  if (q.includes('instagram manage') || q.includes('insta manage') || q.includes('social media manage')) {
    return (
      'Yes, Digital Dude provides Social Media Management and Social Media Marketing. ' +
      "However, I don't have confirmed information regarding the exact number of monthly posts or reels. Please contact Digital Dude directly for details tailored to your brand."
    );
  }

  // Tanglish: Reels pannuveengala?
  if (q.includes('reels pannuveengala') || q.includes('reel pannuveengala') || q.includes('can you make reels')) {
    return (
      'Yes, Digital Dude provides Reels and short-form video production, as well as videography and video editing. ' +
      'The exact deliverables and quantity depend on your project scope and are confirmed by Digital Dude.'
    );
  }

  // Tanglish: SEO result vara evlo time aagum?
  if (q.includes('seo result vara evlo time') || (q.includes('seo') && q.includes('timeline')) || (q.includes('seo') && q.includes('how long'))) {
    return (
      'Digital Dude provides SEO (Search Engine Optimization) as a confirmed service. ' +
      "However, I don't have a confirmed timeline for SEO results in my current Digital Dude information. Please contact Digital Dude directly for exact details."
    );
  }

  // Timelines query: rule 7
  if (
    q.includes('timeline') ||
    q.includes('how long') ||
    q.includes('how many days') ||
    q.includes('how many weeks') ||
    q.includes('duration')
  ) {
    return (
      "I don't have a confirmed timeline for that in my current Digital Dude information. " +
      'Project timelines depend on the requirements and scope and are confirmed by Digital Dude. Please contact Digital Dude directly for the exact details.'
    );
  }

  // Guarantees / Overclaiming test: rule 10
  if (
    q.includes('guarantee') ||
    q.includes('definitely') ||
    q.includes('100% results') ||
    q.includes('rank #1')
  ) {
    return (
      'Digital Dude does not provide unverified outcome guarantees (such as ranking guarantees or fixed lead guarantees). ' +
      'Services are provided based on client requirements, project scope, and feasibility. Please contact Digital Dude directly to evaluate your project.'
    );
  }

  // Services listing query
  if (
    q.includes('what services') ||
    q.includes('list of services') ||
    q.includes('what do you do') ||
    q.includes('all services') ||
    q.includes('services offer')
  ) {
    return (
      'Digital Dude offers the following confirmed services:\n\n' +
      '• Social Media Marketing & Management\n' +
      '• Social Media Advertising (Facebook, Instagram)\n' +
      '• Digital Marketing & Content Marketing\n' +
      '• SEO (Search Engine Optimization) & PPC Advertising\n' +
      '• Website Development & Landing Page Development\n' +
      '• Web Application & Mobile App Development\n' +
      '• E-commerce Development\n' +
      '• Website Maintenance and Support\n' +
      '• Graphic Design, Branding and Logo Design, Social Media Creatives\n' +
      '• Videography, Video Editing, Reels & Short-form Video Production\n' +
      '• Influencer Marketing\n' +
      '• Personal Branding\n' +
      '• Event Management\n' +
      '• Software Development'
    );
  }

  // Specific service checks
  if (q.includes('app') || q.includes('mobile app')) {
    return 'Yes, Digital Dude provides Mobile App Development as well as Web Application Development and Software Development. Project scope and pricing are determined based on your specific requirements.';
  }

  if (q.includes('ecommerce') || q.includes('e-commerce') || q.includes('online store') || q.includes('shop')) {
    return 'Yes, Digital Dude provides E-commerce Development. Digital Dude does not have fixed pricing; cost is confirmed after understanding your specific requirements and store scope.';
  }

  if (q.includes('influencer')) {
    return 'Yes, Digital Dude provides Influencer Marketing services, helping brands identify, collaborate with, and manage creators.';
  }

  if (q.includes('branding') || q.includes('logo')) {
    return 'Yes, Digital Dude provides Branding and Logo Design, Graphic Design, and Social Media Creatives.';
  }

  if (q.includes('fix') && (q.includes('website') || q.includes('site'))) {
    return 'Yes, Digital Dude provides Website Maintenance and Support to assist with website improvements and ongoing support.';
  }

  // Contact info query
  if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('address') || q.includes('office') || q.includes('where')) {
    return (
      'You can reach Digital Dude directly through the following confirmed channels:\n\n' +
      '• Phone: +91 97870-97006 / +91 89396-51525\n' +
      '• Email: wedigitaldude@gmail.com\n' +
      '• Office: No.90, Ramanujakoodam Street, Poonamallee, Chennai - 600056, Tamil Nadu, India\n' +
      '• Regular Working Hours: 9:30 AM to 5:30 PM (Customer communication and support are handled during these hours)'
    );
  }

  // Default missing / unconfirmed information fallback: rule 13
  return (
    "I don't have enough confirmed information about that in my current Digital Dude knowledge base. " +
    'Please contact Digital Dude directly for the exact details.'
  );
}

/**
 * Executes a question-answering turn using the RAG Chatbot architecture.
 */
export async function answerCustomerQuery(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<ChatEngineResponse> {
  const { chunks } = retrieveKnowledgeChunks(userQuery);

  const chunkMetadata = chunks.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
  }));

  // Format retrieved chunks context strictly for the LLM
  const retrievedContext = chunks
    .map(c => `=== KNOWLEDGE CHUNK: ${c.title} [${c.id}] ===\n${c.content}`)
    .join('\n\n');

  const gemini = getGeminiClient();

  if (!gemini) {
    const fallbackText = generateGroundedFallbackResponse(userQuery, chunks);
    return {
      reply: fallbackText,
      retrievedChunks: chunkMetadata,
      mode: 'rule_fallback',
    };
  }

  try {
    // Format conversation history
    const conversationTurns = history.slice(-6).map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    }));

    // Build the user message containing retrieved chunks
    const userPromptWithContext =
      `[RETRIEVED DIGITAL DUDE KNOWLEDGE BASE CONTEXT]\n` +
      `${retrievedContext}\n` +
      `[END OF RETRIEVED CONTEXT]\n\n` +
      `CUSTOMER QUESTION: ${userQuery}\n\n` +
      `Remember to adhere strictly to all 18 rules of the Digital Dude RAG Chatbot System Prompt. Answer only using the retrieved knowledge chunks above. If information is missing or unconfirmed, state clearly that it is unconfirmed and invite the customer to contact Digital Dude directly.`;

    const contents = [
      ...conversationTurns,
      {
        role: 'user',
        parts: [{ text: userPromptWithContext }],
      },
    ];

    const response = await gemini.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: DIGITAL_DUDE_SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for high factual precision
      },
    });

    const replyText = response.text?.trim();

    if (!replyText) {
      const fallbackText = generateGroundedFallbackResponse(userQuery, chunks);
      return {
        reply: fallbackText,
        retrievedChunks: chunkMetadata,
        mode: 'rule_fallback',
      };
    }

    return {
      reply: replyText,
      retrievedChunks: chunkMetadata,
      mode: 'gemini',
    };
  } catch (err) {
    console.error('[Digital Dude Assistant] Gemini API error, falling back to grounded responder:', err);
    const fallbackText = generateGroundedFallbackResponse(userQuery, chunks);
    return {
      reply: fallbackText,
      retrievedChunks: chunkMetadata,
      mode: 'rule_fallback',
    };
  }
}
