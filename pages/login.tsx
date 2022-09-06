import { GetServerSideProps } from "next";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import logoSpotify from "@/public/spotify-logo.png";
import Image from "next/image";
interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>;
}

const login = ({ providers }: Props) => {
  const { name: providerName, id: providerId } =
    providers?.spotify as ClientSafeProvider;
  return (
    <div className="flex flex-col justify-center items-center bg-black h-screen">
      <div className="mb-6">
        <Image
          src={logoSpotify}
          alt="logo spotify"
          width="200px"
          height="200px"
        />
      </div>
      <button
        className="bg-[#18D860] text-white p-5 rounded-full"
        onClick={() => {
          signIn(providerId, { callbackUrl: "/" });
        }}
      >
        Login with {providerName}
      </button>
    </div>
  );
};

export default login;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const providers = await getProviders();
  return {
    props: { providers }, // will be passed to the page component as props
  };
};
