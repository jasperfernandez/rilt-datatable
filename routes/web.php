<?php

use Inertia\Inertia;
use App\Models\Payment;
use App\Exports\PaymentExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Resources\PaymentResource;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::get('/payments', function () {
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
    return Excel::download(new PaymentExport(request()->query()), 'payments.csv', \Maatwebsite\Excel\Excel::CSV, [
        'Content-Type' => 'text/csv',
    ]);
})->name('payments.csv.export');

Route::get('/payments/xlsx/export', function () {
    return Excel::download(new PaymentExport(request()->query()), 'payments.xlsx', \Maatwebsite\Excel\Excel::XLSX);
})->name('payments.xlsx.export');
