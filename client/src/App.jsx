import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer"
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from ".";
import { check } from "./http/userAPI";

const App = observer(() => {
    const {user} = useContext(Context)

    check().then(data => {
        data === localStorage.getItem('token') ? user.setIsAuth(true): user.setIsAuth(false)
    })

    return (
        <BrowserRouter>
            <NavBar/>
            <AppRouter/>    
            <Footer/>
        </BrowserRouter>
    );
});

export default App
