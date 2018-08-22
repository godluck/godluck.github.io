class PageData{
	get dw(){
		return document.documentElement.clientWidth
	}
	get dh(){
		return document.documentElement.clientHeight
	}
	get dpr(){
		return window.devicePixelRatio || 2
	}

	get cw(){
		return this.dw * this.dpr
	}
	get ch(){
		return this.dh * this.dpr
	}
	inArea(x,y,area){
		return x > area.left && x < area.left + area.width && y > area.top && y < area.top + area.height 
	}
}

export default new PageData()