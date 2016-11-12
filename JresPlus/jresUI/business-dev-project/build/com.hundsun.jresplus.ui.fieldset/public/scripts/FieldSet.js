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
