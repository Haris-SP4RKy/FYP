const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("../db/connectDB.js");
require("dotenv").config();

// Function to verify user credentials
const verifyUserCredentials = async ({ email: __email, password: __password }) => {
    // Checking if the user exists within the database
    let __query = `SELECT password FROM vendor WHERE email='${__email}'`;
    let result;
    try {
        result = await mysql.connection.query(__query);
        x = result.rows;
        // If no such email, throw an error
        if (result.rowCount === 0) throw new Error("No such email exists.");
    } catch (error) {
        return { status: false, handle: undefined };
    }

    // Extract the DB obtained password
    const passwordFromDatabase = x[0].password;
    let compare;
    // Compare both with bcrypt
    try {
        compare = await bcrypt.compare(__password, passwordFromDatabase);
    } catch (error) {
        return { status: false, handle: undefined };
    }

    // If compare returns true, ie, both are the same
    if (compare === true) {
        // Query handle
        __query = `SELECT u_id FROM vendor WHERE email='${__email}'`;
        try {
            // Get handle
            result = await mysql.connection.query(__query);
            // return ({ status: false, handle: handle })
        } catch (error) {
            return { status: false, handle: undefined };
        }

        // Store handle
        y = result.rows[0].u_id;
        const handle = y;
        // Return true
        return { status: true, handle };
    }

    // The passwords are not the same
    return { status: false, handle: undefined };
};

// Function to generate access token
const generateAccessToken = async (__data) => {
    const { status, handle } = await verifyUserCredentials(__data);
    if (status) {
        const token = jwt.sign({ handle }, `${process.env.JWT_SECRET}`, { expiresIn: "3d" });
        return { token, handle };
    }
    throw new Error("Please login with valid credentials!");
};

// Function to verify access token
const verifyAccessToken = (__token) => {
    try {
        const decodedPayload = jwt.verify(__token, `${process.env.JWT_SECRET}`);
        return decodedPayload;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports.generateAccessToken = generateAccessToken;
module.exports.verifyUserCredentials = verifyUserCredentials;
module.exports.verifyAccessToken = verifyAccessToken;