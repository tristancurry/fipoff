//main.js - main program code


//TODO: build start screen interface around this - option to launch with random alarm
//TODO: have some kind of 'end scenario' button where it checks the state of the system and what you looked at (e.g. did you open the block plan? did you inspect the nominated detector / zone?, did you leave the external bell and warning system isolated?)

//GLOBALS




const types = {
	smoke: 'Smoke',
	thermal: 'Thermal',
	mcp: 'MCP',
	fip: 'FIP'
};

const subtypes = {
	pe: 'Photoelectric Detector',
	io: 'Ionisation Detector',
	th: 'Thermal Detector',
	mcp: 'Manual Call Point',
	multi: 'Smoke/Heat Detector',
	flame: 'Flame Detector',
	vesda: 'VESDA', //Very Early Smoke Detection Apparatus - has own interface/panel
	ps: 'Pressure Switch',
	fip: 'Fire Indicator Panel'
};

//new devices will be assigned an image appropriate to their type from these arrays...

const imageDir = 'images/';
const systemDir = 'systems/';

const systemPaths = {
	system00: 'system00/system00.js',
	system00c: 'system00/system00c.js',
	abstractSimple: 'abstract/abstractSimple/abstractSimple.js'
}

const deviceStatusStrings = {
	active: 'Activated',
	normal: 'Normal'
};

const deviceImageSheet = new Image().src = imageDir + 'devices.png';
const deviceImageSize = [200, 150];
const deviceImageIndex = {
	smoke: 5,
	thermal: 7,
	mcp: 0,
	concealed: 3
}

const deviceImageVersions = {
	smoke: 2,
	thermal: 2,
	mcp: 1,
	concealed: 1
}

// at the end of the scenario, the tracked devices are assigned a status code
const feedbackStrings = [
	'not dealt with in any way.', //0000 0
	'investigated, without an attempt to reset.', //0001 1
	'reset without investigation. Not Good!', //0010 2 of whole circuit, if conventional
	'reset after investigation.', //0011 3 This is the correct sequence, if there are no reactivations.
	'imposs', //0100 4
	'imposs', //0101 5
	'reset without investigation. Device reactivated, but was not isolated.', //0110 6
	'reset after investigation. Device reactivated, but was not isolated.', //0111 7
	'isolated without investigation or an attempt to reset. Not Good!', //1000 8 also codes for isolation without prior activation...
	'investigated, but isolated without first attempting to reset.', //1001 9
	'reset without investigation, then isolated without having reactivated.',//1010 10
	'reset after investigation, but isolated without having reactivated.',//1011 11
	'imposs', //1100 12
	'isolated without having activated.', //1101 13 this state is manually assigned. Shares binary code with 8.
	'reset without investigation, then isolated upon reactivation. Not Good!', //1110 This is a BAD one! 14
	'reset after investigation, then isolated upon reactivation.'//1111 This is the most correct action 15
];

let sysObjects = [];
let sysObjectsByCategory = {
	fip: [],
	circuit: [],
	det: []
};



let zones;

let initialAlarmList;
let stuckList;
let trackingList;
let feedbackList;

initialiseSystem();

const reactivateTime = 2000;
const reactivateVariance = 15000;

//General Utility Functions
//modify a value if it exceeds specified limits
function fipoff_constrain(n, min, max){
	if(n > max){n = max;} else if(n < min){n = min;}
	return n;
}


function assembleDate(d){
	let day =  d.getDate().toString();
	if(parseInt(day) < 10){day = addLeadingZero(day)};
	let month =  (d.getMonth() + 1).toString();
	if(parseInt(month) < 10){month = addLeadingZero(month)};
	let year =  d.getFullYear().toString();

	return(day +'/'+ month + '/' + year);

}

function assembleTime(d){
	let hours =  d.getHours().toString();
	if(d.getHours() < 10){hours = addLeadingZero(hours)};
	let minutes =  d.getMinutes().toString();
	if(d.getMinutes() < 10){minutes = addLeadingZero(minutes)};
	let seconds =  d.getSeconds().toString();
	if(d.getSeconds() < 10){seconds = addLeadingZero(seconds)};

	return(hours +':'+ minutes + ':' + seconds);
}

function provideTimeString(d){
	let t = assembleDate(d) + ' ' + assembleTime(d);
	return(t);
}

function addLeadingZero(str){
	let newStr = '0' + str;
	return(newStr);
}


//System-specific stuff
const alarmRecencyThreshold = 86400000; // number of milliseconds before an alarm is thought to be 'old news' while alarm condition is active.


function buildSystem (sys) {
//expect to encounter system name first
//then delve into the hierarchy
	if(sys.children){
		createSystemObjects(sys.children[0]);
	}
}

function triggerRandomAlarms(deviceList, _numAlarms, clustered, _stuckProb) {
	let numAlarms = _numAlarms;
	let list = deviceList;
	numAlarms = fipoff_constrain(numAlarms, 0, list.length);
	let stuckProb = _stuckProb;
	let stuckCertain = false;
	if (stuckProb >= 1) {
		stuckCertain = true;
		stuckProb = faultMenu[1];
	}

	let chosenDevices = [];

	if (clustered) {
		while (chosenDevices.length < 1) {
			let idx = Math.floor(Math.random()*list.length);
			if(list[idx].category != 'circuit') {
				chosenDevices.push(idx);
			}
		}
		// Sort the deviceList according to blockplan distance
		// from the chosen device. This should also be restricted to the same blockplan page!
		// 1. get all devices on same page as the chosen device
		// 2. sort this list according to Pythagorean distance from chosen device
		// 3. constrain numAlarms to the length of this list
		// 4. push the first numAlarms of these devices to chosenDevices

		let centralDevice = list[chosenDevices[0]];
		let samePage = [];
		let distances = [];
		for (let i = 0, l = list.length; i < l; i++) {
			if (list[i].page == centralDevice.page) {
				// deliberately include the chosen device to allow for some list matching later...
				samePage.push(list[i]);
				let cdX = parseInt(centralDevice.pos.x.split('px')[0]);
				let cdY = parseInt(centralDevice.pos.y.split('px')[0]);
				let tdX = parseInt(list[i].pos.x.split('px')[0]);
				let tdY = parseInt(list[i].pos.y.split('px')[0]);
				let distance = Math.sqrt(Math.pow((tdX - cdX), 2) + Math.pow((tdY - cdY), 2));
				distances.push([i, distance]);
			}
		}
		distances.sort(function(a, b){return a[1]-b[1]});
		fipoff_constrain(numAlarms, 0, distances.length);
		for (let i = 1; i < numAlarms; i++) {
			chosenDevices.push(distances[i][0]);
		}

	} else {
		while (chosenDevices.length < numAlarms) {
			let idx = Math.floor(Math.random()*list.length);
			//could have used .includes(idx), but IE11...
			if (chosenDevices.indexOf(idx) == -1 && list[idx].category != 'circuit') {
				chosenDevices.push(idx);
			}
		}
	}

	//TODO: this alarm activation needs to be bundled into a function, which also adds the activation date...

	for(let i = 0; i < numAlarms; i++){
		let device = list[chosenDevices[i]];
		device.status = 'alarm';
		device.status_internal = 'active';
		if(device.type == 'mcp') {
			device.stuck = true;
			device.reactivateTime = 0;
			stuckList.push(device);
		}
		let stuckRoll = Math.random();
		if((stuckRoll < stuckProb && device.type != 'mcp')|| (i == numAlarms - 1 && stuckCertain && stuckList.length == 0)){
			device.stuck = true;
			device.reactivateTime = reactivateTime + Math.floor(reactivateVariance*Math.random());
			stuckList.push(device);
		}
		let moment = new Date();
		device.lastAlarmTime = getAlarmTime(moment.getTime() - 420000 + 30000*i);
		if (device.parent.addressable) {initialAlarmList.push(device);}
		else {
			let checkIfPresent = function(circuit){
				if(circuit == device.parent){
					return circuit;
				}
			};
			let check = initialAlarmList.filter(checkIfPresent);
			if(check.length == 0){
				initialAlarmList.push(device.parent);
			}
		}
	}

	// if(stuckCertain && stuckList.length == 0) {
	// 	let handOfFate = Math.floor(chosenDevices.length*Math.random());
	// 	let device = list[chosenDevices[handOfFate]];
	// 	device.stuck = true;
	// 	stuckList.push(device);
	// }
}

function checkStuckList () {

	let d = new Date();
	let moment = d.getTime();
	for (let i = 0, l = stuckList.length; i < l; i++) {
		let device = stuckList[i];
		if (device.type != 'mcp') {
			if (device.lastResetTime) {
				if (moment - device.lastResetTime > device.reactivateTime && device.stuck) {
					if(device.status_internal == 'normal' && device.status == 'normal') {
						device.status_internal = 'active';
						device.status = 'alarm';
						device.lastAlarmTime = getAlarmTime();
						if (!device.hasReactivated) {device.hasReactivated = true;}
						// if this device is on a conventional circuit, push the hasReactivated to the circuit, too
						if (device.parent.category == 'circuit' && !device.parent.addressable && !device.parent.hasReactivated) {
							device.parent.hasReactivated = true;
						}
					}
				}
			}
		}
	}
}


function checkCircuitHasReactivated (circuit) {
	if (circuit.children) {
		let numDevices = circuit.children.length;
		for (let i = 0; i < numDevices; i++) {
			let thisDevice = circuit.children[i];
			if (thisDevice.hasReactivated) {
				if(!circuit.hasReactivated) {circuit.hasReactivated = true;}
				break;
			}
		}
	}
}

function checkCircuitHasBeenLookedAt (circuit) {
	let numDevicesLookedAt = 0;
	if (circuit.children) {
			let numDevices = circuit.children.length;
			for (let i = 0; i < numDevices; i++) {
				let thisDevice = circuit.children[i];
				if (thisDevice.hasBeenLookedAt) {numDevicesLookedAt++;}
			}
			if (numDevices == numDevicesLookedAt) {
				return true;
			} else {
				return false;
			}
	}

}

function getAlarmTime(t) {
	let alarmTime = 0;

	if(t >= 0){
		alarmTime = new Date(t);
	} else {
		alarmTime = new Date();
	}

	let alarmString = provideTimeString(alarmTime);
	alarmTime = alarmTime.getTime(); //convert into milliseconds since reference date, for sorting later
	return [alarmTime, alarmString];
}

function trackActiveDevices (list) {
	for (let i = 0, l = list.length; i < l; i++) {
		if (list[i].status_internal == 'active') {
			trackingList.push(list[i]);
		}
	}
};

function sortByAlarmTime (list) {
	//produce separate list of devices, sorted in order of lastActivationTime (earliest to latest);
	let sortList = [];
	for (let i = 0, l = list.length; i<l; i++) {
		sortList[i] = list[i];
	}
	sortList.sort (
		function(a,b) {
				return a.lastAlarmTime[0] - b.lastAlarmTime[0];
		}
	);

	// grab any chunk of devices with 'recent' alarm times (e.g. last day)
	// and put this at the start of the list...
	// work backwards from the end of the sorted list, moving elements from the end to the beginning
	// until the lastAlarmTime starts getting too old.

	let recentAlarms = [];

	for (let l = sortList.length, i = l - 1; i >= 0; i--) {
		let d = new Date();
		if (d.getTime() - sortList[i].lastAlarmTime[0] < alarmRecencyThreshold) {
			recentAlarms.push(sortList[i]);
		}
	}

	for (let i = 0, l = recentAlarms.length; i < l; i++) {
		sortList.pop();
		sortList.unshift(recentAlarms[i]);
	}
	return sortList;
}

function getFeedbackCode(device) {
	let binaryString = '';
	if (device.hasBeenIsolated) {binaryString += '1';} else {binaryString += '0';}
	if (device.hasReactivated) {binaryString += '1';} else {binaryString += '0';}
	if (device.hasBeenReset) {binaryString += '1';} else {binaryString += '0';}
	if (device.category == 'circuit' && checkCircuitHasBeenLookedAt(device) && !device.hasBeenLookedAt) {device.hasBeenLookedAt = true;}
	if (device.hasBeenLookedAt) {binaryString += '1';} else {binaryString += '0';}

	console.log(binaryString);
	let feedbackCode = parseInt(binaryString, 2);
	if (feedbackCode == 8 && device.hasNoReason) {feedbackCode = 13;}

	return feedbackCode;
}

// temporary function for testing feedback gen
function getDigest() {
	let digest = {};
	let digest_content = document.getElementsByClassName('digest')[0].getElementsByClassName('modal-body')[0];

	console.log('____________________');
	for (let i = 0, l = trackingList.length; i < l; i++) {
		let device = trackingList[i];
		let code = getFeedbackCode(device);
		feedbackList[code].push(device);
		console.log(device.name + ', status: ' + feedbackStrings[code]);
	}
		// work out whether enough time has elapsed since first successful reset
		// to see reactivations
		let d = new Date;
		let masterFip = sysObjectsByCategory['fip'][0];
		if (masterFip.firstNormalTime) {
			if (d.getTime() - masterFip.firstNormalTime > reactivateTime + reactivateVariance || scenarioInfo[3] == 0) {
				digest.waitedLongEnough = true;
			}
		} else {
			// system was never successfully reset?
		}

		// was the system still in alarm when the scenario ended?
		if (masterFip.status_internal == 'normal') {
			digest.systemNormal = true;
		}


		// were the external bell and warning system for EACH FIP isolated when you left?
		digest.ebOK = true;
		digest.wsOK = true;
		for(let i = 0, l = sysObjectsByCategory['fip'].length; i < l; i++) {
			let thisFip = sysObjectsByCategory['fip'][i];
			if (thisFip.ebIsol && digest.ebOK) {digest.ebOK = false;}
			if (thisFip.wsIsol && digest.wsOK) {digest.wsOK = false;}
		}

		// enumerate 'correctly-handled' devices
		digest.numCorrectlyHandled = feedbackList[15].length;
		if (digest.waitedLongEnough) {
			digest.numCorrectlyHandled += feedbackList[3].length;
		} else {
			digest.numCorrectlyHandledBut = feedbackList[3].length;
		}
		console.log(digest);
		console.log(initialAlarmList.length);

		if (digest.numCorrectlyHandled == initialAlarmList.length) {
			digest.allCorrectlyHandled = true;
		} else if (digest.numCorrectlyHandled + feedbackList[3].length == initialAlarmList.length) {
			digest.allCorrectlyHandledBut = true;
		}

 		// this summary construction should happen elsewhere, using the figures in the digest
		let correctHandlingSummary = document.createElement('p');
		if (digest.numCorrectlyHandled > 0 || digest.numCorrectlyHandledBut > 0) {
			if (digest.allCorrectlyHandled || digest.allCorrectlyHandledBut) {
				correctHandlingSummary.innerHTML = 'You correctly handled all alarms on this system';
				if(digest.allCorrectlyHandledBut) {
					correctHandlingSummary.innerHTML += ', but you could have waited longer to check for reactivations';
				}
				correctHandlingSummary.innerHTML +='.';
			} else {
				if(!digest.numCorrectlyHandledBut) {digest.numCorrectlyHandledBut = 0;}
				let numOK = digest.numCorrectlyHandled + digest.numCorrectlyHandledBut;
				correctHandlingSummary.innerHTML = 'You correctly handled ' + numOK + ' alarm';
				if(numOK > 1) {correctHandlingSummary.innerHTML += 's';}
				correctHandlingSummary.innerHTML += ' of ' + initialAlarmList.length + ' on this system';
				if(digest.numCorrectlyHandledBut > 0) {
					correctHandlingSummary.innerHTML += ', but you could have waited longer to check for reactivation of ';
					if(numOK > 1) {correctHandlingSummary.innerHTML += digest.numCorrectlyHandledBut + ' of those alarms';}
					else {correctHandlingSummary.innerHTML += 'that alarm';}
				}
				correctHandlingSummary.innerHTML += '.';
			}

		} else {
			if(trackingList.length == 0) {
				correctHandlingSummary.innerHTML = 'There were no initial alarms on this system.'
			}	else {
				correctHandlingSummary.innerHTML = 'You handled no alarms correctly.'
			}
		}
		digest_content.appendChild(correctHandlingSummary);

		// next go through all of the alarm codes to itemise each error:
		if (!digest.allCorrectlyHandled || !digest.allCorrectlyHandledBut) {
			let alarmErrorSummary = document.createElement('p');
			alarmErrorSummary.innerHTML = '<h3>Errors</h3>'
			alarmErrorSummary.innerHTML += 'Of ' + initialAlarmList.length + ' alarms:<br>';

			for (let i = 0; i < 16; i++) {
				if(i != 3 && i != 15 && i != 13) {
				let num = feedbackList[i].length;
					if(num > 0) {
						alarmErrorSummary.innerHTML += num;
						if(num == 1) {alarmErrorSummary.innerHTML += ' was ';}
						else {alarmErrorSummary.innerHTML += ' were ';}
						alarmErrorSummary.innerHTML += feedbackStrings[i] + '<br>';
					}
				}
			}


			digest_content.appendChild(alarmErrorSummary);
		}

		if (!digest.systemNormal || !digest.ebOK || !digest.wsOK || feedbackList[13].length > 0) {
			let otherErrorSummary = document.createElement('p');
			otherErrorSummary.innerHTML = '<h3>Other issues</h3>';
			if (!digest.systemNormal) {otherErrorSummary.innerHTML += 'The system was still in alarm when you left.<br>';}
			if (!digest.ebOK) {otherErrorSummary.innerHTML += 'Did you de-isolate all external bells?<br>';}
			if (!digest.wsOK) {otherErrorSummary.innerHTML += 'Some warning systems were left isolated!<br>';}
			if (feedbackList[13].length > 0) {
				otherErrorSummary.innerHTML += 'You isolated ';
				if (feedbackList[13].length == 1) {otherErrorSummary.innerHTML += 'a device, even though it was ';}
				else {otherErrorSummary.innerHTML += feedbackList[13].length + ' devices, even though they were ';}
				otherErrorSummary.innerHTML += 'not activated.'
			}

			digest_content.appendChild(otherErrorSummary);
		}
}


function buildFips() {
	//for each fip in the list of fips...
	let fipList = sysObjectsByCategory['fip'];
	for(let i = 0, l = fipList.length; i < l; i++){
		let f = fipList[i];
		//provide the FIP a representation in the DOM. NB this will not work in IE
		let temp = document.getElementsByClassName('template-panel')[0];
		let clone = temp.content.cloneNode(true);
		viewport.appendChild(clone);

		f.panel = document.getElementsByClassName('panel')[i];
		f.panel.setAttribute('data-index', i);
		// displace sub-FIPs by a small amount in x and z directions
		f.panel.parentNode.style.left = i*15 + 'px';
		f.panel.parentNode.style.zIndex = i;
		if (i == 0) {
			f.panel.getElementsByClassName('closeBox')[0].style = 'display: none';
			f.panel.parentNode.parentNode.classList.add('show');
			if(i == 0){
				f.panel.parentNode.parentNode.style.backgroundImage = 'linear-gradient(to bottom right, black, orange)';
			}
		}
		f.getAlarmTime = function(t){
			let alarmTime = 0;

			if(t >= 0){
				alarmTime = new Date(t);
			} else {
				alarmTime = new Date();
			}

			let alarmString = provideTimeString(alarmTime);
			alarmTime = alarmTime.getTime(); //convert into milliseconds since reference date, for sorting later
			return [alarmTime, alarmString];
		}



		//create the associated blockplan
		//TODO- might be worth creating this as a separate object within the FIP, with own methods etc.
		temp = document.getElementsByClassName('template-blockplan')[0];
		clone = temp.content.cloneNode(true);
		f.panel.parentNode.appendChild(clone);
		f.blockplan = document.getElementsByClassName('blockplan')[i];
		f.blockplan.setAttribute('data-index', i);
		f.blockplan.style.width = f.blockplan_details['dimensions'].x;
		f.blockplan.getElementsByClassName('blockplan-content')[0].style.height = f.blockplan_details['dimensions'].y;


		//now we have a blockplan in the DOM, we can do the other blockplanny stuff, based on the blockplan_details stored with the FIP

		f.currentPage = 0;


		let blockplan_pages = f.blockplan_details['pages'];
		if (blockplan_pages.length < 2) {
			f.blockplan.getElementsByClassName('blockplan-prev')[0].style.display = 'none';
			f.blockplan.getElementsByClassName('blockplan-next')[0].style.display = 'none';
		}

		for (let i = 0, l = blockplan_pages.length; i < l; i++) {
			let temp_page = document.createElement('div');
			temp_page.className = 'blockplan-page';
			let thisPageBg = new Image().src = f.blockplan_details['pages'][i];
			temp_page.style.backgroundImage = 'url(' + thisPageBg + ')';
			if(i == 0){temp_page.classList.add('show');}
			f.blockplan.getElementsByClassName('blockplan-content')[0].appendChild(temp_page);
		}

		f.blockplan_card = f.blockplan.getElementsByClassName('device-container')[0];
		//TODO: find a way to make this stick to the window (and appear at a fixed position within the visible window)
		f.blockplan_card_elements = {
			header:	f.blockplan_card.getElementsByClassName('device-header')[0],
			title: f.blockplan_card.getElementsByClassName('device-type')[0],
			info : f.blockplan_card.getElementsByClassName('device-info')[0],
			image : f.blockplan_card.getElementsByClassName('device-image')[0],
			desc : f.blockplan_card.getElementsByClassName('device-info-desc')[0].getElementsByTagName('span')[0],
			zone : f.blockplan_card.getElementsByClassName('device-info-zone')[0].getElementsByTagName('span')[0],
			num : f.blockplan_card.getElementsByClassName('device-info-zone')[0].getElementsByTagName('span')[1],
			status : f.blockplan_card.getElementsByClassName('device-info-status')[0].getElementsByTagName('span')[0],
			options : f.blockplan_card.getElementsByClassName('device-options')[0],
			MCPOptions : f.blockplan_card.getElementsByClassName('device-options-mcp')[0],

		}

		f.blockplan_card_elements['image'].style.backgroundImage = 'url(' + deviceImageSheet + ')';

		f.incrementPage = function(inc){
			let prevButton = f.blockplan.getElementsByClassName('blockplan-prev')[0];
			let nextButton = f.blockplan.getElementsByClassName('blockplan-next')[0];

			//if increment is possible...
			if(f.currentPage + inc < f.blockplan_details['pages'].length && f.currentPage + inc >= 0){
				//hide current page
				f.blockplan.getElementsByClassName('blockplan-page')[f.currentPage].classList.remove('show');
				//show new page
				f.blockplan.getElementsByClassName('blockplan-page')[f.currentPage + inc].classList.add('show');
				//update currentPage.
				f.currentPage += inc;
				//refresh page number in blockplan footer/page title in header
				let blockplanHeader = f.blockplan.getElementsByClassName('blockplan-header')[0];
				let blockplanTitle = system.name + ' - ' + f.name;
				blockplanHeader.getElementsByClassName('blockplan-title')[0].innerHTML = blockplanTitle;

				f.blockplan.getElementsByClassName('blockplan-footer')[0].innerHTML = 'Page ' + (f.currentPage + 1) + ' of ' + f.blockplan_details['pages'].length;

				//hide device card, if shown
				if(f.blockplan_card.classList.contains('show-flash')){
					f.blockplan_card.classList.toggle('show-flash');
				}

				//if we are at a boundary, disable relevant button
				if(f.currentPage == 0){
					//disable 'prev' button
					prevButton.setAttribute('disabled', 'disabled');
					//if there are more pages, enable the 'next' button
					if(f.blockplan_details['pages'].length > 1){
						nextButton.removeAttribute('disabled');
					} else {
						nextButton.setAttribute('disabled', 'disabled');
					}
				}
				else if(f.currentPage == f.blockplan_details['pages'].length - 1){
					//disable next button
					nextButton.setAttribute('disabled', 'disabled');
					//if there are other pages, enable 'prev' button
					if(f.blockplan_details['pages'].length > 1){
						prevButton.removeAttribute('disabled');
					} else {
						nextButton.setAttribute('disabled', 'disabled');
					}
				} else {
				//if we are not at a boundary, enable both buttons
					nextButton.removeAttribute('disabled');
					nextButton.removeAttribute('disabled');
				}
			}
			//if increment not possible, do nothing!
		}

		f.incrementPage(0);

		f.blockplan.addEventListener('click', function(event){
			let t = event.target;

			if(t.className == 'device-detector' || t.className == 'device-fip'){
				let fipIndex = parseInt(f.blockplan.getAttribute('data-index'));
				let id = parseInt(t.getAttribute('data-index'));
				let device = f.deviceList[id];

				if (device.category == 'fip') {
					if (device.panel.parentNode.parentNode.classList.contains('show')) {
						closeElements(device.panel.parentNode);
					} else {
						device.panel.parentNode.parentNode.classList.toggle('show');
						device.panel.parentNode.style.top = event.pageY + 'px';

					}

				} else	if (device.category == 'det') {
					f.blockplan_displayed_device = device;
					f.updateDeviceImagePath(device);
					if ((device.status_internal == 'active' && (device.status == 'alarm' || device.status == 'acked' ) || (device.parent.category == 'circuit' && !device.parent.addressable && device.parent.status_internal == 'active' && (device.parent.status == 'alarm' || device.parent.status == 'acked')))
					 && !device.hasBeenReset && !device.hasBeenLookedAt){
						device.hasBeenLookedAt = true;
					}

					if(device.type == 'mcp'){
						f.blockplan_card_elements['MCPOptions'].classList.add('show');
						f.blockplan_card_elements['options'].setAttribute('data-fip-index', fipIndex);
						f.blockplan_card_elements['options'].setAttribute('data-device-index', id);
					} else {
						f.blockplan_card_elements['MCPOptions'].classList.remove('show');
					}

					if(!f.blockplan_card.classList.contains('show-flash')){
						f.blockplan_card.classList.toggle('show-flash');
					} else if(f.blockplan_card.classList.contains('show-flash')){

						if(f.blockplan_card_elements['desc'].innerHTML == device.name){
							f.blockplan_card.classList.remove('show-flash');
						} else {
							f.blockplan_card.classList.remove('show-flash');
							void f.blockplan_card.offsetWidth;
							f.blockplan_card.classList.add('show-flash');
						}
					}

					let titleString = '';
					if(device.subtype){
						titleString = subtypes[device.subtype];
					} else if(device.type){
						titleString = types[device.type];
						if(device.category == 'det'){
							titleString += ' Detector';
						}
					}

					f.blockplan_card_elements['title'].innerHTML = titleString;
					if(device.name){
						f.blockplan_card_elements['desc'].innerHTML = device.name;
					}
					if(device.zone){
						f.blockplan_card_elements['zone'].innerHTML = device.zone;
					}
					if(device.num){
						f.blockplan_card_elements['num'].innerHTML = device.num;
					}
					if(device.status_internal){
						f.blockplan_card_elements['status'].innerHTML = deviceStatusStrings[device.status_internal];
					} else {
						f.blockplan_card_elements['status'].innerHTML = 'Unknown';
					}
				}
			}

			if(t.classList.contains('interface-button')){
				if(t.classList.contains('blockplan-next')){
					f.incrementPage(1);
				} else if(t.classList.contains('blockplan-prev')){
					f.incrementPage(-1);
				}
			}

		});

		f.blockplan_card_elements['options'].addEventListener('click', function(event){
			let t = event.target;

			if(t.tagName == 'BUTTON'){
				if(f.blockplan_card_elements['options'].getAttribute('data-fip-index') && f.blockplan_card_elements['options'].getAttribute('data-device-index')){
					let device = sysObjectsByCategory['fip'][parseInt(f.blockplan_card_elements['options'].getAttribute('data-fip-index'))].deviceList[f.blockplan_card_elements['options'].getAttribute('data-device-index')];
					if(device.type == 'mcp'){
						if(t.className == 'device-reset'){
							device.stuck = false;
						} else if(t.className == 'device-activate'){
							if(device.status_internal != 'active'){
								if(!device.hasBeenLookedAt) {device.hasBeenLookedAt = true;}
								device.status_internal = 'active';
								if(device.status != 'isol'){
									device.status = 'alarm';
									device.lastAlarmTime = f.getAlarmTime();
								}
								device.stuck = true;

								f.update();
							}
						}
						f.updateDeviceImagePath(device);
					}
				}
			}
		});

	//create a deviceList by scouring its child circuits for details (desc, type, subtype, loop, zone)

		f.deviceList = [];
		let currentDeviceIndex = 0;
		for(let j = 0, m = f.children.length; j < m; j++){
			let child = f.children[j];
			if(child.category == 'circuit'){
				child.status = 'normal';
				child.status_internal = 'normal';
				child.lastAlarmTime = getAlarmTime(0);
				child.reset = true;
				//do some deeper digging. All devices should be on a circuit, not directly 'plugged into' the fip.
				for(let k = 0, n = child.children.length; k < n; k++){
					let device = child.children[k];
					//transcribe some of the information to the deviceList for this FIP

						device.page = child.page;

						device.num = k + 1;
						device.status_internal = 'normal';
						device.status = 'normal';
						device.stuck = false;

						device.lastAlarmTime = f.getAlarmTime(60000*k);


					//provide the device with a representation in the DOM - in this case, a button/div in the blockplan
					let temp = document.createElement('div');
					if(device.category != 'fip') {
						temp.classList.add('device-detector');
						temp.style.width = f.blockplan_details['detector_dimensions'].x;
						temp.style.height = f.blockplan_details['detector_dimensions'].y;
					} else if(device.category == 'fip') {
						temp.style.width = f.blockplan_details['fip_dimensions'].x;
						temp.style.height = f.blockplan_details['fip_dimensions'].y;
						temp.classList.add('device-fip');
					} //TODO: add conditional here, to handle FIPs on the blockplan
					//needs data-index - this is the same as the device's position in the FIP's deviceList
					temp.setAttribute('data-index', currentDeviceIndex);
					currentDeviceIndex++;
					//needs position
					temp.style.left = device.pos.x;
					temp.style.top = device.pos.y;


					let page = f.blockplan.getElementsByClassName('blockplan-page')[device.page - 1];
					page.appendChild(temp);

					// assign random device image from available images of appropriate type...
					device.imageVersion = Math.floor(deviceImageVersions[device.type]*Math.random());
					if (device.imageVersion == deviceImageVersions[device.type]) {
						device.imageVersion = device.imageVersion - 1;
					}

					if (!device.concealed) {
					device.imageCoords = {x: deviceImageIndex[device.type], y: device.imageVersion};
					} else {
						device.imageCoords = {x: deviceImageIndex['concealed'], y: device.imageVersion};
					}



					f.deviceList.push(device);
				}
			}
		}


	//create the addressableDeviceList - the ones accessible via the FIP
		f.addressableDeviceList = [];

		for(let i = 0, l = f.deviceList.length; i < l; i++){
			//get device i
			let device = f.deviceList[i];
			//determine if the circuit it's on is addressable
			if(device.parent.addressable){
			////if so, push device i to this list
			////if not, work out if the relevant circuit is already on the list
			//////if not, add the circuit to the list (complete with whatever properties are needed)
				f.addressableDeviceList.push(device);
			} else {
				//could have used .includes(device.parent), but IE11...
				let checkIfPresent = function(circuit){
					if(circuit == device.parent){
						return circuit;
					}
				};
				let check = f.addressableDeviceList.filter(checkIfPresent);
				if(check.length == 0){
					f.addressableDeviceList.push(device.parent);
				}
			}
		}
		//work out if all of the devices on the addressableDeviceList are circuits, regular devices, or some kombo
		let circuitCount = 0;
		for(let i = 0, l = f.addressableDeviceList.length; i < l; i++){
			if(f.addressableDeviceList[i].category == 'circuit'){
				circuitCount++;
			}
		}
		if(circuitCount == f.addressableDeviceList.length){
			f.conventional = true;
		} else if(circuitCount == 0){
			f.conventional = false;
		} else {
			f.conventional = 'mixed';
		}





	//initialise some fip variables useful for its correct operation.
		f.status = 'normal';
		f.alarmCount = 0;
		f.ackedCount = 0;
		f.isolCount = 0;

		f.currentIndex = 0;

		f.alarmText = 'Alarm: ';
		f.ackText = 'Acknowledged alarm: ';
		f.isoText = 'Isolated: ';
		f.statusStrings = {alarm: 'ALARM', acked: 'ALARM(Acknowledged)', isol: 'ISOLATED', normal: 'NORMAL'};

		f.lastPressed =  'reset';
		f.confirmState = 'none'; //options are: none, single, multi, isol
		f.mainStatus = 'true'; //display main status screen
		f.isol_norm = 'false'; //scroll through 'normal' devices while there are 'isol' devices to display?

		f.ebActive = false;
		f.ebIsol = false;
		f.wsActive = false;
		f.wsIsol = false;

		f.sortedDeviceList = [];

		//give the FIP all of the functions it needs to survive as a fip.

		f.update = function() {
			//this updates all things to do with the FIP
			this.assignStatusIds();
			this.displayStatus();
			this.updateDeviceCard();

		}

		f.updateDeviceCard = function() {
			//update the info in the cards, according to device status

			if(this.blockplan_displayed_device){
				let device = this.blockplan_displayed_device;
				if(device.status_internal){
					this.blockplan_card_elements['status'].innerHTML = deviceStatusStrings[device.status_internal];
				} else {
					this.blockplan_card_elements['status'].innerHTML = 'Unknown';
				}
				//update the images displayed in the cards, according to device status
					this.updateDeviceImagePath(device);
			}
		}

		f.assignStatusIds = function() {


			let list = this.addressableDeviceList;

			//go through list of devices.
			//if in alarm, assign an alarmID
			//if in alarm, but acknowledged, assign an ackID
			//if isolated, assign isoID
			//count how many are in alarm, how many acked, how many isolated
			//...if not addressable, each zone counts as a single device?
			//..the circuit must also have a status, which is only visible at the FIP if the circuit is not addressable
			//..if the device is a circuit, it's not addressable by virtue of the fact this is the only way a circuit can make it on to the list of addressable devices.
			//..if a circuit (i.e. category is circuit) and has children (all circuits should) and is not already in alarm, acked, or isol
			// --- loop through devices on the circuit until an alarm is found or there are no more devices
			// --- if an alarm is found, set the 'device' (circuit) status to alarm.
			// --- if no alarm is found, set the 'device' (circuit) status to normal.
			// --- for now, don't bother handling situations where single devices on such a circuit are isolated - this isn't usually possible
			// --- there may be a case for it if a sub-fip has isolates on its network -> it may pass this to the main FIP somehow

			// TODO - in general, there needs to be some kind of function that checks the
			// activation status of each device. Then, depending on the FIP's impressions
			// of each device (isol, alarm, normal, etc) do something...

			this.alarmCount = 0;
			this.ackedCount = 0;
			this.isolCount = 0;


			//TODO - have to make better use of lastAlarmTimes
			// -- alarms should display in chronological order of activation (starting with first alarm)
			// -- zone alarm should always capture the oldest of these alarms as its 'last Alarm Time' until a reset is attempted - then pick up the oldest of the reactivated alarms (will likely be in list order at this point).
			// -- all other display order should be in list order though

			for(let i = 0, l = list.length; i < l; i++){
				let device = list[i];
				//check to see if the device is a circuit (non-addressable) and not already in alarm, acked or isolated, check to see if any of its children are alarmed
				if(device.category == 'circuit' && device.children && device.status == 'normal'){
					device.status_internal = 'normal';
					for (let j = 0, m = device.children.length; j < m; j++) {
						let thisChild = device.children[j];
						if (thisChild.status_internal == 'active'){
							let d = new Date();
							if (device.lastAlarmTime[0] < d.getTime() - alarmRecencyThreshold) {
								device.lastAlarmTime = thisChild.lastAlarmTime;
							} else if (device.reset) {
								device.lastAlarmTime = thisChild.lastAlarmTime;
								device.reset = false;
							} else if (device.lastAlarmTime[0] > thisChild.lastAlarmTime[0]) {
								device.lastAlarmTime = thisChild.lastAlarmTime;
							}
							device.status = 'alarm';
							device.status_internal = 'active';
						}
					}
				}


				if(device.status == 'isol'){
						this.isolCount ++;
						device.isolID = this.isolCount;
						device.alarmID = -1;
						device.ackedID = -1;
				}

			}

			this.sortedDeviceList = sortByAlarmTime(list);

			for(let i = 0, l = f.sortedDeviceList.length; i < l; i++){
					let device = f.sortedDeviceList[i];
					switch(device.status){
						case 'alarm':
						this.alarmCount ++;
						device.alarmID = this.alarmCount;
						break;

					case 'acked':
						this.alarmCount ++;
						this.ackedCount ++;
						device.alarmID = this.alarmCount;
						device.ackedID = this.ackedCount;
						break;

					case 'isol':
					break;


					default:
						device.alarmID = -1;
						device.ackedID = -1;
						device.isolID = -1;
					break;
				}
			}
			//handling statuses: this.status is what's checked by any upstream FIPs. actually, just set activated and stuck
			//TODO: think about what to do if this input is isolated at the upstream FIP - will the applied status conflict with this in some way?

				if(this.alarmCount > 0){
					this.status_internal = 'active';
					this.stuck = true;
					this.mainStatus = false;
				} else if(this.ackedCount > 0){
					this.status_internal = 'active';
					this.stuck = true;
					this.mainStatus = false;
				} else {
						if(this.status_internal != 'normal') {
						this.status_internal = 'normal';
						this.stuck = false;
						if(!this.firstNormalTime) {
							let d = new Date();
							this.firstNormalTime = d.getTime();
							console.log(this.firstNormalTime);
						}
					}
				}
			if(this.status != 'isol'){
				if (this.status_internal == 'active'){
					if(this.status != 'alarm' && this.status != 'acked'){
						this.status = 'alarm';
						this.lastAlarmTime = this.getAlarmTime();
					}
				}
			}

			//handling states of annunciators:
			if(this.alarmCount > 0 && this.alarmCount > this.ackedCount){
				if(this.annunAlarm.classList.contains('unlit')){this.annunAlarm.classList.toggle('unlit')};
				if(!this.annunAlarm.classList.contains('flashing')){this.annunAlarm.classList.toggle('flashing')};

			//TODO - incorporate a 'multiple alarms' light in between PREV and NEXT buttons
				//alarms exist that haven't been acknowledged. Flash the ALARM annunciator
			} else if(this.alarmCount > 0 && this.ackedCount == this.alarmCount){
				if(this.annunAlarm.classList.contains('unlit')){this.annunAlarm.classList.toggle('unlit')};
				if(this.annunAlarm.classList.contains('flashing')){this.annunAlarm.classList.toggle('flashing')};
				//all alarms have been acknowledged. Make the ALARM annunciator solid
			} else if(this.alarmCount == 0) {
				if(!this.annunAlarm.classList.contains('unlit')){this.annunAlarm.classList.toggle('unlit')};
				if(this.annunAlarm.classList.contains('flashing')){this.annunAlarm.classList.toggle('flashing')};
				//no alarms are active. Turn ALARM annunciator off
			}

			if(this.isolCount > 0){
				if(this.annunIsol.classList.contains('unlit')){this.annunIsol.classList.toggle('unlit')};
				//isolates exist. Turn the ISOLATION annunciator on
			} else {
				if(!this.annunIsol.classList.contains('unlit')){this.annunIsol.classList.toggle('unlit')};
				//no isolates exist. Turn the ISOLATION annunciator off
			}

			if(this.alarmCount > 0){



				if(!this.ebActive){
					this.ebActive = true;
					this.wsActive = true;
				}

				if(!this.ebIsol){
					//remove unlit class from extBell span, add flashing class
					if(this.extBell.classList.contains('unlit')){this.extBell.classList.toggle('unlit')};
					if(!this.extBell.classList.contains('flashing')){this.extBell.classList.toggle('flashing')};

				} else {
					//if not already unlit, add this class and remove flashing class
					if(!this.extBell.classList.contains('unlit')){this.extBell.classList.toggle('unlit')};
					if(this.extBell.classList.contains('flashing')){this.extBell.classList.toggle('flashing')};
				}

				if(!this.wsIsol){
					//remove unlit class from extBell span, add flashing class
					if(this.warnSys.classList.contains('unlit')){this.warnSys.classList.toggle('unlit')};
					if(!this.warnSys.classList.contains('flashing')){this.warnSys.classList.toggle('flashing')};

				} else {
					//if not already unlit, add this class and remove flashing class
					if(!this.warnSys.classList.contains('unlit')){this.warnSys.classList.toggle('unlit')};
					if(this.warnSys.classList.contains('flashing')){this.warnSys.classList.toggle('flashing')};
				}

			} else {
				this.ebActive = false;
				if(!this.extBell.classList.contains('unlit')){this.extBell.classList.toggle('unlit')};
				if(this.extBell.classList.contains('flashing')){this.extBell.classList.toggle('flashing')};

				this.wsActive = false;
				if(!this.warnSys.classList.contains('unlit')){this.warnSys.classList.toggle('unlit')};
				if(this.warnSys.classList.contains('flashing')){this.warnSys.classList.toggle('flashing')};
			}


			//TODO: refactor the conditional toggling of classes into a toggleClass function (args are the element, and the className)
			//TODO: put this repeated stuff into a function used to activate/deactivate auxiliary systems
		};


	f.displayStatus = function() {
		let list = this.addressableDeviceList;
		//access the FIP's list
		//work out if anything is still in alarm
		if(this.alarmCount > 0){
				this.findNextOrPrev('alarm');
		} else if (this.isolCount > 0) {
			if(this.mainStatus){
				this.displayMainStatus('isol');
			} else if(!this.isol_norm){
				this.findNextOrPrev('isol');
			} else {
				this.findNextOrPrev('normal');
			}
		} else {
			if(this.mainStatus){
				this.displayMainStatus('normal');
			} else {
				this.findNextOrPrev('normal');
			}
		}

	};

	f.displayMainStatus = function(fipStatus){
			let d = new Date();
			this.descLine.innerHTML = 'FirePanel 3000';
			this.typeLine.innerHTML = provideTimeString(d);
			this.displayLines[1].innerHTML = 'Serviced by the good people at Stn 33';
			this.displayLines[2].innerHTML = 'Ph: 0444 444444';
			this.displayLines[3].innerHTML = 'System ' + this.statusStrings[fipStatus];
	};



	f.findNext = function(status){
		let list = this.addressableDeviceList;

		if(status == 'alarm'){
			list = this.sortedDeviceList;
		}
		for(let i = this.currentIndex, l = list.length; i < l + 1; i++){
			if(i < l){

				if(list[i].status == status || (status == 'alarm' && list[i].status == 'acked')){
					let device = list[i];
					//display this alarm
					this.currentIndex = i;
					this.displayAlarm(device);
					break;
				}
			} else {
				//we have scrolled past the last alarm. Set flag to display status screen instead.
				if(this.alarmCount == 0 && this.ackedCount == 0){
					if(this.isolCount == 0 || (this.isolCount > 0 && this.isol_norm)){
						this.mainStatus = true;
						this.isol_norm = false;
					} else if (this.isolCount > 0 && !this.isol_norm){
						this.isol_norm = true;
					}
					this.currentIndex = 0;
					this.displayStatus();
					break;
				} else {
					i = 0;
					this.currentIndex = 0;
					this.displayStatus();
					break;
				}
			}
		}
	};



	f.findPrev = function(status){
		let list = this.addressableDeviceList;

		//produce separate list of devices, sorted in order of lastActivationTime (earliest to latest);


		if(status == 'alarm'){
			list = this.sortedDeviceList;
		}


		for(let i = this.currentIndex, l = list.length; i >= -1; i--){
			if(i >= 0){
				if(list[i].status == status || (status == 'alarm' && list[i].status == 'acked')){
					let device = list[i];
					//display this device
					this.currentIndex = i;
					this.displayAlarm(device);
					break;
				}
			} else {
				if(this.alarmCount == 0 && this.ackedCount == 0){
					//we have scrolled past the first device. Set flags to display status screen instead
					if(this.isolCount == 0){
						this.mainStatus = true;
						this.isol_norm = false;
					} else if (this.isolCount > 0 && !this.isol_norm){
						this.mainStatus = true;
						this.isol_norm = true;
					} else if (this.isolCount > 0 && this.isol_norm){
						this.isol_norm = false;
					}
					this.currentIndex = l - 1;
					this.displayStatus();
					break;
				} else {
					i = l - 1;
					this.currentIndex = l - 1;
					this.displayStatus();
					break;
				}
			}
		}

	};

	f.findNextOrPrev = function(status){
		if(this.lastPressed == 'prev'){
			this.findPrev(status);
		} else {
			this.findNext(status);
		}
	};

	f.switchIsolNormal = function(){
		if(this.isolCount == 0 || (this.isolCount > 0 && this.isol_norm)){
						this.mainStatus = true;
						this.isol_norm = false;
					} else if (this.isolCount > 0 && !this.isol_norm){
						this.isol_norm = true;
					}
	}



	f.displayAlarm = function(device){
		//clear display
		this.descLine.innerHTML = '';
		this.typeLine.innerHTML = '';
		for(let i = 1, l = this.displayLines.length; i < l; i++){
			this.displayLines[i].innerHTML = '';
		}


		//display this alarm
		this.descLine.innerHTML += device.name;
		if(device.category != 'circuit'){
			this.typeLine.innerHTML += types[device.type];
			this.displayLines[1].innerHTML = 'L'+ device.loop + '  S' + device.num + '  Z' + device.zone;
		}
		this.displayLines[1].innerHTML +=' Status: ' + this.statusStrings[device.status];
		this.displayLines[2].innerHTML = 'Last alarm: ' + device.lastAlarmTime[1];
		if(this.confirmState == 'none'){
			//display this alarm's number
			//display how many other alarms there are, or, if some have been acknowledged, display this number
			if(this.ackedCount > 0){
				this.displayLines[3].innerHTML = 'Acked alarms ' + this.ackedCount + ' of ' + this.alarmCount;
			} else if (this.alarmCount > 0){
				switch(this.conventional){
					case true :
						this.displayLines[3].innerHTML = 'Zone alarm ';
						break;

					case false :
						this.displayLines[3].innerHTML = 'Sensor alarm ';
						break;

					default :
						this.displayLines[3].innerHTML = 'Alarm ';
						break;
				}

				this.displayLines[3].innerHTML += device.alarmID + ' of ' + this.alarmCount;
			} else if (this.isolCount > 0 && !this.isol_norm){
				this.displayLines[3].innerHTML = 'Isolate ' + device.isolID + ' of ' + this.isolCount;
			} else {
				switch(this.conventional){
					case true :
						this.displayLines[3].innerHTML = 'Zone ';
						break;

					case false :
						this.displayLines[3].innerHTML = 'Device ';
						break;

					default :
						this.displayLines[3].innerHTML = 'Input ';
						break;
				}
				this.displayLines[3].innerHTML += (this.currentIndex + 1) + ' of ' + this.addressableDeviceList.length;
			}
		} else {
			switch(this.confirmState){
				case 'single' :
					this.displayLines[3].innerHTML = 'Press ACKNOWLEDGE to confirm reset of this alarm :-)';
					break;

				case 'multi' :
					this.displayLines[3].innerHTML = 'Press ACKNOWLEDGE to confirm reset of acknowledged alarm';
					if(this.ackedCount > 1){this.displayLines[3].innerHTML += 's';}
					this.displayLines[3].innerHTML += ' :-)';

					break;

				case 'isol' :
					this.displayLines[3].innerHTML = 'Press ACKNOWLEDGE to confirm isolation of this ';
					if(device.category == 'circuit'){this.displayLines[3].innerHTML += 'circuit :-)';} else {this.displayLines[3].innerHTML += 'device :-)';}
					break;

			}

		}

	};

	f.incrementList = function(increment){
		//assumes increments won't be bigger than the deviceList's length
		let inc = Math.round(increment);
		let list = this.addressableDeviceList;
		let idx = this.currentIndex;
		idx += inc;
		if(idx < -1){
			idx += (list.length + 1);
			idx = idx%(list.length + 1);
		} else {
			idx = idx%(list.length + 1);
		}
		this.currentIndex = idx;

		this.displayStatus();
	};

	f.handleAcknowledged = function(){
		if(!this.mainStatus){
			let list = this.addressableDeviceList;
			if(this.status_internal == 'active'){list = this.sortedDeviceList;}
			let device = list[this.currentIndex]; //grab the currently viewed device
			if(this.confirmState == 'none'){
				//if the device is alarmed, and not already acknowledged, then do some stuff that moves only an active alarm to the acknowledged list
				if(device.status == 'alarm'){
					//change status to 'acknowledged'
					device.status ='acked';
					this.update();
					//once we have acknowledged the last alarm, set the ALARM light to solid, rather than flashing
				}
			} else {
			//otherwise, check if we're in a state where the system is waiting for the user to acknowledge something (e.g. reset instruction)
			//then, execute whatever thing it is that the user is trying to do.
				switch(this.confirmState){
					case 'single':
						//attempt to reset the device, and then the FIP. Failure will only happen if the device is flagged 'stuck' for some reason
						this.resetDevice(device);
						break;

					case 'multi':
						//attempt to reset all acknowledged devices, and then the FIP.
						for(let i = 0, l = list.length; i < l; i++){
							if(list[i].status == 'acked'){
								this.resetDevice(list[i]);
							}
						}
						break;

					case 'isol':
						//isolate the device
						this.isolateDevice(device);
						break;
				}
				//return confirmState to 'none'
				this.confirmState = 'none';
				//return system to normal and see what happens
				this.assignStatusIds();
				//anything still in alarm gets its 'last alarm' date updated
				for(let i = 0, l = list.length; i < l; i++){
					if(list[i].status == 'alarm'){
						//is this already being done elsewhere?
					}
				}
				if(this.alarmCount == 0 && this.ackedCount == 0){
					this.mainStatus = true;
				}
				this.update();
			}
		}
	};

	f.handleIsolate = function(){
		if(this.confirmState == 'none' && this.addressableDeviceList[this.currentIndex].status != 'isol' &&!this.mainStatus){
			//put system in state where it's waiting for the user to confirm the isolation.
			this.confirmState = 'isol';
		} else if(this.confirmState == 'single' || this.confirmState == 'multi' || this.confirmState == 'isol'){
			//go back
			this.confirmState = 'none';
		}
		this.displayStatus();
	};

	f.isolateDevice = function(device){
		device.status = 'isol';
		if (!device.hasBeenIsolated) {device.hasBeenIsolated = true;}
		// if not already being tracked, please add it to the tracking list
		// if it's added to the tracking list, flag this too: lateAddition or freakIsolation
		// in other words, the end dialogue will ask why the user isolated this device.
		let checkIfPresent = function(d){
			if(d == device){
				return d;
			}
		};
		let check = trackingList.filter(checkIfPresent);
		if(check.length == 0){
			device.hasNoReason = true;
			trackingList.push(device);
		}
	};

	f.resetDevice = function(device){
		//try to remove alarm status from a device (i.e. set status to 'normal')
		//this will fail if the device has 'stuck' set to true

		if(device.category == 'circuit'){
			for(let i = 0, l = device.children.length; i < l; i++){
				f.resetDevice(device.children[i]);
			}
			device.reset = true;
		}
		let d = new Date();
		device.lastResetTime = d.getTime();
		if (!device.hasBeenReset) {device.hasBeenReset = true;}
		if ((device.type != 'mcp' || (device.type == 'mcp' && !device.stuck)) && (device.status == 'alarm' || device.status == 'acked')) {
			device.status = 'normal';
			device.status_internal = 'normal';
		} else if (device.stuck && (device.status == 'alarm' || device.status == 'acked') && device.type == 'mcp') {
			device.status = 'alarm';
			device.status_internal = 'active';
			device.lastAlarmTime = f.getAlarmTime();
			if (!device.hasReactivated) {device.hasReactivated = true;}
			// if this device is on a conventional circuit, push the hasReactivated to the circuit, too
			if (device.parent.category == 'circuit' && !device.parent.addressable && !device.parent.hasReactivated) {
				device.parent.hasReactivated = true;
			}


		}
	};

	f.handleReset = function(){
		if(this.confirmState == 'none' && !this.mainStatus){

			//if there are acknowledged alarms, attempt to reset these to normal
			if(this.ackedCount > 0){
				this.confirmState = 'multi';
			}

			else if(this.sortedDeviceList[this.currentIndex].status == 'alarm'){
				this.confirmState = 'single';
			}

		} else if(this.confirmState == 'single' || this.confirmState == 'multi' || this.confirmState == 'isol'){
			//go back
			this.confirmState = 'none';
		}
		this.displayStatus();
		//if there are no acknowledged alarms, attempt to reset the currently displayed alarm (temporarily give it 'acknowledged status'?)
		//in either case, prompt user for acknowledgement...

		//also, successful reset should prevent additional alarms being sent upstream (i.e. Sub FIP --> Main FIP)
	};

	f.handleEbIsol = function(){
			this.ebIsol = !this.ebIsol;
			this.ebIsolLamp.classList.toggle('unlit');
			this.update();
	};

	f.handleWsIsol = function(){
		this.wsIsol = !this.wsIsol;
		this.wsIsolLamp.classList.toggle('unlit');
		this.update()
	};

	f.updateDeviceImagePath = function(device) {
		let coords;

		if (device.status_internal == 'active') {
			// store current coordinates of the spritesheet for this detector
			// then when displaying the detector, shift the image to these coords.
			if(device.type == 'mcp' && device.stuck) {
				coords =  [(device.imageCoords['x'] + 2)*deviceImageSize[0], device.imageCoords['y']*deviceImageSize[1]];
			} else {
				coords =  [(device.imageCoords['x'] + 1)*deviceImageSize[0], device.imageCoords['y']*deviceImageSize[1]];
			}
		} else {
			coords =  [(device.imageCoords['x'])*deviceImageSize[0], device.imageCoords['y']*deviceImageSize[1]];
		}

		f.blockplan_card_elements['image'].style.backgroundPosition = -1*coords[0] + 'px ' + -1*coords[1] + 'px';


	};

	f.display = f.panel.getElementsByClassName('panel-display-content')[0];
	f.displayLines = f.display.getElementsByClassName('display-line');
	f.descLine = f.displayLines[0].getElementsByClassName('left-info')[0];
	f.typeLine = f.displayLines[0].getElementsByClassName('right-info')[0];

	f.panel_controls = f.panel.getElementsByClassName('panel-controls')[0];
	f.ebIsolButton = f.panel_controls.getElementsByTagName('BUTTON')[0];
	f.ebIsolLamp = f.ebIsolButton.getElementsByClassName('lamp')[0];
	f.wsIsolButton = f.panel_controls.getElementsByTagName('BUTTON')[1];
	f.wsIsolLamp = f.wsIsolButton.getElementsByClassName('lamp')[0];
	f.prevButton = f.panel_controls.getElementsByTagName('BUTTON')[2];
	f.nextButton = f.panel_controls.getElementsByTagName('BUTTON')[3];
	f.ackButton = f.panel_controls.getElementsByTagName('BUTTON')[4];
	f.resetButton = f.panel_controls.getElementsByTagName('BUTTON')[5];
	f.isolButton = f.panel_controls.getElementsByTagName('BUTTON')[6];

	f.annuns = f.panel.getElementsByClassName('panel-annunciators')[0].getElementsByClassName('lamp');
	f.annunAlarm = f.annuns[0];
	f.annunIsol = f.annuns[1];
	f.annunFault = f.annuns[2];

	f.extBell = f.panel.getElementsByClassName('extBell')[0];
	f.warnSys = f.panel.getElementsByClassName('warnSys')[0];
	f.blockplanView = f.panel.getElementsByClassName('blockplan-view')[0];
	//EVENT LISTENERS
	f.panel.addEventListener('click', function(event){
		let t = event.target;
		if(t == f.ebIsolButton){f.handleEbIsol();}
		if(t == f.wsIsolButton){f.handleWsIsol();}
		if(t == f.prevButton && f.confirmState == 'none'){
			f.lastPressed = 'prev';
			if(f.mainStatus){
				f.mainStatus = false;
				f.isol_norm = true;
				f.incrementList(0);
			} else {
				f.incrementList(-1);
			}
		}
		if(t == f.nextButton && f.confirmState == 'none'){
			f.lastPressed = 'next';
			if(f.mainStatus){
				f.mainStatus = false;
				f.isol_norm = false;
				f.currentIndex = 0;
				f.incrementList(0);
			} else {
				f.incrementList(1);
			}
		}
		if(t == f.ackButton){f.lastPressed = 'ack'; f.handleAcknowledged();}
		if(t == f.resetButton){f.lastPressed = 'reset'; f.handleReset();}
		if(t == f.isolButton){f.lastPressed = 'isol'; f.handleIsolate();}
		if(t == f.blockplanView) {
			if (f.blockplan.classList.contains('show')){
				closeElements(f.blockplan);
			} else {
				f.blockplan.classList.toggle('show');
				f.blockplan.scrollIntoView({behavior: 'smooth'});
			}
		}
	});

	}
}


function createSystemObjects(node, parent){
	let o = {};
	if(parent){o.parent = parent};
	//establish identifiers
	if(node.name){o.name = node.name;}




	if(node.blockplan_details){
		//this is the bit where we gather the blockplan details and dump them in the object.
		//it may suffice just to plop the blockplan entry from the sysfile here

		o.blockplan_details = node.blockplan_details;

	}

	if(node.loop){
		o.loop = node.loop;
	}

	if(node.category){
		o.category = node.category;
		//also add this object to the global list of similar objects
		if(sysObjectsByCategory[o.category]){
			sysObjectsByCategory[o.category].push(o);
		}
	}

	if(node.type){
		o.type = node.type;
	}

	if(node.subtype){
		o.subtype = node.subtype;
	} else if(node.type){
		o.subtype = node.type;
	}

	if(node.zone){
		//if parent object has a zone and is a circuit, then take same zone as parent
		//if there's no parent, well, what can you do?
		if(parent && parent.category == 'fip'){
			o.zone = node.zone;
		}
	} else if (parent && parent.category == 'circuit' && parent.zone){
		o.zone = parent.zone;
		o.loop = parent.loop;
	}

	if(node.addressable){o.addressable = node.addressable;}
	if(node.pos){o.pos = node.pos;}
	if(node.concealed){o.concealed = true;} else {o.concealed = false;}
	if(node.page_number){o.page = node.page_number;}


	//place in a list of objects and assign a reference id
	o.sysObsId = sysObjects.length;
	sysObjects.push(o);

	//if there are children on the node, create an empty list of children on the object
	//then begin populating this list by recursion on this function with o as 'parent'
	if(node.children){
		o.children = [];
	//do recursion
		for(let i = 0, l = node.children.length; i < l; i++){
			createSystemObjects(node.children[i], o);
		}
	}

	//also make sure that this ends up on its parent's list of children!
	if(parent && parent.children){
		parent.children.push(o);
	}



}


//Gather all things of the same ZONE NAME and plop in a list
//for each object in the systemObjects
// - does it have a zone name?
// - if so, has this zone name been encountered yet?
// 		- if not, create an entry in a 'zones' list, ie zones.thiszonename: [];
// 		- then add itself to this list
//		-if so, then add itself to the list with that property name

//NOTE: these might end up residing with the FIPs themselves (no need for global scope)
//the only list of things available globally will be the list of FIPs

function buildZoneLists(){
	for(let i = 0, l = sysObjects.length; i < l; i++){
		let o = sysObjects[i];

		if(o.zone){
			if(zones[o.zone]){
				zones[o.zone].push(o);
			} else {
				zones[o.zone] = [];
				zones[o.zone].push(o);
			}
		}
	}
}
