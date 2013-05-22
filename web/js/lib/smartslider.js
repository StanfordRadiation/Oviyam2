(function($) {
    $.fn.extend({
        strackbar: function(options) {
            var settings = $.extend({
                style: 'style1',
                defaultValue: 0,
                sliderHeight: 4,
                sliderWidth: 200,
                trackerHeight: 20,
                trackerWidth: 19,
                minValue: 0,
                maxValue: 10,
                borderWidth: 1,
                animate: true,
                ticks: true,
                labels: true,
                callback: null
            }, options);
            return this.each(function() {
                var mousecaptured = false;
                var mouseDown = false;
                var previousMousePosition = 0;
                var stepValue = parseFloat(settings.sliderWidth / settings.maxValue);
                var currentValue = settings.minValue;
                var sliderLeft = 0;
                var sliderRight = 0;
                var ltop = 0;
                var element = $(this);
                var minvallabel = $('<div></div>').attr('id', 'min-val').css('float', 'left');
                var maxvallabel = $('<div></div>').attr('id', 'max-val').css('float', 'left');
                var wrapper = $('<div></div>').css('float', 'left');
                var contents = $('<div></div>').attr('id', 'jscroll').addClass('jscroller');
                var slider = $('<div></div>').attr('id', 'slider').addClass('slider');
                var selection = $('<div></div>').attr('id', 'inner').html('&nbsp').addClass('inner');
                var ltracker = $('<div></div>').attr('id', 'lgripper').addClass('lgripper');
                if (settings.labels)
                    element.append(minvallabel);
                element.append(wrapper);
                wrapper.append(contents);
                contents.append(slider);
                slider.append(selection);
                contents.append(ltracker);
                if (settings.labels)
                    element.append(maxvallabel);

                ltracker.css('height', settings.trackerHeight + 'px').css('width', settings.trackerWidth + 'px').css('left', '0');
                slider.css('width', settings.sliderWidth - (settings.borderWidth * 2)).css('height', settings.sliderHeight);
                slider.css('-moz-border-radius', (settings.sliderHeight) + 'px');
                slider.css('-webkit-border-radius', (settings.sliderHeight) + 'px');
                slider.css('border-radius', (settings.sliderHeight) + 'px');
                slider.css('top', '40%');
                selection.css('-moz-border-radius', (settings.sliderHeight) + 'px');
                selection.css('-webkit-border-radius', (settings.sliderHeight) + 'px');
                selection.css('border-radius', (settings.sliderHeight) + 'px');
                slider.addClass(settings.style);
                selection.addClass(settings.style);
                ltracker.addClass(settings.style);
                contents.addClass(settings.style);

                //element.css('padding-top', settings.trackerHeight / 2);
                var clear = $('<div></div>');
                clear.css('clear', 'both');
                element.append(clear);
                wrapper.css('width', settings.sliderWidth + 'px');
                //maxvallabel.html(settings.maxValue).css('margin-top', -(settings.trackerHeight / 4) + 'px').css('padding-left', '6px');
                //minvallabel.html(settings.minValue).css('margin-top', -(settings.trackerHeight / 4) + 'px').css('padding-right', '4px');
                maxvallabel.html(settings.maxValue).css('padding-left', '6px'); //.css('margin-top', '-2px');
                minvallabel.html(settings.minValue).css('padding-right', '4px'); //.css('margin-top', '-2px');
                var sliderBottom = settings.sliderHeight;
                sliderLeft = slider.offset().left;
                sliderRight = sliderLeft + settings.sliderWidth;
                ltop = (settings.trackerHeight / 2) - settings.sliderHeight / 2;
                previousMousePosition = sliderLeft;

                /*generates tick marks */
                var ticks = $("<ul></ul>");
                ticks.css('position', 'absolute');
                var height = slider.get(0).offsetHeight - 4;
                //var height = settings.sliderHeight;
                var sliderBorder = slider.get(0).offsetHeight - settings.sliderHeight;
                ltop -= sliderBorder / 2;
                ticks.css('top', height + 'px')
                ticks.attr('id', 'ticks');
                ticks.addClass('ticks');
                ticks.css('width', settings.sliderWidth + 'px');
                ticks.css('margin-left', stepValue / 2 + 'px');
                ticks.css('margin-top', '0px');
                var totalTicks = settings.sliderWidth / stepValue;

                for (var count = 0; count < totalTicks; count++) {
                    var tick = $('<li><span>|</span></li>');
                    tick.css('width', stepValue + 'px');
                    ticks.append(tick);
                }
                if (settings.ticks)
                    slider.after(ticks);
                ltracker.css('top', -ltop + 'px');
                //set the default position
                if (settings.defaultValue != 0) {
                    setPosition(settings.defaultValue * stepValue);
                    previousMousePosition = sliderLeft + settings.defaultValue * stepValue;
                    if (settings.callback != null)
                        settings.callback(settings.defaultValue);
                }
                ltracker.mousedown(function(e) {
                    mousecaptured = true;
                    previousMousePosition = e.pageX;
                    $(this).css('cursor', 'pointer');
                });

                ltracker.mouseup(function(e) {
                    mousecaptured = false;
                    $(this).css('cursor', 'default');
                });

                $(document).mouseup(function() {
                    mousecaptured = false;
                    $(this).css('cursor', 'default');
                });
                $(document).mousemove(function(e) {
                    if (mousecaptured) {
                        setTrackerPosition(e.pageX);
                        e.stopPropagation();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                });
                slider.mouseenter(function(e) { $(this).css('cursor', 'pointer'); });
                slider.mouseout(function(e) { $(this).css('cursor', 'default'); });
                slider.mousedown(function(e) {
                    if (!mouseDown) {
                        mouseDown = true;
                        $(this).css('cursor', 'pointer');
                        mousecaptured = false;
                        setTrackerPosition(e.pageX);
                    }
                });

                function getpositionvalue(pos) {
                    var val = parseInt(pos.replace('px', ''));
                    return val;
                }
                function getDragAmount(cursorCurrentPosition, cursorPreviousPosition) {
                    var dragAmount = cursorCurrentPosition - cursorPreviousPosition;
                    if (cursorPreviousPosition <= 0) {
                        dragAmount = cursorCurrentPosition - sliderLeft;
                        previousMousePosition = sliderLeft + dragAmount;
                    }
                    if (cursorPreviousPosition > cursorCurrentPosition)
                        dragAmount = cursorPreviousPosition - cursorCurrentPosition;

                    return dragAmount;
                }
                function isForwardDirection(cursorCurrentPosition, cursorPreviousPosition) {
                    if (cursorCurrentPosition > cursorPreviousPosition)
                        return true;
                    else
                        return false;
                }
                function validatePosition(position) {
                    if (position >= 0 && position <= settings.sliderWidth)
                        return true;
                    else
                        return false;
                }
                function setPosition(position) {

                    if (validatePosition(position)) {
                        var selectionWidth = getpositionvalue(ltracker.css('left')) + settings.trackerWidth / 2;
                        if (settings.animate && !mousecaptured) {
                            ltracker.animate({ 'left': position + 'px' }, 500, function() {
                                selectionWidth = getpositionvalue(ltracker.css('left')) + settings.trackerWidth / 2;
                                selection.css('width', selectionWidth + 'px');
                                mouseDown = false;
                            });
                            /*settings.animate = false;*/
                        }
                        else {
                            ltracker.css('left', position + 'px');
                            selectionWidth = getpositionvalue(ltracker.css('left')) + settings.trackerWidth / 2;
                            selection.css('width', selectionWidth + 'px');
                            mouseDown = false;
                        }
                    }
                   
                }
                function setTrackerPosition(cursorPosition) {
                    var dragAmount = getDragAmount(cursorPosition, previousMousePosition);
                    var isForward = isForwardDirection(cursorPosition, previousMousePosition);

                    var trackerPosition = getpositionvalue(ltracker.css('left'));
                    if (cursorPosition >= sliderLeft && cursorPosition <= (sliderRight - stepValue / 10)) {
                        if (trackerPosition >= 0 && trackerPosition <= settings.sliderWidth - stepValue / 10) {
                            if (isForward)
                                trackerPosition += dragAmount;
                            else
                                trackerPosition -= dragAmount;
                            setPosition(trackerPosition);

                            var newPosition = cursorPosition - sliderLeft;
                            var cVal = newPosition / stepValue;
                            currentValue = parseInt(cVal);
                            if (trackerPosition > (settings.sliderWidth - stepValue) + stepValue / 10) {
                                currentValue = parseInt(settings.sliderWidth / stepValue);
                            }
                            if (settings.callback != null)
                                settings.callback(currentValue);
                        }
                        previousMousePosition = cursorPosition;
                    }
                }
            });
        }
    });
})(jQuery);