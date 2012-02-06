(function( $ ){
	"use strict";
	var methods = {
		init : function( options )
			{
				return this.each(function() {
					var	$this = $(this),
						data = $this.data('slideEverything'),
						slides = $this.children(),
						wrapper = $('<div></div>'),
						slide = $('<div></div>'),
						count = 0,
						i = 0;
					
					//set defaults
					if ( !data )
					{
						$(this).data('slideEverything', {
							'defer' : false,
							'pre' : 'SE_',
							
							'direction' : 'next',
							
							'delay' : 3500,
							'easing' : 'swing',
							'timing' : 1000,							
							'animation' : 'push'
							}
						);
					}
					
					//extend data with options object
					data = $.extend($this.data('slideEverything'), options);
					$this.data('slideEverything', data);
					
					//make the outer div a window
					$this.css(
						{
							'overflow' : 'hidden'
						}
					);
					
					//define the divs
					wrapper.attr('id',data.pre + 'wrapper');
					slide.addClass(data.pre + 'slide').css(
						{
							'width' : $this.width(),
							'float' : 'left',
							'overflow' : 'hidden'
						}
					);
					
					slides.each(function()
						{
							//drop each child inside a slide clone, and drop each slide inside the wrapper
							wrapper.append(slide.clone().append($(this)));
						}
					);
					wrapper.children().first().attr('data-current','current');
					
					//assign order to the slides
					for( i; i < wrapper.children().length; i++ )
					{
						$(wrapper.children().get(i)).attr('data-order',i);
					}
					
					count = wrapper.children().length;
					wrapper.css(
						{
							'width' : (count * $this.width()),
							'height' : '100%'
						}
					);
					
					//drop the slide wrapper inside the slider
					$this.append(wrapper);
					
					//display all the slides in case they were hidden, probably to avoid FOUC
					wrapper.children().children().show();
					
					if( !data.defer )
					{
						setTimeout(function(){$this.slideEverything('start');}, data.delay);
					}
				});
			},
		start : function()
			{
				return this.each(function() {
					var	$this = $(this),
						data = $this.data('slideEverything');
						
					$this.data(
						'slideEverything',
						$.extend($this.data('slideEverything'),
							{
								'handle' : setInterval(function(){$this.slideEverything('move');}, data.delay)
							}
						)
					);
				});
			},
		stop : function()
			{
				return this.each(function() {
					var	$this = $(this),
						data = $this.data('slideEverything');
						
					clearInterval(data.handle);
				});
			},
		move : function()
			{
				return this.each(function() {
					var	$this = $(this),
						data = $this.data('slideEverything'),
						wrapper = $this.children('#' + data.pre + 'wrapper'),
						current = wrapper.children('div[data-current="current"]'),
						obj = current.next();
					
					switch( data.animation )
					{
						case 'over':
							obj.animate(
								{
									'margin-left' : '-=' + $this.width()
								},
								{
									'duration' : data.timing,
									'easing' : data.easing,
									'complete' : function()
										{
											wrapper.append(current.removeAttr('data-current'));
											obj.attr('data-current','current').css({'margin-left' : ''});
										}
								}
							);
							break;
						case 'push':
							wrapper.animate(
								{
									'margin-left' : '-=' + $this.width()
								},
								{
									'duration' : data.timing,
									'easing' : data.easing,
									'complete' : function()
										{
											wrapper.append(current.removeAttr('data-current')).css({'margin-left' : 0});
											obj.attr('data-current','current');
										}
								}
							);
							break;						
					}
				});
			},
		update : function( options )
			{
				return this.each(function() {
					var	$this = $(this),
						data = $this.data('slideEverything');
					
					//extend data with options object
					data = $.extend($this.data('slideEverything'), options);
					$this.data('slideEverything', data);
				});
			},
		destroy : function()
			{
				return this.each(function()	{
					var $this = $(this),
						data = $this.data('slideEverything');
					
					$(window).unbind('.slideEverything');
					data.slideEverything.remove();
					$this.removeData('slideEverything');
			   });
			},	
		debug : function()
			{
				return this.each(function()	{
					var $this = $(this),
						data = $this.data('slideEverything');
					
					console.log(data);
			   });
			}
		};
	
	$.fn.slideEverything = function( method ) {
		
		if ( methods[method] )
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method )
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.slideEverything' );
		}
	};
})( jQuery );