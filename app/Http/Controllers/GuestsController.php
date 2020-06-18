<?php

namespace App\Http\Controllers;

use App\Log;
use App\Guest;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GuestsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      if ($request->data == 'phone') {
        $duplicate = Guest::where('contact_number', $request->contact_number)->count();

        if ($duplicate > 0) {
          return response()->json(array(
            'status' => 'error',
            'msg' => 'This contact number is already taken'
          ));
        }
        return response()->json(array('status' => 'success'));
      } else if ($request->data == 'dashboard') {
        return Guest::paginate(50);
      }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
      return view('register');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      if ($request->data == 'register') {
        $regex = '/\d{10}/';
        if (preg_match($regex, $request->contact_number)) {
          $duplicate = Guest::where('contact_number', $request->contact_number)->count();
          if ($duplicate > 0) {
            return response()->json(array('status' => 'error', 'msg' => 'The contact number is already taken', 'warn' => 'This contact number is already taken'));
          }
        } else {
          return response()->json(array('status' => 'error', 'msg' => 'The contact number is invalid', 'warn' => 'Contact number must consist of 10 digits'));
        }

        $request->last_name = strip_tags($request->last_name);
        $request->first_name = strip_tags($request->first_name);
        $request->middle_name = strip_tags($request->middle_name);
        $request->barangay = strip_tags($request->barangay);

        $guest = new Guest;
        $guest->fill($request->only([
          'last_name',
          'first_name',
          'middle_name',
          'barangay',
          'contact_number',
          'schedule'
        ]));

        $guest->created_at = Carbon::now('+8:00');
        $guest->updated_at = Carbon::now('+8:00');

        $guest->save();
        Log::create(['description' => $request->last_name . ', ' . $request->first_name . ' ' . $request->middle_name . ' has been registered.', 'created_at' => Carbon::now('+8:00'), 'updated_at' => Carbon::now('+8:00')]);
        return response()->json(array('status' => 'success', 'msg' => 'Registration Successful'));
      }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
  }
