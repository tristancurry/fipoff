//An attempt to gather all useful global parameters in one place for easy tweaking

// General info
const thisVersion = '1.0';


// File paths and device image parameters
const imageDir = 'images/';
const systemDir = 'systems/';

const systemPaths = {
	station33a: 'station33/',
	station33c: 'station33/',
	abstractSimple: 'abstract/abstractSimple/',
	abstractComplex: 'abstract/abstractComplex/',
}

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

// Menu system parameters
const systemMenu = ['station33a', 'station33c', 'abstractSimple', 'abstractComplex'];
const locationMenu = [false, true];
const faultMenu  = [0, 0.02, 0.15, 1];


// Strings
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

const deviceStatusStrings = {
	active: 'Activated',
	normal: 'Normal'
};

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

const fip_default_message = 'Serviced by the good people at Stn 33';
const fip_default_contact = 'Ph: 0444 444 444';


// Alarm behaviour
const reactivateTime = 2000;
const reactivateVariance = 15000;
const alarmRecencyThreshold = 86400000; // number of milliseconds before an alarm is thought to be 'old news' while alarm condition is active.


// Themes for blockplans and fips
const colorList = ['default', 'magenta', 'cyan', 'green', 'red'];

const zoneThemes = {
	magenta: {
		zoneBackgroundColor: 'rgba(255, 221, 238, 0.75)',
		zoneBorderColor: '#920580',
		zoneTextColor: '#240088',
		zoneTextBackgroundColor: '#c784bf',
	},
	cyan: {
		zoneBackgroundColor: 'rgba(0, 255, 255, 0.75)',
		zoneBorderColor: '#057992',
		zoneTextColor: '#060349',
		zoneTextBackgroundColor: '#35f7ff',
	},
	green: {
		zoneBackgroundColor: 'rgba(163, 255, 163, 0.75)',
		zoneBorderColor: '#006500',
		zoneTextColor: '#000000',
		zoneTextBackgroundColor: '#59dc62',
	},
	red: {
		zoneBackgroundColor: 'rgba(255, 81, 81, 0.75)',
		zoneBorderColor: '#600000',
		zoneTextColor: '#FFEE00',
		zoneTextBackgroundColor: '#aa1a1a',
	},
	default: {
		zoneBackgroundColor: 'rgba(255, 235, 59, 0.75)',
		zoneBorderColor: 'rgb(230,150,0)',
		zoneTextColor: 'black',
		zoneTextBackgroundColor: 'rgb(255,255,150)',
	}
};

const fipThemes = {
	default: {
		bright: 'orange',
		panel: 'black',
		bezel: 'blue',
		lcdBright: '#ccff99',
		lcdDark: '#666633',
		lcdText: '#224422'
	},
	magenta: {
		bright: 'magenta',
		panel: '#1d001d',
		bezel: 'magenta',
		lcdBright: '#ff7af2',
		lcdDark: '#55014a',
		lcdText: '#360143'
	},
	cyan: {
		bright: 'cyan',
		panel: '#011414',
		bezel: 'cyan',
		lcdBright: '#aee2e3',
		lcdDark: '#056172',
		lcdText: '#060445'
	},
	green: {
		bright: '#00ff00',
		panel: '#002913',
		bezel: '#00ff00',
		lcdBright: '#ccff99',
		lcdDark: '#006c00',
		lcdText: '#013519'
	},
	red: {
		bright: 'red',
		panel: '#140101',
		bezel: 'orange',
		lcdBright: '#FF681B',
		lcdDark: '#800000',
		lcdText: '#450404'
	},
};
