import { useContext, useEffect } from "react";
import { Context } from "../..";
import { toggleBlur } from "../../utils/blur";
import styles from "./EmailActivatePrompt.module.css";

function EmailActivatePrompt() {
    useEffect(() => {
        toggleBlur();
    }, [])

    const {userStore} = useContext(Context);

    return (
        <div className={styles["activate-prompt"]}>
            <h1>Необходимо активировать аккаунт</h1>
            <h4>На почту <b>{userStore.user.email}</b> было отправлено письмо. Перейдите по ссылке в письме для активации аккаунта.</h4>
            <button onClick={() => {
                userStore.logout();
                toggleBlur(); 
            }
            }>Выйти из аккаунта</button>
        </div>
    );
}

export default EmailActivatePrompt; 
