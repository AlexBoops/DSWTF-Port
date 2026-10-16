function createUnityInstance(r,t,l){
  function d(e,r){if(!d.aborted&&t.showBanner)return"error"==r&&(d.aborted=!0),t.showBanner(e,r);switch(r){case"error":console.error(e);break;case"warning":console.warn(e);break;default:console.log(e)}}
  function n(e){var r=e.reason||e.error,t=r?r.toString():e.message||e.reason||"",n=r&&r.stack?r.stack.toString():"";(t+="\n"+(n=n.startsWith(t)?n.substring(t.length):n).trim())&&g.stackTraceRegExp&&g.stackTraceRegExp.test(t)&&f(t,e.filename||r&&(r.fileName||r.sourceURL)||"",e.lineno||r&&(r.lineNumber||r.line)||0)}
  function e(e,r,t){var n=e[r];void 0!==n&&n||(console.warn('Config option "'+r+'" is missing or empty. Falling back to default value: "'+t+'". Consider updating your WebGL template to include the missing config option.'),e[r]=t)}
  l=l||function(){};
  var o,g={
    canvas:r,
    webglContextAttributes:{preserveDrawingBuffer:!1,powerPreference:0},
    wasmFileSize:49502949,
    streamingAssetsUrl:"StreamingAssets",
    downloadProgress:{},
    deinitializers:[],
    intervals:{},
    setInterval:function(e,r){e=window.setInterval(e,r);return this.intervals[e]=!0,e},
    clearInterval:function(e){delete this.intervals[e],window.clearInterval(e)},
    preRun:[],
    postRun:[],
    print:function(e){console.log(e)},
    printErr:function(e){console.error(e)},
    locateFile:function(e){return"build.wasm"==e?this.codeUrl:e},
    disabledCanvasEvents:["contextmenu","dragstart"]
  };
  for(o in e(t,"companyName","Unity"),e(t,"productName","WebGL Player"),e(t,"productVersion","1.0"),t)g[o]=t[o];
  
  if (!g.streamingAssetsUrl.startsWith('http')) {
    g.streamingAssetsUrl=new URL(g.streamingAssetsUrl,document.URL).href;
  }
  
  var i=g.disabledCanvasEvents.slice();
  function a(e){e.preventDefault()}
  i.forEach(function(e){r.addEventListener(e,a)}),window.addEventListener("error",n),window.addEventListener("unhandledrejection",n);
  var s="",u="";
  function c(e){document.webkitCurrentFullScreenElement===r?r.style.width&&(s=r.style.width,u=r.style.height,r.style.width="100%",r.style.height="100%"):s&&(r.style.width=s,r.style.height=u,u=s="")}
  document.addEventListener("webkitfullscreenchange",c);
  
  g.deinitializers.push(function(){
    for(var e in g.disableAccessToMediaDevices&&g.disableAccessToMediaDevices(),i.forEach(function(e){r.removeEventListener(e,a)}),window.removeEventListener("error",n),window.removeEventListener("unhandledrejection",n),document.removeEventListener("webkitfullscreenchange",c),g.intervals)window.clearInterval(e);
    g.intervals={}
  });

  g.QuitCleanup=function(){for(var e=0;e<g.deinitializers.length;e++)g.deinitializers[e]();g.deinitializers=[],"function"==typeof g.onQuit&&g.onQuit()};
  
  var h={
    Module:g,
    SetFullscreen:function(){if(g.SetFullscreen)return g.SetFullscreen.apply(g,arguments);g.print("Failed to set Fullscreen mode: Player not loaded yet.")},
    SendMessage:function(){if(g.SendMessage)return g.SendMessage.apply(g,arguments);g.print("Failed to execute SendMessage: Player not loaded yet.")},
    Quit:function(){return new Promise(function(e,r){g.shouldQuit=!0,g.onQuit=e})},
    GetMetricsInfo:function(){return{}}
  };

  function f(e,r,t){
    -1==e.indexOf("fullscreen error")&&(g.startupErrorHandler?g.startupErrorHandler(e,r,t):g.errorHandler&&g.errorHandler(e,r,t)||(console.log("Invoking error handler due to\n"+e)))
  }

  function m(e,r){
    if("symbolsUrl"!=e){
      var t=g.downloadProgress[e];
      t=t||(g.downloadProgress[e]={started:!1,finished:!1,lengthComputable:!1,total:0,loaded:0});
      if("object"==typeof r) {
        t.started = true;
        t.finished = true;
        t.loaded = r.loaded || 100;
        t.total = r.total || 100;
      }
      l(1.0);
    }
  }

  g.SystemInfo=function(){
    return {
      width:screen.width,height:screen.height,userAgent:navigator.userAgent,
      browser:"Chrome",browserVersion:"100",mobile:!1,os:"Windows",osVersion:"10",
      gpu:"WebGL",language:"en",hasWebGL:2,hasWebGPU:0,hasCursorLock:!0,
      hasFullscreen:!0,hasThreads:!1,hasWasm:!0,hasWasm2023:!0,missingWasm2023Feature:null,hasWasmThreads:!1
    }
  }();

  g.readBodyWithProgress=function(i,a,s){
    return i.arrayBuffer().then(function(buf){
      var r=new Uint8Array(buf);
      a({type:"load",response:i,total:r.length,loaded:r.length,lengthComputable:!1,chunk:null});
      i.parsedBody=r;
      return i;
    });
  };

  g.fetchWithProgress=function(e,r){
    var t=r&&r.onProgress?r.onProgress:function(){};
    if (typeof e === 'string' && e.startsWith('blob:')) {
      return fetch(e).then(function(res){
        return g.readBodyWithProgress(res, t, false);
      });
    }
    return fetch(e, { mode: 'cors' }).then(function(res){
      return g.readBodyWithProgress(res, t, false);
    });
  };

  function p(){
    var n=performance.now();
    var frameworkPromise = new Promise(function(resolve, reject){
      var script=document.createElement("script");
      script.src=g.frameworkUrl;
      script.crossOrigin="anonymous";
      script.onload=function(){
        var fw=unityFramework;
        unityFramework=null;
        script.onload=null;
        resolve(fw);
      };
      script.onerror=function(){
        reject(new Error("Failed to load framework script from " + g.frameworkUrl));
      };
      document.body.appendChild(script);
      g.deinitializers.push(function(){document.body.removeChild(script)});
    }).then(function(fw){
      g.webAssemblyTimeStart=performance.now();
      fw(g);
      g.codeDownloadTimeEnd=performance.now()-n;
    });

    var dataPromise = g.fetchWithProgress(g.dataUrl, {
      onProgress: function(e){ m("dataUrl", e); }
    }).then(function(res){
      return res.parsedBody;
    });

    g.preRun.push(function(){
      g.addRunDependency("dataUrl");
      dataPromise.then(function(r){
        var e=new TextDecoder("utf-8"),t=0;
        function getInt(){
          var val=(r[t]|r[t+1]<<8|r[t+2]<<16|r[t+3]<<24)>>>0;
          t+=4;
          return val;
        }
        var magic="UnityWebData1.0\0";
        var headerMagic=e.decode(r.subarray(0,magic.length));
        if(headerMagic!=magic){
          throw new Error('Unknown binary data format: ' + headerMagic);
        }
        t+=magic.length;
        var headerSize=getInt();
        
        while(t<headerSize){
          var offset=getInt();
          var size=getInt();
          var pathLen=getInt();
          var filePath=e.decode(r.subarray(t,t+pathLen));
          t+=pathLen;

          for(var h=0,f=filePath.indexOf("/",h)+1;0<f;h=f,f=filePath.indexOf("/",h)+1){
            try { g.FS_createPath(filePath.substring(0,h),filePath.substring(h,f-1),!0,!0); } catch(err){}
          }
          try {
            g.FS_createDataFile(filePath,null,r.subarray(offset,offset+size),!0,!0,!0);
          } catch(err){}
        }
        g.removeRunDependency("dataUrl");
      });
    });

    return new Promise(function(resolve, reject){
      if(!g.SystemInfo.hasWebGL) return reject("WebGL not supported");
      if(!g.SystemInfo.hasWasm) return reject("WASM not supported");

      l(0);
      g.postRun.push(function(){
        l(1);
        if(g.WebPlayer && g.WebPlayer.WaitForInitialization){
          g.WebPlayer.WaitForInitialization().then(function(){
            resolve(h);
          });
        } else {
          resolve(h);
        }
      });
      frameworkPromise.catch(reject);
    });
  }

  return p();
}
