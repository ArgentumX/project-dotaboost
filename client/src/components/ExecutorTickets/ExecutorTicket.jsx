import { useState } from "react";
import AdminService from "../../service/AdminService";
import { API_URL } from "../../http/axios";
import styles from "./ExecutorTicket.module.css";

const ExecutorTicket = ({ ticket }) => {
    const [showImage, setShowImage] = useState([false]);

    const handleImageClick = (id) => {
        const newShowImage = [...showImage];
        newShowImage[id] = !newShowImage[id];
        setShowImage(newShowImage);
    };

    const handleApplyClick = (id) => {
        AdminService.verify(id, true);
        document.getElementById(id.toString()).classList.toggle(styles["ticket-closed"]);
    };

    const handleRejectClick = (id) => {
        AdminService.verify(id, false);
        document.getElementById(id.toString()).classList.toggle(styles["ticket-closed"]);
    };

    return (
        <div className={styles["ticket"]} id={ticket.id}>
            <h4>
                <b>ID: </b>
                {ticket.id}
            </h4>
            {ticket.verified ? (
                <h4 className="green">
                    <b>Verified: </b>true
                </h4>
            ) : (
                <h4 className="red">
                    <b>Verified: </b>false
                </h4>
            )}
            {ticket.paid ? (
                <h4 className="green">
                    <b>Paid: </b>true
                </h4>
            ) : (
                <h4 className="red">
                    <b>Paid: </b>false
                </h4>
            )}
            {ticket.closed ? (
                <h4 className="green">
                    <b>Closed: </b>true
                </h4>
            ) : (
                <h4 className="red">
                    <b>Closed: </b>false
                </h4>
            )}
            <h4>
                <b>UserID: </b>
                {ticket.userId}
            </h4>
            <h4>
                <b>Required Username: </b>
                {ticket.requiredUsername}
            </h4>
            <h4 onClick={() => handleImageClick(ticket.id)} className="nonselectable">
                <b>{showImage[ticket.id] ? "▾" : "▸"} Image:</b>
            </h4>
            {showImage[ticket.id] && <img src={API_URL + "images/" + ticket.image} />}
            {!ticket.closed && !ticket.verified && (
                <div className={styles["ticket-footer"]}>
                    <button onClick={() => handleApplyClick(ticket.id)}>Apply</button>
                    <button
                        onClick={() => handleRejectClick(ticket.id)}
                        className={styles["second-button"]}
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExecutorTicket;
