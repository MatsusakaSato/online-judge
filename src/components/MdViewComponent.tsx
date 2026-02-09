"use client";

import gfm from "@bytemd/plugin-gfm";
import { Viewer } from "@bytemd/react";

const plugins = [gfm()];

export default function MdViewComponent({ value }: { value: string }) {
  return (
    <div className="bytemd-body">
      <Viewer value={value} plugins={plugins} />
    </div>
  );
}
