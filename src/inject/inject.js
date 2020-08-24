chrome.extension.sendMessage({}, function(response) {
  $(document).ready(function() {
      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------

      function injectLikeButtons() {
        $('.votecell .js-voting-container').each(function() {
          var questionId = $(this).data('post-id');

          if (questionId) {
            if ($('.sofl-like-button#' + questionId).length == 0) {
              $(getLikeButtonTemplate(questionId)).appendTo($(this)).on('click', function() {
                if (this.classList.contains('active')) {
                  this.classList.remove("active");
                  deleteQuestionById(questionId);
                } else {
                  this.classList.add("active");

                  storeQuestion({
                    questionId: questionId,
                    questionHeader: $('#question-header h1 a').text(),
                    questionType: $(this).parents('.question#question').length > 0 ? 'question' : 'answer'
                  });
                }
              });
            }
          }
        });
      }

      function refreshLikeButtonStatus() {
        $('.sofl-like-button').each(function() {
          var button = this;
          var questionId = button.id;
          isQuestionInStorage(questionId, function(stored) {
            if (stored) {
              button.classList.add("active");
            }
          });
        });
      }

      injectLikeButtons();
      refreshLikeButtonStatus();

    });
});