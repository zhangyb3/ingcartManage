var netUtil=require("../utils/netUtil.js");
var config=require("../utils/config.js");
var user=require("../utils/user.js");


var actions = netUtil.action;



/*
{
 getListFromNetData:function(netData){
 return netData;
 },
 handleItemInfo:function(item){

 }
 }
 */
/**
 * data里的数据结构:tabDatas:[],里面都是bean
 * @param page
 * @param urlDetail
 * @param params
 * @param tabIndex  这个listview属于哪个tab,一旦确定,不会更改
 * @param emptyMsg
 * @param setNetparams
 *  setNetparams: function (params) {
        params.userId =getApp().globalData.uid;
    },

 // 如果list数据是netData里一个字段,则更改此处
 getListFromNetData:function(netData){
        return netData;
    },

 // 数据的一些处理并刷新数据
 handldItemInfo:function(item){

        if(info.type==1){
            info.typeText='微课';
            info.classname='detail';
        }else  if(info.type==2){
            info.typeText='课单';
            info.classname='album';
        }

    },
 *
 */

/**
 * 加载滑动列表
 */
function loadList(page,list_type,basic_url,urlDetail,page_size,setNetparams,getListFromNetData,handldItemInfo,emptyMsg,requestMethod)
{
    
    console.log('load ' + list_type + " list ");

    page.data.currentPageIndex = 1;
    page.data.currentAction = netUtil.action.request_none;
    page.data.basic_url = basic_url;
    page.data.urlDetail = urlDetail;
    page.data.defaultPageSize = page_size;

    page.data.netStateBean = new netUtil.netStateBean();
    if(requestMethod == 'GET'){
        page.data.requestMethod = 'GET';
    }
    else if (requestMethod == 'POST'){
        page.data.requestMethod = "POST";
    }
    else {
      page.data.requestMethod = requestMethod;
    }



    if(emptyMsg != undefined && emptyMsg !=null && emptyMsg.length>0){
        page.data.netStateBean.emptyMsg = emptyMsg;
    }

    if(list_type == 'index'){
        page.data.infos=[];//知列表
        page.data.search_knowledge_list = [];
        page.data.search_teacher_list = [];
        page.data.search_org_list = [];
    }
    if(list_type == 'teacher'){
        page.data.ask_teacher_list = [];//老师列表
    }
    if(list_type == 'question'){
        page.data.questionsForAnswer = [];//问题列表
    }
    
    

    page.onPullDownRefresh = function(){
      
        if(list_type == 'index'){
            page.data.infos=[];
        }
        
        if (list_type == 'history_record') {
          page.data.history_date = [];
          page.data.history_record = {};
        }

        else 
        {
            netUtil.requestSimpleList(page,list_type,1,netUtil.action.request_refresh);
        }
        
    };

    page.onReachBottom = function(){

      wx.showLoading({
        title: 'loading...',
        mask: true,
      })
      
        if (page.data.list_mode == 'nearest_orgs') {
          
          page.data.urlDetail = "/nearestOrgs";
          netUtil.requestSimpleList(page, 'nearest_orgs', page.data.currentPageIndex + 1, netUtil.action.request_loadmore);
        }

        if (list_type == 'history_record') {

          page.data.urlDetail = "/user/trip";
          netUtil.requestSimpleList(page, 'history_record', page.data.currentPageIndex + 1, netUtil.action.request_loadmore);
        }
        
        else
        {
            netUtil.requestSimpleList(page,list_type,page.data.currentPageIndex +1,netUtil.action.request_loadmore);
        }
        
    };

    page.onLoadMore = page.onReachBottom;
    page.onRefresh = page.onPullDownRefresh;
    // page.onRetry = function(){
    //     netUtil.requestSimpleList(page,list_type,1,netUtil.action.request_refresh);
    // };

    page.setNetparams = setNetparams;
    page.getListFromNetData = getListFromNetData;
    page.handldItemInfo = handldItemInfo;
    
    {
      netUtil.requestSimpleList(page, list_type, 1, netUtil.action.request_refresh);
      
    }
    
    
}




module.exports = {
    
    loadList : loadList,
}