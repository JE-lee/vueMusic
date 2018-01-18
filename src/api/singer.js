/*
* @Author: lee
* @Date:   2018-01-18 20:54:08
* @Last Modified by:   JE_lee
* @Last Modified time: 2018-01-18 21:33:37
*/
import jsonp from 'common/js/jsonp'
import {commonParams,options,BASE_URL,BASE_URL_2} from './config'

export function getSingerList(){
	const url =  'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
	const params = Object.assign({},commonParams,{
		channel: 'singer',
	    page: 'list',
	    key: 'all_all_all',
	    pagesize: 100,
	    pagenum: 1,
	    hostUin: 0,
	    needNewCode: 0,
	    platform: 'yqq'
	})
	return jsonp(url,params,options)
}