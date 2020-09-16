<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
wp_enqueue_script('wpmf-gallery');
wp_enqueue_script(
    'wpmf-gallery-flexslider',
    plugins_url('assets/js/display-gallery/flexslider/jquery.flexslider.js', dirname(__FILE__)),
    array('jquery'),
    '2.0.0',
    true
);
wp_enqueue_style(
    'wpmf-flexslider-style',
    plugins_url('assets/css/display-gallery/flexslider.css', dirname(__FILE__)),
    array(),
    '2.4.0'
);

$class_default = array();
$class_default[] = 'gallery flexslider carousel wpmfflexslider';
$class_default[] = 'gallery-link-' . $link;
$class_default[] = 'wpmf-has-border-radius-' . $img_border_radius;
$class_default[] = 'wpmf-gutterwidth-' . $gutterwidth;
if ((int) $columns === 1) {
    $class_default[] = 'wpmf-gg-one-columns';
} else {
    $class_default[] = 'wpmf-gg-multiple-columns';
}

$shadow = 0;
$style = '';
if ($img_shadow !== '') {
    if ((int) $columns > 1) {
        $style .= '#' . $selector . ' .wpmf-gallery-item:hover {box-shadow: ' . $img_shadow . ' !important; transition: all 200ms ease;}';
        $shadow = 1;
    }
}

if ((int) $gutterwidth === 0) {
    $shadow = 0;
}
if ($border_style !== 'none') {
    if ((int) $columns === 1) {
        $style .= '#' . $selector . ' .wpmf-gallery-item img {border: ' . $border_color . ' '. $border_width .'px '. $border_style .';}';
    } else {
        $style .= '#' . $selector . ' .wpmf-gallery-item {border: ' . $border_color . ' '. $border_width .'px '. $border_style .';}';
    }
} else {
    $border_width = 0;
}

wp_add_inline_style('wpmf-gallery-style', $style);
$output = '<div class="wpmf-gallerys wpmf-gallerys-life">';
$output .= '<div id="' . $selector . '" data-id="' . $selector . '" data-gutterwidth="' . $gutterwidth . '" 
 class="' . implode(' ', $class_default) . '" data-count="'. esc_attr(count($gallery_items)) .'" data-wpmfcolumns="' . $columns . '" data-auto_animation="' . esc_html($autoplay) . '" data-border-width="' . $border_width . '" data-shadow="' . $shadow . '">';

$output .= '<ul class="slides wpmf-slides">';
$i = 0;
$pos = 1;

foreach ($gallery_items as $item_id => $attachment) {
    $lb_title = (!empty($caption_lightbox) && $attachment->post_excerpt !=='') ? $attachment->post_excerpt : $attachment->post_title;
    $link_target = get_post_meta($attachment->ID, '_gallery_link_target', true);
    $img = wp_get_attachment_image_src($item_id, $size);
    if (!$img) {
        continue;
    }

    list($src, $width, $height) = $img;
    $alt = trim(strip_tags(get_post_meta($item_id, '_wp_attachment_image_alt', true))); // Use Alt field first
    $image_output = '<img src="' . $src . '" alt="' . $alt . '" />';

    $current_theme = get_option('current_theme');
    if (isset($current_theme) && $current_theme === 'Gleam') {
        $tclass = 'fancybox';
    } else {
        $tclass = '';
    }

    if (!empty($link)) {
        if ($customlink) {
            $url = get_post_meta($item_id, _WPMF_GALLERY_PREFIX . 'custom_image_link', true);
            if ($url === '') {
                $url = get_attachment_link($item_id);
            }

            $image_output = '<a class="' . $tclass . '" href="' . $url . '"
             target="' . $link_target . '">' . $image_output . '</a>';
        } elseif ('post' === $link) {
            $url = get_attachment_link($item_id);
            $image_output = '<a class="' . $tclass . '" href="' . $url . '"
             target="' . $link_target . '">' . $image_output . '</a>';
        } elseif ('file' === $link) {
            if (get_post_meta($item_id, _WPMF_GALLERY_PREFIX . 'custom_image_link', true) !== '') {
                $lightbox = 0;
                $url = get_post_meta($item_id, _WPMF_GALLERY_PREFIX . 'custom_image_link', true);
            } else {
                $lightbox = 1;
                $imgs_urls = wp_get_attachment_image_src($item_id, $targetsize);
                $url = $imgs_urls[0];
            }

            $remote_video = get_post_meta($item_id, 'wpmf_remote_video_link', true);
            if (!empty($remote_video)) {
                $image_output = '<a class="' . $tclass . ' isvideo" data-lightbox="' . $lightbox . '"
                 href="' . $remote_video . '" target="' . $link_target . '" title="' . esc_attr($attachment->post_title) . '">
                 ' . $image_output . '</a>';
            } else {
                $image_output = '<a class="' . $tclass . ' not_video"
                 data-lightbox="' . $lightbox . '" href="' . $url . '"
                  target="' . $link_target . '" data-title="' . esc_attr($lb_title) . '" title="' . esc_attr($attachment->post_title) . '">' . $image_output . '</a>';
            }
        } else {
            if (get_post_meta($item_id, _WPMF_GALLERY_PREFIX . 'custom_image_link', true) !== '') {
                $lightbox = 0;
                $url = get_post_meta($item_id, _WPMF_GALLERY_PREFIX . 'custom_image_link', true);
                $image_output = '<a class="' . $tclass . ' not_video"
                 data-lightbox="' . $lightbox . '" href="' . $url . '"
                  target="' . $link_target . '" data-title="' . esc_attr($lb_title) . '" title="' . esc_attr($attachment->post_title) . '">' . $image_output . '</a>';
            } else {
                $image_output = '<img src="' . $src . '" alt="' . $alt . '" />';
            }
        }
    }

    if ((int)$columns === 1) {
        $output .= "<li class='wpmf-gg-one-columns wpmf-gallery-item item'>";
    } else {
        $output .= "<li class='wpmf-gallery-item item'>";
    }
    $output .= '<div class="wpmf-gallery-icon">' . $image_output . '</div>';
    if (trim($attachment->post_excerpt) || trim($attachment->post_title)) {
        $output .= "<div class='wpmf-front-box top'>";
        $output .= '<a>';
        if (trim($attachment->post_title)) {
            $output .= "<span class='title'>" . wptexturize($attachment->post_title) . ' </span>';
        }

        if (trim($attachment->post_excerpt)) {
            $output .= "<span class='caption'>" . wptexturize($attachment->post_excerpt) . '</span>';
        }

        $output .= '</a>';
        $output .= '</div>';
    }

    $output .= '</li>';
    $pos++;
}


$output .= '</ul>';
$output .= '</div></div>';
