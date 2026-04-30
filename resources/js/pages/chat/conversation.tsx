import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Send, MessageSquare, Users } from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Message {
    id: string;
    body: string;
    created_at: string;
    sender: {
        id: string;
        name: string;
    };
}

interface Props {
    conversationId: string;
}

export default function ChatConversation({ conversationId }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`/chat/conversation/${conversationId}/messages`);
            const data = await response.json();
            console.log('Fetched messages data:', data);
            console.log('Data type:', typeof data);
            console.log('Is array:', Array.isArray(data));
            // Ensure data is an array
            const processedMessages = Array.isArray(data) ? data : [];
            setMessages(processedMessages);
            console.log('Messages state after setting:', processedMessages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchMessages();
        };

        loadData();
        
        // Poll for new messages every 3 seconds (simple implementation)
        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);
        
        return () => clearInterval(interval);
    }, [fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim()) {
            return;
        }
        
        setSending(true);
        
        try {
            const response = await fetch(`/chat/conversation/${conversationId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    message: newMessage.trim()
                })
            });
            
            if (response.ok) {
                setNewMessage('');
                await fetchMessages();
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const goBack = () => {
        router.visit('/chat');
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    if (loading) {
        return (
            <>
                <Head title="Loading Conversation..." />
                <div className="container mx-auto py-8">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Chat Conversation" />
            
            <div className="container mx-auto py-4 h-screen max-h-screen">
                <div className="flex flex-col h-full gap-4">
                    {/* Header */}
                    <Card className="shrink-0">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={goBack}
                                        className="p-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <div>
                                        <CardTitle className="text-lg">Conversation</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            <span>Active now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Messages */}
                    <Card className="flex-1 min-h-0">
                        <CardContent className="p-4 h-full overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                                    <p className="text-muted-foreground">
                                        Start the conversation with a message
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${
                                                message.sender.id === '1' ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.sender.id === '1'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                }`}
                                            >
                                                <div className="text-xs opacity-70 mb-1">
                                                    {message.sender.name}
                                                </div>
                                                <div className="text-sm">
                                                    {message.body}
                                                </div>
                                                <div className={`text-xs mt-1 ${
                                                    message.sender.id === '1' 
                                                        ? 'text-primary-foreground/70' 
                                                        : 'text-muted-foreground'
                                                }`}>
                                                    {formatTime(message.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Message Input */}
                    <Card className="shrink-0">
                        <CardContent className="p-4">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                    disabled={sending}
                                />
                                <Button 
                                    type="submit" 
                                    disabled={!newMessage.trim() || sending}
                                    className="flex items-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    {sending ? 'Sending...' : 'Send'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
