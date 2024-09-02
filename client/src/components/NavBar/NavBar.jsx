import { useContext } from "react";
import { ABOUTUS_ROUTE, ORDER_ROUTE, MAINPAGE_ROUTE, PROFILE_ROUTE, ADMIN_ROUTE } from "../../utils/consts";
import { Context } from "../..";
import NavItem from "./NavItem";
import NavBarProfile from "./NavBarProfile";
import styles from "./NavBar.module.css";


function NavBar() {
    const { userStore } = useContext(Context)
    const roles = userStore.user.roles ? [...userStore.user.roles] : []

    return (
        <ul className={styles["navbar"]}>
            <NavItem text="Главная" link={MAINPAGE_ROUTE} />
            <NavItem text="О нас" link={ABOUTUS_ROUTE} />
            <NavItem text="Профиль" link={PROFILE_ROUTE} />
            {!roles.includes("EXECUTOR") &&
                <NavItem text="Заказать буст" link={ORDER_ROUTE} />}
            {(roles.includes("ADMIN") || roles.includes("GOD")) &&
                <NavItem text="Admin" link={ADMIN_ROUTE} />
            }
            <NavBarProfile />
        </ul>
    );
}

export default NavBar
