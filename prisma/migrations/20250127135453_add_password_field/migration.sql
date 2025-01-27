/*
  Warnings:

  - The `priority` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Client', 'Admin');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('High', 'Mid', 'Low');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Closed');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'Low',
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Active';
