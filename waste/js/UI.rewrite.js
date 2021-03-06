+function(w,d){
	//compatibility
	w.requestAnimFrame = (function(){
	  return  w.requestAnimationFrame       ||
	          w.webkitRequestAnimationFrame ||
	          w.mozRequestAnimationFrame    ||
	          w.oRequestAnimationFrame      ||
	          w.msRequestAnimationFrame     ||
	          function(callback){
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
		curPage:'song_list',
		currentTime:0,
		tout:null,
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
				$('song_name',temp).innerHTML=newsong.name;
				$('singer',temp).innerHTML=newsong.singer||'未知歌手';
				$('to_play',temp).index=data.songs.indexOf(newsong);
				pnode.appendChild(temp);
			});
		}
		$('.to_song_list_button').onclick=function(){
			p.click();
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
		$('.songs').addEventListener('click',function(){
			if(e.target.className=='to_play button'){
				data.curIndex=e.target.index;
				play();
			}
			e.stopPropagation();
		},false);
		$('#play_pause').addEventListener('click',function(){
			if(this.className=='pause'){
				pause();
			}else if(this.className=='play'){
				resume();
			}
		},false);
		$('#pause').addEventListener('click',function(){
			if(this.innerHTML=='播放'){
				resume();
			}else if(this.className=='暂停'){
				pause();
			}
		},false);
		$('#player_order').addEventListener('click',function(){
			data.order=(data.order+1)%3;
			switch(data.order){
				case 0:
				this.className='single';
				break;
				case 1:
				this.className='inorder';
				break;
				case 2:
				this.className='random';
				break;
			}
		},false);
	}();
	function toArray(obj){
		return Array.prototype.slice.call(obj);
	}
	function play(){
		if(data.player.paused){
			resume();
		}
		data.player.src=data.songs[data.curIndex].url;
		$('.title',$('#player')).innerHTML=data.songs[data.curIndex].name;
		$('#lyc_box').innerHTML='<p>正在加载歌词...</p>';
		data.playing=true;
		if(!data.lycs[data.curIndex]){
			ajax('/search','get',g.processSearch(data.curIndex),('song_name='+data.songs[data.curIndex].name));
		}else{
			bindlyc($('#lyc_box'),data.lycs[data.curIndex]);
			data.p_words=$$('span',$('#lyc_box'));
			requestAnimFrame(moveLycBox.bind(data.p_words[0]));
			playlyc();
		}
	}
	function jumpTo(pageName){
		$('#'+data.curPage).style.display='none';
		$('#'+pageName).style.display='block';
		data.curPage=pageName;
	}
	function pause(){
		data.player.pause();
		$('play_pause').className='play';
		$('pause').innerHTML='播放';
	}
	function resume(){
		data.player.play();
		$('play_pause').className='pause';
		$('pause').innerHTML='暂停';
	}
	function bindlyc(targetDom,olyc){
		olyc.playTime=olyc.originalTime.reduce(function(pre,cur,index){
			pre.push((index<1)?cur:pre[index-1]+cur);
			return pre;
		},[]);
		targetDom.innerHTML='<span></span>'+olyc.originalLYC.split('\n').map(function(line){
			if(line===""){
				return '<p><span> </span></p>'
			}else{
				return '<p>'+line.split('').map(function(letter){
					return '<span>'+letter+'</span>';
				}).join('')+'</p>';
			}
		}).join('');
	}
	function playlyc(){
		pauselyc();
		var oindex=null;
		var clyc=data.lycs[data.curIndex];
		if(clyc!=null){
			for(var i in clyc.playTime){
				if(clyc.playTime[i]>data.currentTime){
					oindex={index:i,time:clyc.playTime[i]-data.currentTime};
					break;
				}
			}
			if(oindex){
				jumpTolyc(oindex.index);
				if(!data.player.paused){
					data.tout=setTimeout(next.bind(this,parseInt(oindex.index)+1),oindex.time);
				}
			}else{
				jumpTolyc(clyc.playTime.length);
			}
		}
	}
	function jumpTolyc(index){
		for(var i in data.p_words){
			if(parseInt(i)<parseInt(index)){
				data.p_words[i].className="read";
			}else if(i==index){
				data.p_words[i].className="ontime read";
				window.requestAnimFrame(moveLycBox.bind(data.p_words[i]));
			}else{
				data.p_words[i].className="";
			}
		}
	}
	function next(index){
		if(data.p_words[index]){
			data.p_words[index-1].className="read";
			data.p_words[index].className="read ontime";
			window.requestAnimFrame(moveLycBox.bind(data.p_words[index]));
			data.tout=setTimeout(next.bind(this,parseInt(index)+1),data.lycs[data.curIndex].originalTime[index]);
		}
	}
	function pauselyc(){
		data.currentTime=data.player.currentTime*1000;
		clearTimeout(data.tout);
	}
	function processSearch(index){
		return function(){
			var data=this.response;
			if(data&&data.status==0){
				if(data.lyrics.length>0&&dara.curPage.toLowerCase()=='player'){
					var dataString='id='+data.lyrics[0].id;
					ajax('/get','get',function(){
						var data=this.response;
						if(data&&data.status==0){
							data.lycs[index]=JSON.parse(data.lyric);
							bindlyc($('#lyc_box'),JSON.parse(data.lyric));
							data.p_words=$$('span',$('#lyc_box'));
							requestAnimFrame(moveLycBox.bind(data.p_words[0]));
							playlyc();
						}
					},dataString);
				}else if(data.lyrics.length==0&&data.curPage.toLowerCase()=='player'){
					$('#lyc_box').innerHTML='<p id="no_lyc">无法找到歌词</p>'
					window.requestAnimFrame(moveLycBox.bind($('#no_lyc')));
				}else if(data.curPage.toLowerCase()=='search'){
					var pnode=$('.search_results');
					Array.prototype.forEach.call($$('.song_box',pnode),function(sb){
						sb.parentNode.removeChild(sb);
					});
					var template=$('.song_box',$('#hidden'));
					data.lyrics.forEach(function(newsong){
						var temp=template.cloneNode(true);
						$('.song_name',temp).innerHTML=newsong.song_name;
						$('.singer',temp).innerHTML=newsong.singer_name||'未知歌手';
						$('.to_play',temp).onclick=chooseLyc.bind($('.to_play',temp),newsong.id);
						pnode.appendChild(temp);
					});
					
				}
			}
		}
	}
}(window,document)