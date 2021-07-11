/**
 * 每次调用$.get()或$.post()或$.ajax()方法时会先调用
 * ajaxPrefilter这个函数，在这个函数中，可以拿到提供给ajax的配置对象
 */

$.ajaxPrefilter(function (options) {
    // 发起ajax请求前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    console.log(options.url);
})