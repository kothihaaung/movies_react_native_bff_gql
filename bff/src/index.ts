import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  type Movie {
    id: Int
    title: String
    overview: String
    poster_path: String
  }

  type Query {
    popularMovies: [Movie]
  }
`;

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNGYzZWQ3YjA0NjY1NWM0NzRmMzM5OGFhYjQxMjY3ZCIsIm5iZiI6MTcyNDIxMDQ2NC4zMDc4OCwic3ViIjoiNjA0YWUwMTY5MGI4N2UwMDU4ZWU0YTQ0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.Hcayqbgrx070hgnacNfTfgaFyirzFyq4OVmwMONV-1w'

// Define the types for the movie and API response
interface Movie {
    id: number;
    title: string;
    overview: String;
    poster_path: string;
}

interface ApiResponse {
    results: Movie[];
}

const fetchPopularMovies = async (): Promise<Movie[] | undefined> => {
    try {
        const response = await fetch(
            'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc',
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`, // Replace with your actual access token
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const apiResponse: ApiResponse = data as ApiResponse;

        return apiResponse.results;

    } catch (error) {
        console.error('error: fetchMovies: ' + error);
        return undefined; // Handle the error by returning undefined or you could return an empty array
    }
};

// Define your resolvers
const resolvers = {
    Query: {
        popularMovies: fetchPopularMovies
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);