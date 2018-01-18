/*
* @Author: lee
* @Date:   2018-01-14 16:26:23
* @Last Modified by:   lee
* @Last Modified time: 2018-01-17 22:40:21
*/
import jsonp from 'common/js/jsonp'
import {commonParams,options,BASE_URL,BASE_URL_2} from 'api/config.js'
import axios from 'axios'
import vue from 'vue'

export function getRecommend(){
	const url ='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
	const data = Object.assign({},commonParams,{
		platform:'h5',
		uin:0,
		needNewCode:1
	});
	return jsonp(url,data,options)
		
}

export function getDissList(){
	const url = BASE_URL_2 + '/getDiscList';
	const data = Object.assign({},commonParams,{
		g_tk:1928093487,
		inCharset:'utf-8',
		outCharset:'utf-8',
		notice:0,
		format:'json',
		platform:'yqq',
		hostUin:0,
		sin:0,
		ein:29,
		sortId:5,
		needNewCode:0,
		categoryId:10000000,
		rnd:Math.random(),
		
	});
	 return axios.get(url,{
		params:data
	});
	 
}
