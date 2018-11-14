module.exports = {
    loadResDir: function (dirPath, callback) {
        let onResourceLoaded = function (errorMessage, spriteFrames, urlList) {
            let ret = {};
            // 检查失败原因
            if (errorMessage) {
                cc.log('Tools.loadResDir：加载失败, 原因:' + errorMessage);
                return;
            }
            for (let index = 0; index < urlList.length; index++) {
                const element = urlList[index];
                var nameList = element.split("/");
                ret[nameList[nameList.length - 1]] = spriteFrames[index];
            }
            if (callback && typeof (callback) == "function") {
                callback(ret);
            }
        };
        // 這邊才是真的使用cc.loader進行載入，並且呼叫我們上面寫的方法
        cc.loader.loadResDir(dirPath, cc.SpriteFrame, onResourceLoaded);
    },

    createAnimationByName(emoji, animName, speed, repeatCount, callback) {
        let animation = emoji.getComponent(cc.Animation) ? emoji.getComponent(cc.Animation) : emoji.addComponent(cc.Animation)
        // 注册动画结束时回掉
        animation.on('finished', function () {
            if (callback) {
                callback();
            }
        }, this);
        let frameCount = 0
        let frames = [];
        for (let index = 0; index < 99; index++) {
            let frameName = animName + (index);
            let spriteFrame = cc.vv.emjioAtlas.getSpriteFrame(frameName)
            if (spriteFrame) {
                frameCount++
                frames[index] = spriteFrame
            }
            else {
                break;
            }
        }

        let clip = cc.AnimationClip.createWithSpriteFrames(frames, frameCount)
        clip.name = "clip"
        animation.addClip(clip)
        let anim = animation.play("clip")
        anim.speed = speed || 6
        if (repeatCount == 99) {
            anim.repeatCount = Infinity;
        }
        else {
            anim.repeatCount = repeatCount;
        }
    },
}
