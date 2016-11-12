/* 
 * -----------------------------------------------------------------------
 * 修订记录：
 * 2014-01-22     zhangsu          Grid列支持hidden属性
 * 2014-01-22     zhangsu          新增rowSelect属性，使grid支持点击行选中该行
 * 2014-02-08     zhangsu          修改this.rowSelect设置后不生效的问题
 * 2014-2-13      zhangchao09444   修改加载之后会导致页面缺少一半的问题。
 * 2014-2-28      zhangchao09444   修改在querytable重新load的情况下页面加长因而缺失部分的问题。
 * 2014-03-31     zhangsu          BUG #6534 simpleRequest属性配置在初次自动加载数据时未生效
 * 2014-03-31     zhangsu          BUG #6531 query_table中调用selectRow函数报错
 * 2014-04-01     zhangsu          BUG #6533 query_table中simpleReques属性值在代码中仍使用str型，需要调整为布尔型
 * 2014-04-03     zhangsu          BUG #6542 【queryTable】文档错误
 * 2014-04-03     zhangsu          BUG #6567 [query_table]设置无效的requestMethod
 * 2014-04-03     zhangsu          BUG #6545 [query_table]不设置分页未显示所有数据
 * 2014-04-04     zhangsu          BUG #6546 [query_table]设置非法hasPage值时应不分页
 * 2014-04-04     zhangsu          BUG #6544 [query_table]设置非法request_num
 * 2014-04-08     zhangsu          BUG #6574 [queryTable]:单选模式最好选择列是圆圈
 * 2014-04-08     zhangsu          BUG #6595 [query_table]selectRow传参有问题，设计缺陷
 * 2014-04-09     zhangsu          BUG #6598 [query_table]setBaseParams设置的参数不能发送成功
 * 2014-04-09     zhangsu          BUG #6532 通过loadData加载静态数据时，列render属性未生效
 * 2014-04-10     zhangsu          BUG #6562 [query_table]点击多选框不能选中，必须选中数据才能选中
 * 2014-04-11     zhangsu          BUG #6720 queryTable方法selectRow传入行号无法选中
 * 2014-04-14     zhangsu          BUG #6728 query_table属性hasPage不配置时，未使用默认值
 * 2014-04-14     zhangsu          BUG #6730 query_table文档中漏了属性renderer
 * 2014-04-15     zhangsu          BUG #6492 selectModel：“ 行数据选择模式（single/muti 启用单选/多选选择框） ”，这里是“multi”误拼居“muti”了吗？它的默认值是什么？
 * 2014-04-15     zhangsu          BUG #6492   setBaseParams方法怎么没参数呢？
 * 2014-04-16     zhangsu          BUG #6741 query_table中对bindFormName、loadByForm、load的描述错误      
 * 2014-04-16     zhangsu          修改titlebuttons注释，添加save/query/confirm/refresh/open样式   
 * 2014-04-18     zhangsu          BUG #6760 query_table手动全选后调用方法取消全选，列头上的勾还在
 * 2014-04-22     zhangsu          BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的       
 * 2014-04-22     zhangsu          BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的
 * 2014-04-28     周智星                             修改title和   titlebuttons注释                   
 * 2014-04-28     zhangsu          BUG #6887 【query_table】设置hasPage为false  
 * 2014-05-22     zhangsu          STORY #8366 [研发中心/内部需求][jresplus][ui]-queryTable组件的rowSelec属性在文档中未添加说明
 * 2014-05-22     zhangsu          STORY #8380 [研发中心/内部需求]{jresplus}[ui]-queryTable组件url、simpleRequest属性在文档中未说明
 * 2014-05-22     zhangsu          STORY #8381 [研发中心/内部需求][jresplus][ui]-queryTable组件需要在文档中添加事件说明，支持事件列表、事件触发时间或机制、事件传递参数。
 * 2014-05-23     zhangsu          STORY #8367 [研发中心/内部需求][jresplus][ui]-queryTable的position_str属性需要和原先的使用方式兼容 
 * 2014-06-05	  wuxl             STORY #8454 STORY #8454 [研发中心/内部需求][jresplus][ui]-queryTabl,grid当设置"selectModel":"single",取消"rowSelect":"true"的设置，在IE7浏览器下，无法选中单选框
 * 2014-06-19	  wuxl             STORY #8484 queryTable组件的分页栏信息建议加上总页数，总条数(优化：1.解决刷新数据时页面渲染时的晃动;2.点击分页按钮不再跳至页面顶部)
 * 2014-06-26     zhangsu          BUG #7179 querytalbe ：通过data属性加载数据，调用方法 getSelecteds(true)能获得值  
 * 2014-10-14     zhangsu          STORY #9802 [经纪业务事业部/胡志武][TS:201409230017]-JRESPlus-ui-事件错误：QueryTable事件上，原始有一个datafilter 事件,自从7月份的版本之后，这个就没有了
 * 2014-10-28	  wangyb10555		BUG #7852 9802静态数据---querytable的datafilter 事件不能执行
 * 2015-08-25     zhangsu           STORY #12437 有翻页最后一页没数据的问题 STORY #12435 QueryTable增加显示第几页
 * 2015-09-09     zhangsu           STORY #12937QueryTable的刷新,当查询结果为空，没有数据时，改为可用状态
 * 2015-09-28     周智星                                 STORY #12627 【TS:201508200177-JRESPlus-内部客户-蔡乃涛-一.<br>radiobutton的定位显示问题 一个页面有两个以上的grid时有问题，所以name要加上gridName来区分是哪个gird对象
 * 2015-10-09     周智星                                 BUG   #11940 需求13314，querytable中"titleButtons":""时，按钮栏会显示，建议与title一致，不显示
 * 2016-1-20      刘龙                                     STORY 16444 【TS:201601130123-JRESPlus-经纪业务事业部-张小攀-【项目名称】UF3.0<br>【产品及版本信息】jrespl】
 * 2016-1-22      刘龙                                     STORY  16542 【TS:201601150495-JRESPlus-经纪业务事业部-张小攀-5.query_table和datagrid数据格式化不统一】
 * 2016-3-2       刘龙                                     需求17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
 * ----------------------------------------------------------------------- 
 */



/**
 * @name Horn.QueryTable
 * @class
 * 查询表格<br/>
 * 带查询表单的表格展示
 */
/**
 * @lends Horn.QueryTable#
 */
	 
/**
 * 组件的唯一标示
 * @name Horn.QueryTable#<b>id</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 组件的名称
 * @name Horn.QueryTable#<b>name</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 组件的请求地址 
 * 当url属性未配置，而bindformname属性设置了,控件会取绑定的表单的action属性值作为请求地址
 * @name Horn.QueryTable#<b>url</b>
 * @type String
 * @default ''
 * @example
 * 无
 */

/**
 * 组件的跨列数(支持1-4列)
 * @name Horn.QueryTable#<b>cols</b>
 * @type Number
 * @default 3
 * @example
 * 无
 */
	 
/**
 * 组件的title不设置或者设置为空时(如："title":"")不显示标题栏和按钮栏
 * @name Horn.QueryTable#<b>title</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * 表格的高度。注：1.不设置此值时，采用默认高度（438px）；2.此值小于表格内容高度时，会出现纵向滚动条
 * @name Horn.QueryTable#<b>height</b>
 * @type String
 * @default 
 * @example
 * 无
 */
/**
 * 表格的宽度。注：1.不设置此值时，采用默认宽度（100%）；2.此值大于浏览器宽度时，会出现横向滚动条,所以不建议设置width的值
 * @name Horn.QueryTable#<b>width</b>
 * @type String
 * @default 
 * @example
 * 无
 */	
/**
 * 每页请求的条数
 * @name Horn.QueryTable#<b>request_num</b>
 * @type Number
 * @default 10
 * @example
 * 无
 */

/**
 * 展示的数据源
 * @name Horn.QueryTable#<b>data</b>
 * @type Array
 * @default 
 * @example
 * 示例：
 * [{"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"},
 *   {"branchNo":8888,"initDate":"20130101"}]
 */
	
/**
 * 是否有分页  注意：hasPage属性将作为后台识别是否提供分页数据的标识。该参数存在于请求参数中
 * @name Horn.QueryTable#<b>hasPage</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * 请求成功回调函数
 * @name Horn.QueryTable#<b>callback</b>
 * @type function
 * @default 
 * @example
 * 无
 */
	 
/**
 * 定位串，定位串的属性名
 * @name Horn.QueryTable#<b>position_str</b>
 * @type String
 * @default position_str
 * @example
 * 无
 */
	
/**
 * 自定义查询条件，每次请求时该查询条件都会提交到后台
 * @name Horn.QueryTable#<b>baseparams</b>
 * @type json
 * @default 
 * @example
 * 无
 */
	
/**
 * 列配置项
 * @name Horn.QueryTable#<b>items</b>
 * @type Array 
 * @default 
 * @example
 * items中的单个列表条目属性：
 * <table>
 *	<tr><td>属性名</td>  <td>类型</td> <td>说明</td> <td>默认值</td></tr>
	<tr><td>name</td> <td>String</td>    <td>列数据索引名 即dataIndex</td> <td>--</td> </tr>
	<tr><td>text</td>   <td>String</td> <td>列头名称</td>  <td>--</td> </tr>
	<tr><td>width</td>   <td>String</td> <td>列头宽度</td>  <td>--</td> </tr>
	<tr><td>hidden</td>   <td>Boolean</td> <td>列是否隐藏</td>  <td>--</td> </tr>
	<tr><td>renderer</td>   <td>String</td> <td>列渲染函数名(可以任意渲染成想要的内容)</td>  <td>--</td> </tr>
	<tr><td>buttons</td>   <td>Array</td> <td>操作列，设置此属性后，属性值会被渲染成多个链接</td>  <td>--</td> </tr>
	<tr><td>dictName</td>   <td>String</td> <td>字典条目名称(数据字典翻译，如数据库值为1，对应的数据字典值为男，翻译后列表显示为男)</td>  <td>--</td> </tr>
	<tr><td>format</td>   <td>String</td> <td>列格式化时的格式 ，需要与dataType属性结合使用，单独设置此值不生效。1.dataType="DATE"时，format格式形如"yyyyMMdd"；2.dataType="AMOUNT"时，format格式形如",.00"，其中逗号控制是否显示千位分隔符，点号控制小数位数。</td>  <td>--</td> </tr>
	<tr><td>dataType</td>   <td>String</td> <td>列格式化的类型，目前只支持日期和金额两种类型，日期：dataType="DATE",金额dataType="AMOUNT"。1.如果不设置format属性，"DATE"默认显示格式为："yyyy-MM-dd HH:mm:ss"，"AMOUNT"默认显示格式为："0,000.00"。2.dataType="DATE"时，待格式化列的数据若为字符串，只能是6位，形式如："20130101";若为非字符串形式，一律按GMT时间进行格式化，形式如：1137075575000。</td>  <td>--</td> </tr>
	</table>
	
	 "items":[
                    {"name":"initDate","text":"发生日期","hidden":true},
                    {"name":"branchNo", "dictName":"branch", "text":"机构（动态字典）"},
                    {"name":"clientId","text":"客户编号","renderer" : "clientIdRender" },
                    {"name":"clientName","text":"客户名称","buttons":[{"label":"设置默认1","event":"edit"}]},
                    {"name":"scanType","dictName":"branch","text":"测试列"},
                    {"name":"initDate","text":"dataType为AMOUNT","dataType":"AMOUNT"}, 
                    {"name":"initDate","text":"format单独使用不生效","format":"yyyy-MM-dd"}, 
                    {"name":"initDate","text":"dataType为AMOUNT时format不生效","dataType":"AMOUNT","format":"yyyy-MM-dd"},    
                    {"name":"initDate","text":"dataType为DATE","dataType":"DATE","format":"yyyy-MM-dd"}
                 ]
 *renderer属性用法示例：
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
 *
 */
	
/**
 * 行数据选择模式（single/multi 启用单选/多选选择框）
 * 当不配置selectModel或selectModel为""属性时,不显示选择列
 * @name Horn.QueryTable#<b>selectModel</b>
 * @type String
 * @default 
 * @example
 * 无
 */
	
/**
 * 是否显示序号列索引
 * @name Horn.QueryTable#<b>numbercolumn</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
	
/**
 * 是否使用普通参数模式 ,主要控制request_num(每页请求的记录数,pageSize)的值
 * 注意：当simpleRequest=false时,request_num = request_num+1
 *       当simpleRequest=true时,request_num = request_num
 * @name Horn.QueryTable#<b>simpleRequest</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * datafilter 事件是在请求加载成功后，数据返回，用于进行数据过滤的
 * @name Horn.QueryTable#<b>datafilter</b>
 * @type String
 * @default 无
 * @example
 * 无
 */
	
/**
 * 不设置titleButtons或设置的值为空(如："titleButtons":"")时不显示工具按钮，如下情况按钮就被隐藏:</br>
 * 1.按钮没有配置关联菜单属性refmenu并且没有配置event属性,按钮将被隐藏</br>
 * 2.按钮配置了event属性，但是值为空，按将被隐藏</br>
 * 3.按钮配置了event属性，但是配置的event值不存在，按钮将被隐藏</br>
 * (注！titleButtons不支持多行显示，如果按钮过多，建议使用绑定菜单refmenu方式)
 * 默认提供添加、修改、删除、确认、查询、打开、保存、刷新的样式,cls属性分别对应："add","edit","del","confirm","query","open","save","refresh"
 * 
 * @name Horn.QueryTable#<b>titleButtons</b>
 * @type Array 
 * @default 
 * @example
 * "titleButtons":[{"label":"添加","cls":"add","event":"add()"}]
 * 单个按钮属性：
 *	       label   {String}  按钮文本
 *	       cls     {String}  按钮css样式
 *	       event   {String}  按钮点击事件
 *	       disabled {Boolean} 是否禁用/启用按钮
 * 		   refmenu {string} 按钮中关联menu组件
 */
	
/**
 * 事件
 * 控件支持的事件列表如下：<br>
 * rowclick  行单击事件    事件参数：rowdata  当前被点击的一行数据<br>
 * rowdblclick  行双击事件 事件参数：rowdata  当前被点击的一行数据<br>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @name Horn.QueryTable#<b>events</b>
 * @type Array 
 * @default 
 * @example
 * "events":[
 *		{"event":"rowclick","function":"lhkh.tableRowClick(rowdata)"},
 *		{"event":"rowdblclick","function":"lhkh.tableRowDblClick(rowdata)"}]
 */
/**
 * 打开页面时是否自动加载查询,默认为false
 * @name Horn.QueryTable#<b>autoLoad</b>
 * @type Boolean
 * @default false
 */
/**
 * 邦定form表单的名字,邦定此属性后,querytable将表单中的输入参数作为查询条件进行数据查询
 * @name Horn.QueryTable#<b>bindFormName</b>
 * @type String
 */
	 
/**
 * 数据请求方式（get,post）
 * @name Horn.QueryTable#<b>requestMethod</b>
 * @type String
 * @default 默认为"post"
 */

/**
 * @description 是否启用点击行选中行操作,默认值为false，不启用,设置为true时点击行选中才生效
 * @property rowSelect
 * @name Horn.QueryTable#<b>rowSelect</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */
/**
 * @description isDragColumn的表格列是否可以拖动，默认false</br>
 * (注意！如果为true,页面上就必须引入jquery.resizableColumns.mini.js文件，name属性必须填写，否则无法拖动。如果表格自定义了宽度，拖动功能失效。表格不能放在自定义宽度的容器里,如,window组件和tabPanel组件等)
 * @property isDragColumn
 * @name Horn.QueryTable#<b>isDragColumn</b>
 * @type Boolean
 * @default false
 * @ignore
 * @example
 * 无
 */
Horn.QueryTable = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"QueryTable",
    table : null,
    form : null ,
    dicName : null,
    delimiter:",",
    ths : [],
    simpleRequest:false,
    postData : null,
    rowSelect : false,
    keyAttr : "label",
    valueAttr : "value",
    clickFlag:null,
    mutiSelect:false,
    /**
     * @ignore
     */
    init : function(dom) {
        Horn.QueryTable.superclass.init.apply(this,arguments) ;
        this.table = $(dom);
        var baseparams = this.params.baseparams || {};
        var bindformname = this.params["bindformname"] ;
        if(!bindformname){
        	bindformname = this.params["bindFormName"] ;
        }
        //Grid点击行选中该行的配置支持
        this.rowSelect = Boolean(this.params["rowSelect"]);
        var formData = {} ,
        	data = {
		        request_num : 10, // 每页请求条数
		        index : this.INDEX_PAGE, // 页数
		        positionArr : [], // 保存定位串
		        start_position_str : 0,// 开始请求定位串
		        returndata : null,// 返回数据 list
		        url : '', // 请求路径
		        position_str : 'position_str',// 返回数据定位字段
		        hasPage : false, // 是否有分页
		        baseparams : baseparams,
		        params : {},
		        autoLoad:false,
		        requestMethod:"post"
		        // 参数
		    };
        if(bindformname){
            this.form = Horn.getCurrent().find("form[name='"+bindformname+"']") ;
            formData = Horn.Util.getValues(this.form) ;
        }
        data.request_num = formData["request_num"] || this.params["request_num"] || data.request_num ;
        //BUG #6544
        data.request_num = parseInt(data.request_num)>0 ? parseInt(data.request_num):10;
        data.autoLoad = Boolean(this.params["autoLoad"]) ;
        data.url = this.params["url"] ;
        //BUG #6567 
        if(this.params["requestMethod"] && (this.params["requestMethod"].toLowerCase()=="post"||this.params["requestMethod"].toLowerCase()=="get")){
        	data.requestMethod = this.params["requestMethod"] ;
        }
        if(!data.url && this.form && this.form.length){
            data.url = this.form.attr("action")  ;
        }
        if(data.url && data.url.indexOf("http:")==-1){
            data.url = context_path + data.url;
        }

        data.start_position_str = formData["position_str"] ||
        this.params["start_position_str"] || data.start_position_str ;

        if (this.params["position_str"]) {
            data.position_str = this.params["position_str"];
        }
        //BUG #6545  //BUG #6546
        //BUG #6728
        data.hasPage = Boolean(this.params["hasPage"]!=undefined||this.params["hasPage"]!=null?this.params["hasPage"]:data.hasPage);
        
        data.positionArr.push(data.start_position_str);
        
        this.postData = data;
        var _this = this ;
		this.ths = this.el.find("th");
		//关于普通请求的部分
        if(this.params['simpleRequest'] == true){
        	this.simpleRequest = true;
        }
        
        if(data.url && data.autoLoad == true){
            _this.loadByForm.call(_this);
        }
        //点击事件和双击事件
//        this.rowclick = this.table.attr("rowclick");
//        this.rowdblclick = this.table.attr("rowdblclick");
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
        
        if(this.params['selectModel']=='muti' || this.params['selectModel']=='multi'){
        	this.mutiSelect = true;
        }
       	//关于字典项目的翻译功能。
		this.ths.each(function(index,th){
			var hidden = th.attributes["hidden"];
			th=$(th);
			var dictName = th.attr("dictName"),
				itemscolNo = th.attr('colno'),
				staticDict=undefined;
			var tempStaticDict=undefined,buttons=undefined;
			if(itemscolNo){
				tempStaticDict = _this.params.items[itemscolNo -1].items;
				buttons = _this.params.items[itemscolNo -1].buttons;
			}
			
			if(hidden!=null && hidden!=undefined && hidden.value == true.toString()){
				th.hide(); 
			}
			if(dictName){
				staticDict = {};
				//先把dict解析出来，避免重复查找dom
				var lis = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li");
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');
					var key = li.attr('key');
					staticDict[key] = label;
				});
			}else if(tempStaticDict){
				staticDict = {};
				$(tempStaticDict).each(function(idx,item){
					
					staticDict[item[_this.keyAttr]] = item[_this.valueAttr];  //bug 6797
				});
			}
			th.data('staticDict',staticDict);
			th.data('buttons',buttons);
		});

		
		
		this.selecteds = [];
		if(this.params.data){     //如果querytable是通过data属性来加载数据（同grid的方式）zhangsu
			  this.dictTrans();
			  this.initEvents();
			  this.hiddenColumns();
			  this.lastList = this.params.data;
			  
			  //BUG #7852 9802静态数据---querytable的datafilter 事件不能执行
			  this.doDataFilter(this.params.data);
		}
		 
        		
		this.el.find('.h_querytable_select_all').change(function(){
			if(this.checked){
				_this.selectAll();
			}else{
				_this.unSelectAll();
			}
		});
		
		//表格列是否可以拖动，默认不拖动
		if(this.params.isDragColumn){
			if(this.params.name&&this.params.name!=""){
				$("."+this.params.name).resizableColumns({});
			}
		}
    },
    customEvents : "rowclick,rowdblclick",
    getEventTarget : function() {
    	return this.el;
    },
    
    /**
     * @private
     * @ignore
     */
    stateTest : function(){
    	var _this = this;
		var checkAll = true;
		_this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		if(!$(checkbox).prop("checked")){
    			checkAll = false;
    		}
    	});
		if(checkAll){
			_this.el.find('.h_querytable_select_all').prop("checked", true);
		}else{
			_this.el.find('.h_querytable_select_all').prop("checked", false);
		}
    },
    /**
     * @private
     * @ignore
     */
    initEvents : function(){
    	var _table = this.el;
    	var _tbody = _table.children('tbody');
    	var _this = this;
    	var isCheckbox = _this.el.find('.h_querytable_select_all').length>0?true:false;
	    if(isCheckbox){
			this.el.find('.h_querytable_select').change(function(){
				_this.stateTest();
			});
	    }	
        if(this.rowSelect == true){
        	_tbody.children('tr').each(function(i,tr){
    		    var rowidx = i;
    		    var _tr = $(tr),
    		    checkbox = _this.mutiSelect?_tr.find("input:checkbox.h_querytable_select"):_tr.find("input:radio.h_querytable_select")//BUG #6574
    		;
    		var _clickFlag=this.clickFlag;
    		_tr.bind('click',function(e) {    //BUG #6562
    			clearTimeout(_clickFlag);
    			_clickFlag=setTimeout(function(){
    				if($.isEmptyObject(_this.selecteds)){
        				_this.selectRow(rowidx, _tr);
        			}else{
        				if(!_this.selecteds.hasOwnProperty(rowidx)){
        				    _this.selectRow(rowidx, _tr);
    					 }else{
    						 _this.unSelectRow(rowidx, _tr);
    					 }
//        				if(_this.lastSelect&&_this.lastSelect.rowidx != rowidx){
//        					 if(!_this.selecteds.hasOwnProperty(rowidx)){
//            				    _this.selectRow(rowidx, _tr);
//        					 }else{
//        						 _this.unSelectRow(rowidx, _tr);
//        					 }	 
//            			}else{
//            				_this.unSelectRow(rowidx, _tr);
//            			}
        			}
    				if(isCheckbox){
            			_this.stateTest();
    				}
    			},10);
    			
    		 });
    		
    		/*
    		    _tr.toggle(function(){
    		    	_this.selectRow(rowidx,_tr);
    		    },function(){
    		    	_this.unSelectRow(rowidx, _tr);
    		    });
    		    */
            });
        }
    },
    /**
     * @private
     * @ignore
     */
    hiddenColumns : function(){
    	var trs = this.el.children('tbody').children('tr');
    	var ths = this.ths;
    	
    	ths.each(function(thidx,thdom){
    		var th = $(thdom);
    		//隐藏列
    		var hidden = thdom.attributes["hidden"];
    		if(hidden!=null && hidden!=undefined && hidden.value == true.toString() ){
    			th.hide(); 
    			//trs each
    	    	trs.each(function(tridx,trdom){
    	    		var tr = $(trdom);
    	    		var tds = tr.find('td');
    	    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    	    			var td = $(tds[tdidx]);
    	    			if(thidx == tdidx){
    	    				td.hide();
    	    				break;
    	    			}
    	    		}
    	    	});
    		}
    	});
    	
    },
    /**
     * @description 根据form中的查询条件参数查询数据，需要配置属性bindFormName才能生效,内部会将绑定表单的数据做为查询条件通过load进行处理
     * @function
     * @name Horn.QueryTable#loadByForm
     */
    loadByForm : function(){
        var params = {} ;
        if(this.form && this.form.length){
            params = this.form.serializeArray() ;
        }
        this.load(params) ;
    },
    /**
     * @description 设置QueryTable向后台发送请求时的用户自定义参数，被设置的参数会做为基础查询条件，但是当调用loadByForm或者load时使用的查询参数会覆盖baseparam中的已有查询参数<br/>
     * 说明：<br/>
     * 如果baseparams={"name":"zhansan","age":1}<br/>
     * 使用load或者loadByForm的参数为{"name":"lisi","addr":"123"}<br/>
     * 最终应用的请求参数为{"name":"lisi","age":1,"addr":"123"}
     * @function
     * @name Horn.QueryTable#setBaseParams
     * @params {Json}  params 自定义参数
     */
    setBaseParams:function(params){
    	 if(params){
    		 this.postData.baseparams=params;
    	 }else{
    		 this.postData.baseparams={};
    	 }
    	 
//        Horn.apply(this.postData.baseparams,params) ;
    },
    /**
     * @description 根据传入的参数查询数据,此方法调用会影响已存在的查询条件（如loadbyForm产生的查询条件，但不影响baseparams）原有的查询条件会被覆盖，且如果为空会清空原来的查询条件；
     * @function
     * @name Horn.QueryTable#load
     * @param {Json} params   传入的查询条件参数 (可选) 
     */
    load : function(params){
        var data = this.postData ;
        if(params){
            if($.type(params)=="array"){
                data.params = Horn.Util.arr2Obj(params) ;
             // Horn.apply(data.params,data.baseparams) ;  BUG #6598
            }
            else{
                data.params = params ;
            }
        }
        else{
            data.params = {} ;
        }
        this.goPage(this.INDEX_PAGE);
    },
    INDEX_PAGE:1,
    /**
     * @description 下一页,基于已有的查询条件查询下一页
     * @function
     * @name Horn.QueryTable#nextpage 
     */
    nextpage : function() {
        this.goPage(this.postData.index +1 );
    },
    /**
     * @description 上一页,基于已有的查询条件查询上一页
     * @function
     * @name Horn.QueryTable#prevpage
     */
    prevpage : function() {
        this.goPage(this.postData.index -1);
    },
    /**
     * @description 第一页,基于已有的查询条件查询第一页
     * @function
     * @name Horn.QueryTable#firstpage
     */
    firstpage : function() {
        this.goPage(this.INDEX_PAGE);
    },
    /**
     * @description 刷新页面,基于已有的查询条件刷新当前页
     * @function
     * @name Horn.QueryTable#refreshpage
     */
    refreshpage : function() {
        this.ajaxRequest();
    },
    /**
     * @ignore
     * @description 跳到指定页,基于已有的查询条件查询指定页
     * @function
     * @name Horn.QueryTable#goPage
     * @param {int} page
     */
    goPage : function(page){
    	if(page < this.INDEX_PAGE ) page = this.INDEX_PAGE;
    	this.postData.index = page;
    	this.ajaxRequest(this.el);
    },
    /**
     * @ignore
     */
    ajaxRequest : function() {
        var _this = this,
	        table = this.el,
	        data = this.postData,
	        positionArr = data.positionArr,
	        tbody = table.children("tbody") ,
	        params = data.params;
        //BUG #6598
       // Horn.apply(params,data.baseparams) ;
        //BUG #6876
        params=$.extend({},data.baseparams,params);
        
        //BUG #6545
        params["hasPage"] = data.hasPage;
        // 重新设置定位串
		if (params != null ) {
				//params[data.position_str] = positionArr[data.index]|| data.start_position_str;
			params["position_str"] = positionArr[data.index]|| data.start_position_str;	//STORY #8367
			params.request_num = data.request_num
						+ (this.simpleRequest ? 0 : 1);
		}
		//if (this.simpleRequest) {
			params.index = data.index;
		//}
		var colLength = this.ths.length;
		//BUG #6729 ,不分页的时候不需要这些参数
		if(params["hasPage"]==false){
			//delete params.request_num;
		}
		var bindformname = this.params["bindformname"] ;
        if(!bindformname){
        	bindformname = this.params["bindFormName"] ;
        }
        if(bindformname){
            var serValues = $("form[name="+bindformname+"]").serializeArray();
        	var formValues = Horn.Util.arr2Obj(serValues) ;
        	$.each(formValues, function (name, value) {
       		 	params[name] = value;
            });
        }
        $.ajax(data.url,
            {
                async : true,
                beforeSend : function(xhr) {
                    tbody.html("<tr><td colSpan='"
                        + colLength
                        + "'><p class='h_loading'>正在加载</p></td></tr>");
                },
                type : data.requestMethod,
                data : Horn.Util.obj2Arr(params) ,
                dataType : "json",
                error : function(xhr, textStatus, errorThrown) {
                    var status = xhr.status;
                    tbody.html(
                        "<tr><td colSpan='" + colLength
                            + "'><p>请求失败</p><p>错误状态："
                            + status + "；错误信息："
                            + textStatus
                            + "</p></td></tr>");
                },
                success : function(reqData, textStatus, jqXHR) {
                    _this.callback.call(_this, _this.doDataFilter(reqData));
                    _this.doCallBack(reqData);
                    _this.lastSelect = null;
                    _this.selecteds = {};
                }
            });

    },
    doDataFilter:function(reqData){
        var table = this.table;
        var datafilter = this.params["datafilter"];    //story9802 
        if(datafilter){
            var datafilterOjb = Horn.Util.getFunObj(datafilter);
            if(datafilterOjb && $.type(datafilterOjb.fn) == "function"){
                reqData = datafilterOjb.fn.call(this,reqData);
            }
        }
        return reqData;
    },
    doCallBack:function(reqData){
        var table = this.table;
        var callback = table.attr("callback");
        if(callback){
            var callBackOjb = Horn.Util.getFunObj(callback);
            if(callBackOjb && $.type(callBackOjb.fn) == "function"){
                callBackOjb.fn.call(this,reqData);
            }
        }
        $('.h_screen').height('auto');
        setTimeout(function(){
        	if(window.doLayout){
        		window.doLayout();
        	}
        },1000);
        this.dictTrans();
    },
    /**
     * @ignore
     */
    callback : function(reqData) {
//        if(!reqData){
//            reqData=[] ;
//        }
    	reqData = reqData || {total:0,rows:[]};
    	if ($.type(reqData) == "array") {
    		reqData = {rows:reqData};
    	}
    	
    	var list = reqData.rows;
        var table = this.table;
        var gridName = table.attr("name");
        var _this = this;
        var htmlArr = [];
//        var returndata = reqData;
        var ths = this.ths;
        var colLength = ths.length;
        var isSuccess = false;
        var data = this.postData;
//        var list = reqData;
        this.lastList = list;
        this.selecteds=[];
        this.lastSelect={};
        this.el.find('.h_querytable_select_all').prop("checked", false);
        table.css("height", "auto");
        if (list && list.length > 0) {
            data.list = list.slice(0,data.request_num);
            isSuccess = true;
            for ( var i = 0; i < list.length; i++) {
                var itemData = list[i];
                htmlArr.push("<tr>");
                ths.each(function(index, o) {
                    var th = $(o);
                    if(th.hasClass("h_numbercolumn")){
                    	htmlArr.push("<td>"+(i+1)+"</td>");
                    	return;
                    }else if(th.hasClass("h_querytable_checkboxcolumn")){
                    	htmlArr.push("<td><input type=\"checkbox\" class=\"h_querytable_select\"/></td>");
                    	return;
                    }else if(th.hasClass("h_querytable_radioboxcolumn")){//BUG #6574
                    	// STORY #12627 【TS:201508200177-JRESPlus-内部客户-蔡乃涛-一.<br>radiobutton的定位显示问题 一个页面有两个以上的grid时有问题，所以name要加上gridName来区分是哪个gird对象
                    	htmlArr.push("<td><input type=\"radio\" class=\"h_querytable_select\" name=\"_querytable_row_checker_"+gridName+"\"/></td>");//STORY #8454 
                    	return;
                    }
                    
                    var name = th.attr("name");
                    var dealFun = th.attr("dealFun");
                    htmlArr.push("<td><div style='overflow: visible;white-space: normal;word-wrap:break-word; word-break:break-all'>");
                    if (dealFun) {
                        var dFun = eval("(window." + dealFun + ")") ;
                        if($.type(dFun) == "function"){
                            // 提供个性化处理元素数据的js方法
                            htmlArr.push(dFun(itemData[name],itemData, list,i,index));
                        }
                    } else {
                        //16542 【TS:201601150495-JRESPlus-经纪业务事业部-张小攀-5.query_table和datagrid数据格式化不统一】
                        var value=itemData[name];
                        var dataType = th.attr("dataType");
                        var format = th.attr("format");
                        if(dataType && dataType !=null){
						   	   value = Horn.Util.Format.all(dataType,format,value);
						   }
                        htmlArr.push(value);
                    }
                    htmlArr.push("</div></td>");
                });
                htmlArr.push("</tr>");
                if (i == data.request_num - 1) {
                    // 当页已满
                    data.positionArr[data.index + 1] = itemData[data.position_str];
                    break;
                }
            }
        } else if (reqData.errorInfo || reqData.err_info) {
            data.list = [];
            var errorInfo=reqData.errorInfo||reqData.err_info;
            htmlArr.push("<tr><td colspan='" + colLength + "'>");
            htmlArr.push("<p>" + errorInfo + "</p>");
            htmlArr.push("</td></tr>");
        } else {
            data.list = [];
            htmlArr.push("<tr><td colspan='" + colLength + "'>");
            htmlArr.push("<p>没有查询到数据</p>");
            htmlArr.push("</td></tr>");
        }
        var tbody = table.children("tbody");
        tbody.html(htmlArr.join(""));
        //为表格添加高度属性 16444 【TS:201601130123-JRESPlus-经纪业务事业部-张小攀-【项目名称】UF3.0<br>【产品及版本信息】jrespl】
        var h_listtable=table.parent(".h_listtable");
        var h_head=table.parent(".h_listtable").parent(".g-datagrid-wrap").children(".u-datagrid-header");
        var h_page=table.parent(".h_listtable").parent(".g-datagrid-wrap").children(".u-datagrid-page");
        var h_body=table.parent(".h_listtable").parent(".g-datagrid-wrap").parent(".m-panel-body");
        if(this.params["height"] && this.params["height"] != null){
        	var tableHeight=parseFloat(this.params["height"]);
        	if(!isNaN(tableHeight)){
        		h_listtable.css("height",tableHeight);
        	}
        }
        if(this.params["width"] && this.params["width"] != null){
        	var tableWidth=parseFloat(this.params["width"]);
        	if(!isNaN(tableWidth)){
        		h_listtable.css("width",tableWidth);
        		h_head.css("width",tableWidth);
        		h_page.css("width",tableWidth);
        		h_body.css("width",tableWidth+22);
        	}
        }
        // 增加效果
        if (isSuccess) {
            // 默认样式
            tbody.children("tr:odd").addClass("u-table-bg");
            // ** 鼠标滑动事件
            // tbody.children("tr").hover(function() {
            //     $(this).addClass("u-table-selected");
            // }, function() {
            //     $(this).removeClass("u-table-selected");
            // });
            // 表格单击,双击事件
            var rowClickObj =undefined;
            var rowDBLClickObj =undefined;
            var rowClickFn=undefined;
            var rowDBLClickFn=undefined;
            if (this.rowclick) {
                rowClickObj = Horn.Util.getFunObj(this.rowclick);
                if($.type(rowClickObj.fn) == "function"){
                    rowClickFn = rowClickObj.fn ;
                }
            }
            if(this.rowdblclick){
                rowDBLClickObj = Horn.Util.getFunObj(this.rowdblclick);
                if($.type(rowDBLClickObj.fn) == "function"){
                    rowDBLClickFn = rowDBLClickObj.fn ;
                }
            }
            if (rowClickFn || rowDBLClickFn) {
                var trs = tbody.children("tr");
                var _clickFlag=this.clickFlag;
                for ( var i = 0; i < data.list.length; i++) {
                    var tr = $(trs.get(i));
                    if(rowClickFn){
                        var params = rowClickObj.params.slice(0);
                        params.push(data.list[i], data.list);
                        tr.bind('click',params, function(e) {
                            var p = e.data ;
                            var _this=this;
                            clearTimeout(_clickFlag);
                            _clickFlag=setTimeout(function(){
                            	return rowClickObj.fn.apply(_this,p);
                            },300);
                           // return rowClickObj.fn.apply(this,p);
                        });
                    }
                    if(rowDBLClickFn){
                        var params = rowDBLClickObj.params.slice(0);
                        params.push(data.list[i], data.list);
                        
                        tr.bind('dblclick', params,function(e) {
                        	clearTimeout(_clickFlag);
                            var p = e.data ;
                            return rowDBLClickObj.fn.apply(this,p);
                        });
                    }
                }
            }
          //增加rowselect hidden
            this.initEvents();
    		this.hiddenColumns();
        }
        
        //table.css("height", table.css("height"));
        
        if (data.hasPage) {
            // 开始生成分页链接
        	
    	
            var pageArr = [];
            pageArr.push('<ul class="m-pagebar">');
            if (data.index > _this.INDEX_PAGE) {
            	pageArr.push('<li><a href="javascript:void(0)"  class="h_page-first first_page_btn" title="首页"><i class="fa fa-step-backward"></i></a></li>');
            	pageArr.push('<li><a href="javascript:void(0)" class="h_pagebtn-prev h_page-pgLast pre_page_btn" title="上一页"><i class="fa fa-caret-left"></i></a></li>');
            } else {
            	pageArr.push('<li><a href="javascript:void(0)"  class="disabled first_page_btn" title="首页"><i class="fa fa-step-backward"></i></a></li>');
            	pageArr.push('<li><a href="javascript:void(0)" class="disabled pre_page_btn" title="上一页"><i class="fa fa-caret-left"></i></a></li>');
               
            }
           
            
            if(this.simpleRequest){
            	if (list != null && (list.length +1) > data.request_num) {
	                pageArr.push('<li><a href="javascript:void(0)" class="h_page-pgNext next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
	            } else {
	            	pageArr.push('<li><a href="javascript:void(0)" class="disabled next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
            	}
            }else{
	            if (list != null && list.length > data.request_num) {
	            	pageArr.push('<li><a href="javascript:void(0)" class="h_page-pgNext next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
	            } else {
	            	pageArr.push('<li><a href="javascript:void(0)" class="disabled next_page_btn" title="下一页"><i class="fa fa-caret-right"></i></a></li>');
            	}
            }
            pageArr.push('<li><a href="javascript:void(0)" class="h_page-refresh refresh_btn" title="刷新"><i class="fa fa-refresh"></i></a></li>');
            pageArr.push('</ul>');
            var total_num = reqData.total; var pageIndex = this.postData.index;
            if (total_num != undefined) {
            	var pagesnum = Math.ceil(parseInt(total_num) / parseInt(data.request_num));
            	pageArr.push('<div  class="m-pagebar-all">共'+pagesnum+'页,共'+total_num+'条记录,当前第'+pageIndex+'页</div>');
            }
            var page = table.parent(".h_listtable").next("div.u-datagrid-page").children(".h_querytable_pages").html(pageArr.join(""));
//            table.next("div.h_pages").html(pageArr.join(""));
            // 增加事件
//            var page = table.next("div.h_pages");
            
            
            page.children("ul").children("li").children("a.h_page-first").click(function(e) {
                return _this.firstpage.call(_this, table, e);
            });
           page.children("ul").children("li").children("a.h_page-pgLast").click(function(e) {
                return _this.prevpage.call(_this, table, e);
            });
           page.children("ul").children("li").children("a.h_page-pgNext").click(function(e) {
                return _this.nextpage.call(_this, table, e);
            });
            page.children("ul").children("li").children("a.h_page-refresh").click(function(e) {
                return _this.refreshpage.call(_this, table, e);
            });
        }
       this.resetTdContent();
    },
    /**
     * @ignore 
     * @description 加载数据集中的数据
     * 将该数据集中的数据展现在表格中，不发送请求
     * @function
     * @name Horn.QueryTable#loadData
     * @param {Array} reqData 数据集
     */
    loadData:function(reqData){
        this.callback(reqData);
        this.doCallBack(reqData);   //BUG #6532
    },
    /**
     *重置列展示内容,如果字段大于60个字符，就把内容放到文本域中
     * @ignore
     */
    resetTdContent : function(){
    	var _this = this;
    	var trs = this.table.children('tbody').children('tr');
    	var headtrs = this.table.children('thead').children('tr');
    	var rows = [];
    	trs.each(function(tridx,trdom){
    		var tr = $(trdom);
    		var tds = tr.find('td');
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdWidth = td.attr("width");
    			var tdDiv = td.children("div");
    			var text =td.text();
    			var itemW = headtrs.find('th:eq('+tdidx+')').attr("width");
    			if(itemW){
    				var width = itemW.replace("px","").replace("PX","");
    				tdDiv.css("width",width);
    			}
	    		if(_this.getStrlen(text)>40){
	    			if(rows.indexOf(tdidx)==-1){
	    				rows.push(tdidx);
	    			}
	    			tdDiv.css("width",300);
	    			td.css("width",300);
	    		}
    		}
    	});
    	
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
     * @ignore
     * @description 当某行被引用时会触发此事件。
     * @event
     * @name Horn.QueryTable#onRowSelect
     * @param {DOMDocument} tr 当前选择的行
     * @param {int} rowidx 行号
     * @param {object} vals 行数据
     */
    onRowSelect:function(){},
    /**
     * 所有被选中值
     * @ignore
     * @type {Array}
     */
    selecteds:null,
    /**
     * @description 选择所有行。
     * @function
     * @name Horn.QueryTable#selectAll
     */
    selectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx);
    		}
    	});
    	this.el.find('.h_querytable_select_all').prop("checked", true);
    },
    /**
     * @ignore
     * @description 清除选择。
     * @function
     * @name Horn.QueryTable#unSelectAll
     */
    unSelectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx);
    		}
    		   
    	});
    	this.el.find('.h_querytable_select_all').prop("checked", false);
    },
    /**
     * @ignore
     * @description 单选时最后选择的项目
     * @field
     * @name Horn.QueryTable#lastSelect
     * @default null
     */
    lastSelect:null,
    /**
     * @ignore
     * @description 是否多选
     * @field
     * @name Horn.QueryTable#mutiSelect
     * @default false
     */
    mutiSelect:false,
    /**
     * @description 选择某行
     * @function
     * @name Horn.QueryTable#selectRow
     * @param {int} rowidx  行索引
     * @param {JQuery} tr (可选)
     * @ignore
     */
    selectRow:function(rowidx,_tr){
    	var _table = this;
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	if(tr.length==0){
    		Horn.debug("querytable["+this.name+"]","选择的行"+rowidx+"不存在");
    		return false;
    	}
    	var vals = {};
		var ths = this.ths;
		var tds = tr.find('td');
		ths.each(function(thidx,_th){
			var td = tds.get(thidx),
				th = $(_th);
			vals[th.attr('name')] = th.attr('dictName') ? $(td).attr('key') :$(td).text();
		});
		_table.onRowSelect.call(tr,tr,rowidx,vals);
		this.selecteds[rowidx] = vals;
		if(!_table.mutiSelect) {
			var last = _table.lastSelect;
			if(last && last.rowidx !==undefined && last.rowidx != rowidx ){
				if(last.tr.find("input:radio").length>0){
					last.tr.find("input:radio").get(0).checked = false;//BUG #6574
				}
				_table.unSelectRow(last.rowidx,last.tr);
			}
			if(tr.find("input:radio").length>0){
				tr.find("input:radio").get(0).checked = true;   //选中radio//BUG #6574
			}
			
		}else{
			if(tr.find("input:checkbox").length>0){
				tr.find("input:checkbox").get(0).checked = true;   //选中checkbox
			}
			
		}
		_table.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		tr.addClass("u-table-selected");//选中行的样式
    },
    /**
     * @description 取消某行的选择
     * TODO 这里尚有些不成熟的地方，需要取消选择项的勾。
     * @function
     * @name Horn.QueryTable#unSelectRow
     * @param {DOMDocument} rowidx
     * @param {DOMDocument} tr 
     * @ignore
     */
    unSelectRow:function(rowidx,_tr){
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));    //BUG #6720
    	}
    	this.selecteds[rowidx] =null;
    	delete this.selecteds[rowidx];
    	tr.removeClass("u-table-selected");//取消选中行的样式
    	if(this.mutiSelect){
    		if(tr.find("input:checkbox").length>0){
    			tr.find("input:checkbox").get(0).checked = false;   //取消选中checkbox
    		}
    	}else{
    		if(tr.find("input:radio").length>0){
    			tr.find("input:radio").get(0).checked = false;     //取消单选radio//BUG #6574
    		}
    	}
    	//所有的选择项都取消后应该设置选择所有的checkbox为false
    	var _isNull=true;
    	for(var _name in this.selecteds){
    		_isNull=false;
    		break;
    	}
    	if(_isNull){
    		this.el.find('.h_querytable_select_all').prop("checked", false);
    	}
    },
    /**
     * @description 获取所有的选择项
     * @function
     * @name Horn.QueryTable#getSelecteds
     * @param {boolean} asSrcData(请求返回的原始数据)，如果为true，则返回的是原始数据，如果不传或为false，则是表格内显示的数据；
     * @return {Array} 返回选中的行数据
     */
    getSelecteds:function(asSrcData){
    	var selecteds = [];
    	if($.type(this.selecteds)=="array"){
    		for(var i=0;i<this.selecteds.length;i++){
        		var val = this.selecteds[i];
        		if(val){
        			selecteds.push(asSrcData?this.lastList[i]:val);
        		}
        	}
    	}else{
    		for(var key in this.selecteds){
        		var val = this.selecteds[key];
        		if(val){
        			selecteds.push(asSrcData?this.lastList[key]:val);
        		}
        	}
    	}
    	return selecteds;
    },
    /**
     * @ignore
     * 翻译字典 
     */
    dictTrans:function(){
    	var _table = this,
    		ths = this.ths,
    		trs = this.el.find("tr");
    	trs.each(function(idx,trdom){
    		var tr = $(trdom),
    			checkbox = _table.mutiSelect?tr.find("input:checkbox"):tr.find("input:radio")//BUG #6574
    		;
    		if(checkbox.hasClass('h_querytable_select')) { 
    			if(_table.rowSelect == false){           //BUG #6562 
	    			checkbox.change(function(){
		    			if(this.checked){
		    				_table.selectRow(idx-1,tr);
		    			}else{
		    				_table.unSelectRow(idx-1,tr);
		    			}
		    		});
    			}	
    		}
    		tr.find('td').each(function(tdidx,tddom){
    			var td = $(tddom);
    			var th = $(ths.get(tdidx));
	    		var dictName = th.attr("dictname"),
	    			renderer = th.attr('renderer'),
	    			buttons = th.data('buttons'),
	    			staticDict = th.data('staticDict');
	    		if( staticDict ){                    
	    			//17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
	    			if(text=="" || staticDict[td.text().trim()]== undefined){
						td.text("");
						td.attr("title","");
					}else{
						td.attr("key",td.text());
	    				td.text( staticDict[td.text()] || td.text());
					}
	    		}else if(buttons){
	    			var btns = buttons;
	    			var span = $("<span></span>");
	    			$(btns).each(function(idxx,btn){
	    				var fn = Horn.Util.getFunObj(btn.event);
	    				//如果没有这个function，则不装入这个button
	    				if(!fn.fn) return;
	    				var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>");
	    				var text = td.text();
	    				a.click(function(){
	    					fn.fn.call(a,{
	    	    				val : text,
//	    	    				rowdata : _table.data[idx-1],
//	    	    				alldata : _table.data,
//	    	    				table : _table,
	    	    				rowidx : idx,
	    	    				tdidx : tdidx,
	    	    				tr : tr,
	    	    				td : td
	    	    			});
	    				});
	    				span.append(a);
	    				if(idxx!=(btns.length-1)){
	    					span.append(' | ');
	    				}
	    			});
//	    			if(showwhenover){ 
//	    				span.addClass('h_link-default');
//	    			}
	    			td.html('');
	    			td.append(span);
	    		}
	    		if(renderer){
	    			td.attr('key',td.text());
	    			var text = td.text();
	    			var fn = Horn.Util.getFunObj(renderer);
    				//如果没有这个function，则不装入这个button
    				if(!fn.fn) return;
	    			var dom = fn.fn.call($(this),{
	    				val : text,
//	    				rowdata : _table.data[idx-1],
//	    				alldata : _table.data,
//	    				table : _table,
	    				rowidx : idx,
	    				tdidx : tdidx,
	    				tr : tr,
	    				td : td
	    			});
	    			if( dom instanceof $ ){
	    				td.html("");
	    				td.append(dom);
	    			}else{
	    				td.html(dom);
	    			}
	    		}
    		});
    	});
    }
}) ;
/**
 * @lends Horn.QueryTable
 */
$.extend(Horn.QueryTable,{
	DATANAME : "QUERYTABLE",
	/**
	 * @ignore
	 * @description 根据名字获取页面table控件
     * @function
	 * @name Horn.QueryTable.get
	 */
	get : function(name){
		var table = null ;
		if(name){
			table = Horn.getComp(name);
		}
		else{
			table = Horn.data(Horn.QueryTable.DATANAME)[0] ;
		}
		return table ;
	}
}) ;
Horn.regUI("table.h_querytable",Horn.QueryTable) ;