import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
class ApiService {

    private baseUrl: string;
    private authToken: string | null = null;
    private logoutCallback: ((message?: string) => void) | null = null;

    // Register logout callback from Auth Context
    onLogout(callback: (message?: string) => void) {
        this.logoutCallback = callback;
    }


    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };

        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        return headers;
    }

    // Set auth token for authenticated requests
    setAuthToken(token: string | null) {
        this.authToken = token;
    }

    //forbidden -> you are authenticated, but dont have permission
    // unauthorised -> you are not authorised (invalid credentials)
    private handleForbidden() {
        //clear token and redirect to login
        this.setAuthToken(null);
        localStorage.removeItem('token');
        if (this.logoutCallback) {
            this.logoutCallback('You do not have the permission to access this content.');
        } else {
            // Fallback redirect
            window.location.href = '/auth';
        }
    }

    // GENERIC request
    private async request<T>(endpoint: String, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: ResponseInit = {
            headers: this.getHeaders(),
            ...options,
        }

        try {
            const response = await fetch(url, config);

            // redirect to login - unauthorised
            if (response.status === 403) {
                this.handleForbidden();
                throw new Error('Forbidden: Contact your local administrator to get permissions to access this content.');
                //throw new Error(`HTTP error status: ${response.status}`);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                return errorData?.message || `HTTP error status: ${response.status}`
                // throw new Error(errorData?.message || `HTTP error status: ${response.status}`);
            }

            //204 - no content
            if (response.status === 204) {
                return null as T;
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    //GET METHOD
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET'
        });
    }

    //POST
    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : 'undefined',
        });
    }

    //PUT
    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : 'undefined',
        })
    }

    //DELETE
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        })
    }

    //File upload
    async upload<T>(endpoint: string, formData: FormData): Promise<T> {
        const url = `{this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': this.authToken ? `Bearer ${this.authToken}` : ``,
            },
            body: formData,
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`Upload failed status: ${response.status}`);
        }

        return await response.json();
    }

}

export const request = new ApiService();