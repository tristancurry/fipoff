system = {
	name: 'System 01',
	shname: 'sys01',
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
			
				{
					name: 'Zone 2',
					shname: 'z2',
					type: 'circuit',
					colour: 'blue',
					zone: 2,
					page_number: 1,
					children:[
						{	
							name: 'Sub-FIP',
							shname: 'subFIP',
							type:'fip',
							pos: {x: '200px', y: '100px'},
							//blockplan: ['images/bp2_p1.png','images/bp2_p2.png'],						
							children:[
								{
									name: 'Zone 1',
									shname: 'z1',
									type: 'circuit',
									zone: 1,
									colour: 'purple',
									page_number: 1,
									children:[
										{
											name: '1-1P',
											type: 'det',
											subtype: 'pe',
											addressable: false,
											pos: {x:'50px', y:'300px'}
										},
										{
											name: '1-2P',
											type: 'det',
											subtype: 'pe',
											addressable: false,
											pos: {x:'50px', y:'200px'},
											concealed:true
											
										},
										{
											name: '1-3T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'50px', y:'100px'}
										}
								
									]
								},					
						
								{
									name: 'Zone 2',
									shname: 'z2',
									type: 'circuit',
									colour: 'blue',
									zone: 2,
									page_number: 1,
									children:[
										{
											name: '2-1T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'300px', y:'300px'}
										},
										{
											name: '2-2T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'300px', y:'200px'}
											
										},
										{
											name: '2-3T',
											type: 'det',
											subtype: 'pe',
											addressable: false,
											pos: {x:'300px', y:'100px'}
										}
								
									]
								},
						
								{
									name: 'Zone 3',
									shname: 'z3',
									type: 'circuit',
									colour: 'green',
									zone:3,
									page_number: 2,
									children:[
										{
											name: '3-1T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'50px', y:'300px'}
										},
										{
											name: '3-2T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'50px', y:'200px'}
											
										},
										{
											name: '3-3T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'50px', y:'100px'}
										},
										
									]
								},
						
								{
									name: 'Zone 4',
									shname: 'z4',
									type: 'circuit',
									colour: 'red',
									page_number: 2,
									zone: 4,
									children:[
										{
											name: '4-1T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'300px', y:'300px'}
										},
										{
											name: '4-2T',
											type: 'det',
											subtype: 'th',
											addressable: false,
											pos: {x:'300px', y:'200px'}
											
										},
										{
											name: '4-3T',
											type: 'det',
											subtype: 'pe',
											addressable: false,
											pos: {x:'300px', y:'100px'}
										}		
									]
								}		
							]
						}	
					]
				}
			]
		}
	]	
};