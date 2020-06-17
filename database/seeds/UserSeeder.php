<?php

use App\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
  	$user = new User;

  	$user->username = 'rndunit';
  	$user->password = 'ccssrnd2008';

  	$user->save();
  }
}
