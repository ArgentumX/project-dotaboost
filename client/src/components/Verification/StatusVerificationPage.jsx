import { useContext } from "react";
import { Context } from "../..";

const StatusVerificationPage = () => {
    const {executorStore} = useContext(Context);

    return (
        <div className="center">
            <p>
                Вы уже отправили заявку на верификацию.
                Статус заявки:  {executorStore.executorTicket.verified ?
                    <b className="green">одобрена</b>
                    :
                    <b className="yellow">на рассмотрении</b>
                }.
            </p>
        </div>
    );
}

export default StatusVerificationPage;