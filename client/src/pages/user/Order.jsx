import React, { useContext, useEffect, useRef, useState } from "react";
import Slider from '@mui/material/Slider';
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import order_calculator from "../../utils/order_calculator";
import { Context } from "../..";
import swal from 'sweetalert';
import { checkboxChildrenStyle, checkboxStyle, sliderStyle, textStyle } from "../../utils/mui_styles";
import { useNavigate } from "react-router-dom";
import { MAINPAGE_ROUTE } from "../../utils/consts";
import styles from './Order.module.css';

function Order() {
    const openedEye = "src/assets/img/view.png";
    const closedEye = "src/assets/img/hide.png";

    const [startMMR, setStartMMR] = useState(0);
    const [endMMR, setEndMMR] = useState(2000);
    const [party, setParty] = useState(false);
    const [priority, setPriority] = useState(false);
    const [steamguard, setSteamguard] = useState(false);
    const [playtime, setPlaytime] = useState({});
    const [steamLogin, setSteamLogin] = useState("");
    const [steamPassword, setSteamPassword] = useState("");

    const [isTime, setIsTime] = useState(false);
    const [time, setTime] = useState(Array(4).fill(true));
    const [cost, setCost] = useState(0);
    const [passwordIcon, setPasswordIcon] = useState(openedEye);
    const [orderSubmit, setOrderSubmit] = useState(false);

    const firstRender = useRef(true);

    const { orderStore } = useContext(Context);

    const navigate = useNavigate();

    useEffect(() => {
        setCost(order_calculator(startMMR, endMMR, party, priority, steamguard, time))
    }, [startMMR, endMMR, party, priority, steamguard, time])


    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        orderStore.createOrder(startMMR, endMMR, party, priority, steamguard, playtime, steamLogin, steamPassword);

        if (orderStore.order) {
            swal({
                title: "Поздравляем!",
                text: "Ваш заказ успешно создан.",
            })
                .then(() => {
                    navigate(MAINPAGE_ROUTE);
                })
        } else {
            console.log(orderStore.order);
        }
    }, [orderSubmit])

    const submit = () => {
        if (startMMR > endMMR) {
            swal({
                title: "Ошибка",
                text: "Начальный рейтинг ниже конечного.",
                icon: "error",
            })
            return;
        }

        if (cost == 0) {
            swal({
                title: "Ошибка",
                text: "Неверное заполнение формы.",
                icon: "error",
            })
            return;
        }

        if (endMMR - startMMR < 100) {
            swal({
                title: "Ошибка",
                text: "Конечный рейтинг слишком мало отличается от начального. Минимальная разница - 100.",
                icon: "error"
            })
            return;
        }

        if (isTime && time.every(el => el === false)) {
            swal({
                title: "Ошибка",
                text: "Выберите хотя бы один промежуток времени или закройте «Выбрать время».",
                icon: "error"
            })
            return;
        }

        const playtimeObject = {
            "NIGHT": time[3],
            "MORNING": time[0],
            "AFTERNOON": time[1],
            "EVENING": time[2],
        };

        setPlaytime(playtimeObject);
        setOrderSubmit(true);
    }

    const handlePasswordIconClick = () => {
        setPasswordIcon(passwordIcon == openedEye ? closedEye : openedEye);
    }

    const handleStartMMRInput = (MMR) => {
        if (isNaN(MMR) || Number(MMR) >= 7900) {
            return false;
        }

        setStartMMR(Number(MMR));
    }

    const handleEndMMRInput = (MMR) => {
        if (isNaN(MMR) || Number(MMR) >= 7900) {
            return false;
        }

        setEndMMR(Number(MMR));
    }

    return (
        <div className="center">
            <div className={styles["order"]}>
                <h1>Форма заказа</h1>
                <div className={styles["calculator"]}>
                    <h3>Начальный MMR:
                        <input type="text" className={styles["mmr-input"]} value={startMMR} onChange={(e) => handleStartMMRInput(e.target.value)} />
                    </h3>
                    <Slider
                        value={startMMR}
                        onChange={(event, value) => setStartMMR(value)}
                        defaultValue={0}
                        min={0}
                        max={7900}
                        sx={sliderStyle}
                    />
                    <h3>Желаемый MMR:
                        <input type="text" className={styles["mmr-input"]} value={endMMR} onChange={(e) => handleEndMMRInput(e.target.value)} />
                    </h3>
                    <Slider
                        value={endMMR}
                        onChange={(event, value) => setEndMMR(value)}
                        defaultValue={2000}
                        min={100}
                        max={8000}
                        sx={sliderStyle}
                    />
                    <div className={styles["checkbox-container"]}>
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
                <div className={styles["steam-credentials"]}>
                    <h3>Введите данные от Вашего Steam аккаунта</h3>
                    <input
                        className="textbox"
                        id={styles['textbox']}
                        placeholder="Логин"
                        type="text"
                        value={steamLogin}
                        onChange={e => setSteamLogin(e.target.value)}
                        autoComplete="new-password"
                    />
                    <input
                        className="textbox"
                        id={styles['textbox']}
                        placeholder="Пароль"
                        type={passwordIcon == openedEye ? "password" : "text"}
                        value={steamPassword}
                        onChange={e => setSteamPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <img className="password-icon" id={styles['password-icon']} src={passwordIcon} alt="" onClick={handlePasswordIconClick} />
                </div>
                <h2>Рассчетная стоимость: <b>{cost}₽</b></h2>
                <button onClick={submit}>Подтвердить заказ</button>
            </div>
        </div>
    );
}

export default Order;
