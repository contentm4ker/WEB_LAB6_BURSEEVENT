const express = require('express');
const router = express.Router();
let nickname = "";

let brockers = require('../data/brockers');
let brockersArr = [];
for (let key in brockers) {
    brockers[key].ind = Number(key);
    brockersArr.push(brockers[key]);
}
console.log(brockersArr);


router.get('/', function (req, res) {
    res.render('userauth');
});

router.get('/:name', function (req, res) {
    nickname = req.params.name;
    let isBurseMember = false;
    for (let i = 0; i < brockersArr.length; i++) {
        if (brockersArr[i].name === nickname) {
            res.status(200);
            res.send({
                nickname: nickname,
                money: brockersArr[i].money
            });
            isBurseMember = true;
            break;
        }
    }
    if (!isBurseMember) {
        res.status(400);
        res.json({message: "Пользователь не зарегистрирован в аукционе!"});
    }
});

module.exports = router;
