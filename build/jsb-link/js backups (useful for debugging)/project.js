window.__require = function e(n, t, o) {
function c(i, a) {
if (!t[i]) {
if (!n[i]) {
var r = i.split("/");
r = r[r.length - 1];
if (!n[r]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(r, !0);
if (s) return s(r, !0);
throw new Error("Cannot find module '" + i + "'");
}
}
var u = t[i] = {
exports: {}
};
n[i][0].call(u.exports, function(e) {
return c(n[i][1][e] || e);
}, u, u.exports, e, n, t, o);
}
return t[i].exports;
}
for (var s = "function" == typeof __require && __require, i = 0; i < o.length; i++) c(o[i]);
return c;
}({
Configs: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "49421LGbXRCpIZt8PQR+Hs6", "Configs");
n.exports = {
emojiList: [ "happy", "angry", "smaile", "han", "zhiya", "shihua", "jiong", "sleep", "fennu", "yun", "lihai", "touxiang", "se", "huaixiao", "shaoxiang" ]
};
cc._RF.pop();
}, {} ],
GameNetMgr: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "3e6fdHhkX9FgLrgURywGavA", "GameNetMgr");
var o = e("gameCtrl");
cc.Class({
extends: cc.Component,
properties: {
roomId: 0,
maxNumOfGames: 0,
numOfGames: 0,
seats: null,
gamestate: "",
isOver: !1,
dissoveData: null,
dataEventHandler: null
},
connectGameServer: function(e) {
this.dissoveData = null;
cc.vv.net.ip = e.ip + ":" + e.port;
console.log(cc.vv.net.ip);
cc.vv.net.connect(function() {
console.log("onConnectOK");
var n = {
token: e.token,
roomid: e.roomid,
time: e.time,
sign: e.sign
};
cc.vv.net.send("login", n);
}, function() {
console.log("onConnectFailed");
});
},
initHandlers: function() {
var e = this;
cc.vv.net.addHandler("disconnect", function(n) {
if (null == e.roomId) cc.director.loadScene("hall"); else if (0 == e.isOver) {
cc.vv.userMgr.oldRoomId = e.roomId;
e.dispatchEvent("disconnect");
} else e.roomId = null;
});
cc.vv.net.addHandler("login_result", function(n) {
console.log("login_result");
console.log(n);
if (0 === n.errcode) {
n = n.data;
e.roomId = n.roomid;
e.seats = n.seats;
e.isOver = !1;
cc.vv.userMgr.setBankerId(n.conf.banker);
cc.log(n.conf.banker);
} else console.log(n.errmsg);
});
cc.vv.net.addHandler("login_finished", function(n) {
console.log("login_finished");
cc.director.loadScene("guessgame", function() {
cc.log("initUserinfo");
cc.log(e.seats);
cc.director.getScene().getChildByName("gameCtrl").getComponent(o).initUserInfo(e.seats);
});
});
cc.vv.net.addHandler("dispress_push", function(n) {
e.roomId = 0;
e.seats = null;
});
cc.vv.net.addHandler("dissolve_notice_push", function(n) {
console.log("dissolve_notice_push");
console.log(n);
e.dissoveData = n;
e.dispatchEvent("dissolve_notice", n);
});
cc.vv.net.addHandler("dissolve_cancel_push", function(n) {
e.dissoveData = null;
e.dispatchEvent("dissolve_cancel", n);
});
cc.vv.net.addHandler("exit_result", function(n) {
e.roomId = 0;
e.seats = null;
});
cc.vv.net.addHandler("exit_notify_push", function(n) {
var t = n, o = e.getSeatByID(t);
if (null != o) {
o.userid = 0;
o.name = "";
e.dispatchEvent("user_state_changed", o);
}
});
cc.vv.net.addHandler("new_user_comes_push", function(n) {
console.log("new_user_comes_push");
cc.log(n);
var t = n.seatindex;
if (e.seats[t].userid > 0) e.seats[t].online = !0; else {
n.online = !0;
e.seats[t] = n;
}
e.dispatchEvent("new_user_comein", e.seats[t]);
});
cc.vv.net.addHandler("user_state_push", function(n) {
console.log("user_state_push");
console.log(n);
e.dispatchEvent("user_state_changed", {
userid: n.userid,
state: n.online
});
});
cc.vv.net.addHandler("user_ready_push", function(n) {
console.log("user_ready_push");
console.log(n);
n.userid;
e.dispatchEvent("user_state_changed", n);
});
cc.vv.net.addHandler("game_num_push", function(n) {
cc.log("game_num_push" + n);
e.numOfGames = n;
e.dispatchEvent("game_num", n);
});
cc.vv.net.addHandler("game_begin_push", function(n) {
console.log("game_begin_push");
e.gamestate = "begin";
e.dispatchEvent("game_begin");
});
cc.vv.net.addHandler("game_playing_push", function(n) {
console.log("game_playing_push");
e.gamestate = "playing";
e.dispatchEvent("game_playing");
});
cc.vv.net.addHandler("game_cangpai_push", function(n) {
console.log("game_cangpai_push");
e.canHideCard();
});
cc.vv.net.addHandler("game_cangpai_notify_push", function(n) {
console.log("game_cangpai_notify_push");
console.log(n);
e.hideCardEnd();
});
cc.vv.net.addHandler("game_caipai_notify_push", function(n) {
console.log("game_caipai_notify_push");
console.log(n);
e.dispatchEvent("guess_card_result", n);
});
cc.vv.net.addHandler("game_over_push", function(n) {
console.log("game_over_push");
console.log(n);
var t = n.results;
e.dispatchEvent("game_over", t);
});
cc.vv.net.addHandler("chat_push", function(n) {
e.dispatchEvent("chat_push", n);
cc.log(n);
});
cc.vv.net.addHandler("quick_chat_push", function(e) {});
cc.vv.net.addHandler("emoji_push", function(n) {
e.dispatchEvent("emoji_push", n);
cc.log(n);
});
},
reset: function() {
this.gamestate = "";
for (var e = 0; e < this.seats.length; ++e) this.seats[e].ready = !1;
},
clear: function() {
this.dataEventHandler = null;
if (null == this.isOver) {
this.seats = null;
this.roomId = null;
this.maxNumOfGames = 0;
this.numOfGames = 0;
}
},
getSeatByID: function(e) {
var n = this.getSeatIndexByID(e);
return this.seats[n];
},
getSeatIndexByID: function(e) {
for (var n = 0; n < this.seats.length; ++n) {
if (this.seats[n].userid == e) return n;
}
return -1;
},
canHideCard: function() {
console.log("canHideCard");
cc.vv.userMgr.getIsBanker() && this.dispatchEvent("can_hide_card");
},
hideCardEnd: function() {
console.log("hideCardEnd");
cc.vv.userMgr.getIsBanker() ? this.dispatchEvent("hide_card_success") : this.dispatchEvent("can_guess_card");
},
dispatchEvent: function(e, n) {
this.dataEventHandler && this.dataEventHandler.emit(e, n);
}
});
cc._RF.pop();
}, {
gameCtrl: "gameCtrl"
} ],
Global: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "7b2f1UTqMVHW6g9jbEisJKg", "Global");
cc.Class({
extends: cc.Component,
statics: {
isstarted: !1,
netinited: !1,
userguid: 0,
nickname: "",
money: 0,
lv: 0,
roomId: 0
}
});
cc._RF.pop();
}, {} ],
HTTP: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "6c549ryxxxMYpNG+3OjQaXE", "HTTP");
var o = "http://101.200.36.236:9000";
cc.VERSION = 20161227;
var c = cc.Class({
extends: cc.Component,
statics: {
sessionId: 0,
userId: 0,
master_url: o,
url: o,
sendRequest: function(e, n, t, o) {
var s = cc.loader.getXMLHttpRequest();
s.timeout = 5e3;
var i = "?";
for (var a in n) {
"?" != i && (i += "&");
i += a + "=" + n[a];
}
null == o && (o = c.url);
var r = o + e + encodeURI(i);
console.log("RequestURL....:" + r);
s.open("GET", r, !0);
cc.sys.isNative && s.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
s.onreadystatechange = function() {
if (4 === s.readyState && s.status >= 200 && s.status < 300) {
console.log("http res(" + s.responseText.length + "):" + s.responseText);
try {
var e = JSON.parse(s.responseText);
null !== t && t(e);
} catch (e) {
console.log("err:" + e);
}
}
};
s.send();
return s;
}
}
});
cc._RF.pop();
}, {} ],
Net: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "4dd68nEFyxG1ZCl87sCnzo6", "Net");
var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
null == window.io && (window.io = e("socket-io"));
cc.Class({
extends: cc.Component,
statics: {
ip: "",
sio: null,
isPinging: !1,
fnDisconnect: null,
handlers: {},
connect: function(e, n) {
var t = this;
this.sio = window.io.connect(this.ip, {
reconnection: !1,
"force new connection": !0,
transports: [ "websocket", "polling" ]
});
this.sio.on("connect", function(n) {
t.sio.connected = !0;
e(n);
});
this.sio.on("disconnect", function(e) {
console.log("disconnect");
t.sio.connected = !1;
t.close();
});
this.sio.on("reconnect", function() {
console.log("reconnection");
});
this.sio.on("connect_failed", function() {
console.log("connect_failed");
n();
});
for (var o in this.handlers) {
var c = this.handlers[o];
"function" == typeof c && ("disconnect" == o ? this.fnDisconnect = c : this.sio.on(o, c));
}
this.startHearbeat();
},
startHearbeat: function() {
this.sio.on("game_pong", function() {
console.log("game_pong");
e.lastRecieveTime = Date.now();
});
this.lastRecieveTime = Date.now();
var e = this;
console.log(1);
if (!e.isPinging) {
console.log(2);
e.isPinging = !0;
setInterval(function() {
console.log(3);
if (e.sio) {
console.log(4);
Date.now() - e.lastRecieveTime > 1e4 ? e.close() : e.ping();
}
}, 5e3);
}
},
ping: function() {
this.send("game_ping");
},
send: function(e, n) {
if (this.sio.connected) {
null != n && "object" == ("undefined" == typeof n ? "undefined" : o(n)) && (n = JSON.stringify(n));
this.sio.emit(e, n);
}
},
close: function() {
console.log("close");
if (this.sio && this.sio.connected) {
this.sio.connected = !1;
this.sio.disconnect();
this.sio = null;
}
if (this.fnDisconnect) {
this.fnDisconnect();
this.fnDisconnect = null;
}
},
addHandler: function(e, n) {
if (this.handlers[e]) console.log("event:" + e + "' handler has been registered."); else {
var t = function(t) {
"disconnect" != e && "string" == typeof t && (t = JSON.parse(t));
n(t);
};
this.handlers[e] = t;
this.sio && this.sio.on(e, t);
}
}
}
});
cc._RF.pop();
}, {
"socket-io": "socket-io"
} ],
Tools: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "083abB7ynBLXYtq5JNAoLI7", "Tools");
n.exports = {
loadResDir: function(e, n) {
cc.loader.loadResDir(e, cc.SpriteFrame, function(e, t, o) {
var c = {};
if (e) cc.log("Tools.loadResDir：加载失败, 原因:" + e); else {
for (var s = 0; s < o.length; s++) {
var i = o[s].split("/");
c[i[i.length - 1]] = t[s];
}
n && "function" == typeof n && n(c);
}
});
},
createAnimationByName: function(e, n, t, o, c) {
var s = e.getComponent(cc.Animation) ? e.getComponent(cc.Animation) : e.addComponent(cc.Animation);
s.on("finished", function() {
c && c();
}, this);
for (var i = 0, a = [], r = 0; r < 99; r++) {
var l = n + r, u = cc.vv.emjioAtlas.getSpriteFrame(l);
if (!u) break;
i++;
a[r] = u;
}
var d = cc.AnimationClip.createWithSpriteFrames(a, i);
d.name = "clip";
s.addClip(d);
var h = s.play("clip");
h.speed = t || 6;
h.repeatCount = 99 == o ? Infinity : o;
}
};
cc._RF.pop();
}, {} ],
UserMgr: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "9c030hrvktGY5ZVmYfMtbp9", "UserMgr");
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
new: !1,
bankerId: -1,
isReady: !1
},
guestAuth: function() {
var e = null;
if (null == e) {
this.new = !0;
e = Date.now();
cc.sys.localStorage.setItem("account", e);
}
cc.vv.http.sendRequest("/guest", {
account: e
}, this.onAuth);
},
onAuth: function(e) {
var n = cc.vv.userMgr;
if (0 !== e.errcode) console.log(e.errmsg); else {
n.account = e.account;
n.sign = e.sign;
cc.vv.http.url = "http://" + cc.vv.SI.hall;
n.new ? n.createRole("Forothy") : n.login();
}
},
createRole: function(e) {
var n = this, t = {
account: this.account,
sign: this.sign,
name: e
};
cc.vv.http.sendRequest("/create_user", t, function(e) {
0 !== e.errcode ? console.log(e.errmsg) : n.login();
});
},
login: function() {
var e = this;
console.log(this.account);
cc.vv.http.sendRequest("/login", {
account: this.account,
sign: this.sign
}, function(n) {
console.log("onLogin");
if (0 !== n.errcode) console.log(n.errmsg); else {
console.log(n);
console.log(n.account);
console.log(n.name);
e.account = n.account;
e.userId = n.userid;
e.userName = n.name;
e.lv = n.lv;
e.exp = n.exp;
e.coins = n.coins;
e.gems = n.gems;
e.roomData = n.roomid;
e.sex = n.sex;
e.ip = n.ip;
cc.director.loadScene("gamehall");
}
});
},
createRoom: function(e, n) {
var t = {
account: cc.vv.userMgr.account,
sign: cc.vv.userMgr.sign,
conf: JSON.stringify(e)
};
cc.vv.http.sendRequest("/create_private_room", t, function(e) {
0 !== e.errcode ? n && "function" == typeof n && n(e) : cc.vv.gameNetMgr.connectGameServer(e);
});
},
enterRoom: function(e, n) {
var t = function(e) {
if (0 !== e.errcode) n && "function" == typeof n && n(e); else {
n && "function" == typeof n && n(e);
cc.vv.gameNetMgr.connectGameServer(e);
}
}, o = {
account: cc.vv.userMgr.account,
sign: cc.vv.userMgr.sign,
roomid: e
};
cc.vv.http.sendRequest("/enter_private_room", o, t);
},
getHistoryList: function(e) {
var n = {
account: cc.vv.userMgr.account,
sign: cc.vv.userMgr.sign
};
cc.vv.http.sendRequest("/get_history_list", n, function(n) {
if (0 !== n.errcode) console.log(n.errmsg); else {
console.log(n.history);
null != e && e(n.history);
}
});
},
getGamesOfRoom: function(e, n) {
var t = {
account: cc.vv.userMgr.account,
sign: cc.vv.userMgr.sign,
uuid: e
};
cc.vv.http.sendRequest("/get_games_of_room", t, function(e) {
if (0 !== e.errcode) console.log(e.errmsg); else {
console.log(e.data);
n(e.data);
}
});
},
getDetailOfGame: function(e, n, t) {
var o = {
account: cc.vv.userMgr.account,
sign: cc.vv.userMgr.sign,
uuid: e,
index: n
};
cc.vv.http.sendRequest("/get_detail_of_game", o, function(e) {
if (0 !== e.errcode) console.log(e.errmsg); else {
console.log(e.data);
t(e.data);
}
});
},
getIsBanker: function() {
return this.bankerId == this.userId;
},
setBankerId: function(e) {
this.bankerId = e;
},
getBankerId: function() {
return this.bankerId;
}
});
cc._RF.pop();
}, {} ],
chat: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "d172anL6a9KEbgA0KPHEXJs", "chat");
var o = e("emojiCtrl");
cc.Class({
extends: cc.Component,
properties: {
input: cc.EditBox,
emojiPanel: cc.Node,
emojiItem: cc.Prefab
},
onLoad: function() {
var e = cc.vv.configs.emojiList, n = !0, t = !1, c = void 0;
try {
for (var s, i = e[Symbol.iterator](); !(n = (s = i.next()).done); n = !0) {
var a = s.value, r = cc.instantiate(this.emojiItem);
r.parent = this.emojiPanel;
r.getComponent(o).setEmojiInfo(a);
}
} catch (e) {
t = !0;
c = e;
} finally {
try {
!n && i.return && i.return();
} finally {
if (t) throw c;
}
}
},
start: function() {},
sendMessage: function() {
if (this.input.string.length > 0) {
cc.log("chat");
cc.log(this.input.string);
cc.vv.net.send("chat", this.input.string);
this.input.string = "";
}
},
closeChatPanel: function() {
this.node.active = !1;
}
});
cc._RF.pop();
}, {
emojiCtrl: "emojiCtrl"
} ],
createRoom: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "29100DakllNv43tkqiaPZGT", "createRoom");
var o = e("gamehallCtrl");
cc.Class({
extends: cc.Component,
properties: {
gamehallCtrl: o
},
start: function() {},
onToggleChecked: function(e, n) {
this.gamehallCtrl.setDifen(n);
}
});
cc._RF.pop();
}, {
gamehallCtrl: "gamehallCtrl"
} ],
emojiCtrl: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "a2862gK1rNAQKCW/+I7fA2x", "emojiCtrl");
cc.Class({
extends: cc.Component,
properties: {
_info: ""
},
start: function() {},
setEmojiInfo: function(e) {
cc.log("emjio");
this._info = e;
this.node.getComponent(cc.Sprite).spriteFrame = cc.vv.emjioAtlas.getSpriteFrame(e + "0");
},
sendEmoji: function() {
cc.vv.net.send("emoji", this._info);
}
});
cc._RF.pop();
}, {} ],
gameCtrl: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "cb487SKl2VKU62C0vX3mOUT", "gameCtrl");
var o = e("userInfoCtrl"), c = e("gameEndCtrl");
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
onLoad: function() {
this._userInfoPos = [ cc.v2(0, 245), cc.v2(-544, -245), cc.v2(-544, 0), cc.v2(-544, 245), cc.v2(-255, 245), cc.v2(255, 245), cc.v2(255, 245), cc.v2(544, 245), cc.v2(544, 245), cc.v2(544, 0), cc.v2(544, -245) ];
this.initHandlers();
this.roomId.string = cc.js.formatStr("房间号: %s", cc.vv.gameNetMgr.roomId);
this._userInfo = {};
cc.loader.loadRes("chat/emoji_action_texture", cc.SpriteAtlas, function(e, n) {
cc.log("chat");
cc.vv.emjioAtlas = n;
});
},
start: function() {
console.log("start");
},
onDestroy: function() {
cc.log("gameCtrl ondestroy");
cc.loader.releaseRes("chat/emoji_action_texture");
},
initHandlers: function() {
cc.vv.gameNetMgr.dataEventHandler = this.node;
var e = this;
this.node.on("user_state_changed", function(n) {
var t = n.userid;
t == cc.vv.userMgr.userId && n.ready && (e.getReadyBtn.node.active = !1);
e._userInfo[t].emit("user_state", n.ready);
});
this.node.on("game_begin", function(e) {});
this.node.on("can_hide_card", function() {
console.log("can_hide_card");
e.showGamePanel(1);
});
this.node.on("hide_card_success", function(n) {
e.hideGamePanel();
});
this.node.on("can_guess_card", function(n) {
e.showGamePanel(0);
});
this.node.on("guess_card_result", function(n) {
e.hideGamePanel();
});
this.node.on("new_user_comein", function(n) {
e.newUserComein(n);
});
this.node.on("game_over", function(n) {
e.showEndPanel(n);
});
this.node.on("chat_push", function(n) {
cc.log("gamectrl chat");
cc.log(n);
var t = n.sender;
e._userInfo[t].emit("show_chat_info", n.content);
});
this.node.on("emoji_push", function(n) {
cc.log("gamectrl emoji");
cc.log(n);
var t = n.sender;
e._userInfo[t].emit("show_emoji_info", n.content);
});
},
showGamePanel: function(e) {
this.gamePanel.active = !0;
var n = 1 == e ? "庄家开始藏牌" : "闲家猜牌";
this.tips.string = n;
this.tips.node.active = !0;
this.tips.node.runAction(cc.sequence(cc.delayTime(1), cc.hide()));
},
hideGamePanel: function() {
this.gamePanel.active = !1;
},
showEndPanel: function(e) {
this.endPanel.active = !0;
this.endPanel.getComponent(c).showResult(e);
var n = !0, t = !1, o = void 0;
try {
for (var s, i = e[Symbol.iterator](); !(n = (s = i.next()).done); n = !0) {
var a = s.value;
a.userId == cc.vv.userMgr.userId && (a.score > 0 ? this.showWinAnimction() : a.score < 0 && this.showLoesAnimction());
}
} catch (e) {
t = !0;
o = e;
} finally {
try {
!n && i.return && i.return();
} finally {
if (t) throw o;
}
}
},
showWinAnimction: function() {
var e = cc.find("Canvas/endPanel/win");
e.active = !0;
e.getComponent(cc.Animation).play("win");
},
showLoesAnimction: function() {
var e = cc.find("Canvas/endPanel/lose");
e.active = !0;
e.getComponent(cc.Animation).play("lose");
},
showChatPanel: function() {
this.chatPanel.active = !0;
},
hideChatPanel: function() {
this.chatPanel.active = !1;
},
getReady: function() {
cc.vv.net.send("ready");
},
onCardClicked: function(e, n) {
console.log("onCardClicked");
console.log(e);
console.log(n);
cc.vv.userMgr.getIsBanker() ? this.hideCard(n) : this.guessCard(n);
},
hideCard: function(e) {
console.log("hidecard");
console.log(e);
if (e && e > 0) {
console.log("cangpai");
cc.vv.net.send("cangpai", e);
}
},
guessCard: function(e) {
console.log("guessCard");
console.log(e);
if (e && e > 0) {
console.log("caipai");
cc.vv.net.send("caipai", {
p1: e,
p2: 10,
p3: 0
});
}
},
initUserInfo: function(e) {
var n = !0, t = !1, c = void 0;
try {
for (var s, i = e[Symbol.iterator](); !(n = (s = i.next()).done); n = !0) {
var a = s.value, r = a.userid;
if (r > 0) {
var l = cc.instantiate(this.userInfo), u = this._userInfoPos[a.seatindex];
l.parent = this.userPanel;
l.setPosition(u);
l.getComponent(o).showUserInfo(a);
this._userInfo[r] = l;
}
}
} catch (e) {
t = !0;
c = e;
} finally {
try {
!n && i.return && i.return();
} finally {
if (t) throw c;
}
}
},
newUserComein: function(e) {
var n = e.userid;
if (n > 0) {
var t = cc.instantiate(this.userInfo), c = this._userInfoPos[e.seatindex];
t.parent = this.userPanel;
t.setPosition(c);
t.getComponent(o).showUserInfo(e);
this._userInfo[n] = t;
cc.log("_userinfo");
cc.log(this._userInfo);
}
}
});
cc._RF.pop();
}, {
gameEndCtrl: "gameEndCtrl",
userInfoCtrl: "userInfoCtrl"
} ],
gameEndCtrl: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "ab9e99h9GBEB4e7LKKGZ7cI", "gameEndCtrl");
cc.Class({
extends: cc.Component,
properties: {
endInfoPanel: cc.Node
},
start: function() {},
restart: function() {
cc.vv.net.send("ready");
this.node.active = !1;
},
showResult: function(e) {
cc.log("gameendctrl");
cc.log(e);
var n = !0, t = !1, o = void 0;
try {
for (var c, s = e[Symbol.iterator](); !(n = (c = s.next()).done); n = !0) {
var i = c.value, a = new cc.Node(), r = a.addComponent(cc.Label);
if (i.userId > 0) {
r.string = cc.js.formatStr("玩家%s 得分%s", i.userId, i.score);
a.parent = this.endInfoPanel;
}
}
} catch (e) {
t = !0;
o = e;
} finally {
try {
!n && s.return && s.return();
} finally {
if (t) throw o;
}
}
}
});
cc._RF.pop();
}, {} ],
gamehallCtrl: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "00ba4MIf3tG6pmh4/YwXt+a", "gamehallCtrl");
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
onLoad: function() {
this.userName.string = cc.vv.userMgr.userName;
this.userId.string = "ID:" + cc.vv.userMgr.userId;
this.roomCardCount.string = "房卡:" + cc.vv.userMgr.gems;
},
start: function() {},
onBtnClicked: function(e) {
switch (e.target.name) {
case "goldfieldBtn":
break;

case "diamondBtn":
this.diamondfield.active = !0;
break;

case "createGame":
this.createRoomPanel.active = !0;
break;

case "joinGame":
this.joinRoomPanel.active = !0;
}
},
createRoom: function() {
var e = {
type: "guess",
jushuxuanze: 1,
difen: this._difen
};
cc.vv.userMgr.createRoom(e, function(e) {
0 !== e.errcode && console.log("提示", "创建房间失败,错误码:" + e.errcode);
}.bind(this));
},
hideCreateRoom: function() {
this.createRoomPanel.active = !1;
},
joinRoom: function() {
var e = this.editBox.string;
cc.vv.userMgr.enterRoom(e, function(e) {
0 == e.errcode ? this.node.active = !1 : console.log("提示", "加入房间失败,错误码:" + e.errcode);
}.bind(this));
},
hideJoinRoom: function() {
this.joinRoomPanel.active = !1;
},
setDifen: function(e) {
this._difen = e;
}
});
cc._RF.pop();
}, {} ],
loginCtrl: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "bd8f5uU8a1EtapAZV56V/TM", "loginCtrl");
cc.vv = {};
cc.vv.global = e("Global");
cc.vv.http = e("HTTP");
cc.vv.net = e("Net");
cc.vv.configs = e("Configs");
cc.vv.emjioAtlas = null;
var o = e("UserMgr"), c = e("GameNetMgr");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
cc.vv.userMgr = new o();
cc.vv.gameNetMgr = new c();
cc.vv.gameNetMgr.initHandlers();
},
start: function() {
this.checkVersion();
},
checkVersion: function() {
var e = null, n = !1, t = function() {
e = cc.vv.http.sendRequest("/get_serverinfo", null, function(t) {
e = null;
n = !0;
(function(e) {
if (null == e.version) console.log("error."); else {
console.log("checkVersion ret");
console.log(e.hall);
cc.vv.SI = e;
}
})(t);
});
setTimeout(o, 5e3);
}, o = function() {
if (!n) if (e) {
e.abort();
setTimeout(function() {
t();
}, 5e3);
} else t();
};
o();
},
onBtnQuickStartClicked: function() {
cc.vv.userMgr.guestAuth();
},
onBtnWXClicked: function() {
console.log("onBtnWXClicked 微信登录接口");
jsb.reflection.callStaticMethod("WXOptManager", "sendWXAuthReq:", "weixin");
}
});
cc._RF.pop();
}, {
Configs: "Configs",
GameNetMgr: "GameNetMgr",
Global: "Global",
HTTP: "HTTP",
Net: "Net",
UserMgr: "UserMgr"
} ],
"socket-io": [ function(e, n, t) {
(function(e) {
"use strict";
cc._RF.push(n, "393290vPc1IIYfh8FrmxcNZ", "socket-io");
"function" == typeof Symbol && Symbol.iterator;
0;
cc._RF.pop();
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {} ],
userInfoCtrl: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "b8be810sGdH16alCNReC+SP", "userInfoCtrl");
var o = e("Tools");
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
showUserInfo: function(e) {
this.setUserName(e.name);
this.setUserCoin(e.score);
this.isGetReady(e.ready);
this.isOffline(e.online);
this.isBanker(e.userid);
},
setUserName: function(e) {
this.userName.string = e;
},
setUserCoin: function(e) {
this.userCoin.string = e;
},
isGetReady: function(e) {
this.getReady.node.active = e;
},
isOffline: function(e) {
this.offline.node.active = !e;
},
isBanker: function(e) {
this.banker.node.active = cc.vv.userMgr.getBankerId() == e;
},
showChatInfo: function(e) {
var n = function() {
this.chatInfo.node.active = !1;
};
this.chatInfo.unschedule(n);
this.chatInfo.node.active = !0;
this.chatInfo.string = e;
this.chatInfo.scheduleOnce(n, 2);
},
onLoad: function() {
this.node.on("user_state", function(e) {
cc.log("userinfoctrl userready");
this.isGetReady(e);
}.bind(this));
this.node.on("show_chat_info", function(e) {
cc.log("show_chat_info");
cc.log(e);
this.chatInfo.string = e;
this.chatInfo.node.active = !0;
}.bind(this));
this.node.on("show_emoji_info", function(e) {
var n = this;
cc.log("show_emoji_info");
cc.log(e);
this.emoji.spriteFrame = cc.vv.emjioAtlas.getSpriteFrame(e + "0");
this.emoji.node.active = !0;
o.createAnimationByName(this.emoji.node, e, .5, 10, function() {
n.emoji.node.active = !1;
});
}.bind(this));
},
start: function() {}
});
cc._RF.pop();
}, {
Tools: "Tools"
} ]
}, {}, [ "socket-io", "createRoom", "GameNetMgr", "Global", "HTTP", "Net", "chat", "emojiCtrl", "Configs", "Tools", "UserMgr", "userInfoCtrl", "gameCtrl", "gameEndCtrl", "gamehallCtrl", "loginCtrl" ]);