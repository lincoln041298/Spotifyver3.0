import useSpotify from "@/hooks/useSpotify";
import { IPlaylistContext, PlaylistContextState } from "@/types";
import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

const defaultPLaylistContextState: PlaylistContextState = {
  playlists: [],
  selectedPlaylistId: null,
  selectedPlaylist: null,
};

export const PlaylistContext = createContext<IPlaylistContext>({
  playlistContextState: defaultPLaylistContextState,
  updatePlaylistContextState: () => {},
});

export const usePlaylistContext = () => useContext(PlaylistContext);

const PlaylistContextProvider = ({ children }: { children: ReactNode }) => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlistContextState, setPlaylistContextState] = useState(
    defaultPLaylistContextState
  );

  const updatePlaylistContextState = (
    updateObj: Partial<PlaylistContextState>
  ) => {
    setPlaylistContextState((previousPlaylistContextSate) => ({
      ...previousPlaylistContextSate,
      ...updateObj,
    }));
  };

  useEffect(() => {
    const getUserPlaylists = async () => {
      const UserPlaylistsResponse = await spotifyApi.getUserPlaylists();
      updatePlaylistContextState({
        playlists: UserPlaylistsResponse.body.items,
      });
    };

    if (spotifyApi.getAccessToken()) {
      getUserPlaylists();
    }
  }, [session]);

  const PlaylistContextProviderData = {
    playlistContextState,
    updatePlaylistContextState,
  };
  return (
    <PlaylistContext.Provider value={PlaylistContextProviderData}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContextProvider;
