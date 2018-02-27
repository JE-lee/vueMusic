/* 防抖函数*/
export function antiShake(){
    let time = setTimeout(()=>{},0)
    return function(){
        let fun = arguments[0]
        let ms = arguments[1]
        clearTimeout(time)
        time = setTimeout(()=>{
            if(typeof fun === 'function'){
                fun()
            }
        },ms)
    }
}

/*洗牌一个数组*/
function _getRandom(min,max){
    return Math.floor(Math.random() * (max - min + 1))
}
export function shuffle(a){
    let array = a.slice()
    for (let i = 0;i<array.length;i++){
        let t = _getRandom(0,i)
        let a = array[t]
        array[t] = array[i]
        array[i] = a
    }
    return array
}

