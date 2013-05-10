
Word = Proto.clone().newSlots({
	protoType: "Word",
	chars: null
}).setSlots({
	init: function()
	{
		this._chars = []
		return this;
	},
	
	addChar: function(c)
	{
		this.chars().push(Char.clone().setValue(c).build())
		this.organize()
	},

	width: function()
	{
		var w = 0
		var chars = this.chars()
		for (var i = 0; i < chars.length; i ++)
		{
			var char = chars[i]
			if (w > 0) { w ++ }
			//console.log("char object = " + typeof(char))
			w = w + char.width()
		}
		return w
	},
		
	organize: function()
	{
		var chars = this.chars()
		var w = this.width()
		//console.log("w = " + w)
		var x = 0
		for (var i = 0; i < chars.length; i ++)
		{
			var char = chars[i]
			if (x > 0) { x ++ }
			x = x + char.width()
			char.setX((x - w/2 - 1)*100)
		}
	},
	
	clear: function()
	{
		console.log("word clear")
		
		var chars = this.chars()
		this.setChars([])
		for (var i = 0; i < chars.length; i ++)
		{
			var char = chars[i]		
			char.disown()
		}
	}
})


Char = Proto.clone().newSlots({
	protoType: "Char",
	value: " ",
	cubes: null,
	x: 0
}).setSlots({
	init: function()
	{
		this._cubes = []
		return this;
	},
	
	width: function()
	{
		var g = FONTS.WENDY[this.value()]
		if (g == null) { return 0 }
		return g[0].length
	},

	build: function()
	{
		var rows = FONTS.WENDY[this.value()]
		if (rows == null) { return }
		
		for (var y = 0; y < rows.length; y ++)
		{
			var row = rows[y]
			for (var x = 0; x < row.length; x ++)
			{
				if (row[x] == 1)
				{
					var cube = cubeWithoutOwner(this)
					cube.setOwner(this)
					this.cubes().push(cube)
				}
			}
		}
		
		this.organize()
		return this
	},
		
	organize: function()
	{
		var rows = FONTS.WENDY[this.value()]
		if (rows == null) { return; }
		var objNum = 0
		
		for (var y = 0; y < rows.length; y ++)
		{
			var row = rows[y]
			for (var x = 0; x < row.length; x ++)
			{
				if (row[x] == 1)
				{
					var cube = this._cubes[objNum]
					cube.setOwner(this)
					this.cubes().push(cube)
				
					cube._target.position.x = (x - row.length/2)*50 + this.x()
					cube._target.position.y = -(y - rows.length/2)*50
					cube._target.position.z = -600
					
					cube._target.scale.x = 1.2
					cube._target.scale.y = 1.2
					cube._target.scale.z = 1
					
					objNum ++
				}
			}
		}
		
		return this
	},
	
	disown: function()
	{
		for (var i = 0; i < this._cubes.length; i ++)
		{
			var cube = this._cubes[i]
			cube.setOwner(null)
		}
		this._cubes = []
	},
	
	setX: function(x)
	{
		this._x = x
		this.organize()
		return this		
	}
})
