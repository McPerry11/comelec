$(function() {
	function serverError(error) {
		console.log(error);
		Swal.fire({
			icon: 'error',
			title: 'Cannot connect to server',
			text: 'Something went wrong. Please try again later.'
		});
	}

	function pagination(current, prev, next, first, last, lastpage) {
		$('.box').append('<nav class="pagination is-right"></nav>');
		if (prev != null) $('.pagination').append('<a class="pagination-previous" data-url="' + prev + '">Previous</a>');
		if (next != null) $('.pagination').append('<a class="pagination-next" data-url="' + next + '">Next</a>');
		if (lastpage >= 3) $('.pagination').append('<form class="pagination-list"><div class="field has-addons"><div class="control"><button id="goto" class="button is-info" type="submit">Go to</button></div><div id="page" class="control"><input type="number" class="input" min="1" max="' + lastpage + '" value="' + current + '" placeholder="Page #"></div><div class="control"><a class="button is-static">/ ' + lastpage + '</a></div></div></form>');
	}

	function retrieveGuests() {
		$('tbody tr').remove();
		$('tbody').append('<tr><td colspan="5" class="has-text-centered"><span class="icon is-large"><i class="fas fa-2x fa-spinner fa-spin"></i></span></td></tr>');
		$('nav').remove();
		$.ajax({
			type: 'POST',
			url: urlGuest,
			data: {data:'dashboard'},
			datatype: 'JSON',
			success: function(data) {
				$('.pageloader .title').text('Generating Table');
				if (data.total == 0) {
					$('tbody tr').remove();
					$('tbody').append('<tr><td colspan="5" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span>No registered participants found.</td></tr>');
				} else {
					$('tbody tr').remove();
					for (let i = 0; i < data.data.length; i++) {
						let fullname = data.data[i].last_name + ', ' + data.data[i].first_name;
						if (data.data[i].middle_name) fullname += ' ' + data.data[i].middle_name;
						$('tbody').append('<tr><td>' + fullname + '</td><td>' + data.data[i].barangay + '</td><td>' + data.data[i].contact_number + '</td><td>' + data.data[i].schedule + '</td><td><div class="buttons"><button class="button"><span class="icon"><i class="fas fa-edit"></i></span></button><button class="button is-danger is-inverted"><span class="icon"><i class="fas fa-trash"></i></span></button></div></td></tr>');
					}
					if (data.last_page > 1) {
						currentGuest = data.current_page, prevGuest = data.prev_page_url, nextGuest = data.next_page_url, firstGuest = data.first_page_url, lastGuest = data.last_page_url;
						pagination(currentGuest, prevGuest, nextGuest, firstGuest, lastGuest, data.last_page);
					}
				}
				$('.pageloader .title').text('');
				$('.pageloader').removeClass('is-active');
			},
			error: function(err) {
				serverError(err);
				$('tbody tr').remove();
				$('tbody').append('<tr><td colspan="5" class="has-text-centered"><span class="icon"><i class="fas fa-exclamation-circle"></i></span>Something went wrong. Please refresh and try again.</td></tr>');
			}
		});
	}

	$('.pageloader .title').text('Loading Dashboard');
	$('#dashboard').addClass('is-active');
	$('thead tr').append('<th>Name</th><th>Barangay</th><th>Contact Number</th><th>Schedule</th><th>Actions</th>');
	var urlGuest = 'guests', currentGuest, prevGuest, nextGuest, firstGuest, lastGuest;
	retrieveGuests();

	$('body').delegate('.pagination a', 'click', function() {
		urlGuest = $(this).data('url');
		retrieveGuests();
	});

	$('body').delegate('.pagination form', 'submit', function(e) {
		e.preventDefault();
		let page = $('#page input').val();
		if (page > lastGuest || page < 0) {
			$('#page input').addClass('is-danger');
		} else {
			urlGuest = 'http://localhost/comelec/public/guests?page=' + page;
			retrieveGuests();
		}
	});
});