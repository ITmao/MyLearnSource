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
