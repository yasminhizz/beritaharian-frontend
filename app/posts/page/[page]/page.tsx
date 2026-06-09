import Link from "next/link";
import "../../../home.css";

const POSTS_PER_PAGE = 15;
const HOMEPAGE_POSTS = 6;

async function getPosts(pageNumber: number) {
  const offset =
    HOMEPAGE_POSTS + (pageNumber - 2) * POSTS_PER_PAGE;

  const res = await fetch(
    `https://cms.beritaharian.my/wp-json/wp/v2/posts?_embed=author,wp:featuredmedia&per_page=${POSTS_PER_PAGE}&offset=${offset}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

function getImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://placehold.co/600x400?text=BeritaHarian"
  );
}

function getAuthor(post: any) {
  return post?._embedded?.author?.[0]?.name || "Unknown Author";
}

function getDate(post: any) {
  return new Date(post.date).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function cleanText(html: string) {
  return html?.replace(/<[^>]+>/g, "") || "";
}

function PostMeta({ post }: { post: any }) {
  return (
    <p className="meta">
      <span className="profile-icon">👤</span>
      <span>{getAuthor(post)}</span>
      <span>•</span>
      <span>{getDate(post)}</span>
    </p>
  );
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  const pageNumber = Number(page);

  const posts = await getPosts(pageNumber);

  return (
    <main className="home-page">
      <section className="category-header">
        <h1>
          Latest Stories
          <span className="story-count">
            [ Page {pageNumber} ]
          </span>
        </h1>
      </section>

      <section className="post-grid">
        {posts.map((post: any) => (
          <article className="post-card" key={post.id}>
            <Link href={`/post/${post.slug}`}>
              <img
                src={getImage(post)}
                alt={cleanText(post.title.rendered)}
              />
            </Link>

            <h2>
              <Link
                href={`/post/${post.slug}`}
                dangerouslySetInnerHTML={{
                  __html: post.title.rendered,
                }}
              />
            </h2>

            <PostMeta post={post} />

            <p className="excerpt">
              {cleanText(post.excerpt.rendered).slice(0, 120)}...
            </p>

            <Link
              href={`/post/${post.slug}`}
              className="read-more"
            >
              Read More
            </Link>
          </article>
        ))}
      </section>

      <div className="pagination">
        <Link href="/">1</Link>

        {pageNumber > 2 && (
          <Link href={`/posts/page/${pageNumber - 1}`}>
            Prev
          </Link>
        )}

        <span>{pageNumber}</span>

        <Link href={`/posts/page/${pageNumber + 1}`}>
          Next
        </Link>
      </div>
    </main>
  );
}