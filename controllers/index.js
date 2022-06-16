var router = require('express').Router();

// split up route handling
router.use('/', require('./add_points.controller'))

module.exports = router;