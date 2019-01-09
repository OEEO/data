//显示图片最大宽度
var _squareW;
//显示图片最大高度
var _squareH;
//显示图片距顶部的最小高度
var _sMarginTop;
var _square;
//设置压缩最大宽高
var _compress = 640;
//图片数据
var _base64;

$(function(){
    //top比例 1:0.2
    setTopBarH();
    setContentH();
    setCanvasSize();
});

/**
 * 顶部高度
 */
function setTopBarH(){
    var _winW = $(window).width();
    //画布宽度
    _squareW = _winW;
    var _topH = _winW*0.2;//top比例 1:0.2
    //顶部导航高度
    $(".m-header").height(_topH);
}

/**
 * 中间图片高度
 */
function setContentH(){
    //顶部高度
    var _topH = $(".m-header").height();
    //底部高度
    var _bottomH = $(".camera").height();
    //中间背景高度
    var _contentH = $(window).height() - (_topH+_bottomH);
    $(".content").height(_contentH);
    //画布高度
    _squareH = _contentH;
}

/**
 * 设置画布尺寸和布局
 */
function setCanvasSize(){
    _sMarginTop = Math.abs(_squareW - _squareH) / 2;
    if(_squareH > _squareW){
        _square = _squareW;
        // $("#kcCanvas").css({"margin-top":(_squareH-_squareW)/2});
    }else{
        _square = _squareH;
        // $("#kcCanvas").css({"margin-left":(_squareW-_squareH)/2});
    }
}

function showPreview(source){
    var _file = source.files[0];
    if(!/image\/\w+/.test(_file.type)){
        alert("请确保文件为图像类型");
        return false;
    }else{
        lrz(_file)
            .then(function (rst) {
                console.log('rst', rst);
                renderImage(rst.base64)
            })
            .catch(function (err) {
                if(window.FileReader){
                    var fr =new FileReader();
                    fr.onload = function(e){
                        renderImage(e.target.result);
                    };
                    fr.readAsDataURL(_file);
                }
            })
    }
}


// wang 调整后的渲染
function renderImage(src, isBase64){
    // 创建一个 Image 对象
    var image = new Image();
    var canvas = document.getElementById("kcCanvas");
    //获取 canvas的 2d 环境对象
    var ctx = canvas.getContext("2d");
    // 绑定 load 事件处理器，加载完成后执行
    image.onload = function(){

        var _imgWidth = 0;

        var	_imgHeight = 0;

        var	_offsetX = 0;

        var	_offsetY = 0;

        var _compressW = 0;

        var _compressH = 0;

        // 用于显示的图片
        if($("#timg")){
            $("#timg").remove();
        }
        $(".content").append("<img id='timg'/>");
        var $tImg = $("#timg");

        //不压缩
        if(image.height < _square && image.width < _square){
            _imgWidth = image.width;
            _imgHeight = image.height;
            _offsetX = Math.round((_square - _imgWidth) / 2);
            _offsetY = Math.round((_square - _imgHeight) / 2);

        }else{
            // 横图
            if(image.width > image.height) {
                _imgWidth = _square;
                _imgHeight = Math.round((_square / image.width) * image.height);
                _offsetY = Math.round((_square - _imgHeight) / 2);
            }
            //竖图
            if(image.width < image.height){
                _imgHeight = _square;
                _imgWidth = Math.round((_square / image.height)* image.width);
                _offsetX = Math.round((_square - _imgWidth) / 2);
            }
            //方形
            if(image.width == image.height){
                _imgWidth = _square;
                _imgHeight = _square;
            }
        }
        //不压缩
        if(image.height < _compress && image.width < _compress){
            _compressW = image.width;
            _compressH = image.width;
        }else{
            // 横图
            if(image.width > image.height) {
                _compressW = _compress;
                _compressH = Math.round((_compress / image.width) * image.height);
            }
            //竖图
            if(image.width < image.height){
                _compressH = _compress;
                _compressW = Math.round((_compress / image.height) * image.width);
            }
            //方形
            if(image.width == image.height){
                _compressW = _compress;
                _compressH = _compress;
            }
        }

        // canvas清屏
        ctx.clearRect(0, 0, canvas.width, canvas.height);//canvas.width, canvas.height
        // 重置canvas宽高
        canvas.width = _compressW;
        canvas.height = _compressH;

        //清除背景图像
        $(".content").removeClass("content-bg");

        //判断图片宽高属性是否读取异常并显示图片
        //宽高读取异常
        $tImg.attr("src", src);
        if((_imgWidth > _imgHeight && $tImg.width() < $tImg.height())) {//|| (_imgWidth < _imgHeight && $tImg.width() > $tImg.height())
            /*f1*/
            //ctx.translate(_offsetX + _imgWidth, 0);//平移
            //ctx.rotate(90 * Math.PI / 180);//旋转
            //ctx.save();//保存状态
            /*f2*/
            $tImg.width(_imgHeight);
            $tImg.height(_imgWidth);
            $tImg.css({"top":_offsetX + _sMarginTop, "left":_offsetY});
        }else{
            $tImg.width(_imgWidth);
            $tImg.height(_imgHeight);
            $tImg.css({"top":_offsetY + _sMarginTop, "left":_offsetX});
        }
        //

        // 处理canvas的位置
        let W = _compressW
        let H = _compressH
        let top = 0
        let left = 0
        let $curScreen = $('#imgsearch-container')
        let cHeight = $curScreen.height()
        let cWidth = $curScreen.width()
        let uploadFooterHeight = $('.upload-page-footer').height()
        // 图片容器宽高
        let wrapWidth = Math.floor(cWidth * 0.92)
        let wrapHeight = Math.floor((cHeight - uploadFooterHeight) * 0.92)

        let wrapRatio = wrapWidth / wrapHeight
        let imgRatio = W / H

        console.log('$curScreen', $curScreen)
        console.log('wrap', wrapWidth, wrapHeight, wrapRatio)
        console.log('img', W, H, imgRatio)
        console.log('Ratio', wrapRatio, imgRatio)
        if (imgRatio < wrapRatio) {
            W = Math.floor((wrapHeight / H) * W)
            H = wrapHeight
        } else {
            H = Math.floor((wrapWidth / W) * H)
            W = wrapWidth
        }

        let getPixelRatio = function (context) {
            let backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        }

        let pixelRatio = getPixelRatio(ctx)
        console.log('pixelRatio', pixelRatio)
        W *= pixelRatio
        H *= pixelRatio
        $('#kcCanvas').css({
            transform: `scale(${1/pixelRatio}, ${1/pixelRatio})`,
        })

        canvas.width = W
        canvas.height = H
        $('#kcCanvas').css({
            marginLeft: -(W / 2) + 'px',
            marginTop: -(H  / 2) + 'px'
        })
        $('#kcCanvas-wrap').height(cHeight - uploadFooterHeight)
        // 将图像绘制到canvas上

        ctx.drawImage(image, 0, 0, W, H);

        _base64 = canvas.toDataURL('image/jpeg', 1);

        // //前22位无效
        _base64 = _base64.substr(22);

        $('#index-page').hide()
        $('#upload-page').show()
        // 上传图片到服务器
        // submitImg(_base64);
    };
    // 设置src属性
    image.src = src;
};

/**
 * 按钮图片被点击的时候
 */
function cameraInput_onclick(script_name){
	var ua = navigator.userAgent.toLowerCase();
    document.getElementById('cameraInput').click();
    return

    // 下面是判断微信环境下的特殊操作，为了方便调整流程，暂时不特殊化了
    if(ua.match(/MicroMessenger/i)!="micromessenger") {
        document.getElementById('cameraInput').click();
    }else{
    	if(platForm()=='android'){
			//checkJsApi();
	        var is_selected_pic=$("#is_selected_pic").html();
	        //alert(is_selected_pic);
	        if(is_selected_pic=='no'){
	            $("#is_selected_pic").html("yes");
	            choose_image();
	            var search_button=$("#on_search_img").attr("src");
	           // alert(search_button);
	            $("#img_button").attr("src",search_button);
	            //choose_imgage();
	        }else{
	            var localId=$("#weixin_img").attr("value");//获取需要上传的图片id
	            upload_img(localId);
	            $("#is_selected_pic").html("no");
	        }
		}else{
			document.getElementById('cameraInput').click();
		}
    }
}


/**
 * 本地服务器上传文件
 */
function handle_img(script_name,code){
       var dfd = new jQuery.Deferred();

	   var ajaxTimeoutTest = $.ajax({
	　　url:script_name+'/Kacha/doupload',  //请求的URL
	　　timeout : 20000, //超时时间设置，单位毫秒
	　　type : 'post',  //请求方式，get或post
	　　data :{img:code},  //请求所传参数，json格式
	　　dataType:'json',//返回的数据格式
	   beforeSend:function(){
			// var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
		},
	　　success:function(data)
		{
			//请求成功的回调函数
			if(data.file)
			{
				//alert(data.file);
				var obj = document.getElementById('cameraInput') ;
				obj.outerHTML=obj.outerHTML;//跳转之前将input file清空,不然浏览器后退时又触发input中的onchange方法

                console.log('file', data.file)
                let source = getQueryString('source') ? getQueryString('source') : 'H5'

                let mobileType = getCurBrowserType()
                console.log('source', source, 'mobileType', mobileType)
                // 识别酒标
                window.location.href = `${script_name}/Kacha/do_upload?file=${data.file}&source=${source}&mobiletype=${mobileType}`
	        }
	　　},
	　　complete : function(XMLHttpRequest,status)
		{
	        //请求完成后最终执行参数
	　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
	 　　　　　 ajaxTimeoutTest.abort();
	　　　　　  alert("上传超时，请检查您的网络状态。");
	　　　　}
	　　}
	});

    return dfd.promise();
}



function platForm() {
    var a = window.navigator.userAgent.toLowerCase();
    var b = a.match(/(iphone|ipod|ipad|android|windows phone|blackberry|symbian|Windows Phone)/);
    if (!!b) {
        b = b.toString();
    }
    if (b) {
        if (b.indexOf("iphone") >= 0) {
            return "iphone"
        } else if (b.indexOf("ipod") >= 0) {
            return "ipod"
        } else if (b.indexOf("ipad") >= 0) {
            return "ipad"
        } else if (b.indexOf("android") >= 0) {
            return "android"
        } else if (b.indexOf("windows phone") >= 0) {
            return "wp7"
        } else if (b.indexOf("symbian") >= 0) {
            return "symbian"
        } else if (b.indexOf("blackberry") >= 0) {
            return "blackberry"
        } else if (b.indexOf("Windows Phone") >= 0) {
            return "wp7"
        } else {
            return "unknow"
        }
    }
    return "unknow"
}


function getQueryString (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.slice(1).match(reg)
    if (r != null) {
        return decodeURI(r[2])
    }
    return ''
}

function getCurBrowserType () {
    var ua = window.navigator.userAgent.toLowerCase();
    var browserType = ''
    if (ua.indexOf('kachabrowser') > -1) {
        // 酒咔嚓APP
        browserType = 'kachabrowser';
    } else if (ua.indexOf('qq') > -1) {
        if (/nettype/i.test(ua)){
            //微信或者QQ
            if (/micromessenger/i.test(ua)){
                //微信
                browserType = 'weixin';
            } else {
                //QQ
                browserType = 'qq';
            }
        } else {
            //QQ浏览器
            browserType = 'qqbrowser';
        }
    } else if (ua.indexOf('baidu') > -1) {
        //百度应用
        browserType = 'baidu';
    } else if (ua.indexOf('sogou') > -1) {
        //搜狗
        browserType = 'sogou';
    } else if (ua.indexOf('ucbrowser') > -1) {
        // UC浏览器
        browserType = 'ucbrowser';
    } else if (ua.indexOf('chrome') > -1) {
        // 谷歌浏览器
        browserType = 'chrome';
    } else if (ua.indexOf('opera') > -1) {
        browserType = 'opera';
    } else if (ua.indexOf('firefox') > -1) {
        browserType = 'firefox';
    } else if (ua.indexOf('safari') > -1) {
        browserType = 'safari';
    } else if (ua.indexOf('compatible') > -1 && ua.indexOf('msie') > -1) {
        browserType = 'ie';
    } else if (ua.indexOf('trident') > -1) {
        browserType = 'edge';
    } else {
        browserType = 'other';
    }
    return browserType;
}
