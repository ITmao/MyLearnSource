/*
 * 修改日期                        修改人员        修改说明
 * -------------------------------------------------------------------------------------
 * 2014-4-8	 XIE		BUG #6662 [button_group]调用setEnable方法时传入非法enabled值，忽略
 * 2014-4-14 周智星              BUG #6643 [button_panel]setEnable设置一个不存在的name
 * -------------------------------------------------------------------------------------
 */
/**
 * @name Horn.ButtonPanel
 * @class
 * 按钮容器组件
 * 
*/

/**@lends Horn.ButtonPanel# */

/**
 * 组件唯一标识<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)
 * @name Horn.ButtonPanel#<b>id</b>
 * @type String
 * @default
 * @example
 * 无
 */
/**
 * 组件的名字<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)
 * @name Horn.ButtonPanel#<b>name</b>
 * @type String
 * @default
 */
/**
 * 组件所占的显示列数<br/>
 * 默认仅支持1,2,3,4列<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>)
 * @name Horn.ButtonPanel#<b>cols</b>
 * @type number
 * @default 1
 */
/**
 * 表单中提交按钮的显示标签<br/>
 * 如果要使用默认属性，不要设置此属性，更不要使用空字符串<br/>
 * 支持此属性的按钮容器组件(<b>button_panel</b>)
 * @name Horn.ButtonPanel#<b>submitLabel</b>
 * @type String
 * @default "提交"
 */
/**
 * 表单中重置按钮的显示标签<br/>
 * 如果要使用默认属性，不要设置此属性，更不要使用空字符串<br/>
 * 支持此属性的按钮容器组件(<b>button_panel</b>)
 * @name Horn.ButtonPanel#<b>resetLabel</b>
 * @type String
 * @default "重置"
 */

/**
 * 按钮组件中的自定义按钮配置<br/>
 * 支持此属性的按钮容器组件(<b>button_group</b>,<b>button_panel</b>,<b>button_panel_ex</b>)<br/>
 * 按钮的数据格式:<br/>
 * {"name":"btn1",//按钮组件名称<br/>
 *  "label":"查询",//按钮显示名称<br/>
 *  "className":"u-btn-white",//按钮自定义样式，非必须项。默认提供了u-btn-primary(蓝色)、u-btn-default(灰色)、u-btn-success(绿色)、u-btn-danger(红色)、u-btn-white(白色)和u-btn-warning(黄色)<br/>
 *  "event":"lhkh.query()"//按钮被点击时触发的函数执行<br/><br/>
 *  "refmenu":"test"//该按钮关联的menu组件（菜单）
 * }
 * @name Horn.ButtonPanel#<b>buttons</b>
 * @type Array[Json]
 * @default ""
 * @example
 * 名称 标签 样式名 点击事件
 * "buttons":[{"name":"query","label":"查询","className":"u-btn-white", "event":"lhkh.query()"}] 
 */

Horn.ButtonPanel = Horn.extend(Horn.Base,{
	COMPONENT_CLASS:"ButtonPanel",
    init:function(){
        Horn.ButtonPanel.superclass.init.apply(this,arguments);
    },
    /**
     * 设置按纽是否可用，设置为不可用，则单击无响应
     * @function
     * @name Horn.ButtonPanel#setEnable
     * @param {string} name 按纽的名字
     * @param {boolean} enabled 如果为true设置为可用，设置为false，设置不可用,此参数不传入时默认为true;
     * @return {void}
     * @example
     * Horn.getComp("buttonPaneName").setEnable("btnName",false);
     */
    setEnable:function(name,enabled){
    	//BUG #6643 [button_panel]setEnable设置一个不存在的name
    	if(typeof enabled !='boolean'){
    		Horn.Tip.info("enabled属性只能是布尔型！");
    		return;
    	}
        var button = this.el.find("button[name="+name+"]");
        if(button.length==0){
        	Horn.Tip.info(name+",不存在！");
        	return;
        }
        if (typeof enabled =='undefined'|| enabled) {
            button.removeClass("disabled");
            button.removeAttr("disabled");
        } else {
            button.addClass("disabled");
            button.attr("disabled", "disabled");
        }
    }
});
Horn.regUI("div.h_btndiv",Horn.ButtonPanel) ;
Horn.regUI("div.hc_button-group",Horn.ButtonPanel) ;