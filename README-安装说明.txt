八方网站菜单管理后台 - Cloudflare Pages + KV

这是可工作的管理后台，但必须先完成一次 Cloudflare 配置。
1. Cloudflare Dashboard → Workers & Pages → KV，创建 namespace，例如 BAFANG_MENU。
2. Workers & Pages → bafang-dumplings → Settings → Bindings，添加 KV namespace binding：变量名必须是 MENU_KV，绑定刚创建的 namespace。
3. Settings → Variables and Secrets，添加加密 Secret，变量名 ADMIN_PASSWORD，值设置为你自己独有的强密码（不要发给任何人）。
4. 重新部署这个 ZIP 到 Production。注意 Cloudflare Pages 的 Functions 必须在项目上正确启用；若旧项目仅支持静态拖拽部署而无法部署 Functions，需要通过 Git 仓库或 Wrangler 部署（例如 npx wrangler pages deploy ./bafang-admin-site --project-name bafang-dumplings）。单纯拖拽 ZIP 可能不会部署 Functions！
5. 打开 https://bafangdumplings.com.au/admin/ ，输入密码。首次读取初始菜单后点击“保存并发布”，网站菜单才会开始动态更新。
6. 如果 /api/menu 返回 404，说明 Pages Functions 没有部署，请用 Git 或 Wrangler 部署，而不是仅拖拽 ZIP。

重要：此版本用密码保护写入接口，读取接口公开。请使用强密码，勿将密码写入前端或公开文件。Cloudflare KV 为最终一致性，修改可能需要最多约一分钟传播。每张图片限约230KB，建议 WebP。管理员密码仅在当前页面内存中使用。建议再通过 Cloudflare Access 保护 /admin 路径。
