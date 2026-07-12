// noinspection CssUnresolvedCustomProperty

import { alpha, keyframes, styled } from "@mui/material/styles";
import { useImperativeHandle, useState } from "react";

import { getNoteStartTimeOffsetInScheduledMeasure } from "~/utils/helpers";

import { useForkRef } from "@mui/material/utils";

import type { Theme } from "@mui/material/styles";
import type { IBeat, IRhythm, MetronomeMeasureStartedEvent } from "~/model";
import type { WithOverrides } from "~/utils/types";
import type { VisualizerNodeHandle, VisualizerProps } from "./types";

//================================================

type VisualizerNodeOwnerState = Pick<
  VisualizerProps,
  "size" | "subdivisions"
> & {
  beatDuration: number;
  noteDuration: number;
  isSmallNode: boolean;
  isBeat: boolean;
  isOnlyPulse: boolean;
  isOnlyBeat: boolean;
  extraEmphasis?: boolean;
};

const makeRootAnimation = (theme: Theme, stopPercent: number) => keyframes`
    0% {
      background-color: ${alpha(theme.palette.secondary.dark, 0.5)};
      border-color: ${alpha(theme.palette.secondary.main, 1)};
    }
    ${`${stopPercent}%`} {
      background-color: ${alpha(theme.palette.secondary.dark, 0)};
      border-color: ${alpha(theme.palette.secondary.main, 0.2)};
    }
`;

const makeRootEmphasizedAnimation = (
  theme: Theme,
  stopPercent: number,
) => keyframes`
    0% {
      background-color: ${alpha(theme.palette.secondary.dark, 0.5)};
      border-color: ${alpha(theme.palette.secondary.main, 1)};
      outline: var(--visualizer-outline-width) solid ${alpha(theme.palette.secondary.main, 1)};
    }
    ${`${stopPercent}%`} {
      background-color: ${alpha(theme.palette.secondary.dark, 0)};
      border-color: ${alpha(theme.palette.secondary.main, 0.2)};
      outline: var(--visualizer-outline-width) solid ${alpha(theme.palette.secondary.main, 0)};
    }
`;

const makePulseOpacityAnimation = (stopPercent: number) => keyframes`
    0% {
      opacity: 1;
    }
    ${`${stopPercent}%`} {
      opacity: 0;
    }
`;

const makePulseTransformAnimation = (
  stopPercent: number,
  stopScale = 1.3,
) => keyframes`
    0% {
      transform: scale(0);
    }
  ${`${stopPercent}%`} {
      transform: scale(${stopScale});
    }
`;

const makeSubPulseAnimation = (stopPercent: number) => keyframes`
    0% {
      opacity: 1;
      transform: scale(0.1);
    }
    ${`${stopPercent}%`} {
      opacity: 0;
      transform: scale(0.7);
    }
`;

const RootCombined = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Root = styled("div", { name: "MuiVisualizerNode", slot: "root" })<{
  ownerState: VisualizerNodeOwnerState;
}>(({ theme, ownerState }) => {
  const scale = 1 / (ownerState.isSmallNode ? 2 : 1);
  const dimension =
    typeof ownerState.size === "number"
      ? `${ownerState.size}px`
      : (
          {
            small: theme.spacing(4 * scale),
            medium: theme.spacing(8 * scale),
            large: theme.spacing(10 * scale),
          } satisfies Record<Required<VisualizerNodeOwnerState>["size"], string>
        )[ownerState.size ?? "medium"];

  const { beatDuration, extraEmphasis, isOnlyBeat } = ownerState;
  const makeAnimation = extraEmphasis
    ? makeRootEmphasizedAnimation
    : makeRootAnimation;

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: dimension,
    height: dimension,
    borderRadius: `calc(${dimension}/2)`,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
    outline: "0px solid transparent",
    animationTimingFunction: theme.transitions.easing.easeInOut,
    animationDuration: "var(--visualizer-measure-duration)",
    animationIterationCount: "infinite",
    animationFillMode: "none",
    position: "relative",
    "--visualizer-outline-width": `min(calc(${dimension} / 10), 1rem)`,

    '&[data-animate="true"]:not(:has(> [data-subpulse="true"][data-only-pulse="true"]))':
      {
        '&[data-only-beat="false"]': {
          animationName: makeAnimation(
            theme,
            100 * beatDuration * (isOnlyBeat ? 1 : 1.2),
          ),
        },
        '&[data-only-beat="true"]': {
          animationName: makeRootAnimation(theme, 100 * beatDuration),
        },
      },
  };
});

const Pulse = styled("div", { name: "MuiVisualizerNode", slot: "pulse" })<{
  ownerState: VisualizerNodeOwnerState;
}>(({ theme, ownerState }) => {
  const { beatDuration, noteDuration, isBeat, isOnlyPulse, isOnlyBeat } =
    ownerState;

  let stopPercent = noteDuration;
  if (((isBeat && !isOnlyPulse) || (isOnlyPulse && isBeat)) && !isOnlyBeat) {
    stopPercent = 1.2 * noteDuration;
  } else if (isOnlyPulse && isOnlyBeat) {
    stopPercent = 0.9 * beatDuration;
  } else if (!isOnlyPulse && !isBeat) {
    stopPercent = 1.1 * noteDuration;
  }
  stopPercent *= 100;

  const subPulseAnimation = makeSubPulseAnimation(stopPercent);
  const opacityAnimation = makePulseOpacityAnimation(stopPercent);
  const transformAnimation = makePulseTransformAnimation(stopPercent);
  const mainTransformAnimation = makePulseTransformAnimation(stopPercent, 1.1);

  return {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "inherit",
    width: "100%",
    height: "100%",
    transform: "scale(0)",
    opacity: 0,
    animationTimingFunction: theme.transitions.easing.easeOut,
    animationDuration: "var(--visualizer-measure-duration)",
    animationFillMode: "inherit",
    animationIterationCount: "inherit",

    '&[data-animate="true"]': {
      animationName: `${opacityAnimation}, ${transformAnimation}`,
      '&[data-subpulse="true"][data-only-pulse="false"]': {
        animationName: `${subPulseAnimation}`,
      },
    },

    '[data-animate="true"] > &': {
      '&[data-subpulse="false"][data-only-pulse="false"]': {
        animationName: `${opacityAnimation}, ${mainTransformAnimation}`,
      },
      '&[data-only-pulse="true"]': {
        animationName: `${opacityAnimation}, ${transformAnimation}`,
      },
    },

    '&[data-subpulse="false"][data-only-pulse="false"]': {
      animationTimingFunction: `cubic-bezier(0, 0.8, 1, 1), ${theme.transitions.easing.easeOut}`,
    },

    '&[data-subpulse="true"]': {
      backgroundColor: theme.palette.secondary.light,
      '&[data-only-pulse="false"]': {
        position: "absolute",
      },
    },
  };
});

//================================================

const setAnimationStartTimeForNote = (
  event: MetronomeMeasureStartedEvent,
  noteIndex: number,
  element: HTMLElement | null,
) => {
  const startDelay = getNoteStartTimeOffsetInScheduledMeasure(
    event.measure,
    noteIndex,
    event.startingNoteIndex,
  );
  if (!element) {
    return;
  }
  const drift = Date.now() - event.now;
  const compensation = event.timeUntilExpectedStart - drift;

  const offset = startDelay + compensation;

  const anims = element.getAnimations();
  if (anims.length) {
    const now = document.timeline.currentTime ?? 0;
    element.style.setProperty("animation-delay", null);
    anims.forEach((anim) => {
      if (typeof now === "number") {
        anim.startTime = now + offset;
      } else {
        anim.startTime = now.add(offset);
      }
    });
  } else {
    element.style.setProperty("animation-delay", `${offset}ms`);
  }
};

type VisualizerNodePulseProps = Pick<
  VisualizerNodeProps,
  "index" | "handleRef"
> & {
  ref?: React.Ref<HTMLDivElement | null>;
  ownerState: VisualizerNodeOwnerState;
  beatNoteIndex: number;
};

function VisualizerNodeSubPulse({
  index,
  handleRef,
  beatNoteIndex,
  ...props
}: VisualizerNodePulseProps) {
  const [pulse, setPulse] = useState<HTMLDivElement | null>(null);

  const isMainPulse = beatNoteIndex === 0;

  useImperativeHandle<VisualizerNodeHandle, VisualizerNodeHandle>(
    (handle) => (isMainPulse ? undefined : handleRef(index, handle)),
    () => ({
      start: () => pulse?.setAttribute("data-animate", "true"),
      stop: () => pulse?.setAttribute("data-animate", "false"),
      setDelay: (e) => {
        setAnimationStartTimeForNote(e, index, pulse);
      },
    }),
    [pulse, index],
  );

  const ref = useForkRef(props.ref, setPulse);

  return (
    <Pulse
      className="MuiVisualizerNode-pulse"
      data-subpulse={!isMainPulse}
      {...props}
      ref={ref}
    />
  );
}

//================================================

export type VisualizerNodeProps = WithOverrides<
  React.ComponentProps<"div">,
  {
    handleRef: (index: number, handle: VisualizerNodeHandle | null) => void;
    index: number;
    rhythm: IRhythm;
    beat?: IBeat;
    beatsCombined?: boolean;
  } & Pick<VisualizerProps, "size" | "subdivisions">
>;

export function VisualizerNode({
  index,
  rhythm,
  size,
  handleRef,
  ref,
  beat,
  subdivisions,
  beatsCombined,
  ...props
}: VisualizerNodeProps) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [mainPulse, setMainPulse] = useState<HTMLDivElement | null>(null);

  const noteCount = rhythm.notes.length;
  const isCombined = subdivisions === "combined";
  const isBeat = index === beat?.noteIndex;

  const note = rhythm.notes[index];

  useImperativeHandle<VisualizerNodeHandle, VisualizerNodeHandle>(
    (handle) => handleRef(index, handle),
    () => ({
      start: () => root?.setAttribute("data-animate", "true"),
      stop: () => root?.setAttribute("data-animate", "false"),
      setDelay: (e) => {
        setAnimationStartTimeForNote(e, index, root);
        setAnimationStartTimeForNote(e, index, mainPulse);
      },
    }),
    [root, mainPulse, index],
  );

  const rootRef = useForkRef(ref, setRoot);

  const ownerState: VisualizerNodeOwnerState = {
    size,
    beatDuration:
      (beat ? beat.totalInterval : note.interval) /
      (rhythm.timeSignature.count / rhythm.timeSignature.division),
    noteDuration:
      note.interval /
      (rhythm.timeSignature.count / rhythm.timeSignature.division),
    isBeat,
    isOnlyPulse:
      !subdivisions || !(isCombined && beat && beat.notes.length > 1),
    isOnlyBeat: noteCount <= 1 || !!beatsCombined,
    isSmallNode: !isBeat && !(isCombined && beat && beat?.notes.length > 1),
    extraEmphasis: beatsCombined && index === 0 && noteCount > 1,
  };
  const element = (
    <Root
      {...props}
      className={`MuiVisualizerNode-root ${props.className ?? ""}`}
      ref={rootRef}
      ownerState={ownerState}
      data-only-beat={noteCount <= 1}
    >
      {isCombined && beat && beat?.notes.length > 1 ? (
        beat.notes.map((_, i) => (
          <VisualizerNodeSubPulse
            key={i}
            handleRef={handleRef}
            index={beat.noteIndex + i}
            beatNoteIndex={i}
            data-only-pulse={false}
            ownerState={ownerState}
            ref={i === 0 && isCombined ? setMainPulse : undefined}
          />
        ))
      ) : !subdivisions && !isBeat ? null : (
        <Pulse
          data-subpulse={!isBeat}
          data-only-pulse={true}
          ownerState={ownerState}
          ref={setMainPulse}
          className="MuiVisualizerNode-pulse"
        />
      )}
    </Root>
  );

  return beatsCombined && index > 0 ? (
    <RootCombined>{element}</RootCombined>
  ) : (
    element
  );
}
