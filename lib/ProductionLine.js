var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    winston = require('winston')

// make winston use timestamps
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true});


function ProductionLine(){
    EventEmitter.call(this)
    this.stages = [];
    return this
}
util.inherits(ProductionLine, EventEmitter);

ProductionLine.prototype.addStage = function(stage) {
    this.stages.push(stage)
}

ProductionLine.prototype.start = function(params) {
    this.currentStageIndex = -1;
    this.next(params);
    return this
}

ProductionLine.prototype.next = function(params) {
    this.currentStageIndex++;
    var stage = this.stages[this.currentStageIndex];
    if(stage){
        winston.info('ProductionLine: Starting stage '+stage.name);
        stage.run(params).then(
            this.next.bind(this),
            this.error.bind(this)
        )
    }else{
        winston.info('ProductionLine: reached the end');
        this.end(params);
    }
}

ProductionLine.prototype.error = function(error) {
    this.emit('error', error)
}

ProductionLine.prototype.end = function(result) {
    this.emit('finish', result)
}

module.exports = ProductionLine
