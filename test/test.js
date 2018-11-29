	var Ajv = require('ajv');
	var ajv = new Ajv({
		'extendRefs': true,
		'allErrors': true,
		'jsonPointers': true
	});
	var validate = null;

	ajv.addKeyword('itemTypeReference', {
		validate: function(schema, data, parentSchema, dataPath, parentData, propertyName, rootData) {
			var matches = /.*\#\/definitions\/(.*)/g.exec(schema);
			if (matches) {
				var result = curriculum.types[data] == matches[1];
/*
				if (!result) {
					console.log(schema);
					console.log(data);
					console.log(matches);
					console.log(dataPath);
				}
*/
				return result;
			}
			console.log('Unknown #ref definition: '+schema);
		}
	});

	var curriculum   = require('../lib/curriculum.js');
	var kernSchema   = curriculum.loadSchema('kern/context.json','kern/');
	var vakkenSchema = curriculum.loadSchema('context.json');

	var valid = ajv.addSchema(kernSchema, 'http://curriculum.slo.nl/schemas/kern')
	               .addSchema(vakkenSchema, 'http://curriculum.slo.nl/schemas/vakken')
	               .validate('http://curriculum.slo.nl/schemas/vakken', curriculum.data);

	if (!valid) {
		ajv.errors.forEach(function(error) {
			console.log(error.dataPath+': '+error.message);
		});
	} else {
		console.log('data is valid!');
	}

