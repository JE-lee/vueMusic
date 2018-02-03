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

