-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "googleBookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "authors" TEXT[],
    "publishedDate" TEXT,
    "categories" TEXT[],
    "description" TEXT,
    "coverImageUrl" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookSummary" (
    "id" SERIAL NOT NULL,
    "summary" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "BookSummary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookSummary" ADD CONSTRAINT "BookSummary_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
