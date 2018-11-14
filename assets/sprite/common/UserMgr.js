cc.Class({
    extends: cc.Component,
    properties: {
        account: null,
        userId: null,
        userName: null,
        lv: 0,
        exp: 0,
        coins: 0,
        gems: 0,
        sign: 0,
        ip: "",
        sex: 0,
        roomData: null,
        oldRoomId: null,
        new: false,
        bankerId: -1,
        isReady: false,
    },

    guestAuth: function () {
        let account = null
        // if (account == null) {
        //     account = cc.sys.localStorage.getItem("account");
        // }
        if (account == null) {
            this.new = true
            account = Date.now();
            cc.sys.localStorage.setItem("account", account);
        }
        cc.vv.http.sendRequest("/guest", { account: account }, this.onAuth);
    },

    onAuth: function (ret) {
        var self = cc.vv.userMgr;
        if (ret.errcode !== 0) {
            console.log(ret.errmsg);
        }
        else {
            self.account = ret.account;
            self.sign = ret.sign;
            cc.vv.http.url = "http://" + cc.vv.SI.hall;
            if (self.new) {
                self.createRole("Forothy");
            }
            else {
                self.login()
            }
        }
    },

    createRole: function (name) {
        var self = this;
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                self.login();
            }
        };

        var data = {
            account: this.account,
            sign: this.sign,
            name: name
        };
        cc.vv.http.sendRequest("/create_user", data, onCreate);
    },

    login: function () {
        var self = this;
        let onLogin = function (ret) {
            console.log("onLogin")
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                console.log(ret);
                console.log(ret.account)
                console.log(ret.name)
                self.account = ret.account;
                self.userId = ret.userid;
                self.userName = ret.name;
                self.lv = ret.lv;
                self.exp = ret.exp;
                self.coins = ret.coins;
                self.gems = ret.gems;
                self.roomData = ret.roomid;
                self.sex = ret.sex;
                self.ip = ret.ip;
                // 登陆成功
                cc.director.loadScene("gamehall")
            }
        };
        console.log(this.account)
        cc.vv.http.sendRequest("/login", { account: this.account, sign: this.sign }, onLogin);
    },

    createRoom: function (conf, callback)  {
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {
                if (callback && typeof(callback) == "function") {
                    callback(ret)
                }
            }
            else {
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    },

    enterRoom: function (roomId, callback) {
        let enterRoom = function (ret) {
            if (ret.errcode !== 0) {
                if (callback && typeof(callback) == "function") {
                    callback(ret);
                }
            }
            else {
                if (callback && typeof(callback) == "function") {
                    callback(ret);
                }
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };
        let data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            roomid: roomId
        };
        cc.vv.http.sendRequest("/enter_private_room", data, enterRoom);
    },

    getHistoryList: function (callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                console.log(ret.history);
                if (callback != null) {
                    callback(ret.history);
                }
            }
        };
        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_history_list", data, onGet);
    },

    getGamesOfRoom: function (uuid, callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                console.log(ret.data);
                callback(ret.data);
            }
        };
        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            uuid: uuid,
        };
        cc.vv.http.sendRequest("/get_games_of_room", data, onGet);
    },

    getDetailOfGame: function (uuid, index, callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                console.log(ret.data);
                callback(ret.data);
            }
        };
        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            uuid: uuid,
            index: index,
        };
        cc.vv.http.sendRequest("/get_detail_of_game", data, onGet);
    },

    getIsBanker () {
        return this.bankerId == this.userId
    },

    setBankerId (bankerId) {
        this.bankerId = bankerId
    },

    getBankerId () {
        return this.bankerId
    }
});
