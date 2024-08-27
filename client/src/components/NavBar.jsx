import { useContext } from "react";
import { ABOUTUS_ROUTE, ORDER_ROUTE, MAINPAGE_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, PROFILE_ROUTE } from "../utils/consts";
import { Context } from "..";
import { NavLink, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import NavItem from "./NavItem";

const NavBarProfile = observer(() => {
    const { store } = useContext(Context)

    const defaultAvatar = "src/assets/img/default_profile_icon.png"

    if (store.isAuth) {
        return (
            <div>
                <li className="NavBarProfile">
                    <NavLink to={PROFILE_ROUTE}>
                        <img src={store.user.avatar == null ? defaultAvatar : store.user.avatar} alt="" />
                    </NavLink>
                    <h3><NavLink to={PROFILE_ROUTE}>{store.user.username}</NavLink></h3>
                    <h4><NavLink to="#">{store.user.balance.toFixed(2)} ₽</NavLink></h4>
                </li>
            </div>
        );
    }
    else {
        return (
            <div>
                <li className="NavBarProfile">
                    <img src={defaultAvatar} alt="" />
                    <h3><NavLink to={REGISTER_ROUTE}>Регистрация</NavLink></h3>
                    <h4><NavLink to={LOGIN_ROUTE}>Вход</NavLink></h4>
                </li>
            </div>
        );
    }
});

function NavBar() {
    const { store } = useContext(Context)
    const roles = store.user.roles ? [...store.user.roles] : []

    return (
        <ul className="NavBar">
            <NavItem text="Главная" link={MAINPAGE_ROUTE} />
            <NavItem text="О нас" link={ABOUTUS_ROUTE} />
            <NavItem text="Профиль" link={PROFILE_ROUTE} />
            {!roles.includes("EXECUTOR") &&
                <NavItem text="Заказать буст" link={ORDER_ROUTE} />}
            <NavBarProfile />
        </ul>
    );
}

export default NavBar
