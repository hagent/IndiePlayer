$(function(){	
	var metaHandler = getMetaHandler();
	createPlayer(metaHandler);
});

function getMetaHandler(){
	var meta = {
		titleChanged: false, 
		timerOn: false, 
		prevTitle: '', 
		timeOut: 2000,
		
		restartTimer: function(){
			var me = this;
			setTimeout(function(){me.update()}, this.timeOut);
		},	
		
		start: function(){
			this.timerOn = true;
		},
		
		stop: function(){
			this.timerOn = false;
		},
	
		update : function(){
			if(this.timerOn){
				this.requestMeta();
			}else{
				this.restartTimer();
			}
		}
		
		requestMeta: function(){			
			$.ajax({
				type: 'GET',
				url: 'metadata.php',
				dataType: 'json',
				context: this,
				success: function(data) {				
					this.title = this.getTitle(data.metadata);
					if(this.prevTitle !== this.title) this.titleChanged = true;
					this.prevTitle = this.title;
					
					this.restartTimer();
				},
				error: function(){
					this.restartTimer();
				}
			});
		},
		
		getTitle: function(title){
			title = $.trim(title.replace('RadioIndie - ', ''));
			if(title.length === 1) title = '';
			if(title.length > 2 && title.indexOf('- ') === 0) title = title.substr(2);
			return title;
		},
		
		changeTitle: function(){
			if(this.titleChanged) {
				$('.jp-title div div').text(this.title);
				this.titleChanged = false;
			}
		}
	};
	meta.restartTimer();
	
	return meta;
}

function createPlayer(metaHandler){
	var ready = false, stream = {
		title: "РадиоИнди",
		mp3: "http://stream.radioindie.ru:8000/radioindie"
	};	
	$('marquee').marquee().bind('start', function(){ metaHandler.changeTitle()});
	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			
			ready = true;
			$(this).jPlayer("setMedia", stream).jPlayer("play");
		},
		pause: function() {
			metaHandler.stop();
			$(this).jPlayer("clearMedia");
		},
		play: function(){
			metaHandler.start();
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
}