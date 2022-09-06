import Player from "@/components/Player";
import PlaylistContextProvider from "@/contexts/PLaylistContext";
import SongContextProvider from "@/contexts/SongContext";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Center from "../components/common/Center";
import Sidebar from "../components/common/Sidebar";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <PlaylistContextProvider>
        <SongContextProvider>
          <Head>
            <title>Spotify 3.0</title>
            <meta name="description" content="Spotify by Linh Nguyen FE" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className="flex">
            <Sidebar />
            <Center />
          </main>
          <div className="sticky bottom-0 text-white">
            <Player />
          </div>
        </SongContextProvider>
      </PlaylistContextProvider>
    </div>
  );
};

export default Home;
