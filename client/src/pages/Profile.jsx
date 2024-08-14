import React, { useContext } from "react";
import { Context } from "..";
import { MAINPAGE_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const Profile = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate();

    const logOut = () => {
        user.setIsAuth(false)
        localStorage.clear()
        navigate(MAINPAGE_ROUTE)
    }

    const uploadAvatar = () => {
        alert()
        return false
    }

    return (<>
        <div className="profile">
            <img className="profilePageImg" src="src/assets/img/axe.png" alt=""/>
            <div className="profilePageInfo">
                <img className="profilePageAvatar" src="src/assets/img/default_profile_icon.png" alt=""/>
                <img className="profilePageEditIcon" role="button" onClick={uploadAvatar} src="src/assets/img/icon_edit.png"/>
                <h1>{user.name}</h1>
                <h4>Баланс: {user.balance.toFixed(2)} ₽</h4>
                <button onClick={() => logOut()}>Выйти</button> 
            </div>
        </div>
    </>);
});

export default Profile;
