
const API_URL = "http://localhost:4000/api/rag";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export interface ChatResponse {
    response: string;
}

export interface SummaryResponse {
    summary: string;
}

export interface AnalysisResponse {
    analysis: string;
}

export interface AssistantResponse {
    suggestion: string;
}

export const RagService = {
    chat: async (query: string): Promise<string> => {
        const response = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ query }),
        });
        if (!response.ok) throw new Error("Failed to chat");
        const data: ChatResponse = await response.json();
        return data.response;
    },

    getSummary: async (period: "weekly" | "monthly" | "yearly"): Promise<string> => {
        const response = await fetch(`${API_URL}/summary`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ period }),
        });
        if (!response.ok) throw new Error("Failed to get summary");
        const data: SummaryResponse = await response.json();
        return data.summary;
    },

    analyzePatterns: async (): Promise<string> => {
        const response = await fetch(`${API_URL}/pattern`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to analyze patterns");
        const data: AnalysisResponse = await response.json();
        return data.analysis;
    },

    analyzeMood: async (): Promise<string> => {
        const response = await fetch(`${API_URL}/mood`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to analyze mood");
        const data: AnalysisResponse = await response.json();
        return data.analysis;
    },

    writingAssistant: async (input: string): Promise<string> => {
        const response = await fetch(`${API_URL}/assistant`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ input }),
        });
        if (!response.ok) throw new Error("Failed to get suggestion");
        const data: AssistantResponse = await response.json();
        return data.suggestion;
    },
};
