
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
