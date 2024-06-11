-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "coverUrl" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "audioUrl" TEXT,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Summary_bookId_key" ON "Summary"("bookId");

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
