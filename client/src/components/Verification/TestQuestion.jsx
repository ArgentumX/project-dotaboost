import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { radioStyle, textStyle } from "../../utils/mui_styles";
import styles from './TestQuestion.module.css';

function TestQuestion({ id, title, opts, onChange, value }) {
    const handleChange = (event) => {
        onChange(id, event.target.value);
    }

    return (
        <div className={styles["test-question"]}>
            <h2 className={styles["test-question-title"]}>{id + ". " + title}</h2>
            <div className={styles["test-question-answers-list"]}>
                <FormControl>
                    <RadioGroup
                        name="radio-test-answer"
                        defaultValue=""
                        value={value ? value : ""}
                        onChange={handleChange}
                    >
                        {opts.map((opt) => {
                            return (
                                <FormControlLabel
                                    value={opt}
                                    control={
                                        <Radio sx={radioStyle} />
                                    }
                                    label={
                                        <Typography sx={textStyle}>
                                            {opt}
                                        </Typography>
                                    }
                                    key={opt}
                                />
                            );
                        })}
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );
}

export default TestQuestion;
