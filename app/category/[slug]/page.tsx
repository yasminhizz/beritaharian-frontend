import Link from "next/link";
import "../../home.css";

async function getCategory(slug: string) {
  const res = await fetch(
    `https://cms.beritaharian.my/wp-json/wp/v2/categories?slug=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch category");

  const categories = await res.json();
  return categories[0];
}

async function getCategoryPosts(categoryId: number) {
  const res = await fetch(
    `https://cms.beritaharian.my/wp-json/wp/v2/posts?_embed=author,wp:featuredmedia&categories=${categoryId}&per_page=12`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch category posts");

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    return (
      <main className="home-page">
        <h1>Category not found</h1>
      </main>
    );
  }

  const posts = await getCategoryPosts(category.id);

  return (
    <main className="home-page">
      <section className="category-header">
        <h1>
          {category.name}
          <span className="story-count">
            [ {posts.length} stories found ]
          </span>
        </h1>
      </section>

      <section className="post-grid">
        {posts.map((post: any) => (
          <article className="post-card" key={post.id}>
            <Link href={`/post/${post.slug}`}>
              <img src={getImage(post)} alt={cleanText(post.title.rendered)} />
            </Link>

            <h2>
              <Link
                href={`/post/${post.slug}`}
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </h2>

            <PostMeta post={post} />

            <p className="excerpt">
              {cleanText(post.excerpt.rendered).slice(0, 120)}...
            </p>

            <Link href={`/post/${post.slug}`} className="read-more">
              Read More
            </Link>
          </article>
        ))}
      </section>

      {posts.length === 0 && <p>No posts found in this category.</p>}
    </main>
  );
}