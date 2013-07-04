---
layout: post
title: 锋利的jQuery笔记 —— 表单验证
tag: javascript
---

### 实时验证

jQuery中实现实时验证非常简单，通过keyup()方法获取键盘松开状态，triggerHandler()方法触发绑定的验证事件，就可以实现实时的公证验果。
		
		$("form :input").blur(function(){
			$(".formtips").remove();				// 删除已存在的提示
			if( $(this).is("#username") ){
				if( this.value=="" || this.value.length < 6 ){
					var errorMsg = '<span class="formtips onError">请输入6位密码</span>';
					$(this).next().append(errorMsg);
				}else{
					var okMsg = '<span class="formtips Successl">Ok</span>';
					$(this).next().append(okMsg);
				}
			}
		}).keyup(function(){					// 松开按键后
			$(this).triggerHandler("blur");		// 触发blur 事件
		})

### 全局验证

当用户点击提交后，需要对表单进行全局验证，通过trigger() 方法触发事件，利用错误提示的onError类来判断表单是否通过验证。

		
		$("#send").click(function(){					// 绑定click事件
			$("form .required:input").trigger('blur');  // 用trigger()触发blur事件
			var numError = $('form .onError').length;	// 获取未验证通过的元素
			if( numError ){
				return false;							// 如果为真返回false
			}
			alert("注册成功");
		})

trigger() 和 triggerHandler() 的区别是前者不仅触发绑定事件还触发浏览器事件，后者只触发绑定事件不触发浏览器事件。


