$(document).ready(function() {
    var sub = $('#sub');
    var activeRow; // 触发鼠标移入的主菜单项
    var activeMenu; // 激活显示的子菜单
    var timer;
    var mouseInSub = false; // 表示当前鼠标是否在子菜单里
    sub.on('mouseenter', function(e) {
        /* Act on the event */
        mouseInSub = true;
    }).on('mouseleave', function(e) {
        /* Act on the event */
        mouseInSub = false;
    });
    var mouseTrack = []; // 记录鼠标位置的数组
    // 结合使用push和shift可以模拟队列，先进先出FIFO
    var moveHandler = function(e) {
        mouseTrack.push({
            x: e.pageX,
            y: e.pageY
        })
        if (mouseTrack.length > 3) {
            mouseTrack.shift()
        }
    }
    // 给整个菜单div绑定事件而不是一级菜单，否则鼠标离开一级菜单进入二级菜单会导致二级菜单不显示
    $('#wrap').on('mouseenter', function(e) {
        // 鼠标移入一级菜单时让二级菜单显示
        
        $(document).on('mousemove', moveHandler);
    }).on('mouseleave', function(e) {
        // 鼠标移出一级菜单时让二级菜单和子菜单内容不显示
        sub.addClass('none');
        if (activeRow) {
            activeRow.removeClass('active');
            activeRow = null;
        }
        if (activeMenu) {
            activeMenu.addClass('none');
            activeMenu = null;
        }
        $(document).off('mousemove', moveHandler);
    }).on('mouseenter', 'li', function(e) {
        sub.removeClass('none');
        // 初始时鼠标没有移入一级菜单，activeRow未定义
        if (!activeRow) {
            activeRow = $(e.target).addClass('active');
            activeMenu = $('#' + activeRow.data('id')).removeClass('none');
            return; // 这里必须return，否则if语句里的代码执行结束后继续向后执行，activeRow变量undefined，会报错
        }
        // debounce去抖原理：在定时器回调函数最后timer = null，事件触发时，如果timer存在，说明后面的定时器回调函数没有执行到timer = null，即没有执行切换，就清除定时器队列，保证只执行一次切换，也就是最后一次
        if (timer) {
            clearTimeout(timer);
        }
        // 鼠标当前坐标
        var currMousePos = mouseTrack[mouseTrack.length - 1];
        // 鼠标之前的位置
        var leftCorner = mouseTrack[mouseTrack.length - 2];
        // 是否需要延迟
        var delay = needDelay(sub, leftCorner, currMousePos)
        if (delay) {
            timer = setTimeout(function(){
                // 如果鼠标在子菜单里，不进行子菜单的切换，直接return
                if (mouseInSub) {
                    return;
                }
                // 鼠标已经移入过一级菜单，从当前activeRow移到另一个li
                activeRow.removeClass('active');
                activeMenu.addClass('none');
                // 将新移入的li赋值给activeRow
                activeRow = $(e.target).addClass('active');
                activeMenu = $('#' + activeRow.data('id')).removeClass('none');
                timer = null;
            }, 300)
        } else {
            var prevActiveRow = activeRow
            var prevActiveMenu = activeMenu
            activeRow = $(e.target)
            activeMenu = $('#' + activeRow.data('id'))
            prevActiveRow.removeClass('active')
            prevActiveMenu.addClass('none')
            activeRow.addClass('active');
            activeMenu.removeClass('none');
        }
    });
});