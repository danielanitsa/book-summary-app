/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookSummary" DROP CONSTRAINT "BookSummary_bookId_fkey";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "BookSummary";
