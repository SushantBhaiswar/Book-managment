const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')


module.exports = {
    authontication: (req, res, next) => {
        try {
            let token = req.headers['x-auth-token']
            if (!token) {
                return res.status(400).send({ status: false, message: "Token is missing" }) 
            }
            jwt.verify(token, "Secret-key", function (error, decoded) {
                if (error) {
                    return res.status(400).send({ status: false, msg: "Authentication Failed" })
                } else {
                    req.decodedToken = decoded
                    next()
                }
            })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },


    authorise: async (req, res, next) => {
        try {
            let ObjectID = mongoose.Types.ObjectId
            if (req.body.userId) {
                let { userId } = req.body
                if (!ObjectID.isValid(userId)) { return res.status(400).send({ status: false, message: "Not a valid UserId" }) }
                if (userId !== req.decodedToken.userId) {
                    return res.status(403).send({ status: false, message: "Unauthorized person" })
                }
                return next()
            }
            if (req.params.bookId) {
                let { bookId } = req.params
                if (!ObjectID.isValid(bookId)) {
                    return res.status(400).send({ status: false, message: "Not a valid bookId" })
                }
                let finduserid = await bookModel.findOne({ _id: bookId, isDeleted: false })
                if (!finduserid) {
                    return res.status(404).send({ status: false, message: "Data not found" })
                }
                if (finduserid.userId.toString() !== req.decodedToken.userId) {
                    return res.status(403).send({ status: false, message: "Unauthorized person" })
                }
                return next()
            }
        }
        catch (error) {
            res.status(500).send({ status: false, message: error.message })
        }
    }
}