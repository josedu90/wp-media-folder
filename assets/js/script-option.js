var selected_folder = null, curFolders = [], wpmf_list_import = '', current_page_watermark = 1, status_regenthumbs_watermark = false;
var wpmfWatermarkExcludeTreeModule;
(function ($) {
    wpmfWatermarkExcludeTreeModule = {
        categories: [], // categories
        folders_states: [], // Contains open or closed status of folders

        /**
         * Retrieve the Jquery tree view element
         * of the current frame
         * @return jQuery
         */
        getTreeElement: function () {
            return $('.watermark_exclude_folders').find('.wpmf-folder-tree');
        },

        /**
         * Initialize module related things
         */
        initModule: function () {
            // Import categories from wpmf main module
            wpmfWatermarkExcludeTreeModule.importCategories();

            // Add the tree view to the main content
            $('<div class="wpmf-folder-tree"></div>').appendTo($('.watermark_exclude_folders'));

            // Render the tree view
            wpmfWatermarkExcludeTreeModule.loadTreeView();

            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: {
                    action: 'wpmf_get_exclude_folders',
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (res) {
                    $.each(res.folders, function (i, v) {
                        $('.wpmf_watermark_exclude_folders[value="' + v + '"]').prop('checked', true).change();
                    });
                }
            });
        },

        /**
         * Import categories from wpmf main module
         */
        importCategories: function () {
            var folders_ordered = [];

            // Add each category
            $(wpmf.vars.wpmf_categories_order).each(function () {
                folders_ordered.push(wpmf.vars.wpmf_categories[this]);
            });

            // Reorder array based on children
            var folders_ordered_deep = [];
            var processed_ids = [];
            var loadChildren = function (id) {
                if (processed_ids.indexOf(id) < 0) {
                    processed_ids.push(id);
                    for (var ij = 0; ij < folders_ordered.length; ij++) {
                        if (folders_ordered[ij].parent_id === id) {
                            folders_ordered_deep.push(folders_ordered[ij]);
                            loadChildren(folders_ordered[ij].id);
                        }
                    }
                }
            };
            loadChildren(parseInt(wpmf.vars.term_root_id));

            // Finally save it to the global var
            wpmfWatermarkExcludeTreeModule.categories = folders_ordered_deep;

        },

        /**
         * Render tree view inside content
         */
        loadTreeView: function () {
            wpmfWatermarkExcludeTreeModule.getTreeElement().html(wpmfWatermarkExcludeTreeModule.getRendering());
        },

        /**
         * Get the html resulting tree view
         * @return {string}
         */
        getRendering: function () {
            var ij = 0;
            var content = ''; // Final tree view content
            /**
             * Recursively print list of folders
             * @return {boolean}
             */
            var generateList = function generateList() {
                content += '<ul>';
                while (ij < wpmfWatermarkExcludeTreeModule.categories.length) {
                    if (typeof wpmfWatermarkExcludeTreeModule.categories[ij].drive_type !== "undefined" && wpmfWatermarkExcludeTreeModule.categories[ij].drive_type !== '') {
                        ij++;
                        continue;
                    }
                    var className = 'closed';
                    // Open li tag
                    content += '<li class="' + className + '" data-id="' + wpmfWatermarkExcludeTreeModule.categories[ij].id + '" >';

                    // get color folder
                    var bgcolor = '';
                    if (typeof wpmf.vars.colors !== 'undefined' && typeof wpmf.vars.colors[wpmfWatermarkExcludeTreeModule.categories[ij].id] !== 'undefined' && wpmfFoldersModule.folder_design === 'material_design') {
                        bgcolor = 'color: ' + wpmf.vars.colors[wpmfWatermarkExcludeTreeModule.categories[ij].id];
                    } else {
                        bgcolor = 'color: #8f8f8f';
                    }

                    var text_label = '';
                    if (wpmfWatermarkExcludeTreeModule.categories[ij + 1] && wpmfWatermarkExcludeTreeModule.categories[ij + 1].depth > wpmfWatermarkExcludeTreeModule.categories[ij].depth) { // The next element is a sub folder
                        content += '<a onclick="wpmfWatermarkExcludeTreeModule.toggle(' + wpmfWatermarkExcludeTreeModule.categories[ij].id + ')"><i class="material-icons wpmf-arrow">keyboard_arrow_down</i></a>';
                    } else {
                        // Add folder icon
                        content += '<i class="material-icons wpmf-arrow" style="opacity: 0">keyboard_arrow_down</i></a>';
                    }
                    content += '<div class="pure-checkbox">';
                    if (wpmfWatermarkExcludeTreeModule.categories[ij].id === 0) {
                        text_label = wpmf.l18n.media_folder;
                    } else {
                        text_label = wpmfWatermarkExcludeTreeModule.categories[ij].label;
                    }

                    if (wpmfWatermarkExcludeTreeModule.categories[ij].id === 0) {
                        content += '<input id="wpmf_watermark_exclude_folders_0" class="wpmf_watermark_exclude_folders" type="checkbox" value="root">';
                    } else {
                        content += '<input id="wpmf_watermark_exclude_folders_' + wpmfWatermarkExcludeTreeModule.categories[ij].id + '" class="wpmf_watermark_exclude_folders" type="checkbox" value="' + wpmfWatermarkExcludeTreeModule.categories[ij].id + '">';
                    }

                    content += '<label for="wpmf_watermark_exclude_folders_' + wpmfWatermarkExcludeTreeModule.categories[ij].id + '" onclick="wpmfWatermarkExcludeTreeModule.changeFolder(' + wpmfWatermarkExcludeTreeModule.categories[ij].id + ')">';
                    content += '<i class="material-icons" style="' + bgcolor + '">folder</i>';
                    content += text_label;
                    content += '</label>';
                    content += '</div>';
                    // This is the end of the array
                    if (wpmfWatermarkExcludeTreeModule.categories[ij + 1] === undefined) {
                        // var's close all opened tags
                        for (var ik = wpmfWatermarkExcludeTreeModule.categories[ij].depth; ik >= 0; ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We are at the end don't continue to process array
                        return false;
                    }


                    if (wpmfWatermarkExcludeTreeModule.categories[ij + 1].depth > wpmfWatermarkExcludeTreeModule.categories[ij].depth) { // The next element is a sub folder
                        // Recursively list it
                        ij++;
                        if (generateList() === false) {
                            // We have reached the end, var's recursively end
                            return false;
                        }
                    } else if (wpmfWatermarkExcludeTreeModule.categories[ij + 1].depth < wpmfWatermarkExcludeTreeModule.categories[ij].depth) { // The next element don't have the same parent
                        // var's close opened tags
                        for (var ik1 = wpmfWatermarkExcludeTreeModule.categories[ij].depth; ik1 > wpmfWatermarkExcludeTreeModule.categories[ij + 1].depth; ik1--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We're not at the end of the array var's continue processing it
                        return true;
                    }

                    // Close the current element
                    content += '</li>';
                    ij++;
                }
            };

            // Start generation
            generateList();
            return content;
        },

        /**
         * Change the selected folder in tree view
         * @param folder_id
         */
        changeFolder: function (folder_id) {
            // Remove previous selection
            wpmfWatermarkExcludeTreeModule.getTreeElement().find('li').removeClass('selected');

            // Select the folder
            wpmfWatermarkExcludeTreeModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('selected').// Open parent folders
            parents('.wpmf-folder-tree li.closed').removeClass('closed');
        },

        /**
         * Toggle the open / closed state of a folder
         * @param folder_id
         */
        toggle: function (folder_id) {
            // Check is folder has closed class
            if (wpmfWatermarkExcludeTreeModule.getTreeElement().find('li[data-id="' + folder_id + '"]').hasClass('closed')) {
                // Open the folder
                wpmfWatermarkExcludeTreeModule.openFolder(folder_id);
            } else {
                // Close the folder
                wpmfWatermarkExcludeTreeModule.closeFolder(folder_id);
                // close all sub folder
                $('li[data-id="' + folder_id + '"]').find('li').addClass('closed');
            }
        },


        /**
         * Open a folder to show children
         */
        openFolder: function (folder_id) {
            wpmfWatermarkExcludeTreeModule.getTreeElement().find('li[data-id="' + folder_id + '"]').removeClass('closed');
            wpmfWatermarkExcludeTreeModule.folders_states[folder_id] = 'open';
        },

        /**
         * Close a folder and hide children
         */
        closeFolder: function (folder_id) {
            wpmfWatermarkExcludeTreeModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('closed');
            wpmfWatermarkExcludeTreeModule.folders_states[folder_id] = 'close';
        }
    };

    /**
     * Import category
     * @param doit true or false
     * @param button
     */
    var importWpmfTaxo = function (doit, button) {
        jQuery(button).closest('div').find('.spinner').show().css('visibility', 'visible');
        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: {
                action: "import_categories",
                doit: doit,
                wpmf_nonce: wpmf.vars.wpmf_nonce
            },
            success: function () {
              //jQuery(button).closest('div').find('.spinner').hide();
            }
        });
    };

    var importFtp = function ($this) {
        $('.process_import_ftp_full').show();
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: "wpmf_import_folder",
                wpmf_list_import: wpmf_list_import,
                wpmf_nonce: wpmf.vars.wpmf_nonce
            },
            success: function (res) {
                var w = $('.process_import_ftp').data('w');
                if (res.status) {
                    if (res.continue) {
                        if (typeof res.percent !== "undefined") {
                            var new_w = parseFloat(w) + parseFloat(res.percent);
                            if (new_w > 100)
                                new_w = 100;
                            $('.process_import_ftp').data('w', new_w).css('width', new_w + '%');
                        }
                        importFtp();
                    } else {
                        $('.wpmf-spiner-import').hide();
                        $('.info_import').fadeIn(500).fadeOut(3000);
                        $('.process_import_ftp_full').show();
                        $('.process_import_ftp').data('w', 0).css('width', '100%');

                        setTimeout(function () {
                            $('.process_import_ftp_full').hide();
                            $('.process_import_ftp').css('width', '0%');
                        }, 2000);
                    }
                }
            }
        });
    };

    var removeSyncItems = function (list) {
        if (!list.length) {
            return;
        }
        $.ajax({
            type: "POST",
            url: ajaxurl,
            dataType: 'json',
            data: {
                action: "wpmf_remove_syncmedia",
                key: list.toString(),
                wpmf_nonce: wpmf.vars.wpmf_nonce
            },
            success: function (response) {
                if (response !== false) {
                    $.each(response, function (i, v) {
                        $('.wp-list-table-sync').find('tr[data-id="' + v + '"]').remove();
                    });
                }
            }
        });
    };

    var syncItemsEvent = function () {
        /**
         * Remove list syng media
         */
        $('.btn_deletesync_media').on('click', function () {
            var list = [];
            $('[id^="cb-select-"]:checked').each(function (i, $this) {
                if ($($this).val() !== "on") {
                    list.push($($this).val());
                }
            });

            removeSyncItems(list);
        });

        $('.delete-syncftp-item').on('click', function () {
            var list = [];
            list.push($(this).data('value'));
            removeSyncItems(list);
        });

        /**
         * check all list sync media
         */
        $('#cb-select-all-sync-items, .check-sync-item').on('click', function () {
            if ($(this).hasClass('cb-select-all-sync-items')) {
                if ($(this).attr('checked') === 'checked') {
                    $('.wp-list-table-sync').find('[id^="cb-select-"]').prop('checked', true);
                } else {
                    $('.wp-list-table-sync').find('[id^="cb-select-"]').prop('checked', false);
                }
            }

            if (!$('.check-sync-item:checked').length) {
                $('.btn_deletesync_media').hide();
            } else {
                $('.btn_deletesync_media').show();
            }
        });
    };

    var mediaFilterAction = function () {
        /**
         * Add custom weight in settings
         */
        $('#add_weight').unbind('click').bind('click', function () {
            if (($('.wpmf_min_weight').val() === '') || ($('.wpmf_min_weight').val() === '' && $('.wpmf_max_weight').val() === '')) {
                $('.wpmf_min_weight').focus();
            } else if ($('.wpmf_max_weight').val() === '') {
                $('.wpmf_max_weight').focus();
            } else {
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        action: "wpmf_add_weight",
                        min_weight: $('.wpmf_min_weight').val(),
                        max_weight: $('.wpmf_max_weight').val(),
                        unit: $('.wpmfunit').val(),
                        wpmf_nonce: wpmf.vars.wpmf_nonce
                    },
                    success: function (res) {
                        if (res !== false) {
                            var new_weight = '<li class="wpmf_width_100 ju-settings-option customize-control customize-control-select item_weight" style="display: list-item;" data-value="' + res.key + '" data-unit="kB">';
                            new_weight += '<div class="wpmf_row_full">';
                            new_weight += '<div class="pure-checkbox ju-setting-label">';
                            new_weight += '<input title="" id="' + res.key + ',' + res.unit + '" type="checkbox" name="weight[]" value="' + res.key + ',' + res.unit + '" data-unit="kB">';
                            new_weight += '<label class="lb" for="' + res.key + ',' + res.unit + '">';
                            new_weight += res.label + '</label>';
                            new_weight += '<label class="ju-switch-button">';
                            new_weight += '<i class="material-icons wpmf-md-edit" data-label="weight" data-value="' + res.key + '" data-unit="' + res.unit + '" title="Edit weight">border_color</i>';
                            new_weight += '<i class="material-icons wpmf-delete" data-label="weight" data-value="' + res.key + '" data-unit="' + res.unit + '" title="Remove weight">delete_outline</i>';
                            new_weight += '</label>';
                            new_weight += '</div>';
                            new_weight += '</div>';
                            new_weight += '</li>';
                            $('.content_list_fillweight li.weight').before(new_weight);
                            mediaFilterAction();
                        } else {
                            alert(wpmfoption.l18n.error);
                        }
                        $('li.weight input').val(null);
                        $('.wpmfunit option[value="kB"]').prop('selected', true).change();
                    }
                });
            }
        });

        /**
         * Add custom dimension in settings
         */
        $('#add_dimension').unbind('click').bind('click', function () {
            if (($('.wpmf_width_dimension').val() === '') || ($('.wpmf_width_dimension').val() === '' && $('.wpmf_height_dimension').val() === '')) {
                $('.wpmf_width_dimension').focus();
            } else if ($('.wpmf_height_dimension').val() === '') {
                $('.wpmf_height_dimension').focus();
            } else {
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        action: "wpmf_add_dimension",
                        width_dimension: $('.wpmf_width_dimension').val(),
                        height_dimension: $('.wpmf_height_dimension').val(),
                        wpmf_nonce: wpmf.vars.wpmf_nonce
                    },
                    success: function (res) {
                        if (res !== false) {
                            var new_dimension = '<li class="wpmf_width_100 ju-settings-option customize-control customize-control-select item_dimension" style="display: list-item;" data-value="' + res + '">';
                            new_dimension += '<div class="wpmf_row_full">';
                            new_dimension += '<div class="pure-checkbox ju-setting-label">';
                            new_dimension += '<input title="" id="' + res + '" type="checkbox" name="dimension[]" value="' + res + '">';
                            new_dimension += '<label class="lb" for="' + res + '">' + res + '</label>';
                            new_dimension += '<label class="ju-switch-button">';
                            new_dimension += '<i class="material-icons wpmf-md-edit" data-label="dimension" data-value="' + res + '" title="Edit dimension">border_color</i>';
                            new_dimension += '<i class="material-icons wpmf-delete" data-label="dimension" data-value="' + res + '" title="Remove dimension">delete_outline</i>';
                            new_dimension += '</label>';
                            new_dimension += '</div>';
                            new_dimension += '</div>';
                            new_dimension += '</li>';

                            $('.content_list_filldimension li.dimension').before(new_dimension);
                            mediaFilterAction();
                        } else {
                            alert(wpmfoption.l18n.error);
                        }
                        $('li.dimension input').val(null);
                    }
                });
            }
        });

        /**
         * remove custom weight/dimension in settings
         */
        $('.wpmf-delete').unbind('click').bind('click', function () {
            var $this = $(this);
            var value = $this.data('value');
            var label = $this.data('label');
            var unit = $this.data('unit');
            if (label === 'dimension') {
                var action = 'wpmf_remove_dimension';
            } else {
                action = 'wpmf_remove_weight';
            }

            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: action,
                    value: value,
                    unit: unit,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (res) {
                    if (res === true) {
                        $this.closest('li').remove();
                    }
                }
            });
        });

        /**
         * edit custom weight/dimension in settings
         */
        $('.wpmfedit').unbind('click').bind('click', function () {
            var $this = $(this);
            var label = $this.data('label');
            var current_value = $('#edit_' + label + '').data('value');
            var unit = $('.wpmfunit').val();
            var new_value = '';
            if (label === 'dimension') {
                new_value = $('.wpmf_width_dimension').val() + 'x' + $('.wpmf_height_dimension').val();
            } else {
                if (unit === 'kB') {
                    new_value = ($('.wpmf_min_weight').val() * 1024) + '-' + ($('.wpmf_max_weight').val() * 1024) + ',' + unit;
                } else {
                    new_value = ($('.wpmf_min_weight').val() * (1024 * 1024)) + '-' + ($('.wpmf_max_weight').val() * (1024 * 1024)) + ',' + unit;
                }
            }

            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'wpmf_edit',
                    label: label,
                    old_value: $this.data('value'),
                    new_value: new_value,
                    unit: unit,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (res) {
                    if (res !== false) {
                        if (label === 'dimension') {
                            $('li.item_' + label + '[data-value="' + current_value + '"]').find('.wpmf-delete').attr('data-value', res.value).data('value', res.value);
                            $('li.item_' + label + '[data-value="' + current_value + '"]').find('.wpmf-md-edit').attr('data-value', res.value).data('value', res.value);
                            $('li.item_' + label + '[data-value="' + current_value + '"]').find('input[name="' + label + '[]"]').val(res.value);
                            $('.content_list_filldimension li[data-value="' + current_value + '"]').find('.lb').html(new_value);
                            $('li.item_' + label + '[data-value="' + current_value + '"]').attr('data-value', res.value).data('value', res.value);
                        } else {
                            var cur_val = current_value.split(',');
                            $('li.item_' + label + '[data-value="' + cur_val[0] + '"]').find('.wpmf-delete').attr('data-value', res.value).data('value', res.value);
                            $('li.item_' + label + '[data-value="' + cur_val[0] + '"]').find('.wpmf-md-edit').attr('data-value', res.value).data('value', res.value);
                            $('li.item_' + label + '[data-value="' + cur_val[0] + '"]').find('input[name="' + label + '[]"]').val(res.value + ',' + cur_val[1]);
                            $('.content_list_fillweight li[data-value="' + cur_val[0] + '"]').find('.lb').html(res.label);
                            $('li.item_' + label + '[data-value="' + cur_val[0] + '"]').attr('data-value', res.value).data('value', res.value);
                        }

                    } else {
                        alert(wpmfoption.l18n.error);
                    }
                    $('.wpmf_can,#edit_' + label + '').hide();
                    $('#edit_' + label + '').attr('data-value', null).data('value', null);
                    $('#add_' + label + '').show();
                    $('li.' + label + ' input').val(null);
                }
            });
        });

        /**
         * open form custom weight/dimension in settings
         */
        $('.wpmf-md-edit').unbind('click').bind('click', function () {
            var $this = $(this);
            var value = $this.data('value');
            var unit = $this.data('unit');
            var label = $this.data('label');
            $('.wpmf_can[data-label="' + label + '"]').show();
            $('#add_' + label + '').hide();

            if (label === 'dimension') {
                $('#edit_' + label + '').show().attr('data-value', value).data('value', value);
                var value_array = value.split('x');
                $('.wpmf_width_dimension').val(value_array[0]);
                $('.wpmf_height_dimension').val(value_array[1]);
            } else {
                $('#edit_' + label + '').show().attr('data-value', value + ',' + unit).data('value', value + ',' + unit);
                value_array = value.split('-');
                if (unit === 'kB') {
                    $('.wpmf_min_weight').val(value_array[0] / 1024);
                    $('.wpmf_max_weight').val(value_array[1] / 1024);
                } else {
                    $('.wpmf_min_weight').val(value_array[0] / (1024 * 1024));
                    $('.wpmf_max_weight').val(value_array[1] / (1024 * 1024));
                }
                $('select.wpmfunit option[value="' + unit + '"]').prop('selected', true).change();
            }
        });
    };

    /**
     * Init event
     */
    var bindSelect = function () {
        syncItemsEvent();
        /* show tooltip when hover label, button */
        jQuery('.wpmf_row_full label ,.content-box #wmpfImpoBtn, .wpmfqtip').qtip({
            content: {
                attr: 'data-alt'
            },
            position: {
                my: 'bottom left',
                at: 'top center'
            },
            style: {
                tip: {
                    corner: true
                },
                classes: 'wpmf-qtip qtip-rounded'
            },
            show: 'hover',
            hide: {
                fixed: true,
                delay: 10
            }
        });
        mediaFilterAction();
        /**
         * Add to list sync media
         */
        $('.btn_addsync_media').on('click', function () {
            var folder_ftp = $('.dir_name_ftp').val();
            var folder_category = $('.dir_name_categories').data('id_category');
            $.ajax({
                type: "POST",
                url: ajaxurl,
                dataType: 'json',
                data: {
                    action: "wpmf_add_syncmedia",
                    folder_ftp: folder_ftp,
                    folder_category: folder_category,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (response) {
                    var tr = '<tr data-id="' + response.folder_category + '">';
                    tr += '<td><input class="media_checkbox check-sync-item" id="cb-select-' + response.folder_category + '" type="checkbox" name="post[]" value="' + response.folder_category + '"></td>';
                    tr += '<td>' + response.folder_ftp + '</td>';
                    tr += '<td>' + $('.dir_name_categories').val() + '</td>';
                    tr += '<td> <i data-value="' + response.folder_category + '" class="material-icons delete-syncftp-item">delete_outline</i></td>';
                    tr += '</tr>';
                    $('.wp-list-table-sync').find('tr[data-id="' + response.folder_category + '"]').remove();
                    $('.wp-list-table-sync').append(tr);
                    syncItemsEvent();
                }
            });
        });

        /**
         * FTP Import
         */
        $('.import_button').on('click', function () {
            var $this = $(this);
            $('.wpmf-spiner-import').show().css('visibility', 'visible');
            importFtp($this);
        });

        // export folder
        $('.export_folder').on('click', function () {
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: "wpmf_export_folder",
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (res) {

                }
            });
        });

        /**
         * close form custom weight/dimension in settings
         */
        $('.wpmf_can').on('click', function () {
            var $this = $(this);
            var label = $this.data('label');
            $this.hide();
            $('#edit_' + label + '').hide();
            $('#edit_' + label + '').attr('data-value', null).data('value', null);
            $('#add_' + label + '').show();
            $('li.' + label + ' input').val(null);
            if (label === 'weight') {
                $('.wpmfunit option[value="kB"]').prop('selected', true).change();
            }
        });

        $('.wpmf-section-title').on('click', function () {
            var title = $(this).data('title');
            if ($(this).closest('li').hasClass('open')) {
                $('.content_list_' + title + '').slideUp('fast');
                $(this).closest('li').removeClass('open');
            } else {
                $('.content_list_' + title + '').slideDown('fast');
                $(this).closest('li').addClass('open')
            }
        });

        $('.watermark_margin_unit').on('click', function () {
            $('.watermark_unit').html($(this).val());
        });

        $('#wmpfImpoBtn').on('click', function () {
            importWpmfTaxo(true, this);
        });

        /* click import nextgen gallery button */
        $('.btn_import_gallery').on('click', function () {
            var $this = $(this);
            $('.btn_import_gallery').closest('div').find('.spinner').show().css('visibility', 'visible');
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: "import_gallery",
                    doit: true,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (res) {
                    if (res === 'error time') {
                        $this.click();
                    } else {
                        $('.btn_import_gallery').closest('div').find('.spinner').hide();
                    }
                }
            });
        });

        // set watermark exclude folders
        $('.wpmf_watermark_exclude_folders').on('click, change', function () {
            var excludes = [];
            $('.wpmf_watermark_exclude_folders').each(function (i, v) {
                var val = $(v).val();
                if ($(v).is(':checked')) {
                    excludes.push(val);
                } else {
                    var index = excludes.indexOf(val);
                    if (index > -1) {
                        excludes.splice(index, 1);
                    }
                }
            });

            $('[name="wpmf_watermark_exclude_folders"]').val(excludes.join()).change();
        });
    };

    $(document).ready(function () {
        // load exclude tree folders
        wpmfWatermarkExcludeTreeModule.initModule();
        var sdir = '/';
        /**
         * options
         * @type {{root: string, showroot: string, onclick: onclick, oncheck: oncheck, usecheckboxes: boolean, expandSpeed: number, collapseSpeed: number, expandEasing: null, collapseEasing: null, canselect: boolean}}
         */
        var options = {
            'root': '/',
            'showroot': '//',
            'onclick': function (elem, type, file) {
            },
            'oncheck': function (elem, checked, type, file) {
                if (file.substring(file.length - 1) === sdir) {
                    file = file.substring(0, file.length - 1);
                }
                if (file.substring(0, 1) === sdir) {
                    file = file.substring(1, file.length);
                }
                if (checked) {
                    if (file !== "" && curFolders.indexOf(file) === -1) {
                        curFolders.push(file);
                    }
                } else {

                    if (file !== "" && !$(elem).next().hasClass('pchecked')) {
                        var temp = [];
                        for (var i = 0; i < curFolders.length; i++) {
                            var curDir = curFolders[i];
                            if (curDir.indexOf(file) !== 0) {
                                temp.push(curDir);
                            }
                        }
                        curFolders = temp;
                    } else {
                        var index = curFolders.indexOf(file);
                        if (index > -1) {
                            curFolders.splice(index, 1);
                        }
                    }
                }
            },
            'usecheckboxes': true, //can be true files dirs or false
            'expandSpeed': 500,
            'collapseSpeed': 500,
            'expandEasing': null,
            'collapseEasing': null,
            'canselect': true
        };

        /**
         * Main folder tree function for FTP import feature
         * @type {{init: init, open: open, close: close, getchecked: getchecked, getselected: getselected}}
         */
        var methods = {
            /**
             * Folder tree init
             */
            init: function () {
                $thisftp = $('#wpmf_foldertree');
                if ($thisftp === 0) {
                    return;
                }

                if (options.showroot !== '') {
                    var checkboxes = '';
                    if (options.usecheckboxes === true || options.usecheckboxes === 'dirs') {
                        checkboxes = '<input type="checkbox" /><span class="check" data-file="' + options.root + '" data-type="dir"></span>';
                    }
                    $thisftp.html('<ul class="jaofiletree"><li class="drive directory collapsed selected">' + checkboxes + '<a href="#" data-file="' + options.root + '" data-type="dir">' + options.showroot + '</a></li></ul>');
                }
                openfolderftp(options.root);
            },
            /**
             * open folder tree by dir name
             * @param dir
             */
            open: function (dir) {
                openfolderftp(dir);
            },
            /**
             * close folder tree by dir name
             * @param dir
             */
            close: function (dir) {
                closedirftp(dir);
            },
            /**
             * Get checked
             * @returns {Array}
             */
            getchecked: function () {
                var list = [];
                var ik = 0;
                $thisftp.find('input:checked + a').each(function () {
                    list[ik] = {
                        type: $(this).attr('data-type'),
                        file: $(this).attr('data-file')
                    };
                    ik++;

                    var curDir = this.file;
                    if (curDir.substring(curDir.length - 1) === sdir) {
                        curDir = curDir.substring(0, curDir.length - 1);
                    }
                    if (curDir.substring(0, 1) === sdir) {
                        curDir = curDir.substring(1, curDir.length);
                    }
                    if (curFolders.indexOf(curDir) === -1) {
                        curFolders.push(curDir);
                    }
                });
                spanCheckInit();
                return list;
            },
            /**
             * Get selected
             * @returns {Array}
             */
            getselected: function () {
                var list = [];
                var ik = 0;
                $thisftp.find('li.selected > a').each(function () {
                    list[ik] = {
                        type: $(this).attr('data-type'),
                        file: $(this).attr('data-file')
                    };
                    ik++;
                });
                return list;
            }
        };

        /**
         * open folder tree by dir name
         * @param dir dir name
         * @param callback
         */
        var openfolderftp = function (dir, callback) {
            if ($thisftp.find('a[data-file="' + dir + '"]').parent().hasClass('expanded')) {
                return;
            }

            if ($thisftp.find('a[data-file="' + dir + '"]').parent().hasClass('expanded') || $thisftp.find('a[data-file="' + dir + '"]').parent().hasClass('wait')) {
                if (typeof callback === 'function')
                    callback();
                return;
            }

            var ret;
            ret = $.ajax({
                url: ajaxurl,
                method: 'POST',
                data: {
                    dir: dir,
                    action: 'wpmf_get_folder',
                    wpmf_list_import: wpmf_list_import,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                context: $thisftp,
                dataType: 'json',
                beforeSend: function () {
                    $('#wpmf_foldertree').find('a[data-file="' + dir + '"]').parent().addClass('wait');
                }
            }).done(function (datas) {

                selected_folder = dir;
                ret = '<ul class="jaofiletree" style="display: none">';
                for (var ij = 0; ij < datas.length; ij++) {
                    if (datas[ij].type === 'dir') {
                        var classe = 'directory collapsed';
                        var isdir = '/';
                    } else {
                        classe = 'file ext_' + datas[ij].ext;
                        isdir = '';
                    }
                    ret += '<li class="' + classe + '">';
                    if (options.usecheckboxes === true || (options.usecheckboxes === 'dirs' && datas[ij].type === 'dir') || (options.usecheckboxes === 'files' && datas[ij].type === 'file')) {
                        if (!datas[ij].disable) {
                            ret += '<input type="checkbox" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '" />';
                        }

                        var testFolder = dir + datas[ij].file;
                        if (testFolder.substring(0, 1) === '/') {
                            testFolder = testFolder.substring(1, testFolder.length);
                        }

                        if (datas[ij].disable) {
                            ret += '<span class="dashicons dashicons-upload notvisible"></span>';
                        } else {
                            if (curFolders.indexOf(testFolder) > -1) {
                                ret += '<span class="check checked" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '"></span>';
                            } else if (datas[ij].pchecked === true) {
                                ret += '<span class="check pchecked" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '" ></span>';
                            } else {
                                ret += '<span class="check" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '" ></span>';
                            }
                        }
                    }
                    ret += '<i class="zmdi zmdi-folder tree-status-folder" data-file="' + dir + datas[ij].file + isdir + '"></i>';
                    ret += '<a href="#" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '">' + datas[ij].file + '</a>';
                    ret += '</li>';
                }
                ret += '</ul>';

                $('#wpmf_foldertree').find('a[data-file="' + dir + '"]').parent().removeClass('wait').removeClass('collapsed').addClass('expanded');
                $thisftp.find('.tree-status-folder[data-file="' + dir + '"]').removeClass('zmdi-folder').addClass('zmdi-folder-outline');
                $('#wpmf_foldertree').find('a[data-file="' + dir + '"]').after(ret);
                $('#wpmf_foldertree').find('a[data-file="' + dir + '"]').next().slideDown(options.expandSpeed, options.expandEasing,
                    function () {
                        methods.getchecked();
                        if (typeof callback === 'function')
                            callback();
                    });

                seteventsftp();
                wpmf_bindeventcheckbox($thisftp);
                if (options.usecheckboxes) {
                    this.find('a[data-file="' + dir + '"]').parent().find('li input[type="checkbox"]').attr('checked', null);
                    for (ij = 0; ij < datas.length; ij++) {
                        testFolder = dir + datas[ij].file;
                        if (testFolder.substring(0, 1) === '/') {
                            testFolder = testFolder.substring(1, testFolder.length);
                        }
                        if (curFolders.indexOf(testFolder) > -1) {
                            this.find('input[data-file="' + dir + datas[ij].file + isdir + '"]').attr('checked', 'checked');
                        }
                    }

                    if (this.find('input[data-file="' + dir + '"]').is(':checked')) {
                        this.find('input[data-file="' + dir + '"]').parent().find('li input[type="checkbox"]').each(function () {
                            $(this).prop('checked', true).trigger('change');
                        });
                        this.find('input[data-file="' + dir + '"]').parent().find('li span.check').addClass("checked");
                    }

                }


            }).done(function () {
                methods.getchecked();
            });

            wpmf_bindeventcheckbox($thisftp);
        };

        /**
         * remember checkbox
         * @param $thisftp
         */
        var wpmf_bindeventcheckbox = function ($thisftp) {
            $thisftp.find('li input[type="checkbox"]').bind('change', function () {
                var dir_checked = [];
                $('.directory span.check').each(function () {
                    if ($(this).hasClass('checked')) {
                        if ($(this).data('file') !== undefined) {
                            dir_checked.push($(this).data('file'));
                        }
                    }
                });

                var fchecked = [];
                fchecked.sort();
                for (var i = 0; i < dir_checked.length; i++) {
                    var curDir = dir_checked[i];
                    var valid = true;
                    for (var j = 0; j < i; j++) {
                        if (curDir.indexOf(dir_checked[j]) === 0) {
                            valid = false;
                        }
                    }
                    if (valid) {
                        fchecked.push(curDir);
                    }
                }

                wpmf_list_import = fchecked.toString();
            });
        };

        /**
         * close folder tree by dir name
         * @param dir
         */
        var closedirftp = function (dir) {
            $thisftp.find('a[data-file="' + dir + '"]').next().slideUp(options.collapseSpeed, options.collapseEasing, function () {
                $(this).remove();
            });
            $thisftp.find('a[data-file="' + dir + '"]').parent().removeClass('expanded').addClass('collapsed');
            $thisftp.find('.tree-status-folder[data-file="' + dir + '"]').addClass('zmdi-folder').removeClass('zmdi-folder-outline');
            seteventsftp();
        };

        /**
         * init event click to open/close folder tree
         */
        var seteventsftp = function () {
            $thisftp = $('#wpmf_foldertree');
            $thisftp.find('li a').unbind('click');
            //Bind userdefined function on click an element
            $thisftp.find('li a').bind('click', function () {
                options.onclick(this, $(this).attr('data-type'), $(this).attr('data-file'));
                if (options.usecheckboxes && $(this).attr('data-type') === 'file') {
                    $thisftp.find('li input[type="checkbox"]').attr('checked', null);
                    $(this).prev(':not(:disabled)').attr('checked', 'checked');
                    $(this).prev(':not(:disabled)').trigger('check');
                }
                if (options.canselect) {
                    $thisftp.find('li').removeClass('selected');
                    $(this).parent().addClass('selected');
                }
                return false;
            });
            //Bind checkbox check/uncheck
            $thisftp.find('li input[type="checkbox"]').bind('change', function () {
                options.oncheck(this, $(this).is(':checked'), $(this).next().attr('data-type'), $(this).next().attr('data-file'));
                if ($(this).is(':checked')) {
                    $(this).parent().find('li input[type="checkbox"]').attr('checked', 'checked');
                    $thisftp.trigger('check');
                } else {
                    $(this).parent().find('li input[type="checkbox"]').attr('checked', null);
                    $thisftp.trigger('uncheck');
                }

            });
            //Bind for collapse or expand elements
            $thisftp.find('li.directory.collapsed a').bind('click', function () {
                methods.open($(this).attr('data-file'));
                return false;
            });
            $thisftp.find('li.directory.expanded a').bind('click', function () {
                methods.close($(this).attr('data-file'));
                return false;
            });
        };

        /**
         * Folder tree function
         */
        methods.init();
        var spanCheckInit = function () {
            $("#wpmf_foldertree span.check").unbind('click').bind('click', function () {
                $(this).removeClass('pchecked');
                $(this).toggleClass('checked');
                if ($(this).hasClass('checked')) {
                    $(this).prev().prop('checked', true).trigger('change');
                } else {
                    $(this).prev().prop('checked', false).trigger('change');
                }
                setParentState(this);
                setChildrenState(this);
            });
        };

        var setParentState = function (obj) {
            var liObj = $(obj).parent().parent();
            var noCheck = 0, noUncheck = 0, totalEl = 0;
            liObj.find('li span.check').each(function () {

                if ($(this).hasClass('checked')) {
                    noCheck++;
                } else {
                    noUncheck++;
                }
                totalEl++;
            });

            if (parseInt(totalEl) === parseInt(noCheck)) {
                liObj.parent().children('span.check').addClass('pchecked');
                liObj.parent().children('input[type="checkbox"]').prop('checked', true).trigger('change');
            } else if (parseInt(totalEl) === parseInt(noUncheck)) {
                liObj.parent().children('span.check').removeClass('pchecked');
                liObj.parent().children('input[type="checkbox"]').prop('checked', false).trigger('change');
            } else {
                liObj.parent().children('span.check').addClass('pchecked');
                liObj.parent().children('input[type="checkbox"]').prop('checked', false).trigger('change');
            }

            if (liObj.parent().children('span.check').length > 0) {
                setParentState(liObj.parent().children('span.check'));
            }
        };

        var setChildrenState = function (obj) {
            if ($(obj).hasClass('checked')) {
                $(obj).parent().find('li span.check').removeClass('pchecked').addClass("checked");
                $(obj).parent().find('li input[type="checkbox"]').prop('checked', true).trigger('change');
            } else {
                $(obj).parent().find('li span.check').removeClass("checked");
                $(obj).parent().find('li input[type="checkbox"]').prop('checked', false).trigger('change');
            }
        };

        bindSelect();

        /**
         * run watermark images
         * @param paged
         */
        var watermarkRegeneration = function (paged) {
            if (!status_regenthumbs_watermark) {
                return;
            }
            $('.process_watermark_thumb_full').show();
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action: 'wpmf_watermark_regeneration',
                    paged: paged,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (res) {
                    var w = $('.process_watermark_thumb').data('w');
                    if (res.status === 'ok') {
                        current_page_watermark = 1;
                        $('.wpmf_watermark_regeneration').html(wpmfoption.l18n.regenerate_watermark_lb).show();
                        $('.process_watermark_thumb').data('w', 0).css('width', '100%');
                        $('.wpmf_watermark_regeneration').show();
                        $('.btn_stop_watermark').hide();
                    }

                    if (res.status === 'limit' || typeof res === "undefined") {
                        current_page_watermark = parseInt(paged) + 1;
                        if (typeof res.percent !== "undefined") {
                            var new_w = parseFloat(w) + parseFloat(res.percent);
                            if (new_w > 100)
                                new_w = 100;
                            $('.process_watermark_thumb_full').show();
                            $('.process_watermark_thumb').data('w', new_w).css('width', new_w + '%');
                        }
                        watermarkRegeneration(current_page_watermark);
                    } else {
                        $('.process_watermark_thumb_full').hide();
                    }
                }
            });
        };

        var renderWpGalleryShortcode = function() {
            var renderShortCode = '[wpmf_gallery wpmf_autoinsert="1"';
            $('.wp_gallery_shortcode_field').each(function(){
                var param, value = '';
                if ($(this).hasClass('wp_shortcode_gallery_folder_id')) {
                    param = 'wpmf_folder_id';
                } else {
                    param = $(this).data('param');
                }

                if (param === 'autoplay') {
                    if($('[name="wpmf_gallery_shortcode_cf[autoplay]"]:checked').length) {
                        value = 1;
                    } else {
                        value = 0;
                    }
                } else {
                    value = $(this).val();
                }

                if (param === 'include_children') {
                    if($('[name="wpmf_gallery_shortcode_cf[include_children]"]:checked').length) {
                        value = 1;
                    } else {
                        value = 0;
                    }
                } else {
                    value = $(this).val();
                }

                renderShortCode += ' ' + param + '="' + value + '"';
            });
            renderShortCode += ']';
            $('.wp_gallery_shortcode_input').val(renderShortCode);
        };

        jQuery('[name="wpmf_gallery_shortcode_cf[border_color]"]').wpColorPicker({
            // a callback to fire whenever the color changes to a valid color
            change: function(event, ui){
                $('[name="wpmf_gallery_shortcode_cf[border_color]').val(ui.color.toString()).change();
            },
            // a callback to fire when the input is emptied or an invalid color
            clear: function() {},
            // hide the color picker controls on load
            hide: true,
            // set  total width
            width : 200,
        });

        /**
         * Change gallery params in shortcode settings
         */
        $('.wp_gallery_shortcode_field').on('change',function(){
            renderWpGalleryShortcode();
        });


        $('.wp_gallery_shadow_field').on('change',function(){
            var shadow_h = $('.wp_gallery_shadow_h_field').val();
            var shadow_v = $('.wp_gallery_shadow_v_field').val();
            var shadow_blur = $('.wp_gallery_shadow_blur_field').val();
            var shadow_spread = $('.wp_gallery_shadow_spread_field').val();
            var shadow_color = $('.wp_gallery_shadow_color_field').val();
            var value = shadow_h + 'px ' + shadow_v + 'px ' + shadow_blur + 'px ' + shadow_spread + 'px ' + shadow_color;
            $('[name="wpmf_gallery_shortcode_cf[img_shadow]"]').val(value).change();
        });

        jQuery('.wp_gallery_shadow_color_field').wpColorPicker({
            // a callback to fire whenever the color changes to a valid color
            change: function(event, ui){
                $('.wp_gallery_shadow_color_field').val(ui.color.toString()).change();
            },
            // a callback to fire when the input is emptied or an invalid color
            clear: function() {},
            // hide the color picker controls on load
            hide: true,
            // set  total width
            width : 200,
        });

        /**
         * Copy gallery shortcode
         */
        $('.wpmf_copy_shortcode').on('click',function () {
            var input = $(this).data('input');
            var shortcode_value = $('.' + input).val();
            if (input === 'wp_gallery_shortcode_input') {
                wpmfFoldersModule.setClipboardText(shortcode_value, wpmf.l18n.success_copy_shortcode);
            } else {
                wpmfFoldersModule.setClipboardText(shortcode_value, wpmf.l18n.success_copy);
            }
        });


        /**
         * run watermark image
         */
        $('.wpmf_watermark_regeneration').on('click', function () {
            status_regenthumbs_watermark = true;
            if (status_regenthumbs_watermark) {
                $(this).html(wpmfoption.l18n.continue).hide();
                $('.btn_stop_watermark').show();
                watermarkRegeneration(current_page_watermark);
            }
        });

        /* stop regenerate thumbnails */
        $('.btn_stop_watermark').on('click', function () {
            status_regenthumbs_watermark = false;
            $('.wpmf_watermark_regeneration').show();
            $(this).hide();
        });

        /**
         * Open select logo watermark
         */
        $('.wpmf_watermark_select_image').on('click', function () {
            if (typeof frame !== "undefined") {
                frame.open();
                return;
            }

            // Create the media frame.
            var frame = wp.media({
                // Tell the modal to show only images.
                library: {
                    type: 'image'
                }
            });

            // When an image is selected, run a callback.
            frame.on('select', function () {
                // Grab the selected attachment.
                var attachment = frame.state().get('selection').first().toJSON();
                $('#wpmf_watermark_image').val(attachment.url);
                $('#wpmf_watermark_image_id').val(attachment.id);
            });

            frame.open();
        });

        /**
         * clear logo watermark
         */
        $('.wpmf_watermark_clear_image').on('click', function () {
            $('#wpmf_watermark_image').val('');
            $('#wpmf_watermark_image_id').val(0);
        });

        $('.gallery-slider-animation').on('click', function () {
            $('.gallery-slider-animation').removeClass('animation_selected');
            if ($(this).data('value') === 'fade') {
                $('.img_slide').attr('src', wpmfoption.vars.image_path + 'slide.png');
            } else {
                $('.img_slide').attr('src', wpmfoption.vars.image_path + 'slide_white.png');
            }

            $('.wpmf_slider_animation').val($(this).data('value')).change();
            $(this).addClass('animation_selected');
        });

        $('.delete_all_datas').on('click', function () {
            if ($(this).is(':checked')) {
                $('.delete_all_label').addClass('show').removeClass('hide');
            } else {
                $('.delete_all_label').addClass('hide').removeClass('show');
            }
        });

        $('.wpmf-notice-dismiss').on('click', function () {
            $('.saved_infos').slideUp();
        });

        $('[name="sync_method"]').on('change', function () {
            if ($(this).val() === 'crontab') {
                $('.wpmf-crontab-url-help-wrap').addClass('show').removeClass('hide');
            } else {
                $('.wpmf-crontab-url-help-wrap').addClass('hide').removeClass('show');
            }
        });



        $('.tabs.ju-menu-tabs .tab a.link-tab').on('click', function () {
            var href = $(this).attr('href').replace(/#/g, '');
            window.location.hash='#' + href;
            setTimeout(function () {
                $('#' + href + ' ul.tabs').itabs();
            }, 100);
        });
    });
})(jQuery);