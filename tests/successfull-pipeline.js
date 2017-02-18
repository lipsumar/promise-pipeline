var assert = require('assert')
var ProductionLine = require('../lib/ProductionLine'),
    Stage = require('../lib/Stage')

function testFunc(params, res, rej) {
    setTimeout(() => {
        res({'hi':'john','run-with': params})
    }, 100)
}

var prodLine = new ProductionLine(),
    stage1 = new Stage('stage1', testFunc),
    stage2 = new Stage('stage2', testFunc)


prodLine.addStage(stage1);
prodLine.addStage(stage2);


var expected = {
    'hi': 'john',
    'run-with': {
        'hi': 'john',
        'run-with': 'https://fr.wikipedia.org/wiki/Harakiri_(film,_1919)'
    }
}

var ok = false
prodLine.start('https://fr.wikipedia.org/wiki/Harakiri_(film,_1919)')
    .on('finish', (data) => {
        assert.deepEqual(data, expected);
        ok = true
    })


setTimeout(() => {
    assert(ok, 'finish was called')
    console.log('successfull pipeline ✅');
}, 300)
