import { useEffect, useState } from "react";

export default function Movie({ movie }) {
    const [ poster, setPoster ] = useState(null);

    const { title, year, description } = parseMovieContent(movie.content);
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    useEffect(() => {
        async function getPoster() {
            const posterUrl = await fetchMoviePoster(title, year, TMDB_API_KEY);
            setPoster(posterUrl);
        }

        getPoster();
    }, [movie]);

    return (
        <div className="movie">
            <h1 className="movie-title">{title} ({year})</h1>
            {poster ? (
                <img 
                    src={poster} 
                    alt={`Poster for ${title}`} 
                    className="movie-poster"
                />
            ) : (
                <p>No poster available</p>
            )}
            <p className="movie-description">{description}</p>
        </div>
    );
}

function parseMovieContent(content) {
    const titleMatch = content.match(/^(.+?) \(/);
    const yearMatch = content.match(/released in (\d{4})/i);

  let description = "";
  if (content.includes(":")) {
    const afterColon = content.split(":")[1].trim();
    description = afterColon.split(".")[0].trim();
  }

    return {
        title: titleMatch ? titleMatch[1] : "",
        year: yearMatch ? yearMatch[1] : "",
        description
    }
}

async function fetchMoviePoster(title, year, apiKey) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${
    encodeURIComponent(title)}&year=${year}&api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results?.length > 0) {
        return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    }

    return null;

}