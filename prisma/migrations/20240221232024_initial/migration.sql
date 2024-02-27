-- CreateEnum
CREATE TYPE "DatabaseType" AS ENUM ('POSTGRESQL', 'MYSQL', 'MARIADB', 'MONGODB', 'REDIS');

-- CreateEnum
CREATE TYPE "Protocol" AS ENUM ('HTTP', 'HTTPS');

-- CreateEnum
CREATE TYPE "BotImage" AS ENUM ('NODE_20', 'NODE_18', 'PHP_APACHE_82', 'PHP_APACHE_81', 'PHP_CLI_82', 'PHP_CLI_81', 'JAVA_21', 'JAVA_17', 'JAVA_11', 'RUBY_33', 'RUBY_32', 'RUBY_31', 'RUBY_30', 'GOLANG_1_22', 'GOLANG_1_21');

-- CreateTable
CREATE TABLE "WebTokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiToken" (
    "id" TEXT NOT NULL,
    "expiration" TIMESTAMP(3),
    "allowed_ips" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "token" TEXT NOT NULL,

    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Database" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "type" "DatabaseType" NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Database_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image" "BotImage" NOT NULL,
    "token" TEXT NOT NULL,
    "env" JSONB NOT NULL,
    "git_repo" TEXT NOT NULL,
    "webhook_token" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "websites" JSONB[] DEFAULT ARRAY[]::JSONB[],

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CronJob" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "cron_time" TEXT NOT NULL,
    "cron_data" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "CronJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebTokens_token_key" ON "WebTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Bot_webhook_token_key" ON "Bot"("webhook_token");

-- AddForeignKey
ALTER TABLE "Database" ADD CONSTRAINT "Database_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CronJob" ADD CONSTRAINT "CronJob_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
