/*
 * -----------------------------------------------------------------------
 * 修订记录：
 * 2014-2-11     zhangc   修正错误显示逻辑，removeError之后无法再次显示的问题
 * 2014-2-26     zhangc   修正翻译后内容超长溢出的问题。
 * 2015-04-20    zhangsu  BUG #9731 需求11320--label原先有value值，再用setvalue设置值，tip还是原先的值
 * ----------------------------------------------------------------------- 
 */
/**
 * @name Horn.Label   
 * @class
 * 用于显示标签的标签组件</br>
 */	
/**
 * @lends Horn.Label#
 */

/**
 * 组件唯一标识
 * @name Horn.Label#<b>id</b>
 * @type String
 * @default
 */
/**
 * 组件的名字
 * @name Horn.Label#<b>name</b>
 * @type String
 * @default
 */
/**
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Label#<b>alias</b>
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */
/**
 * 组件的初始值(值过长时，将截断字符，以...代替，鼠标移上去显示全部内容)
 * @name Horn.Label#<b>value</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 标签的显示文本(内容过长时，将截断字符，以...代替，鼠标移上去显示全部内容)
 * @name Horn.Label#<b>label</b>
 * @type String
 * @default
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Label#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 标签组件布局上所占的列数（1-4）
 * @name Horn.Label#<b>cols</b>
 * @type Int
 * @default 1
 * @example
 * 无
 */
/**
 * 组件的静态字典列表
 * @name Horn.Label#<b>items</b>
 * @type Array[Json
 * @default  
 * @ignore
 * @example
 * "items":[{"label":"a","value":"a1"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]
 */
/**
 * 组件的动态字典名字
 * @name Horn.Label#<b>dictName</b>
 * @type String
 * @default  
 * @ignore
 * @example
 * 无
 */
/**
 * 组件的隐藏名，如有值，则以此name提交一个当前的值到后台
 * @name Horn.Label#<b>hiddenName</b>
 * @type String
 * @default  
 * @example
 * 无
 */
/**
 * 组件的标签字段名字
 * @name Horn.Label#<b>labelField</b>
 * @type String
 * @default "label" 
 * @ignore
 * @example
 * 无
 */
/**
 * 组件的值字段名字
 * @name Horn.Label#<b>valueField</b>
 * @type String
 * @default "value" 
 * @ignore
 * @example
 * 无
 */
 /**
  * 组件的多个值时的分割符号,定义了分割符为多选,如果定义的分割为空，则用逗号分割
  * @name Horn.Label#<b>delimiter</b>
  * @type String
  * @default "" 
  * @ignore
  * @example
  * 无
  */
Horn.Label = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Label",
	el:null,
	dictName:null,
	staticDict:null,
	mutiValue : null,
	init:function(dom){
		Horn.Label.superclass.init.apply(this,arguments);
		var params = this.params;
		if(params['name'] || params['hiddenName']){
			this.name = params['name'] || params['hiddenName'] ;
		}
//		this.mutiValue = params.multiple ;
		this.mutiValue = $(dom).attr('mutivalue');
		
		this.label = this.el.prev('span');
		this.hidden = this.el.find('input:hidden');
		if(params['hiddenName']){                            //STORY #8616 
			this.hidden = this.el.next('input:hidden');
		}
		/*
		if(!this.hidden.get(0)){
			this.hidden = this.el.next('input:hidden');
		}*/
		this.li= this.el.parent();
		
		if(this.hidden) {
			this.el.parent().append(this.hidden);
		}
		
		var dictName = params["dictName"],
			staticDict = params["items"],
			labelName = params['labelField'] || 'label',
			valueName = params['valueField'] || 'value',
			delimiter = params['delimiter'],
			value = this.hidden.get(0)?this.hidden.val():this.el.html()
			;
		if(delimiter==""||this.delimiter){
			this.delimiter =delimiter;
			this.mutiValue = true;//只要定义了分隔符，皆为多选
		}else{
			this.delimiter =",";
		}
		
		if(staticDict){
			var tmpDict = {};
			for(var i=0;i<staticDict.length;i++){
				var obj = staticDict[i];
				tmpDict[obj[labelName]] = obj[valueName];
			}
			staticDict = tmpDict;
		}
		
		if(dictName){
			this.dictName = dictName; 
			staticDict = Horn.getDict(dictName);
		}
		
		this.staticDict = staticDict;
		
		if(value){
			this.setValue(  value );
		}
	},
	 /**
     * @description 设置标签的值
     * @function
     * @ignore
     * @name Horn.Label#setValue
     * @param {String} val 标签的值
     */
	setValue:function(value){
		value = $.trim(value);
		if(this.hidden){
			this.hidden.val(value);
		}
	
		var dictName = this.dictName,
			staticDict = this.staticDict
			;
		
		var getVal = function(val){
			var tmpval = "";
			if(staticDict){
				tmpval = staticDict[val]||val;
			}else if(dictName){
				var li = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li[key="+val+"]");
				tmpval = li.attr('title')||val;
			}else{
				tmpval = val;
			}
			return tmpval;
		};
		var fval = "";
		var overflow = false;
		if(!value) value="";
		if(this.mutiValue){
			var vv = [];
			$(value.split(this.delimiter)).each(function(idx,item){
				var v = getVal(item);
				vv.push(v||item);
			});
			fval = vv.join(this.delimiter||',');//若存在分隔符但分隔符为空，则用逗号代替
			overflow = true;
		}else{
			fval = getVal(value);
		}
	
		this.el.html(fval);
		var title = this.el.attr('title');
		/*if(title){
			//如何title已经存在，什么都不用做 20151103 modify by 周智星
		}else{
			this.el.attr('title',fval);
		}*/
		if(overflow){
			this.el.addClass('hc_texthide');
		}

		this.el.attr('title',fval);
	},
	/**
     * @description 取标签的值
     * @function
     * @ignore
     * @name Horn.Label#getValue
     * @return 标签的值
     */
	getValue:function(){
		if(this.hidden.get(0)){
			return this.hidden.val();
		}
		return this.el.text();
	},
    /**
     * @description 设置标签的名字
     * @function
     * @ignore
     * @name Horn.Label#setLabel
     * @param {string} val 标签的名字
     */
	setLabel:function(val){
		this.label.html(val);
	},
    /**
     * @description 取标签的名字
     * @function
     * @ignore
     * @name Horn.Label#getLabel
     * @return 标签的名字
     */
	getLabel:function(){
		return this.label.html();
	},
	hide:function(){
		this.li.hide();
	},
	show:function(){
		this.li.show();
	}
});

Horn.regUI("div.hc_label",Horn.Label) ;
