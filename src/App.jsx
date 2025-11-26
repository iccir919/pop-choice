import { useState } from "react";
import Landing from "./components/Landing.jsx"
import Recommendations from "./components/Recommendations.jsx";

export default function App() {

  const [movies, setMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function resetApp() {
    setMovies(null);
    setError(null);
  }

  async function handleQuestionnaire(formData) {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/get-aronofsky-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }

      if (!Array.isArray(data.recommendations)) {
        throw new Error("Invalid data format received from server");
      }
      console.log(data.recommendations)
      setMovies(data.recommendations);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <p>Loading your perfect Aronofsky movie picks...</p>
        </div>
      </div>
    )
  }

  // Error screen
  if (error) {
    return (
      <div className="app">
        <div className="error-screen">
          <h3>Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button onClick={resetApp}>Try Again</button>
        </div>
      </div>
    );
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
            handleQuestionnaire={handleQuestionnaire} 
          />
        )
      }
    </div>
  )
}