import movies from "../data/movies.js";
import { openai } from "../lib/openai.js";
import { supabase } from "../lib/supabase.js";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'


/*
    Split movies into text chunks
    Return LangChain's "output" - the array of Document objects
*/
async function splitText(text) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap: 35
    })

    const output = await splitter.createDocuments([text])
    return output;
}

/*
    Create an embedding from each text chunk.
    Store all embeddings and corresponding text in Supabase
*/
async function createAndStoreEmbeddings() {
    const movieContent = movies
        .map((movie) => movie.content)
        .join("\n");
    const chunkData = await splitText(movieContent);

    const data = await Promise.all(
        chunkData.map(async (chunk) => {
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: chunk.pageContent
            });

            return {
                content: chunk.pageContent,
                embedding: embeddingResponse.data[0].embedding
            }
        })
    );

    await supabase.from("aronofsky_movies").insert(data);
    console.log('Embedding and storing complete!');
}

await createAndStoreEmbeddings()


