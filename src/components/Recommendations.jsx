import { useState } from "react";
import Movie from "./Movie.jsx";

export default function Recommendations({ movies }) {

    const [ movieIndex, setMovieIndex ] = useState(0);

    if (!movies || movies.length === 0) {
        return <p>No recommendations available.</p>;
    }

    const currentMovie = movies[movieIndex];

    return (
        <div className="recommendations">
            <Movie movie={currentMovie} />
        </div>
    );


}
