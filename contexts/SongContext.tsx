import useSpotify from "@/hooks/useSpotify";
import { songReducer } from "@/reducers/songReducer";
import { ISongContext, SongContextState, SongReducerActionType } from "@/types";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

const defaultSongContextState: SongContextState = {
  selectedSongid: undefined,
  selectedSong: null,
  isPlaying: false,
  volume: 50,
  deviceId: null,
};

export const SongContext = createContext<ISongContext>({
  songContextSate: defaultSongContextState,
  dispatchSongAction: () => {},
});

export const useSongContext = () => useContext(SongContext);

const SongContextProvider = ({ children }: { children: ReactNode }) => {
  const spotifyApi = useSpotify();

  const { data: session } = useSession();

  const [songContextSate, dispatchSongAction] = useReducer(
    songReducer,
    defaultSongContextState
  );

  useEffect(() => {
    const setCurrentDevice = async () => {
      const availableDeviesResponse = await spotifyApi.getMyDevices();
      console.log(availableDeviesResponse);
      if (!availableDeviesResponse.body.devices.length) return;

      const { id: deviceId, volume_percent } =
        availableDeviesResponse.body.devices[0];

      dispatchSongAction({
        type: SongReducerActionType.SetDevice,
        payload: {
          deviceId,
          volume: volume_percent as number,
        },
      });

      await spotifyApi.transferMyPlayback([deviceId as string]);
    };

    if (spotifyApi.getAccessToken()) {
      setCurrentDevice();
    }
  }, [spotifyApi, session]);

  useEffect(() => {
    const getCurrentPlayingSong = async () => {
      const songInfo = await spotifyApi.getMyCurrentPlayingTrack();

      if (!songInfo.body) return;
      console.log("SONG INFO", songInfo);
      dispatchSongAction({
        type: SongReducerActionType.SetCurrentPlayingSong,
        payload: {
          selectedSongid: songInfo.body.item?.id,
          selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
          isPlaying: songInfo.body.is_playing,
        },
      });
    };

    if (spotifyApi.getAccessToken()) {
      getCurrentPlayingSong();
    }
  }, [spotifyApi, session]);

  const SongContextProviderData: ISongContext = {
    songContextSate,
    dispatchSongAction,
  };

  return (
    <SongContext.Provider value={SongContextProviderData}>
      {children}
    </SongContext.Provider>
  );
};

export default SongContextProvider;
