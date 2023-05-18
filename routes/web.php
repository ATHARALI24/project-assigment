<?php

use App\Http\Controllers\SampleForm;
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

Route::get('/', function () {
    //return view('welcome');
    return view('index');
});

// add profile route
route::POST('action',[SampleForm::class,'add'])->middleware('only.ajax');


// delete profile route
route::POST('delete',[SampleForm::class,'delete_data'])->middleware('only.ajax');

// edit profile route
route::POST('edit',[SampleForm::class,'edit_data'])->middleware('only.ajax');
