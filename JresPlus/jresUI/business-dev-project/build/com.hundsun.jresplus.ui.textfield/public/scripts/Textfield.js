/**
 * @name Horn.Textfield
 * @class
 * 普通文本输入组件
 */
/**
 * @lends Horn.Textfield#
 */
	 
/**
 * 组件唯一标识
 * @name Horn.Textfield#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Textfield#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Textfield#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Textfield#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Textfield#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Textfield#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Textfield#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Textfield#readonly
  * @type Boolean
  * @default false
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
 * 组件的跨列数，取值范围由外容器的面板(panel)的cols而定
 * @name Horn.Textfield#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Textfield#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Textfield#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作。
 * @name Horn.Textfield#maxlength
 * @type Number
 * @default 
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Textfield#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 是否隐藏组件
  * @name Horn.Textfield#hidden
  * @type Boolean
  * @default false
  * @example
  * #textfield({"name":"test11", "label":"textfield","value":"dsafdsafdsaf的撒范德萨大发发达dafdsaf的撒范德萨发", "defValue": "textfield默认值", "maxlength": 10, "cols": 1, "check": "required","hidden":true})
  */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Textfield#emptyText
  * @type String
  * @default ""
  * @example
  * #textfield({"label":"客户编号","name":"clientId","value":"", "check": "required","emptyText":"请输入客户ID"})
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Textfield#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Textfield#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Textfield#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Textfield#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Textfield#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Textfield#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Textfield#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Textfield#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Textfield#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Textfield#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Textfield#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Textfield#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Textfield#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Textfield#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Textfield#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Textfield#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Textfield#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Textfield#validate
 */
;{};