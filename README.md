# ethrow
一个基于jQuery的拖拽插件，模拟自然抛出效果，模拟重力加速度

## DEMO

拖动Demo中的元素（有标题的拖标题，没标题的拖元素本身），然后快速抛出去。

Demo地址：[http://mailzwj.github.io/ethrow/](http://mailzwj.github.io/ethrow/)

## 使用说明

该插件可同时初始化多个拖拽对象，每个对象的个性化配置参数可在绑定插件的节点的`data-config`属性中设置，例：

```
<div id="J_KThrow" class="demobox">
    <div class="content J_WholeDrag" data-config='{"mover": "#J_KThrow", "decay": 0.65, "delay": 0.5, "zIndex": 100}'>拖动并将我扔出去。</div>
</div>
```

组件初始化方法：

```
$('.J_WholeDrag').eThrow();
```

组件遵循jQuery插件开发规范，同样支持链式调用，例：

```
$('.J_WholeDrag').eThrow().css('backgroundColor', '#800');
```

组件提供默认参数，参数如下：

```
$.fn.eThrow.default = {
    target: '.J_EThrow', // 拖动控制器
    mover: '.J_EThrowBox', // 被拖动节点
    decay: 0.75,
    size: {w: 200, h: 200},
    speedX: 0,
    speedY: 0,
    delay: 1,
    zIndex: 10
};
```

## 参数说明

- `target`: 拖动控制器，在该节点上按下鼠标触发拖动
- `mover`: 真正发生拖动位移变化的元素，一般为元素target本身或其父元素，详见demo
- `decay`: 弹跳衰减因子，取值在(0, 1)之间，越大，弹跳次数越多
- `size`: 拖动元素(mover)的大小
- `speedX`: X方向上的初始速度，基本不用
- `speedY`: Y方向上的初始速度，基本不用
- `delay`: 拖动元素(mover)出现后，停留多少时间后开启自由下落，单位秒(s)
- `zIndex`: 拖动元素(mover)的层级