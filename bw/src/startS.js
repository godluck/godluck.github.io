var startScene=cc.Scene.extend({
	kll:0,
	death:0,
	onEnter:function () {
		this._super();
		var s=new startLayer();
		this.addChild(s,0);
		s.display(this.death,this.kll);
	}
});
var startLayer=cc.Layer.extend({
	background:null,
	score:null,
	rank:null,
	menu:null,
	newGame:null,
	exit:null,
	share:null,
	display:function(score,rank){
		var size=cc.winSize;
		this.background=new cc.Sprite(res.startBG);
		this.background.attr({
			scale:0.5,
			x:size.width/2,
			y:size.height/2
		});
		this.addChild(this.background,0);
		this.score=new cc.LabelTTF(score.toString(),"microsoft yahei",40);
		this.score.setColor(cc.color(74, 195, 237, 1));
		this.score.attr({
			x:size.width/2+15,
			y:size.height/2+65
		});
		this.addChild(this.score,1);
		this.rank=new cc.LabelTTF(rank.toString(),"microsoft yahei",40);
		this.rank.setColor(cc.color(74,195, 237, 1));
		this.rank.attr({
			x:size.width/2+5,
			y:size.height/2+15
		});
		this.addChild(this.rank,1);
		var newGamel=new cc.Sprite(res.restart1);
		newGamel.y+=1;
		var newGamel2=new cc.Sprite(res.restart2);
		newGamel2.x-=2;
		newGamel2.y+=1;
		var newGamel3=new cc.Sprite(res.restart2);
		newGamel3.x-=2;
		newGamel3.y+=1;
		this.newGame=new cc.MenuItemSprite(newGamel,newGamel2,newGamel3,this.restartGame, this);
		this.menu=new cc.Menu(this.newGame);
		this.menu.alignItemsHorizontally();
		this.addChild(this.menu,1);
		this.menu.setPosition(size.width/2, 200);
		cc.eventManager.addListener(shareClick,this);
	},
	restartGame:function(pSender){
		cc.director.runScene(new EndScene());
	}
});