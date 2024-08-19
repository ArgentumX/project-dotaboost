import React, { useContext, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import ImageUpload from "../components/ImageUpload";

const Profile = observer(() => {
    const {store} = useContext(Context)

    const [showImageUpload, setShowImageUpload] = useState(false);
    const uploadAvatar = () => {
        setShowImageUpload(true)
        return false
    }

    return (<>
        <div className="profile">
            <img className="profilePageImg" src="src/assets/img/axe.png" alt=""/>
            { showImageUpload ? <ImageUpload/> : null }
            <div className="profilePageInfo">
                <img className="profilePageAvatar" src="src/assets/img/default_profile_icon.png" alt=""/>
                <img className="profilePageEditIcon" role="button" onClick={uploadAvatar} src="src/assets/img/icon_edit.png"/>
                <h1>{store.user.username}</h1>
                <h4>Баланс: {store.user.balance.toFixed(2)} ₽</h4>
                <button onClick={ () => store.logout() }>Выйти</button> 
            </div>
        </div>
    </>);
});

export default Profile;
