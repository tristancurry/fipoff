let system = {
	name: 'Complex System',
	category: 'system',
	children: [
		{
			name: 'Main FIP',
			category: 'fip',
			type: 'fip',
			blockplan_details: {
				pages: ['abstractComplex_main_contents.png', 'abstractComplex_main_p2.png', 'abstractComplex_main_p3.png'],
				dimensions: {x:'800px',y:'600px'},
				detector_dimensions: {x:'40px', y:'40px'},
				fip_dimensions: {x:'90px', y: '60px'},


			},
			//note there is also a MCP located at the panel...
			children: [
				{
					name: 'Zone 1',
					category: 'circuit',
					colour: 'magenta',
					addressable: true,
					loop: 1,
					zone: 1,
					page_number: 2,
					children: [
						{
							name: 'AZ1-001-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '145px', y:'277px'}
						},

						{
							name: 'AZ1-002-P',
							category: 'det',
							type: 'smoke',
							subtype: 'pe',
							pos: {x: '290px', y:'277px'}
						},
					]
				},

				{
					name: 'Zone 2',
					category: 'circuit',
					colour: 'cyan',
					addressable: true,
					loop: 2,
					zone: 2,
					page_number: 3,
					children:[
						{
							name: 'FIP West Building',
							category: 'fip',
							type: 'fip',
							blockplan_details: {
								pages: ['abstractComplex_west.png'],
								dimensions: {x:'750px',y:'600px'},
								detector_dimensions: {x:'40px', y:'40px'},
								fip_dimensions: {x:'30px', y: '20px'},
							},
							pos: {x: '71px', y:'278px'},
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
											pos: {x: '85px', y:'435px'}
										},
										{
											name: 'AZ1-002-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '85px', y:'348px'}
										},
										{
											name: 'AZ1-003-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '85px', y:'260px'}
										},
										{
											name: 'AZ1-004-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '85px', y:'170px'}
										},
										{
											name: 'AZ1-005-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '258px', y:'259px'}
										},
										{
											name: 'AZ1-006-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '258px', y:'347px'}
										},
										{
											name: 'AZ1-006-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											addressable: true,
											pos: {x: '258px', y:'434px'}
										},
									]
								},
								{
									name: 'Loop 2',
									category: 'circuit',
									colour: 'green',
									addressable: true,
									loop: 2,
									zone: 2,
									page_number: 1,
									children:[
										{
											name: 'AZ2-001-T',
											category: 'det',
											type: 'thermal',
											subtype: 'th',
											pos: {x: '272px', y:'101px'}
										},
										{
											name: 'AZ2-002-T',
											category: 'det',
											type: 'thermal',
											subtype: 'th',
											pos: {x: '406px', y:'101px'}
										},

									]
								},
							]
						},
					]
				},

				{
					name: 'Zone 3',
					category: 'circuit',
					addressable: true,
					colour: 'green',
					loop: 3,
					zone: 3,
					page_number: 3,
					children:[
						{
							name: 'FIP East Building',
							category: 'fip',
							type: 'fip',
							blockplan_details: {
								pages: ['abstractComplex_east.png'],
								dimensions: {x:'850px',y:'700px'},
								detector_dimensions: {x:'40px', y:'40px'},
								fip_dimensions: {x:'30px', y: '20px'},
							},
							pos: {x: '492px', y:'344px'},
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
											name: 'AZ1-001-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											pos: {x: '242px', y:'495px'}
										},
										{
											name: 'AZ1-002-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											pos: {x: '367px', y:'387px'}
										},
										{
											name: 'AZ1-003-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											pos: {x: '367px', y:'185px'}
										},
									],
								},
								{
									name: 'Zone 2',
									category: 'circuit',
									colour: 'cyan',
									loop: 1,
									zone: 1,
									page_number: 1,
									children:[
										{
											name: 'AZ2-001-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											pos: {x: '115px', y:'495px'}
										},
										{
											name: 'AZ2-002-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											pos: {x: '367px', y:'495px'}
										},
										{
											name: 'AZ2-003-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											pos: {x: '367px', y:'293px'}
										},
										{
											name: 'AZ2-004-P',
											category: 'det',
											type: 'smoke',
											subtype: 'pe',
											pos: {x: '367px', y:'92px'}
										},
									],
								},
							],
						},

					],
				},
			]
		}
	]
};
