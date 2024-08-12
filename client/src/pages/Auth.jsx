import React, { useContext, useState } from "react";
import {registration, login} from "../http/userAPI"
import { useLocation, useNavigate} from "react-router-dom";
import { LOGIN_ROUTE, MAINPAGE_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password)
            } else if (password){
                data = await registration(email, password, username)
            }

            user.setIsAuth(true)
            navigate(MAINPAGE_ROUTE)
        } catch (e) {
            alert(e.response.data.message)         
        }
    }
    
    return (
        <div className="center">
            <div className = "AuthBox">
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
                    <div hidden={true}/>
                    }
                    <input 
                        className="textbox"
                        placeholder="Пароль"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    /> 
                    <button 
                        type="submit"
                        onClick={click}>
                        { isLogin ? "Войти" : "Зарегистрироваться" }
                    </button>
            </div>
        </div>
    );
});

export default Auth;
