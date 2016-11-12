Horn.BizCombx = Horn.extend(Horn.Field,{
	COMPONENT_CLASS:"Select",
    delimiter : "" ,
    bodyclicktype : "click.select" ,
    select : null ,
    field : null ,
    hidden : null ,
    listEl : null ,
    /**
     * 标识（在标签中使用），是否为多选下拉
     * @name Horn.Select#multipleline
     * @type Boolean
     * @default false
     */
    multipleline : false ,
    name : null,
    alias : null,
    showLabel:true,
    hasHeadItem:false,
    tempCheckedKeyArray:[],
    tempCheckedValue:"",
    /**
     * @ignore
     */
    init : function(dom){
        Horn.Select.superclass.init.apply(this,arguments) ;
        var _this = this ;
        this.select = this.el;
        this.hidden = this.select.children("input[type='hidden']");
        this.field = this.hidden.next();
        this.name = this.hidden.attr("name") ;
        this.alias = this.hidden.attr("alias") || "" ;
        if(this.field.attr("delimiter")!=undefined){
            this.delimiter = this.field.attr("delimiter") ;
        }
        var headItem = this.params.headItem;
        if(headItem){
        	this.hasHeadItem = true;
        }
        var ref_target = this.field.attr("ref");
        this.listEl = ref_target ?$("#hc_hide_div").children("div.hc_checkboxdiv[ref_target='" + ref_target + "']")
                : this.field.next().next("div.hc_checkboxdiv");
        if(!this.listEl.get(0)){
        	this.listEl = $("div.hc_hide_div").children("div.hc_checkboxdiv[ref_target='" + ref_target + "']");
        }
        this.listEl = this.listEl.first();
        this.multipleline = this.params.multiple;
        if(String(this.params.showLabel) =="false"){
        	this.showLabel = false;
        }
        this.handerHeadItem();
      
        //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
        this.setEditable(this.params.editable);
        this.setReadonly(this.params.readonly);
        
//        this.field.attr('readOnly', true);
        this.field.bind({
            'focus' : Horn.Util.apply(_this.onFocus,_this),
            'click' : Horn.Util.apply(_this.onClick,_this),
            'keydown':Horn.Util.apply(_this.onKeyDown,_this),
            'keypress':Horn.Util.apply(_this.onKeyPress,_this),
            'keyup':Horn.Util.apply(_this.onKeyUp,_this)
        });
        
        var value = this.params.value || this.hidden.val();
        // BUG #6719 combo单选时，headItem的值不能在输入框中显示
        if (value === "") {
        	this.setValue("", undefined, true);
        } else {
        	this.setValue(value);
        }
        
        //BUG #6554 【combox】(继承)setReadonly(true) 与设置属性readonly=true的表现形式不一致 
        //readonly不能再默认为true
//        if(this.params.readonly==false) {
//        	this.setReadonly(false);
//        }else{
//        	this.setReadonly(true);
//        }
        
        if(this.params.disabled) {
        	this.setDisabled(true);
        }
        
        //BUG #6904 【combox】单选模式下，不应该能输入非法值  ；BUG #6903 【combox】单选模式下，“请选择”不能删除
        //这里不能这么解决的是案件监听的问题
//		if (!this.multipleline) {//如果是单选，就把显示输入框设为只读状态
//			this.field.attr("readonly", "true");
//    		this.readonly = true;
//		}
		
		this.DICT = (function(_select){
			if(_select.params.items){
				var staticDict = {};
				$(_select.params.items).each(function(i,item){
					staticDict[item.label] = item.value;
				});
				return staticDict;
			}else{
				return Horn.getDict(_select.params.dictName);
			}
		})(this); 
		
		//STORY #10587 [财富管理事业部/陈为][TS:201412180594]-JRESPlus-ui-三、对于模糊查询的下拉选择框，目前只支持搜索字典值（DICT】
		//增加配置项filterBy,如果配置了filterBy则自动打开模糊查询，filterBy可以配置为key或者value
		if(this.params.filterBy){
			this.params.enableFieldSearch=true;
		}else{
			this.params.filterBy = "keyOrValue";
		}
		
		//默认关闭模糊查询——或者根据用户配置开启模糊查询
		if(this.params.enableFieldSearch){
			this.enableFieldSearch=true;
			this.enableFieldQuery(true);
		}
		
		//window中使用combox这样绑定blur事情会导致多次触发
		//这样做的目的是为了让可编辑的select在丢焦点以后，清除无效值;但是这样使用导致了window中使用的其他问题
		//可编辑的select组件才需要这种丢焦点
		if(this.params.editable){
			this.field.bind("blur",function(){
				if(!_this.editflag){
					return ;
				}
				_this.editflag = false;
				var tmp =_this.tempCheckedValue.replace(",",_this.delimiter)
				$(this).attr("value",tmp);
			})
		}
    } ,
    enableFieldQuery:function(open){
    	var _this = this;
    	var bindAttr;
//    	var isIE8 = !!window.ActiveXObject&&!!document.documentMode;
//		if(isIE8){
    	//STORY #9807 [研发中心/内部需求][Jresplus][UI]select组件模糊查询相关问题 
    	//修改模糊查询对于其他的IE版本失效
    	var isIE8 = $.browser.msie && ($.browser.version == "8.0" || $.browser.version == "7.0");
		if(isIE8){
			bindAttr = "propertychange";
		}else{
			bindAttr="input";
		}
		
    	if(!open) {
    		_this.enableFieldSearch=false;
    		_this.searchField.unbind(bindAttr);
    		_this.searchField.remove();
    		return;
    	}else{
    		this.enableFieldSearch=true;
    	}
    	
    	//添加模糊搜索输入框
    	var searchField = $("<input type='text' value='' name='fieldToSearch' style='display:none'/>");
    	searchField.appendTo(this.el);
    	this.searchField=searchField;
    	
    	this.searchField.blur(function(){
    		_this.searchField.hide();
    		_this.field.show();
    	})
    	
    	//防止点击事件触发列表关闭
    	this.searchField.click(function(){
    		return false;
    	})
    	
    	//模糊匹配支持 
		//STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
		//**************备注：1、当点击选中的时候模糊匹配自动失效。2、当编辑文本款中的值的时候模糊匹配生效，文本款中的值作为匹配的字段。
    	//******************3、所有已经选中的状态在整个过程中会被保留。4、用户的配置项为enableFieldSearch，当设置为ture的时候启用模糊查询.5、单选模式下也只需要配置enableFieldSearch，会自动将readonly属性去除
		var fieldSearchFunc = function(){
			var charToMatch = _this.searchField.val();
			
			if(charToMatch!=""){
				//查询列表当中所有的条目
				$("li",_this.listEl).each(function(i,o){
					var _match = false;
					var _match_key = false;
					var _match_value = false;
					if(_this.params.filterBy == "key"){
						_match = !($(o).attr("key").indexOf(charToMatch) != -1);
					}else if(_this.params.filterBy == "value"){
						_match = !($(o).attr("title").indexOf(charToMatch) != -1);
					//17370 【TS:201602230417-JRESPlus-资产管理事业部-张翔-【项目名称】非标准化投资管理系统2.0<br><br><br】
					}else if(_this.params.filterBy == "keyOrValue"){
						_match_key = !($(o).attr("key").indexOf(charToMatch) != -1);
						_match_value = !($(o).attr("title").indexOf(charToMatch) != -1);
						if(_match_key==false || _match_value==false){
							_match=false;
						}else{
							_match=true;
						}
					}
					
					if(_match){
						$(o).hide();
					}else{
						$(o).show();
					}
				})
			}else{
				//过滤值为空时，显示所有
				$("li",_this.listEl).each(function(i,o){
					$(o).show();
				})
			}
		};
		
		_this.searchField.bind(bindAttr,fieldSearchFunc);
		//STORY #9807 [研发中心/内部需求][Jresplus][UI]select组件模糊查询相关问题 
    	//修改在有值获得焦点的时候不进行模糊查询这种情况
		_this.searchField.bind("focus",fieldSearchFunc);
		//需求#14586 【TS:201510300214-JRESPlus-资产管理事业部-张翔-Combox添加了filterBy输入过滤属性，在输入框输入Combox添加了filterBy输入过滤属性，在输入框输入值，下选过滤，选中其中一条值，再选择之前输入的值还存在需要手动删除（多选和单选都存在该问题）】 20151102 modify by zhouzx
		_this.searchField.bind("keyup",function(){
			var searchVal = _this.searchField.val();
			if(searchVal==""){
				_this.field.focus();
			}
		});
		//需求#14590 【TS:201510300216-JRESPlus-资产管理事业部-张翔-Combox多选配置filterBy输入过滤属性之后,Combox多选配置filterBy输入过滤属性之后，ctr+A全选所有下拉选项就不能用了
		_this.searchField.bind({
            'keydown':Horn.Util.apply(_this.onKeyDown,_this)
        });
    },
    // 方法冗余 重写disabled方法，combox和select正在提交到后台的是隐藏域,所以disabled时也要把隐藏域disabled掉
    setDisabled : function(disabled) {
    	//BUG #6798 【combox】设置disabled属性为true会造成js错误
    	if (disabled === false) {
    		this.setEnable(true);
            this.disabled = false;
            //Horn.getComp(this.name).setDisabled(false);
    	} else {
    		this.setEnable(false);
            this.disabled = true;
            //Horn.getComp(this.name).setDisabled(true);
    	}
    },
    /**
     * 设置是否只读，只读为true时，不可编辑不可下拉
     * @function
     * @name Horn.Field#setReadonly
     * @param {Boolean} readonly 是否只读
     * @ignore
     */
    //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
    setReadonly : function(readonly) {
    	if(!readonly) readonly=false;
    	
		if (readonly === false) {
    		this.el.removeAttr("readonly");
    		this.readonly = false;
    	} else {
    		this.el.attr("readonly", true);
    		this.readonly = true;
    		this.setEditable(false);
    	}
    },
    /**
     * 设置是否可编辑，下拉框可以下拉
     * @function
     * @name Horn.Select#setEditable
     * @param {Boolean} editable 不可编辑
     * @ignore
     */
    //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
    setEditable : function(editable) {
    	if(!editable) editable=false;
		if (editable === true) {
    		this.field.removeAttr("readonly");
    		this.editable = true;
    	} else {
    		this.field.attr("readonly", true);
    		this.editable = false;
    	}
    },
    /**
     * @ignore
     */
    createHeadItem : function() {
        var headItem = this.params.headItem;
        var multiple = this.params.multiple;
        if(this.hasHeadItem && !multiple){
            var label = headItem.label?headItem.label:"";
            var pLabel = headItem.pLabel?headItem.pLabel:"";
            var value = headItem.value?headItem.value:"";
            var headItemLi = "<li key='"+label+"' pkey='"+pLabel+"' title='"+value+"' headItem='"+this.name+"' ><label>"+value+"</label></li>";
            this.listEl.children("ul").prepend(headItemLi);
        }
    },
    /**
     * @ignore
     */
    handerHeadItem:function(){
    	var cmpName = this.name;
		var ul = this.listEl.children("ul");
   		if(ul.length>0){
   	    	if(this.hasHeadItem){
   	    		var headItemFind= false;
   	    		var headItems = ul.children("li[headItem]");
   	    		if(headItems.length>0){
   	    			headItems.each(function(idx,item){
   	    				var name = $(item).attr('headItem');
   	    				if(cmpName != name){
   	    					$(item).remove();
   	    				}else{
   	    					headItemFind = true;
   	    				}
   	    			});
   	    			if(headItemFind){
   	    				return;
   	    			}else{
   	    				this.createHeadItem();
   	    			}
   	    		}else{
	    			this.createHeadItem();
   	    		}
   	    	}else{
   	    		var headItem = ul.children("li[headItem]");
   	    		if(headItem.length>0){
   	    			headItem.remove();
   	    		}
   	    	}
		}
    },
    /**
     * @description 设置select的值
     * @function
     * @name Horn.Select#setValue
     * @param {String} value
     * @param {Boolean} triggerChange 是否触发值更改事件
     */
    setValue : function(value, triggerChange, notBlur) {
    	
    	this.handerHeadItem();
        var hidden = this.hidden ;
        var oldVal = hidden.val();
        var field = this.field ;
        //BUG #6560 【combox】(继承)clearValue() 不会将组件回复到原始状态
        //if (value === undefined || value === null || value==="") {
        if (value === undefined || value === null) {
        	field.val("");
            hidden.val("");
//            if (!notBlur) {
//                this.field.blur();
//            }
            return false;
        }
        if (value == "") {
    		//BUG #6440 【form】各个表单组件的校验提示不统一
        	hidden.val("");
        	this.tempCheckedKeyArray=[];
    	}
        
        if($.type(value)=="string"||$.type(value)=="number"){
            value = {"key":value+""} ;
        }
       
        //修改select的设置初始值逻辑，修复在全选条件下分隔符为空时值无法展示的问题
        var ul = this.listEl.children("ul") ;
        if (this.listEl.length > 0) {
            if (this.multipleline) {
            	if(value.key == null || value.key=="" ){
            		field.val("");
            	}else if(value.text){
            		field.val(value.text);
            	}else{
            		var checkedString = [];
            		var tmpKey = [];
            		if(this.delimiter != ""){
            			tmpKey = value.key.split(this.delimiter);
            		}else{
            			tmpKey = value.key.toCharArray();
            		}
            		this.tempCheckedKeyArray=tmpKey;
            		if(this.params.dictName){
            			for(var i=0;i<tmpKey.length;i++){

            				//STORY #9624 [研发中心/内部需求][JresPlus][UI]-数据字典下拉后失丢焦点 再通过setvalue方法设置值，设置不成功 
	            			checkedString.push(Horn.getDict(this.params.dictName)[tmpKey[i]]);
            			}
            		}else{
            			var dataFromList = this.getListData().data;
            			for(var i=0;i<tmpKey.length;i++){
            				for(var j=0;j<dataFromList.length;j++){
            					if(tmpKey[i] == dataFromList[j].key){
            						checkedString.push(dataFromList[j].value);
            					}
            				}
            			}
            		}
            		checkedString=checkedString.toString().replace(/,/g, this.delimiter);
            		field.val(checkedString);
            		//需求 #15004 【TS:201511230300-JRESPlus-资产管理事业部-张翔-4.文本框和下选框值长度过长（超过组件宽度）无法显示
            		field.attr("title",checkedString);
            	}
                hidden.val(value.key);
            } else {
                if(!value.text){
                    var li = ul.children("li[key='" + value.key + "']");
                    value.text = jQuery.trim(li.text());
                	if(!this.showLabel){
                		var span = li.find('span');
                		value.text = value.text.replace(span.text(),"");
                    }
                }
                //BUG #6553 【combox】(继承)setValue() 设置无效值，依然会生效，但是getValue返回为""
                if(value.text!=""){
                    //【开发】bug #12498 需求14674---一个sreen中设置showLable为true，combox为单选模式时，输入框中默认值，key与value显示距离过大 
                    var str = value.text;
                    if($.type(value)=="string"){
                    	str = str+"";
                    	str = str.replace(/(^\s+)|(\s+$)/g,"");
                    	str = str.replace(/\s/g,"");
                    }
                    field.val(str);
                	hidden.val(value.key);
                }else{
                	//清空操作
                	if(value.key==""){
                        field.val("");
                	}else{//设置不合理值的非法操作
                		return;
                	}

                }
             }
            if (triggerChange && oldVal!=value.key) {
                field.trigger('change', [ value.key ]);
            }
        }
        
        //BUG #6839 【combox】在多选模式下无效的值任然可以设置成功  
        if (this.multipleline) {
        	//重新计算有效值，然后赋值给隐藏域（只针对多选有效）
            var val = this.hidden.val() ;
            var tmpVal = [];    //story 8487
            var _this = this;
            if(val!="" && val!=null){
	            $("input[type='checkbox']", this.listEl).each(function(index, dom) {
	                var li = $(dom).parent().parent("li[key]");
	                var curVal = li.attr("key");
	                var valArray = val.split(_this.delimiter);
	                var len = valArray.length;
	                for(var i=0; i< len; i++){
	                	var key = valArray[i];
	                     if(curVal==key){
	                    	 tmpVal.push(key);
	                     }
	                }
	            });
	            //BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
	            //tmpVal = tmpVal.substring(0,tmpVal.length-1);
	            this.hidden.val(tmpVal.join(this.delimiter));
            }
        }
        
      //将选中的值保存起来
       this.tempCheckedValue = this.field.val();
        
        //STORY #9468 [研发中心/内部需求][JresPlus][UI]comboxt组件在必填状态下，先清空值，然后执行setValue()设置非空值后，校验信息依然存在。设置了非空值后，校验通过，校
        //STORY #9469 [研发中心/内部需求][JresPlus][UI]comboxt组件在必填状态下，无值的情况下丢失焦点，然后执行setValue()设置非空值后，校验信息依然存在。设置了非空值后， 
        if (!notBlur) {
            this.validate();
        }
        
        
    } ,
    /**
     * 获取选中的值
     * @function
     * @name Horn.Select#getValue
     * @return String 返回选中的值
     */
    getValue : function(returnFieldValue){
    	this.handerHeadItem();
    	if(returnFieldValue){
    		var _select = this;
    		var val = this.hidden.val() ;
    		var getVal = function(key){
    			return  _select.DICT[key] || null;
    		};
    		if(this.multipleline){
    			var valArr = val.split(this.delimiter);
    			var rtnVal = [];
    			$(valArr).each(function(i,item){
    				var transVal =getVal(item);
    				if(transVal){
    					rtnVal.push(transVal);
    				}
    			});
    			return rtnVal.join(this.delimiter);
    		}else{
    			return getVal(val);
    		}
    	}
    	//bug#17110 单选模式下的combox设置value为item中不存在的值，通过getvalue获取值，会获取到value
    	var retVal=this.hidden.val();
    	var $listItems=this.listEl.find("ul>li");
    	var flag="";//单选模式下，hidden组件的value值是否在下拉项中存在的标志
    	//单选模式
    	if(!this.params.multiple || this.params.multiple==false){
    		if(this.params.value){
    			//var initVal=this.params.value;
    			$.each($listItems,function(i,item){
	    			if($(item).attr("key")==retVal){
	    				flag="has"
	    			}
	    		});
	    		if(!flag){
	    			retVal="";
	    		}
    		}
    			
    	}
        return retVal ;
    },
    onClick : function(e) {//bug #12452 需求14586--combox添加了filterby属性后，模糊搜索后的数据无法选中
    	if(this.searchField){
	    	this.field.hide();
	    	this.searchField.show();
	    	this.searchField.focus();
    	}
    },
    /**
     * @ignore
     */
    onFocus : function(e) {
        var curObj = $(e.currentTarget);
        var listDiv = this.listEl;
        var isFromOuter = curObj.data("isFromOuter");
//        if(this.params.readonly){
//        	return ;
//        } 
        if (listDiv.length > 0 ) {
        	var searchField_val = "";
        	if(this.searchField){
        		searchField_val = this.searchField.val();
        	}
        	if(searchField_val!=""){
        		//什么都不做
        	}else{
        		this.showList(curObj, listDiv);
        	}
        }else{
            var ref_target = this.field.attr("ref");
            this.listEl = ref_target ? this.el.parents('.h_floatdiv').find(
                "div.hc_hide_div").children(
                "div.hc_checkboxdiv[ref_target='" + ref_target + "']")
                : this.field.next("div.hc_checkboxdiv");
            if(this.listEl.length >0 ){
            	this.showList(curObj, this.listEl);
            }    
            this.multipleline = this.listEl.attr("multiple_line") == "true";
        }
        
        //9590
        if(this.enableFieldSearch){
        	//在window中使用模糊查询会出现两个查询框
        	var fields = this.el.find("input[name=fieldToSearch]");
        	if(fields.size() == 2){
        		fields.first().remove();
        	}
        	//BUG #12450 需求14586--combox添加了filterby属性后，选中值后输入框无法实时显示
        	var tmpVal = this.field.val();
        	if(tmpVal==""){
	        	this.field.hide();
	        	this.searchField.show();
	        	this.searchField.focus();
        	}
        }
    } ,
    /**
     * @ignore
     */
    onKeyDown : function(e){
        var keyCode = e.keyCode;
        var listEl = this.listEl ;
        var ul = listEl.children("ul") ;
        var lis = ul.children("li") ;
        var li = ul.children("li.h_cur") ;
        var listDom = listEl.get(0) ;
        var last = ul.children("li").last().get(0) ;
        if (e.ctrlKey && keyCode === 65 && this.multipleline) {
            var inputs = ul.find("input:not(:checked)") ;
            if(inputs.length==0){
                lis.removeClass("h_cur") ;
                inputs = lis.children("label").children("input") ;
                inputs.each(function(index,input){
                    input.checked = false ;
                }) ;
                this.setValue("") ;
            }
            else{
            	//需求 #15026 【TS:201511240583-JRESPlus-资产管理事业部-张翔-1.combox下拉框问题 输入过滤之后显示三项，选中一项之后过滤项变成了全部，之前过滤都没了，此时删除输入的过滤值，组件失去焦点，选中的那一项的值没了，获取焦点查看到选项是被选中的
            	inputs.each(function(index,input){
                	var display = $(input).parent("label").parent("li").is(":visible");
                    if(display){
	                	input.checked = true ;
	                    $(input).parent("label").parent("li").addClass("h_cur") ;
                    }
                }) ;
                if(this.searchField){
                	this.searchField.val("");
                	this.searchField.hide();
                	this.field.show();
                }
                inputs.last().parent("label").parent("li").triggerHandler("click.li") ;
            }
            Horn.Util.stopPropagation(e);
            return false;
        }
        else if (keyCode === 38) {//up
            //↑
            if(!this.multipleline){
                var prev = li.prev() ;
                if(prev.length){
                    listDom.scrollTop=prev.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
                    li.removeClass("h_cur") ;
                    prev.addClass("h_cur") ;
                }
            }
        } else if (keyCode === 40) {//down
            if(!this.multipleline){
                var next = li.next() ;
                if(next.length){
                    listDom.scrollTop=next.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
                    li.removeClass("h_cur") ;
                    next.addClass("h_cur") ;
                }
            }
        } else if (keyCode === 46 || keyCode === 8) {//回退或删除
           /* lis.removeClass("h_cur") ;
            var inputs = lis.children("label").children("input") ;
            inputs.each(function(index,input){
                input.checked = false ;
            }) ;
            this.setValue("") ;
            Horn.Util.stopPropagation(e);
            return false;*/
        	//BUG #6861 【combox】多选模式下，按回退或者删除键，会把值清空
        	//这个问题现在不存在了，因为都改成了显示值而不是key
        	//直接注视掉这个就可以解决BUG #6904 【combox】单选模式下，不应该能输入非法值  ；BUG #6903 【combox】单选模式下，“请选择”不能删除——同时单选下的模糊查找也顺利完成
//        	if (!this.multipleline) {
//        		this.setValue("") ;
//        	}
        } else if (keyCode === 9) {//tab键
            this.hideList(this.field, listEl);
        } else if (keyCode === 13 || keyCode === 32) { //回车或空格
            if(!this.multipleline){
                li.trigger("click.li") ;
                Horn.Util.stopPropagation(e);
            }
            return false;
        } else {
        }
        
    } ,
    /**
     * @ignore
     */
    onKeyPress : function(e){
        var keyCode = e.keyCode;
        var text = String.fromCharCode(keyCode) ;
        var newText = "" ;
        var listEl = this.listEl ;
        var ul = listEl.children("ul") ;
        var li = ul.children("li") ;
        if (keyCode>=65 && keyCode<=90){
            newText = text.toLowerCase() ;
        }
        else{
            newText = text.toUpperCase() ;
        }

        var selLi = this.selectLi(text,newText) ;
        var last = li.last().get(0) ;
        var listDom = listEl.get(0) ;
        if (keyCode === 38) {
        } else if (keyCode === 46 || keyCode === 8) {
        } else if (keyCode === 40) {
        } else if (keyCode === 13) {
        } else {
            //其他key值，用于筛选
            if (this.multipleline) {
                var value = this.getValue() ;
                if(value.indexOf(text)==-1){
                    if(selLi){
                        var input = selLi.children("label").children("input") ;
                        if(!input.get(0).checked){
                            input.get(0).checked = true ;
                            //BUG #6837 【combox】多选模式下，value设置有值，通过键盘增加输入框的值，所有已经设置的均应被选中
                            //selLi.trigger("click.li") ;
                        }
                    }
                } else {
                	// 20140423 hanyin BUG #6809 【combox】多选模式下，value设置有值，通过键盘修改输入框的值，下拉不会选中，焦点移开然后获得焦点依然无法选中
                	//selLi.trigger("click.li") ;
                }
            }
            if(selLi){
                listDom.scrollTop=selLi.get(0).offsetTop+(listDom.scrollHeight-listDom.clientHeight) -last.offsetTop ;
            }
        }
        Horn.Util.stopPropagation(e);
    },
    /**
     * @ignore
     */
    onKeyUp : function(e){
    	
        var listEl = this.listEl ;
        var _this = this;
        //只针对多选有效
        if (this.multipleline && !this.params.enableFieldSearch) {
        	
        	//select是否被编辑的标志,为了解决在可编辑状态下随意输入的值在丢焦点的时候清除
        	if(_this.params.editable){
        		_this.editflag = true;
        	}
        	
        	//之前的转换方式在显示值更改之后没有改
            var val = this.field.val() ;
//        	var val = this.tempCheckedKeyArray.toString();
            var keyArray = []
            var valueArray=[]
            var tmpVal = "";
            $("input[type='checkbox']", listEl).each(function(index, dom) {
                var li = $(dom).parent().parent("li[key]");
                var curVal = li.attr("title");
                var curKey = li.attr("key");
                
                //关闭取消所有的选中状态这样会造成已经选中的值被取消选中，是不是需要？
                //就算是从输入款中输入需要选中的key也不一定要把之前选中的值取消啊
                //STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
                $(dom).attr("checked", false);
                
                //BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
                var valArray = val.split(/[\,,\，]/);
                var len = valArray.length;
                for(var i=0; i< len; i++){
                	var key = valArray[i];
                	//更新为可以按照key或者value进行选择，不再局限于按照value来选择
                     if(curVal==key || key==curKey){
                    	 keyArray.push(curKey);
                    	 valueArray.push(curVal);
                    	 tmpVal = tmpVal+valArray[i]+",";
                    	 $(dom).attr("checked", true);
                     }
                }
                //$(dom).attr("checked", val.indexOf(curVal) > -1);
                if ($(dom).attr("checked")) {
                    li.addClass("h_cur");
                } else {
                    li.removeClass("h_cur");
                }
                li.focus() ;
            });
            //BUG #6927 【combox】多选模式下，设置"defValue":"1,0"，然后调用reset()方法会造成显示的值为"1,0"但是提交值变成[01,]
            tmpVal = tmpVal.substring(0,tmpVal.length-1);
            this.tempCheckedKeyArray=keyArray;
            
            //select中在不开启模糊查询的时候，编辑文本框丢焦点后文本框应该正确显示选中的值，不包括随意输入的内容
            this.tempCheckedValue=valueArray.toString();
            _this.hidden.val(keyArray);
        }
        
        Horn.Util.stopPropagation(e);
    },
    /**
     * @ignore
     */
    ///////////////////解决多个combox在相同数据字典的情况下，选中一个后其他combox的下拉列表无法正常显示的问题
    bodyClick : function(e) {
    	var target = this.getEventTarget();
        if(e.target==e.data.inputEl.get(0) || target.data("isFromOuter")){
        	target.data("isFromOuter",false);
        	
        	var listEl = e.data.listEl;
            var inputEl = e.data.inputEl;
            this.showList(inputEl, listEl);
            $(document).one(this.bodyclicktype, e.data,
                Horn.Util.apply(this.bodyClick,this));
        }
        else{
            var listEl = e.data.listEl;
            var inputEl = e.data.inputEl;
            listEl.hide()
            if (!listEl.data("show_name")) {
                return;
            }
            var listLi = $("li[key]", listEl);
            listLi.unbind('click.li');
            listEl.data("show_name", "");
            //需求 #14814 【TS:201511130151-资产管理事业部-张翔 输入过滤之后显示三项，选中一项之后过滤项变成了全部，之前过滤都没了，此时删除输入的过滤值，组件失去焦点，选中的那一项的值没了，获取焦点查看到选项是被选中的
            if(this.searchField){
            	this.searchField.val("");
            }
        }
    } ,
    /**
     * @ignore
     */
    listClick : function(e) {
//    	this.fromListClick = true;
        var _this = this ;
        var _li = $(e.currentTarget);
        var listEl = e.data.listEl;
        var value = {} ;
        if (_this.multipleline) {
            var arrVal = new Array();
            var arrValTitle = new Array();
            $("input[type='checkbox']:checked", listEl).each(function(index, dom) {
                var curVal = $(dom).parent().parent("li[key]").attr("key");
                var curValTitle = $(dom).parent().parent("li[key]").attr("title");
                if (curVal) {
                    arrVal.push(curVal);
                    arrValTitle.push(curValTitle);
                }
            });
            this.tempCheckedKeyArray=arrVal;
            //为select内容过长的时候显示tips
            this.field.attr("TITLE",arrValTitle.toString());
            
            value["key"] = arrVal.join(_this.delimiter) ;
            value["text"] = arrValTitle.join(_this.delimiter) ;
            if ($("input[type='checkbox']", _li).get(0).checked) {
                _li.addClass("h_cur");
            } else {
                _li.removeClass("h_cur");
            }
            e.stopPropagation();
            this.setValue(value,true,true) ;
        } else {
            _li.addClass("h_cur");
            _li.siblings().removeClass("h_cur");
            this.setValue(_li.attr("key"),true,true) ;
        }
        
        //window下blur事件多次触发的问题
        this.field.trigger('blur');
        
      //将选中的值保存起来
      this.tempCheckedValue = this.field.val();
      //需求14588 【TS:201510300215-JRESPlus-资产管理事业部-张翔-Combox多选时，先用ctr+A可以全选所有下拉选项，但是在此用ctr+A的时候就不能反选，会选中整个页面
      if (_this.multipleline){
    	  this.field.focus();
      }
    } ,
    /**
     * @ignore
     */
    hideList : function(inputEl, listEl) {
        if (!listEl.data("show_name")) {
            return;
        }
        listEl.hide();
        var listLi = $("li[key]", listEl);
        listLi.unbind('click.li');
        listEl.data("show_name", "");
    } ,
    /**
     * @ignore
     */
    longerList : false,
    changeToLongerList : function(){
    	this.longerList = true;
    },
    /**
     * @ignore
     */
    showList : function(inputEl, listEl) {
    	this.handerHeadItem();
        var _this = this ;
        
        //STORY #10007 [海外发展部/胡琦][TS:201410110002]-JRESPlus-ui-根据patch20140930_2(jresui1.0.6)】
        //当配置了readonly属性后下拉列表不能弹出
        if(this.readonly == true){
        	return false;
        }
        
        //显示所有列表当中的表项
        //STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
        //兼容不同combox的相互级联的功能
        //var searchField_val = this.searchField.val();
        if(this.enableFieldSearch){
        	//需求 #14584 【TS:201510300213-JRESPlus-资产管理事业部-张翔-Combox添加了filterBy属性之后再调用filter无效
        	var searchField_val = this.searchField.val();
        	if(searchField_val!=""){
	        	$("li",listEl).each(function(i,o){
	            	$(o).show();
	            })
        	}
        }
        
        var hidden = inputEl.prev() ;
        if (listEl.data("show_name")==hidden.attr("name")) {
            return;
        }
        this.hideAllList(listEl);
        // 应用对象
        var data = {
            'inputEl' : inputEl,
            'listEl' : listEl
        };
         
		if(listEl.offsetParent() != inputEl.offsetParent() ){
			listEl.appendTo(inputEl.offsetParent());
		}
        var pos = inputEl.position(),
	       	listOuterHeight = inputEl.outerHeight();
        // 显示位置
        listEl.css("left",pos.left + 'px') ;
        listEl.css("top",(pos.top + listOuterHeight) + 'px') ;
        listEl.css("width",(inputEl.outerWidth() * (this.longerList?2:1) - 2) + 'px') ;
        // 显示
        listEl.css("display","block");
        listEl.data("show_name", hidden.attr("name"));
        // 文档事件处理
        $(document).one(_this.bodyclicktype, data,
            Horn.Util.apply(_this.bodyClick,_this));
        // 列表事件绑定
        var listLi = $("li[key]", listEl);
        listLi.bind("click.li", data, Horn.Util.apply(_this.listClick,_this));
        listLi.removeClass("h_cur");

        // 列表初始化选择的值。这是我之前修改的导致了充值的时候tempCheckedKeyArray无法变更为初始化的值,原来的方式也没什么不对
        //STORY #9590 [财富管理事业部/陈凯][TS:201409030108]-JRESPlus-ui-对于下拉框的控件，请支持模糊搜索
//        var val = inputEl.prev().val();
        var val=this.tempCheckedKeyArray.toString();
        if (this.multipleline) {
            $("input[type='checkbox']", listEl).each(function(index, dom) {
                var li = $(dom).parent().parent("li[key]");
                var curVal = li.attr("key");
                $(dom).attr("checked", false);
                //BUG #6804 【combox】在多选模式下，如果setValue("20140205")会生效，并且会把0、1、2、4、5、14、20等全部选中
                var valArray = val.split(",");
                for(var i=0; i< valArray.length; i++){
                	var key = valArray[i];
                     if(curVal==key){
                    	 $(dom).attr("checked", true);
                     }
                }
                
                //$(dom).attr("checked", val.indexOf(curVal) > -1);
                if ($(dom).attr("checked")) {
                    li.addClass("h_cur");
                } else {
                    li.removeClass("h_cur");
                }
                li.focus() ;
            });
        } else {
        	//单选时下拉菜单未选中当前值 20151209 modify by 周智星
        	var filedVal = this.hidden.val();
            var li = listEl.children("ul").children("li[key='" + filedVal + "']") ;
            //var li = listEl.children("ul").children("li[key='" + val + "']") ;
            li.addClass("h_cur");
            li.focus() ;
        }
        
        if(this.showLabel){
        	this.listEl.find('span.hce_dictlabel').show();
        }else{
        	this.listEl.find('span.hce_dictlabel').hide();
        }
    } ,
    /**
     * @ignore
     */
    hideAllList : function(listEl) {
        $("div.hc_checkboxdiv").each(function(i, o) {
            if (listEl.get(0) != o) {
                $(o).hide();
                $(o).data("show_name", "");
            }
        });
    },
    /**
     * @ignore
     */
    selectLi : function(text,old){
        var liList = this.listEl.children("ul").children("li") ;
        var selectLi = null ;
        for(var i=0;i<liList.size();i++){
            var li = $(liList.get(i)) ;
            var key = li.attr("key") ;
            //BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
            if(key && key.indexOf(text)==0){
                selectLi = li ;
                break ;
            }
        }
        if(selectLi==null && !this.multipleline){
            for(var i=0;i<liList.size();i++){
                var li = $(liList.get(i)) ;
                var key = li.attr("key") ;
                //BUG #6920 【combox】有headItem的单选状态，在输入框输入任何值报js错误
                if(key && key.indexOf(old)==0){
                    selectLi = li ;
                    break ;
                }
            }
        }
        if(selectLi!=null){
            if (!this.multipleline) {
                selectLi.siblings().removeClass("h_cur");
                selectLi.addClass("h_cur");
            }
        }
        return selectLi ;
    },
    bind : function(type,fn){
        this.field.bind(type,[this.hidden],fn) ;
    },
	setEnable : function(enable){
		if(enable){
			this.field.removeAttr("disabled");
			this.hidden.removeAttr("disabled");
		}else{
			this.hidden.attr("disabled","disabled");
			this.field.attr("disabled","disabled");
		}
	},
	
	/*STORY #9354 【TS:201408080099-JRESPlus-财富管理事业部-陈为- 把jresplusui升级到1.0.3之后，原先】 
	 * getEventTarget : function(){
		return this.field;
	},*/
	/**
	 *返回下拉框中所有的数据
     * @function
     * @name Horn.Select#getListData
     * @return object data为所有节点的值,dom为该节点的jquery对象
     */
	getListData : function(){
		var dataPare = {};
		var data = [];
		if(this.multipleline){
			$("input[type='checkbox']", this.listEl).each(function(index, dom) {
				var li = $(dom).parent().parent("li[key]");
				var tmp={};
				tmp.key = li.attr("key");
				tmp.value = li.attr("title");
		        data.push(tmp);
		    })
	    }else{
		    $("li[key!='']", this.listEl).each(function(index, dom) {
				var li = $(dom);
				var tmp={};
				tmp.key = li.attr("key");
				tmp.value = li.attr("title");
		        data.push(tmp);
		    })
	    }
	    dataPare.data=data;
	    dataPare.dom=this.listEl;
	    return dataPare;
	}
}) ;
Horn.Field.regFieldType("div.biz_combox",Horn.BizCombx) ;