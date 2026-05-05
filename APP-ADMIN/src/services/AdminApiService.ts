import * as SecureStore from 'expo-secure-store';

export const ADMIN_BASE_URL = 'https://megaequipamiento.pe/admin-api'; // Hypothetical admin API
const ADMIN_TOKEN_KEY = 'admin_auth_token';

class AdminApiService {
    private token: string | null = null;

    async init() {
        try {
            this.token = await SecureStore.getItemAsync(ADMIN_TOKEN_KEY);
        } catch (e) {
            console.error('Failed to load admin token', e);
        }
    }

    async setToken(token: string | null) {
        this.token = token;
        if (token) {
            await SecureStore.setItemAsync(ADMIN_TOKEN_KEY, token);
        } else {
            await SecureStore.deleteItemAsync(ADMIN_TOKEN_KEY);
        }
    }

    getToken() {
        return this.token;
    }

    async request(endpoint: string, method = 'GET', body: any = null) {
        const url = `${ADMIN_BASE_URL}${endpoint}`;
        
        const config: any = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Admin API Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Admin API Request Failed: ${method} ${endpoint}`, error);
            throw error;
        }
    }

    async get(endpoint: string) {
        return this.request(endpoint, 'GET');
    }

    async post(endpoint: string, body: any) {
        return this.request(endpoint, 'POST', body);
    }
}

const adminApiService = new AdminApiService();
export default adminApiService;
