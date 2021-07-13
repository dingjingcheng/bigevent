$(function () {

    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,//页码值，默认显示第一页
        pagesize: 2,//每页显示多少条数据，默认2
        cate_id: '',//文章分类的id
        state: '',//文章的状态，如已发布、草稿
    }

    // 定义一个补领的函数
    function padZero(value) {
        return value < 10 ? '0' + value : value;
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormate = function (dateStr) {
        let date = new Date(dateStr);
        let y = date.getFullYear();
        let m = padZero(date.getMonth() + 1);
        let d = padZero(date.getDate());

        let hh = padZero(date.getHours());
        let mm = padZero(date.getMinutes());
        let ss = padZero(date.getSeconds());

        return y + '-' + m + '-' + d + " " + hh + ":" + mm + ":" + ss;
    }

    // 初始化文章类别
    initCate();

    // 初始化列表
    initTable();

    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章列表获取失败");
                }
                // layer.msg("文章列表获取成功");
                let htmlStr = template("tpl-tble", res);
                $(".layui-table tbody").html(htmlStr);
                // 调用方法渲染分页
                renderPage(res.total);
            }
        })
    }

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
                // 通知layUI重新渲染表单结构
                form.render();
            }
        })
    }

    // 为筛选表单绑定submit事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 更新查询参数对象里面的值
        q.cate_id = $("select[name=cate_id]").val();
        q.state = $("select[name=state]").val();
        // 根据查询条件，重新渲染表格
        initTable();
    })

    // 分页方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',  //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [1, 3, 5, 10, 20],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候会触发jump回调
            //触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            jump: function (obj, first) {
                // 可以通过first的值来判断通过哪种方式，触发的jump回调
                // 如果是first的值为true，证明是方式2触发
                // 否则是方式1

                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
                //首次不执行
                if (!first) {
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    // 根据页码信息再次渲染表格
                    initTable();
                }
            }
        });
    }

    // 通过代理为删除文章按钮绑定点击事件
    $(".layui-table tbody").on("click", ".btn-delete", function (e) {
        let id = $(this).attr("data-id");
        // 获取页面上所有的删除按钮
        let len = $(".btn-delete").length;
        console.log(id);
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }
                    layer.msg("删除文章成功");
                    layer.close(index);
                    /**
                     *在重新调用表格的渲染方法时，需要判断，当前页的数据
                     如果当前页只剩一条记录(通过获取当前页的删除按钮确定)，则删除后应该显示上一页的数据，也就是当前页减1
                     如果当前页为改变，则还是重新渲染当前页的数据，而数据已经被删空了
                     注意，当前页为1不能减
                     */
                    if(len===1){
                        q.pagenum = q.pagenum === 1?1:q.pagenum-1;
                    }
                    initTable();
                }
            })
        });
    })


})