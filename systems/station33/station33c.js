system = {
	name: 'Station 33',
	category: 'system',
	children: [
		{
			name: 'Main FIP',
			category: 'fip',
			type: 'fip',
			blockplan_details: {
				pages: ['blockplanA_conv.png'],
				dimensions: {x:'1100px',y:'800px'},
				detector_dimensions: {x:'20px', y:'20px'},
				fip_dimensions: {x:'30px', y: '20px'},


			},

			children: [
				{
					name: 'Zone 1',
					category: 'circuit',
					colour: 'magenta',
					loop: 1,
					zone: 1,
					page_number: 1,
					children:[
						{
							name: 'Front door',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '309px', y:'610px'}
						},
						{
							name: 'Station office',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '230px', y:'699px'}
						},
						{
							name: 'Station office (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '199px', y:'699px'},
							concealed: true
						},
						{
							name: "Officers' quarters, hallway",
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '139px', y:'658px'}
						},
						{
							name: "Officers' quarters, bedroom 1",
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '102px', y:'697px'}
						},
						{
							name: "Officers' quarters, bedroom 2",
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '99px', y:'639px'}
						},
						{
							name: 'Mess, kitchen',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x: '49px', y:'538px'}
						},
						{
							name: 'Mess, dining',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x: '122px', y:'534px'}
						},
						{
							name: 'Mess, dining (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '120px', y:'558px'},
							concealed: true
						},
						{
							name: 'Hallway, station entrance',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '188px', y:'609px'},
						},
						{
							name: "Officers' bathroom",
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x: '228px', y:'559px'}
						},
						{
							name: 'Radio equipment room',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '263px', y:'560px'},
						},
						{
							name: 'Control room',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '320px', y:'558px'},
						},
						{
							name: 'Lounge room (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '257px', y:'492px'},
							concealed: true
						},
						{
							name: 'Lounge room',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '259px', y:'464px'},
						},
					]

				},

				{
					name: 'Zone 2',
					category: 'circuit',
					colour: 'cyan',
					loop: 2,
					zone: 2,
					page_number: 1,
					children:[
						{
							name: 'Drying room',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '349px', y:'326px'}
						},
						{
							name: 'Recreation room (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '243px', y:'276px'},
							concealed: true
						},
						{
							name: 'Recreation room',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '243px', y:'309px'}
						},
						{
							name: 'Crew quarters south, bedroom 1',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '153px', y:'300px'}
						},
						{
							name: 'Crew quarters south, bedroom 2',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '93px', y:'298px'}
						},
						{
							name: 'Crew quarters south, bedroom 3',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '35px', y:'300px'}
						},
						{
							name: 'Crew quarters south, hallway',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '88px', y:'250px'}
						},
						{
							name: 'Crew quarters south, hallway (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '141px', y:'251px'},
							concealed: true
						},
						{
							name: 'Crew quarters bathroom west',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x: '65px', y:'189px'},
						},
						{
							name: 'Crew quarters bathroom east',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x: '135px', y:'189px'},
						},
						{
							name: 'Crew quarters north, bedroom 3',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '37px', y:'77px'},
						},
						{
							name: 'Crew quarters north, bedroom 2',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '94px', y:'78px'},
						},
						{
							name: 'Crew quarters north, hallway',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '88px', y:'127px'},
						},
						{
							name: 'Crew quarters north, hallway (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '152px', y:'126px'},
							concealed: true
						},
						{
							name: 'Crew quarters north, bedroom 1',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '154px', y:'76px'},
						},
						{
							name: 'Northern entryway',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '202px', y:'137px'},
						},
						{
							name: 'Store room',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '288px', y:'123px'},
						},
						{
							name: 'Store room (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '290px', y:'157px'},
							concealed: true,
						},
						{
							name: 'Laundry/BA Area',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x: '347px', y:'159px'},
						},
					]

				},

				{
					name: 'Zone 3',
					category: 'circuit',
					colour: 'green',
					loop: 3,
					zone: 3,
					page_number: 1,
					children:[
						{
							name: 'Engine bay (north), NW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable:true,
							pos: {x:'443px', y: '125px'},
						},
						{
							name: 'Engine bay (north), SW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x:'443px', y: '260px'},
						},
						{
							name: 'Engine bay (south), NW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x:'443px', y: '397px'},
						},
						{
							name: 'Engine bay (south), SW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x:'436px', y: '545px'},
						},
						{
							name: 'Engine bay (north), SE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x:'546px', y: '257px'},
						},
						{
							name: 'Engine bay (north), NE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x:'546px', y: '120px'},
						},
						{
							name: 'Engine bay (south), NE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x:'546px', y: '397px'},
						},
						{
							name: 'Engine bay (south), SE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',

							pos: {x:'545px', y: '548px'},
						},
					]
				},

				{
					name: 'Zone 4',
					category: 'circuit',
					colour: 'red',
					loop: 4,
					zone: 4,
					page_number: 1,
					children:[
						{
							name: 'Community room south (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'668px', y: '606px'},
							concealed: true
						},
						{
							name: 'Community room south',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'663px', y:'555px'}
						},
						{
							name: 'Community room north (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'663px', y:'420px'},
							concealed: true
						},

								{
							name: 'Community room north',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'662px', y: '391px'}
						},
						{
							name: 'Community room kitchen',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'663px', y:'272px'}
						},
						{
							name: 'Community room toilet',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'716px', y:'273px'}
						},
						{
							name: 'Gym south (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'689px', y: '175px'},
							concealed: true
						},
						{
							name: 'Gym north (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'696px', y:'121px'},
							concealed: true
						},
						{
							name: 'Gym north',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',

							pos: {x:'757px', y:'88px'}
						},

					]
				},
			]
		}
	]
};
