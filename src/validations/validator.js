const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)

const passwordResponse = {'string.pattern.base': ` "Password should be minimum 8 and maximum 15 character.It contains atleast--> 1 Uppercase letter, 1 Lowercase letter, 1 Number, 1 Special character"`}
const reviewedAtMessages = {"date.base": `reviewedAt should be a type of Date.`,"date.empty": `reviewedAt cannot be an empty field.`,"any.required": `reviewedAt is a required field.`}
const ratingMessages = {"number.base": `Rating should be a type of number.`,"any.required": `Rating is a required field.`}

const errors = (check) => {
    let messages = {"string.base": `${check} should be a type of 'String'.`,"string.empty": `${check} cannot be an empty field.`,"any.required": `${check} is a required field.`}
    return messages
}        

//"^[0-9]{5}(?:-[0-9]{4})?$"
// valid ISBN => 978-1-56619-909-4 , 1257561035 , 1248752418865
// ISBN => /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

module.exports = {
    //SCHEMA VALIDATION FOR USERMODEL
    UserModel: joi.object({
        title: joi.string().trim().regex(/^(Mr|Mrs|Miss)+$\b/).messages({'string.pattern.base': `Title should be among [Mr,Mrs,Miss]`}).required().messages(errors("Title")),
         name: joi.string().trim().regex(/^[A-Za-z ]+$/).messages({'string.pattern.base': `name is not valid.`}).required().messages(errors("Username")),
        phone: joi.string().trim().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits only.`}).required().messages(errors("Mobile number")),
        email: joi.string().trim().regex(/.+\@.+\..+/).messages({'string.pattern.base': `emailId is in inValid format`}).required().messages(errors("emailId")),
     password: joi.string().trim().min(8).messages({'string.min': 'password should be minimum 8 characters'}).max(15).messages({'string.max': 'password should be maximum 15 characters'})
     .regex(/^\S{8,24}$/).messages(passwordResponse).required().messages(errors("Password")),
      address: {
            street: joi.string().trim(),
            city: joi.string().trim(),
            pincode: joi.string().trim().regex(/^([0-9]{6})$/).messages({'string.pattern.base': `Pincode is inValid`}),
        }
    }),
    //SCHEMA VALIDATION FOR BOOKMODEL
    BooksModel: joi.object({
         title: joi.string().trim().required().messages(errors("Title")),
       excerpt: joi.string().trim().required().messages(errors("excerpt")),
        userId: joi.objectId().required().messages(errors("UserId")),
          ISBN: joi.string().trim().regex(/^[0-9]{0,}$/).messages({'string.pattern.base': `ISBN is invalid.`}).required().messages(errors("ISBN")),
      category: joi.string().trim().required().messages(errors("Category")),
   subcategory: joi.string().trim().required().messages(errors("Subcategory")),
    releasedAt: joi.string().trim().regex(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).messages({'string.pattern.base': `releasedAt should be look like this ("YYYY-DD-MM") .`}).required().messages(errors("releasedAt")),
       reviews: joi.number().messages({"number.base": `Reviews should be a type of number`}),
    }),
    //SCHEMA VALIDATION FOR REVIEWMODEL
    ReviewModel: joi.object({
         bookId: joi.objectId().required().messages(errors("BookId")),
     reviewedBy: joi.string().trim().messages({"string.base": `reviewedBy should be a type of string`}),
     reviewedAt: joi.date().required().messages(reviewedAtMessages),
         rating: joi.number().min(1).messages({'number.min': 'rating should be greater than 1'}).max(5).messages({ 'number.max': 'rating should be less than 5' }).required().messages(ratingMessages),
         review: joi.string().trim().messages({"string.base": `Review should be a type of 'String'.`}),
    }),

    //LOGIN VALIDATION
    loginvalidation: joi.object({
              email: joi.string().trim().regex(/.+\@.+\..+/).messages({'string.pattern.base': `emailId is in inValid format`}).required().messages(errors("emailId")),
           password: joi.string().trim().min(8).messages({'string.min': 'password should be minimum 8 characters'}).max(15).messages({'string.max': 'password should be maximum 15 characters'})
                        .regex(/^\S{8,24}$/).messages(passwordResponse).required().messages(errors("Password"))
                    }),

    //GET BOOK VALIDATION
    getbookbyfiltervalidation: joi.object({
                     category: joi.string().trim().messages(errors("Category")),
                  subcategory: joi.string().trim().messages(errors("Subcategory"))
                }),

    updateBook: joi.object({
        title: joi.string().trim().messages(errors("title")),
        excerpt: joi.string().trim().messages(errors("excerpt")),
        releasedAt: joi.string().trim().regex(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).messages({'string.pattern.base': `releasedAt should be look like this ("YYYY-DD-MM") .`}).messages(errors("releasedAt")),
        ISBN: joi.string().trim().regex(/^[0-9]{0,}$/).messages({'string.pattern.base': `ISBN is invalid.`}).messages(errors("ISBN")),
    }),

    updateReview: joi.object({
        review: joi.string().trim().messages(errors("review")),
        rating: joi.number().min(1).messages({'number.min': 'rating should be greater than 1'}).max(5).messages({ 'number.max': 'rating should be less than 5' }).messages(ratingMessages),
        reviewedBy: joi.string().trim().messages({"string.base": `reviewedBy should be a type of string`})
    })

}