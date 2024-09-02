import styles from './Test.module.css';

function Test(props) {
    return(
        <div className={styles["verification-test"]}>
            {props.children} 
        </div>
    );
} 

export default Test;
