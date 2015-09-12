var EndScene=cc.Scene.extend({
	onEnter:function () {
		this._super();
		var bg=new bgLayer();
		this.addChild(bg,0);
		bg.display(20,1);
	}
});
var bgLayer=cc.Layer.extend({
	background:null,
	score:null,
	rank:null,
	menu:null,
	newGame:null,
	exit:null,
	display:function(score,rank){
		soundC.playMusic(res.loadmusic);
		var size=cc.winSize;
		this.background=new cc.Sprite(res.endBG);
		this.background.attr({
			x:size.width/2,
			y:size.height/2
		});
		this.addChild(this.background,0);
		var newGamel=new cc.Sprite(res.start1);
		var newGamel2=new cc.Sprite(res.start2);
		var newGamel3=new cc.Sprite(res.start2);
		this.newGame=new cc.MenuItemSprite(newGamel,newGamel2,newGamel3,this.restartGame1, this);
		this.newGame.attr({scale:0.5,y:175});
		var newGamel1=new cc.Sprite(res.start11);
		var newGamel21=new cc.Sprite(res.start12);
		var newGamel31=new cc.Sprite(res.start12);
		this.newGame1=new cc.MenuItemSprite(newGamel1,newGamel21,newGamel31,this.restartGame2, this);
		this.newGame1.attr({scale:0.5,y:200});
		this.menu=new cc.Menu(this.newGame,this.newGame1);
		this.menu.alignItemsVertically();
		this.addChild(this.menu,1);
		this.menu.setPosition(size.width/2, 200);
	},
	restartGame1:function(pSender){
		soundC.stopMusic();
		var temp=new guide1Scene();
		temp.speed=0.5;
		cc.director.runScene(temp);
	},
	restartGame2:function(pSender){
		soundC.stopMusic();
		var temp=new guide1Scene();
		temp.speed=1;
		cc.director.runScene(temp);
	}
});