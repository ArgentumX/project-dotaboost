import NavBarItem from "./NavBarItem";
import NavBarProfile from "./NavBarProfile";

function NavBar() {
    
    return (
        <ul className="NavBar">
            <NavBarItem text="Главная" link="#"></NavBarItem>
            <NavBarItem text="О нас" link="#"></NavBarItem>
            <NavBarItem text="Заказать буст" link="#"></NavBarItem>
            <NavBarItem text="Стать бустером" link="#"></NavBarItem>
            <NavBarProfile isLoggedIn={true}/>
        </ul>
    );
}

export default NavBar
