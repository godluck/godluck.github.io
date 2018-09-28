动画接入方式：

HTML和CSS：
创建一个容器用于定位，对容器设置position:alsolute或relative,并给出具体宽度
容器内容参考.g-main内，保持一致且即可
容器内元素的样式参考index.less

js:
直接在页面内引入或使用require引入，得到对象
{
	init:function, //初始化，加载和渲染一条龙
	start:function, //重启动画
	pause:function, //暂停动画
}