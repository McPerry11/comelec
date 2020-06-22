<div id="editModal" class="modal">
	<div class="modal-background"></div>
	<form class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Edit</p>
			<button class="delete"></button>
		</header>
		<section class="modal-card-body">
			<div class="field is-horizontal">
				<div class="field-label">
					<label class="label">Full Name</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<input type="text" id="lastname" class="input" placeholder="Last Name" name="last" required>
						</div>
					</div>
					<div class="field">
						<div class="control">
							<input type="text" id="firstname" class="input" placeholder="First Name" name="first" required>
						</div>
					</div>
					<div id="middlefield" class="field">
						<div class="control">
							<input type="text" id="middlename" class="input" placeholder="M.I." name="mid">
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
							<input type="text" id="brngy" class="input" placeholder="Your Barangay" name="barangay" required>
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
					<div class="field has-addons">
						<div class="control">
							<a class="button is-static">+63</a>
						</div>
						<div id="phonecontrol" class="control is-expanded">
							<input type="tel" id="phone" class="input" placeholder="Your phone number" pattern="\d{10}" name="phone" required>
						</div>
					</div>
					<div id="warning" class="help has-text-left">Do not enter the first zero</div>
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
		</section>
		<footer class="modal-card-foot">
			<div class="buttons">
				<button id="submit" class="button is-success" type="submit">Save Changes</button>
				<button id="cancel" class="button" type="button">Cancel</button>
			</div>
		</footer>
	</form>
</div>
