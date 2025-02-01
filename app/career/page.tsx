// app/page.tsx

import CustomCareerGuidance from "@/components/CustomCareerGuidence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CareerGuidancePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Career Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomCareerGuidance />
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerGuidancePage;