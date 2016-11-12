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
