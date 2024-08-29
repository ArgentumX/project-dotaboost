import { ABOUTUS_ROUTE, ORDER_ROUTE, LOGIN_ROUTE, MAINPAGE_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE, VERIFICATION_ROUTE, PASSWORD_RESET_ROUTE } from "./utils/consts";
import MainPage from './pages/MainPage';
import AboutUs from './pages/AboutUs';
import Order from './pages/Order';
import Auth from './pages/Auth';
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import PasswordReset from "./pages/PasswordReset";

export const authRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },

    {
        path: PASSWORD_RESET_ROUTE,
        Component: PasswordReset
    }
]

export const publicRoutes = [
    {
        path: MAINPAGE_ROUTE,
        Component: MainPage
    },

    {
        path: ABOUTUS_ROUTE,
        Component: AboutUs
    },

    {
        path: LOGIN_ROUTE,
        Component: Auth
    },

    {
        path: REGISTER_ROUTE,
        Component: Auth
    },
]

export const executorRoutes = [
    {

    }
]

export const userRoutes = [
    {
        path: ORDER_ROUTE,
        Component: Order
    },

    {
        path: VERIFICATION_ROUTE,
        Component: Verification
    },
]
