(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/sprite/Net/GameNetMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3e6fdHhkX9FgLrgURywGavA', 'GameNetMgr', __filename);
// sprite/Net/GameNetMgr.js

"use strict";

var GameCtrl = require('gameCtrl');

cc.Class({
    extends: cc.Component,

    properties: {
        roomId: 0,
        maxNumOfGames: 0,
        numOfGames: 0,
        // seatIndex: -1,
        seats: null,
        gamestate: "",
        isOver: false,
        dissoveData: null,
        dataEventHandler: null
    },

    connectGameServer: function connectGameServer(data) {
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var onConnectOK = function onConnectOK() {
            console.log("onConnectOK");
            var sd = {
                token: data.token,
                roomid: data.roomid,
                time: data.time,
                sign: data.sign
            };
            cc.vv.net.send("login", sd);
        };

        var onConnectFailed = function onConnectFailed() {
            console.log("onConnectFailed");
        };

        cc.vv.net.connect(onConnectOK, onConnectFailed);
    },

    initHandlers: function initHandlers() {
        var self = this;
        cc.vv.net.addHandler("disconnect", function (data) {
            if (self.roomId == null) {
                cc.director.loadScene("hall");
            } else {
                if (self.isOver == false) {
                    cc.vv.userMgr.oldRoomId = self.roomId;
                    self.dispatchEvent("disconnect");
                } else {
                    self.roomId = null;
                }
            }
        });
        // 创建or进入房间
        cc.vv.net.addHandler("login_result", function (data) {
            console.log("login_result");
            console.log(data);
            if (data.errcode === 0) {
                var data = data.data;
                self.roomId = data.roomid;
                // self.maxNumOfGames = data.conf.maxGames;
                // self.numOfGames = data.numofgames;
                self.seats = data.seats;
                // self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
                self.isOver = false;
                cc.vv.userMgr.setBankerId(data.conf.banker);
                cc.log(data.conf.banker);
            } else {
                console.log(data.errmsg);
            }
        });

        // 创建or进入房间成功    
        cc.vv.net.addHandler("login_finished", function (data) {
            console.log("login_finished");
            cc.director.loadScene("guessgame", function () {
                // 初始化玩家信息
                cc.log("initUserinfo");
                cc.log(self.seats);
                cc.director.getScene().getChildByName("gameCtrl").getComponent(GameCtrl).initUserInfo(self.seats);
            });
        });

        // 解散房间
        cc.vv.net.addHandler("dispress_push", function (data) {
            self.roomId = 0;
            self.seats = null;
        });

        cc.vv.net.addHandler("dissolve_notice_push", function (data) {
            console.log("dissolve_notice_push");
            console.log(data);
            self.dissoveData = data;
            self.dispatchEvent("dissolve_notice", data);
        });

        cc.vv.net.addHandler("dissolve_cancel_push", function (data) {
            self.dissoveData = null;
            self.dispatchEvent("dissolve_cancel", data);
        });

        // 退出
        cc.vv.net.addHandler("exit_result", function (data) {
            self.roomId = 0;
            self.seats = null;
        });

        // 退出广播
        cc.vv.net.addHandler("exit_notify_push", function (data) {
            var userId = data;
            var s = self.getSeatByID(userId);
            if (s != null) {
                s.userid = 0;
                s.name = "";
                self.dispatchEvent("user_state_changed", s);
            }
        });

        // 新玩家进入
        cc.vv.net.addHandler("new_user_comes_push", function (data) {
            console.log("new_user_comes_push");
            cc.log(data);
            var seatIndex = data.seatindex;
            if (self.seats[seatIndex].userid > 0) {
                self.seats[seatIndex].online = true;
            } else {
                data.online = true;
                self.seats[seatIndex] = data;
            }
            self.dispatchEvent('new_user_comein', self.seats[seatIndex]);
        });

        // 玩家断线通知
        cc.vv.net.addHandler("user_state_push", function (data) {
            console.log("user_state_push");
            console.log(data);
            self.dispatchEvent('user_state_changed', { userid: data.userid, state: data.online });
        });

        // 玩家准备通知
        cc.vv.net.addHandler("user_ready_push", function (data) {
            console.log("user_ready_push");
            console.log(data);
            var userId = data.userid;
            // seat.ready = data.ready;
            self.dispatchEvent('user_state_changed', data);
        });

        // 房卡数量
        cc.vv.net.addHandler("game_num_push", function (data) {
            cc.log("game_num_push" + data);
            self.numOfGames = data;
            self.dispatchEvent('game_num', data);
        });

        // 游戏状态：begin
        cc.vv.net.addHandler("game_begin_push", function (data) {
            console.log('game_begin_push');
            self.gamestate = "begin";
            self.dispatchEvent('game_begin');
        });

        // 游戏状态：playing
        cc.vv.net.addHandler("game_playing_push", function (data) {
            console.log('game_playing_push');
            self.gamestate = "playing";
            self.dispatchEvent('game_playing');
        });

        // 通知庄家开始藏牌 data 1：庄家 -1:其他玩家
        cc.vv.net.addHandler("game_cangpai_push", function (data) {
            console.log('game_cangpai_push');
            self.canHideCard();
        });

        // 庄家藏牌，其他玩家开始猜牌
        cc.vv.net.addHandler("game_cangpai_notify_push", function (data) {
            console.log('game_cangpai_notify_push');
            console.log(data);
            self.hideCardEnd();
        });

        // 其他玩家猜牌
        cc.vv.net.addHandler("game_caipai_notify_push", function (data) {
            console.log("game_caipai_notify_push");
            console.log(data);
            self.dispatchEvent('guess_card_result', data);
        });

        // 对比结果，结算
        cc.vv.net.addHandler("game_over_push", function (data) {
            console.log('game_over_push');
            console.log(data);
            var results = data.results;
            self.dispatchEvent('game_over', results);
        });

        // 聊天相关
        cc.vv.net.addHandler("chat_push", function (data) {
            self.dispatchEvent("chat_push", data);
            cc.log(data);
        });

        cc.vv.net.addHandler("quick_chat_push", function (data) {
            // self.dispatchEvent("quick_chat_push",data);
        });

        cc.vv.net.addHandler("emoji_push", function (data) {
            self.dispatchEvent("emoji_push", data);
            cc.log(data);
        });
    },

    reset: function reset() {
        this.gamestate = "";
        for (var i = 0; i < this.seats.length; ++i) {
            this.seats[i].ready = false;
        }
    },

    clear: function clear() {
        this.dataEventHandler = null;
        if (this.isOver == null) {
            this.seats = null;
            this.roomId = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;
        }
    },

    getSeatByID: function getSeatByID(userId) {
        var seatIndex = this.getSeatIndexByID(userId);
        var seat = this.seats[seatIndex];
        return seat;
    },

    getSeatIndexByID: function getSeatIndexByID(userId) {
        for (var i = 0; i < this.seats.length; ++i) {
            var s = this.seats[i];
            if (s.userid == userId) {
                return i;
            }
        }
        return -1;
    },

    canHideCard: function canHideCard() {
        console.log("canHideCard");
        if (cc.vv.userMgr.getIsBanker()) {
            this.dispatchEvent('can_hide_card');
        }
    },

    hideCardEnd: function hideCardEnd() {
        console.log("hideCardEnd");
        if (!cc.vv.userMgr.getIsBanker()) {
            this.dispatchEvent('can_guess_card');
        } else {
            this.dispatchEvent('hide_card_success');
        }
    },

    // 发射事件
    dispatchEvent: function dispatchEvent(event, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(event, data);
        }
    }
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
        //# sourceMappingURL=GameNetMgr.js.map
        