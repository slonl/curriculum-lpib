
	var curriculum   = require('../lib/curriculum.js');
	var vakkenSchema = curriculum.loadSchema('context.json');

	var count = 0;
	curriculum.data.deprecated.forEach(function(entity) {
		entity.replacedBy.forEach(function(replacementId) {
			if (!curriculum.ids[replacementId]) {
				console.log('Reference '+replacementId+' in '+entity.id+' is missing');
			} else {
				count++;
			}
		});
	});

	console.log(count+' references checked and valid');