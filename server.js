const express = require("express");
const app = express();
const routes = require("./routes/courses");
const mongodb = require('./db/connect');
const port = process.env.port || 3000;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use("/courses", routes);

app.get("/", (req, res) => {
    res.send("Please include the following path after the site URL to access the API Documentation: '/api-docs.'");
})

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});