system = {
	name: 'System 00',
	shname: 'sys00',
	category: 'system',
	children: [
		{
			name: 'Master FIP',
			shname: 'masterFIP',
			category: 'fip',
			//blockplan:
			//blockplan - detector dimensions
			children: [
				{
					name: 'Loop 2',
					shname: 'l2',
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
							addressable: true,
							pos: {x: '349px', y:'326px'}
						},
						{
							name: 'Recreation room (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '243px', y:'276px'},
							concealed: true
						},
						{
							name: 'Recreation room',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '243px', y:'309px'}
						},
						{
							name: 'Crew quarters south 1',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '153px', y:'300px'}
						},
						{
							name: 'Crew quarters south 2',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '93px', y:'298px'}
						},
						{
							name: 'Crew quarters south 3',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '35px', y:'300px'}
						},
						{
							name: 'Crew quarters south hallway',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '88px', y:'250px'}
						},
						{
							name: 'Crew quarters south hallway (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '141px', y:'251px'},
							concealed: true
						},
						{
							name: 'Crew quarters bathroom west',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x: '65px', y:'189px'},
						},
{
							name: 'Crew quarters bathroom east',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x: '135px', y:'189px'},
						},						
					]
					
				},
			
				{
					name: 'Loop 3',
					shname: 'l3',
					category: 'circuit',
					colour: 'green',
					loop: 3,
					zone: 3,
					page_number: 1,
					children:[
						{
							name: 'Engine bay outer, NW corner',
							category: 'det',
							type: 'mcp',
							subtype: 'mcp',
							addressable:true,
							pos: {x:'443px', y: '125px'},
						},
						{
							name: 'Engine bay outer, SW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'443px', y: '260px'},
						},
						{
							name: 'Engine bay inner, NW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'443px', y: '397px'},
						},
						{
							name: 'Engine bay inner, SW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'436px', y: '545px'},
						},						
						{
							name: 'Engine bay outer, SE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'546px', y: '257px'},
						},
						{
							name: 'Engine bay outer, NE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'546px', y: '120px'},
						},
						{
							name: 'Engine bay inner, NE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'546px', y: '397px'},
						},
						{
							name: 'Engine bay inner, SE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'545px', y: '548px'},
						},						
					]
				},
			
				{
					name: 'Loop 4',
					shname: 'l4',
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
							addressable: true,
							pos: {x:'668px', y: '606px'},
							concealed: true
						},
						{
							name: 'Community room south',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'663px', y:'555px'}
						},
						{
							name: 'Community room north (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'663px', y:'420px'},
							concealed: true
						},
						
								{
							name: 'Community room north',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'662px', y: '391px'}
						},
						{
							name: 'Community room kitchen',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'663px', y:'272px'}
						},
						{
							name: 'Community room toilet',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'716px', y:'273px'}
						},
						{
							name: 'Gym south (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'689px', y: '175px'},
							concealed: true
						},
						{
							name: 'Gym north (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'696px', y:'121px'},
							concealed: true
						},
						{
							name: 'Gym north',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'757px', y:'88px'}
						},
						
					]
				},
			]
		}
	]	
};