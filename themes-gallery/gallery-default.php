<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
wp_enqueue_script('wpmf-gallery');
$class_default = array();
$class_default[] = 'gallery wpmf_gallery_default gallery_default';
$class_default[] = 'galleryid-' . $id;
$class_default[] = 'gallery-columns-' . $columns;
$class_default[] = 'gallery-size-' . $size_class;
$class_default[] = 'gallery-link-' . $link;
$class_default[] = 'wpmf-has-border-radius-' . $img_border_radius;
$class_default[] = 'wpmf-gutterwidth-' . $gutterwidth;

$style = '';
if ($img_shadow !== '') {
    $style .= '#' . $selector . ' .wpmf-gallery-item img:hover {box-shadow: ' . $img_shadow . ' !important; transition: all 200ms ease;}';
}

if ($border_style !== 'none') {
    $style .= '#' . $selector . ' .wpmf-gallery-item img {border: ' . $border_color . ' '. $border_width .'px '. $border_style .'}';
}
wp_add_inline_style('wpmf-gallery-style', $style);
$output = '<div class="wpmf-gallerys wpmf-gallerys-life">';
$output .= '<div id="' . $selector . '" class="' . implode(' ', $class_default) . '">';
$i = 0;
$pos = 1;
foreach ($gallery_items as $item_id => $attachment) {
    if (strpos($attachment->post_excerpt, '<script>') !== false) {
        $post_excerpt = esc_html($attachment->post_excerpt);
    } else {
        $post_excerpt = $attachment->post_excerpt;
    }

    $link_target = get_post_meta($attachment->ID, '_gallery_link_target', true);
    switch ($link) {
        case 'file':
            $image_output = $this->getAttachmentLink($item_id, $size, false, $targetsize, false, $link_target);
            break;
        case 'post':
            $image_output = $this->getAttachmentLink($item_id, $size, true, $targetsize, false, $link_target);
            break;
        case 'none':
            $image_output = wp_get_attachment_image($item_id, $size, false, array('data-type' => 'wpmfgalleryimg'));
            break;
        case 'custom':
            $image_output = $this->getAttachmentLink($item_id, $size, false, $targetsize, true, $link_target);
            break;
        default:
            $image_output = $this->getAttachmentLink($item_id, $size, false, $targetsize, false, $link_target);
    }

    $output .= '<figure class="wpmf-gallery-item gallery-item">';
    $output .= '<div class="wpmf-gallery-icon">' . $image_output . '</div>';
    if (trim($post_excerpt) !== '') {
        $output .= '<figcaption class="wp-caption-text gallery-caption">';
        $output .= wptexturize($post_excerpt);
        $output .= '</figcaption>';
    }
    $output .= '</figure>';
    $pos++;
}
$output .= '</div></div>';
