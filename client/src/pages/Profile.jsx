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

    return (
        <div className="center">
          <button onClick={() => logOut()}>Выйти</button> 
        </div>
    );
});

export default Profile;
