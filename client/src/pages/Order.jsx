import React, { useContext, useEffect, useState } from "react";
import Slider from '@mui/material/Slider';
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import Calculator from "../components/Calculator";
import { Context } from "..";

function Order() {
    const [startMMR, setStartMMR] = useState(0);
    const [endMMR, setEndMMR] = useState(2000);
    const [party, setParty] = useState(false);
    const [priority, setPriority] = useState(false);
    const [steamguard, setSteamguard] = useState(false);
    const [isTime, setIsTime] = useState(false);
    const [time, setTime] = useState(Array(4).fill(true));
    const [steamLogin, setSteamLogin] = useState();
    const [steamPassword, setSteamPassword] = useState();
    const [cost, setCost] = useState(0);

    const { store } = useContext(Context);

    useEffect(() => {
        setCost(Calculator(startMMR, endMMR, party, priority, steamguard, time))
    }, [startMMR, endMMR, party, priority, steamguard, time])

    const sliderStyle = {
        color: 'rgb(226, 44, 33)',
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

    const checkboxStyle = {
        color: 'rgb(99,99,99)',
        '&.Mui-checked': {
            color: 'rgba(230, 50, 50, 1.0)',
        },
    }

    const checkboxChildrenStyle = {
        position: 'relative',
        left: '1.5em',
    }

    const textStyle = {
        fontFamily: 'Nunito',
        fontWeight: 500,
        fontSize: "1.07em",
        color: 'rgba(255, 255, 255, 0.87)',
    }

    const submit = () => {
        if (startMMR > endMMR) {
            alert("Ошибка: начальный рейтинг выше конечного.");
            return;
        }

        if (cost == 0) {
            alert("Ошибка: неверное заполнение формы.");
            return;
        }

        if (endMMR - startMMR < 100) {
            alert("Ошибка: конечный рейтинг слишком мало отличается от начального. Минимальная разница - 100.")
            return;
        }

        if (isTime && time.every(el => el === false)) {
            alert("Ошибка: выберите хотя бы один промежуток времени или закройте «Выбрать время».")
            return;
        }

        const playtimeObject = {
            "NIGHT": time[3],
            "MORNING": time[0],
            "AFTERNOON": time[1],
            "EVENING": time[2],
        };

        store.createOrder(startMMR, endMMR, party, priority, steamguard, playtimeObject, steamLogin, steamPassword);
    }

    return (
        <div className="center">
            <div className="order">
                <h1>Форма заказа</h1>
                <div className="calculator">
                    <h3>Начальный MMR: {startMMR}</h3>
                    <Slider
                        value={startMMR}
                        onChange={(event, value) => setStartMMR(value)}
                        defaultValue={0}
                        min={0}
                        max={7900}
                        sx={sliderStyle}
                    />
                    <h3>Желаемый MMR: {endMMR}</h3>
                    <Slider
                        value={endMMR}
                        onChange={(event, value) => setEndMMR(value)}
                        defaultValue={2000}
                        min={100}
                        max={8000}
                        sx={sliderStyle}
                    />
                    <div className="checkbox-container">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={party}
                                    onChange={() => setParty(!party)}
                                    sx={checkboxStyle}
                                />}
                            label={
                                <Typography sx={textStyle}>
                                    Дуо с бустером
                                </Typography>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    sx={checkboxStyle}
                                    checked={priority}
                                    onChange={() => setPriority(!priority)}
                                />}
                            label={
                                <Typography sx={textStyle}>
                                    Высокий приоритет
                                </Typography>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    sx={checkboxStyle}
                                    checked={steamguard}
                                    onChange={() => setSteamguard(!steamguard)}
                                />}
                            label={
                                <Typography sx={textStyle}>
                                    Не отключать Steam Guard
                                </Typography>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    sx={checkboxStyle}
                                    checked={isTime}
                                    onChange={() => {
                                        setIsTime(!isTime);
                                        setTime(Array(4).fill(true))
                                    }}
                                />}
                            label={
                                <Typography sx={textStyle}>
                                    Выбрать время
                                </Typography>
                            }
                        />
                        {isTime && <>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={[checkboxStyle, checkboxChildrenStyle]}
                                        defaultChecked
                                        checked={isTime[0]}
                                        onChange={() => {
                                            const newTime = [...time];
                                            newTime[0] = !newTime[0];
                                            setTime(newTime);
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={[textStyle, checkboxChildrenStyle]}>
                                        Утро (06:00-12:00)
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={[checkboxStyle, checkboxChildrenStyle]}
                                        defaultChecked
                                        checked={isTime[1]}
                                        onChange={() => {
                                            const newTime = [...time];
                                            newTime[1] = !newTime[1];
                                            setTime(newTime);
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={[textStyle, checkboxChildrenStyle]}>
                                        Полдень (12:00-18:00)
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={[checkboxStyle, checkboxChildrenStyle]}
                                        defaultChecked
                                        checked={isTime[2]}
                                        onChange={() => {
                                            const newTime = [...time];
                                            newTime[2] = !newTime[2];
                                            setTime(newTime);
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={[textStyle, checkboxChildrenStyle]}>
                                        Вечер (18:00-00:00)
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={[checkboxStyle, checkboxChildrenStyle]}
                                        defaultChecked
                                        checked={isTime[3]}
                                        onChange={() => {
                                            const newTime = [...time];
                                            newTime[3] = !newTime[3];
                                            setTime(newTime);
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={[textStyle, checkboxChildrenStyle]}>
                                        Ночь (00:00-06:00)
                                    </Typography>
                                }
                            />
                        </>
                        }
                    </div>
                </div>
                <div className="steam-credentials">
                    <h3>Введите данные от Вашего Steam аккаунта</h3>
                    <input
                        className="textbox"
                        placeholder="Логин"
                        type="text"
                        value={steamLogin}
                        onChange={e => setSteamLogin(e.target.value)}
                    />
                    <input
                        className="textbox"
                        placeholder="Пароль"
                        type="password"
                        value={steamPassword}
                        onChange={e => setSteamPassword(e.target.value)}
                    />
                </div>
                <h2>Рассчетная стоимость: <b>{cost}₽</b></h2>
                <button className="button" onClick={submit}>Подтвердить заказ</button>
            </div>
        </div>
    );
}

export default Order;
