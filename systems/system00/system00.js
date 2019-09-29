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
			children: [
			{
					name: 'Loop 3',
					shname: 'l3',
					category: 'circuit',
					colour: 'purple',
					loop: 3,
					zone: 3,
					page_number: 1,
					children:[
						{
							name: 'Engine bay outer, NW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'443px', y: '675px'},
						},
						{
							name: 'Engine bay outer, SW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y: '300px'},
						},
						{
							name: 'Engine bay inner, NW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y: '300px'},
						},
						{
							name: 'Engine bay inner, SW corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y: '300px'},
						},						
						{
							name: 'Engine bay outer, SE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y: '300px'},
						},
						{
							name: 'Engine bay outer, NE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y: '300px'},
						},
						{
							name: 'Engine bay inner, NE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y: '300px'},
						},
						{
							name: 'Engine bay inner, SE corner',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y: '300px'},
						},						
					]
				},
			
				{
					name: 'Loop 4',
					shname: 'l4',
					category: 'circuit',
					colour: 'purple',
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
							pos: {x:'50px', y: '300px'},
							concealed: true
						},
						{
							name: 'Community room south',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y:'200px'}
						},
						{
							name: 'Community room north (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y:'100px'},
							concealed: true
						},
						
								{
							name: 'Community room north',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y: '300px'}
						},
						{
							name: 'Community room kitchen',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y:'200px'}
						},
						{
							name: 'Community room toilet',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y:'100px'}
						},
						{
							name: 'Gym south (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y: '300px'},
							concealed: true
						},
						{
							name: 'Gym north (ceiling)',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y:'200px'},
							concealed: true
						},
						{
							name: 'Gym north',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y:'100px'}
						},
						
					]
				},
			]
		}
	]	
};