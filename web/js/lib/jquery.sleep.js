/*
	Sleep by Mark Hughes (AKA huzi8t9)
	http://www.360Gamer.net/

	Usage:
		$.sleep ( 3, function()
		{
			alert ( "I slept for 3 seconds!" );
		});
	Use at free will, distribute free of charge
*/

;(function(jQuery)
{
	var _sleeptimer;
	jQuery.sleep = function( time2sleep, callback )
	{
		jQuery.sleep._sleeptimer = time2sleep;
		jQuery.sleep._cback = callback;
		jQuery.sleep.timer = setInterval('jQuery.sleep.count()', 1000);
	}
	jQuery.extend (jQuery.sleep, {
		current_i : 1,
		_sleeptimer : 0,
		_cback : null,
		timer : null,
		count : function()
		{
			if ( jQuery.sleep.current_i === jQuery.sleep._sleeptimer )
			{
				clearInterval(jQuery.sleep.timer);
				jQuery.sleep._cback.call(this);
			}
			jQuery.sleep.current_i++;
		}
	});
})(jQuery);