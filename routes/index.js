var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	createTank();
  res.render('index', { title: "tank"});
});


function createTank() {

}

module.exports = router;
