//Interface.js
const viewport = document.getElementsByClassName('viewport')[0];

let currentMenuPage = 0;

let scenarioInfo = [0,0,0,0]; //system, activationNum, activationLoc, Faults

let selections = []

let systemMenu = ['system00', 'system00c'];
let locationMenu = [false, true];
let faultMenu = [0, 0.02, 0.15, 1];

const menuContainer = document.getElementsByClassName('menu-container')[0];
const menuPages = menuContainer.getElementsByClassName('menu-page');

menuPages[0].classList.add('returnRight');
menuPages[0].classList.toggle('show');

const summary = menuPages[menuPages.length - 1].getElementsByClassName('menu-summary')[0];
const summaryLines = summary.getElementsByTagName('span');


for (let i = 0, l = menuPages.length - 1; i < l; i++) {
	let thisPage = menuPages[i];
	let thisPageOptions = thisPage.getElementsByClassName('menu-option');
	for(let j = 0, m = thisPageOptions.length; j < m; j++) {
		let thisOption = thisPageOptions[j];
		thisOption.setAttribute('data-index', j);
	}
}


//Add event listeners


viewport.addEventListener('click', function(event) {
	let t = event.target;
	if (t.classList.contains('closeBox')) {
		// close the connected element and anything closeable within
		 closeElements(t.parentNode.parentNode);
	}

	if(t.classList.contains('menu-option') || t.classList.contains('menu-option-text') || t.classList.contains('menu-back')||t.classList.contains('menu-start')) {
		handleMenuInteraction(t, event);
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
	if(target.classList.contains('menu-option-text')) {
		handleMenuInteraction(target.parentNode);

	}

	if (target.classList.contains('menu-option')) {
		if(currentMenuPage < 4) {
				let selection = target.getAttribute('data-index');
				scenarioInfo[currentMenuPage] = selection;
				selections[currentMenuPage] = target.getElementsByClassName('menu-option-text')[0].innerHTML;
				summaryLines[currentMenuPage].innerHTML = selections[currentMenuPage];
				let thisPage = menuContainer.getElementsByClassName('menu-page')[currentMenuPage];

				let theseOptions = target.parentNode.parentNode.getElementsByClassName('menu-option');
				for (let i = 0, l = theseOptions.length; i < l; i++) {
					theseOptions[i].classList.remove('menu-selected');
				}
				target.classList.add('menu-selected');

				let nextPage;
				if (currentMenuPage == 1 && selection < 2) {
					if (selection == 0) {
						scenarioInfo[2] = 0;
						summaryLines[2].innerHTML = 'N/A';
						scenarioInfo[3] = 0;
						summaryLines[3].innerHTML = 'N/A';
						nextPage = 	menuContainer.getElementsByClassName('menu-page')[4];
						currentMenuPage = 4;
					} else if (selection == 1) {
						scenarioInfo[2] = 0;
						summaryLines[2].innerHTML = 'Random';
						nextPage = 	menuContainer.getElementsByClassName('menu-page')[3];
						currentMenuPage = 3;
					}
				} else {
					nextPage = 	menuContainer.getElementsByClassName('menu-page')[currentMenuPage + 1];
					currentMenuPage++;
				}
				toggleDisplay(thisPage);
				nextPage.classList.remove('returnLeft');
				nextPage.classList.add('returnRight');
				toggleDisplay(nextPage);
				thisPage.classList.remove('returnRight');
				thisPage.classList.add('returnLeft');
				 // hopefully this will be done with a nice animation
				 if(currentMenuPage > 0) {
					 menuContainer.getElementsByClassName('menu-back')[0].classList.add('show');
				 }

				 if(currentMenuPage == menuPages.length - 1) {
					 menuContainer.getElementsByClassName('menu-start')[0].removeAttribute('disabled');
				 }

		}
	}

	if(target.classList.contains('menu-back')) {
		if (currentMenuPage > 0) {
			let thisPage = menuContainer.getElementsByClassName('menu-page')[currentMenuPage];
			let nextPage;

			if (currentMenuPage == 4 && scenarioInfo[1] == 0) {
				nextPage = 	menuContainer.getElementsByClassName('menu-page')[1];
				currentMenuPage = 1;
			} else if (currentMenuPage == 3 && scenarioInfo[1] == 1) {
				nextPage = 	menuContainer.getElementsByClassName('menu-page')[1];
				currentMenuPage = 1;
			} else {
				nextPage = 	menuContainer.getElementsByClassName('menu-page')[currentMenuPage - 1];
				currentMenuPage--;
			}
			toggleDisplay(thisPage);
			toggleDisplay(nextPage);
			// actually,this button should never be disabled...
			if(currentMenuPage == 0) {target.classList.remove('show');}
			//menuContainer.getElementsByClassName('menu-start')[0].setAttribute('disabled','disabled');
		}
	}

	if (target.classList.contains('menu-start')) {
			if (!target.disabled) {
			// call the appropriate system builder function with
			// parameters supplied by the menu selections made by the
			// user.


			let thisSystemPath = systemDir + systemPaths[systemMenu[parseInt(scenarioInfo[0])]];
			loadScript(thisSystemPath).then(
				function(){
					buildSystem(system);
					buildZoneLists();
					buildFips();
					menuContainer.style.display = 'none';

					let devList = sysObjectsByCategory['det'];

					let alarmChoice = parseInt(scenarioInfo[1]);
					let numAlarms = 0;
					switch(alarmChoice){
						case 0:
							numAlarms = 0;
							break;
						case 1:
							numAlarms = 1;
							break;
						case 2:
							numAlarms = 2;
							break;
						case 3:
							numAlarms = Math.round(Math.floor(3*Math.random()) + 2.9);
							break;
						case 4:
							numAlarms = Math.round(Math.floor(8*Math.random()) + 5.9);
							break;
					}

					let stuckProb = faultMenu[parseInt(scenarioInfo[3])];

					if (numAlarms > 0) {
						triggerRandomAlarms(devList, numAlarms, locationMenu[scenarioInfo[2]], stuckProb);
					}

					let fipList = sysObjectsByCategory['fip'];
					// needed to loop backwards so that the alarm counts were correct for FIPs closer to the main FirePanel
					// TODO: make the title of the blockplan depend on a variable stored with the FIP, not the entire system
					for (let l = fipList.length, i = l - 1; i >= 0; i--) {
						let thisFip = fipList[i];

						 thisFip.assignStatusIds();
						 thisFip.displayStatus();


						for (let i = 0, l = thisFip.deviceList.length; i < l; i++){
							thisFip.updateDeviceImagePath(thisFip.deviceList[i]);
						}
						//keep the clock running. When we have multiple FIPs, do them all at once
						//TODO: make it so that there is only one setInterval, with one function that updates all FIP displays.
						window.setInterval(function(){checkStuckList(); thisFip.update();}, 500);
					}

			}).catch(function(){console.log('whoops')});
			// Hide the menu system.
			// Reset the menu system to the start page.
			// Reset the selection styles in the menu system (ready for next time)

		}
	}
}



function toggleDisplay(elm){
	elm.classList.toggle('show');
}

function loadScript(url) {
	return new Promise (function(resolve, reject) {
		var elm = document.createElement('script');

		elm.onload = function () {
			resolve(url);
		}

		elm.onerror = function () {
			reject(url);
		}

		elm.async = true;
		elm.setAttribute('id', 'activeSystem');
		elm.setAttribute('type', 'text/javascript');
		elm.setAttribute('src', url);
		document.getElementsByTagName('body')[0].appendChild(elm);

	});
}
