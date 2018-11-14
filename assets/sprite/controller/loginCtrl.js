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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.vv.userMgr = new UserMgr();
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();
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

    // update (dt) {},
});
