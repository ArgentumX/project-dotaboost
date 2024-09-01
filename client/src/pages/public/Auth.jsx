import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, MAINPAGE_ROUTE } from "../../utils/consts";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const Auth = observer(() => {
    const openedEye = "src/assets/img/view.png";
    const closedEye = "src/assets/img/hide.png";

    const { store } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [passwordIcon, setPasswordIcon] = useState(openedEye);

    useEffect(() => {
        if (store.isAuth) {
            navigate(MAINPAGE_ROUTE);
        }
    }, [store.isAuth])

    const handlePasswordIconClick = () => {
        setPasswordIcon(passwordIcon == openedEye ? closedEye : openedEye);
    }

    const click = async () => {
        try {
            if (isLogin) {
                store.login(email, password)
            } else if (password) {
                store.registration(email, username, password)
            }
        } catch (e) {
            swal({
                title: "Ошибка",
                text: e.response.data.message,
                icon: "error"
            })
        }
    }

    return (
        <div className="center">
            <div className="AuthBox">
                <h1>{isLogin ? "Вход" : "Регистрация"}</h1>
                <input
                    className="textbox"
                    placeholder="Почта"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                {!isLogin ?
                    <input
                        className="textbox"
                        placeholder="Ник"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    :
                    <div hidden={true} />
                }
                <input
                    className="textbox"
                    placeholder="Пароль"
                    type={passwordIcon == openedEye ? "password" : "text"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <img className="password-icon" src={passwordIcon} alt="" onClick={handlePasswordIconClick} />
                <button
                    type="submit"
                    onClick={click}>
                    {isLogin ? "Войти" : "Зарегистрироваться"}
                </button>
            </div>
        </div>
    );
});

export default Auth;
