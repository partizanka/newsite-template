import * as locals from 'modules/local/*';
import * as globals from 'modules/global/*';

export default {
	initAllGlobal() {
		if (globals) {
			for (let fn in globals) {
				if (typeof globals[fn] === 'function') {
					globals[fn]();
				}
			}
		}
	},

	initAllLocal(scope) {
		if (locals) {
			for (let fn in locals) {
				if (typeof locals[fn] === 'function') {
					locals[fn](scope);
				}
			}
		}
	}
};