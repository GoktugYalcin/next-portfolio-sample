import React from "react";
import spotify from "@/lib/fetchers/spotify";
import { SPOTIFY_RECENT_TRACKS_TYPES } from "@/types/spotify";
import Link from "next/link";

// Define types for the song object
interface Song {
  url: string;
  img: string;
  song: string;
  artists: string[];
}

// Define types for rectangle objects for position calculation
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Define types for the position object
interface Position {
  left: string;
  top: string;
}

const SpotifyRandomCards: React.FC = async () => {
  // Fetch songs
  const songs = await spotify.getLastListenedSongs(
    SPOTIFY_RECENT_TRACKS_TYPES.MULTIPLE_TRACKS
  );

  // Function to check if two rectangles overlap
  const doRectsOverlap = (rect1: Rect, rect2: Rect): boolean => {
    return !(
      rect1.left + rect1.width < rect2.left ||
      rect1.top + rect1.height < rect2.top ||
      rect1.left > rect2.left + rect2.width ||
      rect1.top > rect2.top + rect2.height
    );
  };

  // Function to generate a position and check for overlaps
  const generateNonOverlappingPosition = (
    existingPositions: Position[],
    containerWidth: number,
    containerHeight: number
  ): Position => {
    const cardWidth = 300; // Approximate width of a card
    const cardHeight = 400; // Approximate height of a card
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const left = Math.random() * (containerWidth - cardWidth);
      const top = Math.random() * (containerHeight - cardHeight);

      const newRect: Rect = {
        left,
        top,
        width: cardWidth,
        height: cardHeight,
      };

      // Check if this position overlaps with any existing positions
      const hasOverlap = existingPositions.some((pos) =>
        doRectsOverlap(newRect, {
          left: (parseFloat(pos.left) * containerWidth) / 100,
          top: (parseFloat(pos.top) * containerHeight) / 100,
          width: cardWidth,
          height: cardHeight,
        })
      );

      if (!hasOverlap) {
        return {
          left: `${(left / containerWidth) * 100}%`,
          top: `${(top / containerHeight) * 100}%`,
        };
      }

      attempts++;
    }

    // If we couldn't find a non-overlapping position, place it in a grid
    const index = existingPositions.length;
    const columns = 3;
    const column = index % columns;
    const row = Math.floor(index / columns);

    return {
      left: `${column * 33}%`,
      top: `${row * 420}px`,
    };
  };

  return (
    <div>
      <div className="mb-10 mt-12 text-2xl text-center">
        Recent tracks that a person listened to can give some tips about their
        situation.
      </div>
      <div className="relative flex flex-wrap gap-3 w-full rounded-xl p-12 overflow-scroll">
        {songs.map((song, index) => (
          <Link
            target={"_blank"}
            href={song.url}
            key={song.url}
            className={`
              p-4 
              rounded-lg 
              shadow-md 
              cursor-pointer 
              transition-all 
              duration-300 
              hover:scale-110 
              hover:shadow-xl 
              hover:z-10
              backdrop-blur-sm 
              bg-opacity-90
              bg-gray-800
              w-[280px]
            `}
          >
            {/* Album Art */}
            <div className="relative h-52 bg-gradient-to-br flex items-center justify-center">
              <img
                src={song.img}
                alt={`${song.song} artwork`}
                className="w-48 h-48 rounded-lg shadow-lg"
              />
            </div>

            {/* Song Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold truncate">{song.song}</h3>
              <p className="text-gray-400 text-sm mt-1 truncate">
                {song.artists.join(", ")}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                  Song
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpotifyRandomCards;
