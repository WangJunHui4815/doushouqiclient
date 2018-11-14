(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/sprite/common/userInfoCtrl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b8be810sGdH16alCNReC+SP', 'userInfoCtrl', __filename);
// sprite/common/userInfoCtrl.js

"use strict";

var Tools = require("Tools");

cc.Class({
    extends: cc.Component,

    properties: {
        userName: cc.Label,
        userCoin: cc.Label,
        userIcon: cc.Sprite,
        getReady: cc.Sprite,
        offline: cc.Sprite,
        banker: cc.Sprite,
        chatInfo: cc.Label,
        emoji: cc.Sprite,

        _userId: 0
    },
    showUserInfo: function showUserInfo(data) {
        this.setUserName(data.name);
        this.setUserCoin(data.score);
        this.isGetReady(data.ready);
        this.isOffline(data.online);
        this.isBanker(data.userid);
    },

    setUserName: function setUserName(name) {
        this.userName.string = name;
    },
    setUserCoin: function setUserCoin(coin) {
        this.userCoin.string = coin;
    },
    isGetReady: function isGetReady(isReady) {
        this.getReady.node.active = isReady;
    },
    isOffline: function isOffline(isOnline) {
        this.offline.node.active = !isOnline;
    },
    isBanker: function isBanker(userId) {
        this.banker.node.active = cc.vv.userMgr.getBankerId() == userId;
    },
    showChatInfo: function showChatInfo(str) {
        var callback = function callback() {
            this.chatInfo.node.active = false;
        };
        this.chatInfo.unschedule(callback);
        this.chatInfo.node.active = true;
        this.chatInfo.string = str;
        this.chatInfo.scheduleOnce(callback, 2);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.node.on("user_state", function (isReady) {
            cc.log("userinfoctrl userready");
            this.isGetReady(isReady);
        }.bind(this));

        this.node.on("show_chat_info", function (data) {
            cc.log("show_chat_info");
            cc.log(data);
            this.chatInfo.string = data;
            this.chatInfo.node.active = true;
        }.bind(this));

        this.node.on("show_emoji_info", function (data) {
            var _this = this;

            cc.log("show_emoji_info");
            cc.log(data);
            this.emoji.spriteFrame = cc.vv.emjioAtlas.getSpriteFrame(data + "0");
            this.emoji.node.active = true;
            Tools.createAnimationByName(this.emoji.node, data, 0.5, 10, function () {
                _this.emoji.node.active = false;
            });
        }.bind(this));
    },
    start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=userInfoCtrl.js.map
        