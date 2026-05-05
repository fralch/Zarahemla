import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { Text, Button, Card, IconButton, Portal, Modal } from 'react-native-paper';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 20;

const PENDING_PHOTOS = [
  { id: '1', user: 'Juan Pérez', url: 'https://picsum.photos/seed/p1/400/400' },
  { id: '2', user: 'Maria Garcia', url: 'https://picsum.photos/seed/p2/400/400' },
  { id: '3', user: 'Carlos Sosa', url: 'https://picsum.photos/seed/p3/400/400' },
  { id: '4', user: 'Ana Lopez', url: 'https://picsum.photos/seed/p4/400/400' },
];

export default function PhotoModerationScreen() {
  const [photos, setPhotos] = useState(PENDING_PHOTOS);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    // In a real app, call AdminApiService
    setPhotos(photos.filter(p => p.id !== id));
    console.log(`Photo ${id} ${action}ed`);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>Pending Moderation</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.url }} style={styles.image} />
            <Card.Content style={styles.cardContent}>
              <Text variant="bodySmall" numberOfLines={1}>{item.user}</Text>
              <View style={styles.actions}>
                <IconButton
                  icon="check-circle"
                  iconColor="#4CAF50"
                  size={24}
                  onPress={() => handleAction(item.id, 'approve')}
                />
                <IconButton
                  icon="close-circle"
                  iconColor="#F44336"
                  size={24}
                  onPress={() => handleAction(item.id, 'reject')}
                />
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="bodyLarge">No photos pending moderation.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    margin: 10,
    fontWeight: 'bold',
  },
  card: {
    width: COLUMN_WIDTH,
    margin: 5,
    overflow: 'hidden',
  },
  image: {
    height: 150,
  },
  cardContent: {
    padding: 5,
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
});
