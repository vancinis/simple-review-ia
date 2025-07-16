import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export interface ReviewSummaryOptions {
  /** Maximum character limit for the summary (default: 250) */
  maxCharacters?: number;
  /** Tone of the summary - 'friendly', 'professional', 'casual' (default: 'friendly') */
  tone?: "friendly" | "professional" | "casual";
  /** Language for the summary (default: 'es') */
  language?: string;
  /** Model to use for Gemini (default: 'gemini-1.5-flash') */
  geminiModel?: string;
  /** Model to use for OpenAI (default: 'gpt-3.5-turbo') */
  openaiModel?: string;
  /** Temperature for AI generation (default: 0.7) */
  temperature?: number;
}

export interface AIProvider {
  name: "gemini" | "openai";
  apiKey: string;
  options?: ReviewSummaryOptions;
}

export class ReviewSummarizer {
  private options: Required<ReviewSummaryOptions>;

  constructor(private provider: AIProvider) {
    this.options = {
      maxCharacters: provider.options?.maxCharacters ?? 250,
      tone: provider.options?.tone ?? "friendly",
      language: provider.options?.language ?? "es",
      geminiModel: provider.options?.geminiModel ?? "gemini-1.5-flash",
      openaiModel: provider.options?.openaiModel ?? "gpt-3.5-turbo",
      temperature: provider.options?.temperature ?? 0.7,
    };
  }

  /**
   * Generates a friendly summary from an array of review descriptions
   * @param reviews Array of review descriptions
   * @returns Promise<string> - The generated summary
   */
  async generateSummary(reviews: string[], context?: string): Promise<string> {
    if (!reviews || reviews.length === 0) {
      throw new Error("Reviews array cannot be empty");
    }

    const prompt = this.buildPrompt(reviews, context);

    try {
      switch (this.provider.name) {
        case "gemini":
          return await this.generateWithGemini(prompt);
        case "openai":
          return await this.generateWithOpenAI(prompt);
        default:
          throw new Error(`Unsupported AI provider: ${this.provider.name}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to generate summary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private buildPrompt(reviews: string[], context?: string): string {
    const toneInstructions = {
      friendly: "amistoso y cálido",
      professional: "profesional y formal",
      casual: "relajado y casual",
    };

    const reviewsText = reviews.join("\n\n");
    const contextText = context ? `\nContexto adicional: ${context}` : "";

    return `TAREA: Generar un resumen ${
      toneInstructions[this.options.tone]
    } de reseñas de clientes.

RESEÑAS A RESUMIR:
${reviewsText}${contextText}

REGLAS ESTRICTAS:
1. Genera ÚNICAMENTE un resumen conciso de las reseñas proporcionadas
2. NO agregues saludos, despedidas o comentarios adicionales
3. NO incluyas información que no esté en las reseñas originales
4. Mantén un tono ${toneInstructions[this.options.tone]}
5. Máximo ${this.options.maxCharacters} caracteres
6. Enfócate en los puntos más mencionados por los clientes
7. Si hay críticas, preséntalas de manera constructiva
8. Usa lenguaje claro y directo
9. Responde SOLO con el resumen, sin texto adicional

RESUMEN:`;
  }

  private async generateWithGemini(prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(this.provider.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.options.geminiModel,
      generationConfig: {
        temperature: this.options.temperature,
        maxOutputTokens: Math.ceil(this.options.maxCharacters / 4), // Aproximadamente 4 caracteres por token
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  }

  private async generateWithOpenAI(prompt: string): Promise<string> {
    const openai = new OpenAI({
      apiKey: this.provider.apiKey,
    });

    const completion = await openai.chat.completions.create({
      model: this.options.openaiModel,
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente especializado en generar resúmenes concisos de reseñas de clientes. Tu única tarea es crear resúmenes directos sin saludos, despedidas o comentarios adicionales. Responde únicamente con el resumen solicitado.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: this.options.temperature,
      max_tokens: Math.ceil(this.options.maxCharacters / 4), // Aproximadamente 4 caracteres por token
    });

    const text = completion.choices[0]?.message?.content || "";
    return text;
  }
}

/**
 * Creates a review summarizer instance
 * @param provider AI provider configuration
 * @returns ReviewSummarizer instance
 */
export function createReviewSummarizer(provider: AIProvider): ReviewSummarizer {
  return new ReviewSummarizer(provider);
}

/**
 * Convenience function to generate a summary directly
 * @param reviews Array of review descriptions
 * @param provider AI provider configuration
 * @returns Promise<string> - The generated summary
 */
export async function summarizeReviews(
  reviews: string[],
  provider: AIProvider,
  context?: string
): Promise<string> {
  const summarizer = createReviewSummarizer(provider);
  return await summarizer.generateSummary(reviews, context);
}
