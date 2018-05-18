;
(function ($, window, document, undefined) {
    //'use strict';
    var pluginName = 'gfLocateCsv'; //Plugin名稱
    var gfLocateCsv;
    var arrData = [];
    //建構式
    gfLocateCsv = function (element, options) {

        this.target = element; //html container
        //this.prefix = pluginName + "_" + this.target.attr('id'); //prefix，for identity
        this.opt = {};
        var initResult = this._init(options); //初始化
        if (initResult) {
            //初始化成功之後的動作
            this._style();
            this._event();
            this._subscribeEvents();

            if (this.opt.onInitComplete) {
                this.target.trigger('onInitComplete');
            }
        }
    };

    //預設參數
    gfLocateCsv.defaults = {
        css: {
            'width': '100%',
            'background-color': '#e3f0db',
            'overflow-y': 'hidden',
            'overflow-x': 'hidden',
            'height': '300px'
        },
        onInitComplete: undefined,
        onClear: undefined,
        onLocateOne: undefined,
        onLocateAll: undefined
    };

    //方法
    gfLocateCsv.prototype = {
        //私有方法
        _init: function (_options) {
            //合併自訂參數與預設參數
            try {
                this.opt = $.extend(true, {}, gfLocateCsv.defaults, _options);
                return true;
            } catch (ex) {
                return false;
            }
        },
        _style: function () {
            var o = this;
            o.target.css(o.opt.css);
            var row1 = $("<div/>", {
                class: pluginName + '_uploadContainer',
                css: {
                    'height': '30px'
                }
            }).appendTo(o.target);
            var fileInput = $('<input/>', {
                class: 'form-control',
                type: 'file',
                css: {
                    'width': '100%',
                    'margin-bottom': '1rem'
                }
            }).appendTo(row1);
            fileInput.get(0).addEventListener('change', o._handleFileSelect, false);
            var exampleDownload_84 = $('<button/>', {
                class: 'btn btn-success btn-round ' + pluginName + '_downloadExample_84',
                css: {
                    'width': '100%'
                }
            }).appendTo(row1);;
            var exampleIcon = $('<i/>', {
                text: ' WGS84範例下載',
                class: 'mdi mdi-cloud-download'
            }).appendTo(exampleDownload_84);
            var exampleDownload_97 = $('<button/>', {
                class: 'btn btn-success btn-round ' + pluginName + '_downloadExample_97',
                css: {
                    'width': '100%',
                    'margin-top': '5px'
                }
            }).appendTo(row1);;
            var exampleIcon = $('<i/>', {
                text: ' TWD97範例下載',
                class: 'mdi mdi-cloud-download'
            }).appendTo(exampleDownload_97);
            var exampleDownload_67 = $('<button/>', {
                class: 'btn btn-success btn-round ' + pluginName + '_downloadExample_67',
                css: {
                    'width': '100%',
                    'margin-top': '5px'
                }
            }).appendTo(row1);;
            var exampleIcon = $('<i/>', {
                text: ' TWD67範例下載',
                class: 'mdi mdi-cloud-download'
            }).appendTo(exampleDownload_67);

            var row_clear = $("<div/>", {
                class: pluginName + '_clearContainer',
                css: {
                    'display': 'none'
                }
            }).appendTo(o.target);
            var clearBtn = $('<button/>', {
                class: 'btn btn-warning',
                text: '清除',
                css: {
                    'width': '100%'
                }
            }).appendTo(row_clear).click(function () {
                o._clear();
            });

            var row2 = $("<div/>", {
                class: pluginName + '_container',
                css: {
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'height': (o.target.height() - 30) + "px"
                }
            }).appendTo(o.target);

        },
        _event: function () {
            var o = this;
            o.target.on('click', '.' + pluginName + '_locateAll', function () {
                o.target.trigger('onLocateAll', JSON.stringify(arrData));
            });

            o.target.on('click', '.' + pluginName + '_locateOne', function () {
                var result = {
                    x: $(this).data().x,
                    y: $(this).data().y,
                    title: $(this).data().title,
                    descript: $(this).data().descript
                };
                o.target.trigger('onLocateOne', result);
            });

            o.target.on('click', '.' + pluginName + '_downloadExample_84', function () {
                window.open("http://imap.swcb.gov.tw/gee/gee/data/SAMPLE.csv");
            });
            o.target.on('click', '.' + pluginName + '_downloadExample_97', function () {
                window.open("http://imap.swcb.gov.tw/gee/gee/data/SAMPLE_TWD97.csv");
            });
            o.target.on('click', '.' + pluginName + '_downloadExample_67', function () {
                window.open("http://imap.swcb.gov.tw/gee/gee/data/SAMPLE_TWD67.csv");
            });
        },
        _handleFileSelect: function (evt) {
            var o = this;
            var files = evt.target.files;
            for (var i = 0, f; f = files[i]; i++) {
                // Only process csv files.
                //if (!f.type.match('csv.*')) {
                //    continue;
                //}
                var reader = new FileReader();
                reader.onload = (function (theFile, o) {
                    return function (e) {
                        var content = e.target.result.trim().split('\n');

                        var table = $('<table/>', {
                            class: 'table table-bordered',
                            css: {
                                'font-size': '0.6rem'
                            }
                        });

                        var thead = $('<thead/>').appendTo(table);
                        var thead_tr = $('<tr/>').appendTo(thead);

                        var srs = "EPSG:4326";
                        content[0].split(',').forEach(function (ele, idx) {
                            if (idx <= 1) {
                                if (ele.indexOf("84") >= 0) {
                                    srs = "EPSG:4326";
                                } else if (ele.indexOf("97") >= 0) {
                                    srs = "EPSG:3826";
                                } else if (ele.indexOf("67") >= 0) {
                                    srs = "EPSG:3828";
                                }
                            } else {
                                var th = $('<th/>', {
                                    css: {
                                        'text-align': 'center',
                                        'vertical-align': 'middle',
                                        'padding': '0.5rem 0'
                                    },
                                    text: ele
                                }).appendTo(thead_tr);
                            }
                        });
                        var th_1 = $('<th/>', {
                            css: {
                                'width': '50px',
                                'text-align': 'center',
                                'padding': '0.5rem 0'
                            }
                        }).prependTo(thead_tr);
                        var btn_all = $('<button/>', {
                            class: 'btn btn-default btn-circle ' + pluginName + '_locateAll'
                        }).appendTo(th_1);
                        var i_all = $('<i/>', {
                            class: 'mdi mdi-map-marker-multiple',
                            title: '全部定位'
                        }).appendTo(btn_all);

                        var tbody = $('<tbody/>').appendTo(table);
                        for (var i = 1; i < content.length; i++) {
                            var tr = $('<tr/>').appendTo(tbody);
                            var x = "";
                            var y = "";
                            var title = "";
                            var descript = "";
                            content[i].split(',').forEach(function (ele, idx) {
                                if (idx == 0) {
                                    x = ele;
                                    return;
                                }

                                if (idx == 1) {
                                    y = ele;
                                    return;
                                }

                                if (idx == 2) {
                                    title = ele;
                                }

                                if (idx > 2) {
                                    descript += "<p>" + ele + "</p>";
                                }

                                var td = $('<td/>', {
                                    css: {
                                        'text-align': 'center',
                                        'padding': '0.5rem 0'
                                    },
                                    text: ele
                                }).appendTo(tr);
                            });
                            var td_1 = $('<td/>', {
                                css: {
                                    'width': '50px',
                                    'text-align': 'center',
                                    'padding': '0.5rem 0'
                                }
                            }).prependTo(tr);
                            var btn_one = $('<button/>', {
                                class: 'btn btn-default btn-circle ' + pluginName + '_locateOne',
                                'data-x': x * 1,
                                'data-y': y * 1,
                                'data-title': title,
                                'data-descript': descript,
                                'data-srs': srs
                            }).appendTo(td_1);
                            var i_one = $('<i/>', {
                                class: 'mdi mdi-map-marker',
                                title: '定位'
                            }).appendTo(btn_one);

                            arrData.push({
                                x: x * 1,
                                y: y * 1,
                                title: title,
                                descript: descript,
                                srs: srs
                            });
                        }

                        $('.' + pluginName + '_container').empty().append(table);
                        $('.' + pluginName + '_clearContainer').show();
                        $('.' + pluginName + '_uploadContainer').hide();
                    };
                })(f, o);

                reader.readAsText(f, "Big5");
            }
        },
        _clear: function () {
            var o = this;
            $('.' + pluginName + '_clearContainer').hide();
            $('.' + pluginName + '_uploadContainer').show().find('input').val(null);
            $('.' + pluginName + '_container').empty();
            //清除定位的點位
            o.target.trigger('onClear');
        },
        //註冊事件接口
        _subscribeEvents: function () {
            //先解除所有事件接口
            this.target.off('onClear');
            this.target.off('onInitComplete');
            this.target.off('onLocateOne');
            this.target.off('onLocateAll');

            if (typeof (this.opt.onClear) === 'function') {
                this.target.on('onClear', this.opt.onClear);
            }
            if (typeof (this.opt.onInitComplete) === 'function') {
                this.target.on('onInitComplete', this.opt.onInitComplete);
            }
            if (typeof (this.opt.onLocateOne) === 'function') {
                this.target.on('onLocateOne', this.opt.onLocateOne);
            }
            if (typeof (this.opt.onLocateAll) === 'function') {
                this.target.on('onLocateAll', this.opt.onLocateAll);
            }
        }
    };

    //實例化，揭露方法，回傳
    $.fn[pluginName] = function (options, args) {
        var gfInstance;
        this.each(function () {
            gfInstance = new gfLocateCsv($(this), options);
        });

        return this;
    };
})(jQuery, window, document);