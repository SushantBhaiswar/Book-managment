const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')
const moment = require('moment')


module.exports = {

  reviewbookbybookid: async (req, res) => {
    try {
      let bookid = req.params.bookId
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send({ status: false, msg: "Book id is not valid" })
      }
      if (bookid !== req.body.bookId) {
        return res.status(400).send({ status: false, msg: "BookId doesn't match" })
      }
      let bookData = await bookModel.findOneAndUpdate({ _id: bookid, isDeleted: false }, { $inc: { reviews: +1 } }).select({ createdAt: 0, updatedAt: 0, _id: 0 })
      if (!bookData) {
        return res.status(404).send({ status: false, msg: "Book not found" })
      }

      let createreviews = await reviewModel.create(req.body)
      let finalData = {
        title: bookData.title, excerpt: bookData.excerpt, userId: bookData.userId,
        category: bookData.category, subcategory: bookData.subcategory, isDeleted: false, reviews: bookData.reviews,
        createdAt: bookData.createdAt, updatedAt: bookData.updatedAt, reviewsData: createreviews
      }
      return res.status(201).send({ status: true, message: "Reviewed book Successfully", Data: finalData })
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }
  },
  updatereviewbookbybookid: async (req, res) => {
    try {
      let { bookId, reviewId } = req.params
      req.body.updatedAt = moment().format("DD-MM-YYYY  h:mm:ss a")

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).send({ status: false, msg: "Bookid is not valid" })
      }
      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).send({ status: false, msg: "reviewid is not valid" })
      }
      let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
      if (!bookData) {
        return res.status(404).send({ status: false, msg: "Book not found" })
      }
      let findreviewandupdate = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, req.body, { new: true }).select({ createdAt: 0, updatedAt: 0, _id: 0 })
      if (!findreviewandupdate) {
        return res.status(404).send({ status: false, msg: "ReviewData not found" })
      }

      let finalData = {
        title: bookData.title, excerpt: bookData.excerpt, userId: bookData.userId,
        category: bookData.category, subcategory: bookData.subcategory, isDeleted: false, reviews: bookData.reviews,
        createdAt: bookData.createdAt, updatedAt: bookData.updatedAt, reviewsData: findreviewandupdate
      }
      return res.status(200).send({ status: true, message: "Data updated Successfully", Data: finalData })
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }
  },
  deletereviewbyid: async (req, res) => {
    try {
      let { bookId, reviewId } = req.params
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).send({ status: false, msg: "Bookid is not valid" })
      }
      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).send({ status: false, msg: "reviewid is not valid" })
      }

      let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
      if (!findBook) {
        return res.status(404).send({ status: false, msg: "Book not found" })
      }
      let deleteData = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { isDeleted: true })
      if (!deleteData) {
        return res.status(404).send({ status: false, msg: "ReviewData not found" })
      }
      await bookModel.findByIdAndUpdate({ _id: bookId}, { $inc: { reviews: -1 } })

      return res.status(200).send({ status: true, message: "Data Deleted Successfully" })
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }
  }
}