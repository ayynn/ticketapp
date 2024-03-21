/*
  Warnings:

  - You are about to alter the column `userName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `userName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_userName_key` ON `User`(`userName`);
