//main.js - main program code


//TODO: build start screen interface around this - option to launch with random alarm
//TODO: have some kind of 'end scenario' button where it checks the state of the system and what you looked at (e.g. did you open the block plan? did you inspect the nominated detector / zone?, did you leave the external bell and warning system isolated?)

//GLOBALS

const viewport = document.getElementsByClassName('viewport')[0];

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


const deviceImages = {
	smoke: [['pe_01_N.png','pe_01_A.png']],
	thermal: [['pe_01_N.png','pe_01_A.png']],
	mcp: [['mcp_01_N.png', 'mcp_01_A.png','mcp_01_AS.png']],
	concealed: [['conc_01_N.png','conc_01_A.png']]
};

const deviceStatusStrings = {
	active: 'Activated',
	normal: 'Normal'
};



let sysObjects = [];
let sysObjectsByCategory = {
	fip: [],
	circuit: [],
	det: []
};


let fips = [];
let circuits = [];
let dets = [];
let zones = {};


//General Utility Functions
//modify a value if it exceeds limits
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

//build a system from the jsonny madness
//create objects for each entry
//add these objects to a global object list
//add objects to lists by type
//sort out parents and children of these objects
//also produce a separate list of zones (administrative, as opposed to circuitry)


//TEMPORARY - attaching event listeners to test blockplan
let myBlockplan = viewport.getElementsByClassName('blockplan')[0];
let myCard = myBlockplan.getElementsByClassName('device-container')[0];
let myCardHeader = myCard.getElementsByClassName('device-header')[0];
let myCardContent = myCard.getElementsByClassName('device-info')[0];
let myCardImage = myCard.getElementsByClassName('device-image')[0];
let myCardDesc = myCardContent.getElementsByClassName('device-info-desc')[0].getElementsByTagName('span')[0];
let myCardZone = myCardContent.getElementsByClassName('device-info-zone')[0].getElementsByTagName('span')[0];
let myCardNum = myCardContent.getElementsByClassName('device-info-zone')[0].getElementsByTagName('span')[1];
let myCardStatus = myCardContent.getElementsByClassName('device-info-status')[0].getElementsByTagName('span')[0];
let myCardOptions = myCard.getElementsByClassName('device-options')[0];
let myCardMCPOptions = myCard.getElementsByClassName('device-options-mcp')[0];



//OK, on with the show...

buildSystem(system);
buildZoneLists();
console.log(sysObjects);

console.log(zones);
buildFips();
console.log(sysObjectsByCategory);




myBlockplan.addEventListener('click', function(event){
let t = event.target;
if(t.className == 'device-detector'){
	let thisFipIndex = parseInt(myBlockplan.getAttribute('data-index'));
	let thisFip = sysObjectsByCategory['fip'][thisFipIndex];
	let id = parseInt(t.getAttribute('data-index'));
	let thisDevice = thisFip.deviceList[id];
	thisFip.updateDeviceImagePath(thisDevice);
	
	if(thisDevice.type == 'mcp'){
		myCardMCPOptions.classList.add('show');
		myCardOptions.setAttribute('data-fip-index', thisFipIndex);
		myCardOptions.setAttribute('data-device-index', id);
	} else {
		myCardMCPOptions.classList.remove('show');
	}
	
	if(!myCard.classList.contains('show-flash')){
		myCard.classList.toggle('show-flash');		
	} else if(myCard.classList.contains('show-flash')){

		if(myCardDesc.innerHTML == thisDevice.desc){
			myCard.classList.remove('show-flash');
		} else {
			myCard.classList.remove('show-flash');
			void myCard.offsetWidth;
			myCard.classList.add('show-flash');
			
		}
		
	}
	
	
	
	let titleString = '';
	if(thisDevice.subtype){
		titleString = subtypes[thisDevice.subtype];
	} else if(thisDevice.type){
		titleString = types[thisDevice.type];
		if(thisDevice.category == 'det'){
			titleString += ' Detector';
		}
	}
	
	
	myCardHeader.innerHTML = titleString;
	
	if(thisDevice.desc){
		myCardDesc.innerHTML = thisDevice.desc;
	}
	
	if(thisDevice.zone){
		myCardZone.innerHTML = thisDevice.zone;
	}
	
	if(thisDevice.num){
		myCardNum.innerHTML = thisDevice.num;
	}
	
	if(thisDevice.status_internal){
		myCardStatus.innerHTML = deviceStatusStrings[thisDevice.status_internal];
	} else {
		myCardStatus.innerHTML = 'Unknown';
	}
}

});

myCardOptions.addEventListener('click', function(event){
	let t = event.target;
	
	if(t.tagName == 'BUTTON'){
		if(myCardOptions.getAttribute('data-fip-index') && myCardOptions.getAttribute('data-device-index')){
			thisDevice = sysObjectsByCategory['fip'][parseInt(myCardOptions.getAttribute('data-fip-index'))].deviceList[myCardOptions.getAttribute('data-device-index')];
			if(thisDevice.type == 'mcp'){
				thisDevice.stuck = false;
			}
		}
		
	}

});




function buildSystem (sys) {
//expect to encounter system name first
//then delve into the hierarchy
	if(sys.children){
		createSystemObjects(sys.children[0]);
	}	
}

function buildFips() {
	//for each fip in the list of fips...
	let fipList = sysObjectsByCategory['fip'];
	for(let i = 0, l = fipList.length; i < l; i++){
		let f = fipList[i];
	//create a deviceList by scouring its child circuits for details (desc, type, subtype, loop, zone)
	
		f.deviceList = [];
		for(let j = 0, m = f.children.length; j < m; j++){
			let child = f.children[j];
			if(child.category == 'circuit'){
				//do some deeper digging. All devices should be on a circuit, not directly 'plugged into' the fip.
				for(let k = 0, n = child.children.length; k < n; k++){
					let c = child.children[k];
					//assign a num to each device, starting at 1
					//assign a status of 'normal' to each device
					//assign a lastAlarmDate of 'never' (or 0) to each device in the circuit (or an appropriate test date)
					//stuck: false
					let device = {
						desc: c.name,
						category: c.category,
						type: c.type,
						subtype: c.subtype,
						zone: c.zoneNum,
						loop: c.loop,
						num: k + 1,
						status_internal: 'normal',
						status: 'normal',
						stuck: false,
						//this is also the time to add a div to the blockplan with a pointer back to this device.
					}
					
					if(c.concealed){device.concealed = c.concealed;}
					let d  = new Date(0);
					device.lastAlarmTime = provideTimeString(d);
					
					
					device.imageArray = [];
					device.imagePath = '';
	
					if(device.concealed){
						device.imageArray = deviceImages['concealed'][0];
					} else {
						device.imageArray = deviceImages[device.type][0];
					}
					
					
					f.deviceList.push(device);
				}	
			}
		}
		
	//provide the FIP a representation in the DOM. NB this will not work in IE
		let temp = document.getElementsByClassName('template-panel')[0];
		let clone = temp.content.cloneNode(true);
		viewport.appendChild(clone);
		f.panel = document.getElementsByClassName('panel')[i]; //this will change when hardcoded panel is gone
		
	//give the FIP all of the functions it needs to survive as a fip.
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
	
		f.assignStatusIds = function() {
		let list = this.deviceList;
		//go through list of devices.
		//if in alarm, assign an alarmID
		//if in alarm, but acknowledged, assign an ackID
		//if isolated, assign isoID
		//count how many are in alarm, how many acked, how many isolated
		this.alarmCount = 0;
		this.ackedCount = 0;
		this.isolCount = 0;
		
		for(let i = 0, l = list.length; i < l; i++){
			let device = list[i];
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
					this.isolCount ++;
					device.isolID = this.isolCount;
					device.alarmID = -1;
					device.ackedID = -1;
					break;
					
				default:
					device.alarmID = -1;
					device.ackedID = -1;
					device.isolID = -1;
				break;
			}
		}
		
		//handling statuses: this.status is what's checked by any upstream FIPs
		if(this.status != 'isol'){
			if(this.alarmCount > 0){
				this.status = 'alarm';
				this.stuck = true;
				this.mainStatus = false;
			} else if(this.ackedCount > 0){
				this.status = 'alarm';
				this.stuck = true;
				this.mainStatus = false;
			} else {
				this.status = 'normal';
				this.stuck = false;
			}
		}
		
		//handling states of annunciators:
		if(this.alarmCount > 0 && this.alarmCount > this.ackedCount){
			if(this.annunAlarm.classList.contains('unlit')){this.annunAlarm.classList.toggle('unlit')};
			if(!this.annunAlarm.classList.contains('flashing')){this.annunAlarm.classList.toggle('flashing')};
			
			
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
			
		} else {
			this.ebActive = false;
			if(!this.extBell.classList.contains('unlit')){this.extBell.classList.toggle('unlit')};
			if(this.extBell.classList.contains('flashing')){this.extBell.classList.toggle('flashing')};
		}
		
		//TODO: refactor the conditional toggling of classes into a toggleClass function (args are the element, and the className)
	};
	
	f.displayStatus = function() {
		let list = this.deviceList;
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
		let list = this.deviceList;
		for(let i = this.currentIndex, l = list.length; i < l + 1; i++){
			if(i < l){
				if(list[i].status == status || (status == 'alarm' && list[i].status == 'acked')){
					let device = list[i];
					//display this alarm
					this.displayAlarm(device);
					this.currentIndex = i;
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
		let list = this.deviceList;
		for(let i = this.currentIndex, l = list.length; i >= -1; i--){
			if(i >= 0){
				if(list[i].status == status || (status == 'alarm' && list[i].status == 'acked')){
					let device = list[i];
					//display this device
					this.displayAlarm(device);
					this.currentIndex = i;
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
		//display this alarm
		this.descLine.innerHTML = device.desc;
		this.typeLine.innerHTML = types[device.type];
		this.displayLines[1].innerHTML = 'L'+ device.loop + '  S' + device.num + '  Z' + device.zone + ' Status: ' + this.statusStrings[device.status];
		this.displayLines[2].innerHTML = 'Last alarm: ' + device.lastAlarmTime;
		if(this.confirmState == 'none'){
			//display this alarm's number
			//display how many other alarms there are, or, if some have been acknowledged, display this number
			if(this.ackedCount > 0){
				this.displayLines[3].innerHTML = 'Acked alarms ' + this.ackedCount + ' of ' + this.alarmCount;
			} else if (this.alarmCount > 0){
				this.displayLines[3].innerHTML = 'Sensor alarms ' + device.alarmID + ' of ' + this.alarmCount;
			} else if (this.isolCount > 0 && !this.isol_norm){
				this.displayLines[3].innerHTML = 'Isolate ' + device.isolID + ' of ' + this.isolCount;
			} else {
				this.displayLines[3].innerHTML = 'Device ' + (this.currentIndex + 1) + ' of ' + this.deviceList.length;
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
					this.displayLines[3].innerHTML = 'Press ACKNOWLEDGE to confirm isolation of this device :-)';
					break;
					
			}
			
		}

	};
	
	f.incrementList = function(increment){
		//assumes increments won't be bigger than the deviceList's length
		let inc = Math.round(increment);
		let list = this.deviceList;
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
			let list = this.deviceList;
			let device = list[this.currentIndex]; //grab the currently viewed device
			if(this.confirmState == 'none'){
				//if the device is alarmed, and not already acknowledged, then do some stuff that moves only an active alarm to the acknowledged list
				if(device.status == 'alarm'){
					//change status to 'acknowledged' 
					device.status ='acked';
					this.assignStatusIds();
					this.displayStatus();
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
				}
				//return confirmState to 'none'
				this.confirmState = 'none';
				//return system to normal and see what happens
				this.assignStatusIds();
				//anything still in alarm gets its 'last alarm' date updated
				for(let i = 0, l = list.length; i < l; i++){
					if(list[i].status == 'alarm'){
						//list[i].lastAlarmTime = Date.now(); //refine this date (currently ms since 01.01.1970?)
					}
				}
				if(this.alarmCount == 0 && this.ackedCount == 0){
					this.mainStatus = true;
				}
				this.displayStatus();
			}
		}
	};
	
	f.handleIsolate = function(){
		if(this.confirmState == 'none'){
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
	};
	
	f.resetDevice = function(device){
		//try to remove alarm status from a device (i.e. set status to 'normal')
		//this will fail if the device has 'stuck' set to true
		if(!device.stuck && (device.status == 'alarm' || device.status == 'acked')){
			device.status = 'normal';
			device.status_internal = 'normal';
		} else if (device.stuck && (device.status == 'alarm' || device.status == 'acked')){
			device.status = 'alarm';
			device.status_internal = 'active';
			let alarmTime = new Date();
			device.lastAlarmTime = provideTimeString(alarmTime);
		}
	};
	
	f.handleReset = function(){
		if(this.confirmState == 'none'){
		
			//if there are acknowledged alarms, attempt to reset these to normal
			if(this.ackedCount > 0){
				this.confirmState = 'multi';
			}
			
			else if(this.deviceList[this.currentIndex].status == 'alarm'){
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
			this.assignStatusIds();
			this.displayStatus();//oooh clumsy forced update...

	};
	
	f.handleWsIsol = function(){
		this.wsIsolLamp.classList.toggle('unlit');
	};
	
	f.updateDeviceImagePath = function(device){
		
		if(device.status_internal == 'active'){
		if(device.type == 'mcp' && device.stuck && device.imageArray.length == 3){
			device.imagePath = imageDir + device.imageArray[2];
		} else {
			device.imagePath = imageDir + device.imageArray[1];
		}
	} else {
		device.imagePath =  imageDir + device.imageArray[0];
	}
	console.log(device.imagePath);
	
	myCardImage.style.backgroundImage = 'url(' + device.imagePath + ')';
		
		
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
	
	//EVENT LISTENERS
	f.panel.getElementsByClassName('panel-controls')[0].addEventListener('click', function(event){
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
	});
	

	
	//TEMPORARY - initialise with some random alarms
	f.triggerRandomAlarms = function(_numAlarms){
		let numAlarms = _numAlarms;
		let list = f.deviceList;
		numAlarms = fipoff_constrain(numAlarms, 0, list.length);
		let chosenDevices = [];
		
		while(chosenDevices.length < numAlarms){
			let idx = Math.floor(Math.random()*list.length);
			if(!chosenDevices.includes(idx)){
				chosenDevices.push(idx);
			}
		}
		
		//this alarm activation needs to be bundled into a function, which also adds the activation date...
		
		for(let i = 0; i < numAlarms; i++){
			let d = list[chosenDevices[i]];
			d.status = 'alarm';
			d.status_internal = 'active';
			let alarmTime = new Date();
			d.lastAlarmTime = provideTimeString(alarmTime);
			if(d.type == 'mcp'){d.stuck = true;} else {d.stuck = false;}
		}
	}
	//fire it up!
	f.triggerRandomAlarms(3);
	f.assignStatusIds();
	f.displayStatus();
	for(i = 0, l = f.deviceList.length; i < l; i++){
		f.updateDeviceImagePath(f.deviceList[i]);
	}
	
	//work out whether it's the master fip or not (if not, the div representation will be hidden by default)
	}
}


function createSystemObjects(node, parent){
	let o = {}; 
	if(parent){o.parent = parent};
	//establish identifiers
	if(node.name){o.name = node.name;}
	
	if(parent && parent.shname){
		if(node.shname){
			o.shname = parent.shname + '_' + node.shname;
		} else {
			o.shname = parent.shname + '_' + node.name;
		}
	} else {
		if(node.shname){
			o.shname = node.shname;
		} else {
			o.shname = node.name;	
		}
		
	}
	
	if(node.blockplan){
		
		//blockplan should obscure the FIP - make user remember details?
		//bring in the block plan with all of its details
		//blockplan needs...
		// - dimensions for each page
		// - number of pages
		// - images for each page
		// - contents page
		// - svg/spritesheet for all detector types - actually use a universal sprite sheet for now
		
		//devices is sysfile then need...
		// - their page number
		// - their on-page coords
		
		//blockplan will open in a div somewhat adjacent to the FIP onscreen
		// - closing the blockplan will also close any child elements (e.g. sub fips and their blockplans, detector infocards)
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
		//if parent exists and is an FIP, then zone = fip shname + 'zone' + zone number
		//if parent object has a zone and is a circuit, then take same zone as parent
		//if there's no parent, well, what can you do?
		if(parent && parent.category == 'fip'){
			o.zone = parent.shname + '_zone_' + node.zone;
			o.zoneNum = node.zone;
		} 	
	} else if (parent && parent.category == 'circuit' && parent.zone){
		o.zone = parent.zone;
		o.zoneNum = parent.zoneNum;
		o.loop = parent.loop;
	}	
	
	if(node.addressable){o.addressable = node.addressable;}
	
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

	
	//TODO: place in list of objects of same type and assign a reference id
	
	//TESTING: create a div with name and shortname, and append to viewport
	/*o.divrep = document.createElement('div');
	o.divrep.className = 'test';
	o.divrep.innerHTML = '<p>'+ o.name + '</p><p>' + o.shname + '</p><p>' + o.zone + '</p>';
	o.divrep.style.padding = '5px';
	viewport.appendChild(o.divrep);*/
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







