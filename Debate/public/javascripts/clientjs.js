var detectEmotionBtn = function (){
    var retrieverBtn = $('button.emotion-retriever');
    retrieverBtn.on('click', function(){
        var buttonId = this.id;
        $.ajax({
            type: 'POST',
            url: '/api/images/emotiondetect/' + buttonId,
            data: {  },
            dataType: 'json',
            success: function(data){
                var responseContainer = $('.ajax-response-container' + buttonId);
                //console.log(JSON.stringify(data.scores, null, ''));
                var scores = JSON.stringify(data[0].scores);
                responseContainer.html('<h2>' + data[0].emotion + '</h2>' +
                    '<div style="max-width: 564px;"><p><pre>'+ scores +'</pre></p></div>');
            },
            error: function(xhr, type){
                alert('AJAX response returned and error' + xhr + ' ' + type);
            }
        })
    });
};

var tweet = function (){
    var retrieverBtn = $('button.tweet-button');
    retrieverBtn.on('click', function(){
        //var image = $('img[data-imgid='+ this.dataset.imgid + ']');
        var inputBox = $('input[data-imgid='+ this.dataset.imgid + ']')[0];
        var imgid = this.dataset.imgid;
        $.ajax({
            type: 'POST',
            url: '/tweet/',
            data:
            {
              imageid : this.imgid,
              text : inputBox.value
            },
            context: this,
            dataType: 'json',
            beforeSend: function() {
              var tweetBtn = $("button[data-imgid='" + this.dataset.imgid + "']").filter(".tweet-button");
              $('<div id="waiting" class="spinner"><div class="rect1"></div>'
                      +  '<div class="rect2"></div>'
                      +    '<div class="rect3"></div>'
                      +    '<div class="rect4"></div>'
                      +    '<div class="rect5"></div>'
                      +  '</div>').insertAfter(tweetBtn);
            },
            complete: function() {
              $('#waiting').remove();
            },
            success: function(data){
              $('.tweet-status').filter("div[data-imgid='" + this.dataset.imgid + "']").addClass('ok-icon');
            },
            error: function(xhr, type){
              $('.tweet-status').filter("div[data-imgid='" + this.dataset.imgid + "']").addClass('error-icon');
              console.log('AJAX response returned and error' + JSON.stringify(xhr) + ' ' + type);
            }
        })
    });
};
