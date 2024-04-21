const Router = require('express');
const router = new Router();
const administratorController = require('../controllers/administratorController');

router.post('/registration', administratorController.registration);
router.post('/login', administratorController.login);
router.post('/CheckData', administratorController.CheckDataWeb);

module.exports = router;
