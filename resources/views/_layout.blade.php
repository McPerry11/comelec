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
		@if (Request::is('login') || Request::is('register'))
		@yield('body')
		@else
		<div class="container is-fluid">
			<div class="box">
				<h3 class="title">UE COMELEC Registration & Scheduling</h3>
				<div class="tabs is-boxed">
					<ul>
						<li id="dashboard"><a><span class="icon"><i class="fas fa-columns"></i></span><span>Dashboard</span></a></li>
						<li id="logs"><a><span class="icon"><i class="fas fa-stream"></i></span><span>Logs</span></a></li>
					</ul>
				</div>
				@yield('body')
			</div>
		</div>
		@endif

		@include('_scripts')
		@yield('scripts')
	</body>
	</html>