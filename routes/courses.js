const express = require("express");
const router = new express.Router();
const courseController = require("../controllers/courseController");
const { validationRules, validate } = require("../middleware/validator.js");

// Get all courses
router.get("/", courseController.getAllData);

// Get course by id
router.get("/:courseId", courseController.getDataById);

// Create new course
router.post(
    "/", 
    validationRules(),
    validate,
    courseController.createCourse
);

// Update course by id
router.put(
    "/:id", 
    validationRules(),
    validate,
    courseController.updateCourse
);

// Delete course by id
router.delete("/:id", courseController.deleteCourse);

module.exports = router;