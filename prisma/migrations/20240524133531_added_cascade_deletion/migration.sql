-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_roomId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
