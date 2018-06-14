var BGLayer=cc.Layer.extend({
	spriteBG:null,
	ctor:function(){
		this._super();
		var size=cc.winSize;
		bg=cc.textureCache.addImage(res.BG);
		this.spriteBG=new cc.Sprite(bg);
		this.setScale(0.5, 0.5);
		this.spriteBG.attr({
			x: size.width / 2,
			y: size.height / 2,
		});
		this.addChild(this.spriteBG, 0);
		return true;
	}
});
var MenuLayer=cc.Layer.extend({
	spriteMenu:null,
	cclock:null,
	cmirror:null,
	cunclock:null,
	cunmirror:null,
	clock:null,
	mirror:null,
	unclock:null,
	unmirror:null,
	pauseb:null,
	chipbox:null,
	chip:null,
	thin:null,
	g:null,
	dead:null,
	death:0,
	deathConsum:0,
	kll:0,
	chips:null,
	paused:false,
	soundb:null,
	soundon:true,
	ctor:function(){
		this._super();
		var size=cc.winSize;
		this.spriteMenubg=new cc.Sprite(res.menu);
		this.spriteMenubg.attr({
			scale:0.5,
			x: size.width / 2,
			y: size.height / 2
		});
		this.cclock=cc.textureCache.addImage(res.clock);
		this.cmirror=cc.textureCache.addImage(res.mirror);
		this.cunclock=cc.textureCache.addImage(res.unclock);
		this.cunmirror=cc.textureCache.addImage(res.unmirror);
		this.dead=new cc.Sprite(res.dead);
		this.clock=new cc.Sprite(this.cunclock);
		this.mirror=new cc.Sprite(this.cunmirror);
		this.pauseb=new cc.Sprite(res.pause);
		this.soundb=new cc.Sprite(res.unsound);
		this.chipbox=new cc.Sprite(res.chipbox);
		this.chip1=new cc.Sprite(res.chip);
		this.chip2=new cc.Sprite(res.chip);
		this.chip3=new cc.Sprite(res.chip);
		this.chip4=new cc.Sprite(res.chip);
		this.chip5=new cc.Sprite(res.chip);
		this.chip6=new cc.Sprite(res.chip);
		this.chip7=new cc.Sprite(res.chip);
		this.chip8=new cc.Sprite(res.chip);
		this.chip9=new cc.Sprite(res.chip);
		this.chip10=new cc.Sprite(res.chip);
		this.chip11=new cc.Sprite(res.chip);
		this.chip12=new cc.Sprite(res.chip);
		this.chip13=new cc.Sprite(res.chip);
		this.chip14=new cc.Sprite(res.chip);
		this.chip15=new cc.Sprite(res.chip);
		this.thin1=new cc.Sprite(res.thin1);
		this.thin2=new cc.Sprite(res.thin2);
		this.thin3=new cc.Sprite(res.thin3);
		this.thin4=new cc.Sprite(res.thin4);
		this.clock.attr({
			scale:0.5,
			anchorX:0,
			anchorY:0,
			x:260,
			y:5
		});
		this.dead.attr({
			scale:0.5,
			anchorX:0,
			anchorY:0,
			x:260,
			y:520
		});
		this.mirror.attr({
			scale:0.5,
			anchorX:0,
			anchorY:0,
			x:205,
			y:5
		});
		this.pauseb.attr({
			scale:0.5,
			anchorX:0,
			anchorY:0,
			x:20,
			y:20
		});
		this.soundb.attr({
			scale:0.5,
			anchorX:0,
			anchorY:0,
			x:60,
			y:20
		});
		this.chipbox.attr({
			scale:0.5,
			anchorX:0.5,
			anchorY:0,
			x:size.width/2,
			y:500
		});
		this.chip1.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-58,y:504});
		this.chip2.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-50,y:504});
		this.chip3.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-42,y:504});
		this.chip4.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-34,y:504});
		this.chip5.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-26,y:504});
		this.chip6.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-18,y:504});
		this.chip7.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-10,y:504});
		this.chip8.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2-2,y:504});
		this.chip9.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2+6,y:504});
		this.chip10.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2+14,y:504});
		this.chip11.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2+22,y:504});
		this.chip12.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2+30,y:504});
		this.chip13.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2+38,y:504});
		this.chip14.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2+46,y:504});
		this.chip15.attr({scale:0.5,anchorX:0,anchorY:0,x:size.width/2+54,y:504});
		this.thin1.attr({scale:0.5,anchorX:0,anchorY:0,x:25,y:480});
		this.thin2.attr({scale:0.5,anchorX:0,anchorY:0,x:25,y:480});
		this.thin3.attr({scale:0.5,anchorX:0,anchorY:0,x:25,y:480});
		this.thin4.attr({scale:0.5,anchorX:0,anchorY:0,x:25,y:480});
		this.thin2.setVisible(false);
		this.thin3.setVisible(false);
		this.thin4.setVisible(false);
		this.addChild(this.spriteMenubg, 0);
		this.addChild(this.clock, 1);
		this.addChild(this.mirror, 1);
		this.addChild(this.pauseb, 1);
		this.addChild(this.chipbox, 1);
		this.addChild(this.chip1, 1);
		this.addChild(this.chip2, 1);
		this.addChild(this.chip3, 1);
		this.addChild(this.chip4, 1);
		this.addChild(this.chip5, 1);
		this.addChild(this.chip6, 1);
		this.addChild(this.chip7, 1);
		this.addChild(this.chip8, 1);
		this.addChild(this.chip9, 1);
		this.addChild(this.chip10, 1);
		this.addChild(this.chip11, 1);
		this.addChild(this.chip12, 1);
		this.addChild(this.chip13, 1);
		this.addChild(this.chip14, 1);
		this.addChild(this.chip15, 1);
		this.addChild(this.thin1, 1);
		this.addChild(this.thin2, 1);
		this.addChild(this.thin3, 1);
		this.addChild(this.thin4, 1);
		this.addChild(this.dead,1);
		this.addChild(this.soundb, 1);
		this.labelkll=new cc.LabelTTF("Calorie: "+(this.kll*100),"microsoft yahei",20);
		this.labelkll.x=size.width/2;
		this.labelkll.y=this.chipbox.y+40;
		this.labeldeath=new cc.LabelTTF("0","microsoft yahei",20);
		this.labeldeath.y=this.chipbox.y+5;
		this.labeldeath.x=size.width-43;
		this.addChild(this.labelkll,1);
		this.addChild(this.labeldeath,1);
		this.thin=[this.thin1,this.thin2,this.thin3,this.thin4];
		this.chips=[this.chip1,this.chip2,this.chip3,this.chip4,this.chip5,this.chip6,this.chip7,this.chip8,this.chip9,this.chip10,this.chip11,this.chip12,this.chip13,this.chip14,this.chip15];
		for(var i=0;i<this.chips.length;i++){
			this.chips[i].setVisible(false);
		}
		cc.eventManager.addListener(tool, this);
		this.scheduleUpdate();
		return true;
	},
	bind:function(gamel){
		this.g=gamel;
	},
	update:function(){
		var score=1500*this.death+this.kll;
		if((this.g.count/4)%1==0){
			this.kll=1*this.g.count/4-15*this.death;
			if(this.kll>15){
				this.kll-=15;
				this.death+=1;
			}
			if(this.kll>0&&this.kll<16){
				for(var i=0;i<this.kll;i++){
					this.chips[i].setVisible(true);
				}
				for(var i=this.kll;i<15;i++){
					this.chips[i].setVisible(false);
				}
				if(this.kll<6){
					this.thin[0].setVisible(true);
					this.thin[1].setVisible(false);
					this.thin[2].setVisible(false);
					this.thin[3].setVisible(false);
				}else if(this.kll>5&&this.kll<10){
					this.thin[0].setVisible(false);
					this.thin[1].setVisible(true);
					this.thin[2].setVisible(false);
					this.thin[3].setVisible(false);
				}else if(this.kll>9&&this.kll<15){
					this.thin[0].setVisible(false);
					this.thin[1].setVisible(false);
					this.thin[2].setVisible(true);
					this.thin[3].setVisible(false);
				}else if(this.kll==15){
					this.thin[0].setVisible(false);
					this.thin[1].setVisible(false);
					this.thin[2].setVisible(false);
					this.thin[3].setVisible(true);
				}
			}
		}
		this.labelkll.setString("Calorie: "+(this.kll*100));
		this.labeldeath.setString((this.death-this.deathConsum));
		if(this.death>this.deathConsum+1&&!(this.boolmirror)){
			this.mirror.setTexture(this.cmirror);
			this.boolmirror=true;
		}else if(this.death<=this.deathConsum+1&&this.boolmirror){
			this.mirror.setTexture(this.cunmirror);
			this.boolmirror=false;
		}
		if(this.death>this.deathConsum+2&&!(this.boolclock)){
			this.clock.setTexture(this.cclock);
			this.boolclock=true;
		}else if(this.death<=this.deathConsum+2&&this.boolclock){
			this.clock.setTexture(this.cunclock);
			this.boolclock=false;
		}
	}
});
var GameScene = cc.Scene.extend({
	speed:0.56,
	onEnter:function () {
		this._super();
		var game = new image_layer();
		var bg=new BGLayer();
		var menu=new MenuLayer();
		menu.bind(game);
		this.addChild(menu,2);
		this.addChild(game,1);
		this.addChild(bg,0);
		game.init(4,this.speed,cc.size(320,325),cc.p(6, 127));
	}
});