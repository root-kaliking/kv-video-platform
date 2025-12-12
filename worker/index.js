// 新增初始化路由处理
import { handleInitStatus, performInitialization } from './init-handler.js';

// 现有Worker中新增路由
if (url.pathname === '/api/init/status') {
    const status = await handleInitStatus(env.VIDEO_KV);
    return new Response(JSON.stringify(status));
}

if (url.pathname === '/api/init') {
    const data = await request.json();
    
    try {
        const success = await performInitialization(env.VIDEO_KV, data);
        return new Response(JSON.stringify({ success }));
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false,
            error: error.message
        }), {
            status: 500
        });
    }
}

// 拦截首次访问（前置中间件）
if (url.pathname === '/') {
    const initialized = await env.VIDEO_KV.get('config:initialized');
    if (!initialized) {
        return new Response('Redirecting...', {
            status: 302,
            headers: { Location: '/init.html' }
        });
    }
}