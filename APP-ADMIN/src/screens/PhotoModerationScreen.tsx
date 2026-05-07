import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions, Alert, Pressable, Image } from 'react-native';
import { Text, Button, Card, IconButton, Portal, Modal, ActivityIndicator, TextInput, Surface } from 'react-native-paper';

interface PhotoModerationScreenProps {
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

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 44) / 2;

const BASE_URL = 'https://megaequipamiento.pe';

interface UserProfile {
  age?: number;
  gender?: string;
  city?: string;
  instagram?: string;
  whatsapp?: string;
}

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

const getGenderLabel = (gender: string | undefined) => {
  if (!gender) return '';
  switch (gender.toLowerCase()) {
    case 'male': return 'M';
    case 'female': return 'F';
    case 'non-binary': return 'NB';
    case 'other': return 'O';
    default: return gender.charAt(0).toUpperCase();
  }
};

const PhotoCard = ({ item, userProfile, onApprove, onReject }: { 
  item: any; 
  userProfile?: UserProfile;
  onApprove: () => void; 
  onReject: () => void;
}) => {
  const genderColor = getGenderColor(userProfile?.gender || item.user_gender || item.gender);
  const imagePath = item.photo_url || item.url || item.image_url || item.photo || item.image || item.path;
  const imageUri = imagePath ? `${BASE_URL}${imagePath}` : null;
  
  const gender = userProfile?.gender || item.user_gender || item.gender;
  const age = userProfile?.age || item.user_age || item.age;
  const city = userProfile?.city || item.user_city || item.city;
  const instagram = userProfile?.instagram || item.user_instagram || item.instagram;
  const firstName = item.user_name ? item.user_name.split(' ')[0] : '';
  
  return (
    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image}
            resizeMode="cover"
            progressiveRenderingEnabled={true}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.noImageText}>Sin foto</Text>
          </View>
        )}
        <View style={styles.imageOverlay}>
          <Pressable onPress={onApprove} style={({ pressed }) => [
            styles.actionButton, styles.approveBtn, pressed && styles.actionPressed
          ]}>
            <IconButton icon="check" iconColor="#FFFFFF" size={20} />
          </Pressable>
          <Pressable onPress={onReject} style={({ pressed }) => [
            styles.actionButton, styles.rejectBtn, pressed && styles.actionPressed
          ]}>
            <IconButton icon="close" iconColor="#FFFFFF" size={20} />
          </Pressable>
        </View>
      </View>
      <Card.Content style={styles.cardContent}>
        <View style={styles.userInfoRow}>
          <Text style={styles.userName} numberOfLines={1}>{firstName}</Text>
          {gender && (
            <View style={[styles.genderBadge, { backgroundColor: genderColor + '20' }]}>
              <Text style={[styles.genderBadgeText, { color: genderColor }]}>
                {getGenderLabel(gender)}
              </Text>
            </View>
          )}
          {age && (
            <Text style={styles.ageText}>{age}</Text>
          )}
        </View>
        {city && (
          <Text style={styles.cityText}>📍 {city}</Text>
        )}
        {instagram && (
          <Text style={styles.instagramText}>📸 @{instagram}</Text>
        )}
        {userProfile?.whatsapp && (
          <Text style={styles.whatsappText}>💬 {userProfile.whatsapp}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

export default function PhotoModerationScreen({ api }: PhotoModerationScreenProps) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const user = await api.getUser(userId);
      return {
        age: user.age,
        gender: user.gender,
        city: user.city,
        instagram: user.instagram,
        whatsapp: user.whatsapp,
      };
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      return {};
    }
  }, [api]);

  const fetchPhotos = useCallback(async (pageNum: number = 1) => {
    try {
      const response = await api.getPhotos({ status: 'pending', page: pageNum, per_page: 20 });
      
      if (pageNum === 1) {
        setPhotos(response.data);
      } else {
        setPhotos(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.meta.current_page < response.meta.last_page);
      setPage(pageNum);

      const userIdsArray = response.data.map((p: any) => String(p.user_id));
      const uniqueIds = [...new Set(userIdsArray)];
      const profiles: Record<string, UserProfile> = {};
      
      for (const userId of uniqueIds) {
        const uid = userId as string;
        if (!userProfiles[uid]) {
          profiles[uid] = await fetchUserProfile(uid);
        }
      }
      
      if (Object.keys(profiles).length > 0) {
        setUserProfiles(prev => ({ ...prev, ...profiles }));
      }
    } catch (error) {
      console.error('Error al cargar fotos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api, fetchUserProfile, userProfiles]);

  React.useEffect(() => {
    fetchPhotos(1);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !refreshing) {
      setLoading(true);
      fetchPhotos(page + 1);
    }
  };

  const handleApprove = async (photoId: string) => {
    Alert.alert(
      'Aprobar Foto',
      '¿Estás seguro que quieres aprobar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: async () => {
            try {
              await api.approvePhoto(photoId);
              setPhotos(photos.filter(p => p.id !== photoId));
              Alert.alert('Éxito', 'Foto aprobada');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const openRejectModal = (photoId: string) => {
    setSelectedPhotoId(photoId);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!selectedPhotoId) return;
    
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Por favor ingresa una razón');
      return;
    }

    try {
      await api.rejectPhoto(selectedPhotoId, rejectReason);
      setRejectModalVisible(false);
      setPhotos(photos.filter(p => p.id !== selectedPhotoId));
      Alert.alert('Éxito', 'Foto rechazada');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading && photos.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Moderación</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {photos.length} pendientes de revisar
        </Text>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && photos.length > 0 ? <ActivityIndicator style={styles.footer} /> : null}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PhotoCard 
            item={item}
            userProfile={userProfiles[item.user_id]}
            onApprove={() => handleApprove(item.id)}
            onReject={() => openRejectModal(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <IconButton icon="check-circle" iconColor={COLORS.success} size={48} />
            </View>
            <Text variant="titleMedium" style={styles.emptyTitle}>¡Todo listo!</Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No hay fotos pendientes.
            </Text>
          </View>
        }
      />

      <Portal>
        <Modal 
          visible={rejectModalVisible} 
          onDismiss={() => setRejectModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Surface style={styles.modalSurface} elevation={0}>
            <View style={styles.modalHeader}>
              <IconButton icon="alert-circle" iconColor={COLORS.error} size={28} />
              <Text variant="titleLarge" style={styles.modalTitle}>Rechazar Foto</Text>
            </View>
            
            <Text variant="bodyMedium" style={styles.modalText}>
              Por favor ingresa una razón:
            </Text>
            
            <TextInput
              mode="outlined"
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Razón del rechazo"
              multiline
              numberOfLines={3}
              style={styles.textInput}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.error}
            />
            
            <View style={styles.modalActions}>
              <Button 
                mode="outlined" 
                onPress={() => setRejectModalVisible(false)} 
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                onPress={handleReject}
                buttonColor={COLORS.error}
                style={{ flex: 1 }}
              >
                Rechazar
              </Button>
            </View>
          </Surface>
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
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    width: COLUMN_WIDTH,
    margin: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: COLUMN_WIDTH - 12,
    height: COLUMN_WIDTH,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  approveBtn: {
    backgroundColor: COLORS.success,
  },
  rejectBtn: {
    backgroundColor: COLORS.error,
  },
  actionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  cardContent: {
    padding: 12,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ageText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  cityText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  instagramText: {
    fontSize: 11,
    color: '#E1306C',
    marginTop: 2,
  },
  whatsappText: {
    fontSize: 11,
    color: '#25D366',
    marginTop: 2,
  },
  footer: {
    marginVertical: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
  modal: {
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
  modalTitle: {
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },
  modalText: {
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: COLORS.surface,
  },
  modalActions: {
    flexDirection: 'row',
  },
});