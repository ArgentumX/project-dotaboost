import React, { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { setImageUploadSettings, toggleImageUpload } from "../components/ImageUpload";
import NavHorizontal from "../components/NavHorizontal";
import NavItem from "../components/NavItem";
import { MAINPAGE_ROUTE, PASSWORD_RESET_ROUTE, VERIFICATION_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import ExecutorTicketService from "../service/ExecutorTicketService";

const Profile = observer(() => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    setImageUploadSettings(1, true, store.uploadAvatar);

    useEffect(() => {
        ExecutorTicketService.getUserTicket().catch((e) => {
            setLoading(false);
        }).then(data => {
            store.setExecutorTicket(data?.ticket);
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
                    <NavItem text={store.executorTicket?.image ? "Статус верификации" : "Пройти верификацию бустера"} link={VERIFICATION_ROUTE} />
                </NavHorizontal>
                <button onClick={() => {
                    navigate(MAINPAGE_ROUTE);
                    store.logout();
                }}>Выйти</button>
            </div>
        </div>
    </>);
});

export default Profile;
