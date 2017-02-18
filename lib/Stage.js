var Promise = require('bluebird'),
    EventEmitter = require('events').EventEmitter,
    util = require('util')

function Stage(name, jobFunc){
    this.name = name
    this.jobFunc = jobFunc

    // beware of arrow functions
    // they do not allow for dynamic context
    if(!jobFunc.hasOwnProperty('prototype')){
        throw new Error('job functions can not be arrow functions')
    }

    this.jobContext = {
        state: {}, // @TODO persist state
        emit: this.emit.bind(this)
    };
}
util.inherits(Stage, EventEmitter);

Stage.prototype.run = function(params) {
    return new Promise(this.jobFunc.bind(this.jobContext, params))
}

module.exports = Stage
