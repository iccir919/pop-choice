import { useState } from "react";
import Movie from "./Movie.jsx";

export default function Recommendations({ movies, resetApp }) {

    const [ movieIndex, setMovieIndex ] = useState(0);
    const lastMovie = movieIndex === movies.length - 1;

    function handleNextMovie() {
        if (lastMovie) {
            resetApp();
        } else {
            setMovieIndex(movieIndex + 1);
        }
    }

    if (!movies || movies.length === 0) {
        return <p>No recommendations available.</p>;
    }

    return (
        <div className="recommendations">
            <Movie movie={movies[movieIndex]} />

            <button onClick={handleNextMovie}>
                {lastMovie ? "Start Over" : "Next Movie"}
            </button>
        </div>
    );


}
