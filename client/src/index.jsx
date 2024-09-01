import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Store from './store/Store.js'

const store = new Store();

export const Context = createContext({
    store,
})

export const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context.Provider value={{
        store
    }}>
        <App/>
    </Context.Provider>,
)
