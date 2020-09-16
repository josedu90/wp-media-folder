<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
use Joomunited\WPMediaFolder\WpmfHelper;

/**
 * Class WpmfReplaceFile
 * This class that holds most of the replace file functionality for Media Folder.
 */
class WpmfReplaceFile
{

    /**
     * WpmfReplaceFile constructor.
     */
    public function __construct()
    {
        add_action('wp_enqueue_media', array($this, 'enqueueAdminScripts'));
        add_action('wp_ajax_wpmf_replace_file', array($this, 'replaceFile'));
    }

    /**
     * Ajax replace attachment
     *
     * @return void
     */
    public function replaceFile()
    {
        if (empty($_POST['wpmf_nonce'])
            || !wp_verify_nonce($_POST['wpmf_nonce'], 'wpmf_nonce')) {
            die();
        }

        /**
         * Filter check capability of current user to replace a file
         *
         * @param boolean The current user has the given capability
         * @param string  Action name
         *
         * @return boolean
         *
         * @ignore Hook already documented
         */
        $wpmf_capability = apply_filters('wpmf_user_can', current_user_can('edit_posts'), 'replace_file');
        if (!$wpmf_capability) {
            wp_send_json(false);
        }
        if (!empty($_FILES['wpmf_replace_file'])) {
            if (empty($_POST['post_selected'])) {
                esc_html_e('Post empty', 'wpmf');
                die();
            }

            $id       = $_POST['post_selected'];
            $metadata = wp_get_attachment_metadata($id);

            $filepath          = get_attached_file($id);
            $infopath          = pathinfo($filepath);
            $allowedImageTypes = array('gif', 'jpg', 'png', 'bmp', 'pdf');
            $new_filetype      = wp_check_filetype($_FILES['wpmf_replace_file']['name']);
            if ($new_filetype['ext'] === 'jpeg') {
                $new_filetype['ext'] = 'jpg';
            }

            if ($infopath['extension'] === 'jpeg') {
                $infopath['extension'] = 'jpg';
            }
            if ($new_filetype['ext'] !== $infopath['extension']) {
                wp_send_json(
                    array(
                        'status' => false,
                        'msg'    => __('To replace a media and keep the link to this media working,
it must be in the same format, ie. jpg > jpg… Thanks!', 'wpmf')
                    )
                );
            }

            if ($_FILES['wpmf_replace_file']['error'] > 0) {
                wp_send_json(
                    array(
                        'status' => false,
                        'msg'    => $_FILES['wpmf_replace_file']['error']
                    )
                );
            } else {
                $uploadpath = wp_upload_dir();
                if (!file_exists($filepath)) {
                    wp_send_json(
                        array(
                            'status' => false,
                            'msg'    => __('This file not exists!', 'wpmf')
                        )
                    );
                }

                unlink($filepath);
                if (in_array($infopath['extension'], $allowedImageTypes)) {
                    if (isset($metadata['sizes']) && is_array($metadata['sizes'])) {
                        foreach ($metadata['sizes'] as $size => $sizeinfo) {
                            $intermediate_file = str_replace(basename($filepath), $sizeinfo['file'], $filepath);
                            // This filter is documented in wp-includes/functions.php
                            $intermediate_file = apply_filters('wp_delete_file', $intermediate_file);
                            $link = path_join(
                                $uploadpath['basedir'],
                                $intermediate_file
                            );
                            if (file_exists($link) && is_writable($link)) {
                                unlink($link);
                            }
                        }
                    }
                }

                move_uploaded_file(
                    $_FILES['wpmf_replace_file']['tmp_name'],
                    $infopath['dirname'] . '/' . $infopath['basename']
                );
                update_post_meta($id, 'wpmf_size', filesize($infopath['dirname'] . '/' . $infopath['basename']));

                if ($infopath['extension'] === 'pdf') {
                    WpmfHelper::createPdfThumbnail($filepath);
                }

                if (in_array($infopath['extension'], $allowedImageTypes)) {
                    if ($infopath['extension'] !== 'pdf') {
                        $actual_sizes_array = getimagesize($filepath);
                        $metadata['width']  = $actual_sizes_array[0];
                        $metadata['height'] = $actual_sizes_array[1];
                        WpmfHelper::createThumbs($filepath, $infopath['extension'], $metadata, $id);
                    }
                }
                if (isset($_FILES['wpmf_replace_file']['size'])) {
                    $size = $_FILES['wpmf_replace_file']['size'];
                    update_post_meta($id, 'wpmf_size', $size);
                    if ($size >= 1024 && $size < 1024 * 1024) {
                        $size = ceil($size / 1024) . ' KB';
                    } elseif ($size >= 1024 * 1024) {
                        $size = ceil($size / (1024 * 1024)) . ' MB';
                    } elseif ($size < 1024) {
                        $size = $size . ' B';
                    }
                } else {
                    $size = '0 B';
                }

                // apply watermark after replace
                $origin_infos = pathinfo($filepath);
                $origin_name = $origin_infos['filename'] . 'imageswatermark.' . $origin_infos['extension'];
                $path_origin = str_replace(wp_basename($filepath), $origin_name, $filepath);
                if (file_exists($path_origin)) {
                    $paths = array(
                        'origin' => $path_origin
                    );

                    if (isset($metadata['sizes'])) {
                        foreach ($metadata['sizes'] as $size => $file) {
                            $infos = pathinfo($file['file']);
                            $filewater = $infos['filename'] . 'imageswatermark.' . $infos['extension'];
                            $paths[$size] = str_replace(wp_basename($filepath), $filewater, $filepath);
                        }
                    }

                    foreach ($paths as $path) {
                        if (!realpath($path)) {
                            continue;
                        }

                        if (file_exists($path) && is_writable($path)) {
                            unlink($path);
                        }
                    }

                    global $wpmfwatermark;
                    $wpmfwatermark->createWatermarkImage($metadata, $id);
                }
                // end apply watermark after replace
                if (in_array($infopath['extension'], $allowedImageTypes) && $infopath['extension'] !== 'pdf') {
                    $metadata   = wp_get_attachment_metadata($id);
                    $dimensions = $metadata['width'] . ' x ' . $metadata['height'];
                    wp_send_json(array('status' => true, 'size' => $size, 'dimensions' => $dimensions));
                } else {
                    wp_send_json(array('status' => true, 'size' => $size));
                }
            }
        } else {
            wp_send_json(array('status' => false, 'msg' => __('File not exist', 'wpmf')));
        }
    }

    /**
     * Includes styles and some scripts
     *
     * @return void
     */
    public function enqueueAdminScripts()
    {
        /**
         * Filter check capability of current user to load assets
         *
         * @param boolean The current user has the given capability
         * @param string  Action name
         *
         * @return boolean
         *
         * @ignore Hook already documented
         */
        $wpmf_capability = apply_filters('wpmf_user_can', current_user_can('edit_posts'), 'load_script_style');
        if ($wpmf_capability) {
            wp_enqueue_script(
                'wpmf-jquery-form',
                plugins_url('assets/js/jquery.form.js', dirname(__FILE__)),
                array('jquery'),
                WPMF_VERSION
            );

            wp_enqueue_script(
                'replace-image',
                plugins_url('assets/js/replace-image.js', dirname(__FILE__)),
                array('jquery'),
                WPMF_VERSION
            );

            wp_enqueue_style(
                'replace-style',
                plugins_url('assets/css/style_replace_image.css', dirname(__FILE__)),
                array(),
                WPMF_VERSION
            );
        }
    }
}
