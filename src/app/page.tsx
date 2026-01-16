"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Briefcase,
  ArrowRight,
  BarChart3,
  BookOpen,
  XCircle,
  Lightbulb,
  Code,
  Wrench,
  Brain,
} from "lucide-react";

interface FormData {
  jobRole: string;
  industry: string;
  targetLevel: string;
  currentSkills: string;
  experienceLevel: string;
  hoursPerWeek: string;
  urgency: string;
}

interface SkillAssessment {
  name: string;
  required: boolean;
  userHas: boolean;
  importance: "critical" | "high" | "medium";
  category: "core" | "tools" | "application";
}

interface WeekPlan {
  week: number;
  focus: string;
  skills: string[];
  reason: string;
}

interface AnalysisResult {
  requiredSkills: SkillAssessment[];
  readinessScore: number;
  categoryScores: {
    core: number;
    tools: number;
    application: number;
  };
  missingSkills: string[];
  weeklyPlan: WeekPlan[];
  riskStatement: string;
  totalWeeks: number;
  whatNotToLearn: string[];
  alternativeRole: { role: string; reason: string } | null;
}

const skillDatabases: Record<string, { skill: string; importance: "critical" | "high" | "medium"; category: "core" | "tools" | "application" }[]> = {
  "frontend developer": [
    { skill: "HTML/CSS fundamentals", importance: "critical", category: "core" },
    { skill: "JavaScript ES6+", importance: "critical", category: "core" },
    { skill: "React.js or Vue.js", importance: "critical", category: "core" },
    { skill: "TypeScript", importance: "high", category: "core" },
    { skill: "Responsive design", importance: "critical", category: "application" },
    { skill: "CSS frameworks (Tailwind/Bootstrap)", importance: "high", category: "tools" },
    { skill: "Git version control", importance: "critical", category: "tools" },
    { skill: "REST APIs integration", importance: "high", category: "application" },
    { skill: "Browser DevTools", importance: "high", category: "tools" },
    { skill: "Testing (Jest/Cypress)", importance: "medium", category: "application" },
    { skill: "Build tools (Webpack/Vite)", importance: "medium", category: "tools" },
    { skill: "Performance optimization", importance: "medium", category: "application" },
  ],
  "backend developer": [
    { skill: "Server-side language (Node.js/Python/Java)", importance: "critical", category: "core" },
    { skill: "Database design (SQL)", importance: "critical", category: "core" },
    { skill: "REST API design", importance: "critical", category: "core" },
    { skill: "Authentication/Authorization", importance: "high", category: "application" },
    { skill: "Git version control", importance: "critical", category: "tools" },
    { skill: "NoSQL databases", importance: "high", category: "core" },
    { skill: "Caching strategies (Redis)", importance: "medium", category: "application" },
    { skill: "Docker basics", importance: "high", category: "tools" },
    { skill: "Testing frameworks", importance: "high", category: "application" },
    { skill: "CI/CD pipelines", importance: "medium", category: "tools" },
    { skill: "Cloud services (AWS/GCP)", importance: "high", category: "tools" },
    { skill: "Security best practices", importance: "high", category: "application" },
  ],
  "data scientist": [
    { skill: "Python programming", importance: "critical", category: "core" },
    { skill: "Statistics and probability", importance: "critical", category: "core" },
    { skill: "Machine learning algorithms", importance: "critical", category: "core" },
    { skill: "Pandas/NumPy", importance: "critical", category: "tools" },
    { skill: "SQL for data analysis", importance: "high", category: "core" },
    { skill: "Data visualization (Matplotlib/Seaborn)", importance: "high", category: "tools" },
    { skill: "Scikit-learn", importance: "critical", category: "tools" },
    { skill: "Feature engineering", importance: "high", category: "application" },
    { skill: "Deep learning basics", importance: "medium", category: "application" },
    { skill: "Git version control", importance: "high", category: "tools" },
    { skill: "A/B testing", importance: "medium", category: "application" },
    { skill: "Business problem framing", importance: "high", category: "application" },
  ],
  "product manager": [
    { skill: "User research methods", importance: "critical", category: "core" },
    { skill: "Product roadmap creation", importance: "critical", category: "core" },
    { skill: "Agile/Scrum methodology", importance: "critical", category: "tools" },
    { skill: "Data-driven decision making", importance: "high", category: "application" },
    { skill: "Stakeholder communication", importance: "critical", category: "application" },
    { skill: "Competitive analysis", importance: "high", category: "application" },
    { skill: "Wireframing/Prototyping", importance: "high", category: "tools" },
    { skill: "SQL basics for analytics", importance: "medium", category: "tools" },
    { skill: "A/B testing concepts", importance: "high", category: "application" },
    { skill: "Go-to-market strategy", importance: "high", category: "core" },
    { skill: "Technical understanding", importance: "medium", category: "application" },
    { skill: "Prioritization frameworks", importance: "critical", category: "core" },
  ],
  "ux designer": [
    { skill: "User research", importance: "critical", category: "core" },
    { skill: "Wireframing", importance: "critical", category: "core" },
    { skill: "Prototyping (Figma)", importance: "critical", category: "tools" },
    { skill: "Usability testing", importance: "critical", category: "application" },
    { skill: "Information architecture", importance: "high", category: "core" },
    { skill: "Interaction design", importance: "high", category: "application" },
    { skill: "Visual design basics", importance: "high", category: "core" },
    { skill: "Design systems", importance: "high", category: "tools" },
    { skill: "Accessibility standards", importance: "high", category: "application" },
    { skill: "User journey mapping", importance: "medium", category: "application" },
    { skill: "HTML/CSS basics", importance: "medium", category: "tools" },
    { skill: "Analytics interpretation", importance: "medium", category: "application" },
  ],
  "devops engineer": [
    { skill: "Linux administration", importance: "critical", category: "core" },
    { skill: "Docker containerization", importance: "critical", category: "tools" },
    { skill: "Kubernetes orchestration", importance: "critical", category: "tools" },
    { skill: "CI/CD pipelines", importance: "critical", category: "core" },
    { skill: "Infrastructure as Code (Terraform)", importance: "high", category: "tools" },
    { skill: "Cloud platforms (AWS/GCP/Azure)", importance: "critical", category: "tools" },
    { skill: "Scripting (Bash/Python)", importance: "high", category: "core" },
    { skill: "Monitoring (Prometheus/Grafana)", importance: "high", category: "application" },
    { skill: "Git version control", importance: "critical", category: "tools" },
    { skill: "Networking fundamentals", importance: "high", category: "core" },
    { skill: "Security practices", importance: "high", category: "application" },
    { skill: "Database administration", importance: "medium", category: "application" },
  ],
  "full stack developer": [
    { skill: "HTML/CSS/JavaScript", importance: "critical", category: "core" },
    { skill: "React.js or Vue.js", importance: "critical", category: "core" },
    { skill: "Node.js or Python backend", importance: "critical", category: "core" },
    { skill: "Database design (SQL + NoSQL)", importance: "critical", category: "core" },
    { skill: "REST API design", importance: "critical", category: "application" },
    { skill: "Git version control", importance: "critical", category: "tools" },
    { skill: "TypeScript", importance: "high", category: "core" },
    { skill: "Authentication systems", importance: "high", category: "application" },
    { skill: "Testing frameworks", importance: "high", category: "application" },
    { skill: "Cloud deployment", importance: "high", category: "tools" },
    { skill: "Docker basics", importance: "medium", category: "tools" },
    { skill: "Performance optimization", importance: "medium", category: "application" },
  ],
  "default": [
    { skill: "Core technical skills for role", importance: "critical", category: "core" },
    { skill: "Problem-solving ability", importance: "critical", category: "application" },
    { skill: "Communication skills", importance: "high", category: "application" },
    { skill: "Version control (Git)", importance: "high", category: "tools" },
    { skill: "Industry-standard tools", importance: "high", category: "tools" },
    { skill: "Documentation skills", importance: "medium", category: "tools" },
    { skill: "Team collaboration", importance: "high", category: "application" },
    { skill: "Time management", importance: "medium", category: "application" },
    { skill: "Continuous learning mindset", importance: "medium", category: "application" },
    { skill: "Basic project management", importance: "medium", category: "tools" },
    { skill: "Domain knowledge", importance: "high", category: "core" },
    { skill: "Portfolio/Work samples", importance: "critical", category: "application" },
  ],
};

const whatNotToLearnMap: Record<string, string[]> = {
  "frontend developer": [
    "Advanced backend architecture (focus on APIs integration first)",
    "DevOps/Infrastructure (not required for entry-level)",
    "Mobile app development (unless specifically required)",
    "Machine learning or AI (stay focused on web)",
  ],
  "backend developer": [
    "Frontend frameworks (basic HTML/CSS is enough)",
    "UI/UX design principles (not your domain)",
    "Advanced data science/ML (unless in job description)",
    "Native mobile development",
  ],
  "data scientist": [
    "Web development frameworks",
    "DevOps and infrastructure",
    "Advanced software engineering patterns",
    "Big data tools like Spark (until you master basics)",
  ],
  "product manager": [
    "Advanced coding (basic SQL/scripting is enough)",
    "UI design tools in depth (Figma basics only)",
    "Deep technical architecture",
    "Data science algorithms (understand concepts only)",
  ],
  "ux designer": [
    "Backend development",
    "Data science or analytics tools beyond basics",
    "Advanced frontend frameworks (basic HTML/CSS only)",
    "DevOps or cloud infrastructure",
  ],
  "devops engineer": [
    "Frontend development",
    "UI/UX design",
    "Data science and machine learning",
    "Advanced application development",
  ],
  "full stack developer": [
    "Machine learning/AI (unless role-specific)",
    "Advanced DevOps beyond basic deployment",
    "Mobile native development",
    "Deep specialization in niche frameworks",
  ],
  "default": [
    "Skills outside your target role's core requirements",
    "Advanced topics before mastering fundamentals",
    "Multiple programming languages at once",
    "Trendy technologies without job market demand",
  ],
};

const alternativeRolesMap: Record<string, { role: string; reason: string }> = {
  "frontend developer": { role: "UI Developer / Web Designer", reason: "If you're stronger in CSS/design and visual work than JavaScript logic" },
  "backend developer": { role: "Database Administrator", reason: "If you excel at SQL and data management but struggle with API design" },
  "data scientist": { role: "Data Analyst", reason: "If you're comfortable with SQL and visualization but need more time for ML algorithms" },
  "product manager": { role: "Business Analyst", reason: "If you're stronger in requirements and documentation than user research" },
  "ux designer": { role: "UI Designer / Visual Designer", reason: "If you prefer visual design over user research and testing" },
  "devops engineer": { role: "System Administrator", reason: "If you're comfortable with Linux but need more time for containerization" },
  "full stack developer": { role: "Frontend Developer", reason: "If your frontend skills are significantly stronger than backend" },
  "default": { role: "Related Entry-Level Position", reason: "Consider a more focused role to build specific expertise first" },
};

function analyzeSkills(formData: FormData): AnalysisResult {
  const roleKey = Object.keys(skillDatabases).find(
    (key) =>
      key !== "default" &&
      formData.jobRole.toLowerCase().includes(key.toLowerCase())
  ) || "default";

  const requiredSkillsData = skillDatabases[roleKey];
  const userSkillsLower = formData.currentSkills.toLowerCase();

  const skillAssessments: SkillAssessment[] = requiredSkillsData.map((s) => ({
    name: s.skill,
    required: true,
    userHas: userSkillsLower.includes(s.skill.toLowerCase().split(" ")[0]) ||
             userSkillsLower.includes(s.skill.toLowerCase().split("/")[0]) ||
             s.skill.toLowerCase().split(" ").some(word => 
               word.length > 3 && userSkillsLower.includes(word)
             ),
    importance: s.importance,
    category: s.category,
  }));

  const missingSkills = skillAssessments
    .filter((s) => !s.userHas)
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2 };
      return order[a.importance] - order[b.importance];
    })
    .map((s) => s.name);

  const matchedCount = skillAssessments.filter((s) => s.userHas).length;
  const totalSkills = skillAssessments.length;
  
  const importanceWeights = { critical: 3, high: 2, medium: 1 };
  const maxScore = skillAssessments.reduce(
    (acc, s) => acc + importanceWeights[s.importance],
    0
  );
  const userScore = skillAssessments
    .filter((s) => s.userHas)
    .reduce((acc, s) => acc + importanceWeights[s.importance], 0);

  const experienceMultiplier =
    formData.experienceLevel === "advanced"
      ? 1.1
      : formData.experienceLevel === "intermediate"
      ? 1
      : 0.9;

  const levelMultiplier =
    formData.targetLevel === "intern"
      ? 1.15
      : formData.targetLevel === "junior"
      ? 1.05
      : 0.95;

  const readinessScore = Math.min(
    100,
    Math.round((userScore / maxScore) * 100 * experienceMultiplier * levelMultiplier)
  );

  const calculateCategoryScore = (category: "core" | "tools" | "application") => {
    const categorySkills = skillAssessments.filter(s => s.category === category);
    const maxCategoryScore = categorySkills.reduce((acc, s) => acc + importanceWeights[s.importance], 0);
    const userCategoryScore = categorySkills.filter(s => s.userHas).reduce((acc, s) => acc + importanceWeights[s.importance], 0);
    return maxCategoryScore > 0 ? Math.round((userCategoryScore / maxCategoryScore) * 100) : 0;
  };

  const categoryScores = {
    core: calculateCategoryScore("core"),
    tools: calculateCategoryScore("tools"),
    application: calculateCategoryScore("application"),
  };

  const urgencyWeeks = {
    urgent: 4,
    "3-6 months": 6,
    exploring: 8,
  };
  const baseWeeks = urgencyWeeks[formData.urgency as keyof typeof urgencyWeeks] || 6;
  const totalWeeks = Math.min(8, Math.max(4, Math.min(baseWeeks, Math.ceil(missingSkills.length * 1.5))));

  const weeklyPlan: WeekPlan[] = [];
  const skillsPerWeek = Math.ceil(missingSkills.length / totalWeeks);

  const weeklyReasons = [
    "Foundation week - these skills are prerequisites for everything else and are tested in initial screenings",
    "Core competency development - employers specifically test for these in technical interviews",
    "Building on fundamentals with practical application skills that demonstrate job readiness",
    "Intermediate skills that differentiate candidates and show depth of knowledge",
    "Advanced techniques that demonstrate senior-level thinking and problem-solving",
    "Integration skills - combining multiple competencies effectively for real projects",
    "Portfolio building - creating demonstrable work samples that prove your abilities",
    "Interview preparation and final skill refinement for job applications",
  ];

  for (let i = 0; i < totalWeeks; i++) {
    const startIdx = i * skillsPerWeek;
    const endIdx = Math.min(startIdx + skillsPerWeek, missingSkills.length);
    const weekSkills = missingSkills.slice(startIdx, endIdx);

    if (weekSkills.length > 0) {
      weeklyPlan.push({
        week: i + 1,
        focus: i < 2 ? "Foundation" : i < 4 ? "Core Development" : i < 6 ? "Advanced Skills" : "Portfolio & Practice",
        skills: weekSkills,
        reason: weeklyReasons[i] || "Continued skill development and practice",
      });
    }
  }

  const criticalMissing = skillAssessments.filter(s => !s.userHas && s.importance === "critical").length;
  const riskStatements = [
    `You're missing ${criticalMissing} critical skill${criticalMissing !== 1 ? "s" : ""}. At ${formData.targetLevel} level, ${missingSkills[0] || "practical experience"} is non-negotiable and will filter you out in 80% of resume screenings.`,
    `Without solid ${missingSkills.slice(0, 2).join(" and ")}, you will struggle in technical interviews. Most ${formData.targetLevel} positions require demonstrated ability in these areas.`,
    `Your ${formData.experienceLevel} experience level requires demonstrable projects. Listing skills without portfolio evidence reduces your callback rate by 60-70%. Interviewers will test depth, not just breadth.`,
  ];

  const riskStatement = riskStatements[Math.min(Math.floor(readinessScore / 35), riskStatements.length - 1)];

  const whatNotToLearn = whatNotToLearnMap[roleKey] || whatNotToLearnMap["default"];
  
  const alternativeRole = readinessScore < 50 ? alternativeRolesMap[roleKey] || alternativeRolesMap["default"] : null;

  return {
    requiredSkills: skillAssessments,
    readinessScore,
    categoryScores,
    missingSkills,
    weeklyPlan,
    riskStatement,
    totalWeeks,
    whatNotToLearn,
    alternativeRole,
  };
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    jobRole: "",
    industry: "",
    targetLevel: "",
    currentSkills: "",
    experienceLevel: "",
    hoursPerWeek: "",
    urgency: "",
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!formData.jobRole || !formData.currentSkills || !formData.experienceLevel || !formData.hoursPerWeek || !formData.targetLevel || !formData.urgency) {
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysis = analyzeSkills(formData);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Competitive";
    if (score >= 40) return "Developing";
    return "Not Ready";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core": return <Code className="w-4 h-4" />;
      case "tools": return <Wrench className="w-4 h-4" />;
      case "application": return <Brain className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4" style={{ fontFamily: "var(--font-code)" }}>
            <Briefcase className="w-4 h-4" />
            Career Strategy Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            Job Readiness Assessment
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get an honest evaluation of your employability and a practical learning roadmap from a hiring perspective.
          </p>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-code)" }}>
                  <Target className="w-5 h-5 text-primary" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-code)" }}>
                      Target Job Role
                    </label>
                    <Input
                      placeholder="e.g., Frontend Developer"
                      value={formData.jobRole}
                      onChange={(e) =>
                        setFormData({ ...formData, jobRole: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-code)" }}>
                      Target Industry
                    </label>
                    <Input
                      placeholder="e.g., Tech, Fintech, Healthcare"
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-code)" }}>
                      Target Level
                    </label>
                    <Select
                      value={formData.targetLevel}
                      onValueChange={(value) =>
                        setFormData({ ...formData, targetLevel: value })
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intern">Intern</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid-Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-code)" }}>
                      Experience Level
                    </label>
                    <Select
                      value={formData.experienceLevel}
                      onValueChange={(value) =>
                        setFormData({ ...formData, experienceLevel: value })
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Your experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ fontFamily: "var(--font-code)" }}>
                    Current Skills (with strength level)
                  </label>
                  <Textarea
                    placeholder="List skills with confidence: e.g., HTML (strong), CSS (strong), JavaScript (medium), React (learning), Git (basic)"
                    value={formData.currentSkills}
                    onChange={(e) =>
                      setFormData({ ...formData, currentSkills: e.target.value })
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-code)" }}>
                      Weekly Learning Time
                    </label>
                    <Select
                      value={formData.hoursPerWeek}
                      onValueChange={(value) =>
                        setFormData({ ...formData, hoursPerWeek: value })
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Available hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 hours/week</SelectItem>
                        <SelectItem value="10">10 hours/week</SelectItem>
                        <SelectItem value="15">15 hours/week</SelectItem>
                        <SelectItem value="20">20+ hours/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ fontFamily: "var(--font-code)" }}>
                      Learning Urgency
                    </label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, urgency: value })
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exploring">Just Exploring</SelectItem>
                        <SelectItem value="3-6 months">3-6 Months</SelectItem>
                        <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !formData.jobRole || !formData.currentSkills || !formData.experienceLevel || !formData.hoursPerWeek || !formData.targetLevel || !formData.urgency}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze My Readiness
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Card className="border-2 border-border/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1" style={{ fontFamily: "var(--font-code)" }}>
                          Job Readiness Score
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-5xl font-bold ${getScoreColor(result.readinessScore)}`} style={{ fontFamily: "var(--font-serif)" }}>
                            {result.readinessScore}
                          </span>
                          <span className="text-2xl text-muted-foreground">/100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={result.readinessScore >= 70 ? "default" : result.readinessScore >= 40 ? "secondary" : "destructive"}
                          className="text-sm px-3 py-1"
                        >
                          {getScoreLabel(result.readinessScore)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2" style={{ fontFamily: "var(--font-code)" }}>
                          {result.requiredSkills.filter(s => s.userHas).length}/{result.requiredSkills.length} skills matched
                        </p>
                      </div>
                    </div>
                    <Progress value={result.readinessScore} className="mt-4 h-2" />
                  </div>
                </Card>

                <Card className="border-2 border-border/50 shadow-lg">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: "var(--font-code)" }}>
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Category Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {[
                        { key: "core", label: "Core Technical Skills", score: result.categoryScores.core },
                        { key: "tools", label: "Tools & Workflow", score: result.categoryScores.tools },
                        { key: "application", label: "Problem Solving / Application", score: result.categoryScores.application },
                      ].map((cat) => (
                        <div key={cat.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(cat.key)}
                              <span className="text-sm font-medium">{cat.label}</span>
                            </div>
                            <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>{cat.score}%</span>
                          </div>
                          <Progress value={cat.score} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 shadow-lg">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: "var(--font-code)" }}>
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Skills Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {result.requiredSkills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            {skill.userHas ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                            )}
                            <span className={`text-sm ${skill.userHas ? "text-foreground" : "text-muted-foreground"}`}>
                              {skill.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {skill.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${
                                skill.importance === "critical"
                                  ? "border-red-300 text-red-700 bg-red-50"
                                  : skill.importance === "high"
                                  ? "border-amber-300 text-amber-700 bg-amber-50"
                                  : "border-gray-300 text-gray-600 bg-gray-50"
                              }`}
                            >
                              {skill.importance}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-destructive/30 bg-destructive/5 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive mb-1" style={{ fontFamily: "var(--font-code)" }}>
                          Honest Risk Assessment
                        </p>
                        <p className="text-sm text-destructive/80">
                          {result.riskStatement}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center p-8 rounded-xl border-2 border-dashed border-border/50 bg-muted/30">
                  <TrendingUp className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Fill in your details and click analyze to see your job readiness assessment
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {result && (
            <>
              {result.weeklyPlan.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <Card className="border-2 border-border/50 shadow-lg">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-code)" }}>
                        <BookOpen className="w-5 h-5 text-primary" />
                        {result.totalWeeks}-Week Learning Roadmap
                        <Badge variant="outline" className="ml-2">
                          {formData.hoursPerWeek} hrs/week
                        </Badge>
                        <Badge variant="outline" className="ml-1">
                          {formData.urgency}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {result.weeklyPlan.map((week, index) => (
                          <motion.div
                            key={week.week}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="relative"
                          >
                            <div className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/30 transition-colors h-full">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-code)" }}>
                                    {week.week}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-code)" }}>Week {week.week}</p>
                                  <p className="text-sm font-medium">{week.focus}</p>
                                </div>
                              </div>
                              <div className="space-y-2 mb-3">
                                {week.skills.map((skill, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground line-clamp-1">{skill}</span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-primary/80 italic border-t border-border/30 pt-2">
                                {week.reason}
                              </p>
                            </div>
                            {index < result.weeklyPlan.length - 1 && (
                              <div className="hidden sm:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid md:grid-cols-2 gap-6"
              >
                <Card className="border-2 border-amber-200 bg-amber-50/50 shadow-lg">
                  <CardHeader className="border-b border-amber-200/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base text-amber-800" style={{ fontFamily: "var(--font-code)" }}>
                      <XCircle className="w-5 h-5" />
                      What NOT to Learn Right Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {result.whatNotToLearn.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                          <span className="text-amber-400 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {result.alternativeRole && (
                  <Card className="border-2 border-blue-200 bg-blue-50/50 shadow-lg">
                    <CardHeader className="border-b border-blue-200/50 pb-4">
                      <CardTitle className="flex items-center gap-2 text-base text-blue-800" style={{ fontFamily: "var(--font-code)" }}>
                        <Lightbulb className="w-5 h-5" />
                        Alternative Role to Consider
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="font-semibold text-blue-900 mb-2">{result.alternativeRole.role}</p>
                      <p className="text-sm text-blue-700">{result.alternativeRole.reason}</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p style={{ fontFamily: "var(--font-code)" }}>
            This assessment is based on industry hiring patterns and interview expectations.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
