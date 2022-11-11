const express = require("express");
const indexcontroller = require("../controllers/index");
const router = express.Router();
router.post('/data', indexcontroller.InsertdeviceData);
module.exports = router;