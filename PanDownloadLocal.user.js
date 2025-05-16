// ==UserScript==
// @name         文武直链助手-百度网盘在线解析网页直链获取助手
// @namespace    https://github.com/dongyubin/Baidu-VIP
// @version      0.9
// @description  不限制速度的百度网盘SVIP解析直链网页获取助手，支持 Gopeed（一键解析）、IDM、NDM 等多线程极速下载工具
// @author       DongYubin
// @homepage     https://fk.wwkejishe.top/buy/23
// @supportURL   https://fk.wwkejishe.top/buy/23
// @license      MIT
// @match        https://pandown.wangdu.site/*
// @icon         https://fk.wwkejishe.top/uploads/images/6e798005b00ce678782af4e6931f4374.png
// @resource     layuiCSS https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.20/css/layui.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.20/layui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
// @grant        GM_cookie
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// ==/UserScript==
const layuiCss = GM_getResourceText('layuiCSS');
GM_addStyle(layuiCss);
function addXMLRequestCallback(callback) {
  var oldSend, i;
  if (XMLHttpRequest.callbacks) {
    // we've already overridden send() so just add the callback
    XMLHttpRequest.callbacks.push(callback);
  } else {
    // create a callback queue
    XMLHttpRequest.callbacks = [callback];
    // store the native send()
    oldSend = XMLHttpRequest.prototype.send;
    // override the native send()
    XMLHttpRequest.prototype.send = function () {
      // process the callback queue
      for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
        XMLHttpRequest.callbacks[i](this);
      }
      // call the native send()
      oldSend.apply(this, arguments);
    }
  }
}

const wwConfig = {
  goPeedTaskUrl: 'http://127.0.0.1:9999/api/v1/tasks',
}

// e.g.
addXMLRequestCallback(function (xhr) {
  xhr.addEventListener("load", function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const url = xhr.responseURL;
      // console.log('拦截返回：', xhr);
      if (url.includes('https://api.aifenxiang.net.cn/wp/fast/pc/dlink')) {
        try {
          const responseData = JSON.parse(xhr.responseText);
          const downloadUrl = responseData.data.data.dlink;
          const ua = responseData.data.data.ua;
          layer.open({
            content: `未下载成功，先设置IDM/NDM User-Agent:<code>` + ua + `</code>，再复制直链下载！`,
            btn: ['已下载，关闭弹窗', '复制UA', '未下载，复制直链'],
            closeBtn: 0,
            type: 1,
            btn1: function (index, layero, that) {
              layer.close(index);
            },
            btn2: function (index, layero, that) {
              GM_setClipboard(ua, "text");
              layer.msg('UA复制成功！');
              return false;
            },
            btn3: function (index, layero, that) {
              GM_setClipboard(downloadUrl, "text");
              layer.msg(`直链复制成功！`);
              layer.close(index);
            }
          });
          // alert('下载链接: ' + downloadUrl);
        } catch (e) {
          console.error('解析响应时出错: ', e);
        }
      }
      else if (url.includes('https://api.aifenxiang.net.cn/wp/pc/dlink')) {
        try {
          const responseData = JSON.parse(xhr.responseText);
          wwConfig.downloadUrl = responseData.data.dlink;
          wwConfig.ua = responseData.data.ua;
          wwConfig.filename = responseData.data.filename;
          sendToGopeed();
          // layer.open({
          //   content: `未下载成功，先设置IDM/NDM User-Agent:<code>` + ua + `</code>，再复制直链下载！`,
          //   btn: ['已下载，关闭弹窗', '复制UA', '未下载，复制直链'],
          //   closeBtn: 0,
          //   type: 1,
          //   btn1: function (index, layero, that) {
          //     layer.close(index);
          //   },
          //   btn2: function (index, layero, that) {
          //     GM_setClipboard(ua, "text");
          //     layer.msg('UA复制成功！');
          //     return false;
          //   },
          //   btn3: function (index, layero, that) {
          //     GM_setClipboard(downloadUrl, "text");
          //     layer.msg(`直链复制成功！`);
          //     layer.close(index);
          //   }
          // });
          // layer.confirm(`未下载成功，先设置IDM/NDM User-Agent:<code>` + ua + `</code>，再复制直链下载！`,
          //   {
          //     btn: ['已下载，关闭弹窗', '复制UA', '未下载，复制直链'],
          //     closeBtn: 0,
          //   }, function (index) {
          //     layer.close(index);
          //   }, function (index) {
          //     GM_setClipboard(ua, "text");
          //     layer.msg(`UA复制成功！`);
          //     return false;
          //   }, function () {
          //     GM_setClipboard(downloadUrl, "text");
          //     layer.msg(`直链复制成功！`);
          //     layer.close(index);
          //   });
          // alert('下载链接: ' + downloadUrl);
        } catch (e) {
          console.error('解析响应时出错: ', e);
        }
      }
    }

  });
});

// Intercept fetch requests
// (function () {
//   const originalFetch = window.fetch;
//   window.fetch = function () {
//     return originalFetch.apply(this, arguments).then(async response => {
//       const url = response.url;
//       if (url.includes('http://127.0.0.1:9999/api/v1/tasks')) {
//         try {
//           const responseClone = response.clone();
//           const responseData = await responseClone.json();
//           console.log('拦截请求：', responseData);
//         } catch (e) {
//           console.error('解析响应时出错: ', e);
//         }
//       }
//       return response;
//     });
//   };
// })();

function sendToGopeed() {
  fetch(wwConfig.goPeedTaskUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      req:
      {
        url: wwConfig.downloadUrl,
        extra: {
          header: {
            "User-Agent": wwConfig.ua,
          }
        }
      },
      opt: {
        extra: {
          connections: 256,
        }
      }
    }),
  }).then((resp) => resp.json())
    .then((res) => {
      layer.open({
        content: `请打开 Gopeed 查看 <span style="color:rgba(5,150,105,1);">${wwConfig.filename}</span> 是否开始下载？未下载成功，先设置IDM/NDM User-Agent:<code>` + wwConfig.ua + `</code>，再复制直链下载！`,
        btn: ['已下载，关闭弹窗', '复制UA', '未下载，复制直链'],
        closeBtn: 0,
        type: 1,
        btn1: function (index, layero, that) {
          layer.close(index);
        },
        btn2: function (index, layero, that) {
          GM_setClipboard(wwConfig.ua, "text");
          layer.msg('UA复制成功！');
          return false;
        },
        btn3: function (index, layero, that) {
          GM_setClipboard(wwConfig.url, "text");
          layer.msg(`${wwConfig.filename} 的直链复制成功！`);
          layer.close(index);
        }
      });
    }).catch(e => {
    })
}