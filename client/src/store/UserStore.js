import { makeAutoObservable } from "mobx"

export default class UserStore {
    constructor() {
        this._isAuth = false 
        this._id = 0
        this._email = "No Email"
        this._name= "No Name"
        this._avatar = "../assets/img/default_profile_icon.png"
        this._balance = 0.0
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setID(id) {
        this._id = id
    }

    setEmail(email) {
        this._email = email 
    }

    setName(name) {
        this._name = name 
    }

    setAvatar(avatar) {
        this._avatar = avatar 
    }

    setBalance(balance) {
        this._balance = balance 
    }

    get isAuth() {
        return this._isAuth
    }

    get id() {
        return this._id 
    }

    get email() {
        return this._email 
    }

    get name() {
        return this._name 
    }

    get avatar() {
        return this._avatar 
    }

    get balance() {
        return this._balance
    }
}
