import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"
import ActivatePrompt from "./components/ActivatePrompt";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from ".";
import ReactLoading from "react-loading";

const App = observer(() => {
    const {store} = useContext(Context)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        } 
    }, [])

    if (store.isLoading) {
        return (
            <div>
                <ReactLoading type="cylon" color="#696969" height={100} width={50} />
            </div>
        );
    }
    
    return (
        <BrowserRouter>
            <div id="container">
                <NavBar/> 
                <AppRouter/>    
                <Footer/>
            </div>
            {store.isAuth && store.user.isActivated ? <ActivatePrompt/> : null}
        </BrowserRouter>
    );
});

export default App
