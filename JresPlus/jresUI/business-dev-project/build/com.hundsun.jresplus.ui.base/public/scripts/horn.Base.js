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



