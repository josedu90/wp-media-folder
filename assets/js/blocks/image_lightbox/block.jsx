(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
    const {__} = wpI18n;
    const {Component, Fragment} = wpElement;
    const {registerBlockType} = wpBlocks;
    const {InspectorControls, MediaUpload, BlockControls, BlockAlignmentToolbar} = wpEditor;
    const {PanelBody, SelectControl, Toolbar, Button, IconButton} = wpComponents;

    class wpmfImageLightbox extends Component {
        constructor() {
            super(...arguments);
        }

        render() {
            const {attributes, setAttributes} = this.props;
            const {image, id, size, url, lightbox_size, lightbox_url, align} = attributes;
            const list_sizes = Object.keys(wpmf_lightbox_blocks.vars.sizes).map((key, label) => {
                return {
                    label: wpmf_lightbox_blocks.vars.sizes[key],
                    value: key
                }
            });

            const controls = (
                <BlockControls>
                    {(id !== 0) && (
                        <Toolbar>
                            <BlockAlignmentToolbar value={align}
                                                   onChange={(align) => setAttributes({align: align})}/>
                            <MediaUpload
                                onSelect={(img) => {
                                    setAttributes({
                                        id: parseInt(img.id),
                                        image: img,
                                        url: img.url,
                                        lightbox_url: img.url
                                    })
                                }}
                                accept="image/*"
                                allowedTypes={'image'}
                                render={({open}) => {
                                    return (
                                        <IconButton
                                            className="components-toolbar__control"
                                            label={__('Change Image', 'wpmf')}
                                            icon="edit"
                                            onClick={open}
                                        />
                                    )
                                }}
                            />
                        </Toolbar>
                    )}
                </BlockControls>
            );

            return (
                <Fragment>
                    {controls}
                    <div className="wp-block-shortcode">
                        {
                            (id !== 0) && <div className="wpmf-image-lightbox-block">
                                <InspectorControls>
                                    <PanelBody title={__('PDF Settings', 'wpmf')}>
                                        <SelectControl
                                            label={__('Image size', 'wpmf')}
                                            value={size}
                                            options={list_sizes}
                                            onChange={(value) => {
                                                setAttributes({size: value, url: image.sizes[value].url})
                                            }}
                                        />

                                        <SelectControl
                                            label={__('Lightbox size', 'wpmf')}
                                            value={lightbox_size}
                                            options={list_sizes}
                                            onChange={(value) => setAttributes({
                                                lightbox_size: value,
                                                lightbox_url: image.sizes[value].url
                                            })}
                                        />
                                    </PanelBody>
                                </InspectorControls>
                                <a>
                                    <img src={url} data-wpmflightbox="1"
                                         className={`align${align} size-${size} wp-image-${id}`}
                                         data-wpmf_size_lightbox={lightbox_size}
                                         data-wpmf_image_lightbox={lightbox_url}/>
                                </a>
                            </div>
                        }

                        {
                            (id === 0) && <MediaUpload
                                onSelect={(img) => {
                                    setAttributes({
                                        id: parseInt(img.id),
                                        image: img,
                                        url: img.url,
                                        lightbox_url: img.url
                                    })
                                }}
                                accept="image/*"
                                allowedTypes={'image'}
                                render={({open}) => {
                                    return (
                                        <Button
                                            isLarge
                                            className="editor-media-placeholder__button wpmf-pdf-button"
                                            onClick={open}
                                        >
                                            {__('Add image', 'wpmf')}
                                        </Button>
                                    )
                                }}
                            />
                        }
                    </div>
                </Fragment>
            );
        }
    }

    registerBlockType(
        'wpmf/image-lightbox', {
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
                    default: 'full',
                },
                id: {
                    type: 'number',
                    default: 0
                },
                size: {
                    type: 'string',
                    default: 'full',
                },
                url: {
                    type: 'string',
                    default: '',
                },
                lightbox_size: {
                    type: 'string',
                    default: 'full',
                },
                lightbox_url: {
                    type: 'string',
                    default: '',
                },
                align: {
                    type: 'string',
                    default: 'center'
                }
            },
            edit: wpmfImageLightbox,
            save: ({attributes}) => {
                const {id, size, url, lightbox_size, lightbox_url, align} = attributes;
                return <a><img src={url} data-wpmflightbox="1" className={`align${align} size-${size} wp-image-${id}`}
                               data-wpmf_size_lightbox={lightbox_size}
                               data-wpmf_image_lightbox={lightbox_url}/></a>;
            },
            getEditWrapperProps(attributes) {
                const {align} = attributes;
                const props = {'data-resized': true};

                if ('left' === align || 'right' === align || 'center' === align) {
                    props['data-align'] = align;
                }

                return props;
            }
        }
    );
})(wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components);