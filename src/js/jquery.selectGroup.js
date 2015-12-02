/*
name:jquery.selectGroup
verson:1.0.0
author:fengweiqi
email:yakia@gm99.com
github:
blog:www.fengweiqi.cn
date:2015-11-27
*/ 
;(function($, window, document,undefined) {
	var Privateclass = function(el) {//私有类
			this.$el=el;
			this.opts=el.data('selectGroup');//获取插件参数
			
			this.data=function(dataName,opts){
				el.data(dataName,opts);
				
			}
	}
	Privateclass.prototype={

			setSelectWrap:function(){//构建外包裹

			},

			setUI:function(){//构建UI,样式在样式表中控制

				var selectWrap = document.createElement('div');
				var triangle = document.createElement('span');
				var choose = document.createElement('span');
				var dl = document.createElement('dl');
				var that = this;
				that.$el.hide();
					triangle.className = 'triangle';
					choose.className = 'choose';
					selectWrap.className = 'selectWrap';

					$(selectWrap).append(choose).append(triangle);
					$(selectWrap).append(dl);
					// 搜索框
					var dd = document.createElement('dd');
					var search = document.createElement('input');
					$(search).attr('type','search');
					dd.className = 'first';
					$(dd).append(search);
					$(dl).append(dd);
					//搜索框监听
					$(search).on('input propertychange',function(){
						var val = $(this).val();
						var reg = eval("/"+val+"/ig");
						var dt,dtText,triangle,dd,ul;
						if($.trim(val)!=''){
							var createFirst = 0 ;//创建一次
							that.$el.find('option').each(function(index, el) {
								var text = $(this).html();

								if(reg.test(text)==true){

									if(createFirst==0){
										dt = document.createElement('dt');
										dtText = document.createElement('span');
										triangle = document.createElement('span');
										dd = document.createElement('dd');
										ul = document.createElement('ul');
										triangle.className = 'triangle';
										$(dt).append(triangle).append(dtText);
										dtText.innerHTML = val;
										dd.appendChild(ul);
										$(dl).find('.first').siblings().remove();
										$(dl).append(dt).append(dd);
										createFirst++;
									}

									var li = document.createElement('li');
									li.innerHTML = text;
									$(li).attr('data-index',index);
									$(ul).append(li);
									
								}
							});
						}else{
							createItemList();
						}
						
					});
					// 生成组选择列表
					function createItemList(){
						var liIndex = 0;
						$(dl).find('.first').siblings().remove();
						that.$el.find('optgroup').each(function(index, el) {
							var $options = $(el).find('option');
							var dt = document.createElement('dt');
							var dtText = document.createElement('span');
							var triangle = document.createElement('span');
							var dd = document.createElement('dd');
							var labelText = $(el).attr('label');
							var ul = document.createElement('ul');
							triangle.className = 'triangle';
							$(dt).append(triangle).append(dtText);
							dtText.innerHTML = labelText;
							dd.appendChild(ul);
							$(dl).append(dt).append(dd);

							$options.each(function(index, el) {
								var val = el.value;
								var text = el.innerHTML;
								var li = document.createElement('li');
								$(li).attr('data-index',liIndex);
								liIndex++;
								$(li).data('value',val).html(text);
								$(ul).append(li);
							});

						});
					}
					createItemList();
					this.$el.after(selectWrap);
					//收缩伸展
					$(selectWrap).delegate('dt', 'click', function(event) {
						var $next = $(this).next('dd');
						
						

						if($next.is(':hidden')==true){
							$(this).find('.triangle').rotate({
								  angle: 0,
							      center: ["50%", "40%"],
							      animateTo:180
							});
						}else{
							$(this).find('.triangle').rotate({
								  angle: 180,
							      center: ["50%", "40%"],
							      animateTo:0
							});
						}
						$next.slideToggle('fast');
					});

					// 点击选择
					$(selectWrap).delegate('li', 'click', function(event) {

						var index = parseInt($(this).attr('data-index'));
						console.log(index);
						var text = $(this).html();
						that.$el.find('option').get(index).selected = true;
						
						that.$el.trigger('change');
						$(choose).html(text);
						$(dl).hide();
						$(choose).removeClass('active');
						that.opts.selectedCallback();
					});

					// 调整下拉框宽度
					// var dlWidth = $(selectWrap).width()-2*parseInt($(dl).css('border-left-width'));

					// $(dl).width(dlWidth);

					// 下拉框伸缩
				
					$(choose).click(function(event) {
						
							if($(dl).is(':hidden')){

								
								$(choose).addClass('active');
								$(this).next('.triangle').rotate({
								  angle: 0,
							      center: ["50%", "40%"],
								      animateTo:180
								});
								$(dl).slideDown('fast');
							}else{
								$(choose).removeClass('active');
								$(this).next('.triangle').rotate({
									  angle: 180,
								      center: ["50%", "40%"],
								      animateTo:0
								});
								$(dl).slideToggle('fast');
							}
					
						
					});

					// 默认选择第一个
					
					$(selectWrap).find('li').eq(0).click();

			}

			
	};
	var privateclass=[];//用于私有类实例化
	var methods = {//对外接口
		init: function(options){
			return this.each(function() {
				var $this = $(this);
				var opts = $this.data('selectGroup');
				if(typeof(opts) == 'undefined') {

					var defaults = {
							// 选择后回调
							selectedCallback:function(){}
					   };

					opts = $.extend({}, defaults, options);
					$this.data('selectGroup', opts);

				} else {
					opts = $.extend({}, opts, options);
				}

				// 代码在这里运行
				
				privateclass[opts.id]=new Privateclass($this);
				privateclass[opts.id].setUI();
			

			});
		}
		
		
	};

	$.fn.selectGroup = function() {
		var method = arguments[0];

		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if( typeof(method) == 'object' || !method ) {
			method = methods.init;
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.selectGroup' );
			return this;
		}
		
		return method.apply(this, arguments);

	}

})(jQuery, window, document);