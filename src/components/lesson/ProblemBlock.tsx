import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type Problem } from "@/types/learning";

interface ProblemBlockProps {
    content: string;
}

export function ProblemBlock({ content }: ProblemBlockProps) {
    const problem: Problem = JSON.parse(content);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [showHints, setShowHints] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [showSolution, setShowSolution] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleSubmit = () => {
        const correct = selectedAnswer === problem.correct_answer;
        setIsCorrect(correct);
    };

    const handleNextHint = () => {
        if (problem.hints && currentHintIndex < problem.hints.length - 1) {
            setCurrentHintIndex(prev => prev + 1);
        }
    };

    return (
        <div className="space-y-6">
            {/* Question */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">{problem.question_text}</h3>

                {/* Multiple Choice */}
                {problem.question_type === "mcq" && problem.options && (
                    <RadioGroup
                        value={selectedAnswer}
                        onValueChange={setSelectedAnswer}
                        className="space-y-2"
                    >
                        {problem.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                )}

                {/* Short Input */}
                {problem.question_type === "short_input" && (
                    <Input
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        placeholder="Enter your answer"
                    />
                )}

                {/* Code Input - You can integrate a code editor here */}
                {problem.question_type === "code" && (
                    <textarea
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className="w-full h-32 font-mono p-2 border rounded"
                        placeholder="Write your code here..."
                    />
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Button onClick={handleSubmit}>Submit Answer</Button>
                <Button
                    variant="outline"
                    onClick={() => setShowHints(true)}
                    disabled={!problem.hints?.length}
                >
                    Show Hints
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setShowSolution(true)}
                    disabled={!problem.solution_steps?.length}
                >
                    Show Solution
                </Button>
            </div>

            {/* Feedback */}
            {isCorrect !== null && (
                <Alert variant={isCorrect ? "default" : "destructive"}>
                    <AlertDescription>
                        {isCorrect ? "Correct!" : "Try again. Check the hints if you need help."}
                    </AlertDescription>
                </Alert>
            )}

            {/* Hints */}
            {showHints && problem.hints && (
                <Card className="p-4">
                    <h4 className="font-semibold mb-2">Hint {currentHintIndex + 1}</h4>
                    <p className="mb-4">{problem.hints[currentHintIndex].content}</p>
                    {currentHintIndex < problem.hints.length - 1 && (
                        <Button variant="outline" onClick={handleNextHint}>
                            Next Hint
                        </Button>
                    )}
                </Card>
            )}

            {/* Solution */}
            {showSolution && problem.solution_steps && (
                <Card className="p-4">
                    <h4 className="font-semibold mb-4">Solution</h4>
                    <div className="space-y-4">
                        {problem.solution_steps.map((step, index) => (
                            <div key={index}>
                                <h5 className="font-medium">Step {index + 1}</h5>
                                <p>{step.explanation}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
} 