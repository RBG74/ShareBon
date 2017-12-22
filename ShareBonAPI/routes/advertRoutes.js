var express = require('express');
var router = express.Router();

var advertController = require('../controllers/advertController');
var utility = require('../utility');
  
router.post('/', advertController.create);
/*
router.get('/', utility.isAuth, userController.read_all);
router.get('/:id', utility.isAuth, userController.read_one);
router.patch('/:id', utility.isAuth, userController.update_one);
router.delete('/:id', utility.isAuth, userController.delete_one);
*/

module.exports = router;