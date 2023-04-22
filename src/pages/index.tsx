import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const {user} = useUser();

  console.log(user)

  if(!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <img src={user.profileImageUrl} alt="Profile Image" className="h-14 w-14 rounded-full" />
      <input className="bg-transparent grow outline-none" placeholder="type some emojis!" />
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div key={post.id} className="border-b border-slate-400 flex p-4 gap-3 items-center">
      <img src={author.profileImageUrl} alt="" className="h-14 w-14 rounded-full" />
      <div className="flex flex-col">
        <div className="flex text-slate-200 gap-1"><span>{`@${author.username}`}</span><span>{` · ${dayjs(post.createdAt).fromNow()}`}</span></div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if(isLoading) return <div>Loading...</div>;

  if(!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="w-full max-w-2xl border-x border-slate-400">
          <div className="border-b border-slate-400 p-4 flex">
            {!user.isSignedIn && <div className="flex justify-center"><SignInButton /></div>}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {[...data, ...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
