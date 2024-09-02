import { useEffect, useState } from "react";
import ExecutorTicketOptions from "./ExecutorTicketOptions";
import AdminService from "../../service/AdminService";
import ExecutorTicketOption from "./ExecutorTicketOption";
import ExecutorTicket from "./ExecutorTicket";
import ReactLoading from "react-loading";
import styles from "./ExecutorTicketsList.module.css";

const ExecutorTicketsList = () => {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);

    const [showClosed, setShowClosed] = useState(true);
    const [showVerified, setShowVerified] = useState(true);
    const [showPaid, setShowPaid] = useState(true);
    const [showUserId, setShowUserId] = useState(-1);

    useEffect(() => {
        setLoading(true);

        AdminService.getTickets(0).catch((e) => {
            setLoading(false);
        }).then((data) => {
            setTickets(data.tickets)
            setLoading(false);
        });
    }, [])


    if (loading) {
        return (
            <div >
                <ReactLoading type="cylon" color="#696969" height={100} width={50} />
            </div>
        );
    }

    return (
        <div id="executor-tickets">
            <h1>Executor Tickets</h1>
            <ExecutorTicketOptions>
                <ExecutorTicketOption
                    type="checkbox"
                    value={showClosed}
                    onChange={() => setShowClosed(!showClosed)}
                    label="Show closed"
                />
                <ExecutorTicketOption
                    type="checkbox"
                    value={showPaid}
                    onChange={() => setShowPaid(!showPaid)}
                    label="Show paid"
                />
                <ExecutorTicketOption
                    type="checkbox"
                    value={showVerified}
                    onChange={() => setShowVerified(!showVerified)}
                    label="Show verified"
                />
                <ExecutorTicketOption
                    type="numeric"
                    onChange={setShowUserId}
                    label="Specifiy user ID:"
                />
            </ExecutorTicketOptions>
            <div className={styles["tickets"]}>
                {tickets.map((ticket) => {
                    if (!showClosed && ticket.closed ||
                        !showVerified && ticket.verified ||
                        !showPaid && ticket.paid ||
                        showUserId > 0 && ticket.userId != showUserId) {
                        return;
                    }
                    return <ExecutorTicket key={ticket.id} ticket={ticket} />
                })}
            </div>
        </div>
    );
}

export default ExecutorTicketsList;
