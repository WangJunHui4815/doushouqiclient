(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/sprite/controller/gameCtrl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cb487SKl2VKU62C0vX3mOUT', 'gameCtrl', __filename);
// sprite/controller/gameCtrl.js

"use strict";

var userInfoCtrl = require("userInfoCtrl");
var GameEndCtrl = require("gameEndCtrl");
// const Tool = require("Tools")

cc.Class({
    extends: cc.Component,

    properties: {
        roomPanel: cc.Node,
        roomId: cc.Label,
        userPanel: cc.Node,
        getReadyBtn: cc.Button,
        gamePanel: cc.Node,
        endPanel: cc.Node,
        win: cc.Node,
        lose: cc.Node,
        chatPanel: cc.Node,
        userInfo: cc.Prefab,
        tips: cc.Label,
        _userInfoPos: [],
        _userInfo: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this._userInfoPos = [cc.v2(0, 245), cc.v2(-544, -245), cc.v2(-544, 0), cc.v2(-544, 245), cc.v2(-255, 245), cc.v2(255, 245), cc.v2(255, 245), cc.v2(544, 245), cc.v2(544, 245), cc.v2(544, 0), cc.v2(544, -245)];
        this.initHandlers();
        this.roomId.string = cc.js.formatStr("房间号: %s", cc.vv.gameNetMgr.roomId);
        this._userInfo = {};

        cc.loader.loadRes("chat/emoji_action_texture", cc.SpriteAtlas, function (err, atlas) {
            cc.log("chat");
            cc.vv.emjioAtlas = atlas;
        });
    },
    start: function start() {
        console.log("start");
    },
    onDestroy: function onDestroy() {
        cc.log("gameCtrl ondestroy");
        cc.loader.releaseRes("chat/emoji_action_texture");
    },


    // 注册监听事件
    initHandlers: function initHandlers() {
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        var self = this;

        this.node.on("user_state_changed", function (data) {
            var userId = data.userid;
            if (userId == cc.vv.userMgr.userId && data.ready) {
                self.getReadyBtn.node.active = false;
            }
            self._userInfo[userId].emit("user_state", data.ready);
        });

        this.node.on('game_begin', function (data) {
            // self.onGameBeign();
        });

        // 庄家开始藏牌
        this.node.on('can_hide_card', function () {
            console.log("can_hide_card");
            self.showGamePanel(1);
        });

        this.node.on('hide_card_success', function (data) {
            self.hideGamePanel();
        });

        // 闲家开始猜牌
        this.node.on('can_guess_card', function (data) {
            self.showGamePanel(0);
        });

        this.node.on('guess_card_result', function (data) {
            self.hideGamePanel();
        });

        this.node.on('new_user_comein', function (data) {
            self.newUserComein(data);
        });

        // game_end
        this.node.on('game_over', function (results) {
            self.showEndPanel(results);
        });

        // 聊天
        this.node.on('chat_push', function (data) {
            cc.log("gamectrl chat");
            cc.log(data);
            var userId = data.sender;
            self._userInfo[userId].emit("show_chat_info", data.content);
        });

        this.node.on('emoji_push', function (data) {
            cc.log("gamectrl emoji");
            cc.log(data);
            var userId = data.sender;
            self._userInfo[userId].emit("show_emoji_info", data.content);
        });
    },

    showGamePanel: function showGamePanel(index) {
        this.gamePanel.active = true;
        var str = index == 1 ? "庄家开始藏牌" : "闲家猜牌";
        this.tips.string = str;
        this.tips.node.active = true;
        this.tips.node.runAction(cc.sequence(cc.delayTime(1), cc.hide()));
    },

    hideGamePanel: function hideGamePanel() {
        this.gamePanel.active = false;
    },

    showEndPanel: function showEndPanel(results) {

        this.endPanel.active = true;

        this.endPanel.getComponent(GameEndCtrl).showResult(results);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var res = _step.value;

                if (res.userId == cc.vv.userMgr.userId) {
                    if (res.score > 0) {
                        this.showWinAnimction();
                    } else if (res.score < 0) {
                        this.showLoesAnimction();
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },

    showWinAnimction: function showWinAnimction() {
        var m_animSprite = cc.find("Canvas/endPanel/win");
        m_animSprite.active = true;
        var m_animation = m_animSprite.getComponent(cc.Animation);
        m_animation.play("win");
    },
    showLoesAnimction: function showLoesAnimction() {
        var m_animSprite = cc.find("Canvas/endPanel/lose");
        m_animSprite.active = true;
        var m_animation = m_animSprite.getComponent(cc.Animation);
        m_animation.play("lose");
    },

    showChatPanel: function showChatPanel() {
        this.chatPanel.active = true;
    },

    hideChatPanel: function hideChatPanel() {
        this.chatPanel.active = false;
    },

    getReady: function getReady() {
        cc.vv.net.send('ready');
    },

    onCardClicked: function onCardClicked(event, cardID) {
        console.log("onCardClicked");
        console.log(event);
        console.log(cardID);
        if (cc.vv.userMgr.getIsBanker()) {
            this.hideCard(cardID);
        } else {
            this.guessCard(cardID);
        }
    },

    hideCard: function hideCard(cardId) {
        console.log("hidecard");
        console.log(cardId);
        if (cardId && cardId > 0) {
            console.log("cangpai");
            cc.vv.net.send('cangpai', cardId);
        }
    },

    guessCard: function guessCard(cardId) {
        console.log("guessCard");
        console.log(cardId);
        if (cardId && cardId > 0) {
            console.log("caipai");
            cc.vv.net.send('caipai', { "p1": cardId, "p2": 10, "p3": 0 });
        }
    },

    initUserInfo: function initUserInfo(seatInfo) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = seatInfo[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var info = _step2.value;

                var userId = info.userid;
                if (userId > 0) {
                    var userInfo = cc.instantiate(this.userInfo);
                    var userInfoPos = this._userInfoPos[info.seatindex];
                    userInfo.parent = this.userPanel;
                    userInfo.setPosition(userInfoPos);
                    userInfo.getComponent(userInfoCtrl).showUserInfo(info);

                    this._userInfo[userId] = userInfo;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    },


    newUserComein: function newUserComein(data) {
        var userId = data.userid;
        if (userId > 0) {
            var userInfo = cc.instantiate(this.userInfo);
            var userInfoPos = this._userInfoPos[data.seatindex];
            userInfo.parent = this.userPanel;
            userInfo.setPosition(userInfoPos);
            userInfo.getComponent(userInfoCtrl).showUserInfo(data);
            this._userInfo[userId] = userInfo;

            cc.log("_userinfo");
            cc.log(this._userInfo);
        }
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
        //# sourceMappingURL=gameCtrl.js.map
        