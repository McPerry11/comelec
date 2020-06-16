<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
	protected $fillable = [
		'last_name',
		'first_name',
		'middle_name',
		'barangay',
		'contact_number',
		'schedule',
	];

	protected $hidden = [
		'remember_token',
	];
}
