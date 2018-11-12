const express = require('express');
const path = require('path');

const router = express.Router();
let nickname = "";

function getArrayFromObject(obj) {
    let arr = [];
    for (let key in obj) {
        obj[key].id = Number(key);
        arr.push(obj[key]);
    }
    return arr;
}

let brockersArr = getArrayFromObject(require('../data/brockers'));
console.log('brockers:', brockersArr);

let stocksArr = getArrayFromObject(require('../data/stocks'));
console.log('stocks:', stocksArr);

let burseSettings = require('../data/bursesettings');
console.log('setts:', burseSettings);

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

router.get('/:name', function (req, res) {
    nickname = req.params.name;
    let isBurseMember = false;
    for (let i = 0; i < brockersArr.length; i++) {
        if (brockersArr[i].name === nickname) {
            res.status(200);
            res.send({
                status: 200,
                id: brockersArr[i].id,
                nickname: nickname,
                money: brockersArr[i].money
            });
            isBurseMember = true;
            break;
        }
    }
    if (!isBurseMember) {
        res.status(400);
        res.json({
            status: 400,
            message: "Пользователь не зарегистрирован в аукционе!"});
    }
});

router.get('/settings', function (req, res) {
    res.status(200);
    res.send(burseSettings);
});

router.get('/stocks', function (req, res) {
    res.status(200);
    res.send(stocksArr);
});

module.exports = router;
