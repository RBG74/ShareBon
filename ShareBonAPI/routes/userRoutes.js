var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');
var utility = require('../utility');
  
router.post('/', userController.create);
router.get('/', utility.isAuth, userController.read_all);
router.get('/:id', utility.isAuth, userController.read_one);
router.patch('/updatepw/:newpassword', utility.isAuth, userController.update_password);
router.delete('/:id', utility.isAdmin, userController.delete_one);

router.post('/authenticate', userController.authenticate);

module.exports = router;