/*
  Warnings:

  - You are about to drop the `ImageReading` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ImageReading`;

-- CreateTable
CREATE TABLE `MeteringMeasurement` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(254) NOT NULL,
    `customerCode` VARCHAR(254) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `measureUUID` VARCHAR(254) NOT NULL,
    `measureValue` INTEGER NOT NULL,
    `measureDatetime` DATETIME(3) NOT NULL,
    `measureType` ENUM('WATER', 'GAS') NOT NULL,

    UNIQUE INDEX `MeteringMeasurement_measureUUID_key`(`measureUUID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
