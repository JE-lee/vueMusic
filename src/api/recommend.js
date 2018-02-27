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
	const url =  '/getDiscList';
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


export function getSongList(disstid) {
	//const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
	const url = '/api/disc-song-list'
	const data = Object.assign({}, commonParams, {
		disstid,
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		platform: 'yqq',
		hostUin: 0,
		needNewCode: 0,
		format:'json',
	})
	//这个接口qq返回的有点问题。如果是jsonpCallback = '__jp1'，那么返回的函数名是jp1,
	//所以在这里显示地指定jsonp的回调函数为'songlistCallback'
	return jsonp(url, data, Object.assign({},options,{name:'songlistCallback'}))
}