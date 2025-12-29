
export interface DataPoint {
  x: number;      // 累积人口比
  yL: number;     // 累积收入比 (Lorenz)
  yC: number;     // 累积支出比 (Concentration)
}

export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
}

export interface CourseMetadata {
  id: string;
  name: string;
  tools: ToolMetadata[];
}
