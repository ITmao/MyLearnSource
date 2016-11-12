/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		韩寅		完善注释为标准的jsdoc
 * 2016-3-22     刘龙          bug#17126 一个页面多个selecttree控件时，设置值后，再次点击下拉框再失去焦点，输入框中的值无法显示
 * 2016-3-22     刘龙          bug#17128 selecttree控件不设置expandFirst属性，显示时浏览器报错
 * 2016-3-22     刘龙          bug#17142 selecttree控件在window控件下，显示时报错
 * 2016-3-22     刘龙          bug#17152 单选模式下，selecttree控件设置value值，过滤功能失效
 * 2016-3-23     刘龙          bug#17194 window控件中selecttree控件显示不全，点击下拉框后树乱掉了
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.SelectTree
 * @class
 * 树下拉选择组件</br>
 * 带有一个输入框，可以通过下拉树选择
 */
	 
/**@lends Horn.SelectTree# */

/**
 * 组件的唯一标示
 * @name Horn.SelectTree#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单提交时的名称
 * @name Horn.SelectTree#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 表单组件跨列数，默认为1
 * @name Horn.SelectTree#<b>cols</b>
 * @type String
 * @default "1"
 * @example
 * 无
 */
/**
 * 表单在首次展现时填充的值
 * @name Horn.SelectTree#<b>value</b>
 * @type String
 * @default ""
 * @example
 * @ignore
 * 无
 */
/**
 * 隐藏标签（也就是label属性）。适用场景：单独使用一个组件，但是又不想要label的。不推荐混合适用，否则布局会乱。
 * @name Horn.SelectTree#hiddenLabel
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 表单组件的名称
 * @name Horn.SelectTree#<b>label</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 验证串，比如"required"等
 * @name Horn.SelectTree#<b>check</b>
 * @type String
 * @default ""
 * @example
 * @ignore
 * 无
 */
 /**
  * 清空值后需要callback的事件配置
  * @name Horn.SelectTree#afterClear
  * @type String
  * @default ""
  * @example
  * #select_tree({  
  *  "id":"select_tree",  
  *  "name":"select_tree",
  *	 "checkMode":"checkbox",
  *  "afterClear":"afterClearFn",
  *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
  *  #jscode()
  *  	function afterClearFn(){
  *  	}
  *  #end
  * 
  */
/**
 * 页面加载时，树组件默认是否展开
 * @name Horn.SelectTree#<b>expandFirst</b>
 * @type Boolean
 * @default false
 * @example
 * @ignore
 * 无
 */
/**
  * 组件的禁用状态，被设置禁用状态的组件，无法获得焦点，不参与表单校验（不会阻止表单提交），不会参与表单提交并且其所有校验状态都会消失，不可编辑，但是可以通过setValue、reset等API修改表单的值；
  * true表示禁用，false表示正常状态
  * @name Horn.SelectTree#disabled
  * @type Boolean
  * @default false
  * @example
  * 无
  */ 
/**
 * 同步加载，静态数据
 * @name Horn.SelectTree#<b>data</b>
 * @type String
 * @default 
 * @example
 * '[{"id":"1","name":"root"},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"}]'
 */
/**
 * 组件异步请求的数据地址，默认不需要此项，使用框架提供的地址。<br/>
 * 注：若果同时配置了url属性以及data属性，则根据url进行异步请求，data属性无效。
 * @name Horn.SelectTree#<b>url</b>
 * @type String
 * @default ""
 * @example
 * #select_tree({  
 *  "id":"select_tree",  
 *  "name":"select_tree",
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 选择模式"checkbox","radio"<br/>
 * 注：1.配置该属性时，点击文本节点选择模式失效；2.不配置该属性时，点击文本节点进行选择，同时按住Ctrl键可多选；<br/>
 *   3.模式为radio时，勾选子节点，父节点不是勾选状态，灰色标示作用;4.模式为radio时，同级节点不能同时勾选，父子节点可以同时勾选;<br/>
 *   5.模式为checkbox时，勾选子节点，父节点不是勾选状态，灰色标示作用;
 * @name Horn.SelectTree#<b>checkMode</b>
 * @type String 
 * @default 
 * @example
 * #select_tree({  
 *  "id":"select_tree",  
 *  "name":"select_tree",
 *	"checkMode":"checkbox",
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 是否使用模糊搜索,默认不使用，搜索出来的树节点高亮显示
 * @name Horn.SelectTree#<b>search</b>
 * @type Boolean
 * @default false
 * @example
 * #select_tree({  
 *  "id":"select_tree",  
 *  "name":"select_tree",
 *	"checkMode":"checkbox",
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')",
 *  "search":true})
 *  
 */
/**
 * 根据特定属性进行模糊搜索,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为节点name或者id。
 * name ：根据树节点名称，id:根据树节点id过滤
 * @name Horn.SelectTree#<b>filterBy</b>
 * @type string
 * @default name
 * @example
 * 无
 */
/**
 * 指定绑定的数据词典名称，用于加载数据
 * @name Horn.SelectTree#<b>dictName</b>
 * @type String
 * @default ""
 * @example
 * @ignore
 * 无
 */

/**
 * 下拉树选中时，回调函数方法
 * @name Horn.SelectTree#<b>onCheck</b>
 * @type String
 * @default ""
 * @example
 * #set($dataT='[{"id":"1","name":"根","pId":""},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"},{"id":"212","name":"sub111","pId":"21"},{"id":"221","name":"sub211","pId":"22"},{"id":"212","name":"sub11sas","pId":"21"}]') 
	#select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"check":"required",
			"onCheck":"onCheck"
			})
	#jscode()
		function onCheck(){
			console.info(Horn.getComp("select_tree2").getSelectedNodes());
		}
	#end
 */
/**
 * 同级是否能选择多次 可选值"true"、"false"，默认"false"
 * @name Horn.SelectTree#<b>isLevelSelect</b>
 * @type String
 * @default "false"
 * @ignore
 * @example
 * 无
 */
/**
 * 根节点的key 默认为"0"表示全部展示，如果不为"0"则表示要展示的单一树
 * @name Horn.SelectTree#<b>root_id</b>
 * @type String
 * @default "0"
 * @ignore
 * @example
 * 无
 */
/**
  * emptyText属性(此属性当值为空时，会在输入框显示提示语)；
  * @name Horn.SelectTree#emptyText
  * @type String
  * @default ""
  * @example
  * #select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"check":"required",
			"onCheck":"onCheck",
			"emptyText":"请选择"
			})
  */
/**
  * 点击X按钮清空值时是否需要确认提示，默认为false；
  * 
  * @name Horn.SelectTree#confirm
  * @type boolean
  * @default false
  * @example
  * #select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"check":"required",
			"onCheck":"onCheck",
			"confirm":true
			})
  */

Horn.SelectTree = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"SelectTree",
	/**
     * 输入框隐藏组件的dom对象
     * @field
     * @name Horn.SelectTree#hidden
     * @type {HTMLDomDocument}
     * @ignore
     */
	hidden : null,
	/**
     * 输入框组件的dom对象
     * @field
     * @name Horn.SelectTree#field
     * @type {HTMLDomDocument}
     * @ignore
     */
	field : null ,
	/**
     * ztree对象的id
     * @field
     * @name Horn.SelectTree#ref
     * @type String
     * @ignore
     */
	ref : null,
	/**
     * 包裹下拉树组件的dom对象
     * @field
     * @name Horn.SelectTree#listEl
     * @type {HTMLDomDocument}
     * @ignore
     */
	listEl : null ,
	/**
     * 下拉树组件的dom对象
     * @field
     * @name Horn.SelectTree#listEl
     * @type {HTMLDomDocument}
     * @ignore
     */
	treeEl : null ,
	_this:null,
	expandFirst:true,
	callback: null,
	/**
	 * @ignore
	 */
	init : function() {
		Horn.SelectTree.superclass.init.apply(this,arguments) ;
		var name=this.name;
		this.field = this.el.children("input[type='text'][ref*='"+name+"']");
		this.hidden = this.field.prev();
		this.name = this.hidden.attr("name") ;
		this.ref = this.field.attr("ref");
		this.img=this.el.find(".u-select-down");
		_this=this;
		//bug#17128 selecttree控件不设置expandFirst属性，显示时浏览器报错
		expandFirst=false;
		if(this.hidden.attr('expandFirst')){
			expandFirst=this.params.expandFirst;
		}
		this.field.bind({
			"focus" : Horn.Util.apply(this.onFocus,this)
		});
		 if(this.params.afterClear){
	        	var fn = this.params.afterClear.replace("(","").replace(")","");
	        	this.callback = window[fn];
	        }
	        var _this = this;
	        this.el.children("a").bind({
	            'click' : Horn.Util.apply(_this.delVal,_this)
	        });
		 /*this.img.bind({      	
	        	'click':Horn.Util.apply(this.onFocus,this)
	      });*/
		this.initZTree();
	},
	delVal : function(){
    	if(this.params.disabled) return;
    	var _this = this;
    	var val = this.field.val();
    	if(val!=""){
    		if(this.params.confirm){
	    		Horn.Msg.confirm("确认","你确定要清除该值？",function(){  
	    			_this.hidden.val("");
	    			_this.field.val("");
	    			_this.field.attr("selectnodes","");
	    			_this.field.attr("pIds","");
	    			if(_this.callback){
	    				_this.callback();
	    			}
	    		},function(){  
	    		    //canel  
	    		});
    		}else{
    			_this.hidden.val("");
    			_this.field.val("");
    			_this.field.attr("selectnodes","");
    			_this.field.attr("pIds","");
    			if(_this.callback){
    				_this.callback();
    			}
    		}
    	}
    },
	/**
	 * @ignore
	 */
	initZTree : function() {
		/*var onchange = this.field.attr("onchange");
		if(onchange){
			//this.field.removeAttr("onchange");
			//var change = Horn.Util.getFunObj(onchange) ;
			//this.field.bind("change",change.params,change.fn) ;
		}*/
		var current = Horn.getCurrent() ;
		this.listEl = current.find("div.hc_selectbox-tree-div[ref_target='"+ this.ref + "']") ;
		if(this.listEl.length == 0){
			var name = this.hidden.attr("name").replace(/\./,"_") ;
			var arrHtml = [] ;
			arrHtml.push("<div class='hc_selectbox-tree-div' ref_target='ztree_" + name + "'>") ;			
			arrHtml.push("<div class='hc_selectbox-tree-left'>");
			arrHtml.push("<ul class='ztree' id='ztree_" + name + "'>");
			arrHtml.push("</ul>");
			arrHtml.push("</div>");
			arrHtml.push("</div>") ;
			var treeDiv = current.find("div.hc_hide_div-tree") ;
			if(treeDiv.length==0){
				treeDiv = $('<div class="hc_hide_div-tree"></div>').appendTo(current) ;
			}
			//判断当前下拉树组件在不在窗口中
			var $currentWindow=this.el.parents("div.h_floatdiv-con");
			if($currentWindow.length == 0){
				this.listEl = $(arrHtml.join("")).appendTo(treeDiv) ;
				this.listEl.attr("isInWin",false);
			}else{
				this.listEl=$(arrHtml.join("")).attr("isInWin",true);
				this.el.after(this.listEl);
			}
		}
	
		/*var treeObj = $.fn.zTree.getZTreeObj(this.ref);
		if(treeObj){
			return true ;
		}*/	
		var ztree = this.listEl.children("div.hc_selectbox-tree-left").children("ul.ztree");
		this.treeEl=ztree;
		/*var check = this.hidden.attr("checkMode") == "checkbox"
				|| this.hidden.attr("checkbox") == "radio";
		var chkStyle = this.hidden.attr("checkMode") || "checkbox";
		var dictName = this.hidden.attr("dictName");
		var service_name = context_path ;
		var root_id = this.hidden.attr("root_id") || "" ;*/
		var async = false;
		if(this.params.url && this.params.url != ""){
			async = true;
		}
		var setting = {
			view: {
				nameIsHTML: true,
				showLine: false,
				showIcon: true,
				showTitle : true,
				selectedMulti: true,
				dblClickExpand: true,
				fontCss: this.getFontCss
			},
			data : {
				key : {
					name : "name",
					title : "name"
				},
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId"
				}
			},
			callback: {
				beforeClick: this.beforeClick,
				beforeCheck: this.params.beforeCheck?window[this.params.beforeCheck]:null,
				beforeAsync : this.params.beforeAsync?window[this.params.beforeAsync]:null,
				onAsyncSuccess : this.params.onAsyncSuccess?window[this.params.onAsyncSuccess]:null,
				onAsyncError : this.params.onAsyncError?window[this.params.onAsyncError]:null,
				beforeCollapse : this.params.beforeCollapse?window[this.params.beforeCollapse]:null,
				beforeDblClick : this.params.beforeDblClick?window[this.params.beforeDblClick]:null,
				beforeDrag : this.params.beforeDrag?window[this.params.beforeDrag]:null,
				beforeDragOpen : this.params.beforeDragOpen?window[this.params.beforeDragOpen]:null,
				beforeDrop : this.params.beforeDrop?window[this.params.beforeDrop]:null,
				beforeEditName : this.params.beforeEditName?window[this.params.beforeEditName]:null,
				beforeExpand : this.params.beforeExpand?window[this.params.beforeExpand]:null,
				beforeMouseDown : this.params.beforeMouseDown?window[this.params.beforeMouseDown]:null,
				beforeMouseUp : this.params.beforeMouseUp?window[this.params.beforeMouseUp]:null,
				beforeRemove : this.params.beforeRemove?window[this.params.beforeRemove]:null,
				beforeRename : this.params.beforeRename?window[this.params.beforeRename]:null,
				beforeRightClick : this.params.beforeRightClick?window[this.params.beforeRightClick]:null,
				onCheck : this.onCheck,
				onCollapse : this.params.onCollapse?window[this.params.onCollapse]:null,
				onDblClick : this.params.onDblClick?window[this.params.onDblClick]:null,
				onDrag : this.params.onDrag?window[this.params.onDrag]:null,
				onDragMove : this.params.onDragMove?window[this.params.onDragMove]:null,
				onExpand : this.params.onExpand?window[this.params.onExpand]:null,
				onMouseDown : this.params.onMouseDown?window[this.params.onMouseDown]:null,
				onMouseUp : this.params.onMouseUp?window[this.params.onMouseUp]:null,
				onNodeCreated : this.params.onNodeCreated?window[this.params.onNodeCreated]:null,
				onRemove : this.params.onRemove?window[this.params.onRemove]:null,
				onRename : this.params.onRename?window[this.params.onRename]:null,
				onRightClick : this.params.onRightClick?window[this.params.onRightClick]:null,
				onClick : this.onCheck
			},
			async: {
				enable: async,
				url:this.params.url?this.params.url:"",
				autoParam:this.params.otherParam?this.params.otherParam:[],
				otherParam:this.params.otherParam?this.params.otherParam:{},
			    type:this.params.type?this.params.type:"post",
				dataFilter: this.params.dataFilter?window[this.params.dataFilter]:null
			}
		};
		
		var checkMode = this.hidden.attr('checkMode');
		if(checkMode&&checkMode=="checkbox"){
			setting.check = {
				enable : true,
				chkStyle : checkMode,
				chkboxType : { "Y": "", "N": "" }
			};
		}
		var data = this.hidden.attr("data-data") ;
		if(data && data != ""){
			data = $.parseJSON(data);
		}else{
			data = [];
		}
		this.treedata = data;
		if(async){
			this.zTreeObj=$.fn.zTree.init(ztree, setting);
		}else{
			this.zTreeObj=$.fn.zTree.init(ztree, setting, data);
		}
		var treeid = this.treeEl.attr('id');
		this.treeObj = $.fn.zTree.getZTreeObj(treeid);
		
		this.treeObj.expandAll(expandFirst);
		//根据value值给输入框赋name值
		var keyId = this.hidden.attr("value") ;
		var treeNodes=this.treeObj.getNodesByParam("id", keyId, null);
		if(treeNodes && treeNodes[0] !=null && treeNodes[0] != {} ){
			this.field.val(treeNodes[0].name);
			this.showLog(treeNodes,this.treeObj,true);
		}else{
			this.field.val("");
		}
		var treeObj = this.treeObj;
		//模糊查询
		var filterBy = "name" ;
		if(this.hidden.attr("filterBy")){
			filterBy =this.hidden.attr("filterBy");
		}
		this.field.bind('keyup',function(e) {
				treeObj.expandAll(true);
				var nodeList = treeObj.getNodesByParamFuzzy(filterBy,this.value,null);
				if(this.value!=""){
					$.each(nodeList,function(index,node){
				        node.highlight = true;
				        treeObj.updateNode(node);
				        treeObj.expandNode(node.getParentNode(),true);
				    });
				}else{
					$.each(nodeList,function(index,node){
				        node.highlight = false;
				        treeObj.updateNode(node);
				    });
				    treeObj.expandAll(expandFirst);
				}
			this.focus();
		});
	   //
	   this.field.bind({
			"blur" : function(){
				//bug#17126 一个页面多个selecttree控件时，设置值后，再次点击下拉框再失去焦点，输入框中的值无法显示
				$(this).val($(this).attr("selectNodes"));
				//失去焦点后，去除高亮样式
				var nodeList = treeObj.getNodesByParam("highlight",true,null);;
				$.each(nodeList,function(index,node){
			        node.highlight = false;
			        treeObj.updateNode(node);
			    });	
			}
		});
	   
	},
	/**
	 * @ignore
	 */
	onBeforeCheck : function(treeid, treeNode){
		var treeObj = $.fn.zTree.getZTreeObj(treeid);
		var _this = treeObj.thisScope ;
		return (function(){
			var isLevelSelect = this.hidden.attr("isLevelSelect") == "true";
			var check = this.hidden.attr("checkMode") == "checkbox"
			|| this.hidden.attr("checkbox") == "radio";
			if (check) {
				if (isLevelSelect) {
					if (this.hidden.data("level") != undefined
							&& treeNode["level"] != this.hidden
									.data("level")) {
						return false;
					}
					this.hidden.data("level", treeNode["level"]);
				}
			}
		}).apply(_this,arguments) ;
	},
	
	/**
	 * 异步加载成功后，全部展开树节点
	 * @ignore
	 */
	onAsyncSuccess : function(event, treeId, treeNode, msg){
		var _this = this
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		treeObj.expandAll(expandFirst);
		
		//根据value值给输入框赋name值
		var keyId = _this.hidden.attr("value") ;
		var treeNodes=treeObj.getNodesByParam("id", keyId, null);
		if(treeNodes && treeNodes[0] !=null && treeNodes[0] != {} ){
			_this.field.val(treeNodes[0].name);
			_this.showLog(treeNodes,treeObj,true);
		}else{
			_this.field.val("");
		}
	},
	getFontCss:function(treeId, treeNode) {  
	    return (treeNode.highlight) ? {"color":"rgb(255, 0, 0)", "font-weight":"bold"} : {'color':'#333', 'font-weight': 'normal'};  
	},
	/**
	 * @ignore
	 */
	onCheck : function(e, treeId, treeNode) {
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		var _this = treeObj.thisScope ;
		return (function(){
			var nodes = treeObj.getCheckedNodes();
			var check = this.hidden.attr("checkMode");
			var nodes = new Array();
			if(check&&check=="checkbox"){
				nodes = treeObj.getCheckedNodes();
			} else {
				nodes = treeObj.getSelectedNodes();
			}
			this.showLog.call(this,nodes,treeObj,check,true);
			if(this.params.onCheck){
				var onCheck = window[this.params.onCheck];
				onCheck();
			}
			
		}).apply(_this,arguments) ;
		
		this.field.trigger('blur');
	},
	/**
	 * @ignore
	 */
	showLog : function(nodes,treeObj,check,flag){
		var className = "dark";
		var idArr = [];
		var tIdArrs = [];
		var values = [];
		var pIds = [];
		var labels = [];
		var ztree = this.listEl.children("div.hc_selectbox-tree-left")
		.children("ul.ztree");
		var log = ztree.parent().next("div.hc_selectbox-tree-right")
		.children("ul.ztree");		
		$.each(nodes, function(index, node) {
			var zid = "ztree_node_" + node.tId;
			var value = node.name;
			var label = node.id;
			var pid = node.pId;
			values.push(value);
			labels.push(label);
			pIds.push(pid);
			idArr.push(zid);
			tIdArrs.push(node.tId) ;
			log.children("li[zid='" + zid + "']");
			if (log.children("li[zid='" + zid + "']").length == 0) {
				log.append("<li class='" + className + "' zid='" + zid
						+ "'>" + value + "</li>");
			}
		});
		log.children("li").each(function(index, li) {
			var obj = $(li);
			if (jQuery.inArray(obj.attr("zid"), idArr) == -1) {
				obj.remove();
			}
		});
		this.hidden.val(labels.join(","));
		if (check) {
			this.field.val(values.join(","));
			this.field.attr("selectNodes",values.join(","));
			this.field.attr("pIds",pIds.join(","));
			this.field.attr("title",values.join(","));
		} else {
			this.field.val(values.join(","));
			this.field.attr("pIds",pIds.join(","));
			this.field.attr("selectNodes",values.join(","));
		}
		this.hidden.attr("tids",tIdArrs.join(",")) ;
		var check = this.hidden.attr("checkMode");
		if(!check || check=="radio"){
			//this.hideTree(this.field,this.listEl);
			if(flag!=undefined){
				if(flag){
					this.hideTree(this.field,this.listEl);
				}else{
					this.showTree(this.field,this.listEl);
				}
			}
		}
		this.validate();
		//this.field.trigger("change",[this.hidden.val(),this.field.val(),nodes,this.hidden,this.field]) ;
	},
	/**
	 * @ignore
	 */
	clearLog : function(){
		var log = this.listEl.children("div.hc_selectbox-tree-right")
		.children("ul.ztree");
		log.children("li").remove() ;
	},
	/**
	 * @ignore
	 */
	onFocus : function(e) {		
		var current = Horn.getCurrent() ;
		this.listEl = current.find("div.hc_selectbox-tree-div[ref_target='"+ this.ref + "']") ;
		this.listEl.find("div.hc_selectbox-tree-left").width(this.field.width()+30);
		//bug#17194 window控件中selecttree控件显示不全，点击下拉框后树乱掉了
		if(this.listEl.attr("isInWin")=="true"){//在窗口中，当下拉树的cos属性为1或2时，下拉项宽度变小
			if(this.field.width()<390){
				this.listEl.find("div.hc_selectbox-tree-left").width(this.field.width()+30);
			}
		}
		var curObj = $(e.currentTarget);
		var ref_target = curObj.attr('ref');
		var listDiv = $("div.hc_selectbox-tree-div[ref_target='"
				+ ref_target + "']");
		if (listDiv.length > 0) {
			this.showTree(curObj, listDiv);
			var zTree = $.fn.zTree.getZTreeObj(ref_target);
			zTree.thisScope = this ;
			zTree.currentTarget = curObj ;
			//bug#17152 单选模式下，selecttree控件设置value值，过滤功能失效
			var check = this.hidden.attr("checkMode") == "checkbox" || this.hidden.attr("checkMode") == "radio";
			this.clearLog(zTree) ;
			zTree.checkAllNodes(false);
			zTree.selectNode(null, false);
			if(this.hidden.val()){
				tIdArrs = this.hidden.attr("tids") || "" ;
				tIdArrs = tIdArrs.split(",") ;
				var nodes = [] ;
				for(var i=0;i<tIdArrs.length;i++){
					if(tIdArrs[i]){
						var node = zTree.getNodeByTId(tIdArrs[i]);
						nodes.push(node) ;
						if (check) {
							zTree.checkNode(node, true, true, false);
						} else {
							zTree.selectNode(node, false);
						}	
					}
				}
				this.showLog(nodes,zTree,check,false) ;
			}
		}
		//开启模糊搜索，输入框获取焦点，清空值
		var hiddenObj=curObj.prev();
		var search=hiddenObj.attr("search");
		var filterBy=hiddenObj.attr("filterBy");
		if(search || filterBy){
			curObj.val("");
			curObj.removeAttr("readonly");
		}
	},
	/**
	 * @ignore
	 */
	hideTree : function(inputEl, listEl) {
		if (!listEl.data("show_name")) {
			return;
		}
		listEl.hide();
		listEl.data("show_name", false);
		var ref_target = inputEl.attr('ref');
		var zTree = $.fn.zTree.getZTreeObj(ref_target);
		zTree.thisScope = null ;
		zTree.currentTarget = null ;
	},
	/**
	 * @ignore
	 */
	showTree : function(inputEl, listEl) {
		if (listEl.data("show_name")) {
			return;
		}
		this.hideAllList(listEl);
		// 应用对象
		var data = {
			'inputEl' : inputEl,
			'listEl' : listEl
		};
		var offset = inputEl.offset(), listOuterHeight = inputEl.outerHeight();
		var position = inputEl.position();
		// 显示位置
		var listStyle = listEl.get(0).style;
		//bug#17142 selecttree控件在window控件下，显示时报错
		//下拉树在窗口中
		var $list=listEl.find("li");
		if(listEl.attr("isInWin")=="true"){
			listStyle.left = (position.left) + 'px';
			listStyle.top = (position.top + listOuterHeight) + 'px';
			$list.find("a").css({"min-width":"120px"});
			$list.find("span").css({"padding":"0px","text-align":"left" });
			$list.find("span.button").css({"width":"18px"});
			$list.find("span.button.chk").css({"width":"14px"});
		}else{
			listStyle.left = (offset.left) + 'px';
			listStyle.top = (offset.top + listOuterHeight) + 'px';
		}
		// listStyle.width = (inputEl.outerWidth() - 2) + 'px';
		// 显示
		listEl.show();
		listEl.data("show_name", true);
		// 当前文本框事件处理
		listEl.bind('click.ztree.list', data, function(e) {
			Horn.Util.stopPropagation(e);
		});
		// 文档事件处理
		$(document).one('click.combo.body', data, Horn.Util.apply(this.bodyClick,this));
	},
	/**
	 * @ignore
	 */
	hideAllList : function(listEl) {
		$("div.hc_selectbox-tree-div").each(function(i, o) {
			if (listEl.get(0) != o) {
				$(o).hide();
				$(o).data("show_name", "");
			}
		});
	},
	/**
	 * @ignore
	 */
	bodyClick : function(e) {
		var inputEl = e.data.inputEl;
		if(e.target==inputEl.get(0)){
			$(document).one('click.combo.body', e.data, Horn.Util.apply(this.bodyClick,this));
		}
		else{
			var listEl = e.data.listEl;
			this.hideTree(inputEl, listEl);	
		}
	},
    /**
     * 设置表单是否可用
     * @name Horn.SelectTree#setEnable
     * @function
     * @param enable true表示启用，false表示禁用
     * @return void
     * @example
     */
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.field.attr("disabled","disabled");
			this.hidden.attr("disabled","disabled");
		}
	},
	 /**
     * 设置下拉树的值，必须传递树节点的id值，如果id值不存在则设置为空(注：只能设置单个节点)。
     * @function
     * @name Horn.SelectTree#setValue
     * @param {String} value 值
     * @return void
     * @example
     * ##设置默认值为根节点
     * Horn.getComp("select_tree").setValue("1");
     * 
     */
    setValue : function(value) {
        var treeNodes=this.treeObj.getNodesByParam("id", value, null);
		if(treeNodes && treeNodes[0] !=null && treeNodes[0] != {} ){
			this.field.val(treeNodes[0].name);
			this.showLog(treeNodes,this.treeObj,true);
		}else{
			this.field.val("");
			this.showLog({},this.treeObj,true);
		}
        this.validate();
    },
    /**
     * 获取 selectTree 当前被选中的节点数据集合
     * @name Horn.SelectTree#getSelectedNodes
     * @function
     * @return Array(JSON)
     * 当前被选中的节点数据集合
     * @example
     * #set($dataT='[{"id":"1","name":"根","pId":""},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"},{"id":"212","name":"sub111","pId":"21"},{"id":"221","name":"sub211","pId":"22"},{"id":"212","name":"sub11sas","pId":"21"}]') 
		#select_tree({
	        "id":"select_tree",
	        "name":"select_tree",
			"label":"select_tree",
			"disabled":false,			
			"data":$dataT,
			"expandFirst":false,
			"filterBy":"id",
			"checkMode":"radio",
			"check":"required",
			"onCheck":"onCheck"
			})
      	#jscode()
		function getSelectedNodes(){
			Horn.getComp("select_tree").getSelectedNodes();
		}
		#end
     */
	getSelectedNodes: function(){
    	var check = this.hidden.attr("checkMode");
		if(!check || check=="radio"){
    		return this.treeObj.getSelectedNodes();
    	}else{
    		return this.treeObj.getCheckedNodes();
    	}
	},
     /**
     * 获取下拉树的值列表
     * @function
     * @name Horn.SelectTree#getValue
     * @param 
     * @return {String} 返回树节点的id值
     * 
     */
    getValue : function() {
        var input = this.get();
        var treeNodeidString= input.val();
        return treeNodeidString;
    },
    /**
     * 获取节点名称值
     * @function
     * @name Horn.SelectTree#getText
     * @param 
     * @return {String} 返回树节点的名称值
     * 
     */
    getText : function() {
    	 var input = this.field;
        var texts= input.attr("selectnodes");;
        return texts;
    },
    /**
     * 获取节点的父id值
     * @function
     * @name Horn.SelectTree#getPid
     * @param 
     * @return {String} 返回树节点的pId值
     * 
     */
    getPid : function() {
    	 var input = this.field;
         var pIds= input.attr("pIds");;
         return pIds;
    }
}) ;
Horn.Field.regFieldType("div.hc_select-tree",Horn.SelectTree) ;