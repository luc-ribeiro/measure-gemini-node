/*
  Warnings:

  - Added the required column `image_url` to the `measures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "measures" ADD COLUMN     "image_url" TEXT NOT NULL,
ALTER COLUMN "has_confirmed" SET DEFAULT false;
