<?php

namespace App\Http\Controllers;

use App\Events\MessageSentEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Musonza\Chat\Facades\ChatFacade;

class ChatController extends Controller
{
    public function index()
    {
        return inertia('chat/index');
    }

    public function conversations()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
            $conversations = ChatFacade::conversations()->setParticipant($user)->get();
            return response()->json($conversations->toArray()['data']);
        }
        catch (\Exception $e) {
            Log::error('Failed to fetch conversations: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch conversations', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUsers()
    {
        try {
            $currentUser = Auth::user();
            if (!$currentUser) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
            $users = User::where('id', '!=', $currentUser->id)->select('id', 'name', 'email')->get();
            return response()->json($users);
        }
        catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch users', 'message' => $e->getMessage()], 500);
        }
    }

    public function createConversation(Request $request)
    {
        $request->validate([
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id',
            'data' => 'sometimes|array',
            'data.title' => 'sometimes|string|max:255'
        ]);

        $user = Auth::user();
        $participantIds = $request->participants;

        if (!in_array($user->id, $participantIds)) {
            $participantIds[] = $user->id;
        }

        $participants = User::whereIn('id', $participantIds)->get()->all();

        try {
            $conversation = ChatFacade::createConversation($participants)->makePrivate();
            return response()->json($conversation);
        }
        catch (\Exception $e) {
            Log::error('Failed to create conversation: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create conversation', 'message' => $e->getMessage()], 500);
        }
    }

    public function conversation($id)
    {
        $user = Auth::user();
        $conversation = ChatFacade::conversations()->setParticipant($user)->getById($id);

        if (!$conversation) {
            abort(404);
        }

        return inertia('chat/conversation', ['conversationId' => $id]);
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $user = Auth::user();
        $conversation = ChatFacade::conversations()->setParticipant($user)->getById($id);

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        $message = ChatFacade::message($request->message)
            ->from($user)
            ->to($conversation)
            ->send();

        Log::info('Message sent', ['message_id' => $message->id, 'conversation_id' => $id]);

        try {
            broadcast(new MessageSentEvent($message, $id));
            Log::info('MessageSentEvent broadcast successfully');
        }
        catch (\Exception $e) {
            Log::error('Failed to broadcast MessageSentEvent: ' . $e->getMessage());
        }

        return response()->json($message);
    }

    public function getMessages($id)
    {
        $user = Auth::user();
        $conversation = ChatFacade::conversations()->setParticipant($user)->getById($id);

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        $messages = ChatFacade::conversation($conversation)->setParticipant($user)->getMessages();
        return response()->json($messages->toArray()['data']);
    }
}