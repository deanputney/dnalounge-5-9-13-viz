
Key = Proto.clone().newSlots({
	protoType: "Key",
	char: null,
	state: false,
	t1: null,
	t2: null
}).setSlots({
	init: function()
	{
		return this;
	},
	
	down: function()
	{
		this._state = true
	},

	up: function()
	{
		this._state = false
	}
})
