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
				return result;
			}
			console.log('Unknown #ref definition: '+schema);
		}
	});

	var curriculum     = require('../lib/curriculum.js');
	var basisSchema   = curriculum.loadSchema('curriculum-basis/context.json','curriculum-basis/');
	var lpibSchema = curriculum.loadSchema('context.json');

	var valid = ajv.addSchema(basisSchema, 'http://opendata.slo.nl/curriculum/schemas/doelen')
	               .addSchema(lpibSchema, 'http://opendata.slo.nl/curriculum/schemas/lpib')
	               .validate('http://opendata.slo.nl/curriculum/schemas/lpib', curriculum.data);

	if (!valid) {
		ajv.errors.forEach(function(error) {
			console.log(error.dataPath+': '+error.message);
		});
	} else {
		console.log('data is valid!');
	}

