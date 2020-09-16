"use strict";

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
        MediaUpload = wpEditor.MediaUpload,
        BlockControls = wpEditor.BlockControls,
        BlockAlignmentToolbar = wpEditor.BlockAlignmentToolbar;
    var PanelBody = wpComponents.PanelBody,
        SelectControl = wpComponents.SelectControl,
        Toolbar = wpComponents.Toolbar,
        Button = wpComponents.Button,
        IconButton = wpComponents.IconButton;

    var wpmfImageLightbox = function (_Component) {
        _inherits(wpmfImageLightbox, _Component);

        function wpmfImageLightbox() {
            _classCallCheck(this, wpmfImageLightbox);

            return _possibleConstructorReturn(this, (wpmfImageLightbox.__proto__ || Object.getPrototypeOf(wpmfImageLightbox)).apply(this, arguments));
        }

        _createClass(wpmfImageLightbox, [{
            key: "render",
            value: function render() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;
                var image = attributes.image,
                    id = attributes.id,
                    size = attributes.size,
                    url = attributes.url,
                    lightbox_size = attributes.lightbox_size,
                    lightbox_url = attributes.lightbox_url,
                    align = attributes.align;

                var list_sizes = Object.keys(wpmf_lightbox_blocks.vars.sizes).map(function (key, label) {
                    return {
                        label: wpmf_lightbox_blocks.vars.sizes[key],
                        value: key
                    };
                });

                var controls = React.createElement(
                    BlockControls,
                    null,
                    id !== 0 && React.createElement(
                        Toolbar,
                        null,
                        React.createElement(BlockAlignmentToolbar, { value: align,
                            onChange: function onChange(align) {
                                return setAttributes({ align: align });
                            } }),
                        React.createElement(MediaUpload, {
                            onSelect: function onSelect(img) {
                                setAttributes({
                                    id: parseInt(img.id),
                                    image: img,
                                    url: img.url,
                                    lightbox_url: img.url
                                });
                            },
                            accept: "image/*",
                            allowedTypes: 'image',
                            render: function render(_ref) {
                                var open = _ref.open;

                                return React.createElement(IconButton, {
                                    className: "components-toolbar__control",
                                    label: __('Change Image', 'wpmf'),
                                    icon: "edit",
                                    onClick: open
                                });
                            }
                        })
                    )
                );

                return React.createElement(
                    Fragment,
                    null,
                    controls,
                    React.createElement(
                        "div",
                        { className: "wp-block-shortcode" },
                        id !== 0 && React.createElement(
                            "div",
                            { className: "wpmf-image-lightbox-block" },
                            React.createElement(
                                InspectorControls,
                                null,
                                React.createElement(
                                    PanelBody,
                                    { title: __('PDF Settings', 'wpmf') },
                                    React.createElement(SelectControl, {
                                        label: __('Image size', 'wpmf'),
                                        value: size,
                                        options: list_sizes,
                                        onChange: function onChange(value) {
                                            setAttributes({ size: value, url: image.sizes[value].url });
                                        }
                                    }),
                                    React.createElement(SelectControl, {
                                        label: __('Lightbox size', 'wpmf'),
                                        value: lightbox_size,
                                        options: list_sizes,
                                        onChange: function onChange(value) {
                                            return setAttributes({
                                                lightbox_size: value,
                                                lightbox_url: image.sizes[value].url
                                            });
                                        }
                                    })
                                )
                            ),
                            React.createElement(
                                "a",
                                null,
                                React.createElement("img", { src: url, "data-wpmflightbox": "1",
                                    className: "align" + align + " size-" + size + " wp-image-" + id,
                                    "data-wpmf_size_lightbox": lightbox_size,
                                    "data-wpmf_image_lightbox": lightbox_url })
                            )
                        ),
                        id === 0 && React.createElement(MediaUpload, {
                            onSelect: function onSelect(img) {
                                setAttributes({
                                    id: parseInt(img.id),
                                    image: img,
                                    url: img.url,
                                    lightbox_url: img.url
                                });
                            },
                            accept: "image/*",
                            allowedTypes: 'image',
                            render: function render(_ref2) {
                                var open = _ref2.open;

                                return React.createElement(
                                    Button,
                                    {
                                        isLarge: true,
                                        className: "editor-media-placeholder__button wpmf-pdf-button",
                                        onClick: open
                                    },
                                    __('Add image', 'wpmf')
                                );
                            }
                        })
                    )
                );
            }
        }]);

        return wpmfImageLightbox;
    }(Component);

    registerBlockType('wpmf/image-lightbox', {
        title: wpmf_lightbox_blocks.l18n.block_image_lightbox_title,
        icon: 'format-image',
        category: 'wp-media-folder',
        attributes: {
            image: {
                type: 'object',
                default: {}
            },
            link_to: {
                type: 'string',
                default: 'full'
            },
            id: {
                type: 'number',
                default: 0
            },
            size: {
                type: 'string',
                default: 'full'
            },
            url: {
                type: 'string',
                default: ''
            },
            lightbox_size: {
                type: 'string',
                default: 'full'
            },
            lightbox_url: {
                type: 'string',
                default: ''
            },
            align: {
                type: 'string',
                default: 'center'
            }
        },
        edit: wpmfImageLightbox,
        save: function save(_ref3) {
            var attributes = _ref3.attributes;
            var id = attributes.id,
                size = attributes.size,
                url = attributes.url,
                lightbox_size = attributes.lightbox_size,
                lightbox_url = attributes.lightbox_url,
                align = attributes.align;

            return React.createElement(
                "a",
                null,
                React.createElement("img", { src: url, "data-wpmflightbox": "1", className: "align" + align + " size-" + size + " wp-image-" + id,
                    "data-wpmf_size_lightbox": lightbox_size,
                    "data-wpmf_image_lightbox": lightbox_url })
            );
        },
        getEditWrapperProps: function getEditWrapperProps(attributes) {
            var align = attributes.align;

            var props = { 'data-resized': true };

            if ('left' === align || 'right' === align || 'center' === align) {
                props['data-align'] = align;
            }

            return props;
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components);
