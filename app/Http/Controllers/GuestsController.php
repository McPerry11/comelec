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
        switch($request->sort) {
          case 'nameA':
          $orderby = 'last_name';
          $order = 'asc';
          break;

          case 'nameD':
          $orderby = 'last_name';
          $order = 'desc';
          break;

          case 'barangayA':
          $orderby = 'barangay';
          $order = 'asc';
          break;

          case 'barangayD':
          $orderby = 'barangay';
          $order = 'desc';
          break;

          case 'numberA':
          $orderby = 'contact_number';
          $order = 'asc';
          break;

          case 'numberD':
          $orderby = 'contact_number';
          $order = 'desc';
          break;

          case 'scheduleA':
          $orderby = 'schedule';
          $order = 'asc';
          break;

          case 'scheduleD':
          $orderby = 'schedule';
          $order = 'desc';
          break;

          default:
          $orderby = 'default';
          $order = 'default';
          break;
        }

        if ($request->search == '') {
          $cert = Guest::where('schedule', 'CERTIFICATION')->count();
          $reg = Guest::where('schedule', 'REGISTRATION')->count();
          if ($orderby == 'default') {
            $guests = Guest::latest()->paginate(20);
          } else {
            $guests = Guest::orderBy($orderby, $order)->paginate(20);
          }
        } else {
          if ($orderby == 'default') {
            $guests = Guest::where('last_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('first_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('middle_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('barangay', 'LIKE', '%' . $request->search . '%')
            ->orWhere('contact_number', 'LIKE', '%' . $request->search . '%')
            ->orWhere('schedule', 'LIKE', '%' . $request->search . '%')->paginate(20);
            $guestscheck = Guest::where('last_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('first_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('middle_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('barangay', 'LIKE', '%' . $request->search . '%')
            ->orWhere('contact_number', 'LIKE', '%' . $request->search . '%')
            ->orWhere('schedule', 'LIKE', '%' . $request->search . '%')->get();
          } else {
            $guests = Guest::where('last_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('first_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('middle_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('barangay', 'LIKE', '%' . $request->search . '%')
            ->orWhere('contact_number', 'LIKE', '%' . $request->search . '%')
            ->orWhere('schedule', 'LIKE', '%' . $request->search . '%')
            ->orderBy($orderby, $order)->paginate(20);
            $guestscheck = Guest::where('last_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('first_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('middle_name', 'LIKE', '%' . $request->search . '%')
            ->orWhere('barangay', 'LIKE', '%' . $request->search . '%')
            ->orWhere('contact_number', 'LIKE', '%' . $request->search . '%')
            ->orWhere('schedule', 'LIKE', '%' . $request->search . '%')
            ->orderBy($orderby, $order)->get();
          }
          $reg = 0;
          $cert = 0;
          foreach ($guestscheck as $guest) {
            if ($guest->schedule == 'CERTIFICATION') {
              $cert ++;
            } else {
              $reg ++;
            }
          }
        }
        return response()->json(array('cert' => $cert, 'reg' => $reg, 'guests' => $guests));
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
