const ApiError = require("../errors/ApiError")
const bcrypt = require('bcrypt')
const {User} = require('../models/models')
const jwt = require('jsonwebtoken')
const Uuid = require('uuid')
const path = require('path');
const { validationResult } = require('express-validator')
const files = require("../logic/files")
const config = require("../config")

const generateJwt = (id, email, username) => {
    return jwt.sign({id, email, username}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async registration(req, res, next){
        const {email, username, password, role } = req.body
        const valErrors = validationResult(req)

        if (!valErrors.isEmpty() || !password || !username){
            return next(ApiError.badRequest('validation error'))
        }
        const candidateByUsername = await User.findOne({where: {username}})
        if (candidateByUsername) {
            return next(ApiError.badRequest('username is already in use'))
        }

        const candidateByEmail = await User.findOne({where: {email}})
        if (candidateByEmail) {
            return next(ApiError.badRequest('email is already in use'))
        }

        const hashPassword = await bcrypt.hash(password, Number(process.env.HASH_REPEAT))
        const user = await User.create({email, username, role, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.username)
        return res.json({token})
    }

    async login(req, res, next){
        const {email, password} = req.body
        const valErrors = validationResult(req)
        if (!valErrors.isEmpty() || !password){
            return next(ApiError.badRequest('validation error'))
        }
        console.log(email, password);
        const user = await User.findOne({where: {email}})
        if (!user){
            return next(ApiError.badRequest('wrong email or password'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword)
        {
            return next(ApiError.badRequest("wrong email or password"))
        }
        const token = generateJwt(user.id, user.email, user.username)
        return res.json({token})
    }
    
    async check(req, res, next){
        //rewrite
        return res.json({token: req.headers.authorization.split(' ')[1]})        
        //return res.json({message: "user authorized"})
    }

    async getCurrentUser(req, res, next){
        const decoded = req.user
        const user = await User.findOne({where: {id: decoded.id}})
        return res.json({id: user.id, email: user.email, username: user.username, avatar: user.avatar, balance: user.balance})
    }


    async uploadAvatar(req, res, next){
        try{
            const image = req.files.file
            const decoded = req.user
            const user = await User.findOne({where: {id: decoded.id}})
            if (user.avatar){
                files.deleteStaticImage(user.avatar)
            }
            user.avatar = files.createStaticImage(image, config.AVATAR_FILE_PREFIX)
            await user.save()
            return res.json({message: "avatar was uploaded"})
        
        }
        catch (e){
            console.log(e)
            return res.status(400).json({message:"upload avatar error"})
        }
    }
}

module.exports = new UserController()
