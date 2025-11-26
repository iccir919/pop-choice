import { useState } from "react";
import Movie from "./Movie.jsx";

export default function Recommendations({ movies, resetApp }) {

    const [ movieIndex, setMovieIndex ] = useState(0);

    if (!movies || movies.length === 0) {
        return (
            <div className="recommendations">
                <p>No recommendations available.</p>
                <button onClick={resetApp}>Try Again</button>
            </div>
        );
    }

    const lastMovie = movieIndex === movies.length - 1;

    function handleNextMovie() {
        if (lastMovie) {
            resetApp();
        } else {
            setMovieIndex(prevIndex => prevIndex + 1);
        }
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
