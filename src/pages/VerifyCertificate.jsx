import { useState } from "react";
import { Container, Reveal, PageHero, Arrow } from "../components/ui";
import Seo from "../components/Seo";
import { brand } from "../data/site";

export default function VerifyCertificate() {
  const [id, setId] = useState("");
  const [checked, setChecked] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to your certificate database / API.
    setChecked(true);
  };

  return (
    <>
      <Seo
        title="Verify Certificate – Digital Dude"
        description="Verify the authenticity of a certificate issued by Digital Dude using the certificate ID."
      />

      <PageHero
        eyebrow="Verification"
        title="Verify a certificate"
        body="Enter the certificate ID exactly as it appears on the document to confirm it was issued by Digital Dude."
      />

      <section className="pb-[75px]">
        <Container>
          <div className="max-w-[640px]">
            <Reveal className="rounded-20 border border-white/10 bg-navy-light p-8 md:p-10">
              <form onSubmit={onSubmit}>
                <label className="block">
                  <span className="mb-2 block font-heading text-[13px] font-bold uppercase tracking-[0.12em] text-white/50">
                    Certificate ID
                  </span>
                  <input
                    required
                    value={id}
                    onChange={(e) => {
                      setId(e.target.value);
                      setChecked(false);
                    }}
                    placeholder="e.g. DD-2025-0042"
                    className="w-full rounded-[14px] border border-white/20 bg-white/5 px-5 py-4 text-[16px] placeholder:text-white/35 focus:border-yellow focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-yellow px-8 py-4 font-heading text-[15px] font-bold text-navy transition-colors hover:bg-white"
                >
                  Verify
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>

              {checked && (
                <div className="mt-8 rounded-[14px] border border-white/15 bg-white/5 p-6">
                  <p className="font-heading text-[15px] font-bold text-yellow">
                    Verification pending
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">
                    This form is not yet connected to the certificate database. To confirm
                    certificate <span className="text-white">{id}</span>, please email{" "}
                    <a
                      href={`mailto:${brand.emails[0]}`}
                      className="text-yellow underline underline-offset-2"
                    >
                      {brand.emails[0]}
                    </a>{" "}
                    and we will verify it manually.
                  </p>
                </div>
              )}
            </Reveal>

            <Reveal delay={100} className="mt-6 text-[15px] leading-relaxed text-white/50">
              Certificates are issued to interns and trainees who complete a programme with Digital
              Dude. If you believe a certificate has been forged, please contact us directly.
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
