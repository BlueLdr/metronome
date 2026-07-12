import { styled } from "@mui/material/styles";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import type { ISound } from "~/model";
import type { SoundAttribution } from "~/utils/constants/sounds/base-sounds.json";

//================================================

const Content = styled("dl")`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  column-gap: ${({ theme }) => theme.spacing(8)};
  row-gap: ${({ theme }) => theme.spacing(2)};
  margin: 0;
`;

export type SettingsAttributionItemProps = { sound: ISound & SoundAttribution };

export function SettingsAttributionItem({
  sound,
}: SettingsAttributionItemProps) {
  return (
    <Card variant="elevation" elevation={4}>
      <CardHeader
        title={sound.label}
        slotProps={{ title: { variant: "h6" } }}
      />
      <CardContent>
        <Content>
          <Typography variant="body2" component="dt" fontWeight={600}>
            Author
          </Typography>
          <Typography variant="body2" component="dd">
            {sound.attribution.author}
          </Typography>
          <Typography variant="body2" component="dt" fontWeight={600}>
            Name
          </Typography>
          <Typography variant="body2" component="dd">
            {sound.attribution.name}
          </Typography>
          <Typography variant="body2" component="dt" fontWeight={600}>
            License
          </Typography>
          <Typography variant="body2" component="dd">
            {sound.attribution.license}
          </Typography>
          <Typography variant="body2" component="dt" fontWeight={600}>
            URL
          </Typography>
          <Typography variant="body2" component="dd">
            <a href={sound.attribution.url} rel="nofollow" target="_blank">
              {sound.attribution.url}
            </a>
          </Typography>
        </Content>
      </CardContent>
    </Card>
  );
}
