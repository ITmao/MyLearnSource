Horn.Grid=Horn.extend(Horn.Base,{COMPONENT_CLASS:"Grid",titleEl:null,data:null,curData:null,curTr:null,rowSelect:false,keyAttr:"label",valueAttr:"value",init:function(c){Horn.Grid.superclass.init.apply(this,arguments);this.ths=this.el.find("th");var d=this;var b=this.params.data||{};this.data=b;if(this.params.selectModel=="muti"||this.params.selectModel=="multi"){this.mutiSelect=true}this.curTr=this.el.find("tr.u-table-selected");var a=this.el.children("table").children("tbody").children("tr");this.curData=this.data[a.index(this.curTr)-1];this.rowSelect=Boolean(this.params.rowSelect);this.textOverHidden=this.params.textOverHidden?this.params.textOverHidden:false;this.ths.each(function(j,f){var h=f.attributes.hidden;f=$(f);var k=f.attr("dictName"),l=f.attr("colno"),e;var g=f.attr("width");var i,m;if(l){i=d.params.items[l-1].items;m=d.params.items[l-1].buttons}if(k){e={};var n=$(".hc_checkboxdiv[ref_target="+k+"_s]").find("li");n.each(function(p,o){o=$(o);var q=o.attr("title");var r=o.attr("key");e[r]=q})}else{if(i){e={};$(i).each(function(o,p){e[p[d.keyAttr]]=p[d.valueAttr]})}else{if(g){}}}f.data("staticDict",e);f.data("buttons",m)});this.el.find(".h_querytable_select_all").change(function(){if(this.checked){d.selectAll()}else{d.unSelectAll()}});this.selecteds={};this.dictTrans();this.initEvents();this.initToolbarEvents();if(this.params.isDragColumn){if(this.params.name&&this.params.name!=""){$("."+this.params.name).resizableColumns({})}}if(!this.textOverHidden){this.resetTdContent()}},customEvents:"rowclick,rowdblclick",getEventTarget:function(){return this.el},setButtonDisabled:function(a,b){var c=this.el.children("div.u-datagrid-toolbar").children("ul").children("li");c.each(function(f,d){var e=$(this).children("a");var g=e.attr("name");if(g==a){if(b){e.addClass("f-disabled");e.attr("onclick","javascript:return false;")}else{e.removeClass("f-disabled");e.attr("onclick",e.attr("event"))}return}})},initToolbarEvents:function(){var a=this.el.children("div.u-datagrid-toolbar").children("ul").children("li");a.each(function(d,b){var c=$(this).children("a");if(c.hasClass("f-disabled")){c.attr("onclick","javascript:return false;")}c.bind("click",function(f){if($(this).hasClass("f-disabled")){$(this).attr("onclick","javascript:return false;")}else{$(this).attr("onclick",$(this).attr("event"))}})})},initEvents:function(){var c=this.el.children("div.u-datagrid").children("table");var l=c.children("tbody");var j=this;var d=j.el.find(".h_querytable_select_all").length>0?true:false;if(d){this.el.find("input:checkbox.h_querytable_select").change(function(){j.stateTest()})}if(this.rowSelect==true){l.children("tr").each(function(p,r){var s=p;var o=$(r),q=j.mutiSelect?o.find("input:checkbox.h_querytable_select"):o.find("input:radio.h_querytable_select");o.bind("click",function(i){if($.isEmptyObject(j.selecteds)){j.selectRow(s,o)}else{if(!j.selecteds.hasOwnProperty(s)){j.selectRow(s,o)}else{j.unSelectRow(s,o)}}if(d){j.stateTest()}})})}var n=undefined;var k=undefined;var b=undefined;var a=undefined;var g=this.data;$.each(this.params.events||[],function(p,q){j[q.event.toLowerCase()]=q["function"]});if(this.rowclick){n=Horn.Util.getFunObj(this.rowclick);if($.type(n.fn)=="function"){b=n.fn}}if(this.rowdblclick){k=Horn.Util.getFunObj(this.rowdblclick);if($.type(k.fn)=="function"){a=k.fn}}if(b||a){var h=l.children("tr");for(var f=0;f<g.length;f++){var m=$(h.get(f));if(b){var e=n.params.slice(0);e.push(g[f],g);m.bind("click",e,function(o){var i=o.data;return n.fn.apply(this,i)})}if(a){var e=k.params.slice(0);e.push(g[f],g);m.bind("dblclick",e,function(o){var i=o.data;return k.fn.apply(this,i)})}}}},resetTdContent:function(){var g=this;var b=this.el.children("div.u-datagrid").children("table").children("tbody").children("tr");var c=this.el.children("div.u-datagrid").children("table").children("thead").children("tr").children("th");var f=[];if(this.data&&this.data.length>0){for(var d=0;d<this.data.length;d++){var a=this.data[d];$.each(a,function(h,i){f.push(h)});break}}var e=[];b.each(function(p,k){var m=$(k);var i=m.find("td");for(var l=0;l<i.length;l++){var h=$(i[l]);var j=h.attr("width");var o=h.children("div");var n=o.text();if(g.getStrlen(n)>40){if(e.indexOf(l)==-1){e.push(l)}o.css("width",300);h.css("width",300)}}})},getStrlen:function(e){var b=2;var a=0;for(var d=0;d<e.length;d++){var f=e.charCodeAt(d);if((f>=1&&f<=126)||(65376<=f&&f<=65439)){a++}else{a+=b}}return a},setTitle:function(a){this.el.children("div.u-datagrid-header").children("h4").text(a)},onRowSelect:function(){},selecteds:null,stateTest:function(){var b=this;var a=true;b.el.find("input:checkbox.h_querytable_select").each(function(c,d){if(!$(d).prop("checked")){a=false}});if(a){b.el.find(".h_querytable_select_all").prop("checked",true)}else{b.el.find(".h_querytable_select_all").prop("checked",false)}},selectAll:function(){var a=this;this.el.find("input:checkbox.h_querytable_select").each(function(b,c){c.checked=true;if(a.rowSelect==false){$(c).trigger("change")}else{a.selectRow(b)}});a.lastSelect={rowidx:"all"};this.el.find(".h_querytable_select_all").attr("checked",true)},unSelectAll:function(){var a=this;this.el.find("input:checkbox.h_querytable_select").each(function(b,c){c.checked=false;if(a.rowSelect==false){$(c).trigger("change")}else{a.unSelectRow(b)}});this.el.find(".h_querytable_select_all").prop("checked",false)},lastSelect:null,mutiSelect:false,selectRow:function(b,d){var c=this;var g=d;if(!g){g=$(this.el.find("tr").has("td").get(b))}if(g.size()==0){Horn.debug("Grid["+this.name+"]","选择的行"+b+"不存在");return false}var h={};var f={};var a=this.ths;var e=g.find("td");a.each(function(m,j){var l=e.get(m),k=$(j);if(k.attr("name")){h[k.attr("name")]=k.attr("dictName")?$(l).attr("key"):$(l).text();f[k.attr("name")]=$(l).text()}});c.onRowSelect.call(g,g,b,h);this.selecteds[b]={val:h,displays:f};if(!c.mutiSelect){var i=c.lastSelect;if(i&&i.rowidx!=b){if(this.mutiSelect){i.tr.find("input:checkbox.h_querytable_select").prop("checked",false)}else{i.tr.find("input:radio.h_querytable_select").prop("checked",false)}c.unSelectRow(i.rowidx,i.tr)}}c.lastSelect={rowidx:b,tr:g};if(this.mutiSelect){g.find("input:checkbox.h_querytable_select").prop("checked",true)}else{g.find("input:radio.h_querytable_select").prop("checked",true)}g.addClass("u-table-selected")},unSelectRow:function(c,a){var b=a;if(!b){b=$(this.el.find("tr").has("td").get(c))}this.selecteds[c]=null;delete this.selecteds[c];b.removeClass("u-table-selected");if(this.mutiSelect){b.find("input:checkbox.h_querytable_select").prop("checked",false);this.el.find(".h_querytable_select_all").prop("checked",false)}else{b.find("input:radio.h_querytable_select").prop("checked",false)}},getSelecteds:function(e){var d=[];for(var c in this.selecteds){var b=this.selecteds[c];if(b){var a=b.val;if(e===true){a=this.data[c]}else{if(e==1){a=b.displays}}d.push(a)}}return d},changeCurrent:function(a){if(!a instanceof $){a=this.el.children("tbody").children("tr")[a]}if(!this.curtr){this.curtr=this.el.find("tr.u-table-selected")}var b=this.el.children("table").children("tbody").children("tr").index(this.curtr);this.curtr.removeClass("u-table-selected");a.addClass("u-table-selected");this.curtr=a;this.curData=this.data[b-1]},getCurrentData:function(){return this.curData},hiddenColumns:function(){var a=this.el.children("table").children("tbody").children("tr");var b=this.ths;b.each(function(f,e){var c=$(e);var d=e.attributes.hidden;if(d!=null&&d!=undefined&&d.value=="true"){c.hide();a.each(function(i,h){var k=$(h);var j=k.find("td");for(var g=0;g<j.length;g++){var l=$(j[g]);if(f==g){l.hide();break}}})}})},formatColumn:function(a,b,c){return Horn.Util.Format.all(a,b,c)},resetTHWidth:function(){var d=this.ths;var f=d.size();var b=this.el.children("table");var g=b.width();var c=[];d.each(function(i,l){var j=$(l);if(j.hasClass("h_numbercolumn")||j.hasClass("h_querytable_checkboxcolumn")){j.addClass("h_table_th_extend")}else{if(l.attributes.hidden){var k=l.attributes.hidden;if(k!=null&&k!=undefined&&k.value=="true"){f--}}else{if(j.attr("width")){f--}else{c.push(j)}}}return true});var h=100/f;for(var e=0;e<c.length;e++){var a=c[e].attr("class");if(a&&a=="u-table-time"){c[e].css("width",h.toFixed(2)+"%")}}e},dictTrans:function(){var b=this,c=this.ths,a=this.el.find("tr");a.each(function(e,d){var g=$(d),f=b.mutiSelect?g.find("input:checkbox"):g.find("input:radio");if(f.hasClass("h_querytable_select")){if(b.rowSelect==false){f.change(function(){if(this.checked){b.selectRow(e-1,g)}else{b.unSelectRow(e-1,g)}})}if(f.attr("checked")){setTimeout(function(){b.selectRow(e,g)},3)}}g.find("td").each(function(h,l){var n=$(l);var m=$(c.get(h));var j=m.attr("dictname"),k=m.attr("multiple"),s=m.data("staticDict"),r=m.attr("renderer"),y=m.data("buttons"),i=m.attr("showwhenover"),t=m.attr("dataType"),x=m.attr("format");if(s){n.attr("key",n.text());var q=n.text()||"";if(k){var p=[];$(q.trim().split(",")).each(function(B,C){p.push(s[C]||C)});n.text(p.join(","));n.attr("title",p.join(","))}else{if(q==""||s[n.text().trim()]==undefined){n.text("");n.attr("title","")}else{n.text(s[n.text().trim()]||n.text());n.attr("title",s[n.text().trim()]||n.text())}}}else{if(y){n.attr("title","");var v=y;var u=$("<span></span>");$(v).each(function(F,C){var D=Horn.Util.getFunObj(C.event);if(!D.fn){return}var B=$("<a href='javascript:void(0)'>"+C.label+"</a>"),E=n.text();B.click(function(){D.fn.call(B,{val:E,rowdata:b.data[e-1],alldata:b.data,table:b,rowidx:e,tdidx:h,tr:g,td:n})});u.append(B);if(F!=(v.length-1)){u.append(" | ")}});if(i){u.addClass("h_link-default")}n.html("");n.append(u)}else{if(t){var A=n.text();var z=b.formatColumn(t,x,A);n.text(z);n.attr("title",z)}}}if(r){n.attr("key",n.text());n.attr("title","");var o=Horn.Util.getFunObj(r),q=n.text();if(!o.fn){return}var w=o.fn.call($(this),{val:q,rowdata:b.data[e-1],alldata:b.data,table:b,rowidx:e,tdidx:h,tr:g,td:n});if(w instanceof $){n.html("");n.append(w)}else{n.html(w)}}})})},addRowData:function(a){}});Horn.regUI("div.h_formtable",Horn.Grid);