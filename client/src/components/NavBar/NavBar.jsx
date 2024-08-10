import { useContext } from "react";
import { ABOUTUS_ROUTE, BOOST_ROUTE, BOOSTER_ROUTE, MAINPAGE_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE} from "../../utils/consts";
import PropTypes from 'prop-types'
import { Context } from "../..";
import { NavLink } from "react-router-dom";

function NavBarProfile(props) {
    const {user} = useContext(Context)

    if (user.isAuth) {
        return (
            <div>
                <li className = "NavBarProfile">
                    <a href={LOGIN_ROUTE}><img src={props.icon} alt = ""></img></a>
                    <h3><NavLink to="#">{props.name}</NavLink></h3>
                    <h4><NavLink to="#">{props.balance.toFixed(2)} ₽</NavLink></h4>
                </li>
            </div>
        );
    }
    else {
        return (
            <div>
                <li className = "NavBarProfile">
                    <img src={props.icon} alt = ""/>
                    <h3><NavLink to={REGISTER_ROUTE}>Регистрация</NavLink></h3>
                    <h4><NavLink to={LOGIN_ROUTE}>Вход</NavLink></h4>
                </li>
            </div>
        );
    }
}

NavBarProfile.propTypes = {
    name: PropTypes.string,
    balance: PropTypes.number,
    icon: PropTypes.string
}

NavBarProfile.defaultProps = {
    isLoggedIn: true,
    name: "Пользователь",
    balance: 0.0,
    icon: "src/assets/img/default_profile_icon.png" 
}

function NavBarItem(props) {
    return(
        <li className='NavBarItem'><NavLink to={props.link}>{props.text}</NavLink></li>
    );
}

NavBarItem.propTypes = {
    text: PropTypes.string,
    link: PropTypes.string
}

NavBarItem.defaultProps = {
    text: "Главная",
    link: "#"
}

function NavBar() {
    return (
        <ul className="NavBar">
            <NavBarItem text="Главная" link={MAINPAGE_ROUTE}/>
            <NavBarItem text="О нас" link={ABOUTUS_ROUTE}/>
            <NavBarItem text="Заказать буст" link={BOOST_ROUTE}/>
            <NavBarItem text="Стать бустером" link={BOOSTER_ROUTE}/>
            <NavBarProfile/>
        </ul>
    );
}

export default NavBar
