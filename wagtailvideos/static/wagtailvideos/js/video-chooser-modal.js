var VIDEO_CHOOSER_MODAL_ONLOAD_HANDLERS = {
  'chooser': function (modal, jsonData) {
    var searchUrl = $('form.video-search', modal.body).attr('action');

    /* currentTag stores the tag currently being filtered on, so that we can
    preserve this when paginating */
    var currentTag;

    function ajaxifyLinks(context) {
        $('.listing a', context).click(function () {
            modal.loadUrl(this.href);
            return false;
        });

        $('.pagination a', context).click(function () {
            var page = this.getAttribute("data-page");
            setPage(page);
            return false;
        });
    }

    function fetchResults(requestData) {
        $.ajax({
            url: searchUrl,
            data: requestData,
            success: function (data, status) {
                $('#image-results').html(data);
                ajaxifyLinks($('#image-results'));
            }
        });
    }

    function search() {
        /* Searching causes currentTag to be cleared - otherwise there's
        no way to de-select a tag */
        currentTag = null;
        fetchResults({
            q: $('#id_q').val(),
            collection_id: $('#collection_chooser_collection_id').val()
        });
        return false;
    }

    function setPage(page) {
        var params = { p: page };
        if ($('#id_q').val().length) {
            params['q'] = $('#id_q').val();
        }
        if (currentTag) {
            params['tag'] = currentTag;
        }
        params['collection_id'] = $('#collection_chooser_collection_id').val();
        fetchResults(params);
        return false;
    }

    ajaxifyLinks(modal.body);

    $('form.video-upload', modal.body).submit(function () {
        var formdata = new FormData(this);
        $.ajax({
            url: this.action,
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            dataType: 'text',
            success: function (response) {
                modal.loadResponseText(response);
            },
            error: function (response, textStatus, errorThrown) {
                var message = jsonData['error_message'] + '<br />' + errorThrown + ' - ' + response.status;
                $('#upload').append(
                    '<div class="help-block help-critical">' +
                    '<strong>' + jsonData['error_label'] + ': </strong>' + message + '</div>');
            }
        });

        return false;
    });

    $('form.video-search', modal.body).submit(search);

    $('#id_q').on('input', function () {
        clearTimeout($.data(this, 'timer'));
        var wait = setTimeout(search, 200);
        $(this).data('timer', wait);
    });
    $('#collection_chooser_collection_id').change(search);
    $('a.suggested-tag').click(function () {
        currentTag = $(this).text();
        $('#id_q').val('');
        fetchResults({
            'tag': currentTag,
            collection_id: $('#collection_chooser_collection_id').val()
        });
        return false;
    });
    /* Add tag entry interface (with autocompletion) to the tag field of the image upload form */
    // $('#id_tags', modal.body).tagit({
    //     autocomplete: {source: "{{ autocomplete_url|addslashes }}"}
    // });
  },
  'video_chosen': function (modal, jsonData) {
      modal.respond('videoChosen', jsonData['result']);
      modal.close();
  },
}
