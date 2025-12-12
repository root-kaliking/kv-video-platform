// 初始化状态检查API
export async function handleInitStatus(kv) {
    const hasInit = await kv.get('config:initialized');
    return { initialized: !!hasInit };
}

// 主初始化逻辑
export async function performInitialization(kv, { mail_service, site_admin }) {
    // 步骤1: 生成邮箱服务Token
    const tokenRes = await fetch(`${mail_service.api}/public/genToken`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: mail_service.admin,
            password: mail_service.password
        })
    });
    
    if (!tokenRes.ok) throw new Error('邮箱服务连接失败');
    
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 200) {
        throw new Error(`邮箱服务错误: ${tokenData.message}`);
    }
    
    // 步骤2: 存储关键配置
    await Promise.all([
        kv.put('config:mail_api', mail_service.api),
        kv.put('config:mail_token', tokenData.data.token),
        kv.put('config:site_admin', JSON.stringify({
            username: site_admin.username,
            password: site_admin.password
        })),
        kv.put('config:initialized', 'true')
    ]);
    
    return true;
}

// 创建网站管理员账户（后续执行）
export async function createAdminAccount(kv) {
    const adminConfig = await kv.get('config:site_admin', 'json');
    
    if (!adminConfig) return false;
    
    // 密码哈希处理
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(adminConfig.password, salt);
    
    await kv.put(`user:${adminConfig.username}`, JSON.stringify({
        password: passwordHash,
        role: 'admin',
        createdAt: Date.now()
    }));
}