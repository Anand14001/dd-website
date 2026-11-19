import { Link, useParams, Navigate } from "react-router-dom";
import { Container, Reveal, Arrow, Button } from "../components/ui";
import { CtaBand } from "../components/blocks";
import Seo from "../components/Seo";
import { posts, getPost } from "../data/work";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <Navigate to="/404" replace />;

  const more = posts.filter((p) => p.slug !== slug);
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Seo title={`${post.title} – Digital Dude`} description={post.excerpt} />

      <article>
        <section className="relative overflow-hidden pt-[150px] pb-[50px] md:pt-[190px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-48 left-1/2 size-[800px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[130px]"
            style={{ background: "radial-gradient(circle, #eaff01 0%, transparent 65%)" }}
          />
          <Container className="relative">
            <Reveal>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 font-heading text-[14px] font-bold text-white/50 transition-colors hover:text-yellow"
              >
                <Arrow className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to blog
              </Link>
            </Reveal>

            <Reveal delay={60} className="mt-8 flex flex-wrap items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white/45">
              <span className="rounded-full bg-yellow/15 px-3 py-1 text-yellow">{post.cat}</span>
              <span>{post.read}</span>
              <span>·</span>
              <time dateTime={post.date}>{date}</time>
            </Reveal>

            <Reveal
              as="h1"
              delay={120}
              className="mt-6 max-w-[22ch] font-heading text-fluid-h2 font-bold"
            >
              {post.title}
            </Reveal>
          </Container>
        </section>

        <section className="pb-[50px]">
          <Container>
            <div className="max-w-[72ch]">
              <Reveal
                as="p"
                className="border-l-2 border-yellow pl-6 text-[19px] leading-relaxed text-white/80 md:text-[21px]"
              >
                {post.excerpt}
              </Reveal>

              <div className="mt-10 flex flex-col gap-6">
                {post.body.map((p, i) => (
                  <Reveal
                    as="p"
                    key={i}
                    delay={i * 50}
                    className="text-[17px] leading-[1.75] text-white/70 md:text-[18px]"
                  >
                    {p}
                  </Reveal>
                ))}
              </div>

              <Reveal delay={100} className="mt-12 rounded-20 border border-white/10 bg-navy-light p-8">
                <h2 className="font-heading text-fluid-h6 font-bold">
                  Want help putting this into practice?
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-white/60">
                  We work with businesses across India to turn strategy into measurable growth.
                </p>
                <Button to="/contact" className="mt-6">
                  Talk to us
                </Button>
              </Reveal>
            </div>
          </Container>
        </section>
      </article>

      {/* More posts */}
      <section className="py-[50px] md:py-[75px]">
        <Container>
          <Reveal as="h2" className="font-heading text-fluid-h4 font-bold">
            More from the blog
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {more.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="group flex h-full flex-col justify-between rounded-20 border border-white/10 bg-navy-light p-8 transition-all duration-400 hover:-translate-y-1.5 hover:border-white/30"
                >
                  <div>
                    <span className="rounded-full bg-yellow/15 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-yellow">
                      {p.cat}
                    </span>
                    <h3 className="mt-5 font-heading text-[21px] font-bold leading-snug transition-colors group-hover:text-yellow">
                      {p.title}
                    </h3>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 font-heading text-[14px] font-bold text-white/50 transition-colors group-hover:text-white">
                    Read article
                    <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
