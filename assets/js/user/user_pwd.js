$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function (value) {
            if ($("[name=oldPwd]").val() === value) {
                return "新密码和原密码相同";
            }
        },
        repwd: function (value) {
            if ($("[name=newPwd]").val() !== value) {
                return "密码不一致";
            }
        }

    })


    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("密码修改成功");
                // 重置表单
                $(".layui-form")[0].reset();
            }
        })
    })


})