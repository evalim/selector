(function(){

var randomAnimateInterval = -1;
var randomAnimateControl = 0;
var keyword = [];

function randomSelectKeyword(keywords) {
	var length = keywords.length;
	if(length == 1)	return keywords[0];
	else return keywords[Math.floor(Math.random() * length)];
}

function randomAnimate(keywords, callback) {

	function oneFrame() {
		randomAnimateControl += 1;
		$('#progressBar').width(Math.min(Math.floor(100 * randomAnimateControl/50), 100) + '%');
		if(randomAnimateControl >= 50) {
			clearInterval(randomAnimateInterval);
			randomAnimateControl = 0;
			callback();
		}
		$('span#randomKey').text(randomSelectKeyword(keywords));
	}

	randomAnimateInterval =  setInterval(oneFrame, 50);
}

function initial() {
	var storage = window.localStorage;
	if(storage.getItem('saved')) {
		$('textarea#keywords').val(storage.getItem('lastKeywords'));
	} else {
		storage.setItem('saved', true);
		storage.setItem('lastKeywords', "");
	}

	if($('textarea#keywords').val())
		$('#luckyButton').attr('disabled', false);
	else 
		$('#luckyButton').attr('disabled', true);

}

function onRandomSelectEnd() {
	$('span#tips').text('发功结束！');
	$('#stopButton').hide();
	$('#onceAgainButton').show();
	$('#returnButton').show();
}

$(document).ready(function(){
	$('#luckyButton').click(function() {
		var text = $('#keywords').val().trim();
		// alert(text);
		if(text.length <= 0) return;
		$('#luckyButton').hide();
		$('#stopButton').show();
		keywords = text.split('\n');
		var temp = [];
		for(var i = 0, len = keywords.length; i < len; ++i) {
			var key = keywords[i].split('@')[0];
			var weight = keywords[i].split('@')[1];
			weight = parseInt(weight) > 0 ? parseInt(weight) : 1;
			for(var j = 0; j < weight; ++j) {
				temp.push(key);
			}
		}
		keywords = temp;

		// 隐藏输入面板
		$('textarea#keywords').hide();
		$('div#random').show();
		$('span#tips').text('正在施法...');
		// alert(randomSelectKeyword(keywords));
		randomAnimate(keywords, onRandomSelectEnd);
	});

	$('#stopButton').click(function(){
		$('#stopButton').hide();
		$('#onceAgainButton').show();
		$('#returnButton').show();
		if(randomAnimateInterval == -1)
			return ;
		randomAnimateControl += 1000;
	});

	$('#onceAgainButton').click(function() {
		$('#stopButton').show();
		$('#onceAgainButton').hide();
		$('#returnButton').hide();
		$('span#tips').text('正在施法...');
		randomAnimate(keywords, onRandomSelectEnd);
	});

	$('#returnButton').click(function() {
		$('#progressBar').width(0);
		$('#luckyButton').show();
		$('#onceAgainButton').hide();
		$('#returnButton').hide();
		$('span#tips').text('输入关键词，回车分隔');
		$('div#random').hide();
		$('textarea#keywords').show();
	});

	$('textarea#keywords').bind('input propertychange', function() {
		var value = $('textarea#keywords').val();
		if('' == value.trim()) {
			$('#luckyButton').attr('disabled', true);
		} else {
			$('#luckyButton').attr('disabled', false);
		}
		window.localStorage.setItem('lastKeywords', value);
	});

	initial();
});


})();