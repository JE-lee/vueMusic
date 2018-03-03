export function audioAutoplay(el,callback){
    let play = ()=>{
        el.play()
        typeof callback === 'function' && callback()
        document.removeEventListener('touchstart',play)
        
    }
    //IOS safari移动端浏览器
    document.addEventListener('touchstart',play)
    //部分安卓，IOS微信端
    document.addEventListener('YixinJSBridgeReady',()=>{
        el.play()
        typeof callback === 'function' && callback()
    })
}