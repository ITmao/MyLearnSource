/*
 * 修改日期                        修改人员        修改说明
 * -----------------------------------------------------------------------
 * -----------------------------------------------------------------------
 */
 
/**
 * @description 可绑定按钮的多级菜单
 * @name Horn.Menu
 * @class
 * 可绑定按钮的多级菜单
 * @extends Horn.Base
 * @example
    #menu({"name":"text11","opendir":"R","items":[{"label":"test","hasLine":true,"icon":"http://www.baidu.com/img/bdlogo.png","items":[{"label":"test"},{"label":"test","items":[{"label":"test"},{"label":"test"},{"label":"test"}]},{"label":"test"}]},{"label":"test"},{"label":"test"}]})
 */
/**
 * 组件的唯一标示
 * @name Horn.Menu#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单输入域的名称
 * @name Horn.Menu#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单输入域的别名，用在表单中存在相同name的情况下，可以通过别名来区分
 * @name Horn.Menu#<b>alias</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 菜单的展开方向,向右R,向左L；当menu位于窗口最右的时候向左展开，当其位于窗口最左的时候向右展开
 * @name Horn.Menu#<b>opendir</b>
 * @type String
 * @default "R"
 * @ignore
 * @example
 * 无
 */
/**
 * 菜单的条目内容，其中主要的配置内容为label：显示名；icon：图标；event:点击的处理事件；items：子级菜单；tips：显示的提示信息
 * @name Horn.Menu#<b>items</b>
 * @type String
 * @default "1"
 * @example
 * 无
 */
Horn.Menu = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"menu",
		id:"menu",
		baseMenuEl:null,
		baseMenuItem:null,
		rootMenu:null,
		zindexInit:9999,
		opendir:"R",//展开方向，默认向右展开
		tier:0,//menu菜单有多少层
		classOneNum:0,//一级菜单的个数
		init:function(dom){
			 Horn.Menu.superclass.init.apply(this,arguments);
			 var _this = this;
			 
			 this.classOneNum = this.params.items.length;//获取一级菜单的个数
			 
			 this.id = this.params.id?this.params.id:this.id;
			 this.el.attr("id",this.id);
			 this.opendir = this.params.opendir?this.params.opendir:this.opendir;
			 this.baseMenuEl = this.el.next();
			 this.baseMenuItem = $("li",this.baseMenuEl);
			 this.recursionItems(this.baseMenuEl,this.params)
			 this.baseMenuEl.appendTo(this.el);
			 $("li[base='']",this.el).remove();//去除显示的基本元素，IE下如果不写=‘’竟然找不到节点
			 
			 this.rootMenu = this.el.children("ul");
			 
			 //在datagrid中绑定menu时候datagrid的层高过高导致menu被遮盖
			 this.rootMenu.css({"z-index":_this.zindexInit-1});
			 
			 $(document).bind("click",function(e){
				 //不管能不能找到都不能让事件再冒泡了，
				 if($(e.target).closest("*[refmenu="+_this.id+"]").size() == 0 && e.button == 0){
					 _this.hideMenu();
					 //return false;//阻止冒泡导致radio无法切换，checkbox无法选中
				 }
			 })
			 
			 if(this.params.isContextMenu){
				 document.oncontextmenu=function(ev){
					ev = ev || window.event;  
					if(ev.button == 2 || ev.type == "contextmenu"){
						var explorer =navigator.userAgent ;
						//ie 
						if (navigator.appName!= 'Microsoft Internet Explorer'){
							window.event = ev;
						}
						_this.showMenu();
						return false;
					}
				 }
			 }
			 
			 //菜单主动将自己绑定到制定的元素上面
			 $("*[refmenu="+_this.id+"]").click(function(){
				 //增加被绑定元素是否禁用的判断，如果被禁用就不弹出菜单
				 if(!_this.isContextDisabled($(this))){
					 _this.reCalOpendir($(this));
					 if (!_this.rootMenu.is(":visible")) {
						 _this.showMenu($(this));
					 } else {
						 _this.hideMenu();
					 }
				 }
			 });
			 
			 //改变被绑定按钮的展示样式
			 $("*[refmenu="+_this.id+"]").each(function(i,o){
				 $("<i class='fa fa-caret-down'></i>").appendTo($(o));
				 if(o.tagName == "A" || o.tagName == "a"){
					 $(o).css({"text-decoration":"none"})
				 }
				 //不再兼容IE7
//				 if(o.tagName == "BUTTON" || o.tagName == "button" && $.browser.msie && $.browser.version=="7.0"){
//					 $(o).css({"height":"25px"})
//				 }
			 })
			 
			//页面resize的时候onresize
			 $(window).bind("resize",function(){
				_this.hideMenu(); 
			 });
			 
			 //修复当菜单不是最先被初始化的时候在菜单和按钮之间会出现很大的空隙
			 this.el.prependTo($(document.body));
		},
		reCalOpendir:function(context){//重新计算展开方向
			var maxWidth ;
			var p = {};
			var toLeft = context.offset().left;
			var itemWidth = 150;
			if(this.tier < 4){//可以保证三层以内的自动判断，不回折
				maxWidth = this.tier*itemWidth
				p.left = maxWidth < toLeft+context.width();
				p.right = maxWidth < $(window).width() - toLeft;
			}else{
//				maxWidth = 3*itemWidth
//				p.left = maxWidth < toLeft-context.width();
//				p.right = maxWidth < $(window).width() - toLeft;
				p.left = p.right = true;
			}
			if(p.left && p.right || (!p.left && !p.right)){//如果向左
				return;
			}
			if(this.opendir == "L" && !p.left) this.opendir = "R";
			if(this.opendir == "R" && !p.right) this.opendir = "L";
		},
		recursionItems:function(menuEl,item){
			this.tier++;
			var _this = this;
			if(item.items){
				var i = 0;
				while(i < item.items.length){
					
					var tempItem = _this.processparam(_this.baseMenuItem.clone(true).removeAttr("base"),item.items[i]);
					if(item.items[i].items){
						_this.zindexInit++;
						var nextEl = _this.baseMenuEl.clone(true).css({"z-index":_this.zindexInit});
//						var nextEl = _this.baseMenuEl.clone(true);
						nextEl.appendTo(tempItem)
						_this.recursionItems(nextEl,item.items[i]);
					}
					tempItem.appendTo(menuEl);
					
					i++;
				}
			}
		},
		processparam:function(menuEl,params){
			if(params.tips)
				$("a",menuEl).attr("title",params.tips)
			if(params.hasLine)
				$("span.h_toolbar-item-txt",menuEl).addClass("h_menu-line");
			if(params.event)
				$("a",menuEl).attr("onclick",params.event)
			if(params.icon)
				$("span.h_toolbar-item-icon",menuEl).html("<img width='20px' src='"+params.icon+"'>");
			if(params.label)
				$("span.h_toolbar-item-txt",menuEl).text(params.label);
			if(!params.items)
				$("span.h_toolbar-item-arrow",menuEl).remove()
			return menuEl;
		},
		/**
		 * 在哪个元素上进行绝对定位
		 */
		showMenu:function(context,el,isUl){
			var _this = this;
			if(!el){
				el = this.rootMenu;
			}
			
			var pos = this.getShowPosition(context,isUl);
			el.css({"top":pos.Y,"left":pos.X})
			
			el.show();
			
			el.children("li").hover(function(){
				var child = $(this).children("ul");
				if(child.size() == 1){
					_this.showMenu($(this),child,true);
				}
			},function(){
				var child = $(this).children("ul");
				if(child.size() == 1){
					child.hide()
				}
			})
		},
		/**
		 * 获取菜单应该显示在的位置
		 */
		getShowPosition:function(context,isUl){
			var _this = this;
			var itemWidth = 150;//菜单条目的宽度
			var toLeft,toTop,width,height;
			
			if(!context){//页面自定义右键菜单
				toLeft = window.event.clientX;
				toTop = window.event.clientY;
				height=0;
				width=0;
			}else{//被绑定菜单，context是被绑定元素的jquery对象
				toLeft = context.offset().left;
				toTop = context.offset().top;
				width = context.outerWidth();
				height = context.outerHeight();
			}
			/*****************以上属性对以下函数只读******************************/		
			var ulPos = function(){
				var p_y,p_x; //菜单显示的坐标点
				p_y=-height;
				if (_this.opendir == "R"&& (toLeft + width + itemWidth) > $(window).width() || _this.opendir == "L") {//要么都向左展开，要么都向右展开
					_this.opendir = "L";
					p_x=-width;
				}
				if(_this.opendir == "L" && (toLeft-itemWidth) < 0 || _this.opendir == "R"){
					_this.opendir = "R";
					p_x=width;
				}
				return {"X":p_x,"Y":p_y};
			}
			
			var contextPos = function(){
				var p_y,p_x; //菜单显示的坐标点
				var num = _this.classOneNum;
				
				//STORY #10125 #10019建议menu要能支持浏览器向上或是向下碰撞 
				//判断被绑定的按钮是不是在页面视口的底部
				var w_h = $(window).height();
				var m_h = num * 39;//每个菜单的宽度是39
				if(toTop + width + m_h > w_h){
					p_y = toTop-m_h;
				}else{
					p_y = toTop + height;
				}
				
				//在这里判断从左边缘还是右边缘显示菜单
				if((toLeft+itemWidth)>$(window).width() || (_this.opendir == "L" && (toLeft-itemWidth) > 0)){
					p_x = toLeft-itemWidth+width;//这里的26px是下拉箭头的的i元素的宽度
					_this.opendir = "L";
				}else
					p_x = toLeft;
				return {"X":p_x,"Y":p_y};
			}
			/*************************以上获取位置的函数定义，以下处理位置******************************************/
			if(isUl){//子级菜单
				return ulPos();
			}else{//父菜单或者主菜单
				return contextPos();
			}
		},
		hideMenu:function(){
			this.rootMenu.hide();
			this.rootMenu.css({"top":1200,"left":600})
			this.opendir=this.params.opendir;
		},
		/**
		 * @description 添加条目的处理，现在只能添加到指定一级菜单的末尾
	     * @function
	     * @name Horn.Menu#addItem
	     * @param {object} obj
	     * @ignore
	     */
		addItem:function(obj){
			var tempItem = this.processparam(this.baseMenuItem.clone(true).removeAttr("base"),obj);
			tempItem.appendTo(this.rootMenu)
		},
		isContextDisabled:function(context){
			return context.hasClass("h_btn-disabled");
		}
	});
Horn.regUI('div.hc_menu',Horn.Menu);