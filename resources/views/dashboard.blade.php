@extends('_layout')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
@endsection

@section('body')
<div class="level is-hidden">
	<div class="level-item"><h4 class="subtitle">Total: <span id="total"></span></h4></div>
	<div class="level-item"><h4 class="subtitle">Certification: <span id="cert"></span></h4></div>
	<div class="level-item"><h4 class="subtitle">Registration: <span id="reg"></span></h4></div>
</div>
<form id="search">
	<div class="field has-addons">
		<div class="control is-expanded">
			<input type="text" class="input" placeholder="Search name, barangay, contact number, or schedule...">
		</div>
		<div class="control">
			<button class="button is-info" type="submit" title="Search"><span class="icon"><i class="fas fa-search"></i></span></button>
		</div>
	</div>
</form>
<div class="table-container">
	<table class="table is-fullwidth">
		<thead>
			<tr>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>
@include('_modals')
@endsection

@section('scripts')
<script src="{{ asset('js/dashboard.js') }}"></script>
@endsection