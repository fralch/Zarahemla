
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://megaequipamiento.pe/match-api';
const TOKEN_KEY = 'auth_token';

class ApiService {
    constructor() {
        this.token = null;
    }

    async init() {
        try {
            this.token = await SecureStore.getItemAsync(TOKEN_KEY);
        } catch (e) {
            console.error('Failed to load token', e);
        }
    }

    async setToken(token) {
        this.token = token;
        if (token) {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    }

    getToken() {
        return this.token;
    }

    async request(endpoint, method = 'GET', body = null, headers = {}) {
        const url = new URL(`${BASE_URL}${endpoint}`);
        
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            }
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url.toString(), config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    this.setToken(null);
                }
                throw new Error(data.message || `API Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Request Failed: ${method} ${endpoint}`, error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    async post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    }

    async patch(endpoint, body) {
        return this.request(endpoint, 'PATCH', body);
    }
    
    async put(endpoint, body) {
        return this.request(endpoint, 'PUT', body);
    }

    async uploadPhoto(endpoint, photoUri) {
        const url = new URL(`${BASE_URL}${endpoint}`);
        
        const formData = new FormData();
        const filename = photoUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('photo', {
            uri: photoUri,
            name: filename,
            type,
        });

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                body: formData,
                headers: headers,
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Upload Error: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error('Photo Upload Failed', error);
            throw error;
        }
    }
}

const apiService = new ApiService();
export default apiService;
