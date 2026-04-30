<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Musonza\Chat\ConfigurationManager;

return new class extends Migration
{
    protected function schema()
    {
        $connection = config('musonza_chat.database_connection');

        return $connection ? Schema::connection($connection) : Schema::getFacadeRoot();
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->schema()->table(ConfigurationManager::CONVERSATIONS_TABLE, function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->schema()->table(ConfigurationManager::CONVERSATIONS_TABLE, function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
