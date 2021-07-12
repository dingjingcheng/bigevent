$(function () {

    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 选择图片上传
    $("#btnChooseImage").on("click", function () {
        $("#file").click();
    })

    // 为文件添加change事件，监听图片是否发生更改
    $("#file").on("change", function (e) {
        console.log(e);
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg("请先选择图片");
        }
        // 1.拿到用户选择的图片
        var file = filelist[0];
        // 2.根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file)
        // 3.先销毁旧的裁剪区，在重新设置图片路径，之后在初始化
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 点击确定按钮上传图片
    $("#btnUpload").on("click", function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("图片上传成功");
                // 调用父窗口的方法，更新用户头像
                window.parent.getUserInfo();
            }
        })

    })

})