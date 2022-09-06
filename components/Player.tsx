import { useSongContext } from "@/contexts/SongContext";
import useSpotify from "@/hooks/useSpotify";
import { SongReducerActionType } from "@/types";
import {
  BackwardIcon,
  ArrowsRightLeftIcon,
  PauseIcon,
  PlayIcon,
  ForwardIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { ChangeEventHandler } from "react";
import { useDebouncedCallback } from "use-debounce";

const isPlaying = false;

const Player = () => {
  const spotifyApi = useSpotify();
  const {
    songContextSate: { isPlaying, selectedSong, deviceId, volume },
    dispatchSongAction,
  } = useSongContext();
  const handlePlayPause = async () => {
    const response = await spotifyApi.getMyCurrentPlaybackState();

    if (!response.body) return;

    if (response.body.is_playing) {
      await spotifyApi.pause();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: false,
      });
    } else {
      await spotifyApi.play();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: true,
      });
    }
  };

  const handleSkipSong = async (skipTo: "previous" | "next") => {
    if (!deviceId) return;

    if (skipTo === "previous") {
      await spotifyApi.skipToPrevious();
    } else {
      await spotifyApi.skipToNext();
    }

    const songInfo = await spotifyApi.getMyCurrentPlayingTrack();
    console.log(skipTo);
    if (!songInfo.body) return;

    dispatchSongAction({
      type: SongReducerActionType.SetCurrentPlayingSong,
      payload: {
        selectedSongid: songInfo.body.item?.id,
        selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
        isPlaying: songInfo.body.is_playing,
      },
    });
  };

  const debouncedAdjustVolume = useDebouncedCallback((volume: number) => {
    spotifyApi.setVolume(volume);
  }, 500);

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const volume = Number(event.target.value);

    if (!deviceId) return;

    debouncedAdjustVolume(volume);

    dispatchSongAction({
      type: SongReducerActionType.SetVolume,
      payload: volume,
    });
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-sm md:text-base px-2 md:px-8">
      {/* {Left} */}
      <div className="flex items-center space-x-4">
        {selectedSong && (
          <>
            <div className="hidden md:block">
              <Image
                src={selectedSong.album.images[0].url}
                alt="Albumcover for ..."
                height="40px"
                width="40px"
              />
            </div>
            <div>
              <h3 className="text-sm">{selectedSong.name}</h3>
              <p className="text-xs text-gray-100 opacity-60">
                {selectedSong.artists[0].name}
              </p>
            </div>
          </>
        )}
      </div>
      {/* {center} */}
      <div className="flex justify-evenly items-center">
        <ArrowsRightLeftIcon className="icon-playback" />
        <BackwardIcon
          className="icon-playback"
          onClick={handleSkipSong.bind(this, "previous")}
        />
        {isPlaying ? (
          <PauseIcon className="icon-playback " onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="icon-playback" onClick={handlePlayPause} />
        )}
        <ForwardIcon
          className="icon-playback"
          onClick={handleSkipSong.bind(this, "next")}
        />
        <ArrowPathIcon className="icon-playback" />
      </div>
      {/* right*/}
      <div className="flex justify-end items-center pr-5 space-x-3 md:space-x-4">
        <SpeakerWaveIcon className="icon-playback" />
        <input
          type="range"
          min={0}
          max={100}
          className="w-20 md:w-auto"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default Player;
