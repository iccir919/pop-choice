export default function Movie({ movie }) {
    if (!movie) {
        return <p>Unable to load movie details.</p>
    }

    const { title, year, description, posterUrl } = movie;

    return (
        <div className="movie">
            <h1 className="movie-title">
                {title} {year ? `(${year})` : ""}
            </h1>

            {posterUrl ? (
                <img 
                    src={posterUrl} 
                    alt={`Poster for ${title}`} 
                    className="movie-poster"
                    onError={(event) => event.target.style.display = "none"}
                />
            ) : (
                <p>No poster available</p>
            )}
            <p className="movie-description">
                {description || "No description available."}
            </p>
        </div>
    );
}



