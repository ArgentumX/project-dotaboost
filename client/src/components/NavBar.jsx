import { useContext } from "react";
import { ABOUTUS_ROUTE, ORDER_ROUTE, BOOSTER_ROUTE, MAINPAGE_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, PROFILE_ROUTE } from "../utils/consts";
import { Context } from "..";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";

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

function NavBarItem(props) {
    const { store } = useContext(Context)

    const handleClick = () => {
        if (props.link === ORDER_ROUTE && !store.isAuth) {
            swal({
                title: "Ошибка",
                text: "Для того чтобы оформить заказ необходимо авторизоваться.",
                icon: "error"
            })
        }
    }

    return (
        <li className='NavBarItem' onClick={handleClick}><NavLink to={props.link}>{props.text}</NavLink></li>
    );
}

function NavBar() {
    return (
        <ul className="NavBar">
            <NavBarItem text="Главная" link={MAINPAGE_ROUTE} />
            <NavBarItem text="О нас" link={ABOUTUS_ROUTE} />
            <NavBarItem text="Заказать буст" link={ORDER_ROUTE} />
            <NavBarItem text="Стать бустером" link={BOOSTER_ROUTE} />
            <NavBarProfile />
        </ul>
    );
}

export default NavBar
