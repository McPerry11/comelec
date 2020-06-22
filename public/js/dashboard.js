$(function() {
	function serverError(error) {
		console.log(error);
		Swal.fire({
			icon: 'error',
			title: 'Cannot Connect to Server',
			text: 'Something went wrong. Please try again later.'
		});
		$('tbody tr').remove();
		let column = $('#dashboard').hasClass('is-active') ? 5 : 3;
		$('tbody').append('<tr><td colspan="' + column +  '" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span>Something went wrong. Please refresh and try again.</td></tr>');
		$('.pageloader .title').text('');
		$('.pageloader').removeClass('is-active');
	}

	function pagination(current, prev, next, last, lastpage) {
		$('.box').append('<nav class="pagination is-right"></nav>');
		if (prev != null) $('.pagination').append('<a class="pagination-previous" data-url="' + prev + '">Previous</a>');
		if (next != null) $('.pagination').append('<a class="pagination-next" data-url="' + next + '">Next</a>');
		if (lastpage >= 3) $('.pagination').append('<form class="pagination-list"><div class="field has-addons"><div class="control"><button id="goto" class="button is-info" type="submit">Go to</button></div><div id="page" class="control"><input type="number" class="input" min="1" max="' + lastpage + '" value="' + current + '" placeholder="Page #"></div><div class="control"><a class="button is-static">/ ' + lastpage + '</a></div></div></form>');
	}

	function retrieveGuests() {
		$('tbody tr').remove();
		$('nav').remove();
		$('#search button').attr('disabled', true);
		$('tbody').append('<tr><td colspan="5" class="has-text-centered"><span class="icon is-large"><i class="fas fa-2x fa-spinner fa-spin"></i></span><div class="has-text-centered">Fetching participants\' data</div></td></tr>');
		$.ajax({
			type: 'POST',
			url: urlGuest,
			data: {data:'dashboard', sort:sortGuest, search:searchGuest},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeAttr('disabled');
				$('tbody tr').remove();
				$('#total').text(data.guests.total);
				$('#cert').text(data.cert);
				$('#reg').text(data.reg);
				$('.level').removeClass('is-hidden');
				if (data.guests.total == 0) {
					$('tbody').append('<tr><td colspan="5" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span>No registered participants found</td></tr>');
				} else {
					for (let i = 0; i < data.guests.data.length; i++) {
						let fullname = data.guests.data[i].last_name + ', ' + data.guests.data[i].first_name;
						if (data.guests.data[i].middle_name) fullname += ' ' + data.guests.data[i].middle_name;
						$('tbody').append('<tr><td>' + fullname + '</td><td>' + data.guests.data[i].barangay + '</td><td>' + data.guests.data[i].contact_number + '</td><td>' + data.guests.data[i].schedule + '</td><td><div class="buttons"><button class="button edit" title="Edit ' + data.guests.data[i].first_name + ' ' + data.guests.data[i].last_name + '" data-id="' + data.guests.data[i].id + '"><span class="icon"><i class="fas fa-edit"></i></span></button><button class="button is-danger is-inverted remove" title="Delete ' + data.guests.data[i].first_name + ' ' + data.guests.data[i].last_name + '" data-id="' + data.guests.data[i].id + '"><span class="icon"><i class="fas fa-trash"></i></span></button></div></td></tr>');
					}
					if (data.guests.last_page > 1) {
						currentGuest = data.guests.current_page, prevGuest = data.guests.prev_page_url, nextGuest = data.guests.next_page_url, lastGuest = data.guests.last_page_url;
						pagination(currentGuest, prevGuest, nextGuest, lastGuest, data.guests.last_page);
					}
				}
				$('.pageloader .title').text('');
				$('.pageloader').removeClass('is-active');
			},
			error: function(err) {
				serverError(err);
			}
		});
	}

	function retrieveLogs() {
		$('tbody tr').remove();
		$('nav').remove();
		$('#search button').attr('disabled', true);
		$('tbody').append('<tr><td colspan="3" class="has-text-centered"><span class="icon is-large"><i class="fas fa-spinner fa-spin fa-2x"></i></span><div class="has-text-centered">Fetching logs</div></td></tr>');
		$.ajax({
			type: 'POST',
			url: urlLog,
			data: {data:'logs', search:searchLog},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeAttr('disabled');
				$('tbody tr').remove();
				if (data.total == 0) {
					$('tbody').append('<tr><td colspan="3" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span>No logs found</td></tr>');
				} else {
					for (let i = 0; i < data.data.length; i++) {
						let date = new Date(data.data[i].created_at);
						$('tbody').append('<tr><td>' + data.data[i].id + '</td><td>' + data.data[i].description + '</td><td>' + formatDate(date) + '</td></tr>');
					}
					if (data.last_page > 1) {
						currentLog = data.current_page, prevLog = data.prev_page_url, nextLog = data.next_page_url, lastLog = data.last_page_url;
						pagination(currentLog, prevLog, nextLog, lastLog, data.last_page);
					}
				}
			},
			error: function(err) {
				serverError(err);
			}
		});
	}

	function loadAction(button) {
		$('button').attr('disabled', true);
		$(button).removeAttr('disabled').addClass('is-loading');
	}

	function exitModal() {
		$('.modal').removeClass('is-active');
		$('html').removeClass('is-clipped');
		$('#phone').removeClass('is-danger');
		$('#warning').removeClass('has-text-danger').text('Do not enter the first zero');
		$('.icon.is-right').remove();
		$('#sched input[type="radio"]').prop('checked', false);
	}

	function formatDate(date) {
		let hours = date.getHours(), minutes = date.getMinutes(), ampm = hours >= 12 ? 'pm' : 'am';
		hours %= 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		let strTime = hours + ':' + minutes + ' ' + ampm;
		return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' - ' + strTime;
	}

	if (window.matchMedia('only screen and (max-width: 768px)').matches) {
		$('#header .buttons').removeClass('is-right').addClass('is-centered');
		$('#header .title').addClass('has-text-centered');
	}
	$('.pageloader .title').text('Fetching Data');
	$('#dashboard').addClass('is-active');
	$('thead tr').append('<th><a id="name" title="Sort Ascending">Name<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="barangay" title="Sort Ascending">Barangay<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="number" title="Sort Ascending">Contact Number<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="schedule" title="Sort Ascending">Schedule<span class="icon"><i class="fas fa-sort"></i></span></a></th><th>Actions</th>');
	var urlGuest = 'guests', currentGuest, prevGuest, nextGuest, lastGuest, sortGuest = 'default', oldheader = '', searchGuest = '', editId;
	var urlLog = 'logs', currentLog, prevLog, nextLog, lastLog, searchLog = '';
	retrieveGuests();

	$(window).resize(function() {
		if (window.matchMedia('only screen and (max-width: 768px)').matches) {
			$('#header .buttons').removeClass('is-right').addClass('is-centered');
			$('#header .title').addClass('has-text-centered');
		} else {
			$('#header .buttons').removeClass('is-centered').addClass('is-right');
			$('#header .title').removeClass('has-text-centered');
		}
	});

	$('body').delegate('.pagination a', 'click', function() {
		if ($('#dashboard').hasClass('is-active')) {
			urlGuest = $(this).data('url');
			retrieveGuests();
		} else if ($('#logs').hasClass('is-active')) {
			urlLog = $(this).data('url');
			retrieveLogs();
		}
	});

	$('body').delegate('.pagination form', 'submit', function(e) {
		e.preventDefault();
		let page = $('#page input').val();
		if (page > lastGuest || page < 0) {
			$('#page input').addClass('is-danger');
		} else {
			if ($('#dashboard').hasClass('is-active')) {
				urlGuest = 'http://34.72.171.132/comelec/guests?page=' + page;
				retrieveGuests();
			} else if ($('#logs').hasClass('is-active')) {
				urlLog = 'http://34.72.171.132/comelec/logs?page=' + page;
				retrieveLogs();
			}
		}
	});

	$('#dashboard a').click(function() {
		if ($('.fa-spinner').length == 0) {
			if ($('#logs').hasClass('is-active')) {
				$('#logs').removeClass('is-active');
				$('#dashboard').addClass('is-active');
				$('th').remove();
				$('thead tr').append('<th><a id="name" title="Sort Ascending">Name<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="barangay" title="Sort Ascending">Barangay<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="number" title="Sort Ascending">Contact Number<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="schedule" title="Sort Ascending">Schedule<span class="icon"><i class="fas fa-sort"></i></span></a></th><th>Actions</th>');
				$('#search input').attr('placeholder', 'Search name, barangay, contact number, or schedule...').val('');
				sortGuest = 'default', searchGuest = '';
				retrieveGuests();
			}
		}
	});

	$('#logs a').click(function() {
		if ($('.fa-spinner').length == 0) {
			if ($('#logout').attr('disabled') != 'disabled') {
				if ($('#dashboard').hasClass('is-active')) {
					$('.level').addClass('is-hidden');
					$('#dashboard').removeClass('is-active');
					$('#logs').addClass('is-active');
					$('th').remove();
					$('thead tr').append('<th>Log #</th><th>Description</th><th>Date & Time</th>');
					$('#search input').attr('placeholder', 'Search log number or description...').val('');
					searchLog = '';
					retrieveLogs();
				}
			}
		}
	});

	$('#search').submit(function(e) {
		e.preventDefault();
		if ($('#dashboard').hasClass('is-active')) {
			searchGuest = $('#search input').val();
			urlGuest = 'guests';
			retrieveGuests();
		} else {
			searchLog = $('#search input').val();
			urlLog = 'logs';
			retrieveLogs();
		}
	});

	$('body').delegate('th a', 'click', function() {
		if ($('.fa-spinner').length == 0) {
			if ($('#logout').attr('disabled') != 'disabled') {
				let headerid = $(this).attr('id'), header = $(this).text();
				if (oldheader != '') {
					if (headerid != oldheader) {
						let oldtext = $('#' + oldheader).text();
						$('#' + oldheader).empty().append(oldtext + '<span class="icon"><i class="fas fa-sort"></i></span>').attr('title', 'Sort Ascending');
					}
				}
				oldheader = headerid;
				if ($(this).attr('title') == 'Sort Ascending') {
					$(this).empty().append(header + '<span class="icon"><i class="fas fa-sort-up"></i></span>').attr('title', 'Sort Descending');
					sortGuest = headerid + 'A';
					retrieveGuests();
				} else if ($(this).attr('title') == 'Sort Descending') {
					$(this).empty().append(header + '<span class="icon"><i class="fas fa-sort-down"></i></span>').attr('title', 'Remove Sorting');
					sortGuest = headerid + 'D';
					retrieveGuests();
				} else {
					$(this).empty().append(header + '<span class="icon"><i class="fas fa-sort"></i></span>').attr('title', 'Sort Ascending');
					sortGuest = 'default';
					retrieveGuests();
				}
			}
		}
	});

	$('body').delegate('.edit', 'click', function() {
		loadAction(this);
		let id = $(this).data('id'), button = this;
		editId = id;
		$.ajax({
			type: 'POST',
			url: 'guest/edit',
			data: {data:'edit', id:id},
			datatype: 'JSON',
			success: function(data) {
				$('#editModal').addClass('is-active');
				$('html').addClass('is-clipped');
				$('button').removeAttr('disabled');
				$('#export').attr('disabled', true);
				$(button).removeClass('is-loading');
				$('#lastname').val(data.last_name);
				$('#firstname').val(data.first_name);
				$('#middlename').val(data.middle_name);
				$('#brngy').val(data.barangay);
				$('#phone').val(data.contact_number.substr(1));
				data.schedule == 'CERTIFICATION' ? $('#sched input[value="cert"]').prop('checked', true) : $('#sched input[value="reg"]').prop('checked', true);
			},
			error: function(err) {
				console.log(err);
				Swal.fire({
					icon: 'error',
					title: 'Cannot Connect to Server',
					text: 'Something went wrong. PLease try again later.',
				});
				$('button').removeAttr('disabled');
				$('#export').attr('disabled', true);
				$(button).removeClass('is-loading');
			}
		});
	});	

	$('body').delegate('.remove', 'click', function() {
		loadAction(this);
		$(this).removeClass('is-inverted');
		let id = $(this).data('id'), button = this;
		$.ajax({
			type: 'POST',
			url: 'guests',
			data: {data:'delete', id:id},
			datatype: 'JSON',
			success: function(data) {
				$('button').removeAttr('disabled');
				$('#export').attr('disabled', true);
				$(button).removeClass('is-loading').addClass('is-inverted');
				Swal.fire({
					icon: 'warning',
					title: 'Confirm Delete',
					text: 'Are you sure you want to delete ' + data.first_name + ' ' + data.last_name + '?',
					showCancelButton: true,
					confirmButtonText: 'Yes',
					cancelButtonText: 'No',
				}).then((result) => {
					if (result.value) {
						Swal.fire({
							html: '<span class="icon is-large"><i class="fas fa-spinner fa-spin fa-2x"></i></span>',
							showConfirmButton: false,
							allowOutsideClick: false,
							allowEscapeKey: false,
						});
						$.ajax({
							type: 'POST',
							url: 'guest/delete',
							data: {data:'dashboard', id:id},
							datatype: 'JSON',
							success: function(response) {
								Swal.fire({
									icon: 'success',
									title: 'Delete Successful',
									text: response.msg,
									showConfirmButton: false,
									timer: 2500,
								}).then(function() {
									retrieveGuests();
								});
							},
							error: function(err) {
								console.log(err);
								Swal.fire({
									icon: 'error',
									title: 'Cannot Connect to Server',
									text: 'Something went wrong. Please try again later.'
								});
							}
						});
					}
				});
			},
			error: function(err) {
				console.log(err);
				Swal.fire({
					icon: 'error',
					title: 'Cannot Connect to Server',
					text: 'Something went wrong. Please try again later.'
				});
				$('button').removeAttr('disabled');
				$('#export').attr('disabled', true);
				$(button).removeClass('is-loading');
			}
		});
	});

	$('.delete').click(function() {
		exitModal();
	});

	$('#cancel').click(function() {
		exitModal();
	});

	$('#phone').focusout(function() {
		if (!$('#submit').hasClass('is-loading')) {
			if ($(this).is(':invalid')) {
				$(this).addClass('is-danger');
				$('#warning').addClass('has-text-danger').text('Contact number must consist of 10 digits');
				$('#submit').attr('disabled', true);
			} else {
				$('#submit').attr('disabled', true);
				$('#cancel').attr('disabled', true);
				$('.delete').attr('disabled', true);
				$(this).removeClass('is-danger');
				$('.icon.is-right').remove();
				$('#warning').removeClass('has-text-danger').text('Do not enter the first zero');
				$('#phonecontrol').addClass('is-loading');
				$(this).attr('readonly', true);
				let number = '0' + $(this).val();
				$.ajax({
					type: 'POST',
					url: 'guests',
					data: {data:'phone', contact_number:number, id:editId},
					datatype: 'JSON',
					success: function(response) {
						$('#phonecontrol').removeClass('is-loading');
						$('#phone').removeAttr('readonly');
						if (response.status == 'success') {
							$('#submit').removeAttr('disabled');
							$('#cancel').removeAttr('disabled');
							$('.delete').removeAttr('disabled');
							$('#phonecontrol').addClass('has-icons-right').append('<span class="icon is-right has-text-success"><i class="fas fa-check"></i></span>');
						} else {
							$('#cancel').removeAttr('disabled');
							$('.delete').removeAttr('disabled');
							$('#phonecontrol').addClass('has-icons-right').append('<span class="icon is-right has-text-danger"><i class="fas fa-times"></i></span>');
							$('#warning').addClass('has-text-danger').text(response.msg);
							$('#phone').addClass('is-danger');
						}
					},
					error: function (err) {
						console.log(err);
						Swal.fire({
							icon: 'error',
							title: 'Cannot Connect to Server',
							text: 'Something went wrong. Please try again later.',
						});
						$('#phonecontrol').removeClass('is-loading');
						$('#phone').removeAttr('readonly');
						$('#cancel').removeAttr('disabled');
						$('.delete').removeAttr('disabled');
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

	$('#editModal form').submit(function(e) {
		e.preventDefault();
		let lastname = $('#lastname').val(), firstname = $('#firstname').val(), middlename = $('#middlename').val(), barangay = $('#brngy').val(), number = '0' + $('#phone').val();
		let schedule = {
			'cert': 'CERTIFICATION',
			'reg': 'REGISTRATION'
		}[$('input[name="sched"]:checked').val()];
		$('#submit').addClass('is-loading');
		$('#cancel').attr('disabled', true);
		$('.delete').attr('disabled', true);
		$('#editModal input').attr('readonly', true);
		$('input[type="radio"]').attr('disabled', true);
		$('.icon.is-right').remove();
		$.ajax({
			type: 'POST',
			url: 'guest/update',
			data: {data:'update', last_name:lastname, first_name:firstname, middle_name:middlename, barangay:barangay, contact_number:number, schedule:schedule, id:editId},
			datatype: 'JSON',
			success: function(response) {
				$('#submit').removeClass('is-loading');
				$('#cancel').removeAttr('disabled');
				$('.delete').removeAttr('disabled');
				$('#editModal input').removeAttr('readonly');
				$('input[type="radio"]').removeAttr('disabled');
				if (response.status == 'success') {
					Swal.fire({
						icon: 'success',
						title: 'Participant Updated',
						text: response.msg,
						showConfirmButton: false,
						timer: 2500
					});
					$('#sched input[type="radio"]').prop('checked', false);
					$('#editModal').removeClass('is-active');
					$('html').removeClass('is-clipped');
					retrieveGuests();
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Update Failed',
						text: response.msg,
						confirmButtonText: 'Try Again'
					});
					$('#phone').addClass('is-danger');
					$('#phonecontrol').addClass('has-icons-right').append('<span class="icon is-right has-text-danger"><i class="fas fa-times"></i></span>');
					$('#warning').addClass('has-text-danger').text(response.warn);
					$('#submit').attr('disabled', true);
				}
			},
			error: function(err) {
				console.log(err);
				Swal.fire({
					icon: 'error',
					title: 'Cannot Connect to Server',
					text: 'Something went wrong. Please try again later.',
				});
				$('#submit').removeClass('is-loading');
				$('#cancel').removeAttr('disabled');
				$('.cancel').removeAttr('disabled');
				$('#editModal input').removeAttr('readonly');
				$('input[type="radio"]').removeAttr('disabled');
			}
		});
	});

	$('#logout').click(function() {
		$('.pageloader .title').text('Logging Out');
		$('.pageloader').addClass('is-active');
	});
});
