;(function(H){
	H.TipBox = H.extend(H.Base, {
		init: function(h) {
			Horn.TipBox.superclass.init.apply(this, arguments);
			this.el.appendTo($("body"));
		},
		getTipBox: function(location) {
			return this.children(".hc_tip-" + location);
		}
	});
	Horn.regUI('div.hc_tip-list', Horn.TipBox);
})(Horn);

;(function($){
	
	var defaults = {
		message: "提示信息",
		location: "auto",
		type: "error",
		event: "hover",
		style: "",
		timeout: undefined
	};
	
	$.extend($.fn, {
		addTip: function(params) {
			params = params || defaults;
			if (typeof params == "string") {
				params = $.extend({}, defaults, {
					message: params
				});
			} else {
				params = $.extend({}, defaults, params);
			}
			if (this.length > 1) {
				return this.each(function(i, o){
					$(this).addTip(params);
				});
			}
			if (!this.data("tip")) {
				this.data("tip", $.extend({}, params, {
					tipList: $(document.body).children(".hc_tip-list"),
					timeouts: []
				}));
				if (params.event == "hover") {
					this.hover(this.tipBoxEnter = function(){
						var $this = $(this);
						var offset = $this.offset();
						var tipData = $this.data("tip");
						_clearTimeout(tipData.timeouts);
						var location = autoLocation.call($this);
						var tipBox = tipData.tipBox;
						tipData.timeouts.push(setTimeout(function(){
							tipBox.css({
								left: offset.left,
								top: location == "down" ? offset.top + $this.outerHeight() + "px" : offset.top - 40 + "px"
							});
							tipBox.find(".hc_tip-content").html(tipData.message || "");
							tipBox.fadeIn(200, function(){
								if (params.timeout) {
									tipData.timeouts.push(setTimeout(function(){
										tipBox.fadeOut(300);
										tipData.timeouts.splice(tipData.timeouts.length - 1);
									}, params.timeout));
								}
							});
							tipData.timeouts.splice(tipData.timeouts.length - 1);
						}, 300));
					}, this.tipBoxLeave = function(){
						var tipData = $(this).data("tip");
						_clearTimeout(tipData.timeouts);
						tipData.tipBox.fadeOut(260);
					});
				}
			}
			this.data("tip").message = params.message;
			return this;
		},
		removeTip: function() {
			return this.unbind("mouseenter", this.tipBoxEnter).unbind("mouseleave", this.tipBoxLeave).data({
				tip: null
			});
		},
		positionTo: function(parent) {
			parent = parent || $("body");
			var position = {left : 0, top : 0};
			var target = this.get(0),tag = target.tagName.toUpperCase();
			var offsetParent = this.offsetParent();
			if (offsetParent[0] != parent[0] && tag != "HTML" && tag != "BODY") {//IE7
				position = offsetParent.positionTo(parent);
				var borderLeftWidth = 0,borderTopWidth = 0;
				if (offsetParent.css("borderWidth") != "medium" 
					&& offsetParent.css("boxSizing") != "border-box") {//IE7,8
					borderLeftWidth = parseInt(offsetParent.css("borderLeftWidth"));
					borderTopWidth = parseInt(offsetParent.css("borderTopWidth"));
				}
				position = {
						left: position.left + borderLeftWidth,
						top: position.top + borderTopWidth
				};
			}
			var p = this.position();
			return {
				left : position.left + p.left,
				top : position.top + p.top
			};
		}
		
	});
	
	function autoLocation() {
		var tipData = this.data("tip"), location = tipData.location;
		if (location == "auto") {
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			location = this.offset().top - scrollTop < 40 ? "down" : "up";
		}
		tipData.tipBox = tipData.tipList.children(".hc_tip-" + location);
		return location;
	};
	
	function _clearTimeout(timeouts) {
		if (!timeouts) return;
		if (typeof timeouts == "string") {
			clearTimeout(timeouts);
		} else {
			$.each(timeouts, function(i, timeout){
				clearTimeout(timeout);
			});
			timeouts.splice(0);
		}
	}
	
	function getTip(type, location) {
		//扩展
	}
	
})(jQuery);