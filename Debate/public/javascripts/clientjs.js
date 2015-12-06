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
        console.log("dataset: " + this.dataset.imgid);
        console.log("inputbox: " + inputBox.value);
        $.ajax({
            type: 'POST',
            url: '/tweet/',
            data:
            {
              imageid : imgid,
              text : inputBox.value
            },
            dataType: 'json',
            success: function(data){
                alert("Tweet posted succesfully!");
            },
            error: function(xhr, type){
                alert('AJAX response returned and error' + xhr + ' ' + type);
            }
        })
    });
};
