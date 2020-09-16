'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
    var __ = wpI18n.__;
    var Component = wpElement.Component,
        Fragment = wpElement.Fragment;
    var registerBlockType = wpBlocks.registerBlockType;
    var InspectorControls = wpEditor.InspectorControls,
        mediaUpload = wpEditor.mediaUpload,
        MediaUpload = wpEditor.MediaUpload,
        BlockControls = wpEditor.BlockControls,
        PanelColorSettings = wpEditor.PanelColorSettings;
    var PanelBody = wpComponents.PanelBody,
        ToggleControl = wpComponents.ToggleControl,
        SelectControl = wpComponents.SelectControl,
        TextControl = wpComponents.TextControl,
        Text = wpComponents.Text,
        IconButton = wpComponents.IconButton,
        Button = wpComponents.Button,
        Tooltip = wpComponents.Tooltip,
        Toolbar = wpComponents.Toolbar,
        FormFileUpload = wpComponents.FormFileUpload,
        Placeholder = wpComponents.Placeholder,
        RangeControl = wpComponents.RangeControl,
        QueryControls = wpComponents.QueryControls;

    var $ = jQuery;
    var ALLOWED_MEDIA_TYPES = ['image'];
    var _lodash = lodash,
        pick = _lodash.pick,
        get = _lodash.get;
    var isBlobURL = wp.blob.isBlobURL;

    var pickRelevantMediaFiles = function pickRelevantMediaFiles(image) {
        var imageProps = pick(image, ['alt', 'id', 'link', 'caption', 'title', 'date', 'media_details']);
        imageProps.url = get(image, ['sizes', 'large', 'url']) || get(image, ['media_details', 'sizes', 'large', 'source_url']) || image.url;
        return imageProps;
    };

    var wpmf_local_categories = [];
    var wpmf_cloud_categories = [];
    var ij = 0;
    var space = '--';

    if (typeof wpmf === "undefined") {
        return;
    }

    $.each(wpmf.vars.wpmf_categories_order || [], function (key, id) {
        var term = wpmf.vars.wpmf_categories[id];
        if (typeof term !== "undefined") {
            if (0 !== parseInt(term.id)) {
                if (typeof term.depth === 'undefined') {
                    term.depth = 0;
                }

                if (typeof term.drive_type !== "undefined" && term.drive_type !== '') {
                    wpmf_cloud_categories[ij] = {
                        label: space.repeat(term.depth) + term.label,
                        value: term.id
                    };
                } else {
                    wpmf_local_categories[ij] = {
                        label: space.repeat(term.depth) + term.label,
                        value: term.id
                    };
                }

                ij++;
            }
        }
    });

    var folders_length = ij;
    var wpmf_categories = [].concat(wpmf_local_categories, wpmf_cloud_categories);

    var WpmfDefaultTheme = function (_Component) {
        _inherits(WpmfDefaultTheme, _Component);

        function WpmfDefaultTheme() {
            _classCallCheck(this, WpmfDefaultTheme);

            return _possibleConstructorReturn(this, (WpmfDefaultTheme.__proto__ || Object.getPrototypeOf(WpmfDefaultTheme)).apply(this, arguments));
        }

        /**
         * Un Selected image
         */


        _createClass(WpmfDefaultTheme, [{
            key: 'unSelectedImage',
            value: function unSelectedImage(e) {
                if (!$(e.target).hasClass('wpmf-gallery-image')) {
                    this.props.setStateImgSelectedID(0);
                    this.props.setStateImgInfos('', '', '');
                }
            }
        }, {
            key: 'loadImageInfos',
            value: function loadImageInfos(image) {
                if (this.props.selectedImageId !== image.id) {
                    this.props.setStateImgSelectedID(image.id);
                    this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
                } else {
                    this.props.setStateImgSelectedID();
                    this.props.setStateImgInfos();
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes,
                    clientId = _props.clientId;
                var images = attributes.images,
                    columns = attributes.columns,
                    size = attributes.size,
                    img_border_radius = attributes.img_border_radius,
                    gutterwidth = attributes.gutterwidth,
                    borderStyle = attributes.borderStyle,
                    borderWidth = attributes.borderWidth,
                    borderColor = attributes.borderColor,
                    hoverShadowH = attributes.hoverShadowH,
                    hoverShadowV = attributes.hoverShadowV,
                    hoverShadowBlur = attributes.hoverShadowBlur,
                    hoverShadowSpread = attributes.hoverShadowSpread,
                    hoverShadowColor = attributes.hoverShadowColor;


                return React.createElement(
                    'div',
                    { className: 'wpmf-gallery-block wpmfDefault', onClick: this.unSelectedImage.bind(this) },
                    React.createElement(
                        'style',
                        null,
                        borderStyle !== 'none' && '#block-' + clientId + ' .wpmf-gallery-block ul li img {border: ' + borderColor + ' ' + borderWidth + 'px ' + borderStyle + ';}',
                        (parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0) && '#block-' + clientId + ' .wpmf-gallery-block ul li img:hover {box-shadow: ' + hoverShadowH + 'px ' + hoverShadowV + 'px ' + hoverShadowBlur + 'px ' + hoverShadowSpread + 'px ' + hoverShadowColor + ';}'
                    ),
                    React.createElement(
                        'ul',
                        {
                            className: 'wpmf-gallery-list-items gallery-columns-' + columns + ' wpmf-has-border-radius-' + img_border_radius + ' wpmf-has-gutter-width-' + gutterwidth },
                        images.map(function (image, index) {
                            var url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined" || typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined" || typeof image.url !== "undefined") {
                                return React.createElement(
                                    'li',
                                    {
                                        className: isBlobURL(url) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item ",
                                        key: index },
                                    React.createElement(
                                        'div',
                                        { className: _this2.props.selectedImageId === image.id ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos' },
                                        _this2.props.gallery_loading && React.createElement(
                                            'span',
                                            {
                                                className: 'spinner wpmf_spiner_block_gallery_loading' },
                                            ' '
                                        ),
                                        React.createElement('img', {
                                            src: url,
                                            className: 'wpmf-gallery-image',
                                            onClick: _this2.loadImageInfos.bind(_this2, image)
                                        }),
                                        isBlobURL(url) && React.createElement(
                                            'span',
                                            { className: 'spinner' },
                                            ' '
                                        ),
                                        React.createElement(
                                            Tooltip,
                                            { text: __('Remove image', 'wpmf') },
                                            React.createElement(IconButton, {
                                                className: 'wpmf-gallery-block-item-remove',
                                                icon: 'no',
                                                onClick: function onClick() {
                                                    _this2.props.setStateImgInfos(0, '', '');
                                                    setAttributes({
                                                        images: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        image_sortable: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        wpmf_autoinsert: '0'
                                                    });
                                                }
                                            })
                                        )
                                    )
                                );
                            }
                        })
                    )
                );
            }
        }]);

        return WpmfDefaultTheme;
    }(Component);

    var WpmfSliderTheme = function (_Component2) {
        _inherits(WpmfSliderTheme, _Component2);

        function WpmfSliderTheme() {
            _classCallCheck(this, WpmfSliderTheme);

            return _possibleConstructorReturn(this, (WpmfSliderTheme.__proto__ || Object.getPrototypeOf(WpmfSliderTheme)).apply(this, arguments));
        }

        _createClass(WpmfSliderTheme, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var attributes = this.props.attributes;

                if (attributes.images.length) {
                    this.initSlider();
                }
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
                // Deselect images when deselecting the block
                var attributes = this.props.attributes;

                if (attributes.images.length && !(prevProps.attributes.gutterwidth === attributes.gutterwidth && prevProps.attributes.size === attributes.size && prevProps.attributes.columns === attributes.columns && prevProps.attributes.wpmf_orderby === attributes.wpmf_orderby && prevProps.attributes.wpmf_order === attributes.wpmf_order && JSON.stringify(prevProps.attributes.images) === JSON.stringify(attributes.images))) {
                    this.initSlider(attributes.display);
                }
            }

            /**
             * run masonry layout
             */

        }, {
            key: 'initSlider',
            value: function initSlider() {
                var _props2 = this.props,
                    attributes = _props2.attributes,
                    clientId = _props2.clientId;
                var columns = attributes.columns,
                    gutterwidth = attributes.gutterwidth,
                    autoplay = attributes.autoplay;

                var $container = $('#block-' + clientId + ' .wpmf-gallery-block');
                if ($container.is(':hidden')) {
                    return;
                }

                var n = 0;
                if (parseInt(gutterwidth) >= 10) {
                    n = 20;
                }

                if ($container.hasClass('flexslider-is-active')) {
                    var columns_width = ($container.width() - n - (columns - 1) * gutterwidth) / columns;
                    $container.find('.wpmf-gallery-block-item ').width(columns_width);
                    return;
                }

                if (jQuery().flexslider) {
                    imagesLoaded($container, function () {
                        var columns_width = ($container.width() - n - (columns - 1) * gutterwidth) / columns;
                        $container.addClass('flexslider-is-active');
                        /* call flexslider function */
                        $container.flexslider({
                            animation: 'slide',
                            animationLoop: true,
                            slideshow: autoplay === 1,
                            smoothHeight: columns === 1,
                            itemWidth: columns === 1 ? 0 : columns_width,
                            itemMargin: columns === 1 ? 0 : gutterwidth,
                            pauseOnHover: true,
                            slideshowSpeed: 5000,
                            prevText: "",
                            nextText: ""
                        });
                    });
                }
            }

            /**
             * Un Selected image
             */

        }, {
            key: 'unSelectedImage',
            value: function unSelectedImage(e) {
                if (!$(e.target).hasClass('wpmf-gallery-image')) {
                    this.props.setStateImgSelectedID(0);
                    this.props.setStateImgInfos('', '', '');
                }
            }
        }, {
            key: 'loadImageInfos',
            value: function loadImageInfos(image) {
                if (this.props.selectedImageId !== image.id) {
                    this.props.setStateImgSelectedID(image.id);
                    this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
                } else {
                    this.props.setStateImgSelectedID();
                    this.props.setStateImgInfos();
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this4 = this;

                var _props3 = this.props,
                    attributes = _props3.attributes,
                    setAttributes = _props3.setAttributes,
                    clientId = _props3.clientId;
                var images = attributes.images,
                    columns = attributes.columns,
                    size = attributes.size,
                    img_border_radius = attributes.img_border_radius,
                    gutterwidth = attributes.gutterwidth,
                    borderStyle = attributes.borderStyle,
                    borderWidth = attributes.borderWidth,
                    borderColor = attributes.borderColor,
                    hoverShadowH = attributes.hoverShadowH,
                    hoverShadowV = attributes.hoverShadowV,
                    hoverShadowBlur = attributes.hoverShadowBlur,
                    hoverShadowSpread = attributes.hoverShadowSpread,
                    hoverShadowColor = attributes.hoverShadowColor;

                return React.createElement(
                    'div',
                    { className: 'wpmf-gallery-block wpmfBlockSlider wpmf-has-gutter-width-' + gutterwidth, onClick: this.unSelectedImage.bind(this) },
                    React.createElement(
                        'style',
                        null,
                        borderStyle !== 'none' && '#block-' + clientId + ' .wpmf-gallery-block ul li img {border: ' + borderColor + ' ' + borderWidth + 'px ' + borderStyle + ';}',
                        (parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0) && '#block-' + clientId + ' .wpmf-gallery-block ul li img:hover {box-shadow: ' + hoverShadowH + 'px ' + hoverShadowV + 'px ' + hoverShadowBlur + 'px ' + hoverShadowSpread + 'px ' + hoverShadowColor + ';}'
                    ),
                    React.createElement(
                        'ul',
                        {
                            className: 'wpmf-gallery-list-items wpmf-has-columns-' + columns + ' wpmf-has-border-radius-' + img_border_radius + ' slides wpmf-slides' },
                        images.map(function (image, index) {
                            var url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined" || typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined" || typeof image.url !== "undefined") {
                                return React.createElement(
                                    'li',
                                    {
                                        className: isBlobURL(url) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item ",
                                        key: index },
                                    React.createElement(
                                        'div',
                                        { className: _this4.props.selectedImageId === image.id ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos' },
                                        _this4.props.gallery_loading && React.createElement(
                                            'span',
                                            {
                                                className: 'spinner wpmf_spiner_block_gallery_loading' },
                                            ' '
                                        ),
                                        React.createElement('img', {
                                            src: url,
                                            className: 'wpmf-gallery-image',
                                            onClick: _this4.loadImageInfos.bind(_this4, image)
                                        }),
                                        isBlobURL(url) && React.createElement(
                                            'span',
                                            { className: 'spinner' },
                                            ' '
                                        ),
                                        React.createElement(
                                            Tooltip,
                                            { text: __('Remove image', 'wpmf') },
                                            React.createElement(IconButton, {
                                                className: 'wpmf-gallery-block-item-remove',
                                                icon: 'no',
                                                onClick: function onClick() {
                                                    _this4.props.setStateImgInfos(0, '', '');
                                                    setAttributes({
                                                        images: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        image_sortable: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        wpmf_autoinsert: '0'
                                                    });
                                                }
                                            })
                                        )
                                    )
                                );
                            }
                        })
                    )
                );
            }
        }]);

        return WpmfSliderTheme;
    }(Component);

    var WpmfMasonryTheme = function (_Component3) {
        _inherits(WpmfMasonryTheme, _Component3);

        function WpmfMasonryTheme() {
            _classCallCheck(this, WpmfMasonryTheme);

            return _possibleConstructorReturn(this, (WpmfMasonryTheme.__proto__ || Object.getPrototypeOf(WpmfMasonryTheme)).apply(this, arguments));
        }

        _createClass(WpmfMasonryTheme, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var attributes = this.props.attributes;

                if (attributes.images.length) {
                    this.initMasonry();
                }
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
                // Deselect images when deselecting the block
                var attributes = this.props.attributes;

                if (attributes.images.length && !(prevProps.attributes.size === attributes.size && prevProps.attributes.columns === attributes.columns && prevProps.attributes.wpmf_orderby === attributes.wpmf_orderby && prevProps.attributes.wpmf_order === attributes.wpmf_order && JSON.stringify(prevProps.attributes.images) === JSON.stringify(attributes.images))) {
                    this.initMasonry(attributes.display);
                }
            }

            /**
             * run masonry layout
             */

        }, {
            key: 'initMasonry',
            value: function initMasonry() {
                var _props4 = this.props,
                    attributes = _props4.attributes,
                    clientId = _props4.clientId;

                var $container = $('#block-' + clientId + ' .wpmf-gallery-list-items');
                if ($container.is(':hidden')) {
                    return;
                }

                if ($container.hasClass('masonry')) {
                    $container.masonry('destroy');
                }

                imagesLoaded($container, function () {
                    $container.masonry({
                        itemSelector: '.wpmf-gallery-block-item',
                        gutter: 0,
                        transitionDuration: 0,
                        percentPosition: true
                    });
                    $container.css('visibility', 'visible');
                });
            }

            /**
             * Un Selected image
             */

        }, {
            key: 'unSelectedImage',
            value: function unSelectedImage(e) {
                if (!$(e.target).hasClass('wpmf-gallery-image')) {
                    this.props.setStateImgSelectedID(0);
                    this.props.setStateImgInfos('', '', '');
                }
            }
        }, {
            key: 'loadImageInfos',
            value: function loadImageInfos(image) {
                if (this.props.selectedImageId !== image.id) {
                    this.props.setStateImgSelectedID(image.id);
                    this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
                } else {
                    this.props.setStateImgSelectedID();
                    this.props.setStateImgInfos();
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this6 = this;

                var _props5 = this.props,
                    attributes = _props5.attributes,
                    setAttributes = _props5.setAttributes,
                    clientId = _props5.clientId;
                var images = attributes.images,
                    columns = attributes.columns,
                    size = attributes.size,
                    img_border_radius = attributes.img_border_radius,
                    gutterwidth = attributes.gutterwidth,
                    borderStyle = attributes.borderStyle,
                    borderWidth = attributes.borderWidth,
                    borderColor = attributes.borderColor,
                    hoverShadowH = attributes.hoverShadowH,
                    hoverShadowV = attributes.hoverShadowV,
                    hoverShadowBlur = attributes.hoverShadowBlur,
                    hoverShadowSpread = attributes.hoverShadowSpread,
                    hoverShadowColor = attributes.hoverShadowColor;

                return React.createElement(
                    'div',
                    { className: 'wpmf-gallery-block wpmfBlockMasonry', onClick: this.unSelectedImage.bind(this) },
                    React.createElement(
                        'style',
                        null,
                        borderStyle !== 'none' && '#block-' + clientId + ' .wpmf-gallery-block ul li img {border: ' + borderColor + ' ' + borderWidth + 'px ' + borderStyle + ';}',
                        (parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0) && '#block-' + clientId + ' .wpmf-gallery-block ul li img:hover {box-shadow: ' + hoverShadowH + 'px ' + hoverShadowV + 'px ' + hoverShadowBlur + 'px ' + hoverShadowSpread + 'px ' + hoverShadowColor + ';}'
                    ),
                    React.createElement(
                        'ul',
                        {
                            className: 'wpmf-gallery-list-items gallery-columns-' + columns + ' wpmf-has-border-radius-' + img_border_radius + ' wpmf-has-gutter-width-' + gutterwidth },
                        images.map(function (image, index) {
                            var url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined" || typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined" || typeof image.url !== "undefined") {
                                return React.createElement(
                                    'li',
                                    {
                                        className: isBlobURL(url) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item ",
                                        key: index },
                                    React.createElement(
                                        'div',
                                        { className: _this6.props.selectedImageId === image.id ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos' },
                                        _this6.props.gallery_loading && React.createElement(
                                            'span',
                                            {
                                                className: 'spinner wpmf_spiner_block_gallery_loading' },
                                            ' '
                                        ),
                                        React.createElement('img', {
                                            src: url,
                                            className: 'wpmf-gallery-image',
                                            onClick: _this6.loadImageInfos.bind(_this6, image)
                                        }),
                                        isBlobURL(url) && React.createElement(
                                            'span',
                                            { className: 'spinner' },
                                            ' '
                                        ),
                                        React.createElement(
                                            Tooltip,
                                            { text: __('Remove image', 'wpmf') },
                                            React.createElement(IconButton, {
                                                className: 'wpmf-gallery-block-item-remove',
                                                icon: 'no',
                                                onClick: function onClick() {
                                                    _this6.props.setStateImgInfos(0, '', '');
                                                    setAttributes({
                                                        images: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        image_sortable: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        wpmf_autoinsert: '0'
                                                    });
                                                }
                                            })
                                        )
                                    )
                                );
                            }
                        })
                    )
                );
            }
        }]);

        return WpmfMasonryTheme;
    }(Component);

    var WpmfPortfolioTheme = function (_Component4) {
        _inherits(WpmfPortfolioTheme, _Component4);

        function WpmfPortfolioTheme() {
            _classCallCheck(this, WpmfPortfolioTheme);

            return _possibleConstructorReturn(this, (WpmfPortfolioTheme.__proto__ || Object.getPrototypeOf(WpmfPortfolioTheme)).apply(this, arguments));
        }

        _createClass(WpmfPortfolioTheme, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var attributes = this.props.attributes;

                if (attributes.images.length) {
                    this.initMasonry();
                }
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
                // Deselect images when deselecting the block
                var attributes = this.props.attributes;

                if (attributes.images.length && !(prevProps.attributes.size === attributes.size && prevProps.attributes.columns === attributes.columns && prevProps.attributes.wpmf_orderby === attributes.wpmf_orderby && prevProps.attributes.wpmf_order === attributes.wpmf_order && JSON.stringify(prevProps.attributes.images) === JSON.stringify(attributes.images))) {
                    this.initMasonry(attributes.display);
                }
            }

            /**
             * run masonry layout
             */

        }, {
            key: 'initMasonry',
            value: function initMasonry() {
                var _props6 = this.props,
                    attributes = _props6.attributes,
                    clientId = _props6.clientId;

                var $container = $('#block-' + clientId + ' .wpmf-gallery-list-items');
                if ($container.is(':hidden')) {
                    return;
                }

                if ($container.hasClass('masonry')) {
                    $container.masonry('destroy');
                }

                imagesLoaded($container, function () {
                    $container.masonry({
                        itemSelector: '.wpmf-gallery-block-item',
                        gutter: 0,
                        transitionDuration: 0,
                        percentPosition: true
                    });
                    $container.css('visibility', 'visible');
                });
            }

            /**
             * Un Selected image
             */

        }, {
            key: 'unSelectedImage',
            value: function unSelectedImage(e) {
                if (!$(e.target).hasClass('wpmf-gallery-image') && !$(e.target).hasClass('wpmf_overlay')) {
                    this.props.setStateImgSelectedID(0);
                    this.props.setStateImgInfos('', '', '');
                }
            }
        }, {
            key: 'loadImageInfos',
            value: function loadImageInfos(image) {
                if (this.props.selectedImageId !== image.id) {
                    this.props.setStateImgSelectedID(image.id);
                    this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
                } else {
                    this.props.setStateImgSelectedID();
                    this.props.setStateImgInfos();
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this8 = this;

                var _props7 = this.props,
                    attributes = _props7.attributes,
                    setAttributes = _props7.setAttributes,
                    clientId = _props7.clientId;
                var images = attributes.images,
                    columns = attributes.columns,
                    size = attributes.size,
                    img_border_radius = attributes.img_border_radius,
                    gutterwidth = attributes.gutterwidth,
                    borderStyle = attributes.borderStyle,
                    borderWidth = attributes.borderWidth,
                    borderColor = attributes.borderColor,
                    hoverShadowH = attributes.hoverShadowH,
                    hoverShadowV = attributes.hoverShadowV,
                    hoverShadowBlur = attributes.hoverShadowBlur,
                    hoverShadowSpread = attributes.hoverShadowSpread,
                    hoverShadowColor = attributes.hoverShadowColor;

                return React.createElement(
                    'div',
                    { className: 'wpmf-gallery-block wpmfBlockMasonry', onClick: this.unSelectedImage.bind(this) },
                    React.createElement(
                        'style',
                        null,
                        borderStyle !== 'none' && '#block-' + clientId + ' .wpmf-gallery-block ul li img {border: ' + borderColor + ' ' + borderWidth + 'px ' + borderStyle + ';}',
                        (parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0) && '#block-' + clientId + ' .wpmf-gallery-block ul li img:hover {box-shadow: ' + hoverShadowH + 'px ' + hoverShadowV + 'px ' + hoverShadowBlur + 'px ' + hoverShadowSpread + 'px ' + hoverShadowColor + ';}'
                    ),
                    React.createElement(
                        'ul',
                        {
                            className: 'wpmf-gallery-list-items gallery-columns-' + columns + ' wpmf-has-border-radius-' + img_border_radius + ' wpmf-has-gutter-width-' + gutterwidth },
                        images.map(function (image, index) {
                            var url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined" || typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined" || typeof image.url !== "undefined") {
                                return React.createElement(
                                    'li',
                                    {
                                        className: isBlobURL(url) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item ",
                                        key: index },
                                    React.createElement(
                                        'div',
                                        { className: _this8.props.selectedImageId === image.id ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos' },
                                        _this8.props.gallery_loading && React.createElement(
                                            'span',
                                            {
                                                className: 'spinner wpmf_spiner_block_gallery_loading' },
                                            ' '
                                        ),
                                        React.createElement(
                                            'div',
                                            { onClick: function onClick() {
                                                    return _this8.loadImageInfos(image);
                                                }, className: 'wpmf_overlay' },
                                            ' '
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: 'portfolio_lightbox', title: image.title },
                                            '+'
                                        ),
                                        React.createElement('img', {
                                            src: url,
                                            className: 'wpmf-gallery-image'
                                        }),
                                        isBlobURL(url) && React.createElement(
                                            'span',
                                            { className: 'spinner' },
                                            ' '
                                        ),
                                        React.createElement(
                                            Tooltip,
                                            { text: __('Remove image', 'wpmf') },
                                            React.createElement(IconButton, {
                                                className: 'wpmf-gallery-block-item-remove',
                                                icon: 'no',
                                                onClick: function onClick() {
                                                    _this8.props.setStateImgInfos(0, '', '');
                                                    setAttributes({
                                                        images: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        image_sortable: images.filter(function (img, i) {
                                                            return i !== index;
                                                        }),
                                                        wpmf_autoinsert: '0'
                                                    });
                                                }
                                            })
                                        )
                                    ),
                                    React.createElement(
                                        'div',
                                        { className: 'wpmf-caption-text wpmf-gallery-caption' },
                                        image.title !== '' && React.createElement(
                                            'span',
                                            { className: 'title' },
                                            image.title
                                        ),
                                        image.caption !== '' && React.createElement(
                                            'span',
                                            { className: 'excerpt' },
                                            image.caption
                                        )
                                    )
                                );
                            }
                        })
                    )
                );
            }
        }]);

        return WpmfPortfolioTheme;
    }(Component);

    var wpmfWordpressGallery = function (_Component5) {
        _inherits(wpmfWordpressGallery, _Component5);

        function wpmfWordpressGallery() {
            _classCallCheck(this, wpmfWordpressGallery);

            var _this9 = _possibleConstructorReturn(this, (wpmfWordpressGallery.__proto__ || Object.getPrototypeOf(wpmfWordpressGallery)).apply(this, arguments));

            _this9.state = {
                inited: false,
                uploaded: false,
                gallery_loading: false,
                selectedImageId: 0,
                selectedImageInfos: {
                    title: '',
                    caption: '',
                    custom_link: '',
                    link_target: '_self'
                }
            };
            _this9.addFiles = _this9.addFiles.bind(_this9);
            _this9.uploadFromFiles = _this9.uploadFromFiles.bind(_this9);
            return _this9;
        }

        _createClass(wpmfWordpressGallery, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _this10 = this;

                var _props8 = this.props,
                    attributes = _props8.attributes,
                    setAttributes = _props8.setAttributes;
                var images = attributes.images,
                    image_sortable = attributes.image_sortable,
                    display = attributes.display,
                    wpmf_autoinsert = attributes.wpmf_autoinsert,
                    wpmf_folder_id = attributes.wpmf_folder_id;

                var currentBlockConfig = wpmf_blocks.vars.gallery_configs.theme[display + '_theme'];
                // No override attributes of blocks inserted before
                if (!attributes.changed) {
                    if ((typeof currentBlockConfig === 'undefined' ? 'undefined' : _typeof(currentBlockConfig)) === 'object' && currentBlockConfig !== null) {
                        Object.keys(currentBlockConfig).map(function (attribute) {
                            if (attribute === 'orderby' || attribute === 'order') {
                                attributes['wpmf_' + attribute] = currentBlockConfig[attribute];
                            } else {
                                attributes[attribute] = currentBlockConfig[attribute];
                            }
                        });
                    }

                    // Finally set changed attribute to true, so we don't modify anything again
                    setAttributes({ changed: true });
                }

                var wpmf_orderby = attributes.wpmf_orderby,
                    wpmf_order = attributes.wpmf_order;

                if (wpmf_folder_id.length && parseInt(wpmf_autoinsert) === 1) {
                    this.loadImagesFromFolder(wpmf_folder_id, wpmf_orderby, wpmf_order);
                } else {
                    var imgsId = images.map(function (img) {
                        return img.id;
                    });
                    this.setState({ gallery_loading: true });
                    fetch(wpmf_blocks.vars.ajaxurl + ('?action=gallery_block_load_image_infos&ids=' + imgsId.join() + '&wpmf_nonce=' + wpmf_blocks.vars.wpmf_nonce)).then(function (res) {
                        return res.json();
                    }).then(function (result) {
                        if (result.status) {
                            images.map(function (img) {
                                img.title = result.titles[img.id];
                                img.caption = result.captions[img.id];
                                img.custom_link = result.custom_links[img.id];
                                img.link_target = result.link_targets[img.id];
                                return img;
                            });

                            image_sortable.map(function (img) {
                                img.title = result.titles[img.id];
                                img.caption = result.captions[img.id];
                                img.custom_link = result.custom_links[img.id];
                                img.link_target = result.link_targets[img.id];
                                return img;
                            });
                            _this10.setState({ gallery_loading: false });
                        }
                    },
                    // errors
                    function (error) {});
                }
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                var _props9 = this.props,
                    attributes = _props9.attributes,
                    setAttributes = _props9.setAttributes;

                if (nextProps.attributes.display !== attributes.display) {
                    // set default settings by theme
                    var currentBlockConfig = wpmf_blocks.vars.gallery_configs.theme[nextProps.attributes.display + '_theme'];
                    if ((typeof currentBlockConfig === 'undefined' ? 'undefined' : _typeof(currentBlockConfig)) === 'object' && currentBlockConfig !== null) {
                        Object.keys(currentBlockConfig).map(function (attribute) {
                            if (attribute === 'orderby' || attribute === 'order') {
                                nextProps.attributes['wpmf_' + attribute] = currentBlockConfig[attribute];
                            } else {
                                nextProps.attributes[attribute] = currentBlockConfig[attribute];
                            }
                        });
                        setAttributes(nextProps.attributes);
                    }
                }
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
                // Deselect images when deselecting the block
                var _props10 = this.props,
                    attributes = _props10.attributes,
                    setAttributes = _props10.setAttributes,
                    isSelected = _props10.isSelected;

                if (!isSelected && prevProps.isSelected) {
                    this.setStateImgSelectedID();
                    this.setStateImgInfos();
                }
            }
        }, {
            key: 'loadImagesFromFolder',
            value: function loadImagesFromFolder(folders, orderby, order) {
                var _this11 = this;

                var _props11 = this.props,
                    attributes = _props11.attributes,
                    setAttributes = _props11.setAttributes,
                    clientId = _props11.clientId;
                var images = attributes.images;

                this.setState({ gallery_loading: true });
                fetch(wpmf_blocks.vars.ajaxurl + ('?action=wpmf_gallery_from_folder&ids=' + folders.join() + '&orderby=' + orderby + '&order=' + order + '&wpmf_nonce=' + wpmf_blocks.vars.wpmf_nonce)).then(function (res) {
                    return res.json();
                }).then(function (result) {
                    if (result.status) {
                        var allImages = result.images;
                        _this11.setState({ gallery_loading: false });
                        if (JSON.stringify(images) !== JSON.stringify(result.images)) {
                            setAttributes({
                                images: allImages,
                                image_sortable: allImages
                            });
                        }

                        if (!allImages.length) {
                            if (!$('#block-' + clientId + ' .wpmf_gallery_img_msg').length) {
                                $('#block-' + clientId + ' .wpmf_select_folders').after('<span class="wpmf_gallery_img_msg">' + __('Ooups, this folder does not have any images...', 'wpmf') + '</span>');
                            }
                        }
                    }
                });
            }

            /**
             * Do sort image
             */

        }, {
            key: 'doSort',
            value: function doSort(wpmf_orderby, wpmf_order) {
                var _props12 = this.props,
                    attributes = _props12.attributes,
                    setAttributes = _props12.setAttributes;
                var images = attributes.images,
                    image_sortable = attributes.image_sortable;

                var images_ordered = void 0;
                // Order images
                switch (wpmf_orderby) {
                    default:
                    case 'title':
                        if (wpmf_order === 'DESC') {
                            images_ordered = [].concat(images).sort(function (a, b) {
                                if (typeof a.title !== "undefined" && typeof b.title !== "undefined") {
                                    return b.title.localeCompare(a.title);
                                } else {
                                    return b.url.localeCompare(a.url);
                                }
                            });
                        } else {
                            images_ordered = [].concat(images).sort(function (a, b) {
                                if (typeof a.title !== "undefined" && typeof b.title !== "undefined") {
                                    return a.title.localeCompare(b.title);
                                } else {
                                    return a.url.localeCompare(b.url);
                                }
                            });
                        }

                        setAttributes({
                            wpmf_orderby: wpmf_orderby,
                            wpmf_order: wpmf_order,
                            images: images_ordered
                        });

                        break;
                    case 'date':
                        if (wpmf_order === 'DESC') {
                            images_ordered = [].concat(images).sort(function (a, b) {
                                return new Date(b.id).getTime() - new Date(a.id).getTime();
                            });
                        } else {
                            images_ordered = [].concat(images).sort(function (a, b) {
                                return new Date(a.id).getTime() - new Date(b.id).getTime();
                            });
                        }

                        setAttributes({
                            wpmf_orderby: wpmf_orderby,
                            wpmf_order: wpmf_order,
                            images: images_ordered
                        });
                        break;
                    case 'post__in':
                        setAttributes({
                            wpmf_orderby: wpmf_orderby,
                            wpmf_order: wpmf_order,
                            images: image_sortable
                        });
                        break;
                }
            }

            /**
             * Set images orderby
             */

        }, {
            key: 'sortImageOrderBy',
            value: function sortImageOrderBy(value) {
                var attributes = this.props.attributes;
                var wpmf_order = attributes.wpmf_order;

                this.doSort(value, wpmf_order);
            }

            /**
             * Set images order
             */

        }, {
            key: 'sortImageOrder',
            value: function sortImageOrder(value) {
                var attributes = this.props.attributes;
                var wpmf_orderby = attributes.wpmf_orderby;

                this.doSort(wpmf_orderby, value);
            }
        }, {
            key: 'setAutoInsertGallery',
            value: function setAutoInsertGallery(value) {
                var _props13 = this.props,
                    attributes = _props13.attributes,
                    setAttributes = _props13.setAttributes;
                var wpmf_folder_id = attributes.wpmf_folder_id,
                    wpmf_orderby = attributes.wpmf_orderby,
                    wpmf_order = attributes.wpmf_order;

                setAttributes({ wpmf_autoinsert: value });
                if (parseInt(value) === 1 && wpmf_folder_id.length) {
                    this.loadImagesFromFolder(wpmf_folder_id, wpmf_orderby, wpmf_order);
                }
            }
        }, {
            key: 'setFoldersGallery',
            value: function setFoldersGallery(value, auto) {
                var _props14 = this.props,
                    attributes = _props14.attributes,
                    setAttributes = _props14.setAttributes;
                var wpmf_autoinsert = attributes.wpmf_autoinsert,
                    wpmf_orderby = attributes.wpmf_orderby,
                    wpmf_order = attributes.wpmf_order;

                setAttributes({ wpmf_folder_id: value, wpmf_autoinsert: '1' });
                if (auto) {
                    this.loadImagesFromFolder(value, wpmf_orderby, wpmf_order);
                } else {
                    if (parseInt(wpmf_autoinsert) === 1) {
                        this.loadImagesFromFolder(value, wpmf_orderby, wpmf_order);
                    }
                }
            }
        }, {
            key: 'setRadiusTo',
            value: function setRadiusTo(value) {
                var setAttributes = this.props.setAttributes;

                setAttributes({ img_border_radius: value });
            }

            /**
             * Load image infos
             */

        }, {
            key: 'loadImageInfos',
            value: function loadImageInfos(image) {
                if (this.state.selectedImageId !== image.id) {
                    this.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
                }

                this.setState({ selectedImageId: this.state.selectedImageId === image.id ? 0 : image.id });
            }

            /**
             * Update image info
             */

        }, {
            key: 'updateImageInfos',
            value: function updateImageInfos() {
                var _this12 = this;

                var _props15 = this.props,
                    attributes = _props15.attributes,
                    setAttributes = _props15.setAttributes;
                var images = attributes.images;

                $('.save_img_action span').addClass('visible');
                fetch(wpmf_blocks.vars.ajaxurl + ('?action=gallery_block_update_image_infos&id=' + this.state.selectedImageId + '&title=' + this.state.selectedImageInfos.title + '&caption=' + this.state.selectedImageInfos.caption + '&custom_link=' + this.state.selectedImageInfos.custom_link + '&link_target=' + this.state.selectedImageInfos.link_target + '&wpmf_nonce=' + wpmf_blocks.vars.wpmf_nonce)).then(function (res) {
                    return res.json();
                }).then(function (result) {
                    $('.save_img_action span').removeClass('visible');
                    if (result.status) {
                        images.map(function (img) {
                            if (img.id === _this12.state.selectedImageId) {
                                img.title = result.infos.title;
                                img.caption = result.infos.caption;
                                img.custom_link = result.infos.custom_link;
                                img.link_target = result.infos.link_target;
                            }

                            return img;
                        });
                    }
                },
                // errors
                function (error) {
                    _this12.setStateImgInfos();
                });
            }

            /**
             * Un Selected image
             */

        }, {
            key: 'unSelectedImage',
            value: function unSelectedImage(e) {
                if (!$(e.target).hasClass('wpmf-gallery-image')) {
                    this.setStateImgSelectedID();
                    this.setStateImgInfos();
                }
            }

            /**
             * Select image
             */

        }, {
            key: 'onSelectImages',
            value: function onSelectImages(imgss) {
                var _props16 = this.props,
                    attributes = _props16.attributes,
                    setAttributes = _props16.setAttributes;
                var images = attributes.images,
                    wpmf_orderby = attributes.wpmf_orderby,
                    wpmf_order = attributes.wpmf_order;


                var imgs = imgss.map(function (img) {
                    return wp.media.attachment(img.id).attributes;
                });
                var check = false;
                setAttributes({
                    images: imgs,
                    image_sortable: imgs
                });

                if (images.length <= imgs.length) {
                    if (images.length) {
                        images.map(function (img, index) {
                            if (img.id !== imgs[index].id) {
                                setAttributes({
                                    wpmf_orderby: 'post__in'
                                });
                                check = true;
                            }
                        });
                    } else {
                        check = false;
                    }

                    if (!check) {
                        this.doSort(wpmf_orderby, wpmf_order);
                    }
                } else {
                    imgs.map(function (img, index) {
                        if (img.id !== images[index].id) {
                            setAttributes({
                                wpmf_orderby: 'post__in'
                            });
                        }
                    });
                }
            }

            /**
             * Upload files
             */

        }, {
            key: 'uploadFromFiles',
            value: function uploadFromFiles(event) {
                this.addFiles(event.target.files);
            }

            /**
             * Add files
             */

        }, {
            key: 'addFiles',
            value: function addFiles(files) {
                var _props17 = this.props,
                    attributes = _props17.attributes,
                    setAttributes = _props17.setAttributes;
                var images = attributes.images;

                mediaUpload({
                    allowedTypes: ALLOWED_MEDIA_TYPES,
                    filesList: files,
                    onFileChange: function onFileChange(imgs) {
                        var imagesNormalized = imgs.map(function (image) {
                            return pickRelevantMediaFiles(image);
                        });

                        setAttributes({
                            images: images.concat(imagesNormalized),
                            image_sortable: images.concat(imagesNormalized)
                        });
                    }
                });
            }
        }, {
            key: 'setStateImgInfos',
            value: function setStateImgInfos() {
                var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                var caption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
                var custom_link = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
                var link_target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '_self';

                this.setState({
                    selectedImageInfos: {
                        title: title,
                        caption: caption,
                        custom_link: custom_link,
                        link_target: link_target
                    }
                });
            }
        }, {
            key: 'setStateImgSelectedID',
            value: function setStateImgSelectedID() {
                var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                this.setState({
                    selectedImageId: id
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this13 = this;

                var listBorderStyles = [{ label: __('None', 'wpmf'), value: 'none' }, { label: __('Solid', 'wpmf'), value: 'solid' }, { label: __('Dotted', 'wpmf'), value: 'dotted' }, { label: __('Dashed', 'wpmf'), value: 'dashed' }, { label: __('Double', 'wpmf'), value: 'double' }, { label: __('Groove', 'wpmf'), value: 'groove' }, { label: __('Ridge', 'wpmf'), value: 'ridge' }, { label: __('Inset', 'wpmf'), value: 'inset' }, { label: __('Outset', 'wpmf'), value: 'outset' }];

                var _props18 = this.props,
                    attributes = _props18.attributes,
                    setAttributes = _props18.setAttributes,
                    className = _props18.className,
                    isSelected = _props18.isSelected,
                    clientId = _props18.clientId;
                var images = attributes.images,
                    display = attributes.display,
                    columns = attributes.columns,
                    size = attributes.size,
                    targetsize = attributes.targetsize,
                    link = attributes.link,
                    wpmf_orderby = attributes.wpmf_orderby,
                    wpmf_order = attributes.wpmf_order,
                    autoplay = attributes.autoplay,
                    img_border_radius = attributes.img_border_radius,
                    borderWidth = attributes.borderWidth,
                    borderStyle = attributes.borderStyle,
                    borderColor = attributes.borderColor,
                    hoverShadowH = attributes.hoverShadowH,
                    hoverShadowV = attributes.hoverShadowV,
                    hoverShadowBlur = attributes.hoverShadowBlur,
                    hoverShadowSpread = attributes.hoverShadowSpread,
                    hoverShadowColor = attributes.hoverShadowColor,
                    gutterwidth = attributes.gutterwidth,
                    wpmf_autoinsert = attributes.wpmf_autoinsert,
                    wpmf_folder_id = attributes.wpmf_folder_id,
                    cover = attributes.cover;

                var list_sizes = Object.keys(wpmf_blocks.vars.sizes).map(function (key, label) {
                    return {
                        label: wpmf_blocks.vars.sizes[key],
                        value: key
                    };
                });

                var controls = React.createElement(
                    BlockControls,
                    null,
                    images.length && React.createElement(
                        Toolbar,
                        null,
                        React.createElement(MediaUpload, {
                            onSelect: function onSelect(imgs) {
                                return _this13.onSelectImages(imgs);
                            },
                            allowedTypes: ALLOWED_MEDIA_TYPES,
                            multiple: true,
                            gallery: true,
                            value: images.map(function (img) {
                                return img.id;
                            }),
                            render: function render(_ref) {
                                var open = _ref.open;
                                return React.createElement(IconButton, {
                                    className: 'components-toolbar__control',
                                    label: __('Edit Gallery', 'wpmf'),
                                    icon: 'edit',
                                    onClick: open
                                });
                            }
                        })
                    )
                );

                var inspect_controls = React.createElement(
                    InspectorControls,
                    null,
                    this.state.selectedImageId === 0 && React.createElement(
                        'div',
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Gallery Settings', 'wpmf') },
                            React.createElement(SelectControl, {
                                label: __('Theme', 'wpmf'),
                                value: display,
                                options: [{ label: __('Default', 'wpmf'), value: 'default' }, { label: __('Masonry', 'wpmf'), value: 'masonry' }, { label: __('Portfolio', 'wpmf'), value: 'portfolio' }, { label: __('Slider', 'wpmf'), value: 'slider' }],
                                onChange: function onChange(value) {
                                    return setAttributes({ display: value });
                                }
                            }),
                            React.createElement(
                                'div',
                                { className: 'wpmf_sl_gallery_folders components-base-control' },
                                React.createElement(
                                    'label',
                                    { className: 'components-base-control__label' },
                                    __('Select a folder', 'wpmf')
                                ),
                                React.createElement(
                                    'select',
                                    { size: folders_length, className: 'wpmf_select_folders_controll', multiple: true, onChange: function onChange() {
                                            return _this13.setFoldersGallery($('.wpmf_select_folders_controll').val(), false);
                                        } },
                                    wpmf_categories.map(function (category, index) {
                                        if (wpmf_folder_id.indexOf(category.value.toString()) !== -1) {
                                            return React.createElement(
                                                'option',
                                                { selected: true, key: index, value: category.value },
                                                category.label
                                            );
                                        } else {
                                            return React.createElement(
                                                'option',
                                                { key: index, value: category.value },
                                                category.label
                                            );
                                        }
                                    })
                                )
                            ),
                            React.createElement(SelectControl, {
                                label: __('Columns', 'wpmf'),
                                value: columns,
                                options: [{ label: 1, value: '1' }, { label: 2, value: '2' }, { label: 3, value: '3' }, { label: 4, value: '4' }, { label: 5, value: '5' }, { label: 6, value: '6' }, { label: 7, value: '7' }, { label: 8, value: '8' }, { label: 9, value: '9' }],
                                onChange: function onChange(value) {
                                    return setAttributes({ columns: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Gallery image size', 'wpmf'),
                                value: size,
                                options: list_sizes,
                                onChange: function onChange(value) {
                                    return setAttributes({ size: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Lightbox size', 'wpmf'),
                                value: targetsize,
                                options: list_sizes,
                                onChange: function onChange(value) {
                                    return setAttributes({ targetsize: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Action on click', 'wpmf'),
                                value: link,
                                options: [{ label: __('Lightbox', 'wpmf'), value: 'file' }, { label: __('Attachment Page', 'wpmf'), value: 'post' }, { label: __('None', 'wpmf'), value: 'none' }, { label: __('Custom link', 'wpmf'), value: 'custom' }],
                                onChange: function onChange(value) {
                                    return setAttributes({ link: value });
                                }
                            }),
                            React.createElement(SelectControl, {
                                label: __('Order by', 'wpmf'),
                                value: wpmf_orderby,
                                options: [{ label: __('Custom', 'wpmf'), value: 'post__in' }, { label: __('Random', 'wpmf'), value: 'rand' }, { label: __('Title', 'wpmf'), value: 'title' }, { label: __('Date', 'wpmf'), value: 'date' }],
                                onChange: this.sortImageOrderBy.bind(this)
                            }),
                            React.createElement(SelectControl, {
                                label: __('Order', 'wpmf'),
                                value: wpmf_order,
                                options: [{ label: __('Ascending', 'wpmf'), value: 'ASC' }, { label: __('Descending ', 'wpmf'), value: 'DESC' }],
                                onChange: this.sortImageOrder.bind(this)
                            }),
                            React.createElement(SelectControl, {
                                label: __('Update with new folder content', 'wpmf'),
                                value: wpmf_autoinsert,
                                options: [{ label: __('No', 'wpmf'), value: '0' }, { label: __('Yes ', 'wpmf'), value: '1' }],
                                onChange: this.setAutoInsertGallery.bind(this)
                            }),
                            display === 'slider' && React.createElement(ToggleControl, {
                                label: __('Autoplay', 'wpmf'),
                                checked: autoplay,
                                onChange: function onChange() {
                                    return setAttributes({ autoplay: autoplay === 1 ? 0 : 1 });
                                }
                            })
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Border', 'wpmf'), initialOpen: false },
                            React.createElement(RangeControl, {
                                label: __('Border radius', 'wpmf'),
                                'aria-label': __('Add rounded corners to the gallery items.', 'wpmf'),
                                value: img_border_radius,
                                onChange: this.setRadiusTo.bind(this),
                                min: 0,
                                max: 20,
                                step: 1
                            }),
                            React.createElement(SelectControl, {
                                label: __('Border style', 'wpmf'),
                                value: borderStyle,
                                options: listBorderStyles,
                                onChange: function onChange(value) {
                                    return setAttributes({ borderStyle: value });
                                }
                            }),
                            borderStyle !== 'none' && React.createElement(
                                Fragment,
                                null,
                                React.createElement(PanelColorSettings, {
                                    title: __('Border Color', 'wpmf'),
                                    initialOpen: false,
                                    colorSettings: [{
                                        label: __('Border Color', 'wpmf'),
                                        value: borderColor,
                                        onChange: function onChange(value) {
                                            return setAttributes({ borderColor: value === undefined ? '#2196f3' : value });
                                        }
                                    }]
                                }),
                                React.createElement(RangeControl, {
                                    label: __('Border width', 'wpmf'),
                                    value: borderWidth || 0,
                                    onChange: function onChange(value) {
                                        return setAttributes({ borderWidth: value });
                                    },
                                    min: 0,
                                    max: 10
                                })
                            )
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Margin', 'wpmf'), initialOpen: false },
                            React.createElement(RangeControl, {
                                label: __('Gutter', 'wpmf'),
                                value: gutterwidth,
                                onChange: function onChange(value) {
                                    return setAttributes({ gutterwidth: value });
                                },
                                min: 0,
                                max: 50,
                                step: 5
                            })
                        ),
                        React.createElement(
                            PanelBody,
                            { title: __('Shadow', 'wpmf'), initialOpen: false },
                            React.createElement(RangeControl, {
                                label: __('Shadow H offset', 'wpmf'),
                                value: hoverShadowH || 0,
                                onChange: function onChange(value) {
                                    return setAttributes({ hoverShadowH: value });
                                },
                                min: -50,
                                max: 50
                            }),
                            React.createElement(RangeControl, {
                                label: __('Shadow V offset', 'wpmf'),
                                value: hoverShadowV || 0,
                                onChange: function onChange(value) {
                                    return setAttributes({ hoverShadowV: value });
                                },
                                min: -50,
                                max: 50
                            }),
                            React.createElement(RangeControl, {
                                label: __('Shadow blur', 'wpmf'),
                                value: hoverShadowBlur || 0,
                                onChange: function onChange(value) {
                                    return setAttributes({ hoverShadowBlur: value });
                                },
                                min: 0,
                                max: 50
                            }),
                            React.createElement(RangeControl, {
                                label: __('Shadow spread', 'wpmf'),
                                value: hoverShadowSpread || 0,
                                onChange: function onChange(value) {
                                    return setAttributes({ hoverShadowSpread: value });
                                },
                                min: 0,
                                max: 50
                            }),
                            React.createElement(PanelColorSettings, {
                                title: __('Color Settings', 'wpmf'),
                                initialOpen: false,
                                colorSettings: [{
                                    label: __('Shadow Color', 'wpmf'),
                                    value: hoverShadowColor,
                                    onChange: function onChange(value) {
                                        return setAttributes({ hoverShadowColor: value === undefined ? '#ccc' : value });
                                    }
                                }]
                            })
                        )
                    ),
                    this.state.selectedImageId !== 0 && React.createElement(
                        PanelBody,
                        { title: __('Image Settings', 'wpmf') },
                        React.createElement(TextControl, {
                            label: __('Title', 'wpmf'),
                            value: this.state.selectedImageInfos.title,
                            onChange: function onChange(value) {
                                _this13.setState({
                                    selectedImageInfos: _extends({}, _this13.state.selectedImageInfos, {
                                        title: value
                                    })
                                });
                            }
                        }),
                        React.createElement(TextControl, {
                            label: __('Caption', 'wpmf'),
                            value: this.state.selectedImageInfos.caption,
                            onChange: function onChange(value) {
                                _this13.setState({
                                    selectedImageInfos: _extends({}, _this13.state.selectedImageInfos, {
                                        caption: value
                                    })
                                });
                            }
                        }),
                        React.createElement(TextControl, {
                            label: __('Custom link', 'wpmf'),
                            value: this.state.selectedImageInfos.custom_link,
                            onChange: function onChange(value) {
                                _this13.setState({
                                    selectedImageInfos: _extends({}, _this13.state.selectedImageInfos, {
                                        custom_link: value
                                    })
                                });
                            }
                        }),
                        React.createElement(SelectControl, {
                            label: __('Link target', 'wpmf'),
                            value: this.state.selectedImageInfos.link_target,
                            options: [{ label: __('Same Window', 'wpmf'), value: '_self' }, { label: __('New Window ', 'wpmf'), value: '_blank' }],
                            onChange: function onChange(value) {
                                _this13.setState({
                                    selectedImageInfos: _extends({}, _this13.state.selectedImageInfos, {
                                        link_target: value
                                    })
                                });
                            }
                        }),
                        React.createElement(
                            'div',
                            { className: 'save_img_action' },
                            React.createElement(
                                Button,
                                { className: 'is-button is-default is-primary is-large',
                                    onClick: this.updateImageInfos.bind(this) },
                                __('Save', 'wpmf')
                            ),
                            React.createElement(
                                'span',
                                { className: 'spinner' },
                                ' '
                            )
                        )
                    )
                );

                if (typeof cover !== "undefined" && images.length === 0) {
                    return React.createElement(
                        'div',
                        { className: 'wpmf-cover' },
                        React.createElement('img', { src: cover })
                    );
                }

                if (typeof cover === "undefined" && images.length === 0) {
                    return React.createElement(
                        Placeholder,
                        {
                            icon: 'format-gallery',
                            label: __('WP Media Folder Gallery', 'wpmf'),
                            instructions: __('Load images from media folder, from your media library or just upload new images', 'wpmf'),
                            className: className
                        },
                        React.createElement(
                            'div',
                            { className: 'wpmf_sl_gallery_folders' },
                            React.createElement(
                                'select',
                                { size: folders_length, className: 'wpmf_select_folders', multiple: true, onChange: function onChange() {
                                        return setAttributes({ wpmf_folder_id: $('#block-' + clientId + ' .wpmf_select_folders').val() });
                                    } },
                                wpmf_categories.map(function (category, index) {
                                    if (wpmf_folder_id.indexOf(category.value.toString()) !== -1) {
                                        return React.createElement(
                                            'option',
                                            { selected: true, key: index, value: category.value },
                                            category.label
                                        );
                                    } else {
                                        return React.createElement(
                                            'option',
                                            { key: index, value: category.value },
                                            category.label
                                        );
                                    }
                                })
                            )
                        ),
                        React.createElement(
                            FormFileUpload,
                            {
                                multiple: true,
                                isLarge: true,
                                className: 'editor-media-placeholder__button wpmf_btn_upload_img',
                                onChange: this.uploadFromFiles,
                                accept: 'image/*',
                                icon: 'upload'
                            },
                            __('Upload', 'wpmf')
                        ),
                        React.createElement(MediaUpload, {
                            gallery: true,
                            multiple: true,
                            onSelect: function onSelect(imgs) {
                                return _this13.onSelectImages(imgs);
                            },
                            accept: 'image/*',
                            allowedTypes: ALLOWED_MEDIA_TYPES,
                            render: function render(_ref2) {
                                var open = _ref2.open;
                                return React.createElement(
                                    Button,
                                    {
                                        isLarge: true,
                                        className: 'editor-media-placeholder__button wpmfLibrary',
                                        onClick: open
                                    },
                                    __('Media Library', 'wpmf')
                                );
                            }
                        }),
                        React.createElement(
                            Button,
                            {
                                isLarge: true,
                                isPrimary: true,
                                className: 'editor-media-placeholder__button',
                                onClick: function onClick() {
                                    return _this13.setFoldersGallery(wpmf_folder_id, true);
                                }
                            },
                            __('CREATE GALLERY', 'wpmf')
                        )
                    );
                }

                if (typeof cover === "undefined" && images.length) {
                    return React.createElement(
                        Fragment,
                        null,
                        controls,
                        inspect_controls,
                        display === 'slider' && React.createElement(WpmfSliderTheme, _extends({}, this.props, { selectedImageId: this.state.selectedImageId,
                            gallery_loading: this.state.gallery_loading,
                            setStateImgInfos: this.setStateImgInfos.bind(this),
                            setStateImgSelectedID: this.setStateImgSelectedID.bind(this) })),
                        display === 'default' && React.createElement(WpmfDefaultTheme, _extends({}, this.props, { selectedImageId: this.state.selectedImageId,
                            gallery_loading: this.state.gallery_loading,
                            setStateImgInfos: this.setStateImgInfos.bind(this),
                            setStateImgSelectedID: this.setStateImgSelectedID.bind(this) })),
                        display === 'masonry' && React.createElement(WpmfMasonryTheme, _extends({}, this.props, { selectedImageId: this.state.selectedImageId,
                            gallery_loading: this.state.gallery_loading,
                            setStateImgInfos: this.setStateImgInfos.bind(this),
                            setStateImgSelectedID: this.setStateImgSelectedID.bind(this) })),
                        display === 'portfolio' && React.createElement(WpmfPortfolioTheme, _extends({}, this.props, { selectedImageId: this.state.selectedImageId,
                            gallery_loading: this.state.gallery_loading,
                            setStateImgInfos: this.setStateImgInfos.bind(this),
                            setStateImgSelectedID: this.setStateImgSelectedID.bind(this) })),
                        isSelected && React.createElement(
                            'div',
                            { className: 'blocks-gallery-item has-add-item-button' },
                            React.createElement(
                                FormFileUpload,
                                {
                                    multiple: true,
                                    isLarge: true,
                                    className: 'block-library-gallery-add-item-button',
                                    onChange: this.uploadFromFiles,
                                    accept: 'image/*',
                                    icon: 'upload'
                                },
                                __('Upload an image', 'wpmf')
                            )
                        )
                    );
                }
            }
        }]);

        return wpmfWordpressGallery;
    }(Component);

    var galleryAttrs = {
        images: {
            type: 'array',
            default: []
        },
        image_sortable: {
            type: 'array',
            default: []
        },
        display: {
            type: 'string',
            default: 'default'
        },
        columns: {
            type: 'string',
            default: '3'
        },
        size: {
            type: 'string',
            default: 'medium'
        },
        targetsize: {
            type: 'string',
            default: 'large'
        },
        link: {
            type: 'string',
            default: 'file'
        },
        wpmf_orderby: {
            type: 'string',
            default: 'post__in'
        },
        wpmf_order: {
            type: 'string',
            default: 'ASC'
        },
        autoplay: {
            type: 'number',
            default: 1
        },
        wpmf_folder_id: {
            type: 'array',
            default: []
        },
        wpmf_autoinsert: {
            type: 'string',
            default: '0'
        },
        img_border_radius: {
            type: 'number',
            default: 0
        },
        borderWidth: {
            type: 'number',
            default: 1
        },
        borderColor: {
            type: 'string',
            default: 'transparent'
        },
        borderStyle: {
            type: 'string',
            default: 'none'
        },
        hoverShadowH: {
            type: 'number',
            default: 0
        },
        hoverShadowV: {
            type: 'number',
            default: 0
        },
        hoverShadowBlur: {
            type: 'number',
            default: 0
        },
        hoverShadowSpread: {
            type: 'number',
            default: 0
        },
        hoverShadowColor: {
            type: 'string',
            default: '#ccc'
        },
        gutterwidth: {
            type: 'number',
            default: 15
        },
        changed: {
            type: 'boolean',
            default: false
        },
        cover: {
            type: 'string',
            source: 'attribute',
            selector: 'img',
            attribute: 'src'
        }
    };

    registerBlockType('wpmf/wordpress-gallery', {
        title: wpmf_blocks.l18n.block_gallery_title,
        icon: 'format-gallery',
        category: 'wp-media-folder',
        example: {
            attributes: {
                cover: wpmf_blocks.vars.block_cover
            }
        },
        attributes: galleryAttrs,
        edit: wpmfWordpressGallery,
        save: function save(_ref3) {
            var attributes = _ref3.attributes;
            var images = attributes.images,
                display = attributes.display,
                columns = attributes.columns,
                size = attributes.size,
                targetsize = attributes.targetsize,
                link = attributes.link,
                wpmf_orderby = attributes.wpmf_orderby,
                wpmf_order = attributes.wpmf_order,
                wpmf_autoinsert = attributes.wpmf_autoinsert,
                wpmf_folder_id = attributes.wpmf_folder_id,
                autoplay = attributes.autoplay,
                img_border_radius = attributes.img_border_radius,
                gutterwidth = attributes.gutterwidth,
                hoverShadowH = attributes.hoverShadowH,
                hoverShadowV = attributes.hoverShadowV,
                hoverShadowBlur = attributes.hoverShadowBlur,
                hoverShadowSpread = attributes.hoverShadowSpread,
                hoverShadowColor = attributes.hoverShadowColor,
                borderWidth = attributes.borderWidth,
                borderStyle = attributes.borderStyle,
                borderColor = attributes.borderColor;

            var gallery_shortcode = '[gallery';

            var ids = images.map(function (img) {
                return img.id;
            });
            if (parseInt(wpmf_autoinsert) === 0) {
                if (images.length) {
                    gallery_shortcode += ' ids="' + ids.join() + '"';
                }
            }

            gallery_shortcode += ' display="' + display + '"';
            gallery_shortcode += ' size="' + size + '"';
            gallery_shortcode += ' columns="' + columns + '"';
            gallery_shortcode += ' targetsize="' + targetsize + '"';
            gallery_shortcode += ' link="' + link + '"';
            gallery_shortcode += ' wpmf_orderby="' + wpmf_orderby + '"';
            gallery_shortcode += ' wpmf_order="' + wpmf_order + '"';
            if (parseInt(autoplay) === 0) {
                gallery_shortcode += ' autoplay="' + autoplay + '"';
            }
            gallery_shortcode += ' wpmf_autoinsert="' + wpmf_autoinsert + '"';
            if (parseInt(img_border_radius) !== 0) {
                gallery_shortcode += ' img_border_radius="' + img_border_radius + '"';
            }

            if (parseInt(gutterwidth) !== 5) {
                gallery_shortcode += ' gutterwidth="' + gutterwidth + '"';
            }

            if (wpmf_folder_id.length) {
                gallery_shortcode += ' wpmf_folder_id="' + wpmf_folder_id.join() + '"';
            }

            if (typeof hoverShadowH !== "undefined" && typeof hoverShadowV !== "undefined" && typeof hoverShadowBlur !== "undefined" && typeof hoverShadowSpread !== "undefined" && (parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0)) {
                gallery_shortcode += ' img_shadow="' + hoverShadowH + 'px ' + hoverShadowV + 'px ' + hoverShadowBlur + 'px ' + hoverShadowSpread + 'px ' + hoverShadowColor + '"';
            }

            if (borderStyle !== 'none') {
                gallery_shortcode += ' border_width="' + borderWidth + '"';
                gallery_shortcode += ' border_style="' + borderStyle + '"';
                gallery_shortcode += ' border_color="' + borderColor + '"';
            }

            gallery_shortcode += ']';

            return gallery_shortcode;
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components);
