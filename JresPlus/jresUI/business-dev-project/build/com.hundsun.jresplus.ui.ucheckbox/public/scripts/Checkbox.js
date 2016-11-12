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
