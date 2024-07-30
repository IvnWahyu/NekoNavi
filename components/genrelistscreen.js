// GenreListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const GenreListScreen = ({ route, navigation }) => {
  const { genreId, genreName } = route.params;
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://api.jikan.moe/v4/anime?genres=${genreId}`)
      .then((response) => {
        setAnimeList(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [genreId]);

  const truncateText = (text, length) => {
    if (text && text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  };

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
      </View>
    );
  }

  if (animeList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No anime found for {genreName}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Anime in {genreName}</Text>
      <FlatList
        data={animeList}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.images.jpg.large_image_url }} style={styles.image} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.synopsis}>{truncateText(item.synopsis, 150)}</Text>
              <TouchableOpacity 
                style={styles.infoButton}
                onPress={() => navigation.navigate('AnimeDetail', { anime: item })}
              >
                <Text style={styles.infoButtonText}>Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.mal_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B2F',
    padding: 10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  synopsis: {
    fontSize: 12,
    color: '#555',
  },
  infoButton: {
    padding: 10,
    backgroundColor: '#C73866',
    borderRadius: 5,
    marginTop: 10,
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    padding: 10,
  },
});

export default GenreListScreen;
