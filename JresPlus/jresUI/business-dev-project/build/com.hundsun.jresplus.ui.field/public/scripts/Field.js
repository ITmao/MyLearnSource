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
