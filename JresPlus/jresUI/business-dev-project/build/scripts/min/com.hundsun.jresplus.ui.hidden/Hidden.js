Horn.HiddenField=Horn.extend(Horn.Field,{COMPONENT_CLASS:"HiddenField",init:function(){Horn.HiddenField.superclass.init.apply(this,arguments);this.field=this.el;this.name=this.field.attr("name");this.alias=this.field.attr("alias")||"";this.defValue=(this.params.defValue!=undefined)?this.params.defValue:this.field.val()},isValid:function(){return true},showError:function(){},reset:function(a){if(a){this.field.val("")}else{this.field.val(this.defValue)}},removeError:function(){}});Horn.Field.regFieldType("input.hc_hiddenfield",Horn.HiddenField);