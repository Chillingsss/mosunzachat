<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Authorize chat conversation channels for Musonza Chat
Broadcast::channel('mc-chat-conversation.{conversationId}', function ($user, $conversationId) {
    // Check if user is a participant in the conversation
    return \Musonza\Chat\Models\Conversation::find($conversationId)
        ->participants()
        ->where('messageable_id', $user->id)
        ->where('messageable_type', get_class($user))
        ->exists();
});
