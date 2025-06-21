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

    public function parent()
    {
        return $this->belongsTo(Distributor::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Distributor::class, 'parent_id');
    }
}
