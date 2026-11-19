import { Link } from "react-router-dom";
import { Container, Reveal, PageHero, Arrow } from "../components/ui";
import { CtaBand } from "../components/blocks";
import Seo from "../components/Seo";
import { posts } from "../data/work";

export default function Blog() {
  return (
    <>
      <Seo
        title="Blog – Digital Dude"
        description="Insights on SEO, social media marketing, UI/UX design and influencer marketing from the Digital Dude team."
      />

      <PageHero
        eyebrow="Blog"
        title="Insights from the team"
        body="Practical thinking on search, social, design and growth — written by the people doing the work."
      />

      <section className="py-[50px] md:py-[75px]">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} variant="scale" delay={(i % 3) * 70}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full min-h-[330px] flex-col justify-between rounded-20 border border-white/10 bg-navy-light p-8 transition-all duration-400 hover:-translate-y-1.5 hover:border-white/30"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white/45">
                      <span className="rounded-full bg-yellow/15 px-3 py-1 text-yellow">
                        {post.cat}
                      </span>
                      <span>{post.read}</span>
                    </div>
                    <h2 className="mt-6 font-heading text-[22px] font-bold leading-snug transition-colors group-hover:text-yellow">
                      {post.title}
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 font-heading text-[14px] font-bold text-white/50 transition-colors group-hover:text-white">
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
