$(function() {
	function serverError(error) {
		console.log(error);
		Swal.fire({
			icon: 'error',
			title: 'Cannot connect to server',
			text: 'Something went wrong. Please try again later.'
		});
		$('tbody tr').remove();
		let column = $('#dashboard').hasClass('is-active') ? 5 : 2;
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
						$('tbody').append('<tr><td>' + fullname + '</td><td>' + data.guests.data[i].barangay + '</td><td>' + data.guests.data[i].contact_number + '</td><td>' + data.guests.data[i].schedule + '</td><td><div class="buttons"><button class="button" title="Edit ' + data.guests.data[i].first_name + ' ' + data.guests.data[i].last_name + '"><span class="icon"><i class="fas fa-edit"></i></span></button><button class="button is-danger is-inverted" title="Delete ' + data.guests.data[i].first_name + ' ' + data.guests.data[i].last_name + '"><span class="icon"><i class="fas fa-trash"></i></span></button></div></td></tr>');
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
		$('tbody').append('<tr><td colspan="2" class="has-text-centered"><span class="icon is-large"><i class="fas fa-spinner fa-spin fa-2x"></i></span><div class="has-text-centered">Fetching logs</div></td></tr>');
		$.ajax({
			type: 'POST',
			url: urlLog,
			data: {data:'logs', search:searchLog},
			datatype: 'JSON',
			success: function(data) {
				$('#search button').removeAttr('disabled');
				$('tbody tr').remove();
				if (data.total == 0) {
					$('tbody').append('<tr><td colspan="2" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span>No logs found</td></tr>');
				} else {
					for (let i = 0; i < data.data.length; i++)
						$('tbody').append('<tr><td>' + data.data[i].id + '</td><td>' + data.data[i].description + '</td></tr>');
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

	$('.pageloader .title').text('Loading Dashboard');
	$('#dashboard').addClass('is-active');
	$('thead tr').append('<th><a id="name" title="Sort Ascending">Name<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="barangay" title="Sort Ascending">Barangay<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="number" title="Sort Ascending">Contact Number<span class="icon"><i class="fas fa-sort"></i></span></a></th><th><a id="schedule" title="Sort Ascending">Schedule<span class="icon"><i class="fas fa-sort"></i></span></a></th><th>Actions</th>');
	var urlGuest = 'guests', currentGuest, prevGuest, nextGuest, lastGuest, sortGuest = 'default', oldheader = '', searchGuest = '';
	var urlLog = 'logs', currentLog, prevLog, nextLog, lastLog, searchLog = '';
	retrieveGuests();

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
				urlGuest = 'http://localhost/comelec/public/guests?page=' + page;
				retrieveGuests();
			} else if ($('#logs').hasClass('is-active')) {
				urlLog = 'http://localhost/comelec/public/logs?page=' + page;
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
			if ($('#dashboard').hasClass('is-active')) {
				$('.level').addClass('is-hidden');
				$('#dashboard').removeClass('is-active');
				$('#logs').addClass('is-active');
				$('th').remove();
				$('thead tr').append('<th>Log #</th><th>Description</th>');
				$('#search input').attr('placeholder', 'Search log number or description...').val('');
				searchLog = '';
				retrieveLogs();
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
	});
});