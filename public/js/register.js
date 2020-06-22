$(function() {
	function serverError(error) {
		console.log(error);
		Swal.fire({
			icon: 'error',
			title: 'Cannot Connect to Server',
			text: 'Something went wrong. Please try again later.'
		});
	}

	function ajaxResponse(){
		$('.input').removeAttr('readonly');
		$('#submit').removeClass('is-loading');
		$('input[type="radio"]').removeAttr('disabled');
	}

	$('.pageloader .title').text('Loading Registration');
	Swal.fire({
		icon: 'info',
		title: 'Privacy Notice',
		text: 'The event organizers collected information from you as participants for the purposes of registration and overall event management. By providing your information, you are giving your consent to us to use your information for the aforementioned purposes. After conclusion of the event and completion of all necessary reports, your personal data will be saved in secure files for future reference and networking activities. If you do not wish to be contacted further after this event, kindly inform the organizers.',
		confirmButtonText: 'Proceed'
	});

	$('form').submit(function(e) {
		e.preventDefault();
		var lastname = $('#lastname').val(), firstname = $('#firstname').val(), middlename = $('#middlename').val(), barangay = $('#barangay').val(), phone = '0' + $('#phone').val();
		var schedule = {
			'cert': 'CERTIFICATION',
			'reg': 'REGISTRATION'
		}[$('input[name="sched"]:checked').val()];

		Swal.fire({
			icon: 'warning',
			title: 'Just Checking...',
			html: 'Are you sure these data are correct?<br><br>Full Name: <span class="has-text-black">' + lastname + ', ' + firstname + ' ' + middlename + '</span><br>Barangay: <span class="has-text-black">' + barangay + '</span><br>Contact Number: <span class="has-text-black">' + phone + '</span><br>Scheduling: <span class="has-text-black">VOTER ' + schedule + '</span>',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.value) {
				$('#submit').addClass('is-loading');
				$('.input').attr('readonly', true);
				$('input[type="radio"]').attr('disabled', true);
				$('icon.is-right').remove();
				$.ajax({
					type: 'POST',
					url: 'register',
					data: {last_name:lastname, first_name:firstname, middle_name:middlename, barangay:barangay, contact_number:phone, schedule:schedule, data:'register'},
					datatype: 'JSON',
					success: function(response) {
						ajaxResponse();
						if (response.status == 'success') {
							Swal.fire({
								icon: 'success',
								title: response.msg,
								showConfirmButton: false,
								timer: 2500
							}).then(function() {
								$('form').addClass('is-hidden');
								$('#part').removeClass('is-hidden');
							});
						} else {
							Swal.fire({
								icon: 'error',
								title: 'Registration Failed',
								text: response.msg,
								confirmButtonText: 'Try Again',
							});
							$('#phone').addClass('is-danger');
							$('.icon.is-right').remove();
							$('#phonecontrol').addClass('has-icons-right').append('<span class="icon is-right has-text-danger"><i class="fas fa-times"></i></span>');
							$('#warning').addClass('has-text-danger').text(response.warn);
						}
					},
					error: function(err) {
						ajaxResponse();
						serverError(err);
					}
				});
			}
		});
	});

	$('#phone').focusout(function() {
		if (!$('#submit').hasClass('is-loading')) {
			if ($(this).is(':invalid')) {
				$(this).addClass('is-danger');
				$('#warning').addClass('has-text-danger').text('Contact number must consist of 10 digits');
				$('#submit').attr('disabled', true);
			} else {
				$('#submit').attr('disabled', true);
				$(this).removeClass('is-danger');
				$('#warning').removeClass('has-text-danger').text('Do not enter the first zero');
				$('.icon.is-right').remove();
				$('#phonecontrol').addClass('is-loading');
				$(this).attr('readonly', true);
				let number = '0' + $(this).val();
				$.ajax({
					type: 'POST',
					url: 'guests',
					data: {contact_number:number, data:'phone'},
					datatype: 'JSON',
					success: function(response) {
						$('#phonecontrol').removeClass('is-loading');
						$('#phone').removeAttr('readonly');
						if (response.status == 'success') {
							$('#submit').removeAttr('disabled');
							$('#phonecontrol').addClass('has-icons-right').append('<span class="icon is-right has-text-success"><i class="fas fa-check"></i></span>');
						} else {
							$('#phonecontrol').addClass('has-icons-right').append('<span class="icon is-right has-text-danger"><i class="fas fa-times"></i></span>');
							$('#phone').addClass('is-danger');
							$('#warning').addClass('has-text-danger').text(response.msg);
						}
					},
					error: function(err) {
						serverError(err);
						$('#phonecontrol').removeClass('is-loading');
						$('#phone').removeAttr('readonly');
					}
				});
			}
		}
	});

	$('#phone').keyup(function() {
		if (!$('#submit').hasClass('is-loading')) {
			$(this).removeClass('is-danger');
			$('#submit').removeAttr('disabled');
			$('#warning').removeClass('has-text-danger').text('Do not enter the first zero');
			$('.icon.is-right').remove();
		}
	});
});
