var express = require('express');
var router = express.Router();

var advertController = require('../controllers/advertController');
var utility = require('../utility');
  
router.post('/', utility.isAuth, advertController.create);
router.get('/', utility.isAuth, advertController.read_all);
router.get('/:id', utility.isAuth, advertController.read_one);

router.delete('/:id', utility.isAuth, advertController.delete_one);
router.delete('/', utility.isAdmin, advertController.delete_all);

router.patch('/:id', utility.isAuth, advertController.update_one);

module.exports = router;