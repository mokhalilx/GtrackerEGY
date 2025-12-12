import { GoogleGenAI, Type } from "@google/genai";
import { GoldData, MarketAnalysis, TrendDirection, HistoricalDataPoint, Language } from "../types";

const processApiKey = process.env.API_KEY;

// Regex patterns to extract data from the text response
const PRICE_24K_REGEX = /Price24k:\s*([\d,.]+)/i;
const PRICE_21K_REGEX = /Price21k:\s*([\d,.]+)/i;
const PRICE_18K_REGEX = /Price18k:\s*([\d,.]+)/i;
const USD_REGEX = /USDRate:\s*([\d,.]+)/i;
const PREDICTION_REGEX = /Prediction:\s*(UP|DOWN|STABLE)/i;

const ai = new GoogleGenAI({ apiKey: processApiKey });

export const fetchGoldMarketData = async (language: Language): Promise<{ data: GoldData; analysis: MarketAnalysis }> => {
  if (!processApiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const langInstruction = language === 'ar' 
    ? "Write your analysis/summary in Arabic." 
    : "Write your analysis/summary in English.";

  const prompt = `
    You are a financial analyst specializing in the Egyptian Gold Market.
    
    Task:
    1. Search for the CURRENT live gold prices in Egypt for 24k, 21k, and 18k gold in Egyptian Pounds (EGP).
    2. Search for the current USD to EGP exchange rate (both official bank rate and parallel market if available/relevant).
    3. Search for the latest financial news in Egypt affecting gold prices (inflation, central bank decisions, global gold trends).
    4. Analyze the data to predict if prices will go UP, DOWN, or remain STABLE in the short term.
    5. ${langInstruction}

    Output Format:
    Provide a detailed text analysis first. 
    
    CRITICAL: At the very end of your response, you MUST include a summary block EXACTLY in this format for parsing. 
    IMPORTANT: The keys (Price24k, Price21k, etc.) MUST REMAIN IN ENGLISH regardless of the response language.

    --- DATA START ---
    Price24k: [Number only, remove commas]
    Price21k: [Number only, remove commas]
    Price18k: [Number only, remove commas]
    USDRate: [Number only]
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
    const predMatch = text.match(PREDICTION_REGEX)?.[1]?.toUpperCase();

    const prediction = (['UP', 'DOWN', 'STABLE'].includes(predMatch || '') 
      ? predMatch 
      : 'STABLE') as TrendDirection;

    // Clean up the analysis text by removing the data block
    const analysisText = text.split('--- DATA START ---')[0].trim();

    // Extract sources
    const sources = groundingChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || "Source",
        url: chunk.web?.uri || "#",
      }))
      .filter((s: any) => s.url !== "#");

    // Remove duplicates
    const uniqueSources = Array.from(new Map(sources.map((item:any) => [item.url, item])).values());

    return {
      data: {
        price24k: parseFloat(p24 || "0"),
        price21k: parseFloat(p21 || "0"),
        price18k: parseFloat(p18 || "0"),
        usdRate: parseFloat(usd || "0"),
        lastUpdated: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US'),
      },
      analysis: {
        prediction: prediction as 'UP' | 'DOWN' | 'STABLE',
        summary: analysisText,
        reasoning: [], // Simplified for this approach, the summary contains the reasoning
        sources: uniqueSources as any,
      }
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const fetchHistoricalData = async (timeRange: '1W' | '1M' | '3M'): Promise<HistoricalDataPoint[]> => {
  if (!processApiKey) return [];

  const daysMap = { '1W': 7, '1M': 30, '3M': 90 };
  const days = daysMap[timeRange];

  const prompt = `
    Search for the daily closing price history of 21k Gold in Egypt (EGP per gram) and the USD to EGP exchange rate for the last ${days} days.
    
    If exact daily data is not available for every single day, provide a representative sample of about 10-20 data points spread evenly across the period to show the trend.
    
    Return the data as a JSON object with a "history" property containing an array of objects.
    Each object must have:
    - "date": string in "MM-DD" format
    - "price21k": number (approximate price)
    - "usdRate": number (approximate rate)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            history: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  price21k: { type: Type.NUMBER },
                  usdRate: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText);
    return parsed.history || [];

  } catch (error) {
    console.error("Historical Data Fetch Error:", error);
    return [];
  }
};