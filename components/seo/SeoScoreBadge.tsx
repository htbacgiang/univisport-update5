import { Badge } from "../ui/badge";

interface SeoScoreBadgeProps {
  score: number;
}

export function getScoreTone(score: number): "success" | "warning" | "danger" {
  if (score >= 85) return "success";
  if (score >= 70) return "warning";
  return "danger";
}

export function SeoScoreBadge({ score }: SeoScoreBadgeProps) {
  return (
    <Badge variant={getScoreTone(score)} className="tabular-nums">
      {score}/100
    </Badge>
  );
}
