/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-2-11 		张超		修正window内部控件无法设置值的问题
 * 2014-2-19		张超		修正多个window之间的覆盖问题
 * 2014-4-8			XIE		BUG #6512 窗口大小设置非法值，进行最大和最小值控制，超过最大值使用最大值，小于最小值使用最小值设置，非法值使用默认值处理
 * 2014-4-18        周智星      BUG #6419 [window：弹出窗口]-标题设置问题
 * 2014-4-25		XIE		修复IE7去除滚动特性失效问题
 * 2014-4-25		XIE		增加beforeClose和afterClose回调支持
 * 2014-09-19       zhangsu  STORY #9768 [财富管理事业部/陈凯][TS:201409170213]-JRESPlus-ui-需求2：目前在弹出框1中，弹出一个弹出框2，此时弹出框1的滚】
 * 2014-09-19       zhangsu  STORY #9769 [财富管理事业部/陈凯][TS:201409170212]-JRESPlus-ui-需求1：弹出框支持初始化最大化显示该需求比较紧急，是】
 * 2014-09-19       zhangsu  STORY #9774 [财富管理事业部/陈凯][TS:201409180057]-JRESPlus-ui-目前在一个父页面中弹出一个弹出框，会把父页面的滚动条隐藏掉
 * 2014-10-21       zhangsu  STORY #9803 [经纪业务事业部/胡志武][TS:201409230018]-JRESPlus-ui-事件错误：Horn.Window 做初始化的时候有一句话：Horn.getUIReady()( 
 * 2014-12-22		wangyb10555	STORY #10588 [财富管理事业部-陈为][TS:201412180593]-JRESPlus-ui-二、弹出对象选择框的大小不随浏览器窗口变化而改变
 * 2015-09-10       zhangsu   STORY #13050 TS:201509090384-资产管理事业部-张翔-目前window窗体不支持滚动条，希望能支持滚动条
 * 2015-10-30       刘龙                需求14582 【TS:201510300212-JRESPlus-资产管理事业部-张翔-jreur框架高度有设置最小高度，这样的宽度设定之后，高度最】
 * 2015-12-02       周智星           需求 #15006 【TS:201511230299-JRESPlus-资产管理事业部-张翔-3.Window滚动条第一次用show方法显示出现滚动条，然后把滚动条拉到最下方，hide关闭或者点击右方叉叉关闭，再通过show方法打开滚动条还是在最下方，滚动条没有复位
 * 2016-2-17        刘龙               需求16304 【TS:201601070245-JRESPlus-财富管理事业部-陈为-12.弹出窗口 不能自动 缩放，进行浏览器缩小，弹出窗口缩小】
  -----------------------------------------------------------------------
 */
/**
 * @name Horn.Window
 * @class
 * 弹出窗口组件<br/>
 * 适用于少量内容的弹出式展示，多用于主业务页面的二级页面，不适合内容较多的页面展示
 */

/**@lends Horn.Window# */

/**
 * 组件的唯一标示
 * @name Horn.Window#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.Window#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 窗口的标题<br/>
 * 标题不宜过长，控制在窗口可展示的范围内，展示一列内容时不要超过8个字符，展示两列时不要超过16个字符，展示三列内容时不要超过25个字符
 * @name Horn.Window#<b>title</b>
 * @type String
 * @default "窗口"
 * @example
 * 无
 */
/**
 * 窗口的宽度<br/>
 * (min:250)小于最小值时使用最小值设置，不设置时使用默认值<br/>
 * 如果设置的宽度大于当前视图（html的window），那么会设置窗口的宽度为当前视图减去30的宽度；
 * <br/>
 * 提示：用来展示一列内容宽度需要250；两列需要500；三列需要750；
 * @name Horn.Window#<b>width</b>
 * @type Number
 * @default 500 
 * @example
 * 无
 */
/**
 * 窗口的高度<br/>
 * (min:150)小于最小值时使用最小值设置，不设置时使用默认值<br/>
 * 如果设置的高度大于当前视图（html的window），那么会设置窗口的高度为当前视图减去30的高度
 * @name Horn.Window#<b>height</b>
 * @type Number
 * @default 500 
 * @example 无
 */
/**
 * 窗口是否可关闭<br/>
 * 
 * @name Horn.Window#<b>closeable</b>
 * @type boolean
 * @default true
 * @example 无
 */
/**
 * 窗口关闭前回调事件<br/>
 * 如果回调函数返回false,则窗口终止关闭动作
 * @name Horn.Window#<b>beforeClose</b>
 * @event
 * @example
 * #@window({"name":"w6","title":"test","beforeClose":"beforeC()"})
    	
    #end
    function beforeC(){
    	alert("关闭之前");
    	return true;
    }
 * 
 */
/**
 * 窗口关闭后回调事件<br/>
 * @name Horn.Window#<b>afterClose</b>
 * @event
 * @example
 *  #@window({"name":"w6","title":"test","afterClose":"afterC()"})
    	
    #end
    function afterC(){
    	alert("关闭之后");
    }
 * 
 */
/**
 * 窗口内容是否支持滚动条<br/>
 * 如果设置此属性为true，当内容的尺寸超出用户配置的可展示height范围后，会在窗口内部出现纵向滚动条；
 * @name Horn.Window#<b>scroll</b>
 * @type boolean
 * @default false
 * @example 无
 */
/**
 * 窗口是否支持拖拽<br/>
 * 如果设置此属性为true，在窗口的任何地方按住鼠标右键都可以拖拽，默认为true；
 * @name Horn.Window#<b>isDrag</b>
 * @type boolean
 * @default true
 * @example 
 * #@window({"scroll":true,"id":"w0","name":"w0","title":"窗口二","height":300,"width":900,"isDrag":true})
 * 
 * #end
 */
/**
 * 窗口的底部按钮栏配置<br/>
 * 
 * @name Horn.Window#<b>buttons</b>
 * @type array
 * @default
 * @example "buttons":[ {"label":"确定","name":"btnOk","event":"todo()","className":"u-btn-primary"}
 *          ,{"label":"取消","name":"btnCancel","event":"todo2()","className":"u-btn-default"} ]
 */
/**
 * 增加配置参数isAuto，可配置为true和false，如果为true则自动缩放，反之则不缩放。<br/>
 * 
 * @name Horn.Window#<b>isAuto</b>
 * @type boolean
 * @default true
 */
Horn.emptyFn = function() {
};
(function($) {

	var types = [ 'DOMMouseScroll', 'mousewheel' ];

	if ($.event.fixHooks) {
		for ( var i = types.length; i;) {
			$.event.fixHooks[types[--i]] = $.event.mouseHooks;
		}
	}

	$.event.special.mousewheel = {
		setup : function() {
			if (this.addEventListener) {
				for ( var i = types.length; i;) {
					this.addEventListener(types[--i], handler, false);
				}
			} else {
				this.onmousewheel = handler;
			}
		},

		teardown : function() {
			if (this.removeEventListener) {
				for ( var i = types.length; i;) {
					this.removeEventListener(types[--i], handler, false);
				}
			} else {
				this.onmousewheel = null;
			}
		}
	};

	$.fn.extend({
		mousewheel : function(fn) {
			return fn ? this.bind("mousewheel", fn) : this
					.trigger("mousewheel");
		},

		unmousewheel : function(fn) {
			return this.unbind("mousewheel", fn);
		}
	});

	function handler(event) {
		var orgEvent = event || window.event, args = [].slice
				.call(arguments, 1), delta = 0, deltaX = 0, deltaY = 0;
		event = $.event.fix(orgEvent);
		event.type = "mousewheel";

		// Old school scrollwheel delta
		if (orgEvent.wheelDelta) {
			delta = orgEvent.wheelDelta / 120;
		}
		if (orgEvent.detail) {
			delta = -orgEvent.detail / 3;
		}

		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;

		// Gecko
		if (orgEvent.axis !== undefined
				&& orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaY = 0;
			deltaX = -1 * delta;
		}

		// Webkit
		if (orgEvent.wheelDeltaY !== undefined) {
			deltaY = orgEvent.wheelDeltaY / 120;
		}
		if (orgEvent.wheelDeltaX !== undefined) {
			deltaX = -1 * orgEvent.wheelDeltaX / 120;
		}

		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);

		return ($.event.dispatch || $.event.handle).apply(this, args);
	}

})(jQuery);

Horn.Window = Horn.extend(Horn.Base,{
					COMPONENT_CLASS : "Window",
					defConf : {
						closeable : true,
						backClickCloseable : false,
						title : "窗口",
						width : 500,
						minWidth : 250,
						maxWidth : 1000,
						height : 500,
						minHeight : 300,
						maxHeight : 600,
						scroll : false,
						isAuto : false
					},
					config : {},
					el : null,
					isShow:false,
					backdrop : null,
					wrapper : null,
					content : null,
					header : null,
					buttonBar : null,
					beforeClose : null,
					afterClose:null,
					beforeCloseFn:function(){return true;},
					afterCloseFn:function(){},
					
					init : function(dom) {
						Horn.Window.superclass.init.apply(this, arguments);
						var el = $(dom);
						this.el = el;
						var win = this;
						this.config = {};
						this.config = $.extend(this.config, this.defConf);
						var isDrag = true;//默认窗口可以拖拽
						if (this.params) {
							$.extend(this.config, this.params || {});
							if (!isNaN(this.el.attr("h_width"))) {
								this.config.width = this.el.attr("h_width");
							} else if (typeof this.el.attr("h_width") == 'string') {
								this.config.width = parseInt(this.el.attr("h_width"));
							}
							if (this.config.width < this.defConf.minWidth) {
								this.config.width = this.defConf.minWidth;
							}
							if (!isNaN(this.el.attr("h_height"))) {
								this.config.height = this.el.attr("h_height");
							} else if (typeof this.el.attr("h_height") == 'string') {
								this.config.height = parseInt(this.el.attr("h_height"));
							}
							// 需求14582 【TS:201510300212-JRESPlus-资产管理事业部-张翔-jreur框架高度有设置最小高度，这样的宽度设定之后，高度最】
							//if (this.config.height < this.defConf.minHeight) {
//								this.config.height = this.defConf.minHeight;
//							}
							if (typeof this.config.closeable == 'string') {

								if (this.config.closeable == 'true') {
									this.config.closeable = true;
								} else if (this.config.closeable == 'false') {
									this.config.closeable = false;
								} else {
									this.config.closeable = this.defConf.closeable;
								}
							}
							if (typeof this.config.closeable != 'boolean') {
								this.config.closeable = this.defConf.closeable;
							}
							if(this.config.beforeClose){
								this.beforeClose=this.config.beforeClose;
								var beforeCloseObj=Horn.Util.getFunObj(this.beforeClose);
								if($.type(beforeCloseObj.fn) == "function"){
					                this.beforeCloseFn = beforeCloseObj.fn ;
					            }
							}
							if(this.config.afterClose){
								this.afterClose=this.config.afterClose;
								var afterCloseObj=Horn.Util.getFunObj(this.afterClose);
								if($.type(afterCloseObj.fn) == "function"){
					                this.afterCloseFn = afterCloseObj.fn ;
					            }
							}
							if(this.params.isDrag==false){
								isDrag = false;
							}
						}
						this.content = el.children(".h_floatdiv-con");
						this.header = el.children(".m-message-header").children(".h_floatdiv-title");
						this.buttonBar = el.children(".h_btndiv");
						if (this.buttonBar.length == 0) {
							this.buttonBar = undefined;
						}
						if (this.buttonBar || true == this.config.scroll
								|| 'true' == this.config.scroll) {
							this.config.scroll = true;
						}
						this.backdrop = $("<div class='h_floatdiv-backdrop'></div>");
						var content = $('<div></div>');
						//this.backdrop.css("width", "100%").css("height", "100%").css("z-index",Horn.Window.getNextZIndex());
						//this.el.css("z-index", Horn.Window.getNextZIndex());
						content.append(this.backdrop);
						content.append(this.el);
						this.wrapper = content;
						$(document.body).append(content);
						content.hide();
						// 设置大小
						if (this.config.width) {
							el.css("width", this.config.width + "px");
						}
						if (this.config.height) {
							el.css("height", this.config.height + "px");
						}
						var closebtn = this.header.children("a");
						if (this.config.closeable) {
							closebtn.bind("click", function() {
								win.hide();
							});
						}else{
							closebtn.hide();
						}

						if (this.config.autoShow) {
							this.show();
						}

						if (this.config.backClickCloseable) {
							this.backdrop.click(function() {
								win.hide();
							});
						}
						//Horn.getUIReady()(el, true); story9803
						$(window).resize(function(){
							if(win.isShow && !win.maximum){
								win.resize();
							}
							
						});
						if(isDrag){
							var id = this.el.attr("id");
							this.windowDrag(id);
						}
						
					},
					windowDrag : function(id){
						$("#"+id).drag({
							handle : ".mod_tt",
							beforedrag : function(pos,self){
								currentDrag = self;
								flag = false;
								$("#opacitynode").remove();
								var ele = self[0];
								//bug(getposx(ele));
								pos.x = geteleposx(ele) + 10;
								pos.y = geteleposy(ele);
								self.before(getopacitynode(ele)).css({position : "absolute", left : pos.x  + "px", top : pos.y + "px"});
							},
							ondraging : function(pos,self){
								var targetNode = null;
								if(targetNode != null){
									//bug(id + "," + getposy(targetNode) + "," + (targetNode === ele) );
									if(targetNode !== ele){
										var $target = $(targetNode);
										//$("#opacitynode").remove();
										$target.after(getopacitynode(targetNode));	
									};
								}else{
									 
									//$("#opacitynode").remove();
									//$("#" + id).prepend(getopacitynode(ele));
								};
							},
							enddrag : function(pos,self){
								var ele = self[0];
								var opacity = $("#opacitynode");
								self.css({position : ""});
								var _cache = document.createDocumentFragment();
								_cache.appendChild(ele);
								opacity.before(_cache);
								_cache = null;
								opacity.hide();
								flag = true;
								 
							},
							unselectClass : "unselect",
							xdrag : true,//容器left是否改变
							ydrag : true//容器top是否改变	
						}).find(".mod_tt").css({
								cursor : "move"	
						});
						var geteleposx = function(ele){
						var ret = 0;
						while(ele !== null){
							ret += ele.offsetLeft;
							ele = ele.offsetParent;
						};
						return ret;
					},
					geteleposy = function(ele){
						var ret = 0;
						while(ele !== null){
							ret += ele.offsetTop;
							ele = ele.offsetParent;
						};
						return ret;
					},
					getopacitynode = function(ele){
						var node = ce("div");
						$(node).attr({id : "opacitynode"});
						var _nodeheight = ie6 ? ele.offsetHeight - 2 : ele.offsetHeight;  
						$(node).css({height : ele.offsetHeight +"px",lineHeight : ele.offsetHeight+"px"});
						return node;
					};
					var getposx = function(el){
						var ret = 0;
						while(el !== null){
							ret += el.offsetLeft;
							el = el.offsetParent;
						};
						return  ret;
					},
					getposy = function(el){
						var ret = 0;
						while(el !== null){
							ret += el.offsetTop;
							el = el.offsetParent;
						};
						return  ret;
					},
					ce = function(tag){
				        return document.createElement(tag);
					},
					ie6 = (function(ua){
						return /msie 6/.test(ua);
					})(navigator.userAgent.toLowerCase());
				},
				setMaximum : function(maximum){
						this.maximum = maximum
					},
					resize:function(w,h){
						var win = $(window), el = this.el, subHeightRange = 0, subWidthRange = 0;
						//需求 #15006 【TS:201511230299-JRESPlus-资产管理事业部-张翔-3.Window滚动条第一次用show方法显示出现滚动条，然后把滚动条拉到最下方，hide关闭或者点击右方叉叉关闭，再通过show方法打开滚动条还是在最下方，滚动条没有复位
						var winScrollTop = $(".h-overflow-auto").scrollTop();
						if(winScrollTop!=null&&winScrollTop!=0){
							$(".h-overflow-auto").scrollTop(0);
						}
						var tHeight = win.height();
						var tWidth = win.width();
						//16304 【TS:201601070245-JRESPlus-财富管理事业部-陈为-12.弹出窗口 不能自动 缩放，进行浏览器缩小，弹出窗口缩小】
						var wHeight = this.config.height;
						var wWidth = this.config.width;
						if(w){
							wWidth = w;
						}
						if(h){
							wHeight = h;
						}
						var wWidth_resize=wWidth;
						var wHeight_resize=wHeight;
						subHeightRange = tHeight - wHeight;
						subWidthRange = tWidth - wWidth;
						if (subHeightRange < 38) {
							subHeightRange = 38;
							wHeight_resize = tHeight - 38;
						}
						
						if (subWidthRange < 38) {
							subWidthRange = 38;
							wWidth_resize = tWidth - 38;
						}
						var wTop = subHeightRange / 2 + $(document).scrollTop();
						var wLeft = subWidthRange / 2
								+ $(document).scrollLeft();
						
						//STORY #10588 [财富管理事业部-陈为][TS:201412180593]-JRESPlus-ui-二、弹出对象选择框的大小不随浏览器窗口变化而改变
						//增加配置参数isAuto，可配置为true和false，如果为true则自动缩放，反之则不缩放
						this.backdrop.css({
							top:$(document).scrollTop(),
							left:$(document).scrollLeft()
						});
						this.el.css({
							top:wTop,
							left:wLeft
						});
						
						if(this.params.isAuto != false){
							this.backdrop.css({
								height:$(window).height(),
								width:$(window).width()
							});

							//BUG #9058 window控件isAuto属性为true时，若是其控件过多，拖动过小，控件会显示到window外边
							var conH = this.el.find(".h_floatdiv-con").outerHeight();
							var conW = this.el.find(".h_floatdiv-con").width();
							var titleH = this.el.find(".h_floatdiv-title").outerHeight();
							var isScroll = (this.params.scroll==true)?true:false;
							this.el.css({
								width:wWidth_resize,
								height:wHeight_resize
							});
							this.el.children("div.h_floatdiv-con").css({height:wHeight_resize-37});
						}
					},
					/**
					 * 根据所传入的宽度和高度重置窗口
					 * 
					 * @name Horn.Window#resetSizeWin
					 * @function
					 * @param {int} w
					 * @param {int} h
					 * @return void
					 * @example
					 * var w = 600;
					 * var h = 300;
					 * Horn.getComp("w0").resetSizeWin(w,h);
					 */
					resetSizeWin:function(w,h){
						this.resize(w,h);
					},
					/**
					 * 显示窗口
					 * 
					 * @name Horn.Window#show
					 * @function
					 * @return void
					 */
					show : function(madel) {
						//if (Horn.Window.getOpen() < 1) {   9768 9774
						if(!$("body").hasClass("h-overflow-hidden")){
							//$("body").addClass("h-overflow-hidden");
						}
						if(!$("html").hasClass("h-overflow-hidden")){
							$("html").addClass("h-overflow-hidden");
						}
						//}
						Horn.Window.getNextOpen();
						this.wrapper.show();
						this.backdrop.css("width", "100%")
						.css("height", "100%").css("z-index",
						Horn.Window.getNextZIndex());
						this.el.css({"z-index":Horn.Window.getNextZIndex()})
						this.el.show();
						this.resize();
						this.isShow=true;
						//scroll为ture时添加滚动条，反之隐藏溢出的内容
						var cHeight = this.el.height() - this.header.outerHeight()+1;
	                    if(this.params.height){
	                    	cHeight = this.params.height - this.header.outerHeight();
						}
						if (this.buttonBar) {
							cHeight = cHeight
									- this.buttonBar.outerHeight();
						}
						if (this.config.scroll) {							
							this.el.css("height","auto");
							this.content.css({
								padding:0,
								margin:0,
								border:0,
								height:cHeight 
							}).addClass("h-overflow-auto");

						} else {
							this.el.mousewheel(function() {
								return false;
							});
							this.content.css({
								padding:0,
								margin:0,
								border:0,
								height:cHeight 
							}).addClass("h-overflow-hidden");
						}

					},
					/**
					 * 隐藏窗口
					 * 
					 * @name Horn.Window#hide
					 * @function
					 * @return void
					 */
					hide : function() {
						 if(this.beforeCloseFn.call()){
								//if (Horn.Window.getPrevOpen() < 1) {   9768 9774
							    if($("body").hasClass("h-overflow-hidden")){
									$("body").removeClass("h-overflow-hidden");
								}
								if($("html").hasClass("h-overflow-hidden")){
									$("html").removeClass("h-overflow-hidden");
								}
								//}
								this.wrapper.hide();
								this.isShow=false;
								this.afterCloseFn.call();
						 }
						 if(top.Horn&&top.Horn.Window){
							 top.Horn.Window.MAX_ZINDEX = top.Horn.Window.MAX_ZINDEX-2;
						}else{
							Horn.Window.MAX_ZINDEX = Horn.Window.MAX_ZINDEX -2;
						}
						 

					},
					/**
					 * 设置窗口标题
					 * 
					 * @name Horn.Window#setTitle
					 * @param {String}title
					 *            标题
					 * @function
					 * @return void
					 */
					setTitle : function(title) {
						this.el.children(".m-message-header").children("h4").text(title);
						//BUG #6419 [window：弹出窗口]-标题设置问题
						this.el.children(".m-message-header").children("h4").attr("title",title);
					}
				});

$.extend(Horn.Window, {
	"DATANAME" : "h_window",
	"MAX_ZINDEX" : 100,
	"OPENED" : 0,
	getNextOpen:function(){
		if(top.Horn&&top.Horn.Window){
			top.Horn.Window.OPENED++;
		}else{
			Horn.Window.OPENED++;
			return Horn.Window.OPENED;
		}
	},
	getPrevOpen:function(){
		if(top.Horn&&top.Horn.Window){
			top.Horn.Window.OPENED--;
			return top.Horn.Window.OPENED;
		}else{
			Horn.Window.OPENED--;
			return Horn.Window.OPENED;
		}
	},
	getOpen:function(){
		if(top.Horn&&top.Horn.Window){
			return top.Horn.Window.OPENED;
		}else{
			return Horn.Window.OPENED;
		}
	},
	getNextZIndex:function(){
		if(top.Horn&&top.Horn.Window){
			top.Horn.Window.MAX_ZINDEX++;
			return top.Horn.Window.MAX_ZINDEX;
		}else{
			Horn.Window.MAX_ZINDEX++;
			return Horn.Window.MAX_ZINDEX;
		}
	},
	"get" : function(name) {
		var arr = Horn.data(Horn.Window.DATANAME);
		var win = arr[name];
		return win;
	}
});
Horn.regUI("div.h_floatdiv", Horn.Window);