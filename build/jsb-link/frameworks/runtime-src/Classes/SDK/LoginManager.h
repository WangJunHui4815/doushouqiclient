//
//  LoginManager.h
//  client-vitamin
//
//  Created by topq on 15/6/29.
//
//

#ifndef __client_vitamin__LoginManager__
#define __client_vitamin__LoginManager__

#include "cocos2d.h"

 

enum SDK_ACCESS_TYPE
{
    SDK_ACCESS_TYPE_BILI = 0,
    SDK_ACCESS_TYPE_SHARE_JOY,
    SDK_ACCESS_TYPE_UNIO,
    SDK_ACCESS_TYPE_TENCENT,
    SDK_ACCESS_TYPE_MAX
};

enum SDK_LOGIN_TYPE
{
    SDK_LOGIN_TYPE_NONE = 0,
    SDK_LOGIN_TYPE_LOGING,
    SDK_LOGIN_TYPE_SUCC,
    SDK_LOGIN_TYPE_FAIL,
    SDK_LOGIN_TYPE_CANCEL,
    SDK_LOGIN_TYPE_LOGOUT,
    SDK_LOGIN_TYPE_MAX
};

/*
 1004(QQ_NotInstall)-----  机未安装 Q
 1005(QQ_NotSupportApi)-----  机 Q版本太低
 2000(WX_NotInstall)-----  机未安装微信
 2001(WX_NotSupportApi)-----  机微信版本太低
 3101(Login_NotRegisterRealName)----- 账号没有进 实名认证
 1001 2002 2003 ----- 授权失败
 1002 1003 2004 ----- 登录失败
 ##其他接 要求与联运 包 样
 */

#define LOGIN_ERROR_CODE_CANCEL   -103    //登录取消
#define LOGIN_ERROR_CODE_FAILE    -104    //登录失败
#define LOGIN_ERROR_CODE_CLOSE    -105    //登录关闭
#define LOGIN_ERROR_CODE_QQ_NotInstall    1004  //手机未安装QQ
#define LOGIN_ERROR_CODE_WX_NotInstall    2000  //手机未安装微信
#define LOGIN_ERROR_CODE_QQ_NotSupportApi 1005  //手机QQ版本太低
#define LOGIN_ERROR_CODE_WX_NotSupportApi 2001  //手机微信版本太低
#define LOGIN_ERROR_CODE_WX_NotRealName   3101  //账号没有进行实名认证
#define LOGIN_ERROR_CODE_Empower01        1001  //授权失败1
#define LOGIN_ERROR_CODE_Empower02        2002  //授权失败2
#define LOGIN_ERROR_CODE_Empower03        2003  //授权失败3
#define LOGIN_ERROR_CODE_Fail01           1002  //登录失败1
#define LOGIN_ERROR_CODE_Fail02           1003  //登录失败2
#define LOGIN_ERROR_CODE_Fail03           2004  //登录失败3


class LoginManager
{
public:
    LoginManager();
    ~LoginManager();
    
    static LoginManager* GetInstance();
    
    void login();
    void logout();
    void onLoginSuccess(const char* data);
    void onLoginFail();
    void onLoginCancel();
    void onLoginOut();
    
    void setLoginSuccessCallBack(const std::function<void(void)>& callback);
    void setLoginFailCallBack(const std::function<void(void)>& callback);
    void setLoginOutCallBack(const std::function<void(void)>& callback);
 
    
    void onEnterBackground();
    void onEnterForeground();
  
    
    void exit();
 
    static LoginManager *m_LoginManager;
    std::function<void(void)> m_LoginSuccessCallback;
    std::function<void(void)> m_LoginFailCallback;
    std::function<void(void)> m_LoginOutCallback;
    
  
};

#endif /* defined(__client_vitamin__LoginManager__) */
