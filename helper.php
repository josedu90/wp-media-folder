<?php
/**
 * WP Media Folder
 *
 * @package WP Media Folder
 * @author  Joomunited
 * @version 1.0
 */
namespace Joomunited\WPMediaFolder;

defined('ABSPATH') || die('No direct script access allowed!');

/**
 * Class WPMFHelper
 */
class Helper
{
    /**
     * Retrieve attachments list from folder
     *
     * @param integer|string|array $value            Taxonomy term(s)
     * @param string               $field            Select taxonomy term by. Possible values are ‘term_id’, ‘name’, ‘slug’ or ‘term_taxonomy_id’. Default value is ‘term_id’.
     * @param boolean              $include_children Whether or not to include children, false to include only files in the folder, true to get files also in the subfolser. Defaults to true.
     *
     * @return WP_Query
     */
    public static function getAttachmentsByFolder($value, $field = 'term_id', $include_children = true)
    {
        $args = array(
            'posts_per_page' => -1,
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'tax_query' => array(
                array(
                    'taxonomy' => 'wpmf-category',
                    'field' => $field,
                    'terms' => $value,
                    'include_children' => $include_children
                )
            )
        );
        $query = new WP_Query($args);
        return $query;
    }

    /**
     * Get folders of file
     *
     * @param integer $file_id ID of file
     *
     * @return array|WP_Error The requested term data or empty array if no terms found.
     *                        WP_Error if any of the taxonomies don't exist.
     */
    public static function getFoldersOfFile($file_id)
    {
        $terms = wp_get_object_terms($file_id, 'wpmf-category');
        return $terms;
    }

    /**
     * Retrieve list of folder objects.
     *
     * @return array
     */
    public static function getAllFolders()
    {
        $folders = get_categories(
            array(
                'hide_empty' => false,
                'taxonomy' => 'wpmf-category',
                'pll_get_terms_not_translated' => 1
            )
        );

        return $folders;
    }

    /**
     * Create a folder
     *
     * @param string  $name   Name of folder
     * @param integer $parent Parent of folder
     *
     * @return array|boolean|\WP_Error
     */
    public static function createFolder($name, $parent = 0)
    {
        $inserted = wp_insert_term($name, 'wpmf-category', array('parent' => $parent));
        if (is_wp_error($inserted)) {
            return false;
        }

        return $inserted;
    }

    /**
     * Remove a folder by ID
     *
     * @param integer $folder_id ID of folder
     *
     * @return boolean|integer|WP_Error True on success, false if term does not exist. Zero on attempted
     *                           deletion of default Category. WP_Error if the taxonomy does not exist.
     */
    public static function removeFolder($folder_id)
    {
        $delete = wp_delete_term($folder_id, 'wpmf-category');
        return $delete;
    }

    /**
     * Move a folder
     *
     * @param integer $folder_id        The ID of the folder
     * @param integer $target_folder_id The ID of the target folder
     *
     * @return array|WP_Error Returns Term ID and Taxonomy Term ID
     */
    public static function moveFolder($folder_id, $target_folder_id)
    {
        $folder = wp_update_term((int) $folder_id, 'wpmf-category', array('parent' => (int) $target_folder_id));
        return $folder;
    }

    /**
     * Rename a folder
     *
     * @param integer $folder_id The ID of the folder
     * @param string  $new_name  New name of folder
     *
     * @return array|WP_Error Returns Term ID and Taxonomy Term ID
     */
    public static function renameFolder($folder_id, $new_name)
    {
        $folder = wp_update_term((int) $folder_id, 'wpmf-category', array('name' => $new_name));
        return $folder;
    }

    /**
     * Move a file to a folder
     *
     * @param integer $file_id       The ID of the file
     * @param integer $folder_id     The ID of the target folder
     * @param boolean $append        If false will delete difference of folders. Default false.
     * @param boolean $move_multiple If true, all translate attachment move too. Default true.
     *
     * @return void
     */
    public static function moveFile($file_id, $folder_id, $append = false, $move_multiple = true)
    {
        wp_set_object_terms((int) $file_id, (int) $folder_id, 'wpmf-category', $append);
        if ($move_multiple) {
            if (is_plugin_active('polylang/polylang.php')) {
                global $polylang;
                $polylang_current = $polylang->curlang;
                foreach ($polylang->model->get_languages_list() as $language) {
                    if ((int) $language->term_id === (int) $polylang_current->term_id) {
                        continue;
                    }
                    $translation_id = $polylang->model->post->get_translation($file_id, $language);
                    if (($translation_id) && (int) $translation_id !== (int) $file_id) {
                        wp_set_object_terms(
                            (int) $translation_id,
                            (int) $folder_id,
                            'wpmf-category',
                            $append
                        );

                        // reset order of file
                        update_post_meta(
                            (int) $translation_id,
                            'wpmf_order',
                            0
                        );
                    }
                }
            } elseif (defined('ICL_SITEPRESS_VERSION') && ICL_SITEPRESS_VERSION) {
                global $sitepress;
                $trid = $sitepress->get_element_trid($file_id, 'post_attachment');
                if ($trid) {
                    $translations = $sitepress->get_element_translations($trid, 'post_attachment', true, true, true);
                    foreach ($translations as $translation) {
                        if ((int) $translation->element_id !== (int) $file_id) {
                            wp_set_object_terms(
                                (int) $translation->element_id,
                                (int) $folder_id,
                                'wpmf-category',
                                $append
                            );

                            // reset order of file
                            update_post_meta(
                                (int) $translation->element_id,
                                'wpmf_order',
                                0
                            );
                        }
                    }
                }
            }
        }
    }
}
