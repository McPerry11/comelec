<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('register', 'GuestsController@create');
Route::post('register', 'GuestsController@store');

Route::post('guests', 'GuestsController@index');

Route::get('login', 'IndexController@login')->name('login');
Route::post('login', 'LoginController@login');

Route::group(['middleware' => 'auth'], function() {
	Route::get('', 'IndexController@dashboard');
	Route::post('', 'LoginController@logout');
	Route::post('guest/edit', 'GuestsController@edit');
	Route::post('guest/update', 'GuestsController@update');

	Route::post('logs', 'IndexController@logs');
});