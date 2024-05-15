import { Movie } from "./Movie";

export interface Watchlist {
    id: number;
    userId: string;
    movieId: number;
    movie?: Movie;
}