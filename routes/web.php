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

Route::get('', 'IndexController@dashboard');
