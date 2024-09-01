import { useContext } from "react";
import { Context } from "../..";

const ImageVerificationPage = ({onSubmit}) => {
    const {store} = useContext(Context);

    return (
        <div className="center">
        <div className="verification-image-wrapper">
            <h2>Следуйте указаниям для завершения верификации.</h2>
            <h3>1. Вам присвоен уникальный никнейм: «<b>{store.executorTicket.requiredUsername}</b>». В настройках профиля в Вашем Steam аккаунте поставьте этот ник.</h3>
            <h3>2. Запустите Dota 2 и перейдите в историю игр.</h3>
            <h3>3. Сделайте скриншот всего экрана, как показано на примере ниже.</h3>
            <img src="src/assets/img/verification-image-example.png" alt="" className="verification-example" />
            <h3>4. Загрузите скриншот.</h3>
            <div className="test-footer">
                <button onClick={onSubmit}>Загрузить</button>
            </div>
        </div>
    </div>
    );
}

export default ImageVerificationPage;