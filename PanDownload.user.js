// ==UserScript==
// @name              2025最新可用-百度网盘SVIP高速解析直链的不限速下载助手-文武PanDownload
// @namespace         https://github.com/dongyubin/Baidu-VIP
// @version           7.3
// @description       2025年3月持续更新可用，不限制速度的百度网盘SVIP解析高速直链的脚本助手，无视黑号，100%可用，不限制文件大小，下载速度最快可达10M+/s，支持 Gopeed（一键解析）、IDM、NDM 等多线程极速下载工具，支持 Google Chrome、Microsoft Edge、Firefox 等浏览器。
// @author            dongyubin
// @homepage          https://fk.wwkejishe.top/buy/23
// @supportURL        https://fk.wwkejishe.top/buy/23
// @license           MIT
// @icon              https://fk.wwkejishe.top/uploads/images/6e798005b00ce678782af4e6931f4374.png
// @resource          layuiCSS https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.20/css/layui.min.css
// @require           https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.20/layui.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
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
// @connect           api.aifenxiang.net.cn
// @connect           baidu.com
// @connect           *
// @connect           127.0.0.1
// @grant             GM_cookie
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_notification
// @grant             GM_info
// @grant             GM_getValue
// @grant             GM_setValue
// @antifeature       ads
// @antifeature       membership
// @antifeature       referral-link
// @downloadURL https://update.greasyfork.org/scripts/518023/2025%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E9%AB%98%E9%80%9F%E8%A7%A3%E6%9E%90%E7%9B%B4%E9%93%BE%E7%9A%84%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B-%E6%96%87%E6%AD%A6PanDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/518023/2025%E6%9C%80%E6%96%B0%E5%8F%AF%E7%94%A8-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E9%AB%98%E9%80%9F%E8%A7%A3%E6%9E%90%E7%9B%B4%E9%93%BE%E7%9A%84%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B-%E6%96%87%E6%AD%A6PanDownload.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const layuiCss = GM_getResourceText('layuiCSS');
  GM_addStyle(layuiCss + `
    .layui-icon-close:before {
      content: "x" !important;
    }
    li {
      list-style: normal !important;
    }
  `);
  const wwConfig = {
    mainUrl: 'https://api.aifenxiang.net.cn',
    bdPassword: '1234',
    titleName: '文武PanDownload',
    goPeedTaskUrl: 'http://127.0.0.1:9999/api/v1/tasks',
    one_parse: {
      code: '1.1.2',
      version: '1.1.4'
    },
    wx_parse: {
      version: "1.0.9"
    },
    gopeed: {
      name: 'GoPeed',
      url: 'https://pan.quark.cn/s/0b2e9c6e94b0'
    },
    ndm: {
      name: 'NDM',
      url: 'https://neatdownloadmanager.com/index.php/en/'
    },
    idm: {
      name: 'IDM',
      url: 'https://www.wangdu.site/software/tools/380.html'
    },
    pandown: {
      month: 'https://fk.wwkejishe.top/buy/23',
      quarter: 'https://fk.wwkejishe.top/buy/24',
      halfYear: 'https://fk.wwkejishe.top/buy/25',
      year: 'https://fk.wwkejishe.top/buy/26',
      life: 'https://fk.wwkejishe.top/buy/27'
    },
    liulanqi: {
      chrome: 'https://www.google.cn/intl/zh-CN/chrome/'
    },
    monthCard: 'http://vip.jiufei.com/lin/GI5LG4?refer=1661',
    wechatCode: '验证码',
    debug_link: 'https://github.com/dongyubin/Baidu-VIP/issues',
    authorWechat: 'dyb54188',
    help_document: 'https://flowus.cn/share/c68e3c55-67e5-460f-b937-7727e0378a34?code=BCRWJL'
  };

  const danger_info = `<p style="font-weight:900; text-align: center;">请更新到最新版本再使用，优先选择 <a style="color:red;" target="_blank"
            href="`+ wwConfig.liulanqi.chrome + `">Google Chrome 浏览器</a> </p>
            <p style="font-weight:900;">
              ⚠️❗ 一定要先配置好 <a href="`+ wwConfig.gopeed.url + `" target="_blank" style="font-weight: 900;color: #409eff;">` + wwConfig.gopeed.name + `</a> 下载器的 User-Agent、端口、连接数: <a style="color:red;" target="_blank"
                href="`+ wwConfig.help_document + `">点击查看 Gopeed 配置教程说明</a>
            </p>
            <p>
              不限次数 PC 网页稳定版:
              <a style="color:red;font-weight:900;" target="_blank"
                href="https://pandown.wangdu.site/">点击前往</a>
            </p>
            <p>
              部分校园网可能不支持解析
            </p>`;

  const pandownload_info = `<li>
              <a href="https://pandown.wangdu.site/vip/login" target="_blank"
                style="color: #007bff; text-decoration: none;">Pandownload</a>会员卡：
                  <a href="`+ wwConfig.pandown.month + `" target="_blank"
                    style="color: #007bff; text-decoration: none;">月卡</a>、
                  <a href="`+ wwConfig.pandown.quarter + `" target="_blank"
                    style="color: #007bff; text-decoration: none;">季卡</a>、
                  <a href="`+ wwConfig.pandown.halfYear + `" target="_blank"
                    style="color: #007bff; text-decoration: none;">半年卡</a>、
                  <a href="`+ wwConfig.pandown.year + `" target="_blank"
                    style="color: #007bff; text-decoration: none;">年卡</a>、
                  <a href="`+ wwConfig.pandown.life + `" target="_blank"
                    style="color: #007bff; text-decoration: none;">永久卡</a>
                </li>`;

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
          '<div class="wp-s-agile-tool-bar__h-group"><button style=" margin-right: 10px;color: #fff;background-color: #ff436a;border:none;" id="downbtn_main" class="u-button nd-file-list-toolbar-action-item" ><i style="top:0;" class="iconfont icon-download"></i> <lable>' +
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

      const openInfoLayer = layer.open({
        type: 1,
        area: ['550px', 'auto'],
        title: '提示',
        type: 1,
        shade: 0.6,
        shadeClose: true,
        anim: 0,
        content: `
          <div class="layui-tab layui-tab-brief" style="background-color: #f8f8f8; border-radius: 8px;">
    <ul class="layui-tab-title" style="background-color: #fff; border-bottom: 1px solid #e6e6e6;">
      <li class="layui-this">验证码解析</li>
      <li>免费解析</li>
      <li>防止失联</li>
      <li>常见问题反馈</li>
    </ul>
    <div class="layui-tab-content" style="padding: 20px;">
      <div class="layui-tab-item layui-show" style="background-color: #fff; border-radius: 8px; padding: 20px;text-align: center;">
        `+ danger_info + `
        <div>
          <img src="https://cdn.wwkejishe.top/wp-cdn-02/2024/202411171346351.webp" style="width:200px;height:200px;">
        </div>
        <h2 class="h2" style="margin-top: 10px;">获取验证码：扫描二维码，复制下面口令并发送</h2>
        <div>每天总共随机解析5-10次，使用完则提示：今日下载次数已达上限（<a style="color: red;font-weight:900;" target="_blank"
            href="https://www.wangdu.site/software/tools/948.html">无限制获取验证码</a>）
        </div>
        <div>
          <input type="text" name="captcha" id="captcha" value="" lay-verify="required" placeholder="请填写验证码"
            lay-reqtext="请填写验证码" autocomplete="off" class="layui-input" lay-affix="clear">
        </div>
        <button style="margin-top:30px; border-radius: 8px;" id="copyWechatBtn"
                class="layui-btn layui-btn-fluid layui-bg-red" lay-submit lay-filter="gopeed-set">1️⃣
                复制微信口令</button>
        <button style="margin-left:0;margin-top:10px; border-radius: 8px;" id="parseWxBtn"
          class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-wx-send">2️⃣ 发送到Gopeed</button>
      </div>
      <div class="layui-tab-item">
        <div class="layui-form" lay-filter="filter-test-layer"
          style="width:360px;margin: 16px auto 0; background-color: #fff; border-radius: 8px; padding: 20px;">
          <div class="demo-send-container">
            <div class="layui-text">
              <p>插件解析免费 <span style="font-weight:600;">2</span> 次</p>
              <p>（提示：解析次数已达上限，代表失效，静等更新。）</p>
              <p>如果失效，请使用<strong>验证码解析</strong></p>
              `+ danger_info + `
            </div>
            <div class="layui-btn-container">
              <button style="margin-top:30px; border-radius: 8px;" id="gopeedSetBtn"
                class="layui-btn layui-btn-fluid layui-bg-red" lay-submit lay-filter="gopeed-set">1️⃣
                Gopeed设置教程</button>
                <!--
              <button style="margin-top:10px; border-radius: 8px;" id="copyUaBtn"
                class="layui-btn layui-btn-fluid layui-bg-orange" lay-submit lay-filter="copy-ua">2️⃣
                复制User-Agent</button>
                -->
              <button style="margin-left:0;margin-top:10px; border-radius: 8px;" id="parseBtn"
                class="layui-btn layui-btn-fluid" lay-submit lay-filter="demo-send">2️⃣ 发送到Gopeed</button>
            </div>
          </div>
        </div>
      </div>
      <div class="layui-tab-item" style="background-color: #fff; border-radius: 8px; padding: 20px;text-align: center;">
        <div>
          <img src="https://cdn.wwkejishe.top/wp-cdn-02/2024/202411171346351.webp" style="width:240px;height:240px;">
        </div>
        <h2 class="h2" style="margin-top: 10px;">扫一扫，不失联</h2>
        <h3 class="h2" style="margin-top: 10px;">众所周知，脚本不可能每时每刻都能用。关注不迷路 ~</h3>
      </div>
      <div class="layui-tab-item" style="background-color: #fff; border-radius: 8px; padding: 20px;">
        <p class="layui-text">
        常见问题文档： <a style="color:red;" target="_blank"
            href="`+ wwConfig.help_document + `">点击查看常见问题</a>（能够解决80%的问题）
        </p>
        <p>
        好用的话，请给个好评，带上截图就更好了！<a href="https://greasyfork.org/zh-CN/scripts/518023-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98svip%E9%AB%98%E9%80%9F%E8%A7%A3%E6%9E%90%E7%9B%B4%E9%93%BE%E7%9A%84%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B-%E6%96%87%E6%AD%A6pandownload/feedback" target="_blank" style="color: #007bff; text-decoration: none;">点击前往</a>
        </p>
        <p class="layui-text">
          有问题请带图反馈，我会尽快修复！
        </p>
        <h2>常见问题</h2>
        <p class="layui-text">
          1、Edge 浏览器 一直显示解析中 / 无法发送到gopeed / 多次提示：验证码错误<br/>
          答：尝试使用 <a style="color:red;" target="_blank"
            href="`+ wwConfig.liulanqi.chrome + `">Google Chrome 浏览器</a>
        </p>
        <div class="layui-btn-container">
          <button style="margin-top:10px; border-radius: 8px;" id="goIssues"
                class="layui-btn layui-btn-fluid layui-bg-red" lay-submit lay-filter="gopeed-set">点击前往提交issues</button>
          <button style="margin-top:10px; border-radius: 8px;" id="copyAuthorWechat"
                class="layui-btn layui-btn-fluid" lay-submit lay-filter="gopeed-set">
                点击复制作者微信号</button>
        </div>
      </div>
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
              gospeedDownload();
              $('#parseBtn').html('<p>发送到Gopeed</p>');
              return;
            }
            let one_url = wwConfig.mainUrl + '/wp/getCodeNum';
            share_one_baidu(openInfoLayer, one_url, wwConfig.one_parse.code, wwConfig.one_parse.version, 1);
          });

          $('#parseWxBtn').on('click', async function () {
            let captchaStr = $('#captcha').val();
            if (captchaStr) {
              let lastCaptcha = GM_getValue('lastCaptcha', '');
              if (captchaStr === lastCaptcha) {
                layer.msg('验证码已使用，请获取新的验证码');
                return;
              }
              GM_setValue('lastCaptcha', captchaStr);

              $('#parseWxBtn').html('<p>正在发送中,请稍后...</p>');
              let testDown = await testSendToGopeed();
              if (!testDown) {
                layer.close(openInfoLayer);
                gospeedDownload();
                $('#parseWxBtn').html('<p>发送到Gopeed</p>');
                return;
              }
              let one_url = wwConfig.mainUrl + '/wp/getPcCodeNum';
              share_one_baidu(openInfoLayer, one_url, captchaStr, wwConfig.wx_parse.version, 2);
            } else {
              layer.msg('请输入验证码');
            }
          });

          // 复制 User-Agent 按钮的事件处理
          $('#copyUaBtn').on('click', function () {
            copy_text(wwConfig.ua, 'User-Agent');
          });
          $('#copyWechatBtn').on('click', function () {
            copy_text(wwConfig.wechatCode, '微信口令');
          })
          $('#gopeedSetBtn').on('click', function () {
            openUrl(wwConfig.help_document);
          })
          $('#goIssues').on('click', function () {
            openUrl(wwConfig.debug_link);
          })
          $('#copyAuthorWechat').on('click', function () {
            copy_text(wwConfig.authorWechat, '作者微信');
          })
        },
      });
    });
  });

  function gospeedDownload() {
    swal({
      title: "下载 Gopeed 加速器",
      text: '请先安装 Gopeed 并打开运行(点击按钮下载 Gopeed)。',
      icon: 'warning',
      type: "warning",
      confirmButtonText: '点击下载Gopeed',
      confirmButtonColor: "#dd6b55",
    }).then(function () {
      openUrl('');
    });
  }

  function openUrl(url) {
    window.open(url);
  }

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

  function init_parse(code) {
    switch (code) {
      case 1:
        layer.msg('解析中', {
          icon: 6,
          time: 3000,
        });
        setTimeout(() => {
          $('#parseBtn').html('<p>发送到Gopeed</p>');
          $('#parseWxBtn').html('<p>发送到Gopeed</p>');
          layer.alert('解析通道比较拥堵，请尝试快速下载！', {
            title: '提示',
            closeBtn: 0,
            btn: ['确定', '前往快速下载'],
            btn1: function (index) {
              $('#parseWxBtn').html('<p>发送到Gopeed</p>');
              layer.close(index);
            },
            btn2: function (index) {
              openUrl(wwConfig.monthCard);
            }
          });
        }, 3000);
        break;
      case 2:
        layer.alert(
          '验证码错误,一个验证码只能下载一个文件,请重新获取！',
          {
            title: '提示',
            closeBtn: 0
          }, function (index) {
            $('#parseWxBtn').html('<p>发送到Gopeed</p>');
            layer.close(index);
          }
        );
        break;
      case 3:
        layer.alert('今日下载次数已达上限，请明天再来下载，或者使用快速下载！', {
          title: '提示',
          closeBtn: 0,
          btn: ['确定', '前往快速下载'],
          btn1: function (index) {
            $('#parseWxBtn').html('<p>发送到Gopeed</p>');
            $('#parseBtn').html('<p>发送到Gopeed</p>');
            layer.close(index);
          },
          btn2: function (index) {
            openUrl(wwConfig.monthCard);
          }
        });
        break;
      case 4:
        layer.alert('解析失败，请升级插件或者使用网页稳定版地址！', {
          title: '提示',
          closeBtn: 0,
          btn: ['确定', '前往快速下载'],
          btn1: function (index) {
            $('#parseBtn').html('<p>发送到Gopeed</p>');
            $('#parseWxBtn').html('<p>发送到Gopeed</p>');
            layer.close(index);
          },
          btn2: function (index) {
            openUrl(wwConfig.monthCard);
          }
        })
        break;
      case 5:
        layer.alert('文件大于 3G，插件暂不支持下载，请使用网页稳定版地址(不限制文件大小)！', {
          title: '提示',
          closeBtn: 0,
          btn: ['前往快速下载'],
          btn1: function (index) {
            openUrl(wwConfig.monthCard);
            layer.close(index);
          }
        })
        break;
      default:
        wwConfig.one_parse.version = 1;
        break;
    }

  }
  function share_one_baidu(openInfoLayer, url, code, version, type) {
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
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
              userKey: 'main',
              fsId: select[0],
              version: version,
            }),
          })
            .then((resp) => resp.json())
            .then((res) => {
              let laysermsg = layer.msg('正在解析中', {
                icon: 6,
                time: 10000,
              });
              if (res.code == 200) {
                if ((res.data > 100) || (res.data.data == 100 & res.data.vip == 0) || (res.data.data == 100 & res.data.vip == 1) || (res.data == 50 || res.data.data == 50)) {
                  let download_url = '';
                  switch (type) {
                    case 1:
                      download_url = wwConfig.mainUrl + '/wp/pc/dlink';
                      break;
                    case 2:
                      download_url = wwConfig.mainUrl + '/wp/fast/pc/dlink';
                      break;
                  }
                  get_down_list(
                    shorturl,
                    wwConfig.bdPassword,
                    openInfoLayer,
                    res.data,
                    laysermsg,
                    download_url
                  );
                }
                else if (res.data == 80 || res.data.data == 80) {
                  init_parse(1);
                }
                else if (res.data == 60 || res.data.data == 60) {
                  init_parse(3);
                }
                // else if (res.data == 50 || res.data.data == 50) {
                //   init_parse(2);
                // }
                else if (res.data.data == 100 || res.data.vip == 0) {
                  init_parse(3);
                }
                else {
                  init_parse(2);
                }
              } else if (res.code == 500) {
                layer.close(openInfoLayer);
                layer.close(laysermsg);
                init_parse(3);
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

  function copy_text(text, msg) {
    navigator.clipboard.writeText(text).then(() => {
      layer.msg(msg + ' 已复制到剪贴板');
    }).catch(err => {
      layer.msg('复制失败，请手动复制：' + text);
    });
  }

  async function get_down_list(shorturl, password, openInfoLayer, pwd, laysermsg, downloadUrl) {
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
          // const size = parseInt(res.data.data.list[0].size);
          // if (size > 3221225472) {
          //   layer.close(openInfoLayer);
          //   layer.close(laysermsg);
          //   $('#parseBtn').html('<p>发送到Gopeed</p>');
          //   init_parse(5);
          //   return false;
          // }
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
          // console.log(requestData);
          GM_xmlhttpRequest({
            method: 'POST',
            url: downloadUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify(requestData),
            onload: function (response) {
              const responseData = JSON.parse(response.responseText);
              // console.log(responseData);
              if (responseData.code !== 200) {
                layer.close(openInfoLayer);
                layer.close(laysermsg);
                // swal({
                //   text: responseData.msg,
                //   icon: 'warning',
                // });
                init_parse(3);
              } else {
                layer.close(laysermsg);
                $('#parseBtn').html('<p>发送到Gopeed</p>');
                if (responseData.data.vip) {
                  wwConfig.url = responseData.data.data.dlink;
                  wwConfig.ua = responseData.data.data.ua;
                } else {
                  wwConfig.url = responseData.data.dlink;
                  wwConfig.ua = responseData.data.ua;
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
          $('#parseWxBtn').html('<p>发送到Gopeed</p>');
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
        layer.open({
          content: `请打开 Gopeed 查看 <span style="color:rgba(5,150,105,1);">${item.server_filename}</span> 是否开始下载？未下载成功，先设置IDM/NDM User-Agent:<code>` + wwConfig.ua + `</code>，再复制直链下载！`,
          btn: ['已下载，关闭弹窗', '复制UA', '未下载，复制直链'],
          closeBtn: 0,
          type: 1,
          btn1: function (index, layero, that) {
            layer.close(index);
            $('#parseWxBtn').html('<p>发送到Gopeed</p>');
          },
          btn2: function (index, layero, that) {
            GM_setClipboard(wwConfig.ua, "text");
            layer.msg('UA复制成功！');
            return false;
          },
          btn3: function (index, layero, that) {
            GM_setClipboard(wwConfig.url, "text");
            layer.msg(`${item.server_filename} 的直链复制成功！`);
            $('#parseWxBtn').html('<p>发送到Gopeed</p>');
          }
        });
        // layer.confirm(`请打开 Gopeed 查看 <span style="color:rgba(5,150,105,1);">${item.server_filename}</span> 是否开始下载？未下载成功，先设置IDM/NDM User-Agent:<code>` + wwConfig.ua + `</code>，再复制直链下载！`,
        //   {
        //     btn: ['已下载，关闭弹窗', '未下载，复制直链'],
        //     closeBtn: 0,
        //   }, function (index) {
        //     layer.close(index);
        //     $('#parseWxBtn').html('<p>发送到Gopeed</p>');
        //   }, function () {
        //     GM_setClipboard(wwConfig.url, "text");
        //     layer.msg(`${item.server_filename} 的直链复制成功！`);
        //     $('#parseWxBtn').html('<p>发送到Gopeed</p>');
        //   });
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