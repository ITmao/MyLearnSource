Horn.CalendarGroup=Horn.extend(Horn.Field,{COMPONENT_CLASS:"CalendarGroup",cal1:null,cal2:null,hidden1:null,hidden2:null,name1:null,name2:null,calobj1:null,calobj2:null,defValue1:"",defHiddenValue1:"",defValue2:"",defHiddenValue2:"",inValidEle:null,tmpValide:"",init:function(dom){Horn.CalendarGroup.superclass.init.apply(this,arguments);this.el.attr("tabIndex",1000);var cal1=$(this.el.find("input:text")[0]);var cal2=$(this.el.find("input:text")[1]);var hidden1=$(this.el.find("input[type=hidden]")[0]);var hidden2=$(this.el.find("input[type=hidden]")[1]);this.name1=hidden1.attr("name");this.name2=hidden2.attr("name");this.name=this.name1;this.alias=hidden1.attr("alias");var config=this.params.config;var settings={};var _this=this;if(hidden1){this.defHiddenValue1=(this.params.defValue1!=undefined)?this.params.defValue1:hidden1.val()}if(hidden2){this.defHiddenValue2=(this.params.defValue2!=undefined)?this.params.defValue2:hidden2.val()}if(cal1){this.defValue1=(this.params.defValue1!=undefined)?this.params.defValue1:cal1.val()}if(cal2){this.defValue2=(this.params.defValue2!=undefined)?this.params.defValue2:cal2.val()}if(config&&typeof(config)=="string"){settings=eval("("+config+")")}else{if(typeof(config)=="object"){settings=config}else{settings={}}}this.format=settings.format;if(!settings.format){settings.format=Horn.Calendar.DEFAULT_FORMAT}this.settings=settings;$.fn.isValid=function(value,format){return Horn.Util.Format.validateFmt(value,format)};$.fn.getDate=function(){return this.val()};settings.onchange=function(){return cal1.change&&cal1.change()};if(!settings.maxDate){settings.maxDate="2999/12/31"}if(!settings.minDate){settings.minDate="1099/12/31"}this.minDate=this._formatDate(settings.minDate);this.maxDate=this._formatDate(settings.maxDate);var $a_cal1=cal1.next("i");var $a_cal2=cal2.next("i");var inputNotShow=cal1.attr("inputNotShow");$a_cal1.click(function(){var disabled=cal1.attr("disabled");if(disabled&&disabled=="disabled"){return}cal1.attr("focusShowCalendar","true");cal1.attr("canEditable","true");cal1.focus();cal1.focus();if(inputNotShow=="false"){cal1.attr("focusShowCalendar","false");cal1.attr("canEditable","false")}});$a_cal2.click(function(){var disabled=cal1.attr("disabled");if(disabled&&disabled=="disabled"){return}cal2.attr("focusShowCalendar","true");cal2.attr("canEditable","true");cal2.focus();cal2.focus();if(inputNotShow=="false"){cal2.attr("focusShowCalendar","false");cal2.attr("canEditable","false")}});if(!cal1.attr("readonly")||true){cal1.focus(function(event){if(_this.readonly){return false}var _org=cal1.val();if(_org&&_org.indexOf("/")==-1&&_org.indexOf("-")==-1){var _ttt=Horn.Util.Format.date(_org,"yyyy-MM-dd");cal1.val(_ttt)}var config1=Horn.apply({},settings);var maxDate=_this._formatDate(_this.cal2.val());maxDate=maxDate||_this.maxDate;if(!_this.compareDate(_this.minDate,maxDate)||!_this.compareDate(maxDate,_this.maxDate)){maxDate=_this.maxDate}config1=Horn.apply(config1,{minDate:Horn.Util.Format.date(_this.minDate,"yyyy-MM-dd HH:mm"),maxDate:Horn.Util.Format.date(maxDate,"yyyy-MM-dd HH:mm"),real:hidden1,btnBar:false,onSetDate:function(){setTimeout(function(){cal1.evented=true;cal1.blur()},100)}});var conf=config1;var lformat=conf.format.toLowerCase();var viewNo=conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;if(viewNo===3){conf.noToday=true}var that=this;this.config1=conf;if(cal1.evented==undefined){_this.calobj1=cal1.datetimepicker({format:conf.format,startDate:conf.minDate,endDate:conf.maxDate,language:"zh-CN",autoclose:true,minView:viewNo,startView:viewNo===3?4:2,todayBtn:conf.noToday===true?false:true}).on("changeDate",function(e){var h=e.date.getHours()-8;e.date.setHours(h);var date=e.date.format(conf.format);this.value=date;hidden1.val(date)}).on("hide",function(){if(that._inputValue1!=null){var date;if(that._inputValue1==""){date=""}else{date=Horn.Util.Format.date(that._inputValue1,that.config1.format);if(date.indexOf("1899")==0){date=that._inputValue1}}hidden1.val(date);this.value=date;that._inputValue1=null}else{this.value=hidden1.val()}conf.onSetDate()}).keyup(function(){that._inputValue1=$(this).val();hidden1.val($(this).val())}).keypress(function(e){that._inputValue=$(this).val();hidden1.val($(this).val())})}_this.calobj1.datetimepicker("setStartDate",conf.minDate).datetimepicker("setEndDate",conf.maxDate).datetimepicker("show");cal1.evented=true;var rv=_this.getIEVersion();if(rv!=-1&&rv<10){if(cal1.attr("placeholder")&&cal1.attr("placeholder")!=""){if(cal1.val()==cal1.attr("placeholder")){cal1.val("")}}}});var _field=this;cal1.blur(function(){_this.tmpValide="";if(!_field.format){$(this).attr("format","noConfig")}else{$(this).attr("format","yesConfig")}var _calendarGroup=_this;_this.formatVal();if(_this.cal1.val()!=""){if(_this.cal2.val()==""){var rule2=_this.cal2.attr("check");if(rule2&&rule2.indexOf(Horn.Validate.REQUIRED)>-1){_this.showError("当前输入不能为空");return}}if(!_field.format){var _validate=Horn.Validate;var comp=_calendarGroup;var obj=comp.cal1;var rules=_validate.getRules.call(_validate,obj);if(rules&&rules.length>0&&obj.attr("disabled")==undefined){_this.tmpValide=_validate.isValide.call(_validate,rules,comp,obj.val())}else{_validate.removeError.call(_validate,comp)}}}else{var rule1=_this.cal1.attr("check");if(rule1&&rule1.indexOf(Horn.Validate.REQUIRED)>-1&&(!_this.cal1.val()||!_this.cal2.val())){_this.showError("当前输入不能为空");return}}if(_this.cal1.val()!=""){_this.valideDateFormat()}var rv=_this.getIEVersion();if(rv!=-1&&rv<10){var placeholder=_this.cal1.attr("placeholder");if(placeholder&&placeholder!=""){if(_this.hidden1.val()==""){_this.cal1.val(placeholder)}}}})}if(!cal2.attr("readonly")||true){cal2.focus(function(event){if(_this.readonly){return false}var _org=cal2.val();if(_org&&_org.indexOf("/")==-1&&_org.indexOf("-")==-1){var _ttt=Horn.Util.Format.date(_org,"yyyy-MM-dd");cal2.val(_ttt)}var config2=Horn.apply({},settings);var minDate=_this._formatDate(_this.cal1.val());minDate=minDate||_this.minDate;if(!_this.compareDate(_this.minDate,minDate)||!_this.compareDate(minDate,_this.maxDate)){minDate=_this.minDate}config2=Horn.apply(config2,{maxDate:Horn.Util.Format.date(_this.maxDate,"yyyy-MM-dd HH:mm"),minDate:Horn.Util.Format.date(minDate,"yyyy-MM-dd HH:mm"),real:hidden2,btnBar:false,onSetDate:function(){setTimeout(function(){cal2.evented=true;cal2.blur()},10)}});var conf=config2;var lformat=conf.format.toLowerCase();var viewNo=conf.format.indexOf("m")>-1?0:lformat.indexOf("h")>-1?1:lformat.indexOf("d")>-1?2:conf.format.indexOf("M")>-1?3:4;if(viewNo===3){conf.noToday=true}var that=this;that.config2=conf;if(cal2.evented==undefined){_this.calobj2=cal2.datetimepicker({format:conf.format,language:"zh-CN",autoclose:true,minView:viewNo,startView:viewNo===3?4:2,todayBtn:conf.noToday===true?false:true}).on("changeDate",function(e){var h=e.date.getHours()-8;e.date.setHours(h);var date=e.date.format(conf.format);this.value=date;hidden2.val(date)}).on("hide",function(){if(that._inputValue2!=null){var date;if(that._inputValue2==""){date=""}else{date=Horn.Util.Format.date(that._inputValue2,that.config2.format);if(date.indexOf("1899")==0){date=that._inputValue2}}hidden2.val(date);this.value=date;that._inputValue2=null}else{this.value=hidden2.val()}conf.onSetDate()}).keyup(function(){that._inputValue2=$(this).val();hidden2.val($(this).val())}).keypress(function(e){that._inputValue2=$(this).val();hidden2.val($(this).val())})}_this.calobj2.datetimepicker("setStartDate",conf.minDate).datetimepicker("setEndDate",conf.maxDate).datetimepicker("show");cal2.evented=true;var rv=_this.getIEVersion();if(rv!=-1&&rv<10){if(cal2.attr("placeholder")&&cal2.attr("placeholder")!=""){if(cal2.val()==cal2.attr("placeholder")){cal2.val("")}}}});cal2.blur(function(){_tmpValide="";if(!_field.format){$(this).attr("format","noConfig")}else{$(this).attr("format","yesConfig")}var _calendarGroup=_this;_this.formatVal();if(_this.cal2.val()!=""){if(_this.cal1.val()==""){var rule1=_this.cal1.attr("check");if(rule1&&rule1.indexOf(Horn.Validate.REQUIRED)>-1){_this.showError("当前输入不能为空");return}}if(!_field.format){var _validate=Horn.Validate;var comp=_calendarGroup;var obj=comp.cal2;var rules=_validate.getRules.call(_validate,obj);if(rules&&rules.length>0&&obj.attr("disabled")==undefined){_this.tmpValide=_validate.isValide.call(_validate,rules,comp,obj.val())}else{_validate.removeError.call(_validate,comp)}}}else{var rule2=_this.cal2.attr("check");if(rule2&&rule2.indexOf(Horn.Validate.REQUIRED)>-1&&(!_this.cal2.val()||!_this.cal1.val())){_this.showError("当前输入不能为空");return}}if(_this.cal2.val()!=""){_this.valideDateFormat()}var rv=_this.getIEVersion();if(rv!=-1&&rv<10){var placeholder=_this.cal2.attr("placeholder");if(placeholder&&placeholder!=""){if(_this.hidden2.val()==""){_this.cal2.val(placeholder)}}}})}this.cal1=cal1;this.hidden1=hidden1;this.cal2=cal2;this.hidden2=hidden2;if(this.params.disabled){this.setEnable(false)}if(this.params.readonly){this.setReadonly(true)}this.calobj1=this.cal1;this.calobj2=this.cal2;var rv=this.getIEVersion();if(rv!=-1&&rv<10){var placeholder=this.cal1.attr("placeholder");if(placeholder&&placeholder!=""){if(!this.params.value1||this.params.value1==""){this.cal1.val(this.cal1.attr("placeholder"))}if(!this.params.value2||this.params.value2==""){this.cal2.val(this.cal2.attr("placeholder"))}}}var conf=this.params.config;if(_this.calobj1.val()!=""&&conf&&conf!=""&&!Horn.Util.Format.validateFmt(_this.calobj1.val(),_this.settings.format)){_this.showError("日期格式不正确,格式为："+_this.settings.format);this.err=true;return}if(_this.calobj2.val()!=""&&conf&&conf!=""&&!Horn.Util.Format.validateFmt(_this.calobj2.val(),_this.settings.format)){_this.showError("日期格式不正确,格式为："+_this.settings.format);this.err=true}},getDisabled:function(b){var a=b.attr("disabled");if(a&&a=="disabled"){return true}return false},formatVal:function(){var e=this;var c=e.hidden1.val();var d="";if(c!=""){d=Horn.Util.Format.date(c,e.settings.format)}if(d.indexOf("1899")==0){d=c}e.hidden1.val(d);e.cal1.val(d);this.value=d;var a=e.hidden2.val();var b="";if(a!=""){b=Horn.Util.Format.date(a,e.settings.format)}if(b.indexOf("1899")==0){b=a}e.hidden2.val(b);e.cal2.val(b);this.value=b},valideDateFormat:function(){var c=true;var e=this;var a=true;var h=this.cal1.attr("check");if(h&&h.length>0){if(e.calobj1.val()==""||e.calobj2.val()==""){if(h.indexOf(Horn.Validate.REQUIRED)>-1){e.showError("该输入不能为空");c=false;this.err=true;return}}}if(h&&h.length>0&&!this.params.config){if(e.calobj1.val()!=""||e.calobj2.val()!=""){var j=h.split(";");var b="";for(var d=0;d<j.length;d++){var k=j[d];if(k!=""&&k!="Horn.Validate.validateFmt"&&k!=Horn.Validate.REQUIRED){var f=window[k];var g=f();if(g!=true){a=false;b=g;break}}else{this.formatVal()}}if(!a){e.showError(g);a=false;this.err=true;return}}}else{this.formatVal()}if(e.calobj1.val()!=""&&!Horn.Util.Format.validateFmt(e.calobj1.val(),e.settings.format)){e.showError("日期格式不正确,格式为："+e.settings.format);c=false;this.err=true;return}if(e.calobj2.val()!=""&&!Horn.Util.Format.validateFmt(e.calobj2.val(),e.settings.format)){e.showError("日期格式不正确,格式为："+e.settings.format);c=false;this.err=true;return}if(e.calobj1&&(!e.compareDate(e.calobj1.getDate(),e.maxDate)||!e.compareDate(e.minDate,e.calobj1.getDate()))||e.calobj2&&(!e.compareDate(e.calobj2.getDate(),e.maxDate)||!e.compareDate(e.minDate,e.calobj2.getDate()))){if(!e.compareDate(e.calobj1.getDate(),e.maxDate)||!e.compareDate(e.minDate,e.calobj1.getDate())){e.inValidEle=e.cal1}else{if(e.calobj2&&(!e.compareDate(e.calobj2.getDate(),e.maxDate)||!e.compareDate(e.minDate,e.calobj2.getDate()))){e.inValidEle=e.cal2}}c=false;this.err=true;e.showError("日期不在有效区间");return}else{if(e.calobj1&&e.calobj1.isValid(e.calobj1.val(),e.settings.format)&&e.calobj2&&e.calobj2.isValid(e.calobj2.val(),e.settings.format)&&e.calobj1.getDate()&&e.calobj2.getDate()){if(e.calobj1.getDate()&&e.calobj2.getDate()&&!e.compareDate(e.calobj1.getDate(),e.calobj2.getDate())){c=false;this.err=true;e.inValidEle=e.cal1;e.showError("开始日期不能大于结束日期");return}}}if(c){this.err=false;e.removeError()}},getEventTarget:function(){return this.el.find("input:text")},_formatDate:function(a){a=a||"";if(a.indexOf("/")==-1&&a.indexOf("-")==-1&&a.length>=8){return a.substring(0,4)+"/"+a.substring(4,6)+"/"+a.substring(6)}return a.replace(/-/g,"/")},compareDate:function(b,a){b=this._formatDate(b);a=this._formatDate(a);if(!Date.parse(b)||!Date.parse(a)){return true}return Date.parse(b)<=Date.parse(a)},setValue:function(b){var a=this;this.cal1.val(b[this.name1]);this.hidden1.val(b[this.name1]);this.cal2.val(b[this.name2]);this.hidden2.val(b[this.name2]);this.formatVal();this.valideDateFormat()},getValue:function(){var d=this;var b=this.get();var c="";var a;$.each(b,function(e,f){a=$(f).val();if(a){a=Horn.Util.Format.date(a,d.settings.format)}c+=","+a});if(c==",,"){return""}return c.indexOf(",")==0?c.substring(1):c},showError:function(b){var a=this.cal1;var d=this.cal2;a.removeClass("m-verify-success");a.addClass("m-verify-error");d.removeClass("m-verify-success");d.addClass("m-verify-error");b=$.type(b)=="boolean"?"校验错误":b;if(!this.msgDiv){this.msgDiv=$('<div class="m-verify-tip bottom" role="m-verify-tip" style="display: none;"></div>');this.el.after(this.msgDiv)}var c=this.msgDiv;c.html('<div class="verify-tip-arrow"></div><div class="verify-tip-inner">'+b+"</div>");c.css("display","block");this.err=true},removeError:function(){var a=this.cal1;var e=this.cal2;a.removeClass("m-verify-error");e.removeClass("m-verify-error");var c=this.get();var b=a.attr(Horn.Validate.CHECK);if(b){if(this.isValid){if(a.val()!=""||e.val()!=""){a.addClass("m-verify-success");e.addClass("m-verify-success")}}}this.err=false;var d=this.msgDiv;if(d){d.remove()}delete this.msgDiv},addRule:function(g){var d=this.cal1;var b=this.cal2;var c=d.attr(Horn.Validate.CHECK);if(c){if(c.indexOf(g)>-1){return}c+=Horn.Validate.CHECKSEP+g}else{c=g}d.attr(Horn.Validate.CHECK,c);b.attr(Horn.Validate.CHECK,c);if(g&&g.indexOf(Horn.Validate.REQUIRED)>-1){var a=this.el.parent().parent(".g-unit-wrap");var e=$("label",a);var f=$("span.m-verify-symbol",e);if(!f.length){f=$("<span>",{"class":"m-verify-symbol",html:"*"});e.prepend(f)}else{f.html("*")}}this.removeError();this.field.removeClass("m-verify-success")},removeRule:function(e){var c=this.cal1;var a=this.cal2;var b=c.attr(Horn.Validate.CHECK);if(b&&b.indexOf(e)>-1){var d=b.split(Horn.Validate.CHECKSEP);d=$.grep(d,function(g,f){return g&&g!=e});c.attr(Horn.Validate.CHECK,d.join(";"));a.attr(Horn.Validate.CHECK,d.join(";"));this.removeError();this.setNotRequired()}},mutiName:function(){return[this.name1,this.name2]},validate:function(){var a=true;var c=this;var f=this;if(c.params.disabled&&c.params.disabled==true){return true}var j=this.cal1.attr("check");var j=this.cal1.attr("check");if(j&&j.indexOf(Horn.Validate.REQUIRED)>-1){if(f.calobj1.val()==""||f.calobj2.val()==""){f.showError("当前输入不能为空");vaid=false;this.err=true;return}}var l=Horn.Validate;var e=this.cal1;var n=l.getRules.call(l,e);if(j&&j.length>0&&!this.params.config){var k=j.split(";");var b="";for(var d=0;d<k.length;d++){var p=k[d];var g=function(){};if(p!=""&&p!="Horn.Validate.validateFmt"&&p!=Horn.Validate.REQUIRED){if(window[p]){g=window[p];var h=g();if(h!=true){a=false;b=h;break}}else{if(window.ruleFunc){var h=p;if(h!=true){a=false;b=h;break}}}}}if(!a){c.showError(h);a=false;this.err=true;return}}var o=this.calobj1.getDate();var m=this.calobj2.getDate();if(this.tmpValide!=undefined&&this.tmpValide!=""){if(!this.tmpValide){c.showError(this.tmpValide);a=false}}else{if(this.msgDiv!=null){a=false}}if(f.calobj1.val()!=""){if(!Horn.Util.Format.validateFmt(f.calobj1.val(),f.settings.format)){a=false;this.err=true;f.showError("日期格式不正确，格式为："+f.settings.format);return}}else{if(f.calobj1&&(!f.compareDate(f.calobj1.getDate(),f.maxDate)||!f.compareDate(f.minDate,f.calobj1.getDate()))||f.calobj2&&(!f.compareDate(f.calobj2.getDate(),f.maxDate)||!f.compareDate(f.minDate,f.calobj2.getDate()))){a=false;this.err=true;f.showError("日期不在有效区间");return}else{if(f.calobj1&&f.calobj1.isValid(f.calobj1.val(),f.settings.format)&&f.calobj2&&f.calobj2.isValid(f.calobj2.val(),f.settings.format)&&f.calobj1.getDate()&&f.calobj2.getDate()){if(f.calobj1.getDate()&&f.calobj2.getDate()&&!f.compareDate(f.calobj1.getDate(),f.calobj2.getDate())){a=false;this.err=true;f.showError("开始日期不能大于结束日期");return}}else{f.removeError();this.err=false;a=true}}}if(f.calobj2.val()!=""){if(!Horn.Util.Format.validateFmt(f.calobj2.val(),f.settings.format)){a=false;this.err=true;f.showError("日期格式不正确，格式为："+f.settings.format);return}}else{if(f.calobj1&&(!f.compareDate(f.calobj1.getDate(),f.maxDate)||!f.compareDate(f.minDate,f.calobj1.getDate()))||f.calobj2&&(!f.compareDate(f.calobj2.getDate(),f.maxDate)||!f.compareDate(f.minDate,f.calobj2.getDate()))){if(!f.compareDate(f.calobj1.getDate(),f.maxDate)||!f.compareDate(f.minDate,f.calobj1.getDate())){f.inValidEle=f.cal1}else{if(f.calobj2&&(!f.compareDate(f.calobj2.getDate(),f.maxDate)||!f.compareDate(f.minDate,f.calobj2.getDate()))){f.inValidEle=f.cal2}}f.showError("日期不在有效区间");return}else{if(f.calobj1&&f.calobj1.isValid(f.calobj1.val(),f.settings.format)&&f.calobj2&&f.calobj2.isValid(f.calobj2.val(),f.settings.format)&&f.calobj1.getDate()&&f.calobj2.getDate()){if(f.calobj1.getDate()&&f.calobj2.getDate()&&!f.compareDate(f.calobj1.getDate(),f.calobj2.getDate())){f.inValidEle=f.cal1;f.showError("开始日期不能大于结束日期");return}}else{f.removeError();this.err=false;a=true}}}if(!a){this.err=true}c.formatVal()},setEnable:function(a){if(a){this.cal1.removeAttr("disabled");this.cal2.removeAttr("disabled");this.hidden1.removeAttr("disabled");this.hidden2.removeAttr("disabled")}else{this.cal1.attr("disabled","disabled");this.cal2.attr("disabled","disabled");this.hidden1.attr("disabled","disabled");this.hidden2.attr("disabled","disabled")}},reset:function(a){this.hidden1.val(a?"":this.defHiddenValue1);this.hidden2.val(a?"":this.defHiddenValue2);var c=a?"":this.defValue1||this.defHiddenValue1;var b=a?"":this.defValue2||this.defHiddenValue2;var d={};d[this.name1]=c;d[this.name2]=b;this.setValue(d);this.validate()},clearValue:function(){this.hidden1.val("");this.hidden2.val("");this.cal1.val("");this.cal2.val("");this.validate()},getInValidEle:function(){return this.inValidEle},setReadonly:function(a){Horn.Calendar.superclass.setReadonly.apply(this,arguments);if(this.readonly){this.cal1.unbind("click").datetimepicker("remove");this.cal2.unbind("click").datetimepicker("remove")}else{this.cal1.evented=undefined;this.cal2.evented=undefined}}});Horn.Field.regFieldType("div.hc_calendargroup",Horn.CalendarGroup);