const ApiError = require("../errors/ApiError")
const bcrypt = require('bcrypt')
const {User} = require('../models/models')
const jwt = require('jsonwebtoken')

const generateJwt = (id, email, username, role) => {
    return jwt.sign({id, email, username, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async registration(req, res, next){
        const {email, username, password, role } = req.body
        if (!email || !password || !username){
            return next(ApiError.badRequest('wrong input format'))
        }
        
        const candidateByUsername = await User.findOne({where: {username}})
        if (candidateByUsername) {
            return next(ApiError.badRequest('username is already in use'))
        }

        const candidateByEmail = await User.findOne({where: {email}})
        if (candidateByEmail) {
            return next(ApiError.badRequest('email is already in use'))
        }

        const hashPassword = await bcrypt.hash(password, 7)
        const user = await User.create({email, username, role, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.username, user.role)
        return res.json({token})
    }

    async login(req, res, next){
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user){
            return next(ApiError.badRequest('wrong email or password'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword)
        {
            return next(ApiError.badRequest("wrong email or password"))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next){
        res.json({message: "user authorized"})
    }

}

module.exports = new UserController()