import { useContext, useEffect } from "react";
import { Context } from "..";

function ActivatePrompt() {
    useEffect(() => {
        const background = document.getElementById('container');
        background.classList.toggle('blur')
    }, [])

    const {store} = useContext(Context);

    return (
        <div className="ActivatePrompt">
            <h1>Необходимо активировать аккаунт</h1>
            <h4>На почту <b>{store.user.email}</b> было отправлено письмо. Перейдите по ссылке в письме для активации аккаунта.</h4>
            <button onClick={() => store.logout()}>Выйти из аккаунта</button>
        </div>
    );
}

export default ActivatePrompt; 
