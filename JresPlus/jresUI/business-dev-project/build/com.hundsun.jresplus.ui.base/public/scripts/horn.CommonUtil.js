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