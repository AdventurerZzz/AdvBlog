## 前言

这个部分主要记录一些小问题的解决方案

### github 提交代码没有贡献值记录(小绿点)

可以从下面两个方面排查一下原因

1. 提交代码时，没有选择正确的默认分支
2. 进行 Commits 的用户没有被关联到你的 Github 帐号中。

---

#### 解决方法

1. 电子邮箱问题

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

2. 仓库分支问题  
   若排查完本地 git 邮箱和 github 上的邮箱没有问题，但<code>push</code>后依然没有显示贡献值。

- 打开 github 储存库的设置(Settings)，查看分支(Branches)中的默认分支(Default branch)。
- 可以看到默认是 main，现在点击后面的切换按钮，选择我们需要的分支，点击更新(Update)。
- 点击“我明白，更新默认分支”，确定更换新分支为默认分支。

---

ok，现在问题基本可以解决了，但是现在重新 push 的时候可能会报错：

```bash
----------------- SECURITY WARNING ----------------
warning: | TLS certificate verification has been disabled! |
warning: ---------------------------------------------------
warning: HTTPS connections may not be secure. See https://aka.ms/gcm/tlsverify for more information.
```

这个时候不要慌,这个缺少了安全认证，所以解决方法是重启安全认证:

```bash
git config --global http.sslVerify true
```

再次 push，你会发现成功，并且小绿点出现了
