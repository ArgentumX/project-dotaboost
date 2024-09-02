import React, { useContext } from "react";
import { Routes, Route } from 'react-router-dom'
import { adminRoutes, authRoutes, executorRoutes, publicRoutes, userRoutes } from "../routes";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
    const { userStore } = useContext(Context)
    const roles = userStore.user.roles ? [...userStore.user.roles] : []

    return (
        <Routes>
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}

            {userStore.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}

            {roles.includes("EXECUTOR") ?
                userStore.isAuth && executorRoutes.map(({ path, Component }) =>
                    <Route key={path} path={path} element={<Component />} exact />
                )
                :
                userStore.isAuth && userRoutes.map(({ path, Component }) =>
                    <Route key={path} path={path} element={<Component />} exact />
                )
            }

            {(roles.includes("ADMIN") || roles.includes("GOD")) && adminRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
        </Routes>
    );
});

export default AppRouter;
