<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Musonza\Chat\Facades\ChatFacade;
use Musonza\Chat\Models\Conversation;
use Illuminate\Support\Facades\Auth;

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
            
            // The get method returns a paginator, so we need to access the 'data' property.
            return response()->json($conversations->toArray()['data']);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch conversations: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch conversations',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getUsers()
    {
        try {
            $currentUser = Auth::user();
            if (!$currentUser) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
            
            $users = \App\Models\User::where('id', '!=', $currentUser->id)
                ->select('id', 'name', 'email')
                ->get();
                
            return response()->json($users);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch users: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch users',
                'message' => $e->getMessage()
            ], 500);
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
        
        // Add current user to participants if not already included
        if (!in_array($user->id, $participantIds)) {
            $participantIds[] = $user->id;
        }

        // Fetch User models instead of using IDs
        $participants = \App\Models\User::whereIn('id', $participantIds)->get()->all();

        try {
            $conversation = ChatFacade::createConversation($participants)
                ->makePrivate();

            // Note: Title will be handled on the frontend for now
            // The musonza/chat package stores metadata differently

            return response()->json($conversation);
        } catch (\Exception $e) {
            \Log::error('Failed to create conversation: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create conversation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function conversation($id)
    {
        $user = Auth::user();
        $conversation = ChatFacade::conversations()->setParticipant($user)->getById($id);
        
        if (!$conversation) {
            abort(404);
        }

        return inertia('chat/conversation', [
            'conversationId' => $id
        ]);
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
        
        // The getMessages method returns a paginator, so we need to access the 'data' property.
        return response()->json($messages->toArray()['data']);
    }
}
