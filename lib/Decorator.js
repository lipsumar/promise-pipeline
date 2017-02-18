var Promise = require('bluebird')

function Decorator(name, jobFunc){
    this.name = name
    this.jobFunc = jobFunc
}

Decorator.prototype.apply = function(item) {
    return new Promise(this.jobFunc.bind(null, item))
}

module.exports = Decorator
