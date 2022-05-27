const { reduce } = require('async');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Wiki page');
});

router.get('/about', (req, res, next) => {
    next();
}, (req, res) => {
    res.send('About this wikis');
});

router.get('/:fakeid/other', (req, res) => {
    res.send(req.params);
});

module.exports = router;