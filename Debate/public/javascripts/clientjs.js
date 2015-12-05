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
