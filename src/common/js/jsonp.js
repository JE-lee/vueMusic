/*
* @Author: lee
* @Date:   2018-01-14 15:58:47
* @Last Modified by:   JE_lee
* @Last Modified time: 2018-01-14 16:53:17
*/
import originJsonp from 'jsonp'

/**
 * @url  {[string]} jsonp的请求地址
 * @data  {[obj]} jsonp的参数列表对象
 * @option  {[obj]} jsonp的配置，一般用来指定param属性https://github.com/webmodules/jsonp
 * @return {promise} 返回要给promise对象
 */
export default function jsonp(url,data,option){
	url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
	return new Promise((resolve,reject)=>{
		originJsonp(url,option,(err,data)=>{
			if(!err){
				resolve(data);
			}else{
				reject(err);
			}
		})
	})
}
/**
 * [param description]
 * @param  {[type]} data [description]
 * @return {[string]}      [description]
 */
function param(data){
	let url ='';
	for(var k in data){
		let value = (data[k] !== undefined) ? data[k] : '';
		url += `&${k}=${encodeURIComponent(value)}`;
	}
	return url ? url.substring(1) : '';

}