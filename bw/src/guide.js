var guide1Scene=cc.Scene.extend({
	speed:0.28,
	onEnter:function () {
		this._super();
		var g=new guide1Layer();
		g.speed=this.speed;
		this.addChild(g,0);
		g.display();
	}
});
var guide1Layer=cc.Layer.extend({
	speed:0.28,
	display:function(){
		var size=cc.winSize;
		this.bg=new cc.Sprite(res.guide);
		this.bg.attr({
			scale:0.5,
			x:size.width/2,
			y:size.height/2
		});
		this.addChild(this.bg,0);
		cc.eventManager.addListener(guide1Click, this);
	}
});
var guide2Scene=cc.Scene.extend({
	speed:0.28,
	onEnter:function () {
		this._super();
		var g=new guide2Layer();
		g.speed=this.speed;
		this.addChild(g,0);
		g.display();
	}
});
var guide2Layer=cc.Layer.extend({
	speed:0.28,
	display:function(){
		var size=cc.winSize;
		this.bg=new cc.Sprite(res.guide2);
		this.bg.attr({
			scale:0.5,
			x:size.width/2,
			y:size.height/2
		});
		this.addChild(this.bg,0);
		cc.eventManager.addListener(guide2Click, this);
	}
});