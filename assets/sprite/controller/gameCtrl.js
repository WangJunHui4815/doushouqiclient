const userInfoCtrl = require("userInfoCtrl")
const GameEndCtrl = require("gameEndCtrl")
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
        win:cc.Node,
        lose:cc.Node,
        chatPanel: cc.Node,
        userInfo: cc.Prefab,
        tips: cc.Label,
        _userInfoPos: [],
        _userInfo: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._userInfoPos = [cc.v2(0, 245),
                             cc.v2(-544, -245), cc.v2(-544,0), cc.v2(-544, 245), 
                             cc.v2(-255, 245), cc.v2(255, 245), cc.v2(255, 245), cc.v2(544, 245),
                             cc.v2(544, 245), cc.v2(544, 0), cc.v2(544, -245)]
        this.initHandlers()
        this.roomId.string = cc.js.formatStr("房间号: %s", cc.vv.gameNetMgr.roomId)
        this._userInfo = {}

        cc.loader.loadRes("chat/emoji_action_texture", cc.SpriteAtlas, function (err, atlas) {
            cc.log("chat")
            cc.vv.emjioAtlas = atlas
        })
    },

    start() {
        console.log("start")
    },

    onDestroy () {
        cc.log("gameCtrl ondestroy")
        cc.loader.releaseRes("chat/emoji_action_texture")
    },

    // 注册监听事件
    initHandlers: function () {
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        var self = this;

        this.node.on("user_state_changed", function (data) {
            let userId = data.userid
            if (userId == cc.vv.userMgr.userId && data.ready) {
                self.getReadyBtn.node.active = false
            }
            self._userInfo[userId].emit("user_state", data.ready)
        })

        this.node.on('game_begin', function (data) {
            // self.onGameBeign();
        });

        // 庄家开始藏牌
        this.node.on('can_hide_card', function () {
            console.log("can_hide_card")
            self.showGamePanel(1)
        });
        
        this.node.on('hide_card_success', function (data) {
            self.hideGamePanel()
        });

        // 闲家开始猜牌
        this.node.on('can_guess_card', function (data) {
            self.showGamePanel(0)
        });

        this.node.on('guess_card_result', function (data) {
            self.hideGamePanel()
        });

        this.node.on('new_user_comein', function (data) {
            self.newUserComein(data)
        });

        // game_end
        this.node.on('game_over', function (results) {
            self.showEndPanel(results)
        });

        // 聊天
        this.node.on('chat_push', function (data) {
            cc.log("gamectrl chat")
            cc.log(data)
            let userId = data.sender
            self._userInfo[userId].emit("show_chat_info", data.content)
        });

        this.node.on('emoji_push', function (data) {
            cc.log("gamectrl emoji")
            cc.log(data)
            let userId = data.sender
            self._userInfo[userId].emit("show_emoji_info", data.content)
        });
    },

    showGamePanel: function (index) {
        this.gamePanel.active = true
        let str = index == 1 ? "庄家开始藏牌" : "闲家猜牌"
        this.tips.string = str
        this.tips.node.active = true
        this.tips.node.runAction(cc.sequence(cc.delayTime(1), cc.hide()))
    },

    hideGamePanel: function () {
        this.gamePanel.active = false
    },

    showEndPanel: function (results) {
        console.log("show  end panel 1");
        this.endPanel.active = true;
        console.log("show  end panel 2");
        this.endPanel.getComponent(GameEndCtrl).showResult(results);
        this.showWinAnimction();
        console.log("show  end panel 3");
    },

    showWinAnimction: function (){
        var m_animSprite = cc.find("Canvas/endPanel/win");
        var m_animation = m_animSprite.getComponent(cc.Animation);
        m_animation.play(win);
    },
    showLoesAnimction: function (){
        var m_animSprite = cc.find("Canvas/endPanel/lose");
        var m_animation = m_animSprite.getComponent(cc.Animation);
        m_animation.play(lose);
    },

    showChatPanel: function() {
        this.chatPanel.active = true
    },
    
    hideChatPanel: function() {
        this.chatPanel.active = false
    },

    getReady: function () {
        cc.vv.net.send('ready');
    },

    onCardClicked: function (event, cardID) {
        console.log("onCardClicked")
        console.log(event)
        console.log(cardID)
        if (cc.vv.userMgr.getIsBanker()) {
            this.hideCard(cardID)
        }
        else {
            this.guessCard(cardID)
        }
    },

    hideCard: function (cardId) {
        console.log("hidecard")
        console.log(cardId)
        if (cardId && cardId > 0) {
            console.log("cangpai")
            cc.vv.net.send('cangpai', cardId);
        }
    },

    guessCard: function (cardId) {
        console.log("guessCard")
        console.log(cardId)
        if (cardId && cardId > 0) {
            console.log("caipai")
            cc.vv.net.send('caipai', {"p1": cardId, "p2": 10, "p3": 0});
        }
    },

    initUserInfo (seatInfo) {
        for (let info of seatInfo) {
            let userId = info.userid
            if (userId > 0) {
                let userInfo = cc.instantiate(this.userInfo)
                let userInfoPos = this._userInfoPos[info.seatindex]
                userInfo.parent = this.userPanel
                userInfo.setPosition(userInfoPos)
                userInfo.getComponent(userInfoCtrl).showUserInfo(info)

                this._userInfo[userId] = userInfo
            }
        }
    },

    newUserComein: function (data) {
        let userId = data.userid
        if (userId > 0) {
            let userInfo = cc.instantiate(this.userInfo)
            let userInfoPos = this._userInfoPos[data.seatindex]
            userInfo.parent = this.userPanel
            userInfo.setPosition(userInfoPos)
            userInfo.getComponent(userInfoCtrl).showUserInfo(data)
            this._userInfo[userId] = userInfo

            cc.log("_userinfo")
            cc.log(this._userInfo)
        }
    }

    // update (dt) {},
});
