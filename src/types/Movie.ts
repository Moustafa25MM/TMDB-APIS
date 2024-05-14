export interface Genre {
    id?: number;
    name: string;
}

export interface MovieGenre {
    movieId: number;
    genreId: number;
    movie?: Movie;
    genre?: Genre;
}

export interface Movie {
    id?: number;
    title: string;
    director: string;
    year: number;
    country: string;
    length: number;
    colour: string;
    createdAt?: Date;
    updatedAt?: Date;
    genres: MovieGenre[];
}