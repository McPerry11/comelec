$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}
});

$(window).on('load', function() {
	if ($(location).attr('pathname') != '/comelec/public/') {
		$('.pageloader .title').text('');
		$('.pageloader').removeClass('is-active');
	}
});