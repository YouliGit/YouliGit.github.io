import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像
	// 图片路径支持三种格式：
	// 1. public 目录（以 "/" 开头，不优化）："/assets/images/avatar.webp"
	// 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/avatar.webp"
	// 3. 远程 URL："https://example.com/avatar.jpg"
	avatar: "/assets/images/avatar/0a38139f1bbb6282bd149798878abf9f.jpg",

	// 随机头像列表（每次刷新随机展示一张）
	avatars: [
		"/assets/images/avatar/0a38139f1bbb6282bd149798878abf9f.jpg",
		"/assets/images/avatar/2b803263fc25c25476238682200e8cfd.jpg",
		"/assets/images/avatar/41cb9a94ca70b65707d3b154baff78da.jpg",
		"/assets/images/avatar/74072f8bd7099196f9d3f5b1885a65a0.jpg",
		"/assets/images/avatar/a7b44ab417741ad7825de6cdfa249777.jpg",
		"/assets/images/avatar/ac521766f3418cdfa7f06ea52e59b18e.jpg",
		"/assets/images/avatar/bf0521d8b34a51f67eff11aba4d035b0.jpg",
		"/assets/images/avatar/e958ea96c7bab9d59e3f05adf0c16d9b.jpg",
	],

	// 名字
	name: "游狸",

	// 个人签名
	bio: "时光会把你雕刻成————你应有的样子",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/YouliGit",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
