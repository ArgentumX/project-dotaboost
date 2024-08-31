import React, { useContext } from "react";
import { Routes, Route } from 'react-router-dom'
import { adminRoutes, authRoutes, executorRoutes, publicRoutes, userRoutes } from "../routes";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
    const { store } = useContext(Context)
    const roles = store.user.roles ? [...store.user.roles] : []

    return (
        <Routes>
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}

            {store.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}

            {roles.includes("EXECUTOR") ?
                store.isAuth && executorRoutes.map(({ path, Component }) =>
                    <Route key={path} path={path} element={<Component />} exact />
                )
                :
                store.isAuth && userRoutes.map(({ path, Component }) =>
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
