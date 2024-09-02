import styles from './NavVertical.module.css';

function NavVertical(props) {
    return (
        <div className={styles["nav-vertical-container"]}>
            <ul className={styles["nav-vertical"]}>
                {props.children}
            </ul>
        </div>
    );
}

export default NavVertical;
