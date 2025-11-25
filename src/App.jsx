import { useState } from "react";
import Landing from "./components/Landing.jsx"
import Recommendations from "./components/Recommendations.jsx";

export default function App() {

  const [movies, setMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function resetApp() {
    setMovies(null);
  }

  async function handleQuestionnaire(formData) {
    
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <p>Loading your perfect Aronofsky movie picks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {
        movies ? 
        (
          <Recommendations 
            movies={movies} 
            resetApp={resetApp} 
          />
        ) : (
          <Landing 
            key={movies === null ? "reset" : "loaded"}
            handleQuestionnaire={handleQuestionnaire} 
          />
        )
      }
    </div>
  )
}