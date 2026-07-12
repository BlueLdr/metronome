"use client";

import { styled } from "@mui/material/styles";
import * as React from "react";

import { classNameWithModifiers, joinClassNames } from "~/utils/helpers";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

import type { SxStyleProps } from "~/theme";
import type { ModalProps } from "./types";

//================================================

const headerStyle = {
  borderBottom: (theme) => `1px solid ${theme.palette.grey["600"]}`,
  marginBottom: (theme) => theme.spacing(4),
  alignItems: "center",
} satisfies SxStyleProps;

const CloseButton = styled(IconButton)`
  padding: ${({ theme }) => theme.spacing(2)};
  margin: ${({ theme }) => theme.spacing(0, -2, 0, 0)};
`;
CloseButton.displayName = "CloseButton";

//================================================

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  titleText,
  maxWidth = "md",
  fullWidth = false,
  className,
  hideCloseButton,
  headerActions,
  footerActions,
  id,
  confirmButton: confirmButtonProp,
  cancelButton: cancelButtonProp,
  ...props
}) => {
  const cancelButton = cancelButtonProp
    ? React.cloneElement(cancelButtonProp, {
        name: "cancel-button",
        variant: "outlined",
        ...cancelButtonProp.props,
        onClick: cancelButtonProp.props?.disabled
          ? undefined
          : (cancelButtonProp.props?.onClick ?? onClose),
      })
    : undefined;

  const confirmButton = confirmButtonProp
    ? React.cloneElement(confirmButtonProp, {
        name: "confirm-button",
        variant: "contained",
        ...confirmButtonProp.props,
        onClick: confirmButtonProp.props?.disabled
          ? undefined
          : confirmButtonProp.props?.onClick,
      })
    : undefined;

  const closeButton = hideCloseButton ? null : (
    <Grid sx={{ lineHeight: 0 }}>
      <CloseButton className="modal-close" aria-label="close" onClick={onClose}>
        <CloseIcon />
      </CloseButton>
    </Grid>
  );

  return (
    <Dialog
      {...props}
      className={joinClassNames(
        classNameWithModifiers("modal", { "-open": open }),
        className,
      )}
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onClose}
      id={id}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      {(!!closeButton || !!titleText || !!headerActions?.length) && (
        <DialogTitle
          component="div"
          id={`${id}-title`}
          sx={titleText ? headerStyle : undefined}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
          >
            <Grid flex={1}>{titleText}</Grid>
            {!!closeButton || !!headerActions ? (
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
              >
                {headerActions}
                {closeButton}
              </Grid>
            ) : undefined}
          </Grid>
        </DialogTitle>
      )}

      <DialogContent id={`${id}-description`}>{children}</DialogContent>

      {(confirmButton || cancelButton || footerActions) && (
        <DialogActions sx={{ padding: (theme) => theme.spacing(2, 6, 4) }}>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            spacing={4}
          >
            {footerActions}
            {cancelButton && <Grid>{cancelButton}</Grid>}
            {confirmButton && <Grid>{confirmButton}</Grid>}
          </Grid>
        </DialogActions>
      )}
    </Dialog>
  );
};
