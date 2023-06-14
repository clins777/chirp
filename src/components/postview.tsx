import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        className="rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      ></Image>
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/${author.id}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <span className="font-thin">·</span>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
