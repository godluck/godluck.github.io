var image_layer = cc.Layer.extend({
	Winsize:null,
	size:null,
	horizontal_num:null,
	vertical_num:null,
	origin:null,
	verb:null,
	count:0,
	matrix_left:[],
	matrix_right:[],
	flag_left:[],
	flag_right:[],
	cloth:null,
	right:null,
	left:null,
	init:function(hor_num,verb,Winsize,origin){
		soundC.playMusic(res.bgmusic);
		this.right=cc.textureCache.addImage(res.right);
		this.left=cc.textureCache.addImage(res.left);
		this.Winsize=Winsize;
		this.count=0;
		this.verb=verb;
		this.horizontal_num=hor_num;
		this.size = this.Winsize.width/this.horizontal_num/2;
		this.vertical_num = Math.ceil(this.Winsize.height/this.size)+1;
		this.matrix_left=[];
		this.matrix_right=[];
		this.flag_left=[];
		this.flag_right=[];
		this.origin = origin;
		for (var i=0;i<this.vertical_num;i++) {
			this.matrix_left[i]=[];
			this.matrix_right[i]=[];
			this.flag_left[i]=[];
			this.flag_right[i]=[];   
			for (var j=0;j<this.horizontal_num;j++) {
				// —- 随机产生元素，这块到时候可以导表，就先写死了 左边都是同一种，右边是另一种 这块后面改
				var rnd = Math.random();
				if(rnd>0.5){
					this.matrix_left[i][j] = new cc.Sprite(this.left);
					var width=this.matrix_left[i][j]._getWidth();
					this.matrix_left[i][j].setVisible(true);
					this.matrix_left[i][j].attr({
						scale:this.size/width*0.75,
						anchorX:0,
						anchorY:0,
						x:this.origin.x + j*this.size,
						y:this.origin.y + (i+3)*this.size,
						value:0
					});
					this.addChild(this.matrix_left[i][j],(-1*i*this.vertical_num+j));
				}else{
					this.matrix_left[i][j] = new cc.Sprite(this.right);
					var width=this.matrix_left[i][j]._getWidth();
					this.matrix_left[i][j].setVisible(true);
					this.matrix_left[i][j].attr({
						scale:this.size/width*0.75,
						anchorX:0,
						anchorY:0,
						x:this.origin.x + j*this.size,
						y:this.origin.y + (i+3)*this.size,
						value:1
					});
					this.addChild(this.matrix_left[i][j],(-1*i*this.vertical_num+j));
				}
				rnd = Math.random();
				if(rnd>0.5){
					this.matrix_right[i][j] =new cc.Sprite(this.right);
					this.matrix_right[i][j].setVisible(true);
					this.matrix_right[i][j].attr({
						scale:this.size/width*0.75,
						anchorX:0,
						anchorY:0,
						x:this.origin.x + (this.horizontal_num+j)*this.size,
						y:this.origin.y + (i+3)*this.size,
						value:1
					});
					this.addChild(this.matrix_right[i][j],0);	
				}else{
					this.matrix_right[i][j] =new cc.Sprite(this.left);
					this.matrix_right[i][j].setVisible(true);
					this.matrix_right[i][j].attr({
						scale:this.size/width*0.75,
						anchorX:0,
						anchorY:0,
						x:this.origin.x + (this.horizontal_num+j)*this.size,
						y:this.origin.y + (i+3)*this.size,
						value:0
					});
					this.addChild(this.matrix_right[i][j],0);
				}
			}
		}
		this.cloth=new cc.Sprite(res.cloth);
		this.cloth.attr({
			anchorX:0,
			anchorY:0,
			x:this.origin.x-6,
			y:this.origin.y
		});
		this.cloth.setOpacity(0);
		this.mirrorFrame=new cc.Sprite(res.mirrorFrame,cc.rect(0,0,312,this.size*4));
		this.mirrorFrame.attr({
			anchorX:0,
			anchorY:0,
			x:this.origin.x-6,
			scaleX:320/312,
			y:this.origin.y
		});
		this.mirrorFrame.setOpacity(0);
		this.addChild(this.cloth,100);
		this.addChild(this.mirrorFrame,100);
		cc.eventManager.addListener(Click, this);
		this.scheduleUpdate();
		this.timeFrozen(2);
	},
	update:function (dt){
		var bottom;
		var end=false;
		for(var i=0;i<this.vertical_num;i++){
			for (var j=0;j<this.horizontal_num;j++){
				var posy = this.matrix_left[i][j].getPositionY();
				if ((posy + this.size+10 < this.origin.y)&&!end) {
					bottom = i;
					if(this.matrix_left[bottom][j].value != this.matrix_right[bottom][this.horizontal_num-j-1].value) {
						end=true;
						soundC.stopMusic();
						this.unscheduleUpdate();
						this.reorderChild(this.matrix_right[bottom][this.horizontal_num-j-1], 2);
						this.reorderChild(this.matrix_left[bottom][j],2);
						this.matrix_right[bottom][this.horizontal_num-j-1].runAction(cc.sequence(cc.moveTo(2,cc.p(165,200)),cc.scaleTo(1, 1, 1)));
						this.matrix_left[bottom][j].runAction(cc.sequence(cc.moveTo(2,cc.p(90,200)),cc.scaleTo(1, 1, 1)));
						var end=new startScene();
						end.kll=(this.count-(this.count%4))/4*100;
						end.death=(end.kll-(end.kll%1500))/1500;
						this.scheduleOnce(function(){cc.director.runScene(end);}, 4);
						break;
					}else{
						this.count += 3;
						posy=posy+this.size*this.vertical_num;
						var scl=this.matrix_left[i][j].scale;
						var lx=this.matrix_left[i][j].x;
						var ly=this.matrix_left[i][j].y;
						var rx=this.matrix_right[i][this.horizontal_num-j-1].x;
						var ry=this.matrix_right[i][this.horizontal_num-j-1].y;
						var r=Math.random();
						if(r>0.5){
							this.removeChild(this.matrix_left[i][j], true);
							this.matrix_left[i][j]=new cc.Sprite(this.left);
							this.matrix_left[i][j].attr({scale:scl,x:lx,y:(ly+this.vertical_num*this.size),anchorX:0,anchorY:0,value:0});
							this.addChild(this.matrix_left[i][j], 1);
						}else{
							this.removeChild(this.matrix_left[i][j], true);
							this.matrix_left[i][j]=new cc.Sprite(this.right);
							this.matrix_left[i][j].attr({scale:scl,x:lx,y:(ly+this.vertical_num*this.size),anchorX:0,anchorY:0,value:1});
							this.addChild(this.matrix_left[i][j], 1);
						}
						r=Math.random();
						if(r>0.5){
							this.removeChild(this.matrix_right[i][this.horizontal_num-j-1], true);
							this.matrix_right[i][this.horizontal_num-j-1]=new cc.Sprite(this.left);
							this.matrix_right[i][this.horizontal_num-j-1].attr({scale:scl,x:rx,y:(ry+this.vertical_num*this.size),anchorX:0,anchorY:0,value:0});
							this.addChild(this.matrix_right[i][this.horizontal_num-j-1], 1);
						}else{
							this.removeChild(this.matrix_right[i][this.horizontal_num-j-1], true);
							this.matrix_right[i][this.horizontal_num-j-1]=new cc.Sprite(this.right);
							this.matrix_right[i][this.horizontal_num-j-1].attr({scale:scl,x:rx,y:(ry+this.vertical_num*this.size),anchorX:0,anchorY:0,value:1});
							this.addChild(this.matrix_right[i][this.horizontal_num-j-1], 1);
						}
						this.levelUP();
					}
				}else{
					posy = posy - this.verb;
				}
				this.matrix_left[i][j].setPositionY(posy);
				this.matrix_right[i][j].setPositionY(posy);

			}
		}
	},
	levelUP:function(){
		var line=this.count/(this.horizontal_num*3);
		if(line%15==5&&this.verb<1.4){
			this.verb=this.verb+0.1;
			//console.log("5");
		}
		if(line%15==10&&this.verb<1.4){
			this.verb=this.verb+0.1;
			//cc.log("10");
		}
		if(line%15==14&&this.verb<1.4){
			this.verb=this.verb+0.1;
			//cc.log("14");
		}
		if(line%15==14&&this.verb<2&&this.verb>=1.4){
			this.verb=this.verb+0.1;
		}
	},
	timeFrozen:function(t){
		var v=this.verb;
		cc.log(v);
		this.verb=0;
		this.scheduleOnce(function(){
			this.verb=v;
		},t);
	},
	mirror:function(){
		var bottom=(this.size+3)*this.vertical_num;
		var bottomi=0;
		line=4;
		for(var i=0;i<this.vertical_num;i++){
			var posy = this.matrix_left[i][0].getPositionY();
			if(posy<bottom){
				bottom=posy;
				bottomi=i;
			}
		}
		var i=bottomi;
		for(var ai=0; ai<line;ai++){
			if(i>this.vertical_num-1){
				i=i-this.vertical_num;
			}
			for (var j=0;j<this.horizontal_num;j++){
				var scl=this.matrix_left[i][j].scale;
				var lx=this.matrix_left[i][j].x;
				var ly=this.matrix_left[i][j].y;
				if(this.matrix_right[i][this.horizontal_num-j-1].value==0) {
					this.removeChild(this.matrix_left[i][j], true);
					this.matrix_left[i][j]=new cc.Sprite(this.left);
					this.matrix_left[i][j].attr({scale:scl,x:lx,y:ly,anchorX:0,anchorY:0,value:0});
					this.addChild(this.matrix_left[i][j], 1);
				}else if(this.matrix_right[i][this.horizontal_num-j-1].value==1){
					this.removeChild(this.matrix_left[i][j], true);
					this.matrix_left[i][j]=new cc.Sprite(this.right);
					this.matrix_left[i][j].attr({scale:scl,x:lx,y:ly,anchorX:0,anchorY:0,value:1});
					this.addChild(this.matrix_left[i][j], 1);
				}
			}
			i+=1;
		}
		this.timeFrozen(1);
		this.mirrorFrame.attr({
			y:bottom
		});
		this.mirrorFrame.setOpacity(1000);
		this.mirrorFrame.runAction(cc.fadeOut(1.0));
	},
	bpause:function(){
		this.unscheduleUpdate();
		cc.eventManager.removeListener(Click);
		soundC.pauseMusic();
	},
	bunpause:function(){
		this.scheduleUpdate();
		cc.eventManager.addListener(Click,this);
		soundC.resumeMusic();
	}
});