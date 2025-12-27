import apiService from './ApiService';

class MatchService {
    constructor() {
        this.currentUser = null;
    }

    async init() {
        try {
            await apiService.init();
            if (apiService.getToken()) {
                this.currentUser = await apiService.get('/me');
                return this.currentUser;
            }
            return null;
        } catch (error) {
            console.error('Failed to load profile:', error);
            return null;
        }
    }

    async registerUser(userData) {
        try {
            const { image, ...profileData } = userData;
            
            // Call register endpoint
            const response = await apiService.post('/register', profileData);
            
            if (response.token && response.user) {
                await apiService.setToken(response.token);
                this.currentUser = response.user;

                // Upload photo if provided
                if (image) {
                    await this.uploadPhoto(image);
                }

                return this.currentUser;
            } else {
                throw new Error('Registration response missing token or user');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const response = await apiService.post('/login', { email, password });
            
            if (response.token && response.user) {
                await apiService.setToken(response.token);
                this.currentUser = response.user;
                return this.currentUser;
            } else {
                throw new Error('Login response missing token or user');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await apiService.post('/logout', {});
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            await apiService.setToken(null);
            this.currentUser = null;
        }
    }

    // AUTH / PROFILE
    getCurrentUser() {
        return this.currentUser;
    }

    async fetchCurrentUser() {
        try {
            const user = await apiService.get('/profile');
            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw error;
        }
    }

    async updateProfile(updates) {
        try {
            // Check method in docs: PUT / PATCH /profile
            await apiService.patch('/profile', updates);
            // Update local state after successful API call
            this.currentUser = { ...this.currentUser, ...updates };
            return this.currentUser;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    async uploadPhoto(photoUri) {
        try {
            const result = await apiService.uploadPhoto('/profile/photo', photoUri);
            // Refresh user to get updated photo URL if needed
            await this.fetchCurrentUser();
            return result;
        } catch (error) {
            console.error('Error uploading photo:', error);
            throw error;
        }
    }

    // DISCOVERY
    async getCandidates() {
        try {
            return await apiService.get('/candidates');
        } catch (error) {
            console.error('Error fetching candidates:', error);
            return [];
        }
    }

    // ACTIONS
    async swipe(swipedId, type) {
        try {
            const response = await apiService.post('/swipe', {
                swiped_profile_id: swipedId,
                type: type
            });
            return response;
        } catch (error) {
            console.error('Error swiping:', error);
            throw error;
        }
    }

    // MATCHES
    async getMatches() {
        try {
            return await apiService.get('/matches');
        } catch (error) {
            console.error('Error fetching matches:', error);
            return [];
        }
    }

    async getMessages(matchId) {
        try {
            return await apiService.get(`/matches/${matchId}/messages`);
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }

    async sendMessage(matchId, content) {
        try {
            return await apiService.post(`/matches/${matchId}/messages`, { content });
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}

// Singleton instance
const matchService = new MatchService();
export default matchService;
