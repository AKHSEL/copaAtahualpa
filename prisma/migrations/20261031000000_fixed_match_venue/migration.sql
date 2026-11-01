-- Existing locations remain intact. New matches use the tournament's shared venue.
ALTER TABLE "Match" ALTER COLUMN "venue" SET DEFAULT 'Losa Deportiva Atahualpa';
