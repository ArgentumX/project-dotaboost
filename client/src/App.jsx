import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer"
import EmailActivatePrompt from "./components/EmailActivatePrompt/EmailActivatePrompt";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from ".";
import ReactLoading from  "react-loading";
import ImageUpload from "./components/ImageUpload/ImageUpload";

const App = observer(() => {
    const { userStore } = useContext(Context)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            userStore.checkAuth()
        }
    }, [])

    if (userStore.isLoading) {
        return (
            <div>
                <ReactLoading type="cylon" color="#696969" height={100} width={50} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div id="container">
                <NavBar />
                <AppRouter />
                <Footer />
            </div>
            <div id="popup">
                {userStore.isAuth && !userStore.user.isActivated ? <EmailActivatePrompt /> : null}
                <ImageUpload />
            </div>
        </BrowserRouter>
    );
});

export default App
