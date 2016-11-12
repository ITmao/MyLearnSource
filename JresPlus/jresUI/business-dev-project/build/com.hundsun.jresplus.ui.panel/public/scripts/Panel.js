/*
 * -----------------------------------------------------------------------
 * 修订日期                          修改人                    修改原因
 * 2014-3-11 		谢晶晶		修正注释文档
 * 2014-4-8         周智星                  BUG #6625 [panel]表单组件禁用启用 
 * 2014-4-8         周智星                  BUG #6626 [panel]禁用表单类组件
 * 2014-4-8         周智星                  BUG #6543 panel相关文档缺陷
 * 2015-01-19       zhangsu      STORY #10593 [TS:201412180610][财富管理事业部-陈凯-]-JRESPlus-ui--对于查询条件中的extend_fields部分的查询条件，若】
 * 2015-08-27       zhangsu      STORY #12493 【TS:201508100055-JRESPlus-资产管理事业部-张翔Panel组件的expandable有问题，当panel调用hide（）方法隐藏之后expandable图标未隐藏
 * 2015-12-03       周智星                   需求 #15282 [研发中心/WF]panel控件已经支持了是否能打开和收缩的功能，但是默认一定是打开的，希望增加默认打开还是收缩的配置项 
 * -----------------------------------------------------------------------
 */
/**
 * @name Horn.Panel
 * @class
 * 面板组件</br>
 * 属于容器组件，一般做为单行组件的容器使用
 */
/**@lends Horn.Panel# */
/**
 * 组件的唯一标示
 * @name Horn.Panel#<b>id</b>
 * @type String
 * @default 
 */
/**
 * 组件的名称
 * @name Horn.Panel#<b>name</b>
 * @type String
 * @default 
 */
/**
 * 面板组件的标题栏,默认没有标题栏
 * @name Horn.Panel#<b>title</b>
 * @type String
 * @default ""
 */
/**
 * 列数（目前支持1-4列）
 * @name Horn.Panel#cols
 * @type int
 * @default 3
 * @example
 * #@panel({"id":"testspanel","title":"","cols":3})
 * 
 * #end
 */
/**
 * 是否启用展开/收缩功能,默认不启用
 * @name Horn.Panel#<b>expandable</b>
 * @type Boolean
 * @default false
 * @example
 * #@panel({"expandable":true})
 *	#textfield({"label":"流程名称：", "name":"hsBpmNameLike"})
 * #end
 */
/**
 * 是否展开(只有在expandable为true生效 ),默认不展开
 * @name Horn.Panel#<b>isExpand</b>
 * @type Boolean
 * @default false
 * @example
 * #@panel({"expandable":true,"isExpand":true})
 *	#textfield({"label":"流程名称：", "name":"hsBpmNameLike"})
 * #end
 */
	Horn.Panel = Horn.extend(Horn.Base,{
		COMPONENT_CLASS:"Panel",
		init:function(){
		 Horn.Panel.superclass.init.apply(this,arguments);
		 var expandDiv = this.el.children('div.m-panel-box');
		 var _panel = this.el.children("div.g-wrap"); 
		 if(expandDiv) {
			 var btn = expandDiv.children().children("i");
			 expandDiv.click(function(){
				 if(btn.hasClass('fa-angle-up')){
					_panel.hide();
					btn.removeClass("fa-angle-up");
					btn.addClass("fa-angle-down");
				 }else{
					 _panel.show();
					btn.removeClass("fa-angle-down");
					btn.addClass("fa-angle-up");
				 }
			}) ;
		 }
	},
        /**
         * 显示<br/>
         * 显示面板容器的内容
         * @name Horn.Panel#show
         * @function
         * @return {void}
         */
		show : function(){
			this.el.show();
			if(this.params['expandable']==true){
				this.closebar.show();
				this.expanedbar.hide();
			}
		},
        /**
         * 隐藏<br/>
         * 隐藏面板容器及容器内的内容
         * @name Horn.Panel#hide
         * @function
         * @return {void}
         */
		hide : function(){
			this.el.hide();
			if(this.params['expandable']==true){
				this.closebar.hide();
				this.expanedbar.show();
			}
			
			
		},
		/**
         * 设置内部输入组件为可用状态<br/>
         * 对所有表单项起效（文本字段、文本区域、按钮、复选框、单选框和下拉框）
         * @name Horn.Panel#enable
         * @function
         * @return {void}
         */
		enable : function(){
			//this.el.find('input,textarea').not('input[realydisable],textarea[realydisable]').removeAttr('disabled');
			
			//BUG #6625 [panel]表单组件禁用启用
			Horn.Field.findFieldCompsIn(this.el).each(function(i,f){
	    		this.setDisabled(false);
	    	});
			//BUG #6626 [panel]禁用表单类组件
			this.el.find('button,select').removeAttr('disabled');
		},
		/**
         * 设置内部输入组件为不可用状态(disabled)<br/>
         * 对所有表单项起效（文本字段、文本区域、按钮、复选框、单选框和下拉框）
         * @name Horn.Panel#disable
         * @function
         * @return {void}
         */
		disable : function(){
			//this.el.find('input[disabled],textarea[disabled]').attr('realydisable','yes');
			//this.el.find('input,textarea').not('input[realydisable],textarea[realydisable]').attr('disabled','disabled');
			
			//BUG #6625 [panel]表单组件禁用启用
			Horn.Field.findFieldCompsIn(this.el).each(function(i,f){
	    		this.setDisabled(true);
	    	});
			
			//BUG #6626 [panel]禁用表单类组件
			this.el.find('button,select').removeAttr('disabled');
			this.el.find('button,select').attr('disabled','disabled');
		}
	});
	Horn.regUI('div.g-panel',Horn.Panel);
