#import "WXApiManager.h"
#import "WXApiObject.h"
#import "cocos2d.h"
#import "/Applications/CocosCreator.app/Contents/Resources/cocos2d-x/cocos/scripting/js-bindings/jswrapper/SeApi.h"

#import <netdb.h>
@implementation WXOptManager

+(instancetype)sharedManager {
    static dispatch_once_t onceToken;
    static WXApiManager *instance;
    dispatch_once(&onceToken, ^{
        instance = [[WXApiManager alloc] init];
    });
    return instance;
}

//WXSuccess           = 0,    /**< 成功    */
//WXErrCodeCommon     = -1,   /**< 普通错误类型    */
//WXErrCodeUserCancel = -2,   /**< 用户点击取消并返回    */
//WXErrCodeSentFail   = -3,   /**< 发送失败    */
//WXErrCodeAuthDeny   = -4,   /**< 授权失败    */
//WXErrCodeUnsupport  = -5,   /**< 微信不支持    */

-(void)onResp:(BaseResp *)resp
{
    if (resp.errCode == WXErrCode::WXSuccess)
    {
        //分享成功后回调
        if ([resp isKindOfClass:[SendMessageToWXResp class]])
        {
             NSLog(@"ios wechat onResp share success");
           // OC_CALL_SendMsgToLua(curShareType);
        //授权成功后回调
        }else if ([resp isKindOfClass:[SendAuthResp class]])
        {
            SendAuthResp* send_auth_resp = (SendAuthResp*)resp;
            
            // cocos2dx-lua
            // OC_CALL_GetAccessTokenByCode([[send_auth_resp code] UTF8String]);
            
            // cocos creator
            std::string _code = [[send_auth_resp code] UTF8String];
            std::string _jsFunctionString = "cc.Client.WechatPlatformManager.wechatOnRespone(\"%s\");";
            std::string _callJsString = cocos2d::StringUtils::format(_jsFunctionString.c_str(), _code.c_str());
            se::Value *ret = new se::Value();
            se::ScriptEngine::getInstance()->evalString(_callJsString.c_str() , -1 , ret);
            NSLog(@"ios wechat onResp");
            
        //支付成功回调
        }else if([resp isKindOfClass:[PayResp class]])
        {
             NSLog(@"ios wechat onResp pay success");
            //OC_CALL_SendMsgToLua(1901);
        }else if ([resp isKindOfClass:[AddCardToWXCardPackageResp class]]) {
            
        } else if ([resp isKindOfClass:[WXChooseCardResp class]]) {
            
        }
    }else
    {
        //支付失败回调
        if([resp isKindOfClass:[PayResp class]])
        {
             NSLog(@"ios wechat onResp share failed");
            //OC_CALL_SendMsgToLua(1902);
        }
    }
    
}

-(void)onReq:(BaseReq *)req
{
    if ([req isKindOfClass:[GetMessageFromWXReq class]]) {
        
    } else if ([req isKindOfClass:[ShowMessageFromWXReq class]]) {
        
    } else if ([req isKindOfClass:[LaunchFromWXReq class]]) {
        
    }
}

+(void)RegisterAppID:(NSString*)app_id
{
    cocos2d::log("call ios wechat RegisterAppID success");
    //注册app_id
    [WXApi registerApp:app_id];
    //向微信注册支持的文件类型
    UInt64 typeFlag = MMAPP_SUPPORT_TEXT | MMAPP_SUPPORT_PICTURE | MMAPP_SUPPORT_LOCATION | MMAPP_SUPPORT_VIDEO |MMAPP_SUPPORT_AUDIO | MMAPP_SUPPORT_WEBPAGE | MMAPP_SUPPORT_DOC | MMAPP_SUPPORT_DOCX | MMAPP_SUPPORT_PPT | MMAPP_SUPPORT_PPTX | MMAPP_SUPPORT_XLS | MMAPP_SUPPORT_XLSX | MMAPP_SUPPORT_PDF;
    
    [WXApi registerAppSupportContentFlag:typeFlag];
}

+(void)SendAuthRequest:(NSString*)scope State:(NSString*)state
{
    SendAuthReq* req = [[[SendAuthReq alloc]init]autorelease];
    req.scope = scope;
    req.state = state;
    [WXApi sendReq:req];
}

+(BOOL)ShareToChatScene:(NSString*)content_txt
{
    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = true;
    req.scene = WXScene::WXSceneSession;
    req.text = content_txt;
    
    return [WXApi sendReq:req];
}
+(BOOL)ShareToFriendCircle:(NSString*)content_txt
{
    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = true;
    req.scene = WXScene::WXSceneTimeline;
    req.text = content_txt;
    return [WXApi sendReq:req];
}

+(BOOL)ShareLinkToChatScene:(NSString*)content_link Title:(NSString*)title_txt Description:(NSString*)desc_txt
{
    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = content_link;
    UIImage *thumbImage = [UIImage imageNamed:@"share_icon.png"];
    
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title_txt;
    message.description = desc_txt;
    message.mediaObject = ext;
    message.messageExt = nil;
    message.messageAction = nil;
    message.mediaTagName = @"WECHAT_TAG_SHARELINK_CS";
    [message setThumbImage:thumbImage];
    
    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = false;
    req.scene = WXScene::WXSceneSession;
    req.message = message;
    //curShareType = 1701;
    return [WXApi sendReq:req];
    
}
+(BOOL)ShareLinkToFriendCircle:(NSString*)content_link Title:(NSString*)title_txt Description:(NSString*)desc_txt
{
    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = content_link;
    UIImage *thumbImage = [UIImage imageNamed:@"share_icon.png"];
    
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title_txt;
    message.description = desc_txt;
    message.mediaObject = ext;
    message.messageExt = nil;
    message.messageAction = nil;
    message.mediaTagName = @"WECHAT_TAG_SHARELINK_FC";
    [message setThumbImage:thumbImage];
    
    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = false;
    req.scene = WXScene::WXSceneTimeline;
    req.message = message;
    //curShareType = 1702;
    return [WXApi sendReq:req];
}

+(BOOL)ShareImageToChatScene:(NSString*)path
{
    NSString *full_img_path = [path stringByAppendingString:@"full_screenshot.png"];
    UIImage *temp_img = [UIImage imageWithContentsOfFile:full_img_path];
    UIImage *thumbImage = [[WXApiManager sharedManager] scaleToSize:CGSizeMake(320, 320) Target:temp_img];
    // 多媒体消息中包含的图片数据对象
    WXImageObject *imageObject = [WXImageObject object];
    imageObject.imageData = [NSData dataWithContentsOfFile:full_img_path];
    
    WXMediaMessage *message = [WXMediaMessage message];
    //message.title = title_txt;
    message.mediaObject = imageObject;
    message.messageExt = nil;
    message.messageAction = nil;
    message.mediaTagName = @"WECHAT_TAG_SHARELINK_FC";
    [message setThumbImage:thumbImage];
    
    SendMessageToWXReq *req = [[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = false;
    req.scene = WXScene::WXSceneSession;
    req.message = message;
    //curShareType = 1705;
    return [WXApi sendReq:req];
}

//等比例缩放
+(UIImage*)scaleToSize:(CGSize)size Target:(UIImage*)target_img
{
    CGFloat width = target_img.size.width;
    CGFloat height = target_img.size.height;
    
    float verticalRadio = size.height*1.0/height;
    float horizontalRadio = size.width*1.0/width;
    
    float radio = 1;
    if(verticalRadio>1 && horizontalRadio>1)
    {
        radio = verticalRadio > horizontalRadio ? horizontalRadio : verticalRadio;
    }
    else
    {
        radio = verticalRadio < horizontalRadio ? verticalRadio : horizontalRadio;
    }
    
    width = width*radio;
    height = height*radio;
    
    int xPos = (size.width - width)/2;
    int yPos = (size.height-height)/2;
    
    // 创建一个bitmap的context
    // 并把它设置成为当前正在使用的context
    UIGraphicsBeginImageContext(size);
    
    // 绘制改变大小的图片
    [target_img drawInRect:CGRectMake(xPos, yPos, width, height)];
    
    // 从当前context中创建一个改变大小后的图片
    UIImage* scaledImage = UIGraphicsGetImageFromCurrentImageContext();
    
    // 使当前的context出堆栈
    UIGraphicsEndImageContext();
    
    // 返回新的改变大小后的图片
    return scaledImage;
}

+(void)StartPay:(NSString *)partner_id PrepayId:(NSString *)prepay_id NonceStr:(NSString *)nonce_str TimeStamp:(UInt32)timestamp Sign:(NSString *)sign
{
    PayReq *Req = [[[PayReq alloc] init] autorelease];
    Req.partnerId = partner_id;
    Req.prepayId= prepay_id;
    Req.package = @"Sign=WXPay";
    Req.nonceStr= nonce_str;
    Req.timeStamp= timestamp;
    Req.sign= sign;
    [WXApi sendReq:Req];
}

+(BOOL)CheckWXInstalled
{
    cocos2d::log("CheckWXInstalled call ok");
    return [WXApi isWXAppInstalled];
}

@end
