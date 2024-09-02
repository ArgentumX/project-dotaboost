import { NavLink, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../..";
import { LOGIN_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE } from "../../utils/consts";
import styles from './NavBarProfile.module.css';

const NavBarProfile = observer(() => {
    const { userStore } = useContext(Context)

    const navigate = useNavigate();

    const defaultAvatar = "src/assets/img/default_profile_icon.png"

    if (userStore.isAuth) {
        return (
            <div>
                <li className={styles['navbar-profile']}>
                    <img src={userStore.user.avatar == null ? defaultAvatar : userStore.user.avatar} alt="" onClick={() => {navigate(PROFILE_ROUTE)}}/>
                    <h3><NavLink to={PROFILE_ROUTE}>{userStore.user.username}</NavLink></h3>
                    <h4><NavLink to="#">{userStore.user.balance.toFixed(2)} ₽</NavLink></h4>
                </li>
            </div>
        );
    }
    else {
        return (
            <div>
                <li className={styles['navbar-profile']}>
                    <img src={defaultAvatar} alt="" />
                    <h3><NavLink to={REGISTER_ROUTE}>Регистрация</NavLink></h3>
                    <h4><NavLink to={LOGIN_ROUTE}>Вход</NavLink></h4>
                </li>
            </div>
        );
    }
});

export default NavBarProfile;
