(function ($) {
    wpmfImportCloudModule = {
        categories: [], // categories
        folders_states: [], // Contains open or closed status of folders

        /**
         * Retrieve the Jquery tree view element
         * of the current frame
         * @return jQuery
         */
        getTreeElement: function () {
            return $('.librarytree_cloudimport');
        },

        initModule: function () {
            if ($('.librarytree_cloudimport').length === 0) {
                return;
            }
            // Import categories from wpmf main module
            wpmfImportCloudModule.importCategories();
            wpmfImportCloudModule.loadTreeView();
        },

        /**
         * Render tree view inside content
         */
        loadTreeView: function () {
            wpmfImportCloudModule.getTreeElement().append(wpmfImportCloudModule.getRendering());
        },

        /**
         * Import categories from wpmf main module
         */
        importCategories: function () {
            let folders_ordered = [];

            // Add each category
            $(wpmfFoldersModule.categories_order).each(function () {
                folders_ordered.push(wpmfFoldersModule.categories[this]);
            });

            // Order the array depending on main ordering
            switch (wpmfFoldersModule.folder_ordering) {
                default:
                case 'name-ASC':
                    folders_ordered = Object.values(folders_ordered).sort(function (a, b) {
                        if (a.id === 0) return -1; // Root folder is always first
                        if (b.id === 0) return 1; // Root folder is always first
                        return a.label.localeCompare(b.label);
                    });
                    break;
                case 'name-DESC':
                    folders_ordered = Object.values(folders_ordered).sort(function (a, b) {
                        if (a.id === 0) return -1; // Root folder is always first
                        if (b.id === 0) return 1; // Root folder is always first
                        return b.label.localeCompare(a.label);
                    });
                    break;
                case 'id-ASC':
                    folders_ordered = Object.values(folders_ordered).sort(function (a, b) {
                        if (a.id === 0) return -1; // Root folder is always first
                        if (b.id === 0) return 1; // Root folder is always first
                        return a.id - b.id;
                    });
                    break;
                case 'id-DESC':
                    folders_ordered = Object.values(folders_ordered).sort(function (a, b) {
                        if (a.id === 0) return -1; // Root folder is always first
                        if (b.id === 0) return 1; // Root folder is always first
                        return b.id - a.id;
                    });
                    break;
                case 'custom':
                    folders_ordered = Object.values(folders_ordered).sort(function (a, b) {
                        if (a.id === 0) return -1; // Root folder is always first
                        if (b.id === 0) return 1; // Root folder is always first
                        return a.order - b.order;
                    });
                    break;
            }

            // Reorder array based on children
            let folders_ordered_deep = [];
            let processed_ids = [];
            const loadChildren = function (id) {
                if (processed_ids.indexOf(id) < 0) {
                    processed_ids.push(id);
                    for (let ij = 0; ij < folders_ordered.length; ij++) {
                        if (folders_ordered[ij].parent_id === id) {
                            folders_ordered_deep.push(folders_ordered[ij]);
                            loadChildren(folders_ordered[ij].id);
                        }
                    }
                }
            };
            loadChildren(parseInt(wpmf.vars.term_root_id));

            // Finally save it to the global var
            wpmfImportCloudModule.categories = folders_ordered_deep;

        },

        /**
         * open folder tree by dir name
         */
        getRendering: function () {
            var ij = 0;
            var content = '';
            var generateList = function (tree_class = '') {
                content += '<ul class="' + tree_class + '">';
                while (ij < wpmfImportCloudModule.categories.length) {
                    var className = '';
                    if (typeof wpmfImportCloudModule.categories[ij].drive_type !== "undefined" && wpmfImportCloudModule.categories[ij].drive_type !== "") {
                        className += ' hide';
                    }

                    // get color folder
                    var bgcolor = '';
                    if (typeof wpmf.vars.colors !== 'undefined' && typeof wpmf.vars.colors[wpmfImportCloudModule.categories[ij].id] !== 'undefined' && wpmfFoldersModule.folder_design === 'material_design') {
                        bgcolor = 'color: ' + wpmf.vars.colors[wpmfImportCloudModule.categories[ij].id];
                    } else {
                        bgcolor = 'color: #8f8f8f';
                    }

                    className += ' closed';
                    // Open li tag
                    content += '<li class="' + className + '" data-id="' + wpmfImportCloudModule.categories[ij].id + '" >';

                    const a_tag = '<a data-id="' + wpmfImportCloudModule.categories[ij].id + '">';
                    if (wpmfImportCloudModule.categories[ij + 1] && wpmfImportCloudModule.categories[ij + 1].depth > wpmfImportCloudModule.categories[ij].depth) { // The next element is a sub folder
                        // Add folder icon
                        content += '<a onclick="wpmfImportCloudModule.toggle(' + wpmfImportCloudModule.categories[ij].id + ')"><i class="material-icons wpmf-arrow">keyboard_arrow_down</i></a>';
                        content += a_tag;
                        content += '<input type="radio" name="selection_folder_import" class="wpmf_checkbox_tree selection_folder_import" value="'+ wpmfImportCloudModule.categories[ij].id +'" data-id="' + wpmfImportCloudModule.categories[ij].id + '">';
                        content += '<i class="material-icons-outlined folder-tree-icon" style="' + bgcolor + '">folder</i>';
                    } else {
                        content += a_tag;
                        // Add folder icon
                        content += '<span class="wpmf-no-arrow"><input type="radio" name="selection_folder_import" class="wpmf_checkbox_tree selection_folder_import" value="'+ wpmfImportCloudModule.categories[ij].id +'" data-id="' + wpmfImportCloudModule.categories[ij].id + '"><i class="material-icons-outlined folder-tree-icon" style="' + bgcolor + '">folder</i></span>';
                    }

                    // Add current category name
                    if (wpmfImportCloudModule.categories[ij].id === 0) {
                        // If this is the root folder then rename it
                        content += wpmf.l18n.media_folder;
                    } else {
                        content += '<span>' + wpmfImportCloudModule.categories[ij].label + '</span>';
                    }

                    content += '</a>';
                    // This is the end of the array
                    if (wpmfImportCloudModule.categories[ij + 1] === undefined) {
                        // Let's close all opened tags
                        for (let ik = wpmfImportCloudModule.categories[ij].depth; ik >= 0; ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We are at the end don't continue to process array
                        return false;
                    }


                    if (wpmfImportCloudModule.categories[ij + 1].depth > wpmfImportCloudModule.categories[ij].depth) { // The next element is a sub folder
                        // Recursively list it
                        ij++;
                        if (generateList() === false) {
                            // We have reached the end, let's recursively end
                            return false;
                        }
                    } else if (wpmfImportCloudModule.categories[ij + 1].depth < wpmfImportCloudModule.categories[ij].depth) { // The next element don't have the same parent
                        // Let's close opened tags
                        for (let ik = wpmfImportCloudModule.categories[ij].depth; ik > wpmfImportCloudModule.categories[ij + 1].depth; ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We're not at the end of the array let's continue processing it
                        return true;
                    }

                    // Close the current element
                    content += '</li>';
                    ij++;
                }
            };
            generateList('wpmf_media_library');
            return content;
        },

        /**
         * Toggle the open / closed state of a folder
         * @param folder_id
         */
        toggle: function (folder_id) {
            // get last status folder tree
            let lastStatusTree = [];
            // Check is folder has closed class
            if (wpmfImportCloudModule.getTreeElement().find('li[data-id="' + folder_id + '"]').hasClass('closed')) {
                // Open the folder
                wpmfImportCloudModule.openFolder(folder_id);
                $('#librarytree li[data-id="'+ folder_id +'"] > a >.folder-tree-icon').html('folder_open');
            } else {
                // Close the folder
                wpmfImportCloudModule.closeFolder(folder_id);
                // close all sub folder
                $('li[data-id="' + folder_id + '"]').find('li').addClass('closed');
                $('#librarytree li[data-id="'+ folder_id +'"] > a >.folder-tree-icon').html('folder')
            }
        },

        /**
         * Open a folder to show children
         */
        openFolder: function (folder_id) {
            wpmfImportCloudModule.getTreeElement().find('li[data-id="' + folder_id + '"]').removeClass('closed');
            wpmfImportCloudModule.folders_states[folder_id] = 'open';
        },

        /**
         * Close a folder and hide children
         */
        closeFolder: function (folder_id) {
            wpmfImportCloudModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('closed');
            wpmfImportCloudModule.folders_states[folder_id] = 'close';
        },

        showdialog: function (is_multiple, library_type = 'cloud-library-files', files = [], mimeTypes = [], filenames = [], source = 'photos') {
            var text = '';
            text += '<div id="librarytree" class="librarytree librarytree_cloudimport"></div>';
            if (library_type === 'google-photo' && source === 'album') {
                var albumTitle = $('.photo-album-item.selected .album-title span').text();
                text += '<div class="import_album_as_new_folder">';
                text += '<label>'+ wpmf.l18n.import_album_as_new_folder +'</label>';
                text += '<input type="checkbox" checked class="enable_import_album_as_new_folder">';
                text += '<input type="text" class="album-title-input" value="'+ albumTitle +'">';
                text += '</div>';
            }

            showDialog({
                title: (library_type === 'cloud-library-files') ? wpmf.l18n.import_cloud_title : wpmf.l18n.import_google_photo_title,
                id: (library_type === 'google-photo') ? 'wpmf-google-photo-dialog' : 'wpmf-cloud-dialog',
                text: text,
                negative: {
                    title: wpmf.l18n.cancel
                },
                positive: {
                    title: wpmf.l18n.import,
                    onClick: function () {
                        if (!$('.selection_folder_import:checked').length) {
                            return;
                        }

                        var folder = $('.selection_folder_import:checked').val();
                        if (library_type === 'cloud-library-files') {
                            var filesselected;
                            if (is_multiple) {
                                filesselected = [];
                                var selection = wp.media.frame.state().get('selection');
                                if (typeof selection !== "undefined" && typeof selection === "object") {
                                    selection.map(function (file) {
                                        var file_details = file.toJSON();
                                        filesselected.push(file_details.id);
                                    });
                                }
                            } else {
                                filesselected = [];
                                filesselected.push(wpmfFoldersModule.editFileId);
                            }

                            var ids = filesselected.join();

                            wpmfImportCloudModule.importCloud(ids, folder);
                        } else if (library_type === 'google-photo') {
                            if (source === 'album') {
                                var albumId = $('.photo-album-item.selected').data('id');
                                var album_title = $('.album-title-input').val();
                                if (album_title === '') {
                                    album_title = $('.photo-album-item.selected .album-title span').text();
                                }

                                wpmfImportCloudModule.importGooglePhotoAlbum(albumId, album_title, folder);
                            } else {
                                wpmfImportCloudModule.importGooglePhoto(files, mimeTypes, filenames, folder);
                            }
                        }
                    }
                }
            });
        },

        importGooglePhotoAlbum: function(albumId, album_title, folder, pageToken = '', created_album = false) {
            var datas = {
                action: 'wpmf_google_photo_album_import',
                albumId: albumId,
                pageToken: pageToken,
                folder: folder,
                wpmf_nonce: wpmf.vars.wpmf_nonce
            };

            if ($('.enable_import_album_as_new_folder').is(':checked')) {
                datas.album_title = album_title;
                datas.created_album = (created_album) ? 1 : 0;
            } else {
                datas.created_album = 1;
            }

            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: datas,
                beforeSend: function () {
                    if (!$('.wpmf-snackbar[data-id="importing_cloud_file"]').length) {
                        wpmfSnackbarModule.show({
                            id: 'importing_cloud_file',
                            content: wpmf.l18n.importing_goolge_photo_album,
                            auto_close: false,
                            is_progress: true
                        });
                    }
                },
                success: function (res) {
                    if (res.status) {
                        if (res.continue) {
                            wpmfImportCloudModule.importGooglePhotoAlbum(albumId, album_title, res.albumCreatedId, res.pageToken, true);
                        } else {
                            let $snack = wpmfSnackbarModule.getFromId('importing_cloud_file');
                            wpmfSnackbarModule.close($snack);
                        }
                    } else {
                        let $snack = wpmfSnackbarModule.getFromId('importing_cloud_file');
                        wpmfSnackbarModule.close($snack);
                    }
                },
            });
        },

        importGooglePhoto: function (files, mimeTypes, filenames, folder, page = 0) {
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action: 'wpmf_google_photo_import',
                    files: files.join(),
                    mimeTypes: mimeTypes.join(),
                    filenames: filenames.join(),
                    page: page,
                    folder: folder,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                beforeSend: function () {
                    if (!$('.wpmf-snackbar[data-id="importing_cloud_file"]').length) {
                        wpmfSnackbarModule.show({
                            id: 'importing_cloud_file',
                            content: wpmf.l18n.importing_goolge_photo,
                            auto_close: false,
                            is_progress: true
                        });
                    }
                },
                success: function (res) {
                    if (res.status) {
                        if (res.continue) {
                            page++;
                            wpmfImportCloudModule.importGooglePhoto(files, mimeTypes, filenames, folder, page);
                        } else {
                            let $snack = wpmfSnackbarModule.getFromId('importing_cloud_file');
                            wpmfSnackbarModule.close($snack);
                        }
                    } else {
                        let $snack = wpmfSnackbarModule.getFromId('importing_cloud_file');
                        wpmfSnackbarModule.close($snack);
                    }
                },
            });
        },

        importCloud: function (ids, folder) {
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action: 'wpmf_cloud_import',
                    ids: ids,
                    folder: folder,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                }, beforeSend: function () {
                    if (!$('.wpmf-snackbar[data-id="importing_cloud_file"]').length) {
                        wpmfSnackbarModule.show({
                            id: 'importing_cloud_file',
                            content: wpmf.l18n.importing_cloud_file,
                            auto_close: false,
                            is_progress: true
                        });
                    }
                },
                success: function (res) {
                    if (res.status) {
                        if (res.continue) {
                            wpmfImportCloudModule.importCloud(res.ids, folder);
                        } else {
                            let $snack = wpmfSnackbarModule.getFromId('importing_cloud_file');
                            wpmfSnackbarModule.close($snack);
                            if ($('.media-frame').hasClass('mode-select')) {
                                $('.select-mode-toggle-button').click();
                            }
                            wpmfFoldersModule.reloadAttachments();
                        }
                    }
                },
            });
        }
    };

    // Let's initialize WPMF folder tree features
    $(document).ready(function () {
        if (typeof wp === "undefined") {
            return;
        }

        if ((wpmf.vars.wpmf_pagenow === 'upload.php' && !wpmfFoldersModule.page_type) || typeof wp.media === "undefined") {
            return;
        }

        if (wpmfFoldersModule.page_type !== 'upload-list') {
            // Wait for the main wpmf module to be ready
            wpmfFoldersModule.on('ready', function ($current_frame) {
                if (!$('.upload-php .open-cloud-import').length) {
                    $('.upload-php .media-frame-content .media-toolbar-secondary').append('<button class="button open-cloud-import media-button button-large">' + wpmf.l18n.import_cloud_btn + '</button>');
                    $('.open-cloud-import').on('click', function () {
                        wpmfImportCloudModule.showdialog(true);
                        wpmfImportCloudModule.initModule();
                        wpmfFoldersModule.houtside();
                    });

                    if (typeof wpmfFoldersModule.categories[wpmfFoldersModule.last_selected_folder].drive_type !== "undefined" && wpmfFoldersModule.categories[wpmfFoldersModule.last_selected_folder].drive_type !== "") {
                        $('.open-cloud-import ').removeClass('hide');
                    } else {
                        $('.open-cloud-import ').addClass('hide');
                    }

                    wpmfFoldersModule.on('changeFolder', function (folder_id) {
                        if (typeof wpmfFoldersModule.categories[folder_id].drive_type !== "undefined" && wpmfFoldersModule.categories[folder_id].drive_type !== "") {
                            $('.open-cloud-import').removeClass('hide');
                        } else {
                            $('.open-cloud-import ').addClass('hide');
                        }
                    });
                }
            });
        }
    });

}(jQuery));