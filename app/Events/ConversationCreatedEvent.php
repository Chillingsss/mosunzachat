<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationCreatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $conversation;
    public $participants;

    public function __construct($conversation, $participants)
    {
        $this->conversation = $conversation;
        $this->participants = $participants;
    }

    public function broadcastOn()
    {
        return new Channel('mc-conversations');
    }

    public function broadcastAs()
    {
        return 'ConversationCreated';
    }

    public function broadcastWith()
    {
        return [
            'conversation' => $this->conversation,
            'participants' => $this->participants,
            'conversation_id' => $this->conversation->id,
        ];
    }
}
