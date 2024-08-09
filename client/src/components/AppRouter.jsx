import React from "react";
import {Routes, Route, Navigate} from 'react-router-dom'
import { publicRoutes } from "../routes";
import { MAINPAGE_ROUTE } from "../utils/consts";

function AppRouter () {
    const isAuth = false

    return (
        <Routes>
            {publicRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={<Component/>} exact/>
            )} 
            
            <Route path="*"  element={<Navigate to={MAINPAGE_ROUTE}/>}/>
        </Routes>
    );
}

export default AppRouter;
