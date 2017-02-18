/**
 * Specialized Stage that handles multiple elements.
 * For instance prcessing a list of items.
 * A StageList still behaves like a normal Stage (runs
 * and returns a single promise, to be resolved once
 * all items have been processed).
 * A StageList job must emit 'item' once an item has been
 * fully processed.
 *
 * Items processed have the option to be "decorated",
 * see addDecorator
 */

var util = require('util'),
    Stage = require('./Stage'),
    Promise = require('bluebird').Promise

function StageList(){
    Stage.apply(this, arguments)
    this.decorators = [];
    this.pendingDecorator = 0;
    this.on('item', this.applyDecorator)
}
util.inherits(StageList, Stage);

StageList.prototype.run = function() {

    return Stage.prototype.run.apply(this, arguments).then((items) => {
        if(this.pendingDecorator === 0){
            return items;
        }else{
            // @TODO this doesn't look nice, use of deferred
            // seems legit but too much code
            // http://bluebirdjs.com/docs/api/deferred-migration.html
            var resolve, reject;
            this.finishJobPromise = new Promise((res, rej) => {
                resolve = res
                reject = rej
            });
            this.items = items; // @TODO there should be a nicer way to cache `items`
            this.finishJobResolve = resolve;
            this.finishJobReject = reject;
            return this.finishJobPromise;
        }

    })
}

StageList.prototype.addDecorator = function(decorator) {
    this.decorators.push(decorator)
}


StageList.prototype.applyDecorator = function(item) {
    this.decorators.map(decorator => {
        this.pendingDecorator++
        decorator.apply(item).then(this.decoratorFinished.bind(this, item))
    })
}

StageList.prototype.decoratorFinished = function(item, deco) {
    Object.assign(item, deco);
    this.pendingDecorator--

    if(this.finishJobPromise && this.pendingDecorator===0){
        this.finishJobResolve(this.items)
    }
}


module.exports = StageList
