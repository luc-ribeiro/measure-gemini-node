/*
  Warnings:

  - You are about to drop the column `customer_id` on the `measures` table. All the data in the column will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customer_code` to the `measures` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "measures" DROP CONSTRAINT "measures_customer_id_fkey";

-- AlterTable
ALTER TABLE "measures" DROP COLUMN "customer_id",
ADD COLUMN     "customer_code" TEXT NOT NULL;

-- DropTable
DROP TABLE "customers";
