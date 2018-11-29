
	var curriculum   = require('../lib/curriculum.js');
	var vakkenSchema = curriculum.loadSchema('context.json');

	curriculum.splitVakkernAndSubkern();

	curriculum.exportFiles(vakkenSchema);

