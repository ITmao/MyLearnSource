/*
 * -------------------------------------------------------------
 * 修订记录
 * 2014-2-19	张超	修正formgrid在重新提交时的验证不通过问题。
 * 2014-06-12   STORY #8553 [经纪业务事业部/胡志武][TS:201406060039-JRESPlus]-future 校验存在问题
 * 2014-07-30   zhangsu  BUG #7327 textarea:输入回车后，调用isvalid(),校验不通过，接着输入字符后，还是不能校验通过
 * 2014-08-26	王玉豹		STORY #9521 [经纪业务事业部-胡志武][【TS:201408250103]-JRESPlus-ui-校验找不到方法，其实有定义相关的校验方法
 * 2014-09-15	王玉豹		STORY #9669 [经纪业务事业部-胡志武][【TS:201408250103]-JRESPlus-ui-校验找不到方法，其实有定义相关的校验方法(更改需求实现方式)
 * 2014-09-22	王玉豹		STORY #9777 [海外发展部/胡琦][TS:201409190229]-JRESPlus-ui-新版UI框架我们项目升级到1.0.5版本后，发现如下问题：
 * 2014-09-22	王玉豹		BUG #7636 #9777tab有未校验通过的组件，第一个下拉组件点击下拉箭头也不展开
 * 2015-04-16   zhangsu     STORY #11315 [财富管理事业部/蔺茂旺][TS:201504160022]-JRESPlus-ui--jresUI还有一个缺陷，目前的手机号码验证不支持177
 * 2015-11-3    刘龙               STORY #14646    【TS:201511030101-JRESPlus-资产管理事业部-张翔-现有日期控件如果是手工输入日期的话，日期控件check属性中】
 * 2016-3-15    刘龙              需求#17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
 * -------------------------------------------------------------
 */
/**
 * 校验
 * @name Horn.Validate
 * @class
 * 表单校验组件
 * @example Horn.Validate.isFormValidate(form)
 */
/**
 * @lends Horn.Validate
 */
Horn.Validate = {
    /**
     * @ignore
     * @constant
     * @description {Sting} 必填字符串
     * @field
     * @default required
     */
    REQUIRED : "required",
    /**
     * @ignore
     * @constant
     * @description 验证属性
     * @field
     * @default check
     */
    CHECK : "check",
    /**
     * @ignore
     * @constant
     * @description 验证规则分隔符,默认为分号
     * @field
     * @default ;
     */
    CHECKSEP : ";",
    /**
     * @ignore
     */
    init : function(dom) {
    	var contain = Horn.getCurrent() ;
    	if(dom){
    		contain = $(dom) ;
    	}
    	else{
    		contain = contain.find("form") ;
    	}
        var _this = this;
        // 初始化表单域
//        var fields =Horn.Field.findFieldCompsIn(contain) ;
//        $(fields).each(
//            function(i, o) {
//                var display = null;
//                var field = o.field;
//                display = field;
//                var type = field.attr("type");
//                if (type == "hidden") {
//                    display = field.next("input");
//                    if(display.length){
//                    	display.bind("change", [ _this, o ],
//                    			Horn.Util.apply(_this.onValid,_this));	
//                    }
//                }
//                if(display.length){
//                    display.bind("blur", [ _this, o ],Horn.Util.apply(_this.onValid,_this));
//                }
//            });
    },
    /**
     * @description 校验指定form对象的有效性
     * @function
     * @name Horn.Validate.isFormValidate
     * @param {object} v 指定form对象(DomElement或Jquery对象)
     */
    isFormValidate : function(v,moreInfo) {
    	if(arguments.length==1){
    		if(typeof arguments[0] == "boolean"){
    			return this.isFormValidate(null, arguments[0]);
    		}
    	}
        var _this = Horn.Validate ;
        var form = null;
        if($(this).length>0 && $(this).prop("tagName")){
            form = $(this);
        }
        else if ($(v).length>0 && $(v).prop("tagName")) {
            form = $(v);
        } else {
            form = Horn.getCurrent().find("form");
        }
        // form grid 的文本框做保护
        var fpanel = form.find("div.h_formgridtitle").nextAll("ul.h_panel") ;
        var inputs = Horn.Field.findFieldsIn(fpanel);
        var fields = Horn.Field.findFieldsIn(form).not(inputs);
        var flag = true;
        var info = [];
        setTimeout(function(){//将所有formgrid里的field组件上的错误清除
        	_this.removeError(inputs) ;
        },100);
        var firestInvalidComp;
        fields.each(function(idx,_field){
        	var field = Horn.getCompByEl(_field);
        	field.validate();
        	if(!field.isValid()) {
        		if(!firestInvalidComp){
        			firestInvalidComp = field;
        		}
        		flag = false;
            	if(moreInfo != undefined) {
            		info.push(field.name);
            	}
        	}
        });
        if(firestInvalidComp){
        	var target = firestInvalidComp.getEventTarget();
        	if(firestInvalidComp instanceof Horn.CalendarGroup){
        		var invalidEle = firestInvalidComp.getInValidEle();
        		if(invalidEle){
            		invalidEle.focus();
        		}
        	}else if(firestInvalidComp instanceof Horn.Combox || firestInvalidComp instanceof Horn.Select || firestInvalidComp instanceof Horn.Calendar){
            	target.data("isFromOuter",true);
            	
            	
            	//不让list显示出来！
            	//STORY #9777 [海外发展部/胡琦][TS:201409190229]-JRESPlus-ui-新版UI框架我们项目升级到1.0.5版本后，发现如下问题：
//            	target.hideList();
//            	target.blur();//获得红色校验未通过的框框
            	target.blur();
        	}
        	else{
            	target.focus();
        	}
        	firestInvalidComp = null;
        }
        if(flag === false){
        	return moreInfo?info:false;
        }
        return flag;
    },
    /**
     * @description 验证指定对象obj(scope)中组名为groupname的组件(textfield,textarea)的有效性,校验全部通过返回真，否则返回假
     * @function
     * @name Horn.Validate.validateAreaByGroup
     * @param {object} obj 指定对象(DomElement或Jquery对象)
     * @param {String} groupname 组名
     * @return boolean 验证通过为真，否则为假
     * @ignore
     */
    validateAreaByGroup : function($obj,groupname){
    	var fields = Horn.Field.findFieldsIn($obj);
        var flag = true;
        fields.each(function(idx,_field){
        	var field = Horn.getCompByEl(_field);
        	if(field&&field.inGroup(groupname)){
        		field.validate();
	        	if(!field.isValid()){
	        		flag = false;
	        	}
        	}
        });
        return flag;
    },
    /**
     * @ignore
     */
    onValid : function(e) {
        var _this = e.data[0];
        var comp = e.data[1];
        var obj = comp.field;
        var field = obj.prev("input[type='hidden']").size()>0 ? obj.prev() : obj ;
        var rules = _this.getRules.call(_this, field);
		/*if(comp instanceof Horn.Calendar || comp instanceof Horn.CalendarGroup){
			if (rules && rules.length > 0 && obj.attr("disabled")==undefined){
				var tempRule = [];
				for(var rule in rules){
					if(rules[rule].name==Horn.Validate.REQUIRED){
						tempRule.push(rules[rule]);
					}
				}
				_this.isValide.call(_this, tempRule, comp, field.val());
			}
	        else{
	            _this.removeError.call(_this, comp);
	        }
		}else{
	        if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
		        _this.isValide.call(_this, rules, comp, field.val());
	        }
	        else{
	            _this.removeError.call(_this, comp);
	        }
		}*/
		//STORY #14646    【TS:201511030101-JRESPlus-资产管理事业部-张翔-现有日期控件如果是手工输入日期的话，日期控件check属性中】
		if (rules && rules.length > 0 && obj.attr("disabled")==undefined) {
		        _this.isValide.call(_this, rules, comp, field.val());
	        }
	        else{
	            _this.removeError.call(_this, comp);
	        }
    },
    /**
     * 正则校验规则 @ intege 校验规则名称 @ Message 默认返回消息 @ 校验规则+Message 校验规则对应的返回值<br>
     * 使用例子1:<br>属性check设置为"required",当textfield失去焦点或表单提交时，如果内容为空，则提示"当前输入不能为空"<br>
     * #textfield({"id":"userName","label":"名称","name":"name","cols":"1","maxlength":"20","check":"required"})<br>
     * 使用例子2:<br>属性check设置为"required;intege",多个验证规则之间用";"分割，每个验证规则都通过，此组件才算验证通过。<br>
     * 当textfield失去焦点或表单提交时，如果内容为空,则提示验证提示"当前输入不能为空",如果不为空，但内容非整数，则提示"输入的不是整数格式"<br>
     * #textfield({"id":"userAge","label":"年龄","name":"age","cols":"1","check":"required;intege"})<br>
     * ----------正则验证名字开始---------<br>
     * intege 整数<br>
     * intege1 正整数<br>
     * intege2 负整数<br>
     * num 数字<br>
     * num1 正数<br>
     * num2 负数<br>
     * decmal 浮点数<br>
     * decmal1 正浮点数<br>
     * decmal2 负浮点数<br>
     * decmal3 浮点数<br>
     * decmal4 非负浮点数<br>
     * decmal5 非正浮点数<br>
     * email 邮件<br>
     * url url<br>
     * chinese 仅中文<br>
     * ascii 仅ACSII字符<br>
     * zipcode 邮编<br>
     * mobile 手机<br>
     * ip4  ip地址<br>
     * picture 图片<br>
     * rar 压缩文件<br>
     * date 日期<br>
     * qq QQ号码<br>
     * tel  电话号码的函数(包括验证国内区号,国际区号,分机号)<br>
     * username  用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串<br>
     * letter  字母<br>
     * letter_u 大写字母<br>
     * letter_l 小写字母<br>
     * idcard 身份证<br>
     * required  非空<br>
     * ----------正则验证名字结束---------<br>
     * Message : "输入格式不正确"<br>
     * -----------------------------------<br>
     * integeMessage : "输入的不是整数格式"<br>
     * intege1Message : "输入的不是正整数格式"<br>
     * intege2Message : "输入的不是负整数格式"<br>
     * requiredMessage : "当前输入不能为空"<br>
     * emailMessage : "邮件地址不正确"<br>
     * zipcodeMessage : "邮编输入格式不正确"<br>
     * dateMessage : "日期格式不正确"<br>
     * qqMessage : "QQ号码格式不正确"<br>
     * telMessage : "电话号码格式不正确"<br>
     * mobileMessage : "移动电话格式不正确"<br>
     * decmalMessage : "只能输入浮点数格式"<br>
     * decmal1Message : "只能输入正浮点数格式"<br>
     * decmal2Message : "只能输入负浮点数格式"<br>
     * decmal3Message : "只能输入浮点数格式"<br>
     * decmal4Message : "只能输入非负浮点数格式"<br>
     * decmal5Message : "只能输入非正浮点数格式"<br>
     * colorMessage : "只能输入颜色格式"<br>
     * urlMessage : "只能输入url格式"<br>
     * chineseMessage : "只能输入中文格式"<br>
     * asciiMessage : "只能输入ACSII字符格式"<br>
     * ip4Message : "只能输入ip4地址格式"<br>
     * pictureMessage : "只能输入图片格式"<br>
     * rarMessage : "只能输入压缩文件格式"<br>
     * numMessage : "只能输入数字格式"<br>
     * num1Message : "只能输入正数数字格式"<br>
     * num2Message : "只能输入负数数字格式"<br>
     * letterMessage : "只能输入字母格式"<br>
     * letter_uMessage : "只能输入大写字母格式"<br>
     * letter_lMessage : "只能输入小写字母格式"<br>
     * usernameMessage :"只能输入由数字、26个英文字母或者下划线组成的字符串"<br>
     * -----------------------------------<br>
     */
    regexEnum : {
        intege : "^-?[1-9]\\d*$|^0$", // 整数
        intege1 : "^[1-9]\\d*$", // 正整数
        intege2 : "^-[1-9]\\d*$", // 负整数
        num : "^([+-]?)\\d*\\.?\\d*$", // 数字
        num1 : "^[1-9]\\d*|0$", // 正数（正整数 + 0）
        num2 : "^-[1-9]\\d*|0$", // 负数（负整数 + 0）
        decmal : "^([+-]?)\\d*\\.\\d+$", // 浮点数
        decmal1 : "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$", // 正浮点数
        decmal2 : "^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", // 负浮点数
        decmal3 : "^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", // 浮点数
        decmal4 : "^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$", // 非负浮点数（正浮点数
        // + 0）
        decmal5 : "^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$", // 非正浮点数（负浮点数
        // + 0）

        email : "^(\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+){0,1}$", // 邮件
        color : "^[a-fA-F0-9]{6}$", // 颜色
        url : "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", // url
        chinese : "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$", // 仅中文
        ascii : "^[\\x00-\\xFF]+$", // 仅ACSII字符
        zipcode : "^\\d{6}$", // 邮编
        mobile : "^(13|15|18|17)[0-9]{9}$", // 手机
        ip4 : "^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$", // ip地址
        notempty : "^\\S+$", // 非空
        picture : "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", // 图片
        rar : "(.*)\\.(rar|zip|7zip|tgz)$", // 压缩文件
        date : "^\\d{4}\\d{1,2}\\d{1,2}$", // 日期
        qq : "[1-9][0-9]{4,11}", // QQ号码
        tel : "^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$", // 电话号码的函数(包括验证国内区号,国际区号,分机号)
        username : "^\\w+$", // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        letter : "^[A-Za-z]+$", // 字母
        letter_u : "^[A-Z]+$", // 大写字母
        letter_l : "^[a-z]+$", // 小写字母
        required : "^\\s*\\S[\\S\\s]*$", // 非空    BUG #7327 

        Message : "输入格式不正确",
        integeMessage : "输入的不是整数格式",
        intege1Message : "输入的不是正整数格式",
        intege2Message : "输入的不是负整数格式",
        requiredMessage : "当前输入不能为空",
        emailMessage : "邮件地址不正确",
        zipcodeMessage : "邮编输入格式不正确",
        dateMessage : "日期格式不正确",
        qqMessage : "QQ号码格式不正确",
        telMessage : "电话号码格式不正确",
        mobileMessage : "移动电话格式不正确",
        decmalMessage : "只能输入浮点数格式",
        decmal1Message : "只能输入正浮点数格式",
        decmal2Message : "只能输入负浮点数格式",
        decmal3Message : "只能输入浮点数格式",
        decmal4Message : "只能输入非负浮点数格式",
        decmal5Message : "只能输入非正浮点数格式",
        colorMessage : "只能输入颜色格式",
        urlMessage : "只能输入url格式",
        chineseMessage : "只能输入中文格式",
        asciiMessage : "只能输入ACSII字符格式",
        ip4Message : "只能输入ip4地址格式",
        pictureMessage : "只能输入图片格式",
        rarMessage : "只能输入压缩文件格式",

        numMessage : "只能输入数字格式",
        num1Message : "只能输入正数数字格式",
        num2Message : "只能输入负数数字格式",
        letterMessage : "只能输入字母格式",
        letter_uMessage : "只能输入大写字母格式",
        letter_lMessage : "只能输入小写字母格式",
        usernameMessage :"只能输入由数字、26个英文字母或者下划线组成的字符串"
    },
    /**
     * 方法校验规则 @ range 校验方法名称 @ Message 默认返回消息 @ 校验规则+Message 校验规则对应的返回值<br>
     * 使用例子1:<br>属性check设置为"intege;range(10,20)",当textfield失去焦点或表单提交时，如果录入内容为45,不在整数的10~20(10<=x<=20)之间，供示提示"45不在10-20范围内"<br>
     * #textfield({"id":"userAge","label":"年龄","name":"age","cols":"1","check":"intege;range(10,20)"})<br>
     * 使用例子2:<br>自定义函数验证,期望值与输入值不相同时，返回错误提示信息，否则返回true<br>
     *#textfield({"id":"userName","label":"名称","name":"name","cols":"1","check":"required;myCheck()"})<br>
     *function myCheck(){<br>
     *    var value = Horn.getComp("name").getValue();<br>
     *    if(!("hello"==value)){<br>
     *       return "内容必需为hello";<br>
     *    }else{<br>
     *       return true;<br>
     *    }<br>
     *  }<br>
     * 校验参数，min：最小值，max：最大值,value:校验传入的value值<br>
     * range(value, min, max)<br>
     * 校验参数，value：值，refname：与value比较的元素名字,如果value与refname指定的元素的值相等返回真，否则返回假<br>
     * compare(value,refname)<br>
     * 校验参数，value值，minLen最小长度，maxLen最大长度，如果value的长度在minLen和maxLen之间返回真，否则返回假<br>
     * length(value,minLen,maxLen)<br>
     * 校验参数，value值，输入的日期小于当前日期返回真，否则返回假<br>
     * past(value)<br>
     * 校验参数，value值，输入的日期大于当前日期返回真，否则返回假<br>
     * future(value)<br>
     * 校验参数，value值,身份证号合法时返回真，否则返回假<br>
     * idcard(value)<br>
     *
     */
    funcEnum : {
        /**
         * @param 校验参数，min：最小值，max：最大值
         * @value 校验传入的value值
         */
        range : function(value, min, max) {
            if (min !== undefined) {
                if (value < min) {
                    return false;
                }
            }
            if (max !== undefined) {
                if (value > max) {
                    return false;
                }
            }
            return true;
        },
        rangeMessage : '{0}不在{1}-{2}范围内',
        /**
         * @param {String} value校验的值
         * @param {String} refname对比的组件名称
         */
        compare : function(value,refname){
            var field = Horn.Field.getField(refname);
            if(field.val()!=value){
                return false ;
            }
            return true ;
        },
        compareMessage : '校验不匹配',
        /**
         * 长度判断
         * @param {String} value
         * @param {int} minLen
         * @param {int} maxLen
         * @return {Boolean}
         */
        length : function(value,minLen,maxLen){
            if(value){
                if(value.length>maxLen || value.length<minLen){
                    return false ;
                }
            }
            return true ;
        },
        lengthMessage : '输入的长度{1}-{2}字符之间',
        /**
         * 日期判断，对象日期是否在输入日期之后
         * @param {String} value 校验值
         * @return {Boolean}
         */
        past : function(value){
            var d = new Date() ;
            var year = d.getFullYear() ,
            	month = String.leftPad(d.getMonth() + 1 + "",'0',2),
            	day = String.leftPad(d.getDate() + "", 2, '0') ;
            var dateStr = year + '' + month + '' + day ;
            if(value){
                if(value>=dateStr){
                    return false ;
                }
            }
            return true ;
        },
        pastMessage : '输入的日期{0}必须小于当前日期',
        /**
         * 日期判断，对象日期是否在输入日期之前
         * @param {String} value 校验值
         * @return {Boolean}
         */
        future : function(value){
            var d = new Date() ;
            var year = d.getFullYear() ,
	            month = String.leftPad(d.getMonth() + 1 + "", '0',2) ,
	            day = String.leftPad(d.getDate() + "",'0',2) ;
            var dateStr = year + '' + month + '' + day ;
            if(value){
                if(value<=dateStr){
                    return false ;
                }
            }
            return true ;
        },
        futureMessage : '输入的日期{0}必须大于当前日期',
        /**
         * 身份证判断
         * @param {String} value 校验值
         * @return {Boolean}
         */
        idcard :function(value){
            var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
                21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
                33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
                42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
                51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
                63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
            };
            //身份证验证
            function checkCard(value)
            {
                var card = value;
                //是否为空
                if(card === '')
                {
                    return false;
                }
                //校验长度，类型
                if(isCardNo(card) === false)
                {
                    return false;
                }
                //检查省份
                if(checkProvince(card) === false)
                {
                    return false;
                }
                //校验生日
                if(checkBirthday(card) === false)
                {
                    return false;
                }
                //检验位的检测
                if(checkParity(card) === false)
                {
                    return false;
                }
                return true;
            };
            //检查号码是否符合规范，包括长度，类型
            function isCardNo(card)
            {
                //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
                if(reg.test(card) === false)
                {
                    return false;
                }
                return true;
            };
            //取身份证前两位,校验省份
            function checkProvince(card)
            {
                var province = card.substr(0,2);
                if(vcity[province] == undefined)
                {
                    return false;
                }
                return true;
            };
            //检查生日是否正确
            function checkBirthday(card)
            {
                var len = card.length;
                //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
                if(len == '15')
                {
                    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                    var arr_data = card.match(re_fifteen);
                    var year = arr_data[2];
                    var month = arr_data[3];
                    var day = arr_data[4];
                    var birthday = new Date('19'+year+'/'+month+'/'+day);
                    return verifyBirthday('19'+year,month,day,birthday);
                }
                //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
                if(len == '18')
                {
                    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                    var arr_data = card.match(re_eighteen);
                    var year = arr_data[2];
                    var month = arr_data[3];
                    var day = arr_data[4];
                    var birthday = new Date(year+'/'+month+'/'+day);
                    return verifyBirthday(year,month,day,birthday);
                }
                return false;
            };
            //校验日期
            function verifyBirthday(year,month,day,birthday)
            {
                var now = new Date();
                var now_year = now.getFullYear();
                //年月日是否合理
                if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
                {
                    //判断年份的范围（0岁到120岁之间)
                    var time = now_year - year;
                    if(time >= 0 && time <= 120)
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            };
            //校验位的检测
            function checkParity(card)
            {
                //15位转18位
                card = changeFivteenToEighteen(card);
                var len = card.length;
                if(len == '18')
                {
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var cardTemp = 0, i, valnum;
                    for(i = 0; i < 17; i ++)
                    {
                        cardTemp += card.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[cardTemp % 11];
                    if (valnum == card.substr(17, 1))
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            };
            //15位转18位身份证号
            function changeFivteenToEighteen(card)
            {
                if(card.length == '15')
                {
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var cardTemp = 0, i;
                    card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
                    for(i = 0; i < 17; i ++)
                    {
                        cardTemp += card.substr(i, 1) * arrInt[i];
                    }
                    card += arrCh[cardTemp % 11];
                    return card;
                }
                return card;
            };
            return checkCard(value);
        },
        idcardMessage : '{0}身份证格式不正确',
        Message : '{0}验证未通过'
    },
    /**
     * 字符串根据规则进行应用 @ str 需要操作的字符串 @ params 操作str字符串{}对应的参数
     * @ignore
     */
    applyString : function(format, params) {
        return format.replace(/\{(\d+)\}/g, function(m, i) {
            return params[i];
        });
    },
    /**
     * @ignore
     * @description isValide 校验方法进行校验 @ rules : Array/Function/String @ str 需要操作的字符串
     * @param {String} rules校验规则
     * @param {Object} display 校验对象
     * @param {String} value 校验值
     * 操作str字符串{}对应的参数 @ rules：Array：regtype注册类型，对应正则表达式名称，或校验方法名称，可选；
     *                 regexparam对应正则表达式第二个参数，可选； message 校验失败返回消息； validFun
     *                 自定义校验方法，可选 其他参数查询查询注册方法：funcEnum
     */
    isValide : function(rules, display, value) {
        var _this = this;
        // 检查校验规则
        if (!rules) {
        	alert('fun.isValide 方法校验规则为空，请检查');
            return false;
        }
        // 检查校验规则类型
        var ruleTypes = "string,array,function";
        if (ruleTypes.indexOf($.type(rules)) == -1) {
        	alert('fun.isValide 方法校验规则类型不正确，应为：' + ruleTypes);
            return false;
        }
        var isValid = true;
        // 如果有输入正则表达式，就进行表达式校验
        // 处理校验规则类型，整理类型
        if ((typeof rules) == "string")
            rules = [ {
                "name" : rules,
                "params" : [ value ]
            } ];
        if ((typeof rules) == "function")
            rules = [ {
                'name' : rules,
                "params" : [ value ]
            } ];
        // 循环校验规则
        for ( var index = 0; index < rules.length; index++) {
            var item = rules[index];
            var name = item['name'];
            //17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
            var format=item['format'];
            if(format=="yesConfig"){//如果配置了自定义格式，则根据自定义格式已经在horn.Util.Format.js文件中进行校验，所以返回，否则根据check：date进行校验
            	return;
            }
            if (name === undefined || name === "") {
                return 'name 校验规则为空请检查';
            }
            if(name!="required" && !value){
                continue ;
            }
            var msg = '';
            if (this.regexEnum[name]) {// 正则表达式进行校验
                isValid = (new RegExp(this.regexEnum[name],
                    item['regexparam'])).test(value);
                msg = item['message'] || this.regexEnum[name + 'Message']
                    || this.regexEnum['Message'];
            } else if (this.funcEnum[name]) {// 校验方法进行校验
                isValid = this.funcEnum[name].apply(display, item.params);
                msg = item['message'] || this.funcEnum[name + 'Message']
                    || this.funcEnum['Message'];
            } else if ($.type(eval(name)) == "function") { // 自定义方法校验
            	//STORY #9521 [经纪业务事业部-胡志武][【TS:201408250103]-JRESPlus-ui-校验找不到方法，其实有定义相关的校验方法
            	var tArr = item.params.slice(0) ;
                isValid = eval(name).apply(display, tArr);
                msg = isValid;
            } else {
            	alert("错误的校验类型");
                return false;
            }
            if (isValid !== true) {
                var params = item["params"];
                msg = ($.type(msg) == "boolean" || !msg) ? msg
                    : _this.applyString.apply(value, [ msg, params ]);
                _this.addError.call(_this, display, msg);
                return msg;
            }
        }
        if(display.isValid != Horn.Field.prototype.isValid){
        	setTimeout(function(){
        		var msg = display.isValid();
        		if(msg !== true){
        			_this.addError.call(_this, display, msg);
        		}else{
        			_this.removeError.call(_this, display, msg);
        		}
        	},1);
        	return;
        }
        _this.removeError.call(_this, display);

        return isValid;
    },
    /**
     * @description 获取组件上绑定的校验规则
     * @param {String} 组件名称
     * @private
     */
    getRules : function(name) {
        var _this = this;
        var field = Horn.Field.getField(name);
        var check = field.attr(this.CHECK);
        var format=field.attr("format")
        if (check) {
            var checks = check.split(this.CHECKSEP);
            var rules = [];
            $.each(checks, function(index, c) {
                var rule = _this.getRule(field, c);
                if (rule) {
                	//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
                	rule["format"]=format;
                    rules.push(rule);
                }
            });
            return rules;
        }
    },
    /**
     * @description 获取某一项校验规则
     * @param {String} field组件名称
     * @param {String} rule规则名称
     * @private
     */
    getRule : function(field, rule) {
        /**
         * return : {name:校验规则名称,params:参数列表}
         */
        if (rule) {
            var name = rule;
            var value = field.val();
            var params = [ value ];
            if (rule.indexOf("(") > -1) {
                name = rule.substring(0, rule.indexOf("("));
                var ps = rule.substring(rule.indexOf("(") + 1,
                    rule.indexOf(")")).split(",");
                for ( var i = 0; i < ps.length; i++) {
                    if (ps[i]) {
                        params.push(eval("(" + ps[i] + ")"));
                    }
                }
            }
            return {
                name : name,
                params : params
            };
        }
        return null;
    },
    /**
     * @description 显示错误消息
     * @param {mix} field 为horn组件对象或组件的名字
     * @param {String} errorMsg 错误消息
     */
    addError : function(field, errorMsg) {
	        var tmpfield = (typeof field=="string") ? Horn.getComp(field) : field ;
	        function doshow(tmpfield){
		    	if(tmpfield instanceof Horn.Field){
		    		tmpfield.showError(errorMsg);
		    	}else{
		    		Horn.Tip.addTip(errorMsg);
		    	}
    		}
    		if(!tmpfield){
    			Horn.ready(function(){
    				var tmpfield = (typeof field=="string") ? Horn.getComp(field) : field ;
    				doshow(tmpfield);
    			});
    		}else{
    			doshow(tmpfield);
    		}
    		
    },
    /**
     * @description 删除错误消息
     * @param {mix} field 为horn组件对象或组件的名字
     */
    removeError : function(field) {
       	field = (typeof field=="string") ? Horn.getComp(field) : field ;
    	$(field).each(function(i,f){
    		try{
        		f = Horn.getCompByEl(f) || f ;
        		f.removeError();
    		}catch(e){
    			if(window.console) window.console.warn("批量消除错误失败"+f);
    		}
    	});
    },
    /**
	 * 检验制定的字符串是否符合日期格式
	 * @param str
	 * @param fmt
	 */
    validateFmt:function(str){
    	if(str=="")return true;
		var strReg="^\\d{4}\\d{1,2}\\d{1,2}$"
		var fmt = Horn.Calendar.DEFAULT_FORMAT;
		var isValid=true;
		if(fmt){
			if(fmt.length>8){
				var firstSeparator=fmt.charAt(4);
				var secondSeparator=fmt.charAt(7);
				var strReg="^\\d{4}"+firstSeparator+"\\d{1,2}"+secondSeparator+"\\d{1,2}$"
				isValid=(new RegExp(strReg)).test(str);
				
			}else{
				isValid=(new RegExp(strReg)).test(str);
			}
			if(!isValid){
					isValid ="日期格式不正确,格式："+fmt;
				}
		}else{
			isValid="没有配置Horn.Calendar.DEFAULT_FORMAT格式参数";
		}
		return isValid;
	}
} ;
