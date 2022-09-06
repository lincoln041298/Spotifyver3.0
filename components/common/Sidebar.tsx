import { usePlaylistContext } from "@/contexts/PLaylistContext";
import useSpotify from "@/hooks/useSpotify";
import {
  BuildingLibraryIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import IconButton from "../Feature/IconButton";

const Devider = () => <hr className="border-t=[0.5px] border-gray-900" />;

const Sidebar = () => {
  const spotifyApi = useSpotify();
  const {
    playlistContextState: { playlists },
    updatePlaylistContextState,
  } = usePlaylistContext();

  const setSelectedPlaylist = async (playlistId: string) => {
    const playlistsResponse = await spotifyApi.getPlaylist(playlistId);
    updatePlaylistContextState({
      selectedPlaylistId: playlistId,
      selectedPlaylist: playlistsResponse.body,
    });
  };
  return (
    <div className=" text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hidden sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block">
      <div className="space-y-4">
        <IconButton icon={HomeIcon} label="Home" />
        <IconButton icon={MagnifyingGlassIcon} label="Search" />
        <IconButton icon={BuildingLibraryIcon} label="Your Library" />
        <Devider />
        <IconButton icon={PlusCircleIcon} label="Create PLaylist" />
        <IconButton icon={HeartIcon} label="Liked Songs" />
        <IconButton icon={RssIcon} label="Your episodes" />
        <Devider />
        {/* {Playlist} */}
        {playlists.map(({ id, name }) => (
          <p
            key={id}
            className="cursor-pointer hover:text-white"
            onClick={() => {
              setSelectedPlaylist(id);
            }}
          >
            {name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
