import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LeetcodeRubric() {
  const rubricData = [
    { difficulty: "Easy", points: 1, color: "bg-green-500" },
    { difficulty: "Medium", points: 3, color: "bg-yellow-500" },
    { difficulty: "Hard", points: 5, color: "bg-red-500" },
  ];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">LeetCode Points</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Earn points for each solved problem. Compare with friends!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {rubricData.map((item) => (
            <li
              key={item.difficulty}
              className="flex items-center justify-between"
            >
              <Badge variant="secondary" className={`${item.color} text-white`}>
                {item.difficulty}
              </Badge>
              <span className="font-medium">
                {item.points} {item.points === 1 ? "point" : "points"}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
