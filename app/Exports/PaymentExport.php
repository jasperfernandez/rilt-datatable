<?php

namespace App\Exports;

use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;

class PaymentExport implements FromQuery
{
    use Exportable;

    public function __construct(protected $queries)
    {
        //
    }


    public function query()
    {
        return Payment::select('name', 'email', 'amount', 'status', 'created_at')
            ->when(!empty($this->queries['search_name']), fn($query) => $query->where('name', 'like', '%' . $this->queries['search_name'] . '%'))
            ->when(!empty($this->queries['search_email']), fn($query) => $query->where('email', 'like', '%' . $this->queries['search_email'] . '%'))
            ->when(!empty($this->queries['search_status']), fn($query) => $query->where('status', $this->queries['search_status']));
    }
}
