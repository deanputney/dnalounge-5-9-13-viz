
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
		Char.clone().setValue(c).build()
	},
	
	organize: function()
	{
		
	}
})


Char = Proto.clone().newSlots({
	protoType: "Char",
	value: " ",
	cubes: null
}).setSlots({
	init: function()
	{
		this._cubes = []
		return this;
	},
	
	build: function()
	{
		var rows = FONTS.WENDY[char]
		var objNum = 0
		
		
		for (var y = 0; y < rows.length; y ++)
		{
			var row = rows[y]
			for (var x = 0; x < row.length; x ++)
			{
				if (row[x] == 1)
				{
					var cube = cubeWithoutOwner()
					cube.setOwner(this)
				
					cube._target.position.x = (x - row.length/2)*50
					cube._target.position.y = -(y - rows.length/2)*50
					cube._target.position.z = -10
					cube._target.scale.x = 1.2
					cube._target.scale.y = 1.2
					cube._target.scale.z = 1
					//object._material.opacity = 1
					objNum ++
				}
			}
		}
	},
	
	disown: function()
	{
		
	}
})
