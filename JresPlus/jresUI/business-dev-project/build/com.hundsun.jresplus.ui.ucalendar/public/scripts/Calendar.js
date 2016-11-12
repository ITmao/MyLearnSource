/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: Calendar.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：日期组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-04-11     周智星    BUG #6501 【calendar】如果设置了check为date，但是format:'yyyy年MM月dd日'，会造成校验失败(修改了文档说明)
 * 2014-04-16     周智星    BUG #6753 Calendar_setValue()设置了不符合日期格式的数据，也能提交
 * 2014-04-16     王玉豹    getValue方法不再调用父类，处理返回时格式化日期
 * 2014-08-12   wangyb10555		STORY #8854 [研发中心/内部需求][JresPlus][UI]日历组件中，先清空再reset设置默认值时，会无法通过校验并提示空值
 * 2014-12-05	wangyb10555		STORY #10272 [海外发展部-胡琦][TS:201411110151]-JRESPlus-ui-现在的日期控件只能选择到日，我们需要年月选择控件。
 * 2015-1-30	wangyb10555		STORY #10644 [研发中心/内部需求][JresPlus][UI][#8477]calendar只能通过下拉日期框选择，不能在输入框中输入，建议添加可编辑功能 
 * 2015-04-09	wangyb10555		STORY #11253 【TS:201504090165-JRESPlus-财富管理事业部-王一俊- JresPlus UI 日期控件问题：
 * 2015-04-16   zhangsu         BUG #9700 js中语法错误todayBtn:conf.noToday===true?false:true,多了逗号
 * 2015-12-04   周智星          需求 #15010 【TS:201511230297-JRESPlus-资产管理事业部-张翔-2.Calendar日期控件，键盘输入校验未设置，在输入之后
 * 2016-3-2     刘龙             需求17380 【TS:201602230426-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br>【产品及版本信】
 * 2016-3-11    刘龙             需求#17814 【TS:201603110065-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）【产品及版本信息】
 * 2016-3-17    刘龙            需求#17900 【TS:201603160506-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br><br>】
 * 2016-3-22    刘龙            bug#17104 需求17814--canEditable属性与focusShowCalendar属性组合失败
 * 2016-3-29    刘龙           bug#17348 需求17788--focusShowCalendar为false时，未自动根据yyyyMMdd格式进行日期校验
 * ----------------------------------------------------------------------- 
 */

/**
 * @name Horn.Calendar   
 * @class
 * 日期组件为第三方插件</br>
 */
	
/**
 * @lends Horn.Calendar#
 */

/**
 * 组件的配置选项如:日期格式，如果配置了config属性，会自动根据format格式进行日期校验,默认格式是yyyy-MM-dd,但是可以在自己的布局通过Horn.Calendar.DEFAULT_FORMAT来改变格式，如：Horn.Calendar.DEFAULT_FORMAT = 'yyyyMMdd';<br/>
 * (注意！1.如果填写了config，就不能再调用date验证规则，例如：#calendar({"label":"日期校验", "name": "test5", "value":"中文", "check": "required;date;", "config":"{format:'yyyy-MM-dd'}"})；date和config只能选择一个;<br/>
 * 2.如果没有配置"config"，也没有配置"check":"date"属性，则会自动根据:'yyyyMMdd'格式进行日期校验);<br/>
 * minDate和maxDate的配置必须为类似2012-12-09的格式;另外由于第三方组件对中文格式化的支持有限config中format不能配置有中文分隔符如yyyy年MM月;yyyyMMddHHmmss,yyyy/MM/dd HH:mm:ss<br/>
 * 用户配置的format会自动的识别，如果配置到h就会显示到选择小时的界面，如果配置到m就会显示到选择月份的界面为止;<br/>
 * 另外，用户配置的format和minDate/maxDate的格式必须一致
 * @name Horn.Calendar#<b>config</b>
 * @type String
 * @default 无
 * @example
 * 你也可以指定一个符合 ISO-8601 格式的日期时间：
 * "config":"{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd'}"
 */

/**
 * 组件唯一标识
 * @name Horn.Calendar#id
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交名字
 * @name Horn.Calendar#name
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件的标签名，值过长会造成label显示不全，但是可以通过鼠标悬浮看到完整值
 * @name Horn.Calendar#label
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.Calendar#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @ignore
 * 组件的别名，名字相同时，加别名区分
 * @name Horn.Calendar#alias
 * @type String
 * @default ""
 * @ignore
 * @example
 * var comp = Horn.getComp("name","alias")
 */

 /**
  * 表单的初始值，如果没有配置defValue属性，表单重置的时候，将采用value作为重置值
  * @name Horn.Calendar#value
  * @type String
  * @default ""
  * @example
  * 无
  */

 /**
  * 组件的重置时的值，如果没有配置此值，将以value属性做为重置值。
  * 如果指定了value值，并且defValue设置为空(defValue:"")，则无法重置为空值，请用form组件的clearValue方法清空form内组件的值或调用组件本身的clearValue方法清空值。
  * @name Horn.Calendar#defValue
  * @type String
  * @default 无
  * @example
  * 无
  */

 /**
  * 组件的是读配置，被设置为只读的组件只能通过API的方式修改表单的值，可以获得焦点，参与表单校验（校验失败会阻止表单提交），并且可以参与表单提交；
  * true表示只读状态，false表示正常状态
  * @name Horn.Calendar#readonly
  * @type Boolean
  * @default false
  * @example
  * 无
  */

 /**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.Calendar#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */

/**
 * 组件的跨列数，取值范围由外容器的面板(panel)的cols而定
 * @name Horn.Calendar#cols
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * 组件的约束检查选项
 * @name Horn.Calendar#check
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */
 /**
  * 是否隐藏组件
  * @name Horn.Calendar#hidden
  * @type Boolean
  * @default false
  * @example
  * #calendar({"label":"calendar", "name":"test16", "defValue": "", "cols": 1, "check": "required;testCheck","events":[{"event":"onkeyup","function":"keypress()"}],"hidden":true})
  */
/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.Calendar#group
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj($obj为范围,是jquery对象或原生dom对象)中组名为group1的组件的有效性(group同名的即为同组)
 *	<div id="testCalendar1">
 *		#calendar({"label":"日期1", "name": "test1","group": "group1"})
 *		#calendar({"label":"日期2", "name": "test2","group": "group1"})
 *  </div>
 * function validateGroup1() {
 *		Horn.Validate.validateAreaByGroup($("#testCalendar1"), "group1");
 * }
 */

/**
 * 内容最大长度，超过长度的文字无法输入，一个汉字相当于两个字符。比如“中文abc”，总共的文字数为7，中文、空格、英文字母、标点都只算一个字符。
 * 但是需要特别注意，maxlength属性只能限制键盘输入，或者粘贴等操作，无法限制api设置操作，并且此属性对textarea无效。
 * @name Horn.Calendar#maxlength
 * @type Number
 * @default 
 * @ignore
 * @example
 * 无
 */

 /**
  * 组件的事件配置
  * @name Horn.Calendar#events
  * @type Array
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 输入框获得焦点是否弹出日历控件(默认输入框获得焦点自动弹出日历控件)；
  * 注：不建议与canEditable同时设置，若是focusShowCalendar为true，canEditable为false，输入框移入焦点，日期框无法弹出。
  * @name Horn.Calendar#focusShowCalendar
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
 /**
  * 输入框是否可编辑(默认输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期)。<br/>
  * 1.当设置为true时，输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期；2.当设置为false时，输入框不可以手工输入，点击输入框时不弹出日期选择器，点击图标可以弹出日历组件选择日期；
  * @name Horn.Calendar#canEditable
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.Calendar#emptyText
  * @type String
  * @default ""
  * @example
  * #calendar({"label":"calendar", "name":"test16", "defValue": "", "cols": 1, "check": "required;","hidden":false,"config":"{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd HH:mm:ss'}","emptyText":"请输入日期"})
  */
/**
 * 加入一个分组中，可以根据组名进行分组校验，参见validate的validateAreaByGroup(scope, group)方法
 * @function
 * @name Horn.Calendar#addGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 从一个分组中删除
 * @function
 * @name Horn.Calendar#removeGroup
 * @param {String} group 组名
 * @ignore
 */
/**
 * 判断组件上会否在分组中
 * @function
 * @name Horn.Calendar#inGroup
 * @param {String} group 组名
 * @ignore
 */

/**
 * 增加校验规则
 * @function
 * @name Horn.Calendar#addRule
 * @param {String} rule 校验规则字符串
 */
/**
 * 删除校验规则
 * @function
 * @name Horn.Calendar#removeRule
 * @param {String} rule 校验规则字符串
 */

/**
 * 显示表单，如果表单已经显示，此方法无效果，hide方法与之相对应
 * @function
 * @name Horn.Calendar#show
 */
/**
 * 隐藏表单，如果表单已经隐藏，此方法无效果，show方法与之对应
 * @function
 * @name Horn.Calendar#hide
 */

/**
 * 设置label内容
 * @function
 * @name Horn.Calendar#setLabel
 * @param {String} label 标签内容
 * @ignore
 */
/**
 * 获取label内容
 * @function
 * @name Horn.Calendar#getLabel
 * @return 标签内容
 * @ignore
 */

/**
 * 设置为必填项，同时增加红色的 *
 * @function
 * @name Horn.Calendar#setRequired
 * @param {Boolean} required 不传值或者传true表示必选项，传false表示取消必选项
 */
/**
 * 设置字段是否禁用，被设置为禁用的组件，不可以编辑，也不参与表单提交，但是可以通过API的方式修改表单的值
 * @function
 * @name Horn.Calendar#setDisabled
 * @param {Boolean} disabled true表示禁用，false表示正常
 */
/**
 * 设置是否只读，设置为只读方式的组件，不可以编辑，但是可以通过setValue、reset等API修改表单的值，并可以可以参与表单提交
 * @function
 * @name Horn.Calendar#setReadonly
 * @param {Boolean} readonly true表示只读，false表示正常
 */
/**
 * 获取表单的值
 * @function
 * @name Horn.Calendar#getValue
 * @return 表单的提交值
 */
/**
 * 如果设置了defValue的值，重置成的defValue值，否则重置成value值
 * @function
 * @name Horn.Calendar#reset
 */
/**
 * 清空表单的值，显示值和隐藏值都设置为""
 * @function
 * @name Horn.Calendar#clearValue
 */

/**
 * 触发校验表单的内容，并通过返回值标识校验的结果
 * @function
 * @name Horn.Calendar#isValid
 * @return {Boolean} true表示校验通过，false表示校验失败
 */
;(function($){
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"]
	};
}(jQuery));
Horn.Calendar = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"Calendar",
    /**
     * @description 默认日期格式
     * @field
     * @name Horn.Calendar.DEFAULT_FORMAT
     * @default yyyy-MM-dd
	 * @ignore
     */
	/**
	 * @ignore
	 */
	init : function(dom){
		Horn.Calendar.superclass.init.apply(this,arguments) ;
		var input = this.el.children("input:text") ;
		var hidden = this.el.children("input:hidden") ;
		this.name = hidden.attr("name") ;
		this.alias = hidden.attr("alias") ;
		var config = this.params.config;
		var settings = {};
		
		if (config  && typeof (config) == "string") {
			settings = eval('(' + config + ')');
		}else if(typeof (config) == "object"){
			settings = config;
		}else{
			settings = {};
		}
		this.format=settings.format;
		if(!settings.format){
			settings.format = Horn.Calendar.DEFAULT_FORMAT;
			hidden.attr("format","noConfig");//没有自定义格式
		}else{
			hidden.attr("format","yesConfig");
		}
		
		settings['btnBar'] = false;
		
		this.settings = settings;
		
		this.minDate = Horn.Util.Format.date(settings["minDate"],"yyyy-MM-dd HH:mm");
		this.maxDate = Horn.Util.Format.date(settings["maxDate"],"yyyy-MM-dd HH:mm");
		
		this.initDate = function(conf){
			//判断显示的视图
			var lformat = conf.format.toLowerCase()
			var viewNo = conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;
			
			if(viewNo === 3){
				conf.noToday=true;
			}
			
			var that = this;

			this.calobj = input.datetimepicker({
				format: conf.format,
				startDate:that.minDate,
				endDate:that.maxDate,
				language:"zh-CN",
				autoclose:true,
				minView:viewNo,
//				autoclose:false,
				startView:viewNo === 3?4:2,
				todayBtn:conf.noToday===true?false:true
			}).on("changeDate",function(e){
				var h = e.date.getHours()-8;//处理时区的差异
				e.date.setHours(h);
				var date =  e.date.format(conf.format);
				this.value = date
				that.hidden.val(date);
				if(that.params.focusShowCalendar==false || that.params.canEditable==false){
					that._inputValue=date;
				}
			}).on("hide",function(){
				input.trigger("blur");
				
				if(that._inputValue != null){
					var date;
					if(that._inputValue==""){
						date = "";
					}else{
						//判断是不是符合格式的日期显示
						date = Horn.Util.Format.date(that._inputValue,that.settings.format)
						if(that.params.focusShowCalendar==false || that.params.canEditable==false){
							date=that._inputValue;
						}
						if(date.indexOf('1899')==0){
							date=that._inputValue;
						}
					}
					
					that.hidden.val(date);
					this.value = date;
					that._inputValue = null;
				}else{
					this.value = that.hidden.val()
				}
			})
			.datetimepicker("setStartDate",that.minDate)
			.datetimepicker("setEndDate",that.maxDate);
		}
		var that = this;
		input.focus(function(){
			var _org = $(this).val();
			if (_org&&_org.indexOf("/") == -1 && _org.indexOf("-") == -1 ){
				var _ttt = Horn.Util.Format.date(_org,"yyyy-MM-dd");
				$(this).val(_ttt);
			}
			return true;
		}).keyup(function(e){
			that._inputValue = $(this).val();
			that.hidden.val($(this).val());
		}).keypress(function(e){
			that._inputValue = $(this).val();
			that.hidden.val($(this).val());
		}).blur(function(e){
			that.formatValue();
			that.validate();
		})
		var disabled = this.field.attr("disabled");
		if(disabled&&disabled=="disabled"){
			return;
		}
		var $a=input.next("i");
		var inputNotShow = input.attr("inputNotShow");
		$a.click(function(){
			var disabled = that.field.attr("disabled");
			if(disabled&&disabled=="disabled"){
				return;
			}
			input.attr("focusShowCalendar","true");
			input.attr("canEditable","true");
			input.focus();
			input.focus();
			if(inputNotShow=="false"){
				input.attr("focusShowCalendar","false");
				input.attr("canEditable","false");
			}
			
		});
		
		this.initDate(settings);
    	
        if(this.params.readonly) {
        	this.setReadonly(true);
        }
        if (this.params.disabled) {
        	this.setDisabled(true);
        }
        var val = hidden.val();
		if(val!=""){
			this.setValue(val);
		}
	},
	getEventTarget : function() {
		return this.el.children("input:text");
	},
    /**
     * @description 设置日期值
     * @function
     * @name Horn.Calendar#setValue
     * @param {String} value 日期值
     */
	setValue : function(val){
		this.field.val(val);
		this.hidden.val(val);
		//this.field.blur();
		this.validate();
	},
	getValue : function() {
        var input = this.get().val();              //解决 onchange事件下调用此方法返回的日期格式和blur之后的日期格式不一致
        if(input!=null&&input!=""){
        	input = input+"";
        	input = input.replace(/(^\s*)|(\s*$)/g,'');
        }
        if(input!= ""){
//        	input = $.calendar.formatDate(new Date(this.myFormatDate(input)),this.settings.format);
        	input = Horn.Util.Format.date(input,this.settings.format)
        }else{
        	input="";
        }
        return input;
    },

    reset : function(clear) {
        this.field.val(clear?"":this.defValue);
        this.hidden.val(clear?"":this.defHiddenValue);
        //this.field.blur();
        this.validate();
    },
    /**
     * 触发校验表单的内容，然后通过调用isValid方法获取校验的结果
     * @function
     * @name Horn.Calendar#validate
     */
    validate : function(){
    	this.removeError();
		this.err = false;
    	var valid = true;
    	var _field = this;
    	_field.formatValue();
    	var check =_field.hidden.attr("check");
    	if(check&&check.length>0&&!this.params.config){
			if(_field.calobj.val()!=""){
				var ruleSpilt = check.split(";");
				var msg = ""
				for(var i=0;i<ruleSpilt.length;i++){
					var ruleFunc = ruleSpilt[i];
					var fn = function(){};
					if(ruleFunc!=""&&ruleFunc!="Horn.Validate.validateFmt"&&ruleFunc!=Horn.Validate.REQUIRED){
						if(window[ruleFunc]){
							fn = window[ruleFunc];
							var biz_func = fn();
							if(biz_func!=true){
								valid = false;
								msg = biz_func;
								break;
							}
						}else{
							if(window.ruleFunc){
								var biz_func = ruleFunc;
								if(biz_func!=true){
									valid = false;
									msg = biz_func;
									break;
								}
							}
						}
					}
				}
				if(!valid){
					_field.showError(biz_func);
					valid = false;
					this.err = true;
					return;
				}else{
					this.removeError();
					this.err = false;
				}
			}
		}
    	
		
    	if(_field.calobj.val()!=""){
	    	if(!Horn.Util.Format.validateFmt(_field.calobj.val(),_field.settings.format)){
	    		valid = false;
				this.err = true;
				_field.showError("日期格式不正确,格式为："+_field.settings.format);
				return;
			}
    	}else{
    		
    		if(check&&check.indexOf(Horn.Validate.REQUIRED) > -1){
    			valid = false;
				this.err = true;
    			_field.showError("该输入不能为空！");
    			return;
    		}
    	}
		
    },
    formatValue : function(){
    	var that = this;
    	var val = that.hidden.val();
		if(val!=""){
			date = Horn.Util.Format.date(val,that.settings.format)	
		}else{
			date="";
		}				
		if(date.indexOf('1899')==0){
			date=that.hidden.val();
		}
		that.hidden.val(date);
		that.calobj.val(date);
		that.value = date;
    },
	isValid : function(){
    	if(this.calobj.val()==null||this.calobj.val()==""){
    		var check =this.hidden.attr("check");;
    		if(check&&check.indexOf(Horn.Validate.REQUIRED) > -1){
    			return false;
    		}else{
			return true;
    		}
		}else{
		return (Horn.Util.Format.validateFmt(this.calobj.val(),this.settings.format) && !this.err)?true:false;
		}
	},
    initEvents : function(){
    	var _field = this;
    	_field.checkRegx = [];
    	var checkStr = this.field.attr('checkstr');
    	if(checkStr) {
    		_field.checkRegx = checkStr.split(';');
    	}
    	this.field.blur(function(){
    		var format = "yyyy-MM-dd";
			if(_field.settings){
				var fm = _field.settings.format;
				if(fm){
					format = fm;
				}
			}
			var _val = $(this).val();
			if (_val!=""){
				var _ttt = Horn.Util.Format.date(_val,format);
				$(this).val(_ttt);
			}
			setTimeout(function(){
    			var check =_field.hidden.attr("check");
    			var valid = true;
    	    	if(check&&check.length>0&&!_field.params.config){
    				if(_field.calobj.val()!=""){
    					var ruleSpilt = check.split(";");
    					var msg = ""
    					for(var i=0;i<ruleSpilt.length;i++){
    						var ruleFunc = ruleSpilt[i];
    						if(ruleFunc!=""&&ruleFunc!="Horn.Validate.validateFmt"&&ruleFunc!=Horn.Validate.REQUIRED){
    							var fn = window[ruleFunc];
    							var biz_func = fn();
    							if(biz_func!=true){
    								valid = false;
    								msg = biz_func;
    								break;
    							}
    						}
    					}
    					if(!valid){
    						_field.showError(biz_func);
    						valid = false;
    						_field.err = true;
    						return;
    					}else{
    						_field.removeError();
    						_field.err = false;
    					}
    				}
    			}
    	    	
    			if(_field.calobj.val()!=""){
		    		if(!Horn.Util.Format.validateFmt(_field.calobj.val(),_field.settings.format)){
		    			_field.showError("日期格式不正确,格式为："+_field.settings.format);
		    		}else{
		    			_field.removeError();
		    			Horn.Validate.onValid({data:[Horn.Validate,_field]});
		    		}
    			}else{
    				_field.removeError();
    				var check =_field.hidden.attr("check");
		    		if(check&&check.indexOf(Horn.Validate.REQUIRED) > -1){
		    			_field.showError("该输入不能为空！");
		    		}
    			}
    		},10);
    		
    	});
    },
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.field.attr("disabled","disabled");
			this.hidden.attr("disabled","disabled");
		}
	},
	setReadonly : function(readonly){
		Horn.Calendar.superclass.setReadonly.apply(this,arguments) ;
		
		if(this.readonly){
			this.calobj.datetimepicker('remove');
		}else{
			this.initDate(this.settings);
		}
	}
}) ;
Horn.apply(Horn.Calendar,{
	DEFAULT_FORMAT : 'yyyy-MM-dd'
});
Horn.Field.regFieldType("div.hc_calendar",Horn.Calendar) ;
