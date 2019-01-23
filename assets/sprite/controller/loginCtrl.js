cc.vv = {}
cc.vv.global = require("Global");
cc.vv.http = require("HTTP");
cc.vv.net = require("Net");
cc.vv.configs = require("Configs");
cc.vv.emjioAtlas = null
const UserMgr = require("UserMgr");
const GameNetMgr = require("GameNetMgr");


cc.Class({
    extends: cc.Component,

    properties: {

        loginlabel:{
            default:null,
            type:cc.Label

        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.vv.userMgr = new UserMgr();
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();
       //初始化anysdk用户插件设置登陆监听
        if(cc.sys.isMobile&&cc.vv.onUserPlugin===undefined)
        {
            let agent=anysdk.agentManager;
            cc.vv.onUserPlugin=agent.getUserPlugin(); 
            cc.vv.onUserPlugin.setListener((code,msg)=>{
                cc.log("login code"+code+msg);
                switch(code)
                {
                    case anysdk.UserActionResultCode.kLoginSuccess:
                    this.loginlabel.string="登陆成功";
                    var id  =  cc.vv.onUserPlugin.getUserID();
                    cc.log("登陆成功"+id);
                    break;

                    case anysdk.UserActionResultCode.kLoginFail:
                    this.loginlabel.string="登陆失败";
                    cc.log("登陆失败");
                    break;
                    case anysdk.UserActionResultCode.kLoginCancel:
                    break;
                    case anysdk.UserActionResultCode.kLoginNetworkError:
                    break;

                }

            },this)
            //设置获取微信用户信息监听
            cc.vv.onUserPlugin.setListener((code,msg)=>{
                cc.log("login code"+code+msg);
                switch(code)
                {
                    case anysdk.UserActionResultCode.kGetUserInfoSuccess:
                    this.loginlabel.string="获取用户信息成功";
               
                    cc.log("获取用户信息成功"+msg);
                    break;
                    case anysdk.UserActionResultCode.kGetUserInfoFail:
                    this.loginlabel.string="获取用户信息失败";
                    cc.log("获取用户信息失败");
                    break;
                }

            },this)
        }
    },

    start() {
        this.checkVersion();
    },


    checkVersion: function () {
        var self = this;
        var onGetVersion = function (ret) {
            if (ret.version == null) {
                console.log("error.");
            }
            else {
                console.log("checkVersion ret")
                console.log(ret.hall)
                cc.vv.SI = ret;
            }
        };

        var xhr = null;
        var complete = false;
        var fnRequest = function () {
            xhr = cc.vv.http.sendRequest("/get_serverinfo", null, function (ret) {
                xhr = null;
                complete = true;
                onGetVersion(ret);
            });
            setTimeout(fn, 5000);
        }

        var fn = function () {
            if (!complete) {
                if (xhr) {
                    xhr.abort();
                    setTimeout(function () {
                        fnRequest();
                    }, 5000);
                }
                else {
                    fnRequest();
                }
            }
        };
        fn();
    },

    onBtnQuickStartClicked: function () {
        cc.vv.userMgr.guestAuth();
    },

    onBtnWxLoginClikced:function(data,customdata){
        console.log("customdata"+customdata);
        switch(customdata){
            case "login":
                if(cc.vv.onUserPlugin!==undefined)
                {
                    cc.vv.onUserPlugin.login();
                    cc.vv.onUserPlugin.getUserInfo();

                }
                cc.log("点击微信登陆");
            break;
            case "share":
            break;
            default:
            break;


        }

    },

//登陆按钮事件
    



});
