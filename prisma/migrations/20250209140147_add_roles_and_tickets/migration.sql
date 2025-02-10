/*
  Warnings:

  - You are about to drop the column `adminId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "adminId",
DROP COLUMN "content",
DROP COLUMN "title",
DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "handledById" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'open',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
