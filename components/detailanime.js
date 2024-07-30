// AnimeDetailScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const AnimeDetailScreen = ({ route }) => {
  const { anime } = route.params;

  if (!anime) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No details available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: anime.images.jpg.large_image_url }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{anime.title}</Text>
      <Text style={styles.type}>{anime.type}</Text>
      <Text style={styles.synopsis}>{anime.synopsis}</Text>
      <Text style={styles.detailText}>Episodes: {anime.episodes}</Text>
      <Text style={styles.detailText}>Score: {anime.score}</Text>
      <Text style={styles.detailText}>Status: {anime.status}</Text>
      <Text style={styles.detailText}>Aired: {anime.aired.string}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#1B1B2F',
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
    color: '#fff',
  },
  type: {
    fontSize: 18,
    color: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default AnimeDetailScreen;
