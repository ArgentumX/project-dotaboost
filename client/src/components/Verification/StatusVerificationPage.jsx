import { useContext } from "react";
import { Context } from "../..";

const StatusVerificationPage = () => {
    const {store} = useContext(Context);

    return (
        <div className="center">
            <p>
                Вы уже отправили заявку на верификацию.
                Статус заявки:  {store.executorTicket.verified ?
                    <b className="green">одобрена</b>
                    :
                    <b className="yellow">на рассмотрении</b>
                }.
            </p>
        </div>
    );
}

export default StatusVerificationPage;