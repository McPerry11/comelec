$(function() {
	$('.pageloader .title').text('Loading Login');

	$('form').submit(function(e) {
		e.preventDefault();
		$('#submit').addClass('is-loading');
		$('#view').attr('disabled', 'disabled');
		if ($('#view').hasClass('has-background-grey')) {
			$('#view').removeClass('has-background-grey').removeClass('has-text-white');
			$('#view svg').removeClass('fa-eye-slash').addClass('fa-eye');
			$('#password').attr('type', 'password');
		}
		$('input').attr('readonly', true);
		$('.help').text('');
		let username = $('#username').val(), password = $('#password').val();
		$.ajax({
			type: 'POST',
			url: 'login',
			data: {data:'login', username:username, password:password},
			datatype: 'JSON',
			success: function(response) {
				$('#submit').removeClass('is-loading');
				if (response.status == 'success') {
					Swal.fire({
						icon: 'success',
						title: response.msg,
						showConfirmButton: false,
						timer: 2500
					}).then(function() {
						$('.pageloader .title').text('Loading Dashboard');
						$('.pageloader').addClass('is-active');
						window.location.href = "/comelec/public";
					});
				} else if (response.status == 'error') {
					$('#username').val('').addClass('is-danger');
					$('#password').val('').addClass('is-danger');
					$('.help').text(response.msg);
					$('#view').removeAttr('disabled');
					$('input').removeAttr('readonly');
					$('#submit').attr('disabled', true);
				}
			},
			error: function(err) {
				console.log(err);
				Swal.fire({
					icon: 'error',
					title: 'Cannot Connect to Server',
					text: 'Something went wrong. Please try again later.'
				});
				$('#submit').removeClass('is-loading');
				$('#view').removeAttr('disabled');
				$('input').removeAttr('readonly');
			}
		});
	});

	$('input').keyup(function() {
		$('input').removeClass('is-danger');
		$('.help').text('');
		$('#submit').removeAttr('disabled');
	});

	$('#view').click(function() {
		if ($(this).hasClass('has-background-grey')) {
			$(this).removeClass('has-background-grey').removeClass('has-text-white');
			$('#view svg').removeClass('fa-eye-slash').addClass('fa-eye');
			$('#password').attr('type', 'password');
		} else {
			$(this).addClass('has-background-grey').addClass('has-text-white');
			$('#view svg').removeClass('fa-eye').addClass('fa-eye-slash');
			$('#password').attr('type', 'text');
		}
	});
});