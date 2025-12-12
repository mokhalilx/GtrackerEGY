import { GoogleGenAI } from "@google/genai";
import { GoldData, MarketAnalysis, TrendDirection, NewsItem, Language } from "../types";

const processApiKey = process.env.API_KEY;

// Regex patterns to extract data from the text response
const PRICE_24K_REGEX = /Price24k:\s*([\d,.]+)/i;
const PRICE_21K_REGEX = /Price21k:\s*([\d,.]+)/i;
const PRICE_18K_REGEX = /Price18k:\s*([\d,.]+)/i;
const USD_REGEX = /USDRate:\s*([\d,.]+)/i;
const WORKMANSHIP_MIN_REGEX = /WorkmanshipMin:\s*([\d,.]+)/i;
const WORKMANSHIP_MAX_REGEX = /WorkmanshipMax:\s*([\d,.]+)/i;
const PREDICTION_REGEX = /Prediction:\s*(UP|DOWN|STABLE)/i;

const NEWS_1_REGEX = /News1:\s*([^|]+)\s*\|\s*(.+)/i;
const NEWS_2_REGEX = /News2:\s*([^|]+)\s*\|\s*(.+)/i;
const NEWS_3_REGEX = /News3:\s*([^|]+)\s*\|\s*(.+)/i;


const ai = new GoogleGenAI({ apiKey: processApiKey });

export const fetchGoldMarketData = async (language: Language): Promise<{ data: GoldData; analysis: MarketAnalysis }> => {
  if (!processApiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const langInstruction = language === 'ar' 
    ? "Write your analysis, summary, and news headlines in Arabic." 
    : "Write your analysis, summary, and news headlines in English.";

  const prompt = `
    You are a financial analyst specializing in the Egyptian Gold Market.
    
    Task:
    1. Search for the CURRENT live gold prices in Egypt for 24k, 21k, and 18k gold in Egyptian Pounds (EGP).
    2. Search for the current USD to EGP exchange rate (official and parallel market).
    3. Search for the current estimated "Masnahiya" (workmanship/craftsmanship fees) range per gram for 21k gold in Egypt (Min and Max values in EGP).
    4. Find 3 brief, high-impact local news headlines regarding the gold market in Egypt.
    5. Analyze the data to predict if prices will go UP, DOWN, or remain STABLE in the short term.
    6. ${langInstruction}

    Output Format:
    Provide a detailed text analysis first. 
    
    CRITICAL: At the very end of your response, you MUST include a summary block EXACTLY in this format for parsing. 
    IMPORTANT: The keys (Price24k, WorkmanshipMin, etc.) MUST REMAIN IN ENGLISH.

    --- DATA START ---
    Price24k: [Number only, remove commas]
    Price21k: [Number only, remove commas]
    Price18k: [Number only, remove commas]
    USDRate: [Number only]
    WorkmanshipMin: [Number only]
    WorkmanshipMax: [Number only]
    News1: [Headline] | [Source Name]
    News2: [Headline] | [Source Name]
    News3: [Headline] | [Source Name]
    Prediction: [UP or DOWN or STABLE]
    --- DATA END ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract structured data using Regex
    const p24 = text.match(PRICE_24K_REGEX)?.[1]?.replace(/,/g, '');
    const p21 = text.match(PRICE_21K_REGEX)?.[1]?.replace(/,/g, '');
    const p18 = text.match(PRICE_18K_REGEX)?.[1]?.replace(/,/g, '');
    const usd = text.match(USD_REGEX)?.[1]?.replace(/,/g, '');
    const wMin = text.match(WORKMANSHIP_MIN_REGEX)?.[1]?.replace(/,/g, '');
    const wMax = text.match(WORKMANSHIP_MAX_REGEX)?.[1]?.replace(/,/g, '');
    const predMatch = text.match(PREDICTION_REGEX)?.[1]?.toUpperCase();

    // Extract News
    const news: NewsItem[] = [];
    const n1 = text.match(NEWS_1_REGEX);
    const n2 = text.match(NEWS_2_REGEX);
    const n3 = text.match(NEWS_3_REGEX);

    if (n1) news.push({ headline: n1[1].trim(), source: n1[2].trim() });
    if (n2) news.push({ headline: n2[1].trim(), source: n2[2].trim() });
    if (n3) news.push({ headline: n3[1].trim(), source: n3[2].trim() });

    const prediction = (['UP', 'DOWN', 'STABLE'].includes(predMatch || '') 
      ? predMatch 
      : 'STABLE') as TrendDirection;

    // Clean up the analysis text by removing the data block
    const analysisText = text.split('--- DATA START ---')[0].trim();

    // Extract sources for the analysis box
    const sources = groundingChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || "Source",
        url: chunk.web?.uri || "#",
      }))
      .filter((s: any) => s.url !== "#");

    const uniqueSources = Array.from(new Map(sources.map((item:any) => [item.url, item])).values());

    return {
      data: {
        price24k: parseFloat(p24 || "0"),
        price21k: parseFloat(p21 || "0"),
        price18k: parseFloat(p18 || "0"),
        usdRate: parseFloat(usd || "0"),
        workmanshipMin: parseFloat(wMin || "60"),
        workmanshipMax: parseFloat(wMax || "150"),
        lastUpdated: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US'),
      },
      analysis: {
        prediction: prediction as 'UP' | 'DOWN' | 'STABLE',
        summary: analysisText,
        reasoning: [],
        sources: uniqueSources as any,
        news: news
      }
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};