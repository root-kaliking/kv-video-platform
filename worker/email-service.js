import { hashPassword } from './auth-utils.js';

export async function createUserByEmail(kv, email) {
    const mailApi = await kv.get('config:mail_api');
    const mailToken = await kv.get('config:mail_token');
    
    // 在邮件服务创建用户
    const res = await fetch(`${mailApi}/public/addUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': mailToken
        },
        body: JSON.stringify({ list: [{ email }] })
    });
    
    if (!res.ok) throw new Error('邮箱账户创建失败');
    
    // 生成临时本地记录
    const tempToken = crypto.randomUUID();
    await kv.put(`temp_user:${email}`, JSON.stringify({
        token: tempToken,
        createdAt: Date.now()
    }), {
        expirationTtl: 300 // 5分钟有效
    });
    
    return tempToken;
};

export async function sendVerificationCode(email, code) {
    const mailApi = await kv.get('config:mail_api');
    const mailToken = await kv.get('config:mail_token');
    
    // 实际根据邮件服务调整发送逻辑
    const res = await fetch(`${mailApi}/public/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': mailToken
        },
        body: JSON.stringify({
            to: email,
            subject: '您的验证码',
            text: `您的验证码是: ${code}，有效期5分钟`
        })
    });
    
    return res.ok;
};