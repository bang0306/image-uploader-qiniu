# 介绍

这是一个可以方便地将你的屏幕截图上传到七牛云盘，并生成markdown链接的工具。方便你在编写MD时，插入截图。

# 安装

依赖electron环境

如果没有请先

```sh
sudo npm i -g electron --unsafe-perm=true --allow-root
```

```sh
sudo npm i -g screenshot2qiniu --unsafe-perm=true --allow-root
```

# 第一次使用配置

```sh
$ sudo qiniu-upload # 配置需要写权限，这里要加上sudo
还没有配置，[n]取消，任意键继续 #任意键继续配置
accessKey: # 公钥
secretKey: # 密钥
bucket: # 存储空间
domain: # 域名
server-position: [0:华北 1:华东 2:华南 3:北美]# 服务器地址，采用数字选择
```

![](http://ov532c17r.bkt.clouddn.com/88wtr9m10ll.png)

配置完也可以直接使用，使用方法见【使用方法】。

以下是上述各种配置在七牛云面板中的位置。

![](http://ov532c17r.bkt.clouddn.com/6e8eoo1mpv7.png)

![](http://ov532c17r.bkt.clouddn.com/fnq412ugvoj.png)

# 使用方法

1、确保你已使用截图工具将图像放在了剪切板中

2、命令

```sh
$ qiniu-upload # 可以不用sudo
启动成功，按r键把剪切板里的图片上传到七牛云里吧，按q键退出
```

3、按照提示按r键，回车，就会看到

![](http://ov532c17r.bkt.clouddn.com/cx72sae5trc.png)

直接在md编辑器中粘贴，即可看到图片

4、上传成功后，会自动进入等待状态，如果继续上传图片，只需要截图后按r就可以了

# 注意事项

如果长时间处于等待状态下不用，token会过期。退出工具，重新输入`qiniu-upload`启动就可以了

















































