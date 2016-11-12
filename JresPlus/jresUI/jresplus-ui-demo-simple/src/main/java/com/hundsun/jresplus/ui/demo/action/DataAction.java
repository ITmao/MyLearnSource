package com.hundsun.jresplus.ui.demo.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.jresplus.ui.page.Page;
@Controller
public class DataAction {
	@RequestMapping(value = {"/test/grid/testGrid.htm", "/test/events/testEvents.htm"})
	public void testGrid(Page page, ModelMap mm) {
		List<Map> ls = new ArrayList<Map>();
		Page _page = page;
		int pageSize = _page.getPageSize();
		int count = 300;
		int pages = (count % pageSize == 0) ? (count / pageSize)
				: (count / pageSize) + 1;
		int pageNo = _page.getPageNo();
		if(pageNo>pages){
			pageNo = pages;
		}
		if(pageSize>count){
			pageSize = count;
		}
		if (!StringUtils.isNotBlank(pageNo + "")) {
			pageNo = 1;
			for (int i = 0; i < 10; i++) {
				Map<String, String> map = new HashMap<String, String>();
				map.put("initDate", "01/20/2014");
				map.put("branchNo1", "" + i);
				map.put("branchNo", "8888");
				map.put("scanType", "1111");
				map.put("clientId", "124455.985");
				map.put("clientName",
						"张三2014-2-8 11:07:04 org.apache.catalina.core.ApplicationContext log"
								+ "信息: Initializing Spring FrameworkServlet 'jresServlet'"
								+ "2014-2-8 11:07:08 org.apache.catalina.core.StandardContext addApplicationListener ");
				map.put("taskStatus", "1");
				ls.add(map);
			}

		} else {
			for (int i = pageNo; i < (pageNo + pageSize); i++) {
				Map<String, String> map = new HashMap<String, String>();
				map.put("initDate", "01/20/2014");
				map.put("scanType2", "wwwwwww" + i);
				map.put("branchNo", "8888");
				map.put("branchNo1", ""+i);
				map.put("scanType", "1111");
				map.put("clientId", "124455.985");
				map.put("clientName",
						"张三");
				map.put("taskStatus", "1");
				ls.add(map);
			}
		}
		page.setPageNo(pageNo);
		page.setPages(pages);
		page.setPageSize(pageSize);
		page.setCount(3000);
		mm.put("data", ls);
		mm.put("page", page);
	}
	@RequestMapping(value="/datagrid/data.json")
	public @ResponseBody Map data() {
		Map data = new HashMap();
		List<Map> es = new ArrayList<Map>();
		for (int i = 0; i < 30; i++) {
			Map e = new HashMap();
			e.put("name1","ajax测试1列");
			e.put("name2","ajax测试2列");
			e.put("name3","ajax测试3列");
			e.put("name4","ajax测试4列");
			e.put("name5","ajax测试5列");
			es.add(e);
		}
		data.put("rows", es);
		data.put("total", 30);
		data.put("pageSize",10);
		data.put("pageNo",3);
		data.put("pages",3);
		return data;
	}
	
	@RequestMapping(value="/datagrid/data2.json")
	public @ResponseBody Map data2() {
		Map data2 = new HashMap();
		List<Map> es = new ArrayList<Map>();
		for (int i = 0; i < 10; i++) {
			Map e = new HashMap();
			e.put("operate_ype","");
			e.put("vc_stock_code","001"+i);
			e.put("vc_stock_name","2441");
			e.put("l_begin_date","NO"+i);
			e.put("dep","MSF");
			e.put("type","ajax测试333列");
			e.put("begin_date","2016-03-18");
			e.put("detl","备注信息");
			es.add(e);
		}
		data2.put("rows", es);
		data2.put("total", 24);
		data2.put("pageSize",10);
		data2.put("pageNo",3);
		data2.put("pages",3);
		return data2;
	}
}
