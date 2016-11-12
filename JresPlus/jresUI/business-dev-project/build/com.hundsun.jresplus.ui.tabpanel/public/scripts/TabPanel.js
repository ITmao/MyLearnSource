/**
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * 2014-12-25     zhangsu        BUG #8454 tabpanel在通过addtab方法增加页签时，如果设置了width,能用省略号显示，tip移上去显示全部
 * 2014-12-25     zhangsu        BUG #8414 谷歌浏览器下，tabpanel页签展现方向为纵向是，title的高宽没有计算在
 * 2015-03-13     zhangsu        STORY #11042 [财富管理事业部-陈为][TS:201503130069]-JRESPlus--tabpanel页面初始化的时候 加载静态tab页签会初始化两次页签
 * 2015-09-29     周智星          STORY #13326 window中若是放入tabpanel，tab默认打开页无法显示
 */
/**
 * @name Horn.TabPanel
 * @class  Horn.TabPanel
 * 多标签页组件</br>
 * 适用于分组或分类信息的容器，将内容按照分组或分类方式放到不同的标签页区域中，当前可视的仅有一个，其他的页签内容
 * 可以通过点击对应的页签激活展示
 */
/** @lends Horn.TabPanel# */
	 
	 
/**
 * 组件的唯一标示<br/>
 * 此属性支持面板组件(<b>tab_panel</b>,<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>id</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 组件的名称(不能为空，不能重复)<br/>
 * 此属性支持面板组件(<b>tab_panel</b>,<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>name</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	 
/**
 * 页签的标题(可选项)<br/>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>title</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 页签的页面地址(注意！url仅支持velocity的页面（.htm）,不支持外部地址(如：htttp://www.baidu.com))<br/>
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>url</b>
 * @type String
 * @default 
 * @ignore
 * @example
 * 无
 */	
 /**
 * 页签内容使用延迟加载lazy用于配置延迟加载的url<br/>
 * url只能是系统内的视图请求
 * 此属性支持面板组件(<b>tab_panel_content</b>)
 * @name Horn.TabPanel#<b>lazy</b>
 * @type String
 * @default 
 * @example
 * #@tab_panel_content({"title":"延迟加载的标签","name":"tab1","lazy":"${appServer}/demo/tabpanel/lazy.htm"})
 * #end
 */

 /**
 * 页签标题宽度(可选项，宽度仅支持像素，如："width":"100"),如果设置了宽度，就获取其值，否则默认<br/>
 *注意：当在纵向tab页中配置或者设置width不会生效！
 * <font color=red>注意点说明：(宏(@tab_panel)和API(addTab(...))都配置width的情况下,优先获取API的值)</font><br>
 * 此属性支持面板组件(<b>tab_panel</b>)
 * @name Horn.TabPanel#<b>width</b>
 * @type String
 * @default 
 * @example
 *  #@screen()
 *   	#@tab_panel({"name":"tp","width":"150"})
 *   		#@tab_panel_content({"name":"content2","title":"页签2"})  
                #@panel({})
        			#textfield({"label":"文本框", "name":"key1","value":"","defValue":""})
        			#textfield({"label":"文本框", "name":"key1","value":"","defValue":"","readonly":"true"})
            		#label({"label":"label","name":"key5","value":"标签内容","defValue":""})
        			#textfield({"label":"文本框", "name":"key1","value":"","defValue":"","cols":"2"})
            	#end
    		#end
 *   	#end
 *  #end
 *	
 */

 /**
 * 最大页签个数(可选项，如："maxTabCn":5),如果设置了maxTabCn，就获取其值，默认值为30<br/>
 * <font color=red>注意点说明：(宏(@tab_panel)和API(addTab(...))都配置maxTabCn的情况下,优先获取API的值。一个页面标签页过多会影响性能，请合理设置maxTabCn的值)</font><br>
 * @name Horn.TabPanel#<b>maxTabCn</b>
 * @type int
 * @default 
 * @example
 * #@screen()
 *   #@panel({})
 *   	#textfield({"label":"请输入tab的名称:","name":"tabName"})
 *		#textfield({"label":"请输入tab的标题:","name":"tabTitle"})
 *   #end
 *   #button_panel_ex({"buttons":[{"label":"新增tab页","name":"btnSetTitle","event":"addTab()"}]})
 *   #@tab_panel({"name":"tp","maxTabCn":5}) ##优先获取API配置的maxTabCn的值
 *   #end
 *#end
 *#jscode()
 *	function addTab(){
 *		Horn.getComp("tp").addTab({"name":tabName,"title":Horn.getComp("tabTitle").getValue(),"maxTabCn":5,"url":"$appServer.get('/test/textfield/status_change.htm')"});
 *	}
 *#end
 * 
 */
/**
 * tabpanel页签展现方向调整,默认呈水平排列，提供纵向的左侧和右侧排列,属性值分别为：left、right(注！此属性不支持在window组件里使用)<br/>
 * @name Horn.TabPanel#<b>position</b>
 * @type String
 * @default top  tab页签呈水平排列
 * @example
 * 无
 */
/**
 * tabpanel页签的外观主题,默认是灰色主题，另外提供一套蓝色主题,属性值为blue<br/>
 * @name Horn.TabPanel#<b>themes</b>
 * @type String
 * @default gray : tab页签呈灰色 
 * @example 
 * @ignore
 * 无
 */

/**
 * @ignore
 * 提供浮动支持。若高度未设置，且设置tabFloat:true时，tabs页签部分会随窗口浮动，默认不浮动<br/>
 * @name Horn.TabPanel#<b>tabFloat</b>
 * @type boolean
 * @default 
 * @example 
 * 无
 */

/**
 * 
 * 提供高度支持。仅支持像素<br/>
 * 当高度未设置时，tab页签区域将自动扩充<br/>当高度设置固定值时，tab页签区域为设置高度<br/>
 * @name Horn.TabPanel#<b>height</b>
 * @type String
 * @default 
 * @example 
 * 无
 */
/**
 * 
 * 切换页签时是否自动校验<br/>
 * @name Horn.TabPanel#<b>isFormValidate</b>
 * @type boolean
 * @default false
 * @example 
 * 无
 */
var isFirstClick = true;
var firstTab = null;
;(function(H){
	Horn.TabPanel = Horn.extend(Horn.Base, {
		maxTabCn: 30,//最大允许页签数
		tabWidth: 121,//设置宽度后页签标题过长时会自动隐藏，默认不设置
		minTabHeight: undefined,//最小高度
		init: function(){
			Horn.TabPanel.superclass.init.apply(this,arguments);
			
			var _this = this;
			this.maxTabCn = this.params.maxTabCn ? this.params.maxTabCn : this.maxTabCn;//最大页签数
			
			var tabWidth = (this.params.width || this.tabWidth || "") + "";//页签宽度
			this.tabWidth = tabWidth.match(/[px|%]+$/) ? tabWidth : tabWidth + "px";
			
			//切换页签时是否自动校验
			this.isFormValidate = this.params["isFormValidate"] === "false" ? false : !!this.params["isFormValidate"];
			
			/**
			 * <tabPanel>
			 *     <tabsDiv>
			 *         <leftScroller></leftScroller>
			 *         <rightScroller></rightScroller>
			 *         <tabWrap>
			 *             <tabWrapUl>
			 *                 <li></li>
			 *                 ...
			 *             </tabWrapUl>
			 *         </tabWrap>
			 *     </tabsDiv>
			 *     <contentsDiv>
			 *         <tabContent></tabContent>
			 *         ...
			 *     </contentsDiv>
			 * </tabPanel>
			 * 
			 * */
			var tabPanel = this.el;
			this.tabsDiv = tabPanel.children("div.h_tabpanel-tabs");
			this.contentsDiv = tabPanel.children("div.h_tabpanel-contents");
			this.tabWrap = this.tabsDiv.children("div.h_tabpanel-wrap");
			this.tabWrapUl = this.tabWrap.children("ul");
			this.leftScroller = this.tabsDiv.children(".h_tabscroller-left");
			this.rightScroller = this.tabsDiv.children(".h_tabscroller-right");
			this.topScroller = this.tabsDiv.children(".h_tabscroller-top");
			this.bottomScroller = this.tabsDiv.children(".h_tabscroller-bottom");
			
			var tempTabsUl = tabPanel.children("ul");//宏生成的临时页签
			
			//超出最大允许页签数时移除多余页签（但是不阻止组件的初始化）
			if (tempTabsUl.size() > this.maxTabCn) {
				tempTabsUl.splice(this.maxTabCn);
				Horn.Msg.alert("提示", "最多只能添加" + this.maxTabCn + "个页签！");
			}
			
			if(this.params.height&&this.params.height!=""){
				this.contentsDiv.css("height",this.params.height);
				this.contentsDiv.css("overflow","auto");
			}
			if(this.params.width&&this.params.width!=""){
				this.topScroller.css("width",this.params.width);
				this.bottomScroller.css("width",this.params.width);
			}
			//组织html
			tempTabsUl.children("li[ref]").appendTo(this.tabWrapUl).each(function(i, o){
				var tab = $(o);
				var ref = tab.attr("ref");
				var content = $("[ref_target=" + ref + "]", tabPanel);
				//若要使用BigPipe，必须提供ID
				
				var contentId = content.attr("id");
				if (!contentId) {
					contentId = Horn.id("tab-panel-content-");
					content.attr("id", contentId);
				}
					//content.appendTo(_this.contentsDiv);
				_this.contentsDiv.get(0).appendChild(content.get(0));
					//_this.contentsDiv.append(content);
					//var liWidth = _this.tabWrapUl.children("li:eq(0)").width();
					//_this.tabWrapUl.children("li").width(liWidth);
					//_this.tabWrapUl.width("auto").width(_this.tabWrapUl.width() - 1);
					//content.css("margin-" + _this.params.position, _this.tabsDiv.outerWidth());
				tab.bind("click", function(){
					//需求 #13326 window中若是放入tabpanel，tab默认打开页无法显示
					if(!isFirstClick){
						if($(this).data("content")!=firstTab.data("content")){
							_this.activate(firstTab);
							//firstTab.data("content").hide();
						}
					}
					_this.activate($(this));
				}).data({
					content: content
				}).css("width", _this.tabWidth);
				if (_this.tabWidth) {
					var icon = tab.children(".h_tab-icon");
					var title = tab.children(".h_tab-title");
					title.css({
						width: parseInt(_this.tabWidth) - icon.outerWidth()
					});
				}
				
			});
			
			tempTabsUl.remove();
			
			this.tabChange = function(){};
			if(this.params.tabChange){
				var tabChangeObj = Horn.Util.getFunObj(this.params.tabChange);
				if($.type(tabChangeObj.fn) == "function"){
	                this.tabChange = tabChangeObj.fn ;
	            }
			}
			
			//绑定左右按钮事件
			initScrollerEvents.call(this);
			
			//初始化页签位置：上、左、右
			initTabPosition.call(this, this.params.position);
			
			//第一个页签
			firstTab = this.tabWrapUl.children("li:eq(0)");
			
			calculateScrollLength.call(this);
			
			//默认选中第一页
			firstTab.addClass("h_cur").click();
			//需求 #13326 window中若是放入tabpanel，tab默认打开页无法显示
			isFirstClick = false;
			firstTab.data("content").show();
			
			$(window).bind("resizes", function(){
				//可能情况：最初滚动按钮未显示->页签内容高度改变导致滚动条出现(如combox下拉)->触发resize事件->此时滚动按钮应显示却未显示->导致moveCenter未执行
				//所以触发resize时先进行一次定位
				locateScroller.call(_this.tabWrap);
				//当窗口大小改变导致已激活页签被遮盖时使其滚动至中间位置
				moveToCenter.call(_this, _this.getCurrentTab());
			});
			//计算左右或上下按钮的位置
			locateScroller.call(this.tabWrap);
		},
		/**
		 * 获取当前激活的tab
		 * @name Horn.TabPanel#getCurrentTab
	     * @function
		 * @param
		 * @return {激活的tab页签}
		 */
		getCurrentTab: function() {
			if(!this.currentTabName){
				var _this = this;
				this.tabWrapUl.children("li").each(function(i, o){
					var curTab = $(this).attr("class");
					if(curTab.indexOf("h_cur")>-1){
						_this.currentTabName = $(this).attr("ref");
					}
				});
				
			}
			return this.getTab(this.currentTabName);
		},
		/**
		 * 获取tab
		 * @name Horn.TabPanel#getTab
	     * @function
		 * @param {String} name tab页对应的name
		 * @return {对应的tab页签}
		 */
		getTab: function(o) {
			if ($.type(o) != "object") {
				return this.tabWrapUl.children("li[ref='" + o + "']");
			}
			return o && o.length ? o : $(o);
		},
		/**
		 * 动态添加tab
		 * 
		 * @name Horn.TabPanel#addTab
		 * @function
		 * @param {json} params 
		 * @example
		 * Horn.getComp("tp").addTab({"name":tabName,"title":tabTitle,"url":"$appServer.get('/test/textfield/status_change.htm')"})           
		 * @return {string} name tab页对应的name
		 */
		addTab : function(params) {
			if (!params.url) {
				Horn.Msg.alert("提示", "页签url必填，请检查！");
				return;
			}
			
			var _this = this;

			var maxTabCn = params.maxTabCn ? params.maxTabCn : this.maxTabCn;
			var tabWidth = params.width ? params.width : this.tabWidth || "auto";

			// 如果这个页签已存在，则仅激活它
			if (params.name && this.getTab(params.name).length) {
				this.activate(params.name);
				return;
			}

			if (this.tabWrapUl.children("li").length >= maxTabCn) {
				Horn.Msg.alert("提示", "最多只能添加" + maxTabCn + "个页签");
				return;
			}

			var tabPanel = this.el;
			var tabWrapUl = this.tabWrapUl;

			var ref = params.name || ("h_tab-uldiv-" + new Date().getTime());
			var refID = Horn.id("tab-uldiv-");

			if (!params.title) {
				params.title = "未命名页签";
			}
			var newTab = createTab(ref, params.title, tabWidth).appendTo(tabWrapUl);
			var newContent = createContent(ref, refID).appendTo(this.contentsDiv);
			newTab.data("content", newContent).click(function(){
				_this.activate($(this));
			});
			//tabpanel在通过addtab方法增加页签时，如果设置了width,能用省略号显示，tip移上去显示全部
			if (this.tabWidth) {
				var icon = newTab.children(".h_tab-icon");
				var title = newTab.children(".h_tab-title");
				title.css({
					width: parseInt(_this.tabWidth) - icon.outerWidth()
				});
			}
			//纵向 需要重新计算 width 和 margin,BUG #8414 谷歌浏览器下，tabpanel页签展现方向为纵向是，title的高宽没有计算在
			this.position =  this.params.position || "top";
			this.isVertical = this.position == "left" || this.position == "right";
			this.tabWrap.data("isVertical", this.isVertical);
			var tabWrapUl = this.tabWrapUl;
			if (this.isVertical) {
				var liWidth = tabWrapUl.children("li:eq(0)").width();
				//tabWrapUl.children("li").width(liWidth);
				//tabWrapUl.width("auto").width(tabWrapUl.width() - 1);
				this.contentsDiv.css("margin-" + this.position, this.tabsDiv.outerWidth());
			}
			//纵向 需要重新计算margin
			newContent.attr("lazyload", params.url || "");
			whenTabEdit.call(this);
			this.activate(ref);

			return ref;
		},
		/**
		 * 移除Tab
		 * 
		 * @name Horn.TabPanel#removeTab
		 * @function
		 * @param {string} name tab页对应的name
		 * @return {void}
		 */
		removeTab : function(name) {
			var tab = this.getTab(name);
			if (!tab || !tab.length) return;
			if (isActive(tab)) {//删除的是当前激活的页签
				var closestTab = getClosest(tab);
				if (!closestTab || !closestTab.length) {
					Horn.Msg.alert("提示","至少要有一个页签");
					return;
				}
				this.activate(closestTab);
			}
			tab.data("content").remove();
			tab.remove();
			whenTabEdit.call(this);
		},
		closeTab : function(name) {//推荐使用removeTab
			this.removeTab(name);
		},
		renderTab : function(content, bp) {
			content.children().remove();
			if ((bp.html && bp.html.length > 3)
					|| (bp.jsCode && bp.jsCode.length > 3)) {
				BigPipe.onArrive(bp);
				Horn.setCurrent(content);
				BigPipe.start();
				Horn.init();
			}
			content.data("loaded", true);
		},
		/**
		 * 激活一个tab
		 * @name Horn.TabPanel#activate
	     * @function
		 * @param {String} name tab页对应的name
		 * @return {void}
		 */
		activate: function(name) {
			var tab = this.getTab(name);
			if (tab && tab.length && tab.is(":visible")) {
				selectTab.call(this, tab);
			}
		},
		locate : function(o) {//推荐使用activate
			this.activate(o);
		},
		/**
		 * 启用对应的tab
		 * @name Horn.TabPanel#enable 
	     * @function
		 * @param {string} name tab页对应的name
		 * @return {void}
		 */
		enable: function(name) {
			//显示并激活
			var tab = this.getTab(name).show();
			whenTabEdit.call(this);
			this.activate(tab);
		},
		/**
		 * 禁用对应的tab
		 * @name Horn.TabPanel#disable 
		 * @function
		 * @param {string} name tab页对应的name
		 * @return {void}
		 */
		disable : function(name) {
			var tab = this.getTab(name);
			if (!tab || !tab.length) return;
			if (isActive(tab)) {//禁用的是当前激活的页签
				var closestTab = getClosest(tab);
				if (!closestTab || !closestTab.length) {
					Horn.Msg.alert("提示","至少要有一个页签");
					return;
				}
				this.activate(closestTab);
			}
			tab.hide().data("content").hide();
			whenTabEdit.call(this);
		},
		doLayout:function(){
			//当前组件布局的样式都尽可能的在css里面做掉了，JS里面只是计算滚动的距离之类的
            //重新布局的方法不需要
		}
	});
	//选中一个Tab:关键方法
	function selectTab(tab) {
		if (!tab || !tab.length) return false;
		var ref = tab.attr("ref");
		var currentTab = this.getCurrentTab();
		if (currentTab && currentTab.length) {//存在已激活的页签
			if (currentTab.attr("ref") != ref) {//当前点击的非已激活的页签
				var currentContent = currentTab.data("content");
				//执行页签改变函数（内置）
				if (!whenTabChange.call(this, currentTab, currentContent)) {
					return;
				}
				//隐藏当前页签
				currentTab.removeClass("h_cur");
				currentContent.hide();
				//触发页签改变事件（外部传入）
				this.tabChange(currentTab, tab);
			} else {//点击当前已激活的页签直接返回
				//return;
			}
		}
		
		//执行到此处只有两种情况：1）组件第一次加载，2）点击未激活的页签
		this.currentTabName = ref;
		tab.addClass("h_cur");
		var content = tab.data("content").show();
		
		//延迟加载
		var url = content.attr("lazyload");
		if (url && !content.data("loaded")) {
			var contentId = content.attr("id");
			url = (url.indexOf("?") === -1 ? url + "?" : url + "&") + "pagelet=" + contentId;
			var _this = this;
			requestPage.call(this, {
				id: contentId,
				url: url,
				content: content,
				success: function(){
					moveToCenter.call(_this, tab);
				}
			});
		} else {
			moveToCenter.call(this, tab);
		}
		
	}
	//将某个页签滚动至中间位置
	function moveToCenter(tab, noDelay) {
		var tabWrap = this.tabWrap;
		//立即完成正在执行的动画，到达最终位置
		tabWrap.stop(false, true);
		//滚动至中间位置：前提条件是页签被局部遮盖
		scroll.call(this, calculateActualScroll.call(this, tab, tabWrap), noDelay);
	}
	//判断页签是否被遮盖
	function isCoverByScroller(tab) {
		var tabOffset = tab.offset();
		var d = 8;//微调：接近遮盖时就开始滚动
		if (this.isVertical) {
			var topScroller = this.topScroller;
			var bottomScroller = this.bottomScroller;
			var tabHeight = tab.outerHeight();
			var coverByTopScroller = topScroller.is(":visible") && tabOffset.top <= topScroller.offset().top + topScroller.outerHeight() + d;
			var coverByBottomScroller = bottomScroller.is(":visible") && tabOffset.top + tabHeight + d >= bottomScroller.offset().top;
			return coverByTopScroller || coverByBottomScroller;
		} else {
			var leftScroller = this.leftScroller;
			var rightScroller = this.rightScroller;
			var tabWidth = tab.outerWidth();
			var coverByLeftScroller = leftScroller.is(":visible") && tabOffset.left <= leftScroller.offset().left + leftScroller.outerWidth() + d;
			var coverByRightScroller = rightScroller.is(":visible") && tabOffset.left + tabWidth + d >= rightScroller.offset().left;
			return coverByLeftScroller || coverByRightScroller;
		}
	}
	//计算实际滚动距离
	function calculateActualScroll(tab, tabWrap) {
		var actualScroll = 0;
		var scrollLength = tabWrap.data("scrollLength");
		if (isCoverByScroller.call(this, tab)) {
			if (this.isVertical) {
				var tabHeight = tab.outerHeight();
				var wrapHeight = tabWrap.outerHeight();
				var p1 = tab.position().top;//当前位置
				var p2 = (wrapHeight - tabHeight) / 2;//居中时的位置
				var scrollTop = this.tabWrap.scrollTop() + p1 - p2;//理论滚动值
				actualScroll = scrollTop + wrapHeight > scrollLength ? (scrollLength - wrapHeight) : scrollTop;//实际滚动值
			} else {
				var tabWidth = tab.outerWidth();
				var wrapWidth = tabWrap.outerWidth();
				var p1 = tab.position().left;//当前位置
				var p2 = (wrapWidth - tabWidth) / 2;//居中时的位置
				var scrollLeft = this.tabWrap.scrollLeft() + p1 - p2;//理论滚动值
				actualScroll = scrollLeft + wrapWidth > scrollLength ? (scrollLength - wrapWidth) : scrollLeft;//实际滚动值
			}
		} else {
			actualScroll = this.isVertical ? tabWrap.scrollTop() : tabWrap.scrollLeft();
		}
		return actualScroll;
	}
	
	//计算滚动距离->滚动->滚动按钮是否显示
	function scroll(distance, noDelay) {
		if (this.isVertical) {
			scrollTop.call(this.tabWrap, distance, noDelay);
		} else {
			scrollLeft.call(this.tabWrap, distance, noDelay);
		}
	}
	function scrollLeft(distance, noDelay) {
		var wrapWidth = this.outerWidth();
		var scrollLength = this.data("scrollLength");
		distance = distance != undefined ? distance : this.scrollLeft();
		distance = distance + wrapWidth > scrollLength ? (scrollLength - wrapWidth) : distance;
		this.animate({//动画
			scrollLeft: distance
		}, noDelay ? 0 : 250, function(){
			locateScroller.call($(this));
		});
	}
	function scrollTop(distance, noDelay) {
		var scrollLength = this.data("scrollLength");
		var wrapHeight = this.outerHeight();
		distance = distance != undefined ? distance : this.scrollTop();
		distance = distance + wrapHeight > scrollLength ? (scrollLength - wrapHeight) : distance;
		this.animate({//动画
			scrollTop: distance
		}, noDelay ? 0 : 250, function(){
			locateScroller.call($(this));
		});
	}
	//根据滚动总宽度和当前滚动位置确定滚动按钮是否显示
	function locateScroller() {
		if (this.data("isVertical")) {//垂直方向
			var topScroller = this.siblings(".h_tabscroller-top");
			var bottomScroller = this.siblings(".h_tabscroller-bottom");
			
			var scrollTop = this.scrollTop();
			//控制上侧滚动按钮显示
			if (scrollTop == 0) {
				topScroller.hide();
			} else {
				topScroller.show();
			}
			//控制下侧滚动按钮显示
			if ((scrollTop + this.outerHeight()) < this.data("scrollLength")) {
				bottomScroller.css("top",135);
				bottomScroller.show();
			} else {
				bottomScroller.hide();
			}
		} else {//水平方向
			var leftScroller = this.siblings(".h_tabscroller-left");
			var rightScroller = this.siblings(".h_tabscroller-right");
			
			var scrollLeft = this.scrollLeft();
			//控制左侧滚动按钮显示
			if (scrollLeft == 0) {
				leftScroller.hide();
			} else {
				leftScroller.show();
			}
			//控制右侧滚动按钮显示
			if ((scrollLeft + this.outerWidth()) < this.data("scrollLength")) {
				rightScroller.show();
			} else {
				rightScroller.hide();
			}
		}
	}
	//计算可滚动距离
	function calculateScrollLength() {
		var v = this.isVertical;//是否垂直方向
		var tabWrap = this.tabWrap;
		var tabWrapUl = tabWrap.children("ul");
		var tabsTotalLength = 0;
		tabWrapUl.children("li:visible").each(function(i, o) {
			var $this = $(this);
			var margin,size;
			if (v) {
				margin = parseInt($this.css("margin-top")) + parseInt($this.css("margin-bottom"));
				size = $this.outerHeight();
			} else {
				margin = parseInt($this.css("margin-left")) + parseInt($this.css("margin-right"));
				size = $this.outerWidth();
			}
			tabsTotalLength += size + margin;
		});
		tabsTotalLength += (v ? 20 : 40);//边距
		tabWrap.data("scrollLength", tabsTotalLength);
		return tabsTotalLength;
	}
	//初始化滚动按钮事件
	function initScrollerEvents() {
		var tabWrap = this.tabWrap;
		this.leftScroller.click(function(){
			scrollLeft.call(tabWrap, tabWrap.scrollLeft() - 150);
		});
		this.rightScroller.click(function(){
			scrollLeft.call(tabWrap, tabWrap.scrollLeft() + 150);
		});
		this.topScroller.click(function(){
			scrollTop.call(tabWrap, tabWrap.scrollTop() - 104);
		});
		this.bottomScroller.click(function(){
			scrollTop.call(tabWrap, tabWrap.scrollTop() + 104);
		});
	}
	//是否为激活状态
	function isActive(tab) {
		return tab.hasClass("h_cur");
	}
	//获得最近的一个tab（从后开始获取）
	function getClosest(jq) {
		if (!jq || !jq.length) return undefined;
		var closest = jq.nextAll(":visible:first");
		return closest.length ? closest : jq.prevAll(":visible:first");
	}
	//请求页面
	function requestPage(params) {
		var _this = this;
		$.ajax(params.url, {
			type : "get",
			error : function(xhr, textStatus, errorThrown) {
				_this.renderTab(params.content, {html: "",id: params.id || "",css: [],js: [],jsCode: ""});
				if (params.callback) {
					params.callback();
				}
			},
			success : function(reqData, textStatus, jqXHR) {
				_this.renderTab(params.content, eval("(" + reqData + ")"));
				if (params.success) {
					params.success();
				}
				if (params.callback) {
					params.callback();
				}
			}
		});
	}
	//页签改变：校验当前页签表单
	function whenTabChange(tab, content) {
		if (!this.isFormValidate) {
			
			return true;
		}
		//如果当前页签校验失败，不允许切换
		if (!Horn.Validate.isFormValidate(content)) {
			var title = tab.attr('title');
			if(title!="该页签下有未验证通过的内容"){
				tab.attr('title','该页签下有未验证通过的内容').append('<span class="h_tabli-error"></span>');
			}
			tab.data("content").show();
			return false;
		}
		tab.attr('title', tab.attr('tipMsg')).find('span.h_tabli-error').remove();
		return true;
	}
	//页签状态编辑（添加、移除、启用、禁用等）：重新计算滚动距离
	function whenTabEdit() {
		calculateScrollLength.call(this);//编辑页签后，重新计算可滚动宽度
		scroll.call(this);//编辑页签后，重新计算滚动距离
	}
	//创建Tab
	function createTab(ref, title, width) {
		var tab = [];
		tab.push("<li ref=\"" + ref + "\" title=\"" + title + "\" tipMsg=\""+title+"\"");
		tab.push(" class=\"h_tabpanel-wrap-li\" style=\"width:"+width+"\"><a href=\"javascript:void(0)\">");
		tab.push("<span class=\"h_tab-arrow\"></span>");
		tab.push("<span class=\"h_tab-icon\"></span>");
		tab.push("<span class=\"h_tab-title\">"+title+"</span>");
		tab.push("</a></li>");
		return $(tab.join(""));
	}
	//创建TabContent
	function createContent(ref, refID) {
		return $('<div style="display: block" class="h_tabpanel-content" ref_target="'
				+ ref + '" id="' + refID + '"></div>');
	}
	function initTabPosition(p) {
		this.position = p || this.params.position || "top";
		this.isVertical = this.position == "left" || this.position == "right";
		this.tabWrap.data("isVertical", this.isVertical);
		
		var _this = this;
		var tabWrapUl = this.tabWrapUl;
		if (this.isVertical) {
			var liWidth = tabWrapUl.children("li:eq(0)").width();
			tabWrapUl.children("li").width(liWidth);
			tabWrapUl.width("auto").width(tabWrapUl.width() - 1);
			
			this.contentsDiv.css("margin-" + this.position, this.tabsDiv.outerWidth());
		}
		
		var height = (this.params.height || "") + "";
		if (height) {
			height = height.match(/[px|%]+$/) ? height : height + "px";
			if (this.isVertical) {//只有垂直方向时需要设置头部的高度
				tabWrapUl.height(5000);
				this.tabWrap.height(parseInt(height) + 2);
			}
			/*旧版布局因为内边距的问题设置border会导致空隙*/
//			var noBorderSide = "border-" + (this.params.position || "top");
//			this.contentsDiv.addClass("h_tabpanel-border").css({
//				height: height,
//				overflow: "auto"
//			}).css(noBorderSide, "none");
			
			this.tabWrap.unbind().mousewheel(function(event, delta){
				event.preventDefault();
				var $this = $(this);
				var scrollOffset = _this.isVertical ? $this.scrollTop() : $this.scrollLeft();
				if (delta > 0) {
					scroll.call(_this, scrollOffset - 80, true);
				} else {
					scroll.call(_this, scrollOffset + 80, true);
				}
			});
		} else {
			if (this.params.tabFloat) {
				this.tabsDiv.floatTop();
			}
		}
	}
	$.extend(Horn.TabPanel, {
		DATANAME : "h_tabpanel",
		/**
		 * 获取tabpanel 提供的静态方法，此方法只针对页面只有tabpanl情况下便捷使用
		 * 
		 * @name Horn.TabPanel.get
		 * @function
		 * @param (String)name
		 *            名字
		 * @return (Object)组件对象
		 * @ignore
		 */
		get : function(name) {
			var arr = Horn.data(Horn.TabPanel.DATANAME);
			var tabPanel = arr[0];
			return tabPanel;
		},
		/**
		 * 显示对应的tab页
		 * 
		 * @name Horn.TabPanel.locate
		 * @function
		 * @param name
		 *            tab页对应的name
		 * @ignore
		 */
		locate : function(obj) {
			Horn.TabPanel.get().locate(obj);
		},
		activate : function(obj) {
			Horn.TabPanel.get().activate(obj);
		},
		/**
		 * 显示对应的tab，并且将对应tab的field设置为可用
		 * 
		 * @name Horn.TabPanel.enable
		 * @function
		 * @param name
		 *            tab页对应的name
		 * @ignore
		 */
		enable : function(obj) {
			Horn.TabPanel.get().enable(obj);
		},
		/**
		 * 隐藏对应的tab，并且将对应tab的field设置为不可用
		 * 
		 * @name Horn.TabPanel.disable
		 * @function
		 * @param name
		 *            tab页对应的name
		 * @ignore
		 */
		disable : function(obj) {
			Horn.TabPanel.get().disable(obj);
		}
	});
	Horn.regUI("div.h_tabpanel",Horn.TabPanel);
})(Horn);
(function($){
	$.extend($.fn, {
		floatLeft : function() {
			return this._float("left");
		},
		floatTop : function() {
			return this._float("top");
		},
		floatRight : function() {
			return this._float("right");
		},
		floatBottom : function() {
			return this._float("bottom");
		},
		floatCenter : function() {
			return this.floatLeft().floatTop().floatRight().floatBottom();
		},
		_float: function(side) {
			return this.each(function() {
				toFloat.call($(this), null, side);
			});
		},
		cancelFloat: function() {
			return cancelFloat.call(this);
		}
	});
	function bodySize(type) {
		var doc = document,
			client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
		if (type == "width") {
			return client.clientWidth;
		} else if (type == "height") {
			return client.clientHeight;
		}
		return undefined;
	}
	function toFloat(scrollParent, side) {
		scrollParent = scrollParent || $(window);
		var element = this;
		scrollParent.scroll($.data(this[0], "scrollOnFloat", function() {
			if (!element.data("hasFloat")) {
				initFloatData.call(element);
			}
			var body = $(this);
			var elementData = element.data(), offset = elementData.offset;
			var scrollTop = body.scrollTop(),
				scrollLeft = body.scrollLeft();
			var point,opposite = undefined;
			switch (side) {
				case "left":
					point = scrollLeft - offset.left;
					opposite = "right";
					break;
				case "top":
					point = scrollTop - offset.top;
					opposite = "bottom";
					break;
				case "right":
					point = offset.left + element.outerWidth() - scrollLeft - bodySize("width");
					opposite = "left";
					break;
				case "bottom":
					point = offset.top + element.outerHeight() - scrollTop - bodySize("height");
					opposite = "top";
					break;
				default:
					point = scrollLeft - offset.left;
					opposite = "right";
			}
			if (elementData.fixed[opposite]) return;
			if (point > 0) {
				fixToSide.call(element, side, {
					left: scrollLeft,
					top: scrollTop
				}, opposite);
			} else {
				restoreFromSide.call(element, side);
			}
		}));
	};
	function cancelFloat(sides) {
		var element = this;
		sides = sides || ["top","left","bottom","right"];
		$.each(sides, function(i, side){
			restoreFromSide.call(element, side);
		});
		$(window).unbind("resize", this.data("resizeOnFloat")).unbind("scroll", this.data("scrollOnFloat"));
	}
	function initFloatData() {
		this.data({
			hasFloat: true,
			isAbsolute: this.css("position") == "absolute",
			page: undefined,
			fixed: {},
			style: this.attr("style"),
			offset: this.offset()
		});
		var _this = this;
		$(window).resize($.data(this[0], "resizeOnFloat", function(){
			if (_this.css("position") == "fixed") {
				var copy = _this.next(), offset = copy.offset(), fixed = _this.data("fixed");
				if (!fixed.left && !fixed.right) {
					_this.css("left", offset.left);
				} else if (!fixed.top && !fixed.bottom) {
					_this.css("top", offset.top);
				}
				_this.css({
					width: copy.width()
				}).data({
					offset: copy.offset()
				});
			} else {
				_this.data({
					offset: _this.offset()
				});
			}
		}));
	}
	function fixToSide(side, scrollOffset, opposite) {
		var data = this.data(), offset = data.offset;
		var otherFixedSide = getOtherFixedSide(this, side);
		if (otherFixedSide) {
			this.css(otherFixedSide, 0);
		} else {
			if (!data.fixed[side]) {
				var width = this.outerWidth();
				if (!data.isAbsolute) {
					this.clone().css("visibility", "hidden").insertAfter(this);
				}
				this.css({
					position : "fixed",
					marginLeft: "auto",
					marginTop: "auto",
					width: width,
					zIndex:99999
				});
			}
			this.css({
				left : offset.left - scrollOffset.left,
				top : offset.top - scrollOffset.top
			});
		}
		data.fixed[side] = true;
		this.css(side, 0);
		if (opposite) {
			this.css(opposite, "auto");
		}
	}
	function restoreFromSide(side) {
		var data = this.data();
		if (data.fixed && data.fixed[side]) {
			data.fixed[side] = false;
			if (getOtherFixedSide(this, side) == undefined) {
				if (!data.isAbsolute) {
					this.next().remove();//移除克隆元素
				}
				this.removeAttr("style").attr("style", data.style);
			}
		}
	}
	function getOtherFixedSide(element, side){
		var otherFixedSide = undefined;
		var fixedData = element.data("fixed");
		for (var p in fixedData) {
			if (side != p && fixedData[p]) {
				otherFixedSide = p;
				break;
			}
		}
		return otherFixedSide;
	};
	function formatSize(size) {
		size += "";
		size = size ? size : "0px";
		size = size.replace(/^\s+|\s+$/g, "");
		return size.match(/[px|%|auto]+$/) ? size : size + "px";
	}
	function readParams(jq) {
		return jq ? Horn.paramCaches[jq.attr("paramcacheid")] || {} : {};
	}
	function getStyle(obj, attr) {
		if(obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj,false)[attr];
		}
	}
})(jQuery);
//resizes：resize事件加强
(function($,h,c){var a=$([]),e=$.resizes=$.extend($.resizes,{}),i,k="setTimeout",j="resizes",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);