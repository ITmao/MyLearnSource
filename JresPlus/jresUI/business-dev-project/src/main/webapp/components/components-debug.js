/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-10-11		wangyb	STORY #10009 【TS:201410110004-JRESPlus-海外发展部-胡琦-根据patch20140930_2(jresui1.0.6)】 ,在空参的时候初始化参数
 * -----------------------------------------------------------------------
 */
/**
 * @fileOverview 定义核心对象
 * @version 0.1
 */

/**
 * @name Horn
 * @class Horn
 * Horn对象<br/>
 * Horn UI 的基类对象
 */
/** @lends Horn# */
var Horn = Horn || {
	debug_:false,
	fixed_:true,
    debug: function(funcName, data) {
		if (Horn.debug_ && typeof console != 'undefined' && typeof console.log != 'undefined') {
			console.log(funcName, data);
		}
	}
};
;(function(H){
	var _current = null,_cache = null;
	var _uuid = 0;
    
    var readyFun = [],registerFun = [];
	
    var registerUI = [] ;
    
    var cachedDicts = {};
    
    H.cachedDicts={};
    
	/**
	 * @description 继承属性和方法
	 * @function
	 * @name Horn#apply
	 * @param {Object} o 继承对象
	 * @param {Object} c 被继承对象
	 * @ignore
	 */
	H.apply = function(o, c, defaults){
        if(defaults){
            H.apply(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                o[p] = c[p];
            }
        }
        return o;
    };
    function supportFixed(){
		var _div = $('<div style="display:none;position:fixed;z-index:100;"></div>');
		$("body").append(_div);
		return _div.css("position") == 'fixed';
	
    }
    function init() {
    	Horn.fixed_=supportFixed();
    	Horn.debug("Horn.init","regist...");
		for ( var i = 0; i < registerFun.length; i++) {
			registerFun[i]();
		}
		Horn.debug("Horn.init","ready...");
		while (readyFun.length > 0) {
			var fun = readyFun.shift();
			fun();
		}
	}
    H.apply(H, {
    	/**
		 * @description 获取唯一ID
		 * @function
		 * @static
		 * @name Horn#id
		 * @param {Object} prefix 返回ID的前缀
		 * @ignore
		 */
    	id : function(prefix){
    		if(!prefix){
    			prefix = "horn-comp-";
    		}
    		return prefix + (_uuid++);
    	},
    	/**
		 * @description 实现继承
		 * @function
		 * @static
		 * @name Horn#extend
		 * @param {Object} sb 子类类
		 * @param {Object} sp 父类
		 * @param {Object} overrides 需要被重写的类
		 * @ignore
		 */
        extend : (function(){
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    H.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                H.override(sb, overrides);
                sb.extend = function(o){return H.extend(sb, o);};
                return sb;
            };
        })(),
        /**
		 * @description 实现重载
		 * @function
		 * @static 
		 * @name Horn#override
		 * @param {Object} origclass 原始类
		 * @param {Object} overrides 重载对象
		 * @ignore
		 */
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                H.apply(p, overrides);
            }
        },
        /**
		 * @description 获取当前Screen
		 * 
		 * @function
		 * @static 
		 * @name Horn#getCurrent
		 * @ignore
		 */
        getCurrent : function(){
//			//以前的current是放在screen或者是form上，不科学，现在去除了tabforjs，可以不需要这个了。
//        	if(!_current){
//	        	if ($("div.h_tab-screen").children("ul").children("li").size() > 0) {
//					_current = $("div.h_tab-screen").nextAll("div").first();
//				} else {
//					_current = $("div.h_screen");
//				}
//        	}
        	if(_current){
        		return _current;
        	}
        	return $(document.body);
        },
        /**
         * @description 设置当前Screen
         * @function
         * @static
         * @name Horn#setCurrent
         * @param {Object} curr
         * @ignore
         */
        setCurrent : function(curr){
        	if(curr){
        		_current = curr;
        	}
        },
        /**
		 * @description 创建组件
		 * @function
		 * @static 
		 * @name Horn#createComp
		 * @param clazz {Function} 类型
		 * @param args {Object} 参数
		 * @ignore
		 */
        createComp : function(clazz,args){
        	if(typeof clazz == "function"){
        		var cmp = new clazz(args);
        		if(cmp instanceof H.Base){
        			this.data(cmp);
        			return cmp;
        		}
        	}
        	return null;
        },
        _guid:function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        /**
		 * @description 存储/获取组件
		 * @function
		 * @static 
		 * @name Horn#data
		 * @param arg1 {String/Object}
		 * @param arg2 {String} 参数
		 * @ignore
		 */
        data : function(arg1,arg2){
        	if(!_cache){
        		var tempForm = this.getCurrent().find("form");
        		if(tempForm.length > 0){
        			_cache = tempForm.first(); 
        		}else{
        			_cache = this.getCurrent();
        		}
        	}
        	if($.type(arg1)=="object"){//修改当页面中存在重名组件的时候，取重名组件当中配置了id项的那个组件作为返回值。modify by 王玉豹
        		if(!_cache.data("_id_comp_cache")){//修改getCompById为正确的按照id取得组件的方式，这个cache是保存了idComp
        			_cache.data("_id_comp_cache",{});
        		}
        		if(!_cache.data("_el_comp_cache")){//修改getCompById为正确的按照id取得组件的方式，这个cache是保存了idComp
        			_cache.data("_el_comp_cache",{});
        		}
        		var compArr = _cache.data(arg1.getQID());
        		if(!compArr){
        			compArr = new Array();
        		}
        		compArr.push(arg1);
        		if(compArr.length >1){
        			Horn.debug("出现重复组件名：",arg1.getQID());
        		}
        		if(arg1.params&&arg1.params["id"]&&arg1.params["id"]!=""){
        			_cache.data("_id_comp_cache")[arg1.params["id"]]=arg1;
        		}
        		if(arg1.el){
        			var guid = this._guid();
        			arg1.el.data("comp_el_id",guid);
        			_cache.data("_el_comp_cache")[guid]=arg1;
        		}
    			return _cache.data(arg1.getQID(),compArr) ;
    		}
    		else if($.type(arg1)=="string" && arg2){
    			return _cache.data(arg1,arg2) ;
    		}
    		else if($.type(arg1)=="string" && !arg2){
    			return _cache.data(arg1) ;
    		}
    		return _cache.data() ;
        },
        /**
		 * @description 获取组件名称
		 * @function
		 * @static 
		 * @name Horn#getQID
		 * @param arg1 {String} 组件名
		 * @param arg2 {String} 组件别名
		 * @ignore
		 */
        getQID : function(name,alias){
			return name + "$" + (alias || "_") ;
    	},
    	/**
    	 * <b>静态方法</b>
		 * 工具组件的名称获取组件，此方法为静态方法
		 * @function
		 * @static 
		 * @name Horn#getComp
		 * @param  {String} name 组件名称<b>所有组件的名称不能重复，否则只能取到最后一个</b>
		 * @return  {Object} comp 组件对象
		 * @example
		 * Horn.getComp("compName")
		 */
        getComp : function(arg1,arg2){
        	var compArr = this.data(this.getQID(arg1,arg2));
        	if(!compArr){
        		return;
        	}
        	for(var i=0;i<compArr.length;i++){
        		if(compArr[i].params.id && compArr[i].params.id != ""){//修改当页面中存在重名组件的时候，取重名组件当中配置了id项的那个组件作为返回值。modify by 王玉豹
        			return compArr[i];
        		}
        	}
    		return  compArr[compArr.length-1];//修改为返回重名组件的最后一个
        },
        /**
         * @description 根据获取到的el对象来获取对应的组件。
         * 				注意：由于某些组件的el并非是组件化的el，因此可能会导致根据el获取不到对应的组件,
         * 				除非你确定获取到的el是Horn内组件的el，否则不推荐使用。
         * 				。
         * @function
         * @static
         * @name Horn#getCompByEl
         * @param el {JQuery} 使用JQuery获取到的对象
         * @ignore
         */
        getCompByEl : function(el){
        	return H.Base.getCompByEl(el);
        },
        /**
		 * @description 
		 * 		注册初始化方法，创建/扩展框架组件使用
		 * 		框架组件应继承Horn.Base，否则有些特性将无法使用
		 * @function
		 * @static 
		 * @name Horn#register
		 * @param fun {Function} function
		 * @ignore
		 */
        register : function(fun) {
			registerFun.push(fun);
		},
		/**
		 * <b>静态方法</b>
		 * 在页面渲染完成后执行的方法，可注册多次，使用先进先出的执行顺序。<br/>
		 * 执行顺序如下：<br/>
		 * head资源引入的顺序，如果是在components的js加载之前加载，则之前的jquery.ready会先被执行；<br/>
		 * 在components的js加载之后的脚本以及代码中的片段代码遵守以下规则：<br>
		 * Horn.ready的执行顺序优先于jquery.ready<br>
		 * 多个Horn.ready按照代码顺序执行
		 * @function
		 * @static 
		 * @name Horn#ready
		 * @param  {Function} fun 函数
		 * @return {void}
		 * @example
		 * Horn.ready(function(){
    	 *   //TODO
    	 * });
		 */
		ready : function(fun) {
			readyFun.push(fun);
		},
		/**
		 * <b>静态方法</b>
		 * 根据组件id获取组件，此方法为静态方法
		 * @param {String} id <b>所有组件的ID不能重复，否则只能取到第一个</b>
		 * @name Horn#getCompById
		 * @return 
		 * @function
		 * @return  {Object} comp 组件对象
		 * @example
		 * Horn.getCompById("compId");
		 */
	    getCompById : function(id){
	    	return Horn.Base.getCompById(id);
	    },
		/**
		 * @description 
		 * 		注册提交事件，返回false将阻止form提交
		 * @function
		 * @static 
		 * @deprecated 
		 * 		本方案不安全，因此不推荐使用
		 * @name Horn.submitHandler
		 * @param fun {Function} function
		 * @ignore
		 */
		submitHandler : function(fn,_form) {
			var form = $.type(_form)=='string' ? this.getComp(_form) : _form ;
			if(form && form instanceof H.Base){
				form.on('beforesubmit',fn);
			}else{
					var forms = H.getCurrent().find("form");
					forms.each(function(idx,formitem){
						var formComp = H.getCompByEl(formitem);
						if(!formComp){
							H.ready(function(){
								var formComp = H.getCompByEl(formitem);
								formComp.on('beforesubmit',fn);
							});
						}else{
							formComp.on('beforesubmit',fn);
						}
					});
			}
		},
        /**
         * @description 在指定元素下面增加html字符串所表示的元素或页面跳转(html以Redirect:打头)
         * @function
         * @static
         * @name Horn#render
         * @param {string} pageletId 所指定元素的id
         * @param {string} html 所要增加的html字符串
         * @ignore
         */
		render : function(pageletId, html) {
			if (html.indexOf("Redirect:") > -1) {
				window.location = html.substr(9);
			} else {
				$("#" + pageletId).append(html);
			}
		},
        /**
         * @description 初始化页面元素
         * @function
         * @static
         * @name Horn#init
         * @ignore
         */
		init : function(){
			init();
		},
		/**
		 * @description 注册需要初始化的UI
		 * @function
		 * @static 
		 * @name Horn#regUI
		 * @param selector {String} 选择器
		 * @param type {Function} 类型
		 * @ignore
		 */
		regUI : function(selector,type){
			var ui = {} ;
			ui.selector = selector ;
			ui.type = type ;
			registerUI.push(ui) ;
		},
		/**
		 * @description 执行所有初始化方法
		 * @function
		 * @static 
		 * @name Horn#getUIReady
		 * @ignore
		 */
		getUIReady : function(){
			return function(current,sub){
				current = current || H.getCurrent() ;
				function create(list,Class){
					var arr = new Array ;
					list.each(function(i, o) {
						arr.push(H.createComp(Class,o)) ;
					});
					if(Class.DATANAME){
						H.data(Class.DATANAME,sub? arr.concat(H.data(Class.DATANAME)) : arr) ;
					}
				}
				for(var i=0;i<registerUI.length;i++){
					var ui = registerUI[i] ;
					var selects = current.find(ui.selector) ;
					create(selects,ui.type) ;
				}
				Horn.enterToTab(current);
			};
		},
		/**
		 * @description 将enter事件注册为焦点切换
		 * @function
		 * @static 
		 * @name Horn#enterToTab
		 * @ignore
		 */
		enterToTab : function(scope){
	         var inp = scope.find('input:text:visible,input:password:visible');
	         var bindfunc = function (e) {
	             var key = e.which;
	             if (key == 13) {
	                 e.preventDefault();
	                 var nxtIdx = inp.index(this) + 1;
	                 inp.eq(nxtIdx).focus();
	             }
	         };
	         inp.unbind('keydown',bindfunc);
	         inp.bind('keydown', bindfunc);
			
		},
		/**
		 * @description 从字典缓存中获取字典（js）
		 * @function
		 * @static 
		 * @name Horn#getDict
		 * @param {String} 字典名
		 * @ignore
		 */
		/**
         * @description 根据字典名及key获取value（建议使用Horn.Util.getDicts）
         * @function
         * @static 
         * @name Horn#getDict
         * @param {string} dictName 字典名
         * @param {boolean} keys 字典key，可以为单个或多个，多个key以逗号分隔
         * @returns {String} values 字典value，单个或多个，多个value以逗号分隔（当key未定义时返回整个字典）
         */
		getDict : function(dictName, keys){
			if(!H.cachedDicts[dictName]){
				//先把dict解析出来，避免重复查找dom
				var dictUl = $('.hc_checkboxdiv[ref_target='+dictName+'_s]');
				if(!dictUl.get(0)){
					dictUl = $('.hc_checkboxdiv[ref_target='+dictName+'_m]');
				}
				var lis = dictUl.find("li"),
					staticDict = {}
					;
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');
					var key = li.attr('value');
					if(!key){
						key = li.attr('key');
					}
					staticDict[key] = label;
				});
				cachedDicts[dictName] = staticDict;
				H.cachedDicts[dictName] = staticDict;
			}
			if (keys) {
				return H.Util.getDicts(dictName,keys);
			}
			return cachedDicts[dictName];
			
		}
    });
    
    H.register(H.getUIReady());
    $(document).ready(function() {
		init();
	});

	
	/**
	 * @name Horn.Base
	 * @class Horn.Base
	 * Horn.base对象<br/>
	 * Horn UI 的base对象
	 */
	/** @lends Horn.Base# */
	H.Base = function(){
	    this.init.apply(this, arguments);
	};
	H.Base = H.extend(H.Base,{
		COMPONENT_CLASS:"Base",
		/**
		 * @description 组件的name
		 * @field
		 * @type String
		 * @ignore
		 */
		name : null,
		/**
		 * @description 组件的别名
		 * @field
		 * @type String
		 * @ignore
		 */
		alias : null,
		/**
		 * @description 组件所对应的DomElement
		 * @field
		 * @type DomElement
		 * @ignore
		 */
		el : null,
		/**
		 * 从页面进入的参数
		 * @field
		 * @private
		 * @type {Object}
		 * @ignore
		 */
		params : {},
		REG_FUNCTION_NAME:[],
		regFuncs:function(arr){
			this.REG_FUNCTION_NAME=this.REG_FUNCTION_NAME.concat(arr);
			var _base = this, el = this.el;
			if( this.REG_FUNCTION_NAME.length != 0 ){
				for(var i=0 ; i<this.REG_FUNCTION_NAME.length ; i++){
					var funcname = this.REG_FUNCTION_NAME[i];
					if(typeof funcname == 'string' ){
						el[funcname] = function(){
							_base[funcname].apply(_base,arguments);
						};
					}else{
						el[funcname['src']] = function(){
							_base[funcname['tgt']].apply(_base,arguments);
						};
					}
				}
			}
		},
		/**
		 * @ignore
		 */
		regEvents:[],
		/**
		 * @ignore
		 * @function
		 */
		init : function(){
			this.el = $(arguments[0]);
			//this.el.data(H.Base.COMPMENTOBJECT,this);
			this.alias = this.alias || this.el.attr("alias");
			this.name = this.name || this.el.attr("name") ;
			if(this.el&&this.el.attr("paramcacheid")){
				if(Horn.paramCaches){
					this.params = Horn.paramCaches[this.el.attr("paramcacheid")];
					
					//STORY #10009 【TS:201410110004-JRESPlus-海外发展部-胡琦-根据patch20140930_2(jresui1.0.6)】 ,在空参的时候初始化参数
					if(!(this.params)){
						this.params  = {};
					}
					Horn.debug("Horn.UI["+this.COMPONENT_CLASS+"]:params",this.params);
				}
			}
			if ((!this.name) && this.params && this.params.name
					&& !this.el.attr('nonamebyparams')){
				this.name = this.params.name;
			}
			if ((!this.alias) && this.params
					&& this.params.alias){
				this.alias = this.params.alias;
			}
			var name1;
			if (this.params && this.params.name1){
				name1 = this.params.name1;
			}
			this.name = this.name || name1 || H.id();
			this.initCompEvnets();
			this.initStandardEvents();
			this.el.data("QID",this.getQID());
		},
		customEvents : "",
		initStandardEvents : function() {
			var eventTarget = this.getEventTarget && this.getEventTarget();
			var events = this.params && this.params.events;
			if (!events || !eventTarget || !eventTarget.length)return;
			var _this = this;
			$.each(events, function(i, o){
				var eventName = o.event.toLowerCase();
	    		if (_this.customEvents == "" || _this.customEvents.indexOf(eventName) == -1) {
	    			var fn = o["function"] || function(){};
	    			var params = null;
	    			if ($.type(fn) === "string") {
	    				var eventObj = Horn.Util.getFunObj(fn);
	    				fn = eventObj.fn;
	    				params = eventObj.params;
	    			}
	    			if (eventName.indexOf("on") == 0 && $.type(fn) === "function") {
    					eventTarget.bind(eventName.substring(2), params, function(e){
    						//防止指针死循环
    						var _params = [];
    						$.each(params, function(i, p){
    							_params.push(p);
    						});
    						//e.comp 上注册horn对象   9520 
    						var hornObj = _this;
    						e.comp = hornObj;
    						_params.push(e);
    						//return fn.apply(_this, _params); 还原为dom 9520 
    						return fn.apply(this, _params);
    					});
    				}
	    		}
	    	});
		},
		initCompEvnets :function(){
			this.events={};
			if(this.params&&this.params.events){
				var events = this.params.events;
				if(!$.isPlainObject(this.params.events))return;
				for(var key in events){
					var a = Horn.Util.getFunObj(events[key]||'');
					this.on(key,a.fn);
				}
			}
		},
		/**
		 * @description 获取唯一标识
         * @function
		 * @return String
		 * @ignore
		 */
		getQID : function(){
			return H.getQID(this.name,this.alias);
		},
		/**
		 * 所有事件函数
		 * @type {Map}
		 * @ignore
		 */
		events : null,
		/**
		 * 注册一个事件
		 * @param {String} event 事件名称
		 * @param {Function} fn 对应函数
		 * @function
		 * @ignore
		 */
		on : function(event,fn){
			if(!this.events[event]){
				this.events[event] = [];
			}
			this.events[event].push(fn);
		},
		/**
		 * 取消事件
		 * @param {String} event 事件名称
		 * @param {Function} fn 对应函数
		 * @function
		 * @ignore
		 */
		un : function(event,fn){
			var events = this.events[event];
			if(!events){
				return;
			}
			var del = false;
			for(var i =0;i<events.length;i++){
				var eventfn = events[i];
				if(eventfn == fn){
					del = true;
				}
				if( del && i<events.length-1 ){
					events[i] = events[i+1];
				}
			}
			if(del) {
				events.length -=1;
			}
		},
		/**
		 * 执行事件
		 * @param {String} event 事件名称
		 * @param {Object...}  args 执行事件函数时的参数
		 * @return Boolean 执行中断返回false，否则返回true
		 * @function
		 * @ignore
		 */
		fire : function(event){
			var events = this.events[event];
			if(!events) return true;
			var args = [];
			$(arguments).each(function(idx,arg){
				if(idx != 0 ) args.push(arg);
			});
			for(var i = 0; i<events.length ; i++){
				var fn = events[i];
				if(fn.apply(this,args) === false ) {
					return false;
				}
			}
			return true;
		}
	});
	$.extend(H.Base,{
		/**
		 * el.data中存储的HornCompment名称
		 * @type String
		 * @final
		 * @field
		 * @ignore
		 */
		COMPMENTOBJECT:'COMPMENTOBJECT',
		/**
		 * 从dom对象上获取到element
		 * @param {DomElement} el
		 * @return {Horn.Base}
		 * @function
		 */
	    getCompByEl : function(_el){
	    	if(_el instanceof Horn.Base){
	    		return _el;
	    	}
	    	var el = $(_el);
	    	var guid = el.data("comp_el_id");
	    	var comp =_cache.data("_el_comp_cache")[guid];
	    	return comp;
	    },
		/**
		 * 根据id获取到组件对象
		 * @param {String} id
		 * @return {Horn.Base}
		 * @function
		 * @ignore
		 */
	    getCompById : function(id){
//	    	var el = $('#' + id);
	    	var comp =_cache.data("_id_comp_cache")[id];//修改为正确的按照id取值的方式
	    	if(comp){
	    		return comp;
	    	}else{
	    		return;
	    	}
	    }
	});

	jQuery.fn.comp = function(){
		return Horn.Base.getCompByEl(this);
//		return Horn.data(this.data("QID"));
		//return this.data(H.Base.COMPMENTOBJECT);
	};
})(Horn);




/**
 * @fileOverview Horn.Util 工具类
 * @version 0.1
 */
/**
 * @description 工具类
 * @class
 * @name Horn.Util
 * @static
 */
/**
 * @lends Horn.Util
 */
var Horn = Horn || {} ;
;(function(H){ 
	Horn.Util = {
		dictCache : {},
	    /**
	     * @description 改变方法的作用域
         * @function
         * @name Horn.Util.apply
	     * @param {Function} fn 需要改变作用域的方法
	     * @param {Object} scope 作用域
	     */
	    apply : function(fn,scope){
			return (function(){
				return fn.apply(scope,arguments);
			}) ;
		},
		/**
		 * @description 根据字符串，获取事件对象，包括方法和参数
		 * @function
         * @name Horn.Util.getFunObj
         * @param {String} event
		 */
		getFunObj : function(event) {
			//当event为空的时候直接return｛｝
			if(event == "" || !event){
				return {};
			}
			
			var name = event;
			var params = [];
			if (event.indexOf("(") > -1) {
				name = event.substring(0, event.indexOf("("));
				var ps = event.substring(event.indexOf("(") + 1,
						event.indexOf(")")).split(",");
				for ( var i = 0; i < ps.length; i++) {
					if (ps[i]) {
						params.push(eval("(" + ps[i] + ")"));
					}
				}
			}
			
			return {
				"fn" : eval("(window."+name+")"),
				"params" : params
			};
		},
		/**
		 * @description 阻止事件冒泡
		 * @function
     	 * @name Horn.Util.stopPropagation
		 * @param {Event} e
		 */
	    stopPropagation:function(e) {
	        if (e && e.stopPropagation) {
	            //支持w3c的stopPropagation()方法
	            e.stopPropagation();
	        } else {
	            //使用ie的方式取消冒泡
	            window.event.cancelBubble = true;
	        }
	    },
		/**
		 * @description 对象转数组
		 * @function
         * @name Horn.Util.obj2Arr
		 * @param obj {Object} 简单对象
		 * @returns {Array}
		 */
	    obj2Arr : function(obj){
	    	var arr = [] ;
	    	if($.type(obj)=="object"){
	    		for(var i in obj){
	    			if("string,number,boolean".indexOf($.type(obj[i]))>-1){
	    				arr.push({"name":i,"value":obj[i]}) ;
	    			}
	    		}
	    	}
	    	return arr ;
	    },
		/**
		 * @description 数组转对象
		 * @function
         * @name Horn.Util.arr2Obj
		 * @param {Array} serValues jQuery序列化数组
		 * @returns {Object} Object
		 */
	    arr2Obj : function(serValues){
	    	var values = {} ;
			for(var i=0;i<serValues.length;i++){
				var name = serValues[i]['name'] ;
				var value = serValues[i]['value'] ;
				if(values[name]!==undefined && values[name]!=="" && values[name]!==null){
					values[name] = values[name] + "" ;
					if(values[name]){
						values[name] = values[name] +","+ value ;
					}
					else{
						values[name] = value ;
					}
				}
				else{
					values[name] = value ;
				}
			}
			return values ;
	    },
		/**
		 * @description 获取form表单提交数据
		 * @function
         * @name Horn.Util.getValues
		 * @param {Object}form
		 * @returns {Object} Object
		 */
		getValues : function(form){
			var serValues = $(form).serializeArray() ;
			var values = this.arr2Obj(serValues) ;
			return values ;
		},
		/**
         * @description 把对象转换为字符串
         * @function
         * @name Horn.Util.encode
		 * @param {object} object 对象
		 * @returns {String} 转换结果字符串
		 */
		encode : function(object) {
			return (function() {
				var _this = this;
				if(_this===null || _this===undefined){
					return "" ;
				}
				if (_this instanceof Function || _this instanceof RegExp) {
					return _this.toString();
				}
				if (_this instanceof String) {
					return '"' + _this.toString() + '"';
				}
				if (_this instanceof Boolean || _this instanceof Number) {
					return _this.toString();
				}
				if (_this instanceof Date) {
					return _this.getTime();
				}
				if (_this instanceof Object || _this instanceof Array) {
					var tempArr = new Array;
					if (_this instanceof Array) {
						for ( var i = 0; i < _this.length; i++) {
							tempArr.push(arguments.callee.call(_this[i]));
						}
					} else {
						for ( var fieldname in _this) {
							if(_this[fieldname]==null || _this[fieldname]==undefined){
								tempArr.push(arguments.callee.call(fieldname) + ':' + '""');
								continue;
							}
							if (jQuery.type(_this[fieldname]) == 'function' || jQuery.type(_this[fieldname]) == 'regexp') {
								continue;
							}
							if (_this[fieldname] instanceof Object) {
								tempArr.push(arguments.callee.call(fieldname) + ':' + arguments.callee.call(_this[fieldname]));
								continue;
							}
							tempArr.push(arguments.callee.call(fieldname) + ':' + arguments.callee.call(_this[fieldname]));
						}
					}
					var retString = tempArr.join('');
					if (_this instanceof Array) {
						retString = '[' + tempArr.join(',') + ']';
					} else {
						retString = '{' + tempArr.join(',') + '}';
					}
					return retString;
				} else {
					return _this.toString();
				}
			}).call(object);
		},
		/**
         * @description 把字符串转换成对象
         * @function
         * @name Horn.Util.decode
		 * @param {string} string 字符串
		 * @returns {object} 转换结果
		 */
		decode : function(string) {
			return jQuery.parseJSON(string);
		},
		 /**
         * @description 获取url后面所带参数的值
         * @function
         * @name Horn.Util.getParamValue
         * @param {string} name 字符串
         * @returns {string} value 值
         */
		getParamValue : function(name){
		    var value = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]*)(\&?)", "i"));
		    return value ? value[1] : value;
		},
		 /**
         * @description Bigpipe动态加载页面的方法
         * @function
         * @name Horn.Util.loadBp
         * @param {object} d 页面元素id属性值或页面元素dom对象
         * @param {string} url 请求的地址
         * @param {object} data 待发送 Key/value参数
         * @param {string} method get或post
         * @param {object} callback 回调函数
         */
		loadBp : function(d,url,data,method,callback){
			function render(obj, bp) {
		        obj.children().remove();
		        BigPipe.onArrive(bp) ;
		        BigPipe.start();
		        H.getUIReady()(obj) ;
		        if(callback) callback.call(obj,obj,bp);
		    }
	    	data = data || {} ;
	    	var id = d ;
	    	var dom = d ;
	    	if(typeof d=="object"){
	    		dom = $(d) ;
	    		if(!dom.attr("id")){
	    			dom.attr("id",H.id());
	    		}
	    		id = dom.attr("id") ;
	    	}
	    	else if(typeof d=="string"){
	    		dom = $("#" + id) ;
	    	}
	    	else{
	    		return ;
	    	}
	        url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "pagelet=" + id ;
	        if(url.indexOf("http")==-1){
	        	url = context_path+url;
	        }
	        if(method == 'get'){
	        	$.get(url,data,function(result) {
		            render(dom, eval("("+result+")"));
		        });
	        }else{
	        	$.post(url,data,function(result) {
		            render(dom, eval("("+result+")"));
		        });	
	        }
		},
		/**
         * @description 序列化对象
         * @function
         * @name Horn.Util.serializeObject
         * @param {object} param
         * @returns {object} value
         */
		serializeObject : function(param){
			function serArray(per,p){
				var arr = per[p] ;
				for(var i=0 ; i<arr.length; i++){
					var obj = arr[i] ;
					for(var prop in obj){
						if("string,boolean,number".indexOf(jQuery.type(obj[prop]))>-1){
							per[ p + '['+i+'].' + prop] = obj[prop] ;
						}
					}
				}
			}
			if(param && typeof param=='object'){
				for(var p in param){
					if(jQuery.type(param[p])=="array"){
						serArray(param,p);
						delete param[p] ;
					}
				}
			}
			return param ;
		},
        /**
         * @description 动态加载css样式文件
         * @function
         * @name Horn.Util.loadCss
         * @param {string} url 样式地址
         */
		loadCss:function(url){
			BigPipe.onArrive({"html":"","id":H.id(),"css":[url],"js":[],"jsCode":""});
		},
		/**
         * @description 动态加载js文件
         * @function
         * @name Horn.Util.loadScript
         * @param {string} url js文件地址
         */
		loadScript:function(url){
			BigPipe.onArrive({"html":"","id":H.id(),"css":[],"js":[url],"jsCode":""});
			BigPipe.start();
		},
        /**
         * @description 在框架内请求跳转
         * @function
         * @name Horn.Util.jump
         * @param {string} url 样式地址
         * @param {boolean} reload 是否重新载入，若是重新载入，需要加上一个时间戳以规避ie的缓存
         */
		jump : function(url,reload){
			if(Horn.TabScreen){
				this.loadBp(Horn.getCurrent(), url, {},'get');
			}else{
				if(reload){
					url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "_=" + new Date().getTime();
				}
				window.location = url;
			}
		},
		/**
         * @description 根据字典名及key获取value
         * @function
         * @name Horn.Util.getDicts
         * @param {string} dictName 字典名
         * @param {boolean} keys 字典key，可以为单个或多个，多个key以逗号分隔
         * @returns {String} values 字典value，单个或多个，多个value以逗号分隔（当key未定义时返回该字典名字典）
         */
		getDicts : function(dictName, keys) {
			Horn.Util.dictCache = Horn.cachedDicts;
			if (!Horn.Util.dictCache[dictName]) {
//				var dictDivs = $("div.hc_hide_div").children("div.hc_checkboxdiv");
//				var dictDiv;
//				dictDivs.each(function(i, obj){
//					var ref_target_str = obj.getAttribute("ref_target");
//					if (ref_target_str && (ref_target_str.substring(0, ref_target_str.lastIndexOf("_")) == dictName)) {
//						dictDiv = $(obj);
//						return false;
//					}
//				});
//				if (dictDiv) {
//					Horn.Util.dictCache[dictName] = {};
//					dictDiv.find("li").each(function(i, obj){
//						var $obj = $(obj);
//						Horn.Util.dictCache[dictName][$obj.attr("key")] = $obj.attr("title");
//					});
//				} else {
//					return undefined;
//				}
				
				Horn.getDict(dictName);//初始化这个name的cache
				Horn.Util.dictCache = Horn.cachedDicts;
			}
			
			if (keys) {
				if (keys.indexOf(",") != -1) {
					var ks = keys.split(",");
					var values = "";
					$.each(ks, function(i, key){
						if (key) {
							values += "," + Horn.Util.dictCache[dictName][key];
						}
					});
					return values && (values.indexOf(",") != -1 ? values.substring(1) : values);
				} else {
					return Horn.Util.dictCache[dictName][keys];
				}
			} else {
				return Horn.Util.dictCache[dictName];
			}
			
		}
	} ;
})(Horn);

/**
 * @description 获取字符数组
 * @function
 * @name String.toCharArray
 * @returns {Array} array
 */
String.prototype.toCharArray = function() {
	return this.split("");
};
/**
 * @description 获取N个相同的字符串
 * @function
 * @name String.repeat
 * @param {number} num
 */
String.prototype.repeat = function(num) {
	var tmpArr = [];
	for ( var i = 0; i < num; i++)
		tmpArr.push(this);
	return tmpArr.join("");
};
/**
 * @description 逆排序
 * @function
 * @name String.reverse
 */
String.prototype.reverse = function() {
	return this.split("").reverse().join("");
};
/**
 * @description 测试是否是数字
 * @function
 * @name String.isNumeric
 */
String.prototype.isNumeric = function() {
	var tmpFloat = parseFloat(this);
	if (isNaN(tmpFloat))
		return false;
	var tmpLen = this.length - tmpFloat.toString().length;
	return tmpFloat + "0".Repeat(tmpLen) == this;
};
/**
 * @description 测试是否是整数
 * @function
 * @name String.isInt
 */
String.prototype.isInt = function() {
	if (this == "NaN")
		return false;
	return this == parseInt(this).toString();
};
/**
 * @description 合并多个空白为一个空白
 * @function
 * @name String.resetBlank
 */
String.prototype.resetBlank = function() {
	return this.replace(/\s+/g, " ");
};
/**
 * @description 除去左边空白
 * @function
 * @name String.ltrim
 */
String.prototype.ltrim = function() {
	return this.replace(/^\s+/g, "");
};

/**
 * @description 除去右边空白
 * @function
 * @name String.rtrim
 */
String.prototype.rtrim = function() {
	return this.replace(/\s+$/g, "");
};
/**
 * @description 除去两边空白
 * @function
 * @name String.trim
 */
String.prototype.trim = function() {
	return this.replace(/(^\s+)|(\s+$)/g, "");
};

/**
 * @description 保留数字
 * @function
 * @name String.getNum
 */
String.prototype.getNum = function() {
	return this.replace(/[^\d]/g, "");
};

/**
 * @description 保留字母
 * @function
 * @name String.getEn
 */
String.prototype.getEn = function() {
	return this.replace(/[^A-Za-z]/g, "");
};

/**
 * @description 保留中文
 * @function
 * @name String.getCn
 */
String.prototype.getCn = function() {
	return this.replace(/[^\u4e00-\u9fa5\uf900-\ufa2d]/g, "");
};

/**
 * @description 得到字节长度
 * @function
 * @name String.getRealLength
 */
String.prototype.getRealLength = function() {
	return this.replace(/[^x00-xff]/g, "--").length;
};
/**
 * @description 从左截取指定长度的字串
 * @function
 * @name String.left
 * @param {number} n
 */
String.prototype.left = function(n) {
	return this.slice(0, n);
};
/**
 * @description 从右截取指定长度的字串
 * @function
 * @name String.right
 * @param {number} n
 */
String.prototype.right = function(n) {
	return this.slice(this.length - n);
};

/**
 * @description HTML编码
 * @function
 * @name String.HTMLEncode
 */
String.prototype.HTMLEncode = function() {
	var re = this;
	var q1 = [ /x26/g, /x3C/g, /x3E/g, /x20/g ];
	var q2 = [ "&", "<", ">", " " ];
	for ( var i = 0; i < q1.length; i++)
		re = re.replace(q1[i], q2[i]);
	return re;
};
/**
 * @description Unicode转化
 * @function
 * @name String.ascW
 */
String.prototype.ascW = function() {
	var strText = "";
	for ( var i = 0; i < this.length; i++)
		strText += "&#" + this.charCodeAt(i) + ";";
	return strText;
};
/**
 * @description 首字母大写
 * @function
 * @name String.firstUp
 */
String.prototype.firstUp = function(){
	return this.replace(/(^|\s+)\w/g,function(s){return s.toUpperCase();});
};
/**
 * @description 左端补充字符
 * @function
 * @name String.leftPad
 * @param {string} str 原字符串
 * @param {string} pad 补充字符
 * @param {number} len 补充后字符串总长度
 */
String.leftPad = function(str,pad,len) {
	if(!str){
		return str ;
	}
	if(pad!==undefined && pad!=='' && len>0){
		str = str + "" ;
		pad = pad + "" ;
		while(str.length<len){
			str = pad + str ;
		}
	}
	return str ;
} ;
/**
 * @description 元素在数组中的下标
 * @function
 * @name Array.indexOf
 * @param {Object} object 待查找元素
 * @return 元素在数组中的位置，未找到返回-1
 */
if(!Array.indexOf){
    Array.prototype.indexOf = function(Object){
        for(var i = 0;i<this.length;i++){
            if(this[i] == Object){
                return i;
            }
        }
        return -1;
    };
};
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

	 
/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: DataGrid.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：DataGrid组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2016-1-22    刘龙             16742 【DataGrid】列属性dataType为“DATE”时，不生效，页面加载错误
 * 2016-3-15    刘龙             需求#17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
 *-----------------------------------------------------------------------
 */
/**
 * @ignore
 */
	Horn.Util.Format = {
			
			Patterns:{  
				        YEAR      : /y/g,  
				        MONTH     : /M/g,  
				        DAY       : /d/g,  
				        HOUR      : /H/g,  
				        MINUTE    : /m/g,  
				        SECOND    : /s/g,  
				        MILSECOND : /f/g  
			},
			FormatPatterns:function(format){  
		        return eval("/"+  
		                format  
		                .replace(this.Patterns.YEAR,'[0-9]')  
		                .replace(this.Patterns.MONTH,'[0-9]')  
		                .replace(this.Patterns.DAY,'[0-9]')  
		                .replace(this.Patterns.HOUR,'[0-9]')  
		                .replace(this.Patterns.MINUTE,'[0-9]')  
		                .replace(this.Patterns.SECOND,'[0-9]')  
		                .replace(this.Patterns.MILSECOND,'[0-9]')+  
		                "/g");  
		    },  
		    DateISO:function(value,format){  
		        var formatReg = "";  
		        if(value == "" || format=="")  
		            return false;  
		        formatReg = this.FormatPatterns(format);  
		        return formatReg.test(value);  
		    },  
	        /**
	         * Formats the number according to the format string.
	         * <div style="margin-left:40px">examples (123456.789):
	         * <div style="margin-left:10px">
	         * 0 - (123456) show only digits, no precision<br>
	         * 0.00 - (123456.78) show only digits, 2 precision<br>
	         * 0.0000 - (123456.7890) show only digits, 4 precision<br>
	         * 0,000 - (123,456) show comma and digits, no precision<br>
	         * 0,000.00 - (123,456.78) show comma and digits, 2 precision<br>
	         * 0,0.00 - (123,456.78) shortcut method, show comma and digits, 2 precision<br>
	         * To reverse the grouping (,) and decimal (.) for international numbers, add /i to the end.
	         * For example: 0.000,00/i
	         * </div></div>
	         * @param {Number} v The number to format.
	         * @param {String} format The way you would like to format this text.
	         * @return {String} The formatted number.
	         * @ignore
	         */
	        number: function(v, format) {
	            if(!format){
			        return v;
			    }
	            v = Number(v === null || typeof v == 'boolean' ? NaN : v);
	            if (isNaN(v)){
	                return '';
	            }
			    var comma = ',',
			        dec = '.',
			        i18n = false,
			        neg = v < 0;
			
			    v = Math.abs(v);
			    if(format.substr(format.length - 2) == '/i'){
			        format = format.substr(0, format.length - 2);
			        i18n = true;
			        comma = '.';
			        dec = ',';
			    }
			
			    var hasComma = format.indexOf(comma) != -1, 
			        psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);
			
			    if(1 < psplit.length){
			        v = v.toFixed(psplit[1].length);
			    }else if(2 < psplit.length){
			        throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
			    }else{
			        v = v.toFixed(0);
			    }
			
			    var fnum = v.toString();
			    if(hasComma){
			        psplit = fnum.split('.');
			
			        var cnum = psplit[0], parr = [], j = cnum.length, m = Math.floor(j / 3), n = cnum.length % 3 || 3;
			
			        for(var i = 0; i < j; i += n){
			            if(i != 0){
			                n = 3;
			            }
			            parr[parr.length] = cnum.substr(i, n);
			            m -= 1;
			        }
			        fnum = parr.join(comma);
			        if(psplit[1]){
			            fnum += dec + psplit[1];
			        }
			    }
			
			    return (neg ? '-' : '') + format.replace(/[\d,?\.?]+/, fnum);
	        },
			/**
			 * 将制定的字符串格式化为fmt当中的样式
			 * @ignore
			 */
			date:function(dt,fmt){
				var dtTemp=dt;
				if((typeof dt) == "string"){
					dt = dt.trim()
					var tmp = dt;
					var initFmt = function(d){
	    				d = d || "";
	    				if (d.indexOf("/") == -1 && d.indexOf("-") == -1 ) {
	    					return d.substring(0, 4) + "/" + d.substring(4, 6) + "/" + d.substring(6) || "";
	    				}
	    				return d.replace(/\D+/g, "/");
					};
	//				if(dt.length > 8&&Number(dt)){//如果这个数字是8位的就认为这个数字是一个日期的缩写
	//					dt = Number(dt)
	//				}else{
						dt = initFmt(dt)
	//				}
					
					var _tmp = dt.split("/");
					while(_tmp.length<3 ){
						_tmp.push("01")
					}
					dt = _tmp.join("/")
				}								
				var date = new Date(dt) == "Invalid Date" ? new Date(Number(dtTemp)) : new Date(dt);
				if(date == "Invalid Date" || isNaN(date)){
//					Horn.debug("日期格式错误，请检查：",tmp)
					return tmp;
				}else{
					return date.format(fmt);
				}
			},
			all:function(dataType,format,val){
				if(dataType == "DATE"){ //日期格式化
		    		 if(format == null || format == undefined || format.length == 0)
		    			 //format = Horn.Calendar.DEFAULT_FORMAT;
		    			 //16742 【DataGrid】列属性dataType为“DATE”时，不生效，页面加载错误
		    			 format="yyyy-MM-dd HH:mm:ss";
		    		var  input = Horn.Util.Format.date(val,format)
					return input;
		    	}else if(dataType == "AMOUNT"){  //金额格式化
		    		if(format == null || format == undefined || format.length == 0)
		   			   format = "0,000.00";
		    		return Horn.Util.Format.number(val,format);
		    	}else{
		    		return val;
		    	}
			},
			/**
			 * 检验制定的字符串是否符合格式
			 * @param str
			 * @param fmt
			 */
			validateFmt:function(str,fmt){
				//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
				var strReg="^\\d{4}\\d{1,2}\\d{1,2}$"
				var isValid=true;
				if(fmt){
					if(fmt.length>10){
						isValid = Horn.Util.Format.DateISO(str, fmt);  
					}else if(fmt.length>8){
						var firstSeparator=fmt.charAt(4);
						var secondSeparator=fmt.charAt(7);
						var strReg="^\\d{4}"+firstSeparator+"\\d{1,2}"+secondSeparator+"\\d{1,2}$"
						isValid=(new RegExp(strReg)).test(str);
					}else{
						isValid=(new RegExp(strReg)).test(str);
					}
				}else{
					isValid=false;
				}
				return isValid;
			}
	};
	
/**
 * 日期格式化，将日期对象解析为指定格式的日期字符串
 * @ignore
 */
Date.prototype.format=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    } 
    /**
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    } */        
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
};
/**
 * @name Horn.Screen
 * @class
 * 布局组件，该组件是JRESPLUS UI的布局组件，一个页面只允许一个screen存在。
 */
/**
 * @lends Horn.Screen#
 */
	 
/**
 * 组件唯一标识
 * @name Horn.Screen#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 标题
 * @name Horn.Screen#title
 * @type String
 * @default ""
 * @example
 * 无
 */
;{};
/*
 * -------------------------------------------------------------
 * 修订记录
 * 2014-2-19	张超	修正formgrid在重新提交时的验证不通过问题。
 * 2014-06-12   STORY #8553 [经纪业务事业部/胡志武][TS:201406060039-JRESPlus]-future 校验存在问题
 * 2014-07-30   zhangsu  BUG #7327 textarea:输入回车后，调用isvalid(),校验不通过，接着输入字符后，还是不能校验通过
 * 2014-08-26	王玉豹		STORY #9521 [经纪业务事业部-胡志武][【TS:201408250103]-JRESPlus-ui-校验找不到方法，其实有定义相关的校验方法
 * 2014-09-15	王玉豹		STORY #9669 [经纪业务事业部-胡志武][【TS:201408250103]-JRESPlus-ui-校验找不到方法，其实有定义相关的校验方法(更改需求实现方式)
 * 2014-09-22	王玉豹		STORY #9777 [海外发展部/胡琦][TS:201409190229]-JRESPlus-ui-新版UI框架我们项目升级到1.0.5版本后，发现如下问题：
 * 2014-09-22	王玉豹		BUG #7636 #9777tab有未校验通过的组件，第一个下拉组件点击下拉箭头也不展开
 * 2015-04-16   zhangsu     STORY #11315 [财富管理事业部/蔺茂旺][TS:201504160022]-JRESPlus-ui--jresUI还有一个缺陷，目前的手机号码验证不支持177
 * 2015-11-3    刘龙               STORY #14646    【TS:201511030101-JRESPlus-资产管理事业部-张翔-现有日期控件如果是手工输入日期的话，日期控件check属性中】
 * 2016-3-15    刘龙              需求#17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
 * -------------------------------------------------------------
 */
/**
 * 校验
 * @name Horn.Validate
 * @class
 * 表单校验组件
 * @example Horn.Validate.isFormValidate(form)
 */
/**
 * @lends Horn.Validate
 */
Horn.Validate = {
    /**
     * @ignore
     * @constant
     * @description {Sting} 必填字符串
     * @field
     * @default required
     */
    REQUIRED : "required",
    /**
     * @ignore
     * @constant
     * @description 验证属性
     * @field
     * @default check
     */
    CHECK : "check",
    /**
     * @ignore
     * @constant
     * @description 验证规则分隔符,默认为分号
     * @field
     * @default ;
     */
    CHECKSEP : ";",
    /**
     * @ignore
     */
    init : function(dom) {
    	var contain = Horn.getCurrent() ;
    	if(dom){
    		contain = $(dom) ;
    	}
    	else{
    		contain = contain.find("form") ;
    	}
        var _this = this;
        // 初始化表单域
//        var fields =Horn.Field.findFieldCompsIn(contain) ;
//        $(fields).each(
//            function(i, o) {
//                var display = null;
//                var field = o.field;
//                display = field;
//                var type = field.attr("type");
//                if (type == "hidden") {
//                    display = field.next("input");
//                    if(display.length){
//                    	display.bind("change", [ _this, o ],
//                    			Horn.Util.apply(_this.onValid,_this));	
//                    }
//                }
//                if(display.length){
//                    display.bind("blur", [ _this, o ],Horn.Util.apply(_this.onValid,_this));
//                }
//            });
    },
    /**
     * @description 校验指定form对象的有效性
     * @function
     * @name Horn.Validate.isFormValidate
     * @param {object} v 指定form对象(DomElement或Jquery对象)
     */
    isFormValidate : function(v,moreInfo) {
    	if(arguments.length==1){
    		if(typeof arguments[0] == "boolean"){
    			return this.isFormValidate(null, arguments[0]);
    		}
    	}
        var _this = Horn.Validate ;
        var form = null;
        if($(this).length>0 && $(this).prop("tagName")){
            form = $(this);
        }
        else if ($(v).length>0 && $(v).prop("tagName")) {
            form = $(v);
        } else {
            form = Horn.getCurrent().find("form");
        }
        // form grid 的文本框做保护
        var fpanel = form.find("div.h_formgridtitle").nextAll("ul.h_panel") ;
        var inputs = Horn.Field.findFieldsIn(fpanel);
        var fields = Horn.Field.findFieldsIn(form).not(inputs);
        var flag = true;
        var info = [];
        setTimeout(function(){//将所有formgrid里的field组件上的错误清除
        	_this.removeError(inputs) ;
        },100);
        var firestInvalidComp;
        fields.each(function(idx,_field){
        	var field = Horn.getCompByEl(_field);
        	field.validate();
        	if(!field.isValid()) {
        		if(!firestInvalidComp){
        			firestInvalidComp = field;
        		}
        		flag = false;
            	if(moreInfo != undefined) {
            		info.push(field.name);
            	}
        	}
        });
        if(firestInvalidComp){
        	var target = firestInvalidComp.getEventTarget();
        	if(firestInvalidComp instanceof Horn.CalendarGroup){
        		var invalidEle = firestInvalidComp.getInValidEle();
        		if(invalidEle){
            		invalidEle.focus();
        		}
        	}else if(firestInvalidComp instanceof Horn.Combox || firestInvalidComp instanceof Horn.Select || firestInvalidComp instanceof Horn.Calendar){
            	target.data("isFromOuter",true);
            	
            	
            	//不让list显示出来！
            	//STORY #9777 [海外发展部/胡琦][TS:201409190229]-JRESPlus-ui-新版UI框架我们项目升级到1.0.5版本后，发现如下问题：
//            	target.hideList();
//            	target.blur();//获得红色校验未通过的框框
            	target.blur();
        	}
        	else{
            	target.focus();
        	}
        	firestInvalidComp = null;
        }
        if(flag === false){
        	return moreInfo?info:false;
        }
        return flag;
    },
    /**
     * @description 验证指定对象obj(scope)中组名为groupname的组件(textfield,textarea)的有效性,校验全部通过返回真，否则返回假
     * @function
     * @name Horn.Validate.validateAreaByGroup
     * @param {object} obj 指定对象(DomElement或Jquery对象)
     * @param {String} groupname 组名
     * @return boolean 验证通过为真，否则为假
     * @ignore
     */
    validateAreaByGroup : function($obj,groupname){
    	var fields = Horn.Field.findFieldsIn($obj);
        var flag = true;
        fields.each(function(idx,_field){
        	var field = Horn.getCompByEl(_field);
        	if(field&&field.inGroup(groupname)){
        		field.validate();
	        	if(!field.isValid()){
	        		flag = false;
	        	}
        	}
        });
        return flag;
    },
    /**
     * @ignore
     */
    onValid : function(e) {
        var _this = e.data[0];
        var comp = e.data[1];
        var obj = comp.field;
        var field = obj.prev("input[type='hidden']").size()>0 ? obj.prev() : obj ;
        var rules = _this.getRules.call(_this, field);
		/*if(comp instanceof Horn.Calendar || comp instanceof Horn.CalendarGroup){
			if (rules && rules.length > 0 && obj.attr("disabled")==undefined){
				var tempRule = [];
				for(var rule in rules){
					if(rules[rule].name==Horn.Validate.REQUIRED){
						tempRule.push(rules[rule]);
					}
				}
				_this.isValide.call(_this, tempRule, comp, field.val());
			}
	        else{
	            _this.removeError.call(_this, comp);
	        }
		}else{
	        if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
		        _this.isValide.call(_this, rules, comp, field.val());
	        }
	        else{
	            _this.removeError.call(_this, comp);
	        }
		}*/
		//STORY #14646    【TS:201511030101-JRESPlus-资产管理事业部-张翔-现有日期控件如果是手工输入日期的话，日期控件check属性中】
		if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
		        _this.isValide.call(_this, rules, comp, field.val());
	        }
	        else{
	            _this.removeError.call(_this, comp);
	        }
    },
    /**
     * 正则校验规则 @ intege 校验规则名称 @ Message 默认返回消息 @ 校验规则+Message 校验规则对应的返回值<br>
     * 使用例子1:<br>属性check设置为"required",当textfield失去焦点或表单提交时，如果内容为空，则提示"当前输入不能为空"<br>
     * #textfield({"id":"userName","label":"名称","name":"name","cols":"1","maxlength":"20","check":"required"})<br>
     * 使用例子2:<br>属性check设置为"required;intege",多个验证规则之间用";"分割，每个验证规则都通过，此组件才算验证通过。<br>
     * 当textfield失去焦点或表单提交时，如果内容为空,则提示验证提示"当前输入不能为空",如果不为空，但内容非整数，则提示"输入的不是整数格式"<br>
     * #textfield({"id":"userAge","label":"年龄","name":"age","cols":"1","check":"required;intege"})<br>
     * ----------正则验证名字开始---------<br>
     * intege 整数<br>
     * intege1 正整数<br>
     * intege2 负整数<br>
     * num 数字<br>
     * num1 正数<br>
     * num2 负数<br>
     * decmal 浮点数<br>
     * decmal1 正浮点数<br>
     * decmal2 负浮点数<br>
     * decmal3 浮点数<br>
     * decmal4 非负浮点数<br>
     * decmal5 非正浮点数<br>
     * email 邮件<br>
     * url url<br>
     * chinese 仅中文<br>
     * ascii 仅ACSII字符<br>
     * zipcode 邮编<br>
     * mobile 手机<br>
     * ip4  ip地址<br>
     * picture 图片<br>
     * rar 压缩文件<br>
     * date 日期<br>
     * qq QQ号码<br>
     * tel  电话号码的函数(包括验证国内区号,国际区号,分机号)<br>
     * username  用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串<br>
     * letter  字母<br>
     * letter_u 大写字母<br>
     * letter_l 小写字母<br>
     * idcard 身份证<br>
     * required  非空<br>
     * ----------正则验证名字结束---------<br>
     * Message : "输入格式不正确"<br>
     * -----------------------------------<br>
     * integeMessage : "输入的不是整数格式"<br>
     * intege1Message : "输入的不是正整数格式"<br>
     * intege2Message : "输入的不是负整数格式"<br>
     * requiredMessage : "当前输入不能为空"<br>
     * emailMessage : "邮件地址不正确"<br>
     * zipcodeMessage : "邮编输入格式不正确"<br>
     * dateMessage : "日期格式不正确"<br>
     * qqMessage : "QQ号码格式不正确"<br>
     * telMessage : "电话号码格式不正确"<br>
     * mobileMessage : "移动电话格式不正确"<br>
     * decmalMessage : "只能输入浮点数格式"<br>
     * decmal1Message : "只能输入正浮点数格式"<br>
     * decmal2Message : "只能输入负浮点数格式"<br>
     * decmal3Message : "只能输入浮点数格式"<br>
     * decmal4Message : "只能输入非负浮点数格式"<br>
     * decmal5Message : "只能输入非正浮点数格式"<br>
     * colorMessage : "只能输入颜色格式"<br>
     * urlMessage : "只能输入url格式"<br>
     * chineseMessage : "只能输入中文格式"<br>
     * asciiMessage : "只能输入ACSII字符格式"<br>
     * ip4Message : "只能输入ip4地址格式"<br>
     * pictureMessage : "只能输入图片格式"<br>
     * rarMessage : "只能输入压缩文件格式"<br>
     * numMessage : "只能输入数字格式"<br>
     * num1Message : "只能输入正数数字格式"<br>
     * num2Message : "只能输入负数数字格式"<br>
     * letterMessage : "只能输入字母格式"<br>
     * letter_uMessage : "只能输入大写字母格式"<br>
     * letter_lMessage : "只能输入小写字母格式"<br>
     * usernameMessage :"只能输入由数字、26个英文字母或者下划线组成的字符串"<br>
     * -----------------------------------<br>
     */
    regexEnum : {
        intege : "^-?[1-9]\\d*$|^0$", // 整数
        intege1 : "^[1-9]\\d*$", // 正整数
        intege2 : "^-[1-9]\\d*$", // 负整数
        num : "^([+-]?)\\d*\\.?\\d*$", // 数字
        num1 : "^[1-9]\\d*|0$", // 正数（正整数 + 0）
        num2 : "^-[1-9]\\d*|0$", // 负数（负整数 + 0）
        decmal : "^([+-]?)\\d*\\.\\d+$", // 浮点数
        decmal1 : "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$", // 正浮点数
        decmal2 : "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", // 负浮点数
        decmal3 : "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", // 浮点数
        decmal4 : "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$", // 非负浮点数（正浮点数
        // + 0）
        decmal5 : "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$", // 非正浮点数（负浮点数
        // + 0）

        email : "^(\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+){0,1}$", // 邮件
        color : "^[a-fA-F0-9]{6}$", // 颜色
        url : "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", // url
        chinese : "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$", // 仅中文
        ascii : "^[\\x00-\\xFF]+$", // 仅ACSII字符
        zipcode : "^\\d{6}$", // 邮编
        mobile : "^(13|15|18|17)[0-9]{9}$", // 手机
        ip4 : "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$", // ip地址
        notempty : "^\\S+$", // 非空
        picture : "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", // 图片
        rar : "(.*)\\.(rar|zip|7zip|tgz)$", // 压缩文件
        date : "^\\d{4}\\d{1,2}\\d{1,2}$", // 日期
        qq : "[1-9][0-9]{4,11}", // QQ号码
        tel : "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$", // 电话号码的函数(包括验证国内区号,国际区号,分机号)
        username : "^\\w+$", // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        letter : "^[A-Za-z]+$", // 字母
        letter_u : "^[A-Z]+$", // 大写字母
        letter_l : "^[a-z]+$", // 小写字母
        required : "^\\s*\\S[\\S\\s]*$", // 非空    BUG #7327 

        Message : "输入格式不正确",
        integeMessage : "输入的不是整数格式",
        intege1Message : "输入的不是正整数格式",
        intege2Message : "输入的不是负整数格式",
        requiredMessage : "当前输入不能为空",
        emailMessage : "邮件地址不正确",
        zipcodeMessage : "邮编输入格式不正确",
        dateMessage : "日期格式不正确",
        qqMessage : "QQ号码格式不正确",
        telMessage : "电话号码格式不正确",
        mobileMessage : "移动电话格式不正确",
        decmalMessage : "只能输入浮点数格式",
        decmal1Message : "只能输入正浮点数格式",
        decmal2Message : "只能输入负浮点数格式",
        decmal3Message : "只能输入浮点数格式",
        decmal4Message : "只能输入非负浮点数格式",
        decmal5Message : "只能输入非正浮点数格式",
        colorMessage : "只能输入颜色格式",
        urlMessage : "只能输入url格式",
        chineseMessage : "只能输入中文格式",
        asciiMessage : "只能输入ACSII字符格式",
        ip4Message : "只能输入ip4地址格式",
        pictureMessage : "只能输入图片格式",
        rarMessage : "只能输入压缩文件格式",

        numMessage : "只能输入数字格式",
        num1Message : "只能输入正数数字格式",
        num2Message : "只能输入负数数字格式",
        letterMessage : "只能输入字母格式",
        letter_uMessage : "只能输入大写字母格式",
        letter_lMessage : "只能输入小写字母格式",
        usernameMessage :"只能输入由数字、26个英文字母或者下划线组成的字符串"
    },
    /**
     * 方法校验规则 @ range 校验方法名称 @ Message 默认返回消息 @ 校验规则+Message 校验规则对应的返回值<br>
     * 使用例子1:<br>属性check设置为"intege;range(10,20)",当textfield失去焦点或表单提交时，如果录入内容为45,不在整数的10~20(10<=x<=20)之间，供示提示"45不在10-20范围内"<br>
     * #textfield({"id":"userAge","label":"年龄","name":"age","cols":"1","check":"intege;range(10,20)"})<br>
     * 使用例子2:<br>自定义函数验证,期望值与输入值不相同时，返回错误提示信息，否则返回true<br>
     *#textfield({"id":"userName","label":"名称","name":"name","cols":"1","check":"required;myCheck()"})<br>
     *function myCheck(){<br>
     *    var value = Horn.getComp("name").getValue();<br>
     *    if(!("hello"==value)){<br>
     *       return "内容必需为hello";<br>
     *    }else{<br>
     *       return true;<br>
     *    }<br>
     *  }<br>
     * 校验参数，min：最小值，max：最大值,value:校验传入的value值<br>
     * range(value, min, max)<br>
     * 校验参数，value：值，refname：与value比较的元素名字,如果value与refname指定的元素的值相等返回真，否则返回假<br>
     * compare(value,refname)<br>
     * 校验参数，value值，minLen最小长度，maxLen最大长度，如果value的长度在minLen和maxLen之间返回真，否则返回假<br>
     * length(value,minLen,maxLen)<br>
     * 校验参数，value值，输入的日期小于当前日期返回真，否则返回假<br>
     * past(value)<br>
     * 校验参数，value值，输入的日期大于当前日期返回真，否则返回假<br>
     * future(value)<br>
     * 校验参数，value值,身份证号合法时返回真，否则返回假<br>
     * idcard(value)<br>
     *
     */
    funcEnum : {
        /**
         * @param 校验参数，min：最小值，max：最大值
         * @value 校验传入的value值
         */
        range : function(value, min, max) {
            if (min !== undefined) {
                if (value < min) {
                    return false;
                }
            }
            if (max !== undefined) {
                if (value > max) {
                    return false;
                }
            }
            return true;
        },
        rangeMessage : '{0}不在{1}-{2}范围内',
        /**
         * @param {String} value校验的值
         * @param {String} refname对比的组件名称
         */
        compare : function(value,refname){
            var field = Horn.Field.getField(refname);
            if(field.val()!=value){
                return false ;
            }
            return true ;
        },
        compareMessage : '校验不匹配',
        /**
         * 长度判断
         * @param {String} value
         * @param {int} minLen
         * @param {int} maxLen
         * @return {Boolean}
         */
        length : function(value,minLen,maxLen){
            if(value){
                if(value.length>maxLen || value.length<minLen){
                    return false ;
                }
            }
            return true ;
        },
        lengthMessage : '输入的长度{1}-{2}字符之间',
        /**
         * 日期判断，对象日期是否在输入日期之后
         * @param {String} value 校验值
         * @return {Boolean}
         */
        past : function(value){
            var d = new Date() ;
            var year = d.getFullYear() ,
            	month = String.leftPad(d.getMonth() + 1 + "",'0',2),
            	day = String.leftPad(d.getDate() + "", 2, '0') ;
            var dateStr = year + '' + month + '' + day ;
            if(value){
                if(value>=dateStr){
                    return false ;
                }
            }
            return true ;
        },
        pastMessage : '输入的日期{0}必须小于当前日期',
        /**
         * 日期判断，对象日期是否在输入日期之前
         * @param {String} value 校验值
         * @return {Boolean}
         */
        future : function(value){
            var d = new Date() ;
            var year = d.getFullYear() ,
	            month = String.leftPad(d.getMonth() + 1 + "", '0',2) ,
	            day = String.leftPad(d.getDate() + "",'0',2) ;
            var dateStr = year + '' + month + '' + day ;
            if(value){
                if(value<=dateStr){
                    return false ;
                }
            }
            return true ;
        },
        futureMessage : '输入的日期{0}必须大于当前日期',
        /**
         * 身份证判断
         * @param {String} value 校验值
         * @return {Boolean}
         */
        idcard :function(value){
            var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
                21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
                33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
                42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
                51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
                63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
            };
            //身份证验证
            function checkCard(value)
            {
                var card = value;
                //是否为空
                if(card === '')
                {
                    return false;
                }
                //校验长度，类型
                if(isCardNo(card) === false)
                {
                    return false;
                }
                //检查省份
                if(checkProvince(card) === false)
                {
                    return false;
                }
                //校验生日
                if(checkBirthday(card) === false)
                {
                    return false;
                }
                //检验位的检测
                if(checkParity(card) === false)
                {
                    return false;
                }
                return true;
            };
            //检查号码是否符合规范，包括长度，类型
            function isCardNo(card)
            {
                //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
                if(reg.test(card) === false)
                {
                    return false;
                }
                return true;
            };
            //取身份证前两位,校验省份
            function checkProvince(card)
            {
                var province = card.substr(0,2);
                if(vcity[province] == undefined)
                {
                    return false;
                }
                return true;
            };
            //检查生日是否正确
            function checkBirthday(card)
            {
                var len = card.length;
                //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
                if(len == '15')
                {
                    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                    var arr_data = card.match(re_fifteen);
                    var year = arr_data[2];
                    var month = arr_data[3];
                    var day = arr_data[4];
                    var birthday = new Date('19'+year+'/'+month+'/'+day);
                    return verifyBirthday('19'+year,month,day,birthday);
                }
                //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
                if(len == '18')
                {
                    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                    var arr_data = card.match(re_eighteen);
                    var year = arr_data[2];
                    var month = arr_data[3];
                    var day = arr_data[4];
                    var birthday = new Date(year+'/'+month+'/'+day);
                    return verifyBirthday(year,month,day,birthday);
                }
                return false;
            };
            //校验日期
            function verifyBirthday(year,month,day,birthday)
            {
                var now = new Date();
                var now_year = now.getFullYear();
                //年月日是否合理
                if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
                {
                    //判断年份的范围（0岁到120岁之间)
                    var time = now_year - year;
                    if(time >= 0 && time <= 120)
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            };
            //校验位的检测
            function checkParity(card)
            {
                //15位转18位
                card = changeFivteenToEighteen(card);
                var len = card.length;
                if(len == '18')
                {
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var cardTemp = 0, i, valnum;
                    for(i = 0; i < 17; i ++)
                    {
                        cardTemp += card.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[cardTemp % 11];
                    if (valnum == card.substr(17, 1))
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            };
            //15位转18位身份证号
            function changeFivteenToEighteen(card)
            {
                if(card.length == '15')
                {
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var cardTemp = 0, i;
                    card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
                    for(i = 0; i < 17; i ++)
                    {
                        cardTemp += card.substr(i, 1) * arrInt[i];
                    }
                    card += arrCh[cardTemp % 11];
                    return card;
                }
                return card;
            };
            return checkCard(value);
        },
        idcardMessage : '{0}身份证格式不正确',
        Message : '{0}验证未通过'
    },
    /**
     * 字符串根据规则进行应用 @ str 需要操作的字符串 @ params 操作str字符串{}对应的参数
     * @ignore
     */
    applyString : function(format, params) {
        return format.replace(/\{(\d+)\}/g, function(m, i) {
            return params[i];
        });
    },
    /**
     * @ignore
     * @description isValide 校验方法进行校验 @ rules : Array/Function/String @ str 需要操作的字符串
     * @param {String} rules校验规则
     * @param {Object} display 校验对象
     * @param {String} value 校验值
     * 操作str字符串{}对应的参数 @ rules：Array：regtype注册类型，对应正则表达式名称，或校验方法名称，可选；
     *                 regexparam对应正则表达式第二个参数，可选； message 校验失败返回消息； validFun
     *                 自定义校验方法，可选 其他参数查询查询注册方法：funcEnum
     */
    isValide : function(rules, display, value) {
        var _this = this;
        // 检查校验规则
        if (!rules) {
        	alert('fun.isValide 方法校验规则为空，请检查');
            return false;
        }
        // 检查校验规则类型
        var ruleTypes = "string,array,function";
        if (ruleTypes.indexOf($.type(rules)) == -1) {
        	alert('fun.isValide 方法校验规则类型不正确，应为：' + ruleTypes);
            return false;
        }
        var isValid = true;
        // 如果有输入正则表达式，就进行表达式校验
        // 处理校验规则类型，整理类型
        if ((typeof rules) == "string")
            rules = [ {
                "name" : rules,
                "params" : [ value ]
            } ];
        if ((typeof rules) == "function")
            rules = [ {
                'name' : rules,
                "params" : [ value ]
            } ];
        // 循环校验规则
        for ( var index = 0; index < rules.length; index++) {
            var item = rules[index];
            var name = item['name'];
            //17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
            var format=item['format'];
            if(format=="yesConfig"){//如果配置了自定义格式，则根据自定义格式已经在horn.Util.Format.js文件中进行校验，所以返回，否则根据check：date进行校验
            	return;
            }
            if (name === undefined || name === "") {
                return 'name 校验规则为空请检查';
            }
            if(name!="required" && !value){
                continue ;
            }
            var msg = '';
            if (this.regexEnum[name]) {// 正则表达式进行校验
                isValid = (new RegExp(this.regexEnum[name],
                    item['regexparam'])).test(value);
                msg = item['message'] || this.regexEnum[name + 'Message']
                    || this.regexEnum['Message'];
            } else if (this.funcEnum[name]) {// 校验方法进行校验
                isValid = this.funcEnum[name].apply(display, item.params);
                msg = item['message'] || this.funcEnum[name + 'Message']
                    || this.funcEnum['Message'];
            } else if ($.type(eval(name)) == "function") { // 自定义方法校验
            	//STORY #9521 [经纪业务事业部-胡志武][【TS:201408250103]-JRESPlus-ui-校验找不到方法，其实有定义相关的校验方法
            	var tArr = item.params.slice(0) ;
                isValid = eval(name).apply(display, tArr);
                msg = isValid;
            } else {
            	alert("错误的校验类型");
                return false;
            }
            if (isValid !== true) {
                var params = item["params"];
                msg = ($.type(msg) == "boolean" || !msg) ? msg
                    : _this.applyString.apply(value, [ msg, params ]);
                _this.addError.call(_this, display, msg);
                return msg;
            }
        }
        if(display.isValid != Horn.Field.prototype.isValid){
        	setTimeout(function(){
        		var msg = display.isValid();
        		if(msg !== true){
        			_this.addError.call(_this, display, msg);
        		}else{
        			_this.removeError.call(_this, display, msg);
        		}
        	},1);
        	return;
        }
        _this.removeError.call(_this, display);

        return isValid;
    },
    /**
     * @description 获取组件上绑定的校验规则
     * @param {String} 组件名称
     * @private
     */
    getRules : function(name) {
        var _this = this;
        var field = Horn.Field.getField(name);
        var check = field.attr(this.CHECK);
        var format=field.attr("format")
        if (check) {
            var checks = check.split(this.CHECKSEP);
            var rules = [];
            $.each(checks, function(index, c) {
                var rule = _this.getRule(field, c);
                if (rule) {
                	//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
                	rule["format"]=format;
                    rules.push(rule);
                }
            });
            return rules;
        }
    },
    /**
     * @description 获取某一项校验规则
     * @param {String} field组件名称
     * @param {String} rule规则名称
     * @private
     */
    getRule : function(field, rule) {
        /**
         * return : {name:校验规则名称,params:参数列表}
         */
        if (rule) {
            var name = rule;
            var value = field.val();
            var params = [ value ];
            if (rule.indexOf("(") > -1) {
                name = rule.substring(0, rule.indexOf("("));
                var ps = rule.substring(rule.indexOf("(") + 1,
                    rule.indexOf(")")).split(",");
                for ( var i = 0; i < ps.length; i++) {
                    if (ps[i]) {
                        params.push(eval("(" + ps[i] + ")"));
                    }
                }
            }
            return {
                name : name,
                params : params
            };
        }
        return null;
    },
    /**
     * @description 显示错误消息
     * @param {mix} field 为horn组件对象或组件的名字
     * @param {String} errorMsg 错误消息
     */
    addError : function(field, errorMsg) {
	        var tmpfield = (typeof field=="string") ? Horn.getComp(field) : field ;
	        function doshow(tmpfield){
		    	if(tmpfield instanceof Horn.Field){
		    		tmpfield.showError(errorMsg);
		    	}else{
		    		Horn.Tip.addTip(errorMsg);
		    	}
    		}
    		if(!tmpfield){
    			Horn.ready(function(){
    				var tmpfield = (typeof field=="string") ? Horn.getComp(field) : field ;
    				doshow(tmpfield);
    			});
    		}else{
    			doshow(tmpfield);
    		}
    		
    },
    /**
     * @description 删除错误消息
     * @param {mix} field 为horn组件对象或组件的名字
     */
    removeError : function(field) {
       	field = (typeof field=="string") ? Horn.getComp(field) : field ;
    	$(field).each(function(i,f){
    		try{
        		f = Horn.getCompByEl(f) || f ;
        		f.removeError();
    		}catch(e){
    			if(window.console) window.console.warn("批量消除错误失败"+f);
    		}
    	});
    },
    /**
	 * 检验制定的字符串是否符合日期格式
	 * @param str
	 * @param fmt
	 */
    validateFmt:function(str){
    	if(str=="")return true;
		var strReg="^\\d{4}\\d{1,2}\\d{1,2}$"
		var fmt = Horn.Calendar.DEFAULT_FORMAT;
		var isValid=true;
		if(fmt){
			if(fmt.length>8){
				var firstSeparator=fmt.charAt(4);
				var secondSeparator=fmt.charAt(7);
				var strReg="^\\d{4}"+firstSeparator+"\\d{1,2}"+secondSeparator+"\\d{1,2}$"
				isValid=(new RegExp(strReg)).test(str);
				
			}else{
				isValid=(new RegExp(strReg)).test(str);
			}
			if(!isValid){
					isValid ="日期格式不正确,格式："+fmt;
				}
		}else{
			isValid="没有配置Horn.Calendar.DEFAULT_FORMAT格式参数";
		}
		return isValid;
	}
} ;

/*
 * 修改日期                        修改人员        修改说明
 * -------------------------------------------------------------------------------------
 * 2014-4-8	 XIE		BUG #6662 [button_group]调用setEnable方法时传入非法enabled值，忽略
 * 2014-4-14 周智星              BUG #6643 [button_panel]setEnable设置一个不存在的name
 * -------------------------------------------------------------------------------------
 */
/**
 * @name Horn.ButtonPanel
 * @class
 * 按钮容器组件
 * 
*/

/**@lends Horn.ButtonPanel# */

/**
 * 组件唯一标识<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)
 * @name Horn.ButtonPanel#<b>id</b>
 * @type String
 * @default
 * @example
 * 无
 */
/**
 * 组件的名字<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)
 * @name Horn.ButtonPanel#<b>name</b>
 * @type String
 * @default
 */
/**
 * 组件所占的显示列数<br/>
 * 默认仅支持1,2,3,4列<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>)
 * @name Horn.ButtonPanel#<b>cols</b>
 * @type number
 * @default 1
 */
/**
 * 表单中提交按钮的显示标签<br/>
 * 如果要使用默认属性，不要设置此属性，更不要使用空字符串<br/>
 * 支持此属性的按钮容器组件(<b>button_panel</b>)
 * @name Horn.ButtonPanel#<b>submitLabel</b>
 * @type String
 * @default "提交"
 */
/**
 * 表单中重置按钮的显示标签<br/>
 * 如果要使用默认属性，不要设置此属性，更不要使用空字符串<br/>
 * 支持此属性的按钮容器组件(<b>button_panel</b>)
 * @name Horn.ButtonPanel#<b>resetLabel</b>
 * @type String
 * @default "重置"
 */

/**
 * 按钮组件中的自定义按钮配置<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)<br/>
 * 按钮的数据格式:<br/>
 * {"name":"btn1",//按钮组件名称<br/>
 *  "label":"查询",//按钮显示名称<br/>
 *  "className":"u-btn-white",//按钮自定义样式，非必须项。默认提供了u-btn-primary(蓝色)、u-btn-default(灰色)、u-btn-success(绿色)、u-btn-danger(红色)、u-btn-white(白色)和u-btn-warning(黄色)<br/>
 *  "event":"lhkh.query()"//按钮被点击时触发的函数执行<br/><br/>
 *  "refmenu":"test"//该按钮关联的menu组件（菜单）
 * }
 * @name Horn.ButtonPanel#<b>buttons</b>
 * @type Array[Json]
 * @default ""
 * @example
 * 名称 标签 样式名 点击事件
 * "buttons":[{"name":"query","label":"查询","className":"u-btn-white", "event":"lhkh.query()"}] 
 */

Horn.ButtonPanel = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"ButtonPanel",
    init:function(){
        Horn.ButtonPanel.superclass.init.apply(this,arguments);
    },
    /**
     * 设置按纽是否可用，设置为不可用，则单击无响应
     * @function
     * @name Horn.ButtonPanel#setEnable
     * @param {string} name 按纽的名字
     * @param {boolean} enabled 如果为true设置为可用，设置为false，设置不可用,此参数不传入时默认为true;
     * @return {void}
     * @example
     * Horn.getComp("buttonPaneName").setEnable("btnName",false);
     */
    setEnable:function(name,enabled){
    	//BUG #6643 [button_panel]setEnable设置一个不存在的name
    	if(typeof enabled !='boolean'){
    		Horn.Tip.info("enabled属性只能是布尔型！");
    		return;
    	}
        var button = this.el.find("button[name="+name+"]");
        if(button.length==0){
        	Horn.Tip.info(name+",不存在！");
        	return;
        }
        if (typeof enabled =='undefined'|| enabled) {
            button.removeClass("disabled");
            button.removeAttr("disabled");
        } else {
            button.addClass("disabled");
            button.attr("disabled", "disabled");
        }
    }
});
Horn.regUI("div.h_btndiv",Horn.ButtonPanel) ;
Horn.regUI("div.hc_button-group",Horn.ButtonPanel) ;
/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: DataGrid.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：DataGrid组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-07-31    zhangsu         BUG #7336 dataGrid：列头的宽度与数据列宽度应一致
 * 2014-07-31    zhangsu         BUG #7332 dataGrid：当行号较大时，列宽被相应撑开，不会被阻挡 新增属性numberColWidth
 * 2014-07-31    zhangsu         BUG #7335 dataGrid：frozen=字典列被冻结，也能翻译成功
 * 2014-08-01    zhangsu         BUG #7337 dataGrid：加载静态数据时，"pageConfig"不应该产生影响
 * 2014-08-04    zhangsu         BUG #7336 dataGrid：列头的宽度与数据列宽度应一致
 * 2014-08-13    wangyb10555         STORY #9387和STORY #9387添加对表格头的支持
 * 2014-08-18    wangyb10555         添加toolbar的addButton、hideButton、showButton方法
 * 2014-09-01	王玉豹					STORY #9547 [研发中心/内部需求][JresPlus][UI]Datagrid静态数据无法实现分页 
 * 2014-09-14	王玉豹 				STORY #9673 [研发中心/内部需求][JresPlus][UI]datagrid组件中当每一个数据项中的值为数字0的时候无法正常显示，直接显示为“” 
 * 2014-09-23	王玉豹				[经纪业务事业部/胡志武][TS:201409230012]-JRESPlus-ui--DataGrid在ie8浏览器上通过DataGrid获取数据通过getSelecteds (
 * 2014-10-14	王玉豹				STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
 * 2014-10-15 wangyb10555   BUG #7763 #9422datagrid对toolbar增加按钮，无法添加cls
 * 2014-10-15 wangyb10555   BUG #7761 api文档中datagrid新增属性没有添加
 * 2014-10-15 zhangsu       STORY #9800 [经纪业务事业部/胡志武][TS:201409230015]-JRESPlus-ui-DataGrid正在请求数据的时候，表现是这样的
 * 2014-10-31	wangyb10555	STORY #10163 [研发中心/内部需求][JresPlus][UI]datagrid组件中动态加载的表格，当初始化加载完成后后台增加数据量，表格高度没有发生变化 
 * 2014-12-04	wangybao10555	STORY #10413 [海外发展部-胡琦][TS:201412040040]-JRESPlus-ui-目前datagrid控件不支持金额、日期格式，需要支持。
 * 2014-12-22	wangyb10555		STORY #10591 [TS:201412180595][财富管理事业部/陈为]-JRESPlus-ui-1.JresUI框架中datagrid控件分页时，如果翻到第】
 * 2015-1-26	wangyb10555		STORY #10808 [海外发展部-胡琦][TS:201501230291]-JRESPlus--datagrid控件数据列宽支持列宽自适应
 * 2015-2-26	wangyb10555		STORY #10954 [财富管理事业部-吴丰辉][TS:201502150029]-JRESPlus--datagrid希望支持静态字典
 * 2015-2-28	wangyb10555		STORY #10955 [财富管理事业部-吴丰辉][TS:201502150030]-JRESPlus--datagrid支持多列冻结某些场景单列冻结不够用】
 * 2015-3-10	wangyb10555		STORY #11017 [财富管理事业部/吴丰辉][TS:201503090285]-JRESPlus-ui-2. datagrid查询不到数据时，分页条信息没有修改、数】
 * 2015-04-02   zhangsu         STORY #11209 [财富管理事业部/蔺茂旺][TS:201504020254]dataGrid 数据字典列翻译的提示不对
 * 2015-04-17	wangyb10555 	STORY #11316 [财富管理事业部/徐益江][TS:201504160052]-jresplus-ui-2、datagrid控件，当列宽超出可见宽度后出来横向滚动条】
 * 2015-05-04	wangyb10555		STORY #11407 [财富管理事业部/蔺茂旺][TS:201504240187]-JRESPlus-ui-1。在grid，冻结列中，动态添加的内容，滚动条拖到最后，g】 
 * 2015-08-25   zhangsu          STORY #12303 【TS:201507290163-JRESPlus-资产管理事业部-张翔-datagrid是否可以修改下，分页页码，每页几行可以手动输
 * 2015-09-09   zhangsu        BUG 11332跳转到第几页中填入值，移开焦点后，控制台中会显示发送了n条请求
 * 2015-09-10   zhangsu       BUG11302建议每页显示条数是个下拉框，客户使用会更加方便，也能避免输入小数出现的一系列问题
 * 2015-09-21   周智星        STORY #13244 【TS:201509210013-JRESPlus-资产管理事业部-张翔-2、1.0.18版本对应datagrid对应分页选择出现错乱】 - JRES
 * 2015-09-22   周智星        BUG 11640 需求13244datagrid对应分页选择显示框中，请求多次时，会选中多条分页
 * 2015-09-28   周智星        STORY #12660 【TS:201508240145-JRESPlus-财富管理事业部-王瑞明-若在查询框中通过 tab_panel 控件设置多个 Tab,分页则除第一次选择的TAB页外的其他全选按钮会失效 】
 * 2015-10-27   刘龙          STORY #14210 需求12660tabpanel多个页签有datagrid组件，直接点击页签2的全选，会把页签1的全选框也选中
 * 2015-11-06   周智星        STORY 需求#14698 【TS:201511060012-JRESPlus-资产管理事业部-张翔-问题1：选中datagrid中某条数据,然后调load方法，原来选中的内容还在
 * 2015-11-6    刘龙               14700 【TS:201511060024-JRESPlus-财富管理事业部-王瑞明-对于DataGrid 控件的“pageConfig”属性，目】
 * 2015-12-01   周智星         需求 #14790 【TS:201511120068-JRESPlus-财富管理事业部-虞凯 重新选择每页显示条数，点击下一页，页码出错
 * 2016-1-11    刘龙             需求16324 【TS:201601070223-JRESPlus-财富管理事业部-陈为-2. datagrid控件frozen属性固定列之后，标题和】
 * 2016-2-17    刘龙            需求 17276 【TS:201602170281-JRESPlus-财富管理事业部-王瑞明-最近在使用JRES 框架进行开发过程中，发现使用了数据字典的】
 * 2016-3-28    刘龙           需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
 *-----------------------------------------------------------------------
 */
/**
 * @description 带分页栏、工具栏、异步数据加载、锁定列的Grid
 * @name Horn.DataGrid
 * @class
 * 数据列表展现组件
 * --带分页栏、工具栏、异步数据加载、锁定列的Grid
 * @extends Horn.Base
 * @example
 */
	/**
	 * @description 组件唯一标识。
	 * @property id
	 * @name Horn.DataGrid#<b>id</b>
	 * @type String
	 * @default ""
	 * @example
	 * 无
	 */
	/**
	 * @description 组件名称。通过Horn.getComp(name)来获取组件。
	 * @property name
	 * @name Horn.DataGrid#<b>name</b>
	 * @type String
	 * @default ""
	 * @example
	 * ”name":"dataGridName"
	 * Horn.getComp("dataGridName");
	 */
	/**
	 * @ignore
	 * @description 组件标题。
	 * @property title
	 * @name Horn.DataGrid#<b>title</b>
	 * @type String
	 * @default ""
	 * @example
	 * 无
	 */
	/**
	 * @description 列表初始化数据。加载的静态数据,可以使用内置的分页栏，支持前端数据分页特性
	 * @property data
	 * @name Horn.DataGrid#<b>data</b>
	 * @type array
	 * @default ""
	 * @example
	 * "data":$!somedata
	 * somedata为springMVC当中Model中数据集的键
	 */

	/**
	 * @description 组件启用单选/多选选择框,当值为single时为单选列表，仅能够选择一条数据；当其值为multi时为多选列表，可同时选择多条数据。
	 * @property selectModel
	 * @name Horn.DataGrid#<b>selectModel</b>
	 * @type String
	 * @default 无
	 * @example
	 * "selectModel":"single",单选列表
	 * "selectModel":"multi",多选列表
	 */
     
   /**
    * @ignore
	 * @description 序号列的列宽度配置
	 * @property numberColWidth
	 * @name Horn.DataGrid#<b>numberColWidth</b>
	 * @type number
	 * @default 20px
	 * @example 无
	 */

	/**
	 * @description 组件是否自动加载url指向的数据集的控制开关。当autoLoad为true时会自动ajax请求url，并加载请求到的数据。
	 * @property autoLoad
	 * @name Horn.DataGrid#<b>autoLoad</b>
	 * @type boolean
	 * @default false
	 * @example
	 * "autoLoad":true,"url":"/data/get_data.htm"
	 */

	/**
	 * @description 组件初始化加载数据列表的基础参数,基础参数每次请求时都会传入。
	 * @property baseParams
	 * @name Horn.DataGrid#<b>baseParams</b>
	 * @type object
	 * @default 无
	 * @example
	 * 无
	 */
	/**
	 * @description autoWidth可以配置在items中的某一项，使这一列成为根据内容自适应的宽度
					autoWidth可以配置在表上，使当前所有的列都成为根据内容的自适应
					表头也作为其所在列的内容，也会计算长度
					
					如果当前列配置了固定宽又配置了autoWidth则固定宽配置生效（固定宽配置的优先级最高）
					如果当前列为配置了renderer或者dataType或者buttons等会变更数据长度的属性，则autoWidth配置不可使用，请直接使用width配置固定宽
	 * @property autoWidth
	 * @name Horn.DataGrid#<b>autoWidth</b>
	 * @type boolean
	 * @default false
	 * @example
	 * 无
	 */
	/**
	 * @description 表格的列数据模型对象。控制数据列表的列显示状态，包含许多可配置参数。
	 * @property items
	 * @name Horn.DataGrid#<b>items</b>
	 * @type object
	 * @default 无
	 * @example
	 *<table>
	 *	<tr><td>属性名</td>	<td>类型</td>	<td>说明</td>	<td>默认值</td></tr>
		<tr><td>name</td>	<td>sring</td>		<td>列字段名</td>	<td>--</td>	</tr>
		<tr><td>text</td>		<td>string	</td>	<td>列标题</td>	<td>--</td>	</tr>
		<tr><td>hAlign</td>	<td>string	</td>	<td>设置列标题居左、居中、居右显示；分为："left"，"center"，"right"</td>	<td>center</td>	</tr>
		<tr><td>tAlign</td>	<td>string</td>	<td>设置单元格内容居左、居中、居右显示分为："left"，"center"，"right"</td>	<td>left</td>	</tr>
		<tr><td>hidden</td>	<td>boolean</td>	<td>是否隐藏列</td>	<td>false</td>	</tr>
		<tr><td>renderer</td>	<td>	func</td>	<td>列渲染函数,函数参数:Object,例如{val : String ,rowdata : Object,alldata : Array,table : this,rowidx :num,tdidx : num,tr : jquery,td : jquery}}，其中rowData代表行数据，allData代表所有行的数据，table代表当前组件的对象，rowidx代表行索引，tdidx代表单元格的索引，tr代表行的jquery对象，td代表单元格的jquery的对象</td>	<td>--</td>	</tr>
		<tr><td>dictName</td>	<td>string</td>	<td>列翻译的字典条目名称</td>	<td>--</td>	</tr>
		<tr><td>width</td>	<td>numbe</td>	<td>列宽	px</td>	<td>--</td>	</tr>
		<tr><td>buttons</td>	<td>array</td>	<td>操作列, 设置此属性后，属性值会被渲染成多个链接</td><td>--</td>	</tr>
		</table>
		新增：
		format      {String}   列格式化时的格式 ，需要与dataType属性结合使用，单独设置此值不生效。1.dataType="DATE"时，format格式形如"yyyyMMdd"；2.dataType="AMOUNT"时，format格式形如",.00"，其中逗号控制是否显示千位分隔符，点号控制小数位数。
		dataType    {String}   列格式化的类型，目前只支持日期和金额两种类型，日期：dataType="DATE",金额dataType="AMOUNT"。1.如果不设置format属性，"DATE"默认显示格式为："yyyy-MM-dd HH:mm:ss"，"AMOUNT"默认显示格式为："0,000.00"。2.dataType="DATE"时，待格式化列的数据若为字符串，只能是6位，形式如："20130101";若为非字符串形式，一律按GMT时间进行格式化，形式如：1137075575000。
		items		{object}   增加对静态字典的支持，注意：1.items不能和dictName同时使用！2.如果字典无法成功翻译，则保持原值不变；
		
			使用方法：{
			"name":"name6",
			"text":"字段6",
			"hAlign":"right",
			"tAlign":"right",
			"items":[{"label":"杭州总部","value":"0"},{"label":"b","value":"2"},{"label":"c","value":"3"}]
			}
		
		新增：
		autoWidth {boolean} 用于配置是否使用自适应宽度（使用及注意事项请参考）Horn.DataGrid#<b>autoWidth</b>
	 * "items":[{"name":"name1","text":"列名","hAlign":"center","tAlign":"left","hidden":false,"renderer":"func","dictName":"dict","width":200}]
	 *  *renderer属性用法示例：
	 *{"name":"scanType2","text":"扫描类别","renderer":"domrender","hidden":false,"width":"350"}
	 *
	 *#jscode()
	 *
	 *  function domrender(obj){
	 *    var val = obj.val;
	 *    if(val==0){
	 *    	return "返回想要翻译的值";
	 *    }else{
	 *    	return val;
	 *    }
	 *  }
	 *#end
	 */
	/**
	 * @description 数据请求的地址。请求该地址后返回的数据为符合要求的json数据对象。
	 * @property url
	 * @name Horn.DataGrid#<b>url</b>
	 * @type string
	 * @default ""
	 * @example
	 *后台返回的数据格式例子：
	 *total：总条数
	 *rows :数据集[分页场景存在，返回的数据结构]
 	*{"total":200,
 	* "rows":[{"id":"1","name":"zhangsan"},
        {"id":"2","name":"zhangsan"},
        {"id":"3","name":"zhangsan"}]
	 */
	/**
	 * @description 列表是否配置序号列的开关。默认不配置序号列。
	 * @property numbercolumn
	 * @name Horn.DataGrid#<b>numbercolumn</b>
	 * @type boolean
	 * @default false
	 * @example
	 * 无
	 */
	 	/**
	 * @description datagrid的标题展示。
	 * @property title
	 * @name Horn.DataGrid#<b>title</b>
	 * @type string
	 * @default 无
	 * @example
	 * 无
	 */
	 	/**
	 * @description datagrid的titleButton显示。
	 * @property buttons
	 * @name Horn.DataGrid#<b>buttons</b>
	 * @type object
	 * @default 无
	 * @example
	 * 默认的图标样式有add/edit/query/del/save/refresh/open
	 * 还可以在按钮中关联menu组件，配置方式为，"refmenu":"test"//该按钮关联的menu组件（菜单）
	 * "buttons":[{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"}]
	 * 默认提供了add,edit,del,save,query,refresh,open供选择
	 * @example
	 * "buttons":[{"label":"新增","cls":"add","refmenu":"test11","event":"add()"},
	 *	              {"label":"修改","cls":"edit","refmenu":"test11","event":"edit()"},
	 *				  {"label":"删除","cls":"del","refmenu":"test11"},
	 *				  {"label":"保存","cls":"save","refmenu":"test11"},
	 *				  {"label":"查询","cls":"query","refmenu":"test11"},
	 *				  {"label":"刷新","cls":"refresh","refmenu":"test11"},
	 *				  {"label":"打开","cls":"open","refmenu":"test11"}
	 *				  ]
	 */
	/**
	 * @description 配置表格的高度的属性，默认是自适应宽高。
	 * @property height
	 * @name Horn.DataGrid#<b>height</b>
	 * @type number
	 * @default 无
	 * @example
	 * 无
	 */
	/**
	 * @description 配置表格的宽度的属性，默认是自适应宽高。
	 * @property width
	 * @name Horn.DataGrid#<b>width</b>
	 * @type number
	 * @default 无
	 * @example
	 * 无
	 */
	/**
	 * @description 如果有绑定表单，就会把表单参数提交到后台。
	 * @property bindFormName
	 * @name Horn.DataGrid#<b>bindFormName</b>
	 * @type String
	 * @default 无
	 * @example
	 * "bindFormName":"formName"
	 */
	/**
	 * @description 配置点击行选中的开关。默认不开启。配置开启后当点击列表行会主动选中这一行的数据而不需要点击选择框。
	 * @property rowSelect
	 * @name Horn.DataGrid#<b>rowSelect</b>
	 * @type boolean
	 * @default false
	 * @example
	 * "rowSelect":true可以开启行选中
	 */
	/**
	 * @description 配置是否启用分页栏的开关，默认不开启分页栏。同时可以支持静态数据和动态加载，以及loadData的分页
	 * @property hasPage
	 * @name Horn.DataGrid#<b>hasPage</b>
	 * @type boolean
	 * @default false
	 * @example
	 * "hasPage":true可以配置开启分页栏,
	 * 暂时对于静态数据不提供分页栏！
	 */
	/**
	 * @description 配置分页栏的参数，仅在开启分页栏的时候有效。
	 * @property pageConfig
	 * @name Horn.DataGrid#<b>pageConfig</b>
	 * @type object
	 * @default 无
	 * @example
	 * "pageConfig":{"pageSize":20,"pageNo":3}
	 * 其中pageSize表示每页的显示的数据条数;pageNo为当前显示页数，当pageNo值大于实际总页数时，自动取实际最大页码数
	 */
	/**
	 * @description 1.冻结列的配置项，支持单列冻结和多列冻结，冻结的数据列在横向滚动时保持位置不变。
	 * 2.此属性支持IE8及以上，不支持IE7。3.不建议配置超过三列的冻结内容（冻结列过多会影响datagrid渲染的效率和性能！）,不建议在弹出窗口(window组件)上使用
	 * 4.冻结列区域上不支持单击、双击事件的触发。
	 * @property frozen
	 * @name Horn.DataGrid#<b>frozen</b>
	 * @type string或者array
	 * @default 无
	 * @example
	 * “frozen”:["name1","name2"]，可以冻结items当中name属性配置为name1,name2的那两列列数据。
	 */
/**
 * @description 事件属性，所有的事件都需要在此配置
 * @name Horn.DataGrid#<b>events</b>
 * @type Array 
 * @default 无
 * @example
 *  "events":[{      "event":"rowClick","function":"testRowClick"},
 *		             {"event":"rowDblclick","function":"testRowDblClick"},
 *					 {"event":"beforeLoad","function":"testbeforeLoad"},
 *					 {"event":"loadSuccess","function":"testloadSuccess"},
 *					 {"event":"loadError","function":"testloadError"}]
 */

/**
 * 行单击事件<br/>
 * @name Horn.DataGrid#<b>rowClick</b>
 * @param {object} rowdata     当前被点击的一行数据
 * @event
 * @example 无
 * 
 */
/**
 * 行双击事件<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @name Horn.DataGrid#<b>rowDblclick</b>
 * @param {object} rowdata     当前被点击的一行数据
 * @event
 * @example 无
 * 
 */
/**
 * 异步数据加载前<br/>
 * @name Horn.DataGrid#<b>beforeLoad</b>
 * @param {jquery object} comp     控件对象
 * @param {object} param       请求的参数
 * @return   如果返回false则取消请求执行
 * @event
 * @example
 * 
 */
/**
 * 异步数据加载成功,且表格初始化后<br/>
 * @name Horn.DataGrid#<b>loadSuccess</b>
 * @param {jquery object} comp      控件对象
 * @param {Array} resultData       返回的结果集
 * @event
 * @example  无
 * 
 */
/**
 * 异步数据加载成功，但数据格式错误时（数据为空）逻辑错误，非ajax请求失败触发<br/>
 * @name Horn.DataGrid#<b>loadError</b>
 * @param {jquery object} comp      控件对象
 * @param {Object} resultData    返回的结果集
 * @event
 * @example  无
 * 
 */
/**
 * @description isDragColumn的表格列是否可以拖动，默认false</br>
 * (注意！如果为true,页面上就必须引入jquery.resizableColumns.mini.js文件，name属性必须填写，否则无法拖动,如果表格自定义了宽度，拖动功能失效。表格不能放在自定义宽度的容器里,如,window组件和tabPanel组件等)
 * @property isDragColumn
 * @name Horn.DataGrid#<b>isDragColumn</b>
 * @ignore
 * @type Boolean
 * @default false
 * @example
 * 无
 */
var optGridId = null;
Horn.DataGrid = Horn.extend(Horn.Base,{
	COMPONENT_CLASS : "DataGrid",
	id:"dyncGrid",
	name:"dyncGrid",
	title:"",
	data :null,
	selectModel:"normal",
	autoLoad : false,
	baseParams:{},
	items:[],
	url:"",
	emptyMsg:"",
	numbercolumn:false,
	rowSelect:false,
	hasPage:false,
	toolbar:null,
	pagebar:null,
	frozen:null,
	frozenObj:null,
	clickFlag:null,
	td_number : '<td style="width:40px;"><div style="TEXT-aLIGN: center;width:40px;">{count}</div></td>',
	td_check :'<td style="width:36px;"><div class="hc-datagrid-cell-check" style="TEXT-aLIGN: center;width:36px;"><input type="{CHECK_TYPE}"  id="{CHECKBOX_ID}"></div></td>',
	td : '<td style="display:{XDATAGRID_TD_HIDDEN};WIDTH:{XDATAGRID_TD_WIDTH}px"><div  class="hc-datagrid-cell" style="TEXT-ALIGN:{XDATAGRID_TD_ALIGN};WIDTH:{XDATAGRID_DIV_WIDTH}px;overflow: visible;">{XDATAGRID_TD_VAL}</div></td>',
	tr : '<tr id="{TR_ID}"  class="{TR_CLASS}">',
	tr_end : '</tr>',
	row_class : 'u-table-bg',
	pageinfo : {totalPagesText:'页，每页{pagesize}条,共{pages}页',displayMsg:'当前显示{from}到{to}，共{total}条记录'},
	reqPageNo:1,
	reqPageSize:10,
	delimiter:",",
	selecteds : [],
	lastSelect : null,
	allCheckboxId : "allcb_datagrid_id",
	numberColWidth : 40,
	bindFormName : null,
	/**
	 * @ignore
	 */
	initParams : function(config){
		var sdv = setDefaultValue;
		sdv(config,"numbercolumn",false);
		sdv(config,"selectModel","normal");
		sdv(config,"items",[]);
		sdv(config,"hasPage",false);
		sdv(config,"rowSelect",false);
		sdv(config,"autoLoad",false);
		Horn.apply(this,config);
		
		//STORY #10955 [财富管理事业部-吴丰辉][TS:201502150030]-JRESPlus--datagrid支持多列冻结某些场景单列冻结不够用】
		if(!config.frozen){
			config.frozen = [];
		}
		if(typeof config.frozen == "object"){
			this.frozenObjs = [];
			for(var j=0;j<config.frozen.length;j++){
				for(var i=0;i<config.items.length;i++){
					var temp = config.items[i];
					if(temp.name == config.frozen[j]){
						this.frozenObjs.push(temp);
					}
				}
			}
			this.frozenObj = this.frozenObjs[0]
		}else{
			//获取冻结列
			for(var i=0;i<config.items.length;i++){
				var temp = config.items[i];
				if(temp.name == config.frozen){
					this.frozenObj = temp;
					this.frozenObjs = [this.frozenObj];
					break;
				}
			}
		}
		
		//初始化pageConfig配置
		if(!this.params.pageConfig){
			this.params.pageConfig = {};
		}
		if(this.params.bindFormName){
			this.bindFormName = this.params.bindFormName;
		}
		if(this.params.id&&this.params.id!=""){
			this.id = this.params.id;
		}else{
			if(this.params.name&&this.params.name!=""){
				this.id = this.params.name;
			}
		}
		//分页对象
		if(this.hasPage&&this.hasPage==true){
			this.createPagebar();
			
		}
		//设置宽高
		if(config["width"])
			this.setWidth(config["width"]);
		
		if(config["height"])
			this.setHeight(config["height"]);
		  
		//this.frozen = this.frozenObj;
	},
	/**
	 * @ignore
	 * 控件初始化配置项
	 */
	init : function(dom){
		this.name = this.params["name"]||this.name;
		Horn.DataGrid.superclass.init.apply(this,arguments) ;
		this.initParams(this.params);
		var _this = this;
		//events
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
		
		this.dataTable = $("#data_"+this.id).children("table");
		this.head_dataTable = $("#head_"+this.id);
		//表格的标题
		this. title = this.params["title"] ||null;
		this. titleEl = null ;
		if(this .title ){
			this. titleEl = $("#wrap_"+this.id).children("div.u-datagrid-header").children("h4");
		}
		
		this.ths = this.head_dataTable.children("tbody").find("td");    //所有表头
		this.trs = this.dataTable.children("tbody").children("tr");   //所有行
		
		this.frozenTable = $("#freeze_data_"+this.id).children("table");
		this.fro_trs = this.frozenTable.children("tbody").children("tr"); //所有frozen data行
		this.fro_ths = $("#freez_head_"+this.id).children("tbody").find("td");//frozen 表头
		//ajax load data
		
		 //将多余的冻结列添加到现有冻结列上：表头
		 //竟然有四个表格，wtf
		 var fro_header = $("#freez_head_"+this.id);
		 var header = $("#head_"+this.id);
		 for(var h=1;this.frozenObjs&&h<this.frozenObjs.length;h++){
			 var tmp = this.frozenObjs[h];
			 var tmptd = header.find("div[name="+tmp.name+"]").parent();
			 tmptd.appendTo(fro_header.find("tr"));
			 header.find("[flag=frozen]").after(tmptd.clone().attr("flag","frozen")).removeAttr("flag")
		 }
		 
		 this.fro_header = fro_header;
		 this.header = header;
		 //清理
		 
		
		//处理请求的页码数
		this.processReqConf()
		this.initToolbarEvents();
		
		if(this.params["autoLoad"] && this.params["autoLoad"]==true){
			this.autoLoad = this.params["autoLoad"];
			this.load();
		}else if(this.data){   //static data
			this.loadFlag = "staticData";
//			this.result = this.data["rows"]?this.data["rows"]:this.data;
			this.storgedData = this.data["rows"]?this.data["rows"]:this.data;
			this.reqPage(this.reqPageNo,this.reqPageSize);
//			this.result = this.storgedData.slice((pageNo-1)*pageSize,pageNo*pageSize);
//			_this.loadRecords(this.result);
//			
//			this.setTHHidden();
//			this.initScroll();
////			this.el.find("#page_"+this.id).remove();
//     	     //pagebar
//			
//             _this.staticInitPagebar();
//             
//            //被选中的数据对象init
//     	   _this.initSelect();
//            //bind row click
//            _this.bindClickEvent(_this.rowclick,"click");
//            //bind rowdblclick
//            _this.bindClickEvent(_this.rowdblclick,"dblclick");
//            //bind initSelectEvents
//            _this.initSelectEvents();
//            //bind rowhignlight
//            _this.initHignLightEvent();
//            _this.columnRender();
			
		}else{
			this.pageBtnDisabled(true);
		}
		
        
	},
	processReqConf :function(){
		var pageNo = this.params["pageConfig"]["pageNo"];
		var pageSize = this.params["pageConfig"]["pageSize"];
		var _pageSizeObj = $("#pageSize_"+this.id);
		if(pageSize){
			_pageSizeObj.val(pageSize);
		}
		this.reqPageNo = this.reqPageNo?this.reqPageNo:pageNo;
		this.reqPageSize=this.reqPageSize?this.reqPageSize:pageSize;
	},
	/**
	    * @description 启用/禁用 表格里的按钮栏的某个操作按钮
	    * @function
	    * @name Horn.DataGrid#setButtonDisabled
	    * @param {string} name        按钮名称，记得按钮的name是唯一
	    * @param {boolean} disabled   true为按钮不可用，false为可用<br>
	    * @return void
	    * @example
	    * #jscode()
	    * 	Horn.getComp("datagridName").setButtonDisabled("delBtn",true);
	    * #end
	    */
	setButtonDisabled : function(name,disabled){
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul").children("li");
		titleButtons.each(function(index,trdom){
			var a = $(this).children("a");
			var btnName = a.attr("name");
			if(btnName == name){
				if(disabled){
					a.addClass("f-disabled")
					a.attr("onclick","javascript:return false;");
				}else{
					a.removeClass("f-disabled")
					a.attr("onclick",a.attr("event"));
				}
				return;
			}
			
		});
	},
	initToolbarEvents : function(){
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul").children("li");
		titleButtons.each(function(index,trdom){
			var a = $(this).children("a");
			if(a.hasClass("f-disabled")){
				a.attr("onclick","javascript:return false;");
			}
		});
	},
	/**
	 * @ignore
	 */
	staticInitPagebar : function(){
 	   if(this.hasPage){
		   var total = this.storgedData.length;
		   if(this.pagebar){
			   this.pagebar.setTotalCount(total);
			   this.pagebar.calPage_(this.reqPageNo,this.reqPageSize,total);
			   this.setPageInfo();
		   }
		   this.reqPageNo = this.reqPageNo+1;
	   }
	},
	/**初始加载数据的时候自动计算行高
	 * **行高的最小值22px
	 * @ignore
	 */
	//STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
	reCalRowHeight :function(){
		var minH = 22;
		var h = this.params.height;
		if(!h) return;	//如果没有配置hegiht，则不计算高度而是自适应高度 
		
		var pageSize = this.currentPageSize ;
		
		var calH = minH * pageSize < h ? h/pageSize : 22;
		
		
		//调整三种高度
		//不再重置行高
//		$("#freez_tbody_"+this.id+" tr").height(calH);
//		$("#body_"+this.id+" tr").height(calH);
		
//		$("#freez_tbody_"+this.id).height(h);
//		$("#body_"+this.id).height(h);
		
//		$("div.hc-datagrid-body").height(h)
		this.setHeight(h);
	},
	initSelectEvents : function(){
		var cnt=1;
		var _this = this;
		//checkall dom
		var _allCheck=$("#"+this.allCheckboxId);
		
		this.trs.each(function(index,trdom){
			var tr = $(trdom),
			input = tr.find("#cb_"+_this.id+"_"+cnt);
			cnt++;
			if(_this.rowSelect == false){           
				input.change(function(){
	    			if(this.checked){
	    				_this.selectRow(index+1,tr);
	    			}else{
	    				_this.unSelectRow(index+1,tr);
	    			}
	    		});
			}else{
				var _clickFlag=this.clickFlag;
	    		tr.bind('click',function(e) {    
	    			clearTimeout(_clickFlag);
	    			_clickFlag=setTimeout(function(){
	    				if($.isEmptyObject(_this.selecteds)){
	    					 if(_this.frozenObj){
	    						 $(_this.fro_trs[index]).find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
	    						 $(_this.fro_trs[index]).addClass("u-table-selected");
	    					 }
	        				_this.selectRow(index+1, tr);
	        			}else{
	        				if(!_this.selecteds.hasOwnProperty(index+1)){
	        					if(_this.frozenObj){
	        						 $(_this.fro_trs[index]).find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
		    						 $(_this.fro_trs[index]).addClass("u-table-selected");
		    					 }
	        				    _this.selectRow(index+1, tr);
	    					 }else{
	    						 if(_this.frozenObj){
	    							 $(_this.fro_trs[index]).find("#cb_"+_this.id+"_"+(index+1)).prop("checked", false);
		    						 $(_this.fro_trs[index]).removeClass("u-table-selected");
		    					 }
	    						 _this.unSelectRow(index+1, tr);
	    					 }

	        			}
	    				if(_allCheck&&_this.selectModel=="multi"){
	            			_this.stateTest();
	    				}
	    			},10);
			   });
			}
		});
       if(this.frozenObj){
	   		cnt=1;
			this.fro_trs.each(function(index,trdom){
				var tr = $(trdom);
				var input = tr.find("#cb_"+_this.id+"_"+cnt);
				cnt++;
				if(_this.rowSelect == false){           
					input.change(function(){
		    			if(this.checked){
		    				input.checked = true;
		    				tr.addClass("u-table-selected");
		    				_this.selectRow(index+1,$(_this.trs[index]));
		    			}else{
		    				input.checked = false;
		    				tr.removeClass("u-table-selected");
		    				_this.unSelectRow(index+1,$(_this.trs[index]));
		    			}
		    			if(_allCheck&&_this.selectModel=="multi"){
	            			_this.stateTest();
	    				}
		    		});
				}else{
					var _clickFlag=this.clickFlag;
		    		tr.bind('click',function(e) {    
		    			clearTimeout(_clickFlag);
		    			_clickFlag=setTimeout(function(){
		    				if($.isEmptyObject(_this.selecteds)){
		    					input.prop("checked", true);
		    					tr.addClass("u-table-selected");
		        				_this.selectRow(index+1, $(_this.trs[index]));
		        			}else{
		        				if(!_this.selecteds.hasOwnProperty(index+1)){
		        					input.prop("checked", true);
		        					tr.addClass("u-table-selected");
		        				    _this.selectRow(index+1, $(_this.trs[index]));
		    					 }else{
		    						 input.prop("checked", false);
		    						 tr.removeClass("u-table-selected");
		    						 _this.unSelectRow(index+1, $(_this.trs[index]));
		    					 }

		        			}
		    				if(_allCheck&&_this.selectModel=="multi"){
		            			_this.stateTest();
		    				}
		    			},10);
				   });
				}
			});
       }

	  if(_allCheck&&this.selectModel=="multi"){
	        //reg checkall event
			/*$('#'+this.allCheckboxId).change(function(){
				if(this.checked){
					_this.selectAll();
				}else{
					_this.unSelectAll();
				}
			});*/
		  //需求#12660 【TS:201508240145-JRESPlus-财富管理事业部-王瑞明-若在查询框中通过 tab_panel 控件设置多个 Tab,分页则除第一次选择的TAB页外的其他全选按钮会失效 】
		  this.el.find('.h_datagrid_select_all').change(function(){
				if(this.checked){
					_this.selectAll();
				}else{
					_this.unSelectAll();
				}
			});
			this.dataTable.find(".hc-datagrid-cell-check").each(function(idx,divdom){
				  var div = $(divdom);
				  div.children("input:checkbox").change(function(){
						_this.stateTest();
					});
			});
	 }
		
	}, 
	initHignLightEvent : function(){
		var _this = this;
		if(this.frozenObj){
			this.fro_trs.each(function(index,trdom){
				var tr = $(trdom);
				tr.mouseover(function(){
					tr.addClass("hc-datagrid-row-over");
					$(_this.trs[index]).addClass("hc-datagrid-row-over");
				});
				tr.mouseout(function(){
					tr.removeClass("hc-datagrid-row-over");
					$(_this.trs[index]).removeClass("hc-datagrid-row-over");
				});
			});
			this.trs.each(function(index,trdom){
				var tr = $(trdom);
				tr.mouseover(function(){
					tr.addClass("hc-datagrid-row-over");
					$(_this.fro_trs[index]).addClass("hc-datagrid-row-over");
				});
				tr.mouseout(function(){
					tr.removeClass("hc-datagrid-row-over");
					$(_this.fro_trs[index]).removeClass("hc-datagrid-row-over");
				});
		    });
		}else{
			this.trs.each(function(index,trdom){
				var tr = $(trdom);
				tr.mouseover(function(){
					tr.addClass("hc-datagrid-row-over");
				});
				tr.mouseout(function(){
					tr.removeClass("hc-datagrid-row-over");
				});
		    });
		}

		
	},
    stateTest : function(){
		var _this = this;
		var checkAll = true;
		this.dataTable.find(".hc-datagrid-cell-check").each(function(idx,divdom){
			  var div = $(divdom);
			  var checkbox = div.children("input:checkbox");
			  if(!checkbox.prop("checked")){
				  checkAll = false;
			  }
		});
		
		/*if(checkAll){
			$("#"+this.allCheckboxId).attr("checked", true);
		}else{
			$("#"+this.allCheckboxId).attr("checked", false);
		}*/
		if(checkAll){
			_this.el.find('.h_datagrid_select_all').prop("checked", true);
		}else{
			_this.el.find('.h_datagrid_select_all').prop("checked", false);
		}
    },
   /**
    * @description 请求数据。 url不传，则请求url使用组件默认的url属性
    * @function
    * @name Horn.DataGrid#load
    * @param {string} url        请求数据的路径
    * @param {object} params     请求提交的参数<br>
    * @return void
    */
	load : function(url,params){
		params = params ||{};
		//需求#14698 【TS:201511060012-JRESPlus-资产管理事业部-张翔-问题1：选中datagrid中某条数据,然后调load方法，原来选中的内容还在
		this.selecteds = null;
		//解决将其他加载方式切换为load的时候导致的请求pageNo多一的问题
		//初始load应该从第一页开始获取
		if(this.loadFlag  && this.loadFlag != "autoLoad"){
			this.reqPageNo = 1;
		}
		this.loadFlag="autoLoad";
		if($.type(params)=="array"){
            params = Horn.Util.arr2Obj(params) ;
        }
		
		this.reqPageNo = params["pageNo"] || this.reqPageNo;
		this.reqPageSize = params["pageSize"] || this.reqPageSize;
		
		if(this.hasPage){
			params["pageNo"] = this.reqPageNo;
			params["pageSize"] = this.reqPageSize;
		}
		//如果有绑定表单，就把表单参数传到后台 20160418 add by 周智星
		if(this.bindFormName!=null){
			var serValues = $("form[name="+this.bindFormName+"]").serializeArray();
        	var formValues = Horn.Util.arr2Obj(serValues) ;
        	$.each(formValues, function (name, value) {
       		 	params[name] = value;
			});
			
		}
		this.execute(url,params);
		//STORY #11316 [财富管理事业部/徐益江][TS:201504160052]-jresplus-ui-2、datagrid控件，当列宽超出可见宽度后出来横向滚动条】
		$("#head_"+this.id).css("margin-left",0);
		//STORY #11407 [财富管理事业部/蔺茂旺][TS:201504240187]-JRESPlus-ui-1。在grid，冻结列中，动态添加的内容，滚动条拖到最后，g】
		$("#freez_body_"+this.id).css("margin-top",0);
	},
	  /**
	    * @description 加载数据到表格中
	    * @function
	    * @name Horn.DataGrid#loadData
	    * @param {object} data     加载的数据<br>
	    * @return void
	    */
	loadData : function(data){
		this.loadFlag = "loadData";
		var _this=this;
		var pageNo = this.params["pageConfig"]["pageNo"];
		var pageSize = this.params["pageConfig"]["pageSize"];
		this.reqPageNo = pageNo?pageNo:1;
		this.reqPageSize=pageSize?pageSize:10;
		
		if(data!=null){
			this.data = data;
			//正确的取得前端分页的数据storgedData
			this.storgedData=data.rows?data.rows:data;
			this.reqPage(this.reqPageNo,this.reqPageSize);
//			this.result = this.data["rows"]?this.data["rows"]:this.data;
//			_this.setTHHidden();
//            //动态展现表格数据
//     	   _this.loadRecords(data);
//     	   //pagebar
//     	   _this.el.find("#page_"+this.id).remove();
//            //_this.initPagebar(this.data);
//            //被选中的数据对象init
//     	   _this.initSelect();
//            //bind row click
//            _this.bindClickEvent(_this.rowclick,"click");
//            //bind rowdblclick
//            _this.bindClickEvent(_this.rowdblclick,"dblclick");
//            //bind initSelectEvents
//            _this.initSelectEvents();
//            //bind rowhignlight
//            _this.initHignLightEvent();
//            _this.columnRender();
            _this.el.find("#data_"+_this.id).css("height","");
            this.pageBtnDisabled(false);
		}
		
		this.reCalRowHeight();
		
	},

	  /**
	    * @description 返回组件id
	    * @function
	    * @name Horn.DataGrid#getId<br>
	    * @return String
	    */
	getId : function(){
		return this.id;
	},

	/**
	  * @description 返回选择的数据
	  * @function
	  * @name Horn.DataGrid#getSelecteds<br>
	  * @return Array
	  */
	getSelecteds :function(){
		var selecteds = [];
		for(var key in this.selecteds){
			
			//[经纪业务事业部/胡志武][TS:201409230012]-JRESPlus-ui--DataGrid在ie8浏览器上通过DataGrid获取数据通过getSelecteds (
			if(key == "indexOf")
				continue;
			
    		var val = this.selecteds[key];
    		if(val){
    			selecteds.push(val);
    		}
    	}
		return selecteds;
	},
	/**
	 * @description 取消选中所有行数据，只针对多选模式，单选模式下无效
	 * @name Horn.DataGrid#unSelectAll
	 * @function 
	 * @return void
	 */
	unSelectAll : function(){
    	var _this = this;
    	this.dataTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx+1,$(checkbox.parentNode.parentNode.parentNode));
    		}
    		   
    	});
    	if(this.frozenObj){
    		this.frozenTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
        		checkbox.checked = false;
        		$(checkbox.parentNode.parentNode.parentNode).removeClass("u-table-selected");
        		   
        	});
    	}
    	//$("#"+this.allCheckboxId).attr("checked", false);
    	_this.el.find('.h_datagrid_select_all').prop("checked", false);
	},
	/**
	 * @description 选中所有行数据，只针对多选模式，单选模式下无效
	 * @name Horn.DataGrid#selectAll
	 * @function 
	 * @return void
	 */
	selectAll : function(){
    	var _this = this;
    	this.dataTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx+1,$(checkbox.parentNode.parentNode.parentNode));
    		}
    		   
    	});
    	if(this.frozenObj){
    		this.frozenTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
        		checkbox.checked = true;
        		$(checkbox.parentNode.parentNode.parentNode).addClass("u-table-selected");
        		   
        	});
    	}
        //14210 需求12660tabpanel多个页签有datagrid组件，直接点击页签2的全选，会把页签1的全选框也选中
    	//$("#"+this.allCheckboxId).attr("checked", true);
	},
	
	/**
	 * @description 向后台发送请求时的用户自定义参数，被设置的参数会做为基础查询条件，即每次查询是都会传入后台
	 * @name Horn.DataGrid#setBaseParams
	 * @param {object} params  基础参数<br>
	 * @return void
	 * @function
	 */
	setBaseParams : function(params){
		params = params||{};	
   	 if(params){
		 this.baseParams=params;
	 }else{
		 this.baseParams={};
	 }
	},
	/**
	 * @description 设置控件的宽度和高度
	 * @name Horn.DataGrid#setSize
	 * @param {number} width  宽度
	 * @param {number} height  高度<br>
	 * @return void
	 * @function
	 */
	setSize : function(width,height){
		var gridId = this.getId();
		var w = width?Number(width):null;
		var h = height?Number(height):null;
		if(w&&!isNaN(w)){
			$("#wrap_"+gridId).width(w);
			this.width=w;
		}
		if(h&&!isNaN(h)){
			var grid = $("#freeze_data_"+gridId);
			if(grid.size != 0){
				grid.height(h-16);
			}
			$("#data_"+gridId).height(h);
			this.height=h;
		}
	},
	/**
	 * @description 设置控件的宽度
	 * @name Horn.DataGrid#setWidth
	 * @param {number} width  宽度<br>
	 * @return void
	 * @function
	 */
	setWidth : function(width){
		this.setSize(width,null);
	},
	/**
	 * @description 设置控件的高度
	 * @name Horn.DataGrid#setHeight
	 * @param {number} height  高度<br>
	 * @return void
	 * @function
	 */
	setHeight : function(height){
		this.setSize(null,height);
	},
	/**
	 * @description 选择一行记录
	 * @name Horn.DataGrid#select
	 * @param {number} row  行号<br>
	 * @return void
	 * @function
	 */
	select : function(row,event){
		var _this = this,
		
		//select("1")第一行也能被选中，但是没有勾选状态；而select(1)不仅可以选中一行还等勾选
		row = Number(row);
		
		index = row,
		tr = $(_this.trs[index]),
		f_tr = $(_this.fro_trs[index]),
		_allCheck = $("#"+this.allCheckboxId);
		if($.isEmptyObject(_this.selecteds)){
			 if(_this.frozenObj){
				 f_tr.find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
				 f_tr.addClass("u-table-selected");
			 }
			_this.selectRow(index+1, tr);
		}else{
			if(!_this.selecteds.hasOwnProperty(index+1)){
				if(_this.frozenObj){
					f_tr.find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
					f_tr.addClass("u-table-selected");
				 }
			    _this.selectRow(index+1, tr);
			 }

		}
		if(_allCheck&&_this.selectModel=="multi"){
			_this.stateTest();
		}
		if (event&&event.stopPropagation) {
			event.stopPropagation();
		}
	},
	/**
	 * @description 取消选择一行记录
	 * @name Horn.DataGrid#unselect
	 * @param {number} row  行号<br>
	 * @return void
	 * @function
	 */
	unselect : function(row,event){
		this.unSelectRow(row+1,$(this.trs[row]));
		if (event&&event.stopPropagation) {
			event.stopPropagation();
		}
	},
	/**
	 * 选中一行
	 * @ignore
	 */
	selectRow : function(rowidx,_tr){
		var tr = _tr;
    	if(!tr){
    		tr = $("#tr_"+this.id+"_"+rowidx);    
    	}
    	var vals = this.getRowData(rowidx-1);
    	this.selecteds[rowidx] = vals;
		if(this.selectModel=="single"){
			var last = this.lastSelect;
			if(last && last.rowidx !==undefined && last.rowidx != rowidx ){
				last.tr.find("#cb_"+this.id+"_"+last.rowidx).prop("checked" , false);
				this.unSelectRow(last.rowidx,last.tr);
			}
			tr.find("input:radio").get(0).checked = true;   //选中radio//BUG #6574 
			
		}else if(this.selectModel=="multi"){
			tr.find("input:checkbox").get(0).checked = true;   //选中checkbox
		}
		this.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		tr.addClass("u-table-selected");//选中行的样式
	},
	/**
	 * @ignore
	 */
	getRowData :function(rowidx){
		/*
    	var vals = {};
		var ths = this.ths;
		var tds = rowTr.find('td');
		ths.each(function(thidx,thdom){
			var th = $(thdom),
			div = th.children("div"),
			colname;
			if(!div.attr("name")){
				return;
			}else{
				colname = div.attr("name");
			}
			var td_divobj = $(tds.get(thidx)).children("div");
			vals[colname] = div.attr('dictName') ? $(td_divobj).attr('key') :$(td_divobj).text();
		});*/
		return this.result[rowidx];
		//return vals;
	},
	/**
	 * 取消选中一行
	 * @ignore
	 */
	unSelectRow : function(rowidx,_tr){
		var tr = _tr;
    	if(!tr){
    		tr = $("#tr_"+this.id+"_"+rowidx);    
    	}
    	//clear
    	this.selecteds[rowidx] =null;
    	delete this.selecteds[rowidx];
    	tr.removeClass("u-table-selected");
    	tr.find("#cb_"+this.id+"_"+rowidx).prop("checked", false);
    	//冻结列清空
		if(this.frozenObj){
			$(this.fro_trs[rowidx-1]).find("#cb_"+this.id+"_"+rowidx).prop("checked", false);
			$(this.fro_trs[rowidx-1]).removeClass("u-table-selected");
		}
    	
    	//所有的选择项都取消后应该设置选择所有的checkbox为false
    	var _isNull=true;
    	
    	for(var _name in this.selecteds){
    		_isNull=false;
    		break;
    	}
    	if(_isNull){
    		//$('#'+this.allCheckboxId).attr("checked", false);
    		this.el.find('.h_datagrid_select_all').prop("checked", false);
    	}
	},
	/**
	 * @ignore
	 */
	execute : function(url,options){
		options = options||{};
		var doRequest = true;
		//需要先触发beforeload事件
		 if(this.beforeload){
			   var  beforeloadObj = Horn.Util.getFunObj(this.beforeload),
			   beforeloadFn;
	           if($.type(beforeloadObj.fn) == "function"){
	        	   beforeloadFn = beforeloadObj.fn ;
	           }
	           if(beforeloadFn)
	        	   doRequest =  beforeloadFn.apply(this,[this.el,options]);
		   }
		if(doRequest != false){
			var paramsdata = Horn.apply({},this.baseParams,options);
			//执行ajax请求
			this.doAjax(url,paramsdata);
		}
		return doRequest;
	},
	doAjax : function(url,data){
		   var _this = this;
		   var url = url?url:_this.url;
		   if(url && url.indexOf("http:")==-1){
			   url = context_path + url;
		   }
		   var tbody = this.dataTable.children("tbody"),
		   f_tbody = this.frozenTable.children("tbody"),
		   colLength = this.ths.length;
		   
	       $.ajax(
	    		   url,
	    	  {
	           async : true,
               beforeSend : function(xhr) {
          		   if(_this.frozenObj){
            		   _this.frozenTable.children("tbody").html("");
        		   }
            	   
          		   _this.dataTable.children("tbody").html("");
                   tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colspan='"
                       + colLength
                       + "'><img src='"+context_path+"/components/datagrid/img/hc_onLoad.gif'></img></td></tr>");
                   tbody.parent().css("width","100%");
                   tbody.parent().css("text-align","center");
                   tbody.parent().css("padding","15px");  
               },
               type : "POST",
               data : Horn.Util.obj2Arr(data) ,
               dataType : "json",
               error : function(xhr, textStatus, errorThrown) {
                   var status = xhr.status;
                   tbody.parent().css("width","");
        		   tbody.parent().css("text-align","");
        		   tbody.parent().css("padding","");
                   if(_this.frozenObj){
        			   _this.frozenTable.children("tbody").html("");
        			   f_tbody.html(
                               "<tr><td style=\"border-right:0px;padding:15px;\" colSpan='" + colLength
                               + "'><p>请求失败</p><p>错误状态："
                               + status + "；错误信息："
                               + textStatus
                               + "</p></td></tr>");
        		   }
                   tbody.html(
                       "<tr><td style=\"border-right:0px;padding:15px;\" colSpan='" + colLength
                           + "'><p>请求失败</p><p>错误状态："
                           + status + "；错误信息："
                           + textStatus
                           + "</p></td></tr>");
               },
               success : function(resultData, textStatus, jqXHR) {
        		   tbody.html("");
        		   tbody.parent().css("width","");
        		   tbody.parent().css("text-align","");
        		   tbody.parent().css("padding","");
            	   if(!resultData||$.isEmptyObject(resultData)){
            		   if(_this.frozenObj){
            			   _this.frozenTable.children("tbody").html("");
            			   f_tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
                                   + colLength
                                   + "'><p>暂时无数据</p></td></tr>");
            		   }
                		    
                		 _this.dataTable.children("tbody").html("");
                         tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
                             + colLength
                             + "'><p>暂时无数据</p></td></tr>");
            		   
            		   
	    			  if(_this.loaderror){
	    	  			   var  loaderrorObj = Horn.Util.getFunObj(_this.loaderror),
	    	  			    loaderrorFn;
	    	  	           if($.type(loaderrorObj.fn) == "function"){
	    	  	        	 loaderrorFn = loaderrorObj.fn ;
	    	  	           }
	    	  	           if(loaderrorFn)
	    	  	        	 loaderrorFn.apply(_this,[_this.el,resultData]);
	    	  	             return;
	    	  		   }   
            		   
            	   }else{
            		   if(resultData){
            				var data = resultData["rows"];
            				this.result = data?data:resultData;
            		   }
            		   if(this.result&&(this.result.length==0||$.isEmptyObject(this.result))){
            			   if(_this.frozenObj){
                			   _this.frozenTable.children("tbody").html("");
                			   f_tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
                                       + colLength
                                       + "'><p>暂时无数据</p></td></tr>");
                		   }
                    		    
	                        _this.dataTable.children("tbody").html("");
	                        tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
	                             + colLength
	                             + "'><p>暂时无数据</p></td></tr>");
	                        
	                        //pagebar
	                        _this.initPagebar(resultData);
           		        }else{
	            		   //10808
	            		   _this.data = resultData.rows;
	            		   _this.params.data = resultData.rows;
	            		   
	            		   //动态展现表格数据
	                	   _this.loadRecords(resultData);
	                	   //pagebar
	                       _this.initPagebar(resultData);
	                       //被选中的数据对象init
	                	   _this.initSelect();
	                       //bind row click
	                       _this.bindClickEvent(_this.rowclick,"click");
	                       //bind rowdblclick
	                       _this.bindClickEvent(_this.rowdblclick,"dblclick");
	                       //bind initSelectEvents
	                       _this.initSelectEvents();
	                       //bind rowhignlight
	                       _this.initHignLightEvent();
	                       _this.columnRender();
	//                       _this.setHeight(parseInt(_this.el.find("#data_"+_this.id).css("height")));
	                       //STORY #10163 [研发中心/内部需求][JresPlus][UI]datagrid组件中动态加载的表格，当初始化加载完成后后台增加数据量，表格高度没有发生变化 
	                       if(_this.params.height == undefined){//不设置表格高度的时候才这样干，如果设置了表格高度则以表格高度为准
	                    	   //_this.setHeight(parseInt(_this.el.find("#body_"+_this.id).css("height")));//当不设置表格高度的时候应该自适应表格的高度，而不应该是div的高度
	                       }
	                       _this.setTHHidden();
           		       }

            	   }
            	   
            	   try{
            		   if(_this.loadsuccess){
            			   var  loadsuccessObj = Horn.Util.getFunObj(_this.loadsuccess),
            			   loadsuccessFn;
            	           if($.type(loadsuccessObj.fn) == "function"){
            	        	   loadsuccessFn = loadsuccessObj.fn ;
            	           }
            	           if(loadsuccessFn)
            	             loadsuccessFn.apply(_this,[_this.el,resultData]);
            		   }
            	   }catch(e){
            		   Horn.debug(e);
            	   }
            	   
               }
	               });
		
	},
	/**
	 * @ignore
	 */
	initPagebar : function(resultData){
	 	   if(this.hasPage){
			   var total = resultData["total"];
			   if(this.pagebar){
				   if(resultData!=null){
					   	$("#toPage_"+this.id).attr("disabled",false);
						$("#pageSize_"+this.id).attr("disabled",false);
				   }
				   this.pagebar.setTotalCount(total);
				   this.pagebar.calPage_(this.reqPageNo,this.reqPageSize,total);
				   this.setPageInfo();
			   }
			   
		   }
	},
	pageBtnDisabled: function(disabled){
		if(disabled){
			$("#toPage_"+this.id).attr("disabled",true);
			$("#pageSize_"+this.id).attr("disabled",true);
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").addClass("disabled");
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").addClass("disabled");
			$("#page_"+this.id).find(".refresh_btn").addClass("disabled");
		}else{
			$("#toPage_"+this.id).attr("disabled",false);
			$("#pageSize_"+this.id).attr("disabled",false);
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").removeClass("disabled");
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").removeClass("disabled");
			$("#page_"+this.id).find(".refresh_btn").removeClass("disabled");
		}
	},
	/**
	 * @ignore
	 * @private
	 * 加载数据，用于生成表格
	 */
	loadRecords : function(resultData){
		//STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
		//计算当前页面的数据条数
		//this.currentPageSize = resultData.length ? resultData.length:resultData.rows.length;
		
		this.currentPageSize = resultData.length || (resultData.rows&&resultData.rows.length);
		this.result = resultData.rows || resultData;
		
		Horn.debug("init datagrid data...",this.result);
		this.createDataTable();
		this.initScroll();
		this.trs = this.dataTable.children("tbody").children("tr");   //所有data行
		this.fro_trs = this.frozenTable.children("tbody").children("tr"); //所有frozen data行
		this.loaded = true;
		Horn.debug("init datagrid data success ...");
	
//		this.calMaxLength();
	},
	calMaxLength:function(){
		//10808
		var _item,
			_data,
			_tmp,
			_this = this;
		//从这里计算每列的宽度,不管用到用不到都算出来
		for(var i=0;i<_this.params["items"].length;i++){
			_item = _this.params["items"][i];
			var _maxLength = _item.text.getWidth(12);
			
			if( _this.params.autoWidth || _item.autoWidth ){
				//一个data就是一行数据
				for(var j=0;j<_this.result.length;j++){
					_data = _this.result[j];
					_tmp = (""+_data[_item.name] || "0").getWidth(12);
					_maxLength = _tmp > _maxLength ? _tmp:_maxLength;
				}
			}
			_item._maxLength = _maxLength;
		}
	},
	/**
	 * @ignore
	 */
	createDataTable : function(){
		this.calMaxLength();
		
		 var htmlArr = [];
		 var f_htmlArr = [];
		 
		 var colLength = this.ths.length;
		 
		 if(this.frozenObj){
			 var f_colLength = $("#freez_head_"+this.id).children("tbody").children("tr").length;
		 }
		 
		 if(this.result && this.result.length >0){
			 var cnt = 1;
			 for ( var i = 0; i <this.result.length; i++){
				   var itemData = this.result[i];
				   //frozentable row init
				   if(this.frozenObj)
				      this.createFrozenTableTr(itemData,cnt,f_htmlArr);
				   var tmptr = this.tr.replace("{TR_ID}", "tr_"+this.id+"_"+cnt);
		    	   tmptr = tmptr.replace("{TR_CLASS}", (cnt%2==0)?this.row_class:"");
				   htmlArr.push(tmptr);
				   if(this.numbercolumn && this.numbercolumn==true){
					 var tmptd = this.td_number.replace("{count}",cnt).replace("{numberColumnWidth}",this.numberColWidth);
					 htmlArr.push(tmptd);
				   }
				   if(this.selectModel && this.selectModel=="multi"){
					   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
					   tmptd = tmptd.replace("{CHECK_TYPE}","checkbox");
					   htmlArr.push(tmptd);
				   }else if(this.selectModel && this.selectModel=="single"){
					   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
					   tmptd = tmptd.replace("{CHECK_TYPE}","radio");
					   htmlArr.push(tmptd);
				   }
				   
				   for(var j=0;j<this.frozenObjs.length;j++){
					   this.frozenObj = this.frozenObjs[j];
					   
					   if(this.frozenObj){
						   var tmptd = this.td.replace("{XDATAGRID_TD_ALIGN}",this.setAlign(this.frozenObj["tAlign"]));
						   
						   var _width = this._getItemWidth(this.frozenObj);
						   tmptd = tmptd.replace("{XDATAGRID_TD_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
						   tmptd = tmptd.replace("{XDATAGRID_DIV_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
						   if(this.frozenObj["hidden"]&&this.frozenObj["hidden"]==true)
						      tmptd = tmptd.replace("{XDATAGRID_TD_HIDDEN}","none");
						   var value = this.getCellValue(itemData,this.frozenObj["name"]);
						   
						   //这里格式化冻结列
						   value = this.formatData(this.frozenObj["dataType"],this.frozenObj["format"],value);
						   if(value!=""&&(value=="null"||value=="NULL"||value=="undefined")){
							   value = "";
						   }
						   tmptd = tmptd.replace("{XDATAGRID_TD_VAL}",value);
						   htmlArr.push(tmptd);
					   }
				   }
				   this.frozenObj = this.frozenObjs[0];
				   
				   var colslength = this.items.length;
				   for(var j=0;j<colslength;j++){
					   var colitem = this.items[j];
					   if(colitem.name!=this.params["frozen"] && this.params["frozen"].indexOf(colitem.name) < 0){
						   var tmptd = this.td.replace("{XDATAGRID_TD_ALIGN}",this.setAlign(colitem["tAlign"]));
						   
						   var _width = this._getItemWidth(colitem);
						   tmptd = tmptd.replace("{XDATAGRID_TD_WIDTH}",colitem["width"]?colitem["width"]:_width);
						   tmptd = tmptd.replace("{XDATAGRID_DIV_WIDTH}",colitem["width"]?colitem["width"]:_width);
						   if(colitem["hidden"]&&colitem["hidden"]==true)
							      tmptd = tmptd.replace("{XDATAGRID_TD_HIDDEN}","none");
						   var value = this.getCellValue(itemData,colitem["name"]);
						   
						   //在这里做格式化
						   if(colitem["dataType"] && colitem["dataType"] !=null){
						   	   value = this.formatData(colitem["dataType"],colitem["format"],value);
						   }
						   if(value!=""&&(value=="null"||value=="NULL"||value=="undefined")){
							   value = "";
						   }
						   tmptd = tmptd.replace("{XDATAGRID_TD_VAL}",value);
						   htmlArr.push(tmptd);
					   }
					  
				   }
				   htmlArr.push(this.tr_end);cnt++;
			 }
			 
		 }
		 if(this.frozenObj){
			 this.frozenTable.children("tbody").html("");
			 this.frozenTable.children("tbody").html(f_htmlArr.join(""));
		 }
		 this.dataTable.children("tbody").html("");  
		 this.dataTable.children("tbody").html(htmlArr.join(""));
		 
		 //重新计算行高和table高度
		 //STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
		 this.reCalRowHeight();
		 
		 this.resetTdContent();
		
	},
	/**
     *重置列展示内容,如果字段大于40个字符，就把内容放到文本域中
     * @ignore
     */
	resetTdContent : function(){
		var head_trs = this.head_dataTable.children('tbody').children('tr');
    	var trs = this.dataTable.children('tbody').children('tr');
    	var freetrs = this.frozenTable.children('tbody').children('tr');
    	var tmpArray = [];
    	var _this = this;
    	var rows = [];
    	head_trs.each(function(tridx,trdom){
    		var tr = $(trdom);
    		var tds = tr.find('td');
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdDiv = td.children("div");
    			var display = td.css("display");
    			if((tdidx==tds.length-1)&&display!="none"){
	    			td.css("width","auto");
	    		}
    		}
    	});
    	trs.each(function(tridx,trdom){
			var flag = false;
    		var tr = $(trdom);
    		var trid = tr.attr("id");
    		var tds = tr.find('td');
    		
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdDiv = td.children("div");
    			var text =tdDiv.text();
    			var display = td.css("display");
    			if(display!="none"){
		    		if(_this.getStrlen(text)>40){
		    			if(_this.params.frozen&&_this.params.frozen!=""){
			    			if(rows.indexOf(tdidx)==-1){
			    				rows.push(tdidx);
			    			}
			    			tmpArray.push(trid);
			    			tdDiv.html("<textarea   readonly style=\"height: 40px;width: 300px;border: 0;background: transparent;line-height: 15px;outline: none;\" class=\"div-textarea\">"+text+"</textarea>");
			    			tdDiv.css("height","40px");
			    			tdDiv.css("line-height","40px");
		    			}else{
		    				td.css("width","300px");
		    				var style = tdDiv.attr("style");
		    				style = style+";white-space: normal;text-overflow: initial;;word-wrap:break-word; word-break:break-all";
		    				tdDiv.attr("style",style);
		    				tdDiv.css("width","300px");
		    			}
		    		}
    			}
    			
	    		if((tdidx==tds.length-1)&&display!="none"){
	    			td.css("width","auto");
	    		}
    		}
    		
    	});
    	if(this.frozenObj){
	    	freetrs.each(function(tridx,trdom){
	    		var tr = $(trdom);
	    		var tds = tr.find('td');
	    		var trid = tr.attr("id");
	    		if(tmpArray.length>0&&tmpArray.indexOf(trid)>-1){
		    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
		    			var td = $(tds[tdidx]);
		    			var tdDiv = td.children("div");
		    			var checkbox = tdDiv.attr("class");
		    			if(checkbox!="hc-datagrid-cell-check"){
			    			tdDiv.css("height","40px");
			    			tdDiv.css("line-height","40px");
		    			}
		    		}
	    		}
	    	});
    	}
    	/*if(rows.length>0){
    		for(var i = 0;i<rows.length;i++){
    			trs.find('td:eq('+rows[i]+')').children("div").css("width",300);
    		}
    	}*/
    },
    getStrlen:function(str){//一个中文相当于两个字符
    	var num = 2;
        var len = 0;
        for (var i=0; i<str.length; i++) { 
	         var c = str.charCodeAt(i); 
	         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
	           len++; 
	         }else{ 
	    		len+=num; 
	         } 
        }
        return len;
    },
	/**
	 * a:type，b:format、c:value
	 */
	formatData:function(a,b,c){
		return Horn.Util.Format.all(a,b,c);
	},
	/**
	 * @ignore
	 * @private
	 */
	createFrozenTableTr : function(itemData,cnt,htmlArr){
	   htmlArr = htmlArr||[];	
	   var tmptr = this.tr.replace("{TR_ID}", "tr_"+this.id+"_"+cnt);
	   tmptr = tmptr.replace("{TR_CLASS}", (cnt%2==0)?this.row_class:"");
	   htmlArr.push(tmptr);
	   if(this.numbercolumn && this.numbercolumn==true){
			 var tmptd = this.td_number.replace("{count}",cnt).replace("{numberColumnWidth}",this.numberColWidth);
			 htmlArr.push(tmptd);
	   }
	   if(this.selectModel && this.selectModel=="multi"){
		   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
		   tmptd = tmptd.replace("{CHECK_TYPE}","checkbox");
		   htmlArr.push(tmptd);
	   }else if(this.selectModel && this.selectModel=="single"){
		   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
		   tmptd = tmptd.replace("{CHECK_TYPE}","radio");
		   htmlArr.push(tmptd);
	   }
	   
	   for(var j=0;j<this.frozenObjs.length;j++){
		   this.frozenObj = this.frozenObjs[j];
		   
		   if(this.frozenObj){
			   //todo 渲染
			   var tmptd = this.td.replace("{XDATAGRID_TD_ALIGN}",this.setAlign(this.frozenObj["tAlign"]));
			   
			   var _width = this._getItemWidth(this.frozenObj);
			   tmptd = tmptd.replace("{XDATAGRID_TD_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
			   tmptd = tmptd.replace("{XDATAGRID_DIV_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
			   if(this.frozenObj["hidden"]&&this.frozenObj["hidden"]==true)
				      tmptd = tmptd.replace("{XDATAGRID_TD_HIDDEN}","none");
			   var value = this.getCellValue(itemData,this.frozenObj["name"]);
			   
			   //在这里格式化冻结列
			   value = this.formatData(this.frozenObj["dataType"],this.frozenObj["format"],value);
			   
			   tmptd = tmptd.replace("{XDATAGRID_TD_VAL}",value);
			   htmlArr.push(tmptd);
		   }
	   }
	   this.frozenObj = this.frozenObjs[0];
	   
	   htmlArr.push(this.tr_end);
	},
	_getItemWidth:function(item){
		var _item = item;
		for(var i=0;i<this.params.items.length;i++){
			if(item.name == this.params.items[i]['name']){
				_item =  this.params.items[i];
				break;
			}
		}
		
		if(_item.autoWidth || this.params.autoWidth){
		   return _item.width || _item._maxLength;
	    }else{
		   return _item.width || 100;
	    }
	},
	/**
	 * @ignore
	 */
	initScroll : function(){
		var dataid = "#data_"+this.id;
		var headid = "#head_"+this.id;
		var freebodyid = "#freez_body_"+this.id;
		$(dataid).scroll(function(){
			var left=$(dataid).scrollLeft();
			var top=$(dataid).scrollTop();
			$(headid).css("margin-left",-left);
			$(freebodyid).css("margin-top",-top);
		});
	},
	/**
	 * @ignore
	 * @private
	 */
	getCellValue : function(rowData,colName){
		rowData=rowData||{};
		colName = colName||"";
		
		//STORY #10954 [财富管理事业部-吴丰辉][TS:201502150029]-JRESPlus--datagrid希望支持静态字典
		//直接转换key到制定的value
		var items = this.params.items;
		for(var i=0;i<items.length;i++){
			if(items[i]['name'] == colName && items[i]['items']){
				var _dicts = items[i]['items'];
				for(var j=0;j<_dicts.length;j++){
					if(_dicts[j]['value'] == rowData[colName]){
						rowData[colName] = _dicts[j]['label'];
					}
				}
			}
		}
		
		if(rowData[colName] || rowData[colName] ==0){
			return rowData[colName];
		}else
		   return "";
	},
	/**
	 * @ignore
	 */
	createPagebar : function(){
		if(this.params["pageConfig"]){
			var _this = this;
			this.pagebar = new Horn._Pagebar(this.params["pageConfig"],this.id,_this);
		}
	},
	/**
	 * @ignore
	 */
	setPageInfo : function(){
		//设置当前第几页
		$("#toPage_"+this.id).val(this.pagebar.currentPage);
		$("#pageSize_"+this.id).val(this.pagebar.pageSize);
		$("#totalPages_"+this.id).html(this.pagebar.pages);
		if((this.pagebar.pageSize%5)==0){
			//100 200 500 1000
			var index = this.pagebar.pageSize/5;
			if(index==20)
				index=11;
			else if(index==40)
				index=12;
			else if(index == 100)
				index=13;
			else if(index == 200)
				index=14;
					
			var activeli = $($(".dropdown-menu-datagrid").find('li').get(index-1));
			activeli.addClass("active");
			this.pagebar.activeLi=activeli;
		}
		 
		
		//设置总共几页
		//var tempstr = this.pageinfo.totalPagesText.replace("{pages}",this.pagebar.pages);
		//tempstr = tempstr.replace("{pagesize}",this.pagebar.pageSize);
		
		$("#pageInfo_"+this.id).html(this.pagebar.getPageInfo());
		if(1==this.pagebar.currentPage){
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").addClass("disabled");
		}else{
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").removeClass("disabled");
		}
		if(this.pagebar.pages==this.pagebar.currentPage){
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").addClass("disabled");
		}else{
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").removeClass("disabled");
		}
		$("#page_"+this.id).find(".refresh_btn").removeClass("disabled");
		
	},
	/**
	 * @ignore
	 */
	reqPage : function(reqPageNo,reqPageSize){
		this.reqPageNo = reqPageNo?reqPageNo:this.reqPageNo;
		this.reqPageSize = 	reqPageSize?reqPageSize:this.reqPageSize;
		
		if(this.loadFlag != "autoLoad" && this.storgedData){
			this.result = this.storgedData.slice((this.reqPageNo-1)*this.reqPageSize,this.reqPageNo*this.reqPageSize);
			if(!this.hasPage){
				this.result = this.storgedData;
			}
			this.loadRecords(this.result);
			this.setTHHidden();
			this.initScroll();
             this.staticInitPagebar();
            //被选中的数据对象init
             this.initSelect();
            //bind row click
            this.bindClickEvent(this.rowclick,"click");
            //bind rowdblclick
            this.bindClickEvent(this.rowdblclick,"dblclick");
            //bind initSelectEvents
            this.initSelectEvents();
            //bind rowhignlight
            this.initHignLightEvent();
            this.columnRender();
		}else{
			this.load();
		}
	},
	/**
	 * @ignore
	 */
	initSelect:function(){
		var _this = this;
		$("#"+this.allCheckboxId).prop("checked",false);
		var _allCheck=$("#"+this.allCheckboxId);
		if(_allCheck&&this.selectModel=="multi"){
			_allCheck.prop("checked", false);
			if(this.frozenObj){
				this.fro_trs.each(function(idx,tr){
					$(tr).find("#cb_"+_this.id+"_"+(idx+1)).prop("checked", false);
				});
			}
			this.trs.each(function(idx,tr){
				$(tr).find("#cb_"+_this.id+"_"+(idx+1)).prop("checked", false);
			});
			
		}
		this.selecteds = [];
		this.lastSelect = {};
		
	},
	/**
	 * @ignore
	 */
	bindClickEvent : function(clickFunc,eventName){
		var clickObj =undefined;
		var clickFn=undefined;
		if (clickFunc) {
             clickObj = Horn.Util.getFunObj(clickFunc);
             if($.type(clickObj.fn) == "function"){
                 clickFn = clickObj.fn ;
             }
         }
		 if (clickFn ){
			 var trs = this.trs;
			 var _clickFlag=this.clickFlag;
			 for(var i=0;i<trs.length;i++){
				 var trdom = $(trs[i]);
				 var params = clickObj.params.slice(0);
                 params.push(this.result[i], this.result);
                 trdom.bind(eventName,params, function(e) {
                     var p = e.data ;
                     var _this=this;
                     if(eventName=="click"){
                    	 clearTimeout(_clickFlag);
                         _clickFlag=setTimeout(function(){
                         	return clickObj.fn.apply(_this,p);
                         },300);
                     }else{
                    	 return clickObj.fn.apply(_this,p);
                     }
                    
                 });
			 }
		 }
	},
	/**
	 * @ignore
	 */
	setAlign : function(align){
		align = align||"left";
		return align;
	},
	/**
	 * @ignore
	 */
	setTHHidden : function(){
		/*设置表头文字显示位置、width、隐藏*/
		var _this=this;
			this.ths.each(function(idx,thdom){
				var th = $(thdom);
				var div = th.find("div.hc-datagrid-cell");
				if(div.size() >0){
					for(var i=0;i<_this.items.length;i++){
						var item = _this.items[i];
						if(div.attr("name")==item.name){
							div.css("textalign",item.hAlign?item.hAlign:"center");
							//STORY #10808 [海外发展部-胡琦][TS:201501230291]-JRESPlus--datagrid控件数据列宽支持列宽自适应 (#3 #2 #1 )
//							if(item.autoWidth || _this.params.autoWidth){
//								div.css("width",item._maxLength);
//							}else{
//								div.css("width",item.width?item.width:100);
//							}
							div.css("width",_this._getItemWidth(item));
							
							if(item.hidden && item.hidden==true){
								th.hide();
							}
							break;      //等价于break BUG #7336
						}
					}
					
				}
			});
			if(this.frozenObj){
				this.fro_ths.each(function(idx,thdom){
					var th = $(thdom);
					var div = th.find("div.hc-datagrid-cell");
					if(div.size() >0){
						for(var i=0;i<_this.items.length;i++){
							var item = _this.items[i];
							if(div.attr("name")==item.name){
								div.css("textalign",item.hAlign?item.hAlign:"center");
								//16324 【TS:201601070223-JRESPlus-财富管理事业部-陈为-2. datagrid控件frozen属性固定列之后，标题和】
								/*if(item.autoWidth || _this.params.autoWidth){
									div.css("width",item._maxLength);
								}else{
									div.css("width",item.width?item.width:100);
								}*/
								div.css("width",_this._getItemWidth(item));
								if(item.hidden && item.hidden==true){
									th.hide();
								}
								break;      //等价于break BUG #7336
							}
						}
						
					}
				});
			}
	},
	/**
	 * @ignore
	 */
	dictColRender : function(td,dictName){
		td.attr('key',td.text());
		var text = td.children("div").text();
		var dict = Horn.getDict(dictName);
		if(dict){
			//17276 【TS:201602170281-JRESPlus-财富管理事业部-王瑞明-最近在使用JRES 框架进行开发过程中，发现使用了数据字典的】
			if(text=="" || dict[text]== undefined){
				td.children("div").text("");
				td.children("div").attr("title",""); 
			}else{
				td.children("div").text(dict[text]||text);
				td.children("div").attr("title",dict[text]||text);    //11209
			}
		}
	},
	/**
	 * @ignore
	 */
	buttonsColRender : function(td,buttons,rowidx,tdidx,tr,_table,alldata,rowdata){
		td.find("div").attr("title","");
		var btns = buttons;
		var span = $("<span></span>");
		$(btns).each(function(idxx,btn){
			var fn = Horn.Util.getFunObj(btn.event);
			//如果没有这个function，则不装入这个button
			if(!fn.fn) return;
			var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>"),
				text =  td.children("div").text();
			a.click(function(){
				fn.fn.call(a,{
    				"val" : text,
    				"rowdata" : rowdata,
    				"alldata" : alldata,
    				"table" : _table,
    				"rowidx" : rowidx,
    				"tdidx" : tdidx,
    				"tr" : tr,
    				"td" : td
    			});
			});
			a.css("color","#3366CC");
			a.hover(function(){
				$(this).css("color","#CC3300");
				$(this).css("text-decoration","underline");
			},function(){
				$(this).css("color","#3366CC");
				$(this).css("text-decoration","none");
			});
			span.append(a);
			if(idxx!=(btns.length-1)){
				span.append(' | ');
			}
		});
		 td.children("div").html('');
		 td.children("div").append(span);
		 if(this.frozenObj){
			 var f_td = $(this.fro_trs[rowidx]).find("td")[tdidx];
			 $(f_td).children("div").html('');
			 $(f_td).children("div").append(span);
		 }
	},
	
	colRendererFunc :  function(td,renderer,idx,index,tr,td){
		var _this = this;
		td.attr('key',td.find("div").text());
		td.find("div").attr("title","");
		var fn = Horn.Util.getFunObj(renderer),
		text = td.find("div").text();
		//如果没有这个function，则不装入这个button
		if(!fn.fn) return;
		var dom = fn.fn.call($(this),{
			val : text,
			rowdata : _this.result[idx],
			alldata : _this.result,
			table : _this,
			rowidx : idx,
			tdidx : index,
			tr : tr,
			td : td
		});
		if( dom instanceof $ ){
			td.find("div").html("");
			td.find("div").append(dom);
		}else{
			td.find("div").html(dom);
		}
	},
	/**
	 * @ignore
	 */
	columnRender : function(){
		var _this = this;
		var ths = this.ths;
		
		//调整标题头的宽度，自适应宽度的兼容
		function getItem(name){
			for(var i=0;i<_this.params.items.length;i++){
				if(name==_this.params.items[i]['name']){
					return _this.params.items[i];
				}
			}
		}
		var fro_header = this.fro_header;
		var header = this.header;
		
		fro_header.find("td").each(function(i,o){
			var item_name = $(o).find("div").attr("name");
			
			if(item_name){
				var item = getItem(item_name),
					width = _this._getItemWidth(item);
				
				$(o).find("div").width(width);
			}
		})
		
		header.find("td").each(function(i,o){
			var item_name = $(o).find("div").attr("name");
			
			if(item_name){
				var item = getItem(item_name),
					width = _this._getItemWidth(item);
				
				$(o).find("div").width(width);
			}
		})
		
		this.trs.each(function(idx,trdom){
			var tr = $(trdom);
			var f_tr =$( _this.fro_trs[idx]),
				tds = f_tr.find('td');
			
			
			tr.find('td').each(function(index,tddom){
				var td = $(tddom);
				
				var th = $(ths.get(index));
				var dictName = th.find("div").attr("dictname"),
					renderer = th.find("div").attr('renderer'),
					name = th.find("div").attr('name'),
					buttons = th.find("div").attr('buttons'),
					width,
					item;
				
				var f_td = $(tds.get(index));
				
				td.find("div").attr("title",td.find("div").text());
				f_td.find("div").attr("title",f_td.find("div").text());
				for(var i=0;i<_this.params["items"].length;i++){
					if(_this.params["items"][i].name==name){
						buttons = _this.params["items"][i]["buttons"];
						width =  _this.params["items"][i]["width"];
						item = _this.params["items"][i];
						
						//STORY #10808 [海外发展部-胡琦][TS:201501230291]-JRESPlus--datagrid控件数据列宽支持列宽自适应 (#3 #2 #1 )
						if(item.autoWidth || _this.params.autoWidth){
//							td.find("div.hc-datagrid-cell").css("width",item._maxLength);
//							f_td.find("div.hc-datagrid-cell").css("width",item._maxLength);
//							th.find("div.hc-datagrid-cell").css("width",item._maxLength);
						}else if(!width){
//							td.find("div.hc-datagrid-cell").css("width",100);
//							f_td.find("div.hc-datagrid-cell").css("width",100);
						}
						break;
					}
				}
//				if(!width){
					
					
//				}
				if(dictName){
					_this.dictColRender(td,dictName);
					if(_this.frozenObj)
					   _this.dictColRender(f_td,dictName);
				}else if(buttons){
					_this.buttonsColRender(td,buttons,idx,index,tr,_this,_this.result,_this.result[idx]);
				}
				if(renderer){
                    _this.colRendererFunc(td,renderer,idx,index,tr,td);
	    			if(_this.frozenObj)
	    				_this.colRendererFunc(f_td,renderer,idx,index,f_tr,f_td);
				}
			});
		});
	},
	/**
	 * @description 设置表格的标题
	 * @name Horn.DataGrid#setTitle
	 * @param {string} title  标题名<br>
	 * @return void
	 * @function
	 */
	setTitle:function(title){
		this.title = title;
		this. titleEl.text(title);
	},
	/**
	 * @description 获取表格的标题
	 * @name Horn.DataGrid#getTitle
	 * @param 
	 * @return string
	 * @function
	 */
	getTitle:function(){
		return this.title;
	},
	/**
	 * @description 动态添加标题按钮
	 * @name Horn.DataGrid#addButton
	 * @param {object} obj button的参数对象，具体的参数有：label 按钮的标签（必填否则无法添加）；name 按钮的name，作为标识按钮；cls 按钮的图标样式(默认提供的图标样式有：新增[fa-plus-circle]，修改[fa-pencil-square-o]，删除[fa-remove]，保存[fa-save],查询[fa-search],刷新[fa-refresh],文件夹[fa-folder-open-o])，默认无图标；event 按钮点击的事件处理函数
	 * @return 
	 * @function
	 */
	addButton:function(obj){
		var tmp = {"name":"","cls":"","event":""}
		obj = $.extend(tmp,obj)
		//增加nama参数和盼lable存在的条件;icon的样式设置不正确逗号放置的位置
		if(!obj || !obj.label)
			return;
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul");
		var buttonToAdd=$('<li><a name="'+obj.name+'" href="JavaScript:void(0)" class="hc-datagrid-a hc_datagrid-alink" onclick="'+obj.event+'"><i class="fa '+obj.cls+'"></i>'+obj.label+'</a></li>');
		titleButtons.append(buttonToAdd);
	},
	/**
	 * @description 动态隐藏与显示标题按钮
	 * @name Horn.DataGrid#hideButton
	 * @param Strng:name
	 * @param Boolean:hide,为true时隐藏，为false时展示
	 * @return 
	 * @function
	 */
	hideButton:function(name,hide){
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul");
		var buttons=titleButtons.children("li").children("a");
		for(var i=0;i<buttons.length;i++){
			if($(buttons[i]).attr("name")==name){
				$(buttons[i]).hide();
			}
		}
	}
});
$.extend(Horn.DataGrid, {
	"DATANAME" : "h_datagrid"});
Horn.regUI("div.xdatagrid",Horn.DataGrid) ;

function setDefaultValue(params, propName, value) {
    if (params[propName] === undefined) {
        params[propName] = value;
    }else{
    	if(params[propName]=="true"){
    		params[propName] = true;
    	}else if(params[propName]=="false"){
    		params[propName] = false;
    	}
    }
};
/**
 * @name Horn._Pagebar-pagebar  
 * @class
 */
Horn._Pagebar = function(config,_gridid,_grid){
	var pagebar = {
			//表格对象
			gridId:null,
			//首页页码
	        INDEX_PAGE:1,
	        //当前页码
	        currentPage : 1,
			//页面大小，每页显示多少条
			pageSize : 10,
			 //总条数
			pageCount : 0,
			 //总页数
			pages : 0,
			 //起始条数
			startRow:0,
			/**
			 * @ignore
			 */
			init : function(config,_gridid,_grid){
				if(config){
				//14700 【TS:201511060024-JRESPlus-财富管理事业部-王瑞明-对于DataGrid 控件的“pageConfig”属性，目】
					setDefaultValue(config,"pageSize",10);
					setDefaultValue(config,"pageNo",1);
					setDefaultValue(config,"startRow",0);
					setDefaultValue(config,"pageCount",0);
					setDefaultValue(config,"currentPage",0);
					this.currentPage = parseInt(config["currentPage"]);
					this.pageCount = parseInt(config["pageCount"]);
					this.pageSize = parseInt(config["pageSize"]);
					this.pageNo = parseInt(config["pageNo"]);
					this.startRow = parseInt(config["startRow"]);
					this.pages = 0;
				}
				this.gridId = _gridid;
				this.grid = _grid;
				this.grid.reqPageSize = this.pageSize;
				this.grid.reqPageNo = this.pageNo;
				this.el = $("#page_"+this.gridId);
			},
			/**
			 * @ignore
			 */
			initEvents : function(){
				var _pageBar = this;
				$("#page_"+this.gridId).children("li").find('a').each(function(idx,a){
					var item = $(a);
					var regClick = function(item,f,arg){
						item.click(function(){
							if(item.hasClass('disabled')){
								return;
							}
							//IE下debug的时候报错
							arg=arg||[];
							f.apply(_pageBar,arg);
						});
					};
					if(!item.hasClass("disabled")){
						if(item.hasClass("first_page_btn")){
							regClick(item,_pageBar.first);
						}else if(item.hasClass("pre_page_btn")){
							regClick(item,_pageBar.pre);
						}else if(item.hasClass("next_page_btn")){
							regClick(item,_pageBar.next);
						}else if(item.hasClass("last_page_btn")){
							regClick(item,_pageBar.last);
						}else if(item.hasClass("refresh_btn")){
							regClick(item,_pageBar.refresh);
						}
					}
				});
				//绑定分页按钮事件
				this.perPage = false;
				$("#_recPerPage"+this.gridId).on('click',function(){
					optGridId = $(this).attr("id");
					optGridId =optGridId.substring(11)
					var currPage = $(this).children("strong").text();
					//STORY #13244 【TS:201509210013-JRESPlus-资产管理事业部-张翔-2、1.0.18版本对应datagrid对应分页选择出现错乱】 - JRES
					if(_pageBar.perPage){
						//不能使用样式作为目标，应该以当前范围内的样式为目标 20150921 modify by 周智星
						//$(".dropdown-menu-datagrid").hide();
						$(this).next().hide();
						_pageBar.perPage = false;
					}else{
						//$(".dropdown-menu-datagrid").show();
						$(this).next().show();
						//11640 需求13244datagrid对应分页选择显示框中，请求多次时，会选中多条分页 20150922 modify by 周智星
						$(this).next().find("li").each(function(idx,a){
							var _page = $(this).children("a").text();
							if(currPage==_page){
								$(this).addClass("active");
							}else{
								$(this).removeClass("active");
							}
						});
						_pageBar.perPage = true;
					}
				});
				
				$("#_recPerPage"+this.gridId).bind('blur',function(e){
					var t = e;
					if(_pageBar.perPage){
						$(".dropdown-menu-datagrid").hide();
						_pageBar.perPage = false;
						return true;
					}
				});
				$(".dropdown-menu-datagrid").bind('mouseover',function(){
					$("#_recPerPage"+_pageBar.gridId).unbind('blur');
				});
				$(".dropdown-menu-datagrid").bind('mouseout',function(){
					$("#_recPerPage"+_pageBar.gridId).bind('blur',function(e){
						var t = e;
						if(_pageBar.perPage){
							$(".dropdown-menu-datagrid").hide();
							_pageBar.perPage = false;
							return true;
						}
					});
				});
				
				this.activeLi = $(".dropdown-menu-datagrid").find('li.active');
				//需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
				/*$(".dropdown-menu-datagrid").find('a').each(function(idx,a){
					var item = $(a); var pageSize = parseInt(item.html(),10);
					item.on('click',function(){
						//11640 需求13244datagrid对应分页选择显示框中，请求多次时，会选中多条分页 20150922 modify by 周智星
						if(_pageBar.gridId==optGridId){
							$("#pageSize_"+_pageBar.gridId).html(pageSize);
							_pageBar.activeLi.removeClass("active");
							_pageBar.activeLi=item.parent();
							item.parent().addClass("active");
							
							$(".dropdown-menu-datagrid").hide();
							_pageBar.perPage = false;
							
							_pageBar.grid.reqPage($("#toPage_"+_pageBar.grid.id).val(), pageSize);
						}
					});
				});*/
				//注册事件
				var thatgrid = this.grid;
				//$("#toPage_"+thatgrid.id).css("ime-mode","Disabled");
				$("#toPage_"+thatgrid.id).on('keydown',function(e){
					var k = e.keyCode;
					if(k == 27||k == 8)
						return true;
					if(k>=48 && k<=57)
						return true;
					if(k>=96 && k<=105)
						return true;
					
					var reg = new RegExp("[0123456789]");
					var cc = String.fromCharCode(k);
					if(!reg.test(cc)){
						return false;
					}
					
				});
				$("#toPage_"+thatgrid.id).on('blur',function(){
					var pageNum = $(this).val();
					if (!pageNum || isNaN(pageNum)){
						pageNum = thatgrid.reqPageNo;
					}
					pageNum = parseInt(pageNum,10);
					if(pageNum<=0)
						pageNum=1;
					else if(pageNum>thatgrid.pagebar.pages)	
						pageNum = 1;
					$(this).val(pageNum);
					thatgrid.reqPage($(this).val(), $("#pageSize_"+thatgrid.id).html());
				});
				//需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
				$("#pageSize_"+thatgrid.id).on('blur',function(){
					var pageSize = $(this).val();
					if(pageSize==""){
						var tmpPageSize = _pageBar.pageSize;
						if(tmpPageSize&&tmpPageSize!=""){
							pageSize = tmpPageSize;
						}else{
							pageSize =10;
						}
					}
					if (!pageSize || isNaN(pageSize)){
						pageSize = thatgrid.pageSize;
					}
					pageSize = parseInt(pageSize,10);
					if(pageSize<=0)
						pageSize=1;

					$(this).val(pageSize);
					
					_pageBar.grid.reqPage(parseInt($("#toPage_"+_pageBar.grid.id).val()), pageSize);
				});

				
			},
			/**
			 * @ignore
			 */ 
			calPage_:function(reqPageNo,reqPageSize,totalCount){
				this.pageSize = parseInt(reqPageSize);
				this.pageCount = parseInt(totalCount);
				this.pages = Math.ceil(this.pageCount/this.pageSize);
				if((reqPageNo*this.pageSize) > this.totalCount){
					this.currentPage = this.pages;
				}else
					this.currentPage = reqPageNo;
			},
			/**
			 * @ignore
			 */
			pre:function(){
				if(this.currentPage <= 1 || this.pageCount == 0) {
					this.grid.reqPage(1,this.pageSize);
				}else{
					this.grid.reqPage((this.currentPage - 1),this.pageSize);
				}
			},
			/**
			 * @ignore
			 */
			next:function(){
				if(this.pages == this.currentPage){
					return;
				}
				//需求 #14790 【TS:201511120068-JRESPlus-财富管理事业部-虞凯 重新选择每页显示条数，点击下一页，页码出错
				var tmpPageNo = 0;
				if(this.currentPage!=""){
					tmpPageNo = parseInt(this.currentPage)+1;
				}
				this.grid.reqPage(tmpPageNo,this.pageSize);
			},
			/**
			 * @ignore
			 */
			last:function(){
				if(this.pages == 0) 
					return ;
				else
					this.grid.reqPage(this.pages,this.pageSize);
			},
			/**
			 * @ignore
			 */
			first :function(){
				this.grid.reqPage(this.INDEX_PAGE,this.pageSize);
			},
			/**
			 * @ignore
			 */
			refresh : function(){
//				this.grid.load();
				var gridpageNo = this.grid.reqPageNo - 1;
				if(this.grid.loadFlag == "autoLoad"){
					gridpageNo = this.grid.reqPageNo
				}
				this.grid.reqPage(gridpageNo,this.pageSize);
			},
			/**
			 * @ignore
			 */
			getPageInfo:function(){
				var info;
				var startNo = 0,endNo = 0;
				if(this.pageCount > 0){
					startNo = this.pageSize*(this.currentPage-1) + 1;
					if((this.pageSize*this.currentPage) >= this.pageCount){
						endNo = this.pageCount;
					}else{
						endNo = this.pageSize*this.currentPage;
					}
				}
				info = "显示"+startNo+"到"+endNo+"条,共"+this.pageCount+"条记录";
				return info;
			},
			/**
			 * @ignore
			 */
			setTotalCount:function(total){
				this.totalCount = parseInt(total);
			}
			
	};
	pagebar.init(config,_gridid,_grid);
	pagebar.initEvents();
	return pagebar;
}

String.prototype.getWidth = function(fontSize){
    var span = document.getElementById("__getwidth");
    if (span == null) {
        span = document.createElement("span");
        span.id = "__getwidth";
        document.body.appendChild(span);
        span.style.visibility = "hidden";
        span.style.whiteSpace = "nowrap";
    }
    span.innerHTML = this.toString();
    span.style.fontSize = fontSize + "px";

    return span.offsetWidth;
}
/*
 * 修改日期         修改人员        修改说明
 * -----------------------------------------------------------------------
 * 
 * 2014-1-28    zhangc   修正错误显示逻辑，removeError之后无法再次显示的问题
 * 2014-2-24	zhangc   修正removeRule之后会变成逗号分隔的问题。
 * 2014-3-3     cnt      支持重置为defValue为空的值(宏设置参数:defValue:"")
 * 2014-3-3    周智星          BUG #6518 【calendar】先进行非空校验的错误提示，然后调用removeRule("qq")，会造成非空校验的错误提示消失
 * 2014-4-30   周智星          BUG #6916 【textfield】【textarea】【password】"check": "required"情况下调用setReadonly(true)会取消掉非空校验 
 * 2014-8-19	王玉豹	   STORY #9430 [研发中心/内部需求][JresPlus][UI]textfield组件在必填状态下，先清空值，然后执行setValue()设置非空值后，校验信息依然存在
 * 2014-10-30	王玉豹		使所有表单组组件的value属性换行配置生效
 * 2015-12-02  周智星          需求 #15004 【TS:201511230300-JRESPlus-资产管理事业部-张翔-4.文本框和下选框值长度过长（超过组件宽度）无法显示
 * 2015-12-21  周智星          STORY #15644 【TS:201512150185-JRESPlus-财富管理事业部-王瑞明-  在TCMP的使用过程中，有些场景需要默认隐藏字段】
 * 2016-3-7    刘龙              需求#17640 【TS:201603030358-JRESPlus-财富管理事业部-虞凯-【项目名称】HUNDSUN另类投资管理系统软件V4.0<br】
 * 2016-3-18   刘龙              bug#17068 typefield控件，value属性设置初始值为超出maxlength位数的值
 * 2016-03-22  刘龙              bug#17116 调用hidden控件的hide方法后再调用show方法，无法显示在原先位置
 * 2016-3-23   刘龙             bug#17218 typefield控件设置value值，maxlength截取后，输入框为分隔符未计入位数，但是焦点移入后移出，分隔符又被计入位数
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Field
 * @class
 * 普通文本输入组件<br/>
 * 包装普通文本框、文本域、密码框等对象的基础操作
 */
/**
 * @lends Horn.Field#
 */
	 

/**
 * 组件唯一标识
 * @name Horn.Field#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Field#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Field#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Field#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Field#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Field#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Field#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过setValue、reset等API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Field#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的panel的cols而定(支持1-4列)
 * @name Horn.Field#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Field#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Field#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 控制内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7，空格、英文字母、标点都只算一个字符。（当为typefield组件时，显示分隔符不进行计数，只统计数字长度）
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作。
 * @name Horn.Field#maxlength
 * @type Number
 * @default 
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Field#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 是否隐藏组件
  * @name Horn.Field#hidden
  * @type Boolean
  * @default false
  * @example
  * 
  */
/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Field#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Field#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Field#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Field#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Field#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Field#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Field#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Field#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Field#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Field#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过setValue、reset等API修改表单的值
 * @function
 * @name Horn.Field#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Field#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Field#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Field#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Field#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Field#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Field#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */

/**
 * 显示验证错误提示
 * @function
 * @name Horn.Field#showError
 * @param {String} errorMsg 错误信息
 * @ignore
 */
/**
 * 删除错误提示
 * @function
 * @name Horn.Field#removeError
 * @ignore
 */

Horn.Field = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Field",
    /**
     * text、textarea字段
     * @name Horn.Field#field
     * @field
     * @ignore
     */
    field : null ,
    /**
     * @name Horn.Field#hidden
     * @description  {jQuery} hidden隐藏域字段
     * @field
     * @ignore
     */
    hidden : null,
    /**
     * @name Horn.Field#checkGroup
     * @description  {jQuery} 字段相关的组名/值键值对
     * @field
     * @ignore
     */
    checkGroup : null,
    /**
     * @name Horn.Field#defValue
     * @description  {String} 字段的默认值
     * @field
     * @ignore
     */
    defValue : "",
    /**
     * @name Horn.Field#defHiddenValue
     * @description  {String} 隐藏字段的默认值
     * @field
     * @ignore
     */
    defHiddenValue : "",
    /**
     * @ignore
     */
    init : function(dom){
    Horn.Field.superclass.init.apply(this,arguments);
    if (this.field == undefined) {
    	this.hidden = this.el.children("input[type='hidden']");
        if(this.hidden.length){
            this.field = this.hidden.next("input[type]") ;
        }
        else{
            this.field = this.el.children("input[type]");
            if(this.field.length==0){
                this.field = this.el.children("textarea");
            }
        }
    }
    this.name = this.field.attr('name')||this.name;
    this.checkGroup = {};
   	var _field = this,
   	checkgroup = this.field.attr('group');
   	if(checkgroup){
   		var groupArr = checkgroup.split(';');
   		$(groupArr).each(function(idx,group){
   			_field.checkGroup[group] = true;
   		});
   	}
   	this.initEvents();
   	this.defHiddenValue = "";
   	this.defValue = "";
   	if(this.hidden.length > 0) {
   		this.defHiddenValue= this.params.defValue || this.hidden.val() || "";
   	}
   	if(this.field.length > 0){
   		this.defValue = this.params.defValue || this.field.val() || "";
   	}
   	//STORY #15644 【TS:201512150185-JRESPlus-财富管理事业部-王瑞明-  在TCMP的使用过程中，有些场景需要默认隐藏字段】
   	if(this.params.hidden&&this.params.hidden==true){
   		this.hide();
   	}
   	//bug 17068 typefield控件，value属性设置初始值为超出maxlength位数的值
   	if(this.params.maxlength){
   		var max=parseInt(this.params.maxlength,10); //获取maxlength的值 
		if(max>0){ 
			if(this.field.val()!=undefined&&_field.getStrlen(this.field.val())>max){ //textarea的文本长度大于maxlength 
				var cutVal=this.field.val().substr(0,max);
				this.field.val(cutVal); //截断textarea的文本重新赋值 
				var _hidden= this.field.prev(":hidden");
				if(_hidden){
					_hidden.val(cutVal);
				}
				this.params.value=cutVal;
			}
			
		}
   	}
	var rv = this.getIEVersion();
	if(rv!=-1&&rv<10){
		if(this.params.emptyText&&this.params.emptyText!=""){
			this.field.val(this.params.emptyText);
		}
	}
   	//17640 【TS:201603030358-JRESPlus-财富管理事业部-虞凯-【项目名称】HUNDSUN另类投资管理系统软件V4.0<br】
   	this.field.keyup(function(){ 
		var area=$(this); 
		var max=parseInt(_field.params.maxlength,10); //获取maxlength的值 
		if(max>0){ 
			if(_field.getStrlen(area.val())>max){ //textarea的文本长度大于maxlength 
				area.val(_field.getSubstring(area.val(),max)); //截断textarea的文本重新赋值 
			} 
		} 
	});
  	this.field.focus(function(){ 
  		var rv = _field.getIEVersion();
		if(rv!=-1&&rv<10){
			if(_field.params.emptyText&&_field.params.emptyText!=""){
				if(_field.field.val()==_field.params.emptyText){
					_field.field.val("");
				}
			}
		}
	}); 
	//复制的字符处理问题 
	this.field.blur(function(){ 
		var area=$(this); 
		var max=parseInt(_field.params.maxlength,10); //获取maxlength的值 
		var isTypefiled=$(this).parent("div.typefield"); 
		if(max>0){ 
		//bug 17218 typefield控件设置value值，maxlength截取后，输入框为分隔符未计入位数，但是焦点移入后移出，分隔符又被计入位数
			if(isTypefiled){//typefield组件分隔符不计入字符计数
				if($(this).attr("inputType")== "cardNo"){//卡号的空格分隔符是2个
					if(_field.getStrlen(area.val())>(max+2)){ //金额的空格分隔符是1个
						area.val(_field.getSubstring(area.val(),max+2)); //截断textarea的文本重新赋值 
					}
				}else{
					if(_field.getStrlen(area.val())>(max+1)){ //金额的空格分隔符是1个
						area.val(_field.getSubstring(area.val(),max+1)); //截断textarea的文本重新赋值 
					}
				}	 
			}else{
			if(_field.getStrlen(area.val())>max){ //textarea的文本长度大于maxlength 
				area.val(_field.getSubstring(area.val(), max)); //截断textarea的文本重新赋值 
			} 
		} 
			 
		}
		var rv = _field.getIEVersion();
		if(rv!=-1&&rv<10){
			if(_field.params.emptyText&&_field.params.emptyText!=""){
				if(area.val()==""){
					_field.field.val(_field.params.emptyText);
				}
			}
		}
	});
   	//使所有表单组组件的value属性换行配置生效
   	//if(this.params.value != undefined) this.setValue(this.params.value.split("\\n").join("\n"));
	//   	if(this.params.value != undefined) this.setValue(this.params.value.split("\\n").join("\n"));
	},
	getStrlen:function(str){//一个中文相当于两个字符
    	var num = Horn.Field.DEFAULT_CH_NUM;
        var len = 0;
        for (var i=0; i<str.length; i++) { 
	         var c = str.charCodeAt(i); 
	         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
	           len++; 
	         }else{ 
	    		len+=num; 
	         } 
        }
        return len;
    },
    getSubstring:function(str,maxlength){//一个中文相当于两个字符
		var tmp = "";
		var num = Horn.Field.DEFAULT_CH_NUM;
		var len = 0;
        for (var i=0; i<str.length; i++) { 
	         var c = str.charCodeAt(i); 
	         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
	           len++; 
	         }else{ 
	    		len+=num; 
	         } 
	         if(len<=maxlength){
					tmp = tmp+str[i];
			}
        }
        return tmp;
    },
    getIEVersion : function(){
    	var rv = -1;
    	  if (navigator.appName == 'Microsoft Internet Explorer'){
    	    var ua = navigator.userAgent;
    	    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    	    if (re.exec(ua) != null)
    	      rv = parseFloat( RegExp.$1 );
    	  }else if (navigator.appName == 'Netscape'){
    	    var ua = navigator.userAgent;
    	    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    	    if (re.exec(ua) != null)
    	      rv = parseFloat( RegExp.$1 );
    	  }
    	return rv;
    },
    getEventTarget : function() {
    	this.hidden = this.el.children("input[type='hidden']");
        if(this.hidden.length){
            this.field = this.hidden.next("input[type]") ;
        }
        else{
            this.field = this.el.children("input[type]");
            if(this.field.length==0){
                this.field = this.el.children("textarea");
            }
        }
    	return this.field;
    },
    /**
     * @name Horn.Field#checkRegx
     * @description  {array} 正则检查字符串数组
     * @field
     * @ignore
     */
    checkRegx : null ,
    /**
     * @name Horn.Field#initEvents
     * @description  正则检查字符串数组
     * @function 初始化方法
     * @private 
     * @ignore
     */
    initEvents : function(){
    	var _field = this;
    	_field.checkRegx = [];
    	var checkStr = this.field.attr('checkstr');
    	if(checkStr) {
    		_field.checkRegx = checkStr.split(';');
    	}
    	this.field.blur(function(){
    		//Horn.Validate.onValid({data:[Horn.Validate,_field]});
    		_field.validate();
    		//需求 #15004 【TS:201511230300-JRESPlus-资产管理事业部-张翔-4.文本框和下选框值长度过长（超过组件宽度）无法显示
    		var title = _field.field.val();
    		if(title!=null&&title!=""){
    			title = title+"";
    			title = title.replace(/(^\s*)|(\s*$)/g,'');
    		}
    		if(_field.COMPONENT_CLASS=="Field" || _field.COMPONENT_CLASS=="Password"){
    			_field.field.val(title);
    		}
    		var cls = _field.el.attr("class");
    		if(cls!="hc_password" && cls!="hc_passwordgroup"){
    			_field.field.attr("title",title);
    		}
    	});
    	
//    	if(checkStr.indexOf('blacklist')!=-1){
//    		if(checkStr.indexOf(Horn.Validate.REQUIRED) != -1){
//    			this.showError("请等待黑名单检测完成");
//    		}
//    	}
    },
    /**
     * 内容校验
     * @function
     * @ignore
     * @name Horn.Field#validate
     */
    validate : function(){
    	var _field = this;
    	var rv = _field.getIEVersion();
		if(rv!=-1&&rv<10){
			if(_field.params.emptyText&&_field.params.emptyText!=""&&_field.field.val()==_field.params.emptyText){
				_field.field.val("");
			}
		}
    	if(!this.skipValid) {
    		//this.field.blur();
    		Horn.Validate.onValid({data:[Horn.Validate,_field]});
    	}
    },
    /**
     * 加入一个分组中
     * @function
     * @name Horn.Field#addGroup
     * @param group 组名
     * @ignore
     */
    addGroup : function(group){
       	this.checkGroup[group] = true;
    },
    /**
     * 从一个分组中删除
     * @function
     * @name Horn.Field#removeGroup
     * @param group 组名
     * @ignore
     */
    removeGroup : function(group){
       	this.checkGroup[group] = false;
    },
    /**
     * 是否在一个分组中
     * @function
     * @name Horn.Field#inGroup
     * @param groupName 组名
     * @ignore
     */
    inGroup : function(groupName){
    	return !!this.checkGroup[groupName];
    },
    /**
     * 获取提交的jQuery包装的field
     * @function
     * @name Horn.Field#get
     * @returns jQuery
     * @ignore
     */
    get : function(){
        if(this.hidden && this.hidden.length){
            return this.hidden ;
        }
        return this.field ;
    },
    /**
     * 增加校验规则
     * @function
     * @name Horn.Field#addRule
     * @param {String} rule 校验规则字符串
     * @ignore
     */
    addRule : function(rule) {
        var input = this.get();
        var check = input.attr(Horn.Validate.CHECK);
        if (check) {
            if (check.indexOf(rule) > -1) {
                return;
            }
            check += Horn.Validate.CHECKSEP + rule;
        } else {
            check = rule;
        }
        input.attr(Horn.Validate.CHECK, check);
        if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
            var li = this.el.parent().parent(".g-unit-wrap");
            var lab = li.children("label");
            var red = $("span.m-verify-symbol", lab);
            if (!red.length) {
                red = $("<span>", {
                    "class" : "m-verify-symbol",
                    "html" : "*"
                });
                lab.prepend(red);
            } else {
                red.html("*");
            }
            
        }
        this.removeError();
        this.field.removeClass('m-verify-success');
    },
    /**
     * 删除校验规则
     * @function
     * @name Horn.Field#removeRule
     * @param {String} rule 校验规则字符串
     * @ignore
     */
    removeRule : function(rule) {
        var input = this.get();
        var check = input.attr(Horn.Validate.CHECK);
          //BUG #6518 【calendar】先进行非空校验的错误提示，然后调用removeRule("qq")，会造成非空校验的错误提示消失
        if (check && check.indexOf(rule) > -1) {//如果要去除的在原来的验证规则了就删除，否则不删除
            var checks = check.split(Horn.Validate.CHECKSEP);
            checks = $.grep(checks, function(c, index) {
                return c && c != rule;
            });
            input.attr(Horn.Validate.CHECK, checks.join(';'));
            this.removeError();
            this.setNotRequired();
        }
    },
    /**
     * 是否跳过验证标识
     * @name Horn.Field#skipValid
     * @field
     * @default false
     * @ignore
     */
    skipValid : false,
    /**
     * 显示field字段，包含label部分
     * @function
     * @name Horn.Field#show
     * @ignore
     */
    show : function() {
    	this.skipValid=false;
        var li = this.el.parent().parent(".g-unit-wrap");
        //bug#17116 调用hidden控件的hide方法后再调用show方法，无法显示在原先位置
        //hidden组件调用show方法会显示出来
        if(this.el.attr("type")=="hidden"){
        	return;
        }
        if (li.css("display") == "none") {
            li.css("display", "block");
        }
        if (li.css("visibility") == "hidden") {
            li.css("visibility", "visible");
        }
        //Horn.enterToTab(Horn.getCurrent());
    },
    
    /**
     * 隐藏label字段，包含label部分
     * @function
     * @name Horn.Field#hide
     * @param {String} mode 取值为display或visibility
     * @ignore
     */
    hide : function(mode) {//display   visibility
    	this.skipValid=true;
        mode =  mode || "display" ;
        var li = this.el.parent().parent(".g-unit-wrap");
        if(mode=="display"){
            li.css("display", "none");
        }
        else{
            li.css("visibility", "hidden");
        }
        if(this.err){
        	this.removeError();
        }
        //Horn.enterToTab(Horn.getCurrent());
    },
    /**
     * 设置label标签
     * @function
     * @name Horn.Field#setLabel
     * @param {String} label 标签内容
     * @ignore
     */
    setLabel : function(label){
    	var li = this.el.parent().parent();
        var lab = $("label", li);
        var red = $("span.m-verify-symbol", lab);
        lab.attr("title",label);
        if (!red.length) {
        	lab.html(label);
        } else {
        	lab.html('<span class="m-verify-symbol">*</span>'+label);
        }
    },
    /**
     * 获取label标签
     * @function
     * @name Horn.Field#getLabel
     * @return 标签的值
     * @ignore
     */
    getLabel : function(){
    	var li = this.el.parent().parent();
        var span = $("label", li);
        return span.attr("title");
    },
    /**
     * 设置为必填项，同时增加红色的 *
     * @function
     * @name Horn.Field#setRequired
     * @ignore
     */
    setRequired : function(required) {
    	if (required === false) {
    		this.setNotRequired();
    		return;
    	}
        this.addRule(Horn.Validate.REQUIRED);
    },
    /**
     * 设置为非必填，同时删除红色的 *
     * @function
     * @name Horn.Field#setNotRequired
     * @ignore
     */
    setNotRequired : function() {
        var li = this.el.parent().parent(".g-unit-wrap");
        var lab = $("label", li);
        var red = $("span.m-verify-symbol", lab);
        this.removeRule(Horn.Validate.REQUIRED);
        this.field.removeClass('m-verify-error');
        red.html("");
    },
    /**
     * 设置字段是否可用，设置为不可用，则不能提交
     * @function
     * @name Horn.Field#setEnable
     * @param {Boolean} enabled 如果为true设置为可用，设置为false，设置不可用
     * @ignore
     */
    setEnable : function(enabled) {
        var input = this.field;
        var hidden = this.hidden;

        var display = input.next("input[type='text']");
        if (enabled) {
            input.removeAttr("disabled");
            display.removeAttr("disabled");
            if(hidden) hidden.removeAttr("disabled");
        } else {
            input.attr("disabled", "disabled");
            display.attr("disabled", "disabled");
            if(hidden) hidden.attr("disabled", "disabled");
        }
        //Horn.enterToTab(Horn.getCurrent());
    },
    // 方法冗余
    setDisabled : function(disabled) {
    	if (disabled === false) {
    		this.setEnable(true);
            this.disabled = false;
    	} else {
    		//this.setNotRequired();
    		this.setEnable(false);
            this.disabled = true;
    	}
    },
    /**
     * 设置是否可编辑
     * @function
     * @name Horn.Field#setReadonly
     * @param {Boolean} readonly 不可编辑
     * @ignore
     */
    setReadonly : function(readonly) {
    	if (readonly === false) {
    		this.field.removeAttr("readonly");
    		this.readonly = false;
    	} else {
    		//BUG #6916 【textfield】【textarea】【password】"check": "required"情况下调用setReadonly(true)会取消掉非空校验
    		//this.setRequired(false);//为只读时不进行非空校验
    		this.field.attr("readonly", "readonly");
    		this.readonly = true;
    	}
//        this.field.attr("readonly", readOnly);
    },
    /**
     * 设置值
     * @function
     * @name Horn.Field#setValue
     * @param {String} value 值
     * @ignore
     */
    setValue : function(value) {
    	 if(value!=null&&value!=""){
    		 value = value+"";
         	value = value.replace(/(^\s*)|(\s*$)/g,'');
         }
        this.field.val(value);
        this.hidden.val(value);
        //this.field.blur();
        //STORY #9430 [研发中心/内部需求][JresPlus][UI]textfield组件在必填状态下，先清空值，然后执行setValue()设置非空值后，校验信息依然存在
        	this.validate();
    },
    /**
     * 获取值
     * @function
     * @name Horn.Field#getValue
     * @return 返回field的实际值
     * @ignore
     */
    getValue : function() {
    	//需求 #18434 目前ABS系统中，查询条件中的textfield控件无法自动过滤录入信息前后的空格，导致客户黏贴的文字（前后有空格）无法查出信息。
   	 	var input = this.get();
        var val = input.val();
        if(val!=null&&val!=""){
        	val =val+"";
        	val = val.replace(/(^\s*)|(\s*$)/g,'');
        }
        return val;
    },
    /**
     * 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
     * @function
     * @name Horn.Field#reset
     * @param {String} 初始值
     * @ignore
     */
    reset : function(clear) {
    	var defValue = "";
    	if (this.hidden && this.hidden.length > 0) {
    		defValue = clear?"":this.defHiddenValue;
    	} else {
    		defValue = clear?"":this.defValue;
    	}
    	this.setValue(defValue);
    },
    /**
     * 清除值
     * @function
     * @name Horn.Field#clearValue
     * @ignore
     */
    clearValue : function() {
    	//17990 【TS:201603220311-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br><br>】
    	if(this.cal1){//如果是calendargroup组件
    		var name1=this.name1;
    		var name2=this.name2;
    		this.setValue({name1:null,name2:null});
    	}else{
    		this.setValue("");
    	}
    	
    },
    /**
     * 给field绑定事件
     * @function
     * @name Horn.Field#bind
     * @param {String} type 事件类型
     * @param {Object} data 事件绑定的数据
     * @param {Function} fn 事件绑定的方法
     * @ignore
     */
    bind : function(type, data, fn) {
        var input = this.get();
        if($.type(data)=="function"){
            input.bind( type, data);
        }
        else{
            input.bind( type, data, fn);
        }
    },
    /**
     * 验证内容是否有效
     * @function
     * @name Horn.Field#isValid
     * @return true or false
     * @ignore
     */
    isValid : function(){
    	return !this.err;
    },
    /**
     * @description {Boolean} 验证情况（是否出现验证失败）
     * @field
     * @name Horn.Field#err
     * @default false
     * @ignore
     */
    err : false,
    /**
     * @description {Boolean} 验证情况（是否出现验证失败）
     * @field
     * @name Horn.Field#err
     * @default null
     * @ignore
     */
    msgDiv : null,
    /**
     * 显示验证错误信息
     * @function
     * @name Horn.Field#showError
     * @param {String} 错误信息
     * @ignore
     */
    showError : function(errorMsg){
    	var field = this.field; 
    	field.removeClass('m-verify-success');
    	field.addClass('m-verify-error');
    	errorMsg = $.type(errorMsg) == "boolean" ? "校验错误" : errorMsg;
    	if(!this.msgDiv){
    		this.msgDiv = $('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');
    		this.el.after(this.msgDiv);
    	}
        var msg = this.msgDiv;
        msg.html("<div class=\"verify-tip-arrow\"></div><div class=\"verify-tip-inner\">"+errorMsg+"</div>");
        msg.css("display", "block");
        this.err = true;
    },
    /**
     * 删除错误信息
     * @function
     * @name Horn.Field#removeError
     * @ignore
     */
    removeError : function(){
    	this.field.removeClass('m-verify-error');
        var input = this.get();
        var check = input.attr(Horn.Validate.CHECK);
        if (check) {
        	if(this.isValid){
            	this.field.addClass('m-verify-success');
            }
        }
        this.err = false;
    	var msg = this.msgDiv;
    	if(msg) msg.remove();
    	delete this.msgDiv ;
    },
    /**
     * 实现此接口的组件可以返回两个或以上的name，在form中设置值的时候，会向该field提供这些name所对应的值
     * @function
     * @name Horn.Field#mutiName
     * @return {Boolean/Array}
     * @ignore
     */
    mutiName : function(){
		return false;    
    }
}) ;

/**
 * @lends Horn.Field
 */
$.extend(Horn.Field,{
    /**
     * @description 获取包装字段，没有则获取原始jQuery对象
     * @name Horn.Field.get
     * @function
     * @param {String} name
     * @param {String} alias
     * @return {jQuery}
     * @ignore
     */
    get : function(name,alias){
        if (jQuery.type(name) != 'string') {
            var jObj = $(name) ;
            name = jObj.attr("name") ;
            alias = jObj.attr("alias") ;
            if(!name){
            	var hidden = jObj.prev("input[type='hidden'][name]") ;
                name = hidden.attr("name") ;
                alias = hidden.attr("alias") ;
            }
        }
        var field = Horn.getComp(name,alias) ;
        return field ;
    },
    /**
     * @description 增加校验规则
     * @function
     * @name Horn.Field.addRule
     * @param {String} rule 校验规则字符串
     * @param {String} name 名称
     * @param {String} alias　别名
     * @ignore
     * 
     */
    addRule : function(name, rule, alias) {
        var field = this.get(name,alias) ;
        field.addRule(rule) ;
    },
    /**
     * @description 删除校验规则
     * @function
     * @name Horn.Field.removeRule
     * @param {String} rule 校验规则字符串
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    removeRule : function(name, rule, alias) {
        var field = this.get(name,alias) ;
        field.removeRule(rule) ;
    },
    /**
     * @description 显示field字段，包含label部分
     * @function
     * @name Horn.Field.show
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    show : function(name, alias) {
        var field = this.get(name,alias) ;
        field.show() ;
    },
    /**
     * @description 隐藏label字段，包含label部分,设置display为none
     * @function
     * @name Horn.Field.hide
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    hide : function(name, alias) {
        var field = this.get(name,alias) ;
        field.hide("display") ;
    },
    /**
     * @description 隐藏label字段，包含label部分,设置visibility为hidden
     * @function
     * @name Horn.Field.hidden
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    hidden : function(name, alias) {
        var field = this.get(name,alias) ;
        field.hide("visibility") ;
    },
    /**
     * @description 设置为必填项，同时增加红色的 *
     * @function
     * @name Horn.Field.setRequired
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setRequired : function(name,alias) {
        var field = this.get(name,alias) ;
        field.setRequired() ;
    },
    /**
     * @description 设置为非必填，同时删除红色的 *
     * @function
     * @name Horn.Field.setNotRequired
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setNotRequired : function(name, alias) {
        var field = this.get(name,alias) ;
        field.setNotRequired() ;
    },
    /**
     * @description 设置字段是否可用，设置为不可用，则不能提交
     * @function
     * @name Horn.Field.setEnable
     * @param {Boolean} enabled 如果为true设置为可用，设置为false，设置不可用
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setEnable : function(name, enabled, alias) {
        var field = this.get(name,alias) ;
        field.setEnable(enabled) ;
    },
    /**
     * @description 设置是否可编辑
     * @function
     * @name Horn.Field.setReadonly
     * @param {String} readOnly "readonly" 不可编辑
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setReadonly : function(name, readOnly, alias) {
        var field = this.get(name,alias) ;
        field.setReadonly(readOnly) ;
    },
    /**
     * @description 设置label标签
     * @function
     * @name Horn.Field.setLabel
     * @param {String} name 名字
     * @param {String} label 标签内容
     * @param {String} alias 别名
     * @ignore
     */
    setLabel : function(name, label, alias){
        var field = this.get(name,alias);
        field.setLabel(label);
    },
    /**
     * @description 获取label标签
     * @function
     * @name Horn.Field.getLabel
     * @param {String} name 名字
     * @param {String} alias 别名
     * @return 返回label值
     * @ignore
     */
    getLabel : function(name,alias){
        var field = this.get(name,alias);
        return field.getLabel();
    },
    /**
     * @description 设置值
     * @function
     * @name Horn.Field.setValue
     * @param {String} value 值
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    setValue : function(name, value, alias) {
        var field = this.get(name,alias) ;
        if(field){
            field.setValue(value) ;
        }
        else{
            this.getField(name,alias).val(value) ;
        }
    },
    /**
     * @description 获取值
     * @function
     * @name Horn.Field.getValue
     * @param {String} name
     * @param {String} alias
     * @return 返回field的实际值
     * @ignore
     */
    getValue : function(name, alias,form) {
        var field = this.get(name,alias) ;
        if(field){
            return field.getValue() ;
        }
        else{
            return this.getField(name,alias,form).val() ;
        }
    },
    /**
     * @description 重置成初始值
     * @function
     * @name Horn.Field.reset
     * @param {String} name
     * @param {String} alias
     * @ignore
     */
    reset : function(name, alias) {
        var field = this.get(name,alias) ;
        if(field){
            field.reset() ;
        }
        else{
            this.getField(name,alias).each(function(){
                this.reset() ;
            }) ;
        }
    },
    /**
     * @description 清除值
     * @function
     * @name Horn.Field.clearValue
     * @param {String} name　名称
     * @param {String} alias　别名
     * @ignore
     */
    clearValue : function(name, alias) {
        var field = this.get(name,alias) ;
        if(field){
            field.clearValue() ;
        }
        else{
            this.getField(name,alias).val("") ;
        }
    },
    /**
     * @description 给field绑定事件
     * @function
     * @name Horn.Field.bind
     * @param {String} name
     * @param {String} alias
     * @param {String} type 事件类型
     * @param {Object} data 事件绑定的数据
     * @param {Function} fn 事件绑定的方法
     * @ignore
     */
    bind : function(name, alias, type, data, fn) {
        var field = this.get(name,alias) ;
        field.bind(type, data, fn) ;
    },
    /**
     * @description 获取选择器
     * @function
     * @name Horn.Field.getSelector
     * @param {String} name
     * @param {String} alias
     * @return {String} 选择器字符串
     * @ignore
     */
    getSelector : function(name, alias) {
        var selector = "";
        if (name) {
            selector += "[name='" + name + "']";
        }
        if (alias) {
            selector += "[alias='" + alias + "']";
        }
        return "input" + selector + ",textarea" + selector;
    },
    /**
     * @description 获取jQuery的field对象
     * @function
     * @name Horn.Field.getField
     * @param {String} name
     * @param {String} alias
     * @param {Jquery/DomElement} form
     * @return {Jquery}
     * @ignore
     */
    getField : function(name, alias,form) {
        var current = Horn.getCurrent() ;
        alias = alias||"" ;
        var field = null;
        if(!form){
        	form = current.find("form");
        	 if (jQuery.type(name) == 'string') {
	            var selector = Horn.Field.getSelector(name, alias);
	            field = $(selector, form)|| $(selector);
	            if (!alias) {
	                field = field.not(":disabled");
	            }
	        } else {
	            field = $(name, form);
	        }
	        return field;
        }else{
        	return form.findField(name,alias);
        }
    },
    /**
     * @description 从范围内获取所有Horn.Field子项
     * @function
     * @name Horn.Field.findFieldCompsIn
     * @param {Jquery/DomElement} scope
     * @return {[Array<Horn.Field>]}
     * @ignore
     */
    findFieldCompsIn : function(scope){
    	var fields = [];
    	this.findFieldsIn(scope).each(function(i,f){
    		var field = Horn.getCompByEl($(f));
    		if(field){
    			fields.push(field);
    		}
    	});
    	return $(fields);
    },
    /**
     * @description 从范围内获取Field的子项目
     * @function
     * @name Horn.Field.findFieldsIn
     * @param {Jquery/DomElement} scope
     * @return {Jquery[Array<DomElement>]}
     * @ignore
     */
    findFieldsIn : function(scope){
    	return $(scope).find(this.TYPES.join(','));
    },
    /**
     * @description 根据获取到的input，查找到所在的Horn组件
     * @function
     * @name Horn.Field.findInputComp
     * @param {Jquery/DomElement} 对应的input
     * @return {Horn}
     * @ignore
     */
    findInputComp : function(input){
    	return $(input).parents(this.TYPES.join(',')).first().comp();
    },
    /**
     * @description {Boolean} 验证情况（是否出现验证失败）
     * @field
     * @name Horn.Field#TYPES
     * @private
     */
    TYPES:[],
    /**
     * @description 注册Horn.Field类型的组件
     * @function
     * @name Horn.Field.regFieldType
     * @param {string} type
     * @param {Horn.Field} Clazz
     * @ignore
     */
    regFieldType : function(type,Clazz){
    	Horn.regUI(type,Clazz); 
    	this.TYPES.push(type);
    }
}) ;
Horn.apply(Horn.Field,{
	DEFAULT_CH_NUM : 2
});
Horn.Field.regFieldType("div.hc_textfield._text",Horn.Field) ;
Horn.Field.regFieldType("div.hc_textarea",Horn.Field) ;

/*
 * 修改日期         修改人员        修改说明
 * -----------------------------------------------------------------------
 * 
 * 2016-1-6      刘龙          增加hidden属性，show()、hide()方法
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.FieldSet
 * @class
 * 模块化展示组件<br/>
 * 可以包含文本框、文本域、密码框等表单组件
 */
/**
 * @lends Horn.FieldSet#
 */
	 

/**
 * 组件唯一标识
 * @name Horn.FieldSet#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件名字
 * @name Horn.FieldSet#name
 * @type String
 * @default ""
 * @example
 * #@fieldset({"name":"fieldset","title":"测试表单分组"})
 * 	  #textfield({"label":"客户名称","name":"clientName","value":""})
 *    #textfield({"label":"客户编号","name":"clientId","value":""})
 * #end
 */
/**
 * 组件标题
 * @name Horn.FieldSet#title
 * @type String
 * @default ""
 * @example
 * #@fieldset({"name":"fieldset","title":"测试表单分组"})
 * 	  #textfield({"label":"客户名称","name":"clientName","value":""})
 *    #textfield({"label":"客户编号","name":"clientId","value":""})
 * #end
 */
 /**
  * 是否隐藏组件
  * @name Horn.FieldSet#hidden
  * @type Boolean
  * @default false
  * @example
  * 
  */

Horn.FieldSet = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"FieldSet",
    hidden : null,
    params:null,
    init : function(dom){
        Horn.FieldSet.superclass.init.apply(this,arguments);
        Horn.apply(this,this.params);

       	//某些场景需要默认隐藏字段
       	if(this.params.hidden&&this.params.hidden==true){
       		this.hide();
       	}

    },
    /**
     * 显示组件
     * @function
     * @name Horn.FieldSet#show
     */
    show : function() {
        var li = this.el;
        li.css("display", "block");    
    },
    
    /**
     * 隐藏组件
     * @function
     * @name Horn.FieldSet#hide
     */
    hide : function() {//display   visibility
        var li = this.el;
        li.css("display", "none");
    }
}) ;
Horn.regUI(".h_fieldset",Horn.FieldSet) 


/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2015-9-30        周智星           需求 #13519 [研发中心/内部需求]使用form的setValues方法赋值时，值为0时，赋值为空，建议修复
 * 2016-1-18        刘龙              bug  15434 form表单中放入表单控件，调用form的setValues方法设置表单值，调用失败
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Form
 * @class
 * FORM表单组件的包装</br>
 */
/**
 * @lends Horn.Form#
 */
/**
 * 组件唯一标识
 * @name Horn.Form#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名字
 * @name Horn.Form#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的提交地址
 * @name Horn.Form#<b>url</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 是否提交form的名字
 * @name Horn.Form#<b>postName</b>
 * @type boolean
 * @default false
 * @ignore
 * @example
 * 无
 */
 /**
  * 是否文件上传<br/>
  * 如果设置fileupload=true,则该form会增加enctype="multipart/form-data"的属性项<br/>
  * 后台的action中使用MultipartFile来接收上传的文件。
  * @name Horn.Form#<b>fileupload</b>
  * @type boolean
  * @ignore
  * @default 
  * @example
  * 无
  */
/**
 * 是否使用Ajax的方式提交form
 * @name Horn.Form#<b>ajax</b>
 * @type Object
 * @default 
 * @ignore
 * @example
 * 无
 */
/**
 * 在请求之前调用的方法，return false可阻止form提交
 * @name Horn.Form#<b>beforeSubmit</b>
 * @type function
 * @default 
 * @example
 * #@form({"url":"$appServer.get('/test/form/submit.htm')","name":"testForm", "beforeSubmit": "beforeSubmit"})
 * #jscode()
 *   function beforeSubmit() {return false;}
 * #end
 */
 /**
  * 组件的事件配置
  * @name Horn.Form#<b>events</b>
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onSubmit","function":"onSubmitFn()"}]
  */

Horn.Form = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Form",
    form : null,
    /**
     * @ignore
     */
    ajax : false,
    /**
     * @ignore
     */
    ajaxCallback : false,
    /**
     * @ignore
     */
    onSuccessObj : null,
    /**
     * @ignore
     */
    baseParams:null,
    /**
     * @ignore
     */
    init : function(){
        Horn.Form.superclass.init.apply(this,arguments) ;
        this.form = this.el ;
        var ajax = this.form.attr('ajax');
        var _form = this;
        this.baseParams = {};
        //注册beforeSubmit事件
//        var beforeSubmit = this.el.attr('beforeSubmit');
        this.beforeSubmit = this.params.beforeSubmit;
        var _this = this;
        $.each(this.params.events || [], function(i, o){
        	_this[o.event] = o["function"];
        });
		if(this.beforeSubmit){
			var beforeSubmitObj = Horn.Util.getFunObj(this.beforeSubmit);
		    if(beforeSubmitObj && $.type(beforeSubmitObj.fn) == "function"){
	           this.on('beforesubmit',beforeSubmitObj.fn);
	        }
		}
        var submitfn = function(){
        	return _form.fire('beforesubmit');
        };
		var fn = _form.toAjaxForm;
        _form.toAjaxForm = function(){
        	_form.el.unbind('submit',submitfn);
        	fn.call(_form);
        };
        if(!ajax) { 
	        _form.el.submit(submitfn);
        }else{
        	try{
	        	var ajaxObj = Horn.Util.decode(ajax);
	        	if($.isPlainObject(ajaxObj)){
	        		//注册onSuccess事件
			        var onSuccess = ajaxObj.onSuccess;
			        if(onSuccess){
				        var onSuccessObj = Horn.Util.getFunObj(onSuccess);
					    if(onSuccessObj && $.type(onSuccessObj.fn) == "function"){
				           this.on('ajaxsuccess',onSuccessObj.fn);
				        }
			        }
	        	}
        	}catch(e){
        	
        	}
        	_form.toAjaxForm();
        }
        _form.on('beforesubmit',_form.isValid);
        
        this.form.bind('reset',function(){
        	_form.reset(false);
        	return false;
        });
        
        //若存在type为file的form组件，则改变form的媒体类型。
        if(_form.el.find(':file').get(0)){
        	_form.el.attr('enctype','multipart/form-data');
        }
    },
    customEvents : "beforesubmit",
    getEventTarget : function() {
    	return this.el;
    },
    /**
     * @description 调用此方法会将一个同步提交的form转换成ajaxform提交。
     * @name Horn.Form#toAjaxForm
     * @function
     * @ignore
     */
    toAjaxForm : function(){
    	var _form = this;
    	if(this.ajax === true) return;
    	this.ajax = true;
    	this.el.submit(function(){
    		if( _form.fire('beforesubmit') == true ){
    			_form.doPost();
    		}
			return false;
    	});
    } ,
    /**
     * @description 设置form提交时的初始化参数
     * @function
     * @name Horn.Form#setBaseParams
     * @param {JSON} object
     * @ignore
     */
    setBaseParams : function(Object){
    	this.baseParams = Object;
    },
    /**
     * @ignore
     */
    doPost : function(){
    	var values = this.getValues();
    	var url = this.form.attr('action');

		Horn.apply(values,this.baseParams);
		url = (url.indexOf("?") === -1 ? url +"?" : url+"&") + "pagelet=" + (values.pagelet || new Date().getTime());
		function onAjaxComplate(result){
			var data = eval("("+result+")") ;
		    	BigPipe.onArrive(data);
		    	BigPipe.start();
		    	Horn.init();
		}
		$.post(url,values,onAjaxComplate);
    },
    /**
     * @description 实现form提交
     * @function
     * @name Horn.Form#submit
     */
    submit : function(){
        this.form.submit() ;
    },
    /**
     * @description 重置form内部所有非禁用状态表单的值
     * @function
     * @name Horn.Form#reset
     */
    reset:function(flag){
        if(!flag === false){
        	this.form.get(0).reset();
        }
        Horn.Field.findFieldCompsIn(this.form).each(function(){
        	if($.isFunction( this.reset)){
        		this.reset();
        	}
        });
        var labels = this.form.find("div.hc_label[name]") ;
	    labels.each(function(idx,label){
	    	var $lbl = $(label);
	    	var hlbl = Horn.getCompByEl($lbl);
        		hlbl.setValue('');
	    });
	   
    },
    /**
     * @description 清空form内部所有表单的值
     * @function
     * @name Horn.Form#clearValue
     */
    clearValue:function(){
        Horn.Field.findFieldCompsIn(this.form).each(function(){
    		this.clearValue();
        });
        var labels = this.form.find("div.hc_label[name]") ;
	    labels.each(function(idx,label){
	    	var $lbl = $(label);
	    	var hlbl = Horn.getCompByEl($lbl);
        		hlbl.setValue('');
	    });
	    
    },
    /**
     * @description 获取form的值，以名值对的方式返回
     * @function
     * @name Horn.Form#getValues
     * @return Object
     * @example 如
     * var form = Horn.getComp("form") ;
     * form.getValues() ;
     * 结果--
     * {"client_id":"1000012","fund_account":"2000112"}
     */
    getValues : function(){
        var serValues = this.form.serializeArray() ;
        return Horn.Util.arr2Obj(serValues) ;
    },
    /**
     * @description 获得Form中的field，返回的是一组Horn.Field对象。
     * @function
     * @name Horn.Form#getFieldComps
     * @return Horn.Field对象数组
     */
    getFieldComps : function(){
    	return Horn.Field.findFieldCompsIn(this.el);
    },
    /**
     * @description 给form表单元素设置值
     * @function
     * @name Horn.Form#setValues
     * @param {Object}|{Array} value 设置的值，
     * @param {String} prefix 名称前缀，用于设置'client.name'这一类的值，那么前缀必须跟上"."，即为完整值为"client."才能正常使用，
     * 对于没有前缀的表单，prefix会被忽略。
     * @param {Boolean} clear 若未找到是否设置为空，如果只不为false则表示清空
     * @example 如
     * var form = Horn.getComp("form") ;
     * form.setValues({"client_id":"1000122","fund_account":"112222221"}) ;
     * (特别说明：select和combox两个组件，赋值的json格式的值必须是字符串，不支持整型，如：错误写法：form.setValues({"select_id":0}) ;，正确写法：form.setValues({"select_id":"0"}) ;)
     */
    setValues : function(v,prefix,clear){
        var values = v ;
        if(!prefix) prefix='';
        if($.isArray(v)){
            values = Horn.Util.arr2Obj(v) ;
        }
        this.getFieldComps().each(function(idx,field){
        	var mutiName = field.mutiName();
        	if(mutiName){
        		var val = {};
        		var i = 0;
        		$(mutiName).each(function(idx,name){
        			val[name] = values[name.replace(new RegExp('^'+prefix+''),'')];
        			if(val[name]) i++;
        		});
        		if( i != 0 ){
	        		field.setValue( val || '' );
        		}else if(!(clear == false) ){
	        		field.setValue( '' );
        		}
        	}else{
        		var val = values[field.name.replace(new RegExp('^'+prefix+''),'')] ;
        		if(val){
	        		field.setValue( val );
        		}else if(!(clear == false)){
        			//需求 #13519 [研发中心/内部需求]使用form的setValues方法赋值时，值为0时，赋值为空，建议修复
        			if(val==0){
        				field.setValue( val );
        			}else{
        				field.setValue('');
        			}
        		}
        	}
        });
        //bug 15434 form表单中放入表单控件，调用form的setValues方法设置表单值，调用失败
	    //var labels = this.form.find("div.hc_label[name|hiddenName]") ;//这种写法在jquery-1.11.3-min.js版本中会报错
        var labels = this.form.find("div.hc_label") ;
	    labels.each(function(idx,label){
	    	var $lbl = $(label);
	    	var hlbl = Horn.getCompByEl($lbl);
	    	var val = values[hlbl.name.replace(new RegExp('^'+prefix+''),'')] ;
	    	//需求 #18414 form 的setValues() 方法，label值放不进去
			hlbl.setValue( val );
    		/*if(val){
        		hlbl.setValue( val );
    		}else if(!(clear == false)){
        		hlbl.setValue('');
    		}*/
	    });
    },
    /**
     * @description 调用此方法可以去掉错误验证提示信息
     * @function
     * @name Horn.Form#removeError
     * @example 如
     * var form = Horn.getComp("form") ;
     * form.removeError() ;
     */
    removeError : function(){
    	this.getFieldComps().each(function(idx,field){
    		field.removeError();
    	});
    },
    /**
     * @description 是否通过验证，可手动调用，用于验证某个form
     * @name Horn.Form#isValid
     * @function
     * @return Boolean
     * @example 
     * 
     */
    isValid:function(){
        return Horn.Validate.isFormValidate(this.form);
    },
    /**
     * @description 序列化表格元素 (类似 '.serialize()' 方法) 返回 JSON 数据结构数据
     * @name Horn.Form#serializeArray
     * @function
     * @return Array
     * @example [{name: 'firstname', value: 'Hello'},
     * {name: 'lastname', value: 'World'},{name: 'alias'}]
     */
    serializeArray : function(){
        return this.form.serializeArray() ;
    },
    /**
     * @description 序列表表格内容为字符串，表单的数据被格式化类似于“key10=3&key11=5&key13=2&key13=3&key14=A&key15=0”的字符串，并自动将中文字符也进行了编码转换
     * @function
     * @name Horn.Form#serialize
     * @return Array
     */
    serialize : function(){
        return this.form.serialize() ;
    },
    /**
     * @description 从form中查找对应的field。
     * @function
     * @name Horn.Form#findField
     * @param {String} name
     * @param {String} alias
     * @return {DomElement}
     * @ignore
     */
    findField : function(name, _alias){
        var alias = _alias||"" ;
        var field = null;
        var form = this.el;
        if (jQuery.type(name) == 'string') {
            var selector = Horn.Field.getSelector(name, alias);
            field = $(selector, form);
            if (!alias) {
                field = field.not(":disabled");
            }
        } else {
            field = $(name, form);
        }
        return field;
    }
}) ;
$.extend(Horn.Form,{
    DATANAME : "h_form" ,
    /**
     * @description 获取指定名字的Form
     * @function
     * @name Horn.Form.get
     * @param {string} name 表单的名字
     * @return {Horn.Form} form
     * @ignore
     */
    get : function(name){
        var arr = Horn.data(Horn.Form.DATANAME) ;
        var f = arr[0] ;
        return f ;
    }
}) ;
Horn.regUI("form",Horn.Form) ;
/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: Grid.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：Grid组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-01-21     zhangsu   新增rowSelect属性，使grid支持点击行选中该行
 * 2014-01-21     zhangsu   Grid已选中的行高亮显示(样式h_table-over中颜色修改)
 * 2014-01-22     zhangsu   Grid支持单击事件
 * 2014-01-22     zhangsu   Grid支持双击事件
 * 2014-01-22     zhangsu   Grid列支持hidden属性
 * 2014-01-24     zhangsu   Grid列需要支持常规类型的格式化配置（日期、金额）
 * 2014-02-08     zhangsu   修改this.rowSelect设置后不生效的问题
 * 2014-03-11     zhangsu   当table的布局为fixed时候，需要为th设置默认宽度
 * 2014-03-12     zhangsu   STORY #7776 grid的titleButtons中的按纽需求有禁用、启用功能
 * 2014-04-11     周智星    BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
 * 2014-04-11     周智星    BUG #6610 【grid】"selectModel":"multi"之后会造成复选框变成input输入框，并且应该设置的muti是拼写错误
 * 2014-04-11     周智星    BUG #6612 【grid】rowSelect属性设置true还是表现为false，必须要设置为"true"才行，和文档中描述不一致 （把文档修改为String类型）
 * 2014-04-11     周智星    BUG #6605 【grid】numbercolumn，rowselect，selectmodel的默认值与文档中不符合 （修改文档的默认值）
 * 2014-04-11     周智星    BUG #6613 【grid】多选模式下，先调用selectAll，然后调用unSelectAll之后，需要点击两下才能完成对行的选中
 * 2014-04-11     zhangsu   BUG #6599 【grid】多选模式下，只能通过点击行来选中无法通过前面的checkbox来选中
 * 2014-04-16     zhangsu   修改titlebuttons注释，添加save/query/confirm/refresh/open样式
 * 2014-04-18     zhangsu   BUG #6760 query_table手动全选后调用方法取消全选，列头上的勾还在
 * 2014-04-22     zhangsu   BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的
 * 2014-04-22     zhangsu   列中包含“buttons”操作列属性，“renderer”渲染属性时，该列无tip提示，其他未配置上述属性的列正常显示tip,按单元格中内容显示。
 * 2014-04-28     hanyin   BUG #6894 grid:titleButtons中按钮的属性event不设置时会报js错误
 * 2014-05-05     周智星    BUG #6943 grid：复选，去掉某行的勾，但是列头的全选勾不会去除
 * 2014-09-10     zhangsu   STORY #9591 [财富管理事业部/陈凯][TS:201409030134]-JRESPlus-ui-Grid列配置的日期格式，在谷歌下面是生效在IE下面不生效
 * 2014-09-26     zhangsu   STORY #9848 [财富管理事业部-陈为][TS:201409260006]-JRESPlus-ui-下记问题请紧急修复下，若处理完成，请临时包提供。2.】
 * 2014-09-26     zhangsu   STORY #9847 [财富管理事业部/陈为][TS:201409260005]-JRESPlus-ui-下记问题请紧急修复下，若处理完成，请临时包提供。发现】
 * 2014-10-11		wangyubao	因为要绑定menu，那么不配置onclick的按钮也应该可以正常的显示出来
 * 2014-11-10		wangyubao	STORY #10261 [财富管理事业部/陈为][TS:201411060329]-JRESPlus-ui-Grid组件的复选框列选择的时候会影响所在行的其他列中的复选】
 * 2015-02-05     zhangsu   BUG #9192 Grid全选，去掉最后一个钩，再选上，全选框没有显示选中状态
 * 2016-3-2       刘龙                        需求17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
 * ----------------------------------------------------------------------- 
 */

/**
 * @lends Horn.Grid#
 */

/**
 * @description Grid的封装
 * @name Horn.Grid
 * @class
 * 数据列表组件，数据的装载在后台完成
 * @extends Horn.Base
 * @example
 *	<pre>\	#grid({"name":"flowTable","title":"有数据的grid"
    	    ,"numbercolumn":"true","selectModel":"muti"
    		,"items":[{"name":"initDate","text":"发生日期","renderer":"domrender"},
    			{"name":"branchNo", "text":"分支名称（静态字典）","items":[{"label":"杭州总部","value":"8888"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]},
    			{"name":"branchNo", "dictName":"Branch", "text":"分支名称（动态字典）"},
    			{"name":"scanType", "dictName":"ScanType", "text":"扫描类别"},
    			{"name":"clientId","text":"客户编号"},
    			{"name":"clientName","text":"客户名称"},
    			{"name":"branchNo", "text":"操作","showwhenover":"true","buttons":[{"label":"设置默认","event":"edit"},{"label":"设置默认","event":"edit"}]},
    			{"name":"taskStatus","text":"任务状态"}
    			]
    		,"data":$data
    	})
 *	</pre>
 */

/**
 * @description Grid的唯一标识。
 * @property id
 * @name Horn.Grid#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description Grid的名称。
 * @property name
 * @name Horn.Grid#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description Grid的数据。
 * @property data
 * @name Horn.Grid#<b>data</b>
 * @type Json
 * @default null
 * @example
 * 示例：
 * [{"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"}]
 */

/**
 * @description Grid列表条目。
 * @property items
 * @name Horn.Grid#<b>items</b>
 * @type Array
 * @default null
 * @example
 * items中的单个列表条目属性：
 * <table>
 *	<tr><td>属性名</td>  <td>类型</td> <td>说明</td> <td>默认值</td></tr>
	<tr><td>name</td> <td>String</td>    <td>列数据索引名 即dataIndex</td> <td>--</td> </tr>
	<tr><td>text</td> <td>String</td>    <td>列头名称</td> <td>--</td> </tr>
	<tr><td>align</td> <td>String</td>    <td>列内容文本位置设置，默认分为三种方位：居左：left ，居中：center ，居右：right</td> <td>--</td> </tr>
	<tr><td>headerAlign</td> <td>String</td>    <td>列头文本位置设置，默认分为三种方位：居左：left ，居中：center ，居右：right</td> <td>--</td> </tr>
	<tr><td>hidden</td> <td>Boolean</td>    <td>列是否隐藏</td> <td>--</td> </tr>
	<tr><td>width</td> <td>String</td>    <td>列宽度（不建议使用）</td> <td>--</td> </tr>
	<tr><td>dataType</td> <td>String</td>    <td>列格式化的类型，目前只支持日期和金额两种类型，日期：dataType="DATE",金额dataType="AMOUNT"</td> <td>--</td> </tr>
	<tr><td>format</td> <td>String</td>    <td>列格式化时的格式 ，需要传入日期才能被格式化,不包含时间格式化</td> <td>--</td> </tr>
	<tr><td>renderer</td> <td>String</td>    <td>列渲染函数</td> <td>--</td> </tr>
	<tr><td>buttons</td> <td>Array</td>    <td>操作列，设置此属性后，属性值会被渲染成多个链接</td> <td>--</td> </tr>
	<tr><td>dictName</td> <td>String</td>    <td>字典条目名称</td> <td>--</td> </tr>
	<tr><td>items</td> <td>Array</td>    <td>静态数据字典 示例："items":[{"label":"8888","value":"杭州总部"}],label是后台值相当于key,value是显示值</td> <td>--</td> </tr>
	</table>
	示例：
	"items" : [{"name":"initDate","text":"发生日期","align":"left","headerAlign":"right","dataType":"DATE","format":"yyyy-MM-dd","width":"150"},
			        {"name":"branchNo", "text":"分支名称（静态字典）","items":[{"label":"8888","value":"杭州总部"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]},
			        {"name":"branchNo", "dictName":"Branch", "text":"分支名称（动态字典）"},
			        {"name":"scanType", "dictName":"ScanType", "text":"扫描类别","hidden":true},
			        {"name":"scanType2","text":"扫描类别","renderer":"domrender","hidden":false,"width":"350"},
			        {"name":"clientId","text":"客户编号","dataType":"AMOUNT","format":"0,000.0"},
			        {"name":"clientName","text":"客户名称"},
			        {"name":"branchNo", "text":"操作1","buttons":[{"label":"设置默认","event":"edit"}]},
			        {"name":"branchNo", "text":"操作2","buttons":[{"label":"noting","event":"edit"}]}
			]
 *renderer属性用法示例：
 *{"name":"scanType2","text":"扫描类别","renderer":"domrender","hidden":false,"width":"350"}
 *
 *#jscode()
 *
 *  function domrender(obj){
 *    var val = obj.val;
 *    if(val==0){
 *    	return "返回想要翻译的值";
 *    }else{
 *    	return val;
 *    }
 *  }
 *#end
 *
 */

/**
 * @description Grid标题栏上的按钮组,当按钮的"event"属性不设置或者设置的方法在当前上下文中不存在时，按钮将被隐藏
 * 默认提供添加、修改、删除、确认、查询、打开、保存、刷新的样式,cls属性分别对应："add","edit","del","confirm","query","open","save","refresh"
 * @property titleButtons
 * @name Horn.Grid#<b>titleButtons</b>
 * @type Array
 * @default null
 * @example
 * 单个按钮属性：
 *	       label   {String}  按钮文本
 *	       cls     {String}  按钮css样式
 *	       event   {String}  按钮点击事件
 *	       disabled {Boolean} 是否禁用/启用按钮
 *		   refmenu {string} 按钮中关联menu组件
 * 示例：
 * "titleButtons" : [{"label":"添加","cls":"add","event":"add()"}]
 */

/**
 * @description Grid上的事件属性
 * 控件支持的事件列表如下：<br>
 * rowclick  行单击事件    事件参数：rowdata  当前被点击的一行数据<br>
 * rowdblclick  行双击事件 事件参数：rowdata  当前被点击的一行数据<br>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @property events
 * @name Horn.Grid#<b>events</b>
 * @type Json
 * @default null
 * @example
 * 		   "events" :[
 *	         {"event" : "rowclick" , "function" : "testgridrowclick"},
 *	         {"event" : "rowdblclick", "function" : "testgridrowdbclick"}
 *		   ]
 */

/**
 * @description Grid是否配置序号列，默认值为false，启用序号列,设置为true时才显示序列号
 * @property numbercolumn
 * @name Horn.Grid#<b>numbercolumn</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * @description Grid启用单选/多选选择框 ，默认值为single,(注意，多选框 muti的拼音错了，做了兼容处理，输入multi也可以) ,单选框值为:single
 * 当不配置selectModel或selectModel为""属性时,不显示选择列
 * @property selectModel
 * @name Horn.Grid#<b>selectModel</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * @description Grid是否启用点击行选中行操作,默认值为false，不启用,设置为true时点击行选中才生效
 * @property rowSelect
 * @name Horn.Grid#<b>rowSelect</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * @description Grid列内容超出列宽时是否隐藏并加"...",默认值为false，不隐藏根据内容自适应,设置为true时才隐藏
 * @property textOverHidden
 * @name Horn.Grid#<b>textOverHidden</b>
 * @type Boolean
 * @ignore
 * @default false
 * @example
 * 无
 */

/**
 * @description 单击行时触发<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系
 * @event
 * @name Horn.Grid#<b>rowclick</b>
 * @param data  类型：[Object] 被点击的一行数据。
 * @example
 *
 */

/**
 * @description 双击行时触发<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系
 * @event
 * @name Horn.Grid#<b>rowdblclick</b>
 * @param data  类型：[Object] 被点击的一行数据。
 * @example
 *
 */
/**
 * @description isDragColumn的表格列是否可以拖动，默认false</br>
 * (注意！如果为true,页面上就必须引入jquery.resizableColumns.mini.js文件，name属性必须填写，否则无法拖动。如果表格自定义了宽度，拖动功能失效)
 * @property isDragColumn
 * @name Horn.Grid#<b>isDragColumn</b>
 * @type Boolean
 * @ignore
 * @default false
 * @example
 * 无
 */
Horn.Grid = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Grid",
	titleEl : null , 
	data : null,
	curData : null,
	curTr : null,
	rowSelect : false,
	keyAttr : "label",
    valueAttr : "value",
	/**
	 * @ignore
	 */
    init : function(dom) {
        Horn.Grid.superclass.init.apply(this,arguments) ;
        this.ths = this.el.find("th");
        var _this = this;
        var data = this.params["data"]||{};
        this.data = data;
        
        //this.mutiSelect = this.params['selectModel']=='muti';
        //BUG #6610 【grid】"selectModel":"multi"之后会造成复选框变成input输入框，并且应该设置的muti是拼写错误
        if(this.params['selectModel']=='muti' || this.params['selectModel']=='multi'){
        	this.mutiSelect = true;
        }
        this.curTr = this.el.find('tr.u-table-selected');
        var datas = this.el.children('table').children('tbody').children('tr');
        
        this.curData = this.data[datas.index(this.curTr) - 1];
        //Grid点击行选中该行的配置支持
        this.rowSelect = Boolean(this.params["rowSelect"]);
        //Grid是否配置列内容超出列宽时是否隐藏并加"..."
        this.textOverHidden = this.params["textOverHidden"]?this.params["textOverHidden"]:false;
       	//关于字典项目的翻译功能。
		this.ths.each(function(index,th){
			var	hidden = th.attributes["hidden"];
			th=$(th);
			var dictName = th.attr("dictName"),
				itemscolNo = th.attr('colno'),
				staticDict;
			var width = th.attr("width");   //设置th列宽度
			var tempStaticDict,buttons;
			if(itemscolNo){
				tempStaticDict = _this.params.items[itemscolNo -1].items;
				buttons = _this.params.items[itemscolNo -1].buttons;
			}
			/*
			if(hidden!=null && hidden!=undefined && hidden.value == "true"){
				th.hide(); 
			}*/
			if(dictName){
				staticDict = {};
				//先把dict解析出来，避免重复查找dom
				var lis = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li");
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');  //title显示值
					var key = li.attr('key');      //key 
					staticDict[key] = label;
				});
			}else if(tempStaticDict){
				staticDict = {};
				$(tempStaticDict).each(function(idx,item){
					
					staticDict[item[_this.keyAttr]] = item[_this.valueAttr];  //bug 6797
				});
			}else if(width){
				//th.width(width);
			}
			th.data('staticDict',staticDict);
			th.data('buttons',buttons);
		});
		this.el.find('.h_querytable_select_all').change(function(){
			if(this.checked){
				_this.selectAll();
			}else{
				_this.unSelectAll();
			}
		});
		
		
		this.selecteds = {};   
		this.dictTrans();
		this.initEvents();     //初始化事件
		this.initToolbarEvents();//按钮初始化事件
		/*if(this.textOverHidden){
			this.resetTHWidth();
		}*/
		//this.hiddenColumns();  //初始化隐藏列
		
		//表格列是否可以拖动，默认不拖动
		if(this.params.isDragColumn){
			if(this.params.name&&this.params.name!=""){
				$("."+this.params.name).resizableColumns({});
			}
		}
		if(!this.textOverHidden){
			this.resetTdContent();
		}
		   
    },
    customEvents : "rowclick,rowdblclick",
    getEventTarget : function() {
    	return this.el;
    },
    /**
	    * @description 启用/禁用 表格里的按钮栏的某个操作按钮
	    * @function
	    * @name Horn.Grid#setButtonDisabled
	    * @param {string} name        按钮名称，记得按钮的name是唯一
	    * @param {boolean} disabled   true为按钮不可用，false为可用<br>
	    * @return void
	    * @example
	    * #jscode()
	    * 	Horn.getComp("gridName").setButtonDisabled("delBtn",true);
	    * #end
	    */
	setButtonDisabled : function(name,disabled){
		var titleButtons = this.el.children("div.u-datagrid-toolbar").children("ul").children("li");
		titleButtons.each(function(index,trdom){
			var a = $(this).children("a");
			var btnName = a.attr("name");
			if(btnName == name){
				if(disabled){
					a.addClass("f-disabled")
					a.attr("onclick","javascript:return false;");
				}else{
					a.removeClass("f-disabled")
					a.attr("onclick",a.attr("event"));
				}
				return;
			}
			
		});
	},
    initToolbarEvents : function(){
		var titleButtons = this.el.children("div.u-datagrid-toolbar").children("ul").children("li");
		titleButtons.each(function(index,trdom){
			var a = $(this).children("a");
			if(a.hasClass("f-disabled")){
				a.attr("onclick","javascript:return false;");
			}
			a.bind('click',function(e) {
				if($(this).hasClass("f-disabled")){
					$(this).attr("onclick","javascript:return false;");
				}else{
					$(this).attr("onclick",$(this).attr("event"));
				}
			});
		});
	},
    /**
     * 初始化事件
     * @ignore
     */
    initEvents : function(){
    	var _table = this.el.children('div.u-datagrid').children('table');
    	var _tbody = _table.children('tbody');
    	var _this = this;
    	var isCheckboxAll = _this.el.find('.h_querytable_select_all').length>0?true:false;
    	if(isCheckboxAll){
			this.el.find('input:checkbox.h_querytable_select').change(function(){
				_this.stateTest();
			});
	    }
        if(this.rowSelect == true){
        	_tbody.children('tr').each(function(i,tr){
    		    var rowidx = i;
    		    var _tr = $(tr),
    		    checkbox = _this.mutiSelect?_tr.find("input:checkbox.h_querytable_select"):_tr.find("input:radio.h_querytable_select")//BUG #6574
    		;
    		    
    		//STORY #10837 【TS:201501280088-JRESPlus-财富管理事业部-陈凯-对一个grid先全选，然后去掉最后一个勾，然后再想选最后一个】
    		_tr.bind('click',function(e) {    //BUG #6599
    			if($.isEmptyObject(_this.selecteds)){
    				_this.selectRow(rowidx, _tr);
    			}else{
//    				if(_this.lastSelect&&_this.lastSelect.rowidx != rowidx){
    					 if(!_this.selecteds.hasOwnProperty(rowidx)){
        				    _this.selectRow(rowidx, _tr);
    					 }else{
    						 _this.unSelectRow(rowidx, _tr);
    					 }	 
//        			}else{
//        				_this.unSelectRow(rowidx, _tr);
//        			}
    			}
    			if(isCheckboxAll){
        			_this.stateTest();
				}
    		 });

            });
        }
    
        // 表格单击,双击事件
        var rowClickObj =undefined;
        var rowDBLClickObj =undefined;
        var rowClickFn=undefined;
        var rowDBLClickFn=undefined;
        var data = this.data;
//        this.rowclick = this.el.attr("rowclick");
//        this.rowdblclick = this.el.attr("rowdblclick");
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
        if (this.rowclick) {
            rowClickObj = Horn.Util.getFunObj(this.rowclick);
            if($.type(rowClickObj.fn) == "function"){
                rowClickFn = rowClickObj.fn ;
            }
        }
        if(this.rowdblclick){
            rowDBLClickObj = Horn.Util.getFunObj(this.rowdblclick);
            if($.type(rowDBLClickObj.fn) == "function"){
                rowDBLClickFn = rowDBLClickObj.fn ;
            }
        }
        if (rowClickFn || rowDBLClickFn) {
            var trs = _tbody.children("tr");
            for ( var i = 0; i < data.length; i++) {
                var tr = $(trs.get(i));
                if(rowClickFn){
                    var params = rowClickObj.params.slice(0);
                    params.push(data[i], data);
                    tr.bind('click',params, function(e) {
                        var p = e.data ;
                        return rowClickObj.fn.apply(this,p);
                    });
                }
                if(rowDBLClickFn){
                    var params = rowDBLClickObj.params.slice(0);
                    params.push(data[i], data);
                    tr.bind('dblclick', params,function(e) {
                        var p = e.data ;
                        return rowDBLClickObj.fn.apply(this,p);
                    });
                }
            }
        }
    },
    /**
     *重置列展示内容,如果字段大于60个字符，就把内容放到文本域中
     * @ignore
     */
    resetTdContent : function(){
    	var _this = this;
    	var trs = this.el.children("div.u-datagrid").children('table').children('tbody').children('tr');
    	var ths = this.el.children("div.u-datagrid").children('table').children('thead').children('tr').children('th');
    	var tmpArry = [];
		if(this.data && this.data.length >0){
			 for ( var i = 0; i <this.data.length; i++){
				   var itemData = this.data[i];
				   $.each(itemData,function(name,value) {
					   tmpArry.push(name);
				   });
				   break;
				  
			 }
		}
		
    	var rows = [];
    	trs.each(function(tridx,trdom){
    		var tr = $(trdom);
    		var tds = tr.find('td');
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdWidth = td.attr("width");
    			var tdDiv = td.children("div");
    			var text =tdDiv.text();
	    		if(_this.getStrlen(text)>40){
	    			if(rows.indexOf(tdidx)==-1){
	    				rows.push(tdidx);
	    			}
	    			//tdDiv.html("<textarea   readonly style=\"height: 100%;width: 100%;border: 0;background: transparent;line-height: 15px;\">"+text+"</textarea>");
	    			tdDiv.css("width",300);
	    			td.css("width",300);
	    		}
    		}
    	});
    	/*if(rows.length>0){
    		for(var i = 0;i<rows.length;i++){
    			trs.find('td:eq('+rows[i]+')').css("width",300);
    		}
    	}*/
    },
    getStrlen:function(str){//一个中文相当于两个字符
    	var num = 2;
        var len = 0;
        for (var i=0; i<str.length; i++) { 
	         var c = str.charCodeAt(i); 
	         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
	           len++; 
	         }else{ 
	    		len+=num; 
	         } 
        }
        return len;
    },
    /**
     * @description 设置标题
     * @function
     * @name Horn.Grid#<b>setTitle</b>
     * @param {String} title
     */
    setTitle : function(title){
    	this.el.children("div.u-datagrid-header").children('h4').text(title);
    },
    /**
     * @ignore
     * @description 当某行被引用时会触发此事件。
     * @event
     * @name Horn.Grid#<b>onRowSelect</b>
     * @param {DOMDocument} tr 当前选择的行
     * @param {int} rowidx 行号
     * @param {object} vals 行数据
     */
    onRowSelect:function(){},
    /**
     * 所有被选中值
     * @ignore
     * @type {Array}
     */
    selecteds:null,
    stateTest : function(){
    	var _this = this;
		var checkAll = true;
		_this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		if(!$(checkbox).prop("checked")){
    			checkAll = false;
    		}
    	});
		if(checkAll){
			_this.el.find('.h_querytable_select_all').prop("checked", true);
		}else{
			_this.el.find('.h_querytable_select_all').prop("checked", false);
		}
    },
    /**
     * @description 选择所有行。
     * @function
     * @name Horn.Grid#<b>selectAll</b>
     */
    selectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){  //6599
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx);
    		}
    	});
    	//STORY #10837 【TS:201501280088-JRESPlus-财富管理事业部-陈凯-对一个grid先全选，然后去掉最后一个勾，然后再想选最后一个】
    	_this.lastSelect={
    			rowidx:'all'
    	}
    	this.el.find('.h_querytable_select_all').attr("checked", true);
    },
    /**
     * @description 清除所有选择行。
     * @function
     * @name Horn.Grid#<b>unSelectAll</b>
     */
    unSelectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){  //6599
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx);
    		}
    	});
    	this.el.find('.h_querytable_select_all').prop("checked", false);
    	//BUG #6613 【grid】多选模式下，先调用selectAll，然后调用unSelectAll之后，需要点击两下才能完成对行的选中
    	//this.el.find('input:checkbox.h_querytable_select').attr("checked", false);
    	//this.el.find('input:checkbox.h_querytable_select').parent().parent().removeClass("h_table-over");
    	//this.initEvents();     //初始化事件
    },
    /**
     * @description 单选时最后选择的项目
     * @field
     * @name Horn.Grid#lastSelect
     * @default null
     * @ignore
     */
     lastSelect:null,
    /**
     * @description 是否多选
     * @field
     * @name Horn.Grid#mutiSelect
     * @default false
     * @ignore
     */
    mutiSelect:false,
    /**
     * @description 选择某行
     * @function
     * @name Horn.Grid#selectRow
     * @param {int} rowidx
     * @param {JQuery} tr
     * @ignore
     */
    selectRow:function(rowidx,_tr){
    	var _table = this;
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));
    	}
    	if(tr.size()==0){
    		Horn.debug("Grid["+this.name+"]","选择的行"+rowidx+"不存在");
    		return false;
    	}
    	var vals = {};
    	var displays = {};
		var ths = this.ths;
		var tds = tr.find('td');
		ths.each(function(thidx,_th){
			var td = tds.get(thidx),
				th = $(_th);
			if(th.attr('name')){
				vals[th.attr('name')] = th.attr('dictName') ? $(td).attr('key') :$(td).text();
				displays[th.attr('name')] = $(td).text();
			}
		});
		_table.onRowSelect.call(tr,tr,rowidx,vals);
		this.selecteds[rowidx] = {val:vals,displays:displays};
		if(!_table.mutiSelect) {
			var last = _table.lastSelect;
			if(last&& last.rowidx != rowidx ){
				//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
		    	if(this.mutiSelect){//多选
		    		last.tr.find("input:checkbox.h_querytable_select").prop("checked" , false); 
		    	}else{//单选
		    		last.tr.find("input:radio.h_querytable_select").prop("checked" , false);  
		    	}
				_table.unSelectRow(last.rowidx,last.tr);
			}
			
		}
		_table.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		
		//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
    	if(this.mutiSelect){//多选
    		tr.find("input:checkbox.h_querytable_select").prop("checked" , true);;   //选中checkbox
    	}else{//单选
    		tr.find("input:radio.h_querytable_select").prop("checked" , true);;   //选中radio
    	}
		tr.addClass("u-table-selected");//选中行的样式
    },
    /**
     * @description 取消某行的选择
     * TODO 这里尚有些不成熟的地方，需要取消选择项的勾。
     * @function
     * @name Horn.Grid#unSelectRow
     * @param {DOMDocument} rowidx
     * @param {DOMDocument} tr
     * @ignore
     */
    unSelectRow:function(rowidx,_tr){
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	
    	this.selecteds[rowidx] =null;
    	delete this.selecteds[rowidx];
    	tr.removeClass("u-table-selected");//取消选中行的样式
    	//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
    	if(this.mutiSelect){//多选
    		tr.find("input:checkbox.h_querytable_select").prop("checked" , false);    //取消选中checkbox
    		//BUG #6943 grid：复选，去掉某行的勾，但是列头的全选勾不会去除
    		this.el.find('.h_querytable_select_all').prop("checked", false);
    	}else{//单选
    		tr.find("input:radio.h_querytable_select").prop("checked" , false);  //取消选中radio
    	}
    },
    /**
     * @description 获取所有的选择项
     * @function
     * @name Horn.Grid#<b>getSelecteds</b>
     * @param format(可选值有true,1,或者不传参数)<br/>
     *         1):参数为true：返回整行完整数  如：[{"branchNo":"001","Date":"20140320"}{"branchNo":"001","Date":"20140320"}]<br/>
     *         2)：参数为1：返回列数据的字段值，如果是字典列,返回字典的value值<br/>
     *         3):无参数： 返回列数据的字段值 如果是字典列,返回label值
     * @return {Array} 返回选中的行数据
     * @example
     * #jscode()
     * 	var result = Horn.getComp('flowTable1').getSelecteds();
	 *	var comValue="";
	 *	if(result&&result.length>0){
	 *		for(var i=0;i<result.length;i++){
	 *			var item = result[i];
	 *			console.log(item);
	 *			var brachNo = item.branchNo1;
	 *			console.log(brachNo);
	 *		}
	 *	}
     * #end
     */
    getSelecteds:function(format){
    	var selecteds = [];
    	for(var key in this.selecteds){
    		var valObj = this.selecteds[key];
    		if(valObj){
    			var tmpv = valObj.val;
    			if(format === true){
    				tmpv = this.data[key];
    			}else if(format == 1){
    				tmpv = valObj.displays;
    			}
    			selecteds.push(tmpv);
    		}
    	}
    	return selecteds;
    },
     /**
     * @description 设置当前行为传入的行
     * @function
     * @return {void}
     * @name Horn.Grid#changeCurrent
     * @param {DOMDocument} tr 传入的行
     * @ignore
     */
    changeCurrent:function(tr){
    	if(!tr instanceof $){
    		tr = this.el.children('tbody').children('tr')[tr];
    	}
    	if(!this.curtr){
    		this.curtr = this.el.find('tr.u-table-selected');
    	}
    	var rowidx = this.el.children('table').children('tbody').children('tr').index(this.curtr);
    	this.curtr.removeClass('u-table-selected');
    	tr.addClass('u-table-selected');
    	this.curtr = tr;
    	this.curData = this.data[rowidx-1];
    },
     /**
     * @description 获取当前行的数据
     * @function
     * @name Horn.Grid#getCurrentData
     * @return {object}
     * @ignore
     */
    getCurrentData:function(){
    	return this.curData;
    },
    /**
     * 隐藏列
     * @ignore
     */
    hiddenColumns : function(){
    	var trs = this.el.children('table').children('tbody').children('tr');
    	var ths = this.ths;
    	
    	ths.each(function(thidx,thdom){
    		var th = $(thdom);
    		//隐藏列
    		var hidden = thdom.attributes["hidden"];
    		
    		if(hidden!=null && hidden!=undefined && hidden.value =="true"){
    			th.hide(); 
    			//trs each
    	    	trs.each(function(tridx,trdom){
    	    		var tr = $(trdom);
    	    		var tds = tr.find('td');
    	    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    	    			var td = $(tds[tdidx]);
    	    			if(thidx == tdidx){
    	    				td.hide();
    	    				break;
    	    			}
    	    		}
    	    	});
    		}
    	});
    	
    },
    /**
     * @param dataType   格式化类型(DATE,AMOUNT)
     * @param format     格式
     * @param td         td对象
     * 表格列格式化
     * 列需要支持常规类型的格式化配置（日期、金额）
     * @private
     * @ignore
     */
    formatColumn : function(dataType,format,val){
    	return Horn.Util.Format.all(dataType,format,val);
    },
    /**
     * 当table的布局为fixed时候，需要为th设置默认宽度
     * @ignore
     */
    resetTHWidth : function(){
    	var ths = this.ths;
    	var size = ths.size();
    	var _table = this.el.children('table');
    	var width = _table.width();
    	var temp = []; 
    	ths.each(function(idx,thdom){
    		var th  = $(thdom);
    		if(th.hasClass('h_numbercolumn')||th.hasClass('h_querytable_checkboxcolumn')){   //去掉数字、check列
    			th.addClass("h_table_th_extend");
    		}else if(thdom.attributes["hidden"]){   //去掉隐藏列
    			var hidden = thdom.attributes["hidden"];   
        		if(hidden!=null && hidden!=undefined && hidden.value =="true"){	
        			size--;
        		}
    		}else if(th.attr("width")){//去掉已设置width属性的列
    			size--;
    		}else{
    			temp.push(th);
    		}     
    		return true;
    	});
    	var percent = 100/size;
    	for(var i = 0; i<temp.length;i++){
    		var cls = temp[i].attr("class");
    		if(cls&&cls=="u-table-time"){
    			temp[i].css("width", percent.toFixed(2)+"%");
    		}
    	}
    	i;
    },
    /**
     * 翻译字典 
     * @ignore
     */
    dictTrans:function(){
    	var _table = this,
    		ths = this.ths,
    		trs = this.el.find("tr");
    	
    	trs.each(function(idx,trdom){
    		var tr = $(trdom),
    		checkbox = _table.mutiSelect?tr.find("input:checkbox"):tr.find("input:radio")//BUG #6574
    		;
    		if(checkbox.hasClass('h_querytable_select')) { 
    			if(_table.rowSelect == false){           //BUG #6599
	    			checkbox.change(function(){
		    			if(this.checked){
		    				_table.selectRow(idx-1,tr);
		    			}else{
		    				_table.unSelectRow(idx-1,tr);
		    			}
		    		});
    			}
    			if(checkbox.attr('checked')){
    				setTimeout(function(){
    					_table.selectRow(idx,tr);
    				},3);
    			}
    		}
    		tr.find('td').each(function(tdidx,tddom){
    			var td = $(tddom);
    			var th = $(ths.get(tdidx));
	    		var dictName = th.attr("dictname"),
	    			mutidict = th.attr("multiple"),
	    			staticDict = th.data('staticDict'),
	    			renderer = th.attr('renderer'),
	    			buttons = th.data('buttons'),
	    			showwhenover = th.attr('showwhenover'),
	    			dataType = th.attr('dataType'),
	    			format = th.attr('format')
	    			;
	    		
	    		if( staticDict ){
	    			td.attr('key',td.text());
	    			var text = td.text()||'';
	    			if(mutidict){
    					var textArr = [];
    					$(text.trim().split(',')).each(function(i,item){
    						textArr.push(staticDict[item] || item);
    					});
    					td.text(textArr.join(','));
    					td.attr("title",textArr.join(','));
    				}else{
    					//17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
    					if(text=="" || staticDict[td.text().trim()]== undefined){
							td.text("");
							td.attr("title","");
						}else{
							td.text( staticDict[td.text().trim()] || td.text());
							td.attr("title",staticDict[td.text().trim()] || td.text());
						}
    				}
	    		}else if(buttons){
	    			td.attr("title","");
	    			var btns = buttons;
	    			var span = $("<span></span>");
	    			$(btns).each(function(idxx,btn){
	    				var fn = Horn.Util.getFunObj(btn.event);
	    				//如果没有这个function，则不装入这个button
	    				if(!fn.fn) return;
	    				var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>"),
	    					text = td.text();
	    				a.click(function(){
	    					fn.fn.call(a,{
	    	    				val : text,
	    	    				rowdata : _table.data[idx-1],
	    	    				alldata : _table.data,
	    	    				table : _table,
	    	    				rowidx : idx,
	    	    				tdidx : tdidx,
	    	    				tr : tr,
	    	    				td : td
	    	    			});
	    				});
	    				span.append(a);
	    				if(idxx!=(btns.length-1)){
	    					span.append(' | ');
	    				}
	    			});
	    			if(showwhenover){ 
	    				span.addClass('h_link-default');
	    			}
	    			td.html('');
	    			td.append(span);
	    		}else if(dataType){
	    			var val = td.text();
	    			var newVal = _table.formatColumn(dataType,format,val);
	    			td.text(newVal);
	    			td.attr("title",newVal);
	    		}
	    		if(renderer){
	    			td.attr('key',td.text());
	    			td.attr("title","");
	    			var fn = Horn.Util.getFunObj(renderer),
	    				text = td.text();
    				//如果没有这个function，则不装入这个button
    				if(!fn.fn) return;
	    			var dom = fn.fn.call($(this),{
	    				val : text,
	    				rowdata : _table.data[idx-1],
	    				alldata : _table.data,
	    				table : _table,
	    				rowidx : idx,
	    				tdidx : tdidx,
	    				tr : tr,
	    				td : td
	    			});
	    			if( dom instanceof $ ){
	    				td.html("");
	    				td.append(dom);
	    			}else{
	    				td.html(dom);
	    			}
	    		}
    		});
    	});
    },
    /**
     * @param val 被添加的一行数据
     * 向表格中添加一行数据
     * @ignore
     */
    addRowData : function(val){
    	
    }
}) ;
Horn.regUI("div.h_formtable",Horn.Grid) ;

/**
 * @name Horn.HiddenField   
 * @class
 * 隐藏域的包装组件</br>
 */	
/**
 * @lends Horn.HiddenField#
 */

/**
 * 组件唯一标识
 * @name Horn.HiddenField#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.HiddenField#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.HiddenField#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.HiddenField#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.HiddenField#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

//disabled 属性无法与 <input type="hidden"> 一起使用。

/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值,disabled对hidden无效
 * @function
 * @name Horn.HiddenField#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.HiddenField#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.HiddenField#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.HiddenField#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.HiddenField#clearValue
 */

	Horn.HiddenField = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"HiddenField",
		init : function(){
			Horn.HiddenField.superclass.init.apply(this,arguments);
			this.field = this.el;
			this.name = this.field.attr("name") ;
            this.alias = this.field.attr("alias") || "" ;
            this.defValue = (this.params.defValue != undefined)?this.params.defValue:this.field.val();
		},
		isValid : function(){
			return true;
		},
		showError : function(){
		},
		reset : function(clear){
			if(clear) {
                this.field.val("");
            }else{
                this.field.val(this.defValue);
            }
		},
		removeError : function(){
		}
	}); 
	Horn.Field.regFieldType("input.hc_hiddenfield",Horn.HiddenField) ;

/*
 * -----------------------------------------------------------------------
 * 修订记录：
 * 2014-2-11     zhangc   修正错误显示逻辑，removeError之后无法再次显示的问题
 * 2014-2-26     zhangc   修正翻译后内容超长溢出的问题。
 * 2015-04-20    zhangsu  BUG #9731 需求11320--label原先有value值，再用setvalue设置值，tip还是原先的值
 * ----------------------------------------------------------------------- 
 */
/**
 * @name Horn.Label   
 * @class
 * 用于显示标签的标签组件</br>
 */	
/**
 * @lends Horn.Label#
 */

/**
 * 组件唯一标识
 * @name Horn.Label#<b>id</b>
 * @type String
 * @default
 */
/**
 * 组件的名字
 * @name Horn.Label#<b>name</b>
 * @type String
 * @default
 */
/**
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Label#<b>alias</b>
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */
/**
 * 组件的初始值(值过长时，将截断字符，以...代替，鼠标移上去显示全部内容)
 * @name Horn.Label#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 标签的显示文本(内容过长时，将截断字符，以...代替，鼠标移上去显示全部内容)
 * @name Horn.Label#<b>label</b>
 * @type String
 * @default
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Label#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 标签组件布局上所占的列数（1-4）
 * @name Horn.Label#<b>cols</b>
 * @type Int
 * @default 1
 * @example
 * 无
 */
/**
 * 组件的静态字典列表
 * @name Horn.Label#<b>items</b>
 * @type Array[Json
 * @default  
 * @ignore
 * @example
 * "items":[{"label":"a","value":"a1"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]
 */
/**
 * 组件的动态字典名字
 * @name Horn.Label#<b>dictName</b>
 * @type String
 * @default  
 * @ignore
 * @example
 * 无
 */
/**
 * 组件的隐藏名，如有值，则以此name提交一个当前的值到后台
 * @name Horn.Label#<b>hiddenName</b>
 * @type String
 * @default  
 * @example
 * 无
 */
/**
 * 组件的标签字段名字
 * @name Horn.Label#<b>labelField</b>
 * @type String
 * @default "label" 
 * @ignore
 * @example
 * 无
 */
/**
 * 组件的值字段名字
 * @name Horn.Label#<b>valueField</b>
 * @type String
 * @default "value" 
 * @ignore
 * @example
 * 无
 */
 /**
  * 组件的多个值时的分割符号,定义了分割符为多选,如果定义的分割为空，则用逗号分割
  * @name Horn.Label#<b>delimiter</b>
  * @type String
  * @default "" 
  * @ignore
  * @example
  * 无
  */
Horn.Label = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Label",
	el:null,
	dictName:null,
	staticDict:null,
	mutiValue : null,
	init:function(dom){
		Horn.Label.superclass.init.apply(this,arguments);
		var params = this.params;
		if(params['name'] || params['hiddenName']){
			this.name = params['name'] || params['hiddenName'] ;
		}
//		this.mutiValue = params.multiple ;
		this.mutiValue = $(dom).attr('mutivalue');
		
		this.label = this.el.prev('span');
		this.hidden = this.el.find('input:hidden');
		if(params['hiddenName']){                            //STORY #8616 
			this.hidden = this.el.next('input:hidden');
		}
		/*
		if(!this.hidden.get(0)){
			this.hidden = this.el.next('input:hidden');
		}*/
		this.li= this.el.parent();
		
		if(this.hidden) {
			this.el.parent().append(this.hidden);
		}
		
		var dictName = params["dictName"],
			staticDict = params["items"],
			labelName = params['labelField'] || 'label',
			valueName = params['valueField'] || 'value',
			delimiter = params['delimiter'],
			value = this.hidden.get(0)?this.hidden.val():this.el.html()
			;
		if(delimiter==""||this.delimiter){
			this.delimiter =delimiter;
			this.mutiValue = true;//只要定义了分隔符，皆为多选
		}else{
			this.delimiter =",";
		}
		
		if(staticDict){
			var tmpDict = {};
			for(var i=0;i<staticDict.length;i++){
				var obj = staticDict[i];
				tmpDict[obj[labelName]] = obj[valueName];
			}
			staticDict = tmpDict;
		}
		
		if(dictName){
			this.dictName = dictName; 
			staticDict = Horn.getDict(dictName);
		}
		
		this.staticDict = staticDict;
		
		if(value){
			this.setValue(  value );
		}
	},
	 /**
     * @description 设置标签的值
     * @function
     * @ignore
     * @name Horn.Label#setValue
     * @param {String} val 标签的值
     */
	setValue:function(value){
		value = $.trim(value);
		if(this.hidden){
			this.hidden.val(value);
		}
	
		var dictName = this.dictName,
			staticDict = this.staticDict
			;
		
		var getVal = function(val){
			var tmpval = "";
			if(staticDict){
				tmpval = staticDict[val]||val;
			}else if(dictName){
				var li = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li[key="+val+"]");
				tmpval = li.attr('title')||val;
			}else{
				tmpval = val;
			}
			return tmpval;
		};
		var fval = "";
		var overflow = false;
		if(!value) value="";
		if(this.mutiValue){
			var vv = [];
			$(value.split(this.delimiter)).each(function(idx,item){
				var v = getVal(item);
				vv.push(v||item);
			});
			fval = vv.join(this.delimiter||',');//若存在分隔符但分隔符为空，则用逗号代替
			overflow = true;
		}else{
			fval = getVal(value);
		}
	
		this.el.html(fval);
		var title = this.el.attr('title');
		/*if(title){
			//如何title已经存在，什么都不用做 20151103 modify by 周智星
		}else{
			this.el.attr('title',fval);
		}*/
		if(overflow){
			this.el.addClass('hc_texthide');
		}

		this.el.attr('title',fval);
	},
	/**
     * @description 取标签的值
     * @function
     * @ignore
     * @name Horn.Label#getValue
     * @return 标签的值
     */
	getValue:function(){
		if(this.hidden.get(0)){
			return this.hidden.val();
		}
		return this.el.text();
	},
    /**
     * @description 设置标签的名字
     * @function
     * @ignore
     * @name Horn.Label#setLabel
     * @param {string} val 标签的名字
     */
	setLabel:function(val){
		this.label.html(val);
	},
    /**
     * @description 取标签的名字
     * @function
     * @ignore
     * @name Horn.Label#getLabel
     * @return 标签的名字
     */
	getLabel:function(){
		return this.label.html();
	},
	hide:function(){
		this.li.hide();
	},
	show:function(){
		this.li.show();
	}
});

Horn.regUI("div.hc_label",Horn.Label) ;

/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * -----------------------------------------------------------------------
 */
 
/**
 * @description 可绑定按钮的多级菜单
 * @name Horn.Menu
 * @class
 * 可绑定按钮的多级菜单
 * @extends Horn.Base
 * @example
    #menu({"name":"text11","opendir":"R","items":[{"label":"test","hasLine":true,"icon":"http://www.baidu.com/img/bdlogo.png","items":[{"label":"test"},{"label":"test","items":[{"label":"test"},{"label":"test"},{"label":"test"}]},{"label":"test"}]},{"label":"test"},{"label":"test"}]})
 */
/**
 * 组件的唯一标示
 * @name Horn.Menu#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单输入域的名称
 * @name Horn.Menu#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单输入域的别名，用在表单中存在相同name的情况下，可以通过别名来区分
 * @name Horn.Menu#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 菜单的展开方向,向右R,向左L；当menu位于窗口最右的时候向左展开，当其位于窗口最左的时候向右展开
 * @name Horn.Menu#<b>opendir</b>
 * @type String
 * @default "R"
 * @ignore
 * @example
 * 无
 */
/**
 * 菜单的条目内容，其中主要的配置内容为label：显示名；icon：图标；event:点击的处理事件；items：子级菜单；tips：显示的提示信息
 * @name Horn.Menu#<b>items</b>
 * @type String
 * @default "1"
 * @example
 * 无
 */
Horn.Menu = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"menu",
		id:"menu",
		baseMenuEl:null,
		baseMenuItem:null,
		rootMenu:null,
		zindexInit:9999,
		opendir:"R",//展开方向，默认向右展开
		tier:0,//menu菜单有多少层
		classOneNum:0,//一级菜单的个数
		init:function(dom){
			 Horn.Menu.superclass.init.apply(this,arguments);
			 var _this = this;
			 
			 this.classOneNum = this.params.items.length;//获取一级菜单的个数
			 
			 this.id = this.params.id?this.params.id:this.id;
			 this.el.attr("id",this.id);
			 this.opendir = this.params.opendir?this.params.opendir:this.opendir;
			 this.baseMenuEl = this.el.next();
			 this.baseMenuItem = $("li",this.baseMenuEl);
			 this.recursionItems(this.baseMenuEl,this.params)
			 this.baseMenuEl.appendTo(this.el);
			 $("li[base='']",this.el).remove();//去除显示的基本元素，IE下如果不写=‘’竟然找不到节点
			 
			 this.rootMenu = this.el.children("ul");
			 
			 //在datagrid中绑定menu时候datagrid的层高过高导致menu被遮盖
			 this.rootMenu.css({"z-index":_this.zindexInit-1});
			 
			 $(document).bind("click",function(e){
				 //不管能不能找到都不能让事件再冒泡了，
				 if($(e.target).closest("*[refmenu="+_this.id+"]").size() == 0 && e.button == 0){
					 _this.hideMenu();
					 //return false;//阻止冒泡导致radio无法切换，checkbox无法选中
				 }
			 })
			 
			 if(this.params.isContextMenu){
				 document.oncontextmenu=function(ev){
					ev = ev || window.event;  
					if(ev.button == 2 || ev.type == "contextmenu"){
						var explorer =navigator.userAgent ;
						//ie 
						if (navigator.appName!= 'Microsoft Internet Explorer'){
							window.event = ev;
						}
						_this.showMenu();
						return false;
					}
				 }
			 }
			 
			 //菜单主动将自己绑定到制定的元素上面
			 $("*[refmenu="+_this.id+"]").click(function(){
				 //增加被绑定元素是否禁用的判断，如果被禁用就不弹出菜单
				 if(!_this.isContextDisabled($(this))){
					 _this.reCalOpendir($(this));
					 if (!_this.rootMenu.is(":visible")) {
						 _this.showMenu($(this));
					 } else {
						 _this.hideMenu();
					 }
				 }
			 });
			 
			 //改变被绑定按钮的展示样式
			 $("*[refmenu="+_this.id+"]").each(function(i,o){
				 $("<i class='fa fa-caret-down'></i>").appendTo($(o));
				 if(o.tagName == "A" || o.tagName == "a"){
					 $(o).css({"text-decoration":"none"})
				 }
				 //不再兼容IE7
//				 if(o.tagName == "BUTTON" || o.tagName == "button" && $.browser.msie && $.browser.version=="7.0"){
//					 $(o).css({"height":"25px"})
//				 }
			 })
			 
			//页面resize的时候onresize
			 $(window).bind("resize",function(){
				_this.hideMenu(); 
			 });
			 
			 //修复当菜单不是最先被初始化的时候在菜单和按钮之间会出现很大的空隙
			 this.el.prependTo($(document.body));
		},
		reCalOpendir:function(context){//重新计算展开方向
			var maxWidth ;
			var p = {};
			var toLeft = context.offset().left;
			var itemWidth = 150;
			if(this.tier < 4){//可以保证三层以内的自动判断，不回折
				maxWidth = this.tier*itemWidth
				p.left = maxWidth < toLeft+context.width();
				p.right = maxWidth < $(window).width() - toLeft;
			}else{
//				maxWidth = 3*itemWidth
//				p.left = maxWidth < toLeft-context.width();
//				p.right = maxWidth < $(window).width() - toLeft;
				p.left = p.right = true;
			}
			if(p.left && p.right || (!p.left && !p.right)){//如果向左
				return;
			}
			if(this.opendir == "L" && !p.left) this.opendir = "R";
			if(this.opendir == "R" && !p.right) this.opendir = "L";
		},
		recursionItems:function(menuEl,item){
			this.tier++;
			var _this = this;
			if(item.items){
				var i = 0;
				while(i < item.items.length){
					
					var tempItem = _this.processparam(_this.baseMenuItem.clone(true).removeAttr("base"),item.items[i]);
					if(item.items[i].items){
						_this.zindexInit++;
						var nextEl = _this.baseMenuEl.clone(true).css({"z-index":_this.zindexInit});
//						var nextEl = _this.baseMenuEl.clone(true);
						nextEl.appendTo(tempItem)
						_this.recursionItems(nextEl,item.items[i]);
					}
					tempItem.appendTo(menuEl);
					
					i++;
				}
			}
		},
		processparam:function(menuEl,params){
			if(params.tips)
				$("a",menuEl).attr("title",params.tips)
			if(params.hasLine)
				$("span.h_toolbar-item-txt",menuEl).addClass("h_menu-line");
			if(params.event)
				$("a",menuEl).attr("onclick",params.event)
			if(params.icon)
				$("span.h_toolbar-item-icon",menuEl).html("<img width='20px' src='"+params.icon+"'>");
			if(params.label)
				$("span.h_toolbar-item-txt",menuEl).text(params.label);
			if(!params.items)
				$("span.h_toolbar-item-arrow",menuEl).remove()
			return menuEl;
		},
		/**
		 * 在哪个元素上进行绝对定位
		 */
		showMenu:function(context,el,isUl){
			var _this = this;
			if(!el){
				el = this.rootMenu;
			}
			
			var pos = this.getShowPosition(context,isUl);
			el.css({"top":pos.Y,"left":pos.X})
			
			el.show();
			
			el.children("li").hover(function(){
				var child = $(this).children("ul");
				if(child.size() == 1){
					_this.showMenu($(this),child,true);
				}
			},function(){
				var child = $(this).children("ul");
				if(child.size() == 1){
					child.hide()
				}
			})
		},
		/**
		 * 获取菜单应该显示在的位置
		 */
		getShowPosition:function(context,isUl){
			var _this = this;
			var itemWidth = 150;//菜单条目的宽度
			var toLeft,toTop,width,height;
			
			if(!context){//页面自定义右键菜单
				toLeft = window.event.clientX;
				toTop = window.event.clientY;
				height=0;
				width=0;
			}else{//被绑定菜单，context是被绑定元素的jquery对象
				toLeft = context.offset().left;
				toTop = context.offset().top;
				width = context.outerWidth();
				height = context.outerHeight();
			}
			/*****************以上属性对以下函数只读******************************/		
			var ulPos = function(){
				var p_y,p_x; //菜单显示的坐标点
				p_y=-height;
				if (_this.opendir == "R"&& (toLeft + width + itemWidth) > $(window).width() || _this.opendir == "L") {//要么都向左展开，要么都向右展开
					_this.opendir = "L";
					p_x=-width;
				}
				if(_this.opendir == "L" && (toLeft-itemWidth) < 0 || _this.opendir == "R"){
					_this.opendir = "R";
					p_x=width;
				}
				return {"X":p_x,"Y":p_y};
			}
			
			var contextPos = function(){
				var p_y,p_x; //菜单显示的坐标点
				var num = _this.classOneNum;
				
				//STORY #10125 #10019建议menu要能支持浏览器向上或是向下碰撞 
				//判断被绑定的按钮是不是在页面视口的底部
				var w_h = $(window).height();
				var m_h = num * 39;//每个菜单的宽度是39
				if(toTop + width + m_h > w_h){
					p_y = toTop-m_h;
				}else{
					p_y = toTop + height;
				}
				
				//在这里判断从左边缘还是右边缘显示菜单
				if((toLeft+itemWidth)>$(window).width() || (_this.opendir == "L" && (toLeft-itemWidth) > 0)){
					p_x = toLeft-itemWidth+width;//这里的26px是下拉箭头的的i元素的宽度
					_this.opendir = "L";
				}else
					p_x = toLeft;
				return {"X":p_x,"Y":p_y};
			}
			/*************************以上获取位置的函数定义，以下处理位置******************************************/
			if(isUl){//子级菜单
				return ulPos();
			}else{//父菜单或者主菜单
				return contextPos();
			}
		},
		hideMenu:function(){
			this.rootMenu.hide();
			this.rootMenu.css({"top":1200,"left":600})
			this.opendir=this.params.opendir;
		},
		/**
		 * @description 添加条目的处理，现在只能添加到指定一级菜单的末尾
	     * @function
	     * @name Horn.Menu#addItem
	     * @param {object} obj
	     * @ignore
	     */
		addItem:function(obj){
			var tempItem = this.processparam(this.baseMenuItem.clone(true).removeAttr("base"),obj);
			tempItem.appendTo(this.rootMenu)
		},
		isContextDisabled:function(context){
			return context.hasClass("h_btn-disabled");
		}
	});
Horn.regUI('div.hc_menu',Horn.Menu);
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
/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: PageBar.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：PageBar组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 *  -----------------------------------------------------------------------
 *  2014-01-28    zhangsu    Grid分页支持动态设置每页显示条数
 *  2014-02-10    zhangsu    Grid分页增加分页页数判断
 *  2014-02-13    zhangsu    跳转到第几页做范围限制，只能在当前页码范围内调整
 *  2014-02-13    zhangsu    点击尾页不会跳转到尾页 
 *  2014-02-14    zhangsu    如果总条数为0，将动态设置跳转页和页码input框disabled，跳转按钮disabled
 *  2014-03-12    zhangsu    STORY #7836 grid分页grid的查询条件带不过去
 *  2013-4-10     周智星      BUG #6642 【page_bar】bindFormName设置了不能再页面第一次加载的时候生效，但是事实上第一次加载的时候form内的表单是有值的
 *  2014-4-21     周智星		  BUG #6639 【page_bar】异常测试----pageNo设置为不在页数内的值出现奇特情况
 *  2015-09-30    周智星      需求 #12928 【TS:201509070298-JRESPlus-财富管理事业部-王瑞明-2. 新框架下的 DATAGRID，每页显示 输入 0 条时报错问题
 *  2016-1-27     刘龙          STORY 16308 【TS:201601070241-JRESPlus-财富管理事业部-陈为-10.对于导航栏，希望研发中心给出统一标准的导航工具栏风格，】
 *  2016-2-16     刘龙          15934 需求16308--grid分页栏中，到第几页输入框中输入值，移开焦点未发送请求
 *  2016-3-28     刘龙          需求#18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
 *  -----------------------------------------------------------------------
 */
/**
 * @description PageBar实现
 * @author huzw@hundsun.com
 * @name Horn.PageBar
 * @class Horn.PageBar
 * 分页栏组件，结合grid一起使用
 * @extends Horn.Base
 * @since version 0.1
 * @example
 * 	#page_bar($page)
 *  #page_bar({"pageNo":1,"pageSize":20,"pages":})
 */
/**
 * @lends Horn.PageBar#
 */

/**
 * @description PageBar的唯一标识，必填项。
 * @property id
 * @name Horn.PageBar#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description PageBar的名称。
 * @property name
 * @name Horn.PageBar#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description PageBar页面跳转的地址。默认为当前页面地址，可提供其他页面的分页跳转
 * @property url
 * @name Horn.PageBar#<b>url</b>
 * @type String
 * @default 当前页面地址
 * @example
 * 无
 */

/**
 * @description PageBar 当前页码，一般由分页组件Page提供
 * @property pageNo
 * @name Horn.PageBar#<b>pageNo</b>
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * @description PageBar 总页码数，一般由分页组件Page提供
 * @property pages
 * @name Horn.PageBar#<b>pages</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @description PageBar 页面大小，每页显示条目数，一般由分页组件Page提供
 * @property pageSize
 * @name Horn.PageBar#<b>pageSize</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @description PageBar 总条目数，一般由分页组件Page提供
 * @property count
 * @name Horn.PageBar#<b>count</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @description PageBar 绑定的查询表单名称,用于分页时将查询条件的参数传入(特别说明！参数传入仅针对点击分页栏里的事件触发时生效，对第一次加载页面无效)<br>
 * 需要注意点：绑定form是$("form").submit()方式提交的，所以java类里的action的method必须去除,例如：<br>
 * "@RequestMapping(value = "/test/grid/testGrid.htm")<br>
 *	public void testGrid(Page page,String key1, ModelMap mm) {<br>
 * }"
 * @property bindFormName
 * @name Horn.PageBar#<b>bindFormName</b>
 * @type String
 * @default 
 * @example
 * #page_bar($page {"bindFormName":"addForm1"})
 */

/**
 * @description PageBar 的显示位置，默认不配置是居中显示，设置值为"left",居左显示，设置值为"right",居右显示,设置为"center",居中显示
 * @property align
 * @name Horn.PageBar#<b>align</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	Horn.PageBar = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"PageBar",
		/**
         * @description 可能会使用的跳转对象名称
		 * @deprecated 暂时未使用
		 * @ignore
		 */
		targetName : null,
		/**
		 *
         * @description 可能会使用的跳转对象
		 * @deprecated 暂时未使用
		 * @ignore
		 */
		target : null,
        /**
         * @description 页面跳转地址
         * @field
         * @name Horn.PageBar#url
         * @default null
         * @ignore
         */
		url : null,
		/**
		 * @ignore
		 */
		init:function(dom){
			Horn.PageBar.superclass.init.apply(this,arguments) ;
			Horn.apply(this,this.params);
			this.targetName = this.el.attr('target');
			this.url = this.el.attr('url');
			if(!this.url) this.url = window.location.href;
			this.initPageParams();   //点击尾页不会跳转到尾页 ,此方法需要放在initEvent之前
			this.initEvent();
			
		},
		/**
		 *
         * @description 从dom对象中获取到所需要的参数
		 * @private
		 * @function
		 */
		initPageParams : function(){
			var formName = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
        		formName = this.el.attr("bindformname") ;
        	}
			var el = this.el;
			this.page = parseInt(el.attr("pageNo")) || this.page; 
			this.pageSize = parseInt(el.attr("pageSize")) || this.pageSize; 
			this.pageCount = parseInt(el.attr("pageCount")) || this.pageCount; 
			this.pages = parseInt(el.attr("pages")) || this.pages;
			this.gridId = el.attr("id") || "dyncGrid";
			this.bindFormName=el.attr("bindFormName") || "";
			if(this.pageCount <=0||this.pages<=0){     //如果总条数为0，将动态设置跳转页和页码input框disabled，跳转按钮disabled	
				$('#'+formName+'_topageid').attr("disabled","disabled"); 
				$('#'+formName+'_topagesize').attr("disabled","disabled"); 
				$('#'+formName+'_pagebtn-go').attr("disabled","disabled");

			}else{
				$('#'+formName+'_topageid').removeAttr("disabled"); 
				$('#'+formName+'_topagesize').removeAttr("disabled"); 
				$('#'+formName+'_pagebtn-go').removeAttr("disabled");
			}
		},
		/**
		 * 为每个按钮绑定点击事件
		 * @private
		 * @function
		 */
		initEvent : function(){
			var _pageBar = this;
			var formName = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
        		formName = this.el.attr("bindformname") ;
        	}
        	this.el.children("ul").children("li").children('a').each(function(idx,it){
				var item = $(it),
					func = function(item,f,arg){
						item.click(function(){
							if(item.hasClass('disabled')){
								return;
							}
							if(item.hasClass('h_pagebtn-next') || item.hasClass('h_pagebtn-prev')){
								item.addClass("disabled");
							}
							f.call(_pageBar,arg);
						});
					};
					
				if(!item.hasClass('disabled')){
					if(item.hasClass('h_pagebtn-index')){
						func(item,_pageBar.goPage,_pageBar.INDEX_PAGE);
					}else if(item.hasClass('h_pagebtn-end')){      //尾页点击
						func(item,_pageBar.goPage,parseInt(_pageBar.pages));
					}else if(item.hasClass('h_pagebtn-next')){
						func(item,_pageBar.nextpage);
					}else if(item.hasClass('h_pagebtn-prev')){
						func (item,_pageBar.prevpage);
					}else if(item.hasClass('h_page-num')){
						func (item,_pageBar.goPage,parseInt(item.text()));
					}else if(item.hasClass('h_pagebtn-go')){       //Grid分页支持动态设置每页显示条数
						
	                    item.bind('click',function(e){
	                    	var _topageid = document.getElementById(formName+"_topageid").value;
							var _topagesize = document.getElementById(formName+"_topagesize").value;
							//需求 #12928 【TS:201509070298-JRESPlus-财富管理事业部-王瑞明-2. 新框架下的 DATAGRID，每页显示 输入 0 条时报错问题
							if(_topagesize==0){
								_topagesize = 10;
							}
							var params = [];
		                    params.push(parseInt(_topageid),parseInt(_topagesize));
	                        return _pageBar.goPage.apply(_pageBar,params);
	                    });
					}
				 }
			});
			//STORY 16308 【TS:201601070241-JRESPlus-财富管理事业部-陈为-10.对于导航栏，希望研发中心给出统一标准的导航工具栏风格，】
				this.perPage = false;
				$("#_recPerPage"+this.gridId).on('click',function(){
					optGridId = $(this).attr("id");
					optGridId =optGridId.substring(11)
					var currPage = $(this).children("strong").text();
					if(_pageBar.perPage){
						$(this).next().hide();
						_pageBar.perPage = false;
					}else{
						$(this).next().show();
						$(this).next().find("li").each(function(idx,a){
							var _page = $(this).children("a").text();
							if(currPage==_page){
								$(this).addClass("active");
							}else{
								$(this).removeClass("active");
							}
						});
						_pageBar.perPage = true;
					}
				});
				
				$("#_recPerPage"+this.gridId).bind('blur',function(e){
					var t = e;
					if(_pageBar.perPage){
						$(".dropdown-menu-datagrid").hide();
						_pageBar.perPage = false;
						return true;
					}
				});
				$(".dropdown-menu-datagrid").bind('mouseover',function(){
					$("#_recPerPage"+_pageBar.gridId).unbind('blur');
				});
				$(".dropdown-menu-datagrid").bind('mouseout',function(){
					$("#_recPerPage"+_pageBar.gridId).bind('blur',function(e){
						var t = e;
						if(_pageBar.perPage){
							$(".dropdown-menu-datagrid").hide();
							_pageBar.perPage = false;
							return true;
						}
					});
				});
				
				this.activeLi = $(".dropdown-menu-datagrid").find('li.active');
				//需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
				/*$(".dropdown-menu-datagrid").find('a').each(function(idx,a){
					var item = $(a); var pageSize = parseInt(item.html(),10);
					item.on('click',function(){
						if(_pageBar.gridId==optGridId){
							$("#pageSize_"+_pageBar.gridId).html(pageSize);
							_pageBar.activeLi.removeClass("active");
							_pageBar.activeLi=item.parent();
							item.parent().addClass("active");
							
							$(".dropdown-menu-datagrid").hide();
							_pageBar.perPage = false;
							
							//_pageBar.grid.reqPage($("#toPage_"+_pageBar.grid.id).val(), pageSize);
							var params = [];
		                    params.push(parseInt($("#"+_pageBar.bindFormName+"_topageid").val()), pageSize);
	                        _pageBar.goPage.apply(_pageBar,params);
	                        $("#"+_pageBar.bindFormName+"_topagesize").val(pageSize);
						}
					});
				});*/
				//注册事件
				var thatgrid = this;
				$("#toPage_"+thatgrid.id).on('keydown',function(e){
					var k = e.keyCode;
					if(k == 27||k == 8)
						return true;
					if(k>=48 && k<=57)
						return true;
					if(k>=96 && k<=105)
						return true;
					
					var reg = new RegExp("[0123456789]");
					var cc = String.fromCharCode(k);
					if(!reg.test(cc)){
						return false;
					}
					
				});
				//15934 需求16308--grid分页栏中，到第几页输入框中输入值，移开焦点未发送请求
				$("#"+this.bindFormName+"_topageid").on('blur',function(){
					var pageNum = $(this).val();
					if(pageNum==""){
						pageNum = thatgrid.page;
					}
					if (!pageNum || isNaN(pageNum)){
						pageNum = thatgrid.reqPageNo;
					}
					pageNum = parseInt(pageNum,10);
					if(pageNum<=0)
						pageNum=1;
					else if(pageNum>thatgrid.pages)	
						pageNum = 1;
					$(this).val(pageNum);
					//thatgrid.reqPage($(this).val(), $("#pageSize_"+thatgrid.id).html());
					var params = [];
                    params.push(pageNum,thatgrid.pageSize);
                    _pageBar.goPage.apply(_pageBar,params);
				});
				//需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
				$("#"+this.bindFormName+"_topageSize_show").on('blur',function(){
					var pageSize = $(this).val();
					var $pageSize_hide=$(this).next(":hidden");
					if (!pageSize || isNaN(pageSize)){
						pageSize = $pageSize_hide.attr("value");
					}
					pageSize = parseInt(pageSize,10);
					if(pageSize<=0)
						pageSize=1;
					$(this).val(pageSize);
                    
                    var params = [];
                    params.push(parseInt($("#"+_pageBar.bindFormName+"_topageid").val()), pageSize);
                    _pageBar.goPage.apply(_pageBar,params);
                    $("#"+_pageBar.bindFormName+"_topagesize").val(pageSize);
				});
		},
		/**
         * @description 从参数中获取到对象
		 * @function
         * @name Horn.PageBar#getTarget
         * @ignore
		 */
		getTarget:function(){
			return this.target || Horn.getComp(this.targetName);
		},
		/**
		 * 首页页码
		 * @property
		 * @ignore
		 */
        INDEX_PAGE:1,
        /**
         * 当前页码
		 * @property
		 * @ignore
         */
		page : 1,
		/**
		 * 页面大小
		 * @property
		 * @ignore
		 */
		pageSize : 20,
		/**
		 * 总条数
		 * @property
		 * @ignore
		 */
		pageCount : 0,
		/**
		 * 总页数
		 * @property
		 * @ignore
		 */
		pages : 1,
		/**
		 * 下一页
		 * @function
		 * @name Horn.PageBar#<b>nextpage</b>
		 */
        nextpage : function() {
            this.goPage(parseInt(this.page) +1 );
        },
        /**
         * 上一页
         * @function
         * @name Horn.PageBar#<b>prevpage</b>
         */
        prevpage : function() {
            this.goPage(parseInt(this.page) -1);
        },
        /**
         * 跳转到首页
         * @function
         * @name Horn.PageBar#<b>firstpage</b>
         */
        firstpage : function() {
            this.goPage(this.INDEX_PAGE);
        },
        /*
        refreshpage : function() {
            this.ajaxRequest();
        },*/
        /**
         * 跳转到页面
         * @param {Number} 跳转到页码
         * @function
         * @ignore
         */
        goPage : function(page,pageSize){
        	var bindformname = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
			    bindformname = this.el.attr("bindformname") ;
        	}
        	if(page < this.INDEX_PAGE ){
        		page = this.INDEX_PAGE;
        	}
        	if(page > this.pages){
        		page = this.pages;
        	}
        	if(pageSize > this.pageCount) {
        		pageSize = this.pageCount;
        	}
        	//$("#"+bindformname+"_topageid").val(page);
        	//$("#pageSize_"+this.gridId).text(pageSize);
        	if(pageSize < 0||pageSize==null||pageSize==undefined) pageSize = this.pageSize;
        	this.page = page;
        	this.pageSize = pageSize;
			this.doJump();
        },
        
        /**
         * 开始跳转
         * @private
         * @ignore
         */
		doJump : function(){
			/*
			 * pageBar如果绑定了form，就以post方式进行提交查询，否则get方式进行查询
			 * BUG #6642 【page_bar】bindFormName设置了不能再页面第一次加载的时候生效，但是事实上第一次加载的时候form内的表单是有值的
			 */
			if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
					
				    var bindformname = this.el.attr("bindformname") ;
		            this.form = Horn.getCurrent().find("form[name='"+bindformname+"']") ;
		            var pageParamStr = '<input type="hidden" name="index" value="'+this.page+'"><input type="hidden" name="pageNo" value="'+this.page+'"><input type="hidden" name="pageSize" value="'+this.pageSize+'"><input type="hidden" name="count" value="'+this.pageCount+'"><input type="hidden" name="pages" value="'+this.pages+'">';
		            this.form.append(pageParamStr);
		            this.form.attr("action",this.url);
		            this.form.submit();
		            
		            //绑定的form表单的参数
					/*var formData = {};
					formData = Horn.Util.getValues(this.form) ;
		            for(var key in formData){
		            	if(key != "sourceurl")
						  addParam(key,formData[key]);
					}*/
		            
		    }else{
		    	var url = this.url;
				function addParam(name,val){
					var reg = new RegExp("([?|&])"+name+"=[^&]*");
					if(reg.test(url)){
						url=url.replace(reg,'$'+'1'+name+'='+val);
					}else{
						url += (url.indexOf('?') != -1 ? '&' : '?') + name+'='+val;
					}
				}
				addParam("index",this.page);
				addParam("pageNo",this.page);
				addParam("pageSize",this.pageSize);
				addParam("count",this.pageCount);
				addParam("pages",this.pages);
		    	Horn.Util.jump(url);
		    }
		}
	});
	Horn.regUI("div.h_pages",Horn.PageBar) ;

/*
 * -----------------------------------------------------------------------
 * 修订日期                          修改人                    修改原因
 * 2014-3-11 		谢晶晶		修正注释文档
 * 2014-4-8         周智星                  BUG #6625 [panel]表单组件禁用启用 
 * 2014-4-8         周智星                  BUG #6626 [panel]禁用表单类组件
 * 2014-4-8         周智星                  BUG #6543 panel相关文档缺陷
 * 2015-01-19       zhangsu      STORY #10593 [TS:201412180610][财富管理事业部-陈凯-]-JRESPlus-ui--对于查询条件中的extend_fields部分的查询条件，若】
 * 2015-08-27       zhangsu      STORY #12493 【TS:201508100055-JRESPlus-资产管理事业部-张翔Panel组件的expandable有问题，当panel调用hide（）方法隐藏之后expandable图标未隐藏
 * 2015-12-03       周智星                   需求 #15282 [研发中心/WF]panel控件已经支持了是否能打开和收缩的功能，但是默认一定是打开的，希望增加默认打开还是收缩的配置项 
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Panel
 * @class
 * 面板组件</br>
 * 属于容器组件，一般做为单行组件的容器使用
 */
/**@lends Horn.Panel# */
/**
 * 组件的唯一标示
 * @name Horn.Panel#<b>id</b>
 * @type String
 * @default 
 */
/**
 * 组件的名称
 * @name Horn.Panel#<b>name</b>
 * @type String
 * @default 
 */
/**
 * 面板组件的标题栏,默认没有标题栏
 * @name Horn.Panel#<b>title</b>
 * @type String
 * @default ""
 */
/**
 * 列数（目前支持1-4列）
 * @name Horn.Panel#cols
 * @type int
 * @default 3
 * @example
 * #@panel({"id":"testspanel","title":"","cols":3})
 * 
 * #end
 */
/**
 * 是否启用展开/收缩功能,默认不启用
 * @name Horn.Panel#<b>expandable</b>
 * @type Boolean
 * @default false
 * @example
 * #@panel({"expandable":true})
 *	#textfield({"label":"流程名称：", "name":"hsBpmNameLike"})
 * #end
 */
/**
 * 是否展开(只有在expandable为true生效 ),默认不展开
 * @name Horn.Panel#<b>isExpand</b>
 * @type Boolean
 * @default false
 * @example
 * #@panel({"expandable":true,"isExpand":true})
 *	#textfield({"label":"流程名称：", "name":"hsBpmNameLike"})
 * #end
 */
	Horn.Panel = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"Panel",
		init:function(){
		 Horn.Panel.superclass.init.apply(this,arguments);
		 var expandDiv = this.el.children('div.m-panel-box');
		 var _panel = this.el.children("div.g-wrap"); 
		 if(expandDiv) {
			 var btn = expandDiv.children().children("i");
			 expandDiv.click(function(){
				 if(btn.hasClass('fa-angle-up')){
					_panel.hide();
					btn.removeClass("fa-angle-up");
					btn.addClass("fa-angle-down");
				 }else{
					 _panel.show();
					btn.removeClass("fa-angle-down");
					btn.addClass("fa-angle-up");
				 }
			}) ;
		 }
	},
        /**
         * 显示<br/>
         * 显示面板容器的内容
         * @name Horn.Panel#show
         * @function
         * @return {void}
         */
		show : function(){
			this.el.show();
			if(this.params['expandable']==true){
				this.closebar.show();
				this.expanedbar.hide();
			}
		},
        /**
         * 隐藏<br/>
         * 隐藏面板容器及容器内的内容
         * @name Horn.Panel#hide
         * @function
         * @return {void}
         */
		hide : function(){
			this.el.hide();
			if(this.params['expandable']==true){
				this.closebar.hide();
				this.expanedbar.show();
			}
			
			
		},
		/**
         * 设置内部输入组件为可用状态<br/>
         * 对所有表单项起效（文本字段、文本区域、按钮、复选框、单选框和下拉框）
         * @name Horn.Panel#enable
         * @function
         * @return {void}
         */
		enable : function(){
			//this.el.find('input,textarea').not('input[realydisable],textarea[realydisable]').removeAttr('disabled');
			
			//BUG #6625 [panel]表单组件禁用启用
			Horn.Field.findFieldCompsIn(this.el).each(function(i,f){
	    		this.setDisabled(false);
	    	});
			//BUG #6626 [panel]禁用表单类组件
			this.el.find('button,select').removeAttr('disabled');
		},
		/**
         * 设置内部输入组件为不可用状态(disabled)<br/>
         * 对所有表单项起效（文本字段、文本区域、按钮、复选框、单选框和下拉框）
         * @name Horn.Panel#disable
         * @function
         * @return {void}
         */
		disable : function(){
			//this.el.find('input[disabled],textarea[disabled]').attr('realydisable','yes');
			//this.el.find('input,textarea').not('input[realydisable],textarea[realydisable]').attr('disabled','disabled');
			
			//BUG #6625 [panel]表单组件禁用启用
			Horn.Field.findFieldCompsIn(this.el).each(function(i,f){
	    		this.setDisabled(true);
	    	});
			
			//BUG #6626 [panel]禁用表单类组件
			this.el.find('button,select').removeAttr('disabled');
			this.el.find('button,select').attr('disabled','disabled');
		}
	});
	Horn.regUI('div.g-panel',Horn.Panel);

/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-2-11 		张超		增加password的组件，增加设置value的功能
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Password
 * @class
 * 密码录入框组件</br>
 */	
/**
 * @lends Horn.Password#
 */
/**
 * 组件唯一标识
 * @name Horn.Password#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Password#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Password#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Password#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Password#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Password#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Password#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Password#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Password#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的panel的cols而定(支持1-4列)
 * @name Horn.Password#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Password#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */
/**
  * 是否隐藏组件
  * @name Horn.Password#hidden
  * @type Boolean
  * @default false
  * @example
  * #password({"name":"test111", "label":"password","value":"123456", "defValue": "1111111" ,"check": "required","hidden":false})
  */
/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Password#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7，中文、空格、英文字母、标点都只算一个字符。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作，并且此属性对textarea无效。
 * @name Horn.Password#maxlength
 * @type Number
 * @default 
 * @example
 * 无
 */
/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Password#emptyText
  * @type String
  * @default false
  * @example
  * #password({"name":"test111", "label":"password","value":"123456", "defValue": "1111111" ,"check": "required","hidden":false,"emptyText":"请输入密码"})
  */
 /**
  * 组件的事件配置
  * @name Horn.Password#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Password#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Password#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Password#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Password#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Password#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Password#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Password#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Password#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Password#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Password#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交并且其所有校验状态都会消失，但可以通过API的方式修改表单的值
 * @function
 * @name Horn.Password#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Password#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Password#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Password#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Password#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Password#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Password#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Password#validate
 */

/**
 * 显示验证错误提示
 * @function
 * @name Horn.Password#showError
 * @param {String} errorMsg 错误信息
 * @ignore
 */
/**
 * 删除错误提示
 * @function
 * @name Horn.Password#removeError
 * @ignore
 */


	Horn.Password = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"Password",
		init : function(dom){
			Horn.Password.superclass.init.apply(this,arguments);
		}
	});
	Horn.Field.regFieldType("div.hc_password",Horn.Password) ;

/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-2-11 		张超		修正passwordgroup无法设置value的问题
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.PasswordGroup
 * @class
 * 密码组录入框组件</br>
 */	
/**
 * @lends Horn.PasswordGroup#
 */
/**
 * 组件唯一标识
 * @name Horn.PasswordGroup#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名字
 * @name Horn.PasswordGroup#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.PasswordGroup#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * var comp = Horn.getComp("name","alias")
 */
 /**
  * 组件的值
  * @name Horn.PasswordGroup#<b>value</b>
  * @type String
  * @default ""
  * @example
  */
  /**
   * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7。
   * @name Horn.PasswordGroup#<b>maxlength</b>
   * @type String
   * @default ""
   * @example
   */
/**
 * 组件的标签
 * @name Horn.PasswordGroup#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.PasswordGroup#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 组件的跨列数
 * @name Horn.PasswordGroup#<b>cols</b>
 * @type Int
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的约束检查选项
 * @name Horn.PasswordGroup#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */
/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.PasswordGroup#<b>group</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
  * 是否隐藏组件
  * @name Horn.PasswordGroup#hidden
  * @type Boolean
  * @default false
  * @example
  * #passwordgroup({"name":"passwordgroup", "label":"passwordgroup" ,"check": "required","hidden":true})
  */

/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * (特别说明：emptyText必须是数组，数组的第一个元素是第一个密码输入框，第二个元素是第二个密码输入框,数组必须填写两个元素，如："emptyText":["请输入开始日期","请输入结束日期"])
  * @name Horn.PasswordGroup#emptyText
  * @type Array
  * @default []
  * @example
  * #passwordgroup({"name":"passwordgroup", "label":"passwordgroup" ,"check": "required","hidden":false,"emptyText":["请输入密码","请输入确认"]})
  */
 /**
  * 组件的事件配置
  * @name Horn.PasswordGroup#<b>events</b>
  * @type Array[Json
  * @default ""
  * @ignore
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
	Horn.PasswordGroup = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"PasswordGroup",
		field1 : null,
		field2 : null,
		name1 : null,
		name2 : null,
		defValue1:"",
		defValue2:"",
		init : function(dom){
			var inputs = $(dom).find('input');
			this.field1 = $(inputs[0]);
			this.field2 = $(inputs[1]);
			this.name1 = this.field1.attr('name');
			this.name2 = this.field2.attr('name');
			Horn.PasswordGroup.superclass.init.apply(this,arguments);
			if(this.field1){
				this.defValue1 = (this.params.defValue != undefined)?this.params.defValue:this.field1.val();
				this.defValue2 = (this.params.defValue != undefined)?this.params.defValue:this.field2.val();
			}
		},
		initEvents : function(){
	    	var _pwdgroup = this;
	    	this.field2.bind('blur',function(){
		    		
	    		var val2 =_pwdgroup.field2.val();
    			if(val2!=""){
    				val2 = val2.replace(/(^\s*)|(\s*$)/g,'');
    				_pwdgroup.field2.val(val2);
    			}
    			var val1 =_pwdgroup.field1.val();
    			if(val1!=""){
    				val1 = val1.replace(/(^\s*)|(\s*$)/g,'');
    				_pwdgroup.field1.val(val1);
    			}
	    		Horn.Validate.onValid({data:[Horn.Validate,_pwdgroup]});
	    		if(val1!=""&&val2!=""){
		    		if(_pwdgroup.isValid()){
			    		var pwd = _pwdgroup.field1.val();
			    		if(_pwdgroup.field2.val() != pwd){
			    			_pwdgroup.showError('校验不匹配！');
			    		}else{
			    			_pwdgroup.removeError();
			    		}
			    	}
	    		}else{
	    			var rule2 =  _pwdgroup.field2.attr("check");
	    			if(rule2 && rule2.indexOf(Horn.Validate.REQUIRED) > -1){
	    				_pwdgroup.showError("当前输入不能为空");
	    			}
	    		}
	    	});
	    	this.field1.blur(function(){
	    		var val2 =_pwdgroup.field2.val();
    			if(val2!=""){
    				val2 = val2.replace(/(^\s*)|(\s*$)/g,'');
    				_pwdgroup.field2.val(val2);
    			}
    			var val1 =_pwdgroup.field1.val();
    			if(val1!=""){
    				val1 = val1.replace(/(^\s*)|(\s*$)/g,'');
    				_pwdgroup.field1.val(val1);
    			}
    			Horn.Validate.onValid({data:[Horn.Validate,_pwdgroup]});
    			var pwd1 = _pwdgroup.field1.val();
	    		var pwd2 = _pwdgroup.field2.val();
	    		if(pwd1!=""&&pwd2!=""){
		    		if(_pwdgroup.isValid()){
			    		if(pwd1 != pwd2 && pwd2){
			    			_pwdgroup.showError('校验不匹配！');
			    		}else{
			    			_pwdgroup.removeError();
			    		}
		    		}
	    		}else{
		    		var rule1 =  _pwdgroup.field1.attr("check");
	    			if(rule1 && rule1.indexOf(Horn.Validate.REQUIRED) > -1){
	    				_pwdgroup.showError("当前输入不能为空");
	    			}
	    		}
	    	});
	    },
        /**
         * @description 验证输入密码有效性
         * @function
         * @name Horn.PasswordGroup#validate
         */
	    validate : function(){
	    	this.field1.blur();
	    	this.field2.blur();
	    },
	    /**
	     * 增加校验规则
	     * @function
	     * @name Horn.Field#addRule
	     * @param {String} rule 校验规则字符串
	     * @ignore
	     */
	    addRule : function(rule) {
	        var input = this.field1;
	        var input2 = this.field2;
	        var check = input.attr(Horn.Validate.CHECK);
	        if (check) {
	            if (check.indexOf(rule) > -1) {
	                return;
	            }
	            check += Horn.Validate.CHECKSEP + rule;
	        } else {
	            check = rule;
	        }
	        input.attr(Horn.Validate.CHECK, check);
	        input2.attr(Horn.Validate.CHECK, check);
	        if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
	            var li = this.el.parent().parent(".g-unit-wrap");
	            var lab = $("label", li);
	            var red = $("span.m-verify-symbol", lab);
	            if (!red.length) {
	                red = $("<span>", {
	                    "class" : "m-verify-symbol",
	                    "html" : "*"
	                });
	                lab.prepend(red);
	            } else {
	                red.html("*");
	            }
	            
	        }
	        this.removeError();
	        this.field.removeClass('m-verify-success');
	    },
	    /**
	     * 删除校验规则
	     * @function
	     * @name Horn.Field#removeRule
	     * @param {String} rule 校验规则字符串
	     * @ignore
	     */
	    removeRule : function(rule) {
	        var input = this.field1;
	        var input2 = this.field2;
	        var check = input.attr(Horn.Validate.CHECK);
	          //BUG #6518 【calendar】先进行非空校验的错误提示，然后调用removeRule("qq")，会造成非空校验的错误提示消失
	        if (check && check.indexOf(rule) > -1) {//如果要去除的在原来的验证规则了就删除，否则不删除
	            var checks = check.split(Horn.Validate.CHECKSEP);
	            checks = $.grep(checks, function(c, index) {
	                return c && c != rule;
	            });
	            input.attr(Horn.Validate.CHECK, checks.join(';'));
	            input2.attr(Horn.Validate.CHECK, checks.join(';'));
	            this.removeError();
	            this.setNotRequired();
	        }
	    },
	    /**
	     * 显示验证错误信息
	     * @function
	     * @name Horn.Field#showError
	     * @param {String} 错误信息
	     * @ignore
	     */
	    showError : function(errorMsg){
	    	var field1 = this.field1; 
	    	var field2 = this.field2;
	    	field1.removeClass('m-verify-success');
	    	field1.addClass('m-verify-error');
	    	field2.removeClass('m-verify-success');
	    	field2.addClass('m-verify-error');
	    	errorMsg = $.type(errorMsg) == "boolean" ? "校验错误" : errorMsg;
	    	if(!this.msgDiv){
	    		this.msgDiv = $('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');
	    		this.el.after(this.msgDiv);
	    	}
	        var msg = this.msgDiv;
	        msg.html("<div class=\"verify-tip-arrow\"></div><div class=\"verify-tip-inner\">"+errorMsg+"</div>");
	        msg.css("display", "block");
	        this.err = true;
	    },
	    /**
	     * 删除错误信息
	     * @function
	     * @name Horn.Field#removeError
	     * @ignore
	     */
	    removeError : function(){
	    	this.field1.removeClass('m-verify-error');
	    	this.field2.removeClass('m-verify-error');
	        var input = this.get();
	        var check = this.field1.attr(Horn.Validate.CHECK);
	        if (check) {
	        	if(this.isValid){
	        		if(this.field1.val()!=""||this.field2.val()!=""){
		            	this.field1.addClass('m-verify-success');
		            	this.field2.addClass('m-verify-success');
	        		}
	            }
	        }
	        this.err = false;
	    	var msg = this.msgDiv;
	    	if(msg) msg.remove();
	    	delete this.msgDiv ;
	    },
        /**
         * @description 设置密码值
         * @function
         * @name Horn.PasswordGroup#setValue
         * @param {string} val 密码值
         */
		setValue : function(val){
			this.field1.val(val);
			this.field2.val(val);
			this.field1.blur();
			this.field2.blur();
		},
        /**
         * @description 获取密码值
         * @function
         * @name Horn.PasswordGroup#getValue
         * @return {string} 密码值
         */
		getValue : function(){
			return this.field1.val();
		},

		
		/**
         * @description 如果设置了defValue的值，重置成的defValue值，否则重置成value值
         * @function
         * @name Horn.PasswordGroup#reset
         */
		reset : function(clear){
    		var defValue = clear?"":this.defValue1;
	    	this.setValue(defValue);
		},
		/**
		 * 清空表单的值，显示值和隐藏值都设置为""
		 * @function
		 * @name Horn.PasswordGroup#clearValue
		 */
	    clearValue : function() {
	    	this.setValue("");
	    },
		setEnable : function(enable){
			var _pwdgroup = this;
			if(enable){
				this.field1.removeAttr("disabled");
				this.field2.removeAttr("disabled");
				this.field1.blur();
				this.field2.blur();
			}else{
				this.field1.attr("disabled","disabled");
				this.field2.attr("disabled","disabled");
    			_pwdgroup.removeError();
			}
		}
	});
	Horn.Field.regFieldType("div.hc_passwordgroup",Horn.PasswordGroup);

/* 
 * -----------------------------------------------------------------------
 * 修订记录：
 * 2014-01-22     zhangsu          Grid列支持hidden属性
 * 2014-01-22     zhangsu          新增rowSelect属性，使grid支持点击行选中该行
 * 2014-02-08     zhangsu          修改this.rowSelect设置后不生效的问题
 * 2014-2-13      zhangchao09444   修改加载之后会导致页面缺少一半的问题。
 * 2014-2-28      zhangchao09444   修改在querytable重新load的情况下页面加长因而缺失部分的问题。
 * 2014-03-31     zhangsu          BUG #6534 simpleRequest属性配置在初次自动加载数据时未生效
 * 2014-03-31     zhangsu          BUG #6531 query_table中调用selectRow函数报错
 * 2014-04-01     zhangsu          BUG #6533 query_table中simpleReques属性值在代码中仍使用str型，需要调整为布尔型
 * 2014-04-03     zhangsu          BUG #6542 【queryTable】文档错误
 * 2014-04-03     zhangsu          BUG #6567 [query_table]设置无效的requestMethod
 * 2014-04-03     zhangsu          BUG #6545 [query_table]不设置分页未显示所有数据
 * 2014-04-04     zhangsu          BUG #6546 [query_table]设置非法hasPage值时应不分页
 * 2014-04-04     zhangsu          BUG #6544 [query_table]设置非法request_num
 * 2014-04-08     zhangsu          BUG #6574 [queryTable]:单选模式最好选择列是圆圈
 * 2014-04-08     zhangsu          BUG #6595 [query_table]selectRow传参有问题，设计缺陷
 * 2014-04-09     zhangsu          BUG #6598 [query_table]setBaseParams设置的参数不能发送成功
 * 2014-04-09     zhangsu          BUG #6532 通过loadData加载静态数据时，列render属性未生效
 * 2014-04-10     zhangsu          BUG #6562 [query_table]点击多选框不能选中，必须选中数据才能选中
 * 2014-04-11     zhangsu          BUG #6720 queryTable方法selectRow传入行号无法选中
 * 2014-04-14     zhangsu          BUG #6728 query_table属性hasPage不配置时，未使用默认值
 * 2014-04-14     zhangsu          BUG #6730 query_table文档中漏了属性renderer
 * 2014-04-15     zhangsu          BUG #6492 selectModel：“ 行数据选择模式（single/muti 启用单选/多选选择框） ”，这里是“multi”误拼居“muti”了吗？它的默认值是什么？
 * 2014-04-15     zhangsu          BUG #6492   setBaseParams方法怎么没参数呢？
 * 2014-04-16     zhangsu          BUG #6741 query_table中对bindFormName、loadByForm、load的描述错误      
 * 2014-04-16     zhangsu          修改titlebuttons注释，添加save/query/confirm/refresh/open样式   
 * 2014-04-18     zhangsu          BUG #6760 query_table手动全选后调用方法取消全选，列头上的勾还在
 * 2014-04-22     zhangsu          BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的       
 * 2014-04-22     zhangsu          BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的
 * 2014-04-28     周智星                             修改title和   titlebuttons注释                   
 * 2014-04-28     zhangsu          BUG #6887 【query_table】设置hasPage为false  
 * 2014-05-22     zhangsu          STORY #8366 [研发中心/内部需求][jresplus][ui]-queryTable组件的rowSelec属性在文档中未添加说明
 * 2014-05-22     zhangsu          STORY #8380 [研发中心/内部需求]{jresplus}[ui]-queryTable组件url、simpleRequest属性在文档中未说明
 * 2014-05-22     zhangsu          STORY #8381 [研发中心/内部需求][jresplus][ui]-queryTable组件需要在文档中添加事件说明，支持事件列表、事件触发时间或机制、事件传递参数。
 * 2014-05-23     zhangsu          STORY #8367 [研发中心/内部需求][jresplus][ui]-queryTable的position_str属性需要和原先的使用方式兼容 
 * 2014-06-05	  wuxl             STORY #8454 STORY #8454 [研发中心/内部需求][jresplus][ui]-queryTabl,grid当设置"selectModel":"single",取消"rowSelect":"true"的设置，在IE7浏览器下，无法选中单选框
 * 2014-06-19	  wuxl             STORY #8484 queryTable组件的分页栏信息建议加上总页数，总条数(优化：1.解决刷新数据时页面渲染时的晃动;2.点击分页按钮不再跳至页面顶部)
 * 2014-06-26     zhangsu          BUG #7179 querytalbe ：通过data属性加载数据，调用方法 getSelecteds(true)能获得值  
 * 2014-10-14     zhangsu          STORY #9802 [经纪业务事业部/胡志武][TS:201409230017]-JRESPlus-ui-事件错误：QueryTable事件上，原始有一个datafilter 事件,自从7月份的版本之后，这个就没有了
 * 2014-10-28	  wangyb10555		BUG #7852 9802静态数据---querytable的datafilter 事件不能执行
 * 2015-08-25     zhangsu           STORY #12437 有翻页最后一页没数据的问题 STORY #12435 QueryTable增加显示第几页
 * 2015-09-09     zhangsu           STORY #12937QueryTable的刷新,当查询结果为空，没有数据时，改为可用状态
 * 2015-09-28     周智星                                 STORY #12627 【TS:201508200177-JRESPlus-内部客户-蔡乃涛-一.<br>radiobutton的定位显示问题 一个页面有两个以上的grid时有问题，所以name要加上gridName来区分是哪个gird对象
 * 2015-10-09     周智星                                 BUG   #11940 需求13314，querytable中"titleButtons":""时，按钮栏会显示，建议与title一致，不显示
 * 2016-1-20      刘龙                                     STORY 16444 【TS:201601130123-JRESPlus-经纪业务事业部-张小攀-【项目名称】UF3.0<br>【产品及版本信息】jrespl】
 * 2016-1-22      刘龙                                     STORY  16542 【TS:201601150495-JRESPlus-经纪业务事业部-张小攀-5.query_table和datagrid数据格式化不统一】
 * 2016-3-2       刘龙                                     需求17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
 * ----------------------------------------------------------------------- 
 */



/**
 * @name Horn.QueryTable
 * @class
 * 查询表格<br/>
 * 带查询表单的表格展示
 */
/**
 * @lends Horn.QueryTable#
 */
	 
/**
 * 组件的唯一标示
 * @name Horn.QueryTable#<b>id</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.QueryTable#<b>name</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 组件的请求地址 
 * 当url属性未配置，而bindformname属性设置了,控件会取绑定的表单的action属性值作为请求地址
 * @name Horn.QueryTable#<b>url</b>
 * @type String
 * @default ''
 * @example
 * 无
 */

/**
 * 组件的跨列数(支持1-4列)
 * @name Horn.QueryTable#<b>cols</b>
 * @type Number
 * @default 3
 * @example
 * 无
 */
	 
/**
 * 组件的title不设置或者设置为空时(如："title":"")不显示标题栏和按钮栏
 * @name Horn.QueryTable#<b>title</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 表格的高度。注：1.不设置此值时，采用默认高度（438px）；2.此值小于表格内容高度时，会出现纵向滚动条
 * @name Horn.QueryTable#<b>height</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 表格的宽度。注：1.不设置此值时，采用默认宽度（100%）；2.此值大于浏览器宽度时，会出现横向滚动条,所以不建议设置width的值
 * @name Horn.QueryTable#<b>width</b>
 * @type String
 * @default 
 * @example
 * 无
 */	
/**
 * 每页请求的条数
 * @name Horn.QueryTable#<b>request_num</b>
 * @type Number
 * @default 10
 * @example
 * 无
 */

/**
 * 展示的数据源
 * @name Horn.QueryTable#<b>data</b>
 * @type Array
 * @default 
 * @example
 * 示例：
 * [{"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"}]
 */
	
/**
 * 是否有分页  注意：hasPage属性将作为后台识别是否提供分页数据的标识。该参数存在于请求参数中
 * @name Horn.QueryTable#<b>hasPage</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 请求成功回调函数
 * @name Horn.QueryTable#<b>callback</b>
 * @type function
 * @default 
 * @example
 * 无
 */
	 
/**
 * 定位串，定位串的属性名
 * @name Horn.QueryTable#<b>position_str</b>
 * @type String
 * @default position_str
 * @example
 * 无
 */
	
/**
 * 自定义查询条件，每次请求时该查询条件都会提交到后台
 * @name Horn.QueryTable#<b>baseparams</b>
 * @type json
 * @default 
 * @example
 * 无
 */
	
/**
 * 列配置项
 * @name Horn.QueryTable#<b>items</b>
 * @type Array 
 * @default 
 * @example
 * items中的单个列表条目属性：
 * <table>
 *	<tr><td>属性名</td>  <td>类型</td> <td>说明</td> <td>默认值</td></tr>
	<tr><td>name</td> <td>String</td>    <td>列数据索引名 即dataIndex</td> <td>--</td> </tr>
	<tr><td>text</td>   <td>String</td> <td>列头名称</td>  <td>--</td> </tr>
	<tr><td>width</td>   <td>String</td> <td>列头宽度</td>  <td>--</td> </tr>
	<tr><td>hidden</td>   <td>Boolean</td> <td>列是否隐藏</td>  <td>--</td> </tr>
	<tr><td>renderer</td>   <td>String</td> <td>列渲染函数名(可以任意渲染成想要的内容)</td>  <td>--</td> </tr>
	<tr><td>buttons</td>   <td>Array</td> <td>操作列，设置此属性后，属性值会被渲染成多个链接</td>  <td>--</td> </tr>
	<tr><td>dictName</td>   <td>String</td> <td>字典条目名称(数据字典翻译，如数据库值为1，对应的数据字典值为男，翻译后列表显示为男)</td>  <td>--</td> </tr>
	<tr><td>format</td>   <td>String</td> <td>列格式化时的格式 ，需要与dataType属性结合使用，单独设置此值不生效。1.dataType="DATE"时，format格式形如"yyyyMMdd"；2.dataType="AMOUNT"时，format格式形如",.00"，其中逗号控制是否显示千位分隔符，点号控制小数位数。</td>  <td>--</td> </tr>
	<tr><td>dataType</td>   <td>String</td> <td>列格式化的类型，目前只支持日期和金额两种类型，日期：dataType="DATE",金额dataType="AMOUNT"。1.如果不设置format属性，"DATE"默认显示格式为："yyyy-MM-dd HH:mm:ss"，"AMOUNT"默认显示格式为："0,000.00"。2.dataType="DATE"时，待格式化列的数据若为字符串，只能是6位，形式如："20130101";若为非字符串形式，一律按GMT时间进行格式化，形式如：1137075575000。</td>  <td>--</td> </tr>
	</table>
	
	 "items":[
                    {"name":"initDate","text":"发生日期","hidden":true},
                    {"name":"branchNo", "dictName":"branch", "text":"机构（动态字典）"},
                    {"name":"clientId","text":"客户编号","renderer" : "clientIdRender" },
                    {"name":"clientName","text":"客户名称","buttons":[{"label":"设置默认1","event":"edit"}]},
                    {"name":"scanType","dictName":"branch","text":"测试列"},
                    {"name":"initDate","text":"dataType为AMOUNT","dataType":"AMOUNT"}, 
                    {"name":"initDate","text":"format单独使用不生效","format":"yyyy-MM-dd"}, 
                    {"name":"initDate","text":"dataType为AMOUNT时format不生效","dataType":"AMOUNT","format":"yyyy-MM-dd"},    
                    {"name":"initDate","text":"dataType为DATE","dataType":"DATE","format":"yyyy-MM-dd"}
                 ]
 *renderer属性用法示例：
 *{"name":"scanType2","text":"扫描类别","renderer":"domrender","hidden":false,"width":"350"}
 *
 *#jscode()
 *
 *  function domrender(obj){
 *    var val = obj.val;
 *    if(val==0){
 *    	return "返回想要翻译的值";
 *    }else{
 *    	return val;
 *    }
 *  }
 *#end
 *
 */
	
/**
 * 行数据选择模式（single/multi 启用单选/多选选择框）
 * 当不配置selectModel或selectModel为""属性时,不显示选择列
 * @name Horn.QueryTable#<b>selectModel</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	
/**
 * 是否显示序号列索引
 * @name Horn.QueryTable#<b>numbercolumn</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
	
/**
 * 是否使用普通参数模式 ,主要控制request_num(每页请求的记录数,pageSize)的值
 * 注意：当simpleRequest=false时,request_num = request_num+1
 *       当simpleRequest=true时,request_num = request_num
 * @name Horn.QueryTable#<b>simpleRequest</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * datafilter 事件是在请求加载成功后，数据返回，用于进行数据过滤的
 * @name Horn.QueryTable#<b>datafilter</b>
 * @type String
 * @default 无
 * @example
 * 无
 */
	
/**
 * 不设置titleButtons或设置的值为空(如："titleButtons":"")时不显示工具按钮，如下情况按钮就被隐藏:</br>
 * 1.按钮没有配置关联菜单属性refmenu并且没有配置event属性,按钮将被隐藏</br>
 * 2.按钮配置了event属性，但是值为空，按将被隐藏</br>
 * 3.按钮配置了event属性，但是配置的event值不存在，按钮将被隐藏</br>
 * (注！titleButtons不支持多行显示，如果按钮过多，建议使用绑定菜单refmenu方式)
 * 默认提供添加、修改、删除、确认、查询、打开、保存、刷新的样式,cls属性分别对应："add","edit","del","confirm","query","open","save","refresh"
 * 
 * @name Horn.QueryTable#<b>titleButtons</b>
 * @type Array 
 * @default 
 * @example
 * "titleButtons":[{"label":"添加","cls":"add","event":"add()"}]
 * 单个按钮属性：
 *	       label   {String}  按钮文本
 *	       cls     {String}  按钮css样式
 *	       event   {String}  按钮点击事件
 *	       disabled {Boolean} 是否禁用/启用按钮
 * 		   refmenu {string} 按钮中关联menu组件
 */
	
/**
 * 事件
 * 控件支持的事件列表如下：<br>
 * rowclick  行单击事件    事件参数：rowdata  当前被点击的一行数据<br>
 * rowdblclick  行双击事件 事件参数：rowdata  当前被点击的一行数据<br>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @name Horn.QueryTable#<b>events</b>
 * @type Array 
 * @default 
 * @example
 * "events":[
 *		{"event":"rowclick","function":"lhkh.tableRowClick(rowdata)"},
 *		{"event":"rowdblclick","function":"lhkh.tableRowDblClick(rowdata)"}]
 */
/**
 * 打开页面时是否自动加载查询,默认为false
 * @name Horn.QueryTable#<b>autoLoad</b>
 * @type Boolean
 * @default false
 */
/**
 * 邦定form表单的名字,邦定此属性后,querytable将表单中的输入参数作为查询条件进行数据查询
 * @name Horn.QueryTable#<b>bindFormName</b>
 * @type String
 */
	 
/**
 * 数据请求方式（get,post）
 * @name Horn.QueryTable#<b>requestMethod</b>
 * @type String
 * @default 默认为"post"
 */

/**
 * @description 是否启用点击行选中行操作,默认值为false，不启用,设置为true时点击行选中才生效
 * @property rowSelect
 * @name Horn.QueryTable#<b>rowSelect</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @description isDragColumn的表格列是否可以拖动，默认false</br>
 * (注意！如果为true,页面上就必须引入jquery.resizableColumns.mini.js文件，name属性必须填写，否则无法拖动。如果表格自定义了宽度，拖动功能失效。表格不能放在自定义宽度的容器里,如,window组件和tabPanel组件等)
 * @property isDragColumn
 * @name Horn.QueryTable#<b>isDragColumn</b>
 * @type Boolean
 * @default false
 * @ignore
 * @example
 * 无
 */
Horn.QueryTable = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"QueryTable",
    table : null,
    form : null ,
    dicName : null,
    delimiter:",",
    ths : [],
    simpleRequest:false,
    postData : null,
    rowSelect : false,
    keyAttr : "label",
    valueAttr : "value",
    clickFlag:null,
    mutiSelect:false,
    /**
     * @ignore
     */
    init : function(dom) {
        Horn.QueryTable.superclass.init.apply(this,arguments) ;
        this.table = $(dom);
        var baseparams = this.params.baseparams || {};
        var bindformname = this.params["bindformname"] ;
        if(!bindformname){
        	bindformname = this.params["bindFormName"] ;
        }
        //Grid点击行选中该行的配置支持
        this.rowSelect = Boolean(this.params["rowSelect"]);
        var formData = {} ,
        	data = {
		        request_num : 10, // 每页请求条数
		        index : this.INDEX_PAGE, // 页数
		        positionArr : [], // 保存定位串
		        start_position_str : 0,// 开始请求定位串
		        returndata : null,// 返回数据 list
		        url : '', // 请求路径
		        position_str : 'position_str',// 返回数据定位字段
		        hasPage : false, // 是否有分页
		        baseparams : baseparams,
		        params : {},
		        autoLoad:false,
		        requestMethod:"post"
		        // 参数
		    };
        if(bindformname){
            this.form = Horn.getCurrent().find("form[name='"+bindformname+"']") ;
            formData = Horn.Util.getValues(this.form) ;
        }
        data.request_num = formData["request_num"] || this.params["request_num"] || data.request_num ;
        //BUG #6544
        data.request_num = parseInt(data.request_num)>0 ? parseInt(data.request_num):10;
        data.autoLoad = Boolean(this.params["autoLoad"]) ;
        data.url = this.params["url"] ;
        //BUG #6567 
        if(this.params["requestMethod"] && (this.params["requestMethod"].toLowerCase()=="post"||this.params["requestMethod"].toLowerCase()=="get")){
        	data.requestMethod = this.params["requestMethod"] ;
        }
        if(!data.url && this.form && this.form.length){
            data.url = this.form.attr("action")  ;
        }
        if(data.url && data.url.indexOf("http:")==-1){
            data.url = context_path + data.url;
        }

        data.start_position_str = formData["position_str"] ||
        this.params["start_position_str"] || data.start_position_str ;

        if (this.params["position_str"]) {
            data.position_str = this.params["position_str"];
        }
        //BUG #6545  //BUG #6546
        //BUG #6728
        data.hasPage = Boolean(this.params["hasPage"]!=undefined||this.params["hasPage"]!=null?this.params["hasPage"]:data.hasPage);
        
        data.positionArr.push(data.start_position_str);
        
        this.postData = data;
        var _this = this ;
		this.ths = this.el.find("th");
		//关于普通请求的部分
        if(this.params['simpleRequest'] == true){
        	this.simpleRequest = true;
        }
        
        if(data.url && data.autoLoad == true){
            _this.loadByForm.call(_this);
        }
        //点击事件和双击事件
//        this.rowclick = this.table.attr("rowclick");
//        this.rowdblclick = this.table.attr("rowdblclick");
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
        
        if(this.params['selectModel']=='muti' || this.params['selectModel']=='multi'){
        	this.mutiSelect = true;
        }
       	//关于字典项目的翻译功能。
		this.ths.each(function(index,th){
			var hidden = th.attributes["hidden"];
			th=$(th);
			var dictName = th.attr("dictName"),
				itemscolNo = th.attr('colno'),
				staticDict=undefined;
			var tempStaticDict=undefined,buttons=undefined;
			if(itemscolNo){
				tempStaticDict = _this.params.items[itemscolNo -1].items;
				buttons = _this.params.items[itemscolNo -1].buttons;
			}
			
			if(hidden!=null && hidden!=undefined && hidden.value == true.toString()){
				th.hide(); 
			}
			if(dictName){
				staticDict = {};
				//先把dict解析出来，避免重复查找dom
				var lis = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li");
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');
					var key = li.attr('key');
					staticDict[key] = label;
				});
			}else if(tempStaticDict){
				staticDict = {};
				$(tempStaticDict).each(function(idx,item){
					
					staticDict[item[_this.keyAttr]] = item[_this.valueAttr];  //bug 6797
				});
			}
			th.data('staticDict',staticDict);
			th.data('buttons',buttons);
		});

		
		
		this.selecteds = [];
		if(this.params.data){     //如果querytable是通过data属性来加载数据（同grid的方式）zhangsu
			  this.dictTrans();
			  this.initEvents();
			  this.hiddenColumns();
			  this.lastList = this.params.data;
			  
			  //BUG #7852 9802静态数据---querytable的datafilter 事件不能执行
			  this.doDataFilter(this.params.data);
		}
		 
        		
		this.el.find('.h_querytable_select_all').change(function(){
			if(this.checked){
				_this.selectAll();
			}else{
				_this.unSelectAll();
			}
		});
		
		//表格列是否可以拖动，默认不拖动
		if(this.params.isDragColumn){
			if(this.params.name&&this.params.name!=""){
				$("."+this.params.name).resizableColumns({});
			}
		}
    },
    customEvents : "rowclick,rowdblclick",
    getEventTarget : function() {
    	return this.el;
    },
    
    /**
     * @private
     * @ignore
     */
    stateTest : function(){
    	var _this = this;
		var checkAll = true;
		_this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		if(!$(checkbox).prop("checked")){
    			checkAll = false;
    		}
    	});
		if(checkAll){
			_this.el.find('.h_querytable_select_all').prop("checked", true);
		}else{
			_this.el.find('.h_querytable_select_all').prop("checked", false);
		}
    },
    /**
     * @private
     * @ignore
     */
    initEvents : function(){
    	var _table = this.el;
    	var _tbody = _table.children('tbody');
    	var _this = this;
    	var isCheckbox = _this.el.find('.h_querytable_select_all').length>0?true:false;
	    if(isCheckbox){
			this.el.find('.h_querytable_select').change(function(){
				_this.stateTest();
			});
	    }	
        if(this.rowSelect == true){
        	_tbody.children('tr').each(function(i,tr){
    		    var rowidx = i;
    		    var _tr = $(tr),
    		    checkbox = _this.mutiSelect?_tr.find("input:checkbox.h_querytable_select"):_tr.find("input:radio.h_querytable_select")//BUG #6574
    		;
    		var _clickFlag=this.clickFlag;
    		_tr.bind('click',function(e) {    //BUG #6562
    			clearTimeout(_clickFlag);
    			_clickFlag=setTimeout(function(){
    				if($.isEmptyObject(_this.selecteds)){
        				_this.selectRow(rowidx, _tr);
        			}else{
        				if(!_this.selecteds.hasOwnProperty(rowidx)){
        				    _this.selectRow(rowidx, _tr);
    					 }else{
    						 _this.unSelectRow(rowidx, _tr);
    					 }
//        				if(_this.lastSelect&&_this.lastSelect.rowidx != rowidx){
//        					 if(!_this.selecteds.hasOwnProperty(rowidx)){
//            				    _this.selectRow(rowidx, _tr);
//        					 }else{
//        						 _this.unSelectRow(rowidx, _tr);
//        					 }	 
//            			}else{
//            				_this.unSelectRow(rowidx, _tr);
//            			}
        			}
    				if(isCheckbox){
            			_this.stateTest();
    				}
    			},10);
    			
    		 });
    		
    		/*
    		    _tr.toggle(function(){
    		    	_this.selectRow(rowidx,_tr);
    		    },function(){
    		    	_this.unSelectRow(rowidx, _tr);
    		    });
    		    */
            });
        }
    },
    /**
     * @private
     * @ignore
     */
    hiddenColumns : function(){
    	var trs = this.el.children('tbody').children('tr');
    	var ths = this.ths;
    	
    	ths.each(function(thidx,thdom){
    		var th = $(thdom);
    		//隐藏列
    		var hidden = thdom.attributes["hidden"];
    		if(hidden!=null && hidden!=undefined && hidden.value == true.toString() ){
    			th.hide(); 
    			//trs each
    	    	trs.each(function(tridx,trdom){
    	    		var tr = $(trdom);
    	    		var tds = tr.find('td');
    	    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    	    			var td = $(tds[tdidx]);
    	    			if(thidx == tdidx){
    	    				td.hide();
    	    				break;
    	    			}
    	    		}
    	    	});
    		}
    	});
    	
    },
    /**
     * @description 根据form中的查询条件参数查询数据，需要配置属性bindFormName才能生效,内部会将绑定表单的数据做为查询条件通过load进行处理
     * @function
     * @name Horn.QueryTable#loadByForm
     */
    loadByForm : function(){
        var params = {} ;
        if(this.form && this.form.length){
            params = this.form.serializeArray() ;
        }
        this.load(params) ;
    },
    /**
     * @description 设置QueryTable向后台发送请求时的用户自定义参数，被设置的参数会做为基础查询条件，但是当调用loadByForm或者load时使用的查询参数会覆盖baseparam中的已有查询参数<br/>
     * 说明：<br/>
     * 如果baseparams={"name":"zhansan","age":1}<br/>
     * 使用load或者loadByForm的参数为{"name":"lisi","addr":"123"}<br/>
     * 最终应用的请求参数为{"name":"lisi","age":1,"addr":"123"}
     * @function
     * @name Horn.QueryTable#setBaseParams
     * @params {Json}  params 自定义参数
     */
    setBaseParams:function(params){
    	 if(params){
    		 this.postData.baseparams=params;
    	 }else{
    		 this.postData.baseparams={};
    	 }
    	 
//        Horn.apply(this.postData.baseparams,params) ;
    },
    /**
     * @description 根据传入的参数查询数据,此方法调用会影响已存在的查询条件（如loadbyForm产生的查询条件，但不影响baseparams）原有的查询条件会被覆盖，且如果为空会清空原来的查询条件；
     * @function
     * @name Horn.QueryTable#load
     * @param {Json} params   传入的查询条件参数 (可选) 
     */
    load : function(params){
        var data = this.postData ;
        if(params){
            if($.type(params)=="array"){
                data.params = Horn.Util.arr2Obj(params) ;
             // Horn.apply(data.params,data.baseparams) ;  BUG #6598
            }
            else{
                data.params = params ;
            }
        }
        else{
            data.params = {} ;
        }
        this.goPage(this.INDEX_PAGE);
    },
    INDEX_PAGE:1,
    /**
     * @description 下一页,基于已有的查询条件查询下一页
     * @function
     * @name Horn.QueryTable#nextpage 
     */
    nextpage : function() {
        this.goPage(this.postData.index +1 );
    },
    /**
     * @description 上一页,基于已有的查询条件查询上一页
     * @function
     * @name Horn.QueryTable#prevpage
     */
    prevpage : function() {
        this.goPage(this.postData.index -1);
    },
    /**
     * @description 第一页,基于已有的查询条件查询第一页
     * @function
     * @name Horn.QueryTable#firstpage
     */
    firstpage : function() {
        this.goPage(this.INDEX_PAGE);
    },
    /**
     * @description 刷新页面,基于已有的查询条件刷新当前页
     * @function
     * @name Horn.QueryTable#refreshpage
     */
    refreshpage : function() {
        this.ajaxRequest();
    },
    /**
     * @ignore
     * @description 跳到指定页,基于已有的查询条件查询指定页
     * @function
     * @name Horn.QueryTable#goPage
     * @param {int} page
     */
    goPage : function(page){
    	if(page < this.INDEX_PAGE ) page = this.INDEX_PAGE;
    	this.postData.index = page;
    	this.ajaxRequest(this.el);
    },
    /**
     * @ignore
     */
    ajaxRequest : function() {
        var _this = this,
	        table = this.el,
	        data = this.postData,
	        positionArr = data.positionArr,
	        tbody = table.children("tbody") ,
	        params = data.params;
        //BUG #6598
       // Horn.apply(params,data.baseparams) ;
        //BUG #6876
        params=$.extend({},data.baseparams,params);
        
        //BUG #6545
        params["hasPage"] = data.hasPage;
        // 重新设置定位串
		if (params != null ) {
				//params[data.position_str] = positionArr[data.index]|| data.start_position_str;
			params["position_str"] = positionArr[data.index]|| data.start_position_str;	//STORY #8367
			params.request_num = data.request_num
						+ (this.simpleRequest ? 0 : 1);
		}
		//if (this.simpleRequest) {
			params.index = data.index;
		//}
		var colLength = this.ths.length;
		//BUG #6729 ,不分页的时候不需要这些参数
		if(params["hasPage"]==false){
			//delete params.request_num;
		}
		var bindformname = this.params["bindformname"] ;
        if(!bindformname){
        	bindformname = this.params["bindFormName"] ;
        }
        if(bindformname){
            var serValues = $("form[name="+bindformname+"]").serializeArray();
        	var formValues = Horn.Util.arr2Obj(serValues) ;
        	$.each(formValues, function (name, value) {
       		 	params[name] = value;
            });
        }
        $.ajax(data.url,
            {
                async : true,
                beforeSend : function(xhr) {
                    tbody.html("<tr><td colSpan='"
                        + colLength
                        + "'><p class='h_loading'>正在加载</p></td></tr>");
                },
                type : data.requestMethod,
                data : Horn.Util.obj2Arr(params) ,
                dataType : "json",
                error : function(xhr, textStatus, errorThrown) {
                    var status = xhr.status;
                    tbody.html(
                        "<tr><td colSpan='" + colLength
                            + "'><p>请求失败</p><p>错误状态："
                            + status + "；错误信息："
                            + textStatus
                            + "</p></td></tr>");
                },
                success : function(reqData, textStatus, jqXHR) {
                    _this.callback.call(_this, _this.doDataFilter(reqData));
                    _this.doCallBack(reqData);
                    _this.lastSelect = null;
                    _this.selecteds = {};
                }
            });

    },
    doDataFilter:function(reqData){
        var table = this.table;
        var datafilter = this.params["datafilter"];    //story9802 
        if(datafilter){
            var datafilterOjb = Horn.Util.getFunObj(datafilter);
            if(datafilterOjb && $.type(datafilterOjb.fn) == "function"){
                reqData = datafilterOjb.fn.call(this,reqData);
            }
        }
        return reqData;
    },
    doCallBack:function(reqData){
        var table = this.table;
        var callback = table.attr("callback");
        if(callback){
            var callBackOjb = Horn.Util.getFunObj(callback);
            if(callBackOjb && $.type(callBackOjb.fn) == "function"){
                callBackOjb.fn.call(this,reqData);
            }
        }
        $('.h_screen').height('auto');
        setTimeout(function(){
        	if(window.doLayout){
        		window.doLayout();
        	}
        },1000);
        this.dictTrans();
    },
    /**
     * @ignore
     */
    callback : function(reqData) {
//        if(!reqData){
//            reqData=[] ;
//        }
    	reqData = reqData || {total:0,rows:[]};
    	if ($.type(reqData) == "array") {
    		reqData = {rows:reqData};
    	}
    	
    	var list = reqData.rows;
        var table = this.table;
        var gridName = table.attr("name");
        var _this = this;
        var htmlArr = [];
//        var returndata = reqData;
        var ths = this.ths;
        var colLength = ths.length;
        var isSuccess = false;
        var data = this.postData;
//        var list = reqData;
        this.lastList = list;
        this.selecteds=[];
        this.lastSelect={};
        this.el.find('.h_querytable_select_all').prop("checked", false);
        table.css("height", "auto");
        if (list && list.length > 0) {
            data.list = list.slice(0,data.request_num);
            isSuccess = true;
            for ( var i = 0; i < list.length; i++) {
                var itemData = list[i];
                htmlArr.push("<tr>");
                ths.each(function(index, o) {
                    var th = $(o);
                    if(th.hasClass("h_numbercolumn")){
                    	htmlArr.push("<td>"+(i+1)+"</td>");
                    	return;
                    }else if(th.hasClass("h_querytable_checkboxcolumn")){
                    	htmlArr.push("<td><input type=\"checkbox\" class=\"h_querytable_select\"/></td>");
                    	return;
                    }else if(th.hasClass("h_querytable_radioboxcolumn")){//BUG #6574
                    	// STORY #12627 【TS:201508200177-JRESPlus-内部客户-蔡乃涛-一.<br>radiobutton的定位显示问题 一个页面有两个以上的grid时有问题，所以name要加上gridName来区分是哪个gird对象
                    	htmlArr.push("<td><input type=\"radio\" class=\"h_querytable_select\" name=\"_querytable_row_checker_"+gridName+"\"/></td>");//STORY #8454 
                    	return;
                    }
                    
                    var name = th.attr("name");
                    var dealFun = th.attr("dealFun");
                    htmlArr.push("<td><div style='overflow: visible;white-space: normal;word-wrap:break-word; word-break:break-all'>");
                    if (dealFun) {
                        var dFun = eval("(window." + dealFun + ")") ;
                        if($.type(dFun) == "function"){
                            // 提供个性化处理元素数据的js方法
                            htmlArr.push(dFun(itemData[name],itemData, list,i,index));
                        }
                    } else {
                        //16542 【TS:201601150495-JRESPlus-经纪业务事业部-张小攀-5.query_table和datagrid数据格式化不统一】
                        var value=itemData[name];
                        var dataType = th.attr("dataType");
                        var format = th.attr("format");
                        if(dataType && dataType !=null){
						   	   value = Horn.Util.Format.all(dataType,format,value);
						   }
                        htmlArr.push(value);
                    }
                    htmlArr.push("</div></td>");
                });
                htmlArr.push("</tr>");
                if (i == data.request_num - 1) {
                    // 当页已满
                    data.positionArr[data.index + 1] = itemData[data.position_str];
                    break;
                }
            }
        } else if (reqData.errorInfo || reqData.err_info) {
            data.list = [];
            var errorInfo=reqData.errorInfo||reqData.err_info;
            htmlArr.push("<tr><td colspan='" + colLength + "'>");
            htmlArr.push("<p>" + errorInfo + "</p>");
            htmlArr.push("</td></tr>");
        } else {
            data.list = [];
            htmlArr.push("<tr><td colspan='" + colLength + "'>");
            htmlArr.push("<p>没有查询到数据</p>");
            htmlArr.push("</td></tr>");
        }
        var tbody = table.children("tbody");
        tbody.html(htmlArr.join(""));
        //为表格添加高度属性 16444 【TS:201601130123-JRESPlus-经纪业务事业部-张小攀-【项目名称】UF3.0<br>【产品及版本信息】jrespl】
        var h_listtable=table.parent(".h_listtable");
        var h_head=table.parent(".h_listtable").parent(".g-datagrid-wrap").children(".u-datagrid-header");
        var h_page=table.parent(".h_listtable").parent(".g-datagrid-wrap").children(".u-datagrid-page");
        var h_body=table.parent(".h_listtable").parent(".g-datagrid-wrap").parent(".m-panel-body");
        if(this.params["height"] && this.params["height"] != null){
        	var tableHeight=parseFloat(this.params["height"]);
        	if(!isNaN(tableHeight)){
        		h_listtable.css("height",tableHeight);
        	}
        }
        if(this.params["width"] && this.params["width"] != null){
        	var tableWidth=parseFloat(this.params["width"]);
        	if(!isNaN(tableWidth)){
        		h_listtable.css("width",tableWidth);
        		h_head.css("width",tableWidth);
        		h_page.css("width",tableWidth);
        		h_body.css("width",tableWidth+22);
        	}
        }
        // 增加效果
        if (isSuccess) {
            // 默认样式
            tbody.children("tr:odd").addClass("u-table-bg");
            // ** 鼠标滑动事件
            // tbody.children("tr").hover(function() {
            //     $(this).addClass("u-table-selected");
            // }, function() {
            //     $(this).removeClass("u-table-selected");
            // });
            // 表格单击,双击事件
            var rowClickObj =undefined;
            var rowDBLClickObj =undefined;
            var rowClickFn=undefined;
            var rowDBLClickFn=undefined;
            if (this.rowclick) {
                rowClickObj = Horn.Util.getFunObj(this.rowclick);
                if($.type(rowClickObj.fn) == "function"){
                    rowClickFn = rowClickObj.fn ;
                }
            }
            if(this.rowdblclick){
                rowDBLClickObj = Horn.Util.getFunObj(this.rowdblclick);
                if($.type(rowDBLClickObj.fn) == "function"){
                    rowDBLClickFn = rowDBLClickObj.fn ;
                }
            }
            if (rowClickFn || rowDBLClickFn) {
                var trs = tbody.children("tr");
                var _clickFlag=this.clickFlag;
                for ( var i = 0; i < data.list.length; i++) {
                    var tr = $(trs.get(i));
                    if(rowClickFn){
                        var params = rowClickObj.params.slice(0);
                        params.push(data.list[i], data.list);
                        tr.bind('click',params, function(e) {
                            var p = e.data ;
                            var _this=this;
                            clearTimeout(_clickFlag);
                            _clickFlag=setTimeout(function(){
                            	return rowClickObj.fn.apply(_this,p);
                            },300);
                           // return rowClickObj.fn.apply(this,p);
                        });
                    }
                    if(rowDBLClickFn){
                        var params = rowDBLClickObj.params.slice(0);
                        params.push(data.list[i], data.list);
                        
                        tr.bind('dblclick', params,function(e) {
                        	clearTimeout(_clickFlag);
                            var p = e.data ;
                            return rowDBLClickObj.fn.apply(this,p);
                        });
                    }
                }
            }
          //增加rowselect hidden
            this.initEvents();
    		this.hiddenColumns();
        }
        
        //table.css("height", table.css("height"));
        
        if (data.hasPage) {
            // 开始生成分页链接
        	
    	
            var pageArr = [];
            pageArr.push('<ul class="m-pagebar">');
            if (data.index > _this.INDEX_PAGE) {
            	pageArr.push('<li><a href="javascript:void(0)"  class="h_page-first first_page_btn" title="首页"><i class="fa fa-step-backward"></i></a></li>');
            	pageArr.push('<li><a href="javascript:void(0)" class="h_pagebtn-prev h_page-pgLast pre_page_btn" title="上一页"><i class="fa fa-caret-left"></i></a></li>');
            } else {
            	pageArr.push('<li><a href="javascript:void(0)"  class="disabled first_page_btn" title="首页"><i class="fa fa-step-backward"></i></a></li>');
            	pageArr.push('<li><a href="javascript:void(0)" class="disabled pre_page_btn" title="上一页"><i class="fa fa-caret-left"></i></a></li>');
               
            }
           
            
            if(this.simpleRequest){
            	if (list != null && (list.length +1) > data.request_num) {
	                pageArr.push('<li><a href="javascript:void(0)" class="h_page-pgNext next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
	            } else {
	            	pageArr.push('<li><a href="javascript:void(0)" class="disabled next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
            	}
            }else{
	            if (list != null && list.length > data.request_num) {
	            	pageArr.push('<li><a href="javascript:void(0)" class="h_page-pgNext next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
	            } else {
	            	pageArr.push('<li><a href="javascript:void(0)" class="disabled next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
            	}
            }
            pageArr.push('<li><a href="javascript:void(0)" class="h_page-refresh refresh_btn" title="刷新"><i class="fa fa-refresh"></i></a></li>');
            pageArr.push('</ul>');
            var total_num = reqData.total; var pageIndex = this.postData.index;
            if (total_num != undefined) {
            	var pagesnum = Math.ceil(parseInt(total_num) / parseInt(data.request_num));
            	pageArr.push('<div  class="m-pagebar-all">共'+pagesnum+'页,共'+total_num+'条记录,当前第'+pageIndex+'页</div>');
            }
            var page = table.parent(".h_listtable").next("div.u-datagrid-page").children(".h_querytable_pages").html(pageArr.join(""));
//            table.next("div.h_pages").html(pageArr.join(""));
            // 增加事件
//            var page = table.next("div.h_pages");
            
            
            page.children("ul").children("li").children("a.h_page-first").click(function(e) {
                return _this.firstpage.call(_this, table, e);
            });
           page.children("ul").children("li").children("a.h_page-pgLast").click(function(e) {
                return _this.prevpage.call(_this, table, e);
            });
           page.children("ul").children("li").children("a.h_page-pgNext").click(function(e) {
                return _this.nextpage.call(_this, table, e);
            });
            page.children("ul").children("li").children("a.h_page-refresh").click(function(e) {
                return _this.refreshpage.call(_this, table, e);
            });
        }
       this.resetTdContent();
    },
    /**
     * @ignore 
     * @description 加载数据集中的数据
     * 将该数据集中的数据展现在表格中，不发送请求
     * @function
     * @name Horn.QueryTable#loadData
     * @param {Array} reqData 数据集
     */
    loadData:function(reqData){
        this.callback(reqData);
        this.doCallBack(reqData);   //BUG #6532
    },
    /**
     *重置列展示内容,如果字段大于60个字符，就把内容放到文本域中
     * @ignore
     */
    resetTdContent : function(){
    	var _this = this;
    	var trs = this.table.children('tbody').children('tr');
    	var headtrs = this.table.children('thead').children('tr');
    	var rows = [];
    	trs.each(function(tridx,trdom){
    		var tr = $(trdom);
    		var tds = tr.find('td');
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdWidth = td.attr("width");
    			var tdDiv = td.children("div");
    			var text =td.text();
    			var itemW = headtrs.find('th:eq('+tdidx+')').attr("width");
    			if(itemW){
    				var width = itemW.replace("px","").replace("PX","");
    				tdDiv.css("width",width);
    			}
	    		if(_this.getStrlen(text)>40){
	    			if(rows.indexOf(tdidx)==-1){
	    				rows.push(tdidx);
	    			}
	    			tdDiv.css("width",300);
	    			td.css("width",300);
	    		}
    		}
    	});
    	
    },
    getStrlen:function(str){//一个中文相当于两个字符
    	var num = 2;
        var len = 0;
        for (var i=0; i<str.length; i++) { 
	         var c = str.charCodeAt(i); 
	         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
	           len++; 
	         }else{ 
	    		len+=num; 
	         } 
        }
        return len;
    },
    /**
     * @ignore
     * @description 当某行被引用时会触发此事件。
     * @event
     * @name Horn.QueryTable#onRowSelect
     * @param {DOMDocument} tr 当前选择的行
     * @param {int} rowidx 行号
     * @param {object} vals 行数据
     */
    onRowSelect:function(){},
    /**
     * 所有被选中值
     * @ignore
     * @type {Array}
     */
    selecteds:null,
    /**
     * @description 选择所有行。
     * @function
     * @name Horn.QueryTable#selectAll
     */
    selectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx);
    		}
    	});
    	this.el.find('.h_querytable_select_all').prop("checked", true);
    },
    /**
     * @ignore
     * @description 清除选择。
     * @function
     * @name Horn.QueryTable#unSelectAll
     */
    unSelectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx);
    		}
    		   
    	});
    	this.el.find('.h_querytable_select_all').prop("checked", false);
    },
    /**
     * @ignore
     * @description 单选时最后选择的项目
     * @field
     * @name Horn.QueryTable#lastSelect
     * @default null
     */
    lastSelect:null,
    /**
     * @ignore
     * @description 是否多选
     * @field
     * @name Horn.QueryTable#mutiSelect
     * @default false
     */
    mutiSelect:false,
    /**
     * @description 选择某行
     * @function
     * @name Horn.QueryTable#selectRow
     * @param {int} rowidx  行索引
     * @param {JQuery} tr (可选)
     * @ignore
     */
    selectRow:function(rowidx,_tr){
    	var _table = this;
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	if(tr.length==0){
    		Horn.debug("querytable["+this.name+"]","选择的行"+rowidx+"不存在");
    		return false;
    	}
    	var vals = {};
		var ths = this.ths;
		var tds = tr.find('td');
		ths.each(function(thidx,_th){
			var td = tds.get(thidx),
				th = $(_th);
			vals[th.attr('name')] = th.attr('dictName') ? $(td).attr('key') :$(td).text();
		});
		_table.onRowSelect.call(tr,tr,rowidx,vals);
		this.selecteds[rowidx] = vals;
		if(!_table.mutiSelect) {
			var last = _table.lastSelect;
			if(last && last.rowidx !==undefined && last.rowidx != rowidx ){
				if(last.tr.find("input:radio").length>0){
					last.tr.find("input:radio").get(0).checked = false;//BUG #6574
				}
				_table.unSelectRow(last.rowidx,last.tr);
			}
			if(tr.find("input:radio").length>0){
				tr.find("input:radio").get(0).checked = true;   //选中radio//BUG #6574
			}
			
		}else{
			if(tr.find("input:checkbox").length>0){
				tr.find("input:checkbox").get(0).checked = true;   //选中checkbox
			}
			
		}
		_table.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		tr.addClass("u-table-selected");//选中行的样式
    },
    /**
     * @description 取消某行的选择
     * TODO 这里尚有些不成熟的地方，需要取消选择项的勾。
     * @function
     * @name Horn.QueryTable#unSelectRow
     * @param {DOMDocument} rowidx
     * @param {DOMDocument} tr 
     * @ignore
     */
    unSelectRow:function(rowidx,_tr){
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	this.selecteds[rowidx] =null;
    	delete this.selecteds[rowidx];
    	tr.removeClass("u-table-selected");//取消选中行的样式
    	if(this.mutiSelect){
    		if(tr.find("input:checkbox").length>0){
    			tr.find("input:checkbox").get(0).checked = false;   //取消选中checkbox
    		}
    	}else{
    		if(tr.find("input:radio").length>0){
    			tr.find("input:radio").get(0).checked = false;     //取消单选radio//BUG #6574
    		}
    	}
    	//所有的选择项都取消后应该设置选择所有的checkbox为false
    	var _isNull=true;
    	for(var _name in this.selecteds){
    		_isNull=false;
    		break;
    	}
    	if(_isNull){
    		this.el.find('.h_querytable_select_all').prop("checked", false);
    	}
    },
    /**
     * @description 获取所有的选择项
     * @function
     * @name Horn.QueryTable#getSelecteds
     * @param {boolean} asSrcData(请求返回的原始数据)，如果为true，则返回的是原始数据，如果不传或为false，则是表格内显示的数据；
     * @return {Array} 返回选中的行数据
     */
    getSelecteds:function(asSrcData){
    	var selecteds = [];
    	if($.type(this.selecteds)=="array"){
    		for(var i=0;i<this.selecteds.length;i++){
        		var val = this.selecteds[i];
        		if(val){
        			selecteds.push(asSrcData?this.lastList[i]:val);
        		}
        	}
    	}else{
    		for(var key in this.selecteds){
        		var val = this.selecteds[key];
        		if(val){
        			selecteds.push(asSrcData?this.lastList[key]:val);
        		}
        	}
    	}
    	return selecteds;
    },
    /**
     * @ignore
     * 翻译字典 
     */
    dictTrans:function(){
    	var _table = this,
    		ths = this.ths,
    		trs = this.el.find("tr");
    	trs.each(function(idx,trdom){
    		var tr = $(trdom),
    			checkbox = _table.mutiSelect?tr.find("input:checkbox"):tr.find("input:radio")//BUG #6574
    		;
    		if(checkbox.hasClass('h_querytable_select')) { 
    			if(_table.rowSelect == false){           //BUG #6562 
	    			checkbox.change(function(){
		    			if(this.checked){
		    				_table.selectRow(idx-1,tr);
		    			}else{
		    				_table.unSelectRow(idx-1,tr);
		    			}
		    		});
    			}	
    		}
    		tr.find('td').each(function(tdidx,tddom){
    			var td = $(tddom);
    			var th = $(ths.get(tdidx));
	    		var dictName = th.attr("dictname"),
	    			renderer = th.attr('renderer'),
	    			buttons = th.data('buttons'),
	    			staticDict = th.data('staticDict');
	    		if( staticDict ){                    
	    			//17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
	    			if(text=="" || staticDict[td.text().trim()]== undefined){
						td.text("");
						td.attr("title","");
					}else{
						td.attr("key",td.text());
	    				td.text( staticDict[td.text()] || td.text());
					}
	    		}else if(buttons){
	    			var btns = buttons;
	    			var span = $("<span></span>");
	    			$(btns).each(function(idxx,btn){
	    				var fn = Horn.Util.getFunObj(btn.event);
	    				//如果没有这个function，则不装入这个button
	    				if(!fn.fn) return;
	    				var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>");
	    				var text = td.text();
	    				a.click(function(){
	    					fn.fn.call(a,{
	    	    				val : text,
//	    	    				rowdata : _table.data[idx-1],
//	    	    				alldata : _table.data,
//	    	    				table : _table,
	    	    				rowidx : idx,
	    	    				tdidx : tdidx,
	    	    				tr : tr,
	    	    				td : td
	    	    			});
	    				});
	    				span.append(a);
	    				if(idxx!=(btns.length-1)){
	    					span.append(' | ');
	    				}
	    			});
//	    			if(showwhenover){ 
//	    				span.addClass('h_link-default');
//	    			}
	    			td.html('');
	    			td.append(span);
	    		}
	    		if(renderer){
	    			td.attr('key',td.text());
	    			var text = td.text();
	    			var fn = Horn.Util.getFunObj(renderer);
    				//如果没有这个function，则不装入这个button
    				if(!fn.fn) return;
	    			var dom = fn.fn.call($(this),{
	    				val : text,
//	    				rowdata : _table.data[idx-1],
//	    				alldata : _table.data,
//	    				table : _table,
	    				rowidx : idx,
	    				tdidx : tdidx,
	    				tr : tr,
	    				td : td
	    			});
	    			if( dom instanceof $ ){
	    				td.html("");
	    				td.append(dom);
	    			}else{
	    				td.html(dom);
	    			}
	    		}
    		});
    	});
    }
}) ;
/**
 * @lends Horn.QueryTable
 */
$.extend(Horn.QueryTable,{
	DATANAME : "QUERYTABLE",
	/**
	 * @ignore
	 * @description 根据名字获取页面table控件
     * @function
	 * @name Horn.QueryTable.get
	 */
	get : function(name){
		var table = null ;
		if(name){
			table = Horn.getComp(name);
		}
		else{
			table = Horn.data(Horn.QueryTable.DATANAME)[0] ;
		}
		return table ;
	}
}) ;
Horn.regUI("table.h_querytable",Horn.QueryTable) ;
/*
 * 修改日期         修改人员        修改说明
 * -----------------------------------------------------------------------
 *  2014-4-18    周智星    BUG #6440 【form】各个表单组件的校验提示不统一
 *  2014-4-22    周智星    BUG #6792 【radiogroup】【checkboxgroup】radiogroup、checkboxgroup的validate方法无效
 *  2014-4-29    周智星    showError方法性能优化。如果提示框已经存在，就不在创建提示框
 *  2014-4-29    周智星    BUG #6912 【radio_group】在IE7下验证的错误提示信息显示的位置很远 
 *  2014-5-23    吴席林    需求 #8363 {jresplus}[ui]-radioGroup组件配置onchange事件后，各浏览器兼容性有问题，IE无效
 *  2015-9-24    周智星   需求13293--radiogroup在form表单清空后，触发校验时，校验提示错位
 *  2015-10-10   周智星    需求13519--radiogroup，checkboxGroup，combox控件在from中，使用Horn.getComp(&quot;name&quot;).setValues({key1;:0});赋值无法成功
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.RadioGroup   
 * @class
 * 单选框组组件</br>
 */

/**
 * @lends Horn.RadioGroup#
 */

/**
 * 组件的静态字典列表<br/>
 * 数据项不易过多（一行内可以完整显示），否则会导致换行显示影响美观，如果需要显示更多的项，可以考虑使用combox组件
 * @name Horn.RadioGroup#<b>items</b>
 * @type Array[JSON]
 * @default  
 * @example
 * "items":[{"label":"a","value":"a1"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]
 */

/**
 * 组件的动态字典名字
 * @name Horn.RadioGroup#<b>dictName</b>
 * @type String
 * @default 无
 * @example
 * 无
 */

/**
 * 组件唯一标识
 * @name Horn.RadioGroup#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.RadioGroup#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.RadioGroup#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.RadioGroup#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.RadioGroup#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.RadioGroup#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.RadioGroup#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.RadioGroup#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的panel的cols而定(支持1-4列)
 * @name Horn.RadioGroup#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项（注：只针对required起效，不支持自定义校验）
 * @name Horn.RadioGroup#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.RadioGroup#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */
/**
  * 是否隐藏组件
  * @name Horn.RadioGroup#hidden
  * @type Boolean
  * @default false
  * @example
  * #radiogroup({"name":"test14","label":"radiogroup","defValue":"1", "dictName": "country", "cols":1, "check": "required","hidden":true})
  */
/**
 * 事件配置
 * 支持的事件列表：
 * onchange   radiogroup改变值时发生  事件参数： 无    
 * @name Horn.RadioGroup#<b>events</b>
 * @type Array
 * @default 
 * @example
 * "events":[{"event":"onchange","function":"getValue()"}]
 */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.RadioGroup#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.RadioGroup#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.RadioGroup#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.RadioGroup#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.RadioGroup#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.RadioGroup#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.RadioGroup#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.RadioGroup#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.RadioGroup#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.RadioGroup#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.RadioGroup#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.RadioGroup#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.RadioGroup#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.RadioGroup#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.RadioGroup#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.RadioGroup#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.RadioGroup#validate
 */



	Horn.RadioGroup = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"RadioGroup",
	    radios : null ,
	    name : null,
	    alias : null,
	    checkRegx : [],
	    init : function() {
	        Horn.RadioGroup.superclass.init.apply(this,arguments);
	        this.radios = this.el.find("input[type='radio']");
	        this.name = this.el.attr('name');
	        this.alias = this.el.attr('alias')||"";
	        //this.defValue=(this.params.defValue != undefined)?this.params.defValue:this.getValue();
	        if(this.params.check && this.params.check.indexOf("required") > -1){
	        	this.checkRegx =[Horn.Validate.REQUIRED];
	        }
            if(this.params.value) {
            	this.setValue(this.params.value);
            }
//            if(this.params.readonly) {
//            	this.setReadonly(true);
//            }
            if(this.params.disabled) {
            	this.setDisabled(true);
            }
            this.defValue = this.params.defValue || this.params.value || "";
            var _this = this;
            var checkboxs = this.el.children("div").children("label").find('input:radio');
            checkboxs.each(function(idx,checkbox){
                $(checkbox).bind("click",function(){
                	var checkedboxs = _this.getValue();
                	var check = $(checkbox).attr(Horn.Validate.CHECK);
                    if(checkedboxs && checkedboxs!=""){
                    	_this.removeError();
                    	if (check&&check.indexOf(Horn.Validate.REQUIRED) > -1) {
                    		_this.el.addClass('m-verify-success');
                        }
                    }else{
                    	_this.showError();
                    	_this.el.removeClass('m-verify-success');
                    }
                })

            });
	    },
	    getEventTarget : function() {
	    	return this.el.children("div").children("label").find("input[type='radio']");
	    },
	    getValue:function(){
	        return this.radios.filter(":checked").val() || "";
	    },
	    setValue : function(value) {
	    	var radioGroup = this;
	    	var _radios = this.radios;
	    	// 需求13519--radiogroup，checkboxGroup，combox控件在from中，使用Horn.getComp(&quot;name&quot;).setValues({key1;:0});赋值无法成功
	    	value = value.toString();
	    	if (value == "") {
	    		this.radios.removeAttr("checked");
	    		//BUG #6440 【form】各个表单组件的校验提示不统一
	    		//this.isValid();
	    	} else if (this.radios.filter('[value="'+value+'"]').length > 0){
	    		if(this.radios.filter('[value="'+value+'"]').attr("disabled")){
	    			setTimeout(function(){
	    					_radios.attr("disabled","disabled");
	    					_radios.removeAttr("checked");
	    					_radios.filter('[value="'+value+'"]').prop("checked",true);
	    			},10);
	    		}else{
	    			_radios.removeAttr("checked");
					_radios.each(function(idx,comp){
						if($(comp).val() == value){
							$(comp).prop("checked", true);
						}
					})
	    		}
		    	
	    	}
			
			//设置新值之后重新校验
			this.validate();
		},
        clearValue : function() {
        	this.setValue("");
        },
	    setEnable : function(enabled) {
	    	var _this = this;
	    	this.radios.each(function(idx,comp){
				if (enabled === false) {
					$(this).attr("disabled", "disabled");
					//_this.removeError(_this);
					//_this.err = false;
				} else {
					$(this).removeAttr("disabled");
				}
			});
	    },
	    // 方法冗余
	    setDisabled : function(disabled) {
	    	var _this = this;
	    	if(disabled === true){
	    		_this.disabled = true;
	    	}else if(disabled === false){
	    		_this.disabled = false;
	    	}
	    	this.radios.each(function(idx,comp){
				if (disabled === true) {
					$(this).attr("disabled", "disabled");
					//_this.removeError(_this);
					//_this.err = false;
				} else {
					$(this).removeAttr("disabled");
				}
			});

	    },
    
	    /**
         * @ignore
         * @description  内容校验
         * @function
         * @name Horn.CheckboxGroup.validate
         * @ignore
         */
        validate : function(){
            this.isValid();
        },
		isValid : function(){
	    	var rs = true;
	    	var _this = this;
	        var name = this.name;
	        if(_this.disabled == true){
	        	return true;
	        }
	        if(this.checkRegx.length>0){
	        	var val = Horn.getComp(name).getValue();
	        	if(val==""){
	        		rs = false;
	        		this.showError(_this);
	        		
	        	}else{
	        		this.removeError(_this);
	        	}
	        }
			return rs;
		},
		showError : function(_this){
	
	        if(!this.msgDiv){
        		this.msgDiv = $('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');
        		this.el.after(this.msgDiv);
        	}
            var msg = this.msgDiv;
            msg.html("<div class=\"verify-tip-arrow\"></div><div class=\"verify-tip-inner\">当前单选选框不能为空</div>");
            msg.css("display", "block");
            _this.el.addClass('m-verify-error');
            _this.err = true;
		},
		removeError : function(_this){
			this.el.removeClass('m-verify-error');
			this.err = false;
        	var msg = this.msgDiv;
        	if(msg) msg.remove();
        	var lab = this.el.parent().parent(".g-unit-wrap").children(".unit-label");
           /* var red = $("span.m-verify-symbol", lab);
            if(red){
            	red.remove();
            }*/
        	delete this.msgDiv ;
		},
        reset : function() {
            this.setValue(this.defValue);
        },
        addRule : function(rule) {
        	if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
                var _this = this;
                var checkboxsWithRequired = _this.el.children("div").children("label").find('input:radio[check*=required]');
                if(checkboxsWithRequired && checkboxsWithRequired.size()>0){
                    return;
                }else{
                    _this.err = true;
                    this.checkRegx = rule.split(';');
                	var checkboxs = _this.el.children("div").children("label").find('input:radio');
                    checkboxs.each(function(idx,checkbox){
                    	var check = $(checkbox).attr(Horn.Validate.CHECK);
                        if (check) {
                            if (check.indexOf(rule) > -1) {
                                return;
                            }
                            check += Horn.Validate.CHECKSEP + rule;
                        } else {
                            check = rule;
                        }
                        $(checkbox).attr(Horn.Validate.CHECK, check);
                    });
                    if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
        	            var lab = this.el.parent().parent(".g-unit-wrap").children(".unit-label");
        	            var red = $("span.m-verify-symbol", lab);
        	            if (!red.length) {
        	                red = $("<span>", {
        	                    "class" : "m-verify-symbol",
        	                    "html" : "*"
        	                });
        	                lab.prepend(red);
        	            } else {
        	                red.html("*");
        	            }
        	            
        	        }
        	        //this.removeError();
        	        //this.field.removeClass('m-verify-success');
                }
        	}else{
        		return;
        	}
        },
        removeRule : function(rule) {
            var _this = this;
        	var checkboxs = _this.el.children("div").children("label").find('input:radio');
            checkboxs.each(function(idx,checkbox){
            	var check = $(checkbox).attr(Horn.Validate.CHECK);
                if (check && check.indexOf(rule) > -1) {
                    var checks = check.split(Horn.Validate.CHECKSEP);
                    checks = $.grep(checks, function(c, index) {
                        return c && c != rule;
                    });
                    $(checkbox).attr(Horn.Validate.CHECK, checks.join(';'));
                }
            });
            this.checkRegx = [];
            if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
            	this.el.removeClass('m-verify-success');
            	this.el.removeClass('m-verify-error');
	            var lab = this.el.parent().parent(".g-unit-wrap").children(".unit-label");
	            var red = $("span.m-verify-symbol", lab);
	            if(red){
	            	red.remove();
	            }
	            var msg = this.msgDiv;
	        	if(msg) msg.remove();
            }
            
        }
	});
Horn.Field.regFieldType("div.hc_radio-group",Horn.RadioGroup) ;

/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-2-14 		韩寅		     修改注释
 * 2014-4-16        周智星             BUG #6560 【combox】(继承)clearValue() 不会将组件回复到原始状态
 * 2014-4-16        周智星             BUG #6553 【combox】(继承)setValue() 设置无效值，依然会生效，但是getValue返回为""
 * 2014-4-16        周智星             BUG #6440 【form】各个表单组件的校验提示不统一
 * 2014-4-21                     周智星	   BUG #6798 【combox】设置disabled属性为true会造成js错误
 * 2014-04-22		hanyin	   BUG #6719 combo单选时，headItem的值不能在输入框中显示
 * 2014-04-22       周智星              BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
 * 20140423 		hanyin 		BUG #6809 【combox】多选模式下，value设置有值，通过键盘修改输入框的值，下拉不会选中，焦点移开然后获得焦点依然无法选中
 * 2014-04-25       周智星             BUG #6837 【combox】多选模式下，value设置有值，通过键盘增加输入框的值，所有已经设置的均应被选中
 * 2014-04-25      周智星             BUG #6861 【combox】多选模式下，按回退或者删除键，会把值清空
 * 2014-04-25      周智星            BUG #6839 【combox】在多选模式下无效的值任然可以设置成功
 * 2014-4-29       周智星           BUG #6904 【combox】单选模式下，不应该能输入非法值   BUG #6903 【combox】单选模式下，“请选择”不能删除
 * 2014-4-30       周智星          BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
 * 2014-4-30       周智星          BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
 * 2014-5-4        周智星           BUG #6904 【combox】单选模式下，不应该能输入非法值   BUG #6903 【combox】单选模式下，“请选择”不能删除
 * 2014-06-10      zhangsu   STORY#8487[经纪业务事业部/胡志武][TS:201406040187]-JRESPlus-ui-combox设置 delimiter="" 情况下，提交的值为空
 * 2014-08-05      王玉豹                 STORY #9025 [财富管理事业部-陈为][TS:201407230001]JRESPlus-ui--目前下拉控件如果是配置了数据字典的，可以通过方法调用获取所有数据 
 * 2014-08-05      王玉豹              STORY #9102 [财富管理事业部/陈凯][TS:201407240280]-JRESPlus-ui对于数据字典下拉框复选的情况，选择后显示的是值而不是名称 
 * *2014-08-11      王玉豹             STORY #9354 【TS:201408080099-JRESPlus-财富管理事业部-陈为- 把jresplusui升级到1.0.3之后，原先】 
 * 2014-08-19		王玉豹		STORY #9468 [研发中心/内部需求][JresPlus][UI]comboxt组件在必填状态下，先清空值，然后执行setValue()设置非空值后，校验信息依然存在。设置了非空值后，校验通过，校
 * 2014-08-19		王玉豹		STORY #9469 [研发中心/内部需求][JresPlus][UI]comboxt组件在必填状态下，无值的情况下丢失焦点，然后执行setValue()设置非空值后，校验信息依然存在。设置了非空值后，
 * 2014-08-26		王玉豹		STORY #9519 [经纪业务事业部-胡志武][【TS:201408250078]-JRESPlus-ui-下拉框未选择之前选择的值，下拉框为空，实际是有值的，见附件】 
 * 2014-08-29		王玉豹		解决多个combox在相同数据字典的情况下，选中一个后其他combox的下拉列表无法正常显示的问题
 * 2014-09-02		王玉豹		修改select的设置初始值逻辑，修复在全选条件下分隔符为空时值无法展示的问题
 * 2014-09-02		王玉豹		STORY #9624 [研发中心/内部需求][JresPlus][UI]-数据字典下拉后失丢焦点 再通过setvalue方法设置值，设置不成功 
 * 2014-09-11		王玉豹		STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
 * 2014-09-23 		王玉豹		STORY #9815 [研发中心/内部需求][JRESPLUS][UI][#7641]建议combox在enableFieldSearch属性为true跟false时，输入框输入的查询值处理方式一致 
 * 2014-09-24		王玉豹		STORY #9807 [研发中心/内部需求][Jresplus][UI]select组件模糊查询相关问题   改在有值获得焦点的时候不进行模糊查询这种情况 不支持IE9的问题
 * 2014-10-11		wangyb	修复window弹窗中使用combox会导致选择值之后无法显示的问题;修复window弹窗中使用combox，启用模糊查询后导致查询框移位的问题
 * 2014-10-11 		wangyb	STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
 * 2014-10-30		wangyb	兼容不同combox的相互级联的功能
 * 2014-12-22		wangyb10555	STORY #10587 [财富管理事业部/陈为][TS:201412180594]-JRESPlus-ui-三、对于模糊查询的下拉选择框，目前只支持搜索字典值（DICT】
 * 2015-10-30       周智星              需求14588 【TS:201510300215-JRESPlus-资产管理事业部-张翔-Combox多选时，先用ctr+A可以全选所有下拉选项，但是在此用ctr+A的时候就不能反选，会选中整个页面
 * 2015-11-02       周智星             需求   #14586 【TS:201510300214-JRESPlus-资产管理事业部-张翔-Combox添加了filterBy输入过滤属性，在输入框输入Combox添加了filterBy输入过滤属性，在输入框输入值，下选过滤，选中其中一条值，再选择之前输入的值还存在需要手动删除（多选和单选都存在该问题）
 * 2015-11-02       周智星            需求#14590 【TS:201510300216-JRESPlus-资产管理事业部-张翔-Combox多选配置filterBy输入过滤属性之后,Combox多选配置filterBy输入过滤属性之后，ctr+A全选所有下拉选项就不能用了
 * 2015-11-02       周智星            需求 #14584 【TS:201510300213-JRESPlus-资产管理事业部-张翔-Combox添加了filterBy属性之后再调用filter无效
 * 2015-11-10                   刘龙	              【开发】bug #12498 需求14674---一个sreen中设置showLable为true，combox为单选模式时，输入框中默认值，key与value显示距离过大 
 * 2015-11-06       周智星             //BUG #12450 需求14586--combox添加了filterby属性后，选中值后输入框无法实时显示
 * 2015-11-09       周智星            bug #12452 需求14586--combox添加了filterby属性后，模糊搜索后的数据无法选中
 * 2015-12-02       周智星          需求 #15004 【TS:201511230300-JRESPlus-资产管理事业部-张翔-4.文本框和下选框值长度过长（超过组件宽度）无法显示
 * 2016-3-4         刘龙             需求17370 【TS:201602230417-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br><br><br】
 * 2016-3-22        刘龙             bug#17110 单选模式下的combox设置value为item中不存在的值，通过getvalue获取值，会获取到value
 * -----------------------------------------------------------------------
 */

/**@lends Horn.Select# */

/**
 * 组件的唯一标示
 * @name Horn.Select#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的标签
 * @name Horn.Select#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Select#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 表单输入域的名称
 * @name Horn.Select#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
  /**
 * 是否可编辑，true代表可编辑，false代表不可编辑，输入框是只读的
 * @name Horn.Combox#<b>editable</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 表单输入域的别名，用在表单中存在相同name的情况下，可以通过别名来区分
 * @name Horn.Select#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 跨列数
 * @name Horn.Select#<b>cols</b>
 * @type String
 * @default "1"
 * @example
 * 无
 */
/**
 * 在第一展示的时候表单的初始值
 * @name Horn.Select#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 验证串
 * @name Horn.Select#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的可用状态，被设置为disabled的组件不会参与表单提交，也不能被点击下拉；"true"表示被禁用，"false"表示可用
 * @name Horn.Select#<b>disabled</b>
 * @type String
 * @default "false"
 * @example
 * 无
 */
/**
 * 选项头格式如:{"label":"","value":"请选择"}
 * @name Horn.Select#<b>headItem</b>
 * @type obj
 * @default 无
 * @example
 * 无
 */
/**
 * 静态显示值 格式："items":[{"label":"男", "pLabel":"0", "value":"1"},{"label":"女", "value":"2", "pLabel":"1"}] pLabel为当前节点的父节点编号
 * @name Horn.Select#<b>items</b>
 * @type ArrayObj
 * @default 无
 * @example
 * 无
 */
/**
 * 数据字典名
 * @name Horn.Select#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 是否多选，true表示多选，false表示单选
 * @name Horn.Select#<b>multiple</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 在初始化的默认就把下拉框中的内容全部选中
 * @name Horn.Select#<b>checkAll</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 多选时的显示分隔符
 * @name Horn.Select#<b>delimiter</b>
 * @type String
 * @default 
 * @example
 * 无
 */
 /**
  * 是否隐藏组件
  * @name Horn.Select#hidden
  * @type Boolean
  * @default false
  * @example
  * #select({"selectAll": false,"multiple": true, "name":"test133","label":"select","value":"3333","defValue":"1", "dictName": "province", "cols":1,"check": "required","multiple":true,"filterBy":"value","hidden":true})
  */
/**
 * 是否启用模糊查询功能,如果配制为true，则会自动去除readonly的配置并将field转换为可编辑的;</br>
 * 默认根据key和value进行模糊查询;</br>
 * 在IE8下进行模糊查询时候，请不要将鼠标放置在下拉列表可能显示在的位置，这样会导致模糊过滤失效（已知BUG）
 * @name Horn.Select#<b>enableFieldSearch</b>
 * @type boolean
 * @default false
 * @example
 * 无
 */
/**
 * 增加配置项filterBy,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为key或者value
 * @name Horn.Select#<b>filterBy</b>
 * @type string
 * @default value
 * @example
 * 无
 */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Select#emptyText
  * @type String
  * @default ""
  * @example
  * #Select({"name":"test11f", "label":"Select", "defValue": "", "cols": 3, "check": "required", "disabled":false,"emptyText":"请选择..."})
  */
Horn.Select = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"Select",
    delimiter : "," ,
    bodyclicktype : "click.select" ,
    select : null ,
    field : null ,
    hidden : null ,
    listEl : null ,
    /**
     * 标识（在标签中使用），是否为多选下拉
     * @name Horn.Select#multipleline
     * @type Boolean
     * @default false
     */
    multipleline : false ,
    name : null,
    alias : null,
    showLabel:true,
    hasHeadItem:false,
    tempCheckedKeyArray:[],
    tempCheckedValue:"",
    /**
     * @ignore
     */
    init : function(dom){
        Horn.Select.superclass.init.apply(this,arguments) ;
        var _this = this ;
        this.select = this.el;
        this.hidden = this.select.children("input[type='hidden']");
        this.field = this.hidden.next();
        this.name = this.hidden.attr("name") ;
        this.alias = this.hidden.attr("alias") || "" ;
        this.img=this.select.find(".u-select-down");
        
        if(this.field.attr("delimiter")!=undefined){
            this.delimiter = this.field.attr("delimiter") ;
        }
        var headItem = this.params.headItem;
        if(headItem){
        	this.hasHeadItem = true;
        }
        var ref_target = this.field.attr("ref");
        this.listEl = ref_target ? Horn.getCurrent().find(
            "div.hc_hide_div").children(
            "div.hc_checkboxdiv[ref_target='" + ref_target + "']")
            : this.field.next().next("div.hc_checkboxdiv");
        if(!this.listEl.get(0)){
        	this.listEl = $("div.hc_hide_div").children("div.hc_checkboxdiv[ref_target='" + ref_target + "']");
        }
        this.listEl = this.listEl.first();
        this.multipleline = this.params.multiple;
        if(String(this.params.showLabel) =="false"){
        	this.showLabel = false;
        }
        //this.handerHeadItem();
        
        this.createHeadItem();
        
        //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
        this.setEditable(this.params.editable);
        this.setReadonly(this.params.readonly);
        
//        this.field.attr('readOnly', true);
        this.field.bind({
            'focus' : Horn.Util.apply(_this.onFocus,_this),
            'click' : Horn.Util.apply(_this.onClick,_this),
            'keydown':Horn.Util.apply(_this.onKeyDown,_this),
            'keypress':Horn.Util.apply(_this.onKeyPress,_this),
            'keyup':Horn.Util.apply(_this.onKeyUp,_this)
        });
        if(!this.params.disabled) {
        	 this.img.bind({      	
             	'click':Horn.Util.apply(_this.onFocus,_this)
             });
        }
       
        var value = this.params.value || this.hidden.val();
        // BUG #6719 combo单选时，headItem的值不能在输入框中显示
        if (value === "") {
        	this.setValue("", undefined, true);
        } else {
        	//this.setValue(value);
        	var  keyAttr = this.el.attr('keyfield');
    		var  valueAttr = this.el.attr('titlefield');
        	var items = this.params.items;
        	if(items&&items.length>0){
        		for(var i = 0; i< items.length; i++){
        			var item = items[i];
        			var tmpKey = item.code;
        			if(!tmpKey){
        				tmpKey = item.label;
        			}
        			var tmpValue = item.text;
        			if(!tmpValue){
        				tmpValue = item.value;
        			}
        			if(keyAttr){
        				tmpKey = item[""+keyAttr+""];
        			}
        			if(valueAttr){
        				tmpValue = item[""+valueAttr+""];
        			}
        			if(item!=null&&tmpKey==value){
        				this.field.val(tmpValue);
        				this.hidden.val(value);
        			}
        		}
        	}
        }
        
        //BUG #6554 【combox】(继承)setReadonly(true) 与设置属性readonly=true的表现形式不一致 
        //readonly不能再默认为true
//        if(this.params.readonly==false) {
//        	this.setReadonly(false);
//        }else{
//        	this.setReadonly(true);
//        }
        
        if(this.params.disabled) {
        	this.setDisabled(true);
        }
        
        //BUG #6904 【combox】单选模式下，不应该能输入非法值  ；BUG #6903 【combox】单选模式下，“请选择”不能删除
        //这里不能这么解决的是案件监听的问题
//		if (!this.multipleline) {//如果是单选，就把显示输入框设为只读状态
//			this.field.attr("readonly", "true");
//    		this.readonly = true;
//		}
		
		this.DICT = (function(_select){
			if(_select.params.items){
				var staticDict = {};
				$(_select.params.items).each(function(i,item){
					staticDict[item.label] = item.value;
				});
				return staticDict;
			}else{
				return Horn.getDict(_select.params.dictName);
			}
		})(this); 
		
		//STORY #10587 [财富管理事业部/陈为][TS:201412180594]-JRESPlus-ui-三、对于模糊查询的下拉选择框，目前只支持搜索字典值（DICT】
		//增加配置项filterBy,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为key或者value
		if(this.params.filterBy){
			this.params.enableFieldSearch=true;
		}else{
			this.params.filterBy = "keyOrValue";
		}
		
		//默认关闭模糊查询——或者根据用户配置开启模糊查询
		if(this.params.enableFieldSearch){
			this.enableFieldSearch=true;
			this.enableFieldQuery(true);
		}
		
		//window中使用combox这样绑定blur事情会导致多次触发
		//这样做的目的是为了让可编辑的select在丢焦点以后，清除无效值;但是这样使用导致了window中使用的其他问题
		//可编辑的select组件才需要这种丢焦点
		if(this.params.editable){
			this.field.bind("blur",function(){
				if(!_this.editflag){
					return ;
				}
				_this.editflag = false;
				var tmp =_this.tempCheckedValue.replace(",",_this.delimiter)
				$(this).attr("value",tmp);
			})
		}
    } ,
    enableFieldQuery:function(open){
    	var _this = this;
    	var bindAttr;
//    	var isIE8 = !!window.ActiveXObject&&!!document.documentMode;
//		if(isIE8){
    	//STORY #9807 [研发中心/内部需求][Jresplus][UI]select组件模糊查询相关问题 
    	//修改模糊查询对于其他的IE版本失效
      var rv = this.getIEVersion();
  	 
  	  var isIE8 = (rv == "8" || rv == "7");
  	//alert(isIE8);
		if(isIE8){
			bindAttr = "propertychange";
		}else{
			bindAttr="input";
		}
		
    	if(!open) {
    		_this.enableFieldSearch=false;
    		_this.searchField.unbind(bindAttr);
    		_this.searchField.remove();
    		return;
    	}else{
    		this.enableFieldSearch=true;
    	}
    	
    	//添加模糊搜索输入框
    	var searchField = $("<input type='text' value='' name='fieldToSearch' class='u-select' style='display:none'/>");
    	searchField.appendTo(this.el);
    	this.searchField=searchField;
    	
    	this.searchField.blur(function(){
    		_this.searchField.hide();
    		_this.field.show();
    	})
    	
    	//防止点击事件触发列表关闭
    	this.searchField.click(function(){
    		return false;
    	})
    	
    	//模糊匹配支持 
		//STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
		//**************备注：1、当点击选中的时候模糊匹配自动失效。2、当编辑文本款中的值的时候模糊匹配生效，文本款中的值作为匹配的字段。
    	//******************3、所有已经选中的状态在整个过程中会被保留。4、用户的配置项为enableFieldSearch，当设置为ture的时候启用模糊查询.5、单选模式下也只需要配置enableFieldSearch，会自动将readonly属性去除
		var fieldSearchFunc = function(){
			var charToMatch = _this.searchField.val();
			
			if(charToMatch!=""){
				//查询列表当中所有的条目
				$("li",_this.listEl).each(function(i,o){
					var _match = false;
					var _match_key = false;
					var _match_value = false;
					if(_this.params.filterBy == "key"){
						_match = !($(o).attr("key").indexOf(charToMatch) != -1);
					}else if(_this.params.filterBy == "value"){
						_match = !($(o).attr("title").indexOf(charToMatch) != -1);
					//17370 【TS:201602230417-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br><br><br】
					}else if(_this.params.filterBy == "keyOrValue"){
						_match_key = !($(o).attr("key").indexOf(charToMatch) != -1);
						_match_value = !($(o).attr("title").indexOf(charToMatch) != -1);
						if(_match_key==false || _match_value==false){
							_match=false;
						}else{
							_match=true;
						}
					}
					
					if(_match){
						$(o).hide();
					}else{
						$(o).show();
					}
				})
			}else{
				//过滤值为空时，显示所有
				$("li",_this.listEl).each(function(i,o){
					$(o).show();
				})
			}
		};
		
		_this.searchField.bind(bindAttr,fieldSearchFunc);
		//STORY #9807 [研发中心/内部需求][Jresplus][UI]select组件模糊查询相关问题 
    	//修改在有值获得焦点的时候不进行模糊查询这种情况
		_this.searchField.bind("focus",fieldSearchFunc);
		//需求#14586 【TS:201510300214-JRESPlus-资产管理事业部-张翔-Combox添加了filterBy输入过滤属性，在输入框输入Combox添加了filterBy输入过滤属性，在输入框输入值，下选过滤，选中其中一条值，再选择之前输入的值还存在需要手动删除（多选和单选都存在该问题）】 20151102 modify by zhouzx
		_this.searchField.bind("keyup",function(){
			var searchVal = _this.searchField.val();
			if(searchVal==""){
				_this.field.focus();
			}
		});
		//需求#14590 【TS:201510300216-JRESPlus-资产管理事业部-张翔-Combox多选配置filterBy输入过滤属性之后,Combox多选配置filterBy输入过滤属性之后，ctr+A全选所有下拉选项就不能用了
		_this.searchField.bind({
            'keydown':Horn.Util.apply(_this.onKeyDown,_this)
        });
    },
    getIEVersion : function(){
    	var rv = -1;
    	  if (navigator.appName == 'Microsoft Internet Explorer'){
    	    var ua = navigator.userAgent;
    	    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    	    if (re.exec(ua) != null)
    	      rv = parseFloat( RegExp.$1 );
    	  }else if (navigator.appName == 'Netscape'){
    	    var ua = navigator.userAgent;
    	    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    	    if (re.exec(ua) != null)
    	      rv = parseFloat( RegExp.$1 );
    	  }
    	return rv;
    },
    // 方法冗余 重写disabled方法，combox和select正在提交到后台的是隐藏域,所以disabled时也要把隐藏域disabled掉
    setDisabled : function(disabled) {
    	//BUG #6798 【combox】设置disabled属性为true会造成js错误
    	if (disabled === false) {
    		this.setEnable(true);
            this.disabled = false;
            //Horn.getComp(this.name).setDisabled(false);
    	} else {
    		this.setEnable(false);
            this.disabled = true;
            //Horn.getComp(this.name).setDisabled(true);
    	}
    },
    /**
     * 设置是否只读，只读为true时，不可编辑不可下拉
     * @function
     * @name Horn.Field#setReadonly
     * @param {Boolean} readonly 是否只读
     * @ignore
     */
    //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
    setReadonly : function(readonly) {
    	if(!readonly) readonly=false;
    	
		if (readonly === false) {
    		this.el.removeAttr("readonly");
    		this.readonly = false;
    	} else {
    		this.el.attr("readonly", true);
    		this.readonly = true;
    		this.setEditable(false);
    	}
    },
    /**
     * 设置是否可编辑，下拉框可以下拉
     * @function
     * @name Horn.Select#setEditable
     * @param {Boolean} editable 不可编辑
     * @ignore
     */
    //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
    setEditable : function(editable) {
    	if(!editable) editable=false;
		if (editable === true) {
    		this.field.removeAttr("readonly");
    		this.editable = true;
    	} else {
    		this.field.attr("readonly", true);
    		this.editable = false;
    	}
    },
    /**
     * @ignore
     */
    createHeadItem : function() {
        var headItem = this.params.headItem;
        var multiple = this.params.multiple;
        if(this.hasHeadItem){
            var label = headItem.label?headItem.label:"";
            var pLabel = headItem.pLabel?headItem.pLabel:"";
            var value = headItem.value?headItem.value:"";
            var headItemLi = "<li key='"+label+"' pkey='"+pLabel+"' title='"+value+"' headItem='"+this.name+"' ><label>"+value+"</label></li>";
            this.listEl.children("ul").prepend(headItemLi);
            this.field.val(value);
        }
        if(this.params.emptyText&&this.params.emptyText!=""){
        	this.field.val(value);
        }
    },
    /**
     * @ignore
     */
    handerHeadItem:function(){
    	var cmpName = this.name;
		var ul = this.listEl.children("ul");
   		if(ul.length>0){
   	    	if(this.hasHeadItem){
   	    		var headItemFind= false;
   	    		var headItems = ul.children("li[headItem]");
   	    		if(headItems.length>0){
   	    			headItems.each(function(idx,item){
   	    				var name = $(item).attr('headItem');
   	    				if(cmpName != name){
   	    					$(item).remove();
   	    				}else{
   	    					headItemFind = true;
   	    				}
   	    			});
   	    			if(headItemFind){
   	    				return;
   	    			}else{
   	    				this.createHeadItem();
   	    			}
   	    		}else{
	    			this.createHeadItem();
   	    		}
   	    	}else{
   	    		var headItem = ul.children("li[headItem]");
   	    		if(headItem.length>0){
   	    			headItem.remove();
   	    		}
   	    	}
		}
    },
    /**
     * @description 设置select的值
     * @function
     * @name Horn.Select#setValue
     * @param {String} value
     * @param {Boolean} triggerChange 是否触发值更改事件
     */
    setValue : function(value, triggerChange, notBlur) {
    	if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
    	this.handerHeadItem();
        var hidden = this.hidden ;
        var oldVal = hidden.val();
        var field = this.field ;
        //BUG #6560 【combox】(继承)clearValue() 不会将组件回复到原始状态
        //if (value === undefined || value === null || value==="") {
        if (value === undefined || value === null) {
        	field.val("");
            hidden.val("");
//            if (!notBlur) {
//                this.field.blur();
//            }
            return false;
        }
        if (value == "") {
    		//BUG #6440 【form】各个表单组件的校验提示不统一
        	hidden.val("");
        	this.tempCheckedKeyArray=[];
    	}
      
        if($.type(value)=="string"||$.type(value)=="number"){
            value = {"key":value+""} ;
        }
        //修改select的设置初始值逻辑，修复在全选条件下分隔符为空时值无法展示的问题
        var ul = this.listEl.children("ul") ;
        if (this.listEl.length > 0) {
            if (this.multipleline) {
            	if(value.key == null || value.key=="" ){
            		field.val("");
            	}else if(value.text){
            		field.val(value.text);
            	}else{
            		var checkedString = [];
            		var tmpKey = [];
            		if(this.delimiter != ""){
            			tmpKey = value.key.split(this.delimiter);
            		}else{
            			tmpKey = value.key.toCharArray();
            		}
            		this.tempCheckedKeyArray=tmpKey;
            		if(this.params.dictName){
            			for(var i=0;i<tmpKey.length;i++){

            				//STORY #9624 [研发中心/内部需求][JresPlus][UI]-数据字典下拉后失丢焦点 再通过setvalue方法设置值，设置不成功 
	            			checkedString.push(Horn.getDict(this.params.dictName)[tmpKey[i]]);
            			}
            		}else{
            			var dataFromList = this.getListData().data;
            			for(var i=0;i<tmpKey.length;i++){
            				for(var j=0;j<dataFromList.length;j++){
            					if(tmpKey[i] == dataFromList[j].key){
            						checkedString.push(dataFromList[j].value);
            					}
            				}
            			}
            		}
            		checkedString=checkedString.toString().replace(/,/g, this.delimiter);
            		field.val(checkedString);
            		//需求 #15004 【TS:201511230300-JRESPlus-资产管理事业部-张翔-4.文本框和下选框值长度过长（超过组件宽度）无法显示
            		field.attr("title",checkedString);
            	}
                hidden.val(value.key);
            } else {
                if(!value.text){
                    var li = ul.children("li[key='" + value.key + "']");
                    value.text = jQuery.trim(li.text());
                	if(!this.showLabel){
                		var span = li.find('span');
                		value.text = value.text.replace(span.text(),"");
                    }
                }
                //BUG #6553 【combox】(继承)setValue() 设置无效值，依然会生效，但是getValue返回为""
                if(value.text!=""){
                    //【开发】bug #12498 需求14674---一个sreen中设置showLable为true，combox为单选模式时，输入框中默认值，key与value显示距离过大 
                	var str = value.text;
                    if($.type(value)=="string"){
                    	str = str+"";
                    	str = str.replace(/(^\s+)|(\s+$)/g,"");
                    	str = str.replace(/\s/g,"");
                    }
                    field.val(str);
                	hidden.val(value.key);
                }else{
                	//清空操作
                	if(value.key==""){
                        field.val("");
                	}else{//设置不合理值的非法操作
                		return;
                	}

                }
             }
            if (triggerChange && oldVal!=value.key) {
                field.trigger('change', [ value.key ]);
            }
        }
        
        //BUG #6839 【combox】在多选模式下无效的值任然可以设置成功  
        if (this.multipleline) {
        	//重新计算有效值，然后赋值给隐藏域（只针对多选有效）
            var val = this.hidden.val() ;
            var tmpVal = [];    //story 8487
            var _this = this;
            if(val!="" && val!=null){
	            $("input[type='checkbox']", this.listEl).each(function(index, dom) {
	                var li = $(dom).parent().parent("li[key]");
	                var curVal = li.attr("key");
	                var valArray = val.split(_this.delimiter);
	                var len = valArray.length;
	                for(var i=0; i< len; i++){
	                	var key = valArray[i];
	                     if(curVal==key){
	                    	 tmpVal.push(key);
	                     }
	                }
	            });
	            //BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
	            //tmpVal = tmpVal.substring(0,tmpVal.length-1);
	            this.hidden.val(tmpVal.join(this.delimiter));
            }
        }
        
      //将选中的值保存起来
       this.tempCheckedValue = this.field.val();
        
        //STORY #9468 [研发中心/内部需求][JresPlus][UI]comboxt组件在必填状态下，先清空值，然后执行setValue()设置非空值后，校验信息依然存在。设置了非空值后，校验通过，校
        //STORY #9469 [研发中心/内部需求][JresPlus][UI]comboxt组件在必填状态下，无值的情况下丢失焦点，然后执行setValue()设置非空值后，校验信息依然存在。设置了非空值后， 
        if (!notBlur) {
            this.validate();
        }
        
        
    } ,
    /**
     * 获取选中的值
     * @function
     * @name Horn.Select#getValue
     * @return String 返回选中的值
     */
    getValue : function(returnFieldValue){
    	this.handerHeadItem();
    	if(returnFieldValue){
    		var _select = this;
    		var val = this.hidden.val() ;
    		var getVal = function(key){
    			return  _select.DICT[key] || null;
    		};
    		if(this.multipleline){
    			var valArr = val.split(this.delimiter);
    			var rtnVal = [];
    			$(valArr).each(function(i,item){
    				var transVal =getVal(item);
    				if(transVal){
    					rtnVal.push(transVal);
    				}
    			});
    			return rtnVal.join(this.delimiter);
    		}else{
    			return getVal(val);
    		}
    	}
    	//bug#17110 单选模式下的combox设置value为item中不存在的值，通过getvalue获取值，会获取到value
    	var retVal=this.hidden.val();
    	var $listItems=this.listEl.find("ul>li");
    	var flag="";//单选模式下，hidden组件的value值是否在下拉项中存在的标志
    	//单选模式
    	if(!this.params.multiple || this.params.multiple==false){
    		if(this.params.value){
    			//var initVal=this.params.value;
    			$.each($listItems,function(i,item){
	    			if($(item).attr("key")==retVal){
	    				flag="has"
	    			}
	    		});
	    		if(!flag){
	    			retVal="";
	    		}
    		}
    			
    	}
        return retVal ;
    },
    onClick : function(e) {//bug #12452 需求14586--combox添加了filterby属性后，模糊搜索后的数据无法选中
    	if(this.searchField){
	    	this.field.hide();
	    	this.searchField.show();
	    	this.searchField.focus();
    	}
    },
    /**
     * @ignore
     */
    onFocus : function(e) {
    	if(this.disabled)return;
        var curObj = $(e.currentTarget);
        if(curObj.hasClass("u-select-down")){     	
        	curObj=$(e.currentTarget).prev();	
        }
        var listDiv = this.listEl;
        var isFromOuter = curObj.data("isFromOuter");
//        if(this.params.readonly){
//        	return ;
//        } 
        if (listDiv.length > 0 ) {
        	var searchField_val = "";
        	if(this.searchField){
        		searchField_val = this.searchField.val();
        	}
        	if(searchField_val!=""){
        		//什么都不做
        	}else{
        		this.showList(curObj, listDiv);
        	}
        }else{
            var ref_target = this.field.attr("ref");
            this.listEl = ref_target ? this.el.parents('.h_floatdiv').find(
                "div.hc_hide_div").children(
                "div.hc_checkboxdiv[ref_target='" + ref_target + "']")
                : this.field.next("div.hc_checkboxdiv");
            if(this.listEl.length >0 ){
            	this.showList(curObj, this.listEl);
            }    
            this.multipleline = this.listEl.attr("multiple_line") == "true";
        }
        
        //9590
        if(this.enableFieldSearch){
        	//在window中使用模糊查询会出现两个查询框
        	var fields = this.el.find("input[name=fieldToSearch]");
        	if(fields.size() == 2){
        		fields.first().remove();
        	}
        	//BUG #12450 需求14586--combox添加了filterby属性后，选中值后输入框无法实时显示
        	var tmpVal = this.field.val();
        	if(tmpVal==""){
	        	this.field.hide();
	        	this.searchField.show();
	        	this.searchField.focus();
        	}
        }
    } ,
    /**
     * @ignore
     */
    onKeyDown : function(e){
        var keyCode = e.keyCode;
        var listEl = this.listEl ;
        var ul = listEl.children("ul") ;
        var lis = ul.children("li") ;
        var li = ul.children("li.h_cur") ;
        var listDom = listEl.get(0) ;
        var last = ul.children("li").last().get(0) ;
        if (e.ctrlKey && keyCode === 65 && this.multipleline) {
            var inputs = ul.find("input:not(:checked)") ;
            if(inputs.length==0){
                lis.removeClass("h_cur") ;
                inputs = lis.children("label").children("input") ;
                inputs.each(function(index,input){
                    input.checked = false ;
                }) ;
                this.setValue("") ;
            }
            else{
            	//需求 #15026 【TS:201511240583-JRESPlus-资产管理事业部-张翔-1.combox下拉框问题 输入过滤之后显示三项，选中一项之后过滤项变成了全部，之前过滤都没了，此时删除输入的过滤值，组件失去焦点，选中的那一项的值没了，获取焦点查看到选项是被选中的
            	inputs.each(function(index,input){
                	var display = $(input).parent("label").parent("li").is(":visible");
                    if(display){
	                	input.checked = true ;
	                    $(input).parent("label").parent("li").addClass("h_cur") ;
                    }
                }) ;
                if(this.searchField){
                	this.searchField.val("");
                	this.searchField.hide();
                	this.field.show();
                }
                inputs.last().parent("label").parent("li").triggerHandler("click.li") ;
            }
            Horn.Util.stopPropagation(e);
            return false;
        }
        else if (keyCode === 38) {//up
            //↑
            if(!this.multipleline){
                var prev = li.prev() ;
                if(prev.length){
                    listDom.scrollTop=prev.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
                    li.removeClass("h_cur") ;
                    prev.addClass("h_cur") ;
                }
            }
        } else if (keyCode === 40) {//down
            if(!this.multipleline){
                var next = li.next() ;
                if(next.length){
                    listDom.scrollTop=next.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
                    li.removeClass("h_cur") ;
                    next.addClass("h_cur") ;
                }
            }
        } else if (keyCode === 46 || keyCode === 8) {//回退或删除
           /* lis.removeClass("h_cur") ;
            var inputs = lis.children("label").children("input") ;
            inputs.each(function(index,input){
                input.checked = false ;
            }) ;
            this.setValue("") ;
            Horn.Util.stopPropagation(e);
            return false;*/
        	//BUG #6861 【combox】多选模式下，按回退或者删除键，会把值清空
        	//这个问题现在不存在了，因为都改成了显示值而不是key
        	//直接注视掉这个就可以解决BUG #6904 【combox】单选模式下，不应该能输入非法值  ；BUG #6903 【combox】单选模式下，“请选择”不能删除——同时单选下的模糊查找也顺利完成
//        	if (!this.multipleline) {
//        		this.setValue("") ;
//        	}
        } else if (keyCode === 9) {//tab键
            this.hideList(this.field, listEl);
        } else if (keyCode === 13 || keyCode === 32) { //回车或空格
            if(!this.multipleline){
                li.trigger("click.li") ;
                Horn.Util.stopPropagation(e);
            }
            return false;
        } else {
        }
        
    } ,
    /**
     * @ignore
     */
    onKeyPress : function(e){
        var keyCode = e.keyCode;
        var text = String.fromCharCode(keyCode) ;
        var newText = "" ;
        var listEl = this.listEl ;
        var ul = listEl.children("ul") ;
        var li = ul.children("li") ;
        if (keyCode>=65 && keyCode<=90){
            newText = text.toLowerCase() ;
        }
        else{
            newText = text.toUpperCase() ;
        }

        var selLi = this.selectLi(text,newText) ;
        var last = li.last().get(0) ;
        var listDom = listEl.get(0) ;
        if (keyCode === 38) {
        } else if (keyCode === 46 || keyCode === 8) {
        } else if (keyCode === 40) {
        } else if (keyCode === 13) {
        } else {
            //其他key值，用于筛选
            if (this.multipleline) {
                var value = this.getValue() ;
                if(value.indexOf(text)==-1){
                    if(selLi){
                        var input = selLi.children("label").children("input") ;
                        if(!input.get(0).checked){
                            input.get(0).checked = true ;
                            //BUG #6837 【combox】多选模式下，value设置有值，通过键盘增加输入框的值，所有已经设置的均应被选中
                            //selLi.trigger("click.li") ;
                        }
                    }
                } else {
                	// 20140423 hanyin BUG #6809 【combox】多选模式下，value设置有值，通过键盘修改输入框的值，下拉不会选中，焦点移开然后获得焦点依然无法选中
                	//selLi.trigger("click.li") ;
                }
            }
            if(selLi){
                listDom.scrollTop=selLi.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
            }
        }
        Horn.Util.stopPropagation(e);
    },
    /**
     * @ignore
     */
    onKeyUp : function(e){
    	
        var listEl = this.listEl ;
        var _this = this;
        //只针对多选有效
        if (this.multipleline && !this.params.enableFieldSearch) {
        	
        	//select是否被编辑的标志,为了解决在可编辑状态下随意输入的值在丢焦点的时候清除
        	if(_this.params.editable){
        		_this.editflag = true;
        	}
        	
        	//之前的转换方式在显示值更改之后没有改
            var val = this.field.val() ;
//        	var val = this.tempCheckedKeyArray.toString();
            var keyArray = []
            var valueArray=[]
            var tmpVal = "";
            $("input[type='checkbox']", listEl).each(function(index, dom) {
                var li = $(dom).parent().parent("li[key]");
                var curVal = li.attr("title");
                var curKey = li.attr("key");
                
                //关闭取消所有的选中状态这样会造成已经选中的值被取消选中，是不是需要？
                //就算是从输入款中输入需要选中的key也不一定要把之前选中的值取消啊
                //STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
                $(dom).prop("checked", false);
                
                //BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
                var valArray = val.split(/[\,,\，]/);
                var len = valArray.length;
                for(var i=0; i< len; i++){
                	var key = valArray[i];
                	//更新为可以按照key或者value进行选择，不再局限于按照value来选择
                     if(curVal==key || key==curKey){
                    	 keyArray.push(curKey);
                    	 valueArray.push(curVal);
                    	 tmpVal = tmpVal+valArray[i]+",";
                    	 $(dom).prop("checked", true);
                     }
                }
                //$(dom).attr("checked", val.indexOf(curVal) > -1);
                if ($(dom).prop("checked")) {
                    li.addClass("h_cur");
                } else {
                    li.removeClass("h_cur");
                }
                li.focus() ;
            });
            //BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
            tmpVal = tmpVal.substring(0,tmpVal.length-1);
            this.tempCheckedKeyArray=keyArray;
            
            //select中在不开启模糊查询的时候，编辑文本框丢焦点后文本框应该正确显示选中的值，不包括随意输入的内容
            this.tempCheckedValue=valueArray.toString();
            _this.hidden.val(keyArray);
        }
        
        Horn.Util.stopPropagation(e);
    },
    /**
     * @ignore
     */
    ///////////////////解决多个combox在相同数据字典的情况下，选中一个后其他combox的下拉列表无法正常显示的问题
    bodyClick : function(e) {
    	var target = this.getEventTarget();
        if(e.target==e.data.inputEl.get(0) || target.data("isFromOuter")||$(e.target).prev()[0]==e.data.inputEl.get(0)){
        	target.data("isFromOuter",false);
        	
        	var listEl = e.data.listEl;
            var inputEl = e.data.inputEl;
            this.showList(inputEl, listEl);
            $(document).one(this.bodyclicktype, e.data,
                Horn.Util.apply(this.bodyClick,this));
        }
        else{
            var listEl = e.data.listEl;
            var inputEl = e.data.inputEl;
            listEl.hide()
            if (!listEl.data("show_name")) {
                return;
            }
            var listLi = $("li[key]", listEl);
            listLi.unbind('click.li');
            listEl.data("show_name", "");
            //需求 #14814 【TS:201511130151-资产管理事业部-张翔 输入过滤之后显示三项，选中一项之后过滤项变成了全部，之前过滤都没了，此时删除输入的过滤值，组件失去焦点，选中的那一项的值没了，获取焦点查看到选项是被选中的
            if(this.searchField){
            	this.searchField.val("");
            }
        }
    } ,
    /**
     * @ignore
     */
    listClick : function(e) {
//    	this.fromListClick = true;
        var _this = this ;
        var _li = $(e.currentTarget);
        var listEl = e.data.listEl;
        var value = {} ;
        if (_this.multipleline) {
            var arrVal = new Array();
            var arrValTitle = new Array();
            $("input[type='checkbox']:checked", listEl).each(function(index, dom) {
                var curVal = $(dom).parent().parent("li[key]").attr("key");
                var curValTitle = $(dom).parent().parent("li[key]").attr("title");
                if (curVal) {
                    arrVal.push(curVal);
                    arrValTitle.push(curValTitle);
                }
            });
            this.tempCheckedKeyArray=arrVal;
            //为select内容过长的时候显示tips
            this.field.attr("TITLE",arrValTitle.toString());
            
            value["key"] = arrVal.join(_this.delimiter) ;
            value["text"] = arrValTitle.join(_this.delimiter) ;
            if ($("input[type='checkbox']", _li).get(0).checked) {
                _li.addClass("h_cur");
            } else {
                _li.removeClass("h_cur");
            }
            e.stopPropagation();
            this.setValue(value,true,true) ;
        } else {
            _li.addClass("h_cur");
            _li.siblings().removeClass("h_cur");
            this.setValue(_li.attr("key"),true,true) ;
        }
        
        //window下blur事件多次触发的问题
        this.field.trigger('blur');
        
      //将选中的值保存起来
      this.tempCheckedValue = this.field.val();
      //需求14588 【TS:201510300215-JRESPlus-资产管理事业部-张翔-Combox多选时，先用ctr+A可以全选所有下拉选项，但是在此用ctr+A的时候就不能反选，会选中整个页面
      if (_this.multipleline){
    	  this.field.focus();
      }
    } ,
    /**
     * @ignore
     */
    hideList : function(inputEl, listEl) {
        if (!listEl.data("show_name")) {
            return;
        }
        listEl.hide();
        var listLi = $("li[key]", listEl);
        listLi.unbind('click.li');
        listEl.data("show_name", "");
    } ,
    /**
     * @ignore
     */
    longerList : false,
    changeToLongerList : function(){
    	this.longerList = true;
    },
    /**
     * @ignore
     */
    showList : function(inputEl, listEl) {
    	this.handerHeadItem();
        var _this = this ;
        
        //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
        //当配置了readonly属性后下拉列表不能弹出
        if(this.readonly == true){
        	return false;
        }
        
        //显示所有列表当中的表项
        //STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
        //兼容不同combox的相互级联的功能
        //var searchField_val = this.searchField.val();
        if(this.enableFieldSearch){
        	//需求 #14584 【TS:201510300213-JRESPlus-资产管理事业部-张翔-Combox添加了filterBy属性之后再调用filter无效
        	var searchField_val = this.searchField.val();
        	if(searchField_val!=""){
	        	$("li",listEl).each(function(i,o){
	            	$(o).show();
	            })
        	}
        }
        
        var hidden = inputEl.prev() ;
        if (listEl.data("show_name")==hidden.attr("name")) {
            return;
        }
        this.hideAllList(listEl);
        // 应用对象
        var data = {
            'inputEl' : inputEl,
            'listEl' : listEl
        };
         
		if(listEl.offsetParent() != inputEl.offsetParent() ){
			listEl.appendTo(inputEl.offsetParent());
		}
        var pos = inputEl.position(),
	       	listOuterHeight = inputEl.outerHeight();
        // 显示位置
        listEl.css("left",pos.left + 'px') ;
        listEl.css("top",(pos.top + listOuterHeight) + 'px') ;
        var rv = this.getIEVersion();
        if(rv=="9"){
        	var li = listEl.children("ul").children("li");
        	if(li.length>3){
        		listEl.css("width",(inputEl.outerWidth() * (this.longerList?2:1) - 2)+18 + 'px') ;
        	}else{
        		listEl.css("width",(inputEl.outerWidth() * (this.longerList?2:1) - 2)+ 'px') ;
        	}
        }else{
        	listEl.css("width",(inputEl.outerWidth() * (this.longerList?2:1) - 2) + 'px') ;
        }
        
        // 显示
        listEl.css("display","block");
        listEl.data("show_name", hidden.attr("name"));
        // 文档事件处理
        $(document).one(_this.bodyclicktype, data,
            Horn.Util.apply(_this.bodyClick,_this));
        // 列表事件绑定
        var listLi = $("li[key]", listEl);
        listLi.bind("click.li", data, Horn.Util.apply(_this.listClick,_this));
        listLi.removeClass("h_cur");

        // 列表初始化选择的值。这是我之前修改的导致了充值的时候tempCheckedKeyArray无法变更为初始化的值,原来的方式也没什么不对
        //STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
//        var val = inputEl.prev().val();
        var val=this.tempCheckedKeyArray.toString();
        if(val==""){
        	val = this.hidden.val();
        }
        if (this.multipleline) {
            $("input[type='checkbox']", listEl).each(function(index, dom) {
                var li = $(dom).parent().parent("li[key]");
                var curVal = li.attr("key");
                $(dom).prop("checked", false);
                //BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
                var valArray = val.split(_this.delimiter);
                for(var i=0; i< valArray.length; i++){
                	var key = valArray[i];
                     if(curVal==key){
                    	 $(dom).prop("checked", true);
                     }
                }
                
                //$(dom).attr("checked", val.indexOf(curVal) > -1);
                if ($(dom).prop("checked")) {
                    li.addClass("h_cur");
                } else {
                    li.removeClass("h_cur");
                }
                li.focus() ;
            });
        } else {
        	//单选时下拉菜单未选中当前值 20151209 modify by 周智星
        	var filedVal = this.hidden.val();
            var li = listEl.children("ul").children("li[key='" + filedVal + "']") ;
            //var li = listEl.children("ul").children("li[key='" + val + "']") ;
            li.addClass("h_cur");
            li.focus() ;
        }
        
        if(this.showLabel){
        	this.listEl.find('span.hce_dictlabel').show();
        }else{
        	this.listEl.find('span.hce_dictlabel').hide();
        }
    } ,
    /**
     * @ignore
     */
    hideAllList : function(listEl) {
        $("div.hc_checkboxdiv").each(function(i, o) {
            if (listEl.get(0) != o) {
                $(o).hide();
                $(o).data("show_name", "");
            }
        });
    },
    /**
     * @ignore
     */
    selectLi : function(text,old){
        var liList = this.listEl.children("ul").children("li") ;
        var selectLi = null ;
        for(var i=0;i<liList.size();i++){
            var li = $(liList.get(i)) ;
            var key = li.attr("key") ;
            //BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
            if(key && key.indexOf(text)==0){
                selectLi = li ;
                break ;
            }
        }
        if(selectLi==null && !this.multipleline){
            for(var i=0;i<liList.size();i++){
                var li = $(liList.get(i)) ;
                var key = li.attr("key") ;
                //BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
                if(key && key.indexOf(old)==0){
                    selectLi = li ;
                    break ;
                }
            }
        }
        if(selectLi!=null){
            if (!this.multipleline) {
                selectLi.siblings().removeClass("h_cur");
                selectLi.addClass("h_cur");
            }
        }
        return selectLi ;
    },
    bind : function(type,fn){
        this.field.bind(type,[this.hidden],fn) ;
    },
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.hidden.attr("disabled","disabled");
			this.field.attr("disabled","disabled");
		}
	},
	
	/*STORY #9354 【TS:201408080099-JRESPlus-财富管理事业部-陈为- 把jresplusui升级到1.0.3之后，原先】 
	 * getEventTarget : function(){
		return this.field;
	},*/
	/**
	 *返回下拉框中所有的数据
     * @function
     * @name Horn.Select#getListData
     * @return object data为所有节点的值,dom为该节点的jquery对象
     */
	getListData : function(){
		var dataPare = {};
		var data = [];
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		if(this.multipleline){
			$("input[type='checkbox']", this.listEl).each(function(index, dom) {
				var li = $(dom).parent().parent("li[key]");
				var tmp={};
				tmp.key = li.attr("key");
				tmp.value = li.attr("title");
		        data.push(tmp);
		    })
	    }else{
		    $("li[key!='']", this.listEl).each(function(index, dom) {
				var li = $(dom);
				var tmp={};
				tmp.key = li.attr("key");
				tmp.value = li.attr("title");
		        data.push(tmp);
		    })
	    }
	    dataPare.data=data;
	    dataPare.dom=this.listEl;
	    return dataPare;
	}
}) ;
Horn.Field.regFieldType("div.hc_select",Horn.Select) ;
/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		韩寅		完善注释为标准的jsdoc
 * 2016-3-22     刘龙          bug#17126 一个页面多个selecttree控件时，设置值后，再次点击下拉框再失去焦点，输入框中的值无法显示
 * 2016-3-22     刘龙          bug#17128 selecttree控件不设置expandFirst属性，显示时浏览器报错
 * 2016-3-22     刘龙          bug#17142 selecttree控件在window控件下，显示时报错
 * 2016-3-22     刘龙          bug#17152 单选模式下，selecttree控件设置value值，过滤功能失效
 * 2016-3-23     刘龙          bug#17194 window控件中selecttree控件显示不全，点击下拉框后树乱掉了
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.SelectTree
 * @class
 * 树下拉选择组件</br>
 * 带有一个输入框，可以通过下拉树选择
 */
	 
/**@lends Horn.SelectTree# */

/**
 * 组件的唯一标示
 * @name Horn.SelectTree#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交时的名称
 * @name Horn.SelectTree#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件跨列数，默认为1
 * @name Horn.SelectTree#<b>cols</b>
 * @type String
 * @default "1"
 * @example
 * 无
 */
/**
 * 表单在首次展现时填充的值
 * @name Horn.SelectTree#<b>value</b>
 * @type String
 * @default ""
 * @example
 * @ignore
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.SelectTree#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 表单组件的名称
 * @name Horn.SelectTree#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 验证串，比如"required"等
 * @name Horn.SelectTree#<b>check</b>
 * @type String
 * @default ""
 * @example
 * @ignore
 * 无
 */
 /**
  * 清空值后需要callback的事件配置
  * @name Horn.SelectTree#afterClear
  * @type String
  * @default ""
  * @example
  * #select_tree({  
  *  "id":"select_tree",  
  *  "name":"select_tree",
  *	 "checkMode":"checkbox",
  *  "afterClear":"afterClearFn",
  *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
  *  #jscode()
  *  	function afterClearFn(){
  *  	}
  *  #end
  * 
  */
/**
 * 页面加载时，树组件默认是否展开
 * @name Horn.SelectTree#<b>expandFirst</b>
 * @type Boolean
 * @default false
 * @example
 * @ignore
 * 无
 */
/**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过setValue、reset等API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.SelectTree#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */ 
/**
 * 同步加载，静态数据
 * @name Horn.SelectTree#<b>data</b>
 * @type String
 * @default 
 * @example
 * '[{"id":"1","name":"root"},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"}]'
 */
/**
 * 组件异步请求的数据地址，默认不需要此项，使用框架提供的地址。<br/>
 * 注：若果同时配置了url属性以及data属性，则根据url进行异步请求，data属性无效。
 * @name Horn.SelectTree#<b>url</b>
 * @type String
 * @default ""
 * @example
 * #select_tree({  
 *  "id":"select_tree",  
 *  "name":"select_tree",
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 选择模式"checkbox","radio"<br/>
 * 注：1.配置该属性时，点击文本节点选择模式失效；2.不配置该属性时，点击文本节点进行选择，同时按住Ctrl键可多选；<br/>
 *   3.模式为radio时，勾选子节点，父节点不是勾选状态，灰色标示作用;4.模式为radio时，同级节点不能同时勾选，父子节点可以同时勾选;<br/>
 *   5.模式为checkbox时，勾选子节点，父节点不是勾选状态，灰色标示作用;
 * @name Horn.SelectTree#<b>checkMode</b>
 * @type String 
 * @default 
 * @example
 * #select_tree({  
 *  "id":"select_tree",  
 *  "name":"select_tree",
 *	"checkMode":"checkbox",
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 是否使用模糊搜索,默认不使用，搜索出来的树节点高亮显示
 * @name Horn.SelectTree#<b>search</b>
 * @type Boolean
 * @default false
 * @example
 * #select_tree({  
 *  "id":"select_tree",  
 *  "name":"select_tree",
 *	"checkMode":"checkbox",
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')",
 *  "search":true})
 *  
 */
/**
 * 根据特定属性进行模糊搜索,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为节点name或者id。
 * name ：根据树节点名称，id:根据树节点id过滤
 * @name Horn.SelectTree#<b>filterBy</b>
 * @type string
 * @default name
 * @example
 * 无
 */
/**
 * 指定绑定的数据词典名称，用于加载数据
 * @name Horn.SelectTree#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * @ignore
 * 无
 */

/**
 * 下拉树选中时，回调函数方法
 * @name Horn.SelectTree#<b>onCheck</b>
 * @type String
 * @default ""
 * @example
 * #set($dataT='[{"id":"1","name":"根","pId":""},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"},{"id":"212","name":"sub111","pId":"21"},{"id":"221","name":"sub211","pId":"22"},{"id":"212","name":"sub11sas","pId":"21"}]') 
	#select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"check":"required",
			"onCheck":"onCheck"
			})
	#jscode()
		function onCheck(){
			console.info(Horn.getComp("select_tree2").getSelectedNodes());
		}
	#end
 */
/**
 * 同级是否能选择多次 可选值"true"、"false"，默认"false"
 * @name Horn.SelectTree#<b>isLevelSelect</b>
 * @type String
 * @default "false"
 * @ignore
 * @example
 * 无
 */
/**
 * 根节点的key 默认为"0"表示全部展示，如果不为"0"则表示要展示的单一树
 * @name Horn.SelectTree#<b>root_id</b>
 * @type String
 * @default "0"
 * @ignore
 * @example
 * 无
 */
/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.SelectTree#emptyText
  * @type String
  * @default ""
  * @example
  * #select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"check":"required",
			"onCheck":"onCheck",
			"emptyText":"请选择"
			})
  */
/**
  * 点击X按钮清空值时是否需要确认提示，默认为false；
  * 
  * @name Horn.SelectTree#confirm
  * @type boolean
  * @default false
  * @example
  * #select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"check":"required",
			"onCheck":"onCheck",
			"confirm":true
			})
  */

Horn.SelectTree = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"SelectTree",
	/**
     * 输入框隐藏组件的dom对象
     * @field
     * @name Horn.SelectTree#hidden
     * @type {HTMLDomDocument}
     * @ignore
     */
	hidden : null,
	/**
     * 输入框组件的dom对象
     * @field
     * @name Horn.SelectTree#field
     * @type {HTMLDomDocument}
     * @ignore
     */
	field : null ,
	/**
     * ztree对象的id
     * @field
     * @name Horn.SelectTree#ref
     * @type String
     * @ignore
     */
	ref : null,
	/**
     * 包裹下拉树组件的dom对象
     * @field
     * @name Horn.SelectTree#listEl
     * @type {HTMLDomDocument}
     * @ignore
     */
	listEl : null ,
	/**
     * 下拉树组件的dom对象
     * @field
     * @name Horn.SelectTree#listEl
     * @type {HTMLDomDocument}
     * @ignore
     */
	treeEl : null ,
	_this:null,
	expandFirst:true,
	callback: null,
	/**
	 * @ignore
	 */
	init : function() {
		Horn.SelectTree.superclass.init.apply(this,arguments) ;
		var name=this.name;
		this.field = this.el.children("input[type='text'][ref*='"+name+"']");
		this.hidden = this.field.prev();
		this.name = this.hidden.attr("name") ;
		this.ref = this.field.attr("ref");
		this.img=this.el.find(".u-select-down");
		_this=this;
		//bug#17128 selecttree控件不设置expandFirst属性，显示时浏览器报错
		expandFirst=false;
		if(this.hidden.attr('expandFirst')){
			expandFirst=this.params.expandFirst;
		}
		this.field.bind({
			"focus" : Horn.Util.apply(this.onFocus,this)
		});
		 if(this.params.afterClear){
	        	var fn = this.params.afterClear.replace("(","").replace(")","");
	        	this.callback = window[fn];
	        }
	        var _this = this;
	        this.el.children("a").bind({
	            'click' : Horn.Util.apply(_this.delVal,_this)
	        });
		 /*this.img.bind({      	
	        	'click':Horn.Util.apply(this.onFocus,this)
	      });*/
		this.initZTree();
	},
	delVal : function(){
    	if(this.params.disabled) return;
    	var _this = this;
    	var val = this.field.val();
    	if(val!=""){
    		if(this.params.confirm){
	    		Horn.Msg.confirm("确认","你确定要清除该值？",function(){  
	    			_this.hidden.val("");
	    			_this.field.val("");
	    			_this.field.attr("selectnodes","");
	    			_this.field.attr("pIds","");
	    			if(_this.callback){
	    				_this.callback();
	    			}
	    		},function(){  
	    		    //canel  
	    		});
    		}else{
    			_this.hidden.val("");
    			_this.field.val("");
    			_this.field.attr("selectnodes","");
    			_this.field.attr("pIds","");
    			if(_this.callback){
    				_this.callback();
    			}
    		}
    	}
    },
	/**
	 * @ignore
	 */
	initZTree : function() {
		/*var onchange = this.field.attr("onchange");
		if(onchange){
			//this.field.removeAttr("onchange");
			//var change = Horn.Util.getFunObj(onchange) ;
			//this.field.bind("change",change.params,change.fn) ;
		}*/
		var current = Horn.getCurrent() ;
		this.listEl = current.find("div.hc_selectbox-tree-div[ref_target='"+ this.ref + "']") ;
		if(this.listEl.length == 0){
			var name = this.hidden.attr("name").replace(/\./,"_") ;
			var arrHtml = [] ;
			arrHtml.push("<div class='hc_selectbox-tree-div' ref_target='ztree_" + name + "'>") ;			
			arrHtml.push("<div class='hc_selectbox-tree-left'>");
			arrHtml.push("<ul class='ztree' id='ztree_" + name + "'>");
			arrHtml.push("</ul>");
			arrHtml.push("</div>");
			arrHtml.push("</div>") ;
			var treeDiv = current.find("div.hc_hide_div-tree") ;
			if(treeDiv.length==0){
				treeDiv = $('<div class="hc_hide_div-tree"></div>').appendTo(current) ;
			}
			//判断当前下拉树组件在不在窗口中
			var $currentWindow=this.el.parents("div.h_floatdiv-con");
			if($currentWindow.length == 0){
				this.listEl = $(arrHtml.join("")).appendTo(treeDiv) ;
				this.listEl.attr("isInWin",false);
			}else{
				this.listEl=$(arrHtml.join("")).attr("isInWin",true);
				this.el.after(this.listEl);
			}
		}
	
		/*var treeObj = $.fn.zTree.getZTreeObj(this.ref);
		if(treeObj){
			return true ;
		}*/	
		var ztree = this.listEl.children("div.hc_selectbox-tree-left").children("ul.ztree");
		this.treeEl=ztree;
		/*var check = this.hidden.attr("checkMode") == "checkbox"
				|| this.hidden.attr("checkbox") == "radio";
		var chkStyle = this.hidden.attr("checkMode") || "checkbox";
		var dictName = this.hidden.attr("dictName");
		var service_name = context_path ;
		var root_id = this.hidden.attr("root_id") || "" ;*/
		var async = false;
		if(this.params.url && this.params.url != ""){
			async = true;
		}
		var setting = {
			view: {
				nameIsHTML: true,
				showLine: false,
				showIcon: true,
				showTitle : true,
				selectedMulti: true,
				dblClickExpand: true,
				fontCss: this.getFontCss
			},
			data : {
				key : {
					name : "name",
					title : "name"
				},
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId"
				}
			},
			callback: {
				beforeClick: this.beforeClick,
				beforeCheck: this.params.beforeCheck?window[this.params.beforeCheck]:null,
				beforeAsync : this.params.beforeAsync?window[this.params.beforeAsync]:null,
				onAsyncSuccess : this.params.onAsyncSuccess?window[this.params.onAsyncSuccess]:null,
				onAsyncError : this.params.onAsyncError?window[this.params.onAsyncError]:null,
				beforeCollapse : this.params.beforeCollapse?window[this.params.beforeCollapse]:null,
				beforeDblClick : this.params.beforeDblClick?window[this.params.beforeDblClick]:null,
				beforeDrag : this.params.beforeDrag?window[this.params.beforeDrag]:null,
				beforeDragOpen : this.params.beforeDragOpen?window[this.params.beforeDragOpen]:null,
				beforeDrop : this.params.beforeDrop?window[this.params.beforeDrop]:null,
				beforeEditName : this.params.beforeEditName?window[this.params.beforeEditName]:null,
				beforeExpand : this.params.beforeExpand?window[this.params.beforeExpand]:null,
				beforeMouseDown : this.params.beforeMouseDown?window[this.params.beforeMouseDown]:null,
				beforeMouseUp : this.params.beforeMouseUp?window[this.params.beforeMouseUp]:null,
				beforeRemove : this.params.beforeRemove?window[this.params.beforeRemove]:null,
				beforeRename : this.params.beforeRename?window[this.params.beforeRename]:null,
				beforeRightClick : this.params.beforeRightClick?window[this.params.beforeRightClick]:null,
				onCheck : this.onCheck,
				onCollapse : this.params.onCollapse?window[this.params.onCollapse]:null,
				onDblClick : this.params.onDblClick?window[this.params.onDblClick]:null,
				onDrag : this.params.onDrag?window[this.params.onDrag]:null,
				onDragMove : this.params.onDragMove?window[this.params.onDragMove]:null,
				onExpand : this.params.onExpand?window[this.params.onExpand]:null,
				onMouseDown : this.params.onMouseDown?window[this.params.onMouseDown]:null,
				onMouseUp : this.params.onMouseUp?window[this.params.onMouseUp]:null,
				onNodeCreated : this.params.onNodeCreated?window[this.params.onNodeCreated]:null,
				onRemove : this.params.onRemove?window[this.params.onRemove]:null,
				onRename : this.params.onRename?window[this.params.onRename]:null,
				onRightClick : this.params.onRightClick?window[this.params.onRightClick]:null,
				onClick : this.onCheck
			},
			async: {
				enable: async,
				url:this.params.url?this.params.url:"",
				autoParam:this.params.otherParam?this.params.otherParam:[],
				otherParam:this.params.otherParam?this.params.otherParam:{},
			    type:this.params.type?this.params.type:"post",
				dataFilter: this.params.dataFilter?window[this.params.dataFilter]:null
			}
		};
		
		var checkMode = this.hidden.attr('checkMode');
		if(checkMode&&checkMode=="checkbox"){
			setting.check = {
				enable : true,
				chkStyle : checkMode,
				chkboxType : { "Y": "", "N": "" }
			};
		}
		var data = this.hidden.attr("data-data") ;
		if(data && data != ""){
			data = $.parseJSON(data);
		}else{
			data = [];
		}
		this.treedata = data;
		if(async){
			this.zTreeObj=$.fn.zTree.init(ztree, setting);
		}else{
			this.zTreeObj=$.fn.zTree.init(ztree, setting, data);
		}
		var treeid = this.treeEl.attr('id');
		this.treeObj = $.fn.zTree.getZTreeObj(treeid);
		
		this.treeObj.expandAll(expandFirst);
		//根据value值给输入框赋name值
		var keyId = this.hidden.attr("value") ;
		var treeNodes=this.treeObj.getNodesByParam("id", keyId, null);
		if(treeNodes && treeNodes[0] !=null && treeNodes[0] != {} ){
			this.field.val(treeNodes[0].name);
			this.showLog(treeNodes,this.treeObj,true);
		}else{
			this.field.val("");
		}
		var treeObj = this.treeObj;
		//模糊查询
		var filterBy = "name" ;
		if(this.hidden.attr("filterBy")){
			filterBy =this.hidden.attr("filterBy");
		}
		this.field.bind('keyup',function(e) {
				treeObj.expandAll(true);
				var nodeList = treeObj.getNodesByParamFuzzy(filterBy,this.value,null);
				if(this.value!=""){
					$.each(nodeList,function(index,node){
				        node.highlight = true;
				        treeObj.updateNode(node);
				        treeObj.expandNode(node.getParentNode(),true);
				    });
				}else{
					$.each(nodeList,function(index,node){
				        node.highlight = false;
				        treeObj.updateNode(node);
				    });
				    treeObj.expandAll(expandFirst);
				}
			this.focus();
		});
	   //
	   this.field.bind({
			"blur" : function(){
				//bug#17126 一个页面多个selecttree控件时，设置值后，再次点击下拉框再失去焦点，输入框中的值无法显示
				$(this).val($(this).attr("selectNodes"));
				//失去焦点后，去除高亮样式
				var nodeList = treeObj.getNodesByParam("highlight",true,null);;
				$.each(nodeList,function(index,node){
			        node.highlight = false;
			        treeObj.updateNode(node);
			    });	
			}
		});
	   
	},
	/**
	 * @ignore
	 */
	onBeforeCheck : function(treeid, treeNode){
		var treeObj = $.fn.zTree.getZTreeObj(treeid);
		var _this = treeObj.thisScope ;
		return (function(){
			var isLevelSelect = this.hidden.attr("isLevelSelect") == "true";
			var check = this.hidden.attr("checkMode") == "checkbox"
			|| this.hidden.attr("checkbox") == "radio";
			if (check) {
				if (isLevelSelect) {
					if (this.hidden.data("level") != undefined
							&& treeNode["level"] != this.hidden
									.data("level")) {
						return false;
					}
					this.hidden.data("level", treeNode["level"]);
				}
			}
		}).apply(_this,arguments) ;
	},
	
	/**
	 * 异步加载成功后，全部展开树节点
	 * @ignore
	 */
	onAsyncSuccess : function(event, treeId, treeNode, msg){
		var _this = this
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		treeObj.expandAll(expandFirst);
		
		//根据value值给输入框赋name值
		var keyId = _this.hidden.attr("value") ;
		var treeNodes=treeObj.getNodesByParam("id", keyId, null);
		if(treeNodes && treeNodes[0] !=null && treeNodes[0] != {} ){
			_this.field.val(treeNodes[0].name);
			_this.showLog(treeNodes,treeObj,true);
		}else{
			_this.field.val("");
		}
	},
	getFontCss:function(treeId, treeNode) {  
	    return (treeNode.highlight) ? {"color":"rgb(255, 0, 0)", "font-weight":"bold"} : {'color':'#333', 'font-weight': 'normal'};  
	},
	/**
	 * @ignore
	 */
	onCheck : function(e, treeId, treeNode) {
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		var _this = treeObj.thisScope ;
		return (function(){
			var nodes = treeObj.getCheckedNodes();
			var check = this.hidden.attr("checkMode");
			var nodes = new Array();
			if(check&&check=="checkbox"){
				nodes = treeObj.getCheckedNodes();
			} else {
				nodes = treeObj.getSelectedNodes();
			}
			this.showLog.call(this,nodes,treeObj,check,true);
			if(this.params.onCheck){
				var onCheck = window[this.params.onCheck];
				onCheck();
			}
			
		}).apply(_this,arguments) ;
		
		this.field.trigger('blur');
	},
	/**
	 * @ignore
	 */
	showLog : function(nodes,treeObj,check,flag){
		var className = "dark";
		var idArr = [];
		var tIdArrs = [];
		var values = [];
		var pIds = [];
		var labels = [];
		var ztree = this.listEl.children("div.hc_selectbox-tree-left")
		.children("ul.ztree");
		var log = ztree.parent().next("div.hc_selectbox-tree-right")
		.children("ul.ztree");		
		$.each(nodes, function(index, node) {
			var zid = "ztree_node_" + node.tId;
			var value = node.name;
			var label = node.id;
			var pid = node.pId;
			values.push(value);
			labels.push(label);
			pIds.push(pid);
			idArr.push(zid);
			tIdArrs.push(node.tId) ;
			log.children("li[zid='" + zid + "']");
			if (log.children("li[zid='" + zid + "']").length == 0) {
				log.append("<li class='" + className + "' zid='" + zid
						+ "'>" + value + "</li>");
			}
		});
		log.children("li").each(function(index, li) {
			var obj = $(li);
			if (jQuery.inArray(obj.attr("zid"), idArr) == -1) {
				obj.remove();
			}
		});
		this.hidden.val(labels.join(","));
		if (check) {
			this.field.val(values.join(","));
			this.field.attr("selectNodes",values.join(","));
			this.field.attr("pIds",pIds.join(","));
			this.field.attr("title",values.join(","));
		} else {
			this.field.val(values.join(","));
			this.field.attr("pIds",pIds.join(","));
			this.field.attr("selectNodes",values.join(","));
		}
		this.hidden.attr("tids",tIdArrs.join(",")) ;
		var check = this.hidden.attr("checkMode");
		if(!check || check=="radio"){
			//this.hideTree(this.field,this.listEl);
			if(flag!=undefined){
				if(flag){
					this.hideTree(this.field,this.listEl);
				}else{
					this.showTree(this.field,this.listEl);
				}
			}
		}
		this.validate();
		//this.field.trigger("change",[this.hidden.val(),this.field.val(),nodes,this.hidden,this.field]) ;
	},
	/**
	 * @ignore
	 */
	clearLog : function(){
		var log = this.listEl.children("div.hc_selectbox-tree-right")
		.children("ul.ztree");
		log.children("li").remove() ;
	},
	/**
	 * @ignore
	 */
	onFocus : function(e) {		
		var current = Horn.getCurrent() ;
		this.listEl = current.find("div.hc_selectbox-tree-div[ref_target='"+ this.ref + "']") ;
		this.listEl.find("div.hc_selectbox-tree-left").width(this.field.width()+30);
		//bug#17194 window控件中selecttree控件显示不全，点击下拉框后树乱掉了
		if(this.listEl.attr("isInWin")=="true"){//在窗口中，当下拉树的cos属性为1或2时，下拉项宽度变小
			if(this.field.width()<390){
				this.listEl.find("div.hc_selectbox-tree-left").width(this.field.width()+30);
			}
		}
		var curObj = $(e.currentTarget);
		var ref_target = curObj.attr('ref');
		var listDiv = $("div.hc_selectbox-tree-div[ref_target='"
				+ ref_target + "']");
		if (listDiv.length > 0) {
			this.showTree(curObj, listDiv);
			var zTree = $.fn.zTree.getZTreeObj(ref_target);
			zTree.thisScope = this ;
			zTree.currentTarget = curObj ;
			//bug#17152 单选模式下，selecttree控件设置value值，过滤功能失效
			var check = this.hidden.attr("checkMode") == "checkbox" || this.hidden.attr("checkMode") == "radio";
			this.clearLog(zTree) ;
			zTree.checkAllNodes(false);
			zTree.selectNode(null, false);
			if(this.hidden.val()){
				tIdArrs = this.hidden.attr("tids") || "" ;
				tIdArrs = tIdArrs.split(",") ;
				var nodes = [] ;
				for(var i=0;i<tIdArrs.length;i++){
					if(tIdArrs[i]){
						var node = zTree.getNodeByTId(tIdArrs[i]);
						nodes.push(node) ;
						if (check) {
							zTree.checkNode(node, true, true, false);
						} else {
							zTree.selectNode(node, false);
						}	
					}
				}
				this.showLog(nodes,zTree,check,false) ;
			}
		}
		//开启模糊搜索，输入框获取焦点，清空值
		var hiddenObj=curObj.prev();
		var search=hiddenObj.attr("search");
		var filterBy=hiddenObj.attr("filterBy");
		if(search || filterBy){
			curObj.val("");
			curObj.removeAttr("readonly");
		}
	},
	/**
	 * @ignore
	 */
	hideTree : function(inputEl, listEl) {
		if (!listEl.data("show_name")) {
			return;
		}
		listEl.hide();
		listEl.data("show_name", false);
		var ref_target = inputEl.attr('ref');
		var zTree = $.fn.zTree.getZTreeObj(ref_target);
		zTree.thisScope = null ;
		zTree.currentTarget = null ;
	},
	/**
	 * @ignore
	 */
	showTree : function(inputEl, listEl) {
		if (listEl.data("show_name")) {
			return;
		}
		this.hideAllList(listEl);
		// 应用对象
		var data = {
			'inputEl' : inputEl,
			'listEl' : listEl
		};
		var offset = inputEl.offset(), listOuterHeight = inputEl.outerHeight();
		var position = inputEl.position();
		// 显示位置
		var listStyle = listEl.get(0).style;
		//bug#17142 selecttree控件在window控件下，显示时报错
		//下拉树在窗口中
		var $list=listEl.find("li");
		if(listEl.attr("isInWin")=="true"){
			listStyle.left = (position.left) + 'px';
			listStyle.top = (position.top + listOuterHeight) + 'px';
			$list.find("a").css({"min-width":"120px"});
			$list.find("span").css({"padding":"0px","text-align":"left" });
			$list.find("span.button").css({"width":"18px"});
			$list.find("span.button.chk").css({"width":"14px"});
		}else{
			listStyle.left = (offset.left) + 'px';
			listStyle.top = (offset.top + listOuterHeight) + 'px';
		}
		// listStyle.width = (inputEl.outerWidth() - 2) + 'px';
		// 显示
		listEl.show();
		listEl.data("show_name", true);
		// 当前文本框事件处理
		listEl.bind('click.ztree.list', data, function(e) {
			Horn.Util.stopPropagation(e);
		});
		// 文档事件处理
		$(document).one('click.combo.body', data, Horn.Util.apply(this.bodyClick,this));
	},
	/**
	 * @ignore
	 */
	hideAllList : function(listEl) {
		$("div.hc_selectbox-tree-div").each(function(i, o) {
			if (listEl.get(0) != o) {
				$(o).hide();
				$(o).data("show_name", "");
			}
		});
	},
	/**
	 * @ignore
	 */
	bodyClick : function(e) {
		var inputEl = e.data.inputEl;
		if(e.target==inputEl.get(0)){
			$(document).one('click.combo.body', e.data, Horn.Util.apply(this.bodyClick,this));
		}
		else{
			var listEl = e.data.listEl;
			this.hideTree(inputEl, listEl);	
		}
	},
    /**
     * 设置表单是否可用
     * @name Horn.SelectTree#setEnable
     * @function
     * @param enable true表示启用，false表示禁用
     * @return void
     * @example
     */
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.field.attr("disabled","disabled");
			this.hidden.attr("disabled","disabled");
		}
	},
	 /**
     * 设置下拉树的值，必须传递树节点的id值，如果id值不存在则设置为空(注：只能设置单个节点)。
     * @function
     * @name Horn.SelectTree#setValue
     * @param {String} value 值
     * @return void
     * @example
     * ##设置默认值为根节点
     * Horn.getComp("select_tree").setValue("1");
     * 
     */
    setValue : function(value) {
        var treeNodes=this.treeObj.getNodesByParam("id", value, null);
		if(treeNodes && treeNodes[0] !=null && treeNodes[0] != {} ){
			this.field.val(treeNodes[0].name);
			this.showLog(treeNodes,this.treeObj,true);
		}else{
			this.field.val("");
			this.showLog({},this.treeObj,true);
		}
        this.validate();
    },
    /**
     * 获取 selectTree 当前被选中的节点数据集合
     * @name Horn.SelectTree#getSelectedNodes
     * @function
     * @return Array(JSON)
     * 当前被选中的节点数据集合
     * @example
     * #set($dataT='[{"id":"1","name":"根","pId":""},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"},{"id":"212","name":"sub111","pId":"21"},{"id":"221","name":"sub211","pId":"22"},{"id":"212","name":"sub11sas","pId":"21"}]') 
		#select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"checkMode":"radio",
			"check":"required",
			"onCheck":"onCheck"
			})
      	#jscode()
		function getSelectedNodes(){
			Horn.getComp("select_tree").getSelectedNodes();
		}
		#end
     */
	getSelectedNodes: function(){
    	var check = this.hidden.attr("checkMode");
		if(!check || check=="radio"){
    		return this.treeObj.getSelectedNodes();
    	}else{
    		return this.treeObj.getCheckedNodes();
    	}
	},
     /**
     * 获取下拉树的值列表
     * @function
     * @name Horn.SelectTree#getValue
     * @param 
     * @return {String} 返回树节点的id值
     * 
     */
    getValue : function() {
        var input = this.get();
        var treeNodeidString= input.val();
        return treeNodeidString;
    },
    /**
     * 获取节点名称值
     * @function
     * @name Horn.SelectTree#getText
     * @param 
     * @return {String} 返回树节点的名称值
     * 
     */
    getText : function() {
    	 var input = this.field;
        var texts= input.attr("selectnodes");;
        return texts;
    },
    /**
     * 获取节点的父id值
     * @function
     * @name Horn.SelectTree#getPid
     * @param 
     * @return {String} 返回树节点的pId值
     * 
     */
    getPid : function() {
    	 var input = this.field;
         var pIds= input.attr("pIds");;
         return pIds;
    }
}) ;
Horn.Field.regFieldType("div.hc_select-tree",Horn.SelectTree) ;
/**
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * 2014-12-25     zhangsu        BUG #8454 tabpanel在通过addtab方法增加页签时，如果设置了width,能用省略号显示，tip移上去显示全部
 * 2014-12-25     zhangsu        BUG #8414 谷歌浏览器下，tabpanel页签展现方向为纵向是，title的高宽没有计算在
 * 2015-03-13     zhangsu        STORY #11042 [财富管理事业部-陈为][TS:201503130069]-JRESPlus--tabpanel页面初始化的时候 加载静态tab页签会初始化两次页签
 * 2015-09-29     周智星          STORY #13326 window中若是放入tabpanel，tab默认打开页无法显示
 */
/**
 * @name Horn.TabPanel
 * @class  Horn.TabPanel
 * 多标签页组件</br>
 * 适用于分组或分类信息的容器，将内容按照分组或分类方式放到不同的标签页区域中，当前可视的仅有一个，其他的页签内容
 * 可以通过点击对应的页签激活展示
 */
/** @lends Horn.TabPanel# */
	 
	 
/**
 * 组件的唯一标示<br/>
 * 此属性支持面板组件(<b>tab_panel</b>,<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>id</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 组件的名称(不能为空，不能重复)<br/>
 * 此属性支持面板组件(<b>tab_panel</b>,<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>name</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	 
/**
 * 页签的标题(可选项)<br/>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>title</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 页签的页面地址(注意！url仅支持velocity的页面（.htm）,不支持外部地址(如：htttp://www.baidu.com))<br/>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>url</b>
 * @type String
 * @default 
 * @ignore
 * @example
 * 无
 */	
 /**
 * 页签内容使用延迟加载lazy用于配置延迟加载的url<br/>
 * url只能是系统内的视图请求
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>lazy</b>
 * @type String
 * @default 
 * @example
 * #@tab_panel_content({"title":"延迟加载的标签","name":"tab1","lazy":"${appServer}/demo/tabpanel/lazy.htm"})
 * #end
 */

 /**
 * 页签标题宽度(可选项，宽度仅支持像素，如："width":"100"),如果设置了宽度，就获取其值，否则默认<br/>
 *注意：当在纵向tab页中配置或者设置width不会生效！
 * <font color=red>注意点说明：(宏(@tab_panel)和API(addTab(...))都配置width的情况下,优先获取API的值)</font><br>
 * 此属性支持面板组件(<b>tab_panel</b>)
 * @name Horn.TabPanel#<b>width</b>
 * @type String
 * @default 
 * @example
 *  #@screen()
 *   	#@tab_panel({"name":"tp","width":"150"})
 *   		#@tab_panel_content({"name":"content2","title":"页签2"})  
                #@panel({})
        			#textfield({"label":"文本框", "name":"key1","value":"","defValue":""})
        			#textfield({"label":"文本框", "name":"key1","value":"","defValue":"","readonly":"true"})
            		#label({"label":"label","name":"key5","value":"标签内容","defValue":""})
        			#textfield({"label":"文本框", "name":"key1","value":"","defValue":"","cols":"2"})
            	#end
    		#end
 *   	#end
 *  #end
 *	
 */

 /**
 * 最大页签个数(可选项，如："maxTabCn":5),如果设置了maxTabCn，就获取其值，默认值为30<br/>
 * <font color=red>注意点说明：(宏(@tab_panel)和API(addTab(...))都配置maxTabCn的情况下,优先获取API的值。一个页面标签页过多会影响性能，请合理设置maxTabCn的值)</font><br>
 * @name Horn.TabPanel#<b>maxTabCn</b>
 * @type int
 * @default 
 * @example
 * #@screen()
 *   #@panel({})
 *   	#textfield({"label":"请输入tab的名称:","name":"tabName"})
 *		#textfield({"label":"请输入tab的标题:","name":"tabTitle"})
 *   #end
 *   #button_panel_ex({"buttons":[{"label":"新增tab页","name":"btnSetTitle","event":"addTab()"}]})
 *   #@tab_panel({"name":"tp","maxTabCn":5}) ##优先获取API配置的maxTabCn的值
 *   #end
 *#end
 *#jscode()
 *	function addTab(){
 *		Horn.getComp("tp").addTab({"name":tabName,"title":Horn.getComp("tabTitle").getValue(),"maxTabCn":5,"url":"$appServer.get('/test/textfield/status_change.htm')"});
 *	}
 *#end
 * 
 */
/**
 * tabpanel页签展现方向调整,默认呈水平排列，提供纵向的左侧和右侧排列,属性值分别为：left、right(注！此属性不支持在window组件里使用)<br/>
 * @name Horn.TabPanel#<b>position</b>
 * @type String
 * @default top  tab页签呈水平排列
 * @example
 * 无
 */
/**
 * tabpanel页签的外观主题,默认是灰色主题，另外提供一套蓝色主题,属性值为blue<br/>
 * @name Horn.TabPanel#<b>themes</b>
 * @type String
 * @default gray : tab页签呈灰色 
 * @example 
 * @ignore
 * 无
 */

/**
 * @ignore
 * 提供浮动支持。若高度未设置，且设置tabFloat:true时，tabs页签部分会随窗口浮动，默认不浮动<br/>
 * @name Horn.TabPanel#<b>tabFloat</b>
 * @type boolean
 * @default 
 * @example 
 * 无
 */

/**
 * 
 * 提供高度支持。仅支持像素<br/>
 * 当高度未设置时，tab页签区域将自动扩充<br/>当高度设置固定值时，tab页签区域为设置高度<br/>
 * @name Horn.TabPanel#<b>height</b>
 * @type String
 * @default 
 * @example 
 * 无
 */
/**
 * 
 * 切换页签时是否自动校验<br/>
 * @name Horn.TabPanel#<b>isFormValidate</b>
 * @type boolean
 * @default false
 * @example 
 * 无
 */
var isFirstClick = true;
var firstTab = null;
;(function(H){
	Horn.TabPanel = Horn.extend(Horn.Base, {
		maxTabCn: 30,//最大允许页签数
		tabWidth: 121,//设置宽度后页签标题过长时会自动隐藏，默认不设置
		minTabHeight: undefined,//最小高度
		init: function(){
			Horn.TabPanel.superclass.init.apply(this,arguments);
			
			var _this = this;
			this.maxTabCn = this.params.maxTabCn ? this.params.maxTabCn : this.maxTabCn;//最大页签数
			
			var tabWidth = (this.params.width || this.tabWidth || "") + "";//页签宽度
			this.tabWidth = tabWidth.match(/[px|%]+$/) ? tabWidth : tabWidth + "px";
			
			//切换页签时是否自动校验
			this.isFormValidate = this.params["isFormValidate"] === "false" ? false : !!this.params["isFormValidate"];
			
			/**
			 * <tabPanel>
			 *     <tabsDiv>
			 *         <leftScroller></leftScroller>
			 *         <rightScroller></rightScroller>
			 *         <tabWrap>
			 *             <tabWrapUl>
			 *                 <li></li>
			 *                 ...
			 *             </tabWrapUl>
			 *         </tabWrap>
			 *     </tabsDiv>
			 *     <contentsDiv>
			 *         <tabContent></tabContent>
			 *         ...
			 *     </contentsDiv>
			 * </tabPanel>
			 * 
			 * */
			var tabPanel = this.el;
			this.tabsDiv = tabPanel.children("div.h_tabpanel-tabs");
			this.contentsDiv = tabPanel.children("div.h_tabpanel-contents");
			this.tabWrap = this.tabsDiv.children("div.h_tabpanel-wrap");
			this.tabWrapUl = this.tabWrap.children("ul");
			this.leftScroller = this.tabsDiv.children(".h_tabscroller-left");
			this.rightScroller = this.tabsDiv.children(".h_tabscroller-right");
			this.topScroller = this.tabsDiv.children(".h_tabscroller-top");
			this.bottomScroller = this.tabsDiv.children(".h_tabscroller-bottom");
			
			var tempTabsUl = tabPanel.children("ul");//宏生成的临时页签
			
			//超出最大允许页签数时移除多余页签（但是不阻止组件的初始化）
			if (tempTabsUl.size() > this.maxTabCn) {
				tempTabsUl.splice(this.maxTabCn);
				Horn.Msg.alert("提示", "最多只能添加" + this.maxTabCn + "个页签！");
			}
			
			if(this.params.height&&this.params.height!=""){
				this.contentsDiv.css("height",this.params.height);
				this.contentsDiv.css("overflow","auto");
			}
			if(this.params.width&&this.params.width!=""){
				this.topScroller.css("width",this.params.width);
				this.bottomScroller.css("width",this.params.width);
			}
			//组织html
			tempTabsUl.children("li[ref]").appendTo(this.tabWrapUl).each(function(i, o){
				var tab = $(o);
				var ref = tab.attr("ref");
				var content = $("[ref_target=" + ref + "]", tabPanel);
				//若要使用BigPipe，必须提供ID
				
				var contentId = content.attr("id");
				if (!contentId) {
					contentId = Horn.id("tab-panel-content-");
					content.attr("id", contentId);
				}
					//content.appendTo(_this.contentsDiv);
				_this.contentsDiv.get(0).appendChild(content.get(0));
					//_this.contentsDiv.append(content);
					//var liWidth = _this.tabWrapUl.children("li:eq(0)").width();
					//_this.tabWrapUl.children("li").width(liWidth);
					//_this.tabWrapUl.width("auto").width(_this.tabWrapUl.width() - 1);
					//content.css("margin-" + _this.params.position, _this.tabsDiv.outerWidth());
				tab.bind("click", function(){
					//需求 #13326 window中若是放入tabpanel，tab默认打开页无法显示
					if(!isFirstClick){
						if($(this).data("content")!=firstTab.data("content")){
							_this.activate(firstTab);
							//firstTab.data("content").hide();
						}
					}
					_this.activate($(this));
				}).data({
					content: content
				}).css("width", _this.tabWidth);
				if (_this.tabWidth) {
					var icon = tab.children(".h_tab-icon");
					var title = tab.children(".h_tab-title");
					title.css({
						width: parseInt(_this.tabWidth) - icon.outerWidth()
					});
				}
				
			});
			
			tempTabsUl.remove();
			
			this.tabChange = function(){};
			if(this.params.tabChange){
				var tabChangeObj = Horn.Util.getFunObj(this.params.tabChange);
				if($.type(tabChangeObj.fn) == "function"){
	                this.tabChange = tabChangeObj.fn ;
	            }
			}
			
			//绑定左右按钮事件
			initScrollerEvents.call(this);
			
			//初始化页签位置：上、左、右
			initTabPosition.call(this, this.params.position);
			
			//第一个页签
			firstTab = this.tabWrapUl.children("li:eq(0)");
			
			calculateScrollLength.call(this);
			
			//默认选中第一页
			firstTab.addClass("h_cur").click();
			//需求 #13326 window中若是放入tabpanel，tab默认打开页无法显示
			isFirstClick = false;
			firstTab.data("content").show();
			
			$(window).bind("resizes", function(){
				//可能情况：最初滚动按钮未显示->页签内容高度改变导致滚动条出现(如combox下拉)->触发resize事件->此时滚动按钮应显示却未显示->导致moveCenter未执行
				//所以触发resize时先进行一次定位
				locateScroller.call(_this.tabWrap);
				//当窗口大小改变导致已激活页签被遮盖时使其滚动至中间位置
				moveToCenter.call(_this, _this.getCurrentTab());
			});
			//计算左右或上下按钮的位置
			locateScroller.call(this.tabWrap);
		},
		/**
		 * 获取当前激活的tab
		 * @name Horn.TabPanel#getCurrentTab
	     * @function
		 * @param
		 * @return {激活的tab页签}
		 */
		getCurrentTab: function() {
			if(!this.currentTabName){
				var _this = this;
				this.tabWrapUl.children("li").each(function(i, o){
					var curTab = $(this).attr("class");
					if(curTab.indexOf("h_cur")>-1){
						_this.currentTabName = $(this).attr("ref");
					}
				});
				
			}
			return this.getTab(this.currentTabName);
		},
		/**
		 * 获取tab
		 * @name Horn.TabPanel#getTab
	     * @function
		 * @param {String} name tab页对应的name
		 * @return {对应的tab页签}
		 */
		getTab: function(o) {
			if ($.type(o) != "object") {
				return this.tabWrapUl.children("li[ref='" + o + "']");
			}
			return o && o.length ? o : $(o);
		},
		/**
		 * 动态添加tab
		 * 
		 * @name Horn.TabPanel#addTab
		 * @function
		 * @param {json} params 
		 * @example
		 * Horn.getComp("tp").addTab({"name":tabName,"title":tabTitle,"url":"$appServer.get('/test/textfield/status_change.htm')"})           
		 * @return {string} name tab页对应的name
		 */
		addTab : function(params) {
			if (!params.url) {
				Horn.Msg.alert("提示", "页签url必填，请检查！");
				return;
			}
			
			var _this = this;

			var maxTabCn = params.maxTabCn ? params.maxTabCn : this.maxTabCn;
			var tabWidth = params.width ? params.width : this.tabWidth || "auto";

			// 如果这个页签已存在，则仅激活它
			if (params.name && this.getTab(params.name).length) {
				this.activate(params.name);
				return;
			}

			if (this.tabWrapUl.children("li").length >= maxTabCn) {
				Horn.Msg.alert("提示", "最多只能添加" + maxTabCn + "个页签");
				return;
			}

			var tabPanel = this.el;
			var tabWrapUl = this.tabWrapUl;

			var ref = params.name || ("h_tab-uldiv-" + new Date().getTime());
			var refID = Horn.id("tab-uldiv-");

			if (!params.title) {
				params.title = "未命名页签";
			}
			var newTab = createTab(ref, params.title, tabWidth).appendTo(tabWrapUl);
			var newContent = createContent(ref, refID).appendTo(this.contentsDiv);
			newTab.data("content", newContent).click(function(){
				_this.activate($(this));
			});
			//tabpanel在通过addtab方法增加页签时，如果设置了width,能用省略号显示，tip移上去显示全部
			if (this.tabWidth) {
				var icon = newTab.children(".h_tab-icon");
				var title = newTab.children(".h_tab-title");
				title.css({
					width: parseInt(_this.tabWidth) - icon.outerWidth()
				});
			}
			//纵向 需要重新计算 width 和 margin,BUG #8414 谷歌浏览器下，tabpanel页签展现方向为纵向是，title的高宽没有计算在
			this.position =  this.params.position || "top";
			this.isVertical = this.position == "left" || this.position == "right";
			this.tabWrap.data("isVertical", this.isVertical);
			var tabWrapUl = this.tabWrapUl;
			if (this.isVertical) {
				var liWidth = tabWrapUl.children("li:eq(0)").width();
				//tabWrapUl.children("li").width(liWidth);
				//tabWrapUl.width("auto").width(tabWrapUl.width() - 1);
				this.contentsDiv.css("margin-" + this.position, this.tabsDiv.outerWidth());
			}
			//纵向 需要重新计算margin
			newContent.attr("lazyload", params.url || "");
			whenTabEdit.call(this);
			this.activate(ref);

			return ref;
		},
		/**
		 * 移除Tab
		 * 
		 * @name Horn.TabPanel#removeTab
		 * @function
		 * @param {string} name tab页对应的name
		 * @return {void}
		 */
		removeTab : function(name) {
			var tab = this.getTab(name);
			if (!tab || !tab.length) return;
			if (isActive(tab)) {//删除的是当前激活的页签
				var closestTab = getClosest(tab);
				if (!closestTab || !closestTab.length) {
					Horn.Msg.alert("提示","至少要有一个页签");
					return;
				}
				this.activate(closestTab);
			}
			tab.data("content").remove();
			tab.remove();
			whenTabEdit.call(this);
		},
		closeTab : function(name) {//推荐使用removeTab
			this.removeTab(name);
		},
		renderTab : function(content, bp) {
			content.children().remove();
			if ((bp.html && bp.html.length > 3)
					|| (bp.jsCode && bp.jsCode.length > 3)) {
				BigPipe.onArrive(bp);
				Horn.setCurrent(content);
				BigPipe.start();
				Horn.init();
			}
			content.data("loaded", true);
		},
		/**
		 * 激活一个tab
		 * @name Horn.TabPanel#activate
	     * @function
		 * @param {String} name tab页对应的name
		 * @return {void}
		 */
		activate: function(name) {
			var tab = this.getTab(name);
			if (tab && tab.length && tab.is(":visible")) {
				selectTab.call(this, tab);
			}
		},
		locate : function(o) {//推荐使用activate
			this.activate(o);
		},
		/**
		 * 启用对应的tab
		 * @name Horn.TabPanel#enable 
	     * @function
		 * @param {string} name tab页对应的name
		 * @return {void}
		 */
		enable: function(name) {
			//显示并激活
			var tab = this.getTab(name).show();
			whenTabEdit.call(this);
			this.activate(tab);
		},
		/**
		 * 禁用对应的tab
		 * @name Horn.TabPanel#disable 
		 * @function
		 * @param {string} name tab页对应的name
		 * @return {void}
		 */
		disable : function(name) {
			var tab = this.getTab(name);
			if (!tab || !tab.length) return;
			if (isActive(tab)) {//禁用的是当前激活的页签
				var closestTab = getClosest(tab);
				if (!closestTab || !closestTab.length) {
					Horn.Msg.alert("提示","至少要有一个页签");
					return;
				}
				this.activate(closestTab);
			}
			tab.hide().data("content").hide();
			whenTabEdit.call(this);
		},
		doLayout:function(){
			//当前组件布局的样式都尽可能的在css里面做掉了，JS里面只是计算滚动的距离之类的
            //重新布局的方法不需要
		}
	});
	//选中一个Tab:关键方法
	function selectTab(tab) {
		if (!tab || !tab.length) return false;
		var ref = tab.attr("ref");
		var currentTab = this.getCurrentTab();
		if (currentTab && currentTab.length) {//存在已激活的页签
			if (currentTab.attr("ref") != ref) {//当前点击的非已激活的页签
				var currentContent = currentTab.data("content");
				//执行页签改变函数（内置）
				if (!whenTabChange.call(this, currentTab, currentContent)) {
					return;
				}
				//隐藏当前页签
				currentTab.removeClass("h_cur");
				currentContent.hide();
				//触发页签改变事件（外部传入）
				this.tabChange(currentTab, tab);
			} else {//点击当前已激活的页签直接返回
				//return;
			}
		}
		
		//执行到此处只有两种情况：1）组件第一次加载，2）点击未激活的页签
		this.currentTabName = ref;
		tab.addClass("h_cur");
		var content = tab.data("content").show();
		
		//延迟加载
		var url = content.attr("lazyload");
		if (url && !content.data("loaded")) {
			var contentId = content.attr("id");
			url = (url.indexOf("?") === -1 ? url + "?" : url + "&") + "pagelet=" + contentId;
			var _this = this;
			requestPage.call(this, {
				id: contentId,
				url: url,
				content: content,
				success: function(){
					moveToCenter.call(_this, tab);
				}
			});
		} else {
			moveToCenter.call(this, tab);
		}
		
	}
	//将某个页签滚动至中间位置
	function moveToCenter(tab, noDelay) {
		var tabWrap = this.tabWrap;
		//立即完成正在执行的动画，到达最终位置
		tabWrap.stop(false, true);
		//滚动至中间位置：前提条件是页签被局部遮盖
		scroll.call(this, calculateActualScroll.call(this, tab, tabWrap), noDelay);
	}
	//判断页签是否被遮盖
	function isCoverByScroller(tab) {
		var tabOffset = tab.offset();
		var d = 8;//微调：接近遮盖时就开始滚动
		if (this.isVertical) {
			var topScroller = this.topScroller;
			var bottomScroller = this.bottomScroller;
			var tabHeight = tab.outerHeight();
			var coverByTopScroller = topScroller.is(":visible") && tabOffset.top <= topScroller.offset().top + topScroller.outerHeight() + d;
			var coverByBottomScroller = bottomScroller.is(":visible") && tabOffset.top + tabHeight + d >= bottomScroller.offset().top;
			return coverByTopScroller || coverByBottomScroller;
		} else {
			var leftScroller = this.leftScroller;
			var rightScroller = this.rightScroller;
			var tabWidth = tab.outerWidth();
			var coverByLeftScroller = leftScroller.is(":visible") && tabOffset.left <= leftScroller.offset().left + leftScroller.outerWidth() + d;
			var coverByRightScroller = rightScroller.is(":visible") && tabOffset.left + tabWidth + d >= rightScroller.offset().left;
			return coverByLeftScroller || coverByRightScroller;
		}
	}
	//计算实际滚动距离
	function calculateActualScroll(tab, tabWrap) {
		var actualScroll = 0;
		var scrollLength = tabWrap.data("scrollLength");
		if (isCoverByScroller.call(this, tab)) {
			if (this.isVertical) {
				var tabHeight = tab.outerHeight();
				var wrapHeight = tabWrap.outerHeight();
				var p1 = tab.position().top;//当前位置
				var p2 = (wrapHeight - tabHeight) / 2;//居中时的位置
				var scrollTop = this.tabWrap.scrollTop() + p1 - p2;//理论滚动值
				actualScroll = scrollTop + wrapHeight > scrollLength ? (scrollLength - wrapHeight) : scrollTop;//实际滚动值
			} else {
				var tabWidth = tab.outerWidth();
				var wrapWidth = tabWrap.outerWidth();
				var p1 = tab.position().left;//当前位置
				var p2 = (wrapWidth - tabWidth) / 2;//居中时的位置
				var scrollLeft = this.tabWrap.scrollLeft() + p1 - p2;//理论滚动值
				actualScroll = scrollLeft + wrapWidth > scrollLength ? (scrollLength - wrapWidth) : scrollLeft;//实际滚动值
			}
		} else {
			actualScroll = this.isVertical ? tabWrap.scrollTop() : tabWrap.scrollLeft();
		}
		return actualScroll;
	}
	
	//计算滚动距离->滚动->滚动按钮是否显示
	function scroll(distance, noDelay) {
		if (this.isVertical) {
			scrollTop.call(this.tabWrap, distance, noDelay);
		} else {
			scrollLeft.call(this.tabWrap, distance, noDelay);
		}
	}
	function scrollLeft(distance, noDelay) {
		var wrapWidth = this.outerWidth();
		var scrollLength = this.data("scrollLength");
		distance = distance != undefined ? distance : this.scrollLeft();
		distance = distance + wrapWidth > scrollLength ? (scrollLength - wrapWidth) : distance;
		this.animate({//动画
			scrollLeft: distance
		}, noDelay ? 0 : 250, function(){
			locateScroller.call($(this));
		});
	}
	function scrollTop(distance, noDelay) {
		var scrollLength = this.data("scrollLength");
		var wrapHeight = this.outerHeight();
		distance = distance != undefined ? distance : this.scrollTop();
		distance = distance + wrapHeight > scrollLength ? (scrollLength - wrapHeight) : distance;
		this.animate({//动画
			scrollTop: distance
		}, noDelay ? 0 : 250, function(){
			locateScroller.call($(this));
		});
	}
	//根据滚动总宽度和当前滚动位置确定滚动按钮是否显示
	function locateScroller() {
		if (this.data("isVertical")) {//垂直方向
			var topScroller = this.siblings(".h_tabscroller-top");
			var bottomScroller = this.siblings(".h_tabscroller-bottom");
			
			var scrollTop = this.scrollTop();
			//控制上侧滚动按钮显示
			if (scrollTop == 0) {
				topScroller.hide();
			} else {
				topScroller.show();
			}
			//控制下侧滚动按钮显示
			if ((scrollTop + this.outerHeight()) < this.data("scrollLength")) {
				bottomScroller.css("top",135);
				bottomScroller.show();
			} else {
				bottomScroller.hide();
			}
		} else {//水平方向
			var leftScroller = this.siblings(".h_tabscroller-left");
			var rightScroller = this.siblings(".h_tabscroller-right");
			
			var scrollLeft = this.scrollLeft();
			//控制左侧滚动按钮显示
			if (scrollLeft == 0) {
				leftScroller.hide();
			} else {
				leftScroller.show();
			}
			//控制右侧滚动按钮显示
			if ((scrollLeft + this.outerWidth()) < this.data("scrollLength")) {
				rightScroller.show();
			} else {
				rightScroller.hide();
			}
		}
	}
	//计算可滚动距离
	function calculateScrollLength() {
		var v = this.isVertical;//是否垂直方向
		var tabWrap = this.tabWrap;
		var tabWrapUl = tabWrap.children("ul");
		var tabsTotalLength = 0;
		tabWrapUl.children("li:visible").each(function(i, o) {
			var $this = $(this);
			var margin,size;
			if (v) {
				margin = parseInt($this.css("margin-top")) + parseInt($this.css("margin-bottom"));
				size = $this.outerHeight();
			} else {
				margin = parseInt($this.css("margin-left")) + parseInt($this.css("margin-right"));
				size = $this.outerWidth();
			}
			tabsTotalLength += size + margin;
		});
		tabsTotalLength += (v ? 20 : 40);//边距
		tabWrap.data("scrollLength", tabsTotalLength);
		return tabsTotalLength;
	}
	//初始化滚动按钮事件
	function initScrollerEvents() {
		var tabWrap = this.tabWrap;
		this.leftScroller.click(function(){
			scrollLeft.call(tabWrap, tabWrap.scrollLeft() - 150);
		});
		this.rightScroller.click(function(){
			scrollLeft.call(tabWrap, tabWrap.scrollLeft() + 150);
		});
		this.topScroller.click(function(){
			scrollTop.call(tabWrap, tabWrap.scrollTop() - 104);
		});
		this.bottomScroller.click(function(){
			scrollTop.call(tabWrap, tabWrap.scrollTop() + 104);
		});
	}
	//是否为激活状态
	function isActive(tab) {
		return tab.hasClass("h_cur");
	}
	//获得最近的一个tab（从后开始获取）
	function getClosest(jq) {
		if (!jq || !jq.length) return undefined;
		var closest = jq.nextAll(":visible:first");
		return closest.length ? closest : jq.prevAll(":visible:first");
	}
	//请求页面
	function requestPage(params) {
		var _this = this;
		$.ajax(params.url, {
			type : "get",
			error : function(xhr, textStatus, errorThrown) {
				_this.renderTab(params.content, {html: "",id: params.id || "",css: [],js: [],jsCode: ""});
				if (params.callback) {
					params.callback();
				}
			},
			success : function(reqData, textStatus, jqXHR) {
				_this.renderTab(params.content, eval("(" + reqData + ")"));
				if (params.success) {
					params.success();
				}
				if (params.callback) {
					params.callback();
				}
			}
		});
	}
	//页签改变：校验当前页签表单
	function whenTabChange(tab, content) {
		if (!this.isFormValidate) {
			
			return true;
		}
		//如果当前页签校验失败，不允许切换
		if (!Horn.Validate.isFormValidate(content)) {
			var title = tab.attr('title');
			if(title!="该页签下有未验证通过的内容"){
				tab.attr('title','该页签下有未验证通过的内容').append('<span class="h_tabli-error"></span>');
			}
			tab.data("content").show();
			return false;
		}
		tab.attr('title', tab.attr('tipMsg')).find('span.h_tabli-error').remove();
		return true;
	}
	//页签状态编辑（添加、移除、启用、禁用等）：重新计算滚动距离
	function whenTabEdit() {
		calculateScrollLength.call(this);//编辑页签后，重新计算可滚动宽度
		scroll.call(this);//编辑页签后，重新计算滚动距离
	}
	//创建Tab
	function createTab(ref, title, width) {
		var tab = [];
		tab.push("<li ref=\"" + ref + "\" title=\"" + title + "\" tipMsg=\""+title+"\"");
		tab.push(" class=\"h_tabpanel-wrap-li\" style=\"width:"+width+"\"><a href=\"javascript:void(0)\">");
		tab.push("<span class=\"h_tab-arrow\"></span>");
		tab.push("<span class=\"h_tab-icon\"></span>");
		tab.push("<span class=\"h_tab-title\">"+title+"</span>");
		tab.push("</a></li>");
		return $(tab.join(""));
	}
	//创建TabContent
	function createContent(ref, refID) {
		return $('<div style="display: block" class="h_tabpanel-content" ref_target="'
				+ ref + '" id="' + refID + '"></div>');
	}
	function initTabPosition(p) {
		this.position = p || this.params.position || "top";
		this.isVertical = this.position == "left" || this.position == "right";
		this.tabWrap.data("isVertical", this.isVertical);
		
		var _this = this;
		var tabWrapUl = this.tabWrapUl;
		if (this.isVertical) {
			var liWidth = tabWrapUl.children("li:eq(0)").width();
			tabWrapUl.children("li").width(liWidth);
			tabWrapUl.width("auto").width(tabWrapUl.width() - 1);
			
			this.contentsDiv.css("margin-" + this.position, this.tabsDiv.outerWidth());
		}
		
		var height = (this.params.height || "") + "";
		if (height) {
			height = height.match(/[px|%]+$/) ? height : height + "px";
			if (this.isVertical) {//只有垂直方向时需要设置头部的高度
				tabWrapUl.height(5000);
				this.tabWrap.height(parseInt(height) + 2);
			}
			/*旧版布局因为内边距的问题设置border会导致空隙*/
//			var noBorderSide = "border-" + (this.params.position || "top");
//			this.contentsDiv.addClass("h_tabpanel-border").css({
//				height: height,
//				overflow: "auto"
//			}).css(noBorderSide, "none");
			
			this.tabWrap.unbind().mousewheel(function(event, delta){
				event.preventDefault();
				var $this = $(this);
				var scrollOffset = _this.isVertical ? $this.scrollTop() : $this.scrollLeft();
				if (delta > 0) {
					scroll.call(_this, scrollOffset - 80, true);
				} else {
					scroll.call(_this, scrollOffset + 80, true);
				}
			});
		} else {
			if (this.params.tabFloat) {
				this.tabsDiv.floatTop();
			}
		}
	}
	$.extend(Horn.TabPanel, {
		DATANAME : "h_tabpanel",
		/**
		 * 获取tabpanel 提供的静态方法，此方法只针对页面只有tabpanl情况下便捷使用
		 * 
		 * @name Horn.TabPanel.get
		 * @function
		 * @param (String)name
		 *            名字
		 * @return (Object)组件对象
		 * @ignore
		 */
		get : function(name) {
			var arr = Horn.data(Horn.TabPanel.DATANAME);
			var tabPanel = arr[0];
			return tabPanel;
		},
		/**
		 * 显示对应的tab页
		 * 
		 * @name Horn.TabPanel.locate
		 * @function
		 * @param name
		 *            tab页对应的name
		 * @ignore
		 */
		locate : function(obj) {
			Horn.TabPanel.get().locate(obj);
		},
		activate : function(obj) {
			Horn.TabPanel.get().activate(obj);
		},
		/**
		 * 显示对应的tab，并且将对应tab的field设置为可用
		 * 
		 * @name Horn.TabPanel.enable
		 * @function
		 * @param name
		 *            tab页对应的name
		 * @ignore
		 */
		enable : function(obj) {
			Horn.TabPanel.get().enable(obj);
		},
		/**
		 * 隐藏对应的tab，并且将对应tab的field设置为不可用
		 * 
		 * @name Horn.TabPanel.disable
		 * @function
		 * @param name
		 *            tab页对应的name
		 * @ignore
		 */
		disable : function(obj) {
			Horn.TabPanel.get().disable(obj);
		}
	});
	Horn.regUI("div.h_tabpanel",Horn.TabPanel);
})(Horn);
(function($){
	$.extend($.fn, {
		floatLeft : function() {
			return this._float("left");
		},
		floatTop : function() {
			return this._float("top");
		},
		floatRight : function() {
			return this._float("right");
		},
		floatBottom : function() {
			return this._float("bottom");
		},
		floatCenter : function() {
			return this.floatLeft().floatTop().floatRight().floatBottom();
		},
		_float: function(side) {
			return this.each(function() {
				toFloat.call($(this), null, side);
			});
		},
		cancelFloat: function() {
			return cancelFloat.call(this);
		}
	});
	function bodySize(type) {
		var doc = document,
			client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
		if (type == "width") {
			return client.clientWidth;
		} else if (type == "height") {
			return client.clientHeight;
		}
		return undefined;
	}
	function toFloat(scrollParent, side) {
		scrollParent = scrollParent || $(window);
		var element = this;
		scrollParent.scroll($.data(this[0], "scrollOnFloat", function() {
			if (!element.data("hasFloat")) {
				initFloatData.call(element);
			}
			var body = $(this);
			var elementData = element.data(), offset = elementData.offset;
			var scrollTop = body.scrollTop(),
				scrollLeft = body.scrollLeft();
			var point,opposite = undefined;
			switch (side) {
				case "left":
					point = scrollLeft - offset.left;
					opposite = "right";
					break;
				case "top":
					point = scrollTop - offset.top;
					opposite = "bottom";
					break;
				case "right":
					point = offset.left + element.outerWidth() - scrollLeft - bodySize("width");
					opposite = "left";
					break;
				case "bottom":
					point = offset.top + element.outerHeight() - scrollTop - bodySize("height");
					opposite = "top";
					break;
				default:
					point = scrollLeft - offset.left;
					opposite = "right";
			}
			if (elementData.fixed[opposite]) return;
			if (point > 0) {
				fixToSide.call(element, side, {
					left: scrollLeft,
					top: scrollTop
				}, opposite);
			} else {
				restoreFromSide.call(element, side);
			}
		}));
	};
	function cancelFloat(sides) {
		var element = this;
		sides = sides || ["top","left","bottom","right"];
		$.each(sides, function(i, side){
			restoreFromSide.call(element, side);
		});
		$(window).unbind("resize", this.data("resizeOnFloat")).unbind("scroll", this.data("scrollOnFloat"));
	}
	function initFloatData() {
		this.data({
			hasFloat: true,
			isAbsolute: this.css("position") == "absolute",
			page: undefined,
			fixed: {},
			style: this.attr("style"),
			offset: this.offset()
		});
		var _this = this;
		$(window).resize($.data(this[0], "resizeOnFloat", function(){
			if (_this.css("position") == "fixed") {
				var copy = _this.next(), offset = copy.offset(), fixed = _this.data("fixed");
				if (!fixed.left && !fixed.right) {
					_this.css("left", offset.left);
				} else if (!fixed.top && !fixed.bottom) {
					_this.css("top", offset.top);
				}
				_this.css({
					width: copy.width()
				}).data({
					offset: copy.offset()
				});
			} else {
				_this.data({
					offset: _this.offset()
				});
			}
		}));
	}
	function fixToSide(side, scrollOffset, opposite) {
		var data = this.data(), offset = data.offset;
		var otherFixedSide = getOtherFixedSide(this, side);
		if (otherFixedSide) {
			this.css(otherFixedSide, 0);
		} else {
			if (!data.fixed[side]) {
				var width = this.outerWidth();
				if (!data.isAbsolute) {
					this.clone().css("visibility", "hidden").insertAfter(this);
				}
				this.css({
					position : "fixed",
					marginLeft: "auto",
					marginTop: "auto",
					width: width,
					zIndex:99999
				});
			}
			this.css({
				left : offset.left - scrollOffset.left,
				top : offset.top - scrollOffset.top
			});
		}
		data.fixed[side] = true;
		this.css(side, 0);
		if (opposite) {
			this.css(opposite, "auto");
		}
	}
	function restoreFromSide(side) {
		var data = this.data();
		if (data.fixed && data.fixed[side]) {
			data.fixed[side] = false;
			if (getOtherFixedSide(this, side) == undefined) {
				if (!data.isAbsolute) {
					this.next().remove();//移除克隆元素
				}
				this.removeAttr("style").attr("style", data.style);
			}
		}
	}
	function getOtherFixedSide(element, side){
		var otherFixedSide = undefined;
		var fixedData = element.data("fixed");
		for (var p in fixedData) {
			if (side != p && fixedData[p]) {
				otherFixedSide = p;
				break;
			}
		}
		return otherFixedSide;
	};
	function formatSize(size) {
		size += "";
		size = size ? size : "0px";
		size = size.replace(/^\s+|\s+$/g, "");
		return size.match(/[px|%|auto]+$/) ? size : size + "px";
	}
	function readParams(jq) {
		return jq ? Horn.paramCaches[jq.attr("paramcacheid")] || {} : {};
	}
	function getStyle(obj, attr) {
		if(obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj,false)[attr];
		}
	}
})(jQuery);
//resizes：resize事件加强
(function($,h,c){var a=$([]),e=$.resizes=$.extend($.resizes,{}),i,k="setTimeout",j="resizes",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);

/**
 * @name Horn.TargetSelect
 * @class
 * 目标选择器组件</br>
 * 此组件提供弹出目标页面功能
 */
/**
 * 组件唯一标识
 * @name Horn.TargetSelect#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.TargetSelect#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.TargetSelect#label
 * @type String
 * @default ""
 * @example
 * 无
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值</br>
  * 传入的值必须是json格式：{"label":"这里输入显示名称",key:"这里输入提交后台的id"},如：{"label":"周智星","key":"1"}
  * @name Horn.TargetSelect#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。</br>
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。</br>
  * 传入的值必须是json格式：{"label":"这里输入显示名称",key:"这里输入提交后台的id"},如：{"label":"周智星","key":"1"}
  * @name Horn.TargetSelect#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */


/**
 * 组件的跨列数，取值范围由外容器的panel的cols而定(支持1-4列)
 * @name Horn.TargetSelect#cols
 * @type int
 * @default 1
 * @example
 * 无
 */
 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Textfield#readonly
  * @type Boolean
  * @default true
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Textfield#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */
/**
 * 组件的约束检查选项
 * @name Horn.TargetSelect#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */
 /**
  * 清空值后需要callback的事件配置
  * @name Horn.TargetSelect#afterClear
  * @type String
  * @default ""
  * @example
  * #targetselect({"label":"targetselect","name":"targetselect","value":{"label":"周智星","key":"09150"},"event":"showWin()","check": "required","afterClear":"isValid"})
  * #jscode()
  *   function isValid(){
  *		Horn.getComp("clientId22").validate();
  *		alert(Horn.getComp("clientId22").isValid());
  *	  }
  * 
  * #end
  */
/**
  * 值发生改变时的事件配置
  * @name Horn.TargetSelect#onChange
  * @type String
  * @default ""
  * @example
  * #targetselect({"label":"targetselect","name":"targetselect","value":{"label":"周智星","key":"09150"},"event":"showWin()","check": "required","onChange":"change"})
  * #jscode()
  *   function change(){
  *		Horn.getComp("clientId22").validate();
  *		alert(Horn.getComp("clientId22").isValid());
  *	  }
  * 
  * #end
  */
 /**
  * 组件的事件配置
  * @name Horn.TargetSelect#event
  * @type String
  * @default ""
  * @example
  * #targetselect({"label":"targetselect","name":"targetselect","value":"","event":"showWin()","check": "required"})
  */
 /**
     * @description 获取值
     * @function
     * @name Horn.TargetSelect#getValue
     * @return 提交到后台的值，也就是{"label":"这里输入显示名称",key:"这里输入提交后台的id"}里的key值。
     * 
     */
Horn.TargetSelect = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"TargetSelect",
    field : null ,
    hidden : null ,
    name : null,
    alias : null,
    callback: null,
    init : function(dom){
        Horn.TargetSelect.superclass.init.apply(this,arguments) ;
        var _this = this ;
        this.select = this.el;
        this.hidden = this.select.children("input[type='hidden']");
        this.field = this.hidden.next();
        
        this.name = this.hidden.attr("name") ;
        this.alias = this.hidden.attr("alias") || "" ;
        if(this.params.afterClear){
        	var fn = this.params.afterClear.replace("(","").replace(")","");
        	this.callback = window[fn];
        }
        var _this = this;
        this.el.children("a").bind({
            'click' : Horn.Util.apply(_this.delVal,_this)
        });
       /* $("input[name='view_"+this.name+"']").focus(function(){
        	$("input[name='view_"+_this.name+"']").blur();
        });*/
    },
    /**
     * @description 设置值
     * @function
     * @name Horn.TargetSelect#setValue
     * @param {String} value 值 传入的值必须是json格式：{"label":"这里输入显示名称",key:"这里输入提交后台的id"},如：{"label":"周智星","key":"1"}
     * 
     */
    setValue : function(value) {
    	var oldvalue=this.getValue();
    	if(value==null||value==""){
    		this.field.val("") ;
    		this.hidden.val("") ;
    	}else{
	        if(value instanceof Object){
	        	this.field.val(value.label) ;
	        	this.hidden.val(value.key) ;
	        }else{
	        	Horn.Msg.alert("输入错误，传入的值必须是json格式：{'label':'这里输入显示名称','key':'这里输入提交后台的id'},如：{'label':'周智星','key':'1'}");
	            return;
	        }
    	}
    	if(value && value.key!=oldvalue){
	    	this.getEventTarget().trigger("change");
    	}
    	this.validate();
    },
    /**
     * @description 获取前台显示的值
     * @function
     * @name Horn.TargetSelect#getText
     * @return  {String} label 前台显示的值，也就是{"label":"这里输入显示名称",key:"这里输入提交后台的id"}里的label的值
     * 
     */
    getText : function() {
    	var val = this.field.val();
    	return val;
    },
    delVal : function(){
    	if(this.params.disabled) return;
    	var _this = this;
    	var val = this.field.val();
    	if(val!=""){
    		Horn.Msg.confirm("确认","你确定要清除该值？",function(){  
    			_this.hidden.val("");
    			_this.field.val("");
    			if(_this.callback){
    				_this.callback();
    			}
    		},function(){  
    		    //canel  
    		});
    		
    	}
    }
}) ;
Horn.Field.regFieldType("div.hc_inputsearch",Horn.TargetSelect) ;

/**
 * @name Horn.Textarea
 * @class
 * 普通文本输入组件
 */
/**
 * @lends Horn.Textarea#
 */
	 
/**
 * 组件唯一标识
 * @name Horn.Textarea#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Textarea#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作。
 * @name Horn.Textarea#maxlength
 * @type int
 * @default ""
 * @example
 * #textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required", "maxlength":100})
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Textarea#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Textarea#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 文本域显示行数(也就是高度，默认是34像素)。如果设置了rows属性，就必须把这个组件在panel组件中独自一行，否则布局会乱。
 * @name Horn.Textarea#rows
 * @type String
 * @default ""
 * @example
 * #@panel({"cols":2})
 * 	##这里的布局是两列，所以textarea的cols属性要设置为2（也就是占2列）
 * 	#textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 2, "check": "required", "rows":2})
 * #end
 * #@panel({"cols":3})
 * ##这里的布局是三列，所以textarea的cols属性要设置为2（也就是占3列）
 * 	#textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required", "rows":1})
 * #end
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Textarea#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Textarea#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Textarea#defValue
  * @type String
  * @default 无
  * @example
  * #textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required"})
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Textarea#readonly
  * @type Boolean
  * @default false
  * @example
  * #textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required","readonly":true})
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Textarea#disabled
  * @type Boolean
  * @default false
  * @example
  * #textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required", "disabled":true})
  */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)
  * @name Horn.Textarea#emptyText
  * @type String
  * @default ""
  * @example
  * #textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required", "disabled":true,"emptyText":"请输入..."})
  */
/**
 * 组件的跨列数，取值范围由外容器的面板(panel)的cols而定
 * @name Horn.Textarea#cols
 * @type int
 * @default 1
 * @example
 * #textarea({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required"})
 */

/**
 * 组件的约束检查选项
 * @name Horn.Textarea#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Textarea#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

 /**
  * 组件的事件配置
  * @name Horn.Textarea#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 是否隐藏组件
  * @name Horn.Textarea#hidden
  * @type Boolean
  * @default false
  * @example
  * #textarea({"name":"test12", "label":"textarea","value":"的撒范德萨发地方大发达dsafdsafdsaf的撒范德萨大发发达dafdsaf的撒范德萨发", "defValue": "textarea默认值", "maxlength": 10, "cols": 1, "check": "required","hidden":true})
  */
/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Textarea#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Textarea#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Textarea#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Textarea#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Textarea#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Textarea#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Textarea#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Textarea#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Textarea#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Textarea#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Textarea#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Textarea#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Textarea#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Textarea#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Textarea#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Textarea#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Textarea#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Textarea#validate
 */
;{};
/**
 * @name Horn.Textfield
 * @class
 * 普通文本输入组件
 */
/**
 * @lends Horn.Textfield#
 */
	 
/**
 * 组件唯一标识
 * @name Horn.Textfield#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Textfield#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Textfield#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Textfield#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Textfield#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Textfield#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Textfield#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Textfield#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Textfield#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的面板(panel)的cols而定
 * @name Horn.Textfield#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Textfield#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Textfield#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作。
 * @name Horn.Textfield#maxlength
 * @type Number
 * @default 
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Textfield#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 是否隐藏组件
  * @name Horn.Textfield#hidden
  * @type Boolean
  * @default false
  * @example
  * #textfield({"name":"test11", "label":"textfield","value":"dsafdsafdsaf的撒范德萨大发发达dafdsaf的撒范德萨发", "defValue": "textfield默认值", "maxlength": 10, "cols": 1, "check": "required","hidden":true})
  */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Textfield#emptyText
  * @type String
  * @default ""
  * @example
  * #textfield({"label":"客户编号","name":"clientId","value":"", "check": "required","emptyText":"请输入客户ID"})
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Textfield#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Textfield#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Textfield#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Textfield#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Textfield#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Textfield#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Textfield#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Textfield#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Textfield#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Textfield#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Textfield#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Textfield#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Textfield#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Textfield#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Textfield#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Textfield#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Textfield#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Textfield#validate
 */
;{};
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
/**
 * 修改记录
 * 2015-09-09               zhangsu        STORY #12305 TS:201507290161-JRESPlus-资产管理事业部-张翔-Typefield组件的验证会错位
 * 2015-10-30               周智星         STORY #14592 【TS:201510300234-JRESPlus-财富管理事业部-虞凯 添加支持负数金额
 * 2015-12-04               周智星         需求 #15026 【TS:201511240583-JRESPlus-资产管理事业部-张翔-1.typefield金额类型的，小数点目前只保留两位数，希望可以根据配置来决定保留几位数
 * 2015-12-23               周智星         STORY #15410 【TS:201512040007-JRESPlus-财富管理事业部-王瑞明 当typefield控制为金额类型时录入1.00 会自动把.00去掉 请修复该问题
 * 2016-1-14                刘龙             需求15324 金额控件suffixNum&quot;:3，保留3为小数，此时输入框中输入1.0000，tip显示为1元零，需要优化
 * 2016-1-14                刘龙             bug 13928 typefield控件inputType属性设置为cardNo后，建议不能输入小数点
 * 2016-3-7                 刘龙             需求#17546 【TS:201603010010-JRESPlus-财富管理事业部-王一俊-【项目名称】HUNDSUN另类投资管理系统软件V4.0<br】
 * 2016-3-11                刘龙             需求#17802 【TS:201603100429-JRESPlus-财富管理事业部-虞凯-<br><br><br><br>【项目名称】HUNDSUN
 */
/**
 * @name Horn.TypeField
 * @class
 * 支持金额、卡号输入类型的input组件
 */
/**
 * @lends Horn.Textfield#
 */
	 
/**
 * 组件唯一标识
 * @name Horn.TypeField#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.TypeField#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.TypeField#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.TypeField#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */	 
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.TypeField#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.TypeField#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.TypeField#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.TypeField#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.TypeField#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的panel的cols而定(支持1-4列)
 * @name Horn.TypeField#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.TypeField#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.TypeField#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作。
 * 组件失去焦点时，会自动加上显示分隔符，分隔符不进行字符计数，只统计数字长度。
 * @name Horn.TypeField#maxlength
 * @type Number
 * @ignore
 * @default 
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.TypeField#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.TypeField#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.TypeField#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.TypeField#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.TypeField#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.TypeField#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.TypeField#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.TypeField#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.TypeField#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.TypeField#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.TypeField#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.TypeField#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.TypeField#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.TypeField#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.TypeField#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.TypeField#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.TypeField#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.TypeField#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.TypeField#validate
 */
/**
  * 是否隐藏组件
  * @name Horn.TypeField#hidden
  * @type Boolean
  * @default false
  * @example
  * #typefield({"check": "required;","value":"-3333.3392","defValue":"11111","maxlength":" ","id":"t2","name":"typefield2","label":"测试金额测试金额测试金额测试金额测试金额测试金额", "cols":1,"split":",","bigTips":true,"suffixNum":"5","hidden":true})
  */
/**
 * typefield的输入数据的类型，可配置为money和cardNo（分别代表金额和卡号输入的类型），其他值暂时不能支持(该值默认值money，如果不需要请使用textfield)
 * @name Horn.TypeField#inputType
 * @type String
 * @default "money"
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","inputType":"cardNo"})
 */
/**
 * 是否开启typefield的大tips展示，如果开启会影响所占行的布局，建议放在该行的最右面，并且设置初始值
 * @name Horn.TypeField#bigTips
 * @type boolean
 * @default false
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","bigTips":true})
 */
/**
 * 设置显示的分隔符,如果inputType为cardNo，此配置不可用
 * @name Horn.TypeField#split
 * @type String
 * @default ","
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","bigTips":true})
 */
/**
 * 小数点后缀保留几位数，默认保留两位（对金额类型有效）
 * @name Horn.TypeField#suffixNum
 * @type int
 * @default 2
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","suffixNum":3})
 */
/**
 * 整数位数需要保留几位数，默认对整数位数不做限制（对金额类型有效）
 * @name Horn.TypeField#integerNum
 * @type int
 * @default null
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","integerNum":3})
 */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.TypeField#emptyText
  * @type String
  * @default ""
  * @example
  * #typefield({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required", "disabled":true,"emptyText":"请输入..."})
  */
Horn.TypeField = Horn.extend(Horn.Field, {
		regChars : "-0123456789",
		suffixNumber:2,
		init : function(dom) {
			Horn.TypeField.superclass.init.apply(this, arguments);
			this.params.inputType = this.params.inputType ? this.params.inputType:"money";
			//BUG #9566 TypeField--属性split设置为其他，不显示设置分隔符，仍然为逗号
			this.config = {};
			//****修改大文字的信息提示为可配置，默认不开启
			// $.extend(this.config,this.params);
			this.config.bigTips = this.params.bigTips || false;
			if(this.params.split == ""){
				this.config.split = this.params.split
			}else{
				this.config.split = this.params.split || ",";
			}
			//需求 #15026 【TS:201511240583-JRESPlus-资产管理事业部-张翔-1.typefield金额类型的，小数点目前只保留两位数，希望可以根据配置来决定保留几位数
			if(this.params.suffixNum){
				var temp=/^\d+(\.\d+)?$/;
				if(temp.test(this.params.suffixNum)){
					this.suffixNumber = this.params.suffixNum;
				}
			}
			if(this.params.integerNum){
				this.integerNum = this.params.integerNum;
			}
			var that = this;
			
			//绑定 key press 事件
			this.field.bind({'keypress':Horn.Util.apply(that.onKeyPress,that)});
			//BUG #9554 inputType 设置为cardNo后，显示时焦点一移入就会显示空白tip
			var tipLabel = this.el.find("div.u-typefield-tip").appendTo($("body")).html(this.params.value || "");
			var tipDiv = "";
			if(this.field.width()&& this.field.width()>0){
				tipDiv = this.el.find("div.u-typefield-capital").width(this.field.width());
			}else{
				tipDiv = this.el.find("div.u-typefield-capital").css('width','100px');
			}
			  
			//this.field.parent("div").css({"float":"left"})

			this.tipLabel = tipLabel;
			this.tipDiv = tipDiv;
			
			//金额录入组件(支持返显中文)
			//增加一个配置型对输入类型进行识别，inputType="money"或者inputType="cardNo"
			if(this.params.inputType==="money"){
				 //校验输入属性
				 this.maskRe = new RegExp("[" + this.regChars +"\.]");
				 this.check = "decmal1;";
                 this.initProcess();
			}else if(this.params.inputType==="cardNo"){
				this.maskRe = new RegExp("[" + this.regChars +"]");
				this.check = "num;";
				this.initProcess();
			}else{
				return;
			}
			//resize
			$(window).resize(function(){
				tipLabel.hide();
			});
			
			var rv = this.getIEVersion();
			if(rv!=-1&&rv<10){
				if(this.params.emptyText&&this.params.emptyText!=""){
					this.field.val(this.params.emptyText);
				}
			}
		},
		/**
		 * BUG #9546
		 */
		setValue:function(value){
			value = value+"";
			if(value!=null&&value!=""){
				value = value+"";
	        	value = value.replace(/(^\s*)|(\s*$)/g,'');
	        }
			var hidden = this.hidden;
			var field = this.field;
			
			if (value === undefined || value === null||value == ""){
				field.val("");
	            hidden.val("");
	            this.tipLabel.html("");
				this.tipDiv.html("");
	            // return false;
			}else{
				
				if(value.indexOf(".")==0){
					value = "0"+value;
				}
				
				var firstChar = value.substring(0,1);
				//hidden's value without split !
				// value = value.replace(new RegExp("["+this.config.split+"||\s||^[0-9\.]]","g"),"");
				value = value.replace(/[^0-9\.-]/g,"")//支持负数 20151030 add by周智星
				
				hidden.val(value);
				this.changeTipsVal(value);

				var formatValue,CHValue = "";
				if(this.params.inputType == "money"){
					formatValue = spliteByChar(value,this.config.split,this.suffixNumber,this.integerNum);
					if(firstChar=="-"){
						formatValue = firstChar+formatValue;
					}
					field.val(formatValue);
				}else if(this.params.inputType == "cardNo"){
					if(value!=null&&value!=""){
						if(value.indexOf(".")!=-1){
							value = value.split(".")[0];
						}
					}
					var v = value,tmpStr = "";
					formatValue = v?v.match(/\d{1,4}/g).join("  "):"";
					field.attr("value",formatValue);
					//field.attr("title",formatValue);
					field.val(formatValue);
				}
			}
			if(value!=null&&value!=""){
				this.validate();
			}
		},
		/**
		 * 
		 */
		getValue:function(){
			var val = this.hidden.val();
	         if(val!=null&&val!=""){
	        	 val =val+"";
	         	val = val.replace(/(^\s*)|(\s*$)/g,'');
	         }
			return val ;
		},
		/**
		 * private
		 */
		onKeyPress : function(e){
	        var k = e.keyCode;
	        var cc = String.fromCharCode(k);
	        if(!this.maskRe.test(cc)){
	           /*if ( e && e.preventDefault ) {
	                e.preventDefault();
	            } else {
	               window.event.returnValue = false;
	           }*/
	        	// Horn.Util.stopPropagation(e);
	         //    return false;
	        }
		},
		showBigtips : function(){
			var w = this.field.width(),
			h = this.field.outerHeight();
			this.tipLabel.css({"top":this.field.offset().top+h,"left":this.field.offset().left,"z-index":9999}).show();
		},
		hideBigtips : function(){
			this.tipLabel.hide();
		},
	    initProcess : function(){
	    	var that = this;
	    	var tipLabel = this.tipLabel;

			//if default value
			//BUG #9559 textField_reset()重置有问题
			if(this.params.value && /^[\d|\.-]*$/.test(this.params.value)){//支持负数 20151030 add by周智星
				this.setValue(this.params.value);
			}else{
				this.params.value="";
				this.setValue("");
			}

			if(this.params.defValue && /^[\d|\.-]*$/.test(this.params.defValue)){//支持负数 20151030 add by周智星
				//defValue
			}else{
				this.params.defValue="";
			}
			
			//用户的输入类型判断为金额输入，产生一个绝对定位的输入框在下面
			this.field.focusin(function(){
				$(this).val(that.hidden.val())
				if(that.params.bigTips==true &&  that.hidden.val() && that.hidden.val()!="") {
					that.showBigtips();	
				};
			});
			
			this.field.focusout(function(){
				that.hideBigtips();
				that.setValue(that.hidden.val());
			});
			
			this.field.keyup(function(e){
				that.changeTipsVal($(this).val())
				if(that.hidden.val()&& that.hidden.val()!=""){
					if(that.params.bigTips==true){
						that.showBigtips();
					}
				}else{
					that.hideBigtips();
				}
			});
	    },
	    //BUG #9569 typeField_的inputType"为"money"时,event属性配置的事件不会触发
	    changeTipsVal:function(value){
			//hidden's value without split !
			// value = value.replace(new RegExp("["+this.config.split+"|\s]","g"),"");
			var firstChar = value.substring(0,1);
			
	    	value  = value.replace(/[^0-9\.-]/g,"");//支持负数 20151030 add by周智星
	    	//bug 13928 typefield控件inputType属性设置为cardNo后，建议不能输入小数点
	    	if(this.params.inputType == "cardNo"){
	    		if(value!=null&&value!=""){
					if(value.indexOf(".")!=-1){
						value = value.split(".")[0];
					}
				}
	    	}
			//value  = (value=="" || value==null) ? "":parseFloat(value)+"";
	    	//STORY #15410 【TS:201512040007-JRESPlus-财富管理事业部-王瑞明 当typefield控制为金额类型时录入1.00 会自动把.00去掉 请修复该问题
	    	if(value=="" || value==null){
				var endVal = value.split(".");
				if(endVal && endVal.length > 1){
					var tmp = parseFloat(endVal[1]).toFixed(this.suffixNumber);
					if(tmp!=0){
						value = parseFloat(value).toFixed(this.suffixNumber);
					}
				}
			}
			this.hidden.val(value)
			var formatValue,CHValue = "";
			if(this.params.inputType == "money"){
				//17802 【TS:201603100429-JRESPlus-财富管理事业部-虞凯-<br><br><br><br>【项目名称】HUNDSUN
				var arrNum=value.split(".");
				if(arrNum.length>0){
					var integerNum=arrNum[0].substr(0,this.integerNum);
					if(arrNum.length>1){
						value=integerNum+"."+arrNum[1]
					}else{
						value=integerNum
					}
					this.hidden.val(value) 
				}
				if(value.split(".")[1] && value.split(".")[1].length > 2){
					value = parseFloat(value).toFixed(this.suffixNumber);
					this.hidden.val(value);
				}
				formatValue = spliteByChar(value,this.config.split,this.suffixNumber,this.integerNum);
				
			    CHValue = numtochinese(value + "",this.suffixNumber);
				this.tipLabel.html(CHValue);
				this.tipDiv.html(CHValue);
				this.tipDiv.attr("title",CHValue);
			}else if(this.params.inputType == "cardNo"){
				var v = value,tmpStr = "";
				formatValue = v?v.match(/\d{1,4}/g).join("  "):"";
				tmpStr = v?v.match(/\d{1,4}/g).join(""):"";
				this.tipLabel.html(formatValue);
			}
	    }
	});
	Horn.Field.regFieldType("div.hc_textfield.typefield",Horn.TypeField) ;
	
    function isSpecialKey(k,e){
    	return (e.type == 'keypress' && e.ctrlKey) || 
       (k >= 33 && k <= 40) ||  // Page Up/Down, End, Home, Left, Up, Right, Down
        k == 13 ||              //enter return
        k == 9 ||               //Tab
        k == 27||(k == 8) || // Backspace
        (k >= 16 && k <= 20) || // Shift, Ctrl, Alt, Pause, Caps Lock
        (k >= 44 && k <= 46);   // Print Screen, Insert ;
    	
    }
	//格式化金额显示
	//BUG #9538 TypeField_value属性
	//BUG #9543 TypeField--金融类型输入组件-属性split
	function spliteByChar(val,s,suffixNumber,integerNum){
		var firstChar = val.substring(0,1);//获取第一个字符
		if(firstChar=="-"){
			val = val.substring(1);
		}
		var v = val,
			vArr = v.split("."),
			v0 = vArr[0],
			tmpStr = "";
		
		v0=v0.replace(/\D{1}/g,"");
		
		if(!v0) return;
		//17802 【TS:201603100429-JRESPlus-财富管理事业部-虞凯-<br><br><br><br>【项目名称】HUNDSUN
		v0=v0.substr(0,integerNum);
		$.each(v0.reverse().match(/\d{1,3}/g).reverse(),function(i,o){
			tmpStr+=o.reverse()+s;
		})
		//17546 【TS:201603010010-JRESPlus-财富管理事业部-王一俊-【项目名称】HUNDSUN另类投资管理系统软件V4.0<br】 
		if(s!=""){
			tmpStr=tmpStr.replace(new RegExp("["+s+"]$"),"");
		}		
		var reuslt = tmpStr+(vArr.length>1 ? "."+vArr[1].substr(0,suffixNumber):"");
		
		return reuslt
	}

	/*
	 * 功能：将货币数字（阿拉伯数字）(小写)转化成中文(大写）
	 * 参数：Num为字符型,小数点之后保留两位,例：Arabia_to_Chinese("1234.06") 说明：1.目前本转换仅支持到 拾亿（元）
	 * 位，金额单位为元，不能为万元，最小单位为分 2.不支持负数
	 */
	function numtochinese(Num,suffixNumber) {
		for (i = Num.length - 1; i >= 0; i--) {
			Num = Num.replace(",", "")// 替换tomoney()中的“,”
			Num = Num.replace(" ", "")// 替换tomoney()中的空格
		}
		Num = Num.replace("￥", "")// 替换掉可能出现的￥字符
		if (isNaN(Num)) {
			// 验证输入的字符是否为数字
//			alert("请检查小写金额是否正确");
			return;
		}
		// ---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
		var part = String(Num).split(".");
		var newchar = "";
		// 小数点前进行转化
		for (i = part[0].length - 1; i >= 0; i--) {
			if (part[0].length > 17) {
//				alert("");
				return "位数过大，无法计算";
			}// 若数量超过拾亿单位，提示
			var tmpnewchar = ""
			var perchar = part[0].charAt(i);
			switch (perchar) {
			case "0":
				tmpnewchar = "零" + tmpnewchar;
				break;
			case "1":
				tmpnewchar = "壹" + tmpnewchar;
				break;
			case "2":
				tmpnewchar = "贰" + tmpnewchar;
				break;
			case "3":
				tmpnewchar = "叁" + tmpnewchar;
				break;
			case "4":
				tmpnewchar = "肆" + tmpnewchar;
				break;
			case "5":
				tmpnewchar = "伍" + tmpnewchar;
				break;
			case "6":
				tmpnewchar = "陆" + tmpnewchar;
				break;
			case "7":
				tmpnewchar = "柒" + tmpnewchar;
				break;
			case "8":
				tmpnewchar = "捌" + tmpnewchar;
				break;
			case "9":
				tmpnewchar = "玖" + tmpnewchar;
				break;
			}
			switch (part[0].length - i - 1) {
			case 0:
				tmpnewchar = tmpnewchar + "元";
				break;
			case 1:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "拾";
				break;
			case 2:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "佰";
				break;
			case 3:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "仟";
				break;
			case 4:
				tmpnewchar = tmpnewchar + "万";
				break;
			case 5:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "拾";
				break;
			case 6:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "佰";
				break;
			case 7:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "仟";
				break;
			case 8:
				tmpnewchar = tmpnewchar + "亿";
				break;
			case 9:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "拾";
				break;
			case 10:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "百";
				break;
			case 11:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "仟";
				break;
			case 12:
				tmpnewchar = tmpnewchar + "兆";
				break;
			case 13:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "拾";
				break;
			case 14:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "百";
				break;
			case 15:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "仟";
				break;
			case 16:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "吉";
				break;
			case 17:
				tmpnewchar = tmpnewchar + "拾";
				break;
			}
			newchar = tmpnewchar + newchar;
		}
		// 小数点之后进行转化
		if (Num.indexOf(".") != -1) {
			if (part[1].length > 2) {
				//alert("小数点之后只能保留两位,系统将自动截段");
				var tempNum = parseFloat(Num);
				Num = tempNum.toFixed(suffixNumber);
				part = String(Num).split(".");
			}
			for (i = 0; i < part[1].length; i++) {
				tmpnewchar = ""
				perchar = part[1].charAt(i)
				switch (perchar) {
				case "0":
					tmpnewchar = "零" + tmpnewchar;
					break;
				case "1":
					tmpnewchar = "壹" + tmpnewchar;
					break;
				case "2":
					tmpnewchar = "贰" + tmpnewchar;
					break;
				case "3":
					tmpnewchar = "叁" + tmpnewchar;
					break;
				case "4":
					tmpnewchar = "肆" + tmpnewchar;
					break;
				case "5":
					tmpnewchar = "伍" + tmpnewchar;
					break;
				case "6":
					tmpnewchar = "陆" + tmpnewchar;
					break;
				case "7":
					tmpnewchar = "柒" + tmpnewchar;
					break;
				case "8":
					tmpnewchar = "捌" + tmpnewchar;
					break;
				case "9":
					tmpnewchar = "玖" + tmpnewchar;
					break;
				}
				if (i == 0)
					tmpnewchar = tmpnewchar + "角";
				if (i == 1)
					tmpnewchar = tmpnewchar + "分";
				newchar = newchar + tmpnewchar;
			}
		}
		//替换所有无用汉字
		while (newchar.search("零零") != -1)
			newchar = newchar.replace("零零", "零");
		newchar = newchar.replace("零亿", "亿");
		newchar = newchar.replace("亿万", "亿");
		newchar = newchar.replace("零万", "万");
		newchar = newchar.replace("零元", "元");
		newchar = newchar.replace("零角", "");
		newchar = newchar.replace("零分", "");
		
		
		newchar = newchar.replace("亿万", "亿");
		newchar = newchar.replace("兆亿", "兆");
		newchar = newchar.replace("零兆", "兆");
		newchar = newchar.replace("吉兆", "吉");
		
		

		if (newchar.charAt(newchar.length - 1) == "元"
				|| newchar.charAt(newchar.length - 1) == "角")
			newchar = newchar + "整";

		var digit = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		var _i = 0
		while(newchar.length > 0){
			if(digit.indexOf(newchar[0]) < 0){
				newchar = newchar.substr(1);
			}else{
				break;
			}
		}
		// //remove 0元
		// if(newchar.indexOf('元') ==0){
		// 	newchar = newchar.substr(1);
		// }
		// if(newchar.indexOf('整') ==0){
		// 	newchar = newchar.substr(1);
		// }
		var firstChar = Num.substring(0,1);
		if(firstChar=="-"){
			newchar = "负"+newchar;
		}
		//15324 金额控件suffixNum&quot;:3，保留3为小数，此时输入框中输入1.0000，tip显示为1元零，需要优化
		var lastChar=newchar.charAt(newchar.length-1);
		if("零" == lastChar){
			newchar=newchar.substring(0,newchar.length-1);
			newchar=newchar+"整";
		}
		return newchar;
	}

/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: Calendar.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：日期组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-04-11     周智星    BUG #6501 【calendar】如果设置了check为date，但是format:'yyyy年MM月dd日'，会造成校验失败(修改了文档说明)
 * 2014-04-16     周智星    BUG #6753 Calendar_setValue()设置了不符合日期格式的数据，也能提交
 * 2014-04-16     王玉豹    getValue方法不再调用父类，处理返回时格式化日期
 * 2014-08-12   wangyb10555		STORY #8854 [研发中心/内部需求][JresPlus][UI]日历组件中，先清空再reset设置默认值时，会无法通过校验并提示空值
 * 2014-12-05	wangyb10555		STORY #10272 [海外发展部-胡琦][TS:201411110151]-JRESPlus-ui-现在的日期控件只能选择到日，我们需要年月选择控件。
 * 2015-1-30	wangyb10555		STORY #10644 [研发中心/内部需求][JresPlus][UI][#8477]calendar只能通过下拉日期框选择，不能在输入框中输入，建议添加可编辑功能 
 * 2015-04-09	wangyb10555		STORY #11253 【TS:201504090165-JRESPlus-财富管理事业部-王一俊- JresPlus UI 日期控件问题：
 * 2015-04-16   zhangsu         BUG #9700 js中语法错误todayBtn:conf.noToday===true?false:true,多了逗号
 * 2015-12-04   周智星          需求 #15010 【TS:201511230297-JRESPlus-资产管理事业部-张翔-2.Calendar日期控件，键盘输入校验未设置，在输入之后
 * 2016-3-2     刘龙             需求17380 【TS:201602230426-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br>【产品及版本信】
 * 2016-3-11    刘龙             需求#17814 【TS:201603110065-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）【产品及版本信息】
 * 2016-3-17    刘龙            需求#17900 【TS:201603160506-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br><br>】
 * 2016-3-22    刘龙            bug#17104 需求17814--canEditable属性与focusShowCalendar属性组合失败
 * 2016-3-29    刘龙           bug#17348 需求17788--focusShowCalendar为false时，未自动根据yyyyMMdd格式进行日期校验
 * ----------------------------------------------------------------------- 
 */

/**
 * @name Horn.Calendar   
 * @class
 * 日期组件为第三方插件</br>
 */
	
/**
 * @lends Horn.Calendar#
 */

/**
 * 组件的配置选项如:日期格式，如果配置了config属性，会自动根据format格式进行日期校验,默认格式是yyyy-MM-dd,但是可以在自己的布局通过Horn.Calendar.DEFAULT_FORMAT来改变格式，如：Horn.Calendar.DEFAULT_FORMAT = 'yyyyMMdd';<br/>
 * (注意！1.如果填写了config，就不能再调用date验证规则，例如：#calendar({"label":"日期校验", "name": "test5", "value":"中文", "check": "required;date;", "config":"{format:'yyyy-MM-dd'}"})；date和config只能选择一个;<br/>
 * 2.如果没有配置"config"，也没有配置"check":"date"属性，则会自动根据:'yyyyMMdd'格式进行日期校验);<br/>
 * minDate和maxDate的配置必须为类似2012-12-09的格式;另外由于第三方组件对中文格式化的支持有限config中format不能配置有中文分隔符如yyyy年MM月;yyyyMMddHHmmss,yyyy/MM/dd HH:mm:ss<br/>
 * 用户配置的format会自动的识别，如果配置到h就会显示到选择小时的界面，如果配置到m就会显示到选择月份的界面为止;<br/>
 * 另外，用户配置的format和minDate/maxDate的格式必须一致
 * @name Horn.Calendar#<b>config</b>
 * @type String
 * @default 无
 * @example
 * 你也可以指定一个符合 ISO-8601 格式的日期时间：
 * "config":"{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd'}"
 */

/**
 * 组件唯一标识
 * @name Horn.Calendar#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Calendar#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Calendar#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Calendar#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Calendar#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Calendar#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Calendar#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Calendar#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Calendar#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的面板(panel)的cols而定
 * @name Horn.Calendar#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Calendar#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */
 /**
  * 是否隐藏组件
  * @name Horn.Calendar#hidden
  * @type Boolean
  * @default false
  * @example
  * #calendar({"label":"calendar", "name":"test16", "defValue": "", "cols": 1, "check": "required;testCheck","events":[{"event":"onkeyup","function":"keypress()"}],"hidden":true})
  */
/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Calendar#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj($obj为范围,是jquery对象或原生dom对象)中组名为group1的组件的有效性(group同名的即为同组)
 *	<div id="testCalendar1">
 *		#calendar({"label":"日期1", "name": "test1","group": "group1"})
 *		#calendar({"label":"日期2", "name": "test2","group": "group1"})
 *  </div>
 * function validateGroup1() {
 *		Horn.Validate.validateAreaByGroup($("#testCalendar1"), "group1");
 * }
 */

/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7，中文、空格、英文字母、标点都只算一个字符。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作，并且此属性对textarea无效。
 * @name Horn.Calendar#maxlength
 * @type Number
 * @default 
 * @ignore
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Calendar#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 输入框获得焦点是否弹出日历控件(默认输入框获得焦点自动弹出日历控件)；
  * 注：不建议与canEditable同时设置，若是focusShowCalendar为true，canEditable为false，输入框移入焦点，日期框无法弹出。
  * @name Horn.Calendar#focusShowCalendar
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
 /**
  * 输入框是否可编辑(默认输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期)。<br/>
  * 1.当设置为true时，输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期；2.当设置为false时，输入框不可以手工输入，点击输入框时不弹出日期选择器，点击图标可以弹出日历组件选择日期；
  * @name Horn.Calendar#canEditable
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Calendar#emptyText
  * @type String
  * @default ""
  * @example
  * #calendar({"label":"calendar", "name":"test16", "defValue": "", "cols": 1, "check": "required;","hidden":false,"config":"{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd HH:mm:ss'}","emptyText":"请输入日期"})
  */
/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Calendar#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Calendar#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Calendar#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Calendar#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Calendar#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Calendar#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Calendar#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Calendar#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Calendar#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Calendar#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Calendar#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Calendar#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Calendar#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Calendar#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Calendar#clearValue
 */

/**
 * 触发校验表单的内容，并通过返回值标识校验的结果
 * @function
 * @name Horn.Calendar#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
;(function($){
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"]
	};
}(jQuery));
Horn.Calendar = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"Calendar",
    /**
     * @description 默认日期格式
     * @field
     * @name Horn.Calendar.DEFAULT_FORMAT
     * @default yyyy-MM-dd
	 * @ignore
     */
	/**
	 * @ignore
	 */
	init : function(dom){
		Horn.Calendar.superclass.init.apply(this,arguments) ;
		var input = this.el.children("input:text") ;
		var hidden = this.el.children("input:hidden") ;
		this.name = hidden.attr("name") ;
		this.alias = hidden.attr("alias") ;
		var config = this.params.config;
		var settings = {};
		
		if (config  && typeof (config) == "string") {
			settings = eval('(' + config + ')');
		}else if(typeof (config) == "object"){
			settings = config;
		}else{
			settings = {};
		}
		this.format=settings.format;
		if(!settings.format){
			settings.format = Horn.Calendar.DEFAULT_FORMAT;
			hidden.attr("format","noConfig");//没有自定义格式
		}else{
			hidden.attr("format","yesConfig");
		}
		
		settings['btnBar'] = false;
		
		this.settings = settings;
		
		this.minDate = Horn.Util.Format.date(settings["minDate"],"yyyy-MM-dd HH:mm");
		this.maxDate = Horn.Util.Format.date(settings["maxDate"],"yyyy-MM-dd HH:mm");
		
		this.initDate = function(conf){
			//判断显示的视图
			var lformat = conf.format.toLowerCase()
			var viewNo = conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;
			
			if(viewNo === 3){
				conf.noToday=true;
			}
			
			var that = this;

			this.calobj = input.datetimepicker({
				format: conf.format,
				startDate:that.minDate,
				endDate:that.maxDate,
				language:"zh-CN",
				autoclose:true,
				minView:viewNo,
//				autoclose:false,
				startView:viewNo === 3?4:2,
				todayBtn:conf.noToday===true?false:true
			}).on("changeDate",function(e){
				var h = e.date.getHours()-8;//处理时区的差异
				e.date.setHours(h);
				var date =  e.date.format(conf.format);
				this.value = date
				that.hidden.val(date);
				if(that.params.focusShowCalendar==false || that.params.canEditable==false){
					that._inputValue=date;
				}
			}).on("hide",function(){
				input.trigger("blur");
				
				if(that._inputValue != null){
					var date;
					if(that._inputValue==""){
						date = "";
					}else{
						//判断是不是符合格式的日期显示
						date = Horn.Util.Format.date(that._inputValue,that.settings.format)
						if(that.params.focusShowCalendar==false || that.params.canEditable==false){
							date=that._inputValue;
						}
						if(date.indexOf('1899')==0){
							date=that._inputValue;
						}
					}
					
					that.hidden.val(date);
					this.value = date;
					that._inputValue = null;
				}else{
					this.value = that.hidden.val()
				}
			})
			.datetimepicker("setStartDate",that.minDate)
			.datetimepicker("setEndDate",that.maxDate);
		}
		var that = this;
		input.focus(function(){
			var _org = $(this).val();
			if (_org&&_org.indexOf("/") == -1 && _org.indexOf("-") == -1 ){
				var _ttt = Horn.Util.Format.date(_org,"yyyy-MM-dd");
				$(this).val(_ttt);
			}
			return true;
		}).keyup(function(e){
			that._inputValue = $(this).val();
			that.hidden.val($(this).val());
		}).keypress(function(e){
			that._inputValue = $(this).val();
			that.hidden.val($(this).val());
		}).blur(function(e){
			that.formatValue();
			that.validate();
		})
		var disabled = this.field.attr("disabled");
		if(disabled&&disabled=="disabled"){
			return;
		}
		var $a=input.next("i");
		var inputNotShow = input.attr("inputNotShow");
		$a.click(function(){
			var disabled = that.field.attr("disabled");
			if(disabled&&disabled=="disabled"){
				return;
			}
			input.attr("focusShowCalendar","true");
			input.attr("canEditable","true");
			input.focus();
			input.focus();
			if(inputNotShow=="false"){
				input.attr("focusShowCalendar","false");
				input.attr("canEditable","false");
			}
			
		});
		
		this.initDate(settings);
    	
        if(this.params.readonly) {
        	this.setReadonly(true);
        }
        if (this.params.disabled) {
        	this.setDisabled(true);
        }
        var val = hidden.val();
		if(val!=""){
			this.setValue(val);
		}
	},
	getEventTarget : function() {
		return this.el.children("input:text");
	},
    /**
     * @description 设置日期值
     * @function
     * @name Horn.Calendar#setValue
     * @param {String} value 日期值
     */
	setValue : function(val){
		this.field.val(val);
		this.hidden.val(val);
		//this.field.blur();
		this.validate();
	},
	getValue : function() {
        var input = this.get().val();              //解决 onchange事件下调用此方法返回的日期格式和blur之后的日期格式不一致
        if(input!=null&&input!=""){
        	input = input+"";
        	input = input.replace(/(^\s*)|(\s*$)/g,'');
        }
        if(input!= ""){
//        	input = $.calendar.formatDate(new Date(this.myFormatDate(input)),this.settings.format);
        	input = Horn.Util.Format.date(input,this.settings.format)
        }else{
        	input="";
        }
        return input;
    },

    reset : function(clear) {
        this.field.val(clear?"":this.defValue);
        this.hidden.val(clear?"":this.defHiddenValue);
        //this.field.blur();
        this.validate();
    },
    /**
     * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
     * @function
     * @name Horn.Calendar#validate
     */
    validate : function(){
    	this.removeError();
		this.err = false;
    	var valid = true;
    	var _field = this;
    	_field.formatValue();
    	var check =_field.hidden.attr("check");
    	if(check&&check.length>0&&!this.params.config){
			if(_field.calobj.val()!=""){
				var ruleSpilt = check.split(";");
				var msg = ""
				for(var i=0;i<ruleSpilt.length;i++){
					var ruleFunc = ruleSpilt[i];
					var fn = function(){};
					if(ruleFunc!=""&&ruleFunc!="Horn.Validate.validateFmt"&&ruleFunc!=Horn.Validate.REQUIRED){
						if(window[ruleFunc]){
							fn = window[ruleFunc];
							var biz_func = fn();
							if(biz_func!=true){
								valid = false;
								msg = biz_func;
								break;
							}
						}else{
							if(window.ruleFunc){
								var biz_func = ruleFunc;
								if(biz_func!=true){
									valid = false;
									msg = biz_func;
									break;
								}
							}
						}
					}
				}
				if(!valid){
					_field.showError(biz_func);
					valid = false;
					this.err = true;
					return;
				}else{
					this.removeError();
					this.err = false;
				}
			}
		}
    	
		
    	if(_field.calobj.val()!=""){
	    	if(!Horn.Util.Format.validateFmt(_field.calobj.val(),_field.settings.format)){
	    		valid = false;
				this.err = true;
				_field.showError("日期格式不正确,格式为："+_field.settings.format);
				return;
			}
    	}else{
    		
    		if(check&&check.indexOf(Horn.Validate.REQUIRED) > -1){
    			valid = false;
				this.err = true;
    			_field.showError("该输入不能为空！");
    			return;
    		}
    	}
		
    },
    formatValue : function(){
    	var that = this;
    	var val = that.hidden.val();
		if(val!=""){
			date = Horn.Util.Format.date(val,that.settings.format)	
		}else{
			date="";
		}				
		if(date.indexOf('1899')==0){
			date=that.hidden.val();
		}
		that.hidden.val(date);
		that.calobj.val(date);
		that.value = date;
    },
	isValid : function(){
    	if(this.calobj.val()==null||this.calobj.val()==""){
    		var check =this.hidden.attr("check");;
    		if(check&&check.indexOf(Horn.Validate.REQUIRED) > -1){
    			return false;
    		}else{
			return true;
    		}
		}else{
		return (Horn.Util.Format.validateFmt(this.calobj.val(),this.settings.format) && !this.err)?true:false;
		}
	},
    initEvents : function(){
    	var _field = this;
    	_field.checkRegx = [];
    	var checkStr = this.field.attr('checkstr');
    	if(checkStr) {
    		_field.checkRegx = checkStr.split(';');
    	}
    	this.field.blur(function(){
    		var format = "yyyy-MM-dd";
			if(_field.settings){
				var fm = _field.settings.format;
				if(fm){
					format = fm;
				}
			}
			var _val = $(this).val();
			if (_val!=""){
				var _ttt = Horn.Util.Format.date(_val,format);
				$(this).val(_ttt);
			}
			setTimeout(function(){
    			var check =_field.hidden.attr("check");
    			var valid = true;
    	    	if(check&&check.length>0&&!_field.params.config){
    				if(_field.calobj.val()!=""){
    					var ruleSpilt = check.split(";");
    					var msg = ""
    					for(var i=0;i<ruleSpilt.length;i++){
    						var ruleFunc = ruleSpilt[i];
    						if(ruleFunc!=""&&ruleFunc!="Horn.Validate.validateFmt"&&ruleFunc!=Horn.Validate.REQUIRED){
    							var fn = window[ruleFunc];
    							var biz_func = fn();
    							if(biz_func!=true){
    								valid = false;
    								msg = biz_func;
    								break;
    							}
    						}
    					}
    					if(!valid){
    						_field.showError(biz_func);
    						valid = false;
    						_field.err = true;
    						return;
    					}else{
    						_field.removeError();
    						_field.err = false;
    					}
    				}
    			}
    	    	
    			if(_field.calobj.val()!=""){
		    		if(!Horn.Util.Format.validateFmt(_field.calobj.val(),_field.settings.format)){
		    			_field.showError("日期格式不正确,格式为："+_field.settings.format);
		    		}else{
		    			_field.removeError();
		    			Horn.Validate.onValid({data:[Horn.Validate,_field]});
		    		}
    			}else{
    				_field.removeError();
    				var check =_field.hidden.attr("check");
		    		if(check&&check.indexOf(Horn.Validate.REQUIRED) > -1){
		    			_field.showError("该输入不能为空！");
		    		}
    			}
    		},10);
    		
    	});
    },
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.field.attr("disabled","disabled");
			this.hidden.attr("disabled","disabled");
		}
	},
	setReadonly : function(readonly){
		Horn.Calendar.superclass.setReadonly.apply(this,arguments) ;
		
		if(this.readonly){
			this.calobj.datetimepicker('remove');
		}else{
			this.initDate(this.settings);
		}
	}
}) ;
Horn.apply(Horn.Calendar,{
	DEFAULT_FORMAT : 'yyyy-MM-dd'
});
Horn.Field.regFieldType("div.hc_calendar",Horn.Calendar) ;

/* 
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-06-10   zhangsu  STORY #8487[经纪业务事业部/胡志武][TS:201406040187]-JRESPlus-ui-日期组group在disabled的情况下还会校验是否必填
 * 2014-06-30   zhangsu  BUG #7186 calendar_group配上config属性报js错误
 * 2014-07-04   wuxl     BUG #7201#7203#7204#7209#7218#7219#7220#7221#7222#7223
 * 2014-08-12   wangyb10555     修改onchange事件绑定机制下返回日期对不一致的问题
 * 2014-08-12   wangyb10555		STORY #8854 [研发中心/内部需求][JresPlus][UI]日历组件中，先清空再reset设置默认值时，会无法通过校验并提示空值
 * 2014-08-21	wangyb10555		STORY #9486 【TS:201408200139-JRESPlus-财富管理事业部-王一俊- 关于jresplus中日期范围选择控件起始日期、截止日期必】
 * 2014-10-16	wangyb10555		BUG #7774 调用calendargroup的reset方法，会将两个日期框都重置成第一个开始日期的值 
 * 2014-12-05	wangyb10555		STORY #10272 [海外发展部-胡琦][TS:201411110151]-JRESPlus-ui-现在的日期控件只能选择到日，我们需要年月选择控件。
 * 2014-12-25   zhangsu         BUG #8454 calendargroup组件设置属性"disabled":true,属性值已设置为不可用，不会出现校验框，但是目前还是会出现红色提示框
 * 2015-1-30	wangyb10555		STORY #10644 [研发中心/内部需求][JresPlus][UI][#8477]calendar只能通过下拉日期框选择，不能在输入框中输入，建议添加可编辑功能 
 * 2015-04-08   zhangsu         STORY #11078  calendargroup.js中存在语法错误
 * 2015-11-10   周智星                           BUG #12458 需求14646--多选框单选框，check的自定义函数无法触发
 * 2015-12-04   周智星          需求 #15010 【TS:201511230297-JRESPlus-资产管理事业部-张翔-2.Calendar日期控件，键盘输入校验未设置，在输入之后
 * 2016-3-2     刘龙             需求17380 【TS:201602230426-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br>【产品及版本信】
 * 2016-3-11   刘龙                                     需求#17814 【TS:201603110065-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）【产品及版本信息】
 * 2016-3-22   刘龙               bug#17104 需求17814--canEditable属性与focusShowCalendar属性组合失败
 * 2016-3-24   刘龙              需求#17990 【TS:201603220311-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br><br>】
 * 2016-3-29   刘龙             bug#17350 手动清空calendargroup日期组件值失败
 * ----------------------------------------------------------------------- 
 */
/**
 * @name Horn.CalendarGroup   
 * @class
 * 日期组组件</br> 
 */	
	
/**
 * @lends Horn.CalendarGroup#
 */

/**
 * 组件唯一标识
 * @name Horn.CalendarGroup#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的跨列数
 * @name Horn.CalendarGroup#<b>cols</b>
 * @type Int
 * @default ""
 * @example
 * 无
 */

/**
 * 组件的开始日期名称
 * 如果需要获取整个日期组对象也是通过name1属性来获取。
 * 例如：name1=test11  Horn.getComp("test11")获取的是整个日期组对象
 * @name Horn.CalendarGroup#<b>name1</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
 /**
  * 组件的开始日期值
  * @name Horn.CalendarGroup#<b>value1</b>
  * @type String
  * @default ""
  * @example
  */
 /**
  * 如果设置了defValue1的值，重置成的defValue1值，否则重置成初始值
  * @name Horn.CalendarGroup#<b>defValue1</b>
  * @type String
  * @default ""
  * @example
  */
/**
 * 组件的结束日期名称
 * @name Horn.CalendarGroup#<b>name2</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
 /**
  * 组件的结束日期值
  * @name Horn.CalendarGroup#<b>value2</b>
  * @type String
  * @default ""
  * @example
  */
 /**
  * 如果设置了defValue2的值，重置成的defValue2值，否则重置成初始值
  * @name Horn.CalendarGroup#<b>defValue2</b>
  * @type String
  * @default ""
  * @example
  */
/**
 * 组件的显示标签
 * @name Horn.CalendarGroup#<b>label</b>
 * @type String
 * @default ""
 * @example
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.CalendarGroup#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 组件的约束检查选项
 * @name Horn.CalendarGroup#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.CalendarGroup#<b>group</b>
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */
/**
 * 组件的配置选项如:日期格式，如果配置了config属性，会自动根据format格式进行日期校验<br/>
 * (注意！1.如果填写了config，就按config格式来验证，自定义的校验函数不再执行，例如：#calendar({"label":"日期校验", "name": "test5", "value":"中文", "check": "required;date;", "config":"{format:'yyyy-MM-dd'}"})；date和config只能选择一个;<br/>
 * 2.如果没有配置"config":"{minDate:'2013-12-23',noToday:true,format:'yyyy/MM/dd'}"属性，也没有配置自定义校验方法，则会自动根据:Horn.Calendar.DEFAULT_FORMAT这个参数来进行日期校验，Horn.Calendar.DEFAULT_FORMAT参数默认格式为yyyy-MM-dd。如果不想要默认格式，可以在layout页面的尾端加上Horn.Calendar.DEFAULT_FORMAT指定格式，如#jscode()  Horn.Calendar.DEFAULT_FORMAT="yyyyMMdd"  #end，(注意!自定义方法里的校验格式必须与Horn.Calendar.DEFAULT_FORMAT的格式一直)</br>
 * 3.minDate和maxDate的配置必须为类似2012-12-09的格式;另外由于第三方组件对中文格式化的支持有限config中format不能配置有中文分隔符如yyyy年MM月;yyyyMMddHHmmss,yyyy/MM/dd HH:mm:ss)
 * 用户配置的format会自动的识别，如果配置到h就会显示到选择小时的界面，如果配置到m就会显示到选择月份的界面为止
 * 另外，用户配置的format和minDate/maxDate的格式必须一致
 * @name Horn.CalendarGroup#<b>config</b>
 * @type String
 * @default 无
 * @example
 * 你也可以指定一个符合 ISO-8601 格式的日期时间：
 * "config":"{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd'}"
 */
 /**
  * 组件的是读配置
  * @name Horn.CalendarGroup#<b>readonly</b>
  * @type String
  * @default 非只读
  * @example
  * 无
  */
 /**
  * 组件的禁用配置
  * @name Horn.CalendarGroup#<b>disabled</b>
  * @type String
  * @default 非禁用
  * @example
  * 无
  */
 /**
  * 是否隐藏组件
  * @name Horn.CalendarGroup#hidden
  * @type Boolean
  * @default false
  * @example
  * #calendar_group({"label":"calendargroup","name1": "calendargroup","value1":"","value2":"","name2": "calendargroup2","cols":1,"check": "required;testCheck","events":[{"event":"onkeypress","function":"keypress()"}],"config":{"format":"yyyy-MM-dd"},"hidden":true})
  */
 /**
  * 组件的事件配置
  * @name Horn.CalendarGroup#<b>events</b>
  * @type Array[Json
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 输入框获得焦点是否弹出日历控件(默认输入框获得焦点自动弹出日历控件)；
  * 注：不建议与canEditable同时设置，若是focusShowCalendar为true，canEditable为false，输入框移入焦点，日期框无法弹出。
  * @name Horn.CalendarGroup#focusShowCalendar
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
 /**
  * 输入框是否可编辑(默认输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期)。<br/>
  * 1.当设置为true时，输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期；2.当设置为false时，输入框不可以手工输入，点击输入框时不弹出日期选择器，点击图标可以弹出日历组件选择日期；
  * @name Horn.CalendarGroup#canEditable
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * (特别说明：emptyText必须是数组，数组的第一个元素是第一个日期输入框，第二个元素是第二个日期输入框,数组必须填写两个元素，如："emptyText":["请输入开始日期","请输入结束日期"])
  * @name Horn.CalendarGroup#emptyText
  * @type Array
  * @default []
  * @example
  * #calendar_group({"label":"calendargroup","name1": "calendargroup","value1":"","value2":"","name2": "calendargroup2","cols":1,"check": "required;testCheck","events":[{"event":"onkeypress","function":"keypress()"}],"config":{"format":"yyyy-MM-dd"},"hidden":true,"emptyText":["请输入开始日期","请输入结束日期"]})
  */
	Horn.CalendarGroup = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"CalendarGroup",
		cal1 : null,
		cal2 : null,
		hidden1 : null,
		hidden2 : null,
		name1 : null,
		name2 : null,
		calobj1 : null,
		calobj2 : null,
        defValue1 : "",
        defHiddenValue1 : "",
        defValue2 : "",
        defHiddenValue2 : "",
        //日期组的第几个元素验证无效
        inValidEle:null,
        tmpValide : "",
		/**
		 * @ignore
		 */
		init : function(dom){
			Horn.CalendarGroup.superclass.init.apply(this,arguments);
			this.el.attr("tabIndex",1000);
			var cal1 = $(this.el.find("input:text")[0]) ;
			var cal2 = $(this.el.find("input:text")[1]) ;
			var hidden1 = $(this.el.find("input[type=hidden]")[0]);
			var hidden2 = $(this.el.find("input[type=hidden]")[1]);
			
			this.name1 =  hidden1.attr("name") ;
			this.name2 =  hidden2.attr("name") ;
			this.name = this.name1 ;
			this.alias = hidden1.attr("alias") ;
			var config = this.params.config ;
			//var config = this.el.attr("config") ;
			var settings = {};
			var _this = this ;
            if(hidden1){
                this.defHiddenValue1= (this.params.defValue1 != undefined)?this.params.defValue1:hidden1.val();
            }
            if(hidden2){
                this.defHiddenValue2= (this.params.defValue2 != undefined)?this.params.defValue2:hidden2.val();
            }
            if(cal1){
                this.defValue1=(this.params.defValue1 != undefined)?this.params.defValue1:cal1.val();
            }
            if(cal2){
                this.defValue2=(this.params.defValue2 != undefined)?this.params.defValue2:cal2.val();
            }
            
            if (config  && typeof (config) == "string") {
    			settings = eval('(' + config + ')');
    		}else if(typeof (config) == "object"){
    			settings = config;
    		}else{
    			settings = {};
    		}
            this.format=settings.format;
			if(!settings.format){
				settings.format = Horn.Calendar.DEFAULT_FORMAT;
			}
			
			this.settings = settings;
			
			$.fn.isValid=function(value,format){
				return Horn.Util.Format.validateFmt(value,format)
			}
			$.fn.getDate=function(){
				return this.val();
			}
			
//			var changeEvent = (cal1.data("events") || {})["change"];
//			if (changeEvent && changeEvent.length > 0) {
//				settings['onchange'] = changeEvent[0].handler;
//			}
			settings['onchange'] = function(){
				return cal1.change && cal1.change();
			};
			if(!settings.maxDate){
				settings.maxDate = "2999/12/31";
			}
			if(!settings.minDate){
				settings.minDate = "1099/12/31";
			}
			
			this.minDate = this._formatDate(settings["minDate"]);
			this.maxDate = this._formatDate(settings["maxDate"]);

			var $a_cal1=cal1.next("i");
			var $a_cal2=cal2.next("i");
			
			var inputNotShow = cal1.attr("inputNotShow");
			$a_cal1.click(function(){
				var disabled = cal1.attr("disabled");
				if(disabled&&disabled=="disabled"){
					return;
				}
				cal1.attr("focusShowCalendar","true");
				cal1.attr("canEditable","true");
				cal1.focus();
				cal1.focus();
				if(inputNotShow=="false"){
					cal1.attr("focusShowCalendar","false");
					cal1.attr("canEditable","false");
				}
				
			});
			$a_cal2.click(function(){
				var disabled = cal1.attr("disabled");
				if(disabled&&disabled=="disabled"){
					return;
				}
				cal2.attr("focusShowCalendar","true");
				cal2.attr("canEditable","true");
				cal2.focus();
				cal2.focus();
				if(inputNotShow=="false"){
					cal2.attr("focusShowCalendar","false");
					cal2.attr("canEditable","false");
				}
				
			});
			
			
			if(!cal1.attr("readonly") || true){
				cal1.focus(function(event) {
					
					if(_this.readonly){
						return false;
					}
					
					var _org = cal1.val();
					if (_org&&_org.indexOf("/") == -1 && _org.indexOf("-") == -1 ){
						var _ttt = Horn.Util.Format.date(_org,"yyyy-MM-dd");
						cal1.val(_ttt)
					}
					
					
					
					var config1 =Horn.apply({},settings);
					var maxDate = _this._formatDate(_this.cal2.val());
					maxDate = maxDate || _this.maxDate;
					if (!_this.compareDate(_this.minDate, maxDate) || !_this.compareDate(maxDate, _this.maxDate)) {
						maxDate = _this.maxDate;
					}
					config1 = Horn.apply(config1,{
						'minDate' :  Horn.Util.Format.date(_this.minDate,"yyyy-MM-dd HH:mm"),
						'maxDate' :  Horn.Util.Format.date(maxDate,"yyyy-MM-dd HH:mm"),
						'real' : hidden1,
						'btnBar' : false,
						'onSetDate' : function(){
							setTimeout(function(){
								cal1.evented = true;
								cal1.blur() ;
							},100);
						}
					});
//					_this.calobj1 = cal1.calendar(config1);
					
					//从这里进行插件的配置
					var conf = config1;
					
					//判断显示的视图
					var lformat = conf.format.toLowerCase()
					var viewNo = conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;
					
					if(viewNo === 3){
						conf.noToday=true;
					}
					
					var that = this;
					this.config1 = conf;
					if(cal1.evented==undefined){
						_this.calobj1 = cal1.datetimepicker({
							format: conf.format,
							startDate:conf.minDate,
							endDate:conf.maxDate,
							language:"zh-CN",
							autoclose:true,
							minView:viewNo,
							startView:viewNo === 3?4:2,
							todayBtn:conf.noToday===true?false:true    //11078
						}).on("changeDate",function(e){
							var h = e.date.getHours()-8;//处理时区的差异
							e.date.setHours(h);
							var date =  e.date.format(conf.format);
							this.value = date;
							hidden1.val(date);
						}).on("hide",function(){
							if(that._inputValue1 != null){
								var date;
								if(that._inputValue1 == ""){
									date = "";
								}else{
									//判断是不是符合格式的日期显示
									date = Horn.Util.Format.date(that._inputValue1,that.config1.format)
									
									if(date.indexOf('1899')==0){
										date=that._inputValue1;
									}
								}
								
								hidden1.val(date);
								this.value = date;
								that._inputValue1 = null;
							}else{
								this.value = hidden1.val()
							}
							
							conf.onSetDate();
						}).keyup(function(){
							that._inputValue1 = $(this).val();
							hidden1.val($(this).val());
						}).keypress(function(e){
							that._inputValue = $(this).val();
							hidden1.val($(this).val());
						})
					}
					_this.calobj1
					.datetimepicker("setStartDate",conf.minDate)
					.datetimepicker("setEndDate",conf.maxDate)
					.datetimepicker("show")
					
					cal1.evented = true;
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						if(cal1.attr("placeholder")&&cal1.attr("placeholder")!=""){
							if(cal1.val()==cal1.attr("placeholder")){
								cal1.val("");
							}
						}
					}
				});
				
		    	var _field = this;
				//cal1.blur(_this.cal1Blur);
				cal1.blur(function(){
					_this.tmpValide = "";
					//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
					if(! _field.format){
						$(this).attr("format","noConfig");//没有自定义格式
					}else{
						$(this).attr("format","yesConfig");
					}
					//新增支持自定义校验函数 20151110 add by 周智星 BUG #12458 需求14646--多选框单选框，check的自定义函数无法触发
					var _calendarGroup = _this;
					_this.formatVal();
						
					if(_this.cal1.val()!=""){
						if(_this.cal2.val()==""){
							var rule2 = _this.cal2.attr("check");
			    			if(rule2 && rule2.indexOf(Horn.Validate.REQUIRED) > -1){
			    				_this.showError("当前输入不能为空");
			    				return;
			    			}
						}
						if(! _field.format){
							var _validate = Horn.Validate;
							var comp = _calendarGroup;
					        var obj = comp.cal1;
					        var rules = _validate.getRules.call(_validate, obj);
					        if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
					        	_this.tmpValide = _validate.isValide.call(_validate, rules, comp, obj.val());
					        }
					        else{
					        	_validate.removeError.call(_validate, comp);
					        }	
						}
					}else{
						var rule1 = _this.cal1.attr("check");
		    			//var rule1 =_this.params.check;
		    			if(rule1 && rule1.indexOf(Horn.Validate.REQUIRED) > -1 && (!_this.cal1.val() || !_this.cal2.val())){
		    				_this.showError("当前输入不能为空");
		    				return;
		    			}
					}
					if(_this.cal1.val()!=""){
						_this.valideDateFormat();
					}
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						var placeholder = _this.cal1.attr("placeholder");
						if(placeholder&&placeholder!=""){
							if(_this.hidden1.val()==""){
								_this.cal1.val(placeholder);
							}
						}
					}
				});
			}
			if(!cal2.attr("readonly")|| true){
				cal2.focus(function(event) {
					
					if(_this.readonly){
						return false;
					}
					
					var _org = cal2.val();
					if (_org&&_org.indexOf("/") == -1 && _org.indexOf("-") == -1){
						var _ttt = Horn.Util.Format.date(_org,"yyyy-MM-dd");
						cal2.val(_ttt)
					}
					
					var config2 =Horn.apply({},settings);
					var minDate = _this._formatDate(_this.cal1.val());
					minDate = minDate || _this.minDate;
					if (!_this.compareDate(_this.minDate, minDate) || !_this.compareDate(minDate, _this.maxDate)) {
						minDate = _this.minDate;
					}
					config2 = Horn.apply(config2,{
						'maxDate' :  Horn.Util.Format.date(_this.maxDate,"yyyy-MM-dd HH:mm"),
						'minDate' :   Horn.Util.Format.date(minDate,"yyyy-MM-dd HH:mm"),
						'real' : hidden2,
						'btnBar' : false,
						'onSetDate' : function(){
							setTimeout(function(){
								cal2.evented = true;
								cal2.blur() ;
							},10);
						}
					});
//					_this.calobj2 = cal2.calendar(config2);
					
					//从这里进行插件的配置
					var conf = config2;
					
					//判断显示的视图
					var lformat = conf.format.toLowerCase()
					var viewNo = conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;
					
					if(viewNo === 3){
						conf.noToday=true;
					}
					
					var that = this;
					that.config2 = conf;
					if(cal2.evented==undefined){
						_this.calobj2 = cal2.datetimepicker({
							format: conf.format,
							language:"zh-CN",
							autoclose:true,
							minView:viewNo,
							startView:viewNo === 3?4:2,
							todayBtn:conf.noToday===true?false:true
						}).on("changeDate",function(e){
							var h = e.date.getHours()-8;//处理时区的差异
							e.date.setHours(h);
							var date =  e.date.format(conf.format);
							this.value = date
							hidden2.val(date);
						}).on("hide",function(){
							if(that._inputValue2 != null){
								var date;
								if(that._inputValue2 == ""){
									date = "";
								}else{
									//判断是不是符合格式的日期显示
									date = Horn.Util.Format.date(that._inputValue2,that.config2.format)
									
									if(date.indexOf('1899')==0){
										date=that._inputValue2;
									}
								}
								
								hidden2.val(date);
								this.value = date;
								that._inputValue2 = null;
							}else{
								this.value = hidden2.val()
							}
							conf.onSetDate();
						}).keyup(function(){
							that._inputValue2 = $(this).val();
							hidden2.val($(this).val());
						}).keypress(function(e){
							that._inputValue2 = $(this).val();
							hidden2.val($(this).val());
						})
					}
					
					_this.calobj2
					.datetimepicker("setStartDate",conf.minDate)
					.datetimepicker("setEndDate",conf.maxDate)
					.datetimepicker("show")
					
					cal2.evented = true;
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						if(cal2.attr("placeholder")&&cal2.attr("placeholder")!=""){
							if(cal2.val()==cal2.attr("placeholder")){
								cal2.val("");
							}
						}
					}
				});
		
				cal2.blur(function(){
					_tmpValide = "";
					//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
					if(! _field.format){
						$(this).attr("format","noConfig");//没有自定义格式
					}else{
						$(this).attr("format","yesConfig");
					}
					//新增支持自定义校验函数 20151110 add by 周智星 BUG #12458 需求14646--多选框单选框，check的自定义函数无法触发
					var _calendarGroup = _this;
					//17380 【TS:201602230426-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br>【产品及版本信】
					_this.formatVal();
					
					if(_this.cal2.val()!=""){
						if(_this.cal1.val()==""){
							var rule1= _this.cal1.attr("check");
			    			if(rule1 && rule1.indexOf(Horn.Validate.REQUIRED) > -1){
			    				_this.showError("当前输入不能为空");
			    				return;
			    			}
						}
						
						if(! _field.format){
							var _validate = Horn.Validate;
							var comp = _calendarGroup;
					        var obj = comp.cal2;
					        var rules = _validate.getRules.call(_validate, obj);
					        if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
					        	_this.tmpValide = _validate.isValide.call(_validate, rules, comp, obj.val());
					        }
					        else{
					        	_validate.removeError.call(_validate, comp);
					        }
						}
					}else{
						var rule2 = _this.cal2.attr("check");
		    			if(rule2 && rule2.indexOf(Horn.Validate.REQUIRED) > -1  && (!_this.cal2.val() ||!_this.cal1.val())){
		    				_this.showError("当前输入不能为空");
		    				return;
		    			}
					}
					if(_this.cal2.val()!=""){
						_this.valideDateFormat();
					}
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						var placeholder = _this.cal2.attr("placeholder");
						if(placeholder&&placeholder!=""){
							if(_this.hidden2.val()==""){
								_this.cal2.val(placeholder);
							}
						}
					}
				});
			}
			this.cal1 = cal1;
			this.hidden1 = hidden1;
			this.cal2 = cal2;
			this.hidden2 = hidden2;
			
			if (this.params.disabled) {
	        	this.setEnable(false);
	        }
			
			if(this.params.readonly) {
	        	this.setReadonly(true);
	        }
			
			this.calobj1 = this.cal1
			this.calobj2 = this.cal2
			var rv = this.getIEVersion();
			if(rv!=-1&&rv<10){
				var placeholder = this.cal1.attr("placeholder");
				if(placeholder&&placeholder!=""){
					if(!this.params.value1||this.params.value1==""){
						this.cal1.val(this.cal1.attr("placeholder"));
					}
					if(!this.params.value2 || this.params.value2==""){
						this.cal2.val(this.cal2.attr("placeholder"));
					}
				}
			}
			var conf = this.params.config;
			if(_this.calobj1.val()!=""&&conf&&conf!=""&&!Horn.Util.Format.validateFmt(_this.calobj1.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				this.err = true;
				return;
			}
			if(_this.calobj2.val()!=""&&conf&&conf!=""&&!Horn.Util.Format.validateFmt(_this.calobj2.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				this.err = true;
			}
			//this.valideDateFormat();
		},
		getDisabled : function(_this){
			var disabled = _this.attr("disabled");
			if(disabled&&disabled=="disabled"){
				return true;
			}
			return false;
		},
		formatVal : function(){
			var _this = this;
			var val1 = _this.hidden1.val();
			var date1 = "";
			
			if(val1!=""){
				date1 = Horn.Util.Format.date(val1,_this.settings.format)	
			}				
			if(date1.indexOf('1899')==0){
				date1=val1;
			}
			_this.hidden1.val(date1);
			_this.cal1.val(date1);
			this.value = date1;
			
			var val2 = _this.hidden2.val();
			var date2 = "";
			
			if(val2!=""){
				date2 = Horn.Util.Format.date(val2,_this.settings.format)	
			}				
			if(date2.indexOf('1899')==0){
				date2=val2;
			}
			_this.hidden2.val(date2);
			_this.cal2.val(date2);
			this.value = date2;
		},
		valideDateFormat : function(){
			var vaid = true;
			var _this = this;
			var valid = true;
			var rule1 = this.cal1.attr("check");
			if(rule1&&rule1.length>0){
				if(_this.calobj1.val()==""||_this.calobj2.val()==""){
					if(rule1.indexOf(Horn.Validate.REQUIRED)>-1){
						_this.showError("该输入不能为空");
						vaid = false
						this.err = true;
						return;
					}
				}
			}
			if(rule1&&rule1.length>0&&!this.params.config){
				if(_this.calobj1.val()!=""||_this.calobj2.val()!=""){
					var ruleSpilt = rule1.split(";");
					var msg = ""
					for(var i=0;i<ruleSpilt.length;i++){
						var ruleFunc = ruleSpilt[i];
						if(ruleFunc!=""&&ruleFunc!="Horn.Validate.validateFmt"&&ruleFunc!=Horn.Validate.REQUIRED){
							var fn = window[ruleFunc];
							var biz_func = fn();
							if(biz_func!=true){
								valid = false;
								msg = biz_func;
								break;
							}
						}else{
							this.formatVal();
						}
					}
					if(!valid){
						_this.showError(biz_func);
						valid = false;
						this.err = true;
						return;
					}
				}
			}else{
				this.formatVal();
			}
			if(_this.calobj1.val()!=""&&!Horn.Util.Format.validateFmt(_this.calobj1.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				vaid = false
				this.err = true;
				return;
			}
			if(_this.calobj2.val()!=""&&!Horn.Util.Format.validateFmt(_this.calobj2.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				vaid = false
				this.err = true;
				return;
			}
			if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
					|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
					|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
		    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
				if(!_this.compareDate(_this.calobj1.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj1.getDate())){
					_this.inValidEle = _this.cal1;
				}else if(_this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj2.getDate()))){
					_this.inValidEle = _this.cal2;
				}
				vaid = false
				this.err = true;
				_this.showError("日期不在有效区间");
				return;
			} else if(_this.calobj1 && _this.calobj1.isValid(_this.calobj1.val(),_this.settings.format) && _this.calobj2 && _this.calobj2.isValid(_this.calobj2.val(),_this.settings.format) && _this.calobj1.getDate() && _this.calobj2.getDate()){
				if(_this.calobj1.getDate() && _this.calobj2.getDate() &&!_this.compareDate(_this.calobj1.getDate(), _this.calobj2.getDate())){
					vaid = false
					this.err = true;
					_this.inValidEle = _this.cal1;
	    			_this.showError("开始日期不能大于结束日期");
	    			return;
				}
			}
			if(vaid){
				this.err = false;
				_this.removeError();
			}
		},
		getEventTarget : function() {
			return this.el.find("input:text");
		},
		_formatDate : function(d){
			d = d || "";
			if (d.indexOf("/") == -1 && d.indexOf("-") == -1 && d.length >= 8) {
				return d.substring(0, 4) + "/" + d.substring(4, 6) + "/" + d.substring(6);
			}
//			return d.replace(/\//g, "-");
			return d.replace(/-/g, "/");
		},
		compareDate : function(d1, d2) {
			d1 = this._formatDate(d1);
			d2 = this._formatDate(d2);
			if (!Date.parse(d1) || !Date.parse(d2)) {
				return true;
			}
			return Date.parse(d1) <= Date.parse(d2);
		},
        /**
         * @description 设置日期对的值
         * @function
         * @name Horn.CalendarGroup#setValue
         * @param {json} {name1:value1,name2:value2} 日期值
         * @example
         * function setValue() {
		 *		Horn.getComp("test1").setValue({"test1":"20140412","test2":"20140523"});
		 *	}
         */
		setValue : function(obj){
			var _calendarGroup = this;
			this.cal1.val(obj[this.name1]);
			this.hidden1.val(obj[this.name1]);
			this.cal2.val(obj[this.name2]);
			this.hidden2.val(obj[this.name2]);
			
			this.formatVal();
			this.valideDateFormat();
		},
		
		getValue : function(){
			var _this=this;
			var input = this.get();
			var val = "";
			var x;
			$.each(input, function(i, o){
				x = $(o).val();
				//解决 onchange事件下调用此方法返回的日期格式和blur之后的日期格式不一致
				if(x){
//					x = $.calendar.formatDate(new Date(_this.myFormatDate(x)),_this.settings.format)
					x = Horn.Util.Format.date(x,_this.settings.format);
				}
				val += "," + x;
			});
			if(val==",,")
				return "";
	        return val.indexOf(",") == 0 ? val.substring(1) : val;
		},
		/**
	     * 显示验证错误信息
	     * @function
	     * @name Horn.Field#showError
	     * @param {String} 错误信息
	     * @ignore
	     */
	    showError : function(errorMsg){
	    	var field1 = this.cal1; 
	    	var field2 = this.cal2;
	    	field1.removeClass('m-verify-success');
	    	field1.addClass('m-verify-error');
	    	field2.removeClass('m-verify-success');
	    	field2.addClass('m-verify-error');
	    	errorMsg = $.type(errorMsg) == "boolean" ? "校验错误" : errorMsg;
	    	if(!this.msgDiv){
	    		this.msgDiv = $('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');
	    		this.el.after(this.msgDiv);
	    	}
	        var msg = this.msgDiv;
	        msg.html("<div class=\"verify-tip-arrow\"></div><div class=\"verify-tip-inner\">"+errorMsg+"</div>");
	        msg.css("display", "block");
	        this.err = true;
	    },
	    /**
	     * 删除错误信息
	     * @function
	     * @name Horn.Field#removeError
	     * @ignore
	     */
	    removeError : function(){
	    	var field1 = this.cal1; 
	    	var field2 = this.cal2;
	    	field1.removeClass('m-verify-error');
	    	field2.removeClass('m-verify-error');
	        var input = this.get();
	        var check = field1.attr(Horn.Validate.CHECK);
	        if (check) {
	        	if(this.isValid){
	        		if(field1.val()!=""||field2.val()!=""){
		            	field1.addClass('m-verify-success');
		            	field2.addClass('m-verify-success');
	        		}
	            }
	        }
	        this.err = false;
	    	var msg = this.msgDiv;
	    	if(msg) msg.remove();
	    	delete this.msgDiv ;
	    },
	    /**
	     * 增加校验规则
	     * @function
	     * @name Horn.Field#addRule
	     * @param {String} rule 校验规则字符串
	     * @ignore
	     */
	    addRule : function(rule) {
	        var input = this.cal1;
	        var input2 = this.cal2;
	        var check = input.attr(Horn.Validate.CHECK);
	        if (check) {
	            if (check.indexOf(rule) > -1) {
	                return;
	            }
	            check += Horn.Validate.CHECKSEP + rule;
	        } else {
	            check = rule;
	        }
	        input.attr(Horn.Validate.CHECK, check);
	        input2.attr(Horn.Validate.CHECK, check);
	        if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
	            var li = this.el.parent().parent(".g-unit-wrap");
	            var lab = $("label", li);
	            var red = $("span.m-verify-symbol", lab);
	            if (!red.length) {
	                red = $("<span>", {
	                    "class" : "m-verify-symbol",
	                    "html" : "*"
	                });
	                lab.prepend(red);
	            } else {
	                red.html("*");
	            }
	            
	        }
	        this.removeError();
	        this.field.removeClass('m-verify-success');
	    },
	    /**
	     * 删除校验规则
	     * @function
	     * @name Horn.Field#removeRule
	     * @param {String} rule 校验规则字符串
	     * @ignore
	     */
	    removeRule : function(rule) {
	    	 var input = this.cal1;
		     var input2 = this.cal2;
	        var check = input.attr(Horn.Validate.CHECK);
	          //BUG #6518 【calendar】先进行非空校验的错误提示，然后调用removeRule("qq")，会造成非空校验的错误提示消失
	        if (check && check.indexOf(rule) > -1) {//如果要去除的在原来的验证规则了就删除，否则不删除
	            var checks = check.split(Horn.Validate.CHECKSEP);
	            checks = $.grep(checks, function(c, index) {
	                return c && c != rule;
	            });
	            input.attr(Horn.Validate.CHECK, checks.join(';'));
	            input2.attr(Horn.Validate.CHECK, checks.join(';'));
	            this.removeError();
	            this.setNotRequired();
	        }
	    },
        /**
         * @description 返回日期对的名字
         * @function
         * @name Horn.CalendarGroup#mutiName
         * @return {Array} [name1,name2]
         */
		mutiName : function(){
			return [this.name1,this.name2];
		},
		validate : function(){
			var valid = true;
			var _calendarGroup = this;
			var _this = this;
			//如果日期group的disabled为true则不校验 #8487
			if(_calendarGroup.params.disabled && _calendarGroup.params.disabled==true){
				return true;
			}

			
			var rule1 = this.cal1.attr("check");
			var rule1 = this.cal1.attr("check");
			if(rule1&& rule1.indexOf(Horn.Validate.REQUIRED) > -1){
				if(_this.calobj1.val()==""||_this.calobj2.val()==""){
					_this.showError("当前输入不能为空");
					vaid = false;
					this.err = true;
					return;
				}
		   }
			var _validate = Horn.Validate;
			var obj = this.cal1;
			var rules = _validate.getRules.call(_validate, obj);
			//STORY #9486 【TS:201408200139-JRESPlus-财富管理事业部-王一俊- 关于jresplus中日期范围选择控件起始日期、截止日期必】 
			if(rule1&&rule1.length>0&&!this.params.config){

				var ruleSpilt = rule1.split(";");
				var msg = ""
				for(var i=0;i<ruleSpilt.length;i++){
					var ruleFunc = ruleSpilt[i];
					var fn = function(){};
					if(ruleFunc!=""&&ruleFunc!="Horn.Validate.validateFmt"&&ruleFunc!=Horn.Validate.REQUIRED){
						if(window[ruleFunc]){
							fn = window[ruleFunc];
							var biz_func = fn();
							if(biz_func!=true){
								valid = false;
								msg = biz_func;
								break;
							}
						}else{
							if(window.ruleFunc){
								var biz_func = ruleFunc;
								if(biz_func!=true){
									valid = false;
									msg = biz_func;
									break;
								}
							}
						}
					}
				}
				if(!valid){
					_calendarGroup.showError(biz_func);
					valid = false;
					this.err = true;
					return;
				}
			}
			
			/*if(rule1 &&rules.length==2&& rule1.indexOf(Horn.Validate.REQUIRED) > -1){
				//什么都不做
			}else{
				if(rules &&rules.length>0&&this.msgDiv==null){
					this.cal1.blur();
					this.cal2.blur();
		        }
		     }	*/
			
			var date1 = this.calobj1.getDate();
			var date2 = this.calobj2.getDate();
			if(this.tmpValide!=undefined&&this.tmpValide!=""){
				if(!this.tmpValide){
					_calendarGroup.showError(this.tmpValide);
					valid = false;
			}
			}else{
				if(this.msgDiv!=null){
					valid = false;
		        }
		     }
		
			if(_this.calobj1.val()!=""){
				if( !Horn.Util.Format.validateFmt(_this.calobj1.val(),_this.settings.format)){
					valid = false
					this.err = true;
	    			_this.showError("日期格式不正确，格式为："+_this.settings.format);
					return;
				}
	    	}else{
	    		if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
	    				|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
	    				|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
	    	    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
	    			valid = false
					this.err = true;
	    			_this.showError("日期不在有效区间");
	    			return;
	    		} else if(_this.calobj1 && _this.calobj1.isValid(_this.calobj1.val(),_this.settings.format) && _this.calobj2 && _this.calobj2.isValid(_this.calobj2.val(),_this.settings.format) && _this.calobj1.getDate() && _this.calobj2.getDate()){
	    			if(_this.calobj1.getDate() && _this.calobj2.getDate() &&!_this.compareDate(_this.calobj1.getDate(), _this.calobj2.getDate())){
	    				valid = false
	    				this.err = true;
	        			_this.showError("开始日期不能大于结束日期");
	        			return;
	    			}
	    		}else{
		    		_this.removeError();
		    		this.err = false;
		    		valid = true
	    		}
	    	}
			if(_this.calobj2.val()!=""){
				if( !Horn.Util.Format.validateFmt(_this.calobj2.val(),_this.settings.format)){
					valid = false
					this.err = true;
	    			_this.showError("日期格式不正确，格式为："+_this.settings.format);
					return;
				}
	    	}else{
	    		if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
	    				|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
	    				|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
	    	    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
	    			if(!_this.compareDate(_this.calobj1.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj1.getDate())){
	    				_this.inValidEle = _this.cal1;
	    			}else if(_this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj2.getDate()))){
	    				_this.inValidEle = _this.cal2;
	    			}
	    			_this.showError("日期不在有效区间");
	    			return;
	    		} else if(_this.calobj1 && _this.calobj1.isValid(_this.calobj1.val(),_this.settings.format) && _this.calobj2 && _this.calobj2.isValid(_this.calobj2.val(),_this.settings.format) && _this.calobj1.getDate() && _this.calobj2.getDate()){
	    			if(_this.calobj1.getDate() && _this.calobj2.getDate() &&!_this.compareDate(_this.calobj1.getDate(), _this.calobj2.getDate())){
	    				_this.inValidEle = _this.cal1;
	        			_this.showError("开始日期不能大于结束日期");
	        			return;
	    			}
	    		}else{
		    		_this.removeError();
		    		this.err = false;
		    		valid = true
	    		}
	    	}
			
			//STORY #9486 【TS:201408200139-JRESPlus-财富管理事业部-王一俊- 关于jresplus中日期范围选择控件起始日期、截止日期必】 
			//var flag = valid&& this.compareDate(date1, this.maxDate)&& this.compareDate(this.minDate, date1)&& this.compareDate(date2, this.maxDate)&& this.compareDate(this.minDate, date2)&& this.compareDate(date1, date2);
			if(!valid){
				this.err = true;
			}
			
			_calendarGroup.formatVal();
		},
		setEnable : function(enable){
			if(enable){
				this.cal1.removeAttr("disabled");
				this.cal2.removeAttr("disabled");
				this.hidden1.removeAttr("disabled");
				this.hidden2.removeAttr("disabled");
			}else{
				this.cal1.attr("disabled","disabled");
				this.cal2.attr("disabled","disabled");
				this.hidden1.attr("disabled","disabled");
				this.hidden2.attr("disabled","disabled");
			}
		},
        /**
         * @description 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
         * @function
         * @name Horn.CalendarGroup#reset
         */
        reset : function(clear) {
//			var _calendarGroup = this;
//            this.cal1.val(clear?"":this.defValue1);
            this.hidden1.val(clear?"":this.defHiddenValue1);
//            this.cal2.val(clear?"":this.defValue2);
            this.hidden2.val(clear?"":this.defHiddenValue2);
            
            /**********************STORY #8854 Modify By Wangyb************/
//            var cal1_1 = clear?"":this.defValue1;
//            var cal1_2 = clear?"":this.defHiddenValue1;
//            var cal2_1 = clear?"":this.defValue2;
//            var cal2_2 = clear?"":this.defHiddenValue2;
            
            var cal1_1 = clear?"":this.defValue1 || this.defHiddenValue1;
            var cal2_1 = clear?"":this.defValue2 || this.defHiddenValue2;
            
            var obj = {};
            obj[this.name1]=cal1_1;
            
            //这里之前错了，造成充值的时候总是重置为第一个的值
            obj[this.name2]=cal2_1;
            this.setValue(obj);
            this.validate();
            
//			_calendarGroup.cal1.focus();
//			_calendarGroup.cal2.focus();
//			_calendarGroup.el.focus();
			
        },
        /**
         * @description 清空值
         * @function
         * @name Horn.CalendarGroup#clearValue
         */
    	clearValue : function(){
    		this.hidden1.val("");
            this.hidden2.val("");
    		this.cal1.val("");
    		this.cal2.val("");
    		this.validate();
    	},
		getInValidEle : function(){
			return this.inValidEle;
		},
		setReadonly : function(readonly){
			Horn.Calendar.superclass.setReadonly.apply(this,arguments) ;
			
			if(this.readonly){
				this.cal1.unbind("click").datetimepicker('remove');
				this.cal2.unbind("click").datetimepicker('remove');
			}else{
				this.cal1.evented = undefined;
				this.cal2.evented = undefined;
			}
		}
		/**
		 * 清空表单的值，显示值和隐藏值都设置为""
		 * @function
		 * @name Horn.Calendar#clearValue
		 */
		 
	}) ;
	Horn.Field.regFieldType("div.hc_calendargroup",Horn.CalendarGroup) ;

/**
 * @name Horn.Checkbox
 * @class
 * 复选框组件(从field继承)<br/>
 * 与html原生的checkbox一致
 */
/**
 * @lends Horn.Checkbox#
 */
	 
/**
 * 组件的唯一标示
 * @name Horn.Checkbox#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.Checkbox#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
 /**
 * 所占列数
 * @name Horn.Checkbox#<b>cols</b>
 * @type Number
 * @default 1
 * @example
 * 无
 */
 
/**
 * 值
 * @name Horn.Checkbox#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	
/**
 * 是否被选中
 * @name Horn.Checkbox#<b>checked</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 标签名
 * @name Horn.Checkbox#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 事件配置）
 * @name Horn.Checkbox#<b>events</b>
 * @type Array
 * @default 
 * @example
 * "events":[{"event":"onclick","function":"checkA(this.value)"}]
 */
	
/**
 * 校验规则(注：只针对required起效，不支持自定义校验)
 * @name Horn.Checkbox#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	
 /**
  * 是否隐藏组件
  * @name Horn.Checkbox#hidden
  * @type Boolean
  * @default false
  * @example
  * #checkbox({"name":"test115","label":"checkbox", "cols":1, "check": "required","hidden":false})
  */
/**
 * 是否禁用<br/>
 * @name Horn.Checkbox#<b>disabled</b>
 * @type Boolean
 * @default false
 * @example
 * #checkbox({"name":"test115","label":"checkbox", "cols":1, "check": "required","disabled":false})
 */

	Horn.Checkbox = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"Checkbox",
		checkbox : null,
		init : function(){
			Horn.Checkbox.superclass.init.apply(this,arguments);
			this.checkbox = this.el.find('input:checkbox');
		},
		getEventTarget : function() {
			return this.el.find('input:checkbox');
		},
		/**
         * @ignore
         * @name Horn.CheckboxGroup#initEvents
         * @description  正则检查字符串数组 
         * @function 初始化方法
         * @private
         */
        initEvents : function(){
            var _checkboxgroup = this;
            var checkboxs = _checkboxgroup.el.find('input:checkbox[check*=required]');
            if(checkboxs && checkboxs.size()>0){
                this.checkRegx = $(checkboxs[0]).attr("check").split(';');
                checkboxs.each(function(idx,checkbox){
                    $(checkbox).bind("click",function(){
                    	var checkedboxs = _checkboxgroup.el.children("div").children("label").find('input:checkbox[checked]');
                        var checked = $(this).get(0).checked;
                   	 	if (checked) {
                        	_checkboxgroup.removeError();
                        }else{
                        	_checkboxgroup.showError();
                        }
                    })
                })
            }
        },
		/**
         * @ignore
         * @description 显示错误信息
         * @function
         * @name Horn.CheckboxGroup#showError
         */
        showError : function(){
        	//var userAgent = window.navigator.userAgent.toLowerCase();
			/*var msie10 = $.browser.msie && /msie 10\.0/i.test(userAgent);
	        var msie9 = $.browser.msie && /msie 9\.0/i.test(userAgent); 
	        var msie8 = $.browser.msie && /msie 8\.0/i.test(userAgent);*/
	        /*var msie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
	        var greaterThanIe7 = true;
	        
	        if($.browser.msie){
		        //文本模式版本
		        if (document.documentMode && document.documentMode>=8){ // IE8文本模式
		        	greaterThanIe7 = true;
		        }else if(document.documentMode && document.documentMode<8){ // IE 5-7文本模式  
		        	greaterThanIe7 = false;
		        }
	        }*/
            var _checkboxgroup = this;
        	if(!this.msgDiv){
        		this.msgDiv = $('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');
        		this.el.after(this.msgDiv);
        	}
            var msg = this.msgDiv;
            msg.html("<div class=\"verify-tip-arrow\"></div><div class=\"verify-tip-inner\">当前复选框不能为空</div>");
            msg.css("display", "block");
            _checkboxgroup.el.addClass('m-verify-error');
            _checkboxgroup.el.removeClass('m-verify-success');
            _checkboxgroup.err = true;
        },
        /**
         * @ignore
         * @description 删除错误信息
         * @function
         * @name Horn.CheckboxGroup#removeError
         */
        removeError : function(){
            var _checkboxgroup = this;
            _checkboxgroup.el.removeClass('m-verify-error');
            _checkboxgroup.el.addClass('m-verify-success');
            _checkboxgroup.err = false;
        	var msg = this.msgDiv;
        	if(msg) msg.remove();
        	delete this.msgDiv ;
        },
        /**
         * 设置checkbox的值(若不为true和false则直接设置给提交值)
         * @function
         * @name Horn.Checkbox.setValue
         * @param 0/1或true/false
         */
		setValue : function(val){
			if(this.checkbox.get(0)){
				this.checkbox.get(0).checked = !!val;
			}
			if(val && $.type( val) !='boolean' ){
				this.setStaticValue(val);
			}
			this.checkbox.val(val);
		},
		/**
         * 设置对应的提交值
         * @function
         * @name Horn.Checkbox.setStaticValue
         * @param {String} 预备提交的值
         * @ignore
		 */
		setStaticValue : function(val){
			this.checkbox.val(val);
		},
		/**
         * @ignore
         * @description  内容校验
         * @function
         * @name Horn.CheckboxGroup.validate
         * @ignore
         */
		validate : function(){
			var _checkboxgroup = this;
            var checkboxs = this.el.find('input:checkbox[check*=required]');
            if(checkboxs && checkboxs.size()>0){
               
                if(_checkboxgroup.disabled === true){
                	_checkboxgroup.err = false;
                	return;
                }
                var check = this.checkbox.get(0).checked;
                if(!check){
                	_checkboxgroup.err = true;
                	_checkboxgroup.showError("该选项不能为空");
                }else{
                	_checkboxgroup.err = false;
                	_checkboxgroup.removeError();
                }
            }
        },
        /**
         * @description 获取checkbox的值
         * @function
         * @name Horn.Checkbox.getValue
         * @return {int} 0,1
         */
		getValue : function(){
			return this.checkbox.val();
		}
	});
	Horn.Field.regFieldType("div.hc_checkbox",Horn.Checkbox);

﻿/*
 * 修改日期         修改人员        修改说明
 * -----------------------------------------------------------------------
 *  2014-4-18    周智星    BUG #6440 【form】各个表单组件的校验提示不统一
 *  2014-4-22    周智星    BUG #6780 【form】checkboxgroup组件首先调用setValue("")，然后调用form的setValues方法设置有效的值不会触发select和checkboxgroup的校验
 *  2014-4-22    周智星    BUG #6792 【radiogroup】【checkboxgroup】radiogroup、checkboxgroup的validate方法无效
 *  2014-4-29    周智星    BUG #6912 【radio_group】在IE7下验证的错误提示信息显示的位置很远 
 *  2015-10-10   周智星    BUG #11953 需求13519--checkboxGroup控件在from中，此时用，使用Horn.getComp(&quot;testForm_prefix&quot;).setValues({&quot;prefix.key1&quot;:0});赋值时，浏览器报错
 *  2016-1-14    刘龙       bug 15332 升级到 jquery-1.11.3.min.js后，checkboxgroup必填时，选中后校验标示无法取消
 *  2016-1-15    刘龙        bug 15366 checkbox_group多选时，获取到的值不正确
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.CheckboxGroup
 * @class
 * 复选框组组件</br>
 */
/**
 * @lends Horn.CheckboxGroup#
 */

/**
 * 组件的复选框选项<br/>
 * 数据项不易过多（一行内可以完整显示），否则会导致换行显示影响美观，如果需要显示更多的项，可以考虑使用combox组件
 * @name Horn.CheckboxGroup#<b>items</b>
 * @type Array[JSON]
 * @default 无
 * @example
 * #checkboxGroup({"name":"test15","label":"checkboxGroup","value":"","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"},{"text":"香蕉","code":"2"},{"text":"桔子","value":"3"}],"hiddentext":false})
 */
/**
 * 组件唯一标识
 * @name Horn.CheckboxGroup#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.CheckboxGroup#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.CheckboxGroup#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.CheckboxGroup#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * #checkboxGroup({"name":"test15","label":"checkboxGroup","value":"","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"},{"text":"香蕉","code":"2"}],"hiddenLabel":false})
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.CheckboxGroup#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.CheckboxGroup#value
  * @type String
  * @default ""
  * @example
  * #checkboxGroup({"name":"test15","label":"checkboxGroup","value":"","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}]})
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.CheckboxGroup#defValue
  * @type String
  * @default 无
  * @example
  * #checkboxGroup({"name":"test15","label":"checkboxGroup","defValue":"1,3","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}]})
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.CheckboxGroup#readonly
  * @type Boolean
  * @default false
  * @example
  * #checkboxGroup({"name":"test15","label":"checkboxGroup","defValue":"1,3","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}], "readonly": false})
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.CheckboxGroup#disabled
  * @type Boolean
  * @default false
  * @example
  * #checkboxGroup({"name":"test15","label":"checkboxGroup","defValue":"1,3","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}], "disabled": false})
  */

/**
 * 组件的跨列数，取值范围由外容器的panel的cols(支持1-4列)而定,默认3列
 * @name Horn.CheckboxGroup#cols
 * @type int
 * @default 1
 * @example
 * #@screen({})
 * 	#@panel({"cols":4})
 * 		#checkboxGroup({"name":"test15","label":"checkboxGroup","defValue":"1,3","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}], "cols":1, "check": "required"})
 *  #end
 * #end
 */

/**
 * 组件的约束检查选项(注：只针对required起效，不支持自定义校验)
 * @name Horn.CheckboxGroup#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */
 /**
  * 是否隐藏组件
  * @name Horn.CheckboxGroup#hidden
  * @type Boolean
  * @default false
  * @example
  * #checkboxGroup({"name":"test15","label":"checkboxGroup","defValue":"1,3","items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}], "cols":1, "check": "required"})
  */
/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.CheckboxGroup#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.CheckboxGroup#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.CheckboxGroup#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.CheckboxGroup#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则(只针对required起效)
 * @function
 * @name Horn.CheckboxGroup#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则(只针对required起效)
 * @function
 * @name Horn.CheckboxGroup#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.CheckboxGroup#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.CheckboxGroup#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.CheckboxGroup#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.CheckboxGroup#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.CheckboxGroup#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.CheckboxGroup#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.CheckboxGroup#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.CheckboxGroup#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.CheckboxGroup#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.CheckboxGroup#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.CheckboxGroup#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.CheckboxGroup#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.CheckboxGroup#validate
 */
;(function(H,$){
	H.CheckboxGroup = H.extend(Horn.Field,{
		COMPONENT_CLASS:"CheckboxGroup",
		checkboxs : null,
		init : function(){
			Horn.CheckboxGroup.superclass.init.apply(this,arguments);
			var _checkboxgroup = this;
			this.name = this.el.attr("name") ;
            this.alias = this.el.attr("alias") || "" ;
            var realcheckboxs = this.el.children("div").children("label").find('input:checkbox');
            if(realcheckboxs.length>0){
            	var checkgroup = realcheckboxs.first().attr('group');
               	if(checkgroup){
               		var groupArr = checkgroup.split(';');
               		$(groupArr).each(function(idx,group){
               			_checkboxgroup.checkGroup[group] = true;
               		});
               	}
            }
            this.checkboxs = {};
            this.el.children("div").children("label").find('input:checkbox').each(function(idx,checkbox){
            	var $box = $(checkbox);
            	var val = $box.val();
            	_checkboxgroup.checkboxs[val] = $box;
            }).click(function (){
				if ($(this).prop("checked")) {
                   $(this).attr('checked',true);
                } else {
                   $(this).attr('checked',false);
                }
				var check = $(this).attr(Horn.Validate.CHECK);
                if (check && check.indexOf(Horn.Validate.REQUIRED) > -1) {
					var checkedboxs = _checkboxgroup.el.children("div").children("label").find('input:checkbox[checked]');
	                if(checkedboxs && checkedboxs.size() > 0){
	                	_checkboxgroup.removeError();
	                }else{
	                	_checkboxgroup.showError();
	                }
                }
			});
            //bug 15366 checkbox_group多选时，获取到的值不正确
           // this.el.find('input:checkbox').click(function (){
            //	$(this).attr('checked',true);});
            
            if(this.params.value) {
            	this.setValue(this.params.value);
            }
            if(this.params.readonly) {
            	this.setReadonly(true);
            }
            if(this.params.disabled) {
            	this.setDisabled(true);
            }
            this.defValue = this.params.defValue || this.params.value || "";
		},
		getEventTarget : function() {
			return this.el.children("div").children("label").find('input:checkbox');
		},
        /**
         * @description 设置checkbox的值
         * @function
         * @name Horn.CheckboxGroup.setValue
         * @param {string} val 以","分割的字符串或字符组件
         * @ignore
         */
		setValue : function(val){
			var _checkboxgroup = this;
			if(!$.isArray(val)){
				//11953 需求13519--checkboxGroup控件在from中，此时用，使用Horn.getComp(&quot;testForm_prefix&quot;).setValues({&quot;prefix.key1&quot;:0});赋值时，浏览器报错
				val = val.toString().split(',');
			}
			for (var $box in  _checkboxgroup.checkboxs){
				_checkboxgroup.checkboxs[$box].prop('checked',false);
			}
			$(val).each(function(idx,v){
				var $box = _checkboxgroup.checkboxs[v] ;
				if($box){
					$box.prop('checked',true);
				}
			});
			//设置新值之后重新校验
			this.validate();
		},
        /**
         * @description 获取checkbox的值
         * @function
         * @name Horn.CheckboxGroup.getValue
         * @return {string} 以逗号分割的字符串
         * @ignore
         */
		getValue : function(){
			var val = '';
			this.el.children("div").children("label").find('input:checkbox').each(function(idx,checkbox){
				var value = $(checkbox).attr('value');
				var check = $(checkbox).prop('checked');
				if(check){
					if(idx != 0) val += ',';
					val += value ;
				}
			});
			return val;
		},
	    /**
	     * 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
	     */
	    reset : function() {
	    	this.setValue(this.defValue);
	    },
	    /**
	     * 清除值
	     */
	    clearValue : function() {
	    	this.setValue("");
	    },
	    setEnable : function(enabled) {
	    	var _checkboxgroup = this;
			this.el.children("div").children("label").find('input:checkbox').each(function(idx,checkbox){
				if (enabled === false) {
					$(checkbox).attr("disabled", "disabled");
					//_checkboxgroup.el.unbind("click");
					//_checkboxgroup.removeRule(Horn.Validate.REQUIRED);
					//_checkboxgroup.removeError();
				} else {
					$(checkbox).removeAttr("disabled");
				}
			});
	    },
	    // 方法冗余
	    setDisabled : function(disabled) {
	    	if (disabled === false) {
	    		this.setEnable(true);
	            this.disabled = false;
	    	} else {
	    		this.setEnable(false);
	            this.disabled = true;
	    	}
	    },
	    /**
	     * 设置是否可编辑
	     */
	    setReadonly : function(readonly) {
	    	var _checkboxgroup = this;
			this.el.children("div").children("label").find('input:checkbox').each(function(idx,checkbox){
				if (readonly === false) {
					_checkboxgroup.readonly = false;
					$(checkbox).removeAttr("onclick");
                    $(checkbox).bind("click",function(){
                    	setTimeout(function(){
                    		var check = $(checkbox).attr(Horn.Validate.CHECK);
                            if (check && check.indexOf(Horn.Validate.REQUIRED) > -1) {
	                            var checkedboxs = _checkboxgroup.el.children("div").children("label").find('input:checkbox[checked]');
	                            if(checkedboxs && checkedboxs.size() > 0){
	                            	_checkboxgroup.removeError();
	                            }else{
	                            	_checkboxgroup.showError();
	                            }
                            }
                    	},10);
                    });
				} else {
					_checkboxgroup.readonly = true;
					if(_checkboxgroup.el.children("div").children("label").find('input:checkbox[checked]').length==0){
						$(checkbox).unbind("click");
//						_checkboxgroup.removeRule(Horn.Validate.REQUIRED);
//						_checkboxgroup.removeError();
					}
					$(checkbox).get(0).onclick = function(){return false};
				}
			});
	    },
        /**
         * @ignore
         * @description  内容校验
         * @function
         * @name Horn.CheckboxGroup.validate
         * @ignore
         */
        validate : function(){
            if(!this.skipValid && this.checkRegx && this.checkRegx.length > 0) {
                var _checkboxgroup = this;
                if(_checkboxgroup.disabled === true){
                	_checkboxgroup.err = false;
                	return;
                }
                var checkbox = this.el.children("div").children("label").find('input:checkbox[checked]');
                if(checkbox && checkbox.size() < 1){
                    Horn.Validate.addError(_checkboxgroup, Horn.Validate.regexEnum.requiredMessage);
                }else{
                    Horn.Validate.removeError(_checkboxgroup);
                }
            }
        },
        /**
         * @ignore
         * @description 显示错误信息
         * @function
         * @name Horn.CheckboxGroup#showError
         */
        showError : function(){
            var _checkboxgroup = this;
        	if(!this.msgDiv){
        		this.msgDiv = $('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');
        		this.el.after(this.msgDiv);
        	}
            var msg = this.msgDiv;
            msg.html("<div class=\"verify-tip-arrow\"></div><div class=\"verify-tip-inner\">当前复选框不能为空</div>");
            msg.css("display", "block");
            _checkboxgroup.el.addClass('m-verify-error');
            _checkboxgroup.el.removeClass('m-verify-success');
            _checkboxgroup.err = true;
        },
        /**
         * @ignore
         * @description 删除错误信息
         * @function
         * @name Horn.CheckboxGroup#removeError
         */
        removeError : function(){
            var _checkboxgroup = this;
            _checkboxgroup.el.removeClass('m-verify-error');
            _checkboxgroup.el.addClass('m-verify-success');
            _checkboxgroup.err = false;
        	var msg = this.msgDiv;
        	if(msg) msg.remove();
        	var lab = this.el.parent().parent(".g-unit-wrap").children(".unit-label");
            /*var red = $("span.m-verify-symbol", lab);
            if(red){
            	red.remove();
            }*/
        	delete this.msgDiv ;
        },
        addRule : function(rule) {
        	if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
                var _checkboxgroup = this;
                var checkboxsWithRequired = _checkboxgroup.el.children("div").children("label").find('input:checkbox[check*=required]');
                if(checkboxsWithRequired && checkboxsWithRequired.size()>0){
                    return;
                }else{
                    _checkboxgroup.err = true;
                    this.checkRegx = rule.split(';');
                	var checkboxs = _checkboxgroup.el.children("div").children("label").find('input:checkbox');
                    checkboxs.each(function(idx,checkbox){
                    	var check = $(checkbox).attr(Horn.Validate.CHECK);
                        if (check) {
                            if (check.indexOf(rule) > -1) {
                                return;
                            }
                            check += Horn.Validate.CHECKSEP + rule;
                        } else {
                            check = rule;
                        }
                        $(checkbox).attr(Horn.Validate.CHECK, check);
                        /*$(checkbox).bind("click",function(){
                        	setTimeout(function(){
                        	var checkedboxs = _checkboxgroup.el.children("div").children("label").find('input:checkbox[checked]');
                            if(checkedboxs && checkedboxs.size() > 0){
                            	_checkboxgroup.removeError();
                            }else{
                            	_checkboxgroup.showError();
                            }},10);

                        })*/

                    });
                    if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
        	            var lab = this.el.parent().parent(".g-unit-wrap").children(".unit-label");
        	            var red = $("span.m-verify-symbol", lab);
        	            if (!red.length) {
        	                red = $("<span>", {
        	                    "class" : "m-verify-symbol",
        	                    "html" : "*"
        	                });
        	                lab.prepend(red);
        	            } else {
        	                red.html("*");
        	            }
        	            
        	        }
        	        //this.removeError();
        	        //this.field.removeClass('m-verify-success');
                }
        	}else{
        		return;
        	}
        },
        removeRule : function(rule) {
            var _checkboxgroup = this;
        	var checkboxs = _checkboxgroup.el.children("div").children("label").find('input:checkbox');
            checkboxs.each(function(idx,checkbox){
            	var check = $(checkbox).attr(Horn.Validate.CHECK);
                if (check && check.indexOf(rule) > -1) {
                    var checks = check.split(Horn.Validate.CHECKSEP);
                    checks = $.grep(checks, function(c, index) {
                        return c && c != rule;
                    });
                    $(checkbox).attr(Horn.Validate.CHECK, checks.join(';'));
                }
                $(checkbox).unbind("click");
            });
            this.checkRegx = [];
            if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
            	this.el.removeClass('m-verify-success');
            	this.el.removeClass('m-verify-error');
	            var lab = this.el.parent().parent(".g-unit-wrap").children(".unit-label");
	            var red = $("span.m-verify-symbol", lab);
	            if(red){
	            	red.remove();
	            }
	            var msg = this.msgDiv;
	        	if(msg) msg.remove();
            }
        }
	});
	H.Field.regFieldType("div.hc_checkbox-group",H.CheckboxGroup);
})(Horn,jQuery);
/*
	*** jquery.drag 容器拖拽
*/
(function($){
	var _window = {
        windowWidth: function() {
            return getMsie() ? document.documentElement.clientWidth: window.innerWidth
        },
        windowHeight: function() {
            return getMsie() ? document.documentElement.clientHeight: window.innerHeight
        },
        scrollTop: function() {
            return getMsie() ? document.documentElement.scrollTop: window.pageYOffset
        },
        scrollLeft: function() {
            return getMsie() ? document.documentElement.scrollLeft: window.pageXOffset
        }
	};
	function getMsie(){
    	var rv = false;
    	  if (navigator.appName == 'Microsoft Internet Explorer'){
    	    rv = true;
    	  }else if (navigator.appName == 'Netscape'){
    	     rv = true;
    	  }
    	return rv;
    }
	// 清除文本选择
	function clsSelect(e){
		e = e || window.event;
		if('getSelection' in window){
			window.getSelection().removeAllRanges();
		}else{
			try {
				document.selection.empty();
			} catch (e) {};
		};
		if(e.preventDefault){
			 e.preventDefault();
		}else{
			 e.returnValue = false;
		};	
	};
	$.fn.drag = function(op){
		var set = $.extend({
			handle : null,
			beforedrag : function(pos,self){},
			ondraging : function(pos,self){},
			enddrag : function(pos,self){},
			unselectClass : "unselect",
			xdrag : true,//容器left是否改变
			ydrag : true//容器top是否改变	
		},op);
		return this.each(function(){
			var t = $(this), _t = this, handle = set.handle === null ? t : t.find(set.handle), cachemousepos = {x : 0, y :0}, cachethispos = {x : 0, y: 0}, draggable = false, handled = false;
			//获取鼠标位置
			function getmousepos(e){
				e = e || window.event;
				return {
					x : (function(){
						return e.clientX + _window.scrollLeft();
					})(),
					y : (function(){
						return e.clientY + _window.scrollTop();
					})()
				};
			};
			//获取容器的 left 和 top
			function getdivpos(){
				return {
					x : (function(){
						return t.css("left") === "auto" ? 0 : parseInt(t.css("left"))	
					})(),
					y : (function(){
						return t.css("top") === "auto" ? 0 : parseInt(t.css("top"));
					})()
				};
			};
			//鼠标移动时 设置容器css positon left and top
			function __mousemove(e){
				e = e || window.event;
				clsSelect(e);	
				if(draggable){
					handled = true;	
					var eve = getmousepos(e);
					var css = {};
					if(set.xdrag === true){
						css.left = eve.x - cachemousepos.x + cachethispos.x + "px";
					};
					if(set.ydrag === true){
						css.top = eve.y - cachemousepos.y + cachethispos.y + "px"  
					};
					t.css(css);
					 
					set.ondraging(getdivpos(),t);
				};
			};
			//鼠标停止松开后重置
			function __mouseup(e){
				e = e || window.event;
				draggable  = false;	
				$(document).unbind("mousemove", __mousemove);
				$(document).unbind("selectstart", __mousemove);
				if(handled){
					set.enddrag(getdivpos(),t);
					handled = false;
				};
			};
			//初始化
			function init(){
				handle.mousedown(function(e){
					e = e || window.event;
					draggable = true;
					if($(this).attr("_ismaxed")){
						return;
					};
					cachethispos = getdivpos();
					cachemousepos = getmousepos(e);
					set.beforedrag(cachethispos,t);
					$(document).bind("mousemove", __mousemove).bind("mouseup", __mouseup);
					$(document).bind("selectstart", __mousemove); 
				});
			};
			init();
		});
	};
})(jQuery);


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
/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-2-11 		张超		增加默认值保存功能
 * 2014-3-3 		张超		filterByLabel增加filter之后设置值（或不设置）的功能。
 * 2014-2-14 		韩寅		修改注释
 * 2014-4-14        周智星      BUG #6552 【combox】(继承)addRule(rule)(原先无校验规则) 错误提示的位置不正确，偏离的位置相当大
 * 2014-4-16        周智星     BUG #6738 combo调用setDisabled（true）后应能通过API方式提交
 * 2014-4-16       	韩寅		BUG #6554 修改注释，描述只读更加准确
 * 2014-4-28        周智星     BUG #6838 combo_设置为只读的任然可以选择更改 设置为只读的任然可以选中后按退格键清除
 * 2014-5-4         周智星     修改combox的readonly属性说明文档
 * 2015-9-25        周智星     window控件中，若是控件占多行，显示有问题
 * 2016-2-16        刘龙        15930 需求16320--doc文档中，combox的方法changeDict，需要说明只能更换页面中已经调用的数据字典。
 * 2016-2-17        刘龙         需求16320 【TS:201601070226-JRESPlus-财富管理事业部-陈为-4. combox的changeDict的实现（目前API中】
 * 2016-3-4         刘龙         需求17376 【TS:201602230422-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br><br><br】
 * 2016-03-22       刘龙         bug#17102 combox调用addItems(item)方法后，再获取值，初始设置的值获取不到
 * 2016-3-23        刘龙        bug#17190 多选框combox设置value值为后续additem添加的值，显示后输入框设置值，调用addItems(item)方法，原先选中的值会被value值覆盖
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Combox
 * @class
 * 下拉选项组件</br>
 * 替代html的select组件，有更加丰富的交互和功能
 */

/**@lends Horn.Combox# */

/**
 * 仅在单选模式下生效，选项头格式如:{"label":"","value":"请选择 ..."}，其中label可以不配置，但是配置的值一定不能跟combox下拉的有效值重复
 * @name Horn.Combox#<b>headItem</b>
 * @type obj
 * @default 无
 * @example
 * 无
 */
/**
 * 静态显示值 格式："items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}]
 * @name Horn.Combox#<b>items</b>
 * @type Array
 * @default 无
 * @example
 * 无
 */
/**
 * 增加配置项filterBy,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为key或者value
 * @name Horn.Select#<b>filterBy</b>
 * @type string
 * @default value
 * @example
 * 无
 */
/**
 * 数据字典名
 * @name Horn.Combox#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 是否多选，true表示多选，false表示单选
 * @name Horn.Combox#<b>multiple</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
 /**
 * 是否可编辑，true代表可编辑，false代表不可编辑，输入框是只读的
 * @name Horn.Combox#<b>editable</b>
 * @type Boolean
 * @default false
 * @ignore
 * @example
 * 无
 */
/**
 * 在初始化的默认就把下拉框中的内容全部选中；如果同时设置了selectAll=true和value属性，那么value属性优先生效
 * @name Horn.Combox#<b>selectAll</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 多选时的显示分隔符
 * @name Horn.Combox#<b>delimiter</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'pLabel'
 * @name Horn.Combox#<b>pKeyField</b>
 * @type String
 * @default "pLabel"
 * @example
 * 无
 * @ignore
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'label'，非必须，单值不能为空
 * @name Horn.Combox#<b>labelField</b>
 * @type String
 * @default "label"
 * @ignore
 * @example
 * 无
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'code'，非必须，单值不能为空
 * @name Horn.Combox#<b>codeField</b>
 * @type String
 * @default "code"
 * @example
 * 无
 */
/**
 * 用于渲染列表中显示项目的实际值使用的item属性,默认为'value'，非必须，单值不能为空
 * @name Horn.Combox#<b>valueField</b>
 * @type String
 * @default "value"
 * @ignore
 * @example
 * 无
 */
/**
 * 用于渲染列表中显示项目的实际值使用的item属性,默认为'text'，非必须，单值不能为空
 * @name Horn.Combox#<b>textField</b>
 * @type String
 * @default "text"
 * @example
 * 无
 */
/**
 * 是否在渲染列表项目时显示实际值，默认为false
 * @name Horn.Combox#<b>showLabel</b>
 * @type Boolean
 * @default false
 * @example
 * @ignore
 * 无
 */

/**
 * @description 更改引用的数据字典(传入的字典参数必须在当前页面已经使用过，例如changeDict("province")，则字典province已经在页面其他combox组件中调用过)
 * @function
 * @name Horn.Combox#changeDict
 * @param {string} name 字典名
 */
/**
     * 设置是否可编辑，下拉框可以下拉
     * @function
     * @name Horn.Combox#setEditable
     * @param {Boolean} editable 不可编辑
     * @ignore
*/
/**
 * @description 仅在单选模式下有效，选中第一个非headItem对应的项
 * @function
 * @name Horn.Combox#selectFirst
 * @returns void
 */
/**
 * @description 根据关联项目过滤下拉列表
 * @function
 * @name Horn.Combox#filterByPLabel
 * @param pLabel 父节点值
 * @returns void
 * @ignore
 */
/**
 * @description 根据参数过滤下拉列表，此方法会自动情况清除上一次过滤效果，效果无法叠加
 * @function
 * @name Horn.Combox#filter
 * @param f String、Array、Function，Function参数为item的key
 * @param flag 默认为false，过滤掉包含在f中，或返回为true的项目，否则过滤掉其他项目
 * @param {Boolean} triggerChange 是否触发值更改事件
 * @returns void
 */
/**
 * @description 清空过滤显示所有的下拉项目
 * @function
 * @name Horn.Combox#clearFliter
 * @returns void
 */
/**
 * @description 隐藏下拉列表所有item
 * @function
 * @name Horn.Combox#clearList
 * @returns void
 */
/**
 * @description 动态增加下拉列表项目
 * @function
 * @name Horn.Combox#addDatas
 * @param data {Json or Array} [{label:'3','value':'测试3'},{label:'4','value':'测试4'}]　
 * @param isClear 是否清空原来的列表项
 * @ignore
 */
/**
 * @description 动态增加下拉列表项目；在isClear=true的情况下，如果设置的items无效，下拉框的内容依然会被清空。（注：如果下拉框设置的初始值在新添加的items中存在，则添加items后，会自动选中该初始值）
 * @function
 * @name Horn.Combox#addItems
 * @param items {Json or Array} [{label:'3','value':'测试3'},{label:'4','value':'测试4'}]　
 * @param isClear 是否清空原来的列表项
 */
/**
 * 是否启用模糊查询功能,如果配制为true，则会自动去除readonly的配置并将field转换为可编辑的;</br>
 * 默认根据key和value进行模糊查询;</br>
 * 在IE8下进行模糊查询时候，请不要将鼠标放置在下拉列表可能显示在的位置，这样会导致模糊过滤失效（已知BUG）
 * @name Horn.Combox#<b>enableFieldSearch</b>
 * @type boolean
 * @default false
 * @example
 * 无
 */

/*******************************************************************************/


/**
 * 组件唯一标识
 * @name Horn.Combox#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Combox#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Combox#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Combox#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Combox#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Combox#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Combox#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 被设置为只读的组件不能通过键盘输入改变表单的值，可以通过下拉选择改变表单的值，可以获得焦点，是可以参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；<font color=red>(注！readonly属性仅对多选的情况下有效，单选无效)</font>
  * true表示只读状态，不允许键盘输入，允许通过下拉按钮选择值；false表示正常状态，允许键盘输入，允许通过下拉按钮选择值
  * @name Horn.Combox#readonly
  * @type Boolean
  * @default true
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Combox#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的面板(panel)的cols而定
 * @name Horn.Combox#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Combox#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Combox#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 增加配置项filterBy,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为key或者value
 * key ：根据值过滤，value:根据显示名称过滤
 * @name Horn.Combox#<b>filterBy</b>
 * @type string
 * @default value
 * @example
 * 无
 */
 /**
  * 是否隐藏组件
  * @name Horn.Combox#hidden
  * @type Boolean
  * @default false
  * @example
  * #combox({"selectAll": false,"multiple": true, "name":"test13","label":"combox","value":"3333","defValue":"1", "dictName": "province", "cols":1,"check": "required","multiple":false,"filterBy":"key","hidden":true})
  */
/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Combox#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Combox#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Combox#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Combox#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Combox#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Combox#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Combox#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Combox#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Combox#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Combox#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交并且其所有校验状态都会消失，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Combox#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，可以通过下拉选择改变值，可以通过setValue、reset等API修改表单的值，并且可以参与表单提交<font color=red>(注！readonly属性仅对多选的情况下有效，单选无效)</font>
 * @function
 * @name Horn.Combox#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Combox#setValue
 * @param {String} value 值
 * @param {Boolean} triggerChange 是否触发值更改事件
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Combox#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Combox#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Combox#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Combox#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Combox#validate
 */
/**
	 *返回下拉框中所有的数据
     * @function
     * @name Horn.Combox#getListData
     * @return object data为所有节点的值,dom为该节点的jquery对象
     */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Combox#emptyText
  * @type String
  * @default ""
  * @ignore
  * @example
  * #combox({"name":"test11f", "label":"combox", "defValue": "", "cols": 3, "check": "required", "disabled":false,"emptyText":"请选择..."})
  */
Horn.Combox = Horn.extend(Horn.Select,{
	COMPONENT_CLASS:"Combox",
	pLabel : "",
	filterFlag : "",
	displayField : null,
	keyAttr : "label",
	pKeyAttr : "pkey",
	valueAttr : "value",
	defaultValue : "",
	defaultText : "",
	showLabel : true,
	/**
	 * @ignore
	 */
	init : function(dom) {
		Horn.Combox.superclass.init.apply(this,arguments) ;
		this.combInit() ;
		//设置可能的多字典切换功能
		var field = this.el.find('input[ref]'),
			keyAttr = this.el.attr('keyfield'),
			pkeyAttr = this.el.attr('pkeyfield'),
			valueAttr = this.el.attr('titlefield')
			;
		if(keyAttr) this.keyAttr = keyAttr;	
		if(pkeyAttr) this.pkeyAttr = pkeyAttr;	
		if(valueAttr) this.valueAttr = valueAttr;


		var dictName = this.params['dictName'];
		if(dictName){
			this.field.attr('ref',dictName.split(',')[0] + (this.multipleline?'_m':'_s') ) ;
		}
		this.displayField = field;
		this.defaultValue = this.params.value || this.hidden.val();
//		this.setValue(this.defaultValue,true);
		
		//BUG #6838 combo_设置为只读的任然可以选择更改 设置为只读的任然可以选中后按退格键清除
		if(this.params.readonly) {
        	this.setReadonly(true);
        }
	},
	/**
	 * @ignore
	 */
	combInit : function(){
		var refname = this.hidden.attr("refname");
		if (refname) {
			this.field.bind("change",Horn.Util.apply(this.onCombChange,this));
		}
	},
	/**
	 * @ignore
	 */
	onCombChange : function(e, val){
		var refname = this.hidden.attr("refname") ;
		var refnames = refname.split(";") ;
		for(var i=0;i<refnames.length;i++){
			var rn = refnames[i] ;
			if (rn) {
				var rns = rn.split(",") ;
				Horn.getComp(rns[0],rns[1]).filterByPLabel(this.hidden.val()) ;
			}
		}
	},
	changeDict : function(name){
   		var name_copy=name;
   		this.clearFliter();
   		//16320 【TS:201601070226-JRESPlus-财富管理事业部-陈为-4. combox的changeDict的实现（目前API中】
   		var dict = Horn.getDict(name_copy);
		var $hc_checkboxdiv=$('<div class="hc_checkboxdiv">');
		var $ul=$("<ul></ul>");
   		var _this=this;
		if((this.field.get(0)).getAttribute("multiple")=="true"){
			name+="_m";
			$hc_checkboxdiv.attr("multiple_line","true");
			$.each(dict, function(i, n){
			  if(_this.params.showLabel){
			  	var $li=$('<li title='+n+' key='+i+'><label><input type="checkbox" class="combox_input"><span class="hce_dictlabel" >'+i+':</span>'+n+'</label></li>');
			  }else{
			  	var $li=$('<li title='+n+' key='+i+'><label><input type="checkbox" class="combox_input">'+n+'</label></li>');
			  }
			  
			  $ul.append($li);
			});
		}else{
			name+="_s";
			$hc_checkboxdiv.attr("multiple_line","false");
			$.each(dict, function(i, n){
			  if(_this.params.showLabel){
			  	var $li=$('<li title='+n+' key='+i+'><label><span class="hce_dictlabel" >'+i+':</span>'+n+'</label></li>');
			  }else{
			  	var $li=$('<li title='+n+' key='+i+'><label>'+n+'</label></li>');
			  }
			  
			  $ul.append($li);
			});
		}
		$hc_checkboxdiv.append($ul);
		this.field.attr("ref",name);
		/*if($("div.hc_checkboxdiv[ref_target='" + name + "']").length==0){
			this.listEl = $("div.hc_checkboxdiv[ref_target*='" + name_copy + "']");
		}else{
			this.listEl = $("div.hc_checkboxdiv[ref_target='" + name + "']");
		}*/
		
		this.listEl=$hc_checkboxdiv;		
   		this.multipleline = this.listEl.attr("multiple_line") == "true";
   		//this.setValue("");
   		//改变字典后，输入的值清空
   		if((this.field.get(0)).getAttribute("multiple")=="true"){
   			this.field.val("");
   		}else{
   			this.field.val("请选择...");
   		}
   		this.hidden.val("");
	},
	selectFirst : function() {
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		var lis = this.listEl.children("ul").children("li[key]");
		var key = "";
		var text = "" ;
		for ( var i = 0; i < lis.length; i++) {
			if ($(lis.get(i)).css("display") != "none") {
				key = $(lis.get(i)).attr("key");
				text = jQuery.trim($(lis.get(i)).text());
				if(key!="") break;
			}
		}
		this.setValue({"key":key,"text":text}, true);
	},
	/**
	 * @ignore
	 */
	getPos : function() {
		return {
			left : 0,
			top : 0
		};
	},
	/**
	 * @ignore
	 */
	hideAllList : function() {
		var listEl = this.listEl ;
		$("div.hc_checkboxdiv").each(function(i, o) {
			if (listEl.get(0) != o) {
				$(o).hide();
				$(o).data("show_name", "");
			}
		});
	},
	/**
	 * @ignore
	 */
	showList : function(inputEl, listEl) {
		var hidden = inputEl.prev() ;
		var filter = hidden.data("filter") ;
		if(filter){
			this[filter.name].apply(this,filter.params) ;
		}
		else{
			this.clearFliter(hidden) ;
		}
		Horn.Combox.superclass.showList.apply(this,arguments) ;
	},
	/**
     * @description 根据关联项目过滤下拉列表
     * @function
	 * @name Horn.Combox#filterByPLabel
	 * @param pLabel 父节点值
	 * @returns void
	 * @ignore
	 */
	filterByPLabel : function(pLabel) {
		if(this.pLabel!=pLabel){
			this.reset(true);
			this.pLabel = pLabel ;
			this.hidden.data("filter" ,{
				name : '_filterByPLabel',
				params : arguments 
			}) ;
		}
	},
	/**
	 * @ignore
	 */
	_filterByPLabel : function(pLabel,noSelectfirst) {
		if (!pLabel) {
			return false;
		}
		var ul = this.listEl.children("ul");
		// 先隐藏所有的li
		ul.children("li[key][pKey!='" + pLabel + "']").css("display",
				"none");
		ul.children("li[key][pKey='" + pLabel + "']").css("display",
				"block");
		//若是自己设置的value值，那么在此设置为原始值。
		if(this.defaultValue){
			this.setValue(this.defaultValue);
		}else if(!(noSelectfirst===false)&&(!this.multipleline)){
			this.selectFirst();
		}else{
			this.setValue('');
		}
	},	
	filter : function(f, flag,triggerChange) {
		//过滤之前，先清空上次过滤的值  2015-11-02 modify by 周智星
		this.clearFliter();
		var filter = {
			name : "_filter",
			params : arguments 
		} ;
		var oldFilter = this.hidden.data("filter") ;
		if(filter!=oldFilter){
			this.hidden.data("filter" ,filter) ;
			//BUG #6840 combo_filter以及setValue不会触发onchange事件
			if (triggerChange) {
	            this.field.trigger('change', filter);
	        }
		}
		var val =this.hidden.val();
		var _comb = this;
		if(val){
			//查询是否有这个值的显示li存在
			this._filter(f, flag);
			setTimeout(function(){
				$(val.split(',')).each(function(idx,v){
					if (_comb.listEl.children("ul").children(
							"li[key=" + v + "]").css('display') == "none") {
						_comb.reset(true);
					}
				});
			},200);
		}else{
			//查询是否有这个值的显示li存在
			this._filter(f, flag);
			setTimeout(function(){
				_comb.setValue('');
			},200);
		}
		
	},
	/**
	 * @ignore
	 */
	_filter : function(f, flag) {
		flag = !!flag;
		var d1 = "block", d2 = "none";
		if (flag) {
			d1 = "none";
			d2 = "block";
		}
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		// 先隐藏所有的li
		var liList = this.listEl.children("ul").children("li[key]") ;
		liList.css("display", d1);
		var D = ",";
		if ($.type(f) == "string") {
			f += D;
		}
		liList.each(
			function(index, dom) {
				var li = $(dom);
				var key = li.attr("key");
				if ($.type(f) == "function") {
					if (f.call(this, key)) {
						li.css("display", d2);
					}
				} else if ($.type(f) == "array") {
					if (jQuery.inArray(key, f) >= 0) {
						li.css("display", d2);
					}
				} else if ($.type(f) == "string") {
					if (f.indexOf(key + D) > -1) {
						li.css("display", d2);
					}
				}
		});
	},
	clearFliter : function() {
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		this.listEl.children("ul").children("li[key]").css("display", "block");
		this.hidden.data('filter',null);
	},
	clearList : function() {
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		this.reset(true);
		this.listEl.children("ul").children("li[key]").remove();
	},
	addItems : function(data, isClear) {
		this.addDatas(data, isClear);
	},
	/**
     * @description 动态增加下拉列表项目
     * @function
	 * @name Horn.Combox#addDatas
     * @param data {Json or Array} [{"code":"33","text":"测试33"},{"code":"34","text":"测试34"}]　
     * @param isClear 是否清空原来的列表项
     * @ignore
	 */
	addDatas : function(data, isClear) {
		var list = [], listDiv = this.listEl, keyAttr = this.keyAttr, valueAttr = this.valueAttr, showLabel = this.showLabel;
		var hidden = this.hidden ;
		var field=this.field;
		var _this = this ;
		if(listDiv&&listDiv.length==0){
			listDiv = this.field.parent().find("div.hc_checkboxdiv");
		}
		var eventData = {
				inputEl : this.field,
				listEl : listDiv
		};
		if (jQuery.type(data) == "array") {
			list = data;
		}else if (jQuery.type(data) == "object"){
			if (jQuery.isPlainObject(data)) {
				if (jQuery.isEmptyObject(data)) {
					return;
				}
				list.push(data);
			}
		}else{
			if (isClear === true) {
				this.clearList();
			}
			return;
		}
		if (isClear === true) {
			this.clearList();
		}
		if (list.length > 0) {
			var ul = listDiv.children("ul");
			var multipleline = (listDiv.attr("multiple_line") == "true");
			$.each(list, function(index, obj) {
				var key = obj[keyAttr], val = obj[valueAttr];
				if (!key) {
					key = obj["code"];
					val = obj["text"];
				}
				if (key) {
					var li = ul
							.children("li[key='"
									+ key
									+ "']");
					if (li.length == 0) {
						var li = $("<li key='"
								+ key
								+ "' title='"
								+ val
								+ "'></li>");
						var label = $("<label></label>");
						label
								.text((showLabel ? key
										+ ":"
										: "")
										+ val);
						if (multipleline) {
							label.prepend('<input type="checkbox" class="combox_input"/>');
						}
						li.append(label);
						ul.append(li) ;
						if (listDiv.data("show_name") == hidden.attr("name")) {
							li.bind("click.li", eventData, Horn.Util.apply(
									_this.listClick, _this));
						}
					}
				}
			});
		}
		//17376 【TS:201602230422-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br><br><br】
		var defValue=_this.params.value;
		var initValue=hidden.attr("value");
		var initLable=field.val();
		var splitChar=","
		if(_this.params.delimiter){
			splitChar=_this.params.delimiter;
		}
		var addItemsValue=initValue;
		var addItemslable=initLable;
		//bug 17102 combox调用addItems(item)方法后，再获取值，初始设置的值获取不到
		var defValueArr=[];
		if(defValue&&defValue!=""){
			defValueArr=defValue.split(",");
		}
		for(var i=0;i<defValueArr.length;i++){
			defValue=defValueArr[i];
			//bug#17190 多选框combox设置value值为后续additem添加的值，显示后输入框设置值，调用addItems(item)方法，原先选中的值会被value值覆盖
			if(field.attr("selectMode")){
				//多选
				if(field.attr("selectMode")=="true"){
					$.each( list, function(i, obj){
					  if(addItemslable.indexOf(obj.text)<0){//不存在该值
					  	if(obj.code==defValue){
						  	addItemsValue =addItemsValue+(addItemsValue?",":"")+obj.code;
						  	addItemslable = addItemslable+(addItemslable?splitChar:"")+obj.text;
						  }
					  }
					  
					});
				}else{
					//单选
					$.each( list, function(i, obj){
					  if(obj.code==defValue){
					  	addItemsValue = obj.code;
					  	addItemslable = obj.text;
					  }
					});
				}
			}else{
				//单选
				$.each( list, function(i, obj){
				  if(obj.code==defValue){
				  	addItemsValue = obj.code;
				  	addItemslable = obj.text;
				  }
				});
			}
			
		
		}
		
		//hidden.val(addItemsValue);
		this.setValue(addItemsValue);
		field.val(addItemslable);
	},
    /**
     * @description 显示错误信息
     * @function
     * @name Horn.Combox#showError
     * @ignore
     */
	showError:function(){
		Horn.Combox.superclass.showError.apply(this,arguments) ;
		 var msg = this.msgDiv;
		 //BUG #6552 【combox】(继承)addRule(rule)(原先无校验规则) 错误提示的位置不正确，偏离的位置相当大
	     //msg.css('margin-top','-40px');
	}
}) ;
Horn.Field.regFieldType("div.hc_combox",Horn.Combox);
/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		谢晶晶		修正注释文档
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.ZtreePanel
 * @class
 * ztree封装组件</br>
 * 基于ztree 3.5版本上进行封装树形展示组件，支持同步和异步树，拥有3.5版本的所有功能,同时拥有展开、收缩、刷新和模糊收缩功能
 */
/**
 * @lends Horn.ZtreePanel#
 */
	 
 /**
 * 组件的唯一标示
 * @name Horn.ZtreePanel#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称，必填
 * @name Horn.ZtreePanel#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
/**
 * 同步加载，静态数据
 * @name Horn.ZtreePanel#<b>data</b>
 * @type String
 * @default 
 * @example
 * '[{"id":"1","name":"root"},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"}]'
 */
/**
 * 是否异步
 * @name Horn.ZtreePanel#<b>async</b>
 * @type Boolean
 * @default false
 * @example
 * #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */	
/**
 * 异步加载,url返回的数据格式跟静态的data一致(async为true时生效)
 * @name Horn.ZtreePanel#<b>url</b>
 * @type String
 * @default ""
 * @example
 * #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */	
/**
 * 选择模式"checkbox","radio"<br/>
 * 注：模式为radio时，勾选子节点，父节点不是勾选状态，灰色标示作用<br/>
 *   模式为checkbox时，勾选子节点，父节点默认勾选状态
 * @name Horn.ZtreePanel#<b>checkMode</b>
 * @type String 
 * @default 
 * @example
 * #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
	
/**
 * 页面加载时，树组件默认是否展开
 * @name Horn.ZtreePanel#<b>expandFirst</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 是否显示操作按钮栏（包含展开、收缩和刷新）,默认不显示<br/>
 * 注：收缩/展开按钮，若有选中节点则展开/收缩选中节点，无选中节点，则展开/收缩整棵树；<br/>
 *   收缩/展开按钮，不会触发树的收缩与展开事件，必须点树节点击前面的加减号，才能触发树的收缩与展开事件；
 * @name Horn.ZtreePanel#<b>toolbar</b>
 * @type Boolean
 * @default false
 * @example
 * #ztree({  
 *       "id":"tree1",  
 *       "name":"ztree1",
 *   	"checkMode":"checkbox",
 *   	"onClick":"nodeClick",
 *   	"async":true,
 *		"toolbar":false,
 *      "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 是否使用模糊搜索,默认不使用
 * @name Horn.ZtreePanel#<b>search</b>
 * @type Boolean
 * @default false
 * @example
 * #ztree({  
 *       "id":"tree1",  
 *       "name":"ztree1",
 *   	"checkMode":"checkbox",
 *   	"onClick":"nodeClick",
 *   	"async":true,
 *		"toolbar":false,
 *		"search":false,
 *      "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 重新渲染的回调函数
 * @name Horn.ZtreePanel#<b>reRenderFn</b>
 * @type String
 * @default 
 * @example
 *  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "reRenderFn":"reRenderFn",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 * ##srcNode 源树节点
 * ##newDom　目标树节点
 * function reRenderFn(srcNode,newDom){
 * 	newDom.before("<span>*</span>")
 * }
 *  #end
 */
	
/**
 * 用于捕获节点被点击的事件回调函数
 * 注：该点击事件只针对节点文本，对于节点前面的单选/复选按钮无效<br/>
 * 如果设置了beforeClick 方法，且返回 false，将无法触发 onClick 事件回调函数
 * @name Horn.ZtreePanel#<b>nodeclick或onClick</b>
 * @type String
 * @default 
 * @example
 *  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onClick":"nodeClick",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 * ##标准的 js event 对象
 * ##对应 zTree 的 treeId，便于用户操控
 * ##treeNode被单击的节点 JSON 数据对象
 *   function nodeClick(event, treeId, treeNode){
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
	
/**
 * 节点点击前触发的函数,return false则取消点击事件执行
 * @name Horn.ZtreePanel#<b>beforenodeclick或beforeClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeClick":"nodeBeforeClick",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *  ## clickFlag 节点被点击后的选中操作类型(0,1,2)
 *   function nodeBeforeClick(treeId, treeNode, clickFlag){
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获异步加载之前的事件回调函数，zTree 根据返回值确定是否允许进行异步加载
 * @name Horn.ZtreePanel#<b>beforeAsync</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeAsync":"beforeAsync",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##treeId:对应 zTree 的 treeId，便于用户操控
 *  ##treeNode:进行异步加载的父节点 JSON 数据对象，针对根进行异步加载时，treeNode = null 
 *  ##禁止 id 为 1 的父节点进行异步加载操作 
 * function beforeAsync(treeId, treeNode) {
 * 	return (treeNode.id !== 1);
 * };
 *  #end
 */
/**
 * 用于捕获 勾选 或 取消勾选 之前的事件回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选
 * @name Horn.ZtreePanel#<b>beforeCheck</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeCheck":"beforeCheck",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeCheck(treeId, treeNode){
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获异步加载正常结束的事件回调函数。
 * 如果设置了beforeAsync 事件，且返回 false，将无法触发 onAsyncSuccess / onAsyncError 事件回调函数。
 * @name Horn.ZtreePanel#<b>onAsyncSuccess</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onAsyncSuccess":"onAsyncSuccess",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##treeId: 对应 zTree 的 treeId，便于用户操控
 *  ##treeNode: 进行异步加载的父节点 JSON 数据对象,针对根进行异步加载时，treeNode = null
 *  ##异步加载成功后，弹出提示信息
 *  function onAsyncSuccess(event, treeId, treeNode, msg) {
 * 	 alert(msg);
 *  };
 *  #end
 */
/**
 * 用于捕获异步加载出现异常错误的事件回调函数。
 * 如果设置了beforeAsync 事件，且返回 false，将无法触发 onAsyncSuccess / onAsyncError 事件回调函数。
 * @name Horn.ZtreePanel#<b>onAsyncError</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onAsyncError":"onAsyncError",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##treeId: 对应 zTree 的 treeId，便于用户操控
 *  ##treeNode: 进行异步加载的父节点 JSON 数据对象,针对根进行异步加载时，treeNode = null
 *  ## 异步加载出现异常后，弹出错误信息
 *   function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
 *   	alert(XMLHttpRequest);
 *   }
 *  #end
 */
/**
 * 用于捕获父节点折叠之前的事件回调函数，并且根据返回值确定是否允许折叠操作<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点击树节点击前面的减号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>beforeCollapse</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeCollapse":"beforeCollapse",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeCollapse(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之前的事件回调函数，并且根据返回值确定触发 onDblClick 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeDblClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDblClick":"beforeDblClick",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDblClick(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作
 * @name Horn.ZtreePanel#<b>beforeDrag</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDrag":"beforeDrag",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDrag(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获拖拽节点移动到折叠状态的父节点后，即将自动展开该父节点之前的事件回调函数，并且根据返回值确定是否允许自动展开操作
 * @name Horn.ZtreePanel#<b>beforeDragOpen</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDragOpen":"beforeDragOpen",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDragOpen(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获拖拽节点移动到折叠状态的父节点后，即将自动展开该父节点之前的事件回调函数，并且根据返回值确定是否允许自动展开操作
 * @name Horn.ZtreePanel#<b>beforeDrop</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDrop":"beforeDrop",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDrop(treeId, treeNodes, targetNode, moveType) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点编辑按钮的 click 事件，并且根据返回值确定是否允许进入名称编辑状态
 *    此事件回调函数最主要是用于捕获编辑按钮的点击事件，然后触发自定义的编辑界面操作。
 * @name Horn.ZtreePanel#<b>beforeEditName</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeEditName":"beforeEditName",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeEditName(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点击树节点击前面的加号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>beforeExpand</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeExpand":"beforeExpand",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeExpand(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标按键按下之前的事件回调函数，并且根据返回值确定触发 onMouseDown 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeMouseDown</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeMouseDown":"beforeMouseDown",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeMouseDown(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标按键松开之前的事件回调函数，并且根据返回值确定触发 onMouseUp 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeMouseUp</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeMouseUp":"beforeMouseUp",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeMouseUp(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被删除之前的事件回调函数，并且根据返回值确定是否允许删除操作
 * @name Horn.ZtreePanel#<b>beforeRemove</b>
 * @type String
 * @default
 * @ignore 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeRemove":"beforeRemove",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeRemove(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点编辑名称结束（Input 失去焦点 或 按下 Enter 键）之后，更新节点名称数据之前的事件回调函数，并且根据返回值确定是否允许更改名称的操作
 * 节点进入编辑名称状态后，按 ESC 键可以放弃当前修改，恢复原名称，取消编辑名称状态
*从 v3.5.13 开始，取消编辑状态也会触发此回调，根据 isCancel 参数判断
 * @name Horn.ZtreePanel#<b>beforeRename</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeRename":"beforeRename",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeRename(treeId, treeNode, newName, isCancel) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标右键点击之前的事件回调函数，并且根据返回值确定触发 onRightClick 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeRightClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeRightClick":"beforeRightClick",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeRightClick(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 checkbox / radio 被勾选 或 取消勾选的事件回调函数。
 *  如果设置了 beforeCheck 方法，且返回 false，将无法触发 onCheck 事件回调函数。
 * @name Horn.ZtreePanel#<b>onCheck</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onCheck":"onCheck",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onCheck(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被折叠的事件回调函数。
 *  如果设置了 beforeCollapse 方法，且返回 false，将无法触发 onCollapse 事件回调函数。<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点树节点击前面的减号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>onCollapse</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onCollapse":"onCollapse",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onCollapse(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeDblClick 方法，且返回 false，将无法触发 onDblClick 事件回调函数。
 * @name Horn.ZtreePanel#<b>onDblClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onDblClick":"onDblClick",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onDblClick(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeMouseDown 方法，且返回 false，将无法触发 onMouseDown 事件回调函数。
 * @name Horn.ZtreePanel#<b>onMouseDown</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onMouseDown":"onMouseDown",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onMouseDown(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeMouseUp 方法，且返回 false，将无法触发 onMouseUp 事件回调函数。
 * @name Horn.ZtreePanel#<b>onMouseUp</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onMouseUp":"onMouseUp",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onMouseUp(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeRightClick 方法，且返回 false，将无法触发 onRightClick 事件回调函数。
 * @name Horn.ZtreePanel#<b>onRightClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onRightClick":"onRightClick",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onRightClick(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被拖拽的事件回调函数。
 *  如果设置了 setting.callback.beforeDrag 方法，且返回 false，将无法触发 onDragMove 和 onDrag 事件回调函数。
 * @name Horn.ZtreePanel#<b>onDrag</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onDrag":"onDrag",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onDrag(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被拖拽过程中移动的事件回调函数。
 *  主要用于捕获 zTree 节点拖拽到的 DOM，从而操作对应的 DOM。
 * @name Horn.ZtreePanel#<b>onDragMove</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onDragMove":"onDragMove",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onDragMove(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被展开的事件回调函数
 *  如果设置了beforeExpand 方法，且返回 false，将无法触发 onExpand 事件回调函数。<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点树节点击前面的加号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>onExpand</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onExpand":"onExpand",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onExpand(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
var expandfirst=false;
Horn.ZtreePanel = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"ZtreePanel",
    /**
     * 引用的dom对象
     * @field
     * @name Horn.ZtreePanel#el
     * @type {HTMLDomDocument}
     * @ignore
     */
	el:null,
    /**
     * 异步调用时使用的url，用于进行动态加载节点
     * @field
     * @name Horn.ZtreePanel#url
     * @type {string}
     * @ignore
     */
	url:null,
    /**
     * 异步调用时使用的params
     * @field
     * @name Horn.ZtreePanel#params
     * @type {Object}
     * @ignore
     */
	params:{},
    /**
     * 静态载入时使用的Data,或用作初始化使用
     * @field
     * @name Horn.ZtreePanel#treedata
     * @type {Object}
     * @ignore
     */
	treedata:null,

	beforeClick : function(){
		return true;
	},
	onClick : function(){
		
	},
	onExpand : function(){},
	check : false,
	chkStyle : 'checkbox',
	init : function(dom) {
		Horn.ZtreePanel.superclass.init.apply(this,arguments) ;
		Horn.apply(this,this.params);
		this.treeEl = this.el.find('.ztree');
		var _tree = this;
		if(this.el.attr('treeclick')) {
			var fn = this.el.attr('treeclick');
			if(fn){
				fn = window[fn];
			}
			this.onClick = fn;
		}else{
			if(this.params.onClick){
				this.onClick = window[this.params.onClick];
			}
		}
		if(this.el.attr('beforetreeclick')) {
			var fn = this.el.attr('beforetreeclick');
			if(fn){
				fn = window[fn];
			}
			this.beforeClick = fn;
		}else{
			if(this.params.beforeClick){
				this.beforeClick = window[this.params.beforeClick];
			}
		}
		if(this.el.attr('reRenderFn')) {
			var fn = this.el.attr('reRenderFn');
			if(fn){
				fn = window[fn];
			}
			this.reRender = fn;
		}
		if(this.el.attr('onExpand')) {
			var fn = this.el.attr('onExpand');
			if(fn){
				fn = window[fn];
			}
			this.onExpand = fn;
		}
		var async = false;
		if(this.params.async&&this.params.async==true){
			async = true;
		}
       	var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			view: {
				nameIsHTML: true,
				showLine: false,
				showIcon: true,
				showTitle : true,
				selectedMulti: true,
				dblClickExpand: true,
				addDiyDom: function(treeId, treeNode){
					var IDMark_A = "_a";
					var aObj = $("#" + treeNode.tId + IDMark_A);
					_tree.reRender(treeNode,aObj);
				},
				fontCss: this.getFontCss
			},
			async: {
				enable: async,
				url:this.params.url?this.params.url:"",
				autoParam:this.params.otherParam?this.params.otherParam:[],
				otherParam:this.params.otherParam?this.params.otherParam:{},
			    type:this.params.type?this.params.type:"post",
				dataFilter: this.params.dataFilter?window[this.params.dataFilter]:null
			},
			callback: {
				beforeClick: this.beforeClick,
				beforeCheck: this.params.beforeCheck?window[this.params.beforeCheck]:null,
				beforeAsync : this.params.beforeAsync?window[this.params.beforeAsync]:null,
				onAsyncSuccess : this.params.onAsyncSuccess?window[this.params.onAsyncSuccess]:this.onAsyncSuccess,
				onAsyncError : this.params.onAsyncError?window[this.params.onAsyncError]:null,
				beforeCollapse : this.params.beforeCollapse?window[this.params.beforeCollapse]:null,
				beforeDblClick : this.params.beforeDblClick?window[this.params.beforeDblClick]:null,
				beforeDrag : this.params.beforeDrag?window[this.params.beforeDrag]:null,
				beforeDragOpen : this.params.beforeDragOpen?window[this.params.beforeDragOpen]:null,
				beforeDrop : this.params.beforeDrop?window[this.params.beforeDrop]:null,
				beforeEditName : this.params.beforeEditName?window[this.params.beforeEditName]:null,
				beforeExpand : this.params.beforeExpand?window[this.params.beforeExpand]:null,
				beforeMouseDown : this.params.beforeMouseDown?window[this.params.beforeMouseDown]:null,
				beforeMouseUp : this.params.beforeMouseUp?window[this.params.beforeMouseUp]:null,
				beforeRemove : this.params.beforeRemove?window[this.params.beforeRemove]:null,
				beforeRename : this.params.beforeRename?window[this.params.beforeRename]:null,
				beforeRightClick : this.params.beforeRightClick?window[this.params.beforeRightClick]:null,
				onCheck : this.params.onCheck?window[this.params.onCheck]:null,
				onCollapse : this.params.onCollapse?window[this.params.onCollapse]:null,
				onDblClick : this.params.onDblClick?window[this.params.onDblClick]:null,
				onDrag : this.params.onDrag?window[this.params.onDrag]:null,
				onDragMove : this.params.onDragMove?window[this.params.onDragMove]:null,
				onExpand : this.params.onExpand?window[this.params.onExpand]:this.onExpand,
				onMouseDown : this.params.onMouseDown?window[this.params.onMouseDown]:null,
				onMouseUp : this.params.onMouseUp?window[this.params.onMouseUp]:null,
				onNodeCreated : this.params.onNodeCreated?window[this.params.onNodeCreated]:null,
				onRemove : this.params.onRemove?window[this.params.onRemove]:null,
				onRename : this.params.onRename?window[this.params.onRename]:null,
				onRightClick : this.params.onRightClick?window[this.params.onRightClick]:null,
				onClick : this.onClick
			}
		};
		var checkMode = this.el.attr('checkMode');
		if(checkMode&&checkMode=="checkbox"){
			setting.check = {
				enable : true,
				chkStyle : checkMode
			};
		}
       	var data =  this.el.attr("items");
		if(data){
			data = $.parseJSON(data);
		}else{
			data = [];
		}
		var treeObj = this.treeEl;
		var treeid = this.treeEl.attr('id');
		if(!treeid){
			treeid = Horn.id();
			this.treeEl.attr('id',treeid);
		}
		if(async){
			$.fn.zTree.init(treeObj, setting);
		}else{
			$.fn.zTree.init(treeObj, setting, data);
		}
		this.treedata = data;
		this.treeObj = $.fn.zTree.getZTreeObj(treeid);
		if(this.el.attr('expandfirst')){
			expandfirst=true;
			this.treeObj.expandAll(true);
		}
		
		var name = this.el.attr('name');
		var expandBtn =  this.el.parent().parent().find("#expand_"+name);
		var unexpandBtn =  this.el.parent().parent().find("#unexpand_"+name);
		var refreshBtn =  this.el.parent().parent().find("#refresh_"+name);
		var searchBtn =  this.el.parent().parent().find("#search_"+name);
		var _this = this;
		expandBtn.bind('click',function(e) { 
			var checkNodes = _this.getCheckedNodes(true);
			if(checkNodes!=null&&checkNodes.length>0){
				$.each(checkNodes,function(index,node){
			        _this.treeObj.expandNode(node.getParentNode(),true);
			    });
			}else{
				_this.expandAll(true);
			}
		});
		unexpandBtn.bind('click',function(e) { 
			var checkNodes = _this.getCheckedNodes(true);
			if(checkNodes!=null&&checkNodes.length>0){
				$.each(checkNodes,function(index,node){
			        _this.treeObj.expandNode(node.getParentNode(),false);
			    });
			}else{
				_this.expandAll(false);
			}
		});
		refreshBtn.bind('click',function(e) { 
			_this.refresh();
		});
			searchBtn.bind('keyup',function(e) {
				
				var nodeList = _this.getNodesByParamFuzzy("name",this.value,null);
				if(this.value!=""){
					$.each(nodeList,function(index,node){
				        node.highlight = true;
				        _this.treeObj.updateNode(node);
				        _this.treeObj.expandNode(node.getParentNode(),true);
				    });
				}else{
					$.each(nodeList,function(index,node){
				        node.highlight = false;
				        _this.treeObj.updateNode(node);
				    });
					_this.expandAll(false);
				}
			
			this.focus();
		});
	},
	getFontCss:function(treeId, treeNode) {  
	    return (!!treeNode.highlight) ? {"font-weight":"bold"} : {color:"#333", "font-weight":"normal"};  
	},
    /**
     * 指定渲染函数
     * @name Horn.ZtreePanel#reRender
     * @function
     * @param {HTMLDomDocument} srcNode 源树节点
     * @param {HTMLDomDocument} treeNodeObj　目标树节点
     * @ignore
     */
	reRender : function(srcNode,treeNodeObj){
	},
	onAsyncSuccess :function(event, treeId, treeNode, msg) {
		if(expandfirst){
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			treeObj.expandAll(true);
		}
	},
    /**
     * 获取树
     * @name Horn.ZtreePanel#getTreeObj
     * @function
     * @ignore
     * @return {ztree object} treeObj
     */
	getTreeObj:function(){
		return this.treeObj;
	},
	 /**
     * 获取 zTree 的全部节点数据
     * @name Horn.ZtreePanel#getNodes
     * @function
     * @example
     * ##获取全部节点数据
     * Horn.getComp("ztree1").getNodes();
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return  Array(JSON)
     * 全部节点数据：
     * 1、Array 仅仅是根节点的集合（默认情况子节点都处于 children 属性下）；
     * 2、如需遍历全部节点需要利用递归，或利用 transformToArray 方法 将数据变成简单的 Array 集合
     * 3、对于异步加载模式下，尚未加载的子节点是无法通过此方法获取的。		     
     */
	getNodes: function(){
		var nodes = this.treeObj.getNodes();
		return nodes;
	},
	 /**
     * 新增节点
     * 如果需要获取数据在 zTree 内的对象，请获取此方法的返回值，请通过 zTree 对象执行此方法。
     * @name Horn.ZtreePanel#addNodes
     * @function
     * @param parentNode 指定的父节点，如果增加根节点，请设置 parentNode 为 null 即可。
     * @param index 索引值
     * @param newNodes 需要增加的节点数据 JSON 对象集合，数据只需要满足 zTree 的节点数据必需的属性即可
     * @param isSilent 设定增加节点后是否自动展开父节点。isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开。
     * @return  Array(JSON)
     * 返回值是 zTree 最终添加的节点数据集合。
     * 如果 newNodes 是单个节点数据 JSON，返回值也是将其包在 Array 内，
     * 请务必记住：返回值中的数据对象 是 newNodes 被 clone 后的，所以绝对不相等！
     * @example
     * ##对于 id = "tree" 的 zTree 增加 3 个根节点
     * var newNodes = [{name:"newNode1"}, {name:"newNode2"}, {name:"newNode3"}];
     * Horn.getComp("ztree1").addNodes(null, newNodes);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * 	function addNode(){
	 *      var zTree = Horn.getComp("ztree1").getTreeObj(),
	 *		isParent = true,
	 *		nodes = zTree.getSelectedNodes(),
	 *		treeNode = nodes[0];
	 *		var newCount = 1;
	 *		if (treeNode) {
	 *			treeNode = Horn.getComp("ztree1").addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"new node" + (newCount++)});
	 *		} else {
	 *			treeNode = Horn.getComp("ztree1").addNodes(null, {id:(100 + newCount), pId:0, isParent:isParent, name:"new node" + (newCount++)});
	 *		}
	 *   }
     */
	addNodes: function(parentNode, index, newNodes, isSilent){
		this.treeObj.addNodes (parentNode, index, newNodes, isSilent);
	},
	 /**
     * 
     * 取消节点的编辑名称状态，可以恢复原名称，也可以强行赋给新的名称
     * @name Horn.ZtreePanel#cancelEditName
     * @function
     * @param newName 重新给定的新名称。
     * @ignore
     * @example
     * Horn.getComp("ztree1").cancelEditName("aaa");
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	cancelEditName: function(newName){
		this.treeObj.cancelEditName(newName);
	},
	 /**
     * 
     * 取消节点的选中状态
     * @name Horn.ZtreePanel#cancelSelectedNode
     * @function
     * @param node 需要取消选中状态的节点。
     * @example
     * ##取消当前第一个被选中节点的选中状态
     * var nodes = Horn.getComp("ztree1").getSelectedNodes();
     * if (nodes.length>0) { 
     * 	Horn.getComp("ztree1").cancelSelectedNode(nodes[0]);
     * }
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	cancelSelectedNode: function(node){
		this.treeObj.cancelSelectedNode(node);
	},
	 /**
     * 
     * 勾选 或 取消勾选 全部节点。[checkMode = "checkbox" 时有效]
     * 此方法不会触发 beforeCheck / onCheck 事件回调函数。
     * @name Horn.ZtreePanel#checkAllNodes
     * @function
     * @param checked  true 表示勾选全部节点,false 表示全部节点取消勾选。
     * @example
     * Horn.getComp("ztree1").checkAllNodes(true);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	checkAllNodes: function(checked){
		this.treeObj.checkAllNodes(checked);
	},
	/**
     * 
     * 勾选 或 取消勾选 单个节点。
     * 此方法可以触发 beforeCheck / onCheck 事件回调函数。
     * @name Horn.ZtreePanel#checkNode
     * @function
     * @param node  需要勾选 或 取消勾选 的节点数据。
     * @param checked  true 表示勾选节点,false 表示节点取消勾选。
     * @param checkTypeFlag Boolean：true表示按照 进行父子节点的勾选联动操作；false表示只修改此节点勾选状态，无任何勾选联动操作
     * @param callbackFlag Boolean： true表示执行此方法时触发 beforeCheck & onCheck 事件回调函数；false表示执行此方法时不触发事件回调函数
     * @example
     * ##勾选当前选中的节点
     * var nodes = Horn.getComp("ztree1").getSelectedNodes();
	 *	for (var i=0, l=nodes.length; i < l; i++) {
	 *		Horn.getComp("ztree1").checkNode(nodes[i], true, true);
	 *	}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	checkNode: function(node, checked, checkTypeFlag, callbackFlag){
		this.treeObj.checkNode(node, checked, checkTypeFlag, callbackFlag);
	},
	/**
     * 
     * 复制节点
     * 3.x 复制节点时进行 clone 操作。如果需要获取数据在 zTree 内的对象，请获取此方法的返回值
     * @name Horn.ZtreePanel#copyNode
     * @function
     * @param targetNode  要复制到的目标节点 JSON 数据。
     * @param node  需要被复制的节点数据,如果复制成为根节点，请设置 targetNode 为 null 即可。
     * @param moveType  复制到目标节点的相对位置。
     * @param isSilent   设定复制节点后是否自动展开父节点。
     * @ignore
     * @example
     * Horn.getComp("ztree1").copyNode(targetNode, node, moveType, isSilent);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	copyNode: function(targetNode, node, moveType, isSilent){
		this.treeObj.copyNode(targetNode, node, moveType, isSilent);
	},
	/**
     * 
	 * 用此方法可以销毁 zTreeObj 代表的 zTree。
     * @name Horn.ZtreePanel#destroy
     * @function
     * @example
     * Horn.getComp("ztree1").destroy();
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	destroy: function(){
		this.treeObj.destroy();
	},
	/**
     * 
     * 设置某节点进入编辑名称状态。
	 *1、如果需要用 js 取消编辑名称状态，请使用 cancelEditName(newName) 方法。。
     *2、可利用此方法让当前正编辑的节点 input 输入框获取焦点。
     *3、请通过 zTree 对象执行此方法。
     * @name Horn.ZtreePanel#editName
     * @function
     * @param node   指定进入编辑名称状态的节点 JSON 数据。
     * @ignore
     * @example
     * var treeObj = Horn.getComp("ztree1").getTreeObj();
     *var nodes = treeObj.getNodes();
     *treeObj.editName(nodes[0]);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	editName: function(node){
		this.treeObj.editName(node);
	},
	/**
     * 
     * 展开 / 折叠 全部节点
     * 此方法不会触发 beforeExpand / onExpand 和 beforeCollapse / onCollapse 事件回调函数
     * @name Horn.ZtreePanel#expandAll
     * @function
     * @param expandFlag  true 表示 展开 全部节点,false 表示 折叠 全部节点。
     * @example
     * Horn.getComp("ztree1").expandAll(true);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Boolean
     * 返回值表示最终实际操作情况；
     * true 表示 展开 全部节点；
     * false 表示 折叠 全部节点；
     * null 表示 不存在任何父节点
     */
	expandAll: function(expandFlag){
		this.treeObj.expandAll(expandFlag);
	},
	/**
     * 
     * 展开 / 折叠 指定的节点;
     * 注：必须选中节点文本，勾选状态无效；
     * 此方法可以触发 beforeExpand / onExpand 或 beforeCollapse / onCollapse 事件回调函数
     * @name Horn.ZtreePanel#expandNode
     * @function
     * @param node  需要 展开 / 折叠 的节点 JSON 数据。
     * @param expandFlag  true 表示 展开 节点,false 表示 折叠 节点
     * @param sonSign  true 表示 全部子孙节点 进行与 expandFlag 相同的操作,false 表示 只影响此节点，对于其 子孙节点无任何影响(sonSign = false 且 expandFirst = expandFlag 时，不会触发回调函数，直接返回)。
     * @param focus    true 表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内, false 表示 展开 / 折叠 操作后，不设置任何焦点。
     * @param callbackFlag   true 表示执行此方法时触发 beforeExpand / onExpand 或 beforeCollapse / onCollapse 事件回调函数,callbackFlag = false 表示执行此方法时不触发事件回调函数。
     * @example
     * ##展开当前选择的第一个节点（包括其全部子节点）
     * var treeObj =  Horn.getComp("ztree1");
	 *	var nodes = treeObj.getSelectedNodes();
	 *	if (nodes.length>0) {
	 *		treeObj.expandNode(nodes[0], true, true, true);
	 *	}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Boolean
     * 返回值表示最终实际操作情况；
     * true 表示 展开 节点；
     * false 表示 折叠 节点；
     * null 表示 不是父节点
     */
	expandNode: function(node, expandFlag, sonSign, focus, callbackFlag){
		this.treeObj.expandNode(node, expandFlag, sonSign, focus, callbackFlag);
	},
	 /**
     * 获取输入框勾选状态被改变的节点集合（与原始数据 checkedOld 对比）
     * @name Horn.ZtreePanel#getChangeCheckedNodes
     * @ignore
     * @function
     * @return {ztree.getChangeCheckedNodes}
     */
	getChangeCheckedNodes: function(){
		return this.treeObj.getChangeCheckedNodes();
	},
	getCheckedNodes: function(checked){
		return this.treeObj.getCheckedNodes(checked);
	},
	/**
     * 
     * 根据节点数据的属性搜索，获取条件完全匹配的节点数据 JSON 对象
     * @name Horn.ZtreePanel#getNodeByParam
     * @function
     * @param key   需要精确匹配的属性名称。
     * @param value  需要精确匹配的属性值，可以是任何类型，只要保证与 key 指定的属性值保持一致即可。
     * @param parentNode   搜索范围，指定在某个父节点下的子节点中进行搜索。
     * @example
     * var treeObj =  Horn.getComp("ztree1");
	 * var node = treeObj.getNodesByParam("id", 1, null);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 匹配精确搜索的节点数据集合;
     * 如无结果，返回 [ ]
     */
	getNodesByParam: function(key, value, parentNode){
		return this.treeObj.getNodeByParam(key, value, parentNode);
	},
	/**
     * 
     * 根据节点数据的属性搜索，获取条件模糊匹配的节点数据 JSON 对象集合
     * @name Horn.ZtreePanel#getNodesByParamFuzzy
     * @function
     * @param key   需要精确匹配的属性名称。
     * @param value  需要精确匹配的属性值，可以是任何类型，只要保证与 key 指定的属性值保持一致即可。
     * @param parentNode   可以指定在某个父节点下的子节点中搜索。
     * @example
     * ##查找 name 包含 "test" 的节点数据
     * var treeObj =  Horn.getComp("ztree1");
	 * var node = treeObj.getNodesByParamFuzzy("name", "test", null);;
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 匹配模糊搜索的节点数据集合;
     * 如无结果，返回 [ ]
     */
	getNodesByParamFuzzy: function(key, value, parentNode){
		return this.treeObj.getNodesByParamFuzzy(key, value, parentNode);
	},
	/**
     * 获取 zTree 当前被选中的节点数据集合
     * @name Horn.ZtreePanel#getSelectedNodes
     * @function
     * @return Array(JSON)
     * 当前被选中的节点数据集合
     */
	getSelectedNodes: function(){
		return this.treeObj.getSelectedNodes();
	},
	/**
     * 
     * 隐藏某个节点。
     * @name Horn.ZtreePanel#hideNode
     * @function
     * @param node 指定被隐藏的节点 JSON 数据
     * @example
     * ##隐藏根节点第一个节点
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
     * treeObj.hideNode(nodes[0]);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	hideNode: function(node){
		this.treeObj.hideNode(node);
	},
	/**
     * 
     * 隐藏一批节点。
     * @name Horn.ZtreePanel#hideNodes
     * @function
     * @param nodes 指定被隐藏的节点 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
     * treeObj.hideNodes(nodes[0].children);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	hideNodes: function(nodes){
		this.treeObj.hideNodes(nodes);
	},
	/**
     * 
     * 移动节点。
     * @name Horn.ZtreePanel#moveNode
     * @function
     * @ignore
     * @param targetNode 要移动到的目标节点 JSON 数据
     * @param node 需要被移动的节点数据
     * @param moveType 指定移动到目标节点的相对位置
     * @param isSilent 设定移动节点后是否自动展开父节点,isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
     * treeObj.moveNode(nodes[0], nodes[1], "inner");
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return JSON 返回值是最终被移动的节点数据，正常情况下与 treeNode 参数完全相同
     */
	moveNode: function(targetNode, node, moveType, isSilent){
		return this.treeObj.moveNode(targetNode, node, moveType, isSilent);
	},
	/**
     * 
     * 强行异步加载父节点的子节点。
     * 已经加载过的父节点可反复使用此方法重新加载。
     * @ignore
     * @name Horn.ZtreePanel#reAsyncChildNodes
     * @function
     * @param targetNode 指定需要异步加载的父节点 JSON 数据
     * @param reloadType reloadType = "refresh" 表示清空后重新加载
     * @param isSilent 设定异步加载后是否自动展开父节点,isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * treeObj.reAsyncChildNodes(null, "refresh");
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	reAsyncChildNodes: function(parentNode, reloadType, isSilent){
		this.treeObj.reAsyncChildNodes(parentNode, reloadType, isSilent);
	},
	/**
     * 刷新 zTree
     * @name Horn.ZtreePanel#refresh
     * @function
     * @return  无
     */
	refresh: function(){
		this.treeObj.refresh();
	},
	/**
     * 
     * 清空某父节点的子节点
     * 1、清空子节点后，父节点会自动变为叶子节点。
     * 2、请勿用此方法清空根节点，如果需要清空根节点，直接初始化 zTree，并且设置初始节点为 null 即可。
     * 3、此方法不会触发任何事件回调函数。
     * @name Horn.ZtreePanel#removeChildNodes
     * @function
     * @param parentNode 需要清空子节点的父节点数据 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getSelectedNodes();
	*if (nodes && nodes.length>0) {
	*	treeObj.removeChildNodes(nodes[0]);
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 将该父节点的子节点数据返回，如果不存在则返回 null
     */
	removeChildNodes: function(parentNode){
		this.treeObj.removeChildNodes(parentNode);
	},
	/**
     * 
     * 删除节点
     * @name Horn.ZtreePanel#removeNode
     * @function
     * @param node 需要被删除的节点数据 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getSelectedNodes();
	*if (nodes && nodes.length>0) {
	*	for (var i=0, l=nodes.length; i < l; i++) {
	*		treeObj.removeNode(nodes[i]);
	*	}
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	removeNode: function(node, callbackFlag){
		this.treeObj.removeNode(node, callbackFlag);
	},
	/**
     * 
     * 选中指定节点
     * @name Horn.ZtreePanel#selectNode
     * @function
     * @param node 需要被选中的节点数据 JSON 数据
     * @param addFlag true 表示追加选中，会出现多点同时被选中的情况, false 表示单独选中，原先被选中的节点会被取消选中状态
     * @param isSilent true 选中节点时，不会让节点自动滚到到可视区域内, false （默认）表示选中节点时，会让节点自动滚到到可视区域内
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
	*if (nodes && nodes.length>0) {
	*	treeObj.selectNode(nodes[0]);
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	selectNode: function(node, addFlag,isSilent){
		this.treeObj.selectNode(node, addFlag,isSilent);
	},
	/**
     * 
     * 禁用 或 解禁 某个节点的 checkbox / radio 
     * 1、节点的 checkbox / radio 被禁用后，无法勾选或取消勾选。
     * 2、请不要直接修改已加载节点的 treeNode.chkDisabled 属性。
     * @name Horn.ZtreePanel#setChkDisabled
     * @function
     * @param node 需要禁用 或 解禁 checkbox / radio 的节点数据 JSON 数据
     * @param disabled true  true 表示禁用 checkbox / radio,  false 表示解禁 checkbox / radio
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getSelectedNodes();
	*if (nodes && nodes.length>0) {
	*	for (var i=0, l=nodes.length; i < l; i++) {
	*      treeObj.setChkDisabled(nodes[i], true);
	*   }
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	setChkDisabled: function(node, disabled, inheritParent, inheritChildren){
		this.treeObj.setChkDisabled(node, disabled, inheritParent, inheritChildren);
	},
	/**
     * 
     * 设置 zTree 进入 / 取消 编辑状态。
     * @name Horn.ZtreePanel#setEditable
     * @ignore
     * @function
     * @param editable true 表示进入 编辑状态,false 表示取消 编辑状态
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * treeObj.setEditable(true);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	setEditable: function(editable){
		this.treeObj.setEditable(editable);
	},
	/**
     * 
     * 显示某个被隐藏的节点。
     * @name Horn.ZtreePanel#showNode
     * @function
     * @param node 指定被显示的节点 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var node = treeObj.getNodeByParam("isHidden", true);
	 *if (node) {
	 *  treeObj.showNode(node);
	 *}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	showNode: function(node){
		this.treeObj.showNode(node);
	},
	/**
     * 
     * 显示一批已经被隐藏的节点。
     * @name Horn.ZtreePanel#showNode
     * @function
     * @param nodes 指定被显示的节点 JSON 数据集合
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodesByParam("isHidden", true);
	 *if (nodes) {
	 *  treeObj.showNodes(nodes);
	 *}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	showNodes: function(nodes){
		this.treeObj.showNodes(nodes);
	},
	/**
     * 
     * 将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。(免去用户自行编写递归遍历全部节点的麻烦)
     * @name Horn.ZtreePanel#transformToArray
     * @function
     * @param nodes 需要被转换的 zTree 节点数据对象集合 或 某个单独节点的数据对象
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.transformToArray(treeObj.getNodes());
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 转换后的简单 Array 数据格式
     */
	transformToArray: function(nodes){
		return this.treeObj.transformToArray(nodes);
	},
	/**
     * 
     * 将简单 Array 格式数据转换为 zTree 使用的标准 JSON 嵌套数据格式。
     * @name Horn.ZtreePanel#transformTozTreeNodes
     * @function
     * @param nodes 需要被转换的简单 Array 格式数据 或 某个单独的数据对象
     * @example
     * var simpleNodes = [
     * {"id":1, "pId":0, "name":"test1"},
     * {"id":11, "pId":1, "name":"test11"},
     * {"id":12, "pId":1, "name":"test12"},
     * {"id":111, "pId":11, "name":"test111"}
     * ];
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.transformTozTreeNodes(simpleNodes);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * zTree 使用的标准数据，子节点都存在于父节点数据的 children 属性中；
     * 如果 simpleNodes 是一个 JSON 对象，则被简单封装成长度为 1 的数组。
     */
	transformTozTreeNodes: function(simpleNodes){
		return this.treeObj.transformToArray(simpleNodes);
	},
	/**
     * 
     * 更新某节点数据，主要用于该节点显示属性的更新。
     * @name Horn.ZtreePanel#updateNode
     * @function
     * @param node 指定需要更新的节点 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
	 *	if (nodes.length>0) {
	 *		nodes[0].name = "test";
	 *		treeObj.updateNode(nodes[0]);
	 *	}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	updateNode: function(node, checkTypeFlag){
		this.treeObj.updateNode(node, checkTypeFlag);
	},
	getCheckedNodes:function(){
		return this.treeObj.getCheckedNodes();
	}
});

Horn.regUI("div.h_ztree",Horn.ZtreePanel);

function jresplusUIZtreeOnExpand(event, treeId, treeNode){
	$("#"+treeId).children("li").children("ul").removeAttr("style"); ;
}
