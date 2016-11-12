/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: DataGrid.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：DataGrid组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2016-1-22    刘龙             16742 【DataGrid】列属性dataType为“DATE”时，不生效，页面加载错误
 * 2016-3-15    刘龙             需求#17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
 *-----------------------------------------------------------------------
 */
/**
 * @ignore
 */
	Horn.Util.Format = {
			
			Patterns:{  
				        YEAR      : /y/g,  
				        MONTH     : /M/g,  
				        DAY       : /d/g,  
				        HOUR      : /H/g,  
				        MINUTE    : /m/g,  
				        SECOND    : /s/g,  
				        MILSECOND : /f/g  
			},
			FormatPatterns:function(format){  
		        return eval("/"+  
		                format  
		                .replace(this.Patterns.YEAR,'[0-9]')  
		                .replace(this.Patterns.MONTH,'[0-9]')  
		                .replace(this.Patterns.DAY,'[0-9]')  
		                .replace(this.Patterns.HOUR,'[0-9]')  
		                .replace(this.Patterns.MINUTE,'[0-9]')  
		                .replace(this.Patterns.SECOND,'[0-9]')  
		                .replace(this.Patterns.MILSECOND,'[0-9]')+  
		                "/g");  
		    },  
		    DateISO:function(value,format){  
		        var formatReg = "";  
		        if(value == "" || format=="")  
		            return false;  
		        formatReg = this.FormatPatterns(format);  
		        return formatReg.test(value);  
		    },  
	        /**
	         * Formats the number according to the format string.
	         * <div style="margin-left:40px">examples (123456.789):
	         * <div style="margin-left:10px">
	         * 0 - (123456) show only digits, no precision<br>
	         * 0.00 - (123456.78) show only digits, 2 precision<br>
	         * 0.0000 - (123456.7890) show only digits, 4 precision<br>
	         * 0,000 - (123,456) show comma and digits, no precision<br>
	         * 0,000.00 - (123,456.78) show comma and digits, 2 precision<br>
	         * 0,0.00 - (123,456.78) shortcut method, show comma and digits, 2 precision<br>
	         * To reverse the grouping (,) and decimal (.) for international numbers, add /i to the end.
	         * For example: 0.000,00/i
	         * </div></div>
	         * @param {Number} v The number to format.
	         * @param {String} format The way you would like to format this text.
	         * @return {String} The formatted number.
	         * @ignore
	         */
	        number: function(v, format) {
	            if(!format){
			        return v;
			    }
	            v = Number(v === null || typeof v == 'boolean' ? NaN : v);
	            if (isNaN(v)){
	                return '';
	            }
			    var comma = ',',
			        dec = '.',
			        i18n = false,
			        neg = v < 0;
			
			    v = Math.abs(v);
			    if(format.substr(format.length - 2) == '/i'){
			        format = format.substr(0, format.length - 2);
			        i18n = true;
			        comma = '.';
			        dec = ',';
			    }
			
			    var hasComma = format.indexOf(comma) != -1, 
			        psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);
			
			    if(1 < psplit.length){
			        v = v.toFixed(psplit[1].length);
			    }else if(2 < psplit.length){
			        throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
			    }else{
			        v = v.toFixed(0);
			    }
			
			    var fnum = v.toString();
			    if(hasComma){
			        psplit = fnum.split('.');
			
			        var cnum = psplit[0], parr = [], j = cnum.length, m = Math.floor(j / 3), n = cnum.length % 3 || 3;
			
			        for(var i = 0; i < j; i += n){
			            if(i != 0){
			                n = 3;
			            }
			            parr[parr.length] = cnum.substr(i, n);
			            m -= 1;
			        }
			        fnum = parr.join(comma);
			        if(psplit[1]){
			            fnum += dec + psplit[1];
			        }
			    }
			
			    return (neg ? '-' : '') + format.replace(/[\d,?\.?]+/, fnum);
	        },
			/**
			 * 将制定的字符串格式化为fmt当中的样式
			 * @ignore
			 */
			date:function(dt,fmt){
				var dtTemp=dt;
				if((typeof dt) == "string"){
					dt = dt.trim()
					var tmp = dt;
					var initFmt = function(d){
	    				d = d || "";
	    				if (d.indexOf("/") == -1 && d.indexOf("-") == -1 ) {
	    					return d.substring(0, 4) + "/" + d.substring(4, 6) + "/" + d.substring(6) || "";
	    				}
	    				return d.replace(/\D+/g, "/");
					};
	//				if(dt.length > 8&&Number(dt)){//如果这个数字是8位的就认为这个数字是一个日期的缩写
	//					dt = Number(dt)
	//				}else{
						dt = initFmt(dt)
	//				}
					
					var _tmp = dt.split("/");
					while(_tmp.length<3 ){
						_tmp.push("01")
					}
					dt = _tmp.join("/")
				}								
				var date = new Date(dt) == "Invalid Date" ? new Date(Number(dtTemp)) : new Date(dt);
				if(date == "Invalid Date" || isNaN(date)){
//					Horn.debug("日期格式错误，请检查：",tmp)
					return tmp;
				}else{
					return date.format(fmt);
				}
			},
			all:function(dataType,format,val){
				if(dataType == "DATE"){ //日期格式化
		    		 if(format == null || format == undefined || format.length == 0)
		    			 //format = Horn.Calendar.DEFAULT_FORMAT;
		    			 //16742 【DataGrid】列属性dataType为“DATE”时，不生效，页面加载错误
		    			 format="yyyy-MM-dd HH:mm:ss";
		    		var  input = Horn.Util.Format.date(val,format)
					return input;
		    	}else if(dataType == "AMOUNT"){  //金额格式化
		    		if(format == null || format == undefined || format.length == 0)
		   			   format = "0,000.00";
		    		return Horn.Util.Format.number(val,format);
		    	}else{
		    		return val;
		    	}
			},
			/**
			 * 检验制定的字符串是否符合格式
			 * @param str
			 * @param fmt
			 */
			validateFmt:function(str,fmt){
				//17788 【TS:201603100065-JRESPlus-财富管理事业部-江志伟-项目名称】恒生信托综合管理平台（TCMP）<br>【产品及版】
				var strReg="^\\d{4}\\d{1,2}\\d{1,2}$"
				var isValid=true;
				if(fmt){
					if(fmt.length>10){
						isValid = Horn.Util.Format.DateISO(str, fmt);  
					}else if(fmt.length>8){
						var firstSeparator=fmt.charAt(4);
						var secondSeparator=fmt.charAt(7);
						var strReg="^\\d{4}"+firstSeparator+"\\d{1,2}"+secondSeparator+"\\d{1,2}$"
						isValid=(new RegExp(strReg)).test(str);
					}else{
						isValid=(new RegExp(strReg)).test(str);
					}
				}else{
					isValid=false;
				}
				return isValid;
			}
	};
	
/**
 * 日期格式化，将日期对象解析为指定格式的日期字符串
 * @ignore
 */
Date.prototype.format=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    } 
    /**
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    } */        
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
};