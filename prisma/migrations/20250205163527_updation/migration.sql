/*
  Warnings:

  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Client', 'Admin');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('High', 'Mid', 'Low');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Closed');

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- DropTable
DROP TABLE "Ticket";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
