const Tools = require("Tools")

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

        _userId:0,
    },
    showUserInfo: function (data) {
        this.setUserName(data.name)
        this.setUserCoin(data.score)
        this.isGetReady(data.ready)
        this.isOffline(data.online)
        this.isBanker(data.userid)
    },
    
    setUserName(name) {
        this.userName.string = name
    },

    setUserCoin(coin) {
        this.userCoin.string = coin
    },

    isGetReady(isReady) {
        this.getReady.node.active = isReady
    },

    isOffline(isOnline) {
        this.offline.node.active = !isOnline
    },

    isBanker(userId) {
        this.banker.node.active = cc.vv.userMgr.getBankerId() == userId
    },

    showChatInfo (str) {
        let callback = function () {
            this.chatInfo.node.active = false
        }
        this.chatInfo.unschedule(callback)
        this.chatInfo.node.active = true
        this.chatInfo.string = str
        this.chatInfo.scheduleOnce(callback, 2)
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on("user_state", function (isReady) {
            cc.log("userinfoctrl userready")
            this.isGetReady(isReady)
        }.bind(this))

        this.node.on("show_chat_info", function (data) {
            cc.log("show_chat_info")
            cc.log(data)
            this.chatInfo.string = data
            this.chatInfo.node.active = true
        }.bind(this))

        this.node.on("show_emoji_info", function (data) {
            cc.log("show_emoji_info")
            cc.log(data)
            this.emoji.spriteFrame = cc.vv.emjioAtlas.getSpriteFrame(data + "0")
            this.emoji.node.active = true
            Tools.createAnimationByName(this.emoji.node, data, 0.5, 10, () => {
                this.emoji.node.active = false
            })
        }.bind(this))
    },

    start() {

    },

    // update (dt) {},
});
