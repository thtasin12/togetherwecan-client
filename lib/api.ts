export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function api<T = unknown>(
    path: string,
    options: RequestInit = {}): Promise<T> {
        const res = await fetch(`${API_URL}${path}`, {
            credentials: "include",
            headers: {"Content-Type": "application/json", ...(options.headers || {})}, ...options
        })
        const data = await res.json().catch(() => {
            console.log(``)
        })

        if(!res.ok) {
            throw new ApiError(res.status, (data as {message?: string}).message || "Something went wrong")
        }

        return data as T

    }

export class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}