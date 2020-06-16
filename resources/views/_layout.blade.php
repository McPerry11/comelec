<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>UE COMELEC</title>
	@include('_styles')
	@yield('styles')
</head>
<body>
	<div class="pageloader is-bottom-to-top is-active">
		<span class="title"></span>
		<span id="nojs" class="title has-text-centered">JavaScript is off
			<br><span class="details">This requires JavaScript to full operate.</span>
			<br><span class="details">Turn on JavaScript and try again.</span></span>
		</div>
		@yield('body')

		@include('_scripts')
		@yield('scripts')
	</body>
	</html>