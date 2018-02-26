require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var fs = require('fs')
var klaw = require('klaw')
var _ = require('lodash')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = {
  'dev':config.dev.proxyTable,
  'local': config.local.proxyTable
}

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

getApiUrls(function(apiUrls){
  // mock api requests
  if (process.env.NODE_ENV === 'development'){
    console.log('------------------------------mock------------------------')
    server(apiUrls);
  } else if (process.env.NODE_ENV === 'debug') {
    console.log('-----------------------------proxy test server---------------------------')
    // proxy api requests
    Object.keys(proxyTable.dev).forEach(function (context) {
      var options = proxyTable.dev[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(options.filter || context, options))
    })
  } else if (process.env.NODE_ENV === 'local') {
    console.log('-----------------------------proxy local server---------------------------')
    // proxy api requests
    Object.keys(proxyTable.local).forEach(function (context) {
      var options = proxyTable.local[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(options.filter || context, options))
    })
  }
})

function getApiUrls(cb) {
  var mockDir = path.join(__dirname, '../mock');
  var routers = {
    '/':{}
  };
  var mockFiles = [];
  klaw(mockDir)
    .on('data', function(item){
      //如果是js文件
      if (/^.*\.js$/.test(item.path)){
        mockFiles.push(item.path);
      }
    })
    .on('end', function(){
      mockFiles.forEach(function(route){
        try{
          var routeObj = require(route);
          if (routeObj.$router) {
            routers[routeObj.$router] = routeObj;
          } else {
            routers['/'] = Object.assign({}, routers['/'], routeObj);
          }
          delete routeObj.$router;
        }
        catch (e){
          console.log(e);
        }
      })
      cb && cb(routers);
    })
}

function server(routers) {
  // 常用的请求方法
  var methodFlag = ['$get', '$post']; 
  var router = new express.Router();
  Object.keys(routers).forEach(function(key) {
    var routerConfig = routers[key];
    Object.keys(routerConfig).forEach(function (routeKey) {
      var routeHandle = routerConfig[routeKey];
      //如果内容是一个函数
      if (_.isFunction(routeHandle)) {
        router.use(routeKey, routeHandle);
      } // 如果内容是一个对象
      else if (_.isObject(routeHandle)){
        //如果对象属性有methodFlag数组中的某个方法
        if (methodFlag.some(function(item){
          return routeHandle[item];
        })){
          methodFlag.forEach(function(item){
            if (routeHandle[item]){
              if (_.isFunction(routeHandle[item])){
                router[item.toLowerCase().replace('$', '')](routeKey, routeHandle[item]);
              } //如果$get或$post是对象
              else if (_.isObject(routeHandle[item])){
                router[item.toLowerCase().replace('$', '')](routeKey, function(req, res, next){
                  res.json(routeHandle);
                  next();
                })
              }
            }
          })
        }
        //如果只是普通对象
        else {
          router.use(routeKey, function(req, res, next){
            res.json(routeHandle);
            next();
          })
        }
      }
      //如果内容是字符串
      else if (_.isString(routeHandle)){
        router.use(routeKey, function(req, res, next){
          res.json(routeHandle);
          next();
        })
      }
    })
  })
  //将路由挂载至应用
  app.use('/', router);
}

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
