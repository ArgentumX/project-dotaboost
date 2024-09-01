import { useContext } from "react";
import { Context } from "../..";
import { useNavigate } from "react-router-dom";
import { ORDER_ROUTE } from "../../utils/consts";

function NavItem(props) {
    const { store } = useContext(Context) ;
    const navigate = useNavigate();

    const handleClick = () => {
        if (props.link == ORDER_ROUTE && !store.isAuth) {
            swal({
                title: "Ошибка",
                text: "Для того чтобы оформить заказ необходимо авторизоваться.",
                icon: "error"
            })
        }

        navigate(props.link);
    }

    return (<>
        <li className='NavBarItem' onClick={props.onClick ? props.onClick : handleClick}>
            {props.text}
        </li>
    </>);
}

export default NavItem;
