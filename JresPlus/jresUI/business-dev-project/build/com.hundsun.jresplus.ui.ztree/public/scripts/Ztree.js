/*
 * -----------------------------------------------------------------------
 * 修订纪录
 * 2014-3-11 		谢晶晶		修正注释文档
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.ZtreePanel
 * @class
 * ztree封装组件</br>
 * 基于ztree 3.5版本上进行封装树形展示组件，支持同步和异步树，拥有3.5版本的所有功能,同时拥有展开、收缩、刷新和模糊收缩功能
 */
/**
 * @lends Horn.ZtreePanel#
 */
	 
 /**
 * 组件的唯一标示
 * @name Horn.ZtreePanel#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的名称，必填
 * @name Horn.ZtreePanel#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
	 
/**
 * 同步加载，静态数据
 * @name Horn.ZtreePanel#<b>data</b>
 * @type String
 * @default 
 * @example
 * '[{"id":"1","name":"root"},{"id":"21","name":"sub11","pId":"1"},{"id":"22","name":"sub12","pId":"1"}]'
 */
/**
 * 是否异步
 * @name Horn.ZtreePanel#<b>async</b>
 * @type Boolean
 * @default false
 * @example
 * #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */	
/**
 * 异步加载,url返回的数据格式跟静态的data一致(async为true时生效)
 * @name Horn.ZtreePanel#<b>url</b>
 * @type String
 * @default ""
 * @example
 * #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */	
/**
 * 选择模式"checkbox","radio"<br/>
 * 注：模式为radio时，勾选子节点，父节点不是勾选状态，灰色标示作用<br/>
 *   模式为checkbox时，勾选子节点，父节点默认勾选状态
 * @name Horn.ZtreePanel#<b>checkMode</b>
 * @type String 
 * @default 
 * @example
 * #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
	
/**
 * 页面加载时，树组件默认是否展开
 * @name Horn.ZtreePanel#<b>expandFirst</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 是否显示操作按钮栏（包含展开、收缩和刷新）,默认不显示<br/>
 * 注：收缩/展开按钮，若有选中节点则展开/收缩选中节点，无选中节点，则展开/收缩整棵树；<br/>
 *   收缩/展开按钮，不会触发树的收缩与展开事件，必须点树节点击前面的加减号，才能触发树的收缩与展开事件；
 * @name Horn.ZtreePanel#<b>toolbar</b>
 * @type Boolean
 * @default false
 * @example
 * #ztree({  
 *       "id":"tree1",  
 *       "name":"ztree1",
 *   	"checkMode":"checkbox",
 *   	"onClick":"nodeClick",
 *   	"async":true,
 *		"toolbar":false,
 *      "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 是否使用模糊搜索,默认不使用
 * @name Horn.ZtreePanel#<b>search</b>
 * @type Boolean
 * @default false
 * @example
 * #ztree({  
 *       "id":"tree1",  
 *       "name":"ztree1",
 *   	"checkMode":"checkbox",
 *   	"onClick":"nodeClick",
 *   	"async":true,
 *		"toolbar":false,
 *		"search":false,
 *      "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 */
/**
 * 重新渲染的回调函数
 * @name Horn.ZtreePanel#<b>reRenderFn</b>
 * @type String
 * @default 
 * @example
 *  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "reRenderFn":"reRenderFn",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 * ##srcNode 源树节点
 * ##newDom　目标树节点
 * function reRenderFn(srcNode,newDom){
 * 	newDom.before("<span>*</span>")
 * }
 *  #end
 */
	
/**
 * 用于捕获节点被点击的事件回调函数
 * 注：该点击事件只针对节点文本，对于节点前面的单选/复选按钮无效<br/>
 * 如果设置了beforeClick 方法，且返回 false，将无法触发 onClick 事件回调函数
 * @name Horn.ZtreePanel#<b>nodeclick或onClick</b>
 * @type String
 * @default 
 * @example
 *  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onClick":"nodeClick",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 * ##标准的 js event 对象
 * ##对应 zTree 的 treeId，便于用户操控
 * ##treeNode被单击的节点 JSON 数据对象
 *   function nodeClick(event, treeId, treeNode){
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
	
/**
 * 节点点击前触发的函数,return false则取消点击事件执行
 * @name Horn.ZtreePanel#<b>beforenodeclick或beforeClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeClick":"nodeBeforeClick",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *  ## clickFlag 节点被点击后的选中操作类型(0,1,2)
 *   function nodeBeforeClick(treeId, treeNode, clickFlag){
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获异步加载之前的事件回调函数，zTree 根据返回值确定是否允许进行异步加载
 * @name Horn.ZtreePanel#<b>beforeAsync</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeAsync":"beforeAsync",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##treeId:对应 zTree 的 treeId，便于用户操控
 *  ##treeNode:进行异步加载的父节点 JSON 数据对象，针对根进行异步加载时，treeNode = null 
 *  ##禁止 id 为 1 的父节点进行异步加载操作 
 * function beforeAsync(treeId, treeNode) {
 * 	return (treeNode.id !== 1);
 * };
 *  #end
 */
/**
 * 用于捕获 勾选 或 取消勾选 之前的事件回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选
 * @name Horn.ZtreePanel#<b>beforeCheck</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeCheck":"beforeCheck",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeCheck(treeId, treeNode){
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获异步加载正常结束的事件回调函数。
 * 如果设置了beforeAsync 事件，且返回 false，将无法触发 onAsyncSuccess / onAsyncError 事件回调函数。
 * @name Horn.ZtreePanel#<b>onAsyncSuccess</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onAsyncSuccess":"onAsyncSuccess",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##treeId: 对应 zTree 的 treeId，便于用户操控
 *  ##treeNode: 进行异步加载的父节点 JSON 数据对象,针对根进行异步加载时，treeNode = null
 *  ##异步加载成功后，弹出提示信息
 *  function onAsyncSuccess(event, treeId, treeNode, msg) {
 * 	 alert(msg);
 *  };
 *  #end
 */
/**
 * 用于捕获异步加载出现异常错误的事件回调函数。
 * 如果设置了beforeAsync 事件，且返回 false，将无法触发 onAsyncSuccess / onAsyncError 事件回调函数。
 * @name Horn.ZtreePanel#<b>onAsyncError</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onAsyncError":"onAsyncError",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##treeId: 对应 zTree 的 treeId，便于用户操控
 *  ##treeNode: 进行异步加载的父节点 JSON 数据对象,针对根进行异步加载时，treeNode = null
 *  ## 异步加载出现异常后，弹出错误信息
 *   function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
 *   	alert(XMLHttpRequest);
 *   }
 *  #end
 */
/**
 * 用于捕获父节点折叠之前的事件回调函数，并且根据返回值确定是否允许折叠操作<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点击树节点击前面的减号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>beforeCollapse</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeCollapse":"beforeCollapse",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeCollapse(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之前的事件回调函数，并且根据返回值确定触发 onDblClick 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeDblClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDblClick":"beforeDblClick",
 *	"async":true,
 *   "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDblClick(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作
 * @name Horn.ZtreePanel#<b>beforeDrag</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDrag":"beforeDrag",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDrag(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获拖拽节点移动到折叠状态的父节点后，即将自动展开该父节点之前的事件回调函数，并且根据返回值确定是否允许自动展开操作
 * @name Horn.ZtreePanel#<b>beforeDragOpen</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDragOpen":"beforeDragOpen",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDragOpen(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获拖拽节点移动到折叠状态的父节点后，即将自动展开该父节点之前的事件回调函数，并且根据返回值确定是否允许自动展开操作
 * @name Horn.ZtreePanel#<b>beforeDrop</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeDrop":"beforeDrop",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeDrop(treeId, treeNodes, targetNode, moveType) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点编辑按钮的 click 事件，并且根据返回值确定是否允许进入名称编辑状态
 *    此事件回调函数最主要是用于捕获编辑按钮的点击事件，然后触发自定义的编辑界面操作。
 * @name Horn.ZtreePanel#<b>beforeEditName</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeEditName":"beforeEditName",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeEditName(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点击树节点击前面的加号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>beforeExpand</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeExpand":"beforeExpand",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeExpand(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标按键按下之前的事件回调函数，并且根据返回值确定触发 onMouseDown 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeMouseDown</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeMouseDown":"beforeMouseDown",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeMouseDown(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标按键松开之前的事件回调函数，并且根据返回值确定触发 onMouseUp 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeMouseUp</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeMouseUp":"beforeMouseUp",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeMouseUp(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被删除之前的事件回调函数，并且根据返回值确定是否允许删除操作
 * @name Horn.ZtreePanel#<b>beforeRemove</b>
 * @type String
 * @default
 * @ignore 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeRemove":"beforeRemove",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeRemove(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点编辑名称结束（Input 失去焦点 或 按下 Enter 键）之后，更新节点名称数据之前的事件回调函数，并且根据返回值确定是否允许更改名称的操作
 * 节点进入编辑名称状态后，按 ESC 键可以放弃当前修改，恢复原名称，取消编辑名称状态
*从 v3.5.13 开始，取消编辑状态也会触发此回调，根据 isCancel 参数判断
 * @name Horn.ZtreePanel#<b>beforeRename</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeRename":"beforeRename",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeRename(treeId, treeNode, newName, isCancel) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标右键点击之前的事件回调函数，并且根据返回值确定触发 onRightClick 事件回调函数
 * @name Horn.ZtreePanel#<b>beforeRightClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "beforeRightClick":"beforeRightClick",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function beforeRightClick(treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 checkbox / radio 被勾选 或 取消勾选的事件回调函数。
 *  如果设置了 beforeCheck 方法，且返回 false，将无法触发 onCheck 事件回调函数。
 * @name Horn.ZtreePanel#<b>onCheck</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onCheck":"onCheck",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onCheck(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被折叠的事件回调函数。
 *  如果设置了 beforeCollapse 方法，且返回 false，将无法触发 onCollapse 事件回调函数。<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点树节点击前面的减号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>onCollapse</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onCollapse":"onCollapse",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onCollapse(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeDblClick 方法，且返回 false，将无法触发 onDblClick 事件回调函数。
 * @name Horn.ZtreePanel#<b>onDblClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onDblClick":"onDblClick",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onDblClick(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeMouseDown 方法，且返回 false，将无法触发 onMouseDown 事件回调函数。
 * @name Horn.ZtreePanel#<b>onMouseDown</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onMouseDown":"onMouseDown",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onMouseDown(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeMouseUp 方法，且返回 false，将无法触发 onMouseUp 事件回调函数。
 * @name Horn.ZtreePanel#<b>onMouseUp</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onMouseUp":"onMouseUp",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onMouseUp(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获 zTree 上鼠标双击之后的事件回调函数。
 * 如果设置了 beforeRightClick 方法，且返回 false，将无法触发 onRightClick 事件回调函数。
 * @name Horn.ZtreePanel#<b>onRightClick</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onRightClick":"onRightClick",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onRightClick(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被拖拽的事件回调函数。
 *  如果设置了 setting.callback.beforeDrag 方法，且返回 false，将无法触发 onDragMove 和 onDrag 事件回调函数。
 * @name Horn.ZtreePanel#<b>onDrag</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onDrag":"onDrag",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onDrag(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被拖拽过程中移动的事件回调函数。
 *  主要用于捕获 zTree 节点拖拽到的 DOM，从而操作对应的 DOM。
 * @name Horn.ZtreePanel#<b>onDragMove</b>
 * @type String
 * @default 
 * @ignore
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onDragMove":"onDragMove",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onDragMove(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
/**
 * 用于捕获节点被展开的事件回调函数
 *  如果设置了beforeExpand 方法，且返回 false，将无法触发 onExpand 事件回调函数。<br/>
 * 注：收缩/展开按钮，不会触发该事件，必须点树节点击前面的加号，才能触发该事件；
 * @name Horn.ZtreePanel#<b>onExpand</b>
 * @type String
 * @default 
 * @example
  #ztree({  
 *  "id":"tree1",  
 *  "name":"ztree1",
 *	"checkMode":"checkbox",
 *  "onExpand":"onExpand",
 *	"async":true,
 *  "url":"$appServer.get('/test/ztree/asynTree.htm')"})
 * #jscode()
 *  ##对应 zTree 的 treeId，便于用户操控
 *  ##treeNode被单击的节点 JSON 数据对象
 *   function onExpand(event, treeId, treeNode) {
 *   	alert(treeNode.tId + ", " + treeNode.name);
 *   }
 *  #end
 */
var expandfirst=false;
Horn.ZtreePanel = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"ZtreePanel",
    /**
     * 引用的dom对象
     * @field
     * @name Horn.ZtreePanel#el
     * @type {HTMLDomDocument}
     * @ignore
     */
	el:null,
    /**
     * 异步调用时使用的url，用于进行动态加载节点
     * @field
     * @name Horn.ZtreePanel#url
     * @type {string}
     * @ignore
     */
	url:null,
    /**
     * 异步调用时使用的params
     * @field
     * @name Horn.ZtreePanel#params
     * @type {Object}
     * @ignore
     */
	params:{},
    /**
     * 静态载入时使用的Data,或用作初始化使用
     * @field
     * @name Horn.ZtreePanel#treedata
     * @type {Object}
     * @ignore
     */
	treedata:null,

	beforeClick : function(){
		return true;
	},
	onClick : function(){
		
	},
	onExpand : function(){},
	check : false,
	chkStyle : 'checkbox',
	init : function(dom) {
		Horn.ZtreePanel.superclass.init.apply(this,arguments) ;
		Horn.apply(this,this.params);
		this.treeEl = this.el.find('.ztree');
		var _tree = this;
		if(this.el.attr('treeclick')) {
			var fn = this.el.attr('treeclick');
			if(fn){
				fn = window[fn];
			}
			this.onClick = fn;
		}else{
			if(this.params.onClick){
				this.onClick = window[this.params.onClick];
			}
		}
		if(this.el.attr('beforetreeclick')) {
			var fn = this.el.attr('beforetreeclick');
			if(fn){
				fn = window[fn];
			}
			this.beforeClick = fn;
		}else{
			if(this.params.beforeClick){
				this.beforeClick = window[this.params.beforeClick];
			}
		}
		if(this.el.attr('reRenderFn')) {
			var fn = this.el.attr('reRenderFn');
			if(fn){
				fn = window[fn];
			}
			this.reRender = fn;
		}
		if(this.el.attr('onExpand')) {
			var fn = this.el.attr('onExpand');
			if(fn){
				fn = window[fn];
			}
			this.onExpand = fn;
		}
		var async = false;
		if(this.params.async&&this.params.async==true){
			async = true;
		}
       	var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			view: {
				nameIsHTML: true,
				showLine: false,
				showIcon: true,
				showTitle : true,
				selectedMulti: true,
				dblClickExpand: true,
				addDiyDom: function(treeId, treeNode){
					var IDMark_A = "_a";
					var aObj = $("#" + treeNode.tId + IDMark_A);
					_tree.reRender(treeNode,aObj);
				},
				fontCss: this.getFontCss
			},
			async: {
				enable: async,
				url:this.params.url?this.params.url:"",
				autoParam:this.params.otherParam?this.params.otherParam:[],
				otherParam:this.params.otherParam?this.params.otherParam:{},
			    type:this.params.type?this.params.type:"post",
				dataFilter: this.params.dataFilter?window[this.params.dataFilter]:null
			},
			callback: {
				beforeClick: this.beforeClick,
				beforeCheck: this.params.beforeCheck?window[this.params.beforeCheck]:null,
				beforeAsync : this.params.beforeAsync?window[this.params.beforeAsync]:null,
				onAsyncSuccess : this.params.onAsyncSuccess?window[this.params.onAsyncSuccess]:this.onAsyncSuccess,
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
				onCheck : this.params.onCheck?window[this.params.onCheck]:null,
				onCollapse : this.params.onCollapse?window[this.params.onCollapse]:null,
				onDblClick : this.params.onDblClick?window[this.params.onDblClick]:null,
				onDrag : this.params.onDrag?window[this.params.onDrag]:null,
				onDragMove : this.params.onDragMove?window[this.params.onDragMove]:null,
				onExpand : this.params.onExpand?window[this.params.onExpand]:this.onExpand,
				onMouseDown : this.params.onMouseDown?window[this.params.onMouseDown]:null,
				onMouseUp : this.params.onMouseUp?window[this.params.onMouseUp]:null,
				onNodeCreated : this.params.onNodeCreated?window[this.params.onNodeCreated]:null,
				onRemove : this.params.onRemove?window[this.params.onRemove]:null,
				onRename : this.params.onRename?window[this.params.onRename]:null,
				onRightClick : this.params.onRightClick?window[this.params.onRightClick]:null,
				onClick : this.onClick
			}
		};
		var checkMode = this.el.attr('checkMode');
		if(checkMode&&checkMode=="checkbox"){
			setting.check = {
				enable : true,
				chkStyle : checkMode
			};
		}
       	var data =  this.el.attr("items");
		if(data){
			data = $.parseJSON(data);
		}else{
			data = [];
		}
		var treeObj = this.treeEl;
		var treeid = this.treeEl.attr('id');
		if(!treeid){
			treeid = Horn.id();
			this.treeEl.attr('id',treeid);
		}
		if(async){
			$.fn.zTree.init(treeObj, setting);
		}else{
			$.fn.zTree.init(treeObj, setting, data);
		}
		this.treedata = data;
		this.treeObj = $.fn.zTree.getZTreeObj(treeid);
		if(this.el.attr('expandfirst')){
			expandfirst=true;
			this.treeObj.expandAll(true);
		}
		
		var name = this.el.attr('name');
		var expandBtn =  this.el.parent().parent().find("#expand_"+name);
		var unexpandBtn =  this.el.parent().parent().find("#unexpand_"+name);
		var refreshBtn =  this.el.parent().parent().find("#refresh_"+name);
		var searchBtn =  this.el.parent().parent().find("#search_"+name);
		var _this = this;
		expandBtn.bind('click',function(e) { 
			var checkNodes = _this.getCheckedNodes(true);
			if(checkNodes!=null&&checkNodes.length>0){
				$.each(checkNodes,function(index,node){
			        _this.treeObj.expandNode(node.getParentNode(),true);
			    });
			}else{
				_this.expandAll(true);
			}
		});
		unexpandBtn.bind('click',function(e) { 
			var checkNodes = _this.getCheckedNodes(true);
			if(checkNodes!=null&&checkNodes.length>0){
				$.each(checkNodes,function(index,node){
			        _this.treeObj.expandNode(node.getParentNode(),false);
			    });
			}else{
				_this.expandAll(false);
			}
		});
		refreshBtn.bind('click',function(e) { 
			_this.refresh();
		});
			searchBtn.bind('keyup',function(e) {
				
				var nodeList = _this.getNodesByParamFuzzy("name",this.value,null);
				if(this.value!=""){
					$.each(nodeList,function(index,node){
				        node.highlight = true;
				        _this.treeObj.updateNode(node);
				        _this.treeObj.expandNode(node.getParentNode(),true);
				    });
				}else{
					$.each(nodeList,function(index,node){
				        node.highlight = false;
				        _this.treeObj.updateNode(node);
				    });
					_this.expandAll(false);
				}
			
			this.focus();
		});
	},
	getFontCss:function(treeId, treeNode) {  
	    return (!!treeNode.highlight) ? {"font-weight":"bold"} : {color:"#333", "font-weight":"normal"};  
	},
    /**
     * 指定渲染函数
     * @name Horn.ZtreePanel#reRender
     * @function
     * @param {HTMLDomDocument} srcNode 源树节点
     * @param {HTMLDomDocument} treeNodeObj　目标树节点
     * @ignore
     */
	reRender : function(srcNode,treeNodeObj){
	},
	onAsyncSuccess :function(event, treeId, treeNode, msg) {
		if(expandfirst){
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			treeObj.expandAll(true);
		}
	},
    /**
     * 获取树
     * @name Horn.ZtreePanel#getTreeObj
     * @function
     * @ignore
     * @return {ztree object} treeObj
     */
	getTreeObj:function(){
		return this.treeObj;
	},
	 /**
     * 获取 zTree 的全部节点数据
     * @name Horn.ZtreePanel#getNodes
     * @function
     * @example
     * ##获取全部节点数据
     * Horn.getComp("ztree1").getNodes();
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return  Array(JSON)
     * 全部节点数据：
     * 1、Array 仅仅是根节点的集合（默认情况子节点都处于 children 属性下）；
     * 2、如需遍历全部节点需要利用递归，或利用 transformToArray 方法 将数据变成简单的 Array 集合
     * 3、对于异步加载模式下，尚未加载的子节点是无法通过此方法获取的。		     
     */
	getNodes: function(){
		var nodes = this.treeObj.getNodes();
		return nodes;
	},
	 /**
     * 新增节点
     * 如果需要获取数据在 zTree 内的对象，请获取此方法的返回值，请通过 zTree 对象执行此方法。
     * @name Horn.ZtreePanel#addNodes
     * @function
     * @param parentNode 指定的父节点，如果增加根节点，请设置 parentNode 为 null 即可。
     * @param index 索引值
     * @param newNodes 需要增加的节点数据 JSON 对象集合，数据只需要满足 zTree 的节点数据必需的属性即可
     * @param isSilent 设定增加节点后是否自动展开父节点。isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开。
     * @return  Array(JSON)
     * 返回值是 zTree 最终添加的节点数据集合。
     * 如果 newNodes 是单个节点数据 JSON，返回值也是将其包在 Array 内，
     * 请务必记住：返回值中的数据对象 是 newNodes 被 clone 后的，所以绝对不相等！
     * @example
     * ##对于 id = "tree" 的 zTree 增加 3 个根节点
     * var newNodes = [{name:"newNode1"}, {name:"newNode2"}, {name:"newNode3"}];
     * Horn.getComp("ztree1").addNodes(null, newNodes);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * 	function addNode(){
	 *      var zTree = Horn.getComp("ztree1").getTreeObj(),
	 *		isParent = true,
	 *		nodes = zTree.getSelectedNodes(),
	 *		treeNode = nodes[0];
	 *		var newCount = 1;
	 *		if (treeNode) {
	 *			treeNode = Horn.getComp("ztree1").addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"new node" + (newCount++)});
	 *		} else {
	 *			treeNode = Horn.getComp("ztree1").addNodes(null, {id:(100 + newCount), pId:0, isParent:isParent, name:"new node" + (newCount++)});
	 *		}
	 *   }
     */
	addNodes: function(parentNode, index, newNodes, isSilent){
		this.treeObj.addNodes (parentNode, index, newNodes, isSilent);
	},
	 /**
     * 
     * 取消节点的编辑名称状态，可以恢复原名称，也可以强行赋给新的名称
     * @name Horn.ZtreePanel#cancelEditName
     * @function
     * @param newName 重新给定的新名称。
     * @ignore
     * @example
     * Horn.getComp("ztree1").cancelEditName("aaa");
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	cancelEditName: function(newName){
		this.treeObj.cancelEditName(newName);
	},
	 /**
     * 
     * 取消节点的选中状态
     * @name Horn.ZtreePanel#cancelSelectedNode
     * @function
     * @param node 需要取消选中状态的节点。
     * @example
     * ##取消当前第一个被选中节点的选中状态
     * var nodes = Horn.getComp("ztree1").getSelectedNodes();
     * if (nodes.length>0) { 
     * 	Horn.getComp("ztree1").cancelSelectedNode(nodes[0]);
     * }
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	cancelSelectedNode: function(node){
		this.treeObj.cancelSelectedNode(node);
	},
	 /**
     * 
     * 勾选 或 取消勾选 全部节点。[checkMode = "checkbox" 时有效]
     * 此方法不会触发 beforeCheck / onCheck 事件回调函数。
     * @name Horn.ZtreePanel#checkAllNodes
     * @function
     * @param checked  true 表示勾选全部节点,false 表示全部节点取消勾选。
     * @example
     * Horn.getComp("ztree1").checkAllNodes(true);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	checkAllNodes: function(checked){
		this.treeObj.checkAllNodes(checked);
	},
	/**
     * 
     * 勾选 或 取消勾选 单个节点。
     * 此方法可以触发 beforeCheck / onCheck 事件回调函数。
     * @name Horn.ZtreePanel#checkNode
     * @function
     * @param node  需要勾选 或 取消勾选 的节点数据。
     * @param checked  true 表示勾选节点,false 表示节点取消勾选。
     * @param checkTypeFlag Boolean：true表示按照 进行父子节点的勾选联动操作；false表示只修改此节点勾选状态，无任何勾选联动操作
     * @param callbackFlag Boolean： true表示执行此方法时触发 beforeCheck & onCheck 事件回调函数；false表示执行此方法时不触发事件回调函数
     * @example
     * ##勾选当前选中的节点
     * var nodes = Horn.getComp("ztree1").getSelectedNodes();
	 *	for (var i=0, l=nodes.length; i < l; i++) {
	 *		Horn.getComp("ztree1").checkNode(nodes[i], true, true);
	 *	}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	checkNode: function(node, checked, checkTypeFlag, callbackFlag){
		this.treeObj.checkNode(node, checked, checkTypeFlag, callbackFlag);
	},
	/**
     * 
     * 复制节点
     * 3.x 复制节点时进行 clone 操作。如果需要获取数据在 zTree 内的对象，请获取此方法的返回值
     * @name Horn.ZtreePanel#copyNode
     * @function
     * @param targetNode  要复制到的目标节点 JSON 数据。
     * @param node  需要被复制的节点数据,如果复制成为根节点，请设置 targetNode 为 null 即可。
     * @param moveType  复制到目标节点的相对位置。
     * @param isSilent   设定复制节点后是否自动展开父节点。
     * @ignore
     * @example
     * Horn.getComp("ztree1").copyNode(targetNode, node, moveType, isSilent);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	copyNode: function(targetNode, node, moveType, isSilent){
		this.treeObj.copyNode(targetNode, node, moveType, isSilent);
	},
	/**
     * 
	 * 用此方法可以销毁 zTreeObj 代表的 zTree。
     * @name Horn.ZtreePanel#destroy
     * @function
     * @example
     * Horn.getComp("ztree1").destroy();
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	destroy: function(){
		this.treeObj.destroy();
	},
	/**
     * 
     * 设置某节点进入编辑名称状态。
	 *1、如果需要用 js 取消编辑名称状态，请使用 cancelEditName(newName) 方法。。
     *2、可利用此方法让当前正编辑的节点 input 输入框获取焦点。
     *3、请通过 zTree 对象执行此方法。
     * @name Horn.ZtreePanel#editName
     * @function
     * @param node   指定进入编辑名称状态的节点 JSON 数据。
     * @ignore
     * @example
     * var treeObj = Horn.getComp("ztree1").getTreeObj();
     *var nodes = treeObj.getNodes();
     *treeObj.editName(nodes[0]);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	editName: function(node){
		this.treeObj.editName(node);
	},
	/**
     * 
     * 展开 / 折叠 全部节点
     * 此方法不会触发 beforeExpand / onExpand 和 beforeCollapse / onCollapse 事件回调函数
     * @name Horn.ZtreePanel#expandAll
     * @function
     * @param expandFlag  true 表示 展开 全部节点,false 表示 折叠 全部节点。
     * @example
     * Horn.getComp("ztree1").expandAll(true);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Boolean
     * 返回值表示最终实际操作情况；
     * true 表示 展开 全部节点；
     * false 表示 折叠 全部节点；
     * null 表示 不存在任何父节点
     */
	expandAll: function(expandFlag){
		this.treeObj.expandAll(expandFlag);
	},
	/**
     * 
     * 展开 / 折叠 指定的节点;
     * 注：必须选中节点文本，勾选状态无效；
     * 此方法可以触发 beforeExpand / onExpand 或 beforeCollapse / onCollapse 事件回调函数
     * @name Horn.ZtreePanel#expandNode
     * @function
     * @param node  需要 展开 / 折叠 的节点 JSON 数据。
     * @param expandFlag  true 表示 展开 节点,false 表示 折叠 节点
     * @param sonSign  true 表示 全部子孙节点 进行与 expandFlag 相同的操作,false 表示 只影响此节点，对于其 子孙节点无任何影响(sonSign = false 且 expandFirst = expandFlag 时，不会触发回调函数，直接返回)。
     * @param focus    true 表示 展开 / 折叠 操作后，通过设置焦点保证此焦点进入可视区域内, false 表示 展开 / 折叠 操作后，不设置任何焦点。
     * @param callbackFlag   true 表示执行此方法时触发 beforeExpand / onExpand 或 beforeCollapse / onCollapse 事件回调函数,callbackFlag = false 表示执行此方法时不触发事件回调函数。
     * @example
     * ##展开当前选择的第一个节点（包括其全部子节点）
     * var treeObj =  Horn.getComp("ztree1");
	 *	var nodes = treeObj.getSelectedNodes();
	 *	if (nodes.length>0) {
	 *		treeObj.expandNode(nodes[0], true, true, true);
	 *	}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Boolean
     * 返回值表示最终实际操作情况；
     * true 表示 展开 节点；
     * false 表示 折叠 节点；
     * null 表示 不是父节点
     */
	expandNode: function(node, expandFlag, sonSign, focus, callbackFlag){
		this.treeObj.expandNode(node, expandFlag, sonSign, focus, callbackFlag);
	},
	 /**
     * 获取输入框勾选状态被改变的节点集合（与原始数据 checkedOld 对比）
     * @name Horn.ZtreePanel#getChangeCheckedNodes
     * @ignore
     * @function
     * @return {ztree.getChangeCheckedNodes}
     */
	getChangeCheckedNodes: function(){
		return this.treeObj.getChangeCheckedNodes();
	},
	getCheckedNodes: function(checked){
		return this.treeObj.getCheckedNodes(checked);
	},
	/**
     * 
     * 根据节点数据的属性搜索，获取条件完全匹配的节点数据 JSON 对象
     * @name Horn.ZtreePanel#getNodeByParam
     * @function
     * @param key   需要精确匹配的属性名称。
     * @param value  需要精确匹配的属性值，可以是任何类型，只要保证与 key 指定的属性值保持一致即可。
     * @param parentNode   搜索范围，指定在某个父节点下的子节点中进行搜索。
     * @example
     * var treeObj =  Horn.getComp("ztree1");
	 * var node = treeObj.getNodesByParam("id", 1, null);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 匹配精确搜索的节点数据集合;
     * 如无结果，返回 [ ]
     */
	getNodesByParam: function(key, value, parentNode){
		return this.treeObj.getNodeByParam(key, value, parentNode);
	},
	/**
     * 
     * 根据节点数据的属性搜索，获取条件模糊匹配的节点数据 JSON 对象集合
     * @name Horn.ZtreePanel#getNodesByParamFuzzy
     * @function
     * @param key   需要精确匹配的属性名称。
     * @param value  需要精确匹配的属性值，可以是任何类型，只要保证与 key 指定的属性值保持一致即可。
     * @param parentNode   可以指定在某个父节点下的子节点中搜索。
     * @example
     * ##查找 name 包含 "test" 的节点数据
     * var treeObj =  Horn.getComp("ztree1");
	 * var node = treeObj.getNodesByParamFuzzy("name", "test", null);;
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 匹配模糊搜索的节点数据集合;
     * 如无结果，返回 [ ]
     */
	getNodesByParamFuzzy: function(key, value, parentNode){
		return this.treeObj.getNodesByParamFuzzy(key, value, parentNode);
	},
	/**
     * 获取 zTree 当前被选中的节点数据集合
     * @name Horn.ZtreePanel#getSelectedNodes
     * @function
     * @return Array(JSON)
     * 当前被选中的节点数据集合
     */
	getSelectedNodes: function(){
		return this.treeObj.getSelectedNodes();
	},
	/**
     * 
     * 隐藏某个节点。
     * @name Horn.ZtreePanel#hideNode
     * @function
     * @param node 指定被隐藏的节点 JSON 数据
     * @example
     * ##隐藏根节点第一个节点
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
     * treeObj.hideNode(nodes[0]);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	hideNode: function(node){
		this.treeObj.hideNode(node);
	},
	/**
     * 
     * 隐藏一批节点。
     * @name Horn.ZtreePanel#hideNodes
     * @function
     * @param nodes 指定被隐藏的节点 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
     * treeObj.hideNodes(nodes[0].children);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	hideNodes: function(nodes){
		this.treeObj.hideNodes(nodes);
	},
	/**
     * 
     * 移动节点。
     * @name Horn.ZtreePanel#moveNode
     * @function
     * @ignore
     * @param targetNode 要移动到的目标节点 JSON 数据
     * @param node 需要被移动的节点数据
     * @param moveType 指定移动到目标节点的相对位置
     * @param isSilent 设定移动节点后是否自动展开父节点,isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
     * treeObj.moveNode(nodes[0], nodes[1], "inner");
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return JSON 返回值是最终被移动的节点数据，正常情况下与 treeNode 参数完全相同
     */
	moveNode: function(targetNode, node, moveType, isSilent){
		return this.treeObj.moveNode(targetNode, node, moveType, isSilent);
	},
	/**
     * 
     * 强行异步加载父节点的子节点。
     * 已经加载过的父节点可反复使用此方法重新加载。
     * @ignore
     * @name Horn.ZtreePanel#reAsyncChildNodes
     * @function
     * @param targetNode 指定需要异步加载的父节点 JSON 数据
     * @param reloadType reloadType = "refresh" 表示清空后重新加载
     * @param isSilent 设定异步加载后是否自动展开父节点,isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * treeObj.reAsyncChildNodes(null, "refresh");
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	reAsyncChildNodes: function(parentNode, reloadType, isSilent){
		this.treeObj.reAsyncChildNodes(parentNode, reloadType, isSilent);
	},
	/**
     * 刷新 zTree
     * @name Horn.ZtreePanel#refresh
     * @function
     * @return  无
     */
	refresh: function(){
		this.treeObj.refresh();
	},
	/**
     * 
     * 清空某父节点的子节点
     * 1、清空子节点后，父节点会自动变为叶子节点。
     * 2、请勿用此方法清空根节点，如果需要清空根节点，直接初始化 zTree，并且设置初始节点为 null 即可。
     * 3、此方法不会触发任何事件回调函数。
     * @name Horn.ZtreePanel#removeChildNodes
     * @function
     * @param parentNode 需要清空子节点的父节点数据 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getSelectedNodes();
	*if (nodes && nodes.length>0) {
	*	treeObj.removeChildNodes(nodes[0]);
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 将该父节点的子节点数据返回，如果不存在则返回 null
     */
	removeChildNodes: function(parentNode){
		this.treeObj.removeChildNodes(parentNode);
	},
	/**
     * 
     * 删除节点
     * @name Horn.ZtreePanel#removeNode
     * @function
     * @param node 需要被删除的节点数据 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getSelectedNodes();
	*if (nodes && nodes.length>0) {
	*	for (var i=0, l=nodes.length; i < l; i++) {
	*		treeObj.removeNode(nodes[i]);
	*	}
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	removeNode: function(node, callbackFlag){
		this.treeObj.removeNode(node, callbackFlag);
	},
	/**
     * 
     * 选中指定节点
     * @name Horn.ZtreePanel#selectNode
     * @function
     * @param node 需要被选中的节点数据 JSON 数据
     * @param addFlag true 表示追加选中，会出现多点同时被选中的情况, false 表示单独选中，原先被选中的节点会被取消选中状态
     * @param isSilent true 选中节点时，不会让节点自动滚到到可视区域内, false （默认）表示选中节点时，会让节点自动滚到到可视区域内
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
	*if (nodes && nodes.length>0) {
	*	treeObj.selectNode(nodes[0]);
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	selectNode: function(node, addFlag,isSilent){
		this.treeObj.selectNode(node, addFlag,isSilent);
	},
	/**
     * 
     * 禁用 或 解禁 某个节点的 checkbox / radio 
     * 1、节点的 checkbox / radio 被禁用后，无法勾选或取消勾选。
     * 2、请不要直接修改已加载节点的 treeNode.chkDisabled 属性。
     * @name Horn.ZtreePanel#setChkDisabled
     * @function
     * @param node 需要禁用 或 解禁 checkbox / radio 的节点数据 JSON 数据
     * @param disabled true  true 表示禁用 checkbox / radio,  false 表示解禁 checkbox / radio
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getSelectedNodes();
	*if (nodes && nodes.length>0) {
	*	for (var i=0, l=nodes.length; i < l; i++) {
	*      treeObj.setChkDisabled(nodes[i], true);
	*   }
	*}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	setChkDisabled: function(node, disabled, inheritParent, inheritChildren){
		this.treeObj.setChkDisabled(node, disabled, inheritParent, inheritChildren);
	},
	/**
     * 
     * 设置 zTree 进入 / 取消 编辑状态。
     * @name Horn.ZtreePanel#setEditable
     * @ignore
     * @function
     * @param editable true 表示进入 编辑状态,false 表示取消 编辑状态
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * treeObj.setEditable(true);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return
     */
	setEditable: function(editable){
		this.treeObj.setEditable(editable);
	},
	/**
     * 
     * 显示某个被隐藏的节点。
     * @name Horn.ZtreePanel#showNode
     * @function
     * @param node 指定被显示的节点 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var node = treeObj.getNodeByParam("isHidden", true);
	 *if (node) {
	 *  treeObj.showNode(node);
	 *}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	showNode: function(node){
		this.treeObj.showNode(node);
	},
	/**
     * 
     * 显示一批已经被隐藏的节点。
     * @name Horn.ZtreePanel#showNode
     * @function
     * @param nodes 指定被显示的节点 JSON 数据集合
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodesByParam("isHidden", true);
	 *if (nodes) {
	 *  treeObj.showNodes(nodes);
	 *}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	showNodes: function(nodes){
		this.treeObj.showNodes(nodes);
	},
	/**
     * 
     * 将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。(免去用户自行编写递归遍历全部节点的麻烦)
     * @name Horn.ZtreePanel#transformToArray
     * @function
     * @param nodes 需要被转换的 zTree 节点数据对象集合 或 某个单独节点的数据对象
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.transformToArray(treeObj.getNodes());
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * 转换后的简单 Array 数据格式
     */
	transformToArray: function(nodes){
		return this.treeObj.transformToArray(nodes);
	},
	/**
     * 
     * 将简单 Array 格式数据转换为 zTree 使用的标准 JSON 嵌套数据格式。
     * @name Horn.ZtreePanel#transformTozTreeNodes
     * @function
     * @param nodes 需要被转换的简单 Array 格式数据 或 某个单独的数据对象
     * @example
     * var simpleNodes = [
     * {"id":1, "pId":0, "name":"test1"},
     * {"id":11, "pId":1, "name":"test11"},
     * {"id":12, "pId":1, "name":"test12"},
     * {"id":111, "pId":11, "name":"test111"}
     * ];
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.transformTozTreeNodes(simpleNodes);
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return Array(JSON)
     * zTree 使用的标准数据，子节点都存在于父节点数据的 children 属性中；
     * 如果 simpleNodes 是一个 JSON 对象，则被简单封装成长度为 1 的数组。
     */
	transformTozTreeNodes: function(simpleNodes){
		return this.treeObj.transformToArray(simpleNodes);
	},
	/**
     * 
     * 更新某节点数据，主要用于该节点显示属性的更新。
     * @name Horn.ZtreePanel#updateNode
     * @function
     * @param node 指定需要更新的节点 JSON 数据
     * @example
     * var treeObj =  Horn.getComp("ztree1");
     * var nodes = treeObj.getNodes();
	 *	if (nodes.length>0) {
	 *		nodes[0].name = "test";
	 *		treeObj.updateNode(nodes[0]);
	 *	}
     * 例子，请参考ztree官网(http://www.ztree.me/v3/api.php)
     * @return 无
     */
	updateNode: function(node, checkTypeFlag){
		this.treeObj.updateNode(node, checkTypeFlag);
	},
	getCheckedNodes:function(){
		return this.treeObj.getCheckedNodes();
	}
});

Horn.regUI("div.h_ztree",Horn.ZtreePanel);

function jresplusUIZtreeOnExpand(event, treeId, treeNode){
	$("#"+treeId).children("li").children("ul").removeAttr("style"); ;
}