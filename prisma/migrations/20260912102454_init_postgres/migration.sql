-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "targetQty" INTEGER NOT NULL,
    "village" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "illustration" TEXT,
    "proofPhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "donorName" TEXT,
    "donorEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_village_idx" ON "Campaign"("village");

-- CreateIndex
CREATE INDEX "Campaign_productType_idx" ON "Campaign"("productType");

-- CreateIndex
CREATE INDEX "Contribution_campaignId_idx" ON "Contribution"("campaignId");

-- CreateIndex
CREATE INDEX "Contribution_status_idx" ON "Contribution"("status");

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
