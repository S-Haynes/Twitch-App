$('document').ready(function(){
	let clientID = '?&client_id=lftswqu0xb0v2yq6tvbam26vnr6ly1'
	let myUrl = 'https://api.twitch.tv/kraken/users/luci_snow/follows/channels' + clientID
	// example myUrl: https://api.twitch.tv/kraken/users/luci_snow/follows/channels?&client_id=lftswqu0xb0v2yq6tvbam26vnr6ly1
	let arr = [];

	$.ajax({
		type: 'GET',
		url: myUrl,
		dataType: 'json',
		success: function(data){
			for(var i = 0; i < data.follows.length; i++){
				let streamUrl = 'https://api.twitch.tv/kraken/streams/' + data.follows[i].channel.display_name + clientID
				// example StreamUrl: https://api.twitch.tv/kraken/streams/psalmhots?&client_id=lftswqu0xb0v2yq6tvbam26vnr6ly1
				arr.push(streamUrl);
				$('#list').append('<li class='+ '"' + 'item' + i + ' unselect' + '"' +'>' + data.follows[i].channel.display_name + '<img src="' + data.follows[i].channel.logo + '"' + '</li>')
			} //loop-end

			arr.forEach(function(url, i){
				$.ajax({
					type: 'GET',
					url: url,
					dataType: 'json',
					success: function(streamData){
						if(streamData.stream !== null){
							showOnlineContent(streamData, data, i);
						} else {
							showOfflineContent(streamData, data, i);
						}
					},
					error: function(err){
						$('.item' + i).remove();
						console.log(err);
					}
				})
			})
		},
		error: function(err){
			alert(err);
		}
	})



	$('#online').on('click', function(){
		$('.online').parent().removeClass('hidden');
		$('.offline').parent().addClass('hidden');
		hideRightContent();

	})

	$('#offline').on('click', function(){
		$('.offline').parent().removeClass('hidden');
		$('.online').parent().addClass('hidden');
		hideRightContent();
	})

	$('#all').on('click', function(){
		$('.online').parent().removeClass('hidden');
		$('.offline').parent().removeClass('hidden');
		hideRightContent();
	})

	function hideRightContent(){
		$('#preview').addClass('hidden');
		$('#banner').addClass('hidden');
		$('#streamStatus').addClass('hidden');
		$('#myTwitch').removeClass('hidden');
	}

	function showRightContent(){
		$('#preview').removeClass('hidden');
		$('#banner').removeClass('hidden');
		$('#streamStatus').removeClass('hidden');
		$('#myTwitch').addClass('hidden');
		$('#streamStatus').text('');
	}

	function showOnlineContent(streamData, data, i){
		$('.item' + i +'> img').addClass('online');
		$('.item' + i).on('click', function(){
			showRightContent();
			$('.unselect').removeClass('selected')
			$(this).addClass('selected');
			$('#watch').removeClass('hidden');
			$('#streamStatus').removeClass('hidden');
			$('#watch').text('');
			$('#watch').append('<a href=' + '"'+ streamData.stream.channel.url + '"'+ ' target=_blank'+ '>Watch Now</a>')
			$('#streamStatus').append("Streaming: " + streamData.stream.game);
			if(data.follows[i].channel.profile_banner === null){
				$('#banner').css('background', 'url(https://www.twitch.tv/p/assets/uploads/combologo_474x356.png) no-repeat')
			} else {
				$('#banner').css('background', 'url('+ data.follows[i].channel.profile_banner +') no-repeat')
			}
			$('#banner').css('background-size', '100% 100%')
			$('#preview').css('background', 'url('+ streamData.stream.preview.large +') no-repeat')
			$('#preview').css('background-size', '100% 100%')
		})

	}

	function showOfflineContent(streamData, data, i){
		$('.item' + i +'> img').addClass('offline');
		$('.item' + i).on('click', function(){
			showRightContent();
			$('.unselect').removeClass('selected')
			$(this).addClass('selected');
			$('#streamStatus').addClass('hidden');
			$('#watch').addClass('hidden');
			if(data.follows[i].channel.video_banner === null){
				$('#banner').css('background', 'url(https://static-cdn.jtvnw.net/jtv_user_pictures/5d5161135165911d-channel_offline_image-1920x1080.jpeg) no-repeat')
			} else {
				$('#banner').css('background', 'url('+ data.follows[i].channel.video_banner +') no-repeat')
			}
			$('#banner').css('background-size', '100% 100%')
			$('#preview').css('background', 'url(https://www.twitch.tv/p/assets/uploads/combologo_474x356.png) no-repeat')
			$('#preview').css('background-size', '100% 100%')
		})
	}
});

