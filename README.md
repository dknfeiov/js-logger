# 前言

前端错误兼容，及时发现线上问题并排查，提供良好的错误展示


## 技术栈

> `angular@5.0` +  
> `ng-zorro-antd@0.7.0`



## 项目运行

#### 注意：由于Angular版本较新，nodejs 版本至少是 9.0 以上

```
git clone git@github.com:dknfeiov/common-client.git

cd common-client （进入当前的项目）

npm install  (安装依赖包)

npm start (运行本地开发环境 ：localhost:7777 )

npm run build (打包，编译后文件存放在 /dist 目录下)

```

## 说明

>  开发环境 win7  Chrome 63（64 位） nodejs 9.8.0
>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍

#### 
```
{
  code: number; // 状态码
  data: {       // 数据
      list?: Array<any>;
  } | any;
  msg: string;  // 提示信息
}
```

## 功能一览
- [√] 前端错误兼容
- [√] 良好的错误格式展示


## TODO
- 上报过滤 filter
- 上报限流

## 线上实例

