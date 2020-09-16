<?php
/**
 * WordPress Export Administration API
 *
 * @package    WordPress
 * @subpackage Administration
 */

/**
 * Wrap given string in XML CDATA tag.
 *
 * @param string $str String to wrap in XML CDATA tag.
 *
 * @return string
 */
function wxr_cdata($str)
{
    if (!seems_utf8($str)) {
        $str = utf8_encode($str);
    }
    // $str = ent2ncr(esc_html($str));
    $str = '<![CDATA[' . str_replace(']]>', ']]]]><![CDATA[>', $str) . ']]>';

    return $str;
}

/**
 * Return the URL of the site
 *
 * @since 2.5.0
 *
 * @return string Site URL.
 */
function wxr_site_url()
{
    // Multisite: the base URL.
    if (is_multisite()) {
        return network_home_url();
    } else {
        return get_bloginfo_rss('url');
    }
}

/**
 * Output a cat_name XML tag from a given category object
 *
 * @param object $category Category Object
 *
 * @return void
 */
function wxr_cat_name($category)
{
    if (empty($category->name)) {
        return;
    }

    echo '<wp:cat_name>' . wxr_cdata($category->name) . "</wp:cat_name>\n";
}

/**
 * Output a category_description XML tag from a given category object
 *
 * @param object $category Category Object
 *
 * @return void
 */
function wxr_category_description($category)
{
    if (empty($category->description)) {
        return;
    }

    echo '<wp:category_description>' . wxr_cdata($category->description) . "</wp:category_description>\n";
}

/**
 * Output a tag_name XML tag from a given tag object
 *
 * @param object $tag Tag Object
 *
 * @return void
 */
function wxr_tag_name($tag)
{
    if (empty($tag->name)) {
        return;
    }

    echo '<wp:tag_name>' . wxr_cdata($tag->name) . "</wp:tag_name>\n";
}

/**
 * Output a tag_description XML tag from a given tag object
 *
 * @param object $tag Tag Object
 *
 * @return void
 */
function wxr_tag_description($tag)
{
    if (empty($tag->description)) {
        return;
    }

    echo '<wp:tag_description>' . wxr_cdata($tag->description) . "</wp:tag_description>\n";
}

/**
 * Output a term_name XML tag from a given term object
 *
 * @param object $term Term Object
 *
 * @return void
 */
function wxr_term_name($term)
{
    if (empty($term->name)) {
        return;
    }

    echo '<wp:term_name>' . wxr_cdata($term->name) . "</wp:term_name>\n";
}

/**
 * Output a term_description XML tag from a given term object
 *
 * @param object $term Term Object
 *
 * @return void
 */
function wxr_term_description($term)
{
    if (empty($term->description)) {
        return;
    }

    echo "\t\t<wp:term_description>" . wxr_cdata($term->description) . "</wp:term_description>\n";
}

/**
 * Output term meta XML tags for a given term object.
 *
 * @param WP_Term $term Term object.
 *
 * @return void
 */
function wxr_term_meta($term)
{
    global $wpdb;

    $termmeta = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . $wpdb->termmeta . ' WHERE term_id = %d', $term->term_id));

    foreach ($termmeta as $meta) {
        /**
         * Filters whether to selectively skip term meta used for WXR exports.
         *
         * Returning a truthy value to the filter will skip the current meta
         * object from being exported.
         *
         * @param boolean $skip     Whether to skip the current piece of term meta. Default false.
         * @param string  $meta_key Current meta key.
         * @param object  $meta     Current meta object.
         */
        if (!apply_filters('wxr_export_skip_termmeta', false, $meta->meta_key, $meta)) {
            printf("\t\t<wp:termmeta>\n\t\t\t<wp:meta_key>%s</wp:meta_key>\n\t\t\t<wp:meta_value>%s</wp:meta_value>\n\t\t</wp:termmeta>\n", wxr_cdata($meta->meta_key), wxr_cdata($meta->meta_value));
        }
    }
}

/**
 * Output list of authors with posts
 *
 * @param array $post_ids Array of post IDs to filter the query by. Optional.
 *
 * @return void
 */
function wxr_authors_list(array $post_ids = null)
{
    global $wpdb;

    if (!empty($post_ids)) {
        $post_ids = array_map('absint', $post_ids);
        $and      = 'AND ID IN ( ' . implode(', ', $post_ids) . ')';
    } else {
        $and = '';
    }

    $authors = array();
    $results = $wpdb->get_results('SELECT DISTINCT post_author FROM ' . $wpdb->posts . ' WHERE post_status != "auto-draft" ' . $and);
    foreach ((array) $results as $result) {
        $authors[] = get_userdata($result->post_author);
    }

    $authors = array_filter($authors);

    foreach ($authors as $author) {
        echo "\t<wp:author>";
        echo '<wp:author_id>' . intval($author->ID) . '</wp:author_id>';
        echo '<wp:author_login>' . wxr_cdata($author->user_login) . '</wp:author_login>';
        echo '<wp:author_email>' . wxr_cdata($author->user_email) . '</wp:author_email>';
        echo '<wp:author_display_name>' . wxr_cdata($author->display_name) . '</wp:author_display_name>';
        echo '<wp:author_first_name>' . wxr_cdata($author->first_name) . '</wp:author_first_name>';
        echo '<wp:author_last_name>' . wxr_cdata($author->last_name) . '</wp:author_last_name>';
        echo "</wp:author>\n";
    }
}

/**
 * Output all navigation menu terms
 *
 * @return void
 */
function wxr_nav_menu_terms()
{
    $nav_menus = wp_get_nav_menus();
    if (empty($nav_menus) || !is_array($nav_menus)) {
        return;
    }

    foreach ($nav_menus as $menu) {
        echo "\t<wp:term>";
        echo '<wp:term_id>' . intval($menu->term_id) . '</wp:term_id>';
        echo '<wp:term_taxonomy>nav_menu</wp:term_taxonomy>';
        echo '<wp:term_slug>' . wxr_cdata($menu->slug) . '</wp:term_slug>';
        wxr_term_name($menu);
        echo "</wp:term>\n";
    }
}

/**
 * Output list of taxonomy terms, in XML tag format, associated with a post
 *
 * @return void
 */
function wxr_post_taxonomy()
{
    $post = get_post();

    $taxonomies = get_object_taxonomies($post->post_type);
    if (empty($taxonomies)) {
        return;
    }
    $terms = wp_get_object_terms($post->ID, $taxonomies);

    foreach ((array) $terms as $term) {
        echo "\t\t<category domain=\"{$term->taxonomy}\" nicename=\"{$term->slug}\">" . wxr_cdata($term->name) . "</category>\n";
    }
}

/**
 * Filter postmeta
 *
 * @param boolean $return_me Return
 * @param string  $meta_key  Meta key
 *
 * @return boolean
 */
function wxr_filter_postmeta($return_me, $meta_key)
{
    if ('_edit_lock' === $meta_key) {
        $return_me = true;
    }
    return $return_me;
}
