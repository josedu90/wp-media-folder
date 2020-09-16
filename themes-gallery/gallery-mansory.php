<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
wp_enqueue_script('jquery-masonry');
wp_enqueue_script('wpmf-gallery');
// getting rid of float
$class[] = 'gallery-' . $display;
$class[] = 'galleryid-' . $id;
$class[] = 'gallery-columns-' . $columns;
$class[] = 'gallery-size-' . $size_class;
$class[] = 'wpmf-gallery-bottomspace-' . $bottomspace;
$class[] = 'wpmf-gallery-clear';
$class[] = 'wpmf-has-border-radius-' . $img_border_radius;
$class = implode(' ', $class);

$padding_masonry = get_option('wpmf_padding_masonry');
if (!isset($padding_masonry) && $padding_masonry === '') {
    $padding_masonry = 5;
}

$gutterwidth = isset($gutterwidth) ? $gutterwidth : $padding_masonry;
$style = '';
if ($img_shadow !== '') {
    $style .= '#' . $selector . ' .wpmf-gallery-item img:hover {box-shadow: ' . $img_shadow . ' !important; transition: all 200ms ease;}';
}

if ($border_style !== 'none') {
    $style .= '#' . $selector . ' .wpmf-gallery-item img {border: ' . $border_color . ' '. $border_width .'px '. $border_style .'}';
}

wp_add_inline_style('wpmf-gallery-style', $style);
$output = "<div class='wpmf-gallerys wpmf-gallerys-life'>";
$output .= '<div id="' . $selector . '"
 data-gutter-width="' . $gutterwidth . '"
  data-wpmfcolumns="' . $columns . '" class="' . $class . '">';
$i = 0;
$pos = 1;

foreach ($gallery_items as $item_id => $attachment) {
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

    $output .= '<div class="wpmf-gallery-item
     wpmf-gallery-item-position-' . $pos . ' wpmf-gallery-item-attachment-' . $item_id . '">';
    $output .= '<div class="wpmf-gallery-icon">' . $image_output . '</div>';
    $output .= '</div>';
    $pos++;
}
$output .= "</div></div>\n";
