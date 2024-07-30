// RandomScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const RandomScreen = ({ navigation }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomAnime = () => {
    setLoading(true);
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(axios.get('https://api.jikan.moe/v4/random/anime'));
    }
    Promise.all(requests)
      .then((responses) => {
        const newAnimeList = responses.map(response => response.data.data);
        setAnimeList(newAnimeList);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRandomAnime();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity onPress={fetchRandomAnime} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={fetchRandomAnime} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      {animeList.map((anime, index) => (
        <View key={index} style={styles.animeContainer}>
          <Image source={{ uri: anime.images.jpg.large_image_url }} style={styles.image} resizeMode="cover" />
          <Text style={styles.title}>{anime.title}</Text>
          <Text style={styles.type}>{anime.type}</Text>
          <Text style={styles.synopsis}>{anime.synopsis}</Text>
          <Text style={styles.detailText}>Episodes: {anime.episodes}</Text>
          <Text style={styles.detailText}>Score: {anime.score}</Text>
          <Text style={styles.detailText}>Status: {anime.status}</Text>
          <Text style={styles.detailText}>Aired: {anime.aired.string}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#1B1B2F',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B2F',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#00F5D4',
    borderRadius: 5,
    marginBottom: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  animeContainer: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  type: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  synopsis: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
});

export default RandomScreen;
