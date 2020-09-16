<?php
/*
  Plugin Name: WP Media folder
  Plugin URI: http://www.joomunited.com
  Description: WP media Folder is a WordPress plugin that enhance the WordPress media manager by adding a folder manager inside.
  Author: Joomunited
  Version: 5.1.4
  Author URI: http://www.joomunited.com
  Text Domain: wpmf
  Domain Path: /languages
  Licence : GNU General Public License version 2 or later; http://www.gnu.org/licenses/gpl-2.0.html
  Copyright : Copyright (C) 2014 JoomUnited (http://www.joomunited.com). All rights reserved.
 */
// Prohibit direct script loading
defined('ABSPATH') || die('No direct script access allowed!');

//Check plugin requirements
if (version_compare(PHP_VERSION, '5.6', '<')) {
    if (!function_exists('wpmfDisablePlugin')) {
        /**
         * Deactivate plugin
         *
         * @return void
         */
        function wpmfDisablePlugin()
        {
            /**
             * Filter check user capability to do an action
             *
             * @param boolean The current user has the given capability
             * @param string  Action name
             *
             * @return boolean
             */
            $wpmf_capability = apply_filters('wpmf_user_can', current_user_can('activate_plugins'), 'activate_plugins');
            if ($wpmf_capability && is_plugin_active(plugin_basename(__FILE__))) {
                deactivate_plugins(__FILE__);
                unset($_GET['activate']);
            }
        }
    }

    if (!function_exists('wpmfShowError')) {
        /**
         * Show notice
         *
         * @return void
         */
        function wpmfShowError()
        {
            echo '<div class="error"><p>';
            echo '<strong>WP Media Folder</strong>';
            echo ' need at least PHP 5.6 version, please update php before installing the plugin.</p></div>';
        }
    }

    //Add actions
    add_action('admin_init', 'wpmfDisablePlugin');
    add_action('admin_notices', 'wpmfShowError');

    //Do not load anything more
    return;
}

//Include the jutranslation helpers
include_once('jutranslation' . DIRECTORY_SEPARATOR . 'jutranslation.php');
call_user_func(
    '\Joomunited\WPMediaFolder\Jutranslation\Jutranslation::init',
    __FILE__,
    'wpmf',
    'WP Media Folder',
    'wpmf',
    'languages' . DIRECTORY_SEPARATOR . 'wpmf-en_US.mo'
);

if (!class_exists('\Joomunited\WPMF\JUCheckRequirements')) {
    require_once(trailingslashit(dirname(__FILE__)) . 'requirements.php');
}

if (class_exists('\Joomunited\WPMF\JUCheckRequirements')) {
    // Plugins name for translate
    $args = array(
        'plugin_name' => esc_html__('WP Media Folder', 'wpmf'),
        'plugin_path' => wpmfGetPath(),
        'plugin_textdomain' => 'wpmf',
        'requirements' => array(
            'php_version' => '5.6',
            'php_modules' => array(
                'curl' => 'warning'
            ),
            'functions' => array(
                'gd_info' => 'warning'
            ),
            // Minimum addons version
            'addons_version' => array(
                'wpmfAddons' => '2.1.7',
                'wpmfGalleryAddons' => '2.0.5'
            )
        ),
    );
    $wpmfCheck = call_user_func('\Joomunited\WPMF\JUCheckRequirements::init', $args);

    if (!$wpmfCheck['success']) {
        // Do not load anything more
        unset($_GET['activate']);
        return;
    }

    if (isset($wpmfCheck) && !empty($wpmfCheck['load'])) {
        foreach ($wpmfCheck['load'] as $addonName) {
            if (function_exists($addonName . 'Init')) {
                call_user_func($addonName . 'Init');
            }
        }
    }
}

if (!defined('WP_MEDIA_FOLDER_PLUGIN_DIR')) {
    define('WP_MEDIA_FOLDER_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

if (!defined('WPMF_FILE')) {
    define('WPMF_FILE', __FILE__);
}

if (!defined('WPMF_TAXO')) {
    define('WPMF_TAXO', 'wpmf-category');
}

define('_WPMF_GALLERY_PREFIX', '_wpmf_gallery_');
define('WPMF_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WPMF_DOMAIN', 'wpmf');
define('WPMF_VERSION', '5.1.4');

include_once(ABSPATH . 'wp-admin/includes/plugin.php');

/**
 * Get plugin path
 *
 * @return string
 */
function wpmfGetPath()
{
    if (!function_exists('plugin_basename')) {
        include_once(ABSPATH . 'wp-admin/includes/plugin.php');
    }

    return plugin_basename(__FILE__);
}

/**
 * Load term
 *
 * @param string $taxonomy Taxonomy name
 *
 * @return array|object|null
 */
function wpmfLoadTerms($taxonomy)
{
    global $wpdb;
    $results = $wpdb->get_results($wpdb->prepare('SELECT DISTINCT t.term_id FROM '.$wpdb->terms.' t INNER JOIN '.$wpdb->term_taxonomy.' tax ON tax.term_id = t.term_id WHERE tax.taxonomy = %s', array($taxonomy)), ARRAY_A);
    return $results;
}

register_uninstall_hook(__FILE__, 'wpmfUnInstall');
/**
 * UnInstall plugin
 *
 * @return void
 */
function wpmfUnInstall()
{
    $delete_all_datas = wpmfGetOption('delete_all_datas');
    if (!empty($delete_all_datas)) {
        // delete folder
        $folders = wpmfLoadTerms('wpmf-category');
        foreach ($folders as $folder) {
            wp_delete_term((int) $folder['term_id'], 'wpmf-category');
        }

        $folders = wpmfLoadTerms('wpmf-gallery-category');
        foreach ($folders as $folder) {
            wp_delete_term((int) $folder['term_id'], 'wpmf-gallery-category');
        }

        // delete cloud media
        global $wpdb;
        $limit = 100;
        $total         = $wpdb->get_var($wpdb->prepare('SELECT COUNT(posts.ID) as total FROM ' . $wpdb->prefix . 'posts as posts
               WHERE   posts.post_type = %s', array('attachment')));

        $j = ceil((int) $total / $limit);
        for ($i = 1; $i <= $j; $i ++) {
            $offset      = ($i - 1) * $limit;
            $args = array(
                'post_type' => 'attachment',
                'posts_per_page' => $limit,
                'offset' => $offset,
                'post_status' => 'any'
            );

            $files = get_posts($args);
            foreach ($files as $file) {
                $wpmf_drive_id = get_post_meta($file->ID, 'wpmf_drive_type', true);
                if (!empty($wpmf_drive_id)) {
                    wp_delete_attachment($file->ID);
                } else {
                    delete_post_meta($file->ID, 'wpmf_size');
                    delete_post_meta($file->ID, 'wpmf_filetype');
                    delete_post_meta($file->ID, 'wpmf_order');
                    delete_post_meta($file->ID, 'wpmf_awsS3_info');
                }
            }
        }

        // delete table
        global $wpdb;
        $wpdb->query('DROP TABLE IF EXISTS ' . $wpdb->prefix . 'wpmf_s3_queue');

        // delete option
        $options_list = array(
            'wpmf_addon_version',
            'wpmf_folder_root_id',
            'wpmf_update_count',
            'wpmf_version',
            'wpmf_gallery_image_size_value',
            'wpmf_padding_masonry',
            'wpmf_padding_portfolio',
            'wpmf_usegellery',
            'wpmf_useorder',
            'wpmf_create_folder',
            'wpmf_option_override',
            'wpmf_option_duplicate',
            'wpmf_active_media',
            'wpmf_folder_option2',
            'wpmf_usegellery_lightbox',
            'wpmf_media_rename',
            'wpmf_patern_rename',
            'wpmf_rename_number',
            'wpmf_option_media_remove',
            'wpmf_default_dimension',
            'wpmf_selected_dimension',
            'wpmf_weight_default',
            'wpmf_weight_selected',
            'wpmf_color_singlefile',
            'wpmf_option_singlefile',
            'wpmf_option_sync_media',
            'wpmf_option_sync_media_external',
            'wpmf_list_sync_media',
            'wpmf_time_sync',
            'wpmf_lastRun_sync',
            'wpmf_slider_animation',
            'wpmf_option_mediafolder',
            'wpmf_option_countfiles',
            'wpmf_option_lightboximage',
            'wpmf_option_hoverimg',
            'wpmf_options_format_title',
            'wpmf_image_watermark_apply',
            'wpmf_option_image_watermark',
            'wpmf_watermark_position',
            'wpmf_watermark_image',
            'wpmf_watermark_image_id',
            'wpmf_gallery_settings',
            '_wpmf_import_order_notice_flag',
            '_wpmfAddon_cloud_config',
            '_wpmfAddon_dropbox_config',
            'wpmf_onedrive_business',
            '_wpmfAddon_aws3_config',
            'wpmf_gallery_img_per_page',
            'wpmfgrl_relationships_media',
            'wpmfgrl_relationships',
            'wpmf_galleries',
            'wpmf_field_bgfolder',
            'wpmf_import_nextgen_gallery',
            'wpmf_onedrive_business_files',
            'wpmf_odv_business_files',
            'wpmf_odv_allfiles',
            'wpmf_google_folders',
            'wpmf_google_allfiles',
            'wpmf_dropbox_allfiles',
            'wpmf_dropbox_folders',
            'wpmf_odv_folders',
            'wpmf_odv_business_folders',
            'wpmf_odv_business_allfiles',
            '_wpmfAddon_onedrive_business_config',
            'wpmf_onedrive_notice',
            '_wpmfAddon_onedrive_config',
            'wpmf_google_folder_id',
            'wpmf_dropbox_folder_id',
            'wpmf_odv_business_folder_id',
            'wpmf_odv_folder_id',
            'wpmf_cloud_connection_notice',
            'wp-media-folder-addon-tables',
            '_wpmf_activation_redirect',
            'wpmf_use_taxonomy',
            'wpmf_cloud_time_last_sync',
            'wpmf_dropbox_attachments',
            'wpmf_dropbox_folders',
            'wpmf_dropbox_allfiles',
            'wpmf_google_attachments',
            'wpmf_google_folders',
            'wpmf_google_allfiles',
            'wpmf_odv_attachments',
            'wpmf_odv_folders',
            'wpmf_odv_allfiles',
            'wpmf_odv_business_attachments',
            'wpmf_odv_business_folders',
            'wpmf_odv_business_allfiles',
            'wpmf_cloud_name_syncing',
            'wpmf_ftp_sync_time',
            'wpmf_ftp_sync_token',
            'wpmf_settings'
        );

        foreach ($options_list as $option) {
            delete_option($option);
        }
    }
}

register_activation_hook(__FILE__, 'wpmfInstall');
/**
 * Install plugin
 *
 * @return void
 */
function wpmfInstall()
{
    set_time_limit(0);
    global $wpdb;
    $limit         = 100;
    $values        = array();
    $place_holders = array();
    $total         = $wpdb->get_var($wpdb->prepare('SELECT COUNT(posts.ID) as total FROM ' . $wpdb->prefix . 'posts as posts
               WHERE   posts.post_type = %s', array('attachment')));

    if ($total <= 5000) {
        $j = ceil((int) $total / $limit);
        for ($i = 1; $i <= $j; $i ++) {
            $offset      = ($i - 1) * $limit;
            $attachments = $wpdb->get_results($wpdb->prepare('SELECT ID FROM ' . $wpdb->prefix . 'posts as posts
               WHERE   posts.post_type     = %s LIMIT %d OFFSET %d', array('attachment', $limit, $offset)));
            foreach ($attachments as $attachment) {
                $wpmf_size_filetype = wpmfGetSizeFiletype($attachment->ID);
                $size               = $wpmf_size_filetype['size'];
                $ext                = $wpmf_size_filetype['ext'];
                if (!get_post_meta($attachment->ID, 'wpmf_size')) {
                    array_push($values, $attachment->ID, 'wpmf_size', $size);
                    $place_holders[] = "('%d', '%s', '%s')";
                }

                if (!get_post_meta($attachment->ID, 'wpmf_filetype')) {
                    array_push($values, $attachment->ID, 'wpmf_filetype', $ext);
                    $place_holders[] = "('%d', '%s', '%s')";
                }

                if (!get_post_meta($attachment->ID, 'wpmf_order')) {
                    array_push($values, $attachment->ID, 'wpmf_order', 0);
                    $place_holders[] = "('%d', '%s', '%d')";
                }
            }

            if (count($place_holders) > 0) {
                $query = 'INSERT INTO ' . $wpdb->prefix . 'postmeta (post_id, meta_key, meta_value) VALUES ';
                $query .= implode(', ', $place_holders);
                $wpdb->query($wpdb->prepare($query, $values)); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Insert multiple row, can't write sql in prepare
                $place_holders = array();
                $values        = array();
            }
        }
    }
}

/**
 * Get size and file type for attachment
 *
 * @param integer $pid ID of attachment
 *
 * @return array
 */
function wpmfGetSizeFiletype($pid)
{
    $wpmf_size_filetype = array();
    $meta               = get_post_meta($pid, '_wp_attached_file');
    $upload_dir         = wp_upload_dir();
    $url_attachment     = $upload_dir['basedir'] . '/' . $meta[0];
    if (file_exists($url_attachment)) {
        $size     = filesize($url_attachment);
        $filetype = wp_check_filetype($url_attachment);
        $ext      = $filetype['ext'];
    } else {
        $size = 0;
        $ext  = '';
    }
    $wpmf_size_filetype['size'] = $size;
    $wpmf_size_filetype['ext']  = $ext;

    return $wpmf_size_filetype;
}

/**
 * Set a option
 *
 * @param string            $option_name Option name
 * @param string|array|void $value       Value of option
 *
 * @return void
 */
function wpmfSetOption($option_name, $value)
{
    $settings = get_option('wpmf_settings');
    if (empty($settings)) {
        $settings               = array();
        $settings[$option_name] = $value;
    } else {
        $settings[$option_name] = $value;
    }

    update_option('wpmf_settings', $settings);
}

/**
 * Get a option
 *
 * @param string $option_name Option name
 *
 * @return mixed
 */
function wpmfGetOption($option_name)
{
    $params_theme     = array(
        'default_theme'     => array(
            'columns'    => 3,
            'size'       => 'medium',
            'targetsize' => 'large',
            'link'       => 'file',
            'orderby'    => 'post__in',
            'order'      => 'ASC'
        ),
        'portfolio_theme'   => array(
            'columns'    => 3,
            'size'       => 'medium',
            'targetsize' => 'large',
            'link'       => 'file',
            'orderby'    => 'post__in',
            'order'      => 'ASC'
        ),
        'masonry_theme'     => array(
            'columns'    => 3,
            'size'       => 'medium',
            'targetsize' => 'large',
            'link'       => 'file',
            'orderby'    => 'post__in',
            'order'      => 'ASC'
        ),
        'slider_theme'      => array(
            'columns'        => 3,
            'size'           => 'medium',
            'targetsize'     => 'large',
            'link'           => 'file',
            'orderby'        => 'post__in',
            'order'          => 'ASC',
            'animation'      => 'slide',
            'duration'       => 4000,
            'auto_animation' => 1
        ),
        'flowslide_theme'   => array(
            'columns'      => 3,
            'size'         => 'medium',
            'targetsize'   => 'large',
            'link'         => 'file',
            'orderby'      => 'post__in',
            'order'        => 'ASC',
            'show_buttons' => 1
        ),
        'square_grid_theme' => array(
            'columns'    => 3,
            'size'       => 'medium',
            'targetsize' => 'large',
            'link'       => 'file',
            'orderby'    => 'post__in',
            'order'      => 'ASC'
        ),
        'material_theme'    => array(
            'columns'    => 3,
            'size'       => 'medium',
            'targetsize' => 'large',
            'link'       => 'file',
            'orderby'    => 'post__in',
            'order'      => 'ASC'
        ),
    );
    $gallery_settings = array(
        'theme' => $params_theme
    );

    $gallery_shortcode_settings = array(
        'choose_gallery_id'       => 0,
        'choose_gallery_theme'    => 'default',
        'display_tree'            => 0,
        'display_tag'             => 0,
        'theme'                   => $params_theme,
        'gallery_shortcode_input' => ''
    );

    $default_settings = array(
        'delete_all_datas' => 0,
        'all_media_in_user_root' => 0,
        'folder_design'           => 'material_design',
        'load_gif'                => 1,
        'hide_tree'               => 1,
        'caption_lightbox_gallery' => 0,
        'hide_remote_video'       => 1,
        'folder_color'            => array(),
        'watermark_image_scaling' => 100,
        'social_sharing'          => 0,
        'search_file_include_childrent' => 0,
        'social_sharing_link'     => array(
            'facebook'  => '',
            'twitter'   => '',
            'google'    => '',
            'instagram' => '',
            'pinterest' => ''
        ),
        'watermark_margin'        => array(
            'top'    => 0,
            'right'  => 0,
            'bottom' => 0,
            'left'   => 0
        ),
        'format_mediatitle'       => 1,
        'gallery_settings'        => $gallery_settings,
        'gallery_shortcode'       => $gallery_shortcode_settings,
        'gallery_shortcode_cf' => array(
            'wpmf_folder_id' => 0,
            'display' => 'default',
            'columns' => 3,
            'size' => 'medium',
            'targetsize' => 'large',
            'link' => 'file',
            'wpmf_orderby' => 'post__in',
            'wpmf_order' => 'ASC',
            'autoplay' => 1,
            'include_children' => 0,
            'gutterwidth' => 10,
            'img_border_radius' => 0,
            'border_style' => 'none',
            'border_width' => 0,
            'border_color' => 'transparent',
            'img_shadow' => '0 0 0 0 transparent',
            'value' => ''
        ),
        'watermark_exclude_folders' => array(),
        'sync_method' => 'ajax',
        'sync_periodicity' => '300',
        'show_folder_id' => 0,
        'watermark_opacity' => 100,
        'watermark_margin_unit' => 'px',
        'allow_sync_extensions' => 'jpg,jpeg,jpe,gif,png,svg,bmp,tiff,tif,ico,7z,bz2,gz,rar,tgz,zip,csv,doc,docx,ods,odt,pdf,pps,ppt,pptx,ppsx,rtf,txt,xls,xlsx,psd,tif,tiff,mid,mp3,mp4,ogg,wma,3gp,avi,flv,m4v,mkv,mov,mpeg,mpg,swf,vob,wmv',
        'allow_syncs3_extensions' => 'jpg,jpeg,jpe,gif,png,svg,bmp,tiff,tif,ico,7z,bz2,gz,rar,tgz,zip,csv,doc,docx,ods,odt,pdf,pps,ppt,pptx,ppsx,rtf,txt,xls,xlsx,psd,tif,tiff,mid,mp3,mp4,ogg,wma,3gp,avi,flv,m4v,mkv,mov,mpeg,mpg,swf,vob,wmv',
        'import_iptc_meta' => 0,
        'iptc_fields' => array(
            'title' => 1,
            'alt' => 1,
            'description' => 0,
            'caption' => 0,
            'credit' => 0,
            '2#005'=> 0,
            '2#010'=> 0,
            '2#015'=> 0,
            '2#020'=> 0,
            '2#040'=> 0,
            '2#055'=> 0,
            '2#080'=> 0,
            '2#085'=> 0,
            '2#090'=> 0,
            '2#095'=> 0,
            '2#100'=> 0,
            '2#101'=> 0,
            '2#103'=> 0,
            '2#105'=> 1,
            '2#110'=> 0,
            '2#115'=> 0,
            '2#116'=> 0
        ),
        'export_folder_type' => 'only_folder',
        'wpmf_export_folders' => array()
    );
    $settings         = get_option('wpmf_settings');
    if (isset($settings) && isset($settings[$option_name])) {
        if (is_array($settings[$option_name]) && !empty($default_settings[$option_name])) {
            return array_merge($default_settings[$option_name], $settings[$option_name]);
        } else {
            return $settings[$option_name];
        }
    }

    return $default_settings[$option_name];
}

$frontend = get_option('wpmf_option_mediafolder');
if (!empty($frontend) || is_admin()) {
    global $wpmfwatermark;
    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-helper.php');
    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-main.php');
    $GLOBALS['wp_media_folder'] = new WpMediaFolder;
    $useorder                   = get_option('wpmf_useorder');
    // todo : should this really be always loaded on each wp request?
    // todo : should we not loaded
    if (isset($useorder) && (int) $useorder === 1) {
        require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-orderby-media.php');
        new WpmfOrderbyMedia;
        require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-filter-size.php');
        new WpmfFilterSize;
    }

    $option_duplicate = get_option('wpmf_option_duplicate');
    if (isset($option_duplicate) && (int) $option_duplicate === 1) {
        require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-duplicate-file.php');
        new WpmfDuplicateFile;
    }

    $wpmf_media_rename = get_option('wpmf_media_rename');
    if (isset($wpmf_media_rename) && (int) $wpmf_media_rename === 1) {
        require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-media-rename.php');
        new WpmfMediaRename;
    }

    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-background-folder.php');
    new WpmfBackgroundFolder;

    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-image-watermark.php');
    $wpmfwatermark = new WpmfWatermark();

    $option_override = get_option('wpmf_option_override');
    if (isset($option_override) && (int) $option_override === 1) {
        require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-replace-file.php');
        new WpmfReplaceFile;
    }
}

$usegellery = get_option('wpmf_usegellery');
if (isset($usegellery) && (int) $usegellery === 1) {
    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-display-gallery.php');
    new WpmfDisplayGallery;
}

if (is_admin()) {
    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-wp-folder-option.php');
    new WpmfMediaFolderOption;
}

$wpmf_option_singlefile = get_option('wpmf_option_singlefile');
if (isset($wpmf_option_singlefile) && (int) $wpmf_option_singlefile === 1) {
    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-single-file.php');
    new WpmfSingleFile();
}

$wpmf_option_lightboximage = get_option('wpmf_option_lightboximage');
if (isset($wpmf_option_lightboximage) && (int) $wpmf_option_lightboximage === 1) {
    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-single-lightbox.php');
    new WpmfSingleLightbox;
}

require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-pdf-embed.php');
new WpmfPdfEmbed();

//  load gif file on page load or not
$load_gif = wpmfGetOption('load_gif');
if (isset($load_gif) && (int) $load_gif === 0) {
    require_once(WP_MEDIA_FOLDER_PLUGIN_DIR . 'class/class-load-gif.php');
    new WpmfLoadGif();
}

/**
 * Get cloud folder ID
 *
 * @param string $folder_id Folder ID
 *
 * @return boolean|mixed
 */
function wpmfGetCloudFolderID($folder_id)
{
    $cloud_id = get_term_meta($folder_id, 'wpmf_drive_root_id', true);
    if (empty($cloud_id)) {
        $cloud_id = get_term_meta($folder_id, 'wpmf_drive_id', true);
    }

    if (empty($cloud_id)) {
        return false;
    } else {
        return $cloud_id;
    }
}

/**
 * Get cloud folder type
 *
 * @param string $folder_id Folder ID
 *
 * @return boolean|mixed
 */
function wpmfGetCloudFolderType($folder_id)
{
    $type = get_term_meta($folder_id, 'wpmf_drive_root_type', true);
    if (empty($type)) {
        $type = get_term_meta($folder_id, 'wpmf_drive_type', true);
    }

    if (empty($type)) {
        return 'local';
    } else {
        return $type;
    }
}

/**
 * Get cloud file ID
 *
 * @param string $file_id File ID
 *
 * @return boolean|mixed
 */
function wpmfGetCloudFileID($file_id)
{
    $cloud_id = get_post_meta($file_id, 'wpmf_drive_id', true);
    if (empty($cloud_id)) {
        return false;
    } else {
        return $cloud_id;
    }
}

/**
 * Get cloud file type
 *
 * @param string $file_id File ID
 *
 * @return boolean|mixed
 */
function wpmfGetCloudFileType($file_id)
{
    $type = get_post_meta($file_id, 'wpmf_drive_type', true);
    if (empty($type)) {
        return 'local';
    } else {
        return $type;
    }
}

/**
 * Get IPTC header default
 *
 * @return array
 */
function getIptcHeader()
{
    $iptcHeaderArray = array
    (
        '2#005'=>'DocumentTitle',
        '2#010'=>'Urgency',
        '2#015'=>'Category',
        '2#020'=>'Subcategories',
        '2#040'=>'SpecialInstructions',
        '2#055'=>'CreationDate',
        '2#080'=>'AuthorByline',
        '2#085'=>'AuthorTitle',
        '2#090'=>'City',
        '2#095'=>'State',
        '2#100'=>'Location',
        '2#101'=>'Country',
        '2#103'=>'OTR',
        '2#105'=>'Headline',
        '2#110'=>'Credit',
        '2#115'=>'PhotoSource',
        '2#116'=>'Copyright'
    );

    return $iptcHeaderArray;
}

add_action('admin_enqueue_scripts', 'wpmfAddStyle');
add_action('wp_enqueue_media', 'wpmfAddStyle');
/**
 * Add style and script
 *
 * @return void
 */
function wpmfAddStyle()
{
    wp_enqueue_style(
        'wpmf-material-design-iconic-font.min',
        plugins_url('/assets/css/material-design-iconic-font.min.css', __FILE__),
        array(),
        WPMF_VERSION
    );

    wp_enqueue_script(
        'wpmf-link-dialog',
        plugins_url('/assets/js/open_link_dialog.js', __FILE__),
        array('jquery'),
        WPMF_VERSION
    );
}

add_action('init', 'wpmfRegisterTaxonomyForImages', 0);
/**
 * Register 'wpmf-category' taxonomy
 *
 * @return void
 */
function wpmfRegisterTaxonomyForImages()
{
    register_taxonomy(
        WPMF_TAXO,
        'attachment',
        array(
            'hierarchical'          => true,
            'show_in_nav_menus'     => false,
            'show_ui'               => false,
            'public'                => false,
            'update_count_callback' => '_update_generic_term_count',
            'labels'                => array(
                'name'              => __('WPMF Categories', 'wpmf'),
                'singular_name'     => __('WPMF Category', 'wpmf'),
                'menu_name'         => __('WPMF Categories', 'wpmf'),
                'all_items'         => __('All WPMF Categories', 'wpmf'),
                'edit_item'         => __('Edit WPMF Category', 'wpmf'),
                'view_item'         => __('View WPMF Category', 'wpmf'),
                'update_item'       => __('Update WPMF Category', 'wpmf'),
                'add_new_item'      => __('Add New WPMF Category', 'wpmf'),
                'new_item_name'     => __('New WPMF Category Name', 'wpmf'),
                'parent_item'       => __('Parent WPMF Category', 'wpmf'),
                'parent_item_colon' => __('Parent WPMF Category:', 'wpmf'),
                'search_items'      => __('Search WPMF Categories', 'wpmf'),
            )
        )
    );

    $root_id = get_option('wpmf_folder_root_id', false);
    if (!$root_id) {
        $tag = get_term_by('name', 'WP Media Folder Root', WPMF_TAXO);
        if (empty($tag)) {
            $inserted = wp_insert_term('WP Media Folder Root', WPMF_TAXO, array('parent' => 0));
            if (!get_option('wpmf_folder_root_id', false)) {
                add_option('wpmf_folder_root_id', $inserted['term_id'], '', 'yes');
            }
        } else {
            if (!get_option('wpmf_folder_root_id', false)) {
                add_option('wpmf_folder_root_id', $tag->term_id, '', 'yes');
            }
        }
    } else {
        $root = get_term_by('id', (int) $root_id, WPMF_TAXO);
        if (!$root) {
            $inserted = wp_insert_term('WP Media Folder Root', WPMF_TAXO, array('parent' => 0));
            if (!is_wp_error($inserted)) {
                update_option('wpmf_folder_root_id', (int) $inserted['term_id']);
            } else {
                if (is_numeric($inserted->error_data['term_exists'])) {
                    update_option('wpmf_folder_root_id', $inserted->error_data['term_exists']);
                }
            }
        }
    }
}

add_filter('wp_get_attachment_url', 'wpmfGetAttachmentImportUrl', 99, 2);
add_filter('wp_prepare_attachment_for_js', 'wpmfGetAttachmentImportData', 10, 3);
/**
 * Filters the attachment URL.
 *
 * @param string  $url           URL for the given attachment.
 * @param integer $attachment_id Attachment post ID.
 *
 * @return mixed
 */
function wpmfGetAttachmentImportUrl($url, $attachment_id)
{
    $path = get_post_meta($attachment_id, 'wpmf_import_path', true);
    if (!empty($path) && file_exists($path)) {
        $url = str_replace(ABSPATH, site_url('/'), $path);
    }

    return $url;
}

/**
 * Filters the attachment data prepared for JavaScript.
 *
 * @param array       $response   Array of prepared attachment data.
 * @param WP_Post     $attachment Attachment object.
 * @param array|false $meta       Array of attachment meta data, or false if there is none.
 *
 * @return mixed
 */
function wpmfGetAttachmentImportData($response, $attachment, $meta)
{
    $path = get_post_meta($attachment->ID, 'wpmf_import_path', true);
    if (!empty($path) && file_exists($path)) {
        $url = str_replace(ABSPATH, site_url('/'), $path);
        $response['url'] = $url;
    }

    return $response;
}

if (is_admin()) {
    //config section
    if (!defined('JU_BASE')) {
        define('JU_BASE', 'https://www.joomunited.com/');
    }

    $remote_updateinfo = JU_BASE . 'juupdater_files/wp-media-folder.json';
    //end config
    require 'juupdater/juupdater.php';
    $UpdateChecker = Jufactory::buildUpdateChecker(
        $remote_updateinfo,
        __FILE__
    );
}
