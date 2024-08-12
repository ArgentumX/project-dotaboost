import { useContext, useEffect, useState } from "react";
import { ABOUTUS_ROUTE, BOOST_ROUTE, BOOSTER_ROUTE, MAINPAGE_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, PROFILE_ROUTE} from "../../utils/consts";
import { Context } from "../..";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { fetchUser } from "../../http/userAPI";

const NavBarProfile = observer(() => {
    const {user} = useContext(Context)

    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        if (user.isAuth) {
            fetchUser().then(data => {
                user.setID(data.id)
                user.setEmail(data.email)
                user.setName(data.username)
                user.setAvatar(data.avatar)
                user.setBalance(data.balance)
            }).finally(() => setLoading(false))
        }
    }, [user.isAuth])

    if (loading && user.isAuth){
        return <div/>
    }

    const defaultAvatar = "src/assets/img/default_profile_icon.png" 

    if (user.isAuth) {
        return (
            <div>
                <li className = "NavBarProfile">
                    <NavLink to={PROFILE_ROUTE}>
                        <img src={user.avatar == null ? defaultAvatar : user.avatar} alt = ""/>
                    </NavLink> 
                    <h3><NavLink to={PROFILE_ROUTE}>{user.name}</NavLink></h3>
                    <h4><NavLink to="#">{user.balance.toFixed(2)} ₽</NavLink></h4>
                </li>
            </div>
        );
    }
    else {
        return (
            <div>
                <li className = "NavBarProfile">
                    <img src={defaultAvatar} alt = ""/>
                    <h3><NavLink to={REGISTER_ROUTE}>Регистрация</NavLink></h3>
                    <h4><NavLink to={LOGIN_ROUTE}>Вход</NavLink></h4>
                </li>
            </div>
        );
    }
});

function NavBarItem(props) {
    return(
        <li className='NavBarItem'><NavLink to={props.link}>{props.text}</NavLink></li>
    );
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
