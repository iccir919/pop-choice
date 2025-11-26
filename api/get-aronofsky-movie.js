import 'dotenv/config'
import { openai } from "../lib/openai.js";
import { supabase } from "../lib/supabase.js";

export default async function handler(request, response) {
    console.log("Incoming request body:", request.body); 

    /* 
        Validate Input
    */
    const { favoriteMovie, timeframe, mood, actor  } = request.body;

    if (!favoriteMovie || !timeframe || !mood || !actor) {
        return response.status(400).json({ 
            error: "All questionnaire fields are required." 
        });
    }

    const query = generatePrompt(favoriteMovie, timeframe, mood, actor);

    try {

        /*
            Generate Embedding
        */
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: query
        }).catch((error) => {
            console.error("OpenAI Embedding Error:", error);
            throw Error("Embedding generation failed");
        });

        const embedding = embeddingResponse.data[0].embedding;

        if (!embedding) {
            console.error("Invalid embedding response:", embeddingResponse);
            return response.status(500)
                .json({ 
                    error: "Failed to generate embedding" 
                });
        }
        
        /*
            Query Supabase for Movie Matches
        */
        const { data, error } = await supabase.rpc('match_aronofsky_movies', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 3
        });

        if (error) {
            console.error("Supabase RPC error:", error);
            return response.status(500)
                .json({ error: "Failed to fetch movie recommendations" });
        }

        if (!data || data.length === 0) {
            return response.status(200)
                .json({ 
                    recommendations: [],
                    message: "No matching movies found."
                });
        }

        /*
            Parse content + fetch poster URLs
        */
       const moviesWithPosters = await Promise.all(
            data.map(async (movie) => {
                const parsed = parseMovieContent(movie.content);

                const posterUrl = await fetchMoviePoster(parsed.title, parsed.year)
                    .catch(err => {
                        console.error(`Poster fetch failed for ${parsed.title}:`, err);
                        return null;
                    });

                return {
                    id: movie.id,
                    title: parsed.title,
                    year: parsed.year,
                    description: parsed.description,
                    posterUrl
                };
            })
       );

       return response.status(200)
            .json({ recommendations: moviesWithPosters });


    } catch(error) {
        console.error("Unexpected error in handler:", error);
        return response.status(500)
            .json({ 
                error: "Something went wrong while generating recommendations." 
            });    
    }
}

function generatePrompt(favoriteMovie, timeframe, mood, actor) {
    return `My favorite movie is ${favoriteMovie}. I want to find a ${timeframe} movie. The mood I'm looking for is ${mood}. One actor I really admire is ${actor}.`;
}

function parseMovieContent(content) {
    if (!content || typeof content !== "string") {
        return {
            title: "Unknown Title",
            year: "",
            description: "No description available"
        };
    }

        const titleMatch = content.match(/^(.+?) \(/);
        const yearMatch = content.match(/released in (\d{4})/i);

        let description = "";
        if (content.includes(":")) {
            try {
                description = content.split(":")[1].trim().split(".")[0].trim();
            } catch {
                description = "";
            }
        }

        return {
            title: titleMatch ? titleMatch[1].trim() : "Unknown Title",
            year: yearMatch ? yearMatch[1] : "",
            description: description || "No description available"
        }
}

async function fetchMoviePoster(title, year) {
    if ( !title || title === "Unknown Title" ) return null;

    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
        console.error("TMDB API key is missing");
        return null;
    }

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}${year ? `&year=${year}` : ""}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_KEY}`
        }
    };

    const tmbdbResponse = await fetch(url, options);

    if (!tmbdbResponse.ok) {
        console.error("TMDB API error:", tmbdbResponse);
        return null;
    }

    const data = await tmbdbResponse.json();
    const posterPath = data.results?.[0]?.poster_path;

    if (posterPath) {
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    } else {
        return null;
    }
}