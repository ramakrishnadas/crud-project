const express = require("express");
const app = express();
const routes = require("./routes/courses");
const mongodb = require('./db/connect');
const port = process.env.port || 3000;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { auth } = require('express-openid-connect');
const dotenv = require("dotenv");
dotenv.config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
    res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/courses", routes);

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});