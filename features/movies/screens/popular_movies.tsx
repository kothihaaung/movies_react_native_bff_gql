import React, { useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesRequest, fetchMoviesSuccess, fetchMoviesFailure } from '../movies_action';
import { Movie } from '../movie';
import { StackNavigationProp } from '@react-navigation/stack';
import { gql, useQuery } from '@apollo/client';

const CHAPTERS_QUERY = gql`
    query GetPopularMovies {
        popularMovies {
            id
            title
            overview
            poster_path
        }
    }
`;

// Type for the Redux state
interface MoviesState {
    movies: {
        movies: Movie[];
        fetchingMovies: boolean;
        error: string | null;
    };
}

type RootStackParamList = {
    Tabs: undefined;
    MovieDetail: { item: Movie };
};

// Define the navigation prop type
type PopularMoviesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetail'>;

// Define the props type for PopularMoviesScreen
type Props = {
    navigation: PopularMoviesScreenNavigationProp;
};

const PopularMoviesScreen: React.FC<Props> = ({ navigation }) => {
    const { data, loading, error: gqlError } = useQuery(CHAPTERS_QUERY);
    const { movies, fetchingMovies, error } = useSelector((state: MoviesState) => state.movies);
    const dispatch = useDispatch();

    useEffect(() => {
        if (loading) {
            dispatch(fetchMoviesRequest());
        } else if (data) {
            dispatch(fetchMoviesSuccess(data.popularMovies));
        } else if (gqlError) {
            console.log('error: gql: ' + gqlError)
            dispatch(fetchMoviesFailure(gqlError.message));
        }
    }, [loading, data, gqlError, dispatch]);

    if (fetchingMovies) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handlePress = (item: Movie) => {
        navigation.navigate('MovieDetail', { item });
    };

    const renderItem = ({ item }: { item: Movie }) => (
        <TouchableOpacity style={styles.gridItem} onPress={() => handlePress(item)}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.poster}
            />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: 16,
        backgroundColor: '#000',
    },
    gridItem: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        padding: 0,
        borderRadius: 10,
    },
    poster: {
        width: 160,
        height: 225,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        color: 'white',
        marginTop: 8,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default PopularMoviesScreen;
