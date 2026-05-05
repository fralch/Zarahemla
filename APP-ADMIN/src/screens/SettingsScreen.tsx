import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, List, Divider, Switch } from 'react-native-paper';

export default function SettingsScreen() {
  const [radius, setRadius] = useState('50');
  const [swipeLimit, setSwipeLimit] = useState('100');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    console.log('Settings saved:', { radius, swipeLimit, maintenanceMode });
    // Call AdminApiService.post('/settings', ...)
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>Algorithm & System</Text>
      
      <List.Section>
        <List.Subheader>Discovery Algorithm</List.Subheader>
        <View style={styles.inputRow}>
          <Text variant="bodyLarge">Default Radius (km)</Text>
          <TextInput
            value={radius}
            onChangeText={setRadius}
            keyboardType="numeric"
            mode="outlined"
            style={styles.smallInput}
          />
        </View>
        <Divider />
        <View style={styles.inputRow}>
          <Text variant="bodyLarge">Daily Swipe Limit</Text>
          <TextInput
            value={swipeLimit}
            onChangeText={setSwipeLimit}
            keyboardType="numeric"
            mode="outlined"
            style={styles.smallInput}
          />
        </View>
      </List.Section>

      <List.Section>
        <List.Subheader>System Status</List.Subheader>
        <List.Item
          title="Maintenance Mode"
          description="Disable user access while active"
          right={() => (
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              color="#FF4458"
            />
          )}
        />
      </List.Section>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save Configurations
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  smallInput: {
    width: 80,
    height: 40,
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 50,
  },
});
