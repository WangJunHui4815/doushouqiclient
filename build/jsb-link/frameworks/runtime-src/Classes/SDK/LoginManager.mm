//
//  LoginManager.cpp
//  client-vitamin
//
//  Created by topq on 15/6/29.
//
//

#include "LoginManager.h"




USING_NS_CC;

LoginManager *LoginManager::m_LoginManager = nullptr;

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
    if (m_LoginManager == nullptr)
    {
        m_LoginManager = new LoginManager();
    }
    
    return m_LoginManager;
}

void LoginManager::login()
{
    cocos2d::log("byshixc ANDROID_TENCENT_SDK setAccessType=%d",SDK_ACCESS_TYPE_UNIO + 1);
}

void LoginManager::onLoginSuccess(const char* data)
{

}

void LoginManager::onLoginFail()
{ 

}
void LoginManager::onLoginCancel()
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

}


void LoginManager::exit()
{

}
void LoginManager::logout()
{

}
