<!DOCTYPE html>
<html lang="en" class="has-background-info">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>UE COMELEC</title>
	@include('_styles')
	@yield('styles')
</head>
<body>
	<div class="pageloader is-info is-bottom-to-top is-active">
		<span class="title"></span>
		<span id="nojs" class="title has-text-centered">JavaScript is off
			<br><span class="details">This requires JavaScript to fully operate.</span>
			<br><span class="details">Turn on JavaScript and try again.</span></span>
		</div>
		@if (Request::is('login') || Request::is('register'))
		@yield('body')
		@else
		<div class="container is-fluid">
			<div class="box">
				<div id="header" class="columns">
					<div class="column">
						<h3 class="title">UE COMELEC Registration & Scheduling</h3>
					</div>
					<form method="POST" class="column is-3-desktop is-5-tablet">
						@csrf
						<div class="buttons is-right">
							<button id="export" class="button is-info" type="button" title="Export is not available yet" disabled><span class="icon"><i class="fas fa-file-excel"></i></span>Export</button>
							<button id="logout" class="button is-danger is-outlined" title="Logout" type="submit"><span class="icon"><i class="fas fa-sign-out-alt"></i></span>Logout</button>
						</div>
					</form>
				</div>
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
