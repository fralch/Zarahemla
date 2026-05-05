import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Searchbar, Divider, FAB, Portal, Modal, Button, Text } from 'react-native-paper';

const MOCK_USERS = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', status: 'Active' },
  { id: '2', name: 'Maria Garcia', email: 'maria@example.com', status: 'Active' },
  { id: '3', name: 'Carlos Sosa', email: 'carlos@example.com', status: 'Banned' },
  { id: '4', name: 'Ana Lopez', email: 'ana@example.com', status: 'Active' },
];

export default function UserListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  const showModal = (user: any) => {
    setSelectedUser(user);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search Users"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={MOCK_USERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <List.Item
              title={item.name}
              description={item.email}
              left={(props) => <List.Icon {...props} icon="account" />}
              right={(props) => (
                <Text style={[styles.status, { color: item.status === 'Active' ? '#4CAF50' : '#F44336' }]}>
                  {item.status}
                </Text>
              )}
              onPress={() => showModal(item)}
            />
            <Divider />
          </>
        )}
      />

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          {selectedUser && (
            <>
              <Text variant="titleLarge">{selectedUser.name}</Text>
              <Text variant="bodyMedium" style={{ marginBottom: 20 }}>{selectedUser.email}</Text>
              <View style={styles.modalActions}>
                <Button mode="outlined" onPress={hideModal} style={{ marginRight: 10 }}>Close</Button>
                <Button mode="contained" buttonColor="#F44336" onPress={hideModal}>Ban User</Button>
              </View>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchbar: {
    margin: 15,
  },
  status: {
    alignSelf: 'center',
    marginRight: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modal: {
    backgroundColor: 'white',
    padding: 25,
    margin: 20,
    borderRadius: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
