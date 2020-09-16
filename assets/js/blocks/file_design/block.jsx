(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
    const {__} = wpI18n;
    const {Component, Fragment} = wpElement;
    const {registerBlockType} = wpBlocks;
    const {InspectorControls, MediaUpload, BlockControls} = wpEditor;
    const {PanelBody, SelectControl, Toolbar, Button, IconButton} = wpComponents;

    class wpmfFileDesign extends Component {
        constructor() {
            super(...arguments);
        }

        render() {
            const {attributes, setAttributes} = this.props;
            const {id, file, target, cover} = attributes;
            const controls = (
                <BlockControls>
                    {id !== 0 && (
                        <Toolbar>
                            <MediaUpload
                                onSelect={(file) => setAttributes({id: file.id, file: file})}
                                accept="application"
                                allowedTypes={'application'}
                                render={({open}) => (
                                    <IconButton
                                        className="components-toolbar__control"
                                        label={__('Edit File', 'wpmf')}
                                        icon="edit"
                                        onClick={open}
                                    />
                                )}
                            />
                        </Toolbar>
                    )}
                </BlockControls>
            );

            let mime = '';
            let size = 0;
            if (id !== 0) {
                let mimetype = file.mime.split('/');
                if (typeof mimetype !== "undefined" && typeof mimetype[1] !== "undefined") {
                    mime = mimetype[1].toUpperCase()
                }
                if (file.filesizeInBytes < 1024 * 1024) {
                    size = file.filesizeInBytes / 1024;
                    size = size.toFixed(1);
                    size += ' kB'
                } else if (file.filesizeInBytes > 1024 * 1024) {
                    size = file.filesizeInBytes / (1024 * 1024);
                    size = size.toFixed(1);
                    size += ' MB'
                }
            }

            return (
                <Fragment>
                    {
                        typeof cover !== "undefined" && <div className="wpmf-cover"><img src={cover} /></div>
                    }

                    {controls}
                        {
                            (typeof cover === "undefined" && id !== 0) && <div className="wp-block-shortcode">
                                <div className="wpmf-file-design-block">
                                    <InspectorControls>
                                        <PanelBody title={__('File Design Settings', 'wpmf')}>
                                            <SelectControl
                                                label={__('Target', 'wpmf')}
                                                value={target}
                                                options={[
                                                    {label: __('Same Window', 'wpmf'), value: ''},
                                                    {label: __('New Window', 'wpmf'), value: '_blank'}
                                                ]}
                                                onChange={(value) => setAttributes({target: value})}
                                            />
                                        </PanelBody>
                                    </InspectorControls>
                                    <div data-id={id}>
                                        <a
                                            className="wpmf-defile"
                                            href={file.url}
                                            rel="noopener noreferrer"
                                            target={target} data-id={id}>
                                            <div className="wpmf-defile-title"><b>{file.title}</b></div>
                                            <span className="wpmf-single-infos">
                                        <b>{__('Size: ', 'wpmf')} </b>{size}
                                                <b>{__(' Format: ', 'wpmf')} </b></span>{mime}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            typeof cover === "undefined" && id === 0 && <div className="wp-block-shortcode"><MediaUpload
                                onSelect={(file) => setAttributes({id: file.id, file: file})}
                                accept="application"
                                allowedTypes={'application'}
                                render={({open}) => {
                                    return (
                                        <Button
                                            isLarge
                                            className="editor-media-placeholder__button wpmf-pdf-button"
                                            onClick={open}
                                        >
                                            {__('Add File', 'wpmf')}
                                        </Button>
                                    )
                                }}
                            /></div>
                        }

                </Fragment>
            );
        }
    }

    const fileDesignAttrs = {
        id: {
            type: 'number',
            default: 0
        },
        file: {
            type: 'object',
            default: {},
        },
        target: {
            type: 'string',
            default: '',
        },
        cover: {
            type: 'string',
            source: 'attribute',
            selector: 'img',
            attribute: 'src',
        }
    };

    registerBlockType(
        'wpmf/filedesign', {
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
            save: ({attributes}) => {
                const {id, file, target} = attributes;

                let mime = '';
                let size = 0;
                if (id !== 0) {
                    let mimetype = file.mime.split('/');
                    if (typeof mimetype !== "undefined" && typeof mimetype[1] !== "undefined") {
                        mime = mimetype[1].toUpperCase()
                    }
                    if (file.filesizeInBytes < 1024 * 1024) {
                        size = file.filesizeInBytes / 1024;
                        size = size.toFixed(1);
                        size += ' kB'
                    } else if (file.filesizeInBytes > 1024 * 1024) {
                        size = file.filesizeInBytes / (1024 * 1024);
                        size = size.toFixed(1);
                        size += ' MB'
                    }
                }

                return <div data-id={id}>
                    <a
                        className="wpmf-defile"
                        href={file.url}
                        rel="noopener noreferrer"
                        target={target} data-id={id}>
                        <div className="wpmf-defile-title"><b>{file.title}</b></div>
                        <span className="wpmf-single-infos">
                                    <b>{__('Size: ', 'wpmf')} </b>{size}
                            <b>{__(' Format: ', 'wpmf')} </b></span>{mime}
                    </a>
                </div>;
            },
            deprecated: [
                {
                    attributes: fileDesignAttrs,
                    save: ({attributes}) => {
                        const {id, file, target} = attributes;

                        let mime = '';
                        let size = 0;
                        if (id !== 0) {
                            let mimetype = file.mime.split('/');
                            if (typeof mimetype !== "undefined" && typeof mimetype[1] !== "undefined") {
                                mime = mimetype[1].toUpperCase()
                            }
                            if (file.filesizeInBytes < 1024 * 1024) {
                                size = file.filesizeInBytes / 1024;
                                size = size.toFixed(1);
                                size += ' kB'
                            } else if (file.filesizeInBytes > 1024 * 1024) {
                                size = file.filesizeInBytes / (1024 * 1024);
                                size = size.toFixed(1);
                                size += ' MB'
                            }
                        }

                        return <div data-id={id}>
                            <a
                                className="wpmf-defile"
                                href={file.url}
                                target={target} data-id={id}>
                                <div className="wpmf-defile-title"><b>{file.title}</b></div>
                                <span className="wpmf-single-infos">
                                    <b>{__('Size: ', 'wpmf')} </b>{size}
                                    <b>{__(' Format: ', 'wpmf')} </b></span>{mime}
                            </a>
                        </div>;
                    },
                }
            ]
        }
    );
})(wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components);