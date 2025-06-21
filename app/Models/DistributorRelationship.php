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

    public function parent()
    {
        return $this->belongsTo(Distributor::class, 'parent_id');
    }

    public function child()
    {
        return $this->belongsTo(Distributor::class, 'child_id');
    }
}
