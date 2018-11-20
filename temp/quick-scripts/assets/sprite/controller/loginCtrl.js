(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/sprite/controller/loginCtrl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bd8f5uU8a1EtapAZV56V/TM', 'loginCtrl', __filename);
// sprite/controller/loginCtrl.js

"use strict";

cc.vv = {};
cc.vv.global = require("Global");
cc.vv.http = require("HTTP");
cc.vv.net = require("Net");
cc.vv.configs = require("Configs");
cc.vv.emjioAtlas = null;
var UserMgr = require("UserMgr");
var GameNetMgr = require("GameNetMgr");

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        cc.vv.userMgr = new UserMgr();
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();
    },
    start: function start() {
        this.checkVersion();
    },


    checkVersion: function checkVersion() {
        var self = this;
        var onGetVersion = function onGetVersion(ret) {
            if (ret.version == null) {
                console.log("error.");
            } else {
                console.log("checkVersion ret");
                console.log(ret.hall);
                cc.vv.SI = ret;
            }
        };

        var xhr = null;
        var complete = false;
        var fnRequest = function fnRequest() {
            xhr = cc.vv.http.sendRequest("/get_serverinfo", null, function (ret) {
                xhr = null;
                complete = true;
                onGetVersion(ret);
            });
            setTimeout(fn, 5000);
        };

        var fn = function fn() {
            if (!complete) {
                if (xhr) {
                    xhr.abort();
                    setTimeout(function () {
                        fnRequest();
                    }, 5000);
                } else {
                    fnRequest();
                }
            }
        };
        fn();
    },

    onBtnQuickStartClicked: function onBtnQuickStartClicked() {
        cc.vv.userMgr.guestAuth();
    },

    onBtnWXClicked: function onBtnWXClicked() {
        console.log("onBtnWXClicked 微信登录接口");
        jsb.reflection.callStaticMethod("WXOptManager", "sendWXAuthReq:", "weixin");
    }

    // update (dt) {},
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=loginCtrl.js.map
        