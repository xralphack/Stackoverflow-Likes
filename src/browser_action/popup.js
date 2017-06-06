function searchOnStackoverflow(query){
	chrome.tabs.create({'url':"http://stackoverflow.com/search?q="+encodeURIComponent(query)});
}

function checkBeforeSearch(event) {
    var inputValue = document.getElementById("search-input").value;
    if (inputValue.trim() == '') { return; }
	if (event && event.which) {
	  var code = event.which;
	} else {
	  var code = event.keyCode;
	}
	if (code == 13) {
		searchOnStackoverflow(inputValue);
	} 
}

function checkBookmarkDisabled() {
	if ($("#tags-select option").length == 0) {
		$("#bookmark-button").prop('disabled', true);
	} else {
		$("#bookmark-button").prop('disabled', false);
	}
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
        	var tab = tabs[i];
        	if (tab.active) {
        		$('#tags-select').append("<option selected value='" + tab.url + "'>" + tab.title + "</option>");
        	} else {
        		$('#tags-select').append("<option value='" + tab.url + "'>" + tab.title + "</option>");
        	}
        }
       	checkBookmarkDisabled();
    });
	document.getElementById("search-input").addEventListener('keypress', checkBeforeSearch);


	document.getElementById("bookmark-button").addEventListener('click', function() {
		var bookmark = {
			title: $('#tags-select').find(":selected").text(),
			url: $('#tags-select').find(":selected").val()
		};
		$('#tags-select').find(":selected").remove();
		checkBookmarkDisabled();
		storeBookmark(bookmark);
	});
	document.getElementById("stackoverflow-likes-button").addEventListener('click', function() {
		chrome.tabs.create({ url: chrome.runtime.getURL("src/override/override.html") });
	});
});

