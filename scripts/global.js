$(function(){
	
	/**
	 *	代码高亮插件不智能，所以自个判断
	 */
	var code = $("code").text();
	if(  code.indexOf("$(") > -1 || code.indexOf("var") > -1 ){
		$("code").attr("class","language-javascript");
	}
	if( code.indexOf("php") > -1 ){
		$("code").attr("class","language-php");
	}

	/**
	 *	通过url 获取当前所在栏目
	 */
	var menu =  $(".menu li a");
	var now_href = window.location.href; // 取得url
	var arr = now_href.split("/");		 // 分割url 
	var url	= '/' + arr[arr.length-1]	 // 组合成相对路径格式
	for (var i = 0; i < menu.length; i++) {
		var href = menu[i].getAttribute("href");
		if (href == url) {
			menu[i].className = 'current';
		}
	}
})
