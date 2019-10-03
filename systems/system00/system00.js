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
							addressable: true,
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
							pos: {x:'663px', y:'545px'}
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