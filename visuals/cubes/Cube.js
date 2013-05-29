COLORSETS = {}
COLORSETS.RAINBOWBRITE = new Array('#71c8bf', '#1ba554', '#cad93b', '#fef02f', '#fbb62c', '#f38a2e', '#ee592c', '#ea1d2b', '#b42767', '#65328f', '#52529f', '#20aeda')

PI = 3.14159265359

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

groupNumber = 0
cubes_pulse = false

Cube = Proto.clone().newSlots({
	protoType: "Cube",
	timeCount: 0,
	geometry: null,
	mesh: null,
	id: 0,
	updateFuncs: null,
	updateFunc: null,
	cubeSize: 3,
	scene: null,
	owner: null,
	pulse: false,
	bumpValue: 0,
	pulseValue: 0,
}).setSlots({
	init: function()
	{
		
		updateFuncs = []
		
		this._geometry = new THREE.CubeGeometry( 40, 40, 40 );
		this._mesh = new THREE.Mesh(this._geometry, new THREE.MeshLambertMaterial( 
			{ 
				color: 0xffffff,
				wireframe: false 
			}
		));
		
		this._mesh.material.ambient = this._mesh.material.color;								
		this._mesh.castShadow = true;
		this._mesh.receiveShadow = true;
								
		var s = 3
		this._current = {}
		this._current.position = { x:0, y:0, z:0 }	
		this._current.rotation = { x:0, y:0, z:0 }
		this._current.scale    = { x: s, y: s, z: s}
		this._current.color    = { r: 1, g: 1, b: 1}
		
		this._target = {}
		this._target.position = JSON.parse(JSON.stringify(this._current.position))
		this._target.position.rate = 0.02
		this._target.rotation = JSON.parse(JSON.stringify(this._current.rotation))
		this._target.scale    = JSON.parse(JSON.stringify(this._current.scale))
		this._target.color    = JSON.parse(JSON.stringify(this._current.color))
		
		this._offsets = {}
		this._offsets.position = { x:0, y:0, z:0 }
		this._offsets.rotation = { x:0, y:0, z:0 }
		this._offsets.scale    = { x:0, y:0, z:0 }
	
		return this;
	},
	
	add: function()
	{
		this.scene().add(this.mesh())
	},

	remove: function()
	{
		cubes.remove(this)
		this.scene().remove(this.mesh())
	},
	
	evaporate: function()
	{
		this.setTargetScale(0)
		this.setUpdateFunc(this.updateToRemove)
	},
	
	shrink: function()
	{
		if (this._target.scale.x > .8)
		{
			this.setTargetScale(this._target.scale.x/8)
		}
	},
	
	
	resize: function()
	{
		console.log("resize")
		
		if (this._target.scale.x == .5)
		{
			this.setTargetScale(2)
		}
		else if (this._target.scale.x == 2)
		{
			this.setTargetScale(4)
		}
		else if (this._target.scale.x == 4)
		{
			this.setTargetScale(6.5)
		}
		else if (this._target.scale.x == 6.5)
		{
			this.setTargetScale(10)
		}
		else 
		{
			this.setTargetScale(.5)
		}		
	},
		
	expand: function()
	{
		if (this._target.scale.x < 80)
		{
			this.setTargetScale(this._target.scale.x*1.5)
			//console.log("this._target.scale.x = " + this._target.scale.x)
		}
	},
	
	updateToRemove:function()
	{
		if (this._target.scale.x < .1)
		{
			this.setUpdateFunc(null)
			//this.remove()
		}
	},

	timeStep: function()
	{
		this._timeCount = this._timeCount + 1
		this.zeroOffsets()
		this.updateTowardTarget()

		this.update()
		if (this.updateFunc())
		{
			this.updateFunc().apply(this)
		}
		
		/*
		for (var i = 0; i < updateFuncs.length; i++)
		{
			updateFuncs[i](this)
		}
		*/
		if (cubes_pulse)
		{
			this._offsets.scale.x = .5*Math.sin(this._timeCount/10)
			this._offsets.scale.y = .5*Math.sin(this._timeCount/10)
			this._offsets.scale.z = .5*Math.sin(this._timeCount/10)
		}
		
		this.applyOffsets()
	},
	
	togglePulse: function()
	{
		cubes_pulse = !cubes_pulse
	},

	update: function()
	{
		this.updateWave()
	},
	
	zeroOffsets: function()
	{				
		this._offsets.position.x = 0
		this._offsets.position.y = 0
		this._offsets.position.z = 0
		this._offsets.scale.x = 0
		this._offsets.scale.y = 0
		this._offsets.scale.z = 0
		this._offsets.rotation.x = 0
		this._offsets.rotation.y = 0
		this._offsets.rotation.z = 0
	},

	updateTowardTarget: function()
	{
		var rate = this._target.position.rate 
		
		this._current.position.x += rate*(this._target.position.x - this._current.position.x)
		this._current.position.y += rate*(this._target.position.y - this._current.position.y)
		this._current.position.z += rate*(this._target.position.z - this._current.position.z)
		
		rate = 0.15
		
		this._current.scale.x += rate*(this._target.scale.x - this._current.scale.x)
		this._current.scale.y += rate*(this._target.scale.y - this._current.scale.y)
		this._current.scale.z += rate*(this._target.scale.z - this._current.scale.z)

		rate = 0.15
		
		this._current.rotation.x += rate*(this._target.rotation.x - this._current.rotation.x)
		this._current.rotation.y += rate*(this._target.rotation.y - this._current.rotation.y)
		this._current.rotation.z += rate*(this._target.rotation.z - this._current.rotation.z)
		
		rate = 0.6
		this._current.color.r += rate*(this._target.color.r - this._current.color.r)
		this._current.color.g += rate*(this._target.color.g - this._current.color.g)
		this._current.color.b += rate*(this._target.color.b - this._current.color.b)
	},
	
	applyOffsets: function()
	{				
		this._mesh.position.x = this._current.position.x + this._offsets.position.x
		this._mesh.position.y = this._current.position.y + this._offsets.position.y
		this._mesh.position.z = this._current.position.z + this._offsets.position.z
	
		this._mesh.scale.x = this._current.scale.x + this._offsets.scale.x
		this._mesh.scale.y = this._current.scale.y + this._offsets.scale.y
		this._mesh.scale.z = this._current.scale.z + this._offsets.scale.z
	
		this._mesh.rotation.x = this._current.rotation.x + this._offsets.rotation.x
		this._mesh.rotation.y = this._current.rotation.y + this._offsets.rotation.y
		this._mesh.rotation.z = this._current.rotation.z + this._offsets.rotation.z

		this._mesh.material.color.r = this._current.color.r //+ this._offsets.color.r
		this._mesh.material.color.g = this._current.color.g //+ this._offsets.color.g
		this._mesh.material.color.b = this._current.color.b //+ this._offsets.color.b
	},
	
	chooseRandomTargetPosition: function(max)
	{
		if (max == null) { max = 1000 }
		this._target.position.x = max*(.5 - Math.random()) 	
		this._target.position.y = max*(.5 - Math.random()) 	
		this._target.position.z = max*(.5 - Math.random()) 	
	},
	
	shake: function(max)
	{
		console.log("shake")
		if (max == null) { max = 100 }
		this._current.position.x += max*(.5 - Math.random()) 	
		this._current.position.y += max*(.5 - Math.random()) 	
		this._current.position.z += max*(.5 - Math.random()) 	
	},
	
	chooseRandomPaletteTargetColor: function()
	{
		color = COLORSETS.RAINBOWBRITE[parseInt((Math.random() * COLORSETS.RAINBOWBRITE.length) % COLORSETS.RAINBOWBRITE.length)]
		this._target.color.r = hexToR(color)/255	
		this._target.color.g = hexToG(color)/255	
		this._target.color.b = hexToB(color)/255
	},
	
	chooseRandomGroupPaletteTargetColor: function()
	{
		color = COLORSETS.RAINBOWBRITE[parseInt((groupNumber * 7) % COLORSETS.RAINBOWBRITE.length)]
		this._target.color.r = hexToR(color)/255	
		this._target.color.g = hexToG(color)/255	
		this._target.color.b = hexToB(color)/255
	},
	
	chooseRandomTargetColor: function()
	{
		max = 1
		this._target.color.r = max*(.5 - Math.random()) 	
		this._target.color.g = max*(.5 - Math.random()) 	
		this._target.color.b = max*(.5 - Math.random()) 	
	},
	
	zebra: function(colors)
	{
		var i = (groupNumber )
		var color = COLORSETS.RAINBOWBRITE[parseInt(i % COLORSETS.RAINBOWBRITE.length)]
		var altColor = COLORSETS.RAINBOWBRITE[parseInt((i+8) % COLORSETS.RAINBOWBRITE.length)]
		
		if (Math.random() < .5) { color = altColor } 
		this._target.color.r = hexToR(color)/255	
		this._target.color.g = hexToG(color)/255	
		this._target.color.b = hexToB(color)/255
	},
	
	distanceFromOrigin: function()
	{
		var dx = this._current.position.x
		var dy = this._current.position.y
		var dz = this._current.position.z
		var r = Math.sqrt(dx*dx + dy*dy + dz*dz)
		return r		
	},
	
	updateWave: function()
	{
		var r = this.distanceFromOrigin()
		this._offsets.position.z = 50*(1.1 + Math.sin( r/100 + this._timeCount/20 ))
	},
	
	minSize: function()
	{	
		this.setTargetScale(.1)	
	},
	
	normSize: function()
	{
		this.setTargetScale(this.cubeSize())	
	},
	
	rotZ90: function()
	{
		this._target.rotation.z += PI/2
	},
	
	rotZReset: function()
	{
		this._target.rotation.z = 0	
	},

	rotRand90: function()
	{
		var v = Math.floor(Math.random()*3)
		if (v == 0)
		{
			this._target.rotation.x += PI/2
		}
		if (v == 1)
		{
			this._target.rotation.y += PI/2
		}
		if (v == 2)
		{
			this._target.rotation.z += PI/2
		}	
	},
		
	rotX90: function()
	{
		this._target.rotation.x += PI/2
	},
	
	rotXReset: function()
	{
		this._target.rotation.x = 0	
	},
	
	setTargetScale: function(s)
	{
		this._target.scale.x = s
		this._target.scale.y = s
		this._target.scale.z = s			
	},
	
	setScale: function(s)
	{
		this._current.scale.x = s
		this._current.scale.y = s
		this._current.scale.z = s		
	},
	
	targetScale: function()
	{
		return this._target.scale.x
	},

	outZ: function()
	{
		this._target.position.z -= 1800
	},
	
	inZ: function()
	{
		this._target.position.z += 800
	},
	
	
	
	outaHere: function()
	{
		this._target.position.rate = .2
		console.log("outaHere")
		this._target.position.x *= 2
		this._target.position.y *= 2
		this._target.position.z *= 2
	},
	
	inaHere: function()
	{
		this._target.position.rate = .2
		console.log("inahere")
		this._target.position.x *= .5
		this._target.position.y *= .5
		this._target.position.z *= .5
	},

/*
	bumpUpdate: function()
	{
		this._bumpValue *= .9
		if (this._bumpValue == 0)
		{
			this.setUpdateFunc(null)
		}
		this.setOffsetsScale(this._pulseValue)
	},
	*/
		
	pulse: function()
	{
		this._pulseValue = 1
		this.setUpdateFunc(this.pulseUpdate)
	},

	pulseUpdate: function()
	{
		this._pulseValue *= .9
		if (this._pulseValue == 0)
		{
			this.setUpdateFunc(null)
		}
		this.setOffsetsScale(this._pulseValue)
	},
	
	setOffsetsScale: function (s)
	{
		this._offsets.scale.x = s
		this._offsets.scale.y = s
		this._offsets.scale.z = s
		
	},
	/*
	updateSpread: function()
	{					
		spread.value += spread.speed
	
		for ( var i = 0, l = cubes.length; i < l; i ++ ) 
		{
			var object = cubes[ i ];
			this._offsets.position.x = this._current.position.x * spread.value
			this._offsets.position.y = this._current.position.y * spread.value
		}
	
		spread.speed *= .9
	},

	updateSize: function()
	{					
		size.value += size.speed
	
		if (size.value < .1) { size.value = .1; }
	
		for ( var i = 0, l = cubes.length; i < l; i ++ ) 
		{
			var object = cubes[ i ];
			this._offsets.scale.x = this._current.scale.x * size.value
			this._offsets.scale.y = this._current.scale.y * size.value
		}
	
		size.speed *= .9
	}
	*/
})
