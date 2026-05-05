import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

export default function DashboardScreen() {
  const stats = [
    { title: 'Total Users', value: '1,250', color: '#FF4458' },
    { title: 'Active Matches', value: '450', color: '#4CAF50' },
    { title: 'Pending Reports', value: '12', color: '#F44336' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>Dashboard Overview</Text>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Title style={{ color: stat.color }}>{stat.value}</Title>
              <Paragraph>{stat.title}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 15,
  },
});
