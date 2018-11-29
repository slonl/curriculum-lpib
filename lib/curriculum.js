var curriculum = require('../kern/lib/curriculum.js');

module.exports = curriculum;

    curriculum.splitVakkernAndSubkern = function()
    {
    	curriculum.data.vakkern.forEach(function(vakkern) {
    		if (typeof vakkern.vakinhoud_id != 'undefined') {
    			var vaksubkern = clone(vakkern);
    			delete vaksubkern.vaksubkern_id;
    			var vaksubkernId = add('vaksubkern', vaksubkern);

    			var newVakkern = clone(vakkern);
    			delete newVakkern.vakinhoud_id;
    			var newVakkernId = add('vakkern', newVakkern);

    			if (newVakkern.vaksubkern_id.length==0) {
    				newVakkern.vaksubkern_id.push(vaksubkernId);
    			}

    			replace('vakkern', vakkern.id, newVakkernId, vaksubkernId);
    			replace('vaksubkern', vakkern.id, vaksubkernId);
    		}
    	});
    }

