import { ABOUTUS_ROUTE, ORDER_ROUTE, BOOSTER_ROUTE, LOGIN_ROUTE, MAINPAGE_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE, VERIFICATION_ROUTE } from "./utils/consts";
import MainPage from './pages/MainPage';
import AboutUs from './pages/AboutUs';
import Order from './pages/Order';
import BecomeABooster from './pages/BecomeABooster';
import Auth from './pages/Auth';
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";

export const authRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },

    {
        path: ORDER_ROUTE,
        Component: Order 
    },
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
        path: BOOSTER_ROUTE,
        Component: BecomeABooster
    },

    {
        path: LOGIN_ROUTE,
        Component: Auth
    },

    {
        path: REGISTER_ROUTE,
        Component: Auth
    },

    {
        path: VERIFICATION_ROUTE,
        Component: Verification 
    }
]
