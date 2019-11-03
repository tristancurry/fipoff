//Interface.js

//TODO:initialise button states

//Add event listeners


viewport.addEventListener('click', function(event) {
	let t = event.target;
	if (t.classList.contains('closeBox')) {
		// close the connected element and anything closeable within
		// do this with a recursive function
		// e.g. if the thing you're closing is a blockplan - look for any device cards and contained FIPs that are open and close them
		// if the thing you're closing is a FIP then look for any open connected blockplans and close them
		// if the thing you're closing is a device card then look for anything dependent on that, then close
		 closeElements(t.parentNode.parentNode);
		// event.stopPropagation();
	}
});

function closeElements(target) {
	// first work out which element is being closed
	// i.e. get type and data-index
	console.log(target.classList[0]);
	switch(target.classList[0]) {
		case 'panel-container':
		// does the panel-container have a blockplan with classList containing show?
			let blockplan = target.getElementsByClassName('blockplan')[0];
			if (blockplan && blockplan.classList.contains('show')) {
				closeElements(blockplan);
			}
			target.classList.remove('show');
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
			// after all of that, unshow the blockplan
			target.classList.remove('show');
			break;

		case 'device-container':
				//target.classList.remove('show');
				target.classList.remove('show-flash');
			break;

		default:
			console.log('huh');
			break;
	}
}


function toggleDisplay(elm){
	elm.classList.toggle('show');
}
