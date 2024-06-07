/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Laboratory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Presentation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_destinationd_fkey";

-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_productId_fkey";

-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_provenanceId_fkey";

-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_saleId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_laboratoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_presentationId_fkey";

-- DropTable
DROP TABLE "Example";

-- DropTable
DROP TABLE "Laboratory";

-- DropTable
DROP TABLE "Presentation";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Sale";

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "key" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calling" (
    "id" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "min_exp_work" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "resumeKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "review" BOOLEAN NOT NULL,
    "interviewAt" TIMESTAMP(3) NOT NULL,
    "interviewLink" TEXT,
    "postulantId" TEXT,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_document_key" ON "Document"("document");

-- AddForeignKey
ALTER TABLE "Calling" ADD CONSTRAINT "Calling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_postulantId_fkey" FOREIGN KEY ("postulantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
