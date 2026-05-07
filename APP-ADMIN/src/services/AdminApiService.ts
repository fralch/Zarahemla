import * as SecureStore from 'expo-secure-store';

export const ADMIN_BASE_URL = 'https://megaequipamiento.pe/admin-api-match';
const ADMIN_TOKEN_KEY = 'admin_auth_token';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  total_users: number;
  active_matches: number;
  pending_reports: number;
  pending_photos: number;
  banned_users: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  bio?: string;
  phone?: string;
  photos_count?: number;
  matches_count?: number;
  reports_count?: number;
  created_at: string;
  last_active_at?: string;
}

export interface UsersResponse {
  data: User[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface Photo {
  id: string;
  user_id: string;
  user_name: string;
  url: string;
  status: string;
  created_at: string;
}

export interface PhotosResponse {
  data: Photo[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface Settings {
  discovery_default_radius_km: number;
  daily_swipe_limit: number;
  maintenance_mode: boolean;
}

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

    async put(endpoint: string, body: any) {
        return this.request(endpoint, 'PUT', body);
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const data = await this.post('/auth/login', { email, password });
        if (data.token) {
            await this.setToken(data.token);
        }
        return data;
    }

    async logout() {
        try {
            await this.post('/auth/logout', {});
        } catch (e) {
            // Ignore errors on logout
        } finally {
            await this.setToken(null);
        }
    }

    // Dashboard
    async getDashboardStats(): Promise<DashboardStats> {
        return this.get('/dashboard/stats');
    }

    // Users
    async getUsers(params?: { search?: string; status?: string; page?: number; per_page?: number }): Promise<UsersResponse> {
        let endpoint = '/users?';
        if (params?.search) endpoint += `search=${params.search}&`;
        if (params?.status) endpoint += `status=${params.status}&`;
        if (params?.page) endpoint += `page=${params.page}&`;
        if (params?.per_page) endpoint += `per_page=${params.per_page}&`;
        return this.get(endpoint.slice(0, -1));
    }

    async getUser(userId: string): Promise<User> {
        return this.get(`/users/${userId}`);
    }

    async banUser(userId: string, reason: string, notes?: string): Promise<any> {
        return this.post(`/users/${userId}/ban`, { reason, notes });
    }

    async unbanUser(userId: string): Promise<any> {
        return this.post(`/users/${userId}/unban`, {});
    }

    // Photos moderation
    async getPhotos(params?: { status?: string; page?: number; per_page?: number }): Promise<PhotosResponse> {
        let endpoint = '/moderation/photos?';
        if (params?.status) endpoint += `status=${params.status}&`;
        if (params?.page) endpoint += `page=${params.page}&`;
        if (params?.per_page) endpoint += `per_page=${params.per_page}&`;
        return this.get(endpoint.slice(0, -1));
    }

    async approvePhoto(photoId: string): Promise<any> {
        return this.post(`/moderation/photos/${photoId}/approve`, {});
    }

    async rejectPhoto(photoId: string, reason: string): Promise<any> {
        return this.post(`/moderation/photos/${photoId}/reject`, { reason });
    }

    // Settings
    async getSettings(): Promise<Settings> {
        return this.get('/settings');
    }

    async updateSettings(settings: Settings): Promise<Settings> {
        return this.put('/settings', settings);
    }
}

const adminApiService = new AdminApiService();
export default adminApiService;
