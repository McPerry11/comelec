$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	}
});

$(window).on('load', function() {
	$('.title').text('');
	$('.pageloader').removeClass('is-active');
});