<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
$tabs_data = array(
    array(
        'id'       => 'general',
        'title'    => __('General', 'wpmf'),
        'icon'     => 'home',
        'sub_tabs' => array(
            'additional_features' => __('Main settings', 'wpmf'),
            'media_filtering'     => __('Media filtering', 'wpmf')
        )
    ),
    array(
        'id'       => 'wordpress_gallery',
        'title'    => __('Wordpress Gallery', 'wpmf'),
        'icon'     => 'image',
        'sub_tabs' => array(
            'gallery_features' => __('Gallery features', 'wpmf'),
            'default_settings' => __('Default settings', 'wpmf'),
            'wp_gallery_shortcode' => __('Shortcode', 'wpmf')
        )
    ),
    array(
        'id'       => 'gallery_addon',
        'title'    => __('Galleries Addon', 'wpmf'),
        'icon'     => 'add_photo_alternate',
        'sub_tabs' => array(
            'galleryadd_default_settings' => __('Default settings', 'wpmf'),
            'gallery_shortcode_generator' => __('Shortcode generator', 'wpmf'),
            'gallery_social_sharing'      => __('Social sharing', 'wpmf')
        )
    ),
    array(
        'id'       => 'media_access',
        'title'    => __('Access & design', 'wpmf'),
        'icon'     => 'format_color_fill',
        'sub_tabs' => array(
            'user_media_access' => __('Media access', 'wpmf'),
            'file_design'       => __('File Design', 'wpmf')
        )
    ),
    array(
        'id'       => 'files_folders',
        'title'    => __('Rename & Watermark', 'wpmf'),
        'icon'     => 'picture_in_picture_alt',
        'sub_tabs' => array(
            'rename_on_upload' => __('Rename on upload', 'wpmf'),
            'watermark'        => __('Watermark', 'wpmf'),
        )
    ),
    array(
        'id'       => 'import_export',
        'title'    => __('Import/Export', 'wpmf'),
        'icon'     => 'import_export'
    ),
    array(
        'id'       => 'server_sync',
        'title'    => __('Server Folder Sync', 'wpmf'),
        'icon'     => 'import_export',
        'sub_tabs' => array(
            'server_folder_sync'   => __('Folder Sync', 'wpmf'),
            'server_sync_settings'   => __('Filters', 'wpmf')
        )
    ),
    array(
        'id'       => 'regenerate_thumbnails',
        'title'    => __('Regenerate Thumb', 'wpmf'),
        'icon'     => 'update',
        'sub_tabs' => array()
    ),
    array(
        'id'       => 'image_compression',
        'title'    => __('Image compression', 'wpmf'),
        'icon'     => 'compare',
        'sub_tabs' => array()
    )
);

if (!is_plugin_active('wp-media-folder-gallery-addon/wp-media-folder-gallery-addon.php')) {
    unset($tabs_data[2]);
}

if (is_plugin_active('wp-media-folder-addon/wp-media-folder-addon.php')) {
    $tabs_data[] = array(
        'id'       => 'cloud',
        'title'    => __('Cloud', 'wpmf'),
        'icon'     => 'cloud_queue',
        'sub_tabs' => array(
            'google_drive_box' => __('Google Drive', 'wpmf'),
            'google_photo'     => __('Google Photo', 'wpmf'),
            'dropbox_box'      => __('Dropbox', 'wpmf'),
            'one_drive_box'    => __('OneDrive', 'wpmf'),
            'aws3'    => __('Amazon S3', 'wpmf'),
            'synchronization' => __('Synchronization', 'wpmf')
        )
    );
}
$tabs_data[] = array(
    'id'       => 'jutranslation',
    'title'    => __('Translation', 'wpmf'),
    'icon'     => 'format_color_text',
    'sub_tabs' => array()
);

$tabs_data[] = array(
    'id' => 'system_check',
    'title' => __('System Check', 'wpmf'),
    'content' => 'system-check',
    'icon' => 'verified_user',
    'sub_tabs' => array()
);

$dropbox_config = get_option('_wpmfAddon_dropbox_config');
$google_config = get_option('_wpmfAddon_cloud_config');
$onedrive_config = get_option('_wpmfAddon_onedrive_config');
$onedrive_business_config = get_option('_wpmfAddon_onedrive_business_config');

?>
<div class="ju-main-wrapper">
    <div class="ju-left-panel-toggle">
        <i class="dashicons dashicons-leftright ju-left-panel-toggle-icon"></i>
    </div>
    <div class="ju-left-panel">
        <div class="ju-logo">
            <a href="https://www.joomunited.com/" target="_blank">
                <img src="<?php echo esc_url(WPMF_PLUGIN_URL . 'assets/wordpress-css-framework/images/logo-joomUnited-white.png') ?>"
                     alt="<?php esc_html_e('JoomUnited logo', 'wpmf') ?>">
            </a>
        </div>
        <div class="ju-menu-search">
            <i class="material-icons ju-menu-search-icon">
                search
            </i>

            <input type="text" class="ju-menu-search-input"
                   placeholder="<?php esc_html_e('Search settings', 'wpmf') ?>"
            >
        </div>
        <ul class="tabs ju-menu-tabs">
            <?php foreach ($tabs_data as $ju_tab) : ?>
                <li class="tab" data-tab-title="<?php echo esc_attr($ju_tab['title']) ?>">
                    <a href="#<?php echo esc_attr($ju_tab['id']) ?>"
                       class="link-tab white-text <?php echo (empty($ju_tab['sub_tabs'])) ? 'no-submenus' : 'with-submenus' ?>"
                    >
                        <i class="material-icons menu-tab-icon"><?php echo esc_html($ju_tab['icon']) ?></i>
                        <span class="tab-title" title="<?php echo esc_attr($ju_tab['title']) ?>"><?php echo esc_html($ju_tab['title']) ?></span>

                        <?php
                        if ($ju_tab['id'] === 'system_check') {
                            if (version_compare(PHP_VERSION, '7.2.0', '<') || !in_array('curl', get_loaded_extensions()) || !function_exists('gd_info')) {
                                echo '<i class="material-icons system-checkbox material-icons-menu-alert" style="float: right;vertical-align: text-bottom;">info</i>';
                            }
                        }
                        ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <div class="ju-right-panel">
        <div id="profiles-container">
            <?php
            if (!empty($dropbox_config['dropboxToken']) && !empty($dropbox_config['first_connected'])) {
                echo '<input type="hidden" class="cloud_first_connect" value="1">';
            }

            if (!get_option('wpmf_cloud_connection_notice', false)) :
                if (!empty($dropbox_config['dropboxToken'])
                    || (!empty($google_config['connected']) && !empty($google_config['googleBaseFolder']))
                    || (!empty($onedrive_config['connected']) && !empty($onedrive_config['onedriveBaseFolder']['id']))
                    || (!empty($onedrive_business_config['connected']) && !empty($onedrive_business_config['onedriveBaseFolder']['id']))) :
                    ?>
                    <div class="error wpmf_cloud_connection_notice" id="wpmf_error">
                        <p><?php esc_html_e('WP Media Folder plugin has updated its cloud connection system, it\'s now fully integrated in the media library. It requires to make a synchronization', 'wpmf') ?>
                            <button class="button button-primary btn-run-sync-cloud" style="margin: 0 5px;">
                                <?php esc_html_e('RUN NOW', 'wpmf') ?><span class="spinner spinner-cloud-sync"
                                                                                 style="display:none; visibility:visible"></span>
                            </button>
                        </p>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
            <form enctype="multipart/form-data" name="form1" action="" method="post">
                <input type="hidden" name="wpmf_nonce"
                       value="<?php echo esc_html(wp_create_nonce('wpmf_nonce')) ?>">
                <?php foreach ($tabs_data as $ju_tab) : ?>
                    <div class="ju-content-wrapper" id="<?php echo esc_attr($ju_tab['id']) ?>" style="display: none">
                        <?php
                        if (!empty($ju_tab['sub_tabs'])) :
                            ?>
                            <div class="ju-top-tabs-wrapper">
                                <ul class="tabs ju-top-tabs">
                                    <?php
                                    foreach ($ju_tab['sub_tabs'] as $tab_id => $tab_label) :
                                        ?>

                                        <li class="tab">
                                            <a href="#<?php echo esc_html($tab_id) ?>"
                                               class="link-tab waves-effect waves-light">
                                                <?php echo esc_html($tab_label) ?>
                                            </a>
                                        </li>

                                        <?php
                                    endforeach;
                                    ?>
                                </ul>
                            </div>
                            <?php
                        endif;
                        ?>
                        <?php if ($ju_tab['id'] !== 'image_compression' && $ju_tab['id'] !== 'cloud' && $ju_tab['id'] !== 'import_export' && $ju_tab['id'] !== 'server_sync') : ?>
                            <div class="wpmf_width_100 top_bar">
                                <h1><?php echo esc_html($ju_tab['title']) ?></h1>
                                <?php
                                require WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/settings/submit_button.php';
                                ?>
                            </div>
                        <?php endif; ?>

                        <?php
                        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- View request, no action
                        if (isset($_POST['btn_wpmf_save']) && $ju_tab['id'] !== 'cloud') {
                            ?>
                            <div class="wpmf_width_100 top_bar saved_infos">
                                <?php
                                require WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/settings/saved_info.php';
                                ?>
                            </div>
                            <?php
                        }
                        ?>

                        <?php include_once(WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/settings/' . $ju_tab['id'] . '.php'); ?>
                        <?php
                        require WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/settings/submit_button.php';
                        ?>
                    </div>
                <?php endforeach; ?>
                <input type="hidden" class="setting_tab_value" name="setting_tab_value" value="wpmf-general">
            </form>
        </div>
    </div>
</div>

<script>
    (function ($) {
        $(function () {
            jQuery('.wp-color-field-bg').wpColorPicker({width: 180, defaultColor: '#444444'});
            jQuery('.wp-color-field-hv').wpColorPicker({width: 180, defaultColor: '#888888'});
            jQuery('.wp-color-field-font').wpColorPicker({width: 180, defaultColor: '#ffffff'});
            jQuery('.wp-color-field-hvfont').wpColorPicker({width: 180, defaultColor: '#ffffff'});
        });
    })(jQuery);
</script>