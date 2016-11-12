/*
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