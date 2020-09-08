# website
The new Kleros website.
关于在windows上运行该系统遇到的一些坑：

- 提示
```
gatsby : 无法加载文件 C:\Users\xxx\AppData\Roaming\npm\gatsby.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅
https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
````

在powershell运行：`Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope LocalMachine`
[参考的解决方案](https://github.com/gatsbyjs/gatsby/issues/16907)

- 安装web3依赖的时候报错：
```
pm ERR! Error while executing:
npm ERR! d:\Program Files\Git\cmd\git.EXE ls-remote -h -t git://github.com/frozeman/WebSocket-Node.git
```

这个问题是因为windows防火墙禁止通过`git://.git`方式进行访问，一般是在公司网络才会遇到，家庭网络没有复现。解决方案是首先将`git://`全局替换为`htpps://`，即：
 `git config --global url."https://".insteadOf git://`
然后再配置不校验https
`git config --global http.sslverify "false"`

- 编译运行的时候，提示
```
WorkerError: Processing D:/github/website/src/assets/images/gatsby-astronaut.png failed
```
解决方案是把这个文件先移除，然后就正常了。。。。

- 使用`npm run develop`报错
这个没找到原因，直接运行`gatsby develop`即可

- 接近成功的时候报错：
```
Generating development JavaScript bundle failed

Can't resolve 'bignumber.js' in 'D:\github\website\src\pages'
```
简单，安装bignumer.js即可 `npm install bignumber.js`

- 成功运行，访问  http://localhost:8000/时报错URL无效

这是由于interface.js文件初始化web3的时候，需要提供web3 provider url，而代码中将这个URL的值设置在环境变量(process.env.GATSBY_WEB3_PROVIDER_URL)里。
```
var web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.GATSBY_WEB3_PROVIDER_URL))
```
Kleros官方slack的dev频道里要到了相关的URL 'wss://mainnet.infura.io/ws/v3/b0aa0426596b431186f7ad5027xxxxxx'，在windows系统环境变量里设置没生效，直接在代码里替换了
```
var web3 = new Web3(new Web3.providers.WebsocketProvider(wss://mainnet.infura.io/ws/v3/b0aa0426596b431186f7ad5027xxxxxx))
```
不过后来ferit说他故意设置的后几位xxxxx表示占位符，让我自己去infura申请一个token。
