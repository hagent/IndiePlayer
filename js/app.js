$(function(){
	var timerOn = false, prevTitle = '', timeOut = 2000;
	
	var updateMeta = function(){
		if(!timerOn){
			setTimeout(updateMeta, timeOut);
			return;
		}
		
		$.ajax({
			type: 'GET',
			url: 'metadata.php',
			dataType: 'json',
			success: function(data) {				
				var title = $.trim(data.metadata.replace('RadioIndie - ', ''));
				if(title.length === 1) title = '';
				if(title.length > 2 && title.indexOf('- ') === 0) title = title.substr(2);
				if(prevTitle !== title){
					prevTitle = title;
					setTitle(title);
				}
				setTimeout(updateMeta, timeOut);
			},
			error: function(){
				setTimeout(updateMeta, timeOut);
			}
		});
	};
	
	var setTitle = function(title){
		$('.jp-title').empty();
		$('.jp-title').append('<marquee behavior="scroll" direction="left" scrollamount=1>' + title + '</marquee>');
		$('marquee').marquee();
	}
	
	setTimeout(updateMeta, timeOut);


	var stream = {
		title: "РадиоИнди",
		mp3: "http://stream.radioindie.ru:8000/radioindie"
	},
	ready = false;

	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			ready = true;
			$(this).jPlayer("setMedia", stream).jPlayer("play");
		},
		pause: function() {
			timerOn = false;
			$(this).jPlayer("clearMedia");
		},
		play: function(){
			timerOn = true;
		},
		error: function(event) {
			if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
				$(this).jPlayer("setMedia", stream).jPlayer("play");
			}
		},
		
		volume: 0.5,
		swfPath: "js",
		supplied: "mp3",
		preload: "none",
		wmode: "window",
		keyEnabled: true
	});
});
