/**
 * 修改记录
 * 2015-09-09               zhangsu        STORY #12305 TS:201507290161-JRESPlus-资产管理事业部-张翔-Typefield组件的验证会错位
 * 2015-10-30               周智星         STORY #14592 【TS:201510300234-JRESPlus-财富管理事业部-虞凯 添加支持负数金额
 * 2015-12-04               周智星         需求 #15026 【TS:201511240583-JRESPlus-资产管理事业部-张翔-1.typefield金额类型的，小数点目前只保留两位数，希望可以根据配置来决定保留几位数
 * 2015-12-23               周智星         STORY #15410 【TS:201512040007-JRESPlus-财富管理事业部-王瑞明 当typefield控制为金额类型时录入1.00 会自动把.00去掉 请修复该问题
 * 2016-1-14                刘龙             需求15324 金额控件suffixNum&quot;:3，保留3为小数，此时输入框中输入1.0000，tip显示为1元零，需要优化
 * 2016-1-14                刘龙             bug 13928 typefield控件inputType属性设置为cardNo后，建议不能输入小数点
 * 2016-3-7                 刘龙             需求#17546 【TS:201603010010-JRESPlus-财富管理事业部-王一俊-【项目名称】HUNDSUN另类投资管理系统软件V4.0<br】
 * 2016-3-11                刘龙             需求#17802 【TS:201603100429-JRESPlus-财富管理事业部-虞凯-<br><br><br><br>【项目名称】HUNDSUN
 */
/**
 * @name Horn.TypeField
 * @class
 * 支持金额、卡号输入类型的input组件
 */
/**
 * @lends Horn.Textfield#
 */
	 
/**
 * 组件唯一标识
 * @name Horn.TypeField#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.TypeField#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.TypeField#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.TypeField#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */	 
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.TypeField#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.TypeField#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.TypeField#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.TypeField#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.TypeField#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的panel的cols而定(支持1-4列)
 * @name Horn.TypeField#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.TypeField#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.TypeField#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */

/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作。
 * 组件失去焦点时，会自动加上显示分隔符，分隔符不进行字符计数，只统计数字长度。
 * @name Horn.TypeField#maxlength
 * @type Number
 * @ignore
 * @default 
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.TypeField#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */

/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.TypeField#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.TypeField#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.TypeField#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.TypeField#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.TypeField#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.TypeField#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.TypeField#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.TypeField#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.TypeField#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.TypeField#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.TypeField#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.TypeField#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */

/**
 * 设置表单的值
 * @function
 * @name Horn.TypeField#setValue
 * @param {String} value 值
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.TypeField#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.TypeField#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.TypeField#clearValue
 */

/**
 * 获取由validate方法触发表单校验后的结果，并通过返回值标识校验的结果
 * @function
 * @name Horn.TypeField#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
/**
 * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
 * @function
 * @name Horn.TypeField#validate
 */
/**
  * 是否隐藏组件
  * @name Horn.TypeField#hidden
  * @type Boolean
  * @default false
  * @example
  * #typefield({"check": "required;","value":"-3333.3392","defValue":"11111","maxlength":" ","id":"t2","name":"typefield2","label":"测试金额测试金额测试金额测试金额测试金额测试金额", "cols":1,"split":",","bigTips":true,"suffixNum":"5","hidden":true})
  */
/**
 * typefield的输入数据的类型，可配置为money和cardNo（分别代表金额和卡号输入的类型），其他值暂时不能支持(该值默认值money，如果不需要请使用textfield)
 * @name Horn.TypeField#inputType
 * @type String
 * @default "money"
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","inputType":"cardNo"})
 */
/**
 * 是否开启typefield的大tips展示，如果开启会影响所占行的布局，建议放在该行的最右面，并且设置初始值
 * @name Horn.TypeField#bigTips
 * @type boolean
 * @default false
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","bigTips":true})
 */
/**
 * 设置显示的分隔符,如果inputType为cardNo，此配置不可用
 * @name Horn.TypeField#split
 * @type String
 * @default ","
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","bigTips":true})
 */
/**
 * 小数点后缀保留几位数，默认保留两位（对金额类型有效）
 * @name Horn.TypeField#suffixNum
 * @type int
 * @default 2
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","suffixNum":3})
 */
/**
 * 整数位数需要保留几位数，默认对整数位数不做限制（对金额类型有效）
 * @name Horn.TypeField#integerNum
 * @type int
 * @default null
 * @example
 * #typefield({"check": "required;","value":"-3333.33","defValue":"11111","id":"t2","name":"typefield2","label":"测试金额", "cols":3,"split":",","integerNum":3})
 */
 /**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.TypeField#emptyText
  * @type String
  * @default ""
  * @example
  * #typefield({"name":"test11f", "label":"textarea", "defValue": "textarea默认值", "cols": 3, "check": "required", "disabled":true,"emptyText":"请输入..."})
  */
Horn.TypeField = Horn.extend(Horn.Field, {
		regChars : "-0123456789",
		suffixNumber:2,
		init : function(dom) {
			Horn.TypeField.superclass.init.apply(this, arguments);
			this.params.inputType = this.params.inputType ? this.params.inputType:"money";
			//BUG #9566 TypeField--属性split设置为其他，不显示设置分隔符，仍然为逗号
			this.config = {};
			//****修改大文字的信息提示为可配置，默认不开启
			// $.extend(this.config,this.params);
			this.config.bigTips = this.params.bigTips || false;
			if(this.params.split == ""){
				this.config.split = this.params.split
			}else{
				this.config.split = this.params.split || ",";
			}
			//需求 #15026 【TS:201511240583-JRESPlus-资产管理事业部-张翔-1.typefield金额类型的，小数点目前只保留两位数，希望可以根据配置来决定保留几位数
			if(this.params.suffixNum){
				var temp=/^\d+(\.\d+)?$/;
				if(temp.test(this.params.suffixNum)){
					this.suffixNumber = this.params.suffixNum;
				}
			}
			if(this.params.integerNum){
				this.integerNum = this.params.integerNum;
			}
			var that = this;
			
			//绑定 key press 事件
			this.field.bind({'keypress':Horn.Util.apply(that.onKeyPress,that)});
			//BUG #9554 inputType 设置为cardNo后，显示时焦点一移入就会显示空白tip
			var tipLabel = this.el.find("div.u-typefield-tip").appendTo($("body")).html(this.params.value || "");
			var tipDiv = "";
			if(this.field.width()&& this.field.width()>0){
				tipDiv = this.el.find("div.u-typefield-capital").width(this.field.width());
			}else{
				tipDiv = this.el.find("div.u-typefield-capital").css('width','100px');
			}
			  
			//this.field.parent("div").css({"float":"left"})

			this.tipLabel = tipLabel;
			this.tipDiv = tipDiv;
			
			//金额录入组件(支持返显中文)
			//增加一个配置型对输入类型进行识别，inputType="money"或者inputType="cardNo"
			if(this.params.inputType==="money"){
				 //校验输入属性
				 this.maskRe = new RegExp("[" + this.regChars +"\.]");
				 this.check = "decmal1;";
                 this.initProcess();
			}else if(this.params.inputType==="cardNo"){
				this.maskRe = new RegExp("[" + this.regChars +"]");
				this.check = "num;";
				this.initProcess();
			}else{
				return;
			}
			//resize
			$(window).resize(function(){
				tipLabel.hide();
			});
			
			var rv = this.getIEVersion();
			if(rv!=-1&&rv<10){
				if(this.params.emptyText&&this.params.emptyText!=""){
					this.field.val(this.params.emptyText);
				}
			}
		},
		/**
		 * BUG #9546
		 */
		setValue:function(value){
			value = value+"";
			if(value!=null&&value!=""){
				value = value+"";
	        	value = value.replace(/(^\s*)|(\s*$)/g,'');
	        }
			var hidden = this.hidden;
			var field = this.field;
			
			if (value === undefined || value === null||value == ""){
				field.val("");
	            hidden.val("");
	            this.tipLabel.html("");
				this.tipDiv.html("");
	            // return false;
			}else{
				
				if(value.indexOf(".")==0){
					value = "0"+value;
				}
				
				var firstChar = value.substring(0,1);
				//hidden's value without split !
				// value = value.replace(new RegExp("["+this.config.split+"||\s||^[0-9\.]]","g"),"");
				value = value.replace(/[^0-9\.-]/g,"")//支持负数 20151030 add by周智星
				
				hidden.val(value);
				this.changeTipsVal(value);

				var formatValue,CHValue = "";
				if(this.params.inputType == "money"){
					formatValue = spliteByChar(value,this.config.split,this.suffixNumber,this.integerNum);
					if(firstChar=="-"){
						formatValue = firstChar+formatValue;
					}
					field.val(formatValue);
				}else if(this.params.inputType == "cardNo"){
					if(value!=null&&value!=""){
						if(value.indexOf(".")!=-1){
							value = value.split(".")[0];
						}
					}
					var v = value,tmpStr = "";
					formatValue = v?v.match(/\d{1,4}/g).join("  "):"";
					field.attr("value",formatValue);
					//field.attr("title",formatValue);
					field.val(formatValue);
				}
			}
			if(value!=null&&value!=""){
				this.validate();
			}
		},
		/**
		 * 
		 */
		getValue:function(){
			var val = this.hidden.val();
	         if(val!=null&&val!=""){
	        	 val =val+"";
	         	val = val.replace(/(^\s*)|(\s*$)/g,'');
	         }
			return val ;
		},
		/**
		 * private
		 */
		onKeyPress : function(e){
	        var k = e.keyCode;
	        var cc = String.fromCharCode(k);
	        if(!this.maskRe.test(cc)){
	           /*if ( e && e.preventDefault ) {
	                e.preventDefault();
	            } else {
	               window.event.returnValue = false;
	           }*/
	        	// Horn.Util.stopPropagation(e);
	         //    return false;
	        }
		},
		showBigtips : function(){
			var w = this.field.width(),
			h = this.field.outerHeight();
			this.tipLabel.css({"top":this.field.offset().top+h,"left":this.field.offset().left,"z-index":9999}).show();
		},
		hideBigtips : function(){
			this.tipLabel.hide();
		},
	    initProcess : function(){
	    	var that = this;
	    	var tipLabel = this.tipLabel;

			//if default value
			//BUG #9559 textField_reset()重置有问题
			if(this.params.value && /^[\d|\.-]*$/.test(this.params.value)){//支持负数 20151030 add by周智星
				this.setValue(this.params.value);
			}else{
				this.params.value="";
				this.setValue("");
			}

			if(this.params.defValue && /^[\d|\.-]*$/.test(this.params.defValue)){//支持负数 20151030 add by周智星
				//defValue
			}else{
				this.params.defValue="";
			}
			
			//用户的输入类型判断为金额输入，产生一个绝对定位的输入框在下面
			this.field.focusin(function(){
				$(this).val(that.hidden.val())
				if(that.params.bigTips==true &&  that.hidden.val() && that.hidden.val()!="") {
					that.showBigtips();	
				};
			});
			
			this.field.focusout(function(){
				that.hideBigtips();
				that.setValue(that.hidden.val());
			});
			
			this.field.keyup(function(e){
				that.changeTipsVal($(this).val())
				if(that.hidden.val()&& that.hidden.val()!=""){
					if(that.params.bigTips==true){
						that.showBigtips();
					}
				}else{
					that.hideBigtips();
				}
			});
	    },
	    //BUG #9569 typeField_的inputType"为"money"时,event属性配置的事件不会触发
	    changeTipsVal:function(value){
			//hidden's value without split !
			// value = value.replace(new RegExp("["+this.config.split+"|\s]","g"),"");
			var firstChar = value.substring(0,1);
			
	    	value  = value.replace(/[^0-9\.-]/g,"");//支持负数 20151030 add by周智星
	    	//bug 13928 typefield控件inputType属性设置为cardNo后，建议不能输入小数点
	    	if(this.params.inputType == "cardNo"){
	    		if(value!=null&&value!=""){
					if(value.indexOf(".")!=-1){
						value = value.split(".")[0];
					}
				}
	    	}
			//value  = (value=="" || value==null) ? "":parseFloat(value)+"";
	    	//STORY #15410 【TS:201512040007-JRESPlus-财富管理事业部-王瑞明 当typefield控制为金额类型时录入1.00 会自动把.00去掉 请修复该问题
	    	if(value=="" || value==null){
				var endVal = value.split(".");
				if(endVal && endVal.length > 1){
					var tmp = parseFloat(endVal[1]).toFixed(this.suffixNumber);
					if(tmp!=0){
						value = parseFloat(value).toFixed(this.suffixNumber);
					}
				}
			}
			this.hidden.val(value)
			var formatValue,CHValue = "";
			if(this.params.inputType == "money"){
				//17802 【TS:201603100429-JRESPlus-财富管理事业部-虞凯-<br><br><br><br>【项目名称】HUNDSUN
				var arrNum=value.split(".");
				if(arrNum.length>0){
					var integerNum=arrNum[0].substr(0,this.integerNum);
					if(arrNum.length>1){
						value=integerNum+"."+arrNum[1]
					}else{
						value=integerNum
					}
					this.hidden.val(value) 
				}
				if(value.split(".")[1] && value.split(".")[1].length > 2){
					value = parseFloat(value).toFixed(this.suffixNumber);
					this.hidden.val(value);
				}
				formatValue = spliteByChar(value,this.config.split,this.suffixNumber,this.integerNum);
				
			    CHValue = numtochinese(value + "",this.suffixNumber);
				this.tipLabel.html(CHValue);
				this.tipDiv.html(CHValue);
				this.tipDiv.attr("title",CHValue);
			}else if(this.params.inputType == "cardNo"){
				var v = value,tmpStr = "";
				formatValue = v?v.match(/\d{1,4}/g).join("  "):"";
				tmpStr = v?v.match(/\d{1,4}/g).join(""):"";
				this.tipLabel.html(formatValue);
			}
	    }
	});
	Horn.Field.regFieldType("div.hc_textfield.typefield",Horn.TypeField) ;
	
    function isSpecialKey(k,e){
    	return (e.type == 'keypress' && e.ctrlKey) || 
       (k >= 33 && k <= 40) ||  // Page Up/Down, End, Home, Left, Up, Right, Down
        k == 13 ||              //enter return
        k == 9 ||               //Tab
        k == 27||(k == 8) || // Backspace
        (k >= 16 && k <= 20) || // Shift, Ctrl, Alt, Pause, Caps Lock
        (k >= 44 && k <= 46);   // Print Screen, Insert ;
    	
    }
	//格式化金额显示
	//BUG #9538 TypeField_value属性
	//BUG #9543 TypeField--金融类型输入组件-属性split
	function spliteByChar(val,s,suffixNumber,integerNum){
		var firstChar = val.substring(0,1);//获取第一个字符
		if(firstChar=="-"){
			val = val.substring(1);
		}
		var v = val,
			vArr = v.split("."),
			v0 = vArr[0],
			tmpStr = "";
		
		v0=v0.replace(/\D{1}/g,"");
		
		if(!v0) return;
		//17802 【TS:201603100429-JRESPlus-财富管理事业部-虞凯-<br><br><br><br>【项目名称】HUNDSUN
		v0=v0.substr(0,integerNum);
		$.each(v0.reverse().match(/\d{1,3}/g).reverse(),function(i,o){
			tmpStr+=o.reverse()+s;
		})
		//17546 【TS:201603010010-JRESPlus-财富管理事业部-王一俊-【项目名称】HUNDSUN另类投资管理系统软件V4.0<br】 
		if(s!=""){
			tmpStr=tmpStr.replace(new RegExp("["+s+"]$"),"");
		}		
		var reuslt = tmpStr+(vArr.length>1 ? "."+vArr[1].substr(0,suffixNumber):"");
		
		return reuslt
	}

	/*
	 * 功能：将货币数字（阿拉伯数字）(小写)转化成中文(大写）
	 * 参数：Num为字符型,小数点之后保留两位,例：Arabia_to_Chinese("1234.06") 说明：1.目前本转换仅支持到 拾亿（元）
	 * 位，金额单位为元，不能为万元，最小单位为分 2.不支持负数
	 */
	function numtochinese(Num,suffixNumber) {
		for (i = Num.length - 1; i >= 0; i--) {
			Num = Num.replace(",", "")// 替换tomoney()中的“,”
			Num = Num.replace(" ", "")// 替换tomoney()中的空格
		}
		Num = Num.replace("￥", "")// 替换掉可能出现的￥字符
		if (isNaN(Num)) {
			// 验证输入的字符是否为数字
//			alert("请检查小写金额是否正确");
			return;
		}
		// ---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
		var part = String(Num).split(".");
		var newchar = "";
		// 小数点前进行转化
		for (i = part[0].length - 1; i >= 0; i--) {
			if (part[0].length > 17) {
//				alert("");
				return "位数过大，无法计算";
			}// 若数量超过拾亿单位，提示
			var tmpnewchar = ""
			var perchar = part[0].charAt(i);
			switch (perchar) {
			case "0":
				tmpnewchar = "零" + tmpnewchar;
				break;
			case "1":
				tmpnewchar = "壹" + tmpnewchar;
				break;
			case "2":
				tmpnewchar = "贰" + tmpnewchar;
				break;
			case "3":
				tmpnewchar = "叁" + tmpnewchar;
				break;
			case "4":
				tmpnewchar = "肆" + tmpnewchar;
				break;
			case "5":
				tmpnewchar = "伍" + tmpnewchar;
				break;
			case "6":
				tmpnewchar = "陆" + tmpnewchar;
				break;
			case "7":
				tmpnewchar = "柒" + tmpnewchar;
				break;
			case "8":
				tmpnewchar = "捌" + tmpnewchar;
				break;
			case "9":
				tmpnewchar = "玖" + tmpnewchar;
				break;
			}
			switch (part[0].length - i - 1) {
			case 0:
				tmpnewchar = tmpnewchar + "元";
				break;
			case 1:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "拾";
				break;
			case 2:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "佰";
				break;
			case 3:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "仟";
				break;
			case 4:
				tmpnewchar = tmpnewchar + "万";
				break;
			case 5:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "拾";
				break;
			case 6:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "佰";
				break;
			case 7:
				if (perchar != 0)
					tmpnewchar = tmpnewchar + "仟";
				break;
			case 8:
				tmpnewchar = tmpnewchar + "亿";
				break;
			case 9:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "拾";
				break;
			case 10:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "百";
				break;
			case 11:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "仟";
				break;
			case 12:
				tmpnewchar = tmpnewchar + "兆";
				break;
			case 13:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "拾";
				break;
			case 14:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "百";
				break;
			case 15:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "仟";
				break;
			case 16:
				if (perchar != 0)
				tmpnewchar = tmpnewchar + "吉";
				break;
			case 17:
				tmpnewchar = tmpnewchar + "拾";
				break;
			}
			newchar = tmpnewchar + newchar;
		}
		// 小数点之后进行转化
		if (Num.indexOf(".") != -1) {
			if (part[1].length > 2) {
				//alert("小数点之后只能保留两位,系统将自动截段");
				var tempNum = parseFloat(Num);
				Num = tempNum.toFixed(suffixNumber);
				part = String(Num).split(".");
			}
			for (i = 0; i < part[1].length; i++) {
				tmpnewchar = ""
				perchar = part[1].charAt(i)
				switch (perchar) {
				case "0":
					tmpnewchar = "零" + tmpnewchar;
					break;
				case "1":
					tmpnewchar = "壹" + tmpnewchar;
					break;
				case "2":
					tmpnewchar = "贰" + tmpnewchar;
					break;
				case "3":
					tmpnewchar = "叁" + tmpnewchar;
					break;
				case "4":
					tmpnewchar = "肆" + tmpnewchar;
					break;
				case "5":
					tmpnewchar = "伍" + tmpnewchar;
					break;
				case "6":
					tmpnewchar = "陆" + tmpnewchar;
					break;
				case "7":
					tmpnewchar = "柒" + tmpnewchar;
					break;
				case "8":
					tmpnewchar = "捌" + tmpnewchar;
					break;
				case "9":
					tmpnewchar = "玖" + tmpnewchar;
					break;
				}
				if (i == 0)
					tmpnewchar = tmpnewchar + "角";
				if (i == 1)
					tmpnewchar = tmpnewchar + "分";
				newchar = newchar + tmpnewchar;
			}
		}
		//替换所有无用汉字
		while (newchar.search("零零") != -1)
			newchar = newchar.replace("零零", "零");
		newchar = newchar.replace("零亿", "亿");
		newchar = newchar.replace("亿万", "亿");
		newchar = newchar.replace("零万", "万");
		newchar = newchar.replace("零元", "元");
		newchar = newchar.replace("零角", "");
		newchar = newchar.replace("零分", "");
		
		
		newchar = newchar.replace("亿万", "亿");
		newchar = newchar.replace("兆亿", "兆");
		newchar = newchar.replace("零兆", "兆");
		newchar = newchar.replace("吉兆", "吉");
		
		

		if (newchar.charAt(newchar.length - 1) == "元"
				|| newchar.charAt(newchar.length - 1) == "角")
			newchar = newchar + "整";

		var digit = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		var _i = 0
		while(newchar.length > 0){
			if(digit.indexOf(newchar[0]) < 0){
				newchar = newchar.substr(1);
			}else{
				break;
			}
		}
		// //remove 0元
		// if(newchar.indexOf('元') ==0){
		// 	newchar = newchar.substr(1);
		// }
		// if(newchar.indexOf('整') ==0){
		// 	newchar = newchar.substr(1);
		// }
		var firstChar = Num.substring(0,1);
		if(firstChar=="-"){
			newchar = "负"+newchar;
		}
		//15324 金额控件suffixNum&quot;:3，保留3为小数，此时输入框中输入1.0000，tip显示为1元零，需要优化
		var lastChar=newchar.charAt(newchar.length-1);
		if("零" == lastChar){
			newchar=newchar.substring(0,newchar.length-1);
			newchar=newchar+"整";
		}
		return newchar;
	}
