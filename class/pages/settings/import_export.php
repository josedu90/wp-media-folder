<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
$bytes = apply_filters('import_upload_size_limit', wp_max_upload_size());
$size = size_format($bytes);
?>
<div id="server_export" class="tab-content">
    <div class="wpmf_width_100 top_bar">
        <h1><?php echo esc_html__('Library Import/Export', 'wpmf') ?></h1>
        <p class="import_export_desc description"><?php echo esc_html__('Export and Import your WP Media Folder library (folder and media)', 'wpmf') ?></p>
    </div>
    <div class="content-box">
        <div class="ju-settings-option wpmf_width_100 p-tb-20">
            <label data-alt="Select what do you want to export and run to generate a file that you will import on another website"
                   class="ju-setting-label text wpmfqtip"><?php esc_html_e('Export Media/Folders', 'wpmf'); ?></label>
            <select name="export_folder_type" class="ju-select export_folder_type">
                <option value="all" <?php selected($export_folder_type, 'all') ?>><?php esc_html_e('All folders and media', 'wpmf'); ?></option>
                <option value="only_folder" <?php selected($export_folder_type, 'only_folder') ?>><?php esc_html_e('Only the folder structure', 'wpmf'); ?></option>
                <option value="selection_folder" <?php selected($export_folder_type, 'selection_folder') ?>><?php esc_html_e('A selection of folders and media', 'wpmf'); ?></option>
            </select>
            <input type="hidden" name="wpmf_export_folders" class="wpmf_export_folders">
            <a href="#open_export_tree_folders"
               class="ju-button no-background  open_export_tree_folders <?php echo ($export_folder_type === 'selection_folder') ? 'show' : 'hide' ?>"><?php esc_html_e('Select folders', 'wpmf'); ?></a>
            <a href="<?php echo esc_url(admin_url('options-general.php?page=option-folder&action=wpmf_export&wpmf_nonce=' . wp_create_nonce('wpmf_nonce') . '#server_export')) ?>"
               class="ju-button export_folder_btn no-background orange-button waves-effect waves-light"><?php esc_html_e('Run export', 'wpmf'); ?></a>
        </div>

        <div class="ju-settings-option wpmf_width_100 p-tb-20">
            <div class="wpmf_width_100">
                <label data-alt="Browse and select the file you've previously exported to run the media & folders import"
                       class="ju-setting-label text wpmfqtip"><?php esc_html_e('Import Media/Folders', 'wpmf'); ?></label>
                <input type="file" name="import" class="wpmf_import_folders">
                <input type="hidden" name="max_file_size" value="<?php echo esc_attr($bytes); ?>"/>
                <button name="import_folders_btn" type="submit"
                        class="ju-button import_folder_btn no-background orange-button waves-effect waves-light"
                        data-path="<?php echo (!empty($path)) ? esc_attr($path) : '' ?>"
                        data-id="<?php echo (!empty($id)) ? esc_attr($id) : '' ?>"
                        data-import_only_folder="<?php echo (!empty($import_only_folder)) ? esc_attr($import_only_folder) : '' ?>">
                    <?php esc_html_e('Run import', 'wpmf'); ?>
                </button>
            </div>
            <div class="wpmf_width_100 p-lr-20 info-export-wrap">
                <label class="wpmfqtip" data-alt="<?php esc_html_e('Server values are upload_max_filesize and post_max_size', 'wpmf'); ?>">
                    <?php
                    printf(esc_html__('Maximum size, server value: %s', 'wpmf'), esc_html($size));
                    ?>
                </label>

                <?php if (apply_filters('import_allow_import_only_folder', true)) : ?>
                    <p>
                        <input type="checkbox" value="1" name="import_only_folder" id="import-attachments" checked/>
                        <label for="import-attachments"><?php esc_html_e('Import only folder structure (not media)', 'wpmf'); ?></label>
                    </p>
                <?php endif; ?>
                <div class="import_error_message_wrap">
                    <?php
                    if (isset($error_message) && $error_message !== '') {
                        // phpcs:ignore WordPress.Security.EscapeOutput -- Content already escaped in the method
                        echo '<div class="import_error_message">' . $error_message . '</div>';
                    }
                    ?>
                </div>
            </div>
        </div>

        <div class="white-popup mfp-hide" id="open_export_tree_folders">
            <div class="export_tree_folders"></div>
            <button class="ju-button save_export_folders orange-button"><?php esc_html_e('Save', 'wpmf'); ?></button>
            <span class="spinner save_export_folders_spinner"></span>
        </div>
    </div>
</div>

<div id="server_import" class="tab-content">
    <div class="wpmf_width_100 top_bar">
        <h1><?php echo esc_html__('Import server folders', 'wpmf') ?></h1>
    </div>
    <div class="content-box">
        <div class="ju-settings-option wpmf_width_100 p-d-20 btnoption">
            <p class="description">
                <?php esc_html_e('Import folder structure and media from your
         server in the standard WordPress media manager', 'wpmf'); ?>
                <br><span class="text-orange"
                          style="word-break: break-all;"><?php echo esc_html($allow_sync_extensions) ?></span>
            </p>
            <div class="wpmf_row_full">
                <div id="wpmf_foldertree" class="wpmf-no-padding"></div>
                <div class="wpmf-process-bar-full process_import_ftp_full" style="">
                    <div class="wpmf-process-bar process_import_ftp" data-w="0"></div>
                </div>
                <button type="button"
                        class="ju-button import_button no-background orange-button waves-effect waves-light"><?php esc_html_e('Import Folder', 'wpmf'); ?></button>
                <span class="spinner wpmf-spiner-import" style="float: left;margin: 8.5px;"></span>
                <span class="info_import"><?php esc_html_e('Imported!', 'wpmf'); ?></span>
            </div>
        </div>
    </div>
</div>