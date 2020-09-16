/**
 * Folder tree for WP Media Folder
 */
var wpmfFoldersTreeExportModule;
(function ($) {
    wpmfFoldersTreeExportModule = {
        categories: [], // categories
        folders_states: [], // Contains open or closed status of folders

        /**
         * Retrieve the Jquery tree view element
         * of the current frame
         * @return jQuery
         */
        getTreeElement: function () {
            return $('.export_tree_folders').find('.wpmf-folder-tree');
        },

        /**
         * Initialize module related things
         */
        initModule: function () {
            // Import categories from wpmf main module
            wpmfFoldersTreeExportModule.importCategories();

            // Add the tree view to the main content
            $('<div class="wpmf-folder-tree wpmf-no-margin wpmf-no-padding"></div>').appendTo($('.export_tree_folders'));
            // Render the tree view
            wpmfFoldersTreeExportModule.loadTreeView();

            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: {
                    action: 'wpmf_get_export_folders',
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function (res) {
                    $.each(res.folders, function (i, v) {
                        $('.export_tree_folders .media_checkbox[value="' + v + '"]').prop('checked', true).change();
                    });
                }
            });

            $('.save_export_folders').on('click', function () {
                $.ajax({
                    type: "POST",
                    url: ajaxurl,
                    data: {
                        action: 'wpmf_set_export_folders',
                        wpmf_export_folders: $('.wpmf_export_folders').val(),
                        wpmf_nonce: wpmf.vars.wpmf_nonce
                    },
                    beforeSend: function () {
                        $('.save_export_folders_spinner').show().css('visibility', 'visible');
                    },
                    success: function () {
                        $('.save_export_folders_spinner').hide();
                        $.magnificPopup.close();
                    }
                });
            });

            // set watermark exclude folders
            $('.export_tree_folders .media_checkbox').on('click, change', function () {
                var excludes = [];
                $('.export_tree_folders .media_checkbox').each(function (i, v) {
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

                $('[name="wpmf_export_folders"]').val(excludes.join()).change();
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
            wpmfFoldersTreeExportModule.categories = folders_ordered_deep;

        },

        /**
         * Render tree view inside content
         */
        loadTreeView: function () {
            wpmfFoldersTreeExportModule.getTreeElement().html(wpmfFoldersTreeExportModule.getRendering());
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

                while (ij < wpmfFoldersTreeExportModule.categories.length) {
                    var className = 'closed';
                    if (typeof wpmfFoldersTreeExportModule.categories[ij].drive_type !== "undefined" && wpmfFoldersTreeExportModule.categories[ij].drive_type !== '') {
                        className += ' hide';
                    }
                    // Open li tag
                    content += '<li class="' + className + '" data-id="' + wpmfFoldersTreeExportModule.categories[ij].id + '" >';

                    var a_tag = '<a data-id="' + wpmfFoldersTreeExportModule.categories[ij].id + '">';

                    // get color folder
                    var bgcolor = '';
                    if (typeof wpmf.vars.colors !== 'undefined' && typeof wpmf.vars.colors[wpmfFoldersTreeExportModule.categories[ij].id] !== 'undefined' && wpmfFoldersModule.folder_design === 'material_design') {
                        bgcolor = 'color: ' + wpmf.vars.colors[wpmfFoldersTreeExportModule.categories[ij].id];
                    } else {
                        bgcolor = 'color: #8f8f8f';
                    }

                    if (wpmfFoldersTreeExportModule.categories[ij + 1] && wpmfFoldersTreeExportModule.categories[ij + 1].depth > wpmfFoldersTreeExportModule.categories[ij].depth) { // The next element is a sub folder
                        content += '<a onclick="wpmfFoldersTreeExportModule.toggle(' + wpmfFoldersTreeExportModule.categories[ij].id + ')"><i class="material-icons wpmf-arrow">keyboard_arrow_down</i></a>';

                        content += a_tag;

                        // Add folder icon
                        content += '<i class="material-icons" style="' + bgcolor + '">folder</i>';
                    } else {
                        content += a_tag;

                        // Add folder icon
                        content += '<i class="material-icons wpmf-no-arrow" style="' + bgcolor + '">folder</i>';
                    }

                    content += '<input type="checkbox" class="media_checkbox" value="' + wpmfFoldersTreeExportModule.categories[ij].id + '" data-id="' + wpmfFoldersTreeExportModule.categories[ij].id + '" />';

                    // Add current category name
                    if (wpmfFoldersTreeExportModule.categories[ij].id === 0) {
                        // If this is the root folder then rename it
                        content += '<span onclick="wpmfFoldersTreeExportModule.changeFolder(0)">' + wpmf.l18n.media_folder + '</span>';
                    } else {
                        content += '<span onclick="wpmfFoldersTreeExportModule.changeFolder(' + wpmfFoldersTreeExportModule.categories[ij].id + ')">' + wpmfFoldersTreeExportModule.categories[ij].label + '</span>';
                    }

                    content += '</a>';
                    // This is the end of the array
                    if (wpmfFoldersTreeExportModule.categories[ij + 1] === undefined) {
                        // var's close all opened tags
                        for (var ik = wpmfFoldersTreeExportModule.categories[ij].depth; ik >= 0; ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We are at the end don't continue to process array
                        return false;
                    }


                    if (wpmfFoldersTreeExportModule.categories[ij + 1].depth > wpmfFoldersTreeExportModule.categories[ij].depth) { // The next element is a sub folder
                        // Recursively list it
                        ij++;
                        if (generateList() === false) {
                            // We have reached the end, var's recursively end
                            return false;
                        }
                    } else if (wpmfFoldersTreeExportModule.categories[ij + 1].depth < wpmfFoldersTreeExportModule.categories[ij].depth) { // The next element don't have the same parent
                        // var's close opened tags
                        for (var ik1 = wpmfFoldersTreeExportModule.categories[ij].depth; ik1 > wpmfFoldersTreeExportModule.categories[ij + 1].depth; ik1--) {
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
            wpmfFoldersTreeExportModule.getTreeElement().find('li').removeClass('selected');

            // Select the folder
            wpmfFoldersTreeExportModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('selected').// Open parent folders
                parents('.wpmf-folder-tree li.closed').removeClass('closed');
        },

        /**
         * Toggle the open / closed state of a folder
         * @param folder_id
         */
        toggle: function (folder_id) {
            // Check is folder has closed class
            if (wpmfFoldersTreeExportModule.getTreeElement().find('li[data-id="' + folder_id + '"]').hasClass('closed')) {
                // Open the folder
                wpmfFoldersTreeExportModule.openFolder(folder_id);
            } else {
                // Close the folder
                wpmfFoldersTreeExportModule.closeFolder(folder_id);
                // close all sub folder
                $('li[data-id="' + folder_id + '"]').find('li').addClass('closed');
            }
        },


        /**
         * Open a folder to show children
         */
        openFolder: function (folder_id) {
            wpmfFoldersTreeExportModule.getTreeElement().find('li[data-id="' + folder_id + '"]').removeClass('closed');
            wpmfFoldersTreeExportModule.folders_states[folder_id] = 'open';
        },

        /**
         * Close a folder and hide children
         */
        closeFolder: function (folder_id) {
            wpmfFoldersTreeExportModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('closed');
            wpmfFoldersTreeExportModule.folders_states[folder_id] = 'close';
        }
    };

    // var's initialize WPMF folder tree features
    $(document).ready(function () {
        var path = $('.import_folder_btn').data('path');
        var id = $('.import_folder_btn').data('id');
        var import_only_folder = $('.import_folder_btn').data('import_only_folder');
        if (path !== '' && id !== '') {
            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: {
                    action: 'wpmf_import_folders',
                    path: path,
                    id: id,
                    import_only_folder: (import_only_folder !== '') ? import_only_folder : false,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                beforeSend: function () {
                    if (import_only_folder !== '') {
                        $('#import-attachments').prop('checked', true);
                    } else {
                        $('#import-attachments').prop('checked', false);
                    }
                    wpmfSnackbarModule.show({
                        id: 'import_library_folders',
                        content: wpmfoption.l18n.import_library_folders,
                        auto_close: false,
                        is_progress: true
                    });
                },
                success: function (res) {
                    var $snack = wpmfSnackbarModule.getFromId('import_library_folders');
                    wpmfSnackbarModule.close($snack);

                    $('.import_error_message_wrap').html('<div class="import_error_message">' + res.msg + '</div>');
                }
            });
        }

        $('.export_folder_type').on('change', function () {
            var type = $(this).val();
            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: {
                    action: 'wpmf_set_export_folder_type',
                    type: type,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                }
            });
            if (type === 'selection_folder') {
                $('.open_export_tree_folders').addClass('show').removeClass('hide');
            } else {
                $('.open_export_tree_folders').addClass('hide').removeClass('show');
            }
        });

        $('.open_export_tree_folders').magnificPopup({
            type:'inline',
            midClick: true,
            callbacks: {
                open: function () {
                    if (!$('.export_tree_folders .wpmf-folder-tree').length) {
                        wpmfFoldersTreeExportModule.initModule();
                    }
                }
            }
        });
    });
})(jQuery);