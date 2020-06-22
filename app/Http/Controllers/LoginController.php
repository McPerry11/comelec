<?php

namespace App\Http\Controllers;

use Auth;
use App\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LoginController extends Controller
{
	public function login(Request $request) {
		$credentials = $request->only(['username', 'password']);

		if (Auth::attempt($credentials)) {
			Log::create(['description' => $request->username . ' has logged in.', 'created_at' => Carbon::now('+8:00')]);
			return response()->json(array('status' => 'success', 'msg' => 'Login Successful'));
		}
		return response()->json(array('status' => 'error', 'msg' => 'Invalid username and/or password'));
	}

	public function logout(Request $request) {
		Log::create(['description' => Auth::user()->username . ' has logged out.', 'created_at' => Carbon::now('+8:00')]);	
		Auth::logout();
		return redirect('login');
	}
}
