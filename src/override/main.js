$(document).ready(function() {

	var limit = 6;
	var offset = 0;
	displayQuestions(offset, limit);

	$('#sofl-export').on('click', function() {
		chrome.tabs.create({ url: chrome.runtime.getURL("src/override/export.html") });
	});

	$('.solf-load-button').on('click', function() {
		var offset = parseInt($('.solf-load-button').attr('data-offset'));
		displayQuestions(offset, limit);
	});

	$('#sofl-clear').on('click', function() {
		deleteAllQuestions();
		$('.sofl-questions').fadeOut(500, function() {
			$(this).remove();
		});
	});

	function displayQuestions(offset, limit) {
		getQuestionsInStorage(offset, limit, function(questions, hasMore) {
			$('.solf-load-button').attr('data-more', hasMore);
			if (hasMore) {
	      		var offset = parseInt($('.solf-load-button').attr('data-offset'));
	      		$('.solf-load-button').attr('data-offset', offset+limit);
	      		$('.solf-load-button').fadeIn();
	      	} else {
	      		$('.solf-load-button').fadeOut();
	      	}

			var template = '';
			questions.forEach(function(question, index) {
				template += 
				"<div class='col-md-4'>" +
					"<div class='sofl-card' id='" + question.questionId + "' data-type='" + question.questionType + "'>" +
						"<span class='glyphicon glyphicon-remove-circle sofl-card-delete-button'></span>" + 
						"<div class='sofl-card-header'>" + question.questionHeader +
						"</div>" +
						"<hr>" + 
						"<div class='sofl-card-body'>" +
						"</div>" +	
					"</div>" +
				"</div>";
			});
			$(template).appendTo('.sofl-questions .solf-content');


			$('.sofl-card-delete-button').on('click', function() {
				var questionId = $(this).closest('.sofl-card').attr('id');
				var col = $(this).closest('.col-md-4');
				col.fadeOut(500, function(){
	    			$(col).remove();
				});
				deleteQuestionById(questionId);
			})
			
			var questionIdGroup = questions.filter(function(question) {
				return question.questionType == 'question';
	      	}).map(function(question) {
	      		return question.questionId;
	      	});

	      	var answerIdGroup = questions.filter(function(question) {
				return question.questionType == 'answer';
	      	}).map(function(question) {
	      		return question.questionId;
	      	});

	      	if (questionIdGroup.length > 0) {
		      	getQuestionsDetail(questionIdGroup, function(data) {
		      		if (data.items) {
		      			var remoteQuestions = data.items;
			      		remoteQuestions.forEach(function(remoteQuestion) {	
			      			var syncQuestions = questions.filter(function(question) {
								return question.questionType == 'question' && question.questionId == remoteQuestion.question_id;
							});

							if (syncQuestions.length > 0) {
								var syncQuestion = syncQuestions[0];
							} else {
								var syncQuestion = false;
							}
			      			var body = $(remoteQuestion.body).text();
							$('.sofl-card#' + remoteQuestion.question_id + '[data-type="question"]' + ' .sofl-card-body').text(body.substring(0, 250) + '...');
							$("<button class='btn btn-default sofl-card-read-button'>read more</button>")
								.appendTo('.sofl-card#' + remoteQuestion.question_id + '[data-type="question"]')
								.on('click', function() {	
									var title = syncQuestion ? syncQuestion.questionHeader : '';	
									$('#myModalLabel').text(title);
									$('#bounceOut').attr("href", "http://stackoverflow.com/questions/" + remoteQuestion.question_id);
									$('.modal-body').html(remoteQuestion.body).find('img').addClass('img-responsive');
									$('#myModal').modal('toggle');
								});
						});
		      		}
				});
	      	}

			if (answerIdGroup.length > 0) {
		      	getAnswersDetail(answerIdGroup, function(data) {
		      		if (data.items) {
		      			var remoteQuestions = data.items;
			      		remoteQuestions.forEach(function(remoteQuestion) {	
			      			var syncQuestions = questions.filter(function(question) {
								return question.questionType == 'answer' && question.questionId == remoteQuestion.answer_id;
							});

							if (syncQuestions.length > 0) {
								var syncQuestion = syncQuestions[0];
							} else {
								var syncQuestion = false;
							}
			      			var body = $(remoteQuestion.body).text();
							$('.sofl-card#' + remoteQuestion.answer_id + '[data-type="answer"]' + ' .sofl-card-body').text(body.substring(0, 250) + '...');
							$("<button class='btn btn-default sofl-card-read-button'>read more</button>")
								.appendTo('.sofl-card#' + remoteQuestion.answer_id + '[data-type="answer"]')
								.on('click', function() {	
									var title = syncQuestion ? syncQuestion.questionHeader : '';	
									$('#myModalLabel').text(title);
									$('#bounceOut').attr("href", "http://stackoverflow.com/questions/" + remoteQuestion.answer_id);
									$('.modal-body').html(remoteQuestion.body).find('img').addClass('img-responsive');
									$('#myModal').modal('toggle');
								});
						});
		      		}
				});
	      	}
		});
	}
});