# 前端性能优化

## 前言

目前的互联网产品竞争十分激烈，一个网站的打开速度和响应速度是一个很重要的指标，这都会影响用户的留存率和转化率，最终体现为经济效益。现在市场上初中级的前端太多了，学习性能优化的知识也能提高我的个人竞争力和发展空间，所以我打算学习一下这个模块的知识，并在此记录一下我的学习过程。

## 初识性能优化

性能优化其实主要关注点是用户的体验，所以我们需要了解用户的体验点是什么，并且根据网站的生命周期来进行优化。主要参照了 RAIL 性能模型的四个方面：

- <code>响应(Response)</code>：用户交互的响应时间
- <code>动画(Animation)</code>：用户体验的流畅度
- <code>空闲(Idle)</code>：利用空闲时间来处理可延迟任务
- <code>加载(Load)</code>：加载关键渲染路径

---

常见的优化性能的步骤一般分为三步:

1. 首先**量化**网站的性能表现，可以通过**Chrome 器**浏览器的**Performance**模块或者使用**Lighthouse**插件来查看网站的性能表现；
2. 然后立足于网站的**生命周期**，找出性能表现差的原因；
3. 最后进行技术改造，优化性能。