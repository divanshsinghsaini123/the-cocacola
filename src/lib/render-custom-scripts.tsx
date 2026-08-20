import React from "react";

const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  charset: "charSet",
  crossorigin: "crossOrigin",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  nomodule: "noModule",
};

function parseAttributes(attrString: string): Record<string, any> {
  const props: Record<string, any> = {};
  if (!attrString) return props;

  const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1];
    const rawVal = match[2] ?? match[3] ?? match[4];
    const val = rawVal !== undefined ? rawVal : true;
    const propKey = ATTR_MAP[key.toLowerCase()] || key;
    props[propKey] = val;
  }
  return props;
}

export function renderCustomScript(
  scriptCode: string,
  keyPrefix: string,
  allowDivWrapper: boolean = false
): React.ReactNode {
  if (!scriptCode || typeof scriptCode !== "string") return null;

  // Remove HTML comments
  const codeWithoutComments = scriptCode.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!codeWithoutComments) return null;

  // Regex to match supported head tags: script, link, meta, style, noscript
  const tagRegex =
    /<script\b([^>]*)>([\s\S]*?)<\/script\s*>|<script\b([^>]*)\/>|<link\b([^>]*)\/?>|<meta\b([^>]*)\/?>|<style\b([^>]*)>([\s\S]*?)<\/style\s*>|<noscript\b([^>]*)>([\s\S]*?)<\/noscript\s*>/gi;

  const elements: React.ReactNode[] = [];
  let match: RegExpExecArray | null;
  let matchIndex = 0;

  while ((match = tagRegex.exec(codeWithoutComments)) !== null) {
    const key = `${keyPrefix}-${matchIndex++}`;
    const fullTag = match[0].toLowerCase();

    if (fullTag.startsWith("<script")) {
      const attrStr = match[1] ?? match[3] ?? "";
      const innerCode = match[2];
      const props = parseAttributes(attrStr);

      if (innerCode && innerCode.trim()) {
        elements.push(
          <script
            key={key}
            {...props}
            dangerouslySetInnerHTML={{ __html: innerCode }}
          />
        );
      } else {
        elements.push(<script key={key} {...props} />);
      }
    } else if (fullTag.startsWith("<link")) {
      const attrStr = match[4] ?? "";
      const props = parseAttributes(attrStr);
      elements.push(<link key={key} {...props} />);
    } else if (fullTag.startsWith("<meta")) {
      const attrStr = match[5] ?? "";
      const props = parseAttributes(attrStr);
      elements.push(<meta key={key} {...props} />);
    } else if (fullTag.startsWith("<style")) {
      const attrStr = match[6] ?? "";
      const cssCode = match[7] ?? "";
      const props = parseAttributes(attrStr);
      elements.push(
        <style
          key={key}
          {...props}
          dangerouslySetInnerHTML={{ __html: cssCode }}
        />
      );
    } else if (fullTag.startsWith("<noscript")) {
      const attrStr = match[8] ?? "";
      const innerHtml = match[9] ?? "";
      const props = parseAttributes(attrStr);
      elements.push(
        <noscript
          key={key}
          {...props}
          dangerouslySetInnerHTML={{ __html: innerHtml }}
        />
      );
    }
  }

  if (elements.length > 0) {
    return <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
  }

  // Fallback if no specific tags were matched
  if (allowDivWrapper) {
    return (
      <div
        key={keyPrefix}
        dangerouslySetInnerHTML={{ __html: codeWithoutComments }}
      />
    );
  }

  // In head mode (allowDivWrapper = false), wrap raw code in <script>
  return (
    <script
      key={keyPrefix}
      dangerouslySetInnerHTML={{ __html: codeWithoutComments }}
    />
  );
}
