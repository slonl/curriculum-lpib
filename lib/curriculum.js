var curriculum = require('../curriculum-basis/lib/curriculum.js');

    curriculum.splitVakkernAndSubkern = function()
    {
		//FIXME: an unreleased entity should not be replaced ever, since the id
		// gets lost and it is already in a deprecated entity in the replacedBy

        curriculum.data.lpib_vakkern.forEach(function(lpib_vakkern) {
            if (typeof lpib_vakkern.lpib_vakinhoud_id != 'undefined') {
                var lpib_vaksubkern = curriculum.clone(lpib_vakkern);
                delete lpib_vaksubkern.lpib_vaksubkern_id;
                var lpib_vaksubkernId = curriculum.add('lpib_vaksubkern', lpib_vaksubkern);

                if (!lpib_vakkern.unreleased) {
                    var newVakkern = curriculum.clone(lpib_vakkern);
                    delete newVakkern.lpib_vakinhoud_id;
                    var newVakkernId = curriculum.add('lpib_vakkern', newVakkern);
                    if (newVakkern.lpib_vaksubkern_id.length==0) {
                        newVakkern.lpib_vaksubkern_id.push(lpib_vaksubkernId);
                    }

                    curriculum.replace('lpib_vakkern', lpib_vakkern.id, newVakkernId, lpib_vaksubkernId);
                } else {
                    delete lpib_vakkern.lpib_vakinhoud_id;
                }
                curriculum.replace('lpib_vaksubkern', lpib_vakkern.id, lpib_vaksubkernId);
            }
        });

        curriculum.data.lpib_vaksubkern.forEach(function(lpib_vaksubkern) {
            if (typeof lpib_vaksubkern.lpib_vaksubkern_id != 'undefined') {
                var lpib_vakkern = curriculum.clone(lpib_vaksubkern);
                delete lpib_vakkern.lpib_vakinhoud_id;
                var lpib_vakkernId = curriculum.add('lpib_vakkern', lpib_vakkern);

                if (!lpib_vaksubkern.unreleased) {
                    var newVaksubkern = curriculum.clone(lpib_vaksubkern);
                    delete newVaksubkern.lpib_vaksubkern_id;
                    var newVaksubkernId = curriculum.add('lpib_vaksubkern', newVaksubkern);

                    curriculum.replace('lpib_vaksubkern', lpib_vaksubkern.id, newVaksubkernId, lpib_vakkernId);
                } else {
                    delete lpib_vaksubkern.lpib_vaksubkern_id;
                }
                curriculum.replace('lpib_vakkern', lpib_vaksubkern.id, lpib_vakkernId);
            }
        });
    }

    curriculum.fixMissingVakken = function()
    {
        var types = ['vak','lpib_vakkern','lpib_vaksubkern','lpib_vakinhoud'];
        var sections = types.slice(0, 3);
        var replaceWith = {};

        var copyEntity = function(entity, section) {
            var newEntity = curriculum.clone(entity);
            // remove properties that aren't supposed to be here
            var correctProperty = types[types.indexOf(section)+1]+'_id';
            sections.forEach(function(section, index) {
                var prop = types[index+1]+'_id';
                if (prop != correctProperty) {
                    delete newEntity[prop];
                }
            });
            var newId = curriculum.add(section, newEntity);
            return newEntity;
        };

        sections.forEach(function(section, index) {
            curriculum.data[section].forEach(function(entity) {
                var subtype = types[index+1];
                var prop = subtype+'_id';
                if (typeof entity[prop] != 'undefined') {
                    entity[prop].forEach(function(id) {
                        if (curriculum.types[id] != subtype) {
                            if (!replaceWith[id]) {
                                replaceWith[id] = {};
                            } 
                            if (!replaceWith[id][section]) {
                                var newObject = copyEntity(curriculum.ids[id], subtype);
                                newObject.replaces = [id];
//                                replaceWith[id][section] = newObject;
                                console.log('replace '+section+' '+id+' to '+newObject.id+' as '+subtype+'<>'+curriculum.types[id]);
                                curriculum.replaceLinks(section, prop, id, newObject.id);
                            } else {
                                console.log('already found '+section+' '+id+' -> '+replaceWith[id][section].id);
                            }
                        }
                    });
                }
            });
        });
/*        Object.keys(replaceWith).forEach(function(id) {
            Object.keys(replaceWith[id]).forEach(function(section) {
                var prop = types[types.indexOf(section)+1]+'_id';
                //console.log('replace links in '+section+'.'+prop+' from '+id+' to '+replaceWith[id][section].id);
                curriculum.replaceLinks(section, prop, id, replaceWith[id][section].id);
            });
        });
*/
    }

module.exports = curriculum;
