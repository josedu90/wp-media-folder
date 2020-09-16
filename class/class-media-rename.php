<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');

/**
 * Class WpmfMediaRename
 * This class that holds most of the rename file functionality for Media Folder.
 */
class WpmfMediaRename
{
    /**
     * WpmfMediaRename constructor.
     */
    public function __construct()
    {
        add_filter('wp_handle_upload_prefilter', array($this, 'customUploadFilter'));
        add_filter('wp_generate_attachment_metadata', array($this, 'afterUpload'), 10, 2);
    }

    /**
     * Rename attachment after upload
     *
     * @param array $file An array of data for a single file.
     *
     * @return array $file
     */
    public function customUploadFilter($file)
    {
        global $pagenow;
        if (isset($pagenow) && $pagenow === 'update.php') {
            return $file;
        }

        $pattern            = get_option('wpmf_patern_rename');
        $upload_dir         = wp_upload_dir();
        $info               = pathinfo($file['name']);
        $parent = 0;
        if (!empty($_POST['wpmf_folder'])) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- No action, nonce is not required
            $parent = (int) $_POST['wpmf_folder'];
            $current_folder = get_term((int) $parent, WPMF_TAXO);
            $foldername     = $current_folder->name;
        } else {
            $foldername = 'uncategorized';
        }

        $sitename          = get_bloginfo('name');
        $original_filename = $info['filename'];
        $date              = trim($upload_dir['subdir'], '/');
        if ($date === '') {
            $date = date('Ym', time());
        }

        $ext               = empty($info['extension']) ? '' : '.' . $info['extension'];
        $format_date  = date('Y-m-d H-i-s', time());
        $pattern           = str_replace('{sitename}', $sitename, $pattern);
        $pattern           = str_replace('{date}', $date, $pattern);
        $pattern  = str_replace('{original name}', $original_filename, $pattern);
        $pattern           = str_replace('{timestamp}', $format_date, $pattern);

        if (strpos($pattern, '#') !== false) {
            $number = 0;
            if (strpos($pattern, '{foldername}') !== false) {
                $pattern  = str_replace('{foldername}', $foldername, $pattern);
                $number_list = get_option('wpmf_rename_number_list');
                if (isset($number_list[$parent])) {
                    $number = $number_list[$parent];
                }
                if (!$number) {
                    $number = 0;
                }
                $number++;
            } else {
                $number = get_option('wpmf_rename_number');
                if (!$number) {
                    $number = 0;
                }
                $number++;
            }

            if (strlen($number) === 1) {
                $number = '0' . $number;
            }

            $pattern  = str_replace('#', $number . $ext, $pattern);
            $filename = $pattern;
        } else {
            $pattern  = str_replace('{foldername}', $foldername, $pattern);
            $filename = wp_unique_filename($upload_dir['path'], $pattern . $ext);
        }

        $file['name'] = $filename;
        return $file;
    }

    /**
     * Update option wpmf_rename_number
     * Base on /wp-admin/includes/image.php
     *
     * @param array   $metadata      An array of attachment meta data.
     * @param integer $attachment_id Current attachment ID.
     *
     * @return mixed $metadata
     */
    public function afterUpload($metadata, $attachment_id)
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- No action, nonce is not required
        if (isset($_POST['wpmf_folder'])) {
            // phpcs:ignore WordPress.Security.NonceVerification.Missing -- No action, nonce is not required
            $parent = (int) $_POST['wpmf_folder'];
        } else {
            $parent = 0;
        }

        $pattern            = get_option('wpmf_patern_rename');
        if (strpos($pattern, '#') !== false && strpos($pattern, '{foldername}') !== false) {
            $number_list = get_option('wpmf_rename_number_list', false);
            if (!empty($number_list) && is_array($number_list)) {
                if (isset($number_list[$parent])) {
                    $number_list[$parent] =  (int) $number_list[$parent] + 1;
                } else {
                    $number_list[$parent] = 1;
                }
            } else {
                $number_list = array();
                $number_list[$parent] = 1;
            }
            update_option('wpmf_rename_number_list', $number_list);
        } else {
            $number = get_option('wpmf_rename_number');
            if (!$number) {
                $number = 0;
            }
            $number++;
            update_option('wpmf_rename_number', (int) $number);
        }

        return $metadata;
    }
}
