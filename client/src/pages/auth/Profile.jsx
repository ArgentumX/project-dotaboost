import React, { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { setImageUploadSettings, toggleImageUpload } from "../../components/ImageUpload/ImageUpload";
import NavVertical from "../../components/NavBar/NavVertical";
import NavItem from "../../components/NavBar/NavItem";
import { MAINPAGE_ROUTE, PASSWORD_RESET_ROUTE, VERIFICATION_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import ExecutorTicketService from "../../service/ExecutorTicketService";
import styles from './Profile.module.css';

const Profile = observer(() => {
    const { userStore, executorStore } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    setImageUploadSettings(1, true, userStore.uploadAvatar);

    useEffect(() => {
        ExecutorTicketService.getUserTicket().catch((e) => {
            setLoading(false);
        }).then(data => {
            executorStore.setExecutorTicket(data?.ticket);
            setLoading(false);
        })
    }, [])

    if (loading) {
        return (
            <div >
                <ReactLoading type="cylon" color="#696969" height={100} width={50} />
            </div>
        );
    }

    return (<>
        <div className={styles["profile-page"]}>
            <img className={styles["profile-page-background"]} src="src/assets/img/axe.png" alt="" />
            <div className={styles["profile-page-info"]}>
                <div className={styles["profile-page-avatar-container"]}>
                    <img className={styles["profile-page-avatar"]} src={userStore.user.avatar ? userStore.user.avatar : "src/assets/img/default_profile_icon.png"} alt="" />
                    <img className={styles["profile-page-edit-icon"]} role="button" onClick={() => {
                        toggleImageUpload();
                        return false;
                    }} src="src/assets/img/icon_edit.png" />
                </div>
                <h1>{userStore.user.username}</h1>
                <h4>Баланс: {userStore.user.balance.toFixed(2)} ₽</h4>
                <NavVertical>
                    <NavItem text="Смена пароля" link={PASSWORD_RESET_ROUTE} />
                    <NavItem text={executorStore.executorTicket?.image ? "Статус верификации" : "Пройти верификацию бустера"} link={VERIFICATION_ROUTE} />
                    <NavItem text="Выйти" link="#" onClick={() => {
                        navigate(MAINPAGE_ROUTE);
                        userStore.logout();
                    }}
                    />
                </NavVertical>
            </div>
        </div>
    </>);
});

export default Profile;
