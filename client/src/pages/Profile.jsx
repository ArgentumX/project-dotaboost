import React, { useContext, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { toggleImageUpload } from "../components/ImageUpload";

const Profile = observer(() => {
    const {store} = useContext(Context)

    return (<>
        <div className="profile">
            <img className="profilePageImg" src="src/assets/img/axe.png" alt=""/>
            <div className="profilePageInfo">
                <img className="profilePageAvatar" src="src/assets/img/default_profile_icon.png" alt=""/>
                <img className="profilePageEditIcon" role="button" onClick={() => {
                    toggleImageUpload();
                    return false;
                }} src="src/assets/img/icon_edit.png"/>
                <h1>{store.user.username}</h1>
                <h4>Баланс: {store.user.balance.toFixed(2)} ₽</h4>
                <button onClick={ () => store.logout() }>Выйти</button> 
            </div>
        </div>
    </>);
});

export default Profile;
