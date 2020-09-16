'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
    var __ = wpI18n.__;
    var Component = wpElement.Component;
    var registerBlockType = wpBlocks.registerBlockType;
    var InspectorControls = wpEditor.InspectorControls,
        MediaUpload = wpEditor.MediaUpload;
    var PanelBody = wpComponents.PanelBody,
        SelectControl = wpComponents.SelectControl,
        TextControl = wpComponents.TextControl,
        Button = wpComponents.Button;

    var wpmfPdfEmbed = function (_Component) {
        _inherits(wpmfPdfEmbed, _Component);

        function wpmfPdfEmbed() {
            _classCallCheck(this, wpmfPdfEmbed);

            return _possibleConstructorReturn(this, (wpmfPdfEmbed.__proto__ || Object.getPrototypeOf(wpmfPdfEmbed)).apply(this, arguments));
        }

        _createClass(wpmfPdfEmbed, [{
            key: 'render',
            value: function render() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;
                var id = attributes.id,
                    embed = attributes.embed,
                    target = attributes.target;

                var pdf_shortcode = '[wpmfpdf';
                pdf_shortcode += ' id="' + id + '"';
                pdf_shortcode += ' embed="' + embed + '"';
                pdf_shortcode += ' target="' + target + '"';
                pdf_shortcode += ']';
                return React.createElement(
                    'div',
                    { className: 'wp-block-shortcode' },
                    id !== 0 && React.createElement(
                        'div',
                        { className: 'wpmf-pdf-block' },
                        React.createElement(
                            InspectorControls,
                            null,
                            React.createElement(
                                PanelBody,
                                { title: __('PDF Settings', 'wpmf') },
                                React.createElement(SelectControl, {
                                    label: __('Embed', 'wpmf'),
                                    value: embed,
                                    options: [{ label: __('On', 'wpmf'), value: 1 }, { label: __('Off', 'wpmf'), value: 0 }],
                                    onChange: function onChange(value) {
                                        return setAttributes({ embed: parseInt(value) });
                                    }
                                }),
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
                        React.createElement(TextControl, {
                            value: pdf_shortcode,
                            className: 'wpmf_pdf_value',
                            autoComplete: 'off',
                            readOnly: true
                        })
                    ),
                    React.createElement(MediaUpload, {
                        onSelect: function onSelect(img) {
                            return setAttributes({ id: parseInt(img.id) });
                        },
                        accept: 'application/pdf',
                        allowedTypes: 'application/pdf',
                        render: function render(_ref) {
                            var open = _ref.open;

                            return React.createElement(
                                Button,
                                {
                                    isLarge: true,
                                    className: 'editor-media-placeholder__button wpmf-pdf-button',
                                    onClick: open
                                },
                                id === 0 ? __('Add PDF', 'wpmf') : __('Edit PDF', 'wpmf')
                            );
                        }
                    })
                );
            }
        }]);

        return wpmfPdfEmbed;
    }(Component);

    registerBlockType('wpmf/pdfembed', {
        title: wpmf_pdf_blocks.l18n.block_pdf_title,
        icon: 'media-code',
        category: 'wp-media-folder',
        attributes: {
            id: {
                type: 'number',
                default: 0
            },
            embed: {
                type: 'number',
                default: 1
            },
            target: {
                type: 'string',
                default: ''
            }
        },
        edit: wpmfPdfEmbed,
        save: function save(_ref2) {
            var attributes = _ref2.attributes;
            var id = attributes.id,
                embed = attributes.embed,
                target = attributes.target;

            var pdf_shortcode = '[wpmfpdf';
            pdf_shortcode += ' id="' + id + '"';
            pdf_shortcode += ' embed="' + embed + '"';
            pdf_shortcode += ' target="' + target + '"';
            pdf_shortcode += ']';
            return pdf_shortcode;
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components);
