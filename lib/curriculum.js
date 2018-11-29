var curriculum = require('../kern/lib/curriculum.js');

    curriculum.splitVakkernAndSubkern = function()
    {
        curriculum.data.vakkern.forEach(function(vakkern) {
            if (typeof vakkern.vakinhoud_id != 'undefined') {
                var vaksubkern = curriculum.clone(vakkern);
                delete vaksubkern.vaksubkern_id;
                var vaksubkernId = curriculum.add('vaksubkern', vaksubkern);

                if (!vakkern.unreleased) {
                    var newVakkern = curriculum.clone(vakkern);
                    delete newVakkern.vakinhoud_id;
                    var newVakkernId = curriculum.add('vakkern', newVakkern);
                    if (newVakkern.vaksubkern_id.length==0) {
                        newVakkern.vaksubkern_id.push(vaksubkernId);
                    }

                    curriculum.replace('vakkern', vakkern.id, newVakkernId, vaksubkernId);
                } else {
                    delete vakkern.vakinhoud_id;
                }
                curriculum.replace('vaksubkern', vakkern.id, vaksubkernId);
            }
        });

        curriculum.data.vaksubkern.forEach(function(vaksubkern) {
            if (typeof vaksubkern.vaksubkern_id != 'undefined') {
                var vakkern = curriculum.clone(vaksubkern);
                delete vakkern.vakinhoud_id;
                var vakkernId = curriculum.add('vakkern', vakkern);

                if (!vaksubkern.unreleased) {
                    var newVaksubkern = curriculum.clone(vaksubkern);
                    delete newVaksubkern.vaksubkern_id;
                    var newVaksubkernId = curriculum.add('vaksubkern', newVaksubkern);

                    curriculum.replace('vaksubkern', vaksubkern.id, newVaksubkernId, vakkernId);
                } else {
                    delete vaksubkern.vaksubkern_id;
                }
                curriculum.replace('vakkern', vaksubkern.id, vakkernId);
            }
        });
    }

    curriculum.fixMissingVakken = function()
    {
        var types = ['vak','vakkern','vaksubkern','vakinhoud'];
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
