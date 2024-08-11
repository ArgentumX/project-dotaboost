import React, { useState } from "react";
import {registration, login} from "../http/userAPI"
import { useLocation } from "react-router-dom";
import { LOGIN_ROUTE } from "../utils/consts";

function Auth() {
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const click = async () => {
        if (isLogin) {
            const response = await login()
        } else {
            const response = await registration(email, password)
            console.log(response)
        }
    }

    return (
        <div className="center">
            <div className = "AuthBox">
                <h1>{isLogin ? "Вход" : "Регистрация"}</h1> 
                <input 
                    className="textbox"
                    placeholder="Почта" type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input 
                    className="textbox"
                    placeholder="Пароль" type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
        </div>
   );
}

export default Auth;
