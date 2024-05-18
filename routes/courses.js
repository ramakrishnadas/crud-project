const express = require("express");
const router = new express.Router();
const courseController = require("../controllers/courseController");
const { validationRules, validate } = require("../middleware/validator.js");
const { requiresAuth } = require('express-openid-connect');

// Return user profile data
router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

// Get all courses
router.get("/", courseController.getAllData);

// Get course by id
router.get("/:courseId", courseController.getDataById);

// Create new course
router.post(
    "/", 
    requiresAuth(),
    validationRules(),
    validate,
    courseController.createCourse
);

// Update course by id
router.put(
    "/:id", 
    requiresAuth(),
    validationRules(),
    validate,
    courseController.updateCourse
);

// Delete course by id
router.delete(
    "/:id", 
    requiresAuth(),
    courseController.deleteCourse
);

module.exports = router;