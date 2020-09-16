<?php
namespace Joomunited\WPMediaFolder;

/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
/**
 * Class WpmfHelper
 * This class that holds most of the main functionality for Media Folder.
 */
class WpmfHelper
{
    /**
     * Create Pdf Thumbnail
     *
     * @param string $filepath File path
     *
     * @return void
     */
    public static function createPdfThumbnail($filepath)
    {
        $metadata       = array();
        $fallback_sizes = array(
            'thumbnail',
            'medium',
            'large',
        );

        /**
         * Filters the image sizes generated for non-image mime types.
         *
         * @param array $fallback_sizes An array of image size names.
         * @param array $metadata       Current attachment metadata.
         */
        $fallback_sizes = apply_filters('fallback_intermediate_image_sizes', $fallback_sizes, $metadata);

        $sizes                      = array();
        $_wp_additional_image_sizes = wp_get_additional_image_sizes();

        foreach ($fallback_sizes as $s) {
            if (isset($_wp_additional_image_sizes[$s]['width'])) {
                $sizes[$s]['width'] = intval($_wp_additional_image_sizes[$s]['width']);
            } else {
                $sizes[$s]['width'] = get_option($s . '_size_w');
            }

            if (isset($_wp_additional_image_sizes[$s]['height'])) {
                $sizes[$s]['height'] = intval($_wp_additional_image_sizes[$s]['height']);
            } else {
                $sizes[$s]['height'] = get_option($s . '_size_h');
            }

            if (isset($_wp_additional_image_sizes[$s]['crop'])) {
                $sizes[$s]['crop'] = $_wp_additional_image_sizes[$s]['crop'];
            } else {
                // Force thumbnails to be soft crops.
                if ('thumbnail' !== $s) {
                    $sizes[$s]['crop'] = get_option($s . '_crop');
                }
            }
        }

        // Only load PDFs in an image editor if we're processing sizes.
        if (!empty($sizes)) {
            $editor = wp_get_image_editor($filepath);

            if (!is_wp_error($editor)) { // No support for this type of file
                /*
                 * PDFs may have the same file filename as JPEGs.
                 * Ensure the PDF preview image does not overwrite any JPEG images that already exist.
                 */
                $dirname      = dirname($filepath) . '/';
                $ext          = '.' . pathinfo($filepath, PATHINFO_EXTENSION);
                $preview_file = $dirname . wp_unique_filename($dirname, wp_basename($filepath, $ext) . '-pdf.jpg');

                $uploaded = $editor->save($preview_file, 'image/jpeg');
                unset($editor);

                // Resize based on the full size image, rather than the source.
                if (!is_wp_error($uploaded)) {
                    $editor = wp_get_image_editor($uploaded['path']);
                    unset($uploaded['path']);

                    if (!is_wp_error($editor)) {
                        $metadata['sizes']         = $editor->multi_resize($sizes);
                        $metadata['sizes']['full'] = $uploaded;
                    }
                }
            }
        }
    }

    /**
     * Create thumbnail after replace
     *
     * @param string  $filepath Physical path of file
     * @param string  $extimage Extension of file
     * @param array   $metadata Meta data of file
     * @param integer $post_id  ID of file
     *
     * @return void
     */
    public static function createThumbs($filepath, $extimage, $metadata, $post_id)
    {
        if (isset($metadata['sizes']) && is_array($metadata['sizes'])) {
            $uploadpath = wp_upload_dir();
            foreach ($metadata['sizes'] as $size => $sizeinfo) {
                $intermediate_file = str_replace(basename($filepath), $sizeinfo['file'], $filepath);

                // load image and get image size
                list($width, $height) = getimagesize($filepath);
                $new_width = $sizeinfo['width'];
                $new_height = floor($height * ($sizeinfo['width'] / $width));
                $tmp_img = imagecreatetruecolor($new_width, $new_height);

                imagealphablending($tmp_img, false);
                imagesavealpha($tmp_img, true);

                switch ($extimage) {
                    case 'jpeg':
                    case 'jpg':
                        $source = imagecreatefromjpeg($filepath);
                        break;

                    case 'png':
                        $source = imagecreatefrompng($filepath);
                        break;

                    case 'gif':
                        $source = imagecreatefromgif($filepath);
                        break;

                    case 'bmp':
                        $source = imagecreatefromwbmp($filepath);
                        break;
                    default:
                        $source = imagecreatefromjpeg($filepath);
                }

                imagealphablending($source, true);
                imagecopyresampled($tmp_img, $source, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
                switch ($extimage) {
                    case 'jpeg':
                    case 'jpg':
                        imagejpeg($tmp_img, path_join($uploadpath['basedir'], $intermediate_file), 100);
                        break;

                    case 'png':
                        imagepng($tmp_img, path_join($uploadpath['basedir'], $intermediate_file), 9);
                        break;

                    case 'gif':
                        imagegif($tmp_img, path_join($uploadpath['basedir'], $intermediate_file));
                        break;

                    case 'bmp':
                        imagewbmp($tmp_img, path_join($uploadpath['basedir'], $intermediate_file));
                        break;
                }

                $metadata[$size]['width'] = $new_width;
                $metadata[$size]['width'] = $new_height;
                wp_update_attachment_metadata($post_id, $metadata);
            }
        } else {
            wp_update_attachment_metadata($post_id, $metadata);
        }
    }

    /**
     * Save pptc metadata
     *
     * @param integer $enable       Enable or disable option
     * @param integer $image_id     ID of image
     * @param string  $path         Path of image
     * @param array   $allow_fields Include fields
     * @param string  $title        Title of image
     * @param string  $mime_type    Mime type
     *
     * @return void
     */
    public static function saveIptcMetadata($enable, $image_id, $path, $allow_fields, $title, $mime_type)
    {
        $iptcMeta = array();
        // update alt
        if ((int) $enable === 1 && strpos($mime_type, 'image') !== false && $title !== '' && !empty($allow_fields['alt'])) {
            update_post_meta($image_id, '_wp_attachment_image_alt', $title);
        }

        if ((int)$enable === 1 && strpos($mime_type, 'image') !== false) {
            $size = getimagesize($path, $info);
            if (!empty($allow_fields['2#105']) && $title !== '') {
                $iptcMeta['2#105'] = array($title);
            }

            if (isset($info['APP13'])) {
                $iptc = iptcparse($info['APP13']);
                if (!empty($iptc)) {
                    foreach ($iptc as $code => $iptcValue) {
                        if (!empty($allow_fields[$code])) {
                            $iptcMeta[$code] = $iptcValue;
                        }
                    }

                    update_post_meta($image_id, 'wpmf_iptc', $iptcMeta);
                }
            }
        }
    }
}
