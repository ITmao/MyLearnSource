/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-2-11 		张超		增加默认值保存功能
 * 2014-3-3 		张超		filterByLabel增加filter之后设置值（或不设置）的功能。
 * 2014-2-14 		韩寅		修改注释
 * 2014-4-14        周智星      BUG #6552 【combox】(继承)addRule(rule)(原先无校验规则) 错误提示的位置不正确，偏离的位置相当大
 * 2014-4-16        周智星     BUG #6738 combo调用setDisabled（true）后应能通过API方式提交
 * 2014-4-16       	韩寅		BUG #6554 修改注释，描述只读更加准确
 * 2014-4-28        周智星     BUG #6838 combo_设置为只读的任然可以选择更改 设置为只读的任然可以选中后按退格键清除
 * 2014-5-4         周智星     修改combox的readonly属性说明文档
 * 2015-9-25        周智星     window控件中，若是控件占多行，显示有问题
 * 2016-2-16        刘龙        15930 需求16320--doc文档中，combox的方法changeDict，需要说明只能更换页面中已经调用的数据字典。
 * 2016-2-17        刘龙         需求16320 【TS:201601070226-JRESPlus-财富管理事业部-陈为-4. combox的changeDict的实现（目前API中】
 * 2016-3-4         刘龙         需求17376 【TS:201602230422-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br><br><br】
 * 2016-03-22       刘龙         bug#17102 combox调用addItems(item)方法后，再获取值，初始设置的值获取不到
 * 2016-3-23        刘龙        bug#17190 多选框combox设置value值为后续additem添加的值，显示后输入框设置值，调用addItems(item)方法，原先选中的值会被value值覆盖
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Combox
 * @class
 * 下拉选项组件</br>
 * 替代html的select组件，有更加丰富的交互和功能
 */

/**@lends Horn.Combox# */

/**
 * 仅在单选模式下生效，选项头格式如:{"label":"","value":"请选择 ..."}，其中label可以不配置，但是配置的值一定不能跟combox下拉的有效值重复
 * @name Horn.Combox#<b>headItem</b>
 * @type obj
 * @default 无
 * @example
 * 无
 */
/**
 * 静态显示值 格式："items":[{"text":"葡萄","code":"0"},{"text":"苹果","code":"1"}]
 * @name Horn.Combox#<b>items</b>
 * @type Array
 * @default 无
 * @example
 * 无
 */
/**
 * 增加配置项filterBy,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为key或者value
 * @name Horn.Select#<b>filterBy</b>
 * @type string
 * @default value
 * @example
 * 无
 */
/**
 * 数据字典名
 * @name Horn.Combox#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 是否多选，true表示多选，false表示单选
 * @name Horn.Combox#<b>multiple</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
 /**
 * 是否可编辑，true代表可编辑，false代表不可编辑，输入框是只读的
 * @name Horn.Combox#<b>editable</b>
 * @type Boolean
 * @default false
 * @ignore
 * @example
 * 无
 */
/**
 * 在初始化的默认就把下拉框中的内容全部选中；如果同时设置了selectAll=true和value属性，那么value属性优先生效
 * @name Horn.Combox#<b>selectAll</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 多选时的显示分隔符
 * @name Horn.Combox#<b>delimiter</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'pLabel'
 * @name Horn.Combox#<b>pKeyField</b>
 * @type String
 * @default "pLabel"
 * @example
 * 无
 * @ignore
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'label'，非必须，单值不能为空
 * @name Horn.Combox#<b>labelField</b>
 * @type String
 * @default "label"
 * @ignore
 * @example
 * 无
 */
/**
 * 用于渲染列表中的显示项目使用的item属性，默认为'code'，非必须，单值不能为空
 * @name Horn.Combox#<b>codeField</b>
 * @type String
 * @default "code"
 * @example
 * 无
 */
/**
 * 用于渲染列表中显示项目的实际值使用的item属性,默认为'value'，非必须，单值不能为空
 * @name Horn.Combox#<b>valueField</b>
 * @type String
 * @default "value"
 * @ignore
 * @example
 * 无
 */
/**
 * 用于渲染列表中显示项目的实际值使用的item属性,默认为'text'，非必须，单值不能为空
 * @name Horn.Combox#<b>textField</b>
 * @type String
 * @default "text"
 * @example
 * 无
 */
/**
 * 是否在渲染列表项目时显示实际值，默认为false
 * @name Horn.Combox#<b>showLabel</b>
 * @type Boolean
 * @default false
 * @example
 * @ignore
 * 无
 */

/**
 * @description 更改引用的数据字典(传入的字典参数必须在当前页面已经使用过，例如changeDict("province")，则字典province已经在页面其他combox组件中调用过)
 * @function
 * @name Horn.Combox#changeDict
 * @param {string} name 字典名
 */
/**
     * 设置是否可编辑，下拉框可以下拉
     * @function
     * @name Horn.Combox#setEditable
     * @param {Boolean} editable 不可编辑
     * @ignore
*/
/**
 * @description 仅在单选模式下有效，选中第一个非headItem对应的项
 * @function
 * @name Horn.Combox#selectFirst
 * @returns void
 */
/**
 * @description 根据关联项目过滤下拉列表
 * @function
 * @name Horn.Combox#filterByPLabel
 * @param pLabel 父节点值
 * @returns void
 * @ignore
 */
/**
 * @description 根据参数过滤下拉列表，此方法会自动情况清除上一次过滤效果，效果无法叠加
 * @function
 * @name Horn.Combox#filter
 * @param f String、Array、Function，Function参数为item的key
 * @param flag 默认为false，过滤掉包含在f中，或返回为true的项目，否则过滤掉其他项目
 * @param {Boolean} triggerChange 是否触发值更改事件
 * @returns void
 */
/**
 * @description 清空过滤显示所有的下拉项目
 * @function
 * @name Horn.Combox#clearFliter
 * @returns void
 */
/**
 * @description 隐藏下拉列表所有item
 * @function
 * @name Horn.Combox#clearList
 * @returns void
 */
/**
 * @description 动态增加下拉列表项目
 * @function
 * @name Horn.Combox#addDatas
 * @param data {Json or Array} [{label:'3','value':'测试3'},{label:'4','value':'测试4'}]　
 * @param isClear 是否清空原来的列表项
 * @ignore
 */
/**
 * @description 动态增加下拉列表项目；在isClear=true的情况下，如果设置的items无效，下拉框的内容依然会被清空。（注：如果下拉框设置的初始值在新添加的items中存在，则添加items后，会自动选中该初始值）
 * @function
 * @name Horn.Combox#addItems
 * @param items {Json or Array} [{label:'3','value':'测试3'},{label:'4','value':'测试4'}]　
 * @param isClear 是否清空原来的列表项
 */
/**
 * 是否启用模糊查询功能,如果配制为true，则会自动去除readonly的配置并将field转换为可编辑的;</br>
 * 默认根据key和value进行模糊查询;</br>
 * 在IE8下进行模糊查询时候，请不要将鼠标放置在下拉列表可能显示在的位置，这样会导致模糊过滤失效（已知BUG）
 * @name Horn.Combox#<b>enableFieldSearch</b>
 * @type boolean
 * @default false
 * @example
 * 无
 */

/*******************************************************************************/


/**
 * 组件唯一标识
 * @name Horn.Combox#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Combox#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Combox#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Combox#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Combox#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Combox#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Combox#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 被设置为只读的组件不能通过键盘输入改变表单的值，可以通过下拉选择改变表单的值，可以获得焦点，是可以参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；<font color=red>(注！readonly属性仅对多选的情况下有效，单选无效)</font>
  * true表示只读状态，不允许键盘输入，允许通过下拉按钮选择值；false表示正常状态，允许键盘输入，允许通过下拉按钮选择值
  * @name Horn.Combox#readonly
  * @type Boolean
  * @default true
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Combox#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的面板(panel)的cols而定
 * @name Horn.Combox#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Combox#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Combox#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 增加配置项filterBy,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为key或者value
 * key ：根据值过滤，value:根据显示名称过滤
 * @name Horn.Combox#<b>filterBy</b>
 * @type string
 * @default value
 * @example
 * 无
 */
 /**
  * 是否隐藏组件
  * @name Horn.Combox#hidden
  * @type Boolean
  * @default false
  * @example
  * #combox({"selectAll": false,"multiple": true, "name":"test13","label":"combox","value":"3333","defValue":"1", "dictName": "province", "cols":1,"check": "required","multiple":false,"filterBy":"key","hidden":true})
  */
/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Combox#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Combox#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Combox#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Combox#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Combox#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Combox#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Combox#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Combox#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Combox#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Combox#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交并且其所有校验状态都会消失，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Combox#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，可以通过下拉选择改变值，可以通过setValue、reset等API修改表单的值，并且可以参与表单提交<font color=red>(注！readonly属性仅对多选的情况下有效，单选无效)</font>
 * @function
 * @name Horn.Combox#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.Combox#setValue
 * @param {String} value 值
 * @param {Boolean} triggerChange 是否触发值更改事件
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Combox#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Combox#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Combox#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.Combox#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.Combox#validate
 */
/**
	 *返回下拉框中所有的数据
     * @function
     * @name Horn.Combox#getListData
     * @return object data为所有节点的值,dom为该节点的jquery对象
     */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Combox#emptyText
  * @type String
  * @default ""
  * @ignore
  * @example
  * #combox({"name":"test11f", "label":"combox", "defValue": "", "cols": 3, "check": "required", "disabled":false,"emptyText":"请选择..."})
  */
Horn.Combox = Horn.extend(Horn.Select,{
	COMPONENT_CLASS:"Combox",
	pLabel : "",
	filterFlag : "",
	displayField : null,
	keyAttr : "label",
	pKeyAttr : "pkey",
	valueAttr : "value",
	defaultValue : "",
	defaultText : "",
	showLabel : true,
	/**
	 * @ignore
	 */
	init : function(dom) {
		Horn.Combox.superclass.init.apply(this,arguments) ;
		this.combInit() ;
		//设置可能的多字典切换功能
		var field = this.el.find('input[ref]'),
			keyAttr = this.el.attr('keyfield'),
			pkeyAttr = this.el.attr('pkeyfield'),
			valueAttr = this.el.attr('titlefield')
			;
		if(keyAttr) this.keyAttr = keyAttr;	
		if(pkeyAttr) this.pkeyAttr = pkeyAttr;	
		if(valueAttr) this.valueAttr = valueAttr;


		var dictName = this.params['dictName'];
		if(dictName){
			this.field.attr('ref',dictName.split(',')[0] + (this.multipleline?'_m':'_s') ) ;
		}
		this.displayField = field;
		this.defaultValue = this.params.value || this.hidden.val();
//		this.setValue(this.defaultValue,true);
		
		//BUG #6838 combo_设置为只读的任然可以选择更改 设置为只读的任然可以选中后按退格键清除
		if(this.params.readonly) {
        	this.setReadonly(true);
        }
	},
	/**
	 * @ignore
	 */
	combInit : function(){
		var refname = this.hidden.attr("refname");
		if (refname) {
			this.field.bind("change",Horn.Util.apply(this.onCombChange,this));
		}
	},
	/**
	 * @ignore
	 */
	onCombChange : function(e, val){
		var refname = this.hidden.attr("refname") ;
		var refnames = refname.split(";") ;
		for(var i=0;i<refnames.length;i++){
			var rn = refnames[i] ;
			if (rn) {
				var rns = rn.split(",") ;
				Horn.getComp(rns[0],rns[1]).filterByPLabel(this.hidden.val()) ;
			}
		}
	},
	changeDict : function(name){
   		var name_copy=name;
   		this.clearFliter();
   		//16320 【TS:201601070226-JRESPlus-财富管理事业部-陈为-4. combox的changeDict的实现（目前API中】
   		var dict = Horn.getDict(name_copy);
		var $hc_checkboxdiv=$('<div class="hc_checkboxdiv">');
		var $ul=$("<ul></ul>");
   		var _this=this;
		if((this.field.get(0)).getAttribute("multiple")=="true"){
			name+="_m";
			$hc_checkboxdiv.attr("multiple_line","true");
			$.each(dict, function(i, n){
			  if(_this.params.showLabel){
			  	var $li=$('<li title='+n+' key='+i+'><label><input type="checkbox" class="combox_input"><span class="hce_dictlabel" >'+i+':</span>'+n+'</label></li>');
			  }else{
			  	var $li=$('<li title='+n+' key='+i+'><label><input type="checkbox" class="combox_input">'+n+'</label></li>');
			  }
			  
			  $ul.append($li);
			});
		}else{
			name+="_s";
			$hc_checkboxdiv.attr("multiple_line","false");
			$.each(dict, function(i, n){
			  if(_this.params.showLabel){
			  	var $li=$('<li title='+n+' key='+i+'><label><span class="hce_dictlabel" >'+i+':</span>'+n+'</label></li>');
			  }else{
			  	var $li=$('<li title='+n+' key='+i+'><label>'+n+'</label></li>');
			  }
			  
			  $ul.append($li);
			});
		}
		$hc_checkboxdiv.append($ul);
		this.field.attr("ref",name);
		/*if($("div.hc_checkboxdiv[ref_target='" + name + "']").length==0){
			this.listEl = $("div.hc_checkboxdiv[ref_target*='" + name_copy + "']");
		}else{
			this.listEl = $("div.hc_checkboxdiv[ref_target='" + name + "']");
		}*/
		
		this.listEl=$hc_checkboxdiv;		
   		this.multipleline = this.listEl.attr("multiple_line") == "true";
   		//this.setValue("");
   		//改变字典后，输入的值清空
   		if((this.field.get(0)).getAttribute("multiple")=="true"){
   			this.field.val("");
   		}else{
   			this.field.val("请选择...");
   		}
   		this.hidden.val("");
	},
	selectFirst : function() {
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		var lis = this.listEl.children("ul").children("li[key]");
		var key = "";
		var text = "" ;
		for ( var i = 0; i < lis.length; i++) {
			if ($(lis.get(i)).css("display") != "none") {
				key = $(lis.get(i)).attr("key");
				text = jQuery.trim($(lis.get(i)).text());
				if(key!="") break;
			}
		}
		this.setValue({"key":key,"text":text}, true);
	},
	/**
	 * @ignore
	 */
	getPos : function() {
		return {
			left : 0,
			top : 0
		};
	},
	/**
	 * @ignore
	 */
	hideAllList : function() {
		var listEl = this.listEl ;
		$("div.hc_checkboxdiv").each(function(i, o) {
			if (listEl.get(0) != o) {
				$(o).hide();
				$(o).data("show_name", "");
			}
		});
	},
	/**
	 * @ignore
	 */
	showList : function(inputEl, listEl) {
		var hidden = inputEl.prev() ;
		var filter = hidden.data("filter") ;
		if(filter){
			this[filter.name].apply(this,filter.params) ;
		}
		else{
			this.clearFliter(hidden) ;
		}
		Horn.Combox.superclass.showList.apply(this,arguments) ;
	},
	/**
     * @description 根据关联项目过滤下拉列表
     * @function
	 * @name Horn.Combox#filterByPLabel
	 * @param pLabel 父节点值
	 * @returns void
	 * @ignore
	 */
	filterByPLabel : function(pLabel) {
		if(this.pLabel!=pLabel){
			this.reset(true);
			this.pLabel = pLabel ;
			this.hidden.data("filter" ,{
				name : '_filterByPLabel',
				params : arguments 
			}) ;
		}
	},
	/**
	 * @ignore
	 */
	_filterByPLabel : function(pLabel,noSelectfirst) {
		if (!pLabel) {
			return false;
		}
		var ul = this.listEl.children("ul");
		// 先隐藏所有的li
		ul.children("li[key][pKey!='" + pLabel + "']").css("display",
				"none");
		ul.children("li[key][pKey='" + pLabel + "']").css("display",
				"block");
		//若是自己设置的value值，那么在此设置为原始值。
		if(this.defaultValue){
			this.setValue(this.defaultValue);
		}else if(!(noSelectfirst===false)&&(!this.multipleline)){
			this.selectFirst();
		}else{
			this.setValue('');
		}
	},	
	filter : function(f, flag,triggerChange) {
		//过滤之前，先清空上次过滤的值  2015-11-02 modify by 周智星
		this.clearFliter();
		var filter = {
			name : "_filter",
			params : arguments 
		} ;
		var oldFilter = this.hidden.data("filter") ;
		if(filter!=oldFilter){
			this.hidden.data("filter" ,filter) ;
			//BUG #6840 combo_filter以及setValue不会触发onchange事件
			if (triggerChange) {
	            this.field.trigger('change', filter);
	        }
		}
		var val =this.hidden.val();
		var _comb = this;
		if(val){
			//查询是否有这个值的显示li存在
			this._filter(f, flag);
			setTimeout(function(){
				$(val.split(',')).each(function(idx,v){
					if (_comb.listEl.children("ul").children(
							"li[key=" + v + "]").css('display') == "none") {
						_comb.reset(true);
					}
				});
			},200);
		}else{
			//查询是否有这个值的显示li存在
			this._filter(f, flag);
			setTimeout(function(){
				_comb.setValue('');
			},200);
		}
		
	},
	/**
	 * @ignore
	 */
	_filter : function(f, flag) {
		flag = !!flag;
		var d1 = "block", d2 = "none";
		if (flag) {
			d1 = "none";
			d2 = "block";
		}
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		// 先隐藏所有的li
		var liList = this.listEl.children("ul").children("li[key]") ;
		liList.css("display", d1);
		var D = ",";
		if ($.type(f) == "string") {
			f += D;
		}
		liList.each(
			function(index, dom) {
				var li = $(dom);
				var key = li.attr("key");
				if ($.type(f) == "function") {
					if (f.call(this, key)) {
						li.css("display", d2);
					}
				} else if ($.type(f) == "array") {
					if (jQuery.inArray(key, f) >= 0) {
						li.css("display", d2);
					}
				} else if ($.type(f) == "string") {
					if (f.indexOf(key + D) > -1) {
						li.css("display", d2);
					}
				}
		});
	},
	clearFliter : function() {
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		this.listEl.children("ul").children("li[key]").css("display", "block");
		this.hidden.data('filter',null);
	},
	clearList : function() {
		if(this.listEl&&this.listEl.length==0){
			this.listEl = this.field.parent().find("div.hc_checkboxdiv");
		}
		this.reset(true);
		this.listEl.children("ul").children("li[key]").remove();
	},
	addItems : function(data, isClear) {
		this.addDatas(data, isClear);
	},
	/**
     * @description 动态增加下拉列表项目
     * @function
	 * @name Horn.Combox#addDatas
     * @param data {Json or Array} [{"code":"33","text":"测试33"},{"code":"34","text":"测试34"}]　
     * @param isClear 是否清空原来的列表项
     * @ignore
	 */
	addDatas : function(data, isClear) {
		var list = [], listDiv = this.listEl, keyAttr = this.keyAttr, valueAttr = this.valueAttr, showLabel = this.showLabel;
		var hidden = this.hidden ;
		var field=this.field;
		var _this = this ;
		if(listDiv&&listDiv.length==0){
			listDiv = this.field.parent().find("div.hc_checkboxdiv");
		}
		var eventData = {
				inputEl : this.field,
				listEl : listDiv
		};
		if (jQuery.type(data) == "array") {
			list = data;
		}else if (jQuery.type(data) == "object"){
			if (jQuery.isPlainObject(data)) {
				if (jQuery.isEmptyObject(data)) {
					return;
				}
				list.push(data);
			}
		}else{
			if (isClear === true) {
				this.clearList();
			}
			return;
		}
		if (isClear === true) {
			this.clearList();
		}
		if (list.length > 0) {
			var ul = listDiv.children("ul");
			var multipleline = (listDiv.attr("multiple_line") == "true");
			$.each(list, function(index, obj) {
				var key = obj[keyAttr], val = obj[valueAttr];
				if (!key) {
					key = obj["code"];
					val = obj["text"];
				}
				if (key) {
					var li = ul
							.children("li[key='"
									+ key
									+ "']");
					if (li.length == 0) {
						var li = $("<li key='"
								+ key
								+ "' title='"
								+ val
								+ "'></li>");
						var label = $("<label></label>");
						label
								.text((showLabel ? key
										+ ":"
										: "")
										+ val);
						if (multipleline) {
							label.prepend('<input type="checkbox" class="combox_input"/>');
						}
						li.append(label);
						ul.append(li) ;
						if (listDiv.data("show_name") == hidden.attr("name")) {
							li.bind("click.li", eventData, Horn.Util.apply(
									_this.listClick, _this));
						}
					}
				}
			});
		}
		//17376 【TS:201602230422-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br><br><br】
		var defValue=_this.params.value;
		var initValue=hidden.attr("value");
		var initLable=field.val();
		var splitChar=","
		if(_this.params.delimiter){
			splitChar=_this.params.delimiter;
		}
		var addItemsValue=initValue;
		var addItemslable=initLable;
		//bug 17102 combox调用addItems(item)方法后，再获取值，初始设置的值获取不到
		var defValueArr=[];
		if(defValue&&defValue!=""){
			defValueArr=defValue.split(",");
		}
		for(var i=0;i<defValueArr.length;i++){
			defValue=defValueArr[i];
			//bug#17190 多选框combox设置value值为后续additem添加的值，显示后输入框设置值，调用addItems(item)方法，原先选中的值会被value值覆盖
			if(field.attr("selectMode")){
				//多选
				if(field.attr("selectMode")=="true"){
					$.each( list, function(i, obj){
					  if(addItemslable.indexOf(obj.text)<0){//不存在该值
					  	if(obj.code==defValue){
						  	addItemsValue =addItemsValue+(addItemsValue?",":"")+obj.code;
						  	addItemslable = addItemslable+(addItemslable?splitChar:"")+obj.text;
						  }
					  }
					  
					});
				}else{
					//单选
					$.each( list, function(i, obj){
					  if(obj.code==defValue){
					  	addItemsValue = obj.code;
					  	addItemslable = obj.text;
					  }
					});
				}
			}else{
				//单选
				$.each( list, function(i, obj){
				  if(obj.code==defValue){
				  	addItemsValue = obj.code;
				  	addItemslable = obj.text;
				  }
				});
			}
			
		
		}
		
		//hidden.val(addItemsValue);
		this.setValue(addItemsValue);
		field.val(addItemslable);
	},
    /**
     * @description 显示错误信息
     * @function
     * @name Horn.Combox#showError
     * @ignore
     */
	showError:function(){
		Horn.Combox.superclass.showError.apply(this,arguments) ;
		 var msg = this.msgDiv;
		 //BUG #6552 【combox】(继承)addRule(rule)(原先无校验规则) 错误提示的位置不正确，偏离的位置相当大
	     //msg.css('margin-top','-40px');
	}
}) ;
Horn.Field.regFieldType("div.hc_combox",Horn.Combox);