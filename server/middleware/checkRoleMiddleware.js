const jwt = require('jsonwebtoken')
const {User, UserRole, Role} = require('../models/models')
const config = require('../config')

module.exports = function (roleTitle) {
    return async function (req, res, next){
        if (req.method === "OPTIONS"){
            next()
        }
        try{
            const token = req.headers.authorization.split(' ')[1]
            if (!token){
                return res.status(401).json({message:"not authorized"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const userWithRole = await User.findByPk(decoded.id, {
                include: [{
                  model: Role,
                  where: { title: roleTitle}
                }]
              })
            if (!userWithRole) {
                return res.status(403).json({message: "no permission"})
            }
            next()
        }catch(e){
            console.log(e)
            res.status(401).json({message: "not authorized"})
        }
    }
}