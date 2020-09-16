<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
$wp_gallery_configs = wpmfGetOption('gallery_shortcode_cf');
$wp_gallery_themes = array(
    'default' => esc_html__('Default', 'wpmf'),
    'masonry' => esc_html__('Masonry', 'wpmf'),
    'portfolio' => esc_html__('Portfolio', 'wpmf'),
    'slider' => esc_html__('Slider', 'wpmf')
);
?>
<div id="gallery_features" class="tab-content">
    <div class="content-box">
        <div class="content-wpmf-gallery">
            <div class="ju-settings-option">
                <div class="wpmf_row_full">
                    <input type="hidden" name="wpmf_usegellery" value="0">
                    <label data-alt="<?php esc_html_e('Enhance the WordPress default gallery system
             by adding themes and additional parameters in the gallery manager', 'wpmf'); ?>"
                           class="ju-setting-label text">
                        <?php esc_html_e('Enable the gallery feature', 'wpmf') ?>
                    </label>
                    <div class="ju-switch-button">
                        <label class="switch">
                            <input type="checkbox" name="wpmf_usegellery" value="1"
                                <?php
                                if (isset($usegellery) && (int) $usegellery === 1) {
                                    echo 'checked';
                                }
                                ?>
                            >
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="ju-settings-option wpmf_right m-r-0">
                <div class="wpmf_row_full">
                    <input type="hidden" name="wpmf_option_lightboximage" value="0">
                    <label data-alt="<?php esc_html_e('Add a lightbox option on each image of your WordPress content', 'wpmf'); ?>"
                           class="ju-setting-label text"><?php esc_html_e('Enable the single image lightbox feature', 'wpmf') ?></label>
                    <div class="ju-switch-button">
                        <label class="switch">
                            <input type="checkbox" name="wpmf_option_lightboximage"
                                   id="cb_option_lightboximage" value="1"
                                <?php
                                if (isset($option_lightboximage) && (int) $option_lightboximage === 1) {
                                    echo 'checked';
                                }
                                ?>
                            >
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="ju-settings-option">
                <div class="wpmf_row_full">
                    <input type="hidden" name="wpmf_usegellery_lightbox" value="0">
                    <label data-alt="<?php esc_html_e('Add lightbox to images in WordPress default  galleries', 'wpmf'); ?>"
                           class="ju-setting-label text">
                        <?php esc_html_e('Lightbox in galleries', 'wpmf') ?></label>
                    <div class="ju-switch-button">
                        <label class="switch">
                            <input type="checkbox" name="wpmf_usegellery_lightbox" value="1"
                                <?php
                                if (isset($usegellery_lightbox) && (int) $usegellery_lightbox === 1) {
                                    echo 'checked';
                                }
                                ?>
                            >
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="ju-settings-option wpmf_right m-r-0">
                <div class="wpmf_row_full">
                    <input type="hidden" name="caption_lightbox_gallery" value="0">
                    <label data-alt="<?php esc_html_e('Use caption of images on lightbox instead title', 'wpmf'); ?>"
                           class="ju-setting-label text">
                        <?php esc_html_e('Caption on lightbox', 'wpmf') ?></label>
                    <div class="ju-switch-button">
                        <label class="switch">
                            <input type="checkbox" name="caption_lightbox_gallery" value="1"
                                <?php
                                if (isset($caption_lightbox_gallery) && (int) $caption_lightbox_gallery === 1) {
                                    echo 'checked';
                                }
                                ?>
                            >
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <?php if (defined('NGG_PLUGIN_VERSION')) : ?>
                <?php
                /**
                 * Filter check capability of current user to show import nextgen gallery button
                 *
                 * @param boolean The current user has the given capability
                 * @param string  Action name
                 *
                 * @return boolean
                 *
                 * @ignore Hook already documented
                 */
                $wpmf_capability = apply_filters('wpmf_user_can', current_user_can('manage_options'), 'show_import_nextgen_gallery_button');
                if ($wpmf_capability) : ?>
                    <div class="ju-settings-option wpmf_right">
                        <div class="wpmf_row_full">
                            <label class="ju-setting-label wpmf_width_100">
                                <button type="button" id="btn_import_gallery"
                                        class="ju-button no-background orange-button waves-effect waves-light btn_import_gallery" style="float: left">
                                    <?php esc_html_e('Sync/Import NextGEN galleries', 'wpmf'); ?>
                                </button>
                                <span class="spinner" style="margin: 10px 15px; float: left;display:none"></span>
                            </label>
                        </div>
                        <p class="description p-lr-20">
                            <?php esc_html_e('Import nextGEN albums as image in folders in the media manager.
             You can then create new galleries from WordPress media manager', 'wpmf'); ?>
                        </p>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
        </div>

        <div class="wpmf_row_full">
            <div class="wrap_left">
                <div id="gallery_image_size" class="div_list media_filter_block wpmf_width_100">
                    <ul class="image_size">
                        <li class="div_list_child accordion-section control-section control-section-default open">
                            <h3 class="accordion-section-title wpmf-section-title"
                                data-title="sizes"
                                tabindex="0"><?php esc_html_e('List defaut filter size', 'wpmf') ?>
                                <i class="zmdi zmdi-chevron-up"></i>
                                <i class="zmdi zmdi-chevron-down"></i>
                            </h3>
                            <ul class="content_list_sizes">
                                <?php
                                $sizes = apply_filters('image_size_names_choose', array(
                                    'thumbnail' => __('Thumbnail', 'wpmf'),
                                    'medium'    => __('Medium', 'wpmf'),
                                    'large'     => __('Large', 'wpmf'),
                                    'full'      => __('Full Size', 'wpmf'),
                                ));
                                foreach ($sizes as $key => $size) :
                                    ?>

                                    <li class="wpmf_width_100 ju-settings-option customize-control customize-control-select item_dimension" data-value="<?php echo esc_html($a_dimension); ?>">
                                        <div class="wpmf_row_full">
                                            <div class="pure-checkbox ju-setting-label">
                                                <input title="" id="<?php echo esc_attr($key) ?>" type="checkbox"
                                                       name="size_value[]"
                                                       value="<?php echo esc_attr($key) ?>"
                                                    <?php
                                                    if (in_array($key, $size_selected)) {
                                                        echo 'checked';
                                                    }
                                                    ?>
                                                >
                                                <label for="<?php echo esc_html($key) ?>"><?php echo esc_html($size) ?></label>
                                            </div>
                                        </div>
                                    </li>

                                <?php endforeach; ?>
                            </ul>
                        </li>
                    </ul>
                </div>
                <p class="description">
                    <?php esc_html_e('Select the image size you can load in galleries.
                     Custom image size available here can be generated by 3rd party plugins', 'wpmf'); ?>
                </p>
            </div>

            <div class="wrap_right">
                <!--    setting padding     -->
                <div id="gallery_image_padding" class="div_list media_filter_block wpmf_width_100">
                    <ul class="image_size">
                        <li class="div_list_child accordion-section control-section control-section-default open">
                            <h3 class="accordion-section-title wpmf-section-title padding_title"
                                data-title="padding" tabindex="0">
                                <?php esc_html_e('Gallery themes settings', 'wpmf') ?>
                                <i class="zmdi zmdi-chevron-up"></i>
                                <i class="zmdi zmdi-chevron-down"></i>
                            </h3>
                            <div class="content_list_padding">
                                <div class="wpmf_width_100 p-d-20 ju-settings-option customize-control customize-control-select">
                                    <div class="wpmf_row_full">
                                        <span><?php esc_html_e('Masonry Theme', 'wpmf'); ?></span>
                                        <label><?php esc_html_e('Space between images (padding)', 'wpmf') ?></label>
                                        <label>
                                            <input name="padding_gallery[wpmf_padding_masonry]"
                                                   class="padding_gallery small-text"
                                                   type="number" min="0" max="30"
                                                   value="<?php echo esc_attr($padding_masonry) ?>">
                                        </label>
                                        <label><?php esc_html_e('px', 'wpmf') ?></label>
                                    </div>

                                    <div class="wpmf_row_full">
                                        <span><?php esc_html_e('Portfolio Theme', 'wpmf'); ?></span>
                                        <label><?php esc_html_e('Space between images (padding)', 'wpmf') ?></label>
                                        <label>
                                            <input name="padding_gallery[wpmf_padding_portfolio]"
                                                   class="padding_gallery small-text"
                                                   type="number" min="0" max="30"
                                                   value="<?php echo esc_attr($padding_portfolio) ?>">
                                        </label>
                                        <label><?php esc_html_e('px', 'wpmf') ?></label>
                                    </div>
                                </div>
                                <p class="description"><?php esc_html_e('Determine the space between images', 'wpmf'); ?></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="default_settings" class="tab-content">
    <div class="content-box usegellery content-wpmf-gallery">
        <?php
        // phpcs:ignore WordPress.Security.EscapeOutput -- Content already escaped in the method
        echo $glrdefault_settings_html;
        ?>
    </div>
</div>

<div id="wp_gallery_shortcode" class="tab-content">
    <div class="content-box">
        <div class="wp_gallery_shortcode_settings_wrap">
            <h2><?php esc_html_e('GALLERIES FROM FOLDER SHORTCODE GENERATOR', 'wpmf') ?></h2>
            <div class="wpmf_width_100">
                <div class="ju-settings-option wpmf-no-shadow">
                    <div class="wpmf_row_full">
                        <div class="wpmf_gallery_shortcode_cf_settings">
                            <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                                <?php esc_html_e('Gallery from folder', 'wpmf'); ?>
                            </label>

                            <label>
                                <?php
                                $folder_args = array(
                                    'show_option_none'  => __('Select a folder', 'wpmf'),
                                    'option_none_value' => 0,
                                    'hide_empty'        => false,
                                    'hierarchical'      => true,
                                    'orderby'           => 'name',
                                    'taxonomy'          => WPMF_TAXO,
                                    'class'             => 'wp_gallery_shortcode_field wp_shortcode_gallery_folder_id',
                                    'name'              => 'wpmf_gallery_shortcode_cf[wpmf_folder_id]',
                                    'selected'          => (int) $wp_gallery_configs['wpmf_folder_id']
                                );

                                $root_id            = get_option('wpmf_folder_root_id');
                                if (isset($root_id)) {
                                    $folder_args['exclude'] = array((int) $root_id);
                                }

                                wp_dropdown_categories($folder_args);
                                ?>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <div class="wpmf_row_full">
                        <div class="wpmf_gallery_shortcode_cf_settings">
                            <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                                <?php esc_html_e('Choose a theme', 'wpmf'); ?>
                            </label>

                            <label>
                                <select class="wp_gallery_shortcode_field" name="wpmf_gallery_shortcode_cf[display]" data-param="display">
                                    <option value="default"><?php esc_html_e('Choose a theme', 'wpmf') ?></option>
                                    <?php foreach ($wp_gallery_themes as $theme_key => $theme_label) { ?>
                                        <?php if (isset($wp_gallery_configs['display'])
                                            && $wp_gallery_configs['display'] === $theme_key) : ?>
                                            <option value="<?php echo esc_html($theme_key) ?>" selected>
                                                <?php echo esc_html($theme_label) ?>
                                            </option>
                                        <?php else : ?>
                                            <option value="<?php echo esc_html($theme_key) ?>">
                                                <?php echo esc_html($theme_label) ?>
                                            </option>
                                        <?php endif; ?>


                                    <?php } ?>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ju-settings-option wpmf-no-shadow">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text" data-alt="<?php esc_html_e('Number of columns
                 by default in the gallery theme', 'wpmf'); ?>">
                    <?php esc_html_e('Columns', 'wpmf'); ?>
                </label>

                <label>
                    <select class="columns wp_gallery_shortcode_field" data-param="columns"
                            name="wpmf_gallery_shortcode_cf[columns]">
                        <?php for ($i = 1; $i <= 9; $i ++) { ?>
                            <option value="<?php echo esc_html($i) ?>" <?php selected((int) $wp_gallery_configs['columns'], (int) $i) ?> >
                                <?php echo esc_html($i) ?>
                            </option>
                        <?php } ?>
                    </select>
                </label>
            </div>

            <div class="ju-settings-option wpmf-no-shadow">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text" data-alt="<?php esc_html_e('Image size to load
                 by default as thumbnail', 'wpmf'); ?>">
                    <?php esc_html_e('Gallery image size', 'wpmf'); ?>
                </label>
                <label class="size">
                    <select class="wp_gallery_shortcode_field" data-param="size"
                            name="wpmf_gallery_shortcode_cf[size]">
                        <?php
                        $sizes_value = json_decode(get_option('wpmf_gallery_image_size_value'));
                        $sizes       = apply_filters('image_size_names_choose', array(
                            'thumbnail' => __('Thumbnail', 'wpmf'),
                            'medium'    => __('Medium', 'wpmf'),
                            'large'     => __('Large', 'wpmf'),
                            'full'      => __('Full Size', 'wpmf'),
                        ));
                        ?>

                        <?php foreach ($sizes_value as $key) : ?>
                            <?php if (!empty($sizes[$key])) : ?>
                                <option value="<?php echo esc_attr($key); ?>" <?php selected($wp_gallery_configs['size'], $key); ?>>
                                    <?php echo esc_html($sizes[$key]); ?>
                                </option>
                            <?php endif; ?>

                        <?php endforeach; ?>

                    </select>
                </label>
            </div>

            <div class="ju-settings-option wpmf-no-shadow">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text" data-alt="<?php esc_html_e('Image size to load by default as full
                 size (opened in the lightbox)', 'wpmf'); ?>">
                    <?php esc_html_e('Lightbox size', 'wpmf'); ?>
                </label>

                <label>
                    <select class="wp_gallery_shortcode_field" data-param="targetsize"
                            name="wpmf_gallery_shortcode_cf[targetsize]">
                        <?php
                        $sizes = array(
                            'thumbnail' => __('Thumbnail', 'wpmf'),
                            'medium'    => __('Medium', 'wpmf'),
                            'large'     => __('Large', 'wpmf'),
                            'full'      => __('Full Size', 'wpmf'),
                        );
                        ?>

                        <?php foreach ($sizes as $key => $name) : ?>
                            <option value="<?php echo esc_attr($key); ?>"
                                <?php selected($wp_gallery_configs['targetsize'], $key); ?>>
                                <?php echo esc_html($name); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </label>
            </div>

            <div class="ju-settings-option wpmf-no-shadow">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text" data-alt="<?php esc_html_e('Action when the user
                 click on the image thumbnail', 'wpmf'); ?>">
                    <?php esc_html_e('Action on click', 'wpmf'); ?>
                </label>

                <label>
                    <select class="wp_gallery_shortcode_field" data-param="link"
                            name="wpmf_gallery_shortcode_cf[link]">
                        <option value="file" <?php selected($wp_gallery_configs['link'], 'file'); ?>>
                            <?php esc_html_e('Lightbox', 'wpmf'); ?>
                        </option>
                        <option value="post" <?php selected($wp_gallery_configs['link'], 'post'); ?>>
                            <?php esc_html_e('Attachment Page', 'wpmf'); ?>
                        </option>
                        <option value="none" <?php selected($wp_gallery_configs['link'], 'none'); ?>>
                            <?php esc_html_e('None', 'wpmf'); ?>
                        </option>
                        <option value="custom" <?php selected($wp_gallery_configs['link'], 'custom'); ?>>
                            <?php esc_html_e('Custom link', 'wpmf'); ?>
                        </option>
                    </select>
                </label>
            </div>

            <div class="ju-settings-option wpmf-no-shadow">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text" data-alt="<?php esc_html_e('Image gallery
                 default ordering', 'wpmf'); ?>">
                    <?php esc_html_e('Order by', 'wpmf'); ?>
                </label>

                <label>
                    <select class="wp_gallery_shortcode_field" data-param="wpmf_orderby"
                            name="wpmf_gallery_shortcode_cf[wpmf_orderby]">
                        <option value="post__in" <?php selected($wp_gallery_configs['wpmf_orderby'], 'post__in'); ?>>
                            <?php esc_html_e('Custom', 'wpmf'); ?>
                        </option>
                        <option value="rand" <?php selected($wp_gallery_configs['wpmf_orderby'], 'rand'); ?>>
                            <?php esc_html_e('Random', 'wpmf'); ?>
                        </option>
                        <option value="title" <?php selected($wp_gallery_configs['wpmf_orderby'], 'title'); ?>>
                            <?php esc_html_e('Title', 'wpmf'); ?>
                        </option>
                        <option value="date" <?php selected($wp_gallery_configs['wpmf_orderby'], 'date'); ?>>
                            <?php esc_html_e('Date', 'wpmf'); ?>
                        </option>
                    </select>
                </label>
            </div>

            <div class="ju-settings-option wpmf-no-shadow">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text" data-alt="<?php esc_html_e('By default, use ascending
                 or descending order', 'wpmf'); ?>">
                    <?php esc_html_e('Order', 'wpmf'); ?>
                </label>

                <label>
                    <select class="wp_gallery_shortcode_field" data-param="wpmf_order"
                            name="wpmf_gallery_shortcode_cf[wpmf_order]">
                        <option value="ASC" <?php selected($wp_gallery_configs['wpmf_order'], 'ASC'); ?>>
                            <?php esc_html_e('Ascending', 'wpmf'); ?>
                        </option>
                        <option value="DESC" <?php selected($wp_gallery_configs['wpmf_order'], 'DESC'); ?>>
                            <?php esc_html_e('Descending', 'wpmf'); ?>
                        </option>
                    </select>
                </label>
            </div>

            <div class="ju-settings-option wpmf-no-shadow">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                    <?php esc_html_e('Margin', 'wpmf'); ?>
                </label>

                <label>
                    <input type="number" min="0" max="50" step="5" name="wpmf_gallery_shortcode_cf[gutterwidth]" class="wp_gallery_shortcode_field" data-param="gutterwidth" value="<?php echo esc_attr($wp_gallery_configs['gutterwidth']) ?>">
                </label>
            </div>

            <!-- Border settings -->
            <div class="wpmf_width_100">
                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Border style', 'wpmf'); ?>
                    </label>

                    <label>
                        <select class="wp_gallery_shortcode_field" name="wpmf_gallery_shortcode_cf[border_style]" data-param="border_style">
                            <option value="none" <?php selected($wp_gallery_configs['border_style'], 'none'); ?>><?php esc_html_e('None', 'wpmf'); ?></option>
                            <option value="solid" <?php selected($wp_gallery_configs['border_style'], 'solid'); ?>><?php esc_html_e('Solid', 'wpmf'); ?></option>
                            <option value="dotted" <?php selected($wp_gallery_configs['border_style'], 'dotted'); ?>><?php esc_html_e('Dotted', 'wpmf'); ?></option>
                            <option value="dashed" <?php selected($wp_gallery_configs['border_style'], 'dashed'); ?>><?php esc_html_e('Dashed', 'wpmf'); ?></option>
                            <option value="double" <?php selected($wp_gallery_configs['border_style'], 'double'); ?>><?php esc_html_e('Double', 'wpmf'); ?></option>
                            <option value="groove" <?php selected($wp_gallery_configs['border_style'], 'groove'); ?>><?php esc_html_e('Groove', 'wpmf'); ?></option>
                            <option value="ridge" <?php selected($wp_gallery_configs['border_style'], 'ridge'); ?>><?php esc_html_e('Ridge', 'wpmf'); ?></option>
                            <option value="inset" <?php selected($wp_gallery_configs['border_style'], 'inset'); ?>><?php esc_html_e('Inset', 'wpmf'); ?></option>
                            <option value="outset" <?php selected($wp_gallery_configs['border_style'], 'outset'); ?>><?php esc_html_e('Outset', 'wpmf'); ?></option>
                        </select>
                    </label>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Border radius', 'wpmf'); ?>
                    </label>

                    <label>
                        <input type="number" min="0" max="20" step="1" name="wpmf_gallery_shortcode_cf[img_border_radius]" class="wp_gallery_shortcode_field" data-param="img_border_radius" value="<?php echo esc_attr($wp_gallery_configs['img_border_radius']) ?>">
                    </label>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Border width', 'wpmf'); ?>
                    </label>

                    <label>
                        <input type="number" min="0" max="10" step="1" name="wpmf_gallery_shortcode_cf[border_width]" class="wp_gallery_shortcode_field" data-param="border_width" value="<?php echo esc_attr($wp_gallery_configs['border_width']) ?>">
                    </label>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Border color', 'wpmf'); ?>
                    </label>

                    <label>
                        <input name="wpmf_gallery_shortcode_cf[border_color]" type="text"
                               value="<?php echo esc_attr($wp_gallery_configs['border_color']) ?>"
                               class="inputbox input-block-level wp-color-field-hv wp-color-picker wp_gallery_shortcode_field" data-param="border_color">
                    </label>
                </div>
            </div>

            <!-- Shadow settings -->
            <div class="wpmf_width_100">
                <?php
                $img_shadow = $wp_gallery_configs['img_shadow'];
                $shadows = explode(' ', $img_shadow);
                ?>
                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Shadow H offset', 'wpmf'); ?>
                    </label>

                    <label>
                        <input type="number" min="-50" max="50" class="wp_gallery_shadow_field wp_gallery_shadow_h_field" value="<?php echo esc_attr(str_replace('px', '', $shadows[0])) ?>">
                    </label>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Shadow V offset', 'wpmf'); ?>
                    </label>

                    <label>
                        <input type="number" min="-50" max="50" class="wp_gallery_shadow_field wp_gallery_shadow_v_field" value="<?php echo esc_attr(str_replace('px', '', $shadows[1])) ?>">
                    </label>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Shadow blur', 'wpmf'); ?>
                    </label>

                    <label>
                        <input type="number" min="0" max="50" class="wp_gallery_shadow_field wp_gallery_shadow_blur_field" value="<?php echo esc_attr(str_replace('px', '', $shadows[2])) ?>">
                    </label>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Shadow spread', 'wpmf'); ?>
                    </label>

                    <label>
                        <input type="number" min="0" max="50" class="wp_gallery_shadow_field wp_gallery_shadow_spread_field" value="<?php echo esc_attr(str_replace('px', '', $shadows[3])) ?>">
                    </label>
                </div>

                <div class="ju-settings-option wpmf-no-shadow">
                    <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                        <?php esc_html_e('Shadow Color', 'wpmf'); ?>
                    </label>

                    <label>
                        <input type="text"
                               value="<?php echo esc_attr($shadows[4]) ?>"
                               class="inputbox input-block-level wp-color-field-hv wp-color-picker wp_gallery_shadow_field wp_gallery_shadow_color_field">
                    </label>
                </div>
                <input type="hidden" class="wp_gallery_shortcode_field" name="wpmf_gallery_shortcode_cf[img_shadow]" data-param="img_shadow" value="<?php echo esc_attr($img_shadow) ?>">
            </div>

            <!-- Automatic animation -->
            <div class="wpmf_width_100">
                <label class="ju-setting-label setting wpmf-no-padding text wpmf-bold wpmf_left">
                    <?php esc_html_e('Autoplay', 'wpmf'); ?>
                </label>

                <label class="wpmf_left">
                    <input type="hidden" data-param="autoplay"
                           name="wpmf_gallery_shortcode_cf[autoplay]"
                           value="0">
                    <span class="ju-switch-button">
                        <label class="switch">
                            <?php if (isset($wp_gallery_configs['autoplay']) && (int) $wp_gallery_configs['autoplay'] === 1) : ?>
                                <input type="checkbox" class="wp_gallery_shortcode_field" data-param="autoplay"
                                       name="wpmf_gallery_shortcode_cf[autoplay]"
                                       value="1" checked>
                            <?php else : ?>
                                <input type="checkbox" class="wp_gallery_shortcode_field" data-param="autoplay"
                                       name="wpmf_gallery_shortcode_cf[autoplay]"
                                       value="1">
                            <?php endif; ?>

                            <span class="slider round"></span>
                        </label>
                    </span>
                </label>
            </div>

            <div class="wpmf_width_100">
                <label class="ju-setting-label setting wpmf-no-padding text wpmf-bold wpmf_left">
                    <?php esc_html_e('Include images in subfolder', 'wpmf'); ?>
                </label>

                <label class="wpmf_left">
                    <input type="hidden" data-param="include_children"
                           name="wpmf_gallery_shortcode_cf[include_children]"
                           value="0">
                    <span class="ju-switch-button">
                        <label class="switch">
                            <?php if (isset($wp_gallery_configs['include_children']) && (int) $wp_gallery_configs['include_children'] === 1) : ?>
                                <input type="checkbox" class="wp_gallery_shortcode_field" data-param="include_children"
                                       name="wpmf_gallery_shortcode_cf[include_children]"
                                       value="1" checked>
                            <?php else : ?>
                                <input type="checkbox" class="wp_gallery_shortcode_field" data-param="include_children"
                                       name="wpmf_gallery_shortcode_cf[include_children]"
                                       value="1">
                            <?php endif; ?>

                            <span class="slider round"></span>
                        </label>
                    </span>
                </label>
            </div>

            <div class="wpmf_width_100 m-t-30">
                <div class="wpmf_row_full" style="margin: 0 0 10px 0; position: relative;">
                    <label class="wpmf_left text label_text" style="position: absolute; left: 0; bottom: 0;">
                        <?php esc_html_e('Shortcode', 'wpmf') ?>
                    </label>
                    <div class="wpmf_copy_shortcode" data-input="wp_gallery_shortcode_input" style="margin: 0">
                        <i data-alt="<?php esc_html_e('Copy shortcode', 'wpmf'); ?>"
                           class="material-icons copy_wp_gallery_icon wpmfqtip">content_copy</i>
                        <label><?php esc_html_e('COPY', 'wpmf'); ?></label>
                    </div>
                </div>
                <input title type="text" name="wpmf_gallery_shortcode_cf[value]"
                       class="wp_gallery_shortcode_input regular-text"
                       value="<?php echo esc_attr(stripslashes($wp_gallery_configs['value'])) ?>">
            </div>
        </div>
    </div>
</div>