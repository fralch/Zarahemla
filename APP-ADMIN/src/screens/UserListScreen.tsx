import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Pressable } from 'react-native';
import { List, Searchbar, Divider, Portal, Modal, Button, Text, ActivityIndicator, Chip, Surface } from 'react-native-paper';

interface UserListScreenProps {
  api: any;
}

const COLORS = {
  primary: '#FF4458',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  success: '#10B981',
  error: '#EF4444',
  border: '#E5E7EB',
};

export default function UserListScreen({ api }: UserListScreenProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async (pageNum: number = 1, search: string = '') => {
    try {
      const response = await api.getUsers({ 
        search, 
        status: 'all', 
        page: pageNum, 
        per_page: 20 
      });
      
      if (pageNum === 1) {
        setUsers(response.data);
      } else {
        setUsers(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.meta.current_page < response.meta.last_page);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api]);

  React.useEffect(() => {
    fetchUsers(1, searchQuery);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setLoading(true);
    fetchUsers(1, text);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers(1, searchQuery);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !refreshing) {
      setLoading(true);
      fetchUsers(page + 1, searchQuery);
    }
  };

  const showModal = (user: any) => {
    setSelectedUser(user);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedUser(null);
  };

  const handleBan = async () => {
    if (!selectedUser) return;
    
    Alert.alert(
      'Ban User',
      `Are you sure you want to ban ${selectedUser.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Ban', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.banUser(selectedUser.id, 'Banned by admin');
              hideModal();
              fetchUsers(1, searchQuery);
              Alert.alert('Success', 'User banned successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const handleUnban = async () => {
    if (!selectedUser) return;
    
    try {
      await api.unbanUser(selectedUser.id);
      hideModal();
      fetchUsers(1, searchQuery);
      Alert.alert('Success', 'User unbanned successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'banned': return COLORS.error;
      case 'inactive': return COLORS.textSecondary;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return '#D1FAE5';
      case 'banned': return '#FEE2E2';
      case 'inactive': return '#F3F4F6';
      default: return '#F3F4F6';
    }
  };

  if (loading && users.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Users</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Manage registered users</Text>
      </View>

      <Searchbar
        placeholder="Search users..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor={COLORS.textSecondary}
      />
      
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && users.length > 0 ? <ActivityIndicator style={styles.footer} /> : null}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => showModal(item)} 
            style={({ pressed }) => [
              styles.userItem,
              pressed && styles.userItemPressed
            ]}
          >
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>
                {item.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Chip 
              style={{ backgroundColor: getStatusBg(item.status) }}
              textStyle={{ color: getStatusColor(item.status), fontSize: 11, fontWeight: '600' }}
            >
              {item.status?.toUpperCase()}
            </Chip>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No users found</Text>
          </View>
        }
      />

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          {selectedUser && (
            <Surface style={styles.modalSurface} elevation={0}>
              <View style={styles.modalHeader}>
                <View style={[styles.modalAvatar, { backgroundColor: getStatusBg(selectedUser.status) }]}>
                  <Text style={[styles.modalAvatarText, { color: getStatusColor(selectedUser.status) }]}>
                    {selectedUser.name?.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.modalInfo}>
                  <Text variant="titleLarge" style={styles.modalName}>{selectedUser.name}</Text>
                  <Text variant="bodyMedium" style={styles.modalEmail}>{selectedUser.email}</Text>
                </View>
              </View>
              
              <Chip style={{ alignSelf: 'flex-start', marginBottom: 24, backgroundColor: getStatusBg(selectedUser.status) }}>
                <Text style={{ color: getStatusColor(selectedUser.status), fontWeight: '600' }}>
                  {selectedUser.status?.toUpperCase()}
                </Text>
              </Chip>
              
              <View style={styles.modalActions}>
                <Button mode="outlined" onPress={hideModal} style={{ flex: 1, marginRight: 8 }}>
                  Close
                </Button>
                {selectedUser.status === 'banned' ? (
                  <Button 
                    mode="contained" 
                    onPress={handleUnban}
                    buttonColor={COLORS.success}
                    style={{ flex: 1 }}
                  >
                    Unban
                  </Button>
                ) : (
                  <Button 
                    mode="contained" 
                    onPress={handleBan}
                    buttonColor={COLORS.error}
                    style={{ flex: 1 }}
                  >
                    Ban
                  </Button>
                )}
              </View>
            </Surface>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchbar: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    elevation: 0,
  },
  searchInput: {
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  userItemPressed: {
    opacity: 0.7,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    marginVertical: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  modal: {
    backgroundColor: COLORS.background,
    padding: 0,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalSurface: {
    padding: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatarText: {
    fontSize: 24,
    fontWeight: '600',
  },
  modalInfo: {
    flex: 1,
    marginLeft: 16,
  },
  modalName: {
    fontWeight: '700',
    color: COLORS.text,
  },
  modalEmail: {
    color: COLORS.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
  },
});