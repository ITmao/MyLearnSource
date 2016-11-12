/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2015-04-17		zhangsu	  STORY #11317 [财富管理事业部/徐益江][TS:201504160051]-JRESPlus-ui- 1、调用confirm二次确认框弹出后，敲enter键,遮罩会变黑
 * 2015-04-20       zhangsu   去掉event的判断 11317不支持火狐，
 * 2015-09-30       周智星          需求 #13076 【TS:201509110342-JRESPlus-财富管理事业部-王瑞明-1: 所有的alert和confirm没有遮罩。】
 * 2015-11-30       周智星          需求 #14712 【TS:201511060275-JRESPlus-财富管理事业部-王瑞明-VM弹出确认框遮罩问题，滚动条到中间位置时 再弹出确认框 发】
 * 2015-12-22       周智星         添加例子代码
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.MessageBox
 * @class
 * 消息对话框的封装
 * @extends Horn.Base
 */
	
/**
 * @lends Horn.MessageBox#
 */

/**
 * @description 设置窗口标题
 * @property msgTitle
 * @name msgTitle
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description 设置内容
 * @property msgText
 * @name msgText
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description 设置宽度
 * @property width
 * @name width
 * @type num
 * @default 50%
 * @example
 * 无
 */

/**
 * @description 设置高度
 * @property height
 * @name height
 * @type num
 * @default 50%
 * @example
 * 无
 */

/**
 * @description 设置对话框类型
 * @property msgType
 * @name msgType
 * @type String
 * @default
 * @example
 * 无
 */

var Horn = Horn || {};
;(function(H){
   
	var createMessageBox = function(params){
		if(window.event){                       //11317
			Horn.debug("event keycode = ", window.event.keyCode);
			var eventobj = window.event;
			var firedObj = eventobj.srcElement;
			Horn.debug("firedObj = ", firedObj);
			$(firedObj).blur();
		}
		var msgHtml = '<div class="m-message-positon"  id="h_msg_floatdiv">'+
			         '<div class="m-message-header"><h4 class="m-message-title"></h4></div>'+
			         '<div class="g-wrap m-message-body m-brt-none" >'+
			            '<div class="m-body-words">'+
			              '<span class="m-message-icon"><i class="fa fa-question"></i></span>'+
			            '</div>'+
			         '</div>'+
			         '<div class="h_btndiv m-message-footer"></div>'+
			       '</div>';
		var temp = $(msgHtml);
		
		if(params.msgTitle){
			temp.find('.m-message-header h4').html(params.msgTitle);
			temp.find('.m-message-header').attr("title",params.msgTitle);
		}
		if(params.msgText){
			temp.find('.m-body-words').append(params.msgText);
			temp.find('.m-body-words').attr("title",params.msgText);
		}
		if(params.width){
			temp.css("width",params.width+"px");
		}
		if(params.height){
			temp.css("height",params.height+"px");
		}else{
			temp.css("height","auto");
		}
		if(params.msgType){
			temp.find('.m-message-icon').removeClass().addClass("m-message-icon "+params.msgType);
		}
		if(params.msgCss){
			temp.find('.m-message-icon i').removeClass().addClass("fa "+params.msgCss);
		}
		/**
		 * 展现确定按钮
		 */
	    var OK = "<button type=\"button\" id=\"buttonOK\" class=\"h_btn-submit u-btn u-btn-primary\">确定</button>";
		/**
		 * 展现取消按钮
		 */
		var CANCEL ="<button type=\"button\" id=\"buttonCancel\" class=\"h_btn-cencel u-btn\">取消</button>";
		/**
		 * 展现确定取消按钮
		 */
		var OKCANCEL = OK + CANCEL;
		if(params.msgType && params.msgType == Horn.Msg.CONFIRM){
	    	temp.find('.h_btndiv').html(OKCANCEL);
	    }else{
	    	temp.find('.h_btndiv').html(OK);
	    }
		//需求 #14712 【TS:201511060275-JRESPlus-财富管理事业部-王瑞明-VM弹出确认框遮罩问题，滚动条到中间位置时 再弹出确认框 发】
		var isBoxModel = jQuery.support.boxModel;
	    var documentElement = document.documentElement;
		//可视区域的宽度
       var w = isBoxModel && documentElement.clientWidth ||document.body.clientWidth;
       //可是区域的高度
       var h = isBoxModel && documentElement.clientHeight ||document.body.clientHeight;
       //滚动条的水平偏移量
       var scrollLeft = isBoxModel && documentElement.scrollLeft || document.body.scrollLeft;
       //滚动条的垂直偏移量
       var scrollTop = isBoxModel && documentElement.scrollTop || document.body.scrollTop;
       
       var scrollH = isBoxModel && documentElement.scrollHeight || document.body.scrollHeight;
       var scrollW = isBoxModel && documentElement.scrollWidth || document.body.scrollWidth;
     
       var backdrop_w= "100%";
       var backdrop_h = "100%";
       if(scrollLeft==0&&scrollW<800){
    	   backdrop_w= "100%";
       }else{
    		var tmpW = scrollW+scrollLeft;
           	backdrop_w = tmpW+"px";
       }
       if(scrollTop==0&&scrollH<500){
       		backdrop_h = "100%";
       }else{
    	   var tmpH = scrollH+scrollTop;
          	backdrop_h = tmpH+"px";
       }
       
   	var	currentMessageBox = $('<div></div>').append('<div class="m-message-bg" id="h_msg_bg"></div>').append(temp.clone());
  //需求 #13076 【TS:201509110342-JRESPlus-财富管理事业部-王瑞明-1: 所有的alert和confirm没有遮罩。】
    currentMessageBox.find("div.m-message-bg").css("width", backdrop_w)
	.css("height", backdrop_h);

   	var currentOkBtn=currentMessageBox.find(".h_btn-submit");
   	if(currentOkBtn.length>0){
   		currentOkBtn.unbind("click");
   		currentOkBtn.bind("click",function(){
	   		 if(top.Horn&&top.Horn.Window){
				 top.Horn.Window.MAX_ZINDEX = top.Horn.Window.MAX_ZINDEX-2;
			}else{
				Horn.Window.MAX_ZINDEX = Horn.Window.MAX_ZINDEX -2;
			}
   			currentMessageBox.remove();
   			if(Horn.Window.getPrevOpen()<1){
					$("body").removeClass("h-overflow-hidden");
					$("html").removeClass("h-overflow-hidden");
				}
   			if(params.onOK){
   				params.onOK();	
   			}
   		});	
   	}
   	var currentCancelBtn=currentMessageBox.find(".h_btn-cencel");
   	if(currentCancelBtn.length>0){
   		currentCancelBtn.unbind("click");
   		currentCancelBtn.bind("click",function(){
   			if(top.Horn&&top.Horn.Window){
				 top.Horn.Window.MAX_ZINDEX = top.Horn.Window.MAX_ZINDEX-2;
			}else{
				Horn.Window.MAX_ZINDEX = Horn.Window.MAX_ZINDEX -2;
			}
   			currentMessageBox.remove();
   			if(Horn.Window.getPrevOpen()<1){
					$("body").removeClass("h-overflow-hidden");
					$("html").removeClass("h-overflow-hidden");
				}
   			if(params.onCancel){
					params.onCancel();
				}
   		});	
   	}
   	currentMessageBox.find(".m-message-bg").css("z-index",Horn.Window.getNextZIndex());
   	currentMessageBox.find(".m-message-positon").css("z-index",Horn.Window.getNextZIndex());
		if(Horn.Window.getOpen()<1){
			//$("body").addClass("h-overflow-hidden");
			$("html").addClass("h-overflow-hidden");
		}
		Horn.Window.getNextOpen();
		$('body').prepend(currentMessageBox);
		fixSize(currentMessageBox.find(".m-message-positon"));
		$(window).resize(function(){
			if(currentMessageBox&&!currentMessageBox.is(":hidden")){
				fixSize(currentMessageBox.find(".m-message-positon"));
			}
		});
		currentMessageBox.mousewheel(function() {
			return false;
		});
	};

	
	var fixSize = function(currentMessage){
		var win = $(window), el = currentMessage,subHeightRange = 0, subWidthRange = 0;
		var tHeight = win.height();
		var tWidth = win.width();
		var wHeight = el.height();
		var wWidth = el.width();
		subHeightRange = tHeight - wHeight;
		subWidthRange = tWidth - wWidth;
		var wTop = subHeightRange / 2 + $(document).scrollTop();
		var wLeft = subWidthRange / 2 + $(document).scrollLeft();
		el.css("top", wTop + "px");
		el.css("left", wLeft + "px");
	};     
	var _show = function(settings){
		this.params = {width:350};
		Horn.apply(this.params,settings);
		createMessageBox(this.params);
	};
	H.Msg = {
			/**
			 * info提示的样式
			 * @ignore
			 */
			INFO : "m-message-info",
			/**
			 * 警告提示的样式
			 * @ignore
			 */
			WARNING : "m-message-warning",
			/**
			 * 出错提示的样式
			 * @ignore
			 */
			ERROR :"m-message-error",
			/**
			 * 确认提示的样式
			 * @ignore
			 */
			CONFIRM : "m-message-success",
		
			/**
			 * 根据自定义配置展现对话框
			 * @name Horn.MessageBox#show
			 * @function
			 * @params settings 
			 * @ignore
			 * @example
			 *	msgTitle {String} 对话框标题
			 *	msgText {String} 对话框文本内容 
			 *	width {num} 对话框宽度
			 *	height {num}对话框高度
			 *	msgType () 对话框类型 分为info提示：Horn.Msg.INFO; 警告提示：Horn.Msg.WARNING; 出错提示：Horn.Msg.ERROR; 确认提示：Horn.Msg.CONFIR
			 */
			show :function(settings){
				_show(settings);
			},
			/**
			 * 只带确定按钮的提示窗，用于操作成功后的提示
			 * @name Horn.MessageBox#alert
			 * @function
			 * @param {String} title 显示标题
			 * @param {String} text 显示信息
			 * @param {Function} fn 回调函数
			 * @example
			 * Horn.Msg.alert("提示","点击了ok");或Horn.Msg.alert("提示","这个一个提示信息",function(){alert(1);});
			 */
			alert : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.INFO,
						"msgCss" : "fa-check"
				};
				_show(settings);
			},
			/**
			 * 只带确定按钮的警告提示窗
			 * @name Horn.MessageBox#warning
			 * @function
			 * @param {String} title 显示标题
			 * @param {String} text 显示信息
			 * @param {Function} fn 回调函数
			 * @example
			 * Horn.Msg.warning("提示","点击了ok");或Horn.Msg.warning("提示","这个一个提示信息",function(){alert(1);});
			 */
			warning : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.WARNING,
						"msgCss" : "fa-exclamation"
				};
				_show(settings);
			},
			wraning : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.WARNING,
						"msgCss" : "fa-exclamation"
				};
				_show(settings);
			},
			/**
			 * 只带确定按钮的错误提示窗
			 * @name Horn.MessageBox#error
			 * @function
			 * @param {String} title 显示标题
			 * @param {String} text 显示信息
			 * @param {Function} fn 回调函数
			 * @example
			 * Horn.Msg.error("提示","点击了ok");或Horn.Msg.error("提示","这个一个提示信息",function(){alert(1);});
			 */
			error : function(title,text,fn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : fn,
						"msgType" : this.ERROR,
						"msgCss" : "fa-times"
				};
				_show(settings);
			},
			/**
			 * 带确定、取消按钮的确认对话框
			 * @name Horn.MessageBox#confirm
			 * @function
			 * @param {String} title 显示标题
			 * @param {String} text 显示信息
			 * @param {Function} okFn ok回调函数
			 * @param {Function} cancelFn 取消回调函数
			 * @example
			 * Horn.Msg.confirm("确认","是否确认",function(){
			 *		Horn.Msg.alert("提示","点击了ok");
			 *	},function(){
			 *		Horn.Msg.alert("提示","点击cancel");
			 *	})
			 */
			confirm : function(title,text,okfn,cancelfn){
				var settings = {
						"msgTitle" :title,
						"msgText" :text,
						"onOK" : okfn,
						"onCancel" : cancelfn,
						"msgType" : this.CONFIRM,
						"msgCss" : "fa-question"
				};
				_show(settings);
			}
	};
	
})(Horn);