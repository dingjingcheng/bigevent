$(function () {
    // 点击去注册的链接
    $("#link_reg").click(function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    // 点击去登录的链接
    $("#link_login").click(function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // 从layui中获取form对象
    var form = layui.form;
    // 从layui中获取layer对象
    var layer = layui.layer;


    //通过verify函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 定义一个校验两次密码输入是否一致的规则
        repwd: function (value) {//value：表单的值
            var pwd = $(".reg-box [name=password]").val();
            if (value !== pwd) {
                return "两次密码输入不一致"
            }
        }
    });

    // 发起注册请求
    $("#form_reg").on("submit", function (e) {
        // 阻止表单默认行为
        e.preventDefault();
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功');
            // 注册成功后，模拟人的点击登录链接，去登录
            $("#link_login").click();
        })
    })
    // 发起登录请求
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 使用jquery方法一次性获取表单
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("用户名或密码不正确");
                }
                layer.msg("登录成功");
                // 将token存入localStorage中，以便将来获取进入有权限的页面
                localStorage.setItem('token', res.token);
                // 跳转到首页
                location.href = '/index.html';
            }
        })
    })


})