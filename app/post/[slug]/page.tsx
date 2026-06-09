import Link from "next/link";
import { getPostBySlug } from "@/lib/wordpress";
import "../../home.css";

async function getRelatedPosts(categoryId: number, currentPostId: number) {
  const res = await fetch(
    `https://cms.beritaharian.my/wp-json/wp/v2/posts?_embed=author,wp:featuredmedia&categories=${categoryId}&exclude=${currentPostId}&per_page=3`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch related posts");
  }

  return res.json();
}

function cleanText(html: string) {
  return html?.replace(/<[^>]+>/g, "") || "";
}

function getImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://placehold.co/600x400?text=BeritaHarian"
  );
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return <main style={{ padding: "20px" }}>Post not found</main>;
  }

  const categoryId = post.categories?.[0];
  const relatedPosts = categoryId
    ? await getRelatedPosts(categoryId, post.id)
    : [];

  return (
    <main className="single-post-page">
      <article className="single-post-content">
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>

      <section className="related-section">
        <h3>Artikel Berkaitan</h3>

        <div className="post-grid">
          {relatedPosts.map((related: any) => (
            <article className="post-card" key={related.id}>
              <Link href={`/post/${related.slug}`}>
                <img
                  src={getImage(related)}
                  alt={cleanText(related.title.rendered)}
                />
              </Link>

              <h2>
                <Link
                  href={`/post/${related.slug}`}
                  dangerouslySetInnerHTML={{
                    __html: related.title.rendered,
                  }}
                />
              </h2>

              <p className="excerpt">
                {cleanText(related.excerpt.rendered).slice(0, 120)}...
              </p>

              <Link href={`/post/${related.slug}`} className="read-more">
                Baca Lanjut
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}