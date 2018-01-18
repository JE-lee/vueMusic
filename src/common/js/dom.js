/*
* @Author: lee
* @Date:   2018-01-14 17:38:22
* @Last Modified by:   lee
* @Last Modified time: 2018-01-14 18:18:46
*/
export function addClass(el,className){

	if(hasClass(el,className)) return ;
	let newClass = el.className.split(' ');
	newClass.push(className);

	el.className = newClass.join(' ');

}

export function hasClass(el,className){
	let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
	return reg.test(el.className)
}