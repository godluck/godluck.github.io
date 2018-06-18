# turntable/转盘

## 简介
- 通过用户触摸旋转转盘，并在触摸结束时提供回调函数，参数为用户旋转的角度值
- 组件依赖zepto/jquery

## 原理
- 三点计算向量夹角

## 配置
```javascript
var config = {
    distance: 500, //半径
    elements: null, //卡片元素
    useRem: false, //是否使用rem单位长度
    container: null, //直接包含卡片元素的容器
    returnSpeed: 1, //滚动恢复的速度
    onTouchend:function(degree){} //触摸结束时,转盘回弹之前的回调
}
initTurntable(config)
```

## 开发复杂度
0--[2]--------10