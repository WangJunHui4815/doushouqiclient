
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

    onLoad() {
        this.userName.string = cc.vv.userMgr.userName
        this.userId.string = "ID:" + cc.vv.userMgr.userId
        this.roomCardCount.string = "房卡:" + cc.vv.userMgr.gems
    },

    start() {

    },

    onBtnClicked: function (event) {
        switch (event.target.name) {
            case "goldfieldBtn":
                // 金币场匹配 
                break
            case "diamondBtn":
                this.diamondfield.active = true
                break
            case "createGame":
                this.createRoomPanel.active = true
                break
            case "joinGame":
                this.joinRoomPanel.active = true
                break
        }
    },

    createRoom: function () {
        let conf = {
            type: "guess",
            jushuxuanze: 1,
            difen: this._difen
        }
        cc.vv.userMgr.createRoom(conf, function (ret) {
            if (ret.errcode !== 0) {
                console.log("提示", "创建房间失败,错误码:" + ret.errcode)
            }
        }.bind(this))
    },

    hideCreateRoom: function () {
        this.createRoomPanel.active = false
    },

    joinRoom: function () {
        let roomId = this.editBox.string
        cc.vv.userMgr.enterRoom(roomId, function (ret) {
            if (ret.errcode == 0) {
                this.node.active = false;
            }
            else {
                console.log("提示", "加入房间失败,错误码:" + ret.errcode)
            }
        }.bind(this))
    },

    hideJoinRoom: function () {
        this.joinRoomPanel.active = false
    },

    setDifen (difen) {
        this._difen = difen
    }

    // update (dt) {},
});
