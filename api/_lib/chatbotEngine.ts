import { GoogleGenAI } from '@google/genai';
import { retrieveKnowledgeChunks, KnowledgeChunk } from './knowledgeBase.js';
import { DIGITAL_DUDE_SYSTEM_PROMPT } from './systemPrompt.js';

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
  let apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.VITE_GEMINI_API_KEY?.trim();

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
 * Natural, consultative human fallback responder.
 * Even when running in fallback mode, it speaks like a warm, knowledgeable
 * team member rather than a robotic disclaimer engine.
 */
function generateGroundedFallbackResponse(
  userQuery: string,
  chunks: KnowledgeChunk[]
): string {
  const q = userQuery.toLowerCase().trim();

  // Playful persona check: Pirate test
  if (q.includes('pirate')) {
    return (
      'Ahoy matey! We at Digital Dude craft fine digital vessels—sleek websites and apps—built to weather any storm across the seven seas! ' +
      'Our crew hoists your banners high with fierce social media and marketing magic to bring ye a bountiful chest of gold and sales! ' +
      'Hail our captain directly, and we’ll chart a custom course fit for yer grand voyage!'
    );
  }

  // Playful persona check: Poet / rhyming
  if (q.includes('poem') || q.includes('rhyme')) {
    return (
      'Websites that fly and brands that shine,\n' +
      'Social media campaigns that draw the line!\n' +
      'From Chennai to the world we fuel your pride—\n' +
      'With Digital Dude as your trusted guide!\n\n' +
      'What kind of project can we create together today?'
    );
  }

  // Greetings & casual warm openers
  if (/^(hi|hello|hey|vanakkam|good morning|good afternoon|good evening|yo)\b/i.test(q)) {
    return (
      "Hey there! 👋 I'm here from the Digital Dude team in Chennai. " +
      'Whether you want to build a high-speed website, scale your sales with paid ads, or level up your social media with viral Reels — we have got you covered! ' +
      'What kind of business are you running?'
    );
  }

  // Multi-part detection: Website + Pricing ("Do you build websites and how much does it cost?" / "Website panna mudiyuma evlo cost aagum?")
  if (
    (q.includes('website') || q.includes('site')) &&
    (/\b(cost|price|how much|pricing|budget)\b/i.test(q) || q.includes('evlo'))
  ) {
    return (
      'Yes, absolutely! We build modern, high-converting websites and web applications tailored specifically to your goals. ' +
      'Since every project is different—a clean 5-page brand site is very different from a full e-commerce shop—we provide custom quotes based on your exact scope. ' +
      'Are you looking to launch something fresh from scratch, or revamp an existing site?'
    );
  }

  // Pricing / Cost queries (with word boundary to prevent matching "pirate" on "rate"!)
  if (
    /\b(how much|price|cost|pricing|charge|rates?|budget)\b/i.test(q) ||
    q.includes('evlo') ||
    q.includes('vilai')
  ) {
    return (
      "Since every website, campaign, and brand we build is custom-tailored to what you need, we don't have rigid, one-size-fits-all price tags! " +
      'We first understand your goals and deliverables, and then give you a transparent, crystal-clear proposal before starting. ' +
      'What kind of project do you have in mind right now?'
    );
  }

  // Multi-part: Social media / Reels + count ("How many reels do you create per month?")
  if (
    (q.includes('reel') || q.includes('post')) &&
    (q.includes('how many') || q.includes('count') || q.includes('per month') || q.includes('monthly') || q.includes('ethana'))
  ) {
    return (
      'We produce dynamic, high-engagement Reels and short-form videos tailored to your industry! ' +
      'The exact volume depends on your growth strategy—some brands see great traction with 3 high-impact Reels a week, while others prefer daily content paired with paid ads. ' +
      'Would you like our team to take a look at your social accounts and suggest an ideal plan?'
    );
  }

  // Working hours queries
  if (
    q.includes('working hour') ||
    /\b(hours|timings|timing|open|close|schedule)\b/i.test(q) ||
    q.includes('24/7') ||
    q.includes('neram')
  ) {
    return (
      'Our team is active Monday through Saturday from 9:30 AM to 5:30 PM IST. ' +
      'You can reach us anytime during these hours at +91 97870-97006 or wedigitaldude@gmail.com. ' +
      'Would you like to drop your details so we can reach out at a time that works best for you?'
    );
  }

  // Tanglish: Website panna mudiyuma?
  if (q.includes('website panna mudiyuma') || q.includes('site panna mudiyuma')) {
    return (
      'Kandippa pannalam! We build lightning-fast, custom websites, landing pages, and e-commerce stores tailored to your business. ' +
      'What kind of business do you run, and what features do you have in mind?'
    );
  }

  // Tanglish: Instagram manage pannuveengala?
  if (q.includes('instagram manage') || q.includes('insta manage') || q.includes('social media manage')) {
    return (
      'Yes, kandippa! We handle complete Social Media Management—creative design, copywriting, Reels production, and targeted growth campaigns. ' +
      'Are you starting a fresh profile, or looking to scale an existing Instagram page?'
    );
  }

  // Tanglish: Reels pannuveengala?
  if (q.includes('reels pannuveengala') || q.includes('reel pannuveengala') || q.includes('can you make reels')) {
    return (
      'Yes, 100%! We handle end-to-end Reels production: ideation, scripting, professional filming, and trend-focused video editing. ' +
      'What niche or industry is your brand in?'
    );
  }

  // SEO inquiries
  if (q.includes('seo') && (q.includes('result') || q.includes('time') || q.includes('rank') || q.includes('how long'))) {
    return (
      'Yes, we provide end-to-end SEO (technical on-page, content strategy, and keyword optimization) to drive qualified organic traffic! ' +
      'Organic search results naturally build momentum over time depending on your market competition and domain health. ' +
      'Do you have an existing website we can audit for you?'
    );
  }

  // Timelines query
  if (
    q.includes('timeline') ||
    q.includes('how long') ||
    q.includes('how many days') ||
    q.includes('how many weeks') ||
    q.includes('duration')
  ) {
    return (
      'Our delivery timelines depend on the project scope! For example, a focused landing page can launch in a matter of days, while a multi-feature web application or custom e-commerce portal takes a bit longer. ' +
      'After a quick 10-minute scoping chat, we give you a concrete milestone roadmap. What are you looking to launch?'
    );
  }

  // Guarantees / Overclaiming query
  if (
    q.includes('guarantee') ||
    q.includes('definitely') ||
    q.includes('100% results') ||
    q.includes('rank #1')
  ) {
    return (
      'We believe in data-driven execution, transparent reporting, and battle-tested marketing rather than empty promises or fake "guarantees". ' +
      'Our focus is on real ROI—building high-converting digital assets and running measurable campaigns that actually bring leads and sales. ' +
      'What are your primary growth targets for the next 3 to 6 months?'
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
      'We are a full-service digital agency! Our core services include:\n\n' +
      '• Custom Website & Web App Development\n' +
      '• E-commerce & Mobile App Development\n' +
      '• Social Media Management & Viral Reels Production\n' +
      '• Performance Ads (Meta & Google Ads)\n' +
      '• SEO & Content Marketing\n' +
      '• Branding, Logo Design & Creative Graphics\n' +
      '• Influencer Marketing & Personal Branding\n\n' +
      'Which of these areas are you most excited to grow right now?'
    );
  }

  // App inquiries
  if (/\b(apps?|mobile apps?)\b/i.test(q)) {
    return (
      'Yes! We build sleek, reliable mobile apps for iOS and Android, as well as full-stack web applications. ' +
      'What core features or purpose do you have in mind for your app?'
    );
  }

  // E-commerce inquiries
  if (q.includes('ecommerce') || q.includes('e-commerce') || q.includes('online store') || q.includes('shop')) {
    return (
      'Yes, we specialize in high-converting e-commerce stores! From fast product browsing to seamless checkout and payment gateway integrations, we make sure buying from you is effortless. ' +
      'What kind of products do you sell?'
    );
  }

  // Branding inquiries
  if (q.includes('branding') || q.includes('logo')) {
    return (
      'Yes! We craft complete brand identities—from memorable logos and typography systems to social media visual kits and packaging design. ' +
      'Are you launching a new brand or giving your current look a modern refresh?'
    );
  }

  // Contact info query
  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('email') ||
    q.includes('address') ||
    q.includes('office') ||
    q.includes('where')
  ) {
    return (
      'We would love to connect with you! Here is how you can reach our team directly:\n\n' +
      '• Phone: +91 97870-97006 / +91 89396-51525\n' +
      '• Email: wedigitaldude@gmail.com\n' +
      '• Office: No.90, Ramanujakoodam Street, Poonamallee, Chennai - 600056, Tamil Nadu, India\n' +
      '• Hours: Mon–Sat, 9:30 AM to 5:30 PM IST\n\n' +
      'Would you like us to give you a quick call to discuss your project?'
    );
  }

  // Default warm consultative response
  return (
    'We would love to help you with that! At Digital Dude, we tailor our digital marketing and web solutions directly to what your business needs. ' +
    'Could you tell me a little more about your project and what you are looking to achieve?'
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

    // Build the user message containing retrieved chunks and conversational instructions
    const userPromptWithContext =
      `[RETRIEVED DIGITAL DUDE KNOWLEDGE BASE CONTEXT]\n` +
      `${retrievedContext}\n` +
      `[END OF RETRIEVED CONTEXT]\n\n` +
      `CUSTOMER MESSAGE: ${userQuery}\n\n` +
      `INSTRUCTIONS:\n` +
      `- Chat warmly in the first person ("we", "our team") as a friendly digital consultant at Digital Dude in Chennai.\n` +
      `- Keep your answer punchy and natural (2 to 4 sentences or a quick conversational note). Avoid rigid disclaimers or bullet walls.\n` +
      `- Follow the Answer + Ask rule: answer their question clearly using our confirmed services, then ask a friendly question to learn more about their business.\n` +
      `- If the customer asked you to adopt a specific persona, tone, or style (e.g., pirate, playful, rhyming, Tanglish), enthusiastically play along in that character while keeping our core facts true!`;

    const contents = [
      ...conversationTurns,
      {
        role: 'user',
        parts: [{ text: userPromptWithContext }],
      },
    ];

    let replyText = '';
    const envModel = process.env.GEMINI_MODEL?.trim();
    // Proactively filter out deprecated models (e.g. gemini-2.0-flash, gemini-1.5-*, etc.)
    const isDeprecated =
      envModel &&
      (envModel.includes('2.0') ||
        envModel.includes('1.5') ||
        envModel === 'gemini-pro' ||
        envModel.startsWith('models/gemini-2.0') ||
        envModel.startsWith('models/gemini-1.5'));

    // Primary model is gemini-3.8-flash unless user configured a valid non-deprecated custom model
    const primaryModel = !envModel || isDeprecated ? 'gemini-3.8-flash' : envModel;

    // Use active Gemini models in priority order per @google/genai guidelines
    const modelsToTry = [
      primaryModel,
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
    ].filter(
      (model, idx, arr) =>
        arr.indexOf(model) === idx &&
        !model.includes('2.0') &&
        !model.includes('1.5') &&
        model !== 'gemini-pro'
    );

    for (const model of modelsToTry) {
      try {
        const response = await gemini.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: DIGITAL_DUDE_SYSTEM_PROMPT,
            temperature: 0.7, // Human warmth, conversational rhythm, and playful adaptability
          },
        });
        if (response.text?.trim()) {
          replyText = response.text.trim();
          break;
        }
      } catch (modelErr) {
        console.warn(`[Digital Dude Assistant] Model ${model} unavailable, trying next if available:`, modelErr instanceof Error ? modelErr.message : modelErr);
      }
    }

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
    console.error('[Digital Dude Assistant] Gemini API error, falling back to consultative responder:', err);
    const fallbackText = generateGroundedFallbackResponse(userQuery, chunks);
    return {
      reply: fallbackText,
      retrievedChunks: chunkMetadata,
      mode: 'rule_fallback',
    };
  }
}
