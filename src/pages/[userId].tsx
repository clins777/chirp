import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import PostView from "~/components/postview";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });
  if (isLoading) return <LoadingPage />;
  if (!data || data.length === 0) return <div>User has no posts yet 🫥</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data } = api.profile.getUserByUserId.useQuery({ userId });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">@{data.username}</div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export default ProfilePage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const userId = context.params?.userId;

  if (typeof userId !== "string") throw new Error("no slug");

  await helpers.profile.getUserByUserId.prefetch({ userId });

  return { props: { trpcState: helpers.dehydrate(), userId } };
};
