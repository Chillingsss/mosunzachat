<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    |
    | This option controls the database connection that will be used by the
    | chat package. You may specify any of the connections defined in your
    | database configuration file.
    |
    */
    'database_connection' => env('DB_CONNECTION', 'mysql'),

    /*
    |--------------------------------------------------------------------------
    | Model Namespace
    |--------------------------------------------------------------------------
    |
    | This option controls the default namespace for the chat models. You
    | may change this to match your application's namespace.
    |
    */
    'models' => [
        'user' => config('auth.providers.users.model', \App\Models\User::class),
    ],

    /*
    |--------------------------------------------------------------------------
    | Broadcast Channel
    |--------------------------------------------------------------------------
    |
    | This option controls the broadcast channel name for real-time events.
    |
    */
    'broadcast_channel' => env('CHAT_BROADCAST_CHANNEL', 'chat'),

    /*
    |--------------------------------------------------------------------------
    | Message Pagination
    |--------------------------------------------------------------------------
    |
    | This option controls how many messages are loaded per page.
    |
    */
    'messages_per_page' => env('CHAT_MESSAGES_PER_PAGE', 50),

    /*
    |--------------------------------------------------------------------------
    | File Upload
    |--------------------------------------------------------------------------
    |
    | This option controls file upload settings for chat messages.
    |
    */
    'uploads' => [
        'enabled' => env('CHAT_UPLOADS_ENABLED', false),
        'disk' => env('CHAT_UPLOADS_DISK', 'public'),
        'folder' => env('CHAT_UPLOADS_FOLDER', 'chat'),
        'max_size' => env('CHAT_UPLOADS_MAX_SIZE', 10240), // KB
        'allowed_types' => env('CHAT_UPLOADS_ALLOWED_TYPES', 'jpg,jpeg,png,gif,pdf,doc,docx'),
    ],
];
