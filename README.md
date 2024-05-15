# Burgan application Server

## Installation

```bash
Clone the github repository

Make sure the following Ports are not busy
8080
5432
6379

if you have Docker in your machine :
run the following commands :
docker-compose build
docker-compose up

or :

npm install
npm start
```

## Usage

```python
1. create a .env file in the root directory and add the following as in  .envExample:
PORT=
DATABASE_URL=
JWT_SECRET=
TMDB_BASE_URL=
API_KEY=
REDIS_HOST=

2. npm start -> to run the server
3. npm test -> to run tests

```

## How to use

### Database Diagram :

![Alt text](./burganDbDiagram.png)

### API DOCUMENTATION :

### Get All Movies

```python
1. endpoint =   http://localhost:8080/movies/get/all?pageSize=3   "Or any port of your choice"


It will return an object like this:
{
    "type": "success",
    "message": "Movies fetched successfully",
    "data": {
        "pagination": {
            "totalDocs": 221,
            "limit": 3,
            "totalPages": 74,
            "page": 1,
            "pagingCounter": 1,
            "hasPrevPage": false,
            "hasNextPage": true,
            "prevPage": null,
            "nextPage": 2
        },
        "movies": [
            {
                "id": 23746,
                "title": "Citizen Kane",
                "director": "Welles, Orson",
                "year": 1941,
                "country": "USA",
                "length": 119,
                "colour": "BW",
                "createdAt": "2024-05-15T11:59:45.550Z",
                "updatedAt": "2024-05-15T11:59:45.550Z",
                "tmdbId": null,
                "posterPath": null,
                "description": null,
                "genres": [
                    {
                        "genre": {
                            "name": "Drama"
                        }
                    },
                    {
                        "genre": {
                            "name": "Mystery"
                        }
                    }
                ]
            },
            {
                "id": 23747,
                "title": "Vertigo",
                "director": "Hitchcock, Alfred",
                "year": 1958,
                "country": "USA",
                "length": 128,
                "colour": "Col",
                "createdAt": "2024-05-15T11:59:45.550Z",
                "updatedAt": "2024-05-15T11:59:45.550Z",
                "tmdbId": null,
                "posterPath": null,
                "description": null,
                "genres": [
                    {
                        "genre": {
                            "name": "Thriller"
                        }
                    },
                    {
                        "genre": {
                            "name": "Drama"
                        }
                    },
                    {
                        "genre": {
                            "name": "Mystery"
                        }
                    }
                ]
            },
            {
                "id": 23748,
                "title": "2001: A Space Odyssey",
                "director": "Kubrick, Stanley",
                "year": 1968,
                "country": "UK-USA",
                "length": 139,
                "colour": "Col",
                "createdAt": "2024-05-15T11:59:45.550Z",
                "updatedAt": "2024-05-15T11:59:45.550Z",
                "tmdbId": null,
                "posterPath": null,
                "description": null,
                "genres": [
                    {
                        "genre": {
                            "name": "Science Fiction"
                        }
                    }
                ]
            }
        ]
    }
}

You can filter with any Field. 
```

### Get Movies Details from TMDB 

```python
1. endpoint = http://localhost:8080/movies/details/citizen   "Or any port of your choice"

It will return an object like this:
{
    "type": "success",
    "message": "Success result",
    "data": {
        "source": "api",
        "movie": {
            "adult": false,
            "backdrop_path": "/ruF3Lmd4A8MHbnEBE6lxPMbsHGL.jpg",
            "belongs_to_collection": null,
            "budget": 839727,
            "genres": [
                {
                    "id": 9648,
                    "name": "Mystery"
                },
                {
                    "id": 18,
                    "name": "Drama"
                }
            ],
            "homepage": "",
            "id": 15,
            "imdb_id": "tt0033467",
            "origin_country": [
                "US"
            ],
            "original_language": "en",
            "original_title": "Citizen Kane",
            "overview": "Newspaper magnate Charles Foster Kane is taken from his mother as a boy and made the ward of a rich industrialist. As a result, every well-meaning, tyrannical or self-destructive move he makes for the rest of his life appears in some way to be a reaction to that deeply wounding event.",
            "popularity": 374.854,
            "poster_path": "/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg",
            "production_companies": [
                {
                    "id": 11447,
                    "logo_path": null,
                    "name": "Mercury Productions",
                    "origin_country": ""
                },
                {
                    "id": 6,
                    "logo_path": "/n53F7K9scQWFXYbrCablqLKqJdp.png",
                    "name": "RKO Radio Pictures",
                    "origin_country": "US"
                }
            ],
            "production_countries": [
                {
                    "iso_3166_1": "US",
                    "name": "United States of America"
                }
            ],
            "release_date": "1941-04-17",
            "revenue": 23218000,
            "runtime": 119,
            "spoken_languages": [
                {
                    "english_name": "English",
                    "iso_639_1": "en",
                    "name": "English"
                }
            ],
            "status": "Released",
            "tagline": "Some called him a hero...others called him a heel.",
            "title": "Citizen Kane",
            "video": false,
            "vote_average": 8.01,
            "vote_count": 5300
        }
    }
}
```

### Register

```python
1. endpoint = http://localhost:8080/auth/register   "Or any port of your choice"
2. Provide the following example json in the body :
{
    "username":"user2",
    "email":"user2@gmail.com",
    "password":"password"
}

It will return an object like this:
{
    "type": "success",
    "message": "User created successfully",
    "data": {
        "user": {
            "id": "56afb4df-cbec-4c3e-86d9-24ebeea8f147",
            "username": "user2",
            "email": "user2@gmail.com",
            "role": "USER",
            "password": "$2a$10$.TPrwlEDLZ9G3lcN1uIooOCZe7LR2etbJPAzDdMd1N6taMkItC56S"
        }
    }
}
```

### Login

```python
1. endpoint = http://localhost:8080/auth/login   "Or any port of your choice"
2. Provide the following example json in the body :
{
    "username":"admin",
    "password":"password"
}

It will return an object like this:
{
    "type": "success",
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJlOGFiOGQzLWNjZjMtNDIwMi05N2RjLTk3MTY4ZDMzNzliMSIsImlhdCI6MTcxNTc3MjM0MywiZXhwIjoxNzE2Mzc3MTQzfQ.LSqoaRtCnE0rE870Mm3yWKUSagYztK3eJC1_ktfOFw0",
        "role": "ADMIN"
    }
}
```

### For Admin --> :

# Create Admin

```python
1. endpoint =   http://localhost:8080/admin/create/admin   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "username":"admin3",
    "email":"admin@gmail.com",
    "password":"password"
}

It will return an object like this:

{
    "type": "success",
    "message": "Admin created successfully",
    "data": {
        "user": {
            "id": "f0d67c94-d0ec-42af-adbe-5f7df4011f98",
            "username": "admin3",
            "email": "admin@gmail.com",
            "role": "ADMIN",
            "password": "$2b$10$9bZN1OvnPOlN.rgDltryveeBx7Mw2.nctW1ElAHQHRWjZL10WOmPu"
        }
    }
}
```

# Admin Create Movie

```python
1. endpoint =  http://localhost:8080/admin/create/movie   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "title":"new movie",
    "director":"i don't know",
    "year":1940,
    "country":"USA",
    "length":320,
    "colour":"BW"
}

It will return an object like this:

{
    "type": "success",
    "message": "Movie created successfully",
    "data": {
        "movie": {
            "id": 23745,
            "title": "new movie",
            "director": "i don't know",
            "year": 1940,
            "country": "USA",
            "length": 320,
            "colour": "BW",
            "createdAt": "2024-05-15T11:25:49.400Z",
            "updatedAt": "2024-05-15T11:25:49.400Z",
            "tmdbId": null,
            "posterPath": null,
            "description": null
        }
    }
}
```

# Admin Update Movie

```python
1. endpoint = http://localhost:8080/admin/update/movie   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "id":23745,
    "title":"news tilte"
}

It will return an object like this:

{
    "type": "success",
    "message": "Movie updated successfully",
    "data": {
        "movie": {
            "id": 23745,
            "title": "news tilte",
            "director": "i don't know",
            "year": 1940,
            "country": "USA",
            "length": 320,
            "colour": "BW",
            "createdAt": "2024-05-15T11:25:49.400Z",
            "updatedAt": "2024-05-15T11:26:15.998Z",
            "tmdbId": null,
            "posterPath": null,
            "description": null,
            "genres": []
        }
    }
}
```

# Admin delete  movie

```python
1. endpoint =  http://localhost:8080/admin/delete/movie/23745   "Or any port of your choice"
2. you provide an Authorization token in the headres


{
    "type": "success",
    "message": "Movie deleted successfully",
    "data": {
        "deletetMovie": {
            "id": 23745,
            "title": "news tilte",
            "director": "i don't know",
            "year": 1940,
            "country": "USA",
            "length": 320,
            "colour": "BW",
            "createdAt": "2024-05-15T11:25:49.400Z",
            "updatedAt": "2024-05-15T11:26:15.998Z",
            "tmdbId": null,
            "posterPath": null,
            "description": null
        }
    }
}
```
### For Users --> :

# Add Movie To Watch list

```python
1. endpoint = http://localhost:8080/movies/add/to/watchlist   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "movieId":17599
}

It will return an object like this:
{
    "type": "success",
    "message": "Movie added to watchlist successfully.",
    "data": {
        "watchlistEntry": {
            "id": 5,
            "userId": "9988c0da-535a-4435-a7a7-d493255ba2b8",
            "movieId": 17599,
            "movie": {
                "id": 17599,
                "title": "Au hasard Balthazar",
                "director": "Bresson, Robert",
                "year": 1966,
                "country": "France",
                "length": 95,
                "colour": "BW",
                "createdAt": "2024-05-14T22:19:55.988Z",
                "updatedAt": "2024-05-14T22:19:55.988Z",
                "genres": [
                    {
                        "movieId": 17599,
                        "genreId": 481,
                        "genre": {
                            "id": 481,
                            "name": "Drama"
                        }
                    }
                ]
            }
        }
    }
}
```

# Add Movie to FAV

 IT will fetch the movie details from TMDB and add it to user FAV model
 
```python
1. endpoint = http://localhost:8080/movies/add/to/fav   "Or any port of your choice"
2. you provide an Authorization token in the headres

3. Provide the following example json in the body :
{
    "movieId":17573 
}
It will return an object like this:
{
    "type": "success",
    "message": "Movie added to your Favoites successfully.",
    "data": {
        "favoriteEntry": {
            "id": 5,
            "userId": "9988c0da-535a-4435-a7a7-d493255ba2b8",
            "movieId": 17573,
            "movie": {
                "id": 17573,
                "title": "2001: A Space Odyssey",
                "director": "Kubrick, Stanley",
                "year": 1968,
                "country": "UK-USA",
                "length": 139,
                "colour": "Col",
                "createdAt": "2024-05-14T22:19:55.979Z",
                "updatedAt": "2024-05-15T02:44:45.460Z",
                "tmdbId": 62,
                "posterPath": "/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg",
                "description": "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer."
            }
        }
    }
}
```

