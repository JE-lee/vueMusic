<template>
	<div class="singer">
		<listview :data="singerList"></listview>
	</div>
</template>
<script >
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Listview from 'base/listview/listview'
import Singer from 'common/js/singer'
export default {
	data(){
		return {
			singerList:[]
		}
	},
	created(){
			this._getSingerList()
	},
	methods:{
		_getSingerList(){
			getSingerList().then((res)=>{
				if(res.code === ERR_OK){
						this.singerList = this._normalizeSingerList(res.data.list)
				}
			})
		},
		_normalizeSingerList(list){

			let totalList = [
				{
						title:'热门',
						items:[]
				}
			]	
			//将100条歌手的书籍
			let normalCollect = {}
			list.forEach((item,index)=>{
				//将前面10条数据放到热门
				let singer = new Singer(item.Fsinger_mid,item.Fsinger_name)
				if(index <= 9){
					totalList[0].items.push(singer)
				}
				let findex = item.Findex.toUpperCase() || 'Z'
				normalCollect[findex] === undefined && (normalCollect[findex] = {items:[]})
				normalCollect[findex].items.push(singer)
			})
			//将normalCollect对象转换成数组
			let normalList = []
			for(let key in normalCollect){
				if(key.match(/[a-zA-Z]/)){
					let obj = {
						title:key,
						items:normalCollect[key].items
					}
					normalList.push(obj)
				}
				
			}
			//将normalList排序
			normalList.sort((a,b)=>{
				return a.title.charCodeAt(0) - b.title.charCodeAt(0)
			})
			return totalList.concat(normalList)
		}
	},
	components:{
		Listview
	}
		
}
</script>
<style type="text/stylus" scoped rel="stylesheet/stylus" lang="stylus">
	.singer
		position: fixed
		top: 88px
		bottom: 0
		width: 100%
</style>