//main.js - main program code

//GLOBALS

const viewport = document.getElementsByClassName('viewport')[0];

const subtypes = {
	pe: 'Photoelectric Detector',
	io: 'Ionisation Detector',
	th: 'Thermal Detector',
	mcp: 'Manual Call Point',
	multi: 'Smoke/Heat Detector',
	flame: 'Flame Detector',
	vesda: 'VESDA', //Very Early Smoke Detection Apparatus - has own interface/panel
	ps: 'Pressure Switch'
}



let sysObjects = [];
let sysObjectsByType = {
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
function constrain(n, min, max){
	if(n > max){n = max;} else if(n < min){n = min;}
	return n;	
}


//System-specific stuff

//build a system from the jsonny madness
//create objects for each entry
//add these objects to a global object list
//add objects to lists by type
//sort out parents and children of these objects
//also produce a separate list of zones (administrative, as opposed to circuitry)



buildSystem(system);
buildZoneLists();
console.log(sysObjects);
console.log(sysObjectsByType);
console.log(zones);







function assembleDate(d){
	let day =  d.getDay().toString();
	if(d.getDay() < 10){day = addLeadingZero(day)};
	let month =  d.getMonth().toString();
	if(d.getMonth() < 10){month = addLeadingZero(month)};
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

function addLeadingZero(str){
	let newStr = '0' + str;
	return(newStr);
}

function buildSystem (sys) {
//expect to encounter system name first
//then delve into the hierarchy
	if(sys.children){
		createSystemObjects(sys.children[0]);
	}	
}

function buildFips() {
	//for each fip in the list of fips...
	
	//create a deviceList by scouring its child circuits for details (desc, type, subtype, loop, zone)
	//assign a num to each device, starting at 1
	//assign a status of 'normal' to each device
	//assign a lastAlarmDate of 'never' (or 0) to each device in the circuit (or an appropriate test date)
	//stuck: false

	
	//give the FIP all of the functions it needs to survive as a fip.
	
	
	
	//work out whether it's the master fip or not (if not, the div representation will be hidden by default)
	
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
	
	if(node.loop){
		o.loop = node.loop;
	}
	
	if(node.type){
		o.type = node.type;
		//also add this object to the global list of similar objects
		if(sysObjectsByType[o.type]){
			sysObjectsByType[o.type].push(o);
		}
	}
	
	if(node.subtype){
		o.subtype = node.subtype;
	}
	
	if(node.zone){
		//if parent exists and is an FIP, then zone = fip shname + 'zone' + zone number
		//if parent object has a zone and is a circuit, then take same zone as parent
		//if there's no parent, well, what can you do?
		if(parent && parent.type == 'fip'){
			//console.log(parent.type);
			o.zone = parent.shname + '_zone_' + node.zone;
			o.zoneNum = node.zone;
		} 	
	} else if (parent && parent.type == 'circuit' && parent.zone){
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
	o.divrep = document.createElement('div');
	o.divrep.className = 'test';
	o.divrep.innerHTML = '<p>'+ o.name + '</p><p>' + o.shname + '</p><p>' + o.zone + '</p>';
	o.divrep.style.padding = '5px';
	viewport.appendChild(o.divrep);
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



//templates for building the various DOM representations of the alarm system components
InnerHtmlInstructions = {
	fip: '<div class="panel"></div>',
	blockplan: '<div class="blockplan"></div>',
	det: '<div class="det"><div class ="det-header"></div><div class="det-body"><div class="det-image"></div><div class="det-info"></div></div><div class="det-options"></div></div>'
}

//TESTING ALARM PANEL FUNCTIONS
//(trying to establish a format for a FIP OBJECT)

let myFip = {
	
	status:'normal',
	
	//this device list will be generated from the system description file
	deviceList:	[{desc:'Me', status:'alarm', type:'smoke', subtype:'pe', loop:1, num:1, zone:1, lastAlarmTime:'today'}, 
	{desc:'You', status:'alarm', type:'smoke', subtype:'pe', loop:1, num:2, zone:1, lastAlarmTime:'today'}, 
	{desc:'Vlad', status:'alarm', type:'smoke', subtype:'pe', loop:1, num:3, zone:1, lastAlarmTime:'today'}, 
	{desc:'Donald', status:'normal', type:'smoke', subtype:'pe', loop:2, num:1, zone:1, lastAlarmTime:'yesterday'}, 
	{desc:'Jeeves', status:'alarm', type:'smoke', subtype:'pe', loop:2, num:2, zone:1, lastAlarmTime:'today'}, 
	{desc:'Snow', status:'normal', type:'smoke', subtype:'pe', loop:2, num:3, zone:1, lastAlarmTime:'yesterday'}
	],
	
	zones: [],
	circuits: [],
	
	panel: document.getElementsByClassName('panel')[0], //for testing - this will be linked to the right panel dynamically
	
	alarmCount: 0,
	ackedCount: 0,
	isolCount: 0,
	
	currentIndex: 0,
	
	alarmText: 'Alarm: ',
	ackText: 'Acknowledged alarm: ',
	isoText: 'Isolated: ',
	statusStrings : {alarm: 'ALARM', acked: 'ALARM(Acknowledged)', isol: 'ISOLATED', normal: 'NORMAL'},

	lastPressed: 'reset',
	confirmState: 'none', //options are: none, single, multi, isol
	
	ebActive: false,
	ebIsol: false,
	
	assignStatusIds: function() {
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
			} else if(this.ackedCount > 0){
				this.status = 'alarm';
				this.stuck = true;
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
			//TODO: invoke a CSS class that flashes a div's background-color off and on
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
	},
	
	displayStatus: function() {
		let list = this.deviceList;
		//access the FIP's list
		//work out if anything is still in alarm
		if(this.alarmCount > 0){  //alarms have priority for display
			//find the first alarm from the specified index
			//keep looping until found, or until max loops have been reached (prevent infinite looping)
			//somehow include the ability to end up back on the main screen when the last alarm has been traveled through
			//if no alarms at all are found, despite alarmCount > 0, then display an error code and put system into error status
			this.findNextOrPrev('alarm');
		} else if (this.isolCount > 0) { //if there are isolates
		//somehow include the main screen in this selection i.e. if a loop occurs without finding anything?
			this.findNextOrPrev('isol');
		} else {
			//status normal. TODO - allow for scrolling through devices from this screen
			//this.findNextOrPrev('normal');
			this.displayMainStatus('normal');
		}
		
	},
	
	displayMainStatus: function(fipStatus){
			let d = new Date();
			this.descLine.innerHTML = 'FirePanel 3000';
			this.typeLine.innerHTML = assembleTime(d) + ' ' + assembleDate(d);
			this.displayLines[1].innerHTML = 'Serviced by the good people at Stn 33';
			this.displayLines[2].innerHTML = 'Ph: 0444 444444';
			this.displayLines[3].innerHTML = 'System ' + this.statusStrings[fipStatus];
	},
	
	findNext: function(status, loops){
		let list = this.deviceList;
		for(let i = this.currentIndex, l = list.length; i < l; i = (i+1)%l){
			if(loops > 5){console.log('overlooped'); break;}
			if(i < l){
				if(list[i].status == status || (status == 'alarm' && list[i].status == 'acked')){
					let device = list[i];
					//display this alarm
					this.displayAlarm(device);
					this.currentIndex = i;
					break;
				}
			} /*else if(i == l){
				this.displayMainStatus(status);
				loops++;
				break;
			}*/				
		}
	},
	
	findPrev: function(status, loops){
		let list = this.deviceList;
		for(let i = this.currentIndex, l = list.length; i >= 0; i--){
			if(loops > 5){console.log('overlooped'); break;}
			if(i >= 0){
				if(list[i].status == status || (status == 'alarm' && list[i].status == 'acked')){
					let device = list[i];
					//display this device
					this.displayAlarm(device);
					this.currentIndex = i;
					break;
				}
			} /*else if(i < 0){
				this.displayMainStatus(status);
				loops++;
				break;
			}*/
		}
		
	},
	
	findNextOrPrev: function(status){
		let loops = 0;
		if(this.lastPressed == 'prev'){
			this.findPrev(status, loops);
		} else {
			this.findNext(status, loops);
		}
	},
	
	displayAlarm: function(device){
		//display this alarm
		this.descLine.innerHTML = device.desc;
		this.typeLine.innerHTML = device.type;
		this.displayLines[1].innerHTML = 'L'+ device.loop + '  S' + device.num + '  Z' + device.zone + ' Status: ' + this.statusStrings[device.status];
		this.displayLines[2].innerHTML = device.lastAlarmTime;
		if(this.confirmState == 'none'){
			//display this alarm's number
			//display how many other alarms there are, or, if some have been acknowledged, display this number
			if(this.ackedCount > 0){
				this.displayLines[3].innerHTML = 'Acked alarms ' + this.ackedCount + ' of ' + this.alarmCount;
			} else if (this.alarmCount > 0){
				this.displayLines[3].innerHTML = 'Sensor alarms ' + device.alarmID + ' of ' + this.alarmCount;
			} else if (this.isolCount > 0){
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

	},
	
	incrementList: function(increment){
		//assumes increments won't be bigger than the deviceList's length
		let inc = Math.round(increment);
		let list = this.deviceList;
		let idx = this.currentIndex;
		idx += inc;
		if(idx < 0){  
			idx += list.length;
		}
		idx = idx%list.length;
		this.currentIndex = idx;
		
		this.displayStatus();
	},
	
	handleAcknowledged: function(){
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
			this.displayStatus();
		}
	},
	
	handleIsolate: function(){
		if(this.confirmState == 'none'){
			//put system in state where it's waiting for the user to confirm the isolation.
			this.confirmState = 'isol';
		} else if(this.confirmState == 'single' || this.confirmState == 'multi' || this.confirmState == 'isol'){
			//go back
			this.confirmState = 'none';
		}
		this.displayStatus();
	},
	
	isolateDevice: function(device){
		device.status = 'isol';
	},
	
	resetDevice: function(device){
		//try to remove alarm status from a device (i.e. set status to 'normal')
		//this will fail if the device has 'stuck' set to true
		if(!device.stuck && (device.status == 'alarm' || device.status == 'acked')){
			device.status = 'normal';
		}
	},
	
	handleReset: function(){
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
	},
	
	handleEbIsol: function(){
			this.ebIsol = !this.ebIsol;
			this.ebIsolLamp.classList.toggle('unlit');
			this.assignStatusIds();
			this.displayStatus();//oooh clumsy forced update...

	},
	
	handleWsIsol: function(){
		this.wsIsolLamp.classList.toggle('unlit');
	},
	
}


//TODO: bundle the following up into a method on the FIP itself.
//or find a way to do this within object notation 
	myFip.display = myFip.panel.getElementsByClassName('panel-display-content')[0];
	myFip.displayLines = myFip.display.getElementsByClassName('display-line');
	myFip.descLine = myFip.displayLines[0].getElementsByClassName('left-info')[0];
	myFip.typeLine = myFip.displayLines[0].getElementsByClassName('right-info')[0];
	
	myFip.panel_controls = myFip.panel.getElementsByClassName('panel-controls')[0];
	myFip.ebIsolButton = myFip.panel_controls.getElementsByTagName('BUTTON')[0];
	myFip.ebIsolLamp = myFip.ebIsolButton.getElementsByClassName('lamp')[0];
	myFip.wsIsolButton = myFip.panel_controls.getElementsByTagName('BUTTON')[1];
	myFip.wsIsolLamp = myFip.wsIsolButton.getElementsByClassName('lamp')[0];
	myFip.prevButton = myFip.panel_controls.getElementsByTagName('BUTTON')[2];
	myFip.nextButton = myFip.panel_controls.getElementsByTagName('BUTTON')[3];
	myFip.ackButton = myFip.panel_controls.getElementsByTagName('BUTTON')[4];
	myFip.resetButton = myFip.panel_controls.getElementsByTagName('BUTTON')[5];
	myFip.isolButton = myFip.panel_controls.getElementsByTagName('BUTTON')[6];
	
	myFip.annuns = myFip.panel.getElementsByClassName('panel-annunciators')[0].getElementsByClassName('lamp');
	myFip.annunAlarm = myFip.annuns[0];
	myFip.annunIsol = myFip.annuns[1];
	myFip.annunFault = myFip.annuns[2];
	
	myFip.extBell = myFip.panel.getElementsByClassName('extBell')[0];
	
	//EVENT LISTENERS - bundle these into the FIP as well?
	myFip.panel.getElementsByClassName('panel-controls')[0].addEventListener('click', function(event){
		let t = event.target;
		if(t == myFip.ebIsolButton){myFip.handleEbIsol();}
		if(t == myFip.wsIsolButton){myFip.handleWsIsol();}
		if(t == myFip.prevButton && myFip.confirmState == 'none'){myFip.lastPressed = 'prev'; myFip.incrementList(-1);}
		if(t == myFip.nextButton && myFip.confirmState == 'none'){myFip.lastPressed = 'next'; myFip.incrementList(1);}
		if(t == myFip.ackButton){myFip.lastPressed = 'ack'; myFip.handleAcknowledged();}
		if(t == myFip.resetButton){myFip.lastPressed = 'reset'; myFip.handleReset();}
		if(t == myFip.isolButton){myFip.lastPressed = 'isol'; myFip.handleIsolate();}	
	});
	
	//put the above into action
	
	myFip.assignStatusIds(); //i.e. go through device list and assign sequential IDs based on device status.
	myFip.displayStatus();
