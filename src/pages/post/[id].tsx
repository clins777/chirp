import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import PostView from "~/components/postview";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({ id });

  if (!data) return <div>404</div>;

  const { author, post } = data;

  return (
    <>
      <Head>
        <title>{`${post.content} - @${author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export default PostPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const helpers = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  await helpers.posts.getById.prefetch({ id });

  return { props: { trpcState: helpers.dehydrate(), id } };
};
