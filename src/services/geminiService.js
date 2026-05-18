import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL_FALLBACKS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

export class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = null;

    if (this.apiKey && this.apiKey !== "your_gemini_api_key_here") {
      try {
        this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (error) {
        console.error("Error initializing Gemini service:", error);
      }
    } else {
      console.warn("API key not provided or invalid");
    }
  }

  async generateResponse(prompt) {
    if (
      !this.genAI ||
      !this.apiKey ||
      this.apiKey === "your_gemini_api_key_here"
    ) {
      throw new Error("API key chưa được cấu hình. Vui lòng kiểm tra lại.");
    }

    let lastError = null;

    for (const model of GEMINI_MODEL_FALLBACKS) {
      try {
        const response = await this.genAI.models.generateContent({
          model,
          contents: prompt,
        });

        if (response.text) {
          return response.text;
        }

        lastError = new Error(`Model ${model} không trả về nội dung.`);
      } catch (error) {
        lastError = error;
        console.warn(`Gemini model ${model} failed:`, error);

        if (!this.isTemporaryModelError(error)) {
          break;
        }
      }
    }

    throw new Error(this.formatGeminiError(lastError));
  }

  getApiKeyStatus() {
    if (!this.apiKey || this.apiKey === "your_gemini_api_key_here") {
      return {
        isValid: false,
        message: "API key chưa được cấu hình.",
      };
    }

    return {
      isValid: true,
      message: "API key đã được cấu hình",
    };
  }

  isTemporaryModelError(error) {
    const message = this.stringifyError(error);
    return (
      message.includes('"code":503') ||
      message.includes("503") ||
      message.includes("UNAVAILABLE") ||
      message.includes("high demand")
    );
  }

  stringifyError(error) {
    if (!error) {
      return "";
    }

    if (typeof error === "string") {
      return error;
    }

    return error.message || JSON.stringify(error);
  }

  formatGeminiError(error) {
    const message = this.stringifyError(error);

    if (this.isTemporaryModelError(error)) {
      return "Gemini đang quá tải tạm thời. Hệ thống đã thử model dự phòng nhưng chưa có phản hồi ổn định, bạn thử lại sau ít phút nhé.";
    }

    if (
      message.includes("API key not valid") ||
      message.includes("API_KEY_INVALID") ||
      message.includes("PERMISSION_DENIED")
    ) {
      return "Gemini API key không hợp lệ hoặc chưa được cấp quyền. Vui lòng kiểm tra lại key trên Vercel.";
    }

    if (
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.includes("quota")
    ) {
      return "Gemini API key đã chạm giới hạn sử dụng. Vui lòng thử lại sau hoặc kiểm tra quota/billing trong Google AI Studio.";
    }

    return `Lỗi khi xử lý Gemini: ${message || "Không rõ nguyên nhân"}`;
  }
}

// Export function để tạo instance mới
export const createGeminiService = (apiKey) => {
  return new GeminiService(apiKey);
};
