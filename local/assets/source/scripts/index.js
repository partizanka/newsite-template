import 'regenerator-runtime/runtime';
import View from 'scripts/view/view';

window.View = View;


$(document).ready(function () {
	View.initAllGlobal();
	View.initAllLocal(document.body);
});