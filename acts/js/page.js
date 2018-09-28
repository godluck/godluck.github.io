var pageList = [];
var popup;
var gModal = $('.g-modal')
var modal;

function initPage(ele) {
    TweenMax.fromTo(ele, .3, { opacity: 0 }, { opacity: 1, display: 'block', zIndex: 2 })
    pageList.push(ele);
}

function newPage(newPage,needBack) {
    var timeline = new TimelineMax();
    timeline.add(TweenMax.to(pageList[pageList.length - 1], .3, { x: '-20%', zIndex: 1, display: 'none' }), 0)
    timeline.add(TweenMax.fromTo(newPage, .3, { x: '100%', zIndex: 3 }, { x: '0%', zIndex: 2, display: 'block' }), 0)
    pageList.push(newPage)
    if (!newPage.hasClass('_slidepage') && needBack) {
        newPage.addClass('_slidepage')
        addSlideBack(newPage, pageList[pageList.length - 2])
    }
}

function newPopup(newPopup) {
    closePopup()
    TweenMax.fromTo(newPopup, .3, { y: '100%', zIndex: 101 }, { y: '0%', zIndex: 101, display: 'block',onComplete:function(){
        pageList[pageList.length-1].hide()
    }})
    popup = newPopup;
}

function closePage() {
    if (pageList.length > 1) {
        var timeline = new TimelineMax();
        timeline.add(TweenMax.to(pageList[pageList.length - 2], .3, { x: '0%', zIndex: 2, display: 'block' }), 0)
        timeline.add(TweenMax.to(pageList[pageList.length - 1], .3, { x: '100%', zIndex: 3, display: 'none' }), 0)
    }
    pageList.pop()
}

function closePopup() {
    if (popup) {
        pageList[pageList.length-1].show()
        TweenMax.to(popup, .3, { y: '100%', zIndex: 100, display: 'none' })
    }
}

function showModal(ele) {
    hideModal()
    var timeline = new TimelineMax();
    timeline.add(TweenMax.fromTo(ele, .3, { opacity: 0, zIndex: 200 }, { opacity: 1, zIndex: 200, display: 'block' }), 0)
    timeline.add(TweenMax.fromTo(gModal, .3, { opacity: 0, zIndex: 200 }, { opacity: 1, zIndex: 200, display: 'block' }), 0)
    modal = ele
}

function hideModal() {
    if(modal)TweenMax.set(modal, { display: 'none' })
    TweenMax.set(gModal, { display: 'none' })
}

function addSlideBack(ele, toEle) {
    var isSliding = false;
    var xanchor = 0;
    ele.on({
        touchstart: function(e) {
            var x = e.changedTouches ? e.changedTouches[0].pageX : e.originalEvent.changedTouches[0].pageX;
            if (x < document.documentElement.offsetWidth / 5) {
                isSliding = true;
                xanchor = x
            }
        },
        touchmove: function(e) {
            if (isSliding) {
                e.preventDefault();
                var x = e.changedTouches ? e.changedTouches[0].pageX : e.originalEvent.changedTouches[0].pageX;
                if (x > xanchor) {
                    TweenMax.set(ele, { x: x - xanchor })
                    TweenMax.set(toEle, { x: '-' + (20 - (x - xanchor) / document.documentElement.offsetWidth * 20) + '%', display: 'block' })
                }
            }
        },
        touchend: function(e) {
            if (isSliding) {
                var x = e.changedTouches ? e.changedTouches[0].pageX : e.originalEvent.changedTouches[0].pageX;
                if ((x-xanchor) < document.documentElement.offsetWidth / 2) {
                    TweenMax.to(ele, .3, { x: 0 })
                    TweenMax.to(toEle, .3, { x: '-20%', display: 'none' })
                } else {
                    closePage()
                }
            }
            isSliding = false;
        }
    })
}
module.exports = {
    initPage: initPage,
    newPage: newPage,
    newPopup: newPopup,
    closePage: closePage,
    closePopup: closePopup,
    showModal:showModal,
    hideModal:hideModal
}
