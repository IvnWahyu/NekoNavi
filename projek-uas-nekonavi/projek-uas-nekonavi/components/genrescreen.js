import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const GenreScreen = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('https://api.jikan.moe/v4/genres/anime')
      .then((response) => {
        console.log(response.data.data);
        setGenres(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={genres}
        renderItem={({ item }) => (
          <TouchableOpacity 
            key={item.mal_id}
            style={styles.genreButton}
            onPress={() => navigation.navigate('GenreList', { genreId: item.mal_id, genreName: item.name })}
          >
            <Text style={styles.genreButtonText}>{item.name}</Text>
          </TouchableOpacity>
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
  genreButton: {
    padding: 10,
    backgroundColor: '#C73866',
    borderRadius: 5,
    marginBottom: 10,
  },
  genreButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 10,
  },
});

export default GenreScreen;
