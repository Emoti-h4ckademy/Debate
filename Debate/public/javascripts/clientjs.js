var addPerson = function(trainingId, name, directoryPath, callback) {
  $.ajax({
      type: 'POST',
      url: '/person',
      data: {trainingId : trainingId, name : name, directoryPath : directoryPath},
      dataType: 'json',
      success: function(data){
          console.log("Addtraining response: " + data);
          callback(undefined, data);
      },
      error: function(xhr, type){
          console.log('AJAX response returned and error' + xhr + ' ' + type);
          callback(xhr.responseText);
      }
  })
};

var addTraining = function (trainingname, callback) {
  $.ajax({
      type: 'POST',
      url: '/training',
      data: { name : trainingname },
      dataType: 'json',
      success: function(data){
          console.log("Addtraining response: " + data);
          callback(undefined, data);
      },
      error: function(xhr, type){
          console.log('AJAX response returned and error' + xhr + ' ' + type);
          callback(JSON.parse(xhr.responseText).errmsg);
      }
  });
};

var addProject = function (projectname, callback) {
  $.ajax({
      type: 'POST',
      url: '/proyectos',
      data: { name : projectname },
      dataType: 'json',
      success: function(data){
          console.log("Addproject response: " + data);
          callback(undefined, data);
      },
      error: function(xhr, type){
          console.log('AJAX response returned and error' + xhr + ' ' + type);
          callback(JSON.parse(xhr.responseText).errmsg);
      }
  });
};

var detectEmotionBtn = function (){
    var retrieverBtn = $('button.emotion-retriever');
    retrieverBtn.on('click', function(){
        var buttonId = this.dataset.imgid;
        $.ajax({
            type: 'POST',
            url: '/emotiondetect/',
            data: { imageid : buttonId },
            dataType: 'json',
            success: function(data){
                var responseContainer = $('.ajax-response-container' + buttonId);
                console.log(data);

                $('.card' + buttonId + ' .emotion-title').html(data.emotion);
                $('.card' + buttonId + ' textarea').val($('.card' + buttonId + ' textarea').val()+' #' + data.emotion.replace(' ', ''));
                if(data.tranformedImage){
                  $('.card' + buttonId + ' img').attr('src', 'data:image/jpg; base64,'+data.tranformedImage);
                }

                responseContainer.html('<h2>' + data.emotion + '</h2>' +
                    '<div style="max-width: 564px;"><p><pre>'+ JSON.stringify(data.scores) +'</pre></p></div>');
            },
            error: function(xhr, type){
                alert('AJAX response returned and error' + xhr + ' ' + type);
            }
        });
    });
};

var tweet = function (){
    var retrieverBtn = $('button.tweet-button');
    retrieverBtn.on('click', function(){
        //var image = $('img[data-imgid='+ this.dataset.imgid + ']');
        var inputBox = $('textarea[data-imgid='+ this.dataset.imgid + ']')[0];
        var imgid = this.dataset.imgid;
        $.ajax({
            type: 'POST',
            url: '/tweet/',
            data:
            {
              imageid : imgid,
              text : $.trim($(inputBox).val())
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
              var tweetStatus = $('.tweet-status').filter("div[data-imgid='" + this.dataset.imgid + "']");
              tweetStatus.removeClass('error-icon');
              tweetStatus.addClass('ok-icon');
              $('[class*="error"]').remove();

            },
            error: function(xhr, type){
              var tweetStatusBox = $('.tweet-status').filter("div[data-imgid='" + this.dataset.imgid + "']");
              var tweetBtn = $("button[data-imgid='" + this.dataset.imgid + "']").filter(".tweet-button");
              //var responseBox = $('.ajax-response-message').filter("div[data-imgid='" + this.dataset.imgid + "']");
              tweetStatusBox.addClass('error-icon');
              $('<div class="error-text">' + xhr.responseJSON[0].message + '</div>').insertAfter(tweetBtn);
              console.log('AJAX response returned and error' + JSON.stringify(xhr) + ' ' + type);
            }
        })
    });
};

var charactersCounter = function () {
  var charleft = function(el){
    var max = 118;
    var len = $(el).val().length;
    if (len >= max) {
      $('.charNum').text(' you have reached the limit');
    } else {
      var char = max - len;
      $('.charNum').text(char + ' characters left');
    }
  };
  charleft($('.tweet-area'));
  $('.tweet-area').focus(function(){
      $(this).keyup(function () {
      charleft(this);
    });
  });
};

var displayPanel = function (el){
    $(el).slideDown();
};
var hidePanel = function (el, className) {
  $(el).closest(className).slideUp();
};
var clearForm = function () {
  $('.personname').val('');
  $('.facespath').val('');
  $('.personname').attr("placeholder", "Nombre del person");
  $('.facespath').attr("placeholder", "Path donde se encuentran las imágenes");
};
var clickAddPerson = function (el) {
  var trainingId = $(el).data('trainingid');
  var name = $('.personname').filter("input[data-trainingid='" + trainingId + "']").val();
  var directoryPath = $('.facespath').filter("input[data-trainingid='" + trainingId + "']").val();

  addPerson(trainingId, name, directoryPath, function(error, response){
    console.log("Estamos logueando error: " + error);
    if(error) {
      alert ("Error saving person: " + JSON.parse(error).message);
    } else {
      //hideAddPerson();
      //$('.person-list').append('<li data-projid="{{_id}}"> <b>Nombre:</b> ' + person.name + ' <b>' + person.info + '</b> </li>');
      alert('Person saved succesfully');
    }
  });
};
