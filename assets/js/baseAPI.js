/**
 * 每次调用$.get()或$.post()或$.ajax()方法时会先调用
 * ajaxPrefilter这个函数，在这个函数中，可以拿到提供给ajax的配置对象
 */

$.ajaxPrefilter(function (options) {
    // 发起ajax请求前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // options.url = 'http://www.liulongbin.top:3008' + options.url;
    // 统一为需要权限的url添加请求头信息
    if (options.url.includes("/my/")) {
        options.headers = {//请求头配置，携带token认证身份
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete函数
    options.complete = function (res) {
        // 可以通过responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转到登录页面
            location.href = '/login.html';
        }
    }

})