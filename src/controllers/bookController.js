const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")
const moment = require('moment')
const reviewModel = require("../models/reviewModel")

const createBook = async (req, res) => {
    try {
        let data = req.body
        let { ISBN, title } = data

        let uniqueData = await bookModel.find({ $and: [{ $or: [{ ISBN: ISBN }, { title: title }] }, { isDeleted: false }] })

        let arr = []
        uniqueData.map((i) => { arr.push(i.ISBN, i.title) })

        if (arr.includes(ISBN)) {
            return res.status(409).send({ status: false, msg: "ISBN is already exsits" })
        }
        if (arr.includes(title)) {
            return res.status(409).send({ status: false, msg: "title is already exsits" })
        }

        let saveData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "data created successfully", data: saveData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
//  GET BOOK BY QUERY FILTER
const getBooks1 = async (req, res) => {
    try {
        let { userId, category, subcategory } = req.query

        let findData = await bookModel.find({ $and: [{ $or: [{ userId: userId }, { category: category }, { subcategory: subcategory }] }, { isDeleted: false }] }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        if (!findData[0]) {
            return res.status(404).send({ status: false, message: " No Such Book found " })
        }
        return res.status(200).send({ status: true, data: findData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
// GET BOOK BY params

const getBookbyparms = async (req, res) => {
    try {
        let { bookId } = req.params
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Bookid is not a valid ObjectId" })
        }
        let bookData = await bookModel.findOne({ isDeleted: false, _id: bookId })
        if (!bookData) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        let reviewsData = await reviewModel.findOne({ isDeleted: false, bookId: bookId }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        let finalData = {
            title: bookData.title, excerpt: bookData.excerpt, userId: bookData.userId,
            category: bookData.category, subcategory: bookData.subcategory, isDeleted: false, reviews: bookData.reviews,
            createdAt: bookData.createdAt, updatedAt: bookData.updatedAt, reviewsData: reviewsData
        }
        return res.status(200).send(finalData)
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const updateBook = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let data = req.body
        let { title, ISBN, releasedAt } = data

        let uniqueData = await bookModel.find({ $and: [{ $or: [{ ISBN: ISBN }, { title: title }] }, { isDeleted: false }] })

        let arr = []
        uniqueData.map((i) => { arr.push(i.ISBN, i.title) })

        if (arr.includes(ISBN)) {
            return res.status(409).send({ status: false, msg: "ISBN is already exsits please try different ISBN" })
        }
        if (arr.includes(title)) {
            return res.status(409).send({ status: false, msg: "title is already exsits please try different title" })
        }

        let updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: data, updatedAt: moment().format("DD-MM-YYYY  h:mm:ss a") }, { new: true })
        if (!updateData) {
            return res.status(404).send({ status: false, message: "Book Not Found " })
        }
        return res.status(200).send({ status: true, message: "Data successfully updated", data: updateData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
const deleteBook = async (req, res) => {
    try {
        let bookId = req.params.bookId

        let deleteBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: moment().format("DD-MM-YYYY  h:mm:ss a") })
        if (!deleteBook) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        await reviewModel.updateMany({bookId: bookId,isDeleted:false},{isDeleted:true})
        return res.status(200).send({ status: true, message: "Data deleted successfully" })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createBook, getBooks1, getBookbyparms, updateBook, deleteBook }