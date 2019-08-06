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
console.log(zones);

function buildSystem (sys) {
//expect to encounter system name first
//then delve into the hierarchy
	if(sys.children){
		createSystemObjects(sys.children[0]);
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
	
	if(node.type){o.type = node.type;}

	if(node.zone){
		//if parent exists and is an FIP, then zone = fip shname + 'zone' + zone number
		//if parent object has a zone and is a circuit, then take same zone as parent
		//if there's no parent, well, what can you do?
		if(parent && parent.type == 'fip'){
			//console.log(parent.type);
			o.zone = parent.shname + '_zone_' + node.zone;
		} 	
	} else if (parent && parent.type == 'circuit' && parent.zone){
		o.zone = parent.zone;
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

	lastPressed: 'reset',
	
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
	},
	
	displayStatus: function() {
		let list = this.deviceList;
		//access the FIP's list
		//work out if anything is still in alarm
		if(this.alarmCount > 0){  //alarms have priority for display
			//find the first alarm from the specified index
			//keep looping until found, or until max loops have been reached (prevent infinite looping)
			//if no alarms at all are found, despite alarmCount > 0, then display an error code and put system into error status
			let loops = 0;
			if(this.lastPressed == 'prev'){
				for(let i = this.currentIndex, l = list.length; i >= 0; i = (i - 1 + l)%l){
					if(loops > 5){console.log('overlooped'); break;}
					
					if(list[i].status == 'alarm' || list[i].status == 'acked'){
						let device = list[i];
						//display this alarm
						this.displayAlarm(device);
						this.currentIndex = i;
						break;
					} 
					if(i == 0){loops++;}
				}
			} else {
				for(let i = this.currentIndex, l = list.length; i < l; i = (i+1)%l){
					if(loops > 5){console.log('overlooped'); break;}
					if(i == l - 1){loops++;}
					if(list[i].status == 'alarm' || list[i].status == 'acked'){
						let device = list[i];
						//display this alarm
						this.displayAlarm(device);
						this.currentIndex = i;
						break;
					} 
				}
			}
		} else if(this.ackedCount > 0) { //if there alarms waiting for reset
			//now show whatever needs to be shown on the screen when all alarms are acknowledged
			//actually, this isn't necessary, user can scroll through all alarms anyway....
			
		} else if (this.isolCount > 0) { //if there are isolates
		 //also need conditional for FAULTS
		} else {
			//status normal
		}	
	},
	
	displayAlarm: function(device){
		//display this alarm
		this.descLine.innerHTML = device.desc;
		this.typeLine.innerHTML = device.type;
		this.displayLines[1].innerHTML = 'L'+ device.loop + '  S' + device.num + '  Z' + device.zone + ' Status: ALARM';
		if(device.status == 'acked'){this.displayLines[1].innerHTML += '(Acknowledged)';}
		this.displayLines[2].innerHTML = device.lastAlarmTime;
		if(this.ackedCount > 0){
			this.displayLines[3].innerHTML = 'Acked alarms ' + this.ackedCount + ' of ' + this.alarmCount;
		} else {
			this.displayLines[3].innerHTML = 'Sensor alarms ' + device.alarmID + ' of ' + this.alarmCount;
		}
		//display this alarm's number
		//display how many other alarms there are, or, if some have been acknowledged, display this number
		//and we are done!
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
		//if the device is alarmed, and not already acknowledged, then do some stuff that moves only an active alarm to the acknowledged list
		if(device.status == 'alarm'){
			//change status to 'acknowledged'
			device.status ='acked';
			//move off this alarm and on to the next on the alarm list
			//we do this by reassigning status IDs and then invoking displayStatus()
			this.assignStatusIds();
			this.displayStatus();
			//once we have acknowledged the last alarm, put the display into a different state...
			//this should already happen through displayStatus though...:-)
			
		}
		
		//otherwise, check if we're in a state where the system is waiting for the user to acknowledge something (e.g. reset instruction)
		//then, execute whatever thing it is that the user is trying to do.

	},
	
	handleReset: function(){
		//if there are acknowledged alarms, attempt to reset these to normal
		if(this.ackedCount > 0){}
		
		else if(this.deviceList[this.currentIndex].status == 'alarm'){}
		//if there are no acknowledged alarms, attempt to reset the currently displayed alarm (temporarily give it 'acknowledged status'?)
		//in either case, prompt user for acknowledgement...
		
		//also, successful reset should prevent additional alarms being sent upstream (i.e. Sub FIP --> Main FIP)
	}
	
}


//TODO: bundle the following up into a method on the FIP itself.
//or find a way to do this within object notation 
	myFip.display = myFip.panel.getElementsByClassName('panel-display-content')[0];
	myFip.displayLines = myFip.display.getElementsByClassName('display-line');
	myFip.descLine = myFip.displayLines[0].getElementsByClassName('left-info')[0];
	myFip.typeLine = myFip.displayLines[0].getElementsByClassName('right-info')[0];
	
	
	myFip.panel_controls = myFip.panel.getElementsByClassName('panel-controls')[0];
	myFip.prevButton = myFip.panel_controls.getElementsByTagName('BUTTON')[2];
	myFip.nextButton = myFip.panel_controls.getElementsByTagName('BUTTON')[3];
	myFip.ackButton = myFip.panel_controls.getElementsByTagName('BUTTON')[4];
	
	//EVENT LISTENERS - bundle these into the FIP as well?
	myFip.panel.getElementsByClassName('panel-controls')[0].addEventListener('click', function(event){
		let t = event.target;
		if(t == myFip.prevButton){myFip.lastPressed = 'prev'; myFip.incrementList(-1);}
		if(t == myFip.nextButton){myFip.lastPressed = 'next'; myFip.incrementList(1);}
		if(t == myFip.ackButton){myFip.lastPressed = 'ack'; myFip.handleAcknowledged();}
		if(t == myFip.resetButton){myFip.lastPressed = 'reset'; myFip.handleReset();}
		
		
		
	});
	
	//put the above into action
	
	myFip.assignStatusIds(); //i.e. go through device list and assign sequential IDs based on device status.
	myFip.displayStatus();
	








	


