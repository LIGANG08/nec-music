import React, { Component} from 'react';
import Comments from '../../components/Comments'
import * as api from '../../api'
import qs from 'query-string'
import {Spin} from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {parseLrc} from '../../util'

class Song extends Component {
	constructor(props) {
		super(props);
		this.state = {
			songDetail:null,
			commentData:null,
			lyric:null,
			showLrcMore:false
		}
		this.choosePage = (page,pageSize,pos) => {
			console.log(page-1)
			const id = qs.parse(this.props.location.search).id;
			api.getSongComment(id,page-1).then(res => {
				if(res.data.code == 200) {
					window.scrollTo.apply(null,pos)
					this.setState({
						commentData:res.data
					})
				}
			})	
		}
		this.toggleLrc = (e) => {
			this.setState(ps => {
				return {
					showLrcMore:!ps.showLrcMore
				}
			})
		}
	}
	componentDidMount() {
		const query = qs.parse(this.props.location.search)
		const id = query.id
		axios.all([api.getSongDetail(id),api.getSongComment(id),api.getLyric(id)])
		.then(res => {
			console.log(res)
			if(res[0].data.code == 200) {
				this.setState({
					songDetail:res[0].data.songs[0]
				})
			}
			if(res[1].data.code == 200) {
				this.setState({
					commentData:res[1].data
				})
			}
			if(res[2].data.code == 200) {
				if(!res[2].data.lrc) {
					return false
				}
				this.setState({
					lyric:parseLrc(res[2].data.lrc.lyric).map(i => i[1])
				})
			}
		})
	}
  render() {
  	const {songDetail,commentData,lyric,showLrcMore} = this.state
  	console.log(lyric)
  	let main = null
  	if(!songDetail || !commentData || !lyric) {
  		main =  <div style={{height:(document.body.clientHeight-105)+'px'}} className="loading"><Spin tip="Loading..." /></div>
  	}else{
  		main = <div className="g-mn4">
      		<div className="g-mn4c">
      			<div className="g-wrap6">
      				<div className="m-lycifo">
      					<div className="clearfix">
	      					<div className="cvrwrap f-cb f-pr">
	      						<div className="u-cover u-cover-6 f-fl">
	      							<img src={songDetail.al.picUrl} />
	      							<span className="msk"></span>
	      						</div>
	      						<div className="out s-fc3">
	      							<i className="u-icn u-icn-95 f-fl"></i>
	      							<a href="javascript:;" className="des s-fc7">生成外链播放器</a>
	      						</div>
	      					</div>
	      					<div className="cnt">
	      						<div className="cntc">
	      							<div className="hd clearfix">
	      								<i className="lab u-icn u-icn-37"></i>
	      								<div className="tit">
	      									<h2 className="f-ff2 f-brk">{songDetail.name}</h2>
	      									{songDetail.alia.length?<div className="subtit f-fs1 f-ff2">{songDetail.alia.join('/')}</div>:null}
	      								</div>
	      							</div>
	      							<p className="des s-fc4">
	      								歌手：
	      								{songDetail.ar.map((i,index) => 
	      								<span title={i.name} key={index}>
	      									<Link className="s-fc7" to={`/artist?id=${i.id}`}>{i.name}</Link>
	      								</span>
	      								)}
	      								
	      							</p>
	      							<p className="des s-fc4">
	      								所属专辑：
	      								<Link to={`/album?id=${songDetail.al.id}`} className="s-fc7">{songDetail.al.name}</Link>
	      							</p>
	      							<div className="m-info">
		      							<div className="btns clearfix">
		      								<a href="javascript:;" className="u-btn2 u-btn2-2 u-btni-addply f-fl">
		      									<i>
		      										<em className="ply"></em>播放
		      									</i>
		      								</a>
		      								<a href="" className="u-btni u-btni-add"></a>
		      								<a href="" className="u-btni u-btni-fav ">
		      									<i>收藏</i>
		      								</a>
		      								<a href="" className="u-btni u-btni-share">
		      									<i>分享</i>
		      								</a>
		      								<a href="" className="u-btni u-btni-dl ">
		      									<i>下载</i>
		      								</a>
		      								<a href="" className="u-btni u-btni-cmmt ">
		      									<i>({commentData.total})</i>
		      								</a>
		      							</div>
											</div>
											<div id="lyric-content" className="bd bd-open f-brk f-ib">
												{
													lyric.map((i,index) => 
														<span className={index>12 && !showLrcMore?'f-hide':null} key={index}>{i}<br /></span>
													)
												}
												<div className="crl">
													<a id="flag_ctrl" onClick={this.toggleLrc} href="javascript:void(0)" className="s-fc7">{showLrcMore?'收起':'展开'}<i className={showLrcMore?'u-icn u-icn-70':"u-icn u-icn-69"}></i>
													</a>
												</div>
											</div>
	      						</div>
	      					</div>
	      				</div>
	      				<div className="lrc-user">
	      					<p></p>
	      					<p className="s-fc3">
	      						<a className="f-tdu s-fc4">上传歌词</a> 
										  &nbsp;
	      						<a className="f-tdu s-fc4" href="/lyric/report?id=493283338">报错</a>
	      					</p>
	      				</div>
      				</div>
      				<Comments onChange={this.choosePage} data={this.state.commentData} />
      			</div>
      		</div>
      	</div>
  	}
    return (
      <div className="g-bd4 clearfix">
      	{main}
      	<div className="g-sd4">
      		<div className="g-wrap7">
      			<div className="m-sidead f-hide"></div>
      			<div className="m-multi">
      				<h3 className="u-hd3">
								<span className="f-fl">网易云音乐多端下载</span>
							</h3>
							<ul className="bg">
								<li>
									<a href="" className="ios"></a>
								</li>
								<li>
									<a href="" className="pc"></a>
								</li>
								<li>
									<a href="" className="aos"></a>
								</li>
							</ul>
							<p className="s-fc4">同步歌单，随时畅听320k好音乐</p>
      			</div>
      		</div>
      	</div>
      </div>
    );
  }
}


export default Song