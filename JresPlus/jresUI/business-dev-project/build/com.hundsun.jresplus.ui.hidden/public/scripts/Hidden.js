/**
 * @name Horn.HiddenField   
 * @class
 * 隐藏域的包装组件</br>
 */	
/**
 * @lends Horn.HiddenField#
 */

/**
 * 组件唯一标识
 * @name Horn.HiddenField#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.HiddenField#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.HiddenField#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.HiddenField#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.HiddenField#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

//disabled 属性无法与 <input type="hidden"> 一起使用。

/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值,disabled对hidden无效
 * @function
 * @name Horn.HiddenField#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.HiddenField#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.HiddenField#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.HiddenField#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.HiddenField#clearValue
 */

	Horn.HiddenField = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"HiddenField",
		init : function(){
			Horn.HiddenField.superclass.init.apply(this,arguments);
			this.field = this.el;
			this.name = this.field.attr("name") ;
            this.alias = this.field.attr("alias") || "" ;
            this.defValue = (this.params.defValue != undefined)?this.params.defValue:this.field.val();
		},
		isValid : function(){
			return true;
		},
		showError : function(){
		},
		reset : function(clear){
			if(clear) {
                this.field.val("");
            }else{
                this.field.val(this.defValue);
            }
		},
		removeError : function(){
		}
	}); 
	Horn.Field.regFieldType("input.hc_hiddenfield",Horn.HiddenField) ;
