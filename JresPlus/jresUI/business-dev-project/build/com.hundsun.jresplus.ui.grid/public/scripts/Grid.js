/**
 * 版本：
 * 系统名称: JRESPLUS
 * 模块名称: JRESPLUS-UI
 * 文件名称: Grid.js
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：Grid组件对应的代码
 * 修改记录:
 * 修改日期       修改人员        修改说明
 * -----------------------------------------------------------------------
 * 2014-01-21     zhangsu   新增rowSelect属性，使grid支持点击行选中该行
 * 2014-01-21     zhangsu   Grid已选中的行高亮显示(样式h_table-over中颜色修改)
 * 2014-01-22     zhangsu   Grid支持单击事件
 * 2014-01-22     zhangsu   Grid支持双击事件
 * 2014-01-22     zhangsu   Grid列支持hidden属性
 * 2014-01-24     zhangsu   Grid列需要支持常规类型的格式化配置（日期、金额）
 * 2014-02-08     zhangsu   修改this.rowSelect设置后不生效的问题
 * 2014-03-11     zhangsu   当table的布局为fixed时候，需要为th设置默认宽度
 * 2014-03-12     zhangsu   STORY #7776 grid的titleButtons中的按纽需求有禁用、启用功能
 * 2014-04-11     周智星    BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
 * 2014-04-11     周智星    BUG #6610 【grid】"selectModel":"multi"之后会造成复选框变成input输入框，并且应该设置的muti是拼写错误
 * 2014-04-11     周智星    BUG #6612 【grid】rowSelect属性设置true还是表现为false，必须要设置为"true"才行，和文档中描述不一致 （把文档修改为String类型）
 * 2014-04-11     周智星    BUG #6605 【grid】numbercolumn，rowselect，selectmodel的默认值与文档中不符合 （修改文档的默认值）
 * 2014-04-11     周智星    BUG #6613 【grid】多选模式下，先调用selectAll，然后调用unSelectAll之后，需要点击两下才能完成对行的选中
 * 2014-04-11     zhangsu   BUG #6599 【grid】多选模式下，只能通过点击行来选中无法通过前面的checkbox来选中
 * 2014-04-16     zhangsu   修改titlebuttons注释，添加save/query/confirm/refresh/open样式
 * 2014-04-18     zhangsu   BUG #6760 query_table手动全选后调用方法取消全选，列头上的勾还在
 * 2014-04-22     zhangsu   BUG #6797 QueryTable_加载静态数据后静态数据字典的key和value是反的
 * 2014-04-22     zhangsu   列中包含“buttons”操作列属性，“renderer”渲染属性时，该列无tip提示，其他未配置上述属性的列正常显示tip,按单元格中内容显示。
 * 2014-04-28     hanyin   BUG #6894 grid:titleButtons中按钮的属性event不设置时会报js错误
 * 2014-05-05     周智星    BUG #6943 grid：复选，去掉某行的勾，但是列头的全选勾不会去除
 * 2014-09-10     zhangsu   STORY #9591 [财富管理事业部/陈凯][TS:201409030134]-JRESPlus-ui-Grid列配置的日期格式，在谷歌下面是生效在IE下面不生效
 * 2014-09-26     zhangsu   STORY #9848 [财富管理事业部-陈为][TS:201409260006]-JRESPlus-ui-下记问题请紧急修复下，若处理完成，请临时包提供。2.】
 * 2014-09-26     zhangsu   STORY #9847 [财富管理事业部/陈为][TS:201409260005]-JRESPlus-ui-下记问题请紧急修复下，若处理完成，请临时包提供。发现】
 * 2014-10-11		wangyubao	因为要绑定menu，那么不配置onclick的按钮也应该可以正常的显示出来
 * 2014-11-10		wangyubao	STORY #10261 [财富管理事业部/陈为][TS:201411060329]-JRESPlus-ui-Grid组件的复选框列选择的时候会影响所在行的其他列中的复选】
 * 2015-02-05     zhangsu   BUG #9192 Grid全选，去掉最后一个钩，再选上，全选框没有显示选中状态
 * 2016-3-2       刘龙                        需求17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
 * ----------------------------------------------------------------------- 
 */

/**
 * @lends Horn.Grid#
 */

/**
 * @description Grid的封装
 * @name Horn.Grid
 * @class
 * 数据列表组件，数据的装载在后台完成
 * @extends Horn.Base
 * @example
 *	<pre>\	#grid({"name":"flowTable","title":"有数据的grid"
    	    ,"numbercolumn":"true","selectModel":"muti"
    		,"items":[{"name":"initDate","text":"发生日期","renderer":"domrender"},
    			{"name":"branchNo", "text":"分支名称（静态字典）","items":[{"label":"杭州总部","value":"8888"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]},
    			{"name":"branchNo", "dictName":"Branch", "text":"分支名称（动态字典）"},
    			{"name":"scanType", "dictName":"ScanType", "text":"扫描类别"},
    			{"name":"clientId","text":"客户编号"},
    			{"name":"clientName","text":"客户名称"},
    			{"name":"branchNo", "text":"操作","showwhenover":"true","buttons":[{"label":"设置默认","event":"edit"},{"label":"设置默认","event":"edit"}]},
    			{"name":"taskStatus","text":"任务状态"}
    			]
    		,"data":$data
    	})
 *	</pre>
 */

/**
 * @description Grid的唯一标识。
 * @property id
 * @name Horn.Grid#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description Grid的名称。
 * @property name
 * @name Horn.Grid#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * @description Grid的数据。
 * @property data
 * @name Horn.Grid#<b>data</b>
 * @type Json
 * @default null
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
 * @description Grid列表条目。
 * @property items
 * @name Horn.Grid#<b>items</b>
 * @type Array
 * @default null
 * @example
 * items中的单个列表条目属性：
 * <table>
 *	<tr><td>属性名</td>  <td>类型</td> <td>说明</td> <td>默认值</td></tr>
	<tr><td>name</td> <td>String</td>    <td>列数据索引名 即dataIndex</td> <td>--</td> </tr>
	<tr><td>text</td> <td>String</td>    <td>列头名称</td> <td>--</td> </tr>
	<tr><td>align</td> <td>String</td>    <td>列内容文本位置设置，默认分为三种方位：居左：left ，居中：center ，居右：right</td> <td>--</td> </tr>
	<tr><td>headerAlign</td> <td>String</td>    <td>列头文本位置设置，默认分为三种方位：居左：left ，居中：center ，居右：right</td> <td>--</td> </tr>
	<tr><td>hidden</td> <td>Boolean</td>    <td>列是否隐藏</td> <td>--</td> </tr>
	<tr><td>width</td> <td>String</td>    <td>列宽度（不建议使用）</td> <td>--</td> </tr>
	<tr><td>dataType</td> <td>String</td>    <td>列格式化的类型，目前只支持日期和金额两种类型，日期：dataType="DATE",金额dataType="AMOUNT"</td> <td>--</td> </tr>
	<tr><td>format</td> <td>String</td>    <td>列格式化时的格式 ，需要传入日期才能被格式化,不包含时间格式化</td> <td>--</td> </tr>
	<tr><td>renderer</td> <td>String</td>    <td>列渲染函数</td> <td>--</td> </tr>
	<tr><td>buttons</td> <td>Array</td>    <td>操作列，设置此属性后，属性值会被渲染成多个链接</td> <td>--</td> </tr>
	<tr><td>dictName</td> <td>String</td>    <td>字典条目名称</td> <td>--</td> </tr>
	<tr><td>items</td> <td>Array</td>    <td>静态数据字典 示例："items":[{"label":"8888","value":"杭州总部"}],label是后台值相当于key,value是显示值</td> <td>--</td> </tr>
	</table>
	示例：
	"items" : [{"name":"initDate","text":"发生日期","align":"left","headerAlign":"right","dataType":"DATE","format":"yyyy-MM-dd","width":"150"},
			        {"name":"branchNo", "text":"分支名称（静态字典）","items":[{"label":"8888","value":"杭州总部"},{"label":"b","value":"b1"},{"label":"c","value":"c1"}]},
			        {"name":"branchNo", "dictName":"Branch", "text":"分支名称（动态字典）"},
			        {"name":"scanType", "dictName":"ScanType", "text":"扫描类别","hidden":true},
			        {"name":"scanType2","text":"扫描类别","renderer":"domrender","hidden":false,"width":"350"},
			        {"name":"clientId","text":"客户编号","dataType":"AMOUNT","format":"0,000.0"},
			        {"name":"clientName","text":"客户名称"},
			        {"name":"branchNo", "text":"操作1","buttons":[{"label":"设置默认","event":"edit"}]},
			        {"name":"branchNo", "text":"操作2","buttons":[{"label":"noting","event":"edit"}]}
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
 * @description Grid标题栏上的按钮组,当按钮的"event"属性不设置或者设置的方法在当前上下文中不存在时，按钮将被隐藏
 * 默认提供添加、修改、删除、确认、查询、打开、保存、刷新的样式,cls属性分别对应："add","edit","del","confirm","query","open","save","refresh"
 * @property titleButtons
 * @name Horn.Grid#<b>titleButtons</b>
 * @type Array
 * @default null
 * @example
 * 单个按钮属性：
 *	       label   {String}  按钮文本
 *	       cls     {String}  按钮css样式
 *	       event   {String}  按钮点击事件
 *	       disabled {Boolean} 是否禁用/启用按钮
 *		   refmenu {string} 按钮中关联menu组件
 * 示例：
 * "titleButtons" : [{"label":"添加","cls":"add","event":"add()"}]
 */

/**
 * @description Grid上的事件属性
 * 控件支持的事件列表如下：<br>
 * rowclick  行单击事件    事件参数：rowdata  当前被点击的一行数据<br>
 * rowdblclick  行双击事件 事件参数：rowdata  当前被点击的一行数据<br>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系<br>
 * @property events
 * @name Horn.Grid#<b>events</b>
 * @type Json
 * @default null
 * @example
 * 		   "events" :[
 *	         {"event" : "rowclick" , "function" : "testgridrowclick"},
 *	         {"event" : "rowdblclick", "function" : "testgridrowdbclick"}
 *		   ]
 */

/**
 * @description Grid是否配置序号列，默认值为false，启用序号列,设置为true时才显示序列号
 * @property numbercolumn
 * @name Horn.Grid#<b>numbercolumn</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * @description Grid启用单选/多选选择框 ，默认值为single,(注意，多选框 muti的拼音错了，做了兼容处理，输入multi也可以) ,单选框值为:single
 * 当不配置selectModel或selectModel为""属性时,不显示选择列
 * @property selectModel
 * @name Horn.Grid#<b>selectModel</b>
 * @type String
 * @default 
 * @example
 * 无
 */

/**
 * @description Grid是否启用点击行选中行操作,默认值为false，不启用,设置为true时点击行选中才生效
 * @property rowSelect
 * @name Horn.Grid#<b>rowSelect</b>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * @description Grid列内容超出列宽时是否隐藏并加"...",默认值为false，不隐藏根据内容自适应,设置为true时才隐藏
 * @property textOverHidden
 * @name Horn.Grid#<b>textOverHidden</b>
 * @type Boolean
 * @ignore
 * @default false
 * @example
 * 无
 */

/**
 * @description 单击行时触发<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系
 * @event
 * @name Horn.Grid#<b>rowclick</b>
 * @param data  类型：[Object] 被点击的一行数据。
 * @example
 *
 */

/**
 * @description 双击行时触发<br/>
 * 注意：双击事件会触发单击事件，所以在使用双击事件时应注意与单击事件的关系
 * @event
 * @name Horn.Grid#<b>rowdblclick</b>
 * @param data  类型：[Object] 被点击的一行数据。
 * @example
 *
 */
/**
 * @description isDragColumn的表格列是否可以拖动，默认false</br>
 * (注意！如果为true,页面上就必须引入jquery.resizableColumns.mini.js文件，name属性必须填写，否则无法拖动。如果表格自定义了宽度，拖动功能失效)
 * @property isDragColumn
 * @name Horn.Grid#<b>isDragColumn</b>
 * @type Boolean
 * @ignore
 * @default false
 * @example
 * 无
 */
Horn.Grid = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"Grid",
	titleEl : null , 
	data : null,
	curData : null,
	curTr : null,
	rowSelect : false,
	keyAttr : "label",
    valueAttr : "value",
	/**
	 * @ignore
	 */
    init : function(dom) {
        Horn.Grid.superclass.init.apply(this,arguments) ;
        this.ths = this.el.find("th");
        var _this = this;
        var data = this.params["data"]||{};
        this.data = data;
        
        //this.mutiSelect = this.params['selectModel']=='muti';
        //BUG #6610 【grid】"selectModel":"multi"之后会造成复选框变成input输入框，并且应该设置的muti是拼写错误
        if(this.params['selectModel']=='muti' || this.params['selectModel']=='multi'){
        	this.mutiSelect = true;
        }
        this.curTr = this.el.find('tr.u-table-selected');
        var datas = this.el.children('table').children('tbody').children('tr');
        
        this.curData = this.data[datas.index(this.curTr) - 1];
        //Grid点击行选中该行的配置支持
        this.rowSelect = Boolean(this.params["rowSelect"]);
        //Grid是否配置列内容超出列宽时是否隐藏并加"..."
        this.textOverHidden = this.params["textOverHidden"]?this.params["textOverHidden"]:false;
       	//关于字典项目的翻译功能。
		this.ths.each(function(index,th){
			var	hidden = th.attributes["hidden"];
			th=$(th);
			var dictName = th.attr("dictName"),
				itemscolNo = th.attr('colno'),
				staticDict;
			var width = th.attr("width");   //设置th列宽度
			var tempStaticDict,buttons;
			if(itemscolNo){
				tempStaticDict = _this.params.items[itemscolNo -1].items;
				buttons = _this.params.items[itemscolNo -1].buttons;
			}
			/*
			if(hidden!=null && hidden!=undefined && hidden.value == "true"){
				th.hide(); 
			}*/
			if(dictName){
				staticDict = {};
				//先把dict解析出来，避免重复查找dom
				var lis = $('.hc_checkboxdiv[ref_target='+dictName+'_s]').find("li");
				lis.each(function(idx,li){
					li = $(li);
					var label = li.attr('title');  //title显示值
					var key = li.attr('key');      //key 
					staticDict[key] = label;
				});
			}else if(tempStaticDict){
				staticDict = {};
				$(tempStaticDict).each(function(idx,item){
					
					staticDict[item[_this.keyAttr]] = item[_this.valueAttr];  //bug 6797
				});
			}else if(width){
				//th.width(width);
			}
			th.data('staticDict',staticDict);
			th.data('buttons',buttons);
		});
		this.el.find('.h_querytable_select_all').change(function(){
			if(this.checked){
				_this.selectAll();
			}else{
				_this.unSelectAll();
			}
		});
		
		
		this.selecteds = {};   
		this.dictTrans();
		this.initEvents();     //初始化事件
		this.initToolbarEvents();//按钮初始化事件
		/*if(this.textOverHidden){
			this.resetTHWidth();
		}*/
		//this.hiddenColumns();  //初始化隐藏列
		
		//表格列是否可以拖动，默认不拖动
		if(this.params.isDragColumn){
			if(this.params.name&&this.params.name!=""){
				$("."+this.params.name).resizableColumns({});
			}
		}
		if(!this.textOverHidden){
			this.resetTdContent();
		}
		   
    },
    customEvents : "rowclick,rowdblclick",
    getEventTarget : function() {
    	return this.el;
    },
    /**
	    * @description 启用/禁用 表格里的按钮栏的某个操作按钮
	    * @function
	    * @name Horn.Grid#setButtonDisabled
	    * @param {string} name        按钮名称，记得按钮的name是唯一
	    * @param {boolean} disabled   true为按钮不可用，false为可用<br>
	    * @return void
	    * @example
	    * #jscode()
	    * 	Horn.getComp("gridName").setButtonDisabled("delBtn",true);
	    * #end
	    */
	setButtonDisabled : function(name,disabled){
		var titleButtons = this.el.children("div.u-datagrid-toolbar").children("ul").children("li");
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
		var titleButtons = this.el.children("div.u-datagrid-toolbar").children("ul").children("li");
		titleButtons.each(function(index,trdom){
			var a = $(this).children("a");
			if(a.hasClass("f-disabled")){
				a.attr("onclick","javascript:return false;");
			}
			a.bind('click',function(e) {
				if($(this).hasClass("f-disabled")){
					$(this).attr("onclick","javascript:return false;");
				}else{
					$(this).attr("onclick",$(this).attr("event"));
				}
			});
		});
	},
    /**
     * 初始化事件
     * @ignore
     */
    initEvents : function(){
    	var _table = this.el.children('div.u-datagrid').children('table');
    	var _tbody = _table.children('tbody');
    	var _this = this;
    	var isCheckboxAll = _this.el.find('.h_querytable_select_all').length>0?true:false;
    	if(isCheckboxAll){
			this.el.find('input:checkbox.h_querytable_select').change(function(){
				_this.stateTest();
			});
	    }
        if(this.rowSelect == true){
        	_tbody.children('tr').each(function(i,tr){
    		    var rowidx = i;
    		    var _tr = $(tr),
    		    checkbox = _this.mutiSelect?_tr.find("input:checkbox.h_querytable_select"):_tr.find("input:radio.h_querytable_select")//BUG #6574
    		;
    		    
    		//STORY #10837 【TS:201501280088-JRESPlus-财富管理事业部-陈凯-对一个grid先全选，然后去掉最后一个勾，然后再想选最后一个】
    		_tr.bind('click',function(e) {    //BUG #6599
    			if($.isEmptyObject(_this.selecteds)){
    				_this.selectRow(rowidx, _tr);
    			}else{
//    				if(_this.lastSelect&&_this.lastSelect.rowidx != rowidx){
    					 if(!_this.selecteds.hasOwnProperty(rowidx)){
        				    _this.selectRow(rowidx, _tr);
    					 }else{
    						 _this.unSelectRow(rowidx, _tr);
    					 }	 
//        			}else{
//        				_this.unSelectRow(rowidx, _tr);
//        			}
    			}
    			if(isCheckboxAll){
        			_this.stateTest();
				}
    		 });

            });
        }
    
        // 表格单击,双击事件
        var rowClickObj =undefined;
        var rowDBLClickObj =undefined;
        var rowClickFn=undefined;
        var rowDBLClickFn=undefined;
        var data = this.data;
//        this.rowclick = this.el.attr("rowclick");
//        this.rowdblclick = this.el.attr("rowdblclick");
        $.each(this.params.events || [], function(i, o){
        	_this[o.event.toLowerCase()] = o["function"];
        });
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
            var trs = _tbody.children("tr");
            for ( var i = 0; i < data.length; i++) {
                var tr = $(trs.get(i));
                if(rowClickFn){
                    var params = rowClickObj.params.slice(0);
                    params.push(data[i], data);
                    tr.bind('click',params, function(e) {
                        var p = e.data ;
                        return rowClickObj.fn.apply(this,p);
                    });
                }
                if(rowDBLClickFn){
                    var params = rowDBLClickObj.params.slice(0);
                    params.push(data[i], data);
                    tr.bind('dblclick', params,function(e) {
                        var p = e.data ;
                        return rowDBLClickObj.fn.apply(this,p);
                    });
                }
            }
        }
    },
    /**
     *重置列展示内容,如果字段大于60个字符，就把内容放到文本域中
     * @ignore
     */
    resetTdContent : function(){
    	var _this = this;
    	var trs = this.el.children("div.u-datagrid").children('table').children('tbody').children('tr');
    	var ths = this.el.children("div.u-datagrid").children('table').children('thead').children('tr').children('th');
    	var tmpArry = [];
		if(this.data && this.data.length >0){
			 for ( var i = 0; i <this.data.length; i++){
				   var itemData = this.data[i];
				   $.each(itemData,function(name,value) {
					   tmpArry.push(name);
				   });
				   break;
				  
			 }
		}
		
    	var rows = [];
    	trs.each(function(tridx,trdom){
    		var tr = $(trdom);
    		var tds = tr.find('td');
    		for(var tdidx = 0 ; tdidx<tds.length ; tdidx++){
    			var td = $(tds[tdidx]);
    			var tdWidth = td.attr("width");
    			var tdDiv = td.children("div");
    			var text =tdDiv.text();
	    		if(_this.getStrlen(text)>40){
	    			if(rows.indexOf(tdidx)==-1){
	    				rows.push(tdidx);
	    			}
	    			//tdDiv.html("<textarea   readonly style=\"height: 100%;width: 100%;border: 0;background: transparent;line-height: 15px;\">"+text+"</textarea>");
	    			tdDiv.css("width",300);
	    			td.css("width",300);
	    		}
    		}
    	});
    	/*if(rows.length>0){
    		for(var i = 0;i<rows.length;i++){
    			trs.find('td:eq('+rows[i]+')').css("width",300);
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
     * @description 设置标题
     * @function
     * @name Horn.Grid#<b>setTitle</b>
     * @param {String} title
     */
    setTitle : function(title){
    	this.el.children("div.u-datagrid-header").children('h4').text(title);
    },
    /**
     * @ignore
     * @description 当某行被引用时会触发此事件。
     * @event
     * @name Horn.Grid#<b>onRowSelect</b>
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
     * @description 选择所有行。
     * @function
     * @name Horn.Grid#<b>selectAll</b>
     */
    selectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = true;
    		if(_this.rowSelect==false){  //6599
    			$(checkbox).trigger('change');
    		}else{
    			_this.selectRow(idx);
    		}
    	});
    	//STORY #10837 【TS:201501280088-JRESPlus-财富管理事业部-陈凯-对一个grid先全选，然后去掉最后一个勾，然后再想选最后一个】
    	_this.lastSelect={
    			rowidx:'all'
    	}
    	this.el.find('.h_querytable_select_all').attr("checked", true);
    },
    /**
     * @description 清除所有选择行。
     * @function
     * @name Horn.Grid#<b>unSelectAll</b>
     */
    unSelectAll:function(){
    	var _this = this;
    	this.el.find('input:checkbox.h_querytable_select').each(function(idx,checkbox){
    		checkbox.checked = false;
    		if(_this.rowSelect==false){  //6599
    			$(checkbox).trigger('change');
    		}else{
    			_this.unSelectRow(idx);
    		}
    	});
    	this.el.find('.h_querytable_select_all').prop("checked", false);
    	//BUG #6613 【grid】多选模式下，先调用selectAll，然后调用unSelectAll之后，需要点击两下才能完成对行的选中
    	//this.el.find('input:checkbox.h_querytable_select').attr("checked", false);
    	//this.el.find('input:checkbox.h_querytable_select').parent().parent().removeClass("h_table-over");
    	//this.initEvents();     //初始化事件
    },
    /**
     * @description 单选时最后选择的项目
     * @field
     * @name Horn.Grid#lastSelect
     * @default null
     * @ignore
     */
     lastSelect:null,
    /**
     * @description 是否多选
     * @field
     * @name Horn.Grid#mutiSelect
     * @default false
     * @ignore
     */
    mutiSelect:false,
    /**
     * @description 选择某行
     * @function
     * @name Horn.Grid#selectRow
     * @param {int} rowidx
     * @param {JQuery} tr
     * @ignore
     */
    selectRow:function(rowidx,_tr){
    	var _table = this;
    	var tr = _tr;
    	if(!tr){
    		tr = $(this.el.find('tr').has('td').get(rowidx));
    	}
    	if(tr.size()==0){
    		Horn.debug("Grid["+this.name+"]","选择的行"+rowidx+"不存在");
    		return false;
    	}
    	var vals = {};
    	var displays = {};
		var ths = this.ths;
		var tds = tr.find('td');
		ths.each(function(thidx,_th){
			var td = tds.get(thidx),
				th = $(_th);
			if(th.attr('name')){
				vals[th.attr('name')] = th.attr('dictName') ? $(td).attr('key') :$(td).text();
				displays[th.attr('name')] = $(td).text();
			}
		});
		_table.onRowSelect.call(tr,tr,rowidx,vals);
		this.selecteds[rowidx] = {val:vals,displays:displays};
		if(!_table.mutiSelect) {
			var last = _table.lastSelect;
			if(last&& last.rowidx != rowidx ){
				//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
		    	if(this.mutiSelect){//多选
		    		last.tr.find("input:checkbox.h_querytable_select").prop("checked" , false); 
		    	}else{//单选
		    		last.tr.find("input:radio.h_querytable_select").prop("checked" , false);  
		    	}
				_table.unSelectRow(last.rowidx,last.tr);
			}
			
		}
		_table.lastSelect = {
				rowidx:rowidx,
				tr:tr
			};
		
		//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
    	if(this.mutiSelect){//多选
    		tr.find("input:checkbox.h_querytable_select").prop("checked" , true);;   //选中checkbox
    	}else{//单选
    		tr.find("input:radio.h_querytable_select").prop("checked" , true);;   //选中radio
    	}
		tr.addClass("u-table-selected");//选中行的样式
    },
    /**
     * @description 取消某行的选择
     * TODO 这里尚有些不成熟的地方，需要取消选择项的勾。
     * @function
     * @name Horn.Grid#unSelectRow
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
    	//BUG #6609 【grid】selectModel设置为single 造成页面报js错误并且单选变复选
    	if(this.mutiSelect){//多选
    		tr.find("input:checkbox.h_querytable_select").prop("checked" , false);    //取消选中checkbox
    		//BUG #6943 grid：复选，去掉某行的勾，但是列头的全选勾不会去除
    		this.el.find('.h_querytable_select_all').prop("checked", false);
    	}else{//单选
    		tr.find("input:radio.h_querytable_select").prop("checked" , false);  //取消选中radio
    	}
    },
    /**
     * @description 获取所有的选择项
     * @function
     * @name Horn.Grid#<b>getSelecteds</b>
     * @param format(可选值有true,1,或者不传参数)<br/>
     *         1):参数为true：返回整行完整数  如：[{"branchNo":"001","Date":"20140320"}{"branchNo":"001","Date":"20140320"}]<br/>
     *         2)：参数为1：返回列数据的字段值，如果是字典列,返回字典的value值<br/>
     *         3):无参数： 返回列数据的字段值 如果是字典列,返回label值
     * @return {Array} 返回选中的行数据
     * @example
     * #jscode()
     * 	var result = Horn.getComp('flowTable1').getSelecteds();
	 *	var comValue="";
	 *	if(result&&result.length>0){
	 *		for(var i=0;i<result.length;i++){
	 *			var item = result[i];
	 *			console.log(item);
	 *			var brachNo = item.branchNo1;
	 *			console.log(brachNo);
	 *		}
	 *	}
     * #end
     */
    getSelecteds:function(format){
    	var selecteds = [];
    	for(var key in this.selecteds){
    		var valObj = this.selecteds[key];
    		if(valObj){
    			var tmpv = valObj.val;
    			if(format === true){
    				tmpv = this.data[key];
    			}else if(format == 1){
    				tmpv = valObj.displays;
    			}
    			selecteds.push(tmpv);
    		}
    	}
    	return selecteds;
    },
     /**
     * @description 设置当前行为传入的行
     * @function
     * @return {void}
     * @name Horn.Grid#changeCurrent
     * @param {DOMDocument} tr 传入的行
     * @ignore
     */
    changeCurrent:function(tr){
    	if(!tr instanceof $){
    		tr = this.el.children('tbody').children('tr')[tr];
    	}
    	if(!this.curtr){
    		this.curtr = this.el.find('tr.u-table-selected');
    	}
    	var rowidx = this.el.children('table').children('tbody').children('tr').index(this.curtr);
    	this.curtr.removeClass('u-table-selected');
    	tr.addClass('u-table-selected');
    	this.curtr = tr;
    	this.curData = this.data[rowidx-1];
    },
     /**
     * @description 获取当前行的数据
     * @function
     * @name Horn.Grid#getCurrentData
     * @return {object}
     * @ignore
     */
    getCurrentData:function(){
    	return this.curData;
    },
    /**
     * 隐藏列
     * @ignore
     */
    hiddenColumns : function(){
    	var trs = this.el.children('table').children('tbody').children('tr');
    	var ths = this.ths;
    	
    	ths.each(function(thidx,thdom){
    		var th = $(thdom);
    		//隐藏列
    		var hidden = thdom.attributes["hidden"];
    		
    		if(hidden!=null && hidden!=undefined && hidden.value =="true"){
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
     * @param dataType   格式化类型(DATE,AMOUNT)
     * @param format     格式
     * @param td         td对象
     * 表格列格式化
     * 列需要支持常规类型的格式化配置（日期、金额）
     * @private
     * @ignore
     */
    formatColumn : function(dataType,format,val){
    	return Horn.Util.Format.all(dataType,format,val);
    },
    /**
     * 当table的布局为fixed时候，需要为th设置默认宽度
     * @ignore
     */
    resetTHWidth : function(){
    	var ths = this.ths;
    	var size = ths.size();
    	var _table = this.el.children('table');
    	var width = _table.width();
    	var temp = []; 
    	ths.each(function(idx,thdom){
    		var th  = $(thdom);
    		if(th.hasClass('h_numbercolumn')||th.hasClass('h_querytable_checkboxcolumn')){   //去掉数字、check列
    			th.addClass("h_table_th_extend");
    		}else if(thdom.attributes["hidden"]){   //去掉隐藏列
    			var hidden = thdom.attributes["hidden"];   
        		if(hidden!=null && hidden!=undefined && hidden.value =="true"){	
        			size--;
        		}
    		}else if(th.attr("width")){//去掉已设置width属性的列
    			size--;
    		}else{
    			temp.push(th);
    		}     
    		return true;
    	});
    	var percent = 100/size;
    	for(var i = 0; i<temp.length;i++){
    		var cls = temp[i].attr("class");
    		if(cls&&cls=="u-table-time"){
    			temp[i].css("width", percent.toFixed(2)+"%");
    		}
    	}
    	i;
    },
    /**
     * 翻译字典 
     * @ignore
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
    			if(_table.rowSelect == false){           //BUG #6599
	    			checkbox.change(function(){
		    			if(this.checked){
		    				_table.selectRow(idx-1,tr);
		    			}else{
		    				_table.unSelectRow(idx-1,tr);
		    			}
		    		});
    			}
    			if(checkbox.attr('checked')){
    				setTimeout(function(){
    					_table.selectRow(idx,tr);
    				},3);
    			}
    		}
    		tr.find('td').each(function(tdidx,tddom){
    			var td = $(tddom);
    			var th = $(ths.get(tdidx));
	    		var dictName = th.attr("dictname"),
	    			mutidict = th.attr("multiple"),
	    			staticDict = th.data('staticDict'),
	    			renderer = th.attr('renderer'),
	    			buttons = th.data('buttons'),
	    			showwhenover = th.attr('showwhenover'),
	    			dataType = th.attr('dataType'),
	    			format = th.attr('format')
	    			;
	    		
	    		if( staticDict ){
	    			td.attr('key',td.text());
	    			var text = td.text()||'';
	    			if(mutidict){
    					var textArr = [];
    					$(text.trim().split(',')).each(function(i,item){
    						textArr.push(staticDict[item] || item);
    					});
    					td.text(textArr.join(','));
    					td.attr("title",textArr.join(','));
    				}else{
    					//17590 【TS:201603020064-JRESPlus-财富管理事业部-陈为-【产品及版本信息】jresplus-ui-web 1.0.2】
    					if(text=="" || staticDict[td.text().trim()]== undefined){
							td.text("");
							td.attr("title","");
						}else{
							td.text( staticDict[td.text().trim()] || td.text());
							td.attr("title",staticDict[td.text().trim()] || td.text());
						}
    				}
	    		}else if(buttons){
	    			td.attr("title","");
	    			var btns = buttons;
	    			var span = $("<span></span>");
	    			$(btns).each(function(idxx,btn){
	    				var fn = Horn.Util.getFunObj(btn.event);
	    				//如果没有这个function，则不装入这个button
	    				if(!fn.fn) return;
	    				var a = $("<a href='javascript:void(0)'>"+btn.label+"</a>"),
	    					text = td.text();
	    				a.click(function(){
	    					fn.fn.call(a,{
	    	    				val : text,
	    	    				rowdata : _table.data[idx-1],
	    	    				alldata : _table.data,
	    	    				table : _table,
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
	    			if(showwhenover){ 
	    				span.addClass('h_link-default');
	    			}
	    			td.html('');
	    			td.append(span);
	    		}else if(dataType){
	    			var val = td.text();
	    			var newVal = _table.formatColumn(dataType,format,val);
	    			td.text(newVal);
	    			td.attr("title",newVal);
	    		}
	    		if(renderer){
	    			td.attr('key',td.text());
	    			td.attr("title","");
	    			var fn = Horn.Util.getFunObj(renderer),
	    				text = td.text();
    				//如果没有这个function，则不装入这个button
    				if(!fn.fn) return;
	    			var dom = fn.fn.call($(this),{
	    				val : text,
	    				rowdata : _table.data[idx-1],
	    				alldata : _table.data,
	    				table : _table,
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
    },
    /**
     * @param val 被添加的一行数据
     * 向表格中添加一行数据
     * @ignore
     */
    addRowData : function(val){
    	
    }
}) ;
Horn.regUI("div.h_formtable",Horn.Grid) ;
