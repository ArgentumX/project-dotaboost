import ExecutorTicketsList from "../../components/ExecutorTickets/ExecutorTicketsList";
import styles from './Admin.module.css';

const Admin = () => {
    return (
        <div className="center">
            <div className={styles['admin']}>
                <ExecutorTicketsList />
            </div>
        </div>
    );
}

export default Admin;
