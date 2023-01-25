const express = require("express");
const indexcontroller = require("../controller");
const router = express.Router();
router.post('/data', indexcontroller.produceToKafka);
router.post('/status', indexcontroller.status);
module.exports = router;