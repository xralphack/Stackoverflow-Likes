function getLikeButtonTemplate(questionId) {
	var template =
    "<svg class='sofl-like-button' id='" + questionId + "' viewBox='0 0 32 29.6'>" +
        "<path d='M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z'/>" +
    "</svg>";

    return template;
}

function deleteQuestionById(questionId) {
	getQuestionsInStorage(0, 0, function(questions) {
		var index = -1;
		$.each(questions, function(i){
			var question = questions[i];
    		if (question.questionId == questionId) {
        		index = i;
			}
		});
		if (index > -1) {
			questions.splice(index, 1);
			updateQuestionsInStorage(questions);
		}
	})
}

function deleteAllQuestions() {
	updateQuestionsInStorage([]);
}

function storeQuestion(question) {
	isQuestionInStorage(question.questionId, function(stored, questions) {
		if (!stored) {
			questions.unshift(question)
			updateQuestionsInStorage(questions);
		}
	});
}

function isQuestionInStorage(questionId, callback) {
	chrome.storage.sync.get(["questions"], function(result) {
        var questions = result.questions ? result.questions : [];
       	var stored = questions.some(function(question){
        	return question["questionId"] == questionId;
        });
        callback(stored, questions);
    });
}

function getQuestionsInStorage(offset, limit, callback) {
	chrome.storage.sync.get(["questions"], function(result) {
		var questions = result.questions ? result.questions : [];
		if (limit) {
			var hasMore = questions.length > (offset + limit);
	    	callback(questions.slice(offset, offset + limit), hasMore);
		} else {
			callback(questions);
		}
    });
}

function updateQuestionsInStorage(questions) {
    chrome.storage.sync.set({ questions: questions });
}

function getQuestionsDetail(questionIds, callback) {
	if (questionIds.length > 0) {
		questionIdsString = questionIds.join(';');
		$.get('https://api.stackexchange.com/2.2/questions/' + questionIdsString + '?&site=stackoverflow&filter=withbody&key=bo9Y2boGWSMyTEZ)00i75Q((', function(data, status) {
	   		callback(data);
		});
	}
}

function getAnswersDetail(answerIds, callback) {
	if (answerIds.length > 0) {
		answerIdsString = answerIds.join(';');
		$.get('https://api.stackexchange.com/2.2/answers/' + answerIdsString + '?&site=stackoverflow&filter=withbody&key=bo9Y2boGWSMyTEZ)00i75Q((', function(data, status) {
	   		callback(data);
		});
	}
}

// BOOKMARKS

function storeBookmark(bookmark) {
	chrome.storage.sync.get(["bookmarks"], function(result) {
        var bookmarks = result.bookmarks ? result.bookmarks : [];
		bookmarks.unshift(bookmark);
    	chrome.storage.sync.set({ bookmarks: bookmarks });
    });
}

function getBookmarksInStorage(callback) {
	chrome.storage.sync.get(["bookmarks"], function(result) {
		var bookmarks = result.bookmarks ? result.bookmarks : [];		
		callback(bookmarks);
    });
}

function deleteBookmark(bookmark) {
	getBookmarksInStorage(function(bookmarks) {
		var index = -1;
		$.each(bookmarks, function(i){
			var originBookmark = bookmarks[i];
    		if (JSON.stringify(originBookmark) === JSON.stringify(bookmark)) {
        		index = i;
			}
		});
		if (index > -1) {
			bookmarks.splice(index, 1);
    		chrome.storage.sync.set({ bookmarks: bookmarks });
		}
	})
}

function deleteAllBookmarks() {
	chrome.storage.sync.set({ bookmarks: [] });
}

