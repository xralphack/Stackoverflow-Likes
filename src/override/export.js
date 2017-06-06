$(document).ready(function() {
	var simplemde = new SimpleMDE({ 
		element: document.getElementById("markdown-editor"),
		autoDownloadFontAwesome: false
	});

	if (window.location.hash == "#likes") {
		getQuestionsInStorage(0, 0, function(questions) {
			var markdown = "";
			questions.forEach(function(question) {
				markdown += 
				"[" + question.questionHeader + "]" +
				"(https://stackoverflow.com/questions/" +
				question.questionId +
				")\n";
			});
			simplemde.value(markdown);
		});
	} else {
	  	getBookmarksInStorage(function(bookmarks) {
			var markdown = "";
			bookmarks.forEach(function(bookmark) {
				markdown += 
				"[" + bookmark.title + "]" +
				"(" +
				bookmark.url +
				")\n";
			});
			simplemde.value(markdown);
		});
	}
});