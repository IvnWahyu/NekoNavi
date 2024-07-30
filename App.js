// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import SearchingScreen from './components/searching';
import AnimeDetailScreen from './components/detailanime';
import GenreScreen from './components/genrescreen';
import GenreListScreen from './components/genrelistscreen';
import RandomScreen from './components/randomscreen';

import homeIcon from './assets/home.png';
import searchIcon from './assets/search.png';
import genreIcon from './assets/genre.png';
import randomIcon from './assets/random.png';

const HomeScreen = ({ navigation }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnime = () => {
    setLoading(true);
    axios.get('https://api.jikan.moe/v4/top/anime')
      .then((response) => {
        setAnimeList(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnime();
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
        <TouchableOpacity onPress={fetchAnime} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const truncateText = (text, length) => {
    if (text && text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  };

  if (animeList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No anime found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerTitle: 'NekoNavi',
      headerStyle: {
        height: 100,
      },
      tabBarStyle: {
        position: 'absolute',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: 'transparent',
      },
      tabBarLabelStyle: {
        color: '#00F5D4',
      },
      tabBarIcon: ({ focused }) => {
        let iconSource;

        if (route.name === 'Home') {
          iconSource = homeIcon;
        } else if (route.name === 'Searching') {
          iconSource = searchIcon;
        } else if (route.name === 'Genre') {
          iconSource = genreIcon;
        } else if (route.name === 'Random') {
          iconSource = randomIcon;
        }

        return (
          <Image
            source={iconSource}
            style={{ width: 25, height: 25, tintColor: focused ? '#00F5D4' : '#C4C4C4' }}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Searching" component={SearchingScreen} />
    <Tab.Screen name="Genre" component={GenreScreen} />
    <Tab.Screen name="Random" component={RandomScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AnimeDetail" 
          component={AnimeDetailScreen} 
          options={{ headerTitle: 'Anime Details' }} 
        />
        <Stack.Screen 
          name="GenreList" 
          component={GenreListScreen} 
          options={{ headerTitle: 'Genre List' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
});

export default App;
