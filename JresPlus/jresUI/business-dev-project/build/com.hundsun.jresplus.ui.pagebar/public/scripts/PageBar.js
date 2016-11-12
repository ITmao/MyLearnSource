/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: PageBar.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：PageBar组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 *  -----------------------------------------------------------------------
 *  2014-01-28    zhangsu    Grid分页支持动态设置每页显示条数
 *  2014-02-10    zhangsu    Grid分页增加分页页数判断
 *  2014-02-13    zhangsu    跳转到第几页做范围限制，只能在当前页码范围内调整
 *  2014-02-13    zhangsu    点击尾页不会跳转到尾页 
 *  2014-02-14    zhangsu    如果总条数为0，将动态设置跳转页和页码input框disabled，跳转按钮disabled
 *  2014-03-12    zhangsu    STORY #7836 grid分页grid的查询条件带不过去
 *  2013-4-10     周智星      BUG #6642 【page_bar】bindFormName设置了不能再页面第一次加载的时候生效，但是事实上第一次加载的时候form内的表单是有值的
 *  2014-4-21     周智星		  BUG #6639 【page_bar】异常测试----pageNo设置为不在页数内的值出现奇特情况
 *  2015-09-30    周智星      需求 #12928 【TS:201509070298-JRESPlus-财富管理事业部-王瑞明-2. 新框架下的 DATAGRID，每页显示 输入 0 条时报错问题
 *  2016-1-27     刘龙          STORY 16308 【TS:201601070241-JRESPlus-财富管理事业部-陈为-10.对于导航栏，希望研发中心给出统一标准的导航工具栏风格，】
 *  2016-2-16     刘龙          15934 需求16308--grid分页栏中，到第几页输入框中输入值，移开焦点未发送请求
 *  2016-3-28     刘龙          需求#18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
 *  -----------------------------------------------------------------------
 */
/**
 * @description PageBar实现
 * @author huzw@hundsun.com
 * @name Horn.PageBar
 * @class Horn.PageBar
 * 分页栏组件，结合grid一起使用
 * @extends Horn.Base
 * @since version 0.1
 * @example
 * 	#page_bar($page)
 *  #page_bar({"pageNo":1,"pageSize":20,"pages":})
 */
/**
 * @lends Horn.PageBar#
 */

/**
 * @description PageBar的唯一标识，必填项。
 * @property id
 * @name Horn.PageBar#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description PageBar的名称。
 * @property name
 * @name Horn.PageBar#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description PageBar页面跳转的地址。默认为当前页面地址，可提供其他页面的分页跳转
 * @property url
 * @name Horn.PageBar#<b>url</b>
 * @type String
 * @default 当前页面地址
 * @example
 * 无
 */

/**
 * @description PageBar 当前页码，一般由分页组件Page提供
 * @property pageNo
 * @name Horn.PageBar#<b>pageNo</b>
 * @type int
 * @default 1
 * @example
 * 无
 */

/**
 * @description PageBar 总页码数，一般由分页组件Page提供
 * @property pages
 * @name Horn.PageBar#<b>pages</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @description PageBar 页面大小，每页显示条目数，一般由分页组件Page提供
 * @property pageSize
 * @name Horn.PageBar#<b>pageSize</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @description PageBar 总条目数，一般由分页组件Page提供
 * @property count
 * @name Horn.PageBar#<b>count</b>
 * @type int
 * @default 
 * @example
 * 无
 */

/**
 * @description PageBar 绑定的查询表单名称,用于分页时将查询条件的参数传入(特别说明！参数传入仅针对点击分页栏里的事件触发时生效，对第一次加载页面无效)<br>
 * 需要注意点：绑定form是$("form").submit()方式提交的，所以java类里的action的method必须去除,例如：<br>
 * "@RequestMapping(value = "/test/grid/testGrid.htm")<br>
 *	public void testGrid(Page page,String key1, ModelMap mm) {<br>
 * }"
 * @property bindFormName
 * @name Horn.PageBar#<b>bindFormName</b>
 * @type String
 * @default 
 * @example
 * #page_bar($page {"bindFormName":"addForm1"})
 */

/**
 * @description PageBar 的显示位置，默认不配置是居中显示，设置值为"left",居左显示，设置值为"right",居右显示,设置为"center",居中显示
 * @property align
 * @name Horn.PageBar#<b>align</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	Horn.PageBar = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"PageBar",
		/**
         * @description 可能会使用的跳转对象名称
		 * @deprecated 暂时未使用
		 * @ignore
		 */
		targetName : null,
		/**
		 *
         * @description 可能会使用的跳转对象
		 * @deprecated 暂时未使用
		 * @ignore
		 */
		target : null,
        /**
         * @description 页面跳转地址
         * @field
         * @name Horn.PageBar#url
         * @default null
         * @ignore
         */
		url : null,
		/**
		 * @ignore
		 */
		init:function(dom){
			Horn.PageBar.superclass.init.apply(this,arguments) ;
			Horn.apply(this,this.params);
			this.targetName = this.el.attr('target');
			this.url = this.el.attr('url');
			if(!this.url) this.url = window.location.href;
			this.initPageParams();   //点击尾页不会跳转到尾页 ,此方法需要放在initEvent之前
			this.initEvent();
			
		},
		/**
		 *
         * @description 从dom对象中获取到所需要的参数
		 * @private
		 * @function
		 */
		initPageParams : function(){
			var formName = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
        		formName = this.el.attr("bindformname") ;
        	}
			var el = this.el;
			this.page = parseInt(el.attr("pageNo")) || this.page; 
			this.pageSize = parseInt(el.attr("pageSize")) || this.pageSize; 
			this.pageCount = parseInt(el.attr("pageCount")) || this.pageCount; 
			this.pages = parseInt(el.attr("pages")) || this.pages;
			this.gridId = el.attr("id") || "dyncGrid";
			this.bindFormName=el.attr("bindFormName") || "";
			if(this.pageCount <=0||this.pages<=0){     //如果总条数为0，将动态设置跳转页和页码input框disabled，跳转按钮disabled	
				$('#'+formName+'_topageid').attr("disabled","disabled"); 
				$('#'+formName+'_topagesize').attr("disabled","disabled"); 
				$('#'+formName+'_pagebtn-go').attr("disabled","disabled");

			}else{
				$('#'+formName+'_topageid').removeAttr("disabled"); 
				$('#'+formName+'_topagesize').removeAttr("disabled"); 
				$('#'+formName+'_pagebtn-go').removeAttr("disabled");
			}
		},
		/**
		 * 为每个按钮绑定点击事件
		 * @private
		 * @function
		 */
		initEvent : function(){
			var _pageBar = this;
			var formName = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
        		formName = this.el.attr("bindformname") ;
        	}
        	this.el.children("ul").children("li").children('a').each(function(idx,it){
				var item = $(it),
					func = function(item,f,arg){
						item.click(function(){
							if(item.hasClass('disabled')){
								return;
							}
							if(item.hasClass('h_pagebtn-next') || item.hasClass('h_pagebtn-prev')){
								item.addClass("disabled");
							}
							f.call(_pageBar,arg);
						});
					};
					
				if(!item.hasClass('disabled')){
					if(item.hasClass('h_pagebtn-index')){
						func(item,_pageBar.goPage,_pageBar.INDEX_PAGE);
					}else if(item.hasClass('h_pagebtn-end')){      //尾页点击
						func(item,_pageBar.goPage,parseInt(_pageBar.pages));
					}else if(item.hasClass('h_pagebtn-next')){
						func(item,_pageBar.nextpage);
					}else if(item.hasClass('h_pagebtn-prev')){
						func (item,_pageBar.prevpage);
					}else if(item.hasClass('h_page-num')){
						func (item,_pageBar.goPage,parseInt(item.text()));
					}else if(item.hasClass('h_pagebtn-go')){       //Grid分页支持动态设置每页显示条数
						
	                    item.bind('click',function(e){
	                    	var _topageid = document.getElementById(formName+"_topageid").value;
							var _topagesize = document.getElementById(formName+"_topagesize").value;
							//需求 #12928 【TS:201509070298-JRESPlus-财富管理事业部-王瑞明-2. 新框架下的 DATAGRID，每页显示 输入 0 条时报错问题
							if(_topagesize==0){
								_topagesize = 10;
							}
							var params = [];
		                    params.push(parseInt(_topageid),parseInt(_topagesize));
	                        return _pageBar.goPage.apply(_pageBar,params);
	                    });
					}
				 }
			});
			//STORY 16308 【TS:201601070241-JRESPlus-财富管理事业部-陈为-10.对于导航栏，希望研发中心给出统一标准的导航工具栏风格，】
				this.perPage = false;
				$("#_recPerPage"+this.gridId).on('click',function(){
					optGridId = $(this).attr("id");
					optGridId =optGridId.substring(11)
					var currPage = $(this).children("strong").text();
					if(_pageBar.perPage){
						$(this).next().hide();
						_pageBar.perPage = false;
					}else{
						$(this).next().show();
						$(this).next().find("li").each(function(idx,a){
							var _page = $(this).children("a").text();
							if(currPage==_page){
								$(this).addClass("active");
							}else{
								$(this).removeClass("active");
							}
						});
						_pageBar.perPage = true;
					}
				});
				
				$("#_recPerPage"+this.gridId).bind('blur',function(e){
					var t = e;
					if(_pageBar.perPage){
						$(".dropdown-menu-datagrid").hide();
						_pageBar.perPage = false;
						return true;
					}
				});
				$(".dropdown-menu-datagrid").bind('mouseover',function(){
					$("#_recPerPage"+_pageBar.gridId).unbind('blur');
				});
				$(".dropdown-menu-datagrid").bind('mouseout',function(){
					$("#_recPerPage"+_pageBar.gridId).bind('blur',function(e){
						var t = e;
						if(_pageBar.perPage){
							$(".dropdown-menu-datagrid").hide();
							_pageBar.perPage = false;
							return true;
						}
					});
				});
				
				this.activeLi = $(".dropdown-menu-datagrid").find('li.active');
				//需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
				/*$(".dropdown-menu-datagrid").find('a').each(function(idx,a){
					var item = $(a); var pageSize = parseInt(item.html(),10);
					item.on('click',function(){
						if(_pageBar.gridId==optGridId){
							$("#pageSize_"+_pageBar.gridId).html(pageSize);
							_pageBar.activeLi.removeClass("active");
							_pageBar.activeLi=item.parent();
							item.parent().addClass("active");
							
							$(".dropdown-menu-datagrid").hide();
							_pageBar.perPage = false;
							
							//_pageBar.grid.reqPage($("#toPage_"+_pageBar.grid.id).val(), pageSize);
							var params = [];
		                    params.push(parseInt($("#"+_pageBar.bindFormName+"_topageid").val()), pageSize);
	                        _pageBar.goPage.apply(_pageBar,params);
	                        $("#"+_pageBar.bindFormName+"_topagesize").val(pageSize);
						}
					});
				});*/
				//注册事件
				var thatgrid = this;
				$("#toPage_"+thatgrid.id).on('keydown',function(e){
					var k = e.keyCode;
					if(k == 27||k == 8)
						return true;
					if(k>=48 && k<=57)
						return true;
					if(k>=96 && k<=105)
						return true;
					
					var reg = new RegExp("[0123456789]");
					var cc = String.fromCharCode(k);
					if(!reg.test(cc)){
						return false;
					}
					
				});
				//15934 需求16308--grid分页栏中，到第几页输入框中输入值，移开焦点未发送请求
				$("#"+this.bindFormName+"_topageid").on('blur',function(){
					var pageNum = $(this).val();
					if(pageNum==""){
						pageNum = thatgrid.page;
					}
					if (!pageNum || isNaN(pageNum)){
						pageNum = thatgrid.reqPageNo;
					}
					pageNum = parseInt(pageNum,10);
					if(pageNum<=0)
						pageNum=1;
					else if(pageNum>thatgrid.pages)	
						pageNum = 1;
					$(this).val(pageNum);
					//thatgrid.reqPage($(this).val(), $("#pageSize_"+thatgrid.id).html());
					var params = [];
                    params.push(pageNum,thatgrid.pageSize);
                    _pageBar.goPage.apply(_pageBar,params);
				});
				//需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
				$("#"+this.bindFormName+"_topageSize_show").on('blur',function(){
					var pageSize = $(this).val();
					var $pageSize_hide=$(this).next(":hidden");
					if (!pageSize || isNaN(pageSize)){
						pageSize = $pageSize_hide.attr("value");
					}
					pageSize = parseInt(pageSize,10);
					if(pageSize<=0)
						pageSize=1;
					$(this).val(pageSize);
                    
                    var params = [];
                    params.push(parseInt($("#"+_pageBar.bindFormName+"_topageid").val()), pageSize);
                    _pageBar.goPage.apply(_pageBar,params);
                    $("#"+_pageBar.bindFormName+"_topagesize").val(pageSize);
				});
		},
		/**
         * @description 从参数中获取到对象
		 * @function
         * @name Horn.PageBar#getTarget
         * @ignore
		 */
		getTarget:function(){
			return this.target || Horn.getComp(this.targetName);
		},
		/**
		 * 首页页码
		 * @property
		 * @ignore
		 */
        INDEX_PAGE:1,
        /**
         * 当前页码
		 * @property
		 * @ignore
         */
		page : 1,
		/**
		 * 页面大小
		 * @property
		 * @ignore
		 */
		pageSize : 20,
		/**
		 * 总条数
		 * @property
		 * @ignore
		 */
		pageCount : 0,
		/**
		 * 总页数
		 * @property
		 * @ignore
		 */
		pages : 1,
		/**
		 * 下一页
		 * @function
		 * @name Horn.PageBar#<b>nextpage</b>
		 */
        nextpage : function() {
            this.goPage(parseInt(this.page) +1 );
        },
        /**
         * 上一页
         * @function
         * @name Horn.PageBar#<b>prevpage</b>
         */
        prevpage : function() {
            this.goPage(parseInt(this.page) -1);
        },
        /**
         * 跳转到首页
         * @function
         * @name Horn.PageBar#<b>firstpage</b>
         */
        firstpage : function() {
            this.goPage(this.INDEX_PAGE);
        },
        /*
        refreshpage : function() {
            this.ajaxRequest();
        },*/
        /**
         * 跳转到页面
         * @param {Number} 跳转到页码
         * @function
         * @ignore
         */
        goPage : function(page,pageSize){
        	var bindformname = "";
        	if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
			    bindformname = this.el.attr("bindformname") ;
        	}
        	if(page < this.INDEX_PAGE ){
        		page = this.INDEX_PAGE;
        	}
        	if(page > this.pages){
        		page = this.pages;
        	}
        	if(pageSize > this.pageCount) {
        		pageSize = this.pageCount;
        	}
        	//$("#"+bindformname+"_topageid").val(page);
        	//$("#pageSize_"+this.gridId).text(pageSize);
        	if(pageSize < 0||pageSize==null||pageSize==undefined) pageSize = this.pageSize;
        	this.page = page;
        	this.pageSize = pageSize;
			this.doJump();
        },
        
        /**
         * 开始跳转
         * @private
         * @ignore
         */
		doJump : function(){
			/*
			 * pageBar如果绑定了form，就以post方式进行提交查询，否则get方式进行查询
			 * BUG #6642 【page_bar】bindFormName设置了不能再页面第一次加载的时候生效，但是事实上第一次加载的时候form内的表单是有值的
			 */
			if(this.el.attr("bindformname") && this.el.attr("bindformname").length > 0){
					
				    var bindformname = this.el.attr("bindformname") ;
		            this.form = Horn.getCurrent().find("form[name='"+bindformname+"']") ;
		            var pageParamStr = '<input type="hidden" name="index" value="'+this.page+'"><input type="hidden" name="pageNo" value="'+this.page+'"><input type="hidden" name="pageSize" value="'+this.pageSize+'"><input type="hidden" name="count" value="'+this.pageCount+'"><input type="hidden" name="pages" value="'+this.pages+'">';
		            this.form.append(pageParamStr);
		            this.form.attr("action",this.url);
		            this.form.submit();
		            
		            //绑定的form表单的参数
					/*var formData = {};
					formData = Horn.Util.getValues(this.form) ;
		            for(var key in formData){
		            	if(key != "sourceurl")
						  addParam(key,formData[key]);
					}*/
		            
		    }else{
		    	var url = this.url;
				function addParam(name,val){
					var reg = new RegExp("([?|&])"+name+"=[^&]*");
					if(reg.test(url)){
						url=url.replace(reg,'$'+'1'+name+'='+val);
					}else{
						url += (url.indexOf('?') != -1 ? '&' : '?') + name+'='+val;
					}
				}
				addParam("index",this.page);
				addParam("pageNo",this.page);
				addParam("pageSize",this.pageSize);
				addParam("count",this.pageCount);
				addParam("pages",this.pages);
		    	Horn.Util.jump(url);
		    }
		}
	});
	Horn.regUI("div.h_pages",Horn.PageBar) ;
