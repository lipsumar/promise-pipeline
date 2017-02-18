var wikijs = require('wikijs'),
    wikipedia = wikijs.default({apiUrl: 'http://fr.wikipedia.org/w/api.php'}),
    Promise = require('bluebird').Promise

module.exports = function(startUrl, resolve, reject) {
    var self = this
    this.state.fetchCount = 0
    this.state.queue = [];
    this.state.items = [];
    function loop(){
        if(self.state.fetchCount < 3){
            var url = self.state.queue.length > 0 ? self.state.queue.pop() : startUrl;
            run.call(self, url).then(loop, reject)
        }else{
            resolve(self.state.items);
        }
    }
    loop();
}


function run(startUrl){
    var self = this
    return wikipedia.page(startUrl)
        .then(page => {
            return Promise.all([
                page.content(),
                page.links().then(receiveLinks)
            ]).spread((content, links) => {
                var rating = rate(content)
                self.state.queue.push(...links); // @TODO avoid duplicates
                return {rating, links, content}
            })
        })
        .then(item => {
            self.emit('item', item)
            self.state.items.push(item)
        })
        .then(() => self.state.fetchCount++)
}

function rate(content){
    return 10
}

function receiveLinks(links){
    return links.slice(0,2)
}


