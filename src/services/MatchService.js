import apiService from './ApiService';
import { getFcmTokenForLogin } from './NotificationService';

class MatchService {
    constructor() {
        this.currentUser = null;
    }

    async init() {
        try {
            await apiService.init();
            if (apiService.getToken()) {
                this.currentUser = await apiService.get('/me');
                await this.syncPushToken();
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
            const fcmToken = await getFcmTokenForLogin();
            
            // Call register endpoint
            const response = await apiService.post('/register', {
                ...profileData,
                ...(fcmToken ? { fcm_token: fcmToken } : {}),
            });
            
            if (response.token && response.user) {
                await apiService.setToken(response.token);
                this.currentUser = response.user;
                await this.syncPushToken(fcmToken);

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
            const fcmToken = await getFcmTokenForLogin();
            const payload = {
                email,
                password,
                ...(fcmToken ? { fcm_token: fcmToken } : {}),
            };
            const response = await apiService.post('/login', payload);
            
            if (response.token && response.user) {
                await apiService.setToken(response.token);
                this.currentUser = response.user;
                await this.syncPushToken(fcmToken);
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
            // Match mobile integration says PATCH /match-api/profile
            await apiService.patch('/profile', updates);
            // Update local state after successful API call
            if (this.currentUser) {
                this.currentUser = { ...this.currentUser, ...updates };
            }
            return this.currentUser;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    async syncPushToken(existingToken = null) {
        try {
            if (!apiService.getToken()) {
                return null;
            }

            const fcmToken = existingToken || await getFcmTokenForLogin();

            if (!fcmToken) {
                return null;
            }

            await apiService.patch('/profile', { fcm_token: fcmToken });

            if (this.currentUser) {
                this.currentUser = { ...this.currentUser, fcm_token: fcmToken };
            }

            return fcmToken;
        } catch (error) {
            console.error('Error syncing push token:', error);
            return null;
        }
    }

    async updateLocation(locationData) {
        /**
         * locationData: { latitude, longitude, city, fcm_token }
         */
        try {
            return await this.updateProfile(locationData);
        } catch (error) {
            console.error('Error updating location:', error);
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
    async getCandidates(radius = 50) {
        try {
            return await apiService.get(`/candidates?radius=${radius}`);
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

    // NOTIFICATIONS
    async getNotifications() {
        try {
            return await apiService.get('/notifications');
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            return await apiService.post(`/notifications/${notificationId}/read`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    async sendTestPushNotification(title = 'Test', body = 'Push funcionando') {
        try {
            const params = new URLSearchParams({ title, body });
            return await apiService.get(`/notifications/test-push?${params.toString()}`);
        } catch (error) {
            console.error('Error sending test push notification:', error);
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

    async getMatchProfile(matchId) {
        try {
            return await apiService.get(`/matches/${matchId}/profile`);
        } catch (error) {
            console.error('Error fetching match profile:', error);
            throw error;
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
