@extends('_layout')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/login.css') }}">
@endsection

@section('body')
<div class="container is-fluid">
	<div class="columns is-centered is-vcentered">
		<div class="column is-4-desktop is-6-tablet">
			<form class="box has-text-centered">
				<h3 class="title">UE COMELEC</h3>
				<h4 class="subtitle">LOGIN</h4>
				<div class="field">
					<div class="control has-icons-left">
						<input type="text" id="username" class="input" placeholder="Username" required>
						<span class="icon is-left"><i class="fas fa-user"></i></span>
					</div>
				</div>
				<div class="field has-addons">
					<div class="control is-expanded has-icons-left">
						<input type="password" id="password" class="input" placeholder="Password" required>
						<span class="icon is-left"><i class="fas fa-key"></i></span>
					</div>
					<div class="control">
						<button id="view" class="button" type="button"><span class="icon"><i class="fas fa-eye"></i></span></button>
					</div>
				</div>
				<div class="help has-text-danger"></div>
				<button type="submit" id="submit" class="button is-success is-fullwidth">LOGIN</button>
			</form>
		</div>
	</div>
</div>
@endsection

@section('scripts')
<script src="{{ asset('js/login.js') }}"></script>
@endsection