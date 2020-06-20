<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\User;
use App\Log;

class IndexController extends Controller
{
	public function dashboard() {
		return view('dashboard');
	}

	public function logs(Request $request) {
		if ($request->data == 'logs') {
			if ($request->search == '') {
				return Log::latest()->paginate(50);
			} else {
				return Log::where('id', 'LIKE', '%' . $request->search . '%')
				->orWhere('description', 'LIKE', '%' . $request->search . '%')->paginate(50);
			}
		}
	}
}
