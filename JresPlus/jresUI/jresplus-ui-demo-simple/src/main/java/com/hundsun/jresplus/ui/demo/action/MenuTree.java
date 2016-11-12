package com.hundsun.jresplus.ui.demo.action;

import java.util.ArrayList;
import java.util.List;

public class MenuTree {
	
	private String id;
	private String title;
	private String icon;
	private String url;
	private List<MenuTree> items;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public List<MenuTree> getItems() {
		return items;
	}
	public void setItems(List<MenuTree> items) {
		this.items = items;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
	

}
