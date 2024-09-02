import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles['footer']}>
            <hr></hr>
            <p>&copy;2024-{new Date().getFullYear()} DotaBoost</p>
            <p>Деньги не возвращаем</p>
        </footer>
    );
}

export default Footer
