<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DistributorRelationship extends Model
{
    protected $fillable = [
        'parent_id',
        'child_id',
        'binary_placement',
    ];
}
