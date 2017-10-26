var express = require('express');
var router = express.Router();

var logController = require('../controllers/logController');
var utility = require('../utility');

router.get('/', utility.isAdmin, logController.read_all);
router.get('/:id', utility.isAdmin, logController.read_one);
router.get('/user/:id', utility.isAdmin, logController.read_by_user);
router.delete('/:id', utility.isAdmin, logController.delete_one);
router.delete('/user/:id', utility.isAdmin, logController.delete_by_user);

module.exports = router;