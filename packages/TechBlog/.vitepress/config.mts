import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Adventurer的文档站",
  description: "A VitePress Site",
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outlineTitle: "文章目录",
    outline: [2, 6],

    aside: "left", // 设置右侧侧边栏在左侧显示
    nav: [
      {
        text: "前端",
        items: [
          { text: "Vue", link: "/markdown/web-developer/Vue" },
          { text: "前端面试题", link: "/markdown/web-developer/Interview" },
        ],
      },
      { text: "后端", link: "/api-examples" },
      {
        text: "性能优化",
        link: "/markdown/performance/performance",
      },
      {
        text: "其他",
        link: "/markdown/other",
      },
    ],
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: "github", link: "https://github.com/AdventurerZzz/AdvBlog" },
    ],

    footer: {
      copyright: "Copyright © 2024 Adventurer",
    },

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },

    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
  },
});
