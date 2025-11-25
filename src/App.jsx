import { useState } from "react";
import Landing from "./components/Landing.jsx"
import Recommendations from "./components/Recommendations.jsx";

export default function App() {

  const [movies, setMovies] = useState([
    {
        "id": 2,
        "content": "Requiem for a Dream (1 hr 42 min): Four Brooklyn residents chase their dreams through addiction, gradually falling into devastating psychological and physical decline. Drama film released in 2000. Directed by Darren Aronofsky. Written by Darren Aronofsky and Hubert Selby Jr. Starring Ellen Burstyn, Jared Leto and Jennifer Connelly. Rated 8.3 on IMDB",
        "similarity": 0.786587709153165
    },
    {
        "id": 3,
        "content": "The Fountain (1 hr 37 min): A scientist, a conquistador and a future traveler each search for eternal life across different eras, exploring love, loss and mortality. Drama, Sci‑Fi, Romance film released in 2006. Directed by Darren Aronofsky. Written by Darren Aronofsky. Starring Hugh Jackman and Rachel Weisz. Rated 7.2 on IMDB",
        "similarity": 0.777836998314355
    },
    {
        "id": 4,
        "content": "The Wrestler (1 hr 49 min): An aging professional wrestler struggles to rebuild his life outside the ring while facing health issues and strained relationships. Drama, Sport film released in 2008. Directed by Darren Aronofsky. Written by Robert Siegel. Starring Mickey Rourke, Marisa Tomei and Evan Rachel Wood. Rated 7.9 on IMDB",
        "similarity": 0.773128244057734
    }
]);

  async function handleQuestionnaire(formData) {
    console.log("Form Data Submitted:", formData);
    try {
      const response = await fetch("/api/get-aronofsky-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setMovies(data.recommendations);
      console.log("Movie Recommendations:", data.recommendations);

    } catch (error) {
      console.error("Error submitting questionnaire:", error);
    }
  }

  return (
    <div className="app">
      {
        movies ? <Recommendations movies={movies} /> :
          <Landing handleQuestionnaire={handleQuestionnaire} />
      }
    </div>
  )
}