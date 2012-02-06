$(function()
	{
		$('#slider-a').slideEverything();
		$('#slider-b').slideEverything(
			{
				"animation" : "over",
				"easing" : "linear"
			}
		);
	}
);