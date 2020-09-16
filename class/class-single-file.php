<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');

/**
 * Class WpmfSingleFile
 * This class that holds most of the single file functionality for Media Folder.
 */
class WpmfSingleFile
{

    /**
     * Single_File constructor.
     */
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'singleFileStyleAdmin'));
        add_filter('media_send_to_editor', array($this, 'addImageFiles'), 10, 3);
        add_action('wp_enqueue_scripts', array($this, 'loadCustomWpAdminScript'));
        add_action('admin_enqueue_scripts', array($this, 'loadCustomWpAdminScript'));
        add_filter('mce_external_plugins', array($this, 'register'));
        add_action('enqueue_block_editor_assets', array($this, 'addEditorAssets'));
    }

    /**
     * Enqueue styles and scripts for gutenberg
     *
     * @return void
     */
    public function addEditorAssets()
    {
        wp_enqueue_script(
            'wpmf_filedesign_blocks',
            WPMF_PLUGIN_URL . 'assets/js/blocks/file_design/block.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-data', 'wp-editor'),
            WPMF_VERSION
        );

        $params = array(
            'l18n' => array(),
            'vars' => array(
                'block_cover' => WPMF_PLUGIN_URL .'assets/js/blocks/file_design/preview.png'
            )
        );

        wp_localize_script('wpmf_filedesign_blocks', 'wpmf_filedesign_blocks', $params);
    }


    /**
     * Includes script to editor
     *
     * @param array $plugin_array List editor plugin
     *
     * @return mixed
     */
    public function register($plugin_array)
    {
        $url                      = WPMF_PLUGIN_URL . '/assets/js/single-file.js';
        $plugin_array['wpmf_mce'] = $url;
        return $plugin_array;
    }

    /**
     * Includes styles to editor
     *
     * @return void
     */
    public function singleFileStyleAdmin()
    {
        $upload_dir = wp_upload_dir();
        if (file_exists($upload_dir['basedir'] . '/wpmf/css/wpmf_single_file.css')) {
            add_editor_style($upload_dir['baseurl'] . '/wpmf/css/wpmf_single_file.css');
        }
    }

    /**
     * Includes styles
     *
     * @return void
     */
    public function loadCustomWpAdminScript()
    {
        $upload_dir = wp_upload_dir();
        if (file_exists($upload_dir['basedir'] . '/wpmf/css/wpmf_single_file.css')) {
            wp_enqueue_style(
                'wpmf-single-file',
                $upload_dir['baseurl'] . '/wpmf/css/wpmf_single_file.css',
                array(),
                WPMF_VERSION
            );
        }
    }

    /**
     * Add single file to editor
     *
     * @param string  $html       HTML markup for a media item sent to the editor.
     * @param integer $id         The first key from the $_POST['send'] data.
     * @param array   $attachment Array of attachment metadata.
     *
     * @return string $html
     */
    public function addImageFiles($html, $id, $attachment)
    {
        $post           = get_post($id);
        $mimetype       = explode('/', $post->post_mime_type);
        $target         = get_post_meta($id, '_gallery_link_target', true);
        $fileUrl  = wp_get_attachment_url($id);
        $filePath = get_attached_file($id);
        $meta = wp_get_attachment_metadata($id);
        if (isset($meta['filesize'])) {
            $size = $meta['filesize'];
        } elseif (file_exists($filePath)) {
            $size = filesize($filePath);
        } else {
            $size = 0;
        }

        if ($size < 1024 * 1024) {
            $size = round($size / 1024, 1) . ' kB';
        } elseif ($size > 1024 * 1024) {
            $size = round($size / (1024 * 1024), 1) . ' MB';
        }

        if ($mimetype[0] === 'application' && $mimetype[1] !== 'pdf') {
            $type = wp_check_filetype($fileUrl);
            $ext  = $type['ext'];
            $html = '<span class="wpmf_mce-wrap" data-file="' . $id . '" style="overflow: hidden;">';
            $html .= '<a class="wpmf-defile wpmf_mce-single-child"
             href="' . $fileUrl . '" data-id="' . $id . '" target="' . $target . '">';
            $html .= '<span class="wpmf_mce-single-child" style="font-weight: bold;">';
            $html .= $post->post_title;
            $html .= '</span><br>';
            $html .= '<span class="wpmf_mce-single-child" style="font-weight: normal;font-size: 0.8em;">';
            $html .= '<b class="wpmf_mce-single-child">Size : </b>' . $size;
            $html .= '<b class="wpmf_mce-single-child"> Format : </b>' . strtoupper($ext);
            $html .= '</span>';
            $html .= '</a>';
            $html .= '</span>';
        }
        return $html;
    }
}
