import Header from "./Header.jsx"
import Questionnaire from "./Questionnaire.jsx"

export default function Landing({ handleQuestionnaire }) {
    return (
        <div className="landing">
            <Header />
            <Questionnaire 
                handleQuestionnaire={handleQuestionnaire}
            />
        </div>
    )
}