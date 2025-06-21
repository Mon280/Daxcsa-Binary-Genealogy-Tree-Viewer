<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distributor extends Model
{
    protected $fillable = [
        'num_children',
        'username',
        'full_name',
        'status',
        'product_name',
        'category_name',
    ];
}
