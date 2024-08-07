# 前端性能优化

## 前言

目前的互联网产品竞争十分激烈，一个网站的打开速度和响应速度是一个很重要的指标，这都会影响用户的留存率和转化率，最终体现为经济效益。现在市场上初中级的前端太多了，学习性能优化的知识也能提高我的个人竞争力和发展空间，所以我打算学习一下这个模块的知识，并在此记录一下我的学习过程。

## 一丶初识性能优化

性能优化其实主要关注点是用户的体验，所以我们需要了解用户的体验点是什么，并且根据网站的生命周期来进行优化。主要参照了 RAIL 性能模型的四个方面：

- <code>响应(Response)</code>：用户交互的响应时间
- <code>动画(Animation)</code>：用户体验的流畅度
- <code>空闲(Idle)</code>：利用空闲时间来处理可延迟任务
- <code>加载(Load)</code>：加载关键渲染路径

### 常见的优化性能的步骤一般分为三步:

1. 首先**量化**网站的性能表现，可以通过**Chrome**浏览器的**Performance**模块或者使用**Lighthouse**插件来查看网站的性能表现；
2. 然后立足于网站的**生命周期**，找出性能表现差的原因；
3. 最后进行技术改造和优化性能。

---

## 二丶前端页面的生命周期

前端有一道很经典的面试题:从浏览器地址栏输入 URL 后，到页面渲染出来，整个过程发生了什么?这道题其实考察的是面试者对前端页面生命周期和前端性能优化方面的理解。这里就整个流程划分为以下几个阶段并分析其中存在的性能优化点：

1. <code>浏览器接收到 URL，到网络请求线程的开启。 </code>
2. <code>一个完整的 HTTP 请求的发出。</code>
3. <code>服务器接收到请求并转到具体的处理后台。</code>
4. <code>前后台之间的 HTTP 交互和涉及的缓存机制。</code>
5. <code>浏览器接收数据包后的关键渲染路径。</code>
6. <code>JS 引擎的解析过程。</code>

---

### 网络请求线程开启

浏览器接收到 URL 后，会开启多个进程，其中有浏览器主进程、GPU 进程、插件进程、网络进程、渲染进程(浏览器内核)。渲染进程中有多个子线程，包括 JS 引擎线程、GUI 渲染线程、事件触发线程、定时器触发器线程、异步 HTTP 请求线程等。所发起的网络请求就是从这个进程开启的。

---

### 建立 HTTP 请求

在开启网络请求线程时，URL 会被当成参数传入并处理。  
首先通过 DNS 解析，将域名转换为 IP 地址，然后建立通往该服务器地址的路径。如图 2.1 所示为 DNS 解析过程。

#### DNS 解析

1. 首先查询浏览器自身的 DNS 缓存；
2. 如果没有命中，则查询系统自身的 DNS 缓存；
3. 如果还未找到，则从本地的 hosts 文件中查询；
4. 如果在本地主机未找到，则向本地域名服务器查询；
5. 如果本地域名服务器未找到，则会采取迭代的方式向根域名服务器、COM 域名顶级服务器和权限域名查询；
   [![DNS解析图](../../public/dns.png "DNS解析图")](https://img-blog.csdnimg.cn/06f23ef6c8db46e59049279a0ce9cd20.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAYmFuZ3NoYW8xOTg5,size_20,color_FFFFFF,t_70,g_se,x_16)  
   图 2.1 DNS 解析过程

**所以可以看出，DNS 解析是一个耗时的过程，如果解析域名过多，就会导致性能问题。这个地方能被当成一个可选择的优化点。**

---

### 前后端的交互

当可以通过 HTTP 协议进行前后端通信的时候，往往并未是浏览器和确定 IP 地址的服务器进行直接通信，通过会在中间加入**反向代理服务器**。

#### 反向代理服务器

反向代理服务器一般通过集群的方式，将多个应用服务器结合，然后提供给客户端用户使用。它会根据用户的请求，从后端服务器上获取资源后返回给客户端，如图 2.1 所示，作用如下：

- <code>负载均衡</code>
- <code>完全防火墙</code>
- <code>加密及 SSL 加速</code>
- <code>数据压缩</code>
- <code>解决跨域</code>
- <code>对静态资源缓存</code>

  [![反向代理服务器图](../../public/proxy.png "反向代理服务器图")](https://img-blog.csdnimg.cn/67258e57480642c7adc184ab2b58672d.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQzMzEyMDQ5,size_16,color_FFFFFF,t_70)  
   图 2.1 DNS 解析过程

---

#### 浏览器缓存

在前后端交互中，使用浏览器缓存可以使性能得到显著提升。具体的缓存策略为两种:<code>强缓存</code>和<code>协商缓存</code>。

**强缓存**是当浏览器通过响应头判断本地缓存未过期时，直接读取本地缓存，不再发起 HTTP 请求，通过设置<code>Cache-Control</code>字段中的<code>max-age</code>属性值来设置缓存过期时间。

**协助缓存**是需要浏览器向服务器发起 HTTP 请求，来判断浏览器本地缓存的文件是否被修改。具体过程是判断浏览器请求头中的<code>If-Modified-Since</code>字段，与服务器端的<code>e-tag</code>是否匹配，如果本地缓存文件未修改，服务器返回<code>304</code>状态码，浏览器直接读取本地缓存。如图 2.2 所示。  
 [![缓存](../../public/huancun.png "缓存")](https://image-static.segmentfault.com/379/147/3791479945-f4c940afe80caf28_fix732)  
 图 2.2 缓存过程

**使用浏览器缓存可以有效地减少 HTTP 请求次数，以及资源的读取和减少服务器压力，从而提升性能。**

---

### 关键渲染路径

当浏览器接收读取到 HTML 文件后，会进行如下操作：

1. 解析 HTML 文件，将 HTML 文件按照<code>UTF-8</code>编码规则将原始字节转化为字符，然后再按照<code>W3C</code>标准进行构建生成<code>DOM</code>树。
2. 同样的操作，解析 CSS 文件，生成<code>CSSOM</code>树。
3. 接下来将两个对象模型合并为渲染树，在<code>CSSOM</code>中为所有可见的<code>DOM</code>节点找到对应的规则并应用，计算元素的位置与大小，将节点转化为屏幕上的实际像素。

**如果 HTML 文件中<code>DOM</code>节点过多过深，样式复杂，那么浏览器要处理的任务就越多，绘制的时间久越长，直接影响了首屏加载速度。**

**同时，当页面渲染完成后，用户在进行交互时，也可能通过<code>JavaScript</code>代码修改的<code>DOM</code>节点，这时浏览器需要重新绘制，这样也会影响性能。所以这也是可优化点。**

---

## 三丶图像优化

在如今的各类 Web 项目中，其实图像资源的使用占比也越来越大，打开一个网站，你会发现有大量的图片请求，如果巨量的访问请求会引发传输带宽的挑战，请求大尺寸图片需要过长的等待时间，所以，如何优化图像资源，是前端性能优化中一个很重要的点。这部分着重讨论一下图像的**选取和使用**。

---

### 3.1 图像基础

图像资源优化的根本思想就是：**压缩**，其本质就是用更小的资源开销来完成图像的传输和展示。

---

#### 矢量图

矢量图中的图片是由线条和曲线组成的，这些线条和曲线都是由计算得到的。它的优点是能够在任何缩放比例下呈现出细节同样清晰的展示效果，缺点是对细节的展示不够。如果想要实现复杂的图像，所得文件大得离谱，而且达不到想要的效果。**它适合文本、logo、控件图标以及二维码等构图形状简单的几何图形**

#### 位图

位图是通过对一个矩阵中的栅格进行编码来表示图像的，每个栅格表示一个特定颜色，图像由多个栅格像素点组成，那么位图的整体显示效果就会越逼真。它的优点是对于复杂的照片能提供较为真实的细节体验，缺点是显示效果会收到分辨率的影响。**它适合呈现复杂像素组成的图形**。

---

### 3.2 图像格式

图像文件格式通常有<code>JPEG</code>、<code>PNG</code>、<code>GIF</code>、<code>webp</code>，<code>SVG</code>等。根据它们不同的特点，应该在适合它们的场景选取。

---

#### JPEG

<code>JPEG</code>是一种**有损压缩算法**的图像格式，它通过去除冗余图像和色彩数据来获得**较高的压缩率**，同时还能获得较高的图像质量。

它通常有两种压缩模式，一种是<code>基线模式</code>，一种是<code>渐进式模式</code>。<code>基线模式</code>是自上而下进行逐渐加载的，而<code>渐进式模式</code>是将图像文件分多次扫描，首先展示一个低质量模糊的图像，然后随着扫描次数的增加，不断提高清晰度。

**在选择哪种压缩模式时，应该考虑图像的大小，因为渐进式模式会增加重复检索开销，文件太小就没必要使用渐进式模式。但是目前通常都是使用渐进式模式，一般的使用场景是背景图、轮播图、商品的 banner 图。**

---

##### 创建渐进式 JPEG

可以通过构建工具来自动化完成，通过如下代码可以将工作加入 gulp 处理管道：

```js
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
gulp.task("imagemin", () => {
  gulp
    .src("./src/images/*.jpg")
    .pipe(
      imagemin({
        progressive: true,
      })
    )
    .pipe(gulp.dest("./dist/images"));
});
```

这里还有一些其他 JPEG 编码方式，如<code>MozJPEG</code>、<code>Guetzli</code> 等，具体可以参考[imagemin](https://www.npmjs.com/package/imagemin)。

---

#### GIF

<code>GIF</code>通常用于一些小图标或者 Logo，当下一般在需要使用动画时会使用<code>GIF</code>。

---

##### GIF 动画优化

由于动画包含了许多静态帧，并且每个静态帧图像上的内容在相邻的不同帧上很相似，**所以可以通过工具移除动画里连续帧中的像素信息**，这里通过<code>GIFSicle</code>工具来实现。

```js
const { execFile } = require("child_process");
const gifsicle = require("gifsicle");
execFile(gifsicle, ["-o", "output.gif", "input.gif"], (err) => {
  console.log("动画压缩完成");
});
```

---

#### PNG

<code>PNG</code>是无损压缩的高保真图片格式，它的优点是可以保持图像的透明效果，并且
对线条的处理更加细腻，增强了色彩的表现力，**但是缺点是文件体积较大**。

---

##### 优化 PNG

<code>PNG</code>图片有个优点，它能够通过增添一些自定义的"块"来实现额外的功能，但是对于 Web 来说，部分多余的块会自动被忽略，所以可以通过工具来移除这些无用的块。  
因此可以使用 pngcrush 对这些多余的块进行删除压缩，代码如下：

```js
const imagemin = require("imagemin");
const imageminPngcrush = require("imagemin-pngcrush");
imagemin(["src/images/*.png"], "dist/images", {
  plugins: [imageminPngcrush()],
}).then(() => {
  console.log("PNG 完成图像优化");
});
```

其中，<code>imageminPngcrush</code>中可以带一些参数进行压缩。

- <code>rem alla</code>:删除所有块，保留控制 alpha 透明通道的块。
- <code>reduce</code>：尝试减少调色板使用的颜色数量。

---

#### WEBP

<code>Webp</code>具有多个优异的特性，包括：较高的视觉体验，而且优秀的压缩率，并且支持动画和透明度。但是，和所有新技术一样，不可避免会有一些兼容性问题。所以在使用的时候应该考虑浏览器的兼容问题。

---

##### WebP 转化

最好使用构建工具辅助完成，比如通过 npm 安装<code>webp-loader</code>，然后在<code>webpack.config.js</code>中配置：

```js
loader: [
  {
    test: /\.(png|jpg|gif)$/i,
    loader: ["file-loader", "webp-loader?{quality:13}"],
  },
];
```

---

#### Base64

<code>Base64</code>并不是一种图像文件格式，而是一种用于传输 8 位字节码的编码方式。它通过将编码直接写入 HTML 或 CSS 中实现图像的展示。一般将<code>Base64</code>编码的图片作为静态资源引入，减少请求次数。

**浏览器会自动解析该编码并展示出图像，而无须发起任何关于该图像的 URL，这就是<code>Base64</code>的优点，同时也有一定缺点，图像大小会膨胀四分之三。下面是一些使用<code>Base64</code>编码的建议：**

- 图像文件的实际尺寸是否很小
- 图像文件的更新频率是否很低，以避免在使用<code>Base64</code>时，增加多的维护成本。

---

### 3.3 使用建议

这部分给出一些在实际的开发条件下的优化建议以及注意事项。

#### CSS Sprite

这个技术就是我们常说的雪碧图，通过将多个小图标拼成一张大图，然后通过 CSS 的 background-position 属性来定位到对应的小图标。  
**这个技术在我看来已经淘汰了，由于以下缺点：**

1. 如果图标变化了，那么需要重新拼接雪碧图，而且雪碧图会很大，而且需要服务器支持。
2. 随着图标增多，浏览器加载图片的时间也会增加。

#### Web 字体

<code>Web</code>字体，通过<code>@font-face</code>标签引入，然后通过<code>@font-family</code>属性来使用。在我看来一些应该图标 ICON 的都应该使用<code>Web</code>字体，因为<code>Web</code>字体的图标，可以更好的适应不同尺寸的设备，而且能够保证图标质量。

**同时由于矢量图标打包到一个<code>Web</code>字体文件中，这个文件的大小通常不会很大，这个时候将字体格式文件编译为<code>Base64</code>编码，可以减少请求次数，这样的优化可以大幅减少页面加载时间。以下是操作建议：**

1. **在 iconfont 下载的 CSS 文件中将代码修改如下文**

```css
@font-face {
  font-family: "iconfont"; /* Project id 4381127 */
  src: url("data:font/truetype;charset=utf-8;base64,Base64String") format("truetype");
}
```

2. **将 iconfont 文件的 TTF 文件转化为 Base64 编码，并且将生成的 Base64 编码替换掉@font-face 中的 Base64String**
3. **在 App.vue 中引入 iconfont.css**

**这里是参考的网址**[icon 转 base64 流程。](https://blog.csdn.net/yanyunqi02/article/details/130655841)

---

## 四丶加载优化

第三章讲了图片的格式选取以及本身资源压缩优化，其实这还无法满足期望，我们还需要在资源加载的过程中进行优化，主要是三个小点：

1. **资源的优先级**
2. **延迟加载**
3. **预加载**

---

### 4.1 图像延迟加载

延迟加载是指在首次打开网站时。应当尽量只加载首屏内容所包含的资源，而首屏之外涉及的图片或视频，可以等用户滚动到该区域时才加载。

图像的延迟加载其实就是我们平时所了解的图片懒加载，这里有很多方法可以实现懒加载：

- **传统方式**——通过监听 scroll 事件和 resize 事件，判断图片是否进入可视区域，然后将<code>data-src</code>上面的<code>url</code>替换为<code>src</code>，这种方法优点是浏览器兼容性好，缺点是持续监听十分消耗性能。
- <code>Intersection Observer</code>**(推荐)**——通过 IntersectionObserver API，判断图片是否进入可视区域，然后加载图片，原理类似传统方式，优点是简洁高效，缺点是浏览器可能不兼容(目前来说出现情况很少),以下是代码实现:

```js
//获取img所有img标签的lazy类
const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
//当进入视口判断距离时，加载图片
let lazyImageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove("lazy");
        //取消监听
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  },
  //这里是控制图片距离视口的距离来加载图片
  { rootMargin: "0px 0px 300px 0px" }
);
//监听
lazyImages.forEach((lazyImage) => {
  lazyImageObserver.observe(lazyImage);
});
```

**原生延迟**——通过 <code>img</code> 标签的 <code>lazy</code> 属性实现懒加载,这种方式目前是最简洁的，但兼容不是很好，这里不多赘述。

---

### 4.2 加载注意事项

对于图像的延迟加载，从理论上必然会对性能产生重要的影响，但在实现过程中有许多细节需要注意，稍有差池可能会造成负面结果。

#### 4.2.1 资源占位

当延迟加载的资源尚未加载完成时，应该显示一个有相同尺寸的占位图像，如果不使用占位图像，那么图像延迟显示出来后，尺寸更改可能会使页面布局出现偏移。  
这个现象不仅带来负面体验，更严重的会造成**页面的重绘和回流，影响页面性能。**所以建议占位图像应该与延迟加载的资源尺寸相同，而且可以采用<code>Base64</code>图片。

---

### 4.3 资源优先级

浏览器向网络请求到所有数据，本非每个字节都具有相同的优先级或重要性。一般浏览器会先加载<code>CSS</code>文件，然后再加载<code>JS</code>文件，即便如此也不能保证这个加载顺序是准确的。

#### 4.3.1 优先级

浏览器基于自身的启发式算法，会对资源的重要性进行划分等级，通常从低到高分为：<code>Lowest</code>、<code>Low</code>、<code>High</code>、<code>Highest</code>。  
当资源对用户至关重要却被分到了过低的优先级时，这个时候就可以尝试**预加载**,**预连接**,**预提取**等方式来进行优化。

#### 4.3.2 预加载

使用<code>link</code>标签告诉浏览器当前指定的资源具有更高优先级：

```js
<link rel="perload" as='style' href="styles.css">
```

#### 4.3.3 预连接

与 DNS 预解析类似，preconnect 不仅完成 DNS 预解析，同时还将进行 TCP 握手和建立传输层协议。可以这样使用

```js
<link rel="preconnect"  href="http://example.com">
```

#### 4.3.4 预获取

如果我们确定某个资源将来一定会被使用到，我们可以让浏览器预先请求该资源并放入浏览器缓存中，也就是说如果我们猜测用户接下来将要访问哪个具体的资源，那就可以用 prefetching 来预加载确定的资源了。

```js
<link rel="prefetch"  href="image.png">
```

---

## 五丶书写高性能的代码

每当页面响应用户的交互时，可能会涉及成千上万行<code>JavaScript</code>的代码执行,高性能网站对这个过程的要求是不仅执行顺畅吴 BUG，能对用户的操作能更快响应，而且在执行完任务的同时占用更少的资源。所以要书写高性能的<code>JavaScript</code>代码能够在用户的浏览器中准确且高效地执行，这一点至关重要。

---

### 5.1 数据存取
