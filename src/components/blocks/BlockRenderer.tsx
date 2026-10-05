"use client";

import type { ComponentType } from "react";
import { useContent, usePreview } from "@/content/ContentProvider";
import type { AnyBlock, BlockType } from "@/content/types";
import { HeroBlock } from "./HeroBlock";
import { FeaturesBlock, ResourcesBlock, RoadmapBlock, StatsBlock } from "./ListBlocks";
import { CoursesBlock, PostsBlock } from "./CardBlocks";
import { CtaBlock, FaqBlock, ImageTextBlock, TextBlock } from "./ContentBlocks";
import { BlockShell, isDarkBg } from "./shared";

const COMPONENTS: { [K in BlockType]: ComponentType<{ block: Extract<AnyBlock, { type: K }>; dark: boolean }> } = {
  hero: HeroBlock,
  features: FeaturesBlock,
  courses: CoursesBlock,
  roadmap: RoadmapBlock,
  posts: PostsBlock,
  resources: ResourcesBlock,
  stats: StatsBlock,
  text: TextBlock,
  cta: CtaBlock,
  imageText: ImageTextBlock,
  faq: FaqBlock,
};

export function BlockRenderer() {
  const { blocks } = useContent();
  const { preview } = usePreview();
  const visible = blocks.filter((b) => !b.hidden);
  return (
    <div data-preview={preview || undefined}>
      {visible.map((block, i) => {
        const Component = COMPONENTS[block.type] as ComponentType<{ block: AnyBlock; dark: boolean }>;
        const prev = visible[i - 1];
        const flushTop = !!prev && prev.layout.background === block.layout.background && block.layout.background === "white";
        return (
          <BlockShell key={block.id} block={block} flushTop={flushTop}>
            <Component block={block} dark={isDarkBg(block.layout.background)} />
          </BlockShell>
        );
      })}
    </div>
  );
}
