import { ABOUTUS_ROUTE, BOOST_ROUTE, BOOSTER_ROUTE, LOGIN_ROUTE, MAINPAGE_ROUTE, REGISTER_ROUTE } from "./utils/consts";
import MainPage from './pages/MainPage';
import AboutUs from './pages/AboutUs';
import GetBoosted from './pages/GetBoosted';
import BecomeABooster from './pages/BecomeABooster';
import Auth from './pages/Auth';

export const authRoutes = [] 
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
        path: BOOST_ROUTE,
        Component: GetBoosted
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
]
