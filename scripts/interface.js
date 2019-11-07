//Interface.js

//TODO:initialise button states

let currentMenuPage = 0;

let scenarioInfo = [0,0,0,0]; //system, activationNum, activationLoc, Faults

let systemMenu = ['system00', 'system00c'];

let faultMenu = [0, 0.05, 0.15, 1];

const menuContainer = document.getElementsByClassName('menu-container')[0];
menuContainer.getElementsByClassName('menu-page')[0].classList.toggle('show');
//Add event listeners


viewport.addEventListener('click', function(event) {
	let t = event.target;
		console.log(t);
	if (t.classList.contains('closeBox')) {
		// close the connected element and anything closeable within
		 closeElements(t.parentNode.parentNode);
	}

	if(t.classList.contains('menu-option') || t.classList.contains('menu-option-text')){
		handleMenuInteraction(t);
	}
});

function closeElements(target) {
	// first work out which element is being closed
	// i.e. get type and data-index
	switch(target.classList[0]) {
		case 'panel-container':
		// does the panel-container have a blockplan with classList containing show?
			let blockplan = target.getElementsByClassName('blockplan')[0];
			if (blockplan && blockplan.classList.contains('show')) {
				closeElements(blockplan);
			}
			target.parentNode.classList.remove('show');
			break;
		case 'blockplan':
			// does the blockplan have any fips open?
			// crude: go through ALL fips, find the ones that have the associated blockplan as a parent,
			// ----- find their asssociated panel-container and if showing, unshow it
			for (let i = 0, l = sysObjectsByCategory['fip'].length; i < l; i++) {
				let fip = sysObjectsByCategory['fip'][i];
				let fipParent = fip.parent;
				if (fipParent && fipParent.parent) {
					let fipParentIndex = fipParent.parent.blockplan.getAttribute('data-index');
					if (fipParentIndex == target.getAttribute('data-index')) {
						closeElements(fip.panel.parentNode);
					}
				}
			}
			// does the blockplan have any device cards showing
			// ----- grab the device-container div. if its classList contains 'show' then close it!
			let device = target.getElementsByClassName('device-container')[0];
			device.classList.remove('show-flash');
			target.classList.remove('show');
			break;

		case 'device-container':
				//target.classList.remove('show');
				target.classList.remove('show-flash');
			break;

		default:
			break;
	}
}

function handleMenuInteraction(target) {
console.log(target);
	// if the title screen start button is pressed,
	// set the initial state of the menu screens
	// e.g. current page - an index that lets the event handler know
	// which information to store where, and which buttons to activate
	if (target.classList.contains('title-button')) {
		currentMenuPage = 1;

	}

	// if a selector is clicked on...
	// 1.store the appropriate string and associated variable value
	// 2.append the string the the appropriate span in the 'summary' page
	// and anywhere else this info will be useful
	// 3.trigger the disappearance of this page, and the appearance of the next
	// unless we are on the summary page.
	// 4.make the 'back' button in the footer do the correct thing
	// 5.make the 'start scenario' button appear or disappear as necessary
	if (target.classList.contains('menu-option') || target.classList.contains('menu-option-text')) {
		if(currentMenuPage < 4) {
				let thisPage = menuContainer.getElementsByClassName('menu-page')[currentMenuPage];
				let nextPage = 	menuContainer.getElementsByClassName('menu-page')[currentMenuPage + 1];
				currentMenuPage++;
				toggleDisplay(thisPage);
				toggleDisplay(nextPage); // hopefully this will be done with a nice animation
		}
	}
}

function toggleDisplay(elm){
	elm.classList.toggle('show');
}
