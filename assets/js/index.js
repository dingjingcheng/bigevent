$(function () {
    var layer = layui.layer;
    // 点击退出
    $("#btnLogout").on("click", function () {
        // 询问用户否确认操作
        layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function (index) {
            // 清楚token信息，跳转到登录页面
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    })
    getUserInfo();

})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {//请求头配置，携带token认证身份
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderAvatar(res.data);
        },
        // 无论成功还会失败，complete回调函数最终都会被调用
        // complete: function (res) {
        //     // 可以通过responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1.强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(data) {
    // 1.获取用户名称，有昵称优先级高于用户名
    var name = data.nickname || data.username;
    // 2.设置欢迎文本
    $("#welcome").html("欢迎您&nbsp;&nbsp;" + name);
    // 3.按需渲染用户头像，有头像则显示，没有则显示用户名的第一个字母
    if (data.user_pic) {
        $(".layui-nav-img").attr("src", data.user_pic).show();
        $(".text-avatar").hide();
    } else {
        $(".text-avatar").html(name[0].toUpperCase()).show();
        $(".layui-nav-img").hide();
    }
}


