var Ajv = require('ajv');
var ajv = new Ajv({
	'extendRefs': true,
	'allErrors': true,
	'jsonPointers': true
});
var fs = require('fs');
var validate = null;
var data = {};
var ids = {};
var types = {};

	ajv.addKeyword('sloref', {
		validate: function(schema, data, parentSchema, dataPath, parentData, propertyName, rootData) {
			var matches = /.*\#\/definitions\/(.*)/g.exec(schema);
			if (matches) {
				var result = types[data] == matches[1];
/*
				if (!result) {
					console.log(schema);
					console.log(data);
					console.log(matches);
				}
*/
				return result;
			}
			console.log('Unknown #ref definition: '+schema);
		}
	});

	function loadSchema(name, dir='') {
		var context = fs.readFileSync(name,'utf-8')
		var schema = JSON.parse(context);

		var properties = Object.keys(schema.properties);
		properties.forEach(function(propertyName) {
			if (typeof schema.properties[propertyName]['#file'] != 'undefined') {
				var file = schema.properties[propertyName]['#file'];
				var fileData = fs.readFileSync(dir+file, 'utf-8');
					console.log(propertyName+': reading dir'+file);
					data[propertyName] = JSON.parse(fileData);
					if (typeof data[propertyName] == 'undefined') {
						console.log(propertyName+' not parsed correctly');
					} else if (typeof data[propertyName].length == 'undefined') {
						console.log(propertyName+' has no length');
					} else {
						console.log(data[propertyName].length + ' items found');
					}
					data[propertyName].forEach(function(entity) {
						if (ids[entity.id]) {
							console.log('Duplicate id in '+propertyName+': '+entity.id, 
								ids[entity.id], entity);
						} else {
							ids[entity.id] = entity;
							types[entity.id] = propertyName;
						}
					});
			} else {
				console.log('skipping '+propertyName);
			}
		});
		return schema;
	}

	var kernSchema = loadSchema('kern/context.json','kern/');
	var vakkenSchema = loadSchema('context.json');

	var valid = ajv.addSchema(kernSchema, 'http://curriculum.slo.nl/schemas/kern')
	               .addSchema(vakkenSchema, 'http://curriculum.slo.nl/schemas/vakken')
	               .validate('http://curriculum.slo.nl/schemas/vakken', data);

	if (!valid) {
		ajv.errors.forEach(function(error) {
			console.log(error.dataPath+': '+error.message);
		});
//		console.log(ajv.errorsText());
	} else {
		console.log('data is valid!');
	}

