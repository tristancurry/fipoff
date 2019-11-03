system = {
	name: 'System 01',
	shname: 'sys01',
	category: 'system',
	children: [
		{
			name: 'Master FIP',
			shname: 'masterFIP',
			category: 'fip',
			//blockplan:
			children: [
			
				{
					name: 'Loop 1',
					shname: 'l1',
					category: 'circuit',
					colour: 'purple',
					loop: 1,
					zone: 1,
					page_number: 1,
					children:[
						{
							name: 'Living quarters south',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y: '300px'},
							concealed: true
						},
						{
							name: 'Call point, southern exit',
							category: 'det',
							type: 'mcp',
							addressable: true,
							pos: {x:'50px', y:'200px'}
						},
						{
							name: 'Kitchen',
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x:'50px', y:'100px'}
						},
						
					]
				},
			]
		}
	]	
};