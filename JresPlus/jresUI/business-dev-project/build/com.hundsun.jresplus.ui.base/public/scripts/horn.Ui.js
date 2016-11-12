/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-4-25 		周智星	BUG #6859 【tip】Horn.Tip.info传入的消失时间不是延迟消失的时间，而是开始消隐到真正消失的时间
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Tip
 * @class
 * 提示信息组件<br/>
 * 消息提示，包含成功提示、警告提示、错误提示
 * 在延迟时间到达时，提示框自动隐藏或通过点击提示框马上隐藏
 */

/**
 * @lends Horn.Tip#
 */
 var Horn = Horn || {};
;(function(H){
	Horn.Tip = new (function(){
		function show(el,second){
            el.click(function(){
                $(this).remove();
            });
            $(el).delay(2000).fadeOut(second);
			//var next = $(el).next() ;
		//	$(el).slideDown(1000,"swing",function(){
			//	show(next,second);
		//	}).delay(second * 1000).slideUp(1000,"swing") ;
		}
		
        /**
         * 初始化提示消息显示效果
         * @ignore
         * @function
         * @name Horn.Tip#init
         * @param {Number}毫秒
         */
		this.init = function(second){
			var tip = $("div.h_tips") ;
			var first = tip.children("div").first() ;
				show(first,second?second:Horn.Tip.AUTO_HIDE_DELAY_SEC) ;
		} ;
        /**
         * 清空提示消息内容
         * @function
         * @name Horn.Tip#clear
         * @ignore
         */
		this.clear = function(){
			var tip = $("div.h_tips") ;
			tip.children("div:hidden").remove() ;
		} ;
        /**
         * 添加提示消息
         * @function
         * @name Horn.Tip#addTip
         * @param type 提示类型
         * @param message 提示消息
         * @ignore
         */
		this.addTip = function(type,message){
			if (arguments.length == 1){
				return this.addTip(Horn.Tip.TYPES.INFO, type);
			}
			var css = "";
			if(type ==  Horn.Tip.TYPES.INFO){
				css = Horn.Tip.CSS.INFO;
			}else if(type ==  Horn.Tip.TYPES.WARNING){
				css = Horn.Tip.CSS.WARNING;
			}else if(type ==  Horn.Tip.TYPES.SUCCESS){
				css = Horn.Tip.CSS.SUCCESS;
			} 
			var tip = $("div.h_tips") ;
			var isFirst = false ;
			if(tip.length==0){
				isFirst = true ;
				tip = $('<div class="h_tips"></div>') ;
				tip.appendTo($(document.body)) ;
			}
			if(message){
				var style = "" ;
				if(isFirst){
					if(Horn.fixed_){
						tip.css("position","fixed");
					}
				}
				if(!isFirst){
		//			style = "style='display:none;'" ;
				}
				var cssSplit = css.split(";");
				var css1 = cssSplit[0];
				var css2 = cssSplit[1];
				tip.prepend($("<div class=\"m-tip-box "+css1+"\" "+style+"><span><i class=\"fa "+css2+"\"></i></span> "+message+"</div>")) ;
				//tip.prepend($("<div class='"+css+"' "+style+">"+message+"</div>")) ;
			}
		} ;
        /**
         * 添加提示消息
         * @function
         * @name Horn.Tip#addTips
         * @param {Array} messages 提示消息数组
         * @ignore
         */
		this.addTips = function(type,messages){
			if (arguments.length == 1){
				return this.addTips(Horn.Tip.TYPES.INFO, type);
			}
			if(messages && messages.length){
				for(var i=0;i<messages.length;i++){
					this.addTip(type,messages[i]) ;
				}	
			}
		};
	}) ;
	
	Horn.apply(Horn.Tip,{
        /**
         * @description 提示消息种类
         * @field
         * @static
         * @private
         * @name Horn.Tip#TYPES
         */
		TYPES :{
			INFO : "C",
			WARNING : "W",
			SUCCESS :"S"
		},
        /**
         * @description 提示消息对应的css
         * @field
         * @static
         * @private
         * @name Horn.Tip#CSS
         */
		CSS : {
			INFO : "m-tip-warning;fa-exclamation",
			WARNING : "m-tip-error;fa-close",
			SUCCESS :"m-tip-success;fa-check"	
		},
        /**
         * @description 自动隐藏的延迟时间
         * @field
         * @static
         * @private
         * @name Horn.Tip#AUTO_HIDE_DELAY_SEC
         * @ignore
         */
		AUTO_HIDE_DELAY_SEC : 500,
        /**
         * @description 显示提示消息
         * @function
         * @name Horn.Tip#info
         * @param {string} message 提示消息信息
         * @param {Number} ms 提示框自动隐藏的时间以毫秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         */
		info : function(message,ms){
			this.show(this.TYPES.INFO,message,ms);
		},
        /**
         * @description 显示警告消息
         * @function
         * @name Horn.Tip#warn
         * @param {string} message 提示消息信息
         * @param {Number} ms 提示框自动隐藏的时间以毫秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         */
		warn : function(message,second){
			this.show(this.TYPES.WARNING,message,second);
		},
        /**
         * @description 显示成功消息
         * @function
         * @name Horn.Tip#success
         * @param {string} message 提示消息信息
         * @param {Number} ms 提示框自动隐藏的时间以毫秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         */
		success : function(message,second){
			this.show(this.TYPES.SUCCESS,message,second);
		},
        /**
         * @description 显示提示消息
         * @function
         * @name Horn.Tip#show
         * @param type 提示消息类型分为三种:(信息)Horn.Tip.TYPES.INFO,(警告)Horn.Tip.TYPES.WARNING,(成功)Horn.Tip.TYPES.SUCCESS
         * @param message 提示消息信息
         * @param ms 提示框自动隐藏的时间以秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         * @ignore
         */
		show : function(type , message,second){
			this.clear();
			this.addTip(type , message);
			this.init(second);
		},
        /**
         * @description 显示提示消息
         * @function
         * @name Horn.Tip#shows
         * @param messages 提示消息信息组 [{"type":Horn.Tip.TYPES.SUCCESS,"message":"联合开户成功"}]
         * @param second 提示框自动隐藏的时间以秒为单位，若ms不为空，隐藏时间为：2000毫秒(提示框停留时间)+ms(提示框渐变消失时间),否则默认为2000毫秒(提示框停留时间)+500毫秒(提示框渐变消失时间)。
         * @return {void}
         * @ignore
         */
        shows : function(messages,second){
            this.clear();
            if(messages && messages.length){
                for(var i=0;i<messages.length;i++){
                    this.addTip(messages[i].type , messages[i].message);
                }
            }
            this.init(second);
        }
	});
	/**
	 * 注册提示消息
	 */
	Horn.register(Horn.Tip.init);
})(Horn);

	 