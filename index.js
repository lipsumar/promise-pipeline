var ProductionLine = require('./lib/ProductionLine'),
    Stage = require('./lib/Stage'),
    StageList = require('./lib/StageList'),
    Decorator = require('./lib/Decorator')

var prodLine = new ProductionLine(),
    collector = new StageList('collector', require('./jobs/collector')),
    merger = new Stage('merger', require('./jobs/merger')),
    cleaner = new Decorator('cleaner', require('./jobs/cleaner'))


collector.addDecorator(cleaner);

prodLine.addStage(collector);
prodLine.addStage(merger);




prodLine.start('Harakiri (film, 1919)')
    .on('finish', (data) => {
        console.log('we’re done!');
        console.log(data);
    })
    .on('error', err => {
        console.log('oh dear...');
        console.log(err.stack);
    })



