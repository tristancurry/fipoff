let system = {
	name: 'Abstract Complex',
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
							name: 'AZ1-001-FIP Panel West',
							category: 'fip',
							type: 'fip',
							blockplan_details: {
								pages: ['blockplanA_addr.png'],
								dimensions: {x:'1100px',y:'800px'},
								detector_dimensions: {x:'20px', y:'20px'},
								fip_dimensions: {x:'30px', y: '20px'},
							},
							pos: {x: '116px', y:'130px'},
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
											name: 'Front door',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '309px', y:'610px'}
										},
										{
											name: 'Station office',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '230px', y:'699px'}
										},
									]
								},
							]

						},

						{
							name: 'AZ1-002-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '116px', y:'234px'}
						},
						{
							name: 'AZ1-003-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							addressable: true,
							pos: {x: '116px', y:'338px'},
							concealed: true
						},
						{
							name: "AZ1-004-T",
							category: 'det',
							type: 'thermal',
							subtype: 'th',
							addressable: true,
							pos: {x: '116px', y:'442px'}
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
							name: 'AZ2-001-FIP Indicator Panel East',
							category: 'fip',
							type: 'fip',
							blockplan_details: {
								pages: ['blockplanA_conv.png'],
								dimensions: {x:'1100px',y:'800px'},
								detector_dimensions: {x:'20px', y:'20px'},
								fip_dimensions: {x:'30px', y: '20px'},
							},
							pos: {x: '367px', y:'131px'},
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
									],
								},
							],
						},
						{
							name: 'AZ2-002-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '367px', y:'235px'},
							concealed: true
						},
						{
							name: 'AZ2-003-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '367px', y:'339px'}
						},
						{
							name: 'AZ2-004-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '367px', y:'443px'}
						},

					]

				},
			]
		}
	]
};
