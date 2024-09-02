import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserStore from './store/UserStore.js'
import OrderStore from './store/OrderStore.js'
import ExecutorStore from './store/ExecutorStore.js'

const userStore = new UserStore();
const orderStore = new OrderStore();
const executorStore = new ExecutorStore();

export const Context = createContext({
    userStore,
    orderStore,
    executorStore
})

export const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context.Provider value={{
        userStore,
        orderStore,
        executorStore
    }}>
        <App/>
    </Context.Provider>,
)
