import { useContext } from "react";
import { Context } from "../..";
import { useNavigate } from "react-router-dom";
import { ORDER_ROUTE } from "../../utils/consts";
import styles from './NavItem.module.css';

function NavItem(props) {
    const { userStore } = useContext(Context) ;
    const navigate = useNavigate();

    const handleClick = () => {
        if (props.link == ORDER_ROUTE && !userStore.isAuth) {
            swal({
                title: "Ошибка",
                text: "Для того чтобы оформить заказ необходимо авторизоваться.",
                icon: "error"
            })
        }

        navigate(props.link);
    }

    return (<>
        <li className={styles['navbar-item']} onClick={props.onClick ? props.onClick : handleClick}>
            {props.text}
        </li>
    </>);
}

export default NavItem;
