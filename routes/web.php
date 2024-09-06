<?php

use App\Http\Resources\PaymentResource;
use Inertia\Inertia;
use App\Models\Payment;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $orderColumn = request("order_column", "created_at");
    if (!in_array($orderColumn, ["name", "email", "amount", "created_at"])) {
        $orderColumn = "created_at";
    }

    $orderDirection = request("order_direction", "desc");
    if (!in_array($orderDirection, ["asc", "desc"])) {
        $orderDirection = "desc";
    }

    $payments = Payment::when(request('search_name'), fn($query) => $query->where('name', 'like', '%' . request('search_name') . '%'))
        ->when(request('search_email'), fn($query) => $query->where('email', 'like', '%' . request('search_email') . '%'))
        ->when(request('search_status'), fn($query) => $query->where('status', request('search_status')))
        ->orderBy($orderColumn, $orderDirection)
        ->paginate(10)
        // ->simplePaginate(10)
        ->onEachSide(2);

    return Inertia::render('Payments/Index', [
        'payments' => PaymentResource::collection($payments),
        'queryParams' => request()->query() ?: null,
    ]);
})->name('payments.index');

Route::get('/payments/csv/export', function () {
  //
})->name('payments.csv.export');

Route::get('/payments/xlsx/export', function () {
  //
})->name('payments.xlsx.export');
