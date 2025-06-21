<?php

namespace App\Http\Controllers;

use App\Models\Distributor;
use App\Models\DistributorRelationship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DistributorController extends Controller
{
    public function index()
    {
        $hasDistributors = Distributor::exists();

        return view('welcome', [
            'hasDistributors' => $hasDistributors,
        ]);
    }


    public function generateTree(Request $request)
    {
        $file = $request->file('file');
        $content = file_get_contents($file->getRealPath());
        $jsonData = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Invalid JSON file.'], 422);
        }

        DB::transaction(function () use ($jsonData) {
            $this->saveDistributors($jsonData['data']['attributes']);
        });

        return response()->json(['message' => 'JSON processed successfully.']);
    }

    private function saveDistributors(array $distributors, ?int $parentId = null): void
    {
        foreach ($distributors as $dist) {
            $distributor = Distributor::create([
                'username' => $dist['username'],
                'num_children' => $dist['num_children'],
                'full_name' => $dist['full_name'],
                'status' => $dist['status'],
                'product_name' => $dist['product_name'],
                'category_name' => $dist['category_name'],
            ]);

            if ($parentId) {
                DistributorRelationship::create([
                    'parent_id' => $parentId,
                    'child_id' => $distributor->id,
                    'binary_placement' => $dist['binary_placement'],
                ]);
            }

            if (!empty($dist['children'])) {
                $this->saveDistributors($dist['children'], $distributor->id);
            }
        }
    }

    public function fetchTreeData()
    {
        $distributors = Distributor::all()->keyBy('id');
        $relationships = DistributorRelationship::all();

        return response()->json([
            'distributors' => $distributors,
            'relationships' => $relationships,
        ]);
    }
}
