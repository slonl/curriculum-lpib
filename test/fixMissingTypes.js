
	var curriculum   = require('../lib/curriculum.js');
	var vakkenSchema = curriculum.loadSchema('context.json');

	curriculum.fixMissingVakken();

	curriculum.exportFiles(vakkenSchema);

