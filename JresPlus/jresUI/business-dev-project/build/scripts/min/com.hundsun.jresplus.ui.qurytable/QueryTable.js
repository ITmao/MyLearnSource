Horn.QueryTable=Horn.extend(Horn.Base,{COMPONENT_CLASS:"QueryTable",table:null,form:null,dicName:null,delimiter:",",ths:[],simpleRequest:false,postData:null,rowSelect:false,keyAttr:"label",valueAttr:"value",clickFlag:null,mutiSelect:false,init:function(e){Horn.QueryTable.superclass.init.apply(this,arguments);this.table=$(e);var a=this.params.baseparams||{};var b=this.params.bindformname;if(!b){b=this.params.bindFormName}this.rowSelect=Boolean(this.params.rowSelect);var d={},c={request_num:10,index:this.INDEX_PAGE,positionArr:[],start_position_str:0,returndata:null,url:"",position_str:"position_str",hasPage:false,baseparams:a,params:{},autoLoad:false,requestMethod:"post"};if(b){this.form=Horn.getCurrent().find("form[name='"+b+"']");d=Horn.Util.getValues(this.form)}c.request_num=d.request_num||this.params.request_num||c.request_num;c.request_num=parseInt(c.request_num)>0?parseInt(c.request_num):10;c.autoLoad=Boolean(this.params.autoLoad);c.url=this.params.url;if(this.params.requestMethod&&(this.params.requestMethod.toLowerCase()=="post"||this.params.requestMethod.toLowerCase()=="get")){c.requestMethod=this.params.requestMethod}if(!c.url&&this.form&&this.form.length){c.url=this.form.attr("action")}if(c.url&&c.url.indexOf("http:")==-1){c.url=context_path+c.url}c.start_position_str=d.position_str||this.params.start_position_str||c.start_position_str;if(this.params.position_str){c.position_str=this.params.position_str}c.hasPage=Boolean(this.params.hasPage!=undefined||this.params.hasPage!=null?this.params.hasPage:c.hasPage);c.positionArr.push(c.start_position_str);this.postData=c;var f=this;this.ths=this.el.find("th");if(this.params.simpleRequest==true){this.simpleRequest=true}if(c.url&&c.autoLoad==true){f.loadByForm.call(f)}$.each(this.params.events||[],function(g,h){f[h.event.toLowerCase()]=h["function"]});if(this.params.selectModel=="muti"||this.params.selectModel=="multi"){this.mutiSelect=true}this.ths.each(function(k,h){var i=h.attributes.hidden;h=$(h);var l=h.attr("dictName"),m=h.attr("colno"),g=undefined;var j=undefined,n=undefined;if(m){j=f.params.items[m-1].items;n=f.params.items[m-1].buttons}if(i!=null&&i!=undefined&&i.value==true.toString()){h.hide()}if(l){g={};var o=$(".hc_checkboxdiv[ref_target="+l+"_s]").find("li");o.each(function(q,p){p=$(p);var r=p.attr("title");var s=p.attr("key");g[s]=r})}else{if(j){g={};$(j).each(function(p,q){g[q[f.keyAttr]]=q[f.valueAttr]})}}h.data("staticDict",g);h.data("buttons",n)});this.selecteds=[];if(this.params.data){this.dictTrans();this.initEvents();this.hiddenColumns();this.lastList=this.params.data;this.doDataFilter(this.params.data)}this.el.find(".h_querytable_select_all").change(function(){if(this.checked){f.selectAll()}else{f.unSelectAll()}});if(this.params.isDragColumn){if(this.params.name&&this.params.name!=""){$("."+this.params.name).resizableColumns({})}}},customEvents:"rowclick,rowdblclick",getEventTarget:function(){return this.el},stateTest:function(){var b=this;var a=true;b.el.find("input:checkbox.h_querytable_select").each(function(c,d){if(!$(d).prop("checked")){a=false}});if(a){b.el.find(".h_querytable_select_all").prop("checked",true)}else{b.el.find(".h_querytable_select_all").prop("checked",false)}},initEvents:function(){var a=this.el;var c=a.children("tbody");var d=this;var b=d.el.find(".h_querytable_select_all").length>0?true:false;if(b){this.el.find(".h_querytable_select").change(function(){d.stateTest()})}if(this.rowSelect==true){c.children("tr").each(function(f,j){var k=f;var e=$(j),h=d.mutiSelect?e.find("input:checkbox.h_querytable_select"):e.find("input:radio.h_querytable_select");var g=this.clickFlag;e.bind("click",function(i){clearTimeout(g);g=setTimeout(function(){if($.isEmptyObject(d.selecteds)){d.selectRow(k,e)}else{if(!d.selecteds.hasOwnProperty(k)){d.selectRow(k,e)}else{d.unSelectRow(k,e)}}if(b){d.stateTest()}},10)})})}},hiddenColumns:function(){var a=this.el.children("tbody").children("tr");var b=this.ths;b.each(function(f,e){var c=$(e);var d=e.attributes.hidden;if(d!=null&&d!=undefined&&d.value==true.toString()){c.hide();a.each(function(i,h){var k=$(h);var j=k.find("td");for(var g=0;g<j.length;g++){var l=$(j[g]);if(f==g){l.hide();break}}})}})},loadByForm:function(){var a={};if(this.form&&this.form.length){a=this.form.serializeArray()}this.load(a)},setBaseParams:function(a){if(a){this.postData.baseparams=a}else{this.postData.baseparams={}}},load:function(b){var a=this.postData;if(b){if($.type(b)=="array"){a.params=Horn.Util.arr2Obj(b)}else{a.params=b}}else{a.params={}}this.goPage(this.INDEX_PAGE)},INDEX_PAGE:1,nextpage:function(){this.goPage(this.postData.index+1)},prevpage:function(){this.goPage(this.postData.index-1)},firstpage:function(){this.goPage(this.INDEX_PAGE)},refreshpage:function(){this.ajaxRequest()},goPage:function(a){if(a<this.INDEX_PAGE){a=this.INDEX_PAGE}this.postData.index=a;this.ajaxRequest(this.el)},ajaxRequest:function(){var h=this,j=this.el,d=this.postData,c=d.positionArr,e=j.children("tbody"),a=d.params;a=$.extend({},d.baseparams,a);a.hasPage=d.hasPage;if(a!=null){a.position_str=c[d.index]||d.start_position_str;a.request_num=d.request_num+(this.simpleRequest?0:1)}a.index=d.index;var i=this.ths.length;if(a.hasPage==false){}var b=this.params.bindformname;if(!b){b=this.params.bindFormName}if(b){var g=$("form[name="+b+"]").serializeArray();var f=Horn.Util.arr2Obj(g);$.each(f,function(k,l){a[k]=l})}$.ajax(d.url,{async:true,beforeSend:function(k){e.html("<tr><td colSpan='"+i+"'><p class='h_loading'>正在加载</p></td></tr>")},type:d.requestMethod,data:Horn.Util.obj2Arr(a),dataType:"json",error:function(m,n,l){var k=m.status;e.html("<tr><td colSpan='"+i+"'><p>请求失败</p><p>错误状态："+k+"；错误信息："+n+"</p></td></tr>")},success:function(k,m,l){h.callback.call(h,h.doDataFilter(k));h.doCallBack(k);h.lastSelect=null;h.selecteds={}}})},doDataFilter:function(a){var b=this.table;var d=this.params.datafilter;if(d){var c=Horn.Util.getFunObj(d);if(c&&$.type(c.fn)=="function"){a=c.fn.call(this,a)}}return a},doCallBack:function(a){var c=this.table;var d=c.attr("callback");if(d){var b=Horn.Util.getFunObj(d);if(b&&$.type(b.fn)=="function"){b.fn.call(this,a)}}$(".h_screen").height("auto");setTimeout(function(){if(window.doLayout){window.doLayout()}},1000);this.dictTrans()},callback:function(reqData){reqData=reqData||{total:0,rows:[]};if($.type(reqData)=="array"){reqData={rows:reqData}}var list=reqData.rows;var table=this.table;var gridName=table.attr("name");var _this=this;var htmlArr=[];var ths=this.ths;var colLength=ths.length;var isSuccess=false;var data=this.postData;this.lastList=list;this.selecteds=[];this.lastSelect={};this.el.find(".h_querytable_select_all").prop("checked",false);table.css("height","auto");if(list&&list.length>0){data.list=list.slice(0,data.request_num);isSuccess=true;for(var i=0;i<list.length;i++){var itemData=list[i];htmlArr.push("<tr>");ths.each(function(index,o){var th=$(o);if(th.hasClass("h_numbercolumn")){htmlArr.push("<td>"+(i+1)+"</td>");return}else{if(th.hasClass("h_querytable_checkboxcolumn")){htmlArr.push('<td><input type="checkbox" class="h_querytable_select"/></td>');return}else{if(th.hasClass("h_querytable_radioboxcolumn")){htmlArr.push('<td><input type="radio" class="h_querytable_select" name="_querytable_row_checker_'+gridName+'"/></td>');return}}}var name=th.attr("name");var dealFun=th.attr("dealFun");htmlArr.push("<td><div style='overflow: visible;white-space: normal;word-wrap:break-word; word-break:break-all'>");if(dealFun){var dFun=eval("(window."+dealFun+")");if($.type(dFun)=="function"){htmlArr.push(dFun(itemData[name],itemData,list,i,index))}}else{var value=itemData[name];var dataType=th.attr("dataType");var format=th.attr("format");if(dataType&&dataType!=null){value=Horn.Util.Format.all(dataType,format,value)}htmlArr.push(value)}htmlArr.push("</div></td>")});htmlArr.push("</tr>");if(i==data.request_num-1){data.positionArr[data.index+1]=itemData[data.position_str];break}}}else{if(reqData.errorInfo||reqData.err_info){data.list=[];var errorInfo=reqData.errorInfo||reqData.err_info;htmlArr.push("<tr><td colspan='"+colLength+"'>");htmlArr.push("<p>"+errorInfo+"</p>");htmlArr.push("</td></tr>")}else{data.list=[];htmlArr.push("<tr><td colspan='"+colLength+"'>");htmlArr.push("<p>没有查询到数据</p>");htmlArr.push("</td></tr>")}}var tbody=table.children("tbody");tbody.html(htmlArr.join(""));var h_listtable=table.parent(".h_listtable");var h_head=table.parent(".h_listtable").parent(".g-datagrid-wrap").children(".u-datagrid-header");var h_page=table.parent(".h_listtable").parent(".g-datagrid-wrap").children(".u-datagrid-page");var h_body=table.parent(".h_listtable").parent(".g-datagrid-wrap").parent(".m-panel-body");if(this.params.height&&this.params.height!=null){var tableHeight=parseFloat(this.params.height);if(!isNaN(tableHeight)){h_listtable.css("height",tableHeight)}}if(this.params.width&&this.params.width!=null){var tableWidth=parseFloat(this.params.width);if(!isNaN(tableWidth)){h_listtable.css("width",tableWidth);h_head.css("width",tableWidth);h_page.css("width",tableWidth);h_body.css("width",tableWidth+22)}}if(isSuccess){tbody.children("tr:odd").addClass("u-table-bg");var rowClickObj=undefined;var rowDBLClickObj=undefined;var rowClickFn=undefined;var rowDBLClickFn=undefined;if(this.rowclick){rowClickObj=Horn.Util.getFunObj(this.rowclick);if($.type(rowClickObj.fn)=="function"){rowClickFn=rowClickObj.fn}}if(this.rowdblclick){rowDBLClickObj=Horn.Util.getFunObj(this.rowdblclick);if($.type(rowDBLClickObj.fn)=="function"){rowDBLClickFn=rowDBLClickObj.fn}}if(rowClickFn||rowDBLClickFn){var trs=tbody.children("tr");var _clickFlag=this.clickFlag;for(var i=0;i<data.list.length;i++){var tr=$(trs.get(i));if(rowClickFn){var params=rowClickObj.params.slice(0);params.push(data.list[i],data.list);tr.bind("click",params,function(e){var p=e.data;var _this=this;clearTimeout(_clickFlag);_clickFlag=setTimeout(function(){return rowClickObj.fn.apply(_this,p)},300)})}if(rowDBLClickFn){var params=rowDBLClickObj.params.slice(0);params.push(data.list[i],data.list);tr.bind("dblclick",params,function(e){clearTimeout(_clickFlag);var p=e.data;return rowDBLClickObj.fn.apply(this,p)})}}}this.initEvents();this.hiddenColumns()}if(data.hasPage){var pageArr=[];pageArr.push('<ul class="m-pagebar">');if(data.index>_this.INDEX_PAGE){pageArr.push('<li><a href="javascript:void(0)"  class="h_page-first first_page_btn" title="首页"><i class="fa fa-step-backward"></i></a></li>');pageArr.push('<li><a href="javascript:void(0)" class="h_pagebtn-prev h_page-pgLast pre_page_btn" title="上一页"><i class="fa fa-caret-left"></i></a></li>')}else{pageArr.push('<li><a href="javascript:void(0)"  class="disabled first_page_btn" title="首页"><i class="fa fa-step-backward"></i></a></li>');pageArr.push('<li><a href="javascript:void(0)" class="disabled pre_page_btn" title="上一页"><i class="fa fa-caret-left"></i></a></li>')}if(this.simpleRequest){if(list!=null&&(list.length+1)>data.request_num){pageArr.push('<li><a href="javascript:void(0)" class="h_page-pgNext next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>')}else{pageArr.push('<li><a href="javascript:void(0)" class="disabled next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>')}}else{if(list!=null&&list.length>data.request_num){pageArr.push('<li><a href="javascript:void(0)" class="h_page-pgNext next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>')}else{pageArr.push('<li><a href="javascript:void(0)" class="disabled next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>')}}pageArr.push('<li><a href="javascript:void(0)" class="h_page-refresh refresh_btn" title="刷新"><i class="fa fa-refresh"></i></a></li>');pageArr.push("</ul>");var total_num=reqData.total;var pageIndex=this.postData.index;if(total_num!=undefined){var pagesnum=Math.ceil(parseInt(total_num)/parseInt(data.request_num));pageArr.push('<div  class="m-pagebar-all">共'+pagesnum+"页,共"+total_num+"条记录,当前第"+pageIndex+"页</div>")}var page=table.parent(".h_listtable").next("div.u-datagrid-page").children(".h_querytable_pages").html(pageArr.join(""));page.children("ul").children("li").children("a.h_page-first").click(function(e){return _this.firstpage.call(_this,table,e)});page.children("ul").children("li").children("a.h_page-pgLast").click(function(e){return _this.prevpage.call(_this,table,e)});page.children("ul").children("li").children("a.h_page-pgNext").click(function(e){return _this.nextpage.call(_this,table,e)});page.children("ul").children("li").children("a.h_page-refresh").click(function(e){return _this.refreshpage.call(_this,table,e)})}this.resetTdContent()},loadData:function(a){this.callback(a);this.doCallBack(a)},resetTdContent:function(){var d=this;var a=this.table.children("tbody").children("tr");var b=this.table.children("thead").children("tr");var c=[];a.each(function(o,i){var k=$(i);var g=k.find("td");for(var j=0;j<g.length;j++){var f=$(g[j]);var h=f.attr("width");var n=f.children("div");var m=f.text();var l=b.find("th:eq("+j+")").attr("width");if(l){var e=l.replace("px","").replace("PX","");n.css("width",e)}if(d.getStrlen(m)>40){if(c.indexOf(j)==-1){c.push(j)}n.css("width",300);f.css("width",300)}}})},getStrlen:function(e){var b=2;var a=0;for(var d=0;d<e.length;d++){var f=e.charCodeAt(d);if((f>=1&&f<=126)||(65376<=f&&f<=65439)){a++}else{a+=b}}return a},onRowSelect:function(){},selecteds:null,selectAll:function(){var a=this;this.el.find("input:checkbox.h_querytable_select").each(function(b,c){c.checked=true;if(a.rowSelect==false){$(c).trigger("change")}else{a.selectRow(b)}});this.el.find(".h_querytable_select_all").prop("checked",true)},unSelectAll:function(){var a=this;this.el.find("input:checkbox.h_querytable_select").each(function(b,c){c.checked=false;if(a.rowSelect==false){$(c).trigger("change")}else{a.unSelectRow(b)}});this.el.find(".h_querytable_select_all").prop("checked",false)},lastSelect:null,mutiSelect:false,selectRow:function(h,b){var a=this;var g=b;if(!g){g=$(this.el.find("tr").has("td").get(h))}if(g.length==0){Horn.debug("querytable["+this.name+"]","选择的行"+h+"不存在");return false}var f={};var c=this.ths;var d=g.find("td");c.each(function(l,i){var k=d.get(l),j=$(i);f[j.attr("name")]=j.attr("dictName")?$(k).attr("key"):$(k).text()});a.onRowSelect.call(g,g,h,f);this.selecteds[h]=f;if(!a.mutiSelect){var e=a.lastSelect;if(e&&e.rowidx!==undefined&&e.rowidx!=h){if(e.tr.find("input:radio").length>0){e.tr.find("input:radio").get(0).checked=false}a.unSelectRow(e.rowidx,e.tr)}if(g.find("input:radio").length>0){g.find("input:radio").get(0).checked=true}}else{if(g.find("input:checkbox").length>0){g.find("input:checkbox").get(0).checked=true}}a.lastSelect={rowidx:h,tr:g};g.addClass("u-table-selected")},unSelectRow:function(e,b){var d=b;if(!d){d=$(this.el.find("tr").has("td").get(e))}this.selecteds[e]=null;delete this.selecteds[e];d.removeClass("u-table-selected");if(this.mutiSelect){if(d.find("input:checkbox").length>0){d.find("input:checkbox").get(0).checked=false}}else{if(d.find("input:radio").length>0){d.find("input:radio").get(0).checked=false}}var c=true;for(var a in this.selecteds){c=false;break}if(c){this.el.find(".h_querytable_select_all").prop("checked",false)}},getSelecteds:function(d){var c=[];if($.type(this.selecteds)=="array"){for(var b=0;b<this.selecteds.length;b++){var e=this.selecteds[b];if(e){c.push(d?this.lastList[b]:e)}}}else{for(var a in this.selecteds){var e=this.selecteds[a];if(e){c.push(d?this.lastList[a]:e)}}}return c},dictTrans:function(){var b=this,c=this.ths,a=this.el.find("tr");a.each(function(e,d){var g=$(d),f=b.mutiSelect?g.find("input:checkbox"):g.find("input:radio");if(f.hasClass("h_querytable_select")){if(b.rowSelect==false){f.change(function(){if(this.checked){b.selectRow(e-1,g)}else{b.unSelectRow(e-1,g)}})}}g.find("td").each(function(p,j){var k=$(j);var i=$(c.get(p));var n=i.attr("dictname"),o=i.attr("renderer"),q=i.data("buttons"),h=i.data("staticDict");if(h){if(t==""||h[k.text().trim()]==undefined){k.text("");k.attr("title","")}else{k.attr("key",k.text());k.text(h[k.text()]||k.text())}}else{if(q){var m=q;var s=$("<span></span>");$(m).each(function(y,v){var w=Horn.Util.getFunObj(v.event);if(!w.fn){return}var u=$("<a href='javascript:void(0)'>"+v.label+"</a>");var x=k.text();u.click(function(){w.fn.call(u,{val:x,rowidx:e,tdidx:p,tr:g,td:k})});s.append(u);if(y!=(m.length-1)){s.append(" | ")}});k.html("");k.append(s)}}if(o){k.attr("key",k.text());var t=k.text();var r=Horn.Util.getFunObj(o);if(!r.fn){return}var l=r.fn.call($(this),{val:t,rowidx:e,tdidx:p,tr:g,td:k});if(l instanceof $){k.html("");k.append(l)}else{k.html(l)}}})})}});$.extend(Horn.QueryTable,{DATANAME:"QUERYTABLE",get:function(a){var b=null;if(a){b=Horn.getComp(a)}else{b=Horn.data(Horn.QueryTable.DATANAME)[0]}return b}});Horn.regUI("table.h_querytable",Horn.QueryTable);