/* 
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-06-10   zhangsu  STORY #8487[经纪业务事业部/胡志武][TS:201406040187]-JRESPlus-ui-日期组group在disabled的情况下还会校验是否必填
 * 2014-06-30   zhangsu  BUG #7186 calendar_group配上config属性报js错误
 * 2014-07-04   wuxl     BUG #7201#7203#7204#7209#7218#7219#7220#7221#7222#7223
 * 2014-08-12   wangyb10555     修改onchange事件绑定机制下返回日期对不一致的问题
 * 2014-08-12   wangyb10555		STORY #8854 [研发中心/内部需求][JresPlus][UI]日历组件中，先清空再reset设置默认值时，会无法通过校验并提示空值
 * 2014-08-21	wangyb10555		STORY #9486 【TS:201408200139-JRESPlus-财富管理事业部-王一俊- 关于jresplus中日期范围选择控件起始日期、截止日期必】
 * 2014-10-16	wangyb10555		BUG #7774 调用calendargroup的reset方法，会将两个日期框都重置成第一个开始日期的值 
 * 2014-12-05	wangyb10555		STORY #10272 [海外发展部-胡琦][TS:201411110151]-JRESPlus-ui-现在的日期控件只能选择到日，我们需要年月选择控件。
 * 2014-12-25   zhangsu         BUG #8454 calendargroup组件设置属性"disabled":true,属性值已设置为不可用，不会出现校验框，但是目前还是会出现红色提示框
 * 2015-1-30	wangyb10555		STORY #10644 [研发中心/内部需求][JresPlus][UI][#8477]calendar只能通过下拉日期框选择，不能在输入框中输入，建议添加可编辑功能 
 * 2015-04-08   zhangsu         STORY #11078  calendargroup.js中存在语法错误
 * 2015-11-10   周智星                           BUG #12458 需求14646--多选框单选框，check的自定义函数无法触发
 * 2015-12-04   周智星          需求 #15010 【TS:201511230297-JRESPlus-资产管理事业部-张翔-2.Calendar日期控件，键盘输入校验未设置，在输入之后
 * 2016-3-2     刘龙             需求17380 【TS:201602230426-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br>【产品及版本信】
 * 2016-3-11   刘龙                                     需求#17814 【TS:201603110065-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）【产品及版本信息】
 * 2016-3-22   刘龙               bug#17104 需求17814--canEditable属性与focusShowCalendar属性组合失败
 * 2016-3-24   刘龙              需求#17990 【TS:201603220311-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br><br>】
 * 2016-3-29   刘龙             bug#17350 手动清空calendargroup日期组件值失败
 * ----------------------------------------------------------------------- 
 */
/**
 * @name Horn.CalendarGroup   
 * @class
 * 日期组组件</br> 
 */	
	
/**
 * @lends Horn.CalendarGroup#
 */

/**
 * 组件唯一标识
 * @name Horn.CalendarGroup#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的跨列数
 * @name Horn.CalendarGroup#<b>cols</b>
 * @type Int
 * @default ""
 * @example
 * 无
 */

/**
 * 组件的开始日期名称
 * 如果需要获取整个日期组对象也是通过name1属性来获取。
 * 例如：name1=test11  Horn.getComp("test11")获取的是整个日期组对象
 * @name Horn.CalendarGroup#<b>name1</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
 /**
  * 组件的开始日期值
  * @name Horn.CalendarGroup#<b>value1</b>
  * @type String
  * @default ""
  * @example
  */
 /**
  * 如果设置了defValue1的值，重置成的defValue1值，否则重置成初始值
  * @name Horn.CalendarGroup#<b>defValue1</b>
  * @type String
  * @default ""
  * @example
  */
/**
 * 组件的结束日期名称
 * @name Horn.CalendarGroup#<b>name2</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
 /**
  * 组件的结束日期值
  * @name Horn.CalendarGroup#<b>value2</b>
  * @type String
  * @default ""
  * @example
  */
 /**
  * 如果设置了defValue2的值，重置成的defValue2值，否则重置成初始值
  * @name Horn.CalendarGroup#<b>defValue2</b>
  * @type String
  * @default ""
  * @example
  */
/**
 * 组件的显示标签
 * @name Horn.CalendarGroup#<b>label</b>
 * @type String
 * @default ""
 * @example
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.CalendarGroup#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 组件的约束检查选项
 * @name Horn.CalendarGroup#<b>check</b>
 * @type String
 * @default ""
 * @example
 * 具体见Horn.Validate类的已经支持的正规、函数名
 * "check":"required;"
 */

/**
 * 组件的所属组，可以对相同组内的元素进行约束检查
 * @name Horn.CalendarGroup#<b>group</b>
 * @type String
 * @default ""
 * @ignore
 * @example
 * 验证指定对象$obj(scope)中组名为groupname的元素有有效性
 * Horn.Validate.validateAreaByGroup($obj,groupname)
 */
/**
 * 组件的配置选项如:日期格式，如果配置了config属性，会自动根据format格式进行日期校验<br/>
 * (注意！1.如果填写了config，就按config格式来验证，自定义的校验函数不再执行，例如：#calendar({"label":"日期校验", "name": "test5", "value":"中文", "check": "required;date;", "config":"{format:'yyyy-MM-dd'}"})；date和config只能选择一个;<br/>
 * 2.如果没有配置"config":"{minDate:'2013-12-23',noToday:true,format:'yyyy/MM/dd'}"属性，也没有配置自定义校验方法，则会自动根据:Horn.Calendar.DEFAULT_FORMAT这个参数来进行日期校验，Horn.Calendar.DEFAULT_FORMAT参数默认格式为yyyy-MM-dd。如果不想要默认格式，可以在layout页面的尾端加上Horn.Calendar.DEFAULT_FORMAT指定格式，如#jscode()  Horn.Calendar.DEFAULT_FORMAT="yyyyMMdd"  #end，(注意!自定义方法里的校验格式必须与Horn.Calendar.DEFAULT_FORMAT的格式一直)</br>
 * 3.minDate和maxDate的配置必须为类似2012-12-09的格式;另外由于第三方组件对中文格式化的支持有限config中format不能配置有中文分隔符如yyyy年MM月;yyyyMMddHHmmss,yyyy/MM/dd HH:mm:ss)
 * 用户配置的format会自动的识别，如果配置到h就会显示到选择小时的界面，如果配置到m就会显示到选择月份的界面为止
 * 另外，用户配置的format和minDate/maxDate的格式必须一致
 * @name Horn.CalendarGroup#<b>config</b>
 * @type String
 * @default 无
 * @example
 * 你也可以指定一个符合 ISO-8601 格式的日期时间：
 * "config":"{minDate:'2012-12-09', noToday:true, format:'yyyy-MM-dd'}"
 */
 /**
  * 组件的是读配置
  * @name Horn.CalendarGroup#<b>readonly</b>
  * @type String
  * @default 非只读
  * @example
  * 无
  */
 /**
  * 组件的禁用配置
  * @name Horn.CalendarGroup#<b>disabled</b>
  * @type String
  * @default 非禁用
  * @example
  * 无
  */
 /**
  * 是否隐藏组件
  * @name Horn.CalendarGroup#hidden
  * @type Boolean
  * @default false
  * @example
  * #calendar_group({"label":"calendargroup","name1": "calendargroup","value1":"","value2":"","name2": "calendargroup2","cols":1,"check": "required;testCheck","events":[{"event":"onkeypress","function":"keypress()"}],"config":{"format":"yyyy-MM-dd"},"hidden":true})
  */
 /**
  * 组件的事件配置
  * @name Horn.CalendarGroup#<b>events</b>
  * @type Array[Json
  * @default ""
  * @example
  * "events":[{"event":"onchange","function":"getValue()"}]
  */
 /**
  * 输入框获得焦点是否弹出日历控件(默认输入框获得焦点自动弹出日历控件)；
  * 注：不建议与canEditable同时设置，若是focusShowCalendar为true，canEditable为false，输入框移入焦点，日期框无法弹出。
  * @name Horn.CalendarGroup#focusShowCalendar
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
 /**
  * 输入框是否可编辑(默认输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期)。<br/>
  * 1.当设置为true时，输入框可以手工输入，点击输入框或日期图标都可以弹出日历组件选择日期；2.当设置为false时，输入框不可以手工输入，点击输入框时不弹出日期选择器，点击图标可以弹出日历组件选择日期；
  * @name Horn.CalendarGroup#canEditable
  * @type Boolean
  * @default true
  * @default ""
  * @example
  */
/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * (特别说明：emptyText必须是数组，数组的第一个元素是第一个日期输入框，第二个元素是第二个日期输入框,数组必须填写两个元素，如："emptyText":["请输入开始日期","请输入结束日期"])
  * @name Horn.CalendarGroup#emptyText
  * @type Array
  * @default []
  * @example
  * #calendar_group({"label":"calendargroup","name1": "calendargroup","value1":"","value2":"","name2": "calendargroup2","cols":1,"check": "required;testCheck","events":[{"event":"onkeypress","function":"keypress()"}],"config":{"format":"yyyy-MM-dd"},"hidden":true,"emptyText":["请输入开始日期","请输入结束日期"]})
  */
	Horn.CalendarGroup = Horn.extend(Horn.Field,{
		COMPONENT_CLASS:"CalendarGroup",
		cal1 : null,
		cal2 : null,
		hidden1 : null,
		hidden2 : null,
		name1 : null,
		name2 : null,
		calobj1 : null,
		calobj2 : null,
        defValue1 : "",
        defHiddenValue1 : "",
        defValue2 : "",
        defHiddenValue2 : "",
        //日期组的第几个元素验证无效
        inValidEle:null,
        tmpValide : "",
		/**
		 * @ignore
		 */
		init : function(dom){
			Horn.CalendarGroup.superclass.init.apply(this,arguments);
			this.el.attr("tabIndex",1000);
			var cal1 = $(this.el.find("input:text")[0]) ;
			var cal2 = $(this.el.find("input:text")[1]) ;
			var hidden1 = $(this.el.find("input[type=hidden]")[0]);
			var hidden2 = $(this.el.find("input[type=hidden]")[1]);
			
			this.name1 =  hidden1.attr("name") ;
			this.name2 =  hidden2.attr("name") ;
			this.name = this.name1 ;
			this.alias = hidden1.attr("alias") ;
			var config = this.params.config ;
			//var config = this.el.attr("config") ;
			var settings = {};
			var _this = this ;
            if(hidden1){
                this.defHiddenValue1= (this.params.defValue1 != undefined)?this.params.defValue1:hidden1.val();
            }
            if(hidden2){
                this.defHiddenValue2= (this.params.defValue2 != undefined)?this.params.defValue2:hidden2.val();
            }
            if(cal1){
                this.defValue1=(this.params.defValue1 != undefined)?this.params.defValue1:cal1.val();
            }
            if(cal2){
                this.defValue2=(this.params.defValue2 != undefined)?this.params.defValue2:cal2.val();
            }
            
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
			}
			
			this.settings = settings;
			
			$.fn.isValid=function(value,format){
				return Horn.Util.Format.validateFmt(value,format)
			}
			$.fn.getDate=function(){
				return this.val();
			}
			
//			var changeEvent = (cal1.data("events") || {})["change"];
//			if (changeEvent && changeEvent.length > 0) {
//				settings['onchange'] = changeEvent[0].handler;
//			}
			settings['onchange'] = function(){
				return cal1.change && cal1.change();
			};
			if(!settings.maxDate){
				settings.maxDate = "2999/12/31";
			}
			if(!settings.minDate){
				settings.minDate = "1099/12/31";
			}
			
			this.minDate = this._formatDate(settings["minDate"]);
			this.maxDate = this._formatDate(settings["maxDate"]);

			var $a_cal1=cal1.next("i");
			var $a_cal2=cal2.next("i");
			
			var inputNotShow = cal1.attr("inputNotShow");
			$a_cal1.click(function(){
				var disabled = cal1.attr("disabled");
				if(disabled&&disabled=="disabled"){
					return;
				}
				cal1.attr("focusShowCalendar","true");
				cal1.attr("canEditable","true");
				cal1.focus();
				cal1.focus();
				if(inputNotShow=="false"){
					cal1.attr("focusShowCalendar","false");
					cal1.attr("canEditable","false");
				}
				
			});
			$a_cal2.click(function(){
				var disabled = cal1.attr("disabled");
				if(disabled&&disabled=="disabled"){
					return;
				}
				cal2.attr("focusShowCalendar","true");
				cal2.attr("canEditable","true");
				cal2.focus();
				cal2.focus();
				if(inputNotShow=="false"){
					cal2.attr("focusShowCalendar","false");
					cal2.attr("canEditable","false");
				}
				
			});
			
			
			if(!cal1.attr("readonly") || true){
				cal1.focus(function(event) {
					
					if(_this.readonly){
						return false;
					}
					
					var _org = cal1.val();
					if (_org&&_org.indexOf("/") == -1 && _org.indexOf("-") == -1 ){
						var _ttt = Horn.Util.Format.date(_org,"yyyy-MM-dd");
						cal1.val(_ttt)
					}
					
					
					
					var config1 =Horn.apply({},settings);
					var maxDate = _this._formatDate(_this.cal2.val());
					maxDate = maxDate || _this.maxDate;
					if (!_this.compareDate(_this.minDate, maxDate) || !_this.compareDate(maxDate, _this.maxDate)) {
						maxDate = _this.maxDate;
					}
					config1 = Horn.apply(config1,{
						'minDate' :  Horn.Util.Format.date(_this.minDate,"yyyy-MM-dd HH:mm"),
						'maxDate' :  Horn.Util.Format.date(maxDate,"yyyy-MM-dd HH:mm"),
						'real' : hidden1,
						'btnBar' : false,
						'onSetDate' : function(){
							setTimeout(function(){
								cal1.evented = true;
								cal1.blur() ;
							},100);
						}
					});
//					_this.calobj1 = cal1.calendar(config1);
					
					//从这里进行插件的配置
					var conf = config1;
					
					//判断显示的视图
					var lformat = conf.format.toLowerCase()
					var viewNo = conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;
					
					if(viewNo === 3){
						conf.noToday=true;
					}
					
					var that = this;
					this.config1 = conf;
					if(cal1.evented==undefined){
						_this.calobj1 = cal1.datetimepicker({
							format: conf.format,
							startDate:conf.minDate,
							endDate:conf.maxDate,
							language:"zh-CN",
							autoclose:true,
							minView:viewNo,
							startView:viewNo === 3?4:2,
							todayBtn:conf.noToday===true?false:true    //11078
						}).on("changeDate",function(e){
							var h = e.date.getHours()-8;//处理时区的差异
							e.date.setHours(h);
							var date =  e.date.format(conf.format);
							this.value = date;
							hidden1.val(date);
						}).on("hide",function(){
							if(that._inputValue1 != null){
								var date;
								if(that._inputValue1 == ""){
									date = "";
								}else{
									//判断是不是符合格式的日期显示
									date = Horn.Util.Format.date(that._inputValue1,that.config1.format)
									
									if(date.indexOf('1899')==0){
										date=that._inputValue1;
									}
								}
								
								hidden1.val(date);
								this.value = date;
								that._inputValue1 = null;
							}else{
								this.value = hidden1.val()
							}
							
							conf.onSetDate();
						}).keyup(function(){
							that._inputValue1 = $(this).val();
							hidden1.val($(this).val());
						}).keypress(function(e){
							that._inputValue = $(this).val();
							hidden1.val($(this).val());
						})
					}
					_this.calobj1
					.datetimepicker("setStartDate",conf.minDate)
					.datetimepicker("setEndDate",conf.maxDate)
					.datetimepicker("show")
					
					cal1.evented = true;
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						if(cal1.attr("placeholder")&&cal1.attr("placeholder")!=""){
							if(cal1.val()==cal1.attr("placeholder")){
								cal1.val("");
							}
						}
					}
				});
				
		    	var _field = this;
				//cal1.blur(_this.cal1Blur);
				cal1.blur(function(){
					_this.tmpValide = "";
					//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
					if(! _field.format){
						$(this).attr("format","noConfig");//没有自定义格式
					}else{
						$(this).attr("format","yesConfig");
					}
					//新增支持自定义校验函数 20151110 add by 周智星 BUG #12458 需求14646--多选框单选框，check的自定义函数无法触发
					var _calendarGroup = _this;
					_this.formatVal();
						
					if(_this.cal1.val()!=""){
						if(_this.cal2.val()==""){
							var rule2 = _this.cal2.attr("check");
			    			if(rule2 && rule2.indexOf(Horn.Validate.REQUIRED) > -1){
			    				_this.showError("当前输入不能为空");
			    				return;
			    			}
						}
						if(! _field.format){
							var _validate = Horn.Validate;
							var comp = _calendarGroup;
					        var obj = comp.cal1;
					        var rules = _validate.getRules.call(_validate, obj);
					        if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
					        	_this.tmpValide = _validate.isValide.call(_validate, rules, comp, obj.val());
					        }
					        else{
					        	_validate.removeError.call(_validate, comp);
					        }	
						}
					}else{
						var rule1 = _this.cal1.attr("check");
		    			//var rule1 =_this.params.check;
		    			if(rule1 && rule1.indexOf(Horn.Validate.REQUIRED) > -1 && (!_this.cal1.val() || !_this.cal2.val())){
		    				_this.showError("当前输入不能为空");
		    				return;
		    			}
					}
					if(_this.cal1.val()!=""){
						_this.valideDateFormat();
					}
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						var placeholder = _this.cal1.attr("placeholder");
						if(placeholder&&placeholder!=""){
							if(_this.hidden1.val()==""){
								_this.cal1.val(placeholder);
							}
						}
					}
				});
			}
			if(!cal2.attr("readonly")|| true){
				cal2.focus(function(event) {
					
					if(_this.readonly){
						return false;
					}
					
					var _org = cal2.val();
					if (_org&&_org.indexOf("/") == -1 && _org.indexOf("-") == -1){
						var _ttt = Horn.Util.Format.date(_org,"yyyy-MM-dd");
						cal2.val(_ttt)
					}
					
					var config2 =Horn.apply({},settings);
					var minDate = _this._formatDate(_this.cal1.val());
					minDate = minDate || _this.minDate;
					if (!_this.compareDate(_this.minDate, minDate) || !_this.compareDate(minDate, _this.maxDate)) {
						minDate = _this.minDate;
					}
					config2 = Horn.apply(config2,{
						'maxDate' :  Horn.Util.Format.date(_this.maxDate,"yyyy-MM-dd HH:mm"),
						'minDate' :   Horn.Util.Format.date(minDate,"yyyy-MM-dd HH:mm"),
						'real' : hidden2,
						'btnBar' : false,
						'onSetDate' : function(){
							setTimeout(function(){
								cal2.evented = true;
								cal2.blur() ;
							},10);
						}
					});
//					_this.calobj2 = cal2.calendar(config2);
					
					//从这里进行插件的配置
					var conf = config2;
					
					//判断显示的视图
					var lformat = conf.format.toLowerCase()
					var viewNo = conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;
					
					if(viewNo === 3){
						conf.noToday=true;
					}
					
					var that = this;
					that.config2 = conf;
					if(cal2.evented==undefined){
						_this.calobj2 = cal2.datetimepicker({
							format: conf.format,
							language:"zh-CN",
							autoclose:true,
							minView:viewNo,
							startView:viewNo === 3?4:2,
							todayBtn:conf.noToday===true?false:true
						}).on("changeDate",function(e){
							var h = e.date.getHours()-8;//处理时区的差异
							e.date.setHours(h);
							var date =  e.date.format(conf.format);
							this.value = date
							hidden2.val(date);
						}).on("hide",function(){
							if(that._inputValue2 != null){
								var date;
								if(that._inputValue2 == ""){
									date = "";
								}else{
									//判断是不是符合格式的日期显示
									date = Horn.Util.Format.date(that._inputValue2,that.config2.format)
									
									if(date.indexOf('1899')==0){
										date=that._inputValue2;
									}
								}
								
								hidden2.val(date);
								this.value = date;
								that._inputValue2 = null;
							}else{
								this.value = hidden2.val()
							}
							conf.onSetDate();
						}).keyup(function(){
							that._inputValue2 = $(this).val();
							hidden2.val($(this).val());
						}).keypress(function(e){
							that._inputValue2 = $(this).val();
							hidden2.val($(this).val());
						})
					}
					
					_this.calobj2
					.datetimepicker("setStartDate",conf.minDate)
					.datetimepicker("setEndDate",conf.maxDate)
					.datetimepicker("show")
					
					cal2.evented = true;
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						if(cal2.attr("placeholder")&&cal2.attr("placeholder")!=""){
							if(cal2.val()==cal2.attr("placeholder")){
								cal2.val("");
							}
						}
					}
				});
		
				cal2.blur(function(){
					_tmpValide = "";
					//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
					if(! _field.format){
						$(this).attr("format","noConfig");//没有自定义格式
					}else{
						$(this).attr("format","yesConfig");
					}
					//新增支持自定义校验函数 20151110 add by 周智星 BUG #12458 需求14646--多选框单选框，check的自定义函数无法触发
					var _calendarGroup = _this;
					//17380 【TS:201602230426-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br>【产品及版本信】
					_this.formatVal();
					
					if(_this.cal2.val()!=""){
						if(_this.cal1.val()==""){
							var rule1= _this.cal1.attr("check");
			    			if(rule1 && rule1.indexOf(Horn.Validate.REQUIRED) > -1){
			    				_this.showError("当前输入不能为空");
			    				return;
			    			}
						}
						
						if(! _field.format){
							var _validate = Horn.Validate;
							var comp = _calendarGroup;
					        var obj = comp.cal2;
					        var rules = _validate.getRules.call(_validate, obj);
					        if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
					        	_this.tmpValide = _validate.isValide.call(_validate, rules, comp, obj.val());
					        }
					        else{
					        	_validate.removeError.call(_validate, comp);
					        }
						}
					}else{
						var rule2 = _this.cal2.attr("check");
		    			if(rule2 && rule2.indexOf(Horn.Validate.REQUIRED) > -1  && (!_this.cal2.val() ||!_this.cal1.val())){
		    				_this.showError("当前输入不能为空");
		    				return;
		    			}
					}
					if(_this.cal2.val()!=""){
						_this.valideDateFormat();
					}
					var rv = _this.getIEVersion();
					if(rv!=-1&&rv<10){
						var placeholder = _this.cal2.attr("placeholder");
						if(placeholder&&placeholder!=""){
							if(_this.hidden2.val()==""){
								_this.cal2.val(placeholder);
							}
						}
					}
				});
			}
			this.cal1 = cal1;
			this.hidden1 = hidden1;
			this.cal2 = cal2;
			this.hidden2 = hidden2;
			
			if (this.params.disabled) {
	        	this.setEnable(false);
	        }
			
			if(this.params.readonly) {
	        	this.setReadonly(true);
	        }
			
			this.calobj1 = this.cal1
			this.calobj2 = this.cal2
			var rv = this.getIEVersion();
			if(rv!=-1&&rv<10){
				var placeholder = this.cal1.attr("placeholder");
				if(placeholder&&placeholder!=""){
					if(!this.params.value1||this.params.value1==""){
						this.cal1.val(this.cal1.attr("placeholder"));
					}
					if(!this.params.value2 || this.params.value2==""){
						this.cal2.val(this.cal2.attr("placeholder"));
					}
				}
			}
			var conf = this.params.config;
			if(_this.calobj1.val()!=""&&conf&&conf!=""&&!Horn.Util.Format.validateFmt(_this.calobj1.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				this.err = true;
				return;
			}
			if(_this.calobj2.val()!=""&&conf&&conf!=""&&!Horn.Util.Format.validateFmt(_this.calobj2.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				this.err = true;
			}
			//this.valideDateFormat();
		},
		getDisabled : function(_this){
			var disabled = _this.attr("disabled");
			if(disabled&&disabled=="disabled"){
				return true;
			}
			return false;
		},
		formatVal : function(){
			var _this = this;
			var val1 = _this.hidden1.val();
			var date1 = "";
			
			if(val1!=""){
				date1 = Horn.Util.Format.date(val1,_this.settings.format)	
			}				
			if(date1.indexOf('1899')==0){
				date1=val1;
			}
			_this.hidden1.val(date1);
			_this.cal1.val(date1);
			this.value = date1;
			
			var val2 = _this.hidden2.val();
			var date2 = "";
			
			if(val2!=""){
				date2 = Horn.Util.Format.date(val2,_this.settings.format)	
			}				
			if(date2.indexOf('1899')==0){
				date2=val2;
			}
			_this.hidden2.val(date2);
			_this.cal2.val(date2);
			this.value = date2;
		},
		valideDateFormat : function(){
			var vaid = true;
			var _this = this;
			var valid = true;
			var rule1 = this.cal1.attr("check");
			if(rule1&&rule1.length>0){
				if(_this.calobj1.val()==""||_this.calobj2.val()==""){
					if(rule1.indexOf(Horn.Validate.REQUIRED)>-1){
						_this.showError("该输入不能为空");
						vaid = false
						this.err = true;
						return;
					}
				}
			}
			if(rule1&&rule1.length>0&&!this.params.config){
				if(_this.calobj1.val()!=""||_this.calobj2.val()!=""){
					var ruleSpilt = rule1.split(";");
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
						}else{
							this.formatVal();
						}
					}
					if(!valid){
						_this.showError(biz_func);
						valid = false;
						this.err = true;
						return;
					}
				}
			}else{
				this.formatVal();
			}
			if(_this.calobj1.val()!=""&&!Horn.Util.Format.validateFmt(_this.calobj1.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				vaid = false
				this.err = true;
				return;
			}
			if(_this.calobj2.val()!=""&&!Horn.Util.Format.validateFmt(_this.calobj2.val(),_this.settings.format)){
				_this.showError("日期格式不正确,格式为："+_this.settings.format);
				vaid = false
				this.err = true;
				return;
			}
			if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
					|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
					|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
		    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
				if(!_this.compareDate(_this.calobj1.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj1.getDate())){
					_this.inValidEle = _this.cal1;
				}else if(_this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj2.getDate()))){
					_this.inValidEle = _this.cal2;
				}
				vaid = false
				this.err = true;
				_this.showError("日期不在有效区间");
				return;
			} else if(_this.calobj1 && _this.calobj1.isValid(_this.calobj1.val(),_this.settings.format) && _this.calobj2 && _this.calobj2.isValid(_this.calobj2.val(),_this.settings.format) && _this.calobj1.getDate() && _this.calobj2.getDate()){
				if(_this.calobj1.getDate() && _this.calobj2.getDate() &&!_this.compareDate(_this.calobj1.getDate(), _this.calobj2.getDate())){
					vaid = false
					this.err = true;
					_this.inValidEle = _this.cal1;
	    			_this.showError("开始日期不能大于结束日期");
	    			return;
				}
			}
			if(vaid){
				this.err = false;
				_this.removeError();
			}
		},
		getEventTarget : function() {
			return this.el.find("input:text");
		},
		_formatDate : function(d){
			d = d || "";
			if (d.indexOf("/") == -1 && d.indexOf("-") == -1 && d.length >= 8) {
				return d.substring(0, 4) + "/" + d.substring(4, 6) + "/" + d.substring(6);
			}
//			return d.replace(/\//g, "-");
			return d.replace(/-/g, "/");
		},
		compareDate : function(d1, d2) {
			d1 = this._formatDate(d1);
			d2 = this._formatDate(d2);
			if (!Date.parse(d1) || !Date.parse(d2)) {
				return true;
			}
			return Date.parse(d1) <= Date.parse(d2);
		},
        /**
         * @description 设置日期对的值
         * @function
         * @name Horn.CalendarGroup#setValue
         * @param {json} {name1:value1,name2:value2} 日期值
         * @example
         * function setValue() {
		 *		Horn.getComp("test1").setValue({"test1":"20140412","test2":"20140523"});
		 *	}
         */
		setValue : function(obj){
			var _calendarGroup = this;
			this.cal1.val(obj[this.name1]);
			this.hidden1.val(obj[this.name1]);
			this.cal2.val(obj[this.name2]);
			this.hidden2.val(obj[this.name2]);
			
			this.formatVal();
			this.valideDateFormat();
		},
		
		getValue : function(){
			var _this=this;
			var input = this.get();
			var val = "";
			var x;
			$.each(input, function(i, o){
				x = $(o).val();
				//解决 onchange事件下调用此方法返回的日期格式和blur之后的日期格式不一致
				if(x){
//					x = $.calendar.formatDate(new Date(_this.myFormatDate(x)),_this.settings.format)
					x = Horn.Util.Format.date(x,_this.settings.format);
				}
				val += "," + x;
			});
			if(val==",,")
				return "";
	        return val.indexOf(",") == 0 ? val.substring(1) : val;
		},
		/**
	     * 显示验证错误信息
	     * @function
	     * @name Horn.Field#showError
	     * @param {String} 错误信息
	     * @ignore
	     */
	    showError : function(errorMsg){
	    	var field1 = this.cal1; 
	    	var field2 = this.cal2;
	    	field1.removeClass('m-verify-success');
	    	field1.addClass('m-verify-error');
	    	field2.removeClass('m-verify-success');
	    	field2.addClass('m-verify-error');
	    	errorMsg = $.type(errorMsg) == "boolean" ? "校验错误" : errorMsg;
	    	if(!this.msgDiv){
	    		this.msgDiv = $('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');
	    		this.el.after(this.msgDiv);
	    	}
	        var msg = this.msgDiv;
	        msg.html("<div class=\"verify-tip-arrow\"></div><div class=\"verify-tip-inner\">"+errorMsg+"</div>");
	        msg.css("display", "block");
	        this.err = true;
	    },
	    /**
	     * 删除错误信息
	     * @function
	     * @name Horn.Field#removeError
	     * @ignore
	     */
	    removeError : function(){
	    	var field1 = this.cal1; 
	    	var field2 = this.cal2;
	    	field1.removeClass('m-verify-error');
	    	field2.removeClass('m-verify-error');
	        var input = this.get();
	        var check = field1.attr(Horn.Validate.CHECK);
	        if (check) {
	        	if(this.isValid){
	        		if(field1.val()!=""||field2.val()!=""){
		            	field1.addClass('m-verify-success');
		            	field2.addClass('m-verify-success');
	        		}
	            }
	        }
	        this.err = false;
	    	var msg = this.msgDiv;
	    	if(msg) msg.remove();
	    	delete this.msgDiv ;
	    },
	    /**
	     * 增加校验规则
	     * @function
	     * @name Horn.Field#addRule
	     * @param {String} rule 校验规则字符串
	     * @ignore
	     */
	    addRule : function(rule) {
	        var input = this.cal1;
	        var input2 = this.cal2;
	        var check = input.attr(Horn.Validate.CHECK);
	        if (check) {
	            if (check.indexOf(rule) > -1) {
	                return;
	            }
	            check += Horn.Validate.CHECKSEP + rule;
	        } else {
	            check = rule;
	        }
	        input.attr(Horn.Validate.CHECK, check);
	        input2.attr(Horn.Validate.CHECK, check);
	        if(rule && rule.indexOf(Horn.Validate.REQUIRED) > -1){
	            var li = this.el.parent().parent(".g-unit-wrap");
	            var lab = $("label", li);
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
	        this.removeError();
	        this.field.removeClass('m-verify-success');
	    },
	    /**
	     * 删除校验规则
	     * @function
	     * @name Horn.Field#removeRule
	     * @param {String} rule 校验规则字符串
	     * @ignore
	     */
	    removeRule : function(rule) {
	    	 var input = this.cal1;
		     var input2 = this.cal2;
	        var check = input.attr(Horn.Validate.CHECK);
	          //BUG #6518 【calendar】先进行非空校验的错误提示，然后调用removeRule("qq")，会造成非空校验的错误提示消失
	        if (check && check.indexOf(rule) > -1) {//如果要去除的在原来的验证规则了就删除，否则不删除
	            var checks = check.split(Horn.Validate.CHECKSEP);
	            checks = $.grep(checks, function(c, index) {
	                return c && c != rule;
	            });
	            input.attr(Horn.Validate.CHECK, checks.join(';'));
	            input2.attr(Horn.Validate.CHECK, checks.join(';'));
	            this.removeError();
	            this.setNotRequired();
	        }
	    },
        /**
         * @description 返回日期对的名字
         * @function
         * @name Horn.CalendarGroup#mutiName
         * @return {Array} [name1,name2]
         */
		mutiName : function(){
			return [this.name1,this.name2];
		},
		validate : function(){
			var valid = true;
			var _calendarGroup = this;
			var _this = this;
			//如果日期group的disabled为true则不校验 #8487
			if(_calendarGroup.params.disabled && _calendarGroup.params.disabled==true){
				return true;
			}

			
			var rule1 = this.cal1.attr("check");
			var rule1 = this.cal1.attr("check");
			if(rule1&& rule1.indexOf(Horn.Validate.REQUIRED) > -1){
				if(_this.calobj1.val()==""||_this.calobj2.val()==""){
					_this.showError("当前输入不能为空");
					vaid = false;
					this.err = true;
					return;
				}
		   }
			var _validate = Horn.Validate;
			var obj = this.cal1;
			var rules = _validate.getRules.call(_validate, obj);
			//STORY #9486 【TS:201408200139-JRESPlus-财富管理事业部-王一俊- 关于jresplus中日期范围选择控件起始日期、截止日期必】 
			if(rule1&&rule1.length>0&&!this.params.config){

				var ruleSpilt = rule1.split(";");
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
					_calendarGroup.showError(biz_func);
					valid = false;
					this.err = true;
					return;
				}
			}
			
			/*if(rule1 &&rules.length==2&& rule1.indexOf(Horn.Validate.REQUIRED) > -1){
				//什么都不做
			}else{
				if(rules &&rules.length>0&&this.msgDiv==null){
					this.cal1.blur();
					this.cal2.blur();
		        }
		     }	*/
			
			var date1 = this.calobj1.getDate();
			var date2 = this.calobj2.getDate();
			if(this.tmpValide!=undefined&&this.tmpValide!=""){
				if(!this.tmpValide){
					_calendarGroup.showError(this.tmpValide);
					valid = false;
			}
			}else{
				if(this.msgDiv!=null){
					valid = false;
		        }
		     }
		
			if(_this.calobj1.val()!=""){
				if( !Horn.Util.Format.validateFmt(_this.calobj1.val(),_this.settings.format)){
					valid = false
					this.err = true;
	    			_this.showError("日期格式不正确，格式为："+_this.settings.format);
					return;
				}
	    	}else{
	    		if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
	    				|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
	    				|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
	    	    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
	    			valid = false
					this.err = true;
	    			_this.showError("日期不在有效区间");
	    			return;
	    		} else if(_this.calobj1 && _this.calobj1.isValid(_this.calobj1.val(),_this.settings.format) && _this.calobj2 && _this.calobj2.isValid(_this.calobj2.val(),_this.settings.format) && _this.calobj1.getDate() && _this.calobj2.getDate()){
	    			if(_this.calobj1.getDate() && _this.calobj2.getDate() &&!_this.compareDate(_this.calobj1.getDate(), _this.calobj2.getDate())){
	    				valid = false
	    				this.err = true;
	        			_this.showError("开始日期不能大于结束日期");
	        			return;
	    			}
	    		}else{
		    		_this.removeError();
		    		this.err = false;
		    		valid = true
	    		}
	    	}
			if(_this.calobj2.val()!=""){
				if( !Horn.Util.Format.validateFmt(_this.calobj2.val(),_this.settings.format)){
					valid = false
					this.err = true;
	    			_this.showError("日期格式不正确，格式为："+_this.settings.format);
					return;
				}
	    	}else{
	    		if (_this.calobj1 && (!_this.compareDate(_this.calobj1.getDate(), _this.maxDate)
	    				|| !_this.compareDate(_this.minDate, _this.calobj1.getDate()))
	    				|| _this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate)
	    	    				|| !_this.compareDate(_this.minDate, _this.calobj2.getDate()))) {
	    			if(!_this.compareDate(_this.calobj1.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj1.getDate())){
	    				_this.inValidEle = _this.cal1;
	    			}else if(_this.calobj2 && (!_this.compareDate(_this.calobj2.getDate(), _this.maxDate) || !_this.compareDate(_this.minDate, _this.calobj2.getDate()))){
	    				_this.inValidEle = _this.cal2;
	    			}
	    			_this.showError("日期不在有效区间");
	    			return;
	    		} else if(_this.calobj1 && _this.calobj1.isValid(_this.calobj1.val(),_this.settings.format) && _this.calobj2 && _this.calobj2.isValid(_this.calobj2.val(),_this.settings.format) && _this.calobj1.getDate() && _this.calobj2.getDate()){
	    			if(_this.calobj1.getDate() && _this.calobj2.getDate() &&!_this.compareDate(_this.calobj1.getDate(), _this.calobj2.getDate())){
	    				_this.inValidEle = _this.cal1;
	        			_this.showError("开始日期不能大于结束日期");
	        			return;
	    			}
	    		}else{
		    		_this.removeError();
		    		this.err = false;
		    		valid = true
	    		}
	    	}
			
			//STORY #9486 【TS:201408200139-JRESPlus-财富管理事业部-王一俊- 关于jresplus中日期范围选择控件起始日期、截止日期必】 
			//var flag = valid&& this.compareDate(date1, this.maxDate)&& this.compareDate(this.minDate, date1)&& this.compareDate(date2, this.maxDate)&& this.compareDate(this.minDate, date2)&& this.compareDate(date1, date2);
			if(!valid){
				this.err = true;
			}
			
			_calendarGroup.formatVal();
		},
		setEnable : function(enable){
			if(enable){
				this.cal1.removeAttr("disabled");
				this.cal2.removeAttr("disabled");
				this.hidden1.removeAttr("disabled");
				this.hidden2.removeAttr("disabled");
			}else{
				this.cal1.attr("disabled","disabled");
				this.cal2.attr("disabled","disabled");
				this.hidden1.attr("disabled","disabled");
				this.hidden2.attr("disabled","disabled");
			}
		},
        /**
         * @description 如果设置了defValue的值，重置成的defValue值，否则重置成初始值
         * @function
         * @name Horn.CalendarGroup#reset
         */
        reset : function(clear) {
//			var _calendarGroup = this;
//            this.cal1.val(clear?"":this.defValue1);
            this.hidden1.val(clear?"":this.defHiddenValue1);
//            this.cal2.val(clear?"":this.defValue2);
            this.hidden2.val(clear?"":this.defHiddenValue2);
            
            /**********************STORY #8854 Modify By Wangyb************/
//            var cal1_1 = clear?"":this.defValue1;
//            var cal1_2 = clear?"":this.defHiddenValue1;
//            var cal2_1 = clear?"":this.defValue2;
//            var cal2_2 = clear?"":this.defHiddenValue2;
            
            var cal1_1 = clear?"":this.defValue1 || this.defHiddenValue1;
            var cal2_1 = clear?"":this.defValue2 || this.defHiddenValue2;
            
            var obj = {};
            obj[this.name1]=cal1_1;
            
            //这里之前错了，造成充值的时候总是重置为第一个的值
            obj[this.name2]=cal2_1;
            this.setValue(obj);
            this.validate();
            
//			_calendarGroup.cal1.focus();
//			_calendarGroup.cal2.focus();
//			_calendarGroup.el.focus();
			
        },
        /**
         * @description 清空值
         * @function
         * @name Horn.CalendarGroup#clearValue
         */
    	clearValue : function(){
    		this.hidden1.val("");
            this.hidden2.val("");
    		this.cal1.val("");
    		this.cal2.val("");
    		this.validate();
    	},
		getInValidEle : function(){
			return this.inValidEle;
		},
		setReadonly : function(readonly){
			Horn.Calendar.superclass.setReadonly.apply(this,arguments) ;
			
			if(this.readonly){
				this.cal1.unbind("click").datetimepicker('remove');
				this.cal2.unbind("click").datetimepicker('remove');
			}else{
				this.cal1.evented = undefined;
				this.cal2.evented = undefined;
			}
		}
		/**
		 * 清空表单的值，显示值和隐藏值都设置为""
		 * @function
		 * @name Horn.Calendar#clearValue
		 */
		 
	}) ;
	Horn.Field.regFieldType("div.hc_calendargroup",Horn.CalendarGroup) ;
