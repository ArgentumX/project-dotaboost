import React, { useContext, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { setImageUploadSettings, toggleImageUpload } from "../components/ImageUpload";
import NavHorizontal from "../components/NavHorizontal";
import NavItem from "../components/NavItem";
import { PASSWORD_RESET_ROUTE, VERIFICATION_ROUTE } from "../utils/consts";

const Profile = observer(() => {    
    const { store } = useContext(Context);

    setImageUploadSettings(1, true, store.uploadAvatar);

    return (<>
        <div className="profile">
            <img className="profilePageImg" src="src/assets/img/axe.png" alt="" />
            <div className="profilePageInfo">
                <img className="profilePageAvatar" src={store.user.avatar ? store.user.avatar : "src/assets/img/default_profile_icon.png"} alt="" />
                <img className="profilePageEditIcon" role="button" onClick={() => {
                    toggleImageUpload();
                    return false;
                }} src="src/assets/img/icon_edit.png" />
                <h1>{store.user.username}</h1>
                <h4>Баланс: {store.user.balance.toFixed(2)} ₽</h4>
                <NavHorizontal>
                    <NavItem text="Смена пароля" link={PASSWORD_RESET_ROUTE} />
                    <NavItem text="Пройти верификацию бустера" link={VERIFICATION_ROUTE}/>
                </NavHorizontal>
                <button onClick={() => store.logout()}>Выйти</button>
            </div>
        </div>
    </>);
});

export default Profile;
