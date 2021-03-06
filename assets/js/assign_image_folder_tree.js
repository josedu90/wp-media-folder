(function ($) {
    wpmfAssignModule = {
        options: {},
        /**
         * Initialize module related things
         */
        initModule: function ($current_frame) {
            wpmfAssignModule.options = {
                'root': '/',
                'showroot': wpmf.l18n.assign_tree_label,
                'onclick': function (elem, type, file) {
                },
                'oncheck': function (elem, checked, type, file) {
                },
                'usecheckboxes': true, //can be true files dirs or false
                'expandSpeed': 500,
                'collapseSpeed': 500,
                'expandEasing': null,
                'collapseEasing': null,
                'canselect': true
            };

            // add Media folder selection button on toolbar
            if (!$current_frame.find('.open-popup-tree-multiple').length) {
                $current_frame.find('.media-frame-content .media-toolbar-secondary .delete-selected-button').after('<button class="button open-popup-tree-multiple media-button button-large"><i class="zmdi zmdi-folder-outline"></i>' + wpmf.l18n.assign_tree_label + '</button>');
                wpmfAssignModule.treeshowdialog();

                if (typeof wpmfFoldersModule.categories[wpmfFoldersModule.last_selected_folder].drive_type !== "undefined" && wpmfFoldersModule.categories[wpmfFoldersModule.last_selected_folder].drive_type !== "") {
                    $('.open-popup-tree-multiple').addClass('hide');
                } else {
                    $('.open-popup-tree-multiple').removeClass('hide');
                }

                wpmfFoldersModule.on('changeFolder', function (folder_id) {
                    if (typeof wpmfFoldersModule.categories[folder_id] !== "undefined" && typeof wpmfFoldersModule.categories[folder_id].drive_type !== "undefined" && wpmfFoldersModule.categories[folder_id].drive_type !== "") {
                        $('.open-popup-tree-multiple').addClass('hide');
                    } else {
                        $('.open-popup-tree-multiple').removeClass('hide');
                    }
                });
            }
        },
        initTree: function () {
            $assignimagetree = $('#wpmfjaoassign');
            if (!$assignimagetree) {
                return;
            }

            if (wpmfAssignModule.options.showroot !== '') {
                var tree_init = '';
                tree_init += '<ul class="jaofiletree">';
                tree_init += '<li data-id="0" class="directory collapsed selected" data-group="' + wpmf.vars.wpmf_current_userid + '">';
                tree_init += '<div class="pure-checkbox">';
                tree_init += '<input type="checkbox" id="/" class="wpmf_checkbox_tree" value="wpmf_' + wpmf.vars.root_media_root + '" data-id="' + wpmf.vars.root_media_root + '">';
                tree_init += '<label class="checked" for="/">';
                tree_init += '<a class="title-folder title-root" data-id="0">' + wpmfAssignModule.options.showroot + '</a>';
                tree_init += '</label>';
                tree_init += '</div>';
                tree_init += '</li>';
                tree_init += '</ul>';
                $assignimagetree.html(tree_init);
            }

            wpmfAssignModule.openfolderassign(0);
        },
        /**
         * open folder tree by dir name
         */
        openfolderassign: function (id) {
            if (typeof $assignimagetree === "undefined")
                return;
            if ($assignimagetree.find('a[data-id="' + id + '"]').closest('li').hasClass('expanded') || $assignimagetree.find('a[data-id="' + id + '"]').closest('li').hasClass('wait')) {
                if (typeof callback === 'function')
                    callback();
                return;
            }
            /* ajax get tree assign */
            var ret;
            ret = $.ajax({
                method: 'POST',
                url: ajaxurl,
                data: {
                    id: id,
                    attachment_id: wpmfFoldersModule.editFileId,
                    action: 'wpmf',
                    task: 'get_assign_tree',
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                context: $assignimagetree,
                dataType: 'json',
                beforeSend: function () {
                    this.find('a[data-id="' + id + '"]').closest('li').addClass('wait');
                }
            }).done(function (res) {

                var selectedId = $('#wpmfjaoassign').find('.directory.selected').data('id');
                ret = '<ul class="jaofiletree">';
                if (res.status) {
                    var datas = res.dirs;
                    if ((!$('.media-frame').hasClass('mode-select') && $('body').hasClass('upload-php')) || !$('body').hasClass('upload-php')) {
                        if (res.root_check) {
                            $('.wpmf_checkbox_tree[data-id="' + wpmf.vars.root_media_root + '"]').prop('checked', true);
                        }
                    }

                    for (var ij = 0; ij < datas.length; ij++) {
                        if (wpmf.vars.root_media_root !== datas[ij].id) {
                            var classe = 'directory collapsed';
                            if (parseInt(datas[ij].id) === parseInt(selectedId)) {
                                classe += ' selected';
                            }

                            ret += '<li class="' + classe + '" data-id="' + datas[ij].id + '" data-parent_id="' + datas[ij].parent_id + '" data-group="' + datas[ij].term_group + '">';
                            if (datas[ij].count_child > 0) {
                                ret += '<div class="icon-open-close" data-id="' + datas[ij].id + '" data-parent_id="' + datas[ij].parent_id + '"></div>';
                            } else {
                                ret += '<div class="icon-open-close" data-id="' + datas[ij].id + '" data-parent_id="' + datas[ij].parent_id + '" style="opacity:0"></div>';
                            }

                            ret += '<div class="pure-checkbox">';

                            if ($('.media-frame').hasClass('mode-select') && $('body').hasClass('upload-php')) {
                                ret += '<input type="checkbox" id="wpmf_folder_selection' + datas[ij].id + '" class="wpmf_checkbox_tree" value="wpmf_' + datas[ij].id + '" data-id="' + datas[ij].id + '">';
                            } else {
                                if (datas[ij].checked) {
                                    ret += '<input type="checkbox" checked id="wpmf_folder_selection' + datas[ij].id + '" class="wpmf_checkbox_tree" value="wpmf_' + datas[ij].id + '" data-id="' + datas[ij].id + '">';
                                } else {
                                    ret += '<input type="checkbox" id="wpmf_folder_selection' + datas[ij].id + '" class="wpmf_checkbox_tree" value="wpmf_' + datas[ij].id + '" data-id="' + datas[ij].id + '">';
                                }
                            }

                            if (datas[ij].checked) {
                                ret += '<label class="check" for="wpmf_folder_selection' + datas[ij].id + '">';
                            } else {
                                if (datas[ij].pchecked) {
                                    ret += '<label class="pchecked" for="wpmf_folder_selection' + datas[ij].id + '">';
                                    ret += '<span class="ppp"></span>'
                                } else {
                                    ret += '<label for="wpmf_folder_selection' + datas[ij].id + '">';
                                }
                            }

                            if (parseInt(datas[ij].id) === parseInt(selectedId)) {
                                ret += '<i class="zmdi wpmf-zmdi-folder-open"></i>';
                            } else {
                                ret += '<i class="zmdi zmdi-folder-outline"></i>';
                            }
                            ret += '<a class="title-folder" data-id="' + datas[ij].id + '" data-parent_id="' + datas[ij].parent_id + '">' + datas[ij].name + '</a>';
                            ret += '</label>';
                            ret += '</div';
                            ret += '</li>';
                        }
                    }
                }
                ret += '</ul>';

                this.find('a[data-id="' + id + '"]').closest('li').removeClass('wait').removeClass('collapsed').addClass('expanded');
                this.find('a[data-id="' + id + '"]').closest('li').append(ret);
                this.find('a[data-id="' + id + '"]').closest('li').children('.jaofiletree').slideDown(wpmfAssignModule.options.expandSpeed, wpmfAssignModule.options.expandEasing,
                    function () {
                        $assignimagetree.trigger('afteropen');
                        $assignimagetree.trigger('afterupdate');
                        if (typeof callback === 'function')
                            callback();
                    });

                wpmfAssignModule.seteventsassign();

            }).done(function () {
                $assignimagetree.trigger('afteropen');
                $assignimagetree.trigger('afterupdate');
            });
        },

        /**
         * close folder tree by dir name
         * @param id
         */
        closedirassign: function (id) {
            if (typeof $assignimagetree === "undefined") {
                return;
            }

            $assignimagetree.find('a[data-id="' + id + '"]').closest('li').children('.jaofiletree').slideUp(wpmfAssignModule.options.collapseSpeed, wpmfAssignModule.options.collapseEasing, function () {
                $(this).remove();
            });

            $assignimagetree.find('a[data-id="' + id + '"]').closest('li').removeClass('expanded').addClass('collapsed');
            wpmfAssignModule.seteventsassign();

            /* Trigger custom event */
            $assignimagetree.trigger('afterclose');
            $assignimagetree.trigger('afterupdate');
        },

        /**
         * init event click to open/close folder tree
         */
        seteventsassign: function () {
            var $assignimagetree = $('#wpmfjaoassign');
            $assignimagetree.find('li a,li .icon-open-close').unbind('click');
            //Bind for collapse or expand elements
            $assignimagetree.find('li.directory a').bind('click', function (e) {
                e.preventDefault();
                $assignimagetree.find('li').removeClass('selected');
                $assignimagetree.find('i.zmdi').removeClass('wpmf-zmdi-folder-open').addClass("zmdi-folder-outline");
                $(this).closest('li').addClass("selected");
                $(this).closest('li').find(' > .pure-checkbox i.zmdi').removeClass("zmdi-folder-outline").addClass("wpmf-zmdi-folder-open");
                wpmfAssignModule.openfolderassign($(this).attr('data-id'));
            });

            /* open folder tree use icon */
            $assignimagetree.find('li.directory.collapsed .icon-open-close').bind('click', function () {
                wpmfAssignModule.openfolderassign($(this).attr('data-id'));
            });

            /* close folder tree use icon */
            $assignimagetree.find('li.directory.expanded .icon-open-close').bind('click', function () {
                wpmfAssignModule.closedirassign($(this).attr('data-id'));
            });
            /* Check/uncheck folder */
            $assignimagetree.find('li.directory.expanded .wpmf_checkbox_tree').bind('click', function () {
                if ($(this).is(':checked')) {
                    $(this).closest('.pure-checkbox').find('label').removeClass('pchecked').addClass('checked');
                } else {
                    $(this).closest('.pure-checkbox').find('label').removeClass('checked');
                }
            });
        },

        /**
         * showdialog
         */
        showdialog: function (type) {
            showDialog({
                title: wpmf.l18n.label_assign_tree,
                id: 'ju-dialog',
                text: '<span id="wpmfjaoassign" class="wpmflocaltree"></span>',
                negative: {
                    title: wpmf.l18n.cancel
                },
                positive: {
                    title: wpmf.l18n.label_apply,
                    onClick: function () {
                        wpmfAssignModule.wpmf_set_term(type);
                    }
                }
            });
        },

        /**
         * Show dialog for tree
         */
        treeshowdialog: function () {
            $('.open-popup-tree, .open-popup-tree-multiple').on('click', function () {
                var $this = $(this);
                if ($('.wpmf-folder_selection').length === 0) {
                    $('body').append('<div class="wpmf-folder_selection" data-wpmftype="folder_selection" data-timeout="3000" data-html-allowed="true" data-content="' + wpmf.l18n.folder_selection + '"></div>');
                }

                if ($this.hasClass('open-popup-tree')) {
                    wpmfAssignModule.showdialog('one');
                } else {
                    wpmfAssignModule.showdialog('multiple');
                }

                wpmfFoldersModule.editFileId = $('.wpmf_attachment_id').val();
                if (typeof wpmfFoldersModule.editFileId === "undefined")
                    wpmfFoldersModule.editFileId = $('#post_ID').val();
                wpmfAssignModule.initTree();
            });
        },

        /**
         * Set files to folder
         */
        wpmf_set_term: function (type) {
            var wpmf_term_ids_check = [];
            $('.wpmf_checkbox_tree').each(function (i, v) {
                if ($(v).is(':checked')) {
                    wpmf_term_ids_check.push($(v).data('id'));
                }
            });

            var selectedId = $('.wpmf-categories option:selected').data('id');
            if (parseInt(selectedId) === 0) selectedId = wpmf.vars.root_media_root;
            selectedId = parseInt(selectedId);
            if (type === 'one') {
                var attachment_id = wpmfFoldersModule.editFileId;
            } else {
                attachment_id = [];
                $('li.attachment.selected').each(function (i, v) {
                    attachment_id.push($(v).data('id'));
                });
                attachment_id = attachment_id.join();
            }

            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action: 'wpmf',
                    task: 'set_object_term',
                    wpmf_term_ids_check: wpmf_term_ids_check.join(),
                    attachment_id: attachment_id,
                    wpmf_nonce: wpmf.vars.wpmf_nonce
                },
                success: function () {
                    // Show snackbar
                    wpmfSnackbarModule.show({
                        content: wpmf.l18n.folder_selection
                    });
                    wpmfFoldersModule.reloadAttachments();
                    // Reload the folders to update
                    wpmfFoldersModule.renderFolders();
                }
            });
        },

        /**
         * Create media folder selection setting
         * @returns {string}
         */
        genFormassigntree: function () {
            //noinspection UnnecessaryLocalVariableJS,UnnecessaryLocalVariableJS,UnnecessaryLocalVariableJS,UnnecessaryLocalVariableJS,UnnecessaryLocalVariableJS,UnnecessaryLocalVariableJS,UnnecessaryLocalVariableJS
            if (typeof wpmfFoldersModule.categories[wpmfFoldersModule.last_selected_folder].drive_type !== "undefined" && wpmfFoldersModule.categories[wpmfFoldersModule.last_selected_folder].drive_type !== "") {
                return '';
            } else {
                return '<div class="wpmfjaoassign_row"><div class="wpmfjaoassign_left"></div><div class="wpmfjaoassign_right"><a class="open-popup-tree"><i class="zmdi zmdi-folder-outline"></i>' + wpmf.l18n.assign_tree_label + '</a></div></div>';
            }
        }
    };

    // Let's initialize WPMF folder tree features
    $(document).ready(function () {
        // only run in list view and grid view in upload.php page
        if (typeof wp === "undefined") {
            return;
        }

        if ((wpmf.vars.wpmf_pagenow === 'upload.php' && !wpmfFoldersModule.page_type) || typeof wp.media === "undefined") {
            return;
        }

        if (wpmfFoldersModule.page_type !== 'upload-list') {
            // Wait for the main wpmf module to be ready
            wpmfFoldersModule.on('ready', function ($current_frame) {
                wpmfAssignModule.initModule($current_frame);
            });

            /* base on /wp-includes/js/media-views.js */
            var wpmfAssigntreeform = wp.media.view.AttachmentsBrowser;
            if (typeof wpmfAssigntreeform !== "undefined") {
                wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
                    createSingle: function () {
                        /* Create media folder selection setting */
                        wpmfAssigntreeform.prototype.createSingle.apply(this, arguments);
                        var sidebar = this.sidebar;
                        var wpmf_form_tree = wpmfAssignModule.genFormassigntree();
                        if (wpmf.vars.wpmf_pagenow !== 'upload.php') {
                            $('.wpmfjaoassign_row').remove();
                            $(sidebar.$el).find('.attachment-details').append(wpmf_form_tree);
                            wpmfAssignModule.treeshowdialog();
                        }

                    }
                });
            }

            /* Create media folder selection setting when wp smush plugin active*/
            if (wpmf.vars.get_plugin_active.indexOf('wp-smush.php') !== -1) {
                if( 'undefined' !== typeof wp.media.view &&
                    'undefined' !== typeof wp.media.view.Attachment.Details.TwoColumn ) {
                    // Local instance of the Attachment Details TwoColumn used in the edit attachment modal view
                    var wpmfAssignMediaTwoColumn = wp.media.view.Attachment.Details.TwoColumn;

                    /**
                     * Add Smush details to attachment.
                     */
                    if (typeof wpmfAssignMediaTwoColumn !== "undefined") {
                        wp.media.view.Attachment.Details.TwoColumn = wp.media.view.Attachment.Details.TwoColumn.extend({
                            render: function () {
                                // Get Smush status for the image
                                wpmfAssignMediaTwoColumn.prototype.render.apply(this);
                                var $this = this;
                                var wpmf_form_tree = wpmfAssignModule.genFormassigntree();
                                $( document ).ajaxComplete(function( event, xhr, settings ) {
                                    var data = settings.data;
                                    if ( data.indexOf('smush_get_attachment_details') !== -1 ) {
                                        $('.wpmfjaoassign_row').remove();
                                        $this.$el.find('.attachment-info .settings').append(wpmf_form_tree);
                                        wpmfAssignModule.treeshowdialog();
                                    }
                                });
                            }
                        });
                    }
                }
            }

            /* base on /wp-includes/js/media-views.js */
            var wpmfAssigntree = wp.media.view.Modal;
            if (typeof wpmfAssigntree !== "undefined") {
                wp.media.view.Modal = wp.media.view.Modal.extend({
                    open: function () {
                        /* Create media folder selection setting */
                        wpmfAssigntree.prototype.open.apply(this, arguments);
                        if (wpmf.vars.wpmf_pagenow === 'upload.php') {
                            var wpmf_form_tree = wpmfAssignModule.genFormassigntree();
                            var myVar = setInterval(function () {
                                if ($('.attachment-info .settings').length) {
                                    clearInterval(myVar);
                                }
                                $('.wpmfjaoassign_row').remove();
                                $('.attachment-info .settings').append(wpmf_form_tree);
                                wpmfAssignModule.treeshowdialog();
                            }, 300);
                        }
                    }
                });
            }

            if (wpmf.vars.wpmf_pagenow === 'upload.php' && wpmfFoldersModule.page_type !== 'upload-list') {
                // create media folder selection setting when next and prev media items
                var myFolderEditAttachments = wp.media.view.MediaFrame.EditAttachments;
                if (typeof myFolderEditAttachments !== "undefined") {
                    wp.media.view.MediaFrame.EditAttachments = wp.media.view.MediaFrame.EditAttachments.extend({
                        previousMediaItem: function () {
                            /* Create duplicate button setting */
                            myFolderEditAttachments.prototype.previousMediaItem.apply(this, arguments);
                            var wpmf_form_tree = wpmfAssignModule.genFormassigntree();
                            var myVar = setInterval(function () {
                                if ($('.attachment-info .settings').length) {
                                    clearInterval(myVar);
                                }
                                $('.wpmfjaoassign_row').remove();
                                $('.attachment-info .settings').append(wpmf_form_tree);
                                wpmfAssignModule.treeshowdialog();
                            }, 300);
                        },

                        nextMediaItem: function () {
                            /* Create duplicate button setting */
                            myFolderEditAttachments.prototype.nextMediaItem.apply(this, arguments);
                            var wpmf_form_tree = wpmfAssignModule.genFormassigntree();
                            var myVar = setInterval(function () {
                                if ($('.attachment-info .settings').length) {
                                    clearInterval(myVar);
                                }
                                $('.wpmfjaoassign_row').remove();
                                $('.attachment-info .settings').append(wpmf_form_tree);
                                wpmfAssignModule.treeshowdialog();
                            }, 300);
                        }
                    });
                }
            }
        }
    });

}(jQuery));