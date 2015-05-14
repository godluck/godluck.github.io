+function(w,d){
	//compatibility
	w.requestAnimFrame = (function(){
	  return  w.requestAnimationFrame       ||
	          w.webkitRequestAnimationFrame ||
	          w.mozRequestAnimationFrame    ||
	          w.oRequestAnimationFrame      ||
	          w.msRequestAnimationFrame     ||
	          w(callback){
	            w.setTimeout(callback, 1000 / 60);
	          };
	})();
	w.createObjectURL=(function(){
		return w.createObjectURL||
		w.URL.createObjectURL||
		w.webkitURL.createObjectURL||
		(function(){
			console.error('Your browser can not load file from your hard disk!');
			return function(){
				return null;
			};
		})()
	})();
	//from  https://developer.mozilla.org/en-US/Add-ons/Code_snippets/QuerySelector
	w.$=function (selector, el) {
		if (!el) {el = document;}
			return el.querySelector(selector);
		}
	w.$$=function (selector, el) {
		if (!el) {el = document;}
		return el.querySelectorAll(selector);
		// Note: the returned object is a NodeList.
		// If you'd like to convert it to a Array for convenience, use this instead:
		// return Array.prototype.slice.call(el.querySelectorAll(selector));
	}
	function checkUserAgent(info){
		if(info.indexOf("iPod")!=-1 || info.indexOf("iPad")!=-1 || info.indexOf("iPhone")!=-1 || info.indexOf("Android")!=-1){
			if(info.indexOf('Firefox')!=-1){
				_$('file').accept='audio/wave';
			}
		}
	}(w.navigator.userAgent);
	//compatibility end

	// global data
	var data={
		songs:[],

		lycs:[],
		p_words:null,

		lycTime:[],
		lycPlayTime:[],
		e_words:null,
		lycFactory:null,

		player:$('#audiobox'),
		playing:false,
		order:0,
		curIndex:0,
	}
	//initial event listeners
	function init(){
		//add song
		var p=$('#file');
		var template=$('#hidden').getElementsByClassName('song_box')[0];
		var pnode=$('.songs');
		p.onchange=function(){
			var newsongs=Array.prototype.reduce.call(this.files,function(pre,cur){
				var tempsong={url:getObjectURL(cur),name:cur.name.substr(0,cur.name.lastIndexOf('.')),extName:cur.name.substr(cur.name.lastIndexOf('.'))};
				pre.push(tempsong);
				data.songs.push(tempsong);
				return pre;
			},[]);
			newsongs.forEach(function(newsong){
				var temp=template.cloneNode(true);
				temp.getElementsByClassName('song_name')[0].innerHTML=newsong.name;
				temp.getElementsByClassName('singer')[0].innerHTML=newsong.singer||'未知歌手';
				pnode.appendChild(temp);
			});
		}
		$('.to_song_list_button')[0].onclick=function(){
			p.click;
		}
		//player
		var page1=$('#player');
		var page2=$('#lyc_editer');
		data.player.addEventListener('playing',function(){
			var l=this.duration;
			w.requestAnimFrame(function(){
				$('.duration',page1).innerHTML=Math.floor(l/60)+':'+Math.floor(l % 60);
				$('.duration',page2).innerHTML=Math.floor(l/60)+':'+Math.floor(l % 60);
			})
		});
		data.player.addEventListener('timeupdate',function(){
			var t=this.currentTime;
			var ratio=t/this.duration;
			w.requestAnimFrame(function(){
				$('.currentTime',page1).innerHTML=Math.floor(t/60)+':'+Math.floor(t%60);
				$('.currentTime',page2).innerHTML=Math.floor(t/60)+':'+Math.floor(t%60);
				$('.progressbar',page1).style.width=ratio*100+'%';
				$('.progressbar',page2).style.width=ratio*100+'%';
			})
		});
		data.player.addEventListener('pause',function(){
			pauselyc();
		});
		data.player.addEventListener('ended',function(){
			if(data.playing){
				switch(data.order){
					case 0:
					play(data.curIndex);
					break;
					case 1:
					play(data.curIndex+1);
					break;
					case 2:
					play(Math.round(Math.random()*data.songs.length));
					break;
				}
			}
		});
		$('.progress_box',page1).addEventListener('click',function(e){
			if(e.target=this){
				data.player.currentTime=(e.offsetX||e.layerX)/this.offsetWidth*data.player.duration;
			}
			playlyc();
		},false);
		$('.progress_box',page2).addEventListener('click',function(e){
			if(e.target=this){
				data.player.currentTime=(e.offsetX||e.layerX)/this.offsetWidth*data.player.duration;
			}
			traceBackLyc();
		},false);
	}()
}(window,document)