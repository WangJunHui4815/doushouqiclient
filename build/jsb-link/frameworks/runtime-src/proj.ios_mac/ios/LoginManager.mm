//
//  LoginManager.mm
//  client-vitamin
//
//  Created by shixc on 17/10/22.
//
//

#include "LoginManager.h"



USING_NS_CC;

////王俊辉：信鸽sdk判断ios版本使用
//#define _IPHONE80_ 80000

LoginManager *LoginManager::m_LoginManager = NULL;

LoginManager::LoginManager():
m_LoginSuccessCallback(nullptr),
m_LoginFailCallback(nullptr),
m_LoginOutCallback(nullptr)
{
}

LoginManager::~LoginManager()
{
    
}

LoginManager*  LoginManager::GetInstance()
{
    if (m_LoginManager == NULL)
    {
        m_LoginManager = new LoginManager();
    }
    
    return m_LoginManager;
}

void LoginManager::login()
{

#ifdef USE_SDK_LOGIN
    ConfigLogin::getInstance()->setAccessType(SDK_ACCESS_TYPE_BILI + 1);
    [[BLGameSdk defaultGameSdk] showLoginView];
    m_sdkName = SDK_NAME[SDK_ACCESS_TYPE_BILI];
    m_sdkType = SDK_ACCESS_TYPE_BILI;
#else
    onLoginSuccess("");
#endif

}

void LoginManager::onLoginSuccess(const char* data)
{

}


void LoginManager::logout()
{
    

}

void LoginManager::onLoginFail()
{
   
}

void LoginManager::onLoginOut()
{

}

void LoginManager::setLoginSuccessCallBack(const std::function<void(void)>& callback)
{
    m_LoginSuccessCallback = callback;
}

void LoginManager::setLoginFailCallBack(const std::function<void(void)>& callback)
{
    m_LoginFailCallback = callback;
}

void LoginManager::setLoginOutCallBack(const std::function<void(void)>& callback)
{
    m_LoginOutCallback = callback;
}


void LoginManager::onEnterBackground()
{
    
}

void LoginManager::onEnterForeground()
{
    if ( m_LoginFailCallback)
    {
        m_LoginFailCallback();
    }
}


 

void LoginManager::exit()
{
    
}
void LoginManager::onLoginCancel()
{
}









