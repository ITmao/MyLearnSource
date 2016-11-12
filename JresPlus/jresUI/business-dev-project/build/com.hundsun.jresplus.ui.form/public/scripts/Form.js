
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