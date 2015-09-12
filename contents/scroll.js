(function($){
    $(document).ready(function() {
        function insideViewport(winTop, winHeight, top, height) {
            var isVisible = null;
            var viewportTop = winTop;
            var viewportBottom = winTop + winHeight;
            var targetTop = top;
            var targetBottom = top + height;
            var criticalAreaHeight = 200;
            //outside rules
            //if ((viewportTop + criticalAreaHeight) >= targetBottom && viewportTop <= targetBottom) {
            //    isVisible = false;
            //}
            //if ((viewportBottom - criticalAreaHeight) <= targetTop && viewportBottom >= targetTop) {
            //    isVisible = false;
            //}
            if (targetBottom < viewportTop + criticalAreaHeight || targetTop > viewportBottom - criticalAreaHeight) {
                isVisible = false;
            }
            //inside rules
            if ((viewportTop + criticalAreaHeight) >= targetTop && viewportTop <= targetTop) {
                isVisible = true;
            }
            if ((viewportBottom - criticalAreaHeight) <= targetBottom && viewportBottom >= targetBottom) {
                isVisible = true;
            }
            if ((viewportTop + criticalAreaHeight) < targetTop && (viewportBottom - criticalAreaHeight) > targetBottom) {
                isVisible = true;
            }
            if (viewportTop > targetTop && viewportBottom < targetBottom) {
                isVisible = true;
            }
            return isVisible;
        }

        function ViewportController(targetSelector, onEnterCallback, onLeaveCallback) {
            var emptyFunction = function() {
            };
            this.targets = $(targetSelector);
            this.onEnterViewport = onEnterCallback;
            this.onLeaveViewport = onLeaveCallback;
            this.winHeight = 0;
            this.initController();
        }

        ViewportController.prototype.computePositions = function() {
            var positions = [];
            var winHeight = $(window).height();
            $.each(this.targets, function(index, value) {
                var target = $(value);
                positions.push({
                    target: target,
                    top: target.offset().top,
                    height: target.height(),
                    isVisible: false
                });
            });
            this.positions = positions;
            this.winHeight = winHeight;
        };
        ViewportController.prototype.checkViewport = function() {
            var winTop = $(window).scrollTop();
            var winHeight = this.winHeight;
            var that = this;
            $.each(that.positions, function(index, value) {
                var isVisible = insideViewport(winTop, winHeight, value.top, value.height);
                if (isVisible !== null && isVisible !== value.isVisible) {
                    if (isVisible) {
                        that.onEnterViewport(value.target);
                    } else {
                        that.onLeaveViewport(value.target);
                    }
                }
                value.isVisible = isVisible;
            })
        };
        ViewportController.prototype.initController = function() {
            this.computePositions();
            this.checkViewport();
            var that = this;
            $(window).on('scroll', function() {
                that.checkViewport();
            }).on('resize', function() {
                that.computePositions();
                that.checkViewport();
            })
        };
        function onEnter(target) {
            target.addClass('animated');
        }

        function onLeave(target) {
            target.removeClass('animated');
        }

        var vSlider = new ViewportController('.section', onEnter, onLeave);
    });
}(jQuery));