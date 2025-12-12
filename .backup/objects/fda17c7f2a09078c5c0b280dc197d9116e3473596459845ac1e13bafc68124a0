# Cloudflare KV 视频网站部署指南

## 管理员后台入口
- **审核系统**：`/admin/index.html`
- **登录账号**：配置在wrangler.toml中的 ADMIN_USERNAME/ADMIN_PASSWORD

## 视频处理流程
```mermaid
graph LR
A[原始视频] -->|切割工具| B[视频分块]
B --> C[上传至KV]
C --> D[标记为待审核状态]
D --> E{管理员审核}
E -->|通过| F[普通用户可见]
E -->|拒绝| G[仅管理员可见]
```

## 性能建议
1. 监控KV读操作：确保每日 < 100,000
2. 大型视频分段：建议每个分片20MB以下
3. 审核队列：定期清理被拒内容
```