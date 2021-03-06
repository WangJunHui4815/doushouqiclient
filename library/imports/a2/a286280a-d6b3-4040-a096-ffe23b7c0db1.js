"use strict";
cc._RF.push(module, 'a2862gK1rNAQKCW/+I7fA2x', 'emojiCtrl');
// sprite/chat/emojiCtrl.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        _info: "" // 表情名字
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    setEmojiInfo: function setEmojiInfo(info) {
        cc.log("emjio");
        this._info = info;
        this.node.getComponent(cc.Sprite).spriteFrame = cc.vv.emjioAtlas.getSpriteFrame(info + "0");
    },
    sendEmoji: function sendEmoji() {
        cc.vv.net.send("emoji", this._info);
    }

    // update (dt) {},

});

cc._RF.pop();