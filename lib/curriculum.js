var curriculum = require('../kern/lib/curriculum.js');

    curriculum.splitVakkernAndSubkern = function()
    {
        curriculum.data.vakkern.forEach(function(vakkern) {
            if (typeof vakkern.vakinhoud_id != 'undefined') {
                var vaksubkern = curriculum.clone(vakkern);
                delete vaksubkern.vaksubkern_id;
                var vaksubkernId = curriculum.add('vaksubkern', vaksubkern);

                var newVakkern = curriculum.clone(vakkern);
                delete newVakkern.vakinhoud_id;
                var newVakkernId = curriculum.add('vakkern', newVakkern);

                if (newVakkern.vaksubkern_id.length==0) {
                    newVakkern.vaksubkern_id.push(vaksubkernId);
                }

                curriculum.replace('vakkern', vakkern.id, newVakkernId, vaksubkernId);
                curriculum.replace('vaksubkern', vakkern.id, vaksubkernId);
            }
        });
    }

module.exports = curriculum;
