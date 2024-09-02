import { ABOUTUS_ROUTE, ORDER_ROUTE, LOGIN_ROUTE, MAINPAGE_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE, VERIFICATION_ROUTE, PASSWORD_RESET_ROUTE, ADMIN_ROUTE } from "./utils/consts";
import MainPage from './pages/public/MainPage';
import AboutUs from './pages/public/AboutUs';
import Order from './pages/user/Order';
import Auth from './pages/public/Auth';
import Profile from "./pages/auth/Profile";
import Verification from "./pages/user/Verification";
import PasswordReset from "./pages/auth/PasswordReset";
import Admin from "./pages/admin/Admin";

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

export const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    }
]
