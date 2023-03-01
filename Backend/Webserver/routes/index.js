const express = require("express");
const indexcontroller = require("../controllers/index");
var passport = require('passport');
const router = express.Router();
// router.get('/oauth2/redirect/google',
//   passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
//   function(req, res) {
//     console.log(req);
//     res.redirect('/');
//   });
// router.get('/login/google', passport.authenticate('google', {
//     scope: [ 'email' ]
//   }));
router.post('/recommend',indexcontroller.recommendations)
router.post('/csv',indexcontroller.downloadascsv)
module.exports = router;