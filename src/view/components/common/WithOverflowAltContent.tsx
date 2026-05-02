import { styled } from "@mui/material/styles";
import { useLayoutEffect, useState } from "react";

import {
  useDebouncedIdleCallback,
  useResizeObserver,
  useStateRef,
} from "~/utils/hooks";

import { useForkRef } from "@mui/material/utils";
import Box from "@mui/material/Box";

import type { BoxProps } from "@mui/material/Box";

//================================================

const Detector = styled("div")({
  position: "absolute",
  visibility: "hidden",
  left: 0,
  top: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: -99999,
  maxHeight: "100%",
});

const Container = styled(Box)<{ ownerState: boolean }>(
  ({ ownerState: isOverflowing }) => ({
    display: "inline",
    position: "relative",
    whiteSpace: "nowrap",
    textOverflow: "clip",
    maxWidth: "100%",
    flexGrow: 1,
    ...(isOverflowing
      ? {
          flexShrink: 0,
          minWidth: "min-content",
        }
      : {
          flexShrink: 1,
          minWidth: 0,
        }),
  }),
);

export type WithOverflowAltContentProps = BoxProps & {
  overflowContent: React.ReactNode;
};

export function WithOverflowAltContent({
  ref,
  overflowContent,
  children,
  ...props
}: WithOverflowAltContentProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [container, setContainer, containerRef] =
    useStateRef<HTMLElement | null>(null);
  const [content, setContent, contentRef] = useStateRef<HTMLElement | null>(
    null,
  );
  const [altContent, setAltContent, altContentRef] =
    useStateRef<HTMLElement | null>(null);

  const onResize = useDebouncedIdleCallback(
    () => {
      if (
        !contentRef.current ||
        !altContentRef.current ||
        !containerRef.current
      ) {
        return;
      }

      if (altContentRef.current.scrollWidth >= contentRef.current.scrollWidth) {
        setIsOverflowing(false);
        return;
      }
      setIsOverflowing(
        contentRef.current.getBoundingClientRect().width >
          containerRef.current.getBoundingClientRect().width,
      );
    },
    20,
    { trailing: true },
  );

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => onResize());
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [onResize]);

  useResizeObserver(content, onResize);
  useResizeObserver(altContent, onResize);
  useResizeObserver(container, onResize);

  const boxRef = useForkRef(ref, setContainer);

  return (
    <Container ownerState={isOverflowing} {...props} ref={boxRef}>
      <Detector ref={setContent}>{children}</Detector>
      <Detector ref={setAltContent}>{overflowContent}</Detector>
      {isOverflowing ? overflowContent : children}
    </Container>
  );
}
