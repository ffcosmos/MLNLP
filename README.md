# MLNLP 2026 大会网站

第五届机器学习算法与自然语言处理大会网站，基于 [LightChen233/MLNLP](https://github.com/LightChen233/MLNLP)。

## 本地预览

在 macOS 双击 `preview.command`，或在仓库目录执行以下命令。

```sh
python3 -m http.server 8895 --bind 127.0.0.1
```

访问 `http://127.0.0.1:8895/mlnlp2026/`。

## 修改入口

- 页面和主办方成员：`mlnlp2026/index.html`
- 配色与响应式布局：`mlnlp2026/assets/css/conference.css`
- 论坛内容与主席头像：`mlnlp2026/assets/data/session_1.json` 至 `session_7.json`
- 日程渲染和倒计时：`mlnlp2026/assets/js/conference.js`

主办方成员的第三行职称目前按页面设计要求统一占位为“博士生导师”，以 `data-title-placeholder="true"` 标记，后续可逐人更新。

## 自动部署

推送 `mlnlp2025/`、`mlnlp2026/`、根目录入口或部署工作流的变更到 `main` 后，GitHub Actions 会发布两年网站和根目录入口。根入口跳转到 2026 大会页，发布地址使用 GitHub Pages 默认域名。

- [公开入口](https://ffcosmos.github.io/MLNLP/)
- [2026 大会页](https://ffcosmos.github.io/MLNLP/mlnlp2026/)
- [2025 大会页](https://ffcosmos.github.io/MLNLP/mlnlp2025/)

仓库保留原项目的历史年份代码与模板署名。TheEvent 模板来自 [BootstrapMade](https://bootstrapmade.com/theevent-conference-event-bootstrap-template/)。
