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
				if(prevTitle !== title){
					prevTitle = title;
					$('.jp-title').text('');
					//проверяем длинну названия песни
					if( $('div.jp-title-hidden').text(title).width() > 215){
						$('.jp-title').append($('<marquee behavior="scroll" direction="left" scrollamount=1>' + title + '</marquee>'))
						$('marquee').marquee();
					} else {
						$('.jp-title').text(title);
					}
				}
				setTimeout(updateMeta, timeOut);
			},
			error: function(){
				setTimeout(updateMeta, timeOut);
			}
		});
	};
	setTimeout(updateMeta, timeOut);


	var stream = {
		title: "РадиоИнди",
		mp3: "http://stream.radioindie.ru:8000/radioindie"
	},
	ready = false;

	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			ready = true;
			$(this).jPlayer("setMedia", stream);
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
				// Setup the media stream again and play it.
				$(this).jPlayer("setMedia", stream).jPlayer("play");
			}
		},
		swfPath: "js",
		supplied: "mp3",
		preload: "none",
		wmode: "window",
		keyEnabled: true
	});

});
