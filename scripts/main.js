//main.js - main program code

let versionDiv = document.getElementById('version');
versionDiv.innerHTML = 'Version ' + thisVersion;

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

	let feedbackCode = parseInt(binaryString, 2);
	if (feedbackCode == 8 && device.hasNoReason) {feedbackCode = 13;}

	return feedbackCode;
}

// gather feedback info and produce a summary for user
function getDigest() {
	let digest = {};
	let digest_content = document.getElementsByClassName('digest')[0].getElementsByClassName('modal-body')[0];

	for (let i = 0, l = trackingList.length; i < l; i++) {
		let device = trackingList[i];
		let code = getFeedbackCode(device);
		feedbackList[code].push(device);
	}
		// work out whether enough time has elapsed since first successful reset
		// to see reactivations
		let d = new Date;
		let masterFip = sysObjectsByCategory['fip'][0];
		if (masterFip.firstNormalTime) {
			if (d.getTime() - masterFip.firstNormalTime > reactivateTime + reactivateVariance || scenarioInfo[3] == 0 || scenarioInfo[1] == 0 && initialAlarmList[0].hasReactivated) {
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
		if (!digest.allCorrectlyHandled && !digest.allCorrectlyHandledBut) {
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

function createSystemObjects(node, parent){
	let o = {};
	if(parent){o.parent = parent};
	//establish identifiers
	if(node.name){o.name = node.name;}

	if(node.message){o.message = node.message};
	if(node.contact){o.contact = node.contact};
	if(node.colour){o.colour = node.colour};


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
