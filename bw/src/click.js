var Click=cc.EventListener.create({
	event:cc.EventListener.TOUCH_ONE_BY_ONE,
	onTouchBegan: function (touch, event) { 
		return true;
	},
	onTouchEnded: function (touch, event) {     
		var target = event.getCurrentTarget();
		var locationInNode = target.convertToNodeSpace(touch.getLocation());   
		for(var i=0;i<target.vertical_num;i++){
			for (var j=0;j<target.horizontal_num;j++){
				var origin=target.matrix_left[i][j].getPosition();
				var r=cc.rect(origin.x, origin.y, target.size, target.size);
				if(cc.rectContainsPoint(r, locationInNode)){
					soundC.playEffect(res.clickmusic);
					target.cloth.setOpacity(100);
					target.cloth.runAction(cc.fadeOut(1.0));
				}
				var origin=target.matrix_right[i][j].getPosition();
				var r=cc.rect(origin.x, origin.y, target.size*0.75, target.size*0.75);
				if(target.matrix_right[i][j].value==0&&cc.rectContainsPoint(r, locationInNode)){
					soundC.playEffect(res.clickmusic);
					var scl=target.matrix_right[i][j].scale;
					target.matrix_right[i][j].setTexture(res.right);
					target.matrix_right[i][j].attr({scale:scl});
					target.matrix_right[i][j].value=1;
					return;
				}else if(target.matrix_right[i][j].value==1&&cc.rectContainsPoint(r, locationInNode)){
					soundC.playEffect(res.clickmusic);
					var scl=target.matrix_right[i][j].scale;
					target.matrix_right[i][j].setTexture(res.left);
					target.matrix_right[i][j].attr({scale:scl});
					target.matrix_right[i][j].value=0;
					return;
				}
			}
		}
	}
});
var tool=cc.EventListener.create({
	event:cc.EventListener.TOUCH_ONE_BY_ONE,
	onTouchBegan: function (touch, event) { 
		return true;
	},
	onTouchEnded: function (touch, event) {
		var target = event.getCurrentTarget();
		var locationInNode = target.convertToNodeSpace(touch.getLocation());
		var originm=target.mirror.getPosition();
		var rm=cc.rect(originm.x, originm.y, 49, 49);
		var originc=target.clock.getPosition();
		var rc=cc.rect(originc.x, originc.y, 49,49);
		var originp=target.pauseb.getPosition();
		var rp=cc.rect(originp.x, originp.y, 20,25);
		var origins=target.soundb.getPosition();
		var rs=cc.rect(origins.x, origins.y, 32,23);
		if(cc.rectContainsPoint(rm, locationInNode)){
			if(target.death>target.deathConsum+1){
				soundC.playEffect(res.clickmusic);
			target.g.mirror();
			target.deathConsum+=2;}
		}else if(cc.rectContainsPoint(rc, locationInNode)){
			if(target.death>target.deathConsum+2){
				soundC.playEffect(res.clickmusic);
				target.g.timeFrozen(5);
				target.deathConsum+=3;}
		}else if(cc.rectContainsPoint(rs, locationInNode)){
			if(target.soundon){
				soundC.playEffect(res.clickmusic);
				soundC.stopMusic();
				target.soundb.setTexture(res.sound);
				target.soundb.setScale(0.5);
				target.soundon=false;
			}else{
				soundC.playEffect(res.clickmusic);
				soundC.playMusic(res.bgmusic);
				target.soundb.setTexture(res.unsound);
				target.soundb.setScale(0.5);
				target.soundon=true;
			}
		}else if(cc.rectContainsPoint(rp, locationInNode)){
			if(target.paused){
				soundC.playEffect(res.clickmusic);
				target.g.bunpause();
				target.pauseb.setTexture(res.pause);
				target.pauseb.setScale(0.5);
				target.paused=false;
			}else{
				soundC.playEffect(res.clickmusic);
				target.g.bpause();
				target.pauseb.setTexture(res.resume);
				target.pauseb.setScale(0.5);
				target.paused=true;
			}
		}
		
	}
});
var guide1Click=cc.EventListener.create({
	event:cc.EventListener.TOUCH_ONE_BY_ONE,
	onTouchBegan: function (touch, event) { 
		return true;
	},
	onTouchEnded: function (touch, event) {
		var target = event.getCurrentTarget();
		soundC.playEffect(res.clickmusic);
		var temp=new guide2Scene();
		temp.speed=target.speed;
		cc.director.runScene(temp);
	}
});
var guide2Click=cc.EventListener.create({
	event:cc.EventListener.TOUCH_ONE_BY_ONE,
	onTouchBegan: function (touch, event) { 
		return true;
	},
	onTouchEnded: function (touch, event) {
		var target = event.getCurrentTarget();
		soundC.playEffect(res.clickmusic);
		var temp=new GameScene();
		temp.speed=target.speed;
		cc.director.runScene(temp);
	}
});
var soundC={
		playMusic:function(musicpath){
			cc.audioEngine.playMusic(musicpath, true);
		},
		stopMusic:function () {
			cc.audioEngine.stopMusic();
		},
		pauseMusic:function () {
			cc.audioEngine.pauseMusic();
		},
		resumeMusic:function () {
			cc.audioEngine.resumeMusic();
		},

		playEffect:function (effectpath) {
			cc.audioEngine.playEffect(effectpath);
		}
}
var shareClick=cc.EventListener.create({
	event:cc.EventListener.TOUCH_ONE_BY_ONE,
	onTouchBegan: function (touch, event) { 
		return true;
	},
	onTouchEnded: function (touch, event) {
		var target = event.getCurrentTarget();
		var locationInNode = target.convertToNodeSpace(touch.getLocation());
		var r=cc.rect(195,524, 125, 44);
		if(cc.rectContainsPoint(r, locationInNode)){
			yw.init({gameId: '10000206', width: 1000, height: 500});
			yw.openSocialShareMenu({"title":"撑死瘦子","imageUrl":res.dead,"text":"强迫症+吃货的专属游戏，快来玩吧！"}, function(a,b){});
		}
	}
});
