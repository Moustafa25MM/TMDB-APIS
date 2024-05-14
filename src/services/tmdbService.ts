import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const API_KEY = process.env.API_KEY;

const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: { api_key: API_KEY }
});

export const fetchMovieDetails = async (movieId: string) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details from TMDB:', error);
        throw error;
    }
};

export const searchMoviesByTitle = async (title: string) => {
    try {
        const response = await tmdbApi.get('/search/movie', { params: { query: title } });
        if (response.data.results.length > 0) {
            return response.data.results[0];
        }
        return null;
    } catch (error) {
        console.error('Error searching movies from TMDB:', error);
        throw error;
    }
};