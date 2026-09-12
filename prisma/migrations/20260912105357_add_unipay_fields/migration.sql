-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "operator" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE INDEX "Contribution_transactionId_idx" ON "Contribution"("transactionId");
