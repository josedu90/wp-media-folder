<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');

$iptcHeaderArray = getIptcHeader();
?>
<div id="server_folder_sync" class="tab-content">
    <div class="wpmf_width_100 top_bar">
        <h1><?php echo esc_html__('Server Folder Sync', 'wpmf') ?></h1>
        <?php
        require WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/settings/submit_button.php';
        ?>
    </div>
    <div class="content-box content-wpmf-media-sync">
        <div class="ju-settings-option btnoption">
            <div class="wpmf_row_full">
                <input type="hidden" name="wpmf_option_sync_media" value="0">
                <label data-alt="<?php esc_html_e('Activate the sync from External folder to WordPress media library', 'wpmf') ?>"
                       class="ju-setting-label text"><?php esc_html_e('Activate the sync', 'wpmf') ?></label>
                <div class="ju-switch-button">
                    <label class="switch">
                        <input type="checkbox" id="cb_option_sync_media"
                               name="wpmf_option_sync_media" value="1"
                            <?php
                            if (isset($option_sync_media) && (int) $option_sync_media === 1) {
                                echo 'checked';
                            }
                            ?>
                        >
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="ju-settings-option btnoption wpmf_right m-r-0">
            <div class="wpmf_row_full">
                <input type="hidden" name="wpmf_option_sync_media_external" value="0">
                <label data-alt="<?php esc_html_e('Also activate the sync from
             WordPress media library to external folders', 'wpmf') ?>"
                       class="ju-setting-label text"><?php esc_html_e('Activate 2 ways sync', 'wpmf') ?></label>
                <div class="ju-switch-button">
                    <label class="switch">
                        <input type="checkbox" id="cb_option_sync_media_external"
                               name="wpmf_option_sync_media_external" value="1"
                            <?php
                            if (isset($option_sync_media_external) && (int) $option_sync_media_external === 1) {
                                echo 'checked';
                            }
                            ?>
                        >
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="ju-settings-option btnoption">
            <div class="wpmf_row_full p-lr-20">
                <label data-alt="<?php esc_html_e('Launch an automatic synchronization between the media folders selected below, each X minutes', 'wpmf') ?>" class="setting-label-bold p-r-20"><?php esc_html_e('Sync delay', 'wpmf') ?></label>
                <label>
                    <input type="text" name="input_time_sync" class="input_time_sync"
                           value="<?php echo esc_attr($time_sync) ?>">
                </label>
                <label class="setting-label-bold"><?php esc_html_e('minutes', 'wpmf') ?></label>
            </div>
        </div>

        <div class="ju-settings-option wpmf_width_100 btnoption">
            <div class="wpmf_row_full">
                <div>
                    <div class="wrap_dir_name_ftp wpmf_left">
                        <div id="wpmf_foldertree_sync"></div>

                    </div>

                    <div class="wrap_dir_name_categories wpmf_left">
                        <div id="wpmf_foldertree_categories"></div>

                    </div>
                </div>
                <div class="wpmf_width_100 p-lr-20">
                    <div class="input_dir">
                        <input type="text" name="dir_name_ftp" class="input_sync dir_name_ftp wpmf_left" readonly
                               value="">
                        <input type="text" name="dir_name_categories" class="input_sync dir_name_categories wpmf_left"
                               readonly
                               data-id_category="0" value="">
                    </div>

                    <button type="button"
                            class="m-t-10 ju-button no-background orange-button waves-effect waves-light btn_addsync_media"><?php esc_html_e('Add', 'wpmf') ?></button>
                    <button type="button"
                            class="m-t-10 ju-button no-background orange-button waves-effect waves-light btn_deletesync_media"><?php esc_html_e('Delete selected', 'wpmf') ?></button>
                </div>
            </div>
        </div>

        <div class="ju-settings-option wpmf_width_100 btnoption">
            <table class="wp-list-table widefat striped wp-list-table-sync">
                <thead>
                    <tr>
                        <td style="width: 1%"><label for="cb-select-all-sync-item"></label><input id="cb-select-all-sync-items" class="media_checkbox cb-select-all-sync-items" type="checkbox"></td>
                        <td style="width: 40%; font-weight: bold; text-transform: uppercase"><?php esc_html_e('Server folder', 'wpmf') ?></td>
                        <td style="width: 40%; font-weight: bold; text-transform: uppercase"><?php esc_html_e('WP Media Folder', 'wpmf') ?></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                <?php if (!empty($wpmf_list_sync_media)) : ?>
                    <?php foreach ($wpmf_list_sync_media as $k => $v) : ?>
                        <tr data-id="<?php echo esc_html($k) ?>">
                            <td>
                                <label for="cb-select-<?php echo esc_html($k) ?>"></label>
                                <input class="media_checkbox check-sync-item" id="cb-select-<?php echo esc_html($k) ?>"
                                       type="checkbox" name="post[]" value="<?php echo esc_html($k) ?>">
                            </td>
                            <td><?php echo esc_html($v['folder_ftp']) ?></td>
                            <td><?php echo esc_html($this->breadcrumb_category[$k]) ?></td>
                            <td>
                                <i data-value="<?php echo esc_html($k) ?>" class="material-icons delete-syncftp-item">delete_outline</i>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div id="server_sync_settings" class="tab-content">
    <div class="wpmf_width_100 top_bar">
        <h1><?php echo esc_html__('Settings', 'wpmf') ?></h1>
        <?php
        require WP_MEDIA_FOLDER_PLUGIN_DIR . '/class/pages/settings/submit_button.php';
        ?>
    </div>
    <div class="content-box">
        <div class="ju-settings-option wpmf_width_100 p-lr-20">
            <div class="wpmf_row_full">
                <label class="wpmf_width_100 p-b-20 wpmf_left text label_text">
                    <?php esc_html_e('File type to include in import and synchronization', 'wpmf') ?></label>
                <label class="wpmf_width_100">
                    <textarea name="allow_sync_extensions" class="wpmf_width_100 allow_sync_extensions"><?php echo esc_html($allow_sync_extensions) ?></textarea>
                </label>
            </div>
        </div>

        <div class="ju-settings-option wpmf_width_100">
            <div style="margin: 10px 0 0 0; width: 50%">
                <input type="hidden" name="import_iptc_meta" value="0">
                <label data-alt="<?php esc_html_e('When an image is imported, synchronized or uploaded to the WordPress media library, keep the IPTC metadata attached to the image file', 'wpmf'); ?>"
                       class="wpmfqtip ju-setting-label text"><?php esc_html_e('Enable import IPTC metadata', 'wpmf') ?></label>
                <div class="ju-switch-button">
                    <label class="switch">
                        <input type="checkbox" id="cb_option_import_iptc_meta" name="import_iptc_meta" class="import_iptc_meta"
                               value="1"
                            <?php
                            if (isset($import_iptc_meta) && (int) $import_iptc_meta === 1) {
                                echo 'checked';
                            }
                            ?>
                        >
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <div class="iptc_fields_wrap p-lr-20">
                <label class="ju-setting-label wpmf_width_100 wpmf-no-padding text" style="line-height: 40px"><?php esc_html_e('IPTC fields', 'wpmf') ?></label>
                <div class="iptc_field pure-checkbox m-b-20">
                    <input type="hidden" name="iptc_fields[title]" value="0">
                    <input type="checkbox" id="iptc_title" name="iptc_fields[title]"
                           class="wpmf_checkbox_tree" value="1" <?php checked($iptc_fields['title'], 1) ?>>
                    <label for="iptc_title"><?php esc_html_e('Title', 'wpmf') ?></label>
                </div>

                <div class="iptc_field pure-checkbox">
                    <input type="hidden" name="iptc_fields[alt]" value="0">
                    <input type="checkbox" id="iptc_alt" name="iptc_fields[alt]"
                           class="wpmf_checkbox_tree" value="1" <?php checked($iptc_fields['alt'], 1) ?>>
                    <label for="iptc_alt"><?php esc_html_e('Alt', 'wpmf') ?></label>
                </div>

                <div class="iptc_field pure-checkbox">
                    <input type="hidden" name="iptc_fields[description]" value="0">
                    <input type="checkbox" id="iptc_description" name="iptc_fields[description]"
                           class="wpmf_checkbox_tree" value="1" <?php checked($iptc_fields['description'], 1) ?>>
                    <label for="iptc_description"><?php esc_html_e('Description', 'wpmf') ?></label>
                </div>

                <div class="iptc_field pure-checkbox">
                    <input type="hidden" name="iptc_fields[caption]" value="0">
                    <input type="checkbox" id="iptc_caption" name="iptc_fields[caption]"
                           class="wpmf_checkbox_tree" value="1" <?php checked($iptc_fields['caption'], 1) ?>>
                    <label for="iptc_caption"><?php esc_html_e('Caption', 'wpmf') ?></label>
                </div>

                <?php foreach ($iptcHeaderArray as $code => $iptcHeader) : ?>
                    <div class="iptc_field pure-checkbox">
                        <input type="hidden" name="iptc_fields[<?php echo esc_attr($code) ?>]" value="0">
                        <input type="checkbox" id="iptc_<?php echo esc_attr($code) ?>" name="iptc_fields[<?php echo esc_attr($code) ?>]"
                               class="wpmf_checkbox_tree" value="1" <?php checked($iptc_fields[$code], 1) ?>>
                        <label for="iptc_<?php echo esc_attr($code) ?>"><?php echo esc_html($iptcHeader) ?></label>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>