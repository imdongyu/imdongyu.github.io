$(function(){
	var code = $("code").text();
	if(  code.indexOf("$(") > -1 || code.indexOf("var") > -1 ){
		$("code").attr("class","language-javascript");
	}

	if( code.indexOf("php") > -1 ){
		$("code").attr("class","language-php");
	}
})
