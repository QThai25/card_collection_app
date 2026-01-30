import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../../src/api/axiosInstance';
import CardDetailScreen from '../../src/screens/CardDetailScreen';

/**
 * Dynamic Card Detail Screen Route
 * Accessed via /card/[id]
 * 
 * This route:
 * 1. Extracts the card ID from the URL
 * 2. Fetches the full card data from the API
 * 3. Passes it to CardDetailScreen as a route param
 */
export default function CardDetailRoute() {
  const { id } = useLocalSearchParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('No card ID provided');
      setLoading(false);
      return;
    }

    const fetchCard = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/cards/${id}`);
        setCard(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Failed to load card details');
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Card not found'}</Text>
        </View>
      </View>
    );
  }

  // Create a mock route object that CardDetailScreen expects
  const mockRoute = {
    params: { card },
  };

  return (
    <View style={styles.container}>
      <CardDetailScreen route={mockRoute} navigation={null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
});

