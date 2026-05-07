import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { TextInput, Button, Text, Switch, ActivityIndicator, Surface } from 'react-native-paper';

interface SettingsScreenProps {
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

export default function SettingsScreen({ api }: SettingsScreenProps) {
  const [radius, setRadius] = useState('50');
  const [swipeLimit, setSwipeLimit] = useState('100');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await api.getSettings();
      setRadius(settings.discovery_default_radius_km.toString());
      setSwipeLimit(settings.daily_swipe_limit.toString());
      setMaintenanceMode(settings.maintenance_mode);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    const radiusNum = parseInt(radius, 10);
    const swipeLimitNum = parseInt(swipeLimit, 10);

    if (isNaN(radiusNum) || radiusNum < 1) {
      Alert.alert('Error', 'Radius must be at least 1');
      return;
    }

    if (isNaN(swipeLimitNum) || swipeLimitNum < 1) {
      Alert.alert('Error', 'Daily swipe limit must be at least 1');
      return;
    }

    setSaving(true);
    try {
      const result = await api.updateSettings({
        discovery_default_radius_km: radiusNum,
        daily_swipe_limit: swipeLimitNum,
        maintenance_mode: maintenanceMode,
      });
      Alert.alert('Success', result.message || 'Settings saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Configure your app</Text>
      </View>

      <Surface style={styles.section} elevation={0}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Discovery Algorithm</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Default Radius</Text>
            <Text style={styles.settingDescription}>Maximum distance for matching</Text>
          </View>
          <View style={styles.settingControl}>
            <TextInput
              value={radius}
              onChangeText={setRadius}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.primary}
            />
            <Text style={styles.unit}>km</Text>
          </View>
        </View>

        <View style={[styles.settingItem, styles.settingItemLast]}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Daily Swipe Limit</Text>
            <Text style={styles.settingDescription}>Max swipes per day per user</Text>
          </View>
          <View style={styles.settingControl}>
            <TextInput
              value={swipeLimit}
              onChangeText={setSwipeLimit}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.primary}
            />
            <Text style={styles.unit}>swipes</Text>
          </View>
        </View>
      </Surface>

      <Surface style={styles.section} elevation={0}>
        <Text variant="titleMedium" style={styles.sectionTitle}>System Status</Text>
        
        <Pressable 
          onPress={() => setMaintenanceMode(!maintenanceMode)}
          style={({ pressed }) => [
            styles.settingItem,
            styles.settingItemToggle,
            pressed && styles.settingItemPressed
          ]}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Maintenance Mode</Text>
            <Text style={[
              styles.settingDescription,
              maintenanceMode && styles.descriptionActive
            ]}>
              {maintenanceMode ? 'Users cannot access the app' : 'App is running normally'}
            </Text>
          </View>
          <Switch
            value={maintenanceMode}
            onValueChange={setMaintenanceMode}
            color={COLORS.primary}
          />
        </Pressable>
      </Surface>

      <Button 
        mode="contained" 
        onPress={handleSave} 
        style={styles.saveButton}
        loading={saving}
        disabled={saving}
        buttonColor={COLORS.primary}
      >
        Save Changes
      </Button>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Zarahemla Admin v1.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
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
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemToggle: {
    paddingVertical: 8,
  },
  settingItemPressed: {
    opacity: 0.7,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  descriptionActive: {
    color: COLORS.error,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 70,
    height: 40,
    backgroundColor: COLORS.surface,
  },
  unit: {
    marginLeft: 8,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});