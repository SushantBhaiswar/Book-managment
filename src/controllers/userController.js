const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

module.exports = {
    createUser: async (req, res) => {
        try {
            let data = req.body
            let { phone, email } = data
            let uniqueData = await userModel.find({ $and: [{ $or: [{ phone: phone }, { email: email }] }, { isDeleted: false }] })

            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })

            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsits" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsits" })
            }

            let createUserdata = await userModel.create(data)
            return res.status(201).send({ status: true, message: "Data created successfully", data: createUserdata })
        }
        catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    login: async (req, res) => {
        try {
            let data = req.body
            let { email, password } = data

            if (!email) {
                return res.status(400).send({ status: false, message: "please enter emailId for login" })
            }
            if (!password) {
                return res.status(400).send({ status: false, message: "please enter password for login" })
            }

            let findUser = await userModel.findOne({ email: email, password: password });
            if (!findUser) {
                return res.status(404).send({ status: false, message: "emailId or password is incorrect" })
            }

            let token = jwt.sign({ userId: findUser._id }, "Secret-key", { expiresIn: "1d" })
            let decode = jwt.verify(token, "Secret-key")

            res.setHeader("token", token)
            res.status(200).send({ Message: "LoggedIn successfully", data: token, userId: decode.userId, iat: decode.iat, exp: decode.exp })
        } catch (err) {
            return res.status(500).send({ status: false, message: err.message })
        }
    }
}