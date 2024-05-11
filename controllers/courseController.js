const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllData = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db().collection("courses").find();
        const courses = await result.toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(courses);
    } catch (err) {
        res.status(400).json({ message: err});
    }
}

const getDataById = async (req, res, next) => {

    let courseId;
     
    try {
        courseId = ObjectId.createFromHexString(req.params.courseId);
    } catch (err) {
        return res.status(400).json("Invalid course ID format.")
    }

    try {
        const result = await mongodb.getDb().db().collection("courses").find({ _id: courseId}).toArray();

        if (result.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result[0]);
    } catch (err) {
        return res.status(400).json({ message: err });
    }
}

const createCourse = async (req, res, next) => {
    try {
        // Validate request
        if (!req.body.courseName) {
            return res.status(400).send({ message: "Content can not be empty!" });
        }

        // Create a course
        const newCourse = {
            _id: new ObjectId(),
            courseCode: req.body.courseCode,
            courseName: req.body.courseName,
            credits: parseInt(req.body.credits),
            courseDescription: req.body.courseDescription,
            instructor: req.body.instructor,
        };

        // Add contact to database
        const result = await mongodb.getDb().db().collection("courses").insertOne(newCourse);

        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: "Course created successfully", course: result[0] });
    } catch (error) {
        // If an error occurs during the operation, handle it here
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateCourse = async (req, res, next) => {
    try {
        let courseId;

        try {
            courseId = ObjectId.createFromHexString(req.params.id);
        } catch (err) {
            return res.status(400).json("Invalid course ID format.")
        }

        // Define the update operation
        const updateOperation = {
            $set: {
                courseCode: req.body.courseCode,
                courseName: req.body.courseName,
                credits: parseInt(req.body.credits),
                courseDescription: req.body.courseDescription,
                instructor: req.body.instructor,
            }
        };

        // Perform the update operation
        const result = await mongodb.getDb().db().collection("courses").updateOne(
            { _id: courseId },
            updateOperation
        );

        if (result.modifiedCount === 1) {
            // Document updated successfully
            res.status(200).json({ message: "Course updated successfully" });
        } else {
            // Document not found or no changes made
            res.status(404).json({ message: "Course not found or no changes made" });
        }
    } catch (error) {
        // If an error occurs during the operation, handle it here
        console.error("Error in updateCourse:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        let courseId;

        try {
            courseId = ObjectId.createFromHexString(req.params.id);
        } catch (err) {
            return res.status(400).json("Invalid course ID format.")
        }

        // Perform the delete operation
        const result = await mongodb.getDb().db().collection("courses").deleteOne(
            { _id: courseId }
        );

        // Check the result to see if the delete was successful
        if (result.deletedCount === 1) {
            // Document deleted successfully
            return res.status(200).json({ message: "Course deleted successfully" });
        } else {
            // Document not found or no changes made
            return res.status(404).json({ message: "Course not found or no changes made" });
        }
    } catch (error) {
        // If an error occurs during the operation, handle it here
        console.error("Error in deleteCourse:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllData, getDataById, createCourse, updateCourse, deleteCourse };