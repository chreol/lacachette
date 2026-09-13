CREATE TABLE "SiteImage" (
    "path" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteImage_pkey" PRIMARY KEY ("path")
);
