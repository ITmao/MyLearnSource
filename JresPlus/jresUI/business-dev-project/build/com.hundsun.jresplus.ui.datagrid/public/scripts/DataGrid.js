/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: DataGrid.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：DataGrid组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-07-31    zhangsu         BUG #7336 dataGrid：列头的宽度与数据列宽度应一致
 * 2014-07-31    zhangsu         BUG #7332 dataGrid：当行号较大时，列宽被相应撑开，不会被阻挡 新增属性numberColWidth
 * 2014-07-31    zhangsu         BUG #7335 dataGrid：frozen=字典列被冻结，也能翻译成功
 * 2014-08-01    zhangsu         BUG #7337 dataGrid：加载静态数据时，"pageConfig"不应该产生影响
 * 2014-08-04    zhangsu         BUG #7336 dataGrid：列头的宽度与数据列宽度应一致
 * 2014-08-13    wangyb10555         STORY #9387和STORY #9387添加对表格头的支持
 * 2014-08-18    wangyb10555         添加toolbar的addButton、hideButton、showButton方法
 * 2014-09-01	王玉豹					STORY #9547 [研发中心/内部需求][JresPlus][UI]Datagrid静态数据无法实现分页 
 * 2014-09-14	王玉豹 				STORY #9673 [研发中心/内部需求][JresPlus][UI]datagrid组件中当每一个数据项中的值为数字0的时候无法正常显示，直接显示为“” 
 * 2014-09-23	王玉豹				[经纪业务事业部/胡志武][TS:201409230012]-JRESPlus-ui--DataGrid在ie8浏览器上通过DataGrid获取数据通过getSelecteds (
 * 2014-10-14	王玉豹				STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
 * 2014-10-15 wangyb10555   BUG #7763 #9422datagrid对toolbar增加按钮，无法添加cls
 * 2014-10-15 wangyb10555   BUG #7761 api文档中datagrid新增属性没有添加
 * 2014-10-15 zhangsu       STORY #9800 [经纪业务事业部/胡志武][TS:201409230015]-JRESPlus-ui-DataGrid正在请求数据的时候，表现是这样的
 * 2014-10-31	wangyb10555	STORY #10163 [研发中心/内部需求][JresPlus][UI]datagrid组件中动态加载的表格，当初始化加载完成后后台增加数据量，表格高度没有发生变化 
 * 2014-12-04	wangybao10555	STORY #10413 [海外发展部-胡琦][TS:201412040040]-JRESPlus-ui-目前datagrid控件不支持金额、日期格式，需要支持。
 * 2014-12-22	wangyb10555		STORY #10591 [TS:201412180595][财富管理事业部/陈为]-JRESPlus-ui-1.JresUI框架中datagrid控件分页时，如果翻到第】
 * 2015-1-26	wangyb10555		STORY #10808 [海外发展部-胡琦][TS:201501230291]-JRESPlus--datagrid控件数据列宽支持列宽自适应
 * 2015-2-26	wangyb10555		STORY #10954 [财富管理事业部-吴丰辉][TS:201502150029]-JRESPlus--datagrid希望支持静态字典
 * 2015-2-28	wangyb10555		STORY #10955 [财富管理事业部-吴丰辉][TS:201502150030]-JRESPlus--datagrid支持多列冻结某些场景单列冻结不够用】
 * 2015-3-10	wangyb10555		STORY #11017 [财富管理事业部/吴丰辉][TS:201503090285]-JRESPlus-ui-2. datagrid查询不到数据时，分页条信息没有修改、数】
 * 2015-04-02   zhangsu         STORY #11209 [财富管理事业部/蔺茂旺][TS:201504020254]dataGrid 数据字典列翻译的提示不对
 * 2015-04-17	wangyb10555 	STORY #11316 [财富管理事业部/徐益江][TS:201504160052]-jresplus-ui-2、datagrid控件，当列宽超出可见宽度后出来横向滚动条】
 * 2015-05-04	wangyb10555		STORY #11407 [财富管理事业部/蔺茂旺][TS:201504240187]-JRESPlus-ui-1。在grid，冻结列中，动态添加的内容，滚动条拖到最后，g】 
 * 2015-08-25   zhangsu          STORY #12303 【TS:201507290163-JRESPlus-资产管理事业部-张翔-datagrid是否可以修改下，分页页码，每页几行可以手动输
 * 2015-09-09   zhangsu        BUG 11332跳转到第几页中填入值，移开焦点后，控制台中会显示发送了n条请求
 * 2015-09-10   zhangsu       BUG11302建议每页显示条数是个下拉框，客户使用会更加方便，也能避免输入小数出现的一系列问题
 * 2015-09-21   周智星        STORY #13244 【TS:201509210013-JRESPlus-资产管理事业部-张翔-2、1.0.18版本对应datagrid对应分页选择出现错乱】 - JRES
 * 2015-09-22   周智星        BUG 11640 需求13244datagrid对应分页选择显示框中，请求多次时，会选中多条分页
 * 2015-09-28   周智星        STORY #12660 【TS:201508240145-JRESPlus-财富管理事业部-王瑞明-若在查询框中通过 tab_panel 控件设置多个 Tab,分页则除第一次选择的TAB页外的其他全选按钮会失效 】
 * 2015-10-27   刘龙          STORY #14210 需求12660tabpanel多个页签有datagrid组件，直接点击页签2的全选，会把页签1的全选框也选中
 * 2015-11-06   周智星        STORY 需求#14698 【TS:201511060012-JRESPlus-资产管理事业部-张翔-问题1：选中datagrid中某条数据,然后调load方法，原来选中的内容还在
 * 2015-11-6    刘龙               14700 【TS:201511060024-JRESPlus-财富管理事业部-王瑞明-对于DataGrid 控件的“pageConfig”属性，目】
 * 2015-12-01   周智星         需求 #14790 【TS:201511120068-JRESPlus-财富管理事业部-虞凯 重新选择每页显示条数，点击下一页，页码出错
 * 2016-1-11    刘龙             需求16324 【TS:201601070223-JRESPlus-财富管理事业部-陈为-2. datagrid控件frozen属性固定列之后，标题和】
 * 2016-2-17    刘龙            需求 17276 【TS:201602170281-JRESPlus-财富管理事业部-王瑞明-最近在使用JRES 框架进行开发过程中，发现使用了数据字典的】
 * 2016-3-28    刘龙           需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
 *-----------------------------------------------------------------------
 */
/**
 * @description 带分页栏、工具栏、异步数据加载、锁定列的Grid
 * @name Horn.DataGrid
 * @class
 * 数据列表展现组件
 * --带分页栏、工具栏、异步数据加载、锁定列的Grid
 * @extends Horn.Base
 * @example
 */
	/**
	 * @description 组件唯一标识。
	 * @property id
	 * @name Horn.DataGrid#<b>id</b>
	 * @type String
	 * @default ""
	 * @example
	 * 无
	 */
	/**
	 * @description 组件名称。通过Horn.getComp(name)来获取组件。
	 * @property name
	 * @name Horn.DataGrid#<b>name</b>
	 * @type String
	 * @default ""
	 * @example
	 * ”name":"dataGridName"
	 * Horn.getComp("dataGridName");
	 */
	/**
	 * @ignore
	 * @description 组件标题。
	 * @property title
	 * @name Horn.DataGrid#<b>title</b>
	 * @type String
	 * @default ""
	 * @example
	 * 无
	 */
	/**
	 * @description 列表初始化数据。加载的静态数据,可以使用内置的分页栏，支持前端数据分页特性
	 * @property data
	 * @name Horn.DataGrid#<b>data</b>
	 * @type array
	 * @default ""
	 * @example
	 * "data":$!somedata
	 * somedata为springMVC当中Model中数据集的键
	 */

	/**
	 * @description 组件启用单选/多选选择框,当值为single时为单选列表，仅能够选择一条数据；当其值为multi时为多选列表，可同时选择多条数据。
	 * @property selectModel
	 * @name Horn.DataGrid#<b>selectModel</b>
	 * @type String
	 * @default 无
	 * @example
	 * "selectModel":"single",单选列表
	 * "selectModel":"multi",多选列表
	 */
     
   /**
    * @ignore
	 * @description 序号列的列宽度配置
	 * @property numberColWidth
	 * @name Horn.DataGrid#<b>numberColWidth</b>
	 * @type number
	 * @default 20px
	 * @example 无
	 */

	/**
	 * @description 组件是否自动加载url指向的数据集的控制开关。当autoLoad为true时会自动ajax请求url，并加载请求到的数据。
	 * @property autoLoad
	 * @name Horn.DataGrid#<b>autoLoad</b>
	 * @type boolean
	 * @default false
	 * @example
	 * "autoLoad":true,"url":"/data/get_data.htm"
	 */

	/**
	 * @description 组件初始化加载数据列表的基础参数,基础参数每次请求时都会传入。
	 * @property baseParams
	 * @name Horn.DataGrid#<b>baseParams</b>
	 * @type object
	 * @default 无
	 * @example
	 * 无
	 */
	/**
	 * @description autoWidth可以配置在items中的某一项，使这一列成为根据内容自适应的宽度
					autoWidth可以配置在表上，使当前所有的列都成为根据内容的自适应
					表头也作为其所在列的内容，也会计算长度
					
					如果当前列配置了固定宽又配置了autoWidth则固定宽配置生效（固定宽配置的优先级最高）
					如果当前列为配置了renderer或者dataType或者buttons等会变更数据长度的属性，则autoWidth配置不可使用，请直接使用width配置固定宽
	 * @property autoWidth
	 * @name Horn.DataGrid#<b>autoWidth</b>
	 * @type boolean
	 * @default false
	 * @example
	 * 无
	 */
	/**
	 * @description 表格的列数据模型对象。控制数据列表的列显示状态，包含许多可配置参数。
	 * @property items
	 * @name Horn.DataGrid#<b>items</b>
	 * @type object
	 * @default 无
	 * @example
	 *<table>
	 *	<tr><td>属性名</td>	<td>类型</td>	<td>说明</td>	<td>默认值</td></tr>
		<tr><td>name</td>	<td>sring</td>		<td>列字段名</td>	<td>--</td>	</tr>
		<tr><td>text</td>		<td>string	</td>	<td>列标题</td>	<td>--</td>	</tr>
		<tr><td>hAlign</td>	<td>string	</td>	<td>设置列标题居左、居中、居右显示；分为："left"，"center"，"right"</td>	<td>center</td>	</tr>
		<tr><td>tAlign</td>	<td>string</td>	<td>设置单元格内容居左、居中、居右显示分为："left"，"center"，"right"</td>	<td>left</td>	</tr>
		<tr><td>hidden</td>	<td>boolean</td>	<td>是否隐藏列</td>	<td>false</td>	</tr>
		<tr><td>renderer</td>	<td>	func</td>	<td>列渲染函数,函数参数:Object,例如{val : String ,rowdata : Object,alldata : Array,table : this,rowidx :num,tdidx : num,tr : jquery,td : jquery}}，其中rowData代表行数据，allData代表所有行的数据，table代表当前组件的对象，rowidx代表行索引，tdidx代表单元格的索引，tr代表行的jquery对象，td代表单元格的jquery的对象</td>	<td>--</td>	</tr>
		<tr><td>dictName</td>	<td>string</td>	<td>列翻译的字典条目名称</td>	<td>--</td>	</tr>
		<tr><td>width</td>	<td>numbe</td>	<td>列宽	px</td>	<td>--</td>	</tr>
		<tr><td>buttons</td>	<td>array</td>	<td>操作列, 设置此属性后，属性值会被渲染成多个链接</td><td>--</td>	</tr>
		</table>
		新增：
		format      {String}   列格式化时的格式 ，需要与dataType属性结合使用，单独设置此值不生效。1.dataType="DATE"时，format格式形如"yyyyMMdd"；2.dataType="AMOUNT"时，format格式形如",.00"，其中逗号控制是否显示千位分隔符，点号控制小数位数。
		dataType    {String}   列格式化的类型，目前只支持日期和金额两种类型，日期：dataType="DATE",金额dataType="AMOUNT"。1.如果不设置format属性，"DATE"默认显示格式为："yyyy-MM-dd HH:mm:ss"，"AMOUNT"默认显示格式为："0,000.00"。2.dataType="DATE"时，待格式化列的数据若为字符串，只能是6位，形式如："20130101";若为非字符串形式，一律按GMT时间进行格式化，形式如：1137075575000。
		items		{object}   增加对静态字典的支持，注意：1.items不能和dictName同时使用！2.如果字典无法成功翻译，则保持原值不变；
		
			使用方法：{
			"name":"name6",
			"text":"字段6",
			"hAlign":"right",
			"tAlign":"right",
			"items":[{"label":"杭州总部","value":"0"},{"label":"b","value":"2"},{"label":"c","value":"3"}]
			}
		
		新增：
		autoWidth {boolean} 用于配置是否使用自适应宽度（使用及注意事项请参考）Horn.DataGrid#<b>autoWidth</b>
	 * "items":[{"name":"name1","text":"列名","hAlign":"center","tAlign":"left","hidden":false,"renderer":"func","dictName":"dict","width":200}]
	 *  *renderer属性用法示例：
	 *{"name":"scanType2","text":"扫描类别","renderer":"domrender","hidden":false,"width":"350"}
	 *
	 *#jscode()
	 *
	 *  function domrender(obj){
	 *    var val = obj.val;
	 *    if(val==0){
	 *    	return "返回想要翻译的值";
	 *    }else{
	 *    	return val;
	 *    }
	 *  }
	 *#end
	 */
	/**
	 * @description 数据请求的地址。请求该地址后返回的数据为符合要求的json数据对象。
	 * @property url
	 * @name Horn.DataGrid#<b>url</b>
	 * @type string
	 * @default ""
	 * @example
	 *后台返回的数据格式例子：
	 *total：总条数
	 *rows :数据集[分页场景存在，返回的数据结构]
 	*{"total":200,
 	* "rows":[{"id":"1","name":"zhangsan"},
        {"id":"2","name":"zhangsan"},
        {"id":"3","name":"zhangsan"}]
	 */
	/**
	 * @description 列表是否配置序号列的开关。默认不配置序号列。
	 * @property numbercolumn
	 * @name Horn.DataGrid#<b>numbercolumn</b>
	 * @type boolean
	 * @default false
	 * @example
	 * 无
	 */
	 	/**
	 * @description datagrid的标题展示。
	 * @property title
	 * @name Horn.DataGrid#<b>title</b>
	 * @type string
	 * @default 无
	 * @example
	 * 无
	 */
	 	/**
	 * @description datagrid的titleButton显示。
	 * @property buttons
	 * @name Horn.DataGrid#<b>buttons</b>
	 * @type object
	 * @default 无
	 * @example
	 * 默认的图标样式有add/edit/query/del/save/refresh/open
	 * 还可以在按钮中关联menu组件，配置方式为，"refmenu":"test"//该按钮关联的menu组件（菜单）
	 * "buttons":[{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"},{"label":"测试","name":"test","cls":"del"}]
	 * 默认提供了add,edit,del,save,query,refresh,open供选择
	 * @example
	 * "buttons":[{"label":"新增","cls":"add","refmenu":"test11","event":"add()"},
	 *	              {"label":"修改","cls":"edit","refmenu":"test11","event":"edit()"},
	 *				  {"label":"删除","cls":"del","refmenu":"test11"},
	 *				  {"label":"保存","cls":"save","refmenu":"test11"},
	 *				  {"label":"查询","cls":"query","refmenu":"test11"},
	 *				  {"label":"刷新","cls":"refresh","refmenu":"test11"},
	 *				  {"label":"打开","cls":"open","refmenu":"test11"}
	 *				  ]
	 */
	/**
	 * @description 配置表格的高度的属性，默认是自适应宽高。
	 * @property height
	 * @name Horn.DataGrid#<b>height</b>
	 * @type number
	 * @default 无
	 * @example
	 * 无
	 */
	/**
	 * @description 配置表格的宽度的属性，默认是自适应宽高。
	 * @property width
	 * @name Horn.DataGrid#<b>width</b>
	 * @type number
	 * @default 无
	 * @example
	 * 无
	 */
	/**
	 * @description 如果有绑定表单，就会把表单参数提交到后台。
	 * @property bindFormName
	 * @name Horn.DataGrid#<b>bindFormName</b>
	 * @type String
	 * @default 无
	 * @example
	 * "bindFormName":"formName"
	 */
	/**
	 * @description 配置点击行选中的开关。默认不开启。配置开启后当点击列表行会主动选中这一行的数据而不需要点击选择框。
	 * @property rowSelect
	 * @name Horn.DataGrid#<b>rowSelect</b>
	 * @type boolean
	 * @default false
	 * @example
	 * "rowSelect":true可以开启行选中
	 */
	/**
	 * @description 配置是否启用分页栏的开关，默认不开启分页栏。同时可以支持静态数据和动态加载，以及loadData的分页
	 * @property hasPage
	 * @name Horn.DataGrid#<b>hasPage</b>
	 * @type boolean
	 * @default false
	 * @example
	 * "hasPage":true可以配置开启分页栏,
	 * 暂时对于静态数据不提供分页栏！
	 */
	/**
	 * @description 配置分页栏的参数，仅在开启分页栏的时候有效。
	 * @property pageConfig
	 * @name Horn.DataGrid#<b>pageConfig</b>
	 * @type object
	 * @default 无
	 * @example
	 * "pageConfig":{"pageSize":20,"pageNo":3}
	 * 其中pageSize表示每页的显示的数据条数;pageNo为当前显示页数，当pageNo值大于实际总页数时，自动取实际最大页码数
	 */
	/**
	 * @description 1.冻结列的配置项，支持单列冻结和多列冻结，冻结的数据列在横向滚动时保持位置不变。
	 * 2.此属性支持IE8及以上，不支持IE7。3.不建议配置超过三列的冻结内容（冻结列过多会影响datagrid渲染的效率和性能！）,不建议在弹出窗口(window组件)上使用
	 * 4.冻结列区域上不支持单击、双击事件的触发。
	 * @property frozen
	 * @name Horn.DataGrid#<b>frozen</b>
	 * @type string或者array
	 * @default 无
	 * @example
	 * “frozen”:["name1","name2"]，可以冻结items当中name属性配置为name1,name2的那两列列数据。
	 */
/**
 * @description 事件属性，所有的事件都需要在此配置
 * @name Horn.DataGrid#<b>events</b>
 * @type Array 
 * @default 无
 * @example
 *  "events":[{      "event":"rowClick","function":"testRowClick"},
 *		             {"event":"rowDblclick","function":"testRowDblClick"},
 *					 {"event":"beforeLoad","function":"testbeforeLoad"},
 *					 {"event":"loadSuccess","function":"testloadSuccess"},
 *					 {"event":"loadError","function":"testloadError"}]
 */

/**
 * 行单击事件<br/>
 * @name Horn.DataGrid#<b>rowClick</b>
 * @param {object} rowdata     当前被点击的一行数据
 * @event
 * @example 无
 * 
 */
/**
 * 行双击事件<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @name Horn.DataGrid#<b>rowDblclick</b>
 * @param {object} rowdata     当前被点击的一行数据
 * @event
 * @example 无
 * 
 */
/**
 * 异步数据加载前<br/>
 * @name Horn.DataGrid#<b>beforeLoad</b>
 * @param {jquery object} comp     控件对象
 * @param {object} param       请求的参数
 * @return   如果返回false则取消请求执行
 * @event
 * @example
 * 
 */
/**
 * 异步数据加载成功,且表格初始化后<br/>
 * @name Horn.DataGrid#<b>loadSuccess</b>
 * @param {jquery object} comp      控件对象
 * @param {Array} resultData       返回的结果集
 * @event
 * @example  无
 * 
 */
/**
 * 异步数据加载成功，但数据格式错误时（数据为空）逻辑错误，非ajax请求失败触发<br/>
 * @name Horn.DataGrid#<b>loadError</b>
 * @param {jquery object} comp      控件对象
 * @param {Object} resultData    返回的结果集
 * @event
 * @example  无
 * 
 */
/**
 * @description isDragColumn的表格列是否可以拖动，默认false</br>
 * (注意！如果为true,页面上就必须引入jquery.resizableColumns.mini.js文件，name属性必须填写，否则无法拖动,如果表格自定义了宽度，拖动功能失效。表格不能放在自定义宽度的容器里,如,window组件和tabPanel组件等)
 * @property isDragColumn
 * @name Horn.DataGrid#<b>isDragColumn</b>
 * @ignore
 * @type Boolean
 * @default false
 * @example
 * 无
 */
var optGridId = null;
Horn.DataGrid = Horn.extend(Horn.Base,{
	COMPONENT_CLASS : "DataGrid",
	id:"dyncGrid",
	name:"dyncGrid",
	title:"",
	data :null,
	selectModel:"normal",
	autoLoad : false,
	baseParams:{},
	items:[],
	url:"",
	emptyMsg:"",
	numbercolumn:false,
	rowSelect:false,
	hasPage:false,
	toolbar:null,
	pagebar:null,
	frozen:null,
	frozenObj:null,
	clickFlag:null,
	td_number : '<td style="width:40px;"><div style="TEXT-aLIGN: center;width:40px;">{count}</div></td>',
	td_check :'<td style="width:36px;"><div class="hc-datagrid-cell-check" style="TEXT-aLIGN: center;width:36px;"><input type="{CHECK_TYPE}"  id="{CHECKBOX_ID}"></div></td>',
	td : '<td style="display:{XDATAGRID_TD_HIDDEN};WIDTH:{XDATAGRID_TD_WIDTH}px"><div  class="hc-datagrid-cell" style="TEXT-ALIGN:{XDATAGRID_TD_ALIGN};WIDTH:{XDATAGRID_DIV_WIDTH}px;overflow: visible;">{XDATAGRID_TD_VAL}</div></td>',
	tr : '<tr id="{TR_ID}"  class="{TR_CLASS}">',
	tr_end : '</tr>',
	row_class : 'u-table-bg',
	pageinfo : {totalPagesText:'页，每页{pagesize}条,共{pages}页',displayMsg:'当前显示{from}到{to}，共{total}条记录'},
	reqPageNo:1,
	reqPageSize:10,
	delimiter:",",
	selecteds : [],
	lastSelect : null,
	allCheckboxId : "allcb_datagrid_id",
	numberColWidth : 40,
	bindFormName : null,
	/**
	 * @ignore
	 */
	initParams : function(config){
		var sdv = setDefaultValue;
		sdv(config,"numbercolumn",false);
		sdv(config,"selectModel","normal");
		sdv(config,"items",[]);
		sdv(config,"hasPage",false);
		sdv(config,"rowSelect",false);
		sdv(config,"autoLoad",false);
		Horn.apply(this,config);
		
		//STORY #10955 [财富管理事业部-吴丰辉][TS:201502150030]-JRESPlus--datagrid支持多列冻结某些场景单列冻结不够用】
		if(!config.frozen){
			config.frozen = [];
		}
		if(typeof config.frozen == "object"){
			this.frozenObjs = [];
			for(var j=0;j<config.frozen.length;j++){
				for(var i=0;i<config.items.length;i++){
					var temp = config.items[i];
					if(temp.name == config.frozen[j]){
						this.frozenObjs.push(temp);
					}
				}
			}
			this.frozenObj = this.frozenObjs[0]
		}else{
			//获取冻结列
			for(var i=0;i<config.items.length;i++){
				var temp = config.items[i];
				if(temp.name == config.frozen){
					this.frozenObj = temp;
					this.frozenObjs = [this.frozenObj];
					break;
				}
			}
		}
		
		//初始化pageConfig配置
		if(!this.params.pageConfig){
			this.params.pageConfig = {};
		}
		if(this.params.bindFormName){
			this.bindFormName = this.params.bindFormName;
		}
		if(this.params.id&&this.params.id!=""){
			this.id = this.params.id;
		}else{
			if(this.params.name&&this.params.name!=""){
				this.id = this.params.name;
			}
		}
		//分页对象
		if(this.hasPage&&this.hasPage==true){
			this.createPagebar();
			
		}
		//设置宽高
		if(config["width"])
			this.setWidth(config["width"]);
		
		if(config["height"])
			this.setHeight(config["height"]);
		  
		//this.frozen = this.frozenObj;
	},
	/**
	 * @ignore
	 * 控件初始化配置项
	 */
	init : function(dom){
		this.name = this.params["name"]||this.name;
		Horn.DataGrid.superclass.init.apply(this,arguments) ;
		this.initParams(this.params);
		var _this = this;
		//events
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
		
		this.dataTable = $("#data_"+this.id).children("table");
		this.head_dataTable = $("#head_"+this.id);
		//表格的标题
		this. title = this.params["title"] ||null;
		this. titleEl = null ;
		if(this .title ){
			this. titleEl = $("#wrap_"+this.id).children("div.u-datagrid-header").children("h4");
		}
		
		this.ths = this.head_dataTable.children("tbody").find("td");    //所有表头
		this.trs = this.dataTable.children("tbody").children("tr");   //所有行
		
		this.frozenTable = $("#freeze_data_"+this.id).children("table");
		this.fro_trs = this.frozenTable.children("tbody").children("tr"); //所有frozen data行
		this.fro_ths = $("#freez_head_"+this.id).children("tbody").find("td");//frozen 表头
		//ajax load data
		
		 //将多余的冻结列添加到现有冻结列上：表头
		 //竟然有四个表格，wtf
		 var fro_header = $("#freez_head_"+this.id);
		 var header = $("#head_"+this.id);
		 for(var h=1;this.frozenObjs&&h<this.frozenObjs.length;h++){
			 var tmp = this.frozenObjs[h];
			 var tmptd = header.find("div[name="+tmp.name+"]").parent();
			 tmptd.appendTo(fro_header.find("tr"));
			 header.find("[flag=frozen]").after(tmptd.clone().attr("flag","frozen")).removeAttr("flag")
		 }
		 
		 this.fro_header = fro_header;
		 this.header = header;
		 //清理
		 
		
		//处理请求的页码数
		this.processReqConf()
		this.initToolbarEvents();
		
		if(this.params["autoLoad"] && this.params["autoLoad"]==true){
			this.autoLoad = this.params["autoLoad"];
			this.load();
		}else if(this.data){   //static data
			this.loadFlag = "staticData";
//			this.result = this.data["rows"]?this.data["rows"]:this.data;
			this.storgedData = this.data["rows"]?this.data["rows"]:this.data;
			this.reqPage(this.reqPageNo,this.reqPageSize);
//			this.result = this.storgedData.slice((pageNo-1)*pageSize,pageNo*pageSize);
//			_this.loadRecords(this.result);
//			
//			this.setTHHidden();
//			this.initScroll();
////			this.el.find("#page_"+this.id).remove();
//     	     //pagebar
//			
//             _this.staticInitPagebar();
//             
//            //被选中的数据对象init
//     	   _this.initSelect();
//            //bind row click
//            _this.bindClickEvent(_this.rowclick,"click");
//            //bind rowdblclick
//            _this.bindClickEvent(_this.rowdblclick,"dblclick");
//            //bind initSelectEvents
//            _this.initSelectEvents();
//            //bind rowhignlight
//            _this.initHignLightEvent();
//            _this.columnRender();
			
		}else{
			this.pageBtnDisabled(true);
		}
		
        
	},
	processReqConf :function(){
		var pageNo = this.params["pageConfig"]["pageNo"];
		var pageSize = this.params["pageConfig"]["pageSize"];
		var _pageSizeObj = $("#pageSize_"+this.id);
		if(pageSize){
			_pageSizeObj.val(pageSize);
		}
		this.reqPageNo = this.reqPageNo?this.reqPageNo:pageNo;
		this.reqPageSize=this.reqPageSize?this.reqPageSize:pageSize;
	},
	/**
	    * @description 启用/禁用 表格里的按钮栏的某个操作按钮
	    * @function
	    * @name Horn.DataGrid#setButtonDisabled
	    * @param {string} name        按钮名称，记得按钮的name是唯一
	    * @param {boolean} disabled   true为按钮不可用，false为可用<br>
	    * @return void
	    * @example
	    * #jscode()
	    * 	Horn.getComp("datagridName").setButtonDisabled("delBtn",true);
	    * #end
	    */
	setButtonDisabled : function(name,disabled){
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul").children("li");
		titleButtons.each(function(index,trdom){
			var a = $(this).children("a");
			var btnName = a.attr("name");
			if(btnName == name){
				if(disabled){
					a.addClass("f-disabled")
					a.attr("onclick","javascript:return false;");
				}else{
					a.removeClass("f-disabled")
					a.attr("onclick",a.attr("event"));
				}
				return;
			}
			
		});
	},
	initToolbarEvents : function(){
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul").children("li");
		titleButtons.each(function(index,trdom){
			var a = $(this).children("a");
			if(a.hasClass("f-disabled")){
				a.attr("onclick","javascript:return false;");
			}
		});
	},
	/**
	 * @ignore
	 */
	staticInitPagebar : function(){
 	   if(this.hasPage){
		   var total = this.storgedData.length;
		   if(this.pagebar){
			   this.pagebar.setTotalCount(total);
			   this.pagebar.calPage_(this.reqPageNo,this.reqPageSize,total);
			   this.setPageInfo();
		   }
		   this.reqPageNo = this.reqPageNo+1;
	   }
	},
	/**初始加载数据的时候自动计算行高
	 * **行高的最小值22px
	 * @ignore
	 */
	//STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
	reCalRowHeight :function(){
		var minH = 22;
		var h = this.params.height;
		if(!h) return;	//如果没有配置hegiht，则不计算高度而是自适应高度 
		
		var pageSize = this.currentPageSize ;
		
		var calH = minH * pageSize < h ? h/pageSize : 22;
		
		
		//调整三种高度
		//不再重置行高
//		$("#freez_tbody_"+this.id+" tr").height(calH);
//		$("#body_"+this.id+" tr").height(calH);
		
//		$("#freez_tbody_"+this.id).height(h);
//		$("#body_"+this.id).height(h);
		
//		$("div.hc-datagrid-body").height(h)
		this.setHeight(h);
	},
	initSelectEvents : function(){
		var cnt=1;
		var _this = this;
		//checkall dom
		var _allCheck=$("#"+this.allCheckboxId);
		
		this.trs.each(function(index,trdom){
			var tr = $(trdom),
			input = tr.find("#cb_"+_this.id+"_"+cnt);
			cnt++;
			if(_this.rowSelect == false){           
				input.change(function(){
	    			if(this.checked){
	    				_this.selectRow(index+1,tr);
	    			}else{
	    				_this.unSelectRow(index+1,tr);
	    			}
	    		});
			}else{
				var _clickFlag=this.clickFlag;
	    		tr.bind('click',function(e) {    
	    			clearTimeout(_clickFlag);
	    			_clickFlag=setTimeout(function(){
	    				if($.isEmptyObject(_this.selecteds)){
	    					 if(_this.frozenObj){
	    						 $(_this.fro_trs[index]).find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
	    						 $(_this.fro_trs[index]).addClass("u-table-selected");
	    					 }
	        				_this.selectRow(index+1, tr);
	        			}else{
	        				if(!_this.selecteds.hasOwnProperty(index+1)){
	        					if(_this.frozenObj){
	        						 $(_this.fro_trs[index]).find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
		    						 $(_this.fro_trs[index]).addClass("u-table-selected");
		    					 }
	        				    _this.selectRow(index+1, tr);
	    					 }else{
	    						 if(_this.frozenObj){
	    							 $(_this.fro_trs[index]).find("#cb_"+_this.id+"_"+(index+1)).prop("checked", false);
		    						 $(_this.fro_trs[index]).removeClass("u-table-selected");
		    					 }
	    						 _this.unSelectRow(index+1, tr);
	    					 }

	        			}
	    				if(_allCheck&&_this.selectModel=="multi"){
	            			_this.stateTest();
	    				}
	    			},10);
			   });
			}
		});
       if(this.frozenObj){
	   		cnt=1;
			this.fro_trs.each(function(index,trdom){
				var tr = $(trdom);
				var input = tr.find("#cb_"+_this.id+"_"+cnt);
				cnt++;
				if(_this.rowSelect == false){           
					input.change(function(){
		    			if(this.checked){
		    				input.checked = true;
		    				tr.addClass("u-table-selected");
		    				_this.selectRow(index+1,$(_this.trs[index]));
		    			}else{
		    				input.checked = false;
		    				tr.removeClass("u-table-selected");
		    				_this.unSelectRow(index+1,$(_this.trs[index]));
		    			}
		    			if(_allCheck&&_this.selectModel=="multi"){
	            			_this.stateTest();
	    				}
		    		});
				}else{
					var _clickFlag=this.clickFlag;
		    		tr.bind('click',function(e) {    
		    			clearTimeout(_clickFlag);
		    			_clickFlag=setTimeout(function(){
		    				if($.isEmptyObject(_this.selecteds)){
		    					input.prop("checked", true);
		    					tr.addClass("u-table-selected");
		        				_this.selectRow(index+1, $(_this.trs[index]));
		        			}else{
		        				if(!_this.selecteds.hasOwnProperty(index+1)){
		        					input.prop("checked", true);
		        					tr.addClass("u-table-selected");
		        				    _this.selectRow(index+1, $(_this.trs[index]));
		    					 }else{
		    						 input.prop("checked", false);
		    						 tr.removeClass("u-table-selected");
		    						 _this.unSelectRow(index+1, $(_this.trs[index]));
		    					 }

		        			}
		    				if(_allCheck&&_this.selectModel=="multi"){
		            			_this.stateTest();
		    				}
		    			},10);
				   });
				}
			});
       }

	  if(_allCheck&&this.selectModel=="multi"){
	        //reg checkall event
			/*$('#'+this.allCheckboxId).change(function(){
				if(this.checked){
					_this.selectAll();
				}else{
					_this.unSelectAll();
				}
			});*/
		  //需求#12660 【TS:201508240145-JRESPlus-财富管理事业部-王瑞明-若在查询框中通过 tab_panel 控件设置多个 Tab,分页则除第一次选择的TAB页外的其他全选按钮会失效 】
		  this.el.find('.h_datagrid_select_all').change(function(){
				if(this.checked){
					_this.selectAll();
				}else{
					_this.unSelectAll();
				}
			});
			this.dataTable.find(".hc-datagrid-cell-check").each(function(idx,divdom){
				  var div = $(divdom);
				  div.children("input:checkbox").change(function(){
						_this.stateTest();
					});
			});
	 }
		
	}, 
	initHignLightEvent : function(){
		var _this = this;
		if(this.frozenObj){
			this.fro_trs.each(function(index,trdom){
				var tr = $(trdom);
				tr.mouseover(function(){
					tr.addClass("hc-datagrid-row-over");
					$(_this.trs[index]).addClass("hc-datagrid-row-over");
				});
				tr.mouseout(function(){
					tr.removeClass("hc-datagrid-row-over");
					$(_this.trs[index]).removeClass("hc-datagrid-row-over");
				});
			});
			this.trs.each(function(index,trdom){
				var tr = $(trdom);
				tr.mouseover(function(){
					tr.addClass("hc-datagrid-row-over");
					$(_this.fro_trs[index]).addClass("hc-datagrid-row-over");
				});
				tr.mouseout(function(){
					tr.removeClass("hc-datagrid-row-over");
					$(_this.fro_trs[index]).removeClass("hc-datagrid-row-over");
				});
		    });
		}else{
			this.trs.each(function(index,trdom){
				var tr = $(trdom);
				tr.mouseover(function(){
					tr.addClass("hc-datagrid-row-over");
				});
				tr.mouseout(function(){
					tr.removeClass("hc-datagrid-row-over");
				});
		    });
		}

		
	},
    stateTest : function(){
		var _this = this;
		var checkAll = true;
		this.dataTable.find(".hc-datagrid-cell-check").each(function(idx,divdom){
			  var div = $(divdom);
			  var checkbox = div.children("input:checkbox");
			  if(!checkbox.prop("checked")){
				  checkAll = false;
			  }
		});
		
		/*if(checkAll){
			$("#"+this.allCheckboxId).attr("checked", true);
		}else{
			$("#"+this.allCheckboxId).attr("checked", false);
		}*/
		if(checkAll){
			_this.el.find('.h_datagrid_select_all').prop("checked", true);
		}else{
			_this.el.find('.h_datagrid_select_all').prop("checked", false);
		}
    },
   /**
    * @description 请求数据。 url不传，则请求url使用组件默认的url属性
    * @function
    * @name Horn.DataGrid#load
    * @param {string} url        请求数据的路径
    * @param {object} params     请求提交的参数<br>
    * @return void
    */
	load : function(url,params){
		params = params ||{};
		//需求#14698 【TS:201511060012-JRESPlus-资产管理事业部-张翔-问题1：选中datagrid中某条数据,然后调load方法，原来选中的内容还在
		this.selecteds = null;
		//解决将其他加载方式切换为load的时候导致的请求pageNo多一的问题
		//初始load应该从第一页开始获取
		if(this.loadFlag  && this.loadFlag != "autoLoad"){
			this.reqPageNo = 1;
		}
		this.loadFlag="autoLoad";
		if($.type(params)=="array"){
            params = Horn.Util.arr2Obj(params) ;
        }
		
		this.reqPageNo = params["pageNo"] || this.reqPageNo;
		this.reqPageSize = params["pageSize"] || this.reqPageSize;
		
		if(this.hasPage){
			params["pageNo"] = this.reqPageNo;
			params["pageSize"] = this.reqPageSize;
		}
		//如果有绑定表单，就把表单参数传到后台 20160418 add by 周智星
		if(this.bindFormName!=null){
			var serValues = $("form[name="+this.bindFormName+"]").serializeArray();
        	var formValues = Horn.Util.arr2Obj(serValues) ;
        	$.each(formValues, function (name, value) {
       		 	params[name] = value;
			});
			
		}
		this.execute(url,params);
		//STORY #11316 [财富管理事业部/徐益江][TS:201504160052]-jresplus-ui-2、datagrid控件，当列宽超出可见宽度后出来横向滚动条】
		$("#head_"+this.id).css("margin-left",0);
		//STORY #11407 [财富管理事业部/蔺茂旺][TS:201504240187]-JRESPlus-ui-1。在grid，冻结列中，动态添加的内容，滚动条拖到最后，g】
		$("#freez_body_"+this.id).css("margin-top",0);
	},
	  /**
	    * @description 加载数据到表格中
	    * @function
	    * @name Horn.DataGrid#loadData
	    * @param {object} data     加载的数据<br>
	    * @return void
	    */
	loadData : function(data){
		this.loadFlag = "loadData";
		var _this=this;
		var pageNo = this.params["pageConfig"]["pageNo"];
		var pageSize = this.params["pageConfig"]["pageSize"];
		this.reqPageNo = pageNo?pageNo:1;
		this.reqPageSize=pageSize?pageSize:10;
		
		if(data!=null){
			this.data = data;
			//正确的取得前端分页的数据storgedData
			this.storgedData=data.rows?data.rows:data;
			this.reqPage(this.reqPageNo,this.reqPageSize);
//			this.result = this.data["rows"]?this.data["rows"]:this.data;
//			_this.setTHHidden();
//            //动态展现表格数据
//     	   _this.loadRecords(data);
//     	   //pagebar
//     	   _this.el.find("#page_"+this.id).remove();
//            //_this.initPagebar(this.data);
//            //被选中的数据对象init
//     	   _this.initSelect();
//            //bind row click
//            _this.bindClickEvent(_this.rowclick,"click");
//            //bind rowdblclick
//            _this.bindClickEvent(_this.rowdblclick,"dblclick");
//            //bind initSelectEvents
//            _this.initSelectEvents();
//            //bind rowhignlight
//            _this.initHignLightEvent();
//            _this.columnRender();
            _this.el.find("#data_"+_this.id).css("height","");
            this.pageBtnDisabled(false);
		}
		
		this.reCalRowHeight();
		
	},

	  /**
	    * @description 返回组件id
	    * @function
	    * @name Horn.DataGrid#getId<br>
	    * @return String
	    */
	getId : function(){
		return this.id;
	},

	/**
	  * @description 返回选择的数据
	  * @function
	  * @name Horn.DataGrid#getSelecteds<br>
	  * @return Array
	  */
	getSelecteds :function(){
		var selecteds = [];
		for(var key in this.selecteds){
			
			//[经纪业务事业部/胡志武][TS:201409230012]-JRESPlus-ui--DataGrid在ie8浏览器上通过DataGrid获取数据通过getSelecteds (
			if(key == "indexOf")
				continue;
			
    		var val = this.selecteds[key];
    		if(val){
    			selecteds.push(val);
    		}
    	}
		return selecteds;
	},
	/**
	 * @description 取消选中所有行数据，只针对多选模式，单选模式下无效
	 * @name Horn.DataGrid#unSelectAll
	 * @function 
	 * @return void
	 */
	unSelectAll : function(){
    	var _this = this;
    	this.dataTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx+1,$(checkbox.parentNode.parentNode.parentNode));
    		}
    		   
    	});
    	if(this.frozenObj){
    		this.frozenTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
        		checkbox.checked = false;
        		$(checkbox.parentNode.parentNode.parentNode).removeClass("u-table-selected");
        		   
        	});
    	}
    	//$("#"+this.allCheckboxId).attr("checked", false);
    	_this.el.find('.h_datagrid_select_all').prop("checked", false);
	},
	/**
	 * @description 选中所有行数据，只针对多选模式，单选模式下无效
	 * @name Horn.DataGrid#selectAll
	 * @function 
	 * @return void
	 */
	selectAll : function(){
    	var _this = this;
    	this.dataTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx+1,$(checkbox.parentNode.parentNode.parentNode));
    		}
    		   
    	});
    	if(this.frozenObj){
    		this.frozenTable.find("div.hc-datagrid-cell-check input:checkbox").each(function(idx,checkbox){
        		checkbox.checked = true;
        		$(checkbox.parentNode.parentNode.parentNode).addClass("u-table-selected");
        		   
        	});
    	}
        //14210 需求12660tabpanel多个页签有datagrid组件，直接点击页签2的全选，会把页签1的全选框也选中
    	//$("#"+this.allCheckboxId).attr("checked", true);
	},
	
	/**
	 * @description 向后台发送请求时的用户自定义参数，被设置的参数会做为基础查询条件，即每次查询是都会传入后台
	 * @name Horn.DataGrid#setBaseParams
	 * @param {object} params  基础参数<br>
	 * @return void
	 * @function
	 */
	setBaseParams : function(params){
		params = params||{};	
   	 if(params){
		 this.baseParams=params;
	 }else{
		 this.baseParams={};
	 }
	},
	/**
	 * @description 设置控件的宽度和高度
	 * @name Horn.DataGrid#setSize
	 * @param {number} width  宽度
	 * @param {number} height  高度<br>
	 * @return void
	 * @function
	 */
	setSize : function(width,height){
		var gridId = this.getId();
		var w = width?Number(width):null;
		var h = height?Number(height):null;
		if(w&&!isNaN(w)){
			$("#wrap_"+gridId).width(w);
			this.width=w;
		}
		if(h&&!isNaN(h)){
			var grid = $("#freeze_data_"+gridId);
			if(grid.size != 0){
				grid.height(h-16);
			}
			$("#data_"+gridId).height(h);
			this.height=h;
		}
	},
	/**
	 * @description 设置控件的宽度
	 * @name Horn.DataGrid#setWidth
	 * @param {number} width  宽度<br>
	 * @return void
	 * @function
	 */
	setWidth : function(width){
		this.setSize(width,null);
	},
	/**
	 * @description 设置控件的高度
	 * @name Horn.DataGrid#setHeight
	 * @param {number} height  高度<br>
	 * @return void
	 * @function
	 */
	setHeight : function(height){
		this.setSize(null,height);
	},
	/**
	 * @description 选择一行记录
	 * @name Horn.DataGrid#select
	 * @param {number} row  行号<br>
	 * @return void
	 * @function
	 */
	select : function(row,event){
		var _this = this,
		
		//select("1")第一行也能被选中，但是没有勾选状态；而select(1)不仅可以选中一行还等勾选
		row = Number(row);
		
		index = row,
		tr = $(_this.trs[index]),
		f_tr = $(_this.fro_trs[index]),
		_allCheck = $("#"+this.allCheckboxId);
		if($.isEmptyObject(_this.selecteds)){
			 if(_this.frozenObj){
				 f_tr.find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
				 f_tr.addClass("u-table-selected");
			 }
			_this.selectRow(index+1, tr);
		}else{
			if(!_this.selecteds.hasOwnProperty(index+1)){
				if(_this.frozenObj){
					f_tr.find("#cb_"+_this.id+"_"+(index+1)).prop("checked", true);
					f_tr.addClass("u-table-selected");
				 }
			    _this.selectRow(index+1, tr);
			 }

		}
		if(_allCheck&&_this.selectModel=="multi"){
			_this.stateTest();
		}
		if (event&&event.stopPropagation) {
			event.stopPropagation();
		}
	},
	/**
	 * @description 取消选择一行记录
	 * @name Horn.DataGrid#unselect
	 * @param {number} row  行号<br>
	 * @return void
	 * @function
	 */
	unselect : function(row,event){
		this.unSelectRow(row+1,$(this.trs[row]));
		if (event&&event.stopPropagation) {
			event.stopPropagation();
		}
	},
	/**
	 * 选中一行
	 * @ignore
	 */
	selectRow : function(rowidx,_tr){
		var tr = _tr;
    	if(!tr){
    		tr = $("#tr_"+this.id+"_"+rowidx);    
    	}
    	var vals = this.getRowData(rowidx-1);
    	this.selecteds[rowidx] = vals;
		if(this.selectModel=="single"){
			var last = this.lastSelect;
			if(last && last.rowidx !==undefined && last.rowidx != rowidx ){
				last.tr.find("#cb_"+this.id+"_"+last.rowidx).prop("checked" , false);
				this.unSelectRow(last.rowidx,last.tr);
			}
			tr.find("input:radio").get(0).checked = true;   //选中radio//BUG #6574 
			
		}else if(this.selectModel=="multi"){
			tr.find("input:checkbox").get(0).checked = true;   //选中checkbox
		}
		this.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		tr.addClass("u-table-selected");//选中行的样式
	},
	/**
	 * @ignore
	 */
	getRowData :function(rowidx){
		/*
    	var vals = {};
		var ths = this.ths;
		var tds = rowTr.find('td');
		ths.each(function(thidx,thdom){
			var th = $(thdom),
			div = th.children("div"),
			colname;
			if(!div.attr("name")){
				return;
			}else{
				colname = div.attr("name");
			}
			var td_divobj = $(tds.get(thidx)).children("div");
			vals[colname] = div.attr('dictName') ? $(td_divobj).attr('key') :$(td_divobj).text();
		});*/
		return this.result[rowidx];
		//return vals;
	},
	/**
	 * 取消选中一行
	 * @ignore
	 */
	unSelectRow : function(rowidx,_tr){
		var tr = _tr;
    	if(!tr){
    		tr = $("#tr_"+this.id+"_"+rowidx);    
    	}
    	//clear
    	this.selecteds[rowidx] =null;
    	delete this.selecteds[rowidx];
    	tr.removeClass("u-table-selected");
    	tr.find("#cb_"+this.id+"_"+rowidx).prop("checked", false);
    	//冻结列清空
		if(this.frozenObj){
			$(this.fro_trs[rowidx-1]).find("#cb_"+this.id+"_"+rowidx).prop("checked", false);
			$(this.fro_trs[rowidx-1]).removeClass("u-table-selected");
		}
    	
    	//所有的选择项都取消后应该设置选择所有的checkbox为false
    	var _isNull=true;
    	
    	for(var _name in this.selecteds){
    		_isNull=false;
    		break;
    	}
    	if(_isNull){
    		//$('#'+this.allCheckboxId).attr("checked", false);
    		this.el.find('.h_datagrid_select_all').prop("checked", false);
    	}
	},
	/**
	 * @ignore
	 */
	execute : function(url,options){
		options = options||{};
		var doRequest = true;
		//需要先触发beforeload事件
		 if(this.beforeload){
			   var  beforeloadObj = Horn.Util.getFunObj(this.beforeload),
			   beforeloadFn;
	           if($.type(beforeloadObj.fn) == "function"){
	        	   beforeloadFn = beforeloadObj.fn ;
	           }
	           if(beforeloadFn)
	        	   doRequest =  beforeloadFn.apply(this,[this.el,options]);
		   }
		if(doRequest != false){
			var paramsdata = Horn.apply({},this.baseParams,options);
			//执行ajax请求
			this.doAjax(url,paramsdata);
		}
		return doRequest;
	},
	doAjax : function(url,data){
		   var _this = this;
		   var url = url?url:_this.url;
		   if(url && url.indexOf("http:")==-1){
			   url = context_path + url;
		   }
		   var tbody = this.dataTable.children("tbody"),
		   f_tbody = this.frozenTable.children("tbody"),
		   colLength = this.ths.length;
		   
	       $.ajax(
	    		   url,
	    	  {
	           async : true,
               beforeSend : function(xhr) {
          		   if(_this.frozenObj){
            		   _this.frozenTable.children("tbody").html("");
        		   }
            	   
          		   _this.dataTable.children("tbody").html("");
                   tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colspan='"
                       + colLength
                       + "'><img src='"+context_path+"/components/datagrid/img/hc_onLoad.gif'></img></td></tr>");
                   tbody.parent().css("width","100%");
                   tbody.parent().css("text-align","center");
                   tbody.parent().css("padding","15px");  
               },
               type : "POST",
               data : Horn.Util.obj2Arr(data) ,
               dataType : "json",
               error : function(xhr, textStatus, errorThrown) {
                   var status = xhr.status;
                   tbody.parent().css("width","");
        		   tbody.parent().css("text-align","");
        		   tbody.parent().css("padding","");
                   if(_this.frozenObj){
        			   _this.frozenTable.children("tbody").html("");
        			   f_tbody.html(
                               "<tr><td style=\"border-right:0px;padding:15px;\" colSpan='" + colLength
                               + "'><p>请求失败</p><p>错误状态："
                               + status + "；错误信息："
                               + textStatus
                               + "</p></td></tr>");
        		   }
                   tbody.html(
                       "<tr><td style=\"border-right:0px;padding:15px;\" colSpan='" + colLength
                           + "'><p>请求失败</p><p>错误状态："
                           + status + "；错误信息："
                           + textStatus
                           + "</p></td></tr>");
               },
               success : function(resultData, textStatus, jqXHR) {
        		   tbody.html("");
        		   tbody.parent().css("width","");
        		   tbody.parent().css("text-align","");
        		   tbody.parent().css("padding","");
            	   if(!resultData||$.isEmptyObject(resultData)){
            		   if(_this.frozenObj){
            			   _this.frozenTable.children("tbody").html("");
            			   f_tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
                                   + colLength
                                   + "'><p>暂时无数据</p></td></tr>");
            		   }
                		    
                		 _this.dataTable.children("tbody").html("");
                         tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
                             + colLength
                             + "'><p>暂时无数据</p></td></tr>");
            		   
            		   
	    			  if(_this.loaderror){
	    	  			   var  loaderrorObj = Horn.Util.getFunObj(_this.loaderror),
	    	  			    loaderrorFn;
	    	  	           if($.type(loaderrorObj.fn) == "function"){
	    	  	        	 loaderrorFn = loaderrorObj.fn ;
	    	  	           }
	    	  	           if(loaderrorFn)
	    	  	        	 loaderrorFn.apply(_this,[_this.el,resultData]);
	    	  	             return;
	    	  		   }   
            		   
            	   }else{
            		   if(resultData){
            				var data = resultData["rows"];
            				this.result = data?data:resultData;
            		   }
            		   if(this.result&&(this.result.length==0||$.isEmptyObject(this.result))){
            			   if(_this.frozenObj){
                			   _this.frozenTable.children("tbody").html("");
                			   f_tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
                                       + colLength
                                       + "'><p>暂时无数据</p></td></tr>");
                		   }
                    		    
	                        _this.dataTable.children("tbody").html("");
	                        tbody.html("<tr><td style=\"border-right:0px;padding:15px;\" colSpan='"
	                             + colLength
	                             + "'><p>暂时无数据</p></td></tr>");
	                        
	                        //pagebar
	                        _this.initPagebar(resultData);
           		        }else{
	            		   //10808
	            		   _this.data = resultData.rows;
	            		   _this.params.data = resultData.rows;
	            		   
	            		   //动态展现表格数据
	                	   _this.loadRecords(resultData);
	                	   //pagebar
	                       _this.initPagebar(resultData);
	                       //被选中的数据对象init
	                	   _this.initSelect();
	                       //bind row click
	                       _this.bindClickEvent(_this.rowclick,"click");
	                       //bind rowdblclick
	                       _this.bindClickEvent(_this.rowdblclick,"dblclick");
	                       //bind initSelectEvents
	                       _this.initSelectEvents();
	                       //bind rowhignlight
	                       _this.initHignLightEvent();
	                       _this.columnRender();
	//                       _this.setHeight(parseInt(_this.el.find("#data_"+_this.id).css("height")));
	                       //STORY #10163 [研发中心/内部需求][JresPlus][UI]datagrid组件中动态加载的表格，当初始化加载完成后后台增加数据量，表格高度没有发生变化 
	                       if(_this.params.height == undefined){//不设置表格高度的时候才这样干，如果设置了表格高度则以表格高度为准
	                    	   //_this.setHeight(parseInt(_this.el.find("#body_"+_this.id).css("height")));//当不设置表格高度的时候应该自适应表格的高度，而不应该是div的高度
	                       }
	                       _this.setTHHidden();
           		       }

            	   }
            	   
            	   try{
            		   if(_this.loadsuccess){
            			   var  loadsuccessObj = Horn.Util.getFunObj(_this.loadsuccess),
            			   loadsuccessFn;
            	           if($.type(loadsuccessObj.fn) == "function"){
            	        	   loadsuccessFn = loadsuccessObj.fn ;
            	           }
            	           if(loadsuccessFn)
            	             loadsuccessFn.apply(_this,[_this.el,resultData]);
            		   }
            	   }catch(e){
            		   Horn.debug(e);
            	   }
            	   
               }
	               });
		
	},
	/**
	 * @ignore
	 */
	initPagebar : function(resultData){
	 	   if(this.hasPage){
			   var total = resultData["total"];
			   if(this.pagebar){
				   if(resultData!=null){
					   	$("#toPage_"+this.id).attr("disabled",false);
						$("#pageSize_"+this.id).attr("disabled",false);
				   }
				   this.pagebar.setTotalCount(total);
				   this.pagebar.calPage_(this.reqPageNo,this.reqPageSize,total);
				   this.setPageInfo();
			   }
			   
		   }
	},
	pageBtnDisabled: function(disabled){
		if(disabled){
			$("#toPage_"+this.id).attr("disabled",true);
			$("#pageSize_"+this.id).attr("disabled",true);
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").addClass("disabled");
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").addClass("disabled");
			$("#page_"+this.id).find(".refresh_btn").addClass("disabled");
		}else{
			$("#toPage_"+this.id).attr("disabled",false);
			$("#pageSize_"+this.id).attr("disabled",false);
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").removeClass("disabled");
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").removeClass("disabled");
			$("#page_"+this.id).find(".refresh_btn").removeClass("disabled");
		}
	},
	/**
	 * @ignore
	 * @private
	 * 加载数据，用于生成表格
	 */
	loadRecords : function(resultData){
		//STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
		//计算当前页面的数据条数
		//this.currentPageSize = resultData.length ? resultData.length:resultData.rows.length;
		
		this.currentPageSize = resultData.length || (resultData.rows&&resultData.rows.length);
		this.result = resultData.rows || resultData;
		
		Horn.debug("init datagrid data...",this.result);
		this.createDataTable();
		this.initScroll();
		this.trs = this.dataTable.children("tbody").children("tr");   //所有data行
		this.fro_trs = this.frozenTable.children("tbody").children("tr"); //所有frozen data行
		this.loaded = true;
		Horn.debug("init datagrid data success ...");
	
//		this.calMaxLength();
	},
	calMaxLength:function(){
		//10808
		var _item,
			_data,
			_tmp,
			_this = this;
		//从这里计算每列的宽度,不管用到用不到都算出来
		for(var i=0;i<_this.params["items"].length;i++){
			_item = _this.params["items"][i];
			var _maxLength = _item.text.getWidth(12);
			
			if( _this.params.autoWidth || _item.autoWidth ){
				//一个data就是一行数据
				for(var j=0;j<_this.result.length;j++){
					_data = _this.result[j];
					_tmp = (""+_data[_item.name] || "0").getWidth(12);
					_maxLength = _tmp > _maxLength ? _tmp:_maxLength;
				}
			}
			_item._maxLength = _maxLength;
		}
	},
	/**
	 * @ignore
	 */
	createDataTable : function(){
		this.calMaxLength();
		
		 var htmlArr = [];
		 var f_htmlArr = [];
		 
		 var colLength = this.ths.length;
		 
		 if(this.frozenObj){
			 var f_colLength = $("#freez_head_"+this.id).children("tbody").children("tr").length;
		 }
		 
		 if(this.result && this.result.length >0){
			 var cnt = 1;
			 for ( var i = 0; i <this.result.length; i++){
				   var itemData = this.result[i];
				   //frozentable row init
				   if(this.frozenObj)
				      this.createFrozenTableTr(itemData,cnt,f_htmlArr);
				   var tmptr = this.tr.replace("{TR_ID}", "tr_"+this.id+"_"+cnt);
		    	   tmptr = tmptr.replace("{TR_CLASS}", (cnt%2==0)?this.row_class:"");
				   htmlArr.push(tmptr);
				   if(this.numbercolumn && this.numbercolumn==true){
					 var tmptd = this.td_number.replace("{count}",cnt).replace("{numberColumnWidth}",this.numberColWidth);
					 htmlArr.push(tmptd);
				   }
				   if(this.selectModel && this.selectModel=="multi"){
					   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
					   tmptd = tmptd.replace("{CHECK_TYPE}","checkbox");
					   htmlArr.push(tmptd);
				   }else if(this.selectModel && this.selectModel=="single"){
					   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
					   tmptd = tmptd.replace("{CHECK_TYPE}","radio");
					   htmlArr.push(tmptd);
				   }
				   
				   for(var j=0;j<this.frozenObjs.length;j++){
					   this.frozenObj = this.frozenObjs[j];
					   
					   if(this.frozenObj){
						   var tmptd = this.td.replace("{XDATAGRID_TD_ALIGN}",this.setAlign(this.frozenObj["tAlign"]));
						   
						   var _width = this._getItemWidth(this.frozenObj);
						   tmptd = tmptd.replace("{XDATAGRID_TD_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
						   tmptd = tmptd.replace("{XDATAGRID_DIV_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
						   if(this.frozenObj["hidden"]&&this.frozenObj["hidden"]==true)
						      tmptd = tmptd.replace("{XDATAGRID_TD_HIDDEN}","none");
						   var value = this.getCellValue(itemData,this.frozenObj["name"]);
						   
						   //这里格式化冻结列
						   value = this.formatData(this.frozenObj["dataType"],this.frozenObj["format"],value);
						   if(value!=""&&(value=="null"||value=="NULL"||value=="undefined")){
							   value = "";
						   }
						   tmptd = tmptd.replace("{XDATAGRID_TD_VAL}",value);
						   htmlArr.push(tmptd);
					   }
				   }
				   this.frozenObj = this.frozenObjs[0];
				   
				   var colslength = this.items.length;
				   for(var j=0;j<colslength;j++){
					   var colitem = this.items[j];
					   if(colitem.name!=this.params["frozen"] && this.params["frozen"].indexOf(colitem.name) < 0){
						   var tmptd = this.td.replace("{XDATAGRID_TD_ALIGN}",this.setAlign(colitem["tAlign"]));
						   
						   var _width = this._getItemWidth(colitem);
						   tmptd = tmptd.replace("{XDATAGRID_TD_WIDTH}",colitem["width"]?colitem["width"]:_width);
						   tmptd = tmptd.replace("{XDATAGRID_DIV_WIDTH}",colitem["width"]?colitem["width"]:_width);
						   if(colitem["hidden"]&&colitem["hidden"]==true)
							      tmptd = tmptd.replace("{XDATAGRID_TD_HIDDEN}","none");
						   var value = this.getCellValue(itemData,colitem["name"]);
						   
						   //在这里做格式化
						   if(colitem["dataType"] && colitem["dataType"] !=null){
						   	   value = this.formatData(colitem["dataType"],colitem["format"],value);
						   }
						   if(value!=""&&(value=="null"||value=="NULL"||value=="undefined")){
							   value = "";
						   }
						   tmptd = tmptd.replace("{XDATAGRID_TD_VAL}",value);
						   htmlArr.push(tmptd);
					   }
					  
				   }
				   htmlArr.push(this.tr_end);cnt++;
			 }
			 
		 }
		 if(this.frozenObj){
			 this.frozenTable.children("tbody").html("");
			 this.frozenTable.children("tbody").html(f_htmlArr.join(""));
		 }
		 this.dataTable.children("tbody").html("");  
		 this.dataTable.children("tbody").html(htmlArr.join(""));
		 
		 //重新计算行高和table高度
		 //STORY #9799 [经纪业务事业部/胡志武][TS:201409230014]-JRESPlus-ui-DataGrid通过loadData(data)方式加载数据后，表格就不再有长和宽了，表格自动
		 this.reCalRowHeight();
		 
		 this.resetTdContent();
		
	},
	/**
     *重置列展示内容,如果字段大于40个字符，就把内容放到文本域中
     * @ignore
     */
	resetTdContent : function(){
		var head_trs = this.head_dataTable.children('tbody').children('tr');
    	var trs = this.dataTable.children('tbody').children('tr');
    	var freetrs = this.frozenTable.children('tbody').children('tr');
    	var tmpArray = [];
    	var _this = this;
    	var rows = [];
    	head_trs.each(function(tridx,trdom){
    		var tr = $(trdom);
    		var tds = tr.find('td');
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdDiv = td.children("div");
    			var display = td.css("display");
    			if((tdidx==tds.length-1)&&display!="none"){
	    			td.css("width","auto");
	    		}
    		}
    	});
    	trs.each(function(tridx,trdom){
			var flag = false;
    		var tr = $(trdom);
    		var trid = tr.attr("id");
    		var tds = tr.find('td');
    		
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdDiv = td.children("div");
    			var text =tdDiv.text();
    			var display = td.css("display");
    			if(display!="none"){
		    		if(_this.getStrlen(text)>40){
		    			if(_this.params.frozen&&_this.params.frozen!=""){
			    			if(rows.indexOf(tdidx)==-1){
			    				rows.push(tdidx);
			    			}
			    			tmpArray.push(trid);
			    			tdDiv.html("<textarea   readonly style=\"height: 40px;width: 300px;border: 0;background: transparent;line-height: 15px;outline: none;\" class=\"div-textarea\">"+text+"</textarea>");
			    			tdDiv.css("height","40px");
			    			tdDiv.css("line-height","40px");
		    			}else{
		    				td.css("width","300px");
		    				var style = tdDiv.attr("style");
		    				style = style+";white-space: normal;text-overflow: initial;;word-wrap:break-word; word-break:break-all";
		    				tdDiv.attr("style",style);
		    				tdDiv.css("width","300px");
		    			}
		    		}
    			}
    			
	    		if((tdidx==tds.length-1)&&display!="none"){
	    			td.css("width","auto");
	    		}
    		}
    		
    	});
    	if(this.frozenObj){
	    	freetrs.each(function(tridx,trdom){
	    		var tr = $(trdom);
	    		var tds = tr.find('td');
	    		var trid = tr.attr("id");
	    		if(tmpArray.length>0&&tmpArray.indexOf(trid)>-1){
		    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
		    			var td = $(tds[tdidx]);
		    			var tdDiv = td.children("div");
		    			var checkbox = tdDiv.attr("class");
		    			if(checkbox!="hc-datagrid-cell-check"){
			    			tdDiv.css("height","40px");
			    			tdDiv.css("line-height","40px");
		    			}
		    		}
	    		}
	    	});
    	}
    	/*if(rows.length>0){
    		for(var i = 0;i<rows.length;i++){
    			trs.find('td:eq('+rows[i]+')').children("div").css("width",300);
    		}
    	}*/
    },
    getStrlen:function(str){//一个中文相当于两个字符
    	var num = 2;
        var len = 0;
        for (var i=0; i<str.length; i++) { 
	         var c = str.charCodeAt(i); 
	         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
	           len++; 
	         }else{ 
	    		len+=num; 
	         } 
        }
        return len;
    },
	/**
	 * a:type，b:format、c:value
	 */
	formatData:function(a,b,c){
		return Horn.Util.Format.all(a,b,c);
	},
	/**
	 * @ignore
	 * @private
	 */
	createFrozenTableTr : function(itemData,cnt,htmlArr){
	   htmlArr = htmlArr||[];	
	   var tmptr = this.tr.replace("{TR_ID}", "tr_"+this.id+"_"+cnt);
	   tmptr = tmptr.replace("{TR_CLASS}", (cnt%2==0)?this.row_class:"");
	   htmlArr.push(tmptr);
	   if(this.numbercolumn && this.numbercolumn==true){
			 var tmptd = this.td_number.replace("{count}",cnt).replace("{numberColumnWidth}",this.numberColWidth);
			 htmlArr.push(tmptd);
	   }
	   if(this.selectModel && this.selectModel=="multi"){
		   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
		   tmptd = tmptd.replace("{CHECK_TYPE}","checkbox");
		   htmlArr.push(tmptd);
	   }else if(this.selectModel && this.selectModel=="single"){
		   var tmptd = this.td_check.replace("{CHECKBOX_ID}","cb_"+this.id+"_"+cnt);
		   tmptd = tmptd.replace("{CHECK_TYPE}","radio");
		   htmlArr.push(tmptd);
	   }
	   
	   for(var j=0;j<this.frozenObjs.length;j++){
		   this.frozenObj = this.frozenObjs[j];
		   
		   if(this.frozenObj){
			   //todo 渲染
			   var tmptd = this.td.replace("{XDATAGRID_TD_ALIGN}",this.setAlign(this.frozenObj["tAlign"]));
			   
			   var _width = this._getItemWidth(this.frozenObj);
			   tmptd = tmptd.replace("{XDATAGRID_TD_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
			   tmptd = tmptd.replace("{XDATAGRID_DIV_WIDTH}",this.frozenObj["width"]?this.frozenObj["width"]:_width);
			   if(this.frozenObj["hidden"]&&this.frozenObj["hidden"]==true)
				      tmptd = tmptd.replace("{XDATAGRID_TD_HIDDEN}","none");
			   var value = this.getCellValue(itemData,this.frozenObj["name"]);
			   
			   //在这里格式化冻结列
			   value = this.formatData(this.frozenObj["dataType"],this.frozenObj["format"],value);
			   
			   tmptd = tmptd.replace("{XDATAGRID_TD_VAL}",value);
			   htmlArr.push(tmptd);
		   }
	   }
	   this.frozenObj = this.frozenObjs[0];
	   
	   htmlArr.push(this.tr_end);
	},
	_getItemWidth:function(item){
		var _item = item;
		for(var i=0;i<this.params.items.length;i++){
			if(item.name == this.params.items[i]['name']){
				_item =  this.params.items[i];
				break;
			}
		}
		
		if(_item.autoWidth || this.params.autoWidth){
		   return _item.width || _item._maxLength;
	    }else{
		   return _item.width || 100;
	    }
	},
	/**
	 * @ignore
	 */
	initScroll : function(){
		var dataid = "#data_"+this.id;
		var headid = "#head_"+this.id;
		var freebodyid = "#freez_body_"+this.id;
		$(dataid).scroll(function(){
			var left=$(dataid).scrollLeft();
			var top=$(dataid).scrollTop();
			$(headid).css("margin-left",-left);
			$(freebodyid).css("margin-top",-top);
		});
	},
	/**
	 * @ignore
	 * @private
	 */
	getCellValue : function(rowData,colName){
		rowData=rowData||{};
		colName = colName||"";
		
		//STORY #10954 [财富管理事业部-吴丰辉][TS:201502150029]-JRESPlus--datagrid希望支持静态字典
		//直接转换key到制定的value
		var items = this.params.items;
		for(var i=0;i<items.length;i++){
			if(items[i]['name'] == colName && items[i]['items']){
				var _dicts = items[i]['items'];
				for(var j=0;j<_dicts.length;j++){
					if(_dicts[j]['value'] == rowData[colName]){
						rowData[colName] = _dicts[j]['label'];
					}
				}
			}
		}
		
		if(rowData[colName] || rowData[colName] ==0){
			return rowData[colName];
		}else
		   return "";
	},
	/**
	 * @ignore
	 */
	createPagebar : function(){
		if(this.params["pageConfig"]){
			var _this = this;
			this.pagebar = new Horn._Pagebar(this.params["pageConfig"],this.id,_this);
		}
	},
	/**
	 * @ignore
	 */
	setPageInfo : function(){
		//设置当前第几页
		$("#toPage_"+this.id).val(this.pagebar.currentPage);
		$("#pageSize_"+this.id).val(this.pagebar.pageSize);
		$("#totalPages_"+this.id).html(this.pagebar.pages);
		if((this.pagebar.pageSize%5)==0){
			//100 200 500 1000
			var index = this.pagebar.pageSize/5;
			if(index==20)
				index=11;
			else if(index==40)
				index=12;
			else if(index == 100)
				index=13;
			else if(index == 200)
				index=14;
					
			var activeli = $($(".dropdown-menu-datagrid").find('li').get(index-1));
			activeli.addClass("active");
			this.pagebar.activeLi=activeli;
		}
		 
		
		//设置总共几页
		//var tempstr = this.pageinfo.totalPagesText.replace("{pages}",this.pagebar.pages);
		//tempstr = tempstr.replace("{pagesize}",this.pagebar.pageSize);
		
		$("#pageInfo_"+this.id).html(this.pagebar.getPageInfo());
		if(1==this.pagebar.currentPage){
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").addClass("disabled");
		}else{
			$("#page_"+this.id).find(".first_page_btn,.pre_page_btn").removeClass("disabled");
		}
		if(this.pagebar.pages==this.pagebar.currentPage){
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").addClass("disabled");
		}else{
			$("#page_"+this.id).find(".next_page_btn,.last_page_btn").removeClass("disabled");
		}
		$("#page_"+this.id).find(".refresh_btn").removeClass("disabled");
		
	},
	/**
	 * @ignore
	 */
	reqPage : function(reqPageNo,reqPageSize){
		this.reqPageNo = reqPageNo?reqPageNo:this.reqPageNo;
		this.reqPageSize = 	reqPageSize?reqPageSize:this.reqPageSize;
		
		if(this.loadFlag != "autoLoad" && this.storgedData){
			this.result = this.storgedData.slice((this.reqPageNo-1)*this.reqPageSize,this.reqPageNo*this.reqPageSize);
			if(!this.hasPage){
				this.result = this.storgedData;
			}
			this.loadRecords(this.result);
			this.setTHHidden();
			this.initScroll();
             this.staticInitPagebar();
            //被选中的数据对象init
             this.initSelect();
            //bind row click
            this.bindClickEvent(this.rowclick,"click");
            //bind rowdblclick
            this.bindClickEvent(this.rowdblclick,"dblclick");
            //bind initSelectEvents
            this.initSelectEvents();
            //bind rowhignlight
            this.initHignLightEvent();
            this.columnRender();
		}else{
			this.load();
		}
	},
	/**
	 * @ignore
	 */
	initSelect:function(){
		var _this = this;
		$("#"+this.allCheckboxId).prop("checked",false);
		var _allCheck=$("#"+this.allCheckboxId);
		if(_allCheck&&this.selectModel=="multi"){
			_allCheck.prop("checked", false);
			if(this.frozenObj){
				this.fro_trs.each(function(idx,tr){
					$(tr).find("#cb_"+_this.id+"_"+(idx+1)).prop("checked", false);
				});
			}
			this.trs.each(function(idx,tr){
				$(tr).find("#cb_"+_this.id+"_"+(idx+1)).prop("checked", false);
			});
			
		}
		this.selecteds = [];
		this.lastSelect = {};
		
	},
	/**
	 * @ignore
	 */
	bindClickEvent : function(clickFunc,eventName){
		var clickObj =undefined;
		var clickFn=undefined;
		if (clickFunc) {
             clickObj = Horn.Util.getFunObj(clickFunc);
             if($.type(clickObj.fn) == "function"){
                 clickFn = clickObj.fn ;
             }
         }
		 if (clickFn ){
			 var trs = this.trs;
			 var _clickFlag=this.clickFlag;
			 for(var i=0;i<trs.length;i++){
				 var trdom = $(trs[i]);
				 var params = clickObj.params.slice(0);
                 params.push(this.result[i], this.result);
                 trdom.bind(eventName,params, function(e) {
                     var p = e.data ;
                     var _this=this;
                     if(eventName=="click"){
                    	 clearTimeout(_clickFlag);
                         _clickFlag=setTimeout(function(){
                         	return clickObj.fn.apply(_this,p);
                         },300);
                     }else{
                    	 return clickObj.fn.apply(_this,p);
                     }
                    
                 });
			 }
		 }
	},
	/**
	 * @ignore
	 */
	setAlign : function(align){
		align = align||"left";
		return align;
	},
	/**
	 * @ignore
	 */
	setTHHidden : function(){
		/*设置表头文字显示位置、width、隐藏*/
		var _this=this;
			this.ths.each(function(idx,thdom){
				var th = $(thdom);
				var div = th.find("div.hc-datagrid-cell");
				if(div.size() >0){
					for(var i=0;i<_this.items.length;i++){
						var item = _this.items[i];
						if(div.attr("name")==item.name){
							div.css("textalign",item.hAlign?item.hAlign:"center");
							//STORY #10808 [海外发展部-胡琦][TS:201501230291]-JRESPlus--datagrid控件数据列宽支持列宽自适应 (#3 #2 #1 )
//							if(item.autoWidth || _this.params.autoWidth){
//								div.css("width",item._maxLength);
//							}else{
//								div.css("width",item.width?item.width:100);
//							}
							div.css("width",_this._getItemWidth(item));
							
							if(item.hidden && item.hidden==true){
								th.hide();
							}
							break;      //等价于break BUG #7336
						}
					}
					
				}
			});
			if(this.frozenObj){
				this.fro_ths.each(function(idx,thdom){
					var th = $(thdom);
					var div = th.find("div.hc-datagrid-cell");
					if(div.size() >0){
						for(var i=0;i<_this.items.length;i++){
							var item = _this.items[i];
							if(div.attr("name")==item.name){
								div.css("textalign",item.hAlign?item.hAlign:"center");
								//16324 【TS:201601070223-JRESPlus-财富管理事业部-陈为-2. datagrid控件frozen属性固定列之后，标题和】
								/*if(item.autoWidth || _this.params.autoWidth){
									div.css("width",item._maxLength);
								}else{
									div.css("width",item.width?item.width:100);
								}*/
								div.css("width",_this._getItemWidth(item));
								if(item.hidden && item.hidden==true){
									th.hide();
								}
								break;      //等价于break BUG #7336
							}
						}
						
					}
				});
			}
	},
	/**
	 * @ignore
	 */
	dictColRender : function(td,dictName){
		td.attr('key',td.text());
		var text = td.children("div").text();
		var dict = Horn.getDict(dictName);
		if(dict){
			//17276 【TS:201602170281-JRESPlus-财富管理事业部-王瑞明-最近在使用JRES 框架进行开发过程中，发现使用了数据字典的】
			if(text=="" || dict[text]== undefined){
				td.children("div").text("");
				td.children("div").attr("title",""); 
			}else{
				td.children("div").text(dict[text]||text);
				td.children("div").attr("title",dict[text]||text);    //11209
			}
		}
	},
	/**
	 * @ignore
	 */
	buttonsColRender : function(td,buttons,rowidx,tdidx,tr,_table,alldata,rowdata){
		td.find("div").attr("title","");
		var btns = buttons;
		var span = $("<span></span>");
		$(btns).each(function(idxx,btn){
			var fn = Horn.Util.getFunObj(btn.event);
			//如果没有这个function，则不装入这个button
			if(!fn.fn) return;
			var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>"),
				text =  td.children("div").text();
			a.click(function(){
				fn.fn.call(a,{
    				"val" : text,
    				"rowdata" : rowdata,
    				"alldata" : alldata,
    				"table" : _table,
    				"rowidx" : rowidx,
    				"tdidx" : tdidx,
    				"tr" : tr,
    				"td" : td
    			});
			});
			a.css("color","#3366CC");
			a.hover(function(){
				$(this).css("color","#CC3300");
				$(this).css("text-decoration","underline");
			},function(){
				$(this).css("color","#3366CC");
				$(this).css("text-decoration","none");
			});
			span.append(a);
			if(idxx!=(btns.length-1)){
				span.append(' | ');
			}
		});
		 td.children("div").html('');
		 td.children("div").append(span);
		 if(this.frozenObj){
			 var f_td = $(this.fro_trs[rowidx]).find("td")[tdidx];
			 $(f_td).children("div").html('');
			 $(f_td).children("div").append(span);
		 }
	},
	
	colRendererFunc :  function(td,renderer,idx,index,tr,td){
		var _this = this;
		td.attr('key',td.find("div").text());
		td.find("div").attr("title","");
		var fn = Horn.Util.getFunObj(renderer),
		text = td.find("div").text();
		//如果没有这个function，则不装入这个button
		if(!fn.fn) return;
		var dom = fn.fn.call($(this),{
			val : text,
			rowdata : _this.result[idx],
			alldata : _this.result,
			table : _this,
			rowidx : idx,
			tdidx : index,
			tr : tr,
			td : td
		});
		if( dom instanceof $ ){
			td.find("div").html("");
			td.find("div").append(dom);
		}else{
			td.find("div").html(dom);
		}
	},
	/**
	 * @ignore
	 */
	columnRender : function(){
		var _this = this;
		var ths = this.ths;
		
		//调整标题头的宽度，自适应宽度的兼容
		function getItem(name){
			for(var i=0;i<_this.params.items.length;i++){
				if(name==_this.params.items[i]['name']){
					return _this.params.items[i];
				}
			}
		}
		var fro_header = this.fro_header;
		var header = this.header;
		
		fro_header.find("td").each(function(i,o){
			var item_name = $(o).find("div").attr("name");
			
			if(item_name){
				var item = getItem(item_name),
					width = _this._getItemWidth(item);
				
				$(o).find("div").width(width);
			}
		})
		
		header.find("td").each(function(i,o){
			var item_name = $(o).find("div").attr("name");
			
			if(item_name){
				var item = getItem(item_name),
					width = _this._getItemWidth(item);
				
				$(o).find("div").width(width);
			}
		})
		
		this.trs.each(function(idx,trdom){
			var tr = $(trdom);
			var f_tr =$( _this.fro_trs[idx]),
				tds = f_tr.find('td');
			
			
			tr.find('td').each(function(index,tddom){
				var td = $(tddom);
				
				var th = $(ths.get(index));
				var dictName = th.find("div").attr("dictname"),
					renderer = th.find("div").attr('renderer'),
					name = th.find("div").attr('name'),
					buttons = th.find("div").attr('buttons'),
					width,
					item;
				
				var f_td = $(tds.get(index));
				
				td.find("div").attr("title",td.find("div").text());
				f_td.find("div").attr("title",f_td.find("div").text());
				for(var i=0;i<_this.params["items"].length;i++){
					if(_this.params["items"][i].name==name){
						buttons = _this.params["items"][i]["buttons"];
						width =  _this.params["items"][i]["width"];
						item = _this.params["items"][i];
						
						//STORY #10808 [海外发展部-胡琦][TS:201501230291]-JRESPlus--datagrid控件数据列宽支持列宽自适应 (#3 #2 #1 )
						if(item.autoWidth || _this.params.autoWidth){
//							td.find("div.hc-datagrid-cell").css("width",item._maxLength);
//							f_td.find("div.hc-datagrid-cell").css("width",item._maxLength);
//							th.find("div.hc-datagrid-cell").css("width",item._maxLength);
						}else if(!width){
//							td.find("div.hc-datagrid-cell").css("width",100);
//							f_td.find("div.hc-datagrid-cell").css("width",100);
						}
						break;
					}
				}
//				if(!width){
					
					
//				}
				if(dictName){
					_this.dictColRender(td,dictName);
					if(_this.frozenObj)
					   _this.dictColRender(f_td,dictName);
				}else if(buttons){
					_this.buttonsColRender(td,buttons,idx,index,tr,_this,_this.result,_this.result[idx]);
				}
				if(renderer){
                    _this.colRendererFunc(td,renderer,idx,index,tr,td);
	    			if(_this.frozenObj)
	    				_this.colRendererFunc(f_td,renderer,idx,index,f_tr,f_td);
				}
			});
		});
	},
	/**
	 * @description 设置表格的标题
	 * @name Horn.DataGrid#setTitle
	 * @param {string} title  标题名<br>
	 * @return void
	 * @function
	 */
	setTitle:function(title){
		this.title = title;
		this. titleEl.text(title);
	},
	/**
	 * @description 获取表格的标题
	 * @name Horn.DataGrid#getTitle
	 * @param 
	 * @return string
	 * @function
	 */
	getTitle:function(){
		return this.title;
	},
	/**
	 * @description 动态添加标题按钮
	 * @name Horn.DataGrid#addButton
	 * @param {object} obj button的参数对象，具体的参数有：label 按钮的标签（必填否则无法添加）；name 按钮的name，作为标识按钮；cls 按钮的图标样式(默认提供的图标样式有：新增[fa-plus-circle]，修改[fa-pencil-square-o]，删除[fa-remove]，保存[fa-save],查询[fa-search],刷新[fa-refresh],文件夹[fa-folder-open-o])，默认无图标；event 按钮点击的事件处理函数
	 * @return 
	 * @function
	 */
	addButton:function(obj){
		var tmp = {"name":"","cls":"","event":""}
		obj = $.extend(tmp,obj)
		//增加nama参数和盼lable存在的条件;icon的样式设置不正确逗号放置的位置
		if(!obj || !obj.label)
			return;
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul");
		var buttonToAdd=$('<li><a name="'+obj.name+'" href="JavaScript:void(0)" class="hc-datagrid-a hc_datagrid-alink" onclick="'+obj.event+'"><i class="fa '+obj.cls+'"></i>'+obj.label+'</a></li>');
		titleButtons.append(buttonToAdd);
	},
	/**
	 * @description 动态隐藏与显示标题按钮
	 * @name Horn.DataGrid#hideButton
	 * @param Strng:name
	 * @param Boolean:hide,为true时隐藏，为false时展示
	 * @return 
	 * @function
	 */
	hideButton:function(name,hide){
		var titleButtons = $("#wrap_"+this.id).children("div.u-datagrid-toolbar").children("ul");
		var buttons=titleButtons.children("li").children("a");
		for(var i=0;i<buttons.length;i++){
			if($(buttons[i]).attr("name")==name){
				$(buttons[i]).hide();
			}
		}
	}
});
$.extend(Horn.DataGrid, {
	"DATANAME" : "h_datagrid"});
Horn.regUI("div.xdatagrid",Horn.DataGrid) ;

function setDefaultValue(params, propName, value) {
    if (params[propName] === undefined) {
        params[propName] = value;
    }else{
    	if(params[propName]=="true"){
    		params[propName] = true;
    	}else if(params[propName]=="false"){
    		params[propName] = false;
    	}
    }
};
/**
 * @name Horn._Pagebar-pagebar  
 * @class
 */
Horn._Pagebar = function(config,_gridid,_grid){
	var pagebar = {
			//表格对象
			gridId:null,
			//首页页码
	        INDEX_PAGE:1,
	        //当前页码
	        currentPage : 1,
			//页面大小，每页显示多少条
			pageSize : 10,
			 //总条数
			pageCount : 0,
			 //总页数
			pages : 0,
			 //起始条数
			startRow:0,
			/**
			 * @ignore
			 */
			init : function(config,_gridid,_grid){
				if(config){
				//14700 【TS:201511060024-JRESPlus-财富管理事业部-王瑞明-对于DataGrid 控件的“pageConfig”属性，目】
					setDefaultValue(config,"pageSize",10);
					setDefaultValue(config,"pageNo",1);
					setDefaultValue(config,"startRow",0);
					setDefaultValue(config,"pageCount",0);
					setDefaultValue(config,"currentPage",0);
					this.currentPage = parseInt(config["currentPage"]);
					this.pageCount = parseInt(config["pageCount"]);
					this.pageSize = parseInt(config["pageSize"]);
					this.pageNo = parseInt(config["pageNo"]);
					this.startRow = parseInt(config["startRow"]);
					this.pages = 0;
				}
				this.gridId = _gridid;
				this.grid = _grid;
				this.grid.reqPageSize = this.pageSize;
				this.grid.reqPageNo = this.pageNo;
				this.el = $("#page_"+this.gridId);
			},
			/**
			 * @ignore
			 */
			initEvents : function(){
				var _pageBar = this;
				$("#page_"+this.gridId).children("li").find('a').each(function(idx,a){
					var item = $(a);
					var regClick = function(item,f,arg){
						item.click(function(){
							if(item.hasClass('disabled')){
								return;
							}
							//IE下debug的时候报错
							arg=arg||[];
							f.apply(_pageBar,arg);
						});
					};
					if(!item.hasClass("disabled")){
						if(item.hasClass("first_page_btn")){
							regClick(item,_pageBar.first);
						}else if(item.hasClass("pre_page_btn")){
							regClick(item,_pageBar.pre);
						}else if(item.hasClass("next_page_btn")){
							regClick(item,_pageBar.next);
						}else if(item.hasClass("last_page_btn")){
							regClick(item,_pageBar.last);
						}else if(item.hasClass("refresh_btn")){
							regClick(item,_pageBar.refresh);
						}
					}
				});
				//绑定分页按钮事件
				this.perPage = false;
				$("#_recPerPage"+this.gridId).on('click',function(){
					optGridId = $(this).attr("id");
					optGridId =optGridId.substring(11)
					var currPage = $(this).children("strong").text();
					//STORY #13244 【TS:201509210013-JRESPlus-资产管理事业部-张翔-2、1.0.18版本对应datagrid对应分页选择出现错乱】 - JRES
					if(_pageBar.perPage){
						//不能使用样式作为目标，应该以当前范围内的样式为目标 20150921 modify by 周智星
						//$(".dropdown-menu-datagrid").hide();
						$(this).next().hide();
						_pageBar.perPage = false;
					}else{
						//$(".dropdown-menu-datagrid").show();
						$(this).next().show();
						//11640 需求13244datagrid对应分页选择显示框中，请求多次时，会选中多条分页 20150922 modify by 周智星
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
						//11640 需求13244datagrid对应分页选择显示框中，请求多次时，会选中多条分页 20150922 modify by 周智星
						if(_pageBar.gridId==optGridId){
							$("#pageSize_"+_pageBar.gridId).html(pageSize);
							_pageBar.activeLi.removeClass("active");
							_pageBar.activeLi=item.parent();
							item.parent().addClass("active");
							
							$(".dropdown-menu-datagrid").hide();
							_pageBar.perPage = false;
							
							_pageBar.grid.reqPage($("#toPage_"+_pageBar.grid.id).val(), pageSize);
						}
					});
				});*/
				//注册事件
				var thatgrid = this.grid;
				//$("#toPage_"+thatgrid.id).css("ime-mode","Disabled");
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
				$("#toPage_"+thatgrid.id).on('blur',function(){
					var pageNum = $(this).val();
					if (!pageNum || isNaN(pageNum)){
						pageNum = thatgrid.reqPageNo;
					}
					pageNum = parseInt(pageNum,10);
					if(pageNum<=0)
						pageNum=1;
					else if(pageNum>thatgrid.pagebar.pages)	
						pageNum = 1;
					$(this).val(pageNum);
					thatgrid.reqPage($(this).val(), $("#pageSize_"+thatgrid.id).html());
				});
				//需求18070 【TS:201603240534-JRESPlus-财富管理事业部-江志伟-【项目名称】恒生信托综合管理平台（TCMP）<br>【产品及】
				$("#pageSize_"+thatgrid.id).on('blur',function(){
					var pageSize = $(this).val();
					if(pageSize==""){
						var tmpPageSize = _pageBar.pageSize;
						if(tmpPageSize&&tmpPageSize!=""){
							pageSize = tmpPageSize;
						}else{
							pageSize =10;
						}
					}
					if (!pageSize || isNaN(pageSize)){
						pageSize = thatgrid.pageSize;
					}
					pageSize = parseInt(pageSize,10);
					if(pageSize<=0)
						pageSize=1;

					$(this).val(pageSize);
					
					_pageBar.grid.reqPage(parseInt($("#toPage_"+_pageBar.grid.id).val()), pageSize);
				});

				
			},
			/**
			 * @ignore
			 */ 
			calPage_:function(reqPageNo,reqPageSize,totalCount){
				this.pageSize = parseInt(reqPageSize);
				this.pageCount = parseInt(totalCount);
				this.pages = Math.ceil(this.pageCount/this.pageSize);
				if((reqPageNo*this.pageSize) > this.totalCount){
					this.currentPage = this.pages;
				}else
					this.currentPage = reqPageNo;
			},
			/**
			 * @ignore
			 */
			pre:function(){
				if(this.currentPage <= 1 || this.pageCount == 0) {
					this.grid.reqPage(1,this.pageSize);
				}else{
					this.grid.reqPage((this.currentPage - 1),this.pageSize);
				}
			},
			/**
			 * @ignore
			 */
			next:function(){
				if(this.pages == this.currentPage){
					return;
				}
				//需求 #14790 【TS:201511120068-JRESPlus-财富管理事业部-虞凯 重新选择每页显示条数，点击下一页，页码出错
				var tmpPageNo = 0;
				if(this.currentPage!=""){
					tmpPageNo = parseInt(this.currentPage)+1;
				}
				this.grid.reqPage(tmpPageNo,this.pageSize);
			},
			/**
			 * @ignore
			 */
			last:function(){
				if(this.pages == 0) 
					return ;
				else
					this.grid.reqPage(this.pages,this.pageSize);
			},
			/**
			 * @ignore
			 */
			first :function(){
				this.grid.reqPage(this.INDEX_PAGE,this.pageSize);
			},
			/**
			 * @ignore
			 */
			refresh : function(){
//				this.grid.load();
				var gridpageNo = this.grid.reqPageNo - 1;
				if(this.grid.loadFlag == "autoLoad"){
					gridpageNo = this.grid.reqPageNo
				}
				this.grid.reqPage(gridpageNo,this.pageSize);
			},
			/**
			 * @ignore
			 */
			getPageInfo:function(){
				var info;
				var startNo = 0,endNo = 0;
				if(this.pageCount > 0){
					startNo = this.pageSize*(this.currentPage-1) + 1;
					if((this.pageSize*this.currentPage) >= this.pageCount){
						endNo = this.pageCount;
					}else{
						endNo = this.pageSize*this.currentPage;
					}
				}
				info = "显示"+startNo+"到"+endNo+"条,共"+this.pageCount+"条记录";
				return info;
			},
			/**
			 * @ignore
			 */
			setTotalCount:function(total){
				this.totalCount = parseInt(total);
			}
			
	};
	pagebar.init(config,_gridid,_grid);
	pagebar.initEvents();
	return pagebar;
}

String.prototype.getWidth = function(fontSize){
    var span = document.getElementById("__getwidth");
    if (span == null) {
        span = document.createElement("span");
        span.id = "__getwidth";
        document.body.appendChild(span);
        span.style.visibility = "hidden";
        span.style.whiteSpace = "nowrap";
    }
    span.innerHTML = this.toString();
    span.style.fontSize = fontSize + "px";

    return span.offsetWidth;
}