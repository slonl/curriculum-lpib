const repl = require('repl');
const curriculum = require('../curriculum-basis/lib/curriculum.js');
const basisSchema = curriculum.loadSchema('curriculum-basis/context.json','curriculum-basis/');
const schema = curriculum.loadSchema('context.json');

var server = repl.start('> ');
server.context.curriculum = curriculum;
if (process.env.NODE_REPL_HISTORY) {
    server.setupHistory(process.env.NODE_REPL_HISTORY, (e) => { if (e) console.log(e); } );
} else {
    console.log('Set environment variable NODE_REPL_HISTORY=.repl_history to enable persistent REPL history');
}
