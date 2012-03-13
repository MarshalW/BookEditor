/**
 * Created by JetBrains WebStorm.
 * User: marshal
 * Date: 12-2-28
 * Time: 下午1:22
 * To change this template use File | Settings | File Templates.
 */

function initApp() {

    //点击文本按钮，创建新的文本框
    $('.toolBarTextItem').click(function () {
        var block = $('<div class="ui-resizable textArea"></div>');
        block.appendTo($('.editArea').first());
        block.resizable().draggable();//可改变尺寸，可拖拽
    });

    //点击媒体按钮，创建新的媒体框
    $('.toolBarMediaItem').click(function () {
        var block = $('<div class="ui-resizable mediaArea"></div>');
        block.appendTo($('.editArea').first());
        block.resizable().draggable();//可改变尺寸，可拖拽

        block.on('dragover drop', function (e) {//处理文件拖拽和释放事件
            e.stopPropagation();
            e.preventDefault();
            var b = e.target;
            if (e.type == 'drop') {//处理文件释放
                console.log('drop file:' + e.type);
                var files = e.originalEvent.dataTransfer.files;//获取文件列表

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log('file:' + file.type);
                    if (file.type.match('image.*')) {//如果是图片文件
                        console.log('file.name:' + file.name);
                        var reader = new FileReader();//创建文件读取器
                        reader.onload = (function (theFile) {//当读取到文件后的函数
                            return function (e) {
                                console.log('on load');
                                var canvas=$('<canvas></canvas>');//创建canvas
                                canvas[0].width=1024/2;
                                canvas[0].height=768/2;
                                canvas.appendTo($(b));

                                var image = new Image();//创建图片，图片内容是拖拽文件
                                image.onload=function(){
                                    var context=canvas[0].getContext('2d');//图片写入canvas
                                    context.drawImage(image,0,0,image.width*.5,image.height*.5);

                                    var newImage=new Image();//创建新图片，内容来源于canvas
                                    newImage.onload=function(){
                                        $(newImage).appendTo($(b));
                                    };
                                    newImage.src=canvas[0].toDataURL('image/jpeg');


                                    canvas.remove();//删除canvas
                                };
                                image.src=e.target.result;


                            };
                        })(file);

                        reader.readAsDataURL(file);
                        console.log('read file');
                    }
                }
            }
        });
    });
}