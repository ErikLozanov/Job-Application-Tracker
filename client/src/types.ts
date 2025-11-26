export interface User {
    _id: string;
    id: number;
    name: string;
    email: string;
    token: string;
}

export interface AuthError {
    message: string;
}

export interface Job {
    resumeName?: string;
    resumeUrl?: any;
    id: number;
    company: string;
    jobTitle: string;
    status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    appliedDate?: string;
    notes?: string;
    jobUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface JobStats {
    APPLIED?: number;
    INTERVIEW?: number;
    OFFER?: number;
    REJECTED?: number;
}
