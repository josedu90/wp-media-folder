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
        BlockControls = wpEditor.BlockControls;
    var PanelBody = wpComponents.PanelBody,
        SelectControl = wpComponents.SelectControl,
        Toolbar = wpComponents.Toolbar,
        Button = wpComponents.Button,
        IconButton = wpComponents.IconButton;

    var wpmfFileDesign = function (_Component) {
        _inherits(wpmfFileDesign, _Component);

        function wpmfFileDesign() {
            _classCallCheck(this, wpmfFileDesign);

            return _possibleConstructorReturn(this, (wpmfFileDesign.__proto__ || Object.getPrototypeOf(wpmfFileDesign)).apply(this, arguments));
        }

        _createClass(wpmfFileDesign, [{
            key: "render",
            value: function render() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;
                var id = attributes.id,
                    file = attributes.file,
                    target = attributes.target,
                    cover = attributes.cover;

                var controls = React.createElement(
                    BlockControls,
                    null,
                    id !== 0 && React.createElement(
                        Toolbar,
                        null,
                        React.createElement(MediaUpload, {
                            onSelect: function onSelect(file) {
                                return setAttributes({ id: file.id, file: file });
                            },
                            accept: "application",
                            allowedTypes: 'application',
                            render: function render(_ref) {
                                var open = _ref.open;
                                return React.createElement(IconButton, {
                                    className: "components-toolbar__control",
                                    label: __('Edit File', 'wpmf'),
                                    icon: "edit",
                                    onClick: open
                                });
                            }
                        })
                    )
                );

                var mime = '';
                var size = 0;
                if (id !== 0) {
                    var mimetype = file.mime.split('/');
                    if (typeof mimetype !== "undefined" && typeof mimetype[1] !== "undefined") {
                        mime = mimetype[1].toUpperCase();
                    }
                    if (file.filesizeInBytes < 1024 * 1024) {
                        size = file.filesizeInBytes / 1024;
                        size = size.toFixed(1);
                        size += ' kB';
                    } else if (file.filesizeInBytes > 1024 * 1024) {
                        size = file.filesizeInBytes / (1024 * 1024);
                        size = size.toFixed(1);
                        size += ' MB';
                    }
                }

                return React.createElement(
                    Fragment,
                    null,
                    typeof cover !== "undefined" && React.createElement(
                        "div",
                        { className: "wpmf-cover" },
                        React.createElement("img", { src: cover })
                    ),
                    controls,
                    typeof cover === "undefined" && id !== 0 && React.createElement(
                        "div",
                        { className: "wp-block-shortcode" },
                        React.createElement(
                            "div",
                            { className: "wpmf-file-design-block" },
                            React.createElement(
                                InspectorControls,
                                null,
                                React.createElement(
                                    PanelBody,
                                    { title: __('File Design Settings', 'wpmf') },
                                    React.createElement(SelectControl, {
                                        label: __('Target', 'wpmf'),
                                        value: target,
                                        options: [{ label: __('Same Window', 'wpmf'), value: '' }, { label: __('New Window', 'wpmf'), value: '_blank' }],
                                        onChange: function onChange(value) {
                                            return setAttributes({ target: value });
                                        }
                                    })
                                )
                            ),
                            React.createElement(
                                "div",
                                { "data-id": id },
                                React.createElement(
                                    "a",
                                    {
                                        className: "wpmf-defile",
                                        href: file.url,
                                        rel: "noopener noreferrer",
                                        target: target, "data-id": id },
                                    React.createElement(
                                        "div",
                                        { className: "wpmf-defile-title" },
                                        React.createElement(
                                            "b",
                                            null,
                                            file.title
                                        )
                                    ),
                                    React.createElement(
                                        "span",
                                        { className: "wpmf-single-infos" },
                                        React.createElement(
                                            "b",
                                            null,
                                            __('Size: ', 'wpmf'),
                                            " "
                                        ),
                                        size,
                                        React.createElement(
                                            "b",
                                            null,
                                            __(' Format: ', 'wpmf'),
                                            " "
                                        )
                                    ),
                                    mime
                                )
                            )
                        )
                    ),
                    typeof cover === "undefined" && id === 0 && React.createElement(
                        "div",
                        { className: "wp-block-shortcode" },
                        React.createElement(MediaUpload, {
                            onSelect: function onSelect(file) {
                                return setAttributes({ id: file.id, file: file });
                            },
                            accept: "application",
                            allowedTypes: 'application',
                            render: function render(_ref2) {
                                var open = _ref2.open;

                                return React.createElement(
                                    Button,
                                    {
                                        isLarge: true,
                                        className: "editor-media-placeholder__button wpmf-pdf-button",
                                        onClick: open
                                    },
                                    __('Add File', 'wpmf')
                                );
                            }
                        })
                    )
                );
            }
        }]);

        return wpmfFileDesign;
    }(Component);

    var fileDesignAttrs = {
        id: {
            type: 'number',
            default: 0
        },
        file: {
            type: 'object',
            default: {}
        },
        target: {
            type: 'string',
            default: ''
        },
        cover: {
            type: 'string',
            source: 'attribute',
            selector: 'img',
            attribute: 'src'
        }
    };

    registerBlockType('wpmf/filedesign', {
        title: __('WP Media Folder File Design', 'wpmf'),
        icon: 'media-archive',
        category: 'wp-media-folder',
        example: {
            attributes: {
                cover: wpmf_filedesign_blocks.vars.block_cover
            }
        },
        attributes: fileDesignAttrs,
        edit: wpmfFileDesign,
        save: function save(_ref3) {
            var attributes = _ref3.attributes;
            var id = attributes.id,
                file = attributes.file,
                target = attributes.target;


            var mime = '';
            var size = 0;
            if (id !== 0) {
                var mimetype = file.mime.split('/');
                if (typeof mimetype !== "undefined" && typeof mimetype[1] !== "undefined") {
                    mime = mimetype[1].toUpperCase();
                }
                if (file.filesizeInBytes < 1024 * 1024) {
                    size = file.filesizeInBytes / 1024;
                    size = size.toFixed(1);
                    size += ' kB';
                } else if (file.filesizeInBytes > 1024 * 1024) {
                    size = file.filesizeInBytes / (1024 * 1024);
                    size = size.toFixed(1);
                    size += ' MB';
                }
            }

            return React.createElement(
                "div",
                { "data-id": id },
                React.createElement(
                    "a",
                    {
                        className: "wpmf-defile",
                        href: file.url,
                        rel: "noopener noreferrer",
                        target: target, "data-id": id },
                    React.createElement(
                        "div",
                        { className: "wpmf-defile-title" },
                        React.createElement(
                            "b",
                            null,
                            file.title
                        )
                    ),
                    React.createElement(
                        "span",
                        { className: "wpmf-single-infos" },
                        React.createElement(
                            "b",
                            null,
                            __('Size: ', 'wpmf'),
                            " "
                        ),
                        size,
                        React.createElement(
                            "b",
                            null,
                            __(' Format: ', 'wpmf'),
                            " "
                        )
                    ),
                    mime
                )
            );
        },
        deprecated: [{
            attributes: fileDesignAttrs,
            save: function save(_ref4) {
                var attributes = _ref4.attributes;
                var id = attributes.id,
                    file = attributes.file,
                    target = attributes.target;


                var mime = '';
                var size = 0;
                if (id !== 0) {
                    var mimetype = file.mime.split('/');
                    if (typeof mimetype !== "undefined" && typeof mimetype[1] !== "undefined") {
                        mime = mimetype[1].toUpperCase();
                    }
                    if (file.filesizeInBytes < 1024 * 1024) {
                        size = file.filesizeInBytes / 1024;
                        size = size.toFixed(1);
                        size += ' kB';
                    } else if (file.filesizeInBytes > 1024 * 1024) {
                        size = file.filesizeInBytes / (1024 * 1024);
                        size = size.toFixed(1);
                        size += ' MB';
                    }
                }

                return React.createElement(
                    "div",
                    { "data-id": id },
                    React.createElement(
                        "a",
                        {
                            className: "wpmf-defile",
                            href: file.url,
                            target: target, "data-id": id },
                        React.createElement(
                            "div",
                            { className: "wpmf-defile-title" },
                            React.createElement(
                                "b",
                                null,
                                file.title
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "wpmf-single-infos" },
                            React.createElement(
                                "b",
                                null,
                                __('Size: ', 'wpmf'),
                                " "
                            ),
                            size,
                            React.createElement(
                                "b",
                                null,
                                __(' Format: ', 'wpmf'),
                                " "
                            )
                        ),
                        mime
                    )
                );
            }
        }]
    });
})(wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components);
