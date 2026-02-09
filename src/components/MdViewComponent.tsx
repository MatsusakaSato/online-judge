"use client";

import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Viewer } from "@bytemd/react";

export default function MdViewComponent({ value }: { value: string }) {
  const plugins = [gfm(), highlight()];
  return (
    <div className="bytemd-body">
      <Viewer value={value} plugins={plugins} />
    </div>
  );
}
