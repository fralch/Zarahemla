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
      console.error('Error al cargar usuarios:', error);
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
      'Banear Usuario',
      `¿Estás seguro que quieres banear a ${selectedUser.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Banear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.banUser(selectedUser.id, 'Baneado por admin');
              hideModal();
              fetchUsers(1, searchQuery);
              Alert.alert('Éxito', 'Usuario baneado correctamente');
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
      Alert.alert('Éxito', 'Usuario desbaneado correctamente');
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

  const getGenderColor = (gender: string | undefined) => {
    if (!gender) return COLORS.textSecondary;
    switch (gender.toLowerCase()) {
      case 'male': return '#3B82F6';
      case 'female': return '#EC4899';
      case 'non-binary': return '#8B5CF6';
      case 'other': return '#F59E0B';
      default: return COLORS.textSecondary;
    }
  };

  const getGenderBg = (gender: string | undefined) => {
    if (!gender) return '#F3F4F6';
    switch (gender.toLowerCase()) {
      case 'male': return '#DBEAFE';
      case 'female': return '#FCE7F3';
      case 'non-binary': return '#EDE9FE';
      case 'other': return '#FEF3C7';
      default: return '#F3F4F6';
    }
  };

  const getGenderLabel = (gender: string | undefined) => {
    if (!gender) return 'No especificado';
    switch (gender.toLowerCase()) {
      case 'male': return 'Masculino';
      case 'female': return 'Femenino';
      case 'non-binary': return 'No binario';
      case 'other': return 'Otro';
      default: return gender;
    }
  };

  const getInterestedInLabel = (interestedIn: string | undefined) => {
    if (!interestedIn) return 'No especificado';
    switch (interestedIn.toLowerCase()) {
      case 'male': return 'Hombres';
      case 'female': return 'Mujeres';
      case 'both': return 'Todos';
      case 'non-binary': return 'No binarios';
      default: return interestedIn;
    }
  };

  const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string | undefined }) => (
    value ? (
      <View style={styles.detailRow}>
        <Text style={styles.detailIcon}>{icon}</Text>
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>{label}</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      </View>
    ) : null
  );

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
        <Text variant="headlineMedium" style={styles.title}>Usuarios</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Administrar usuarios registrados</Text>
      </View>

      <Searchbar
        placeholder="Buscar usuarios..."
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
              <View style={styles.userMetaRow}>
                {item.gender && (
                  <View style={[styles.metaBadge, { backgroundColor: getGenderBg(item.gender) }]}>
                    <Text style={[styles.metaBadgeText, { color: getGenderColor(item.gender) }]}>
                      {getGenderLabel(item.gender)}
                    </Text>
                  </View>
                )}
                {item.age && <Text style={styles.ageText}>{item.age} años</Text>}
                {item.city && <Text style={styles.cityMeta}>📍 {item.city}</Text>}
              </View>
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
            <Text>No se encontraron usuarios</Text>
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
              
              <Chip style={{ alignSelf: 'flex-start', marginBottom: 16, backgroundColor: getStatusBg(selectedUser.status) }}>
                <Text style={{ color: getStatusColor(selectedUser.status), fontWeight: '600' }}>
                  {selectedUser.status?.toUpperCase()}
                </Text>
              </Chip>

              <View style={styles.userDetails}>
                {(selectedUser.age || selectedUser.gender || selectedUser.city) && (
                  <View style={styles.detailsSection}>
                    {selectedUser.age && (
                      <View style={[styles.genderChip, { backgroundColor: '#F3F4F6' }]}>
                        <Text style={[styles.genderChipText, { color: COLORS.text }]}>
                          {selectedUser.age} años
                        </Text>
                      </View>
                    )}
                    {selectedUser.gender && (
                      <View style={[styles.genderChip, { backgroundColor: getGenderBg(selectedUser.gender) }]}>
                        <Text style={[styles.genderChipText, { color: getGenderColor(selectedUser.gender) }]}>
                          {getGenderLabel(selectedUser.gender)}
                        </Text>
                      </View>
                    )}
                    {selectedUser.interested_in && (
                      <View style={[styles.genderChip, { backgroundColor: '#E0E7FF' }]}>
                        <Text style={[styles.genderChipText, { color: '#4F46E5' }]}>
                          {getInterestedInLabel(selectedUser.interested_in)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {selectedUser.city && (
                  <DetailRow icon="📍" label="Ciudad" value={selectedUser.city} />
                )}
                {selectedUser.description && (
                  <DetailRow icon="📝" label="Descripción" value={selectedUser.description} />
                )}
                {selectedUser.instagram && (
                  <DetailRow icon="📸" label="Instagram" value={`@${selectedUser.instagram}`} />
                )}
                {selectedUser.whatsapp && (
                  <DetailRow icon="💬" label="WhatsApp" value={selectedUser.whatsapp} />
                )}
                {selectedUser.latitude && selectedUser.longitude && (
                  <DetailRow icon="🌍" label="Ubicación" value={`${selectedUser.latitude.toFixed(4)}, ${selectedUser.longitude.toFixed(4)}`} />
                )}
              </View>
              
              <View style={styles.modalActions}>
                <Button mode="outlined" onPress={hideModal} style={{ flex: 1, marginRight: 8 }}>
                  Cerrar
                </Button>
                {selectedUser.status === 'banned' ? (
                  <Button 
                    mode="contained" 
                    onPress={handleUnban}
                    buttonColor={COLORS.success}
                    style={{ flex: 1 }}
                  >
                    Desbanear
                  </Button>
                ) : (
                  <Button 
                    mode="contained" 
                    onPress={handleBan}
                    buttonColor={COLORS.error}
                    style={{ flex: 1 }}
                  >
                    Banear
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
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ageText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  cityMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
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
  userDetails: {
    marginBottom: 20,
  },
  detailsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  genderChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
  },
});