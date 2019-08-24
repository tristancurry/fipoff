system = {
	name: 'System 01',
	shname: 'sys01',
	type: 'system',
	children: [
		{
			name: 'Master FIP',
			shname: 'masterFIP',
			type: 'fip',
			//blockplan:
			children: [
			
				{
					name: 'Loop 1',
					shname: 'l1',
					type: 'circuit',
					colour: 'purple',
					loop: 1,
					zone: 1,
					page_number: 1,
					children:[
						{
							name: '1-1P',
							type: 'det',
							subtype: 'pe',
							addressable: true,
							pos: {x:'50px', y: '300px'},
							concealed: true
						},
						{
							name: '1-2M',
							type: 'det',
							subtype: 'mcp',
							addressable: true,
							pos: {x:'50px', y:'200px'}
						},
						{
							name: '1-3T',
							type: 'det',
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