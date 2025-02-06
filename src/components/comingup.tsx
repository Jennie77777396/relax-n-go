
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Rocket } from "lucide-react"; 

export default function ComingUp() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Feature in Development
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            We're working hard to bring you something amazing. Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Rocket className="w-12 h-12 text-blue-500" /> 
        </CardContent>
      </Card>
    </div>
  );
}