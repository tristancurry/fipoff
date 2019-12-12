system = {
	name: 'Simple System',
	category: 'system',
	children: [
		{
			name: 'Master FIP',
			category: 'fip',
			type: 'fip',
			blockplan_details: {
				pages: ['abstractSimple.png'],
				dimensions: {x:'800px',y:'600px'},
				detector_dimensions: {x:'60px', y:'60px'},
				fip_dimensions: {x:'90px', y: '60px'},


			},
			//note there is also a MCP located at the panel...
			children: [
				{
					name: 'Loop 1',
					category: 'circuit',
					colour: 'magenta',
					addressable: true,
					loop: 1,
					zone: 1,
					page_number: 1,
					children:[
						{
							name: 'AZ1-001-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '116px', y:'129px'}
						},
						{
							name: 'AZ1-002-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '116px', y:'233px'}
						},
						{
							name: 'AZ1-003-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '116px', y:'337px'},
							concealed: true
						},
						{
							name: "AZ1-004-T",
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x: '116px', y:'441px'}
						},
					]

				},

				{
					name: 'Zone 2',
					category: 'circuit',
					addressable: false,
					colour: 'cyan',
					loop: 2,
					zone: 2,
					page_number: 1,
					children:[
						{
							name: 'AZ2-001-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '367px', y:'130px'}
						},
						{
							name: 'AZ2-002-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '367px', y:'234px'},
							concealed: true
						},
						{
							name: 'AZ2-003-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '367px', y:'338px'}
						},
						{
							name: 'AZ2-004-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '367px', y:'442px'}
						},

					]

				},
			]
		}
	]
};
