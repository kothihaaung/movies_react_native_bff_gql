import React from 'react';
import { Button, Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Movie } from '../movie';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Tabs: undefined;
    MovieDetail: { item: Movie };
};

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;
type PopularMoviesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetail'>;

// Define the props type for PopularMoviesScreen
type Props = {
    route: MovieDetailScreenRouteProp
    navigation: PopularMoviesScreenNavigationProp;
};

const MovieDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { item } = route.params
    const { width: screenWidth } = Dimensions.get('window');

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false // Custom back button label
        });
    }, [navigation]);

    // OnPressBack
    const onPressBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* background */}
            <View style={styles.background} />

            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
                    <Ionicons name="arrow-back-circle" size={28} color="white" style={styles.backButtonIcon} />
                </TouchableOpacity>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={[styles.poster, { width: screenWidth - 32 }]}
                    resizeMode="cover"
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.overview}>{item.overview}</Text>
                <View style={styles.spacer} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: 'black',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 30,
        zIndex: 1, // Ensure the back button is above other elements
    },
    backButtonIcon: {

    },
    poster: {
        height: 450,
        borderRadius: 8,
        marginTop: 0,
        marginBottom: 20,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    overview: {
        color: '#bab8b8',
        fontSize: 16,
        textAlign: 'left',
    },
    spacer: {
        flex: 1, // Take up the remaining space
        width: '100%', // Full width to push content up
    },
});

export default MovieDetailScreen;
