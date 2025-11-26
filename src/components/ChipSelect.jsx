export default function ChipSelect({ label, name, options, value, onChange }) {
    return (
        <fieldset className="chip-select">
            <legend>{label}</legend>

            <div className="chip-select-options">
                {options.map(option => {
                    const optionId = `${name}-${option}`;
                    return (
                        <div key={optionId}>
                            <label 
                                key={option}
                                className="chip-select-option"
                            >
                                <input
                                    type="radio"
                                    name={name}
                                    value={option}
                                    checked={value === option}
                                    onChange={() => onChange(option)}
                                />
                                {option}
                            </label>
                        </div>
                    )
                })}
            </div>
        </fieldset>
    )
}