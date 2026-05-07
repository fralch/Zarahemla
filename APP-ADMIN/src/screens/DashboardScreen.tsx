import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, Pressable } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';

interface DashboardScreenProps {
  api: any;
}

interface Stats {
  total_users: number;
  active_matches: number;
  pending_reports: number;
  pending_photos: number;
  banned_users: number;
}

const COLORS = {
  primary: '#FF4458',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  accent: '#FF6B7A',
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

const StatCard = ({ title, value, color, accent, onPress }: { 
  title: string; 
  value: string; 
  color: string;
  accent: string;
  onPress?: () => void;
}) => (
  <Pressable onPress={onPress} style={({ pressed }) => [
    styles.statCard,
    { opacity: pressed ? 0.9 : 1 }
  ]}>
    <View style={[styles.statIndicator, { backgroundColor: color }]} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    <View style={[styles.statAccent, { backgroundColor: accent }]} />
  </Pressable>
);

export default function DashboardScreen({ api }: DashboardScreenProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const statsData = stats ? [
    { title: 'Usuarios Totales', value: stats.total_users.toLocaleString(), color: COLORS.primary, accent: '#FFCCD5' },
    { title: 'Matches Activos', value: stats.active_matches.toLocaleString(), color: '#10B981', accent: '#D1FAE5' },
    { title: 'Reportes Pendientes', value: stats.pending_reports.toLocaleString(), color: '#F59E0B', accent: '#FEF3C7' },
    { title: 'Fotos Pendientes', value: stats.pending_photos.toLocaleString(), color: '#3B82F6', accent: '#DBEAFE' },
    { title: 'Usuarios Baneados', value: stats.banned_users.toLocaleString(), color: '#EF4444', accent: '#FEE2E2' },
  ] : [];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Panel</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Resumen</Text>
      </View>

      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      <Card style={styles.insightCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.insightTitle}>Acciones Rápidas</Text>
          <Paragraph style={styles.insightText}>
            Revisa las fotos y reportes pendientes para mantener la comunidad segura.
          </Paragraph>
        </Card.Content>
      </Card>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  statIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  insightCard: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  insightTitle: {
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  insightText: {
    color: COLORS.textSecondary,
  },
});