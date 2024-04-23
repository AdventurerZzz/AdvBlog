## 前言

这个部分主要记录一些小问题的解决方案

### github 提交代码没有贡献值记录(小绿点)

可以从下面两个方面排查一下原因

1. 提交代码时，没有选择正确的默认分支
2. 进行 Commits 的用户没有被关联到你的 Github 帐号中。

---

#### 解决方法

- 到 GitHub 个人设置(Settings)中查看邮箱(Emails)是否正确。
- 在本地 git 命令窗口执行下方语句查看对应信息是否正确：

```bash
# 查看git用户邮箱
git config user.email
# 查看git用户名
git config user.name
```

如果找到问题，执行下方语句重新设置本地 git 信息使之与 GitHub 保持一致：

```bash
# 重置git用户邮箱
git config --global user.email 你的邮箱地址
# 重置git用户名
git config --global user.name 你的用户名
```

<font color="red">注意:邮箱不要加双引号</font>
