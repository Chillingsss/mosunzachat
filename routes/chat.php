<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('chat')->name('chat.')->group(function () {
    Route::get('/', [ChatController::class, 'index'])->name('index');
    Route::get('/conversations', [ChatController::class, 'conversations'])->name('conversations');
    Route::get('/users', [ChatController::class, 'getUsers'])->name('users');
    Route::post('/conversations', [ChatController::class, 'createConversation'])->name('conversations.create');
    Route::get('/conversation/{id}', [ChatController::class, 'conversation'])->name('conversation');
    Route::post('/conversation/{id}/message', [ChatController::class, 'sendMessage'])->name('message.send');
    Route::get('/conversation/{id}/messages', [ChatController::class, 'getMessages'])->name('messages');
});
