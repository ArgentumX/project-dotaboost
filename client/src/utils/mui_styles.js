import { grey } from "@mui/material/colors"

export const sliderStyle = {
    color: 'rgb(196, 44, 33)',
    width: 600,
    '& .MuiSlider-thumb': {
        '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px rgba(255, 100, 100, 0.1)`,
        },
        '&.Mui-active': {
            boxShadow: `0px 0px 0px 14px rgba(255, 100, 100, 0.1)`,
        },
    },
}

export const checkboxStyle = {
    color: 'rgb(99,99,99)',
    '&.Mui-checked': {
        color: 'rgba(230, 50, 50, 1.0)',
    },
}

export const checkboxChildrenStyle = {
    position: 'relative',
    left: '1.5em',
}

export const textStyle = {
    fontFamily: 'Nunito',
    fontWeight: 500,
    fontSize: "1.07em",
    color: 'rgba(255, 255, 255, 0.87)',
}

export const radioStyle = {
    color: 'grey',
    '&.Mui-checked': {
        color: 'rgba(230, 50, 50, 1.0)',
    }
}
