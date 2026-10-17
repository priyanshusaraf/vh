import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/SiteLayout";
import { designs } from "@/lib/designs";

export default function Concepts() {
  return (
    <div className="design-comparison">
      <Head>
        <title>Choose a direction | Visto Homeware</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="comparison-header">
        <Link href="/" aria-label="Visto Homeware home">
          <Brand />
        </Link>
        <span>VISTO HOMEWARE / DESIGN EXPLORATIONS</span>
      </header>
      <main>
        <div className="comparison-intro">
          <span className="eyebrow">
            ONE BRAND. THREE DIFFERENT POINTS OF VIEW.
          </span>
          <h1>Find your Visto.</h1>
          <p>
            Three complete design directions, built around the same products and
            the original brand colours. Open a design, explore its catalogue,
            and use the preview bar to switch between them.
          </p>
        </div>
        <div className="comparison-grid">
          {designs.map((d, i) => (
            <Link
              className={"comparison-card preview-" + d.id}
              key={d.id}
              href={d.href}
            >
              <div className="comparison-art">
                <span className="preview-wordmark">
                  VISTO<span>HOMEWARE</span>
                </span>
                <div className="preview-headline">
                  {
                    [
                      "Little things.\nBetter living.",
                      "Kitchen & home\nessentials.",
                      "Good things.\nLive here.",
                    ][i]
                  }
                </div>
                <div className="preview-image">
                  <Image
                    src={d.image}
                    alt={`${d.name} design product photography`}
                    fill
                    sizes="(max-width:760px) 90vw, 45vw"
                  />
                </div>
                <span className="preview-mini-tag">
                  EXPLORE THE COLLECTION ↗
                </span>
              </div>
              <div className="comparison-card-copy">
                <div>
                  <h2>{d.name}</h2>
                  <p>{d.description}</p>
                </div>
                <span className="round-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="comparison-footer">
        <span>
          Original logo colours. One sans-serif type family. No italic pairings.
        </span>
        <span>All designs use the same 151-product catalogue.</span>
      </footer>
    </div>
  );
}
