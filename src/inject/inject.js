chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.log("Hello. This message was sent from scripts/inject.js");
			// ----------------------------------------------------------

			function injectLikeButtons() {
				$('.votecell .vote').each(function() {
					var questionId = $(this).find('input[name=_id_]').val();
					if (questionId) {
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

		}
	}, 10);
});