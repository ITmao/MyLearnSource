Horn.PageBar=Horn.extend(Horn.Base,{COMPONENT_CLASS:"PageBar",targetName:null,target:null,url:null,init:function(a){Horn.PageBar.superclass.init.apply(this,arguments);Horn.apply(this,this.params);this.targetName=this.el.attr("target");this.url=this.el.attr("url");if(!this.url){this.url=window.location.href}this.initPageParams();this.initEvent()},initPageParams:function(){var a="";if(this.el.attr("bindformname")&&this.el.attr("bindformname").length>0){a=this.el.attr("bindformname")}var b=this.el;this.page=parseInt(b.attr("pageNo"))||this.page;this.pageSize=parseInt(b.attr("pageSize"))||this.pageSize;this.pageCount=parseInt(b.attr("pageCount"))||this.pageCount;this.pages=parseInt(b.attr("pages"))||this.pages;this.gridId=b.attr("id")||"dyncGrid";this.bindFormName=b.attr("bindFormName")||"";if(this.pageCount<=0||this.pages<=0){$("#"+a+"_topageid").attr("disabled","disabled");$("#"+a+"_topagesize").attr("disabled","disabled");$("#"+a+"_pagebtn-go").attr("disabled","disabled")}else{$("#"+a+"_topageid").removeAttr("disabled");$("#"+a+"_topagesize").removeAttr("disabled");$("#"+a+"_pagebtn-go").removeAttr("disabled")}},initEvent:function(){var b=this;var a="";if(this.el.attr("bindformname")&&this.el.attr("bindformname").length>0){a=this.el.attr("bindformname")}this.el.children("ul").children("li").children("a").each(function(d,e){var g=$(e),f=function(i,j,h){i.click(function(){if(i.hasClass("disabled")){return}if(i.hasClass("h_pagebtn-next")||i.hasClass("h_pagebtn-prev")){i.addClass("disabled")}j.call(b,h)})};if(!g.hasClass("disabled")){if(g.hasClass("h_pagebtn-index")){f(g,b.goPage,b.INDEX_PAGE)}else{if(g.hasClass("h_pagebtn-end")){f(g,b.goPage,parseInt(b.pages))}else{if(g.hasClass("h_pagebtn-next")){f(g,b.nextpage)}else{if(g.hasClass("h_pagebtn-prev")){f(g,b.prevpage)}else{if(g.hasClass("h_page-num")){f(g,b.goPage,parseInt(g.text()))}else{if(g.hasClass("h_pagebtn-go")){g.bind("click",function(j){var h=document.getElementById(a+"_topageid").value;var i=document.getElementById(a+"_topagesize").value;if(i==0){i=10}var k=[];k.push(parseInt(h),parseInt(i));return b.goPage.apply(b,k)})}}}}}}}});this.perPage=false;$("#_recPerPage"+this.gridId).on("click",function(){optGridId=$(this).attr("id");optGridId=optGridId.substring(11);var d=$(this).children("strong").text();if(b.perPage){$(this).next().hide();b.perPage=false}else{$(this).next().show();$(this).next().find("li").each(function(e,f){var g=$(this).children("a").text();if(d==g){$(this).addClass("active")}else{$(this).removeClass("active")}});b.perPage=true}});$("#_recPerPage"+this.gridId).bind("blur",function(f){var d=f;if(b.perPage){$(".dropdown-menu-datagrid").hide();b.perPage=false;return true}});$(".dropdown-menu-datagrid").bind("mouseover",function(){$("#_recPerPage"+b.gridId).unbind("blur")});$(".dropdown-menu-datagrid").bind("mouseout",function(){$("#_recPerPage"+b.gridId).bind("blur",function(f){var d=f;if(b.perPage){$(".dropdown-menu-datagrid").hide();b.perPage=false;return true}})});this.activeLi=$(".dropdown-menu-datagrid").find("li.active");var c=this;$("#toPage_"+c.id).on("keydown",function(g){var d=g.keyCode;if(d==27||d==8){return true}if(d>=48&&d<=57){return true}if(d>=96&&d<=105){return true}var f=new RegExp("[0123456789]");var h=String.fromCharCode(d);if(!f.test(h)){return false}});$("#"+this.bindFormName+"_topageid").on("blur",function(){var d=$(this).val();if(d==""){d=c.page}if(!d||isNaN(d)){d=c.reqPageNo}d=parseInt(d,10);if(d<=0){d=1}else{if(d>c.pages){d=1}}$(this).val(d);var e=[];e.push(d,c.pageSize);b.goPage.apply(b,e)});$("#"+this.bindFormName+"_topageSize_show").on("blur",function(){var d=$(this).val();var e=$(this).next(":hidden");if(!d||isNaN(d)){d=e.attr("value")}d=parseInt(d,10);if(d<=0){d=1}$(this).val(d);var f=[];f.push(parseInt($("#"+b.bindFormName+"_topageid").val()),d);b.goPage.apply(b,f);$("#"+b.bindFormName+"_topagesize").val(d)})},getTarget:function(){return this.target||Horn.getComp(this.targetName)},INDEX_PAGE:1,page:1,pageSize:20,pageCount:0,pages:1,nextpage:function(){this.goPage(parseInt(this.page)+1)},prevpage:function(){this.goPage(parseInt(this.page)-1)},firstpage:function(){this.goPage(this.INDEX_PAGE)},goPage:function(c,b){var a="";if(this.el.attr("bindformname")&&this.el.attr("bindformname").length>0){a=this.el.attr("bindformname")}if(c<this.INDEX_PAGE){c=this.INDEX_PAGE}if(c>this.pages){c=this.pages}if(b>this.pageCount){b=this.pageCount}if(b<0||b==null||b==undefined){b=this.pageSize}this.page=c;this.pageSize=b;this.doJump()},doJump:function(){if(this.el.attr("bindformname")&&this.el.attr("bindformname").length>0){var a=this.el.attr("bindformname");this.form=Horn.getCurrent().find("form[name='"+a+"']");var c='<input type="hidden" name="index" value="'+this.page+'"><input type="hidden" name="pageNo" value="'+this.page+'"><input type="hidden" name="pageSize" value="'+this.pageSize+'"><input type="hidden" name="count" value="'+this.pageCount+'"><input type="hidden" name="pages" value="'+this.pages+'">';this.form.append(c);this.form.attr("action",this.url);this.form.submit()}else{var b=this.url;function d(e,g){var f=new RegExp("([?|&])"+e+"=[^&]*");if(f.test(b)){b=b.replace(f,"$1"+e+"="+g)}else{b+=(b.indexOf("?")!=-1?"&":"?")+e+"="+g}}d("index",this.page);d("pageNo",this.page);d("pageSize",this.pageSize);d("count",this.pageCount);d("pages",this.pages);Horn.Util.jump(b)}}});Horn.regUI("div.h_pages",Horn.PageBar);