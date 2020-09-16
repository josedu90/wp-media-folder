(function ($) {
    if (typeof ajaxurl === "undefined") {
        ajaxurl = wpmfimport.vars.ajaxurl;
    }

    $(document).ready(function () {
        /**
         * Import size and filetype
         * @param page
         */
        var wpmfimport_meta_size = function (page) {
            var $this = jQuery('#wmpfImportsize');
            $this.find(".spinner").show().css({"visibility": "visible"});
            /* Ajax import */
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: "wpmf_import_size_filetype",
                    wpmf_current_page: page,
                    wpmf_nonce: wpmfimport.vars.wpmf_nonce
                },
                success: function (res) {
                    if (res.status) {
                        if (res.continue) {
                            wpmfimport_meta_size(parseInt(page) + 1)
                        } else {
                            $this.closest("div#wpmf_error").hide();
                        }
                    }
                }
            });
        };

        $('#wmpfImportsize').on('click', function () {
            wpmfimport_meta_size(0);
        });
    });
}(jQuery));