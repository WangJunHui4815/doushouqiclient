(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/sprite/common/Tools.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '083abB7ynBLXYtq5JNAoLI7', 'Tools', __filename);
// sprite/common/Tools.js

"use strict";

module.exports = {
    loadResDir: function loadResDir(dirPath, callback) {
        var onResourceLoaded = function onResourceLoaded(errorMessage, spriteFrames, urlList) {
            var ret = {};
            // 检查失败原因
            if (errorMessage) {
                cc.log('Tools.loadResDir：加载失败, 原因:' + errorMessage);
                return;
            }
            for (var index = 0; index < urlList.length; index++) {
                var element = urlList[index];
                var nameList = element.split("/");
                ret[nameList[nameList.length - 1]] = spriteFrames[index];
            }
            if (callback && typeof callback == "function") {
                callback(ret);
            }
        };
        // 這邊才是真的使用cc.loader進行載入，並且呼叫我們上面寫的方法
        cc.loader.loadResDir(dirPath, cc.SpriteFrame, onResourceLoaded);
    },

    createAnimationByName: function createAnimationByName(emoji, animName, speed, repeatCount, callback) {
        var animation = emoji.getComponent(cc.Animation) ? emoji.getComponent(cc.Animation) : emoji.addComponent(cc.Animation);
        // 注册动画结束时回掉
        animation.on('finished', function () {
            if (callback) {
                callback();
            }
        }, this);
        var frameCount = 0;
        var frames = [];
        for (var index = 0; index < 99; index++) {
            var frameName = animName + index;
            var spriteFrame = cc.vv.emjioAtlas.getSpriteFrame(frameName);
            if (spriteFrame) {
                frameCount++;
                frames[index] = spriteFrame;
            } else {
                break;
            }
        }

        var clip = cc.AnimationClip.createWithSpriteFrames(frames, frameCount);
        clip.name = "clip";
        animation.addClip(clip);
        var anim = animation.play("clip");
        anim.speed = speed || 6;
        if (repeatCount == 99) {
            anim.repeatCount = Infinity;
        } else {
            anim.repeatCount = repeatCount;
        }
    }
};

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
        //# sourceMappingURL=Tools.js.map
        