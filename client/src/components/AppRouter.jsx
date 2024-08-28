import React, { useContext } from "react";
import {Routes, Route, Navigate} from 'react-router-dom'
import { authRoutes, publicRoutes } from "../routes";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
    const {store} = useContext(Context)

    return (
        <Routes>
            {publicRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={<Component/>} exact/>
            )} 
            
            {store.isAuth && authRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={<Component/>} exact/>
            )} 
        </Routes>
   );
});

export default AppRouter;
