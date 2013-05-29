
Keyboard = Proto.clone().newSlots({
	protoType: "Keyboard",
	keys: null
}).setSlots({
	init: function()
	{
		var chars = "abcdefghijklmnopqrstuvwxyz0123456789"
		
		return this;
	},
	
	event: function()
	{
		this._state = true
	}
})
