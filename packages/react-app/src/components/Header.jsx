import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/artdgn/dfk-interact" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="DFK contract interactions"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
