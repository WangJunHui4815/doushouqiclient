(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/sprite/controller/gamehallCtrl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '00ba4MIf3tG6pmh4/YwXt+a', 'gamehallCtrl', __filename);
// sprite/controller/gamehallCtrl.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        userName: cc.Label,
        userId: cc.Label,
        roomCardCount: cc.Label,
        diamondfield: cc.Node,
        createRoomPanel: cc.Node,
        joinRoomPanel: cc.Node,
        editBox: cc.EditBox,
        _difen: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.userName.string = cc.vv.userMgr.userName;
        this.userId.string = "ID:" + cc.vv.userMgr.userId;
        this.roomCardCount.string = "房卡:" + cc.vv.userMgr.gems;
    },
    start: function start() {},


    onBtnClicked: function onBtnClicked(event) {
        switch (event.target.name) {
            case "goldfieldBtn":
                // 金币场匹配 
                break;
            case "diamondBtn":
                this.diamondfield.active = true;
                break;
            case "createGame":
                this.createRoomPanel.active = true;
                break;
            case "joinGame":
                this.joinRoomPanel.active = true;
                break;
        }
    },

    createRoom: function createRoom() {
        var conf = {
            type: "guess",
            jushuxuanze: 1,
            difen: this._difen
        };
        cc.vv.userMgr.createRoom(conf, function (ret) {
            if (ret.errcode !== 0) {
                console.log("提示", "创建房间失败,错误码:" + ret.errcode);
            }
        }.bind(this));
    },

    hideCreateRoom: function hideCreateRoom() {
        this.createRoomPanel.active = false;
    },

    joinRoom: function joinRoom() {
        var roomId = this.editBox.string;
        cc.vv.userMgr.enterRoom(roomId, function (ret) {
            if (ret.errcode == 0) {
                this.node.active = false;
            } else {
                console.log("提示", "加入房间失败,错误码:" + ret.errcode);
            }
        }.bind(this));
    },

    hideJoinRoom: function hideJoinRoom() {
        this.joinRoomPanel.active = false;
    },

    setDifen: function setDifen(difen) {
        this._difen = difen;
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
        //# sourceMappingURL=gamehallCtrl.js.map
        