import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import MatchService from '../../services/MatchService';
import Loading from '../../components/Loading';
import { colors } from '../../theme/colors';

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await MatchService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadNotifications();
    };

    const handleSendTestPush = async () => {
        setSendingTest(true);
        try {
            const result = await MatchService.sendTestPushNotification();
            Alert.alert(
                'Push de prueba',
                `Enviadas: ${result.sent || 0}. Fallidas: ${result.failed || 0}. Dispositivos: ${result.devices_targeted || 0}.`
            );
        } catch (error) {
            Alert.alert('Push de prueba', error.message || 'No se pudo enviar la notificacion de prueba.');
        } finally {
            setSendingTest(false);
        }
    };

    const handleNotificationPress = async (item) => {
        if (!item.is_read) {
            try {
                await MatchService.markNotificationAsRead(item.id);
                // Update local state
                setNotifications(prev => 
                    prev.map(n => n.id === item.id ? { ...n, is_read: true } : n)
                );
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }

        // Navigate based on type
        if (item.type === 'match' && item.data?.match_user_id) {
            navigation.navigate('Matches');
        } else if (item.type === 'message') {
            navigation.navigate('Matches');
        } else if (item.type === 'photo_rejected') {
            navigation.navigate('Profile');
        }
    };

    const getNotificationIcon = (type) => {
        if (type === 'match') return 'heart';
        if (type === 'message') return 'chatbubble';
        if (type === 'photo_rejected') return 'image';
        return 'notifications';
    };

    const getNotificationColor = (type) => {
        if (type === 'match') return colors.primary;
        if (type === 'message') return colors.success;
        if (type === 'photo_rejected') return colors.error;
        return colors.primary;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.notificationItem, !item.is_read && styles.unreadItem]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) }]}>
                <Ionicons 
                    name={getNotificationIcon(item.type)}
                    size={24} 
                    color="#FFF" 
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
                <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    if (loading) return <Loading />;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('notifications.title', 'Notifications')}</Text>
                <TouchableOpacity
                    style={[styles.testButton, sendingTest && styles.testButtonDisabled]}
                    onPress={handleSendTestPush}
                    disabled={sendingTest}
                >
                    {sendingTest ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Ionicons name="paper-plane-outline" size={18} color="#FFF" />
                    )}
                    <Text style={styles.testButtonText}>Test push</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color="#666" />
                        <Text style={styles.emptyText}>{t('notifications.empty', 'No notifications yet')}</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    testButton: {
        minHeight: 38,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    testButtonDisabled: {
        opacity: 0.7,
    },
    testButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    listContent: {
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#FFF5F6', // Very light tint of primary
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2,
    },
    content: {
        fontSize: 14,
        color: '#444',
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        marginLeft: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default NotificationsScreen;
