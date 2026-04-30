import { router } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { MessageSquare, Users, Plus } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Conversation {
    id: string;
    conversation_id: string;
    messageable_id: string;
    messageable_type: string;
    settings: any;
    name?: string;
    private: number;
    direct_message: number;
    data: any;
    conversation: {
        id: string;
        name?: string;
        private: boolean;
        direct_message: boolean;
        data: any;
        created_at: string;
        updated_at: string;
        last_message?: {
            body: string;
            created_at: string;
        };
        participants: Array<{
            id: string;
            conversation_id: string;
            messageable_id: string;
            messageable_type: string;
            settings: any;
            messageable: {
                id: string;
                name: string;
                email: string;
            };
        }>;
    };
}

interface User {
    id: string;
    name: string;
    email: string;
}

export default function ChatIndex() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const fetchConversations = useCallback(async () => {
        try {
            const response = await fetch('/chat/conversations');

            if (!response.ok) {
                const errorData = await response.json();

                console.error('API Error:', errorData);

                setConversations([]);

                return;
            }

            const data = await response.json();
            console.log('Fetched conversations data:', data);
            console.log('Conversations data type:', typeof data);
            console.log('Is array:', Array.isArray(data));
            // Ensure data is an array
            const processedConversations = Array.isArray(data) ? data : [];
            setConversations(processedConversations);
            console.log('Conversations state after setting:', processedConversations);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            setConversations([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch('/chat/users');

            if (!response.ok) {
                const errorData = await response.json();

                console.error('API Error:', errorData);

                setUsers([]);

                return;
            }

            const data = await response.json();
            // Ensure data is an array
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchConversations();
            await fetchUsers();
        };

        loadData();
    }, [fetchConversations, fetchUsers]);

    const openConversation = (id: string) => {
        router.visit(`/chat/conversation/${id}`);
    };

    const createNewConversation = () => {
        setShowUserModal(true);
        setSelectedUsers([]);
    };

    const handleUserSelection = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const createConversationWithUsers = () => {
        if (selectedUsers.length === 0) {
            alert('Please select at least one user to start a conversation.');

            return;
        }
        
        fetch('/chat/conversations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                participants: selectedUsers,
                data: { title: `Conversation with ${selectedUsers.length} user(s)` }
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            if (data.id) {
                setShowUserModal(false);
                setSelectedUsers([]);
                router.visit(`/chat/conversation/${data.id}`);
            } else {
                console.error('No conversation ID returned:', data);
                alert('Failed to create conversation.');
            }
        })
        .catch(error => {
            console.error('Failed to create conversation:', error);
            alert('Failed to create conversation. Please check console for details.');
        });
    };

    return (
        <>
            <Head title="Chat" />
            
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-6 pl-6">
                    <div>
                        <h1 className="text-3xl font-bold">Messages</h1>
                        <p className="text-muted-foreground">Start a conversation or continue chatting</p>
                    </div>
                    <Button onClick={createNewConversation} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Conversation
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : conversations.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Start your first conversation to begin chatting
                            </p>
                            <Button onClick={createNewConversation}>
                                <Plus className="h-4 w-4 mr-2" />
                                Start Conversation
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {conversations.map((conversation) => (
                            <Card 
                                key={conversation.id} 
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => openConversation(conversation.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold">
                                                    {conversation.conversation?.name || `Conversation with ${conversation.conversation?.participants?.find((p: any) => p.messageable?.id !== conversation.messageable_id)?.messageable?.name || 'Unknown'}`}
                                                </h3>
                                                {/* Unread count not available in current structure */}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <Users className="h-3 w-3" />
                                                <span>{conversation.conversation?.participants?.length || 0} participants</span>
                                            </div>
                                            
                                            {conversation.conversation?.last_message && (
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {conversation.conversation.last_message.body}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {conversation.conversation?.last_message && (
                                            <div className="text-xs text-muted-foreground ml-4">
                                                {new Date(conversation.conversation.last_message.created_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            {/* User Selection Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
                        <CardHeader>
                            <CardTitle>Select Users to Chat With</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-y-auto">
                            {users.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    No other users available. Make sure test users are seeded.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                                            onClick={() => handleUserSelection(user.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => {}}
                                                className="rounded"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <div className="p-4 border-t flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowUserModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={createConversationWithUsers}
                                disabled={selectedUsers.length === 0}
                            >
                                Start Chat ({selectedUsers.length})
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
