Horn.TypeField=Horn.extend(Horn.Field,{regChars:"-0123456789",suffixNumber:2,init:function(c){Horn.TypeField.superclass.init.apply(this,arguments);this.params.inputType=this.params.inputType?this.params.inputType:"money";this.config={};this.config.bigTips=this.params.bigTips||false;if(this.params.split==""){this.config.split=this.params.split}else{this.config.split=this.params.split||","}if(this.params.suffixNum){var a=/^\d+(\.\d+)?$/;if(a.test(this.params.suffixNum)){this.suffixNumber=this.params.suffixNum}}if(this.params.integerNum){this.integerNum=this.params.integerNum}var b=this;this.field.bind({keypress:Horn.Util.apply(b.onKeyPress,b)});var f=this.el.find("div.u-typefield-tip").appendTo($("body")).html(this.params.value||"");var e="";if(this.field.width()&&this.field.width()>0){e=this.el.find("div.u-typefield-capital").width(this.field.width())}else{e=this.el.find("div.u-typefield-capital").css("width","100px")}this.tipLabel=f;this.tipDiv=e;if(this.params.inputType==="money"){this.maskRe=new RegExp("["+this.regChars+".]");this.check="decmal1;";this.initProcess()}else{if(this.params.inputType==="cardNo"){this.maskRe=new RegExp("["+this.regChars+"]");this.check="num;";this.initProcess()}else{return}}$(window).resize(function(){f.hide()});var d=this.getIEVersion();if(d!=-1&&d<10){if(this.params.emptyText&&this.params.emptyText!=""){this.field.val(this.params.emptyText)}}},setValue:function(f){f=f+"";if(f!=null&&f!=""){f=f+"";f=f.replace(/(^\s*)|(\s*$)/g,"")}var e=this.hidden;var g=this.field;if(f===undefined||f===null||f==""){g.val("");e.val("");this.tipLabel.html("");this.tipDiv.html("")}else{if(f.indexOf(".")==0){f="0"+f}var d=f.substring(0,1);f=f.replace(/[^0-9\.-]/g,"");e.val(f);this.changeTipsVal(f);var b,h="";if(this.params.inputType=="money"){b=spliteByChar(f,this.config.split,this.suffixNumber,this.integerNum);if(d=="-"){b=d+b}g.val(b)}else{if(this.params.inputType=="cardNo"){if(f!=null&&f!=""){if(f.indexOf(".")!=-1){f=f.split(".")[0]}}var c=f,a="";b=c?c.match(/\d{1,4}/g).join("  "):"";g.attr("value",b);g.val(b)}}}if(f!=null&&f!=""){this.validate()}},getValue:function(){var a=this.hidden.val();if(a!=null&&a!=""){a=a+"";a=a.replace(/(^\s*)|(\s*$)/g,"")}return a},onKeyPress:function(b){var a=b.keyCode;var c=String.fromCharCode(a);if(!this.maskRe.test(c)){}},showBigtips:function(){var a=this.field.width(),b=this.field.outerHeight();this.tipLabel.css({top:this.field.offset().top+b,left:this.field.offset().left,"z-index":9999}).show()},hideBigtips:function(){this.tipLabel.hide()},initProcess:function(){var a=this;var b=this.tipLabel;if(this.params.value&&/^[\d|\.-]*$/.test(this.params.value)){this.setValue(this.params.value)}else{this.params.value="";this.setValue("")}if(this.params.defValue&&/^[\d|\.-]*$/.test(this.params.defValue)){}else{this.params.defValue=""}this.field.focusin(function(){$(this).val(a.hidden.val());if(a.params.bigTips==true&&a.hidden.val()&&a.hidden.val()!=""){a.showBigtips()}});this.field.focusout(function(){a.hideBigtips();a.setValue(a.hidden.val())});this.field.keyup(function(c){a.changeTipsVal($(this).val());if(a.hidden.val()&&a.hidden.val()!=""){if(a.params.bigTips==true){a.showBigtips()}}else{a.hideBigtips()}})},changeTipsVal:function(g){var j=g.substring(0,1);g=g.replace(/[^0-9\.-]/g,"");if(this.params.inputType=="cardNo"){if(g!=null&&g!=""){if(g.indexOf(".")!=-1){g=g.split(".")[0]}}}if(g==""||g==null){var e=g.split(".");if(e&&e.length>1){var b=parseFloat(e[1]).toFixed(this.suffixNumber);if(b!=0){g=parseFloat(g).toFixed(this.suffixNumber)}}}this.hidden.val(g);var c,k="";if(this.params.inputType=="money"){var f=g.split(".");if(f.length>0){var a=f[0].substr(0,this.integerNum);if(f.length>1){g=a+"."+f[1]}else{g=a}this.hidden.val(g)}if(g.split(".")[1]&&g.split(".")[1].length>2){g=parseFloat(g).toFixed(this.suffixNumber);this.hidden.val(g)}c=spliteByChar(g,this.config.split,this.suffixNumber,this.integerNum);k=numtochinese(g+"",this.suffixNumber);this.tipLabel.html(k);this.tipDiv.html(k);this.tipDiv.attr("title",k)}else{if(this.params.inputType=="cardNo"){var h=g,d="";c=h?h.match(/\d{1,4}/g).join("  "):"";d=h?h.match(/\d{1,4}/g).join(""):"";this.tipLabel.html(c)}}}});Horn.Field.regFieldType("div.hc_textfield.typefield",Horn.TypeField);function isSpecialKey(a,b){return(b.type=="keypress"&&b.ctrlKey)||(a>=33&&a<=40)||a==13||a==9||a==27||(a==8)||(a>=16&&a<=20)||(a>=44&&a<=46)}function spliteByChar(b,k,j,c){var f=b.substring(0,1);if(f=="-"){b=b.substring(1)}var g=b,e=g.split("."),h=e[0],d="";h=h.replace(/\D{1}/g,"");if(!h){return}h=h.substr(0,c);$.each(h.reverse().match(/\d{1,3}/g).reverse(),function(l,m){d+=m.reverse()+k});if(k!=""){d=d.replace(new RegExp("["+k+"]$"),"")}var a=d+(e.length>1?"."+e[1].substr(0,j):"");return a}function numtochinese(e,l){for(i=e.length-1;i>=0;i--){e=e.replace(",","");e=e.replace(" ","")}e=e.replace("￥","");if(isNaN(e)){return}var b=String(e).split(".");var c="";for(i=b[0].length-1;i>=0;i--){if(b[0].length>17){return"位数过大，无法计算"}var a="";var j=b[0].charAt(i);switch(j){case"0":a="零"+a;break;case"1":a="壹"+a;break;case"2":a="贰"+a;break;case"3":a="叁"+a;break;case"4":a="肆"+a;break;case"5":a="伍"+a;break;case"6":a="陆"+a;break;case"7":a="柒"+a;break;case"8":a="捌"+a;break;case"9":a="玖"+a;break}switch(b[0].length-i-1){case 0:a=a+"元";break;case 1:if(j!=0){a=a+"拾"}break;case 2:if(j!=0){a=a+"佰"}break;case 3:if(j!=0){a=a+"仟"}break;case 4:a=a+"万";break;case 5:if(j!=0){a=a+"拾"}break;case 6:if(j!=0){a=a+"佰"}break;case 7:if(j!=0){a=a+"仟"}break;case 8:a=a+"亿";break;case 9:if(j!=0){a=a+"拾"}break;case 10:if(j!=0){a=a+"百"}break;case 11:if(j!=0){a=a+"仟"}break;case 12:a=a+"兆";break;case 13:if(j!=0){a=a+"拾"}break;case 14:if(j!=0){a=a+"百"}break;case 15:if(j!=0){a=a+"仟"}break;case 16:if(j!=0){a=a+"吉"}break;case 17:a=a+"拾";break}c=a+c}if(e.indexOf(".")!=-1){if(b[1].length>2){var g=parseFloat(e);e=g.toFixed(l);b=String(e).split(".")}for(i=0;i<b[1].length;i++){a="";j=b[1].charAt(i);switch(j){case"0":a="零"+a;break;case"1":a="壹"+a;break;case"2":a="贰"+a;break;case"3":a="叁"+a;break;case"4":a="肆"+a;break;case"5":a="伍"+a;break;case"6":a="陆"+a;break;case"7":a="柒"+a;break;case"8":a="捌"+a;break;case"9":a="玖"+a;break}if(i==0){a=a+"角"}if(i==1){a=a+"分"}c=c+a}}while(c.search("零零")!=-1){c=c.replace("零零","零")}c=c.replace("零亿","亿");c=c.replace("亿万","亿");c=c.replace("零万","万");c=c.replace("零元","元");c=c.replace("零角","");c=c.replace("零分","");c=c.replace("亿万","亿");c=c.replace("兆亿","兆");c=c.replace("零兆","兆");c=c.replace("吉兆","吉");if(c.charAt(c.length-1)=="元"||c.charAt(c.length-1)=="角"){c=c+"整"}var f=["壹","贰","叁","肆","伍","陆","柒","捌","玖"];var d=0;while(c.length>0){if(f.indexOf(c[0])<0){c=c.substr(1)}else{break}}var h=e.substring(0,1);if(h=="-"){c="负"+c}var k=c.charAt(c.length-1);if("零"==k){c=c.substring(0,c.length-1);c=c+"整"}return c};