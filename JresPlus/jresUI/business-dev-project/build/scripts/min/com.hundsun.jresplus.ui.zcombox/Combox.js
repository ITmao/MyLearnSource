Horn.Combox=Horn.extend(Horn.Select,{COMPONENT_CLASS:"Combox",pLabel:"",filterFlag:"",displayField:null,keyAttr:"label",pKeyAttr:"pkey",valueAttr:"value",defaultValue:"",defaultText:"",showLabel:true,init:function(e){Horn.Combox.superclass.init.apply(this,arguments);this.combInit();var d=this.el.find("input[ref]"),a=this.el.attr("keyfield"),b=this.el.attr("pkeyfield"),c=this.el.attr("titlefield");if(a){this.keyAttr=a}if(b){this.pkeyAttr=b}if(c){this.valueAttr=c}var f=this.params.dictName;if(f){this.field.attr("ref",f.split(",")[0]+(this.multipleline?"_m":"_s"))}this.displayField=d;this.defaultValue=this.params.value||this.hidden.val();if(this.params.readonly){this.setReadonly(true)}},combInit:function(){var a=this.hidden.attr("refname");if(a){this.field.bind("change",Horn.Util.apply(this.onCombChange,this))}},onCombChange:function(g,h){var b=this.hidden.attr("refname");var f=b.split(";");for(var c=0;c<f.length;c++){var d=f[c];if(d){var a=d.split(",");Horn.getComp(a[0],a[1]).filterByPLabel(this.hidden.val())}}},changeDict:function(b){var d=b;this.clearFliter();var f=Horn.getDict(d);var c=$('<div class="hc_checkboxdiv">');var a=$("<ul></ul>");var e=this;if((this.field.get(0)).getAttribute("multiple")=="true"){b+="_m";c.attr("multiple_line","true");$.each(f,function(g,j){if(e.params.showLabel){var h=$("<li title="+j+" key="+g+'><label><input type="checkbox" class="combox_input"><span class="hce_dictlabel" >'+g+":</span>"+j+"</label></li>")}else{var h=$("<li title="+j+" key="+g+'><label><input type="checkbox" class="combox_input">'+j+"</label></li>")}a.append(h)})}else{b+="_s";c.attr("multiple_line","false");$.each(f,function(g,j){if(e.params.showLabel){var h=$("<li title="+j+" key="+g+'><label><span class="hce_dictlabel" >'+g+":</span>"+j+"</label></li>")}else{var h=$("<li title="+j+" key="+g+"><label>"+j+"</label></li>")}a.append(h)})}c.append(a);this.field.attr("ref",b);this.listEl=c;this.multipleline=this.listEl.attr("multiple_line")=="true";if((this.field.get(0)).getAttribute("multiple")=="true"){this.field.val("")}else{this.field.val("请选择...")}this.hidden.val("")},selectFirst:function(){if(this.listEl&&this.listEl.length==0){this.listEl=this.field.parent().find("div.hc_checkboxdiv")}var a=this.listEl.children("ul").children("li[key]");var c="";var d="";for(var b=0;b<a.length;b++){if($(a.get(b)).css("display")!="none"){c=$(a.get(b)).attr("key");d=jQuery.trim($(a.get(b)).text());if(c!=""){break}}}this.setValue({key:c,text:d},true)},getPos:function(){return{left:0,top:0}},hideAllList:function(){var a=this.listEl;$("div.hc_checkboxdiv").each(function(b,c){if(a.get(0)!=c){$(c).hide();$(c).data("show_name","")}})},showList:function(d,c){var b=d.prev();var a=b.data("filter");if(a){this[a.name].apply(this,a.params)}else{this.clearFliter(b)}Horn.Combox.superclass.showList.apply(this,arguments)},filterByPLabel:function(a){if(this.pLabel!=a){this.reset(true);this.pLabel=a;this.hidden.data("filter",{name:"_filterByPLabel",params:arguments})}},_filterByPLabel:function(c,a){if(!c){return false}var b=this.listEl.children("ul");b.children("li[key][pKey!='"+c+"']").css("display","none");b.children("li[key][pKey='"+c+"']").css("display","block");if(this.defaultValue){this.setValue(this.defaultValue)}else{if(!(a===false)&&(!this.multipleline)){this.selectFirst()}else{this.setValue("")}}},filter:function(g,a,c){this.clearFliter();var e={name:"_filter",params:arguments};var d=this.hidden.data("filter");if(e!=d){this.hidden.data("filter",e);if(c){this.field.trigger("change",e)}}var h=this.hidden.val();var b=this;if(h){this._filter(g,a);setTimeout(function(){$(h.split(",")).each(function(f,i){if(b.listEl.children("ul").children("li[key="+i+"]").css("display")=="none"){b.reset(true)}})},200)}else{this._filter(g,a);setTimeout(function(){b.setValue("")},200)}},_filter:function(e,b){b=!!b;var d="block",c="none";if(b){d="none";c="block"}if(this.listEl&&this.listEl.length==0){this.listEl=this.field.parent().find("div.hc_checkboxdiv")}var a=this.listEl.children("ul").children("li[key]");a.css("display",d);var g=",";if($.type(e)=="string"){e+=g}a.each(function(h,j){var f=$(j);var i=f.attr("key");if($.type(e)=="function"){if(e.call(this,i)){f.css("display",c)}}else{if($.type(e)=="array"){if(jQuery.inArray(i,e)>=0){f.css("display",c)}}else{if($.type(e)=="string"){if(e.indexOf(i+g)>-1){f.css("display",c)}}}}})},clearFliter:function(){if(this.listEl&&this.listEl.length==0){this.listEl=this.field.parent().find("div.hc_checkboxdiv")}this.listEl.children("ul").children("li[key]").css("display","block");this.hidden.data("filter",null)},clearList:function(){if(this.listEl&&this.listEl.length==0){this.listEl=this.field.parent().find("div.hc_checkboxdiv")}this.reset(true);this.listEl.children("ul").children("li[key]").remove()},addItems:function(b,a){this.addDatas(b,a)},addDatas:function(v,p){var u=[],h=this.listEl,a=this.keyAttr,f=this.valueAttr,t=this.showLabel;var o=this.hidden;var b=this.field;var m=this;if(h&&h.length==0){h=this.field.parent().find("div.hc_checkboxdiv")}var c={inputEl:this.field,listEl:h};if(jQuery.type(v)=="array"){u=v}else{if(jQuery.type(v)=="object"){if(jQuery.isPlainObject(v)){if(jQuery.isEmptyObject(v)){return}u.push(v)}}else{if(p===true){this.clearList()}return}}if(p===true){this.clearList()}if(u.length>0){var j=h.children("ul");var d=(h.attr("multiple_line")=="true");$.each(u,function(x,z){var y=z[a],A=z[f];if(!y){y=z.code;A=z.text}if(y){var i=j.children("li[key='"+y+"']");if(i.length==0){var i=$("<li key='"+y+"' title='"+A+"'></li>");var w=$("<label></label>");w.text((t?y+":":"")+A);if(d){w.prepend('<input type="checkbox" class="combox_input"/>')}i.append(w);j.append(i);if(h.data("show_name")==o.attr("name")){i.bind("click.li",c,Horn.Util.apply(m.listClick,m))}}}})}var e=m.params.value;var g=o.attr("value");var k=b.val();var r=",";if(m.params.delimiter){r=m.params.delimiter}var s=g;var q=k;var l=[];if(e&&e!=""){l=e.split(",")}for(var n=0;n<l.length;n++){e=l[n];if(b.attr("selectMode")){if(b.attr("selectMode")=="true"){$.each(u,function(w,x){if(q.indexOf(x.text)<0){if(x.code==e){s=s+(s?",":"")+x.code;q=q+(q?r:"")+x.text}}})}else{$.each(u,function(w,x){if(x.code==e){s=x.code;q=x.text}})}}else{$.each(u,function(w,x){if(x.code==e){s=x.code;q=x.text}})}}this.setValue(s);b.val(q)},showError:function(){Horn.Combox.superclass.showError.apply(this,arguments);var a=this.msgDiv}});Horn.Field.regFieldType("div.hc_combox",Horn.Combox);