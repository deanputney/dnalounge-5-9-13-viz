
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
			//if (x > 0) { x ++ }
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

