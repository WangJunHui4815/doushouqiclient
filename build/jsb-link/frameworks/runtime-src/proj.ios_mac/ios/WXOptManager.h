#import "WXApi.h"


@interface WXOptManager : NSObject{
    
}

+(instancetype)sharedManager;

+(void)RegisterAppID:(NSString*)app_id;

+(void)SendAuthRequest:(NSString*)scope State:(NSString*)state;

+(BOOL)ShareToChatScene:(NSString*)content_txt;

+(BOOL)ShareToFriendCircle:(NSString*)content_txt;

+(BOOL)ShareLinkToChatScene:(NSString*)content_link Title:(NSString*)title_txt Description:(NSString*)desc_txt;

+(BOOL)ShareLinkToFriendCircle:(NSString*)content_link Title:(NSString*)title_txt Description:(NSString*)desc_txt;

+(BOOL)ShareImageToChatScene:(NSString*)path;

+(BOOL)ShareImageToChatScene:(NSString*)file_path Title:(NSString*)title_txt Description:(NSString*)desc_txt;

+(void)StartPay:(NSString* )partner_id PrepayId:(NSString*)prepay_id NonceStr:(NSString*)nonce_str TimeStamp:(UInt32)timestamp Sign:(NSString*)sign;

+(BOOL)CheckWXInstalled;

+(NSString *) getIPWithHostName:(const NSString *)hostName;

+(UIImage*)scaleToSize:(CGSize)size Target:(UIImage*)target_img;

 
//+(NSString *)login:(NSString *)str title:(NSString *)tit;

+ (void)sendWXAuthReq:(NSString *)str;

+ (BOOL)handleOpenURL:(NSURL *)url;



@end

