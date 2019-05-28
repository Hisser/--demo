const WXAPI = require('../wxapi/main')

var pageNo=0;
//获取应用实例
var app = getApp()
Page({
  data: {

    userInfo: {},
    navList: {},
    adList: {},
    goodsList:{},
    scrollTop: 0,
    scrollHeight: 0 ,
    pageNo:0
  },

  
  onLoad: function (e) {
    // this.getNotice();
    // this.getNav();
    this.getHomeData();
    this.getTopGoodsList();


    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });  


  },

  bindDownLoad: function () {
    //  该方法绑定了页面滑动到底部的事件  
    this.getTopGoodsList();
  },
  scroll: function (event) {
    //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。 
    var that = this; 
    that.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
    //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新  
    page = 0;
    that.setData({
      list: [],
      scrollTop: 0
    });
    this.getTopGoodsList();
  },


  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.getTopGoodsList();
    setTimeout(function () {　　// 这里写刷新要调用的函数，比如：
      wx.showLoading({
        title: '加载中',
      })
    }, 500);
   
  },

  getHomeData:function(){
    var that= this;
    let data ={
      service:'homeList',
      version:'new'
    }
    WXAPI.getData(data).then(function (res) {
      if (res.code == 1) {
 
      
        that.setData({
          adList: res.data.mainAds,
          navList:res.data.categories,
          bannerAd:res.data.bannerAds,
          channels:res.data.channels,
          grids:res.data.grids,
          popAds:res.data.popAds

        });
      }
    })
  },


  getTopGoodsList:function(){
    var that = this;
    let data = {
      service: 'queryTBKChannelCoupons',
      pageNo: pageNo,
      pageSize: 20,
      channel: 'top',
      catId: 0,
    }
    WXAPI.getData(data).then(function (res) {
      if (res.code == 1) {
        if(res.totalPage>pageNo){
          pageNo++;
        }
        var list = that.data.list;
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }  
        that.setData({
        goodsList:list,
       
      })}
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    })
  },
  
})