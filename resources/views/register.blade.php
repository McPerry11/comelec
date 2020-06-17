@extends('_layout')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/register.css') }}">
@endsection

@section('body')
<div class="container is-fluid">
	<div class="columns is-centered is-vcentered">
		<div class="column is-7-widescreen is-8-desktop is-9-tablet">
			<div id="part" class="box has-text-centered is-hidden">
				<h3 class="title">UE COMELEC Registration & Scheduling</h3>
				<p class="subtitle">You have already regstered in this event. You can exit this tab now.</p>
			</div>
			<form class="box has-text-centered">
				<h3 class="title">UE COMELEC Registration & Scheduling</h3>
				<div class="field is-horizontal">
					<div class="field-label">
						<label class="label">Full Name</label>
					</div>
					<div class="field-body">
						<div class="field">
							<div class="control">
								<input type="text" id="lastname" class="input" placeholder="Last Name" required>
							</div>
						</div>
						<div class="field">
							<div class="control">
								<input type="text" id="firstname" class="input" placeholder="First Name" required>
							</div>
						</div>
						<div id="middlefield" class="field">
							<div class="control">
								<input type="text" id="middlename" class="input" placeholder="M.I.">
							</div>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label">
						<label class="label">Barangay</label>
					</div>
					<div class="field-body">
						<div class="field">
							<div class="control has-icons-left">
								<input type="text" id="barangay" class="input" placeholder="Your Barangay" required>
								<span class="icon is-left"><i class="fas fa-map-marker-alt"></i></span>
							</div>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label">
						<label class="label">Contact Number</label>
					</div>
					<div class="field-body">
						<div class="field">
							<div class="field has-addons">
								<div class="control">
									<a class="button is-static">+63</a>
								</div>
								<div id="phonecontrol" class="control is-expanded">
									<input type="tel" id="phone" class="input" placeholder="Your phone number" pattern="\d{10}" required>
								</div>
							</div>
							<div id="warning" class="help has-text-left">Do not enter the first zero</div>
						</div>
					</div>
				</div>
				<div class="field is-horizontal">
					<div class="field-label">
						<label class="label">Scheduling</label>
					</div>
					<div class="field-body">
						<div class="field">
							<div id="sched" class="control">
								<label class="radio"><input type="radio" name="sched" value="cert" required>Voter Certification</label>
								<label class="radio"><input type="radio" name="sched" value="reg" required>Voter Registration</label>
							</div>
						</div>
					</div>
				</div>
				<button id="submit" class="button is-success" type="submit">SUBMIT</button>
			</form>
		</div>
	</div>
</div>
@endsection

@section('scripts')
<script src="{{ asset('js/register.js') }}"></script>
@endsection