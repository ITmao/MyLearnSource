package com.hundsun.jresplus.ui.demo.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexAction {
	@RequestMapping(value="/index.htm")
	public void login(ModelMap model,HttpSession session,HttpServletRequest request){
		model.put("navigation", navigation());
		model.put("menu", menu());
		
	}
	
	private List<MenuTree> navigation(){
		List<MenuTree> list = new ArrayList<MenuTree>();
		MenuTree menu = new MenuTree();
		menu.setId("10");
		menu.setTitle("demo");
		list.add(menu);
		return list;
	}
	private List<MenuTree> menu(){
		List<MenuTree> subSubGridList = new ArrayList<MenuTree>();
		List<MenuTree> subSubList = new ArrayList<MenuTree>();
		MenuTree subSubMenu = new MenuTree();
		subSubMenu.setId("10201");
		subSubMenu.setTitle("多选冻结列表格");
		subSubMenu.setUrl("/demo/datagrid/multi.htm");
		subSubGridList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10202");
		subSubMenu.setTitle("单选无冻结列表格");
		subSubMenu.setUrl("/demo/datagrid/single.htm");
		subSubGridList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10103");
		subSubMenu.setTitle("标签页");
		subSubMenu.setUrl("/demo/form/tabForm.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10104");
		subSubMenu.setTitle("文本录入");
		subSubMenu.setUrl("/demo/form/textfield.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10105");
		subSubMenu.setTitle("多行文本");
		subSubMenu.setUrl("/demo/form/textarea.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10106");
		subSubMenu.setTitle("下拉选择");
		subSubMenu.setUrl("/demo/form/combox.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10107");
		subSubMenu.setTitle("单选");
		subSubMenu.setUrl("/demo/form/radio.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10108");
		subSubMenu.setTitle("多选");
		subSubMenu.setUrl("/demo/form/checkbox.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10109");
		subSubMenu.setTitle("日期录入");
		subSubMenu.setUrl("/demo/form/calendar.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10111");
		subSubMenu.setTitle("金额录入");
		subSubMenu.setUrl("/demo/form/typefield_m.htm");
		subSubList.add(subSubMenu);
		subSubMenu = new MenuTree();
		subSubMenu.setId("10112");
		subSubMenu.setTitle("卡号录入");
		subSubMenu.setUrl("/demo/form/typefield_c.htm");
		subSubList.add(subSubMenu);
		subSubMenu.setId("10113");
		subSubMenu.setTitle("下拉选择树");
		subSubMenu.setUrl("/demo/form/selectTree.htm");
		subSubList.add(subSubMenu);
		subSubMenu.setId("10114");
		subSubMenu.setTitle("目标选择器");
		subSubMenu.setUrl("/demo/form/targetSelect.htm");
		subSubList.add(subSubMenu);
		subSubMenu.setId("10115");
		subSubMenu.setTitle("表单分组");
		subSubMenu.setUrl("/demo/form/formGroups.htm");
		subSubList.add(subSubMenu);
		subSubMenu.setId("10116");
		subSubMenu.setTitle("非阻断提示");
		subSubMenu.setUrl("/demo/message/tip.htm");
		subSubList.add(subSubMenu);
		subSubMenu.setId("10117");
		subSubMenu.setTitle("阻断式提示");
		subSubMenu.setUrl("/demo/message/messageBox.htm");
		subSubList.add(subSubMenu);
		subSubMenu.setId("10118");
		subSubMenu.setTitle("弹出窗口");
		subSubMenu.setUrl("/demo/window/window.htm");
		subSubList.add(subSubMenu);
		subSubMenu.setId("10119");
		subSubMenu.setTitle("树菜单");
		subSubMenu.setUrl("/demo/form/ztree.htm");
		subSubList.add(subSubMenu);
		
		List<MenuTree> subList = new ArrayList<MenuTree>();
		MenuTree subMenu = new MenuTree();
		subMenu.setId("101");
		subMenu.setTitle("表单组件");
		subMenu.setItems(subSubList);
		subList.add(subMenu);
		subMenu = new MenuTree();
		subMenu.setId("102");
		subMenu.setTitle("表格组件");
		subMenu.setItems(subSubGridList);
		subList.add(subMenu);
		List<MenuTree> list = new ArrayList<MenuTree>();
		MenuTree menu = new MenuTree();
		menu.setId("10");
		menu.setTitle("demo");
		menu.setItems(subList);
		list.add(menu);
		
		return list;
	}
}
