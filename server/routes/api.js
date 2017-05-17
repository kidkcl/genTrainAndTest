var express = require('express');
var router = express.Router();

var shuffle = require('shuffle-array');

let roughData = [];
let shuffleData = [];
let testSet = [];
let trainSet = [];

/* GET users listing. */
router.get('/', function(req, res) {
  res.send(roughData);
});

router.get('/shuffle', function(req, res){
    const data = roughData;
    shuffleData = JSON.parse(JSON.stringify(data));
    for(i = 0; i < shuffleData.length; i++) {
        let tmpRow = {
            intent: shuffleData[i].intent,
            text: []
        }
        let tmpRow1 = {
            intent: shuffleData[i].intent,
            text: []
        }
        shuffle(shuffleData[i].text);
        testSet.push(tmpRow);
        trainSet.push(tmpRow1);
    }
    for(i = 0; i < shuffleData.length; i++) {
        let begin = Math.floor(shuffleData[i].text.length/2);
        // console.log(shuffleData[i].text.length);
        console.log(begin);
        let end = shuffleData[i].text.length;
        console.log(end);
        var ttext, utext;
        ttext = shuffleData[i].text.slice(0, begin);
        console.log(ttext);
        utext = shuffleData[i].text.slice(begin, end);
        console.log(utext)
        testSet[i].text = ttext.slice();
        trainSet[i].text = utext.slice();
        console.log(testSet);
        console.log(trainSet);
    }
    res.send(shuffleData);
});

router.get('/download', function(req, res) {
    let set = JSON.parse(JSON.stringify(testSet));
    set = set.concat(JSON.parse(JSON.stringify(trainSet)));
    console.log(set);
    res.send(set);
});

router.post('/restart', function(req, res) {
    roughData = [];
    res.send(roughData);
});

router.post('/intent', function(req, res) {
    const intentText = req.body.inputText;
    const newRow = {
        intent: intentText,
        text: []
    }
    roughData.push(newRow);
    res.send(newRow);
});

router.put('/intent/:id', function(req, res) {
    const intentText = req.body.text;
    const id = parseInt(req.params.id, 10);
    console.log(intentText + ' ' + id);
    roughData[id].intent = intentText;
    res.send(roughData[id])
});

router.put('/utterance/:id', function(req, res) {
    const text = req.body.text;
    const id = parseInt(req.params.id, 10);
    console.log(text + ' ' + id);
    roughData[id].text.push(text);
    res.send(roughData[id]);
});

module.exports = router;