$(function () {
    var layer = layui.layer;
    var form = layui.form;

    getArtCateList();

    // 获取文章分类列表
    function getArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章类别获取失败");
                }
                res.data = res.data.splice(1, 3);
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }


    // 获取新增-弹出层的index
    var indexAdd = null;

    // 为新增按钮添加点击事件
    $("#btnAdd").on("click", function () {
        // 打开新增的表单
        indexAdd = layer.open({
            type: 1,//表示这是一个页面层，可以去除弹出层的确定按钮
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $("#dialog-add").html(),
        });
    })

    // 由于form-add是动态生成的，所以需要使用代理为form-add绑定submit事件
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败");
                }
                layer.msg("新增分类成功");
                // 根据索引关闭弹出层
                layer.close(indexAdd);
                // 重新加载文章分类
                getArtCateList();
            }
        })
    })

    var indexEdit = null;
    // btnEdit也是动态生成，所以也需要使用代理为btnEdit绑定click事件
    $("tbody").on("click", ".btn-edit", function (e) {
        // 打开修改的表单
        indexEdit = layer.open({
            type: 1,//表示这是一个页面层，可以去除弹出层的确定按钮
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $("#dialog-edit").html(),
        });
        // 根据id初始化修改的文章分类的数据
        var id = $(this).attr("data-id");
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // layui方式为表单赋值,表单需添加 lay-filter="fromInitData"
                form.val("fromInitData", res.data);
            }
        })
    })

    // 由于form-edit是动态生成的，所以需要使用代理为form-edit绑定submit事件
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改分类失败");
                }
                layer.msg("修改分类成功");
                // 根据索引关闭弹出层
                layer.close(indexEdit);
                // 重新加载文章分类
                getArtCateList();
            }
        })
    })

    // 通过代理为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function () {
        var id = $(this).attr("data-id");
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg("删除分类成功");
                    // 关闭弹窗
                    layer.close(index);
                    // 重新加载文章分类
                    getArtCateList();
                }
            })
        });
    })


})