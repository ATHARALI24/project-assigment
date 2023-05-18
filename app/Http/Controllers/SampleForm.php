<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Nette\Utils\Validators;
use Illuminate\Support\Facades\Validator;
use Mockery\Expectation;

class SampleForm extends Controller
{
    protected $file;
    public function __construct()
    {
        // json file path
        $this->file=public_path().'//data.json';
    }

    public function add(Request $request)
    {
        $file = $this->file;
        $validitor=Validator::make($request->all(),[
            'name' => 'required',
           // 'images' => 'required',
            'address' => 'required',

        ]);
        if($validitor->passes())
        {

            $error = array();

            $data = array();

            $id = time();
            try{


                $name=$request->input('name');
                $address=$request->input('address');
                $gender=$request->input('gender');
                $filename="";

                //heare file upload
                if ($request->hasfile('images')) {
                    // $filename="abc1.png";
                      $file = $request->file('images');
                      $extension = $file->getClientOriginalExtension();

                      $filename = "img".time() . '.' . $extension;
                      $file->move( public_path('images'),$filename);

                 }

                $req_data=[
                   "id"=>$id,
                   "name"=>$name,
                   "images"=>$filename,
                   "address"=>$address,
                   "gender"=>$gender,
                ];


                $file_data = json_decode(file_get_contents($this->file), true);

                if($request->input('action')=='Add')
                {

                    // Add New Record in json file

                    $file_data[] = $req_data;
                    file_put_contents($this->file,json_encode($file_data));
                     return response()->json(['success'=>"Dada Added Successfully",'filedata'=>$file_data]);
                }
                else
                {

                    // Edit Record by Reference Id

                    $key = array_search($request->input('id'), array_column($file_data,'id'));

                    $file_data[$key]['name'] = $name;

                    $file_data[$key]['address'] = $address;

                    $file_data[$key]['gender'] = $gender;

                    $file_data[$key]['images']=$filename;

                    file_put_contents($this->file,json_encode($file_data));


                      return response()->json(['success'=>"Dada Update Successfully",'filedata'=>$file_data]);
                }
            }
            catch (Exception $e)
            {

                return response(['error'=> $e->getMessage()]);
            }



        }

        else
        {
            return response()->json(['error'=>$validitor->errors()]);
        }


    }
    public function delete_data(Request $request)
    {

        try{

            $data = json_decode(file_get_contents($this->file), true);

            $key = array_search($request->input('id'),array_column($data,'id'));

            unset($data[$key]);
           // $file_data[] = $data;

           file_put_contents($this->file, json_encode($data));

            return response()->json(['success'=>"Dada Deleted Successfully"]);

        }
        catch (Exception $e)
        {

            return response(['error'=> $e->getMessage()]);
        }


    }
    public function edit_data(Request $request)
    {

        $file_data = json_decode(file_get_contents($this->file), true);

		$key = array_search($request->input('id'),array_column($file_data,'id'));

		return response()->json(['success'=>"Data Added successfully","data_file"=>$file_data[$key+1]]);
    }
}
