$(function () {

    let layer = layui.layer;
    let form = layui.form;

    // 初始化文章分类可选项
    initCate();

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章分类获取失败")
                }
                // 调用模板引擎，渲染分类的可选项
                let htmlStr = template('tpl-cate', res);
                $("select[name=cate_id]").html(htmlStr);
                // 更新渲染表单
                form.render();
            }
        })
    }

    // 点击按钮打开文件选择
    $("#btnChooseImage").on("click", function (e) {
        $("#coverFile").click();
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $("#coverFile").on("change", function (e) {
        // 1.获取用户选择的文件
        let files = e.target.files;
        if (files.length === 0) {
            return layer.msg("请先选择图片");
        }
        // 2.根据选择的文件，创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 3.更换裁剪图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义一个文章发布的状态，state默认是”已发布“
    let btnPubState = "已发布";
    // 当用户点击"存为草稿"按钮，更改state
    $("#btnPubState2").on("click", function (e) {
        btnPubState = "草稿";
    })

    // 监听表单提交事件
    $("#from-pub").on("submit", function (e) {
        // 1.组织表单的默认提交行为
        e.preventDefault();
        // 2.基于form表单，快速创建一个FormData对象
        let fd = new FormData(this);
        // 3.将文章发布状态添加到fd
        fd.append("state", btnPubState);
        // 4.将封面裁剪过后的图片，输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 5.将文件对象，存储到fd
                fd.append("cover_img", blob);
                // 6调用ajax请求
                publishArticle(fd);
            })
        // 打印formData对象的方法
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：向服务器提交FormData的数据需要如下配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('文章发布失败');
                }
                layer.msg("文章发布成功");
                // 手动触发点击事件到文章列表的菜单
                window.parent.document.getElementById("a-article-publish").click();
                // 跳转到文章列表页面
                location.href = "/article/art_list.html";
            }
        })
    }



})