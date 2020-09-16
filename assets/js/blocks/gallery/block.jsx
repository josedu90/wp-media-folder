(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
    const {__} = wpI18n;
    const {Component, Fragment} = wpElement;
    const {registerBlockType} = wpBlocks;
    const {InspectorControls, mediaUpload, MediaUpload, BlockControls, PanelColorSettings} = wpEditor;
    const {PanelBody, ToggleControl, SelectControl, TextControl, Text, IconButton, Button, Tooltip, Toolbar, FormFileUpload, Placeholder, RangeControl, QueryControls} = wpComponents;
    const $ = jQuery;
    const ALLOWED_MEDIA_TYPES = ['image'];
    const {pick, get} = lodash;
    const {isBlobURL} = wp.blob;
    const pickRelevantMediaFiles = (image) => {
        const imageProps = pick(image, ['alt', 'id', 'link', 'caption', 'title', 'date', 'media_details']);
        imageProps.url = get(image, ['sizes', 'large', 'url']) || get(image, ['media_details', 'sizes', 'large', 'source_url']) || image.url;
        return imageProps;
    };

    let wpmf_local_categories = [];
    let wpmf_cloud_categories = [];
    let ij = 0;
    let space = '--';

    if (typeof wpmf === "undefined") {
        return;
    }

    $.each(wpmf.vars.wpmf_categories_order || [], function (key, id) {
        let term = wpmf.vars.wpmf_categories[id];
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

    let folders_length = ij;
    let wpmf_categories = [...wpmf_local_categories, ...wpmf_cloud_categories];

    class WpmfDefaultTheme extends Component {
        constructor() {
            super(...arguments);
        }

        /**
         * Un Selected image
         */
        unSelectedImage(e) {
            if (!$(e.target).hasClass('wpmf-gallery-image')) {
                this.props.setStateImgSelectedID(0);
                this.props.setStateImgInfos('', '', '');
            }
        }

        loadImageInfos(image) {
            if (this.props.selectedImageId !== image.id) {
                this.props.setStateImgSelectedID(image.id);
                this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
            } else {
                this.props.setStateImgSelectedID();
                this.props.setStateImgInfos();
            }
        }

        render() {
            const {attributes, setAttributes, clientId} = this.props;
            const {
                images,
                columns,
                size,
                img_border_radius,
                gutterwidth,
                borderStyle,
                borderWidth,
                borderColor,
                hoverShadowH,
                hoverShadowV,
                hoverShadowBlur,
                hoverShadowSpread,
                hoverShadowColor
            } = attributes;

            return (
                <div className="wpmf-gallery-block wpmfDefault" onClick={this.unSelectedImage.bind(this)}>
                    <style>
                    {
                        borderStyle !== 'none' &&
                        `#block-${clientId} .wpmf-gallery-block ul li img {border: ${borderColor} ${borderWidth}px ${borderStyle};}`
                    }

                    {
                        ((parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0)) &&
                        `#block-${clientId} .wpmf-gallery-block ul li img:hover {box-shadow: ${hoverShadowH}px ${hoverShadowV}px ${hoverShadowBlur}px ${hoverShadowSpread}px ${hoverShadowColor};}`
                    }
                    </style>
                    <ul
                        className={`wpmf-gallery-list-items gallery-columns-${columns} wpmf-has-border-radius-${img_border_radius} wpmf-has-gutter-width-${gutterwidth}`}>
                        {images.map((image, index) => {
                            let url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if ((typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined")) {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if ((typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") || (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") || typeof image.url !== "undefined") {
                                return (
                                    <li
                                        className={(isBlobURL(url)) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item "}
                                        key={index}>
                                        <div className={(this.props.selectedImageId === image.id) ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos'}>
                                            {(this.props.gallery_loading) && <span
                                                className="spinner wpmf_spiner_block_gallery_loading"> </span>}
                                            <img
                                                src={url}
                                                className={`wpmf-gallery-image`}
                                                onClick={this.loadImageInfos.bind(this, image)}
                                            />
                                            {isBlobURL(url) && <span className="spinner"> </span>}
                                            <Tooltip text={__('Remove image', 'wpmf')}>
                                                <IconButton
                                                    className="wpmf-gallery-block-item-remove"
                                                    icon="no"
                                                    onClick={() => {
                                                        this.props.setStateImgInfos(0, '', '');
                                                        setAttributes({
                                                            images: images.filter((img, i) => i !== index),
                                                            image_sortable: images.filter((img, i) => i !== index),
                                                            wpmf_autoinsert: '0'
                                                        })
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            );
        }
    }

    class WpmfSliderTheme extends Component {
        constructor() {
            super(...arguments);
        }

        componentDidMount() {
            const {attributes} = this.props;
            if (attributes.images.length) {
                this.initSlider();
            }
        }

        componentDidUpdate(prevProps) {
            // Deselect images when deselecting the block
            const {attributes} = this.props;
            if (attributes.images.length && !(prevProps.attributes.gutterwidth === attributes.gutterwidth && prevProps.attributes.size === attributes.size && prevProps.attributes.columns === attributes.columns && prevProps.attributes.wpmf_orderby === attributes.wpmf_orderby && prevProps.attributes.wpmf_order === attributes.wpmf_order && JSON.stringify(prevProps.attributes.images) === JSON.stringify(attributes.images))) {
                this.initSlider(attributes.display);
            }
        }

        /**
         * run masonry layout
         */
        initSlider() {
            const {attributes, clientId} = this.props;
            const {columns, gutterwidth, autoplay} = attributes;
            let $container = $(`#block-${clientId} .wpmf-gallery-block`);
            if ($container.is(':hidden')) {
                return;
            }

            let n = 0;
            if (parseInt(gutterwidth) >= 10) {
                n = 20;
            }

            if ($container.hasClass('flexslider-is-active')) {
                let columns_width = ($container.width() - n - (columns - 1) * gutterwidth) / columns;
                $container.find('.wpmf-gallery-block-item ').width(columns_width);
                return;
            }

            if (jQuery().flexslider) {
                imagesLoaded($container, function () {
                    let columns_width = ($container.width() - n - (columns - 1) * gutterwidth) / columns;
                    $container.addClass('flexslider-is-active');
                    /* call flexslider function */
                    $container.flexslider({
                        animation: 'slide',
                        animationLoop: true,
                        slideshow: (autoplay === 1),
                        smoothHeight: (columns === 1),
                        itemWidth: (columns === 1) ? 0 : columns_width,
                        itemMargin: (columns === 1) ? 0 : gutterwidth,
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
        unSelectedImage(e) {
            if (!$(e.target).hasClass('wpmf-gallery-image')) {
                this.props.setStateImgSelectedID(0);
                this.props.setStateImgInfos('', '', '');
            }
        }

        loadImageInfos(image) {
            if (this.props.selectedImageId !== image.id) {
                this.props.setStateImgSelectedID(image.id);
                this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
            } else {
                this.props.setStateImgSelectedID();
                this.props.setStateImgInfos();
            }
        }

        render() {
            const {attributes, setAttributes, clientId} = this.props;
            const {
                images,
                columns,
                size,
                img_border_radius,
                gutterwidth,
                borderStyle,
                borderWidth,
                borderColor,
                hoverShadowH,
                hoverShadowV,
                hoverShadowBlur,
                hoverShadowSpread,
                hoverShadowColor
            } = attributes;
            return (
                <div className={`wpmf-gallery-block wpmfBlockSlider wpmf-has-gutter-width-${gutterwidth}`} onClick={this.unSelectedImage.bind(this)}>
                    <style>
                        {
                            borderStyle !== 'none' &&
                            `#block-${clientId} .wpmf-gallery-block ul li img {border: ${borderColor} ${borderWidth}px ${borderStyle};}`
                        }

                        {
                            ((parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0)) &&
                            `#block-${clientId} .wpmf-gallery-block ul li img:hover {box-shadow: ${hoverShadowH}px ${hoverShadowV}px ${hoverShadowBlur}px ${hoverShadowSpread}px ${hoverShadowColor};}`
                        }
                    </style>
                    <ul
                        className={`wpmf-gallery-list-items wpmf-has-columns-${columns} wpmf-has-border-radius-${img_border_radius} slides wpmf-slides`}>
                        {images.map((image, index) => {
                            let url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if ((typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined")) {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if ((typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") || (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") || typeof image.url !== "undefined") {
                                return (
                                    <li
                                        className={(isBlobURL(url)) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item "}
                                        key={index}>
                                        <div className={(this.props.selectedImageId === image.id) ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos'}>
                                            {(this.props.gallery_loading) && <span
                                                className="spinner wpmf_spiner_block_gallery_loading"> </span>}
                                            <img
                                                src={url}
                                                className={`wpmf-gallery-image`}
                                                onClick={this.loadImageInfos.bind(this, image)}
                                            />
                                            {isBlobURL(url) && <span className="spinner"> </span>}
                                            <Tooltip text={__('Remove image', 'wpmf')}>
                                                <IconButton
                                                    className="wpmf-gallery-block-item-remove"
                                                    icon="no"
                                                    onClick={() => {
                                                        this.props.setStateImgInfos(0, '', '');
                                                        setAttributes({
                                                            images: images.filter((img, i) => i !== index),
                                                            image_sortable: images.filter((img, i) => i !== index),
                                                            wpmf_autoinsert: '0'
                                                        })
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            );
        }
    }

    class WpmfMasonryTheme extends Component {
        constructor() {
            super(...arguments);
        }

        componentDidMount() {
            const {attributes} = this.props;
            if (attributes.images.length) {
                this.initMasonry();
            }
        }

        componentDidUpdate(prevProps) {
            // Deselect images when deselecting the block
            const {attributes} = this.props;
            if (attributes.images.length && !(prevProps.attributes.size === attributes.size && prevProps.attributes.columns === attributes.columns && prevProps.attributes.wpmf_orderby === attributes.wpmf_orderby && prevProps.attributes.wpmf_order === attributes.wpmf_order && JSON.stringify(prevProps.attributes.images) === JSON.stringify(attributes.images))) {
                this.initMasonry(attributes.display);
            }
        }

        /**
         * run masonry layout
         */
        initMasonry() {
            const {attributes, clientId} = this.props;
            let $container = $(`#block-${clientId} .wpmf-gallery-list-items`);
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
        unSelectedImage(e) {
            if (!$(e.target).hasClass('wpmf-gallery-image')) {
                this.props.setStateImgSelectedID(0);
                this.props.setStateImgInfos('', '', '');
            }
        }

        loadImageInfos(image) {
            if (this.props.selectedImageId !== image.id) {
                this.props.setStateImgSelectedID(image.id);
                this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
            } else {
                this.props.setStateImgSelectedID();
                this.props.setStateImgInfos();
            }
        }

        render() {
            const {attributes, setAttributes, clientId} = this.props;
            const {
                images,
                columns,
                size,
                img_border_radius,
                gutterwidth,
                borderStyle,
                borderWidth,
                borderColor,
                hoverShadowH,
                hoverShadowV,
                hoverShadowBlur,
                hoverShadowSpread,
                hoverShadowColor
            } = attributes;
            return (
                <div className="wpmf-gallery-block wpmfBlockMasonry" onClick={this.unSelectedImage.bind(this)}>
                    <style>
                        {
                            borderStyle !== 'none' &&
                            `#block-${clientId} .wpmf-gallery-block ul li img {border: ${borderColor} ${borderWidth}px ${borderStyle};}`
                        }

                        {
                            ((parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0)) &&
                            `#block-${clientId} .wpmf-gallery-block ul li img:hover {box-shadow: ${hoverShadowH}px ${hoverShadowV}px ${hoverShadowBlur}px ${hoverShadowSpread}px ${hoverShadowColor};}`
                        }
                    </style>
                    <ul
                        className={`wpmf-gallery-list-items gallery-columns-${columns} wpmf-has-border-radius-${img_border_radius} wpmf-has-gutter-width-${gutterwidth}`}>
                        {images.map((image, index) => {
                            let url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if ((typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined")) {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if ((typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") || (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") || typeof image.url !== "undefined") {
                                return (
                                    <li
                                        className={(isBlobURL(url)) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item "}
                                        key={index}>
                                        <div className={(this.props.selectedImageId === image.id) ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos'}>
                                            {(this.props.gallery_loading) && <span
                                                className="spinner wpmf_spiner_block_gallery_loading"> </span>}
                                            <img
                                                src={url}
                                                className={`wpmf-gallery-image`}
                                                onClick={this.loadImageInfos.bind(this, image)}
                                            />
                                            {isBlobURL(url) && <span className="spinner"> </span>}
                                            <Tooltip text={__('Remove image', 'wpmf')}>
                                                <IconButton
                                                    className="wpmf-gallery-block-item-remove"
                                                    icon="no"
                                                    onClick={() => {
                                                        this.props.setStateImgInfos(0, '', '');
                                                        setAttributes({
                                                            images: images.filter((img, i) => i !== index),
                                                            image_sortable: images.filter((img, i) => i !== index),
                                                            wpmf_autoinsert: '0'
                                                        })
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            );
        }
    }

    class WpmfPortfolioTheme extends Component {
        constructor() {
            super(...arguments);
        }

        componentDidMount() {
            const {attributes} = this.props;
            if (attributes.images.length) {
                this.initMasonry();
            }
        }

        componentDidUpdate(prevProps) {
            // Deselect images when deselecting the block
            const {attributes} = this.props;
            if (attributes.images.length && !(prevProps.attributes.size === attributes.size && prevProps.attributes.columns === attributes.columns && prevProps.attributes.wpmf_orderby === attributes.wpmf_orderby && prevProps.attributes.wpmf_order === attributes.wpmf_order && JSON.stringify(prevProps.attributes.images) === JSON.stringify(attributes.images))) {
                this.initMasonry(attributes.display);
            }
        }

        /**
         * run masonry layout
         */
        initMasonry() {
            const {attributes, clientId} = this.props;
            let $container = $(`#block-${clientId} .wpmf-gallery-list-items`);
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
        unSelectedImage(e) {
            if (!$(e.target).hasClass('wpmf-gallery-image') && !$(e.target).hasClass('wpmf_overlay')) {
                this.props.setStateImgSelectedID(0);
                this.props.setStateImgInfos('', '', '');
            }
        }

        loadImageInfos(image) {
            if (this.props.selectedImageId !== image.id) {
                this.props.setStateImgSelectedID(image.id);
                this.props.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
            } else {
                this.props.setStateImgSelectedID();
                this.props.setStateImgInfos();
            }
        }

        render() {
            const {attributes, setAttributes, clientId} = this.props;
            const {
                images,
                columns,
                size,
                img_border_radius,
                gutterwidth,
                borderStyle,
                borderWidth,
                borderColor,
                hoverShadowH,
                hoverShadowV,
                hoverShadowBlur,
                hoverShadowSpread,
                hoverShadowColor
            } = attributes;
            return (
                <div className="wpmf-gallery-block wpmfBlockMasonry" onClick={this.unSelectedImage.bind(this)}>
                    <style>
                        {
                            borderStyle !== 'none' &&
                            `#block-${clientId} .wpmf-gallery-block ul li img {border: ${borderColor} ${borderWidth}px ${borderStyle};}`
                        }

                        {
                            ((parseInt(hoverShadowH) !== 0 || parseInt(hoverShadowV) !== 0 || parseInt(hoverShadowBlur) !== 0 || parseInt(hoverShadowSpread) !== 0)) &&
                            `#block-${clientId} .wpmf-gallery-block ul li img:hover {box-shadow: ${hoverShadowH}px ${hoverShadowV}px ${hoverShadowBlur}px ${hoverShadowSpread}px ${hoverShadowColor};}`
                        }
                    </style>
                    <ul
                        className={`wpmf-gallery-list-items gallery-columns-${columns} wpmf-has-border-radius-${img_border_radius} wpmf-has-gutter-width-${gutterwidth}`}>
                        {images.map((image, index) => {
                            let url = '';
                            if (typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") {
                                url = image.media_details.sizes[size].source_url;
                            } else if ((typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined")) {
                                url = image.sizes[size].url;
                            } else {
                                url = image.url;
                            }

                            if ((typeof image.media_details !== "undefined" && typeof image.media_details.sizes !== "undefined" && typeof image.media_details.sizes[size] !== "undefined") || (typeof image.sizes !== "undefined" && typeof image.sizes[size] !== "undefined") || typeof image.url !== "undefined") {
                                return (
                                    <li
                                        className={(isBlobURL(url)) ? "wpmf-gallery-block-item is-transient" : "wpmf-gallery-block-item "}
                                        key={index}>
                                        <div className={(this.props.selectedImageId === image.id) ? 'wpmf-gallery-block-item-infos is-selected' : 'wpmf-gallery-block-item-infos'}>
                                            {(this.props.gallery_loading) && <span
                                                className="spinner wpmf_spiner_block_gallery_loading"> </span>}
                                            <div onClick={() => this.loadImageInfos(image)} className="wpmf_overlay"> </div>
                                            <div className="portfolio_lightbox" title={image.title}>+</div>
                                            <img
                                                src={url}
                                                className={`wpmf-gallery-image`}
                                            />
                                            {isBlobURL(url) && <span className="spinner"> </span>}
                                            <Tooltip text={__('Remove image', 'wpmf')}>
                                                <IconButton
                                                    className="wpmf-gallery-block-item-remove"
                                                    icon="no"
                                                    onClick={() => {
                                                        this.props.setStateImgInfos(0, '', '');
                                                        setAttributes({
                                                            images: images.filter((img, i) => i !== index),
                                                            image_sortable: images.filter((img, i) => i !== index),
                                                            wpmf_autoinsert: '0'
                                                        })
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className={`wpmf-caption-text wpmf-gallery-caption`}>
                                            {image.title !== '' && <span className={`title`}>{image.title}</span>}
                                            {image.caption !== '' && <span className={`excerpt`}>{image.caption}</span>}
                                        </div>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            );
        }
    }

    class wpmfWordpressGallery extends Component {
        constructor() {
            super(...arguments);
            this.state = {
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
            this.addFiles = this.addFiles.bind(this);
            this.uploadFromFiles = this.uploadFromFiles.bind(this);
        }

        componentWillMount() {
            const {attributes, setAttributes} = this.props;
            const {images, image_sortable, display, wpmf_autoinsert, wpmf_folder_id} = attributes;
            const currentBlockConfig = wpmf_blocks.vars.gallery_configs.theme[display + '_theme'];
            // No override attributes of blocks inserted before
            if (!attributes.changed) {
                if (typeof currentBlockConfig === 'object' && currentBlockConfig !== null) {
                    Object.keys(currentBlockConfig).map((attribute) => {
                        if (attribute === 'orderby' || attribute === 'order') {
                            attributes['wpmf_' + attribute] = currentBlockConfig[attribute];
                        } else {
                            attributes[attribute] = currentBlockConfig[attribute];
                        }
                    });
                }

                // Finally set changed attribute to true, so we don't modify anything again
                setAttributes( { changed: true } );
            }

            const {wpmf_orderby, wpmf_order} = attributes;
            if (wpmf_folder_id.length && parseInt(wpmf_autoinsert) === 1) {
                this.loadImagesFromFolder(wpmf_folder_id, wpmf_orderby, wpmf_order);
            } else {
                const imgsId = images.map((img) => img.id);
                this.setState({gallery_loading: true});
                fetch(wpmf_blocks.vars.ajaxurl + `?action=gallery_block_load_image_infos&ids=${imgsId.join()}&wpmf_nonce=${wpmf_blocks.vars.wpmf_nonce}`)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if (result.status) {
                                images.map((img) => {
                                    img.title = result.titles[img.id];
                                    img.caption = result.captions[img.id];
                                    img.custom_link = result.custom_links[img.id];
                                    img.link_target = result.link_targets[img.id];
                                    return img;
                                });

                                image_sortable.map((img) => {
                                    img.title = result.titles[img.id];
                                    img.caption = result.captions[img.id];
                                    img.custom_link = result.custom_links[img.id];
                                    img.link_target = result.link_targets[img.id];
                                    return img;
                                });
                                this.setState({gallery_loading: false});
                            }
                        },
                        // errors
                        (error) => {
                        }
                    );
            }
        }

        componentWillReceiveProps(nextProps) {
            const {attributes, setAttributes} = this.props;
            if (nextProps.attributes.display !== attributes.display) {
                // set default settings by theme
                const currentBlockConfig = wpmf_blocks.vars.gallery_configs.theme[nextProps.attributes.display + '_theme'];
                if (typeof currentBlockConfig === 'object' && currentBlockConfig !== null) {
                    Object.keys(currentBlockConfig).map((attribute) => {
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

        componentDidUpdate(prevProps) {
            // Deselect images when deselecting the block
            const {attributes, setAttributes, isSelected} = this.props;
            if (!isSelected && prevProps.isSelected) {
                this.setStateImgSelectedID();
                this.setStateImgInfos();
            }
        }

        loadImagesFromFolder(folders, orderby, order) {
            const {attributes, setAttributes, clientId} = this.props;
            const {images} = attributes;
            this.setState({gallery_loading: true});
            fetch(wpmf_blocks.vars.ajaxurl + `?action=wpmf_gallery_from_folder&ids=${folders.join()}&orderby=${orderby}&order=${order}&wpmf_nonce=${wpmf_blocks.vars.wpmf_nonce}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status) {
                            const allImages = result.images;
                            this.setState({gallery_loading: false});
                            if (JSON.stringify(images) !== JSON.stringify(result.images)) {
                                setAttributes({
                                    images: allImages,
                                    image_sortable: allImages
                                });
                            }

                            if (!allImages.length) {
                                if (!$(`#block-${clientId} .wpmf_gallery_img_msg`).length) {
                                    $(`#block-${clientId} .wpmf_select_folders`).after(`<span class="wpmf_gallery_img_msg">${__('Ooups, this folder does not have any images...', 'wpmf')}</span>`);
                                }
                            }
                        }
                    }
                );
        }

        /**
         * Do sort image
         */
        doSort(wpmf_orderby, wpmf_order) {
            const {attributes, setAttributes} = this.props;
            const {images, image_sortable} = attributes;
            let images_ordered;
            // Order images
            switch (wpmf_orderby) {
                default:
                case 'title':
                    if (wpmf_order === 'DESC') {
                        images_ordered = [].concat(images)
                            .sort((a, b) => {
                                if (typeof a.title !== "undefined" && typeof b.title !== "undefined") {
                                    return b.title.localeCompare(a.title);
                                } else {
                                    return b.url.localeCompare(a.url);
                                }
                            });
                    } else {
                        images_ordered = [].concat(images)
                            .sort((a, b) => {
                                if (typeof a.title !== "undefined" && typeof b.title !== "undefined") {
                                    return a.title.localeCompare(b.title)
                                } else {
                                    return a.url.localeCompare(b.url)
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
                        images_ordered = [].concat(images)
                            .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
                    } else {
                        images_ordered = [].concat(images)
                            .sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime());
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
        sortImageOrderBy(value) {
            const {attributes} = this.props;
            const {wpmf_order} = attributes;
            this.doSort(value, wpmf_order);
        }

        /**
         * Set images order
         */
        sortImageOrder(value) {
            const {attributes} = this.props;
            const {wpmf_orderby} = attributes;
            this.doSort(wpmf_orderby, value);
        }

        setAutoInsertGallery(value) {
            const {attributes, setAttributes} = this.props;
            const {wpmf_folder_id, wpmf_orderby, wpmf_order} = attributes;
            setAttributes({wpmf_autoinsert: value});
            if (parseInt(value) === 1 && wpmf_folder_id.length) {
                this.loadImagesFromFolder(wpmf_folder_id, wpmf_orderby, wpmf_order);
            }
        }

        setFoldersGallery(value, auto) {
            const {attributes, setAttributes} = this.props;
            const {wpmf_autoinsert, wpmf_orderby, wpmf_order} = attributes;
            setAttributes({wpmf_folder_id: value, wpmf_autoinsert: '1'});
            if (auto) {
                this.loadImagesFromFolder(value, wpmf_orderby, wpmf_order);
            } else {
                if (parseInt(wpmf_autoinsert) === 1) {
                    this.loadImagesFromFolder(value, wpmf_orderby, wpmf_order);
                }
            }
        }

        setRadiusTo(value) {
            const {setAttributes} = this.props;
            setAttributes({img_border_radius: value});
        }

        /**
         * Load image infos
         */
        loadImageInfos(image) {
            if (this.state.selectedImageId !== image.id) {
                this.setStateImgInfos(image.title, image.caption, image.custom_link, image.link_target);
            }

            this.setState({selectedImageId: (this.state.selectedImageId === image.id) ? 0 : image.id})
        }

        /**
         * Update image info
         */
        updateImageInfos() {
            const {attributes, setAttributes} = this.props;
            const {images} = attributes;
            $('.save_img_action span').addClass('visible');
            fetch(wpmf_blocks.vars.ajaxurl + `?action=gallery_block_update_image_infos&id=${this.state.selectedImageId}&title=${this.state.selectedImageInfos.title}&caption=${this.state.selectedImageInfos.caption}&custom_link=${this.state.selectedImageInfos.custom_link}&link_target=${this.state.selectedImageInfos.link_target}&wpmf_nonce=${wpmf_blocks.vars.wpmf_nonce}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        $('.save_img_action span').removeClass('visible');
                        if (result.status) {
                            images.map((img) => {
                                if (img.id === this.state.selectedImageId) {
                                    img.title = result.infos.title;
                                    img.caption = result.infos.caption;
                                    img.custom_link = result.infos.custom_link;
                                    img.link_target = result.infos.link_target
                                }

                                return img;
                            });
                        }
                    },
                    // errors
                    (error) => {
                        this.setStateImgInfos();
                    }
                )
        }

        /**
         * Un Selected image
         */
        unSelectedImage(e) {
            if (!$(e.target).hasClass('wpmf-gallery-image')) {
                this.setStateImgSelectedID();
                this.setStateImgInfos();
            }
        }

        /**
         * Select image
         */
        onSelectImages(imgss) {
            const {attributes, setAttributes} = this.props;
            const {images, wpmf_orderby, wpmf_order} = attributes;


            const imgs = imgss.map((img) => wp.media.attachment(img.id).attributes);
            let check = false;
            setAttributes({
                images: imgs,
                image_sortable: imgs
            });

            if (images.length <= imgs.length) {
                if (images.length) {
                    images.map((img, index) => {
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
                imgs.map((img, index) => {
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
        uploadFromFiles(event) {
            this.addFiles(event.target.files);
        }

        /**
         * Add files
         */
        addFiles(files) {
            const {attributes, setAttributes} = this.props;
            const {images} = attributes;
            mediaUpload({
                allowedTypes: ALLOWED_MEDIA_TYPES,
                filesList: files,
                onFileChange: (imgs) => {
                    const imagesNormalized = imgs.map((image) => {
                        return pickRelevantMediaFiles(image);
                    });

                    setAttributes({
                        images: images.concat(imagesNormalized),
                        image_sortable: images.concat(imagesNormalized)
                    });
                }
            });
        }

        setStateImgInfos(title = '', caption = '', custom_link = '', link_target = '_self') {
            this.setState({
                selectedImageInfos: {
                    title: title,
                    caption: caption,
                    custom_link: custom_link,
                    link_target: link_target
                }
            });
        }

        setStateImgSelectedID(id = 0) {
            this.setState({
                selectedImageId: id
            });
        }


        render() {
            const listBorderStyles = [
                {label: __('None', 'wpmf'), value: 'none'},
                {label: __('Solid', 'wpmf'), value: 'solid'},
                {label: __('Dotted', 'wpmf'), value: 'dotted'},
                {label: __('Dashed', 'wpmf'), value: 'dashed'},
                {label: __('Double', 'wpmf'), value: 'double'},
                {label: __('Groove', 'wpmf'), value: 'groove'},
                {label: __('Ridge', 'wpmf'), value: 'ridge'},
                {label: __('Inset', 'wpmf'), value: 'inset'},
                {label: __('Outset', 'wpmf'), value: 'outset'},
            ];

            const {attributes, setAttributes, className, isSelected, clientId} = this.props;
            const {images, display, columns, size, targetsize, link, wpmf_orderby, wpmf_order, autoplay, img_border_radius, borderWidth, borderStyle, borderColor, hoverShadowH, hoverShadowV, hoverShadowBlur, hoverShadowSpread, hoverShadowColor, gutterwidth, wpmf_autoinsert, wpmf_folder_id, cover} = attributes;
            const list_sizes = Object.keys(wpmf_blocks.vars.sizes).map((key, label) => {
                return {
                    label: wpmf_blocks.vars.sizes[key],
                    value: key
                }
            });

            const controls = (
                <BlockControls>
                    {images.length && (
                        <Toolbar>
                            <MediaUpload
                                onSelect={(imgs) => this.onSelectImages(imgs)}
                                allowedTypes={ALLOWED_MEDIA_TYPES}
                                multiple
                                gallery
                                value={images.map((img) => img.id)}
                                render={({open}) => (
                                    <IconButton
                                        className="components-toolbar__control"
                                        label={__('Edit Gallery', 'wpmf')}
                                        icon="edit"
                                        onClick={open}
                                    />
                                )}
                            />
                        </Toolbar>
                    )}
                </BlockControls>
            );

            const inspect_controls = (
                <InspectorControls>
                    {this.state.selectedImageId === 0 &&
                    <div>
                        <PanelBody title={__('Gallery Settings', 'wpmf')}>
                            <SelectControl
                                label={__('Theme', 'wpmf')}
                                value={display}
                                options={[
                                    {label: __('Default', 'wpmf'), value: 'default'},
                                    {label: __('Masonry', 'wpmf'), value: 'masonry'},
                                    {label: __('Portfolio', 'wpmf'), value: 'portfolio'},
                                    {label: __('Slider', 'wpmf'), value: 'slider'},
                                ]}
                                onChange={(value) => setAttributes({display: value})}
                            />

                            <div className={`wpmf_sl_gallery_folders components-base-control`}>
                                <label className="components-base-control__label">{__('Select a folder', 'wpmf')}</label>
                                <select size={folders_length} className={`wpmf_select_folders_controll`} multiple onChange={() => this.setFoldersGallery($(`.wpmf_select_folders_controll`).val(), false)}>
                                    {wpmf_categories.map((category, index) => {
                                        if ((wpmf_folder_id.indexOf(category.value.toString()) !== -1)) {
                                            return (<option selected key={index} value={category.value}>{category.label}</option>)
                                        } else {
                                            return (<option key={index} value={category.value}>{category.label}</option>)
                                        }
                                    })}
                                </select>
                            </div>

                            <SelectControl
                                label={__('Columns', 'wpmf')}
                                value={columns}
                                options={[
                                    {label: 1, value: '1'},
                                    {label: 2, value: '2'},
                                    {label: 3, value: '3'},
                                    {label: 4, value: '4'},
                                    {label: 5, value: '5'},
                                    {label: 6, value: '6'},
                                    {label: 7, value: '7'},
                                    {label: 8, value: '8'},
                                    {label: 9, value: '9'},
                                ]}
                                onChange={(value) => setAttributes({columns: value})}
                            />

                            <SelectControl
                                label={__('Gallery image size', 'wpmf')}
                                value={size}
                                options={list_sizes}
                                onChange={(value) => setAttributes({size: value})}
                            />

                            <SelectControl
                                label={__('Lightbox size', 'wpmf')}
                                value={targetsize}
                                options={list_sizes}
                                onChange={(value) => setAttributes({targetsize: value})}
                            />

                            <SelectControl
                                label={__('Action on click', 'wpmf')}
                                value={link}
                                options={[
                                    {label: __('Lightbox', 'wpmf'), value: 'file'},
                                    {label: __('Attachment Page', 'wpmf'), value: 'post'},
                                    {label: __('None', 'wpmf'), value: 'none'},
                                    {label: __('Custom link', 'wpmf'), value: 'custom'}
                                ]}
                                onChange={(value) => setAttributes({link: value})}
                            />

                            <SelectControl
                                label={__('Order by', 'wpmf')}
                                value={wpmf_orderby}
                                options={[
                                    {label: __('Custom', 'wpmf'), value: 'post__in'},
                                    {label: __('Random', 'wpmf'), value: 'rand'},
                                    {label: __('Title', 'wpmf'), value: 'title'},
                                    {label: __('Date', 'wpmf'), value: 'date'}
                                ]}
                                onChange={this.sortImageOrderBy.bind(this)}
                            />

                            <SelectControl
                                label={__('Order', 'wpmf')}
                                value={wpmf_order}
                                options={[
                                    {label: __('Ascending', 'wpmf'), value: 'ASC'},
                                    {label: __('Descending ', 'wpmf'), value: 'DESC'}
                                ]}
                                onChange={this.sortImageOrder.bind(this)}
                            />

                            <SelectControl
                                label={__('Update with new folder content', 'wpmf')}
                                value={wpmf_autoinsert}
                                options={[
                                    {label: __('No', 'wpmf'), value: '0'},
                                    {label: __('Yes ', 'wpmf'), value: '1'}
                                ]}
                                onChange={this.setAutoInsertGallery.bind(this)}
                            />

                            {
                                display === 'slider' && <ToggleControl
                                    label={__('Autoplay', 'wpmf')}
                                    checked={autoplay}
                                    onChange={() => setAttributes({autoplay: (autoplay === 1) ? 0 : 1})}
                                />
                            }
                        </PanelBody>

                        <PanelBody title={__('Border', 'wpmf')} initialOpen={false}>
                            <RangeControl
                                label={__('Border radius', 'wpmf')}
                                aria-label={__('Add rounded corners to the gallery items.', 'wpmf')}
                                value={img_border_radius}
                                onChange={this.setRadiusTo.bind(this)}
                                min={0}
                                max={20}
                                step={1}
                            />
                            <SelectControl
                                label={__('Border style', 'wpmf')}
                                value={borderStyle}
                                options={listBorderStyles}
                                onChange={(value) => setAttributes({borderStyle: value})}
                            />
                            {borderStyle !== 'none' && (
                                <Fragment>
                                    <PanelColorSettings
                                        title={__('Border Color', 'wpmf')}
                                        initialOpen={false}
                                        colorSettings={[
                                            {
                                                label: __('Border Color', 'wpmf'),
                                                value: borderColor,
                                                onChange: (value) => setAttributes({borderColor: value === undefined ? '#2196f3' : value}),
                                            },
                                        ]}
                                    />
                                    <RangeControl
                                        label={__('Border width', 'wpmf')}
                                        value={borderWidth || 0}
                                        onChange={(value) => setAttributes({borderWidth: value})}
                                        min={0}
                                        max={10}
                                    />
                                </Fragment>
                            )}
                        </PanelBody>
                        <PanelBody title={__('Margin', 'wpmf')} initialOpen={false}>
                            <RangeControl
                                label={__('Gutter', 'wpmf')}
                                value={gutterwidth}
                                onChange={(value) => setAttributes({gutterwidth: value})}
                                min={0}
                                max={50}
                                step={5}
                            />
                        </PanelBody>
                        <PanelBody title={__('Shadow', 'wpmf')} initialOpen={false}>
                            <RangeControl
                                label={__('Shadow H offset', 'wpmf')}
                                value={hoverShadowH || 0}
                                onChange={(value) => setAttributes({hoverShadowH: value})}
                                min={-50}
                                max={50}
                            />
                            <RangeControl
                                label={__('Shadow V offset', 'wpmf')}
                                value={hoverShadowV || 0}
                                onChange={(value) => setAttributes({hoverShadowV: value})}
                                min={-50}
                                max={50}
                            />
                            <RangeControl
                                label={__('Shadow blur', 'wpmf')}
                                value={hoverShadowBlur || 0}
                                onChange={(value) => setAttributes({hoverShadowBlur: value})}
                                min={0}
                                max={50}
                            />
                            <RangeControl
                                label={__('Shadow spread', 'wpmf')}
                                value={hoverShadowSpread || 0}
                                onChange={(value) => setAttributes({hoverShadowSpread: value})}
                                min={0}
                                max={50}
                            />

                            <PanelColorSettings
                                title={__('Color Settings', 'wpmf')}
                                initialOpen={false}
                                colorSettings={[
                                    {
                                        label: __('Shadow Color', 'wpmf'),
                                        value: hoverShadowColor,
                                        onChange: (value) => setAttributes({hoverShadowColor: value === undefined ? '#ccc' : value}),
                                    }
                                ]}
                            />
                        </PanelBody>
                    </div>
                    }

                    {this.state.selectedImageId !== 0 &&
                    <PanelBody title={__('Image Settings', 'wpmf')}>
                        <TextControl
                            label={__('Title', 'wpmf')}
                            value={this.state.selectedImageInfos.title}
                            onChange={(value) => {
                                this.setState({
                                    selectedImageInfos: {
                                        ...this.state.selectedImageInfos,
                                        title: value
                                    }
                                })
                            }}
                        />
                        <TextControl
                            label={__('Caption', 'wpmf')}
                            value={this.state.selectedImageInfos.caption}
                            onChange={(value) => {
                                this.setState({
                                    selectedImageInfos: {
                                        ...this.state.selectedImageInfos,
                                        caption: value
                                    }
                                })
                            }}
                        />
                        <TextControl
                            label={__('Custom link', 'wpmf')}
                            value={this.state.selectedImageInfos.custom_link}
                            onChange={(value) => {
                                this.setState({
                                    selectedImageInfos: {
                                        ...this.state.selectedImageInfos,
                                        custom_link: value
                                    }
                                })
                            }}
                        />

                        <SelectControl
                            label={__('Link target', 'wpmf')}
                            value={this.state.selectedImageInfos.link_target}
                            options={[
                                {label: __('Same Window', 'wpmf'), value: '_self'},
                                {label: __('New Window ', 'wpmf'), value: '_blank'}
                            ]}
                            onChange={(value) => {
                                this.setState({
                                    selectedImageInfos: {
                                        ...this.state.selectedImageInfos,
                                        link_target: value
                                    }
                                })
                            }}
                        />

                        <div className="save_img_action">
                            <Button className="is-button is-default is-primary is-large"
                                    onClick={this.updateImageInfos.bind(this)}>
                                {__('Save', 'wpmf')}
                            </Button>
                            <span className="spinner"> </span>
                        </div>
                    </PanelBody>
                    }
                </InspectorControls>
            );

            if (typeof cover !== "undefined" && images.length === 0) {
                return (
                    <div className="wpmf-cover"><img src={cover} /></div>
                )
            }

            if (typeof cover === "undefined" && images.length === 0) {
                return (
                    <Placeholder
                        icon="format-gallery"
                        label={__('WP Media Folder Gallery', 'wpmf')}
                        instructions={__('Load images from media folder, from your media library or just upload new images', 'wpmf')}
                        className={className}
                    >
                        <div className={`wpmf_sl_gallery_folders`}>
                            <select size={folders_length} className={`wpmf_select_folders`} multiple onChange={() => setAttributes({wpmf_folder_id: $(`#block-${clientId} .wpmf_select_folders`).val()})}>
                                {wpmf_categories.map((category, index) => {
                                    if ((wpmf_folder_id.indexOf(category.value.toString()) !== -1)) {
                                        return (<option selected key={index} value={category.value}>{category.label}</option>)
                                    } else {
                                        return (<option key={index} value={category.value}>{category.label}</option>)
                                    }
                                })}
                            </select>
                        </div>
                        <FormFileUpload
                            multiple
                            isLarge
                            className="editor-media-placeholder__button wpmf_btn_upload_img"
                            onChange={this.uploadFromFiles}
                            accept="image/*"
                            icon="upload"
                        >
                            {__('Upload', 'wpmf')}
                        </FormFileUpload>
                        <MediaUpload
                            gallery
                            multiple
                            onSelect={(imgs) => this.onSelectImages(imgs)}
                            accept="image/*"
                            allowedTypes={ALLOWED_MEDIA_TYPES}
                            render={({open}) => (
                                <Button
                                    isLarge
                                    className="editor-media-placeholder__button wpmfLibrary"
                                    onClick={open}
                                >
                                    {__('Media Library', 'wpmf')}
                                </Button>
                            )}
                        />

                        <Button
                            isLarge
                            isPrimary
                            className="editor-media-placeholder__button"
                            onClick={() => this.setFoldersGallery(wpmf_folder_id, true)}
                        >
                            {__('CREATE GALLERY', 'wpmf')}
                        </Button>
                    </Placeholder>

                );
            }

            if (typeof cover === "undefined" && images.length) {
                return (
                    <Fragment>
                        {controls}
                        {inspect_controls}
                        {display === 'slider' &&
                        <WpmfSliderTheme {...this.props} selectedImageId={this.state.selectedImageId}
                                        gallery_loading={this.state.gallery_loading}
                                        setStateImgInfos={this.setStateImgInfos.bind(this)}
                                        setStateImgSelectedID={this.setStateImgSelectedID.bind(this)}/>
                        }

                        {display === 'default' &&
                        <WpmfDefaultTheme {...this.props} selectedImageId={this.state.selectedImageId}
                                        gallery_loading={this.state.gallery_loading}
                                        setStateImgInfos={this.setStateImgInfos.bind(this)}
                                        setStateImgSelectedID={this.setStateImgSelectedID.bind(this)}/>
                        }

                        {display === 'masonry' &&
                        <WpmfMasonryTheme {...this.props} selectedImageId={this.state.selectedImageId}
                                          gallery_loading={this.state.gallery_loading}
                                          setStateImgInfos={this.setStateImgInfos.bind(this)}
                                          setStateImgSelectedID={this.setStateImgSelectedID.bind(this)}/>
                        }

                        {display === 'portfolio' &&
                        <WpmfPortfolioTheme {...this.props} selectedImageId={this.state.selectedImageId}
                                          gallery_loading={this.state.gallery_loading}
                                          setStateImgInfos={this.setStateImgInfos.bind(this)}
                                          setStateImgSelectedID={this.setStateImgSelectedID.bind(this)}/>
                        }

                        {isSelected &&
                        <div className="blocks-gallery-item has-add-item-button">
                            <FormFileUpload
                                multiple
                                isLarge
                                className="block-library-gallery-add-item-button"
                                onChange={this.uploadFromFiles}
                                accept="image/*"
                                icon="upload"
                            >
                                {__('Upload an image', 'wpmf')}
                            </FormFileUpload>
                        </div>
                        }
                    </Fragment>
                );
            }
        }
    }

    const galleryAttrs = {
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
            default: 1,
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
            attribute: 'src',
        }
    };

    registerBlockType(
        'wpmf/wordpress-gallery', {
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
            save: ({attributes}) => {
                const {images, display, columns, size, targetsize, link, wpmf_orderby, wpmf_order, wpmf_autoinsert, wpmf_folder_id, autoplay, img_border_radius, gutterwidth, hoverShadowH, hoverShadowV, hoverShadowBlur, hoverShadowSpread, hoverShadowColor, borderWidth, borderStyle, borderColor} = attributes;
                let gallery_shortcode = '[gallery';

                let ids = images.map((img) => img.id);
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
                    gallery_shortcode += ` img_shadow="${hoverShadowH}px ${hoverShadowV}px ${hoverShadowBlur}px ${hoverShadowSpread}px ${hoverShadowColor}"`;
                }

                if (borderStyle !== 'none') {
                    gallery_shortcode += ' border_width="' + borderWidth + '"';
                    gallery_shortcode += ' border_style="' + borderStyle + '"';
                    gallery_shortcode += ' border_color="' + borderColor + '"';
                }

                gallery_shortcode += ']';

                return gallery_shortcode;
            }
        }
    );
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components);