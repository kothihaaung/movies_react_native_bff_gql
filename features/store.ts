import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './movies/movies_reducer';

export const store = configureStore({
    reducer: {
        movies: moviesReducer
    }
})