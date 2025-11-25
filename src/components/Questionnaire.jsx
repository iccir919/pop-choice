import { useState } from "react";
import ChipSelect from "./ChipSelect.jsx"

export default function Questionnaire({ handleQuestionnaire }) {

    const [questionnaire, setQuestionnaire] = useState({
        favoriteMovie: "",
        timeframe: "",
        mood: "",
        actor: ""
    })

    function handleSubmit(event) {
        event.preventDefault();
        handleQuestionnaire(questionnaire);
    }

    function update (key, value) {
        setQuestionnaire(prev => ({ ...prev, [key]: value}));
    }

    return (
        <form className="questionnaire" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="favoriteMovie">What’s your favorite movie and why?</label>
                <textarea
                    id="favoriteMovie"
                    name="favoriteMovie"
                    rows={3}
                    value={questionnaire.favoriteMovie}
                    onChange={(event) => update("favoriteMovie", event.target.value)}
                >
                </textarea>
            </div>

            <ChipSelect
                name="timeframe"
                label="Are you in the mood for something new or a classic?"
                options={["New", "Classic"]}
                value={questionnaire.timeframe}
                onChange={(value) => update("timeframe", value)}
            />

            <ChipSelect
                name="mood"
                label="What are you in the mood for?"
                options={["Fun", "Serious", "Inspiring", "Scary"]}
                value={questionnaire.mood}
                onChange={(value) => update("mood", value)}
            />

            <div>
                <label htmlFor="actor">
                    Which famous film person would you love to be stranded on an island with and why?
                </label>
                <textarea
                    id="actor"
                    name="actor"
                    rows={2}
                    value={questionnaire.actor}
                    onChange={(event) => update("actor", event.target.value)}
                >
                </textarea>
            </div>

            <button type="submit">Let's Go</button>
        </form>
    )
}