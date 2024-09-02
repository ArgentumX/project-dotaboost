import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { checkboxStyle, textStyle } from "../../utils/mui_styles";
import styles from './ExecutorTicketOption.module.css';

const ExecutorTicketOption = ({ type, onChange, value, label }) => {
    if (type == "checkbox") {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={value}
                        onChange={onChange}
                        sx={checkboxStyle}
                    />
                }
                label={
                    <Typography sx={textStyle}>{label}</Typography>
                }
            />
        );
    }

    if (type == "numeric") {
        return (
            <div className={styles["numeric-input"]}>
                <p>{label}</p>
                <input type="text" onChange={(e) => {
                    if (!isNaN(e.target.value)) {
                        onChange(e.target.value)
                    }
                }} />
            </div>
        );
    }
}

export default ExecutorTicketOption;
