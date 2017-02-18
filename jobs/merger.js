var _ = require('underscore')

module.exports = function(articles, resolve){
    var allClean = articles.map(article => article.clean).join('\n')
    var merged = _.shuffle(allClean.split('.')).join('.');
    resolve(merged);
}
