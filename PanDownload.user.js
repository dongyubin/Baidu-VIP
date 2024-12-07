// ==UserScript==
// @name              百度网盘SVIP高速解析下载直链的助手-文武PanDownload
// @namespace         https://github.com/dongyubin/Baidu-VIP
// @version           1.6
// @description       百度网盘SVIP解析高速直链的脚本助手，100%可用，支持 Gopeed、IDM、NDM 等多线程下载工具。
// @author            dongyubin
// @homepage          https://fk.wwkejishe.top/buy/23
// @license           MIT
// @icon              https://fk.wwkejishe.top/uploads/images/6e798005b00ce678782af4e6931f4374.png
// @require           https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.18/layui.min.js
// @resource          layuiCSS https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.18/css/layui.css
// @require           https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @match             *://pan.baidu.com/*
// @match             *://yun.baidu.com/*
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/disk/timeline*
// @match             *://yun.baidu.com/disk/timeline*
// @match             *://pan.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/main*
// @match             *://pan.baidu.com/disk/base*
// @match             *://yun.baidu.com/disk/base*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/aipan/*
// @match             *://yun.baidu.com/aipan/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @match             *://openapi.baidu.com/*
// @connect           aifenxiang.net.cn
// @connect           baidu.com
// @connect           *
// @connect           127.0.0.1
// @grant             GM_cookie
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_notification
// @antifeature       ads
// @antifeature       membership
// @antifeature       referral-link
// ==/UserScript==
(function () {
  'use strict';
  const layuiCss = GM_getResourceText('layuiCSS');
  GM_addStyle(layuiCss);
  const wwConfig = {
    mainUrl: 'https://aifenxiang.net.cn:8081',
    bdPassword: '1234',
    titleName: '文武Download',
    goPeedTaskUrl: 'http://127.0.0.1:9999/api/v1/tasks'
  };
  layui.use(['layer'], async function () {
    var layer = layui.layer,
      $ = layui.$;
    var form = layui.form;
    if (location.href.startsWith('https://pan.baidu.com/s/')) {
      $('.x-button-box').prepend(
        '<a class="g-button" id="downbtn_share" style="background-color: #6800ff;color: #fff;border:none;"  href="javascript:;" ><span class="g-button-right"><em style="top:0;" class="icon icon-download" title=""></em><lable class="text" style="width: auto;">' +
        wwConfig.titleName +
        '</lable></span></a>'
      );
    } else {
      if ($('.tcuLAu').is('*')) {
        $('.tcuLAu').prepend(
          '<span class="g-dropdown-button"><a id="downbtn_main"  style=" margin-right: 10px;color: #fff;background-color: #fc5531;border:none;" id="downbtn_main" class="g-button" ><span class="g-button-right"><em style="top:0;" class="icon icon-download" ></em><lable class="text" style="width: auto;">' +
          wwConfig.titleName +
          '</lable></span></a></span>'
        );
      } else {
        $('.wp-s-agile-tool-bar__header.is-header-tool').prepend(
          '<div class="wp-s-agile-tool-bar__h-group"><button style=" margin-right: 10px;color: #fff;background-color: #06a7ff;border:none;" id="downbtn_main" class="u-button nd-file-list-toolbar-action-item" ><i style="top:0;" class="iconfont icon-download"></i> <lable>' +
          wwConfig.titleName +
          '</lable></button></div>'
        );
      }
    }
    $('#downbtn_share').click(function () {
      swal({
        title: '提示',
        text: '请先保存到自己的网盘后，在网盘里解析下载!',
        icon: 'warning',
      });
      return false;
    });
    $('#downbtn_main').click(function () {
      let select = selectList();
      let selected = Object.keys(select);
      if (selected.length == 0) {
        swal({
          text: '请先选择一个文件',
          icon: 'warning',
        });
        return false;
      } else if (selected.length > 1) {
        swal({
          text: '目前仅支持单个文件解析',
          icon: 'warning',
        });
        return false;
      } else if (select[selected[0]].isdir == 1) {
        swal({
          text: '目前不支持文件夹解析',
          icon: 'warning',
        });
        return false;
      }

      const wwJieXiDiv = document.createElement('div');
      let createDiv = `
        <div>
        <img src="https://cdn.wwkejishe.top/wp-cdn-02/2024/202411171346351.webp" style="width:240px;height:240px;">
        </div>
        <div>
         <input style="border:1px solid #ccc; width:60%;height:40px;text-indent:20px;" type="text" autocomplete="off" placeholder="请输入验证码" id="wpCode"/>
        </div>
        `;
      wwJieXiDiv.innerHTML = createDiv;

      const openInfoLayer = layer.open({
        type: 1,
        area: ['450px', '300px'],
        title: '提示',
        shade: 0.6,
        shadeClose: true,
        anim: 0,
        content: `
          <div class="layui-form" lay-filter="filter-test-layer" style="width:360px;margin: 16px auto 0;">
            <div class="demo-send-container">
                <div style="margin-top:50px;">
                  <p>插件解析限制 2 次</p>
                  <p>
                    Gopeed 下载器一定要配置好 User-Agent 和端口: <a style="color:red;" target="_blank" href="https://flowus.cn/share/c68e3c55-67e5-460f-b937-7727e0378a34?code=BCRWJL">点击查看Gopeed配置教程说明</a>
                  </p>
                  <p>
                    不限次数 PC 网页稳定版: <a style="color:red;" target="_blank" href="https://pandown.mlover.site/">点击前往</a>
                  </p>
                </div>
               <button style="margin-left:0;margin-top:30px;" id="parseBtn" class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-send">点击发送到Gopeed</button>
            </div>
          </div>
            `,
        success: function () {
          // 对弹层中的表单进行初始化渲染
          form.render();
          // 表单提交事件
          form.on('submit(demo-send)', async function (data) {
            $('#parseBtn').html('<p>正在发送中,请稍后...</p>');
            let testDown = await testSendToGopeed();

            if (!testDown) {
              layer.close(openInfoLayer);
              swal({
                title: "下载 Gopeed 加速器",
                text: '请先安装 Gopeed 并打开运行(点击按钮下载 Gopeed)。',
                icon: 'warning',
                type: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: '点击下载Gopeed',
                confirmButtonColor: "#dd6b55",
              }).then(function () {
                window.open('https://pan.quark.cn/s/0b2e9c6e94b0');
              });
              $('#parseBtn').html('<p>发送到Gopeed</p>');
              return;
            }
            share_one_baidu(openInfoLayer, 1234);
          });
        },
      });
    });
  });
  function selectList() {
    var select = {};
    var option = [];

    try {
      option =
        require('system-core:context/context.js').instanceForSystem.list.getSelected();
    } catch (e) {
      option = document.querySelector('.wp-s-core-pan').__vue__.selectedList;
    }
    option.forEach((element) => {
      select[element.fs_id] = element;
    });
    return select;
  }
  function share_one_baidu(openInfoLayer, code) {
    let select = Object.keys(selectList());
    let bdstoken = '';
    let data_json = {};
    try {
      data_json = $('html')
        .html()
        .match(/(?<=locals\.mset\()(.*?)(?=\);)/)[0];
      data_json = JSON.parse(data_json);
      wwConfig.username = data_json.username;
      bdstoken = data_json.bdstoken;
    } catch (e) {
      data_json = $('html')
        .html()
        .match(/(?<=window\.locals\s=\s)(.*?)(?=;)/)[0];
      data_json = JSON.parse(data_json);
      wwConfig.username = data_json.userInfo.username;
      bdstoken = data_json.userInfo.bdstoken;
    }

    wwConfig.data_json = data_json;

    const param = {
      bdstoken: bdstoken,
      period: 1,
      pwd: wwConfig.bdPassword,
      eflag_disable: true,
      channel_list: '%5B%5D',
      schannel: 4,
      fid_list: JSON.stringify(select),
    };

    $.ajax({
      type: 'GET',
      url: 'https://pan.baidu.com/share/set',
      async: true,
      data: {
        bdstoken: bdstoken,
        period: 1,
        pwd: wwConfig.bdPassword,
        eflag_disable: true,
        channel_list: '%5B%5D',
        schannel: 4,
        fid_list: JSON.stringify(select),
      },
      dataType: 'json',
      success: function (res) {
        if (res.show_msg.indexOf('禁止') > -1) {
          swal({
            text: '该文件禁止分享',
            icon: 'error',
          });
          return false;
        } else {
          let shorturl = '';
          try {
            shorturl = res.link.split('/').pop();
          } catch (error) {
            swal({
              text: '初始化准备失败',
              icon: 'error',
            });
            return false;
          }
          fetch(wwConfig.mainUrl + '/wp/getCodeNum', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
              userKey: 'main',
              fsId: select[0],
              version: '1.1.2',
            }),
          })
            .then((resp) => resp.json())
            .then((res) => {
              let laysermsg = layer.msg('正在解析中', {
                icon: 6,
                time: 10000,
              });
              if (res.code == 200) {
                wwConfig.code = code;
                if (res.data > 100) {
                  get_down_list(
                    shorturl,
                    wwConfig.bdPassword,
                    openInfoLayer,
                    res.data,
                    laysermsg
                  );
                } else if (res.data == 80) {
                  layer.msg('解析中', {
                    icon: 6,
                    time: 3000,
                  });
                  setTimeout(() => {
                    $('#parseBtn').html('<p>解析</p>');
                    layer.alert('解析通道比较拥堵，请重试！', {
                      title: '提示',
                    });
                  }, 3000);
                } else if (res.data == 60) {
                  layer.msg('解析中', {
                    icon: 6,
                    time: 3000,
                  });
                  setTimeout(() => {
                    $('#parseBtn').html('<p>解析</p>');
                    layer.alert('解析次数已达上限，不限次数稳定版！', {
                      title: '提示',
                    }, function () {
                      window.open('https://pandown.mlover.site');
                    });
                  }, 3000);
                } else if (res.data == 50) {
                  layer.alert(
                    '验证码错误,一个验证码只能下载一个文件,请重新获取！',
                    {
                      title: '提示',
                    }
                  );
                } else {
                  layer.alert(
                    '验证码错误,一个验证码只能下载一个文件,请重新获取！',
                    {
                      title: '提示',
                    }
                  );
                }
              } else if (res.code == 500) {
                layer.close(openInfoLayer);
                layer.close(laysermsg);
                swal({
                  text: res.msg,
                  icon: 'warning',
                });
              }
            });
        }
      },
      error: function (res) {
        swal({
          text: '初始化准备请求访问失败',
          icon: 'error',
        });
      },
    });
  }

  async function get_down_list(shorturl, password, openInfoLayer, pwd, laysermsg) {
    let ajax_data = {
      shorturl: shorturl,
      pwd: password,
      dir: 1,
      root: 1,
      userKey: 'main',
    };

    fetch(wwConfig.mainUrl + '/wp/parseCopyLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ajax_data),
    })
      .then((resp) => resp.json())
      .then((res) => {
        if (res.code == 200) {
          const size = parseInt(res.data.data.list[0].size);
          if (size > 3221225472) {
            layer.close(openInfoLayer);
            layer.close(laysermsg);
            $('#parseBtn').html('<p>发送到Gopeed</p>');
            swal({
              text: '文件大于 3G，插件暂不支持下载，请前往 PC 网页版下载！',
              icon: 'warning',
            });
            return false;
          }
          const requestData = {
            fsId: res.data.data.list[0].fs_id,
            shareid: res.data.data.shareid,
            uk: res.data.data.uk,
            sekey: res.data.data.seckey,
            randsk: res.data.data.seckey,
            fs_ids: [res.data.data.list[0].fs_id],
            path: res.data.data.list[0].server_filename,
            size: res.data.data.list[0].size,
            surl: shorturl,
            url: `https://pan.baidu.com/s/${shorturl}`,
            userKey: 'main',
            pwd: password,
            dir: '/',
          };
          console.log(requestData);
          GM_xmlhttpRequest({
            method: 'POST',
            url: wwConfig.mainUrl + '/wp/dlink',
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify(requestData),
            onload: function (response) {
              const responseData = JSON.parse(response.responseText);
              console.log(responseData);
              if (responseData.code !== 200) {
                layer.close(openInfoLayer);
                layer.close(laysermsg);
                swal({
                  text: responseData.msg,
                  icon: 'warning',
                });
              } else {
                layer.close(laysermsg);
                $('#parseBtn').html('<p>发送到Gopeed</p>');
                if (responseData.data.vip) {
                  wwConfig.url = responseData.data.data[0].url;
                  wwConfig.ua = responseData.data.data[0].ua;
                } else {
                  wwConfig.url = responseData.data.data.urls[0].url;
                }
                sendToGopeed(res.data.data.list[0]);
              }
            },
            onerror: function (response) {
              layer.close(openInfoLayer);
              layer.close(laysermsg);
              const errorMessage =
                JSON.parse(response.responseText).message || '网络错误';
              swal({
                text: '发送到Gopeed遇到问题了，请刷新重试即可！！',
                icon: 'warning',
              });
            },
          });
        } else {
          layer.close(openInfoLayer);
          layer.close(laysermsg);
          $('#parseBtn').html('<p>发送到Gopeed</p>');
          swal({
            text: '发送到Gopeed遇到问题了，请升级插件刷新重试即可！！',
            icon: 'warning',
          });
        }
      });
  }
  function testSendToGopeed() {
    return fetch(wwConfig.goPeedTaskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        return true;
      }).catch(e => {
        return false;
      })
  }
  function sendToGopeed(item) {
    fetch(wwConfig.goPeedTaskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        req:
        {
          url: wwConfig.url,
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
        layer.confirm(`请打开 Gopeed 查看 ${item.server_filename} 是否开始下载？未下载成功，可设置IDM/NDM UA设置：<code>netdisk;1.0.1</code>，再复制直链下载！`, {
          btn: ['已下载，关闭弹窗', '未下载，复制直链']
        }, function (index) {
          layer.close(index);
        }, function () {
          GM_setClipboard(wwConfig.url, "text");
          layer.msg(`${item.server_filename} 的直链复制成功！`);
        });
      }).catch(e => {
      })
  }
  setInterval(() => {
    GM_xmlhttpRequest({
      method: 'get',
      url: wwConfig.goPeedTaskUrl + '?status=running',
      headers: {
        'Content-Type': 'application/json',
      },
      onload: function (response) {
        const responseData = JSON.parse(response.responseText);
        const result = responseData.data.filter(e =>
          e.status === "running"
        ).filter((e) => e.progress.speed < 1048576).map(e => e.id);
        const ids = result.map((e) => {
          return `id=${e}`
        }).join('&')
        if (ids && ids.length) {
          GM_xmlhttpRequest({
            method: 'put',
            url: `${wwConfig.goPeedTaskUrl}/pause?${ids}`,
            headers: {
              'Content-Type': 'application/json',
            },
            onload: function (response) {
              GM_xmlhttpRequest({
                method: 'put',
                url: `${wwConfig.goPeedTaskUrl}/continue?${ids}`,
                headers: {
                  'Content-Type': 'application/json',
                },
                onload: function (response) {
                }
              })
            }
          })
        }
      }
    })
  }, 15000)

})();