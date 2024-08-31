import { useEffect, useState } from "react";
import AdminService from "../service/AdminService";
import ReactLoading from "react-loading";
import { API_URL } from "../http";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { checkboxStyle, textStyle } from "../utils/mui_styles";

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [showImage, setShowImage] = useState([false]);
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

    const handleImageClick = (id) => {
        const newShowImage = [...showImage];
        newShowImage[id] = !newShowImage[id];
        setShowImage(newShowImage);
    }

    const handleApplyClick = (id) => {
        AdminService.verify(id, true);
        document.getElementById(id.toString()).classList.toggle('ticket-closed');

    }

    const handleRejectClick = (id) => {
        AdminService.verify(id, false);
        document.getElementById(id.toString()).classList.toggle('ticket-closed');
    }

    return (
        <div className="center">
            <div className="admin">
                <h1>Executor Tickets</h1>
                <div className="ticket-settings">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showClosed}
                                onChange={() => setShowClosed(!showClosed)}
                                sx={checkboxStyle}
                            />
                        }
                        label={
                            <Typography sx={textStyle}>Show closed</Typography>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showVerified}
                                onChange={() => setShowVerified(!showVerified)}
                                sx={checkboxStyle}
                            />
                        }
                        label={
                            <Typography sx={textStyle}>Show verified</Typography>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showPaid}
                                onChange={() => setShowPaid(!showPaid)}
                                sx={checkboxStyle}
                            />
                        }
                        label={
                            <Typography sx={textStyle}>Show paid</Typography>
                        }
                    />
                    <div className="userid-input">
                        <p>Specifify user ID:</p>
                        <input type="text" onChange={(e) => {
                            if (!isNaN(e.target.value)) {
                                setShowUserId(e.target.value)
                            }
                        }} />
                    </div>
                </div>
                <div className="tickets">
                    {tickets.map((ticket) => {
                        if (!showClosed && ticket.closed ||
                            !showVerified && ticket.verified ||
                            !showPaid && ticket.paid ||
                            showUserId > 0 && ticket.userId != showUserId) {
                            return;
                        }

                        return (
                            <div className="ticket" key={ticket.id} id={ticket.id}>
                                <h4><b>ID: </b>{ticket.id}</h4>
                                {ticket.verified ?
                                    <h4 className="green"><b>Verified: </b>true</h4>
                                    :
                                    <h4 className="red"><b>Verified: </b>false</h4>
                                }
                                {ticket.paid ?
                                    <h4 className="green"><b>Paid: </b>true</h4>
                                    :
                                    <h4 className="red"><b>Paid: </b>false</h4>
                                }
                                {ticket.closed ?
                                    <h4 className="green"><b>Closed: </b>true</h4>
                                    :
                                    <h4 className="red"><b>Closed: </b>false</h4>
                                }
                                <h4><b>UserID: </b>{ticket.userId}</h4>
                                <h4><b>Required Username: </b>{ticket.requiredUsername}</h4>
                                <h4
                                    onClick={() => handleImageClick(ticket.id)}
                                    className="nonselectable"
                                >
                                    <b>{showImage[ticket.id] ? "▾" : "▸"} Image:</b>
                                </h4>
                                {showImage[ticket.id] && <img src={API_URL + ticket.image} />}
                                {!ticket.closed && !ticket.verified && (

                                    <div className="ticket-footer">
                                        <button onClick={() => handleApplyClick(ticket.id)}>Apply</button>
                                        <button onClick={() => handleRejectClick(ticket.id)} className="second-button">Reject</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Admin;
