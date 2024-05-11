const { body, validationResult } = require('express-validator')
const validationRules = () => {
  return [
    body('courseCode')
        .notEmpty()
        .withMessage("Course code is required.")
        .isLength({ min: 2 })
        .withMessage("Course code must be at least 2 characters long."),

    body('courseName')
        .notEmpty()
        .withMessage("Course name is required.")
        .isLength({ min: 2 })
        .withMessage("Course name must be at least 2 characters long."),

    body('credits')
        .notEmpty()
        .withMessage("Credits is required.")
        .isInt({ min: 1, max: 5 })
        .withMessage("Credits must be a number between 1 and 5."),

    body('courseDescription')
        .notEmpty()
        .withMessage("Course description is required.")
        .isLength({ min: 10 })
        .withMessage("Course description must be at least 10 characters long."),

    body('instructor')
        .notEmpty()
        .withMessage("Instructor is required.")
        .isLength({ min: 2 })
        .withMessage("Instructor name must be at least 2 characters long.")
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  validationRules,
  validate,
}