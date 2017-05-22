$(document).ready(function() {
	var simplemde = new SimpleMDE({ 
		element: document.getElementById("markdown-editor"),
		autoDownloadFontAwesome: false
	});

	getQuestionsInStorage(0, 0, function(questions) {
		var markdown = "";
		questions.forEach(function(question) {
			markdown += 
			"[" + question.questionHeader + "]" +
			"(https://stackoverflow.com/" +
			question.questionType + "/" +
			question.questionId +
			")\n";
		});
		simplemde.value(markdown);

	});
});