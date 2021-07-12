$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 定义一个验证用户昵称的验证规则
    form.verify({
        nickname: [/^\S{1,10}$/, "昵称的长度为1-10个字符!"],
        // function(value) {
        //     if (value.length > 6) {
        //         return "昵称的长度为1-10个字符!"
        //     }
        // }
    })
    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                // 为修改用户信息的表单初始化数据
                form.val("fromUserInfo", res.data)
            }
        })
    }

    // 为修改用户信息的表单绑定提submit事件
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: form.val("fromUserInfo"),//通过layui的方式获表单提交内容
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 更新用户信息后，我们需要将首页的“欢迎信息”更改，因为用户改名（昵称）可能已经修改
                //而现在是处于iframe的窗口中，处于index.html父窗口下，我们可以通过window.parent方法调用父窗口的方法
                window.parent.getUserInfo();

            }
        })
    })

    // 重置表单，将表单信息还原为更改之前的数据
    $("#btnReset").on("click", function (e) {
        // 阻止表单的默认行为，否则会将表单所有数据清空
        e.preventDefault();
        // 重新初始化表单
        initUserInfo();
    })




})