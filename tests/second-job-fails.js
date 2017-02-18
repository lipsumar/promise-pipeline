var assert = require('assert')
var ProductionLine = require('../lib/ProductionLine'),
    Stage = require('../lib/Stage')

var firstJobCalled = false
function testFunc(params, res, rej) {
    firstJobCalled = true
    setTimeout(() => {
        res({'hi':'john','run-with': params})
    }, 100)
}
function failingTestFunc(params, res, rej) {
    setTimeout(() => {
        rej(new Error('something terrible happened'))
    }, 100)
}

var prodLine = new ProductionLine(),
    stage1 = new Stage('stage1', testFunc),
    stage2 = new Stage('stage2', failingTestFunc)


prodLine.addStage(stage1);
prodLine.addStage(stage2);


var expected = {
    'hi': 'john',
    'run-with': {
        'hi': 'john',
        'run-with': 'https://fr.wikipedia.org/wiki/Harakiri_(film,_1919)'
    }
}


var ok = false;
prodLine.start('https://fr.wikipedia.org/wiki/Harakiri_(film,_1919)')
    .on('finish', data => {
        assert(false, 'should not finish')
        assert.deepEqual(data, expected);
        console.log('all good ✅');
    })
    .on('error', err => {
        assert(true, 'error event called')
        assert(err instanceof Error, 'called with an error')
        ok = true;
    })


setTimeout(() => {
    assert(ok, 'on.error was called')
    assert(firstJobCalled, 'first job was called')
    console.log('second job fails ✅');
}, 300)
