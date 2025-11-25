import { useEffect, useState } from "react";

export default function Movie({ movie }) {
    const [ poster, setPoster ] = useState(null);

    const { title, year } = parseMovieContent(movie.content);

    return (
        <div className="movie">
            <h1>{title}</h1>
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