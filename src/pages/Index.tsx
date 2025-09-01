import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Smartphone, Monitor, ArrowRight, Clock, Activity, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Real-time Location Tracking",
      description: "Automatic location detection with precise time logging for every place visited."
    },
    {
      icon: Clock,
      title: "Time Analytics",
      description: "Detailed insights into time spent at different locations with visual reports."
    },
    {
      icon: Activity,
      title: "Live Monitoring",
      description: "Real-time admin dashboard to monitor all users and their current activities."
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Set it and forget it - automatic tracking without manual input required."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10 pointer-events-none" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-secondary rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-accent rounded-full blur-3xl opacity-15 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent font-playfair">
              Realcon Tracker
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced location-based time tracking with beautiful glassmorphism UI. 
              Perfect for teams, remote work, and productivity insights.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/tracker')}
              className="w-full sm:w-auto bg-gradient-primary hover:shadow-glow text-white text-lg px-8 py-4 h-auto rounded-2xl"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Mobile Tracker App
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="w-full sm:w-auto glass-surface border-border/50 text-lg px-8 py-4 h-auto rounded-2xl hover:bg-surface-hover"
            >
              <Monitor className="h-5 w-5 mr-2" />
              Admin Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card p-6 group hover:shadow-glow transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* App Previews */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Mobile App Preview */}
          <Card className="glass-card p-8 text-center group hover:shadow-glow transition-all duration-300">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-glow transition-all">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Mobile User App</h3>
                <p className="text-muted-foreground">
                  Lightweight mobile interface for users to track their location and view personal analytics. 
                  One-tap start/stop with automatic location detection.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass-surface p-3 rounded-xl">
                  <div className="font-semibold text-primary">Auto-Track</div>
                  <div className="text-muted-foreground">GPS Location</div>
                </div>
                <div className="glass-surface p-3 rounded-xl">
                  <div className="font-semibold text-secondary">Real-time</div>
                  <div className="text-muted-foreground">Time Logging</div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/tracker')}
                className="w-full bg-gradient-secondary hover:shadow-glow text-white rounded-xl"
              >
                Try Mobile App
              </Button>
            </div>
          </Card>

          {/* Admin Dashboard Preview */}
          <Card className="glass-card p-8 text-center group hover:shadow-glow transition-all duration-300">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-glow transition-all">
                <Users className="h-8 w-8 text-white" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Admin Dashboard</h3>
                <p className="text-muted-foreground">
                  Comprehensive web panel for managers to monitor all users, generate reports, 
                  and analyze team productivity patterns.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass-surface p-3 rounded-xl">
                  <div className="font-semibold text-accent">Live Monitor</div>
                  <div className="text-muted-foreground">All Users</div>
                </div>
                <div className="glass-surface p-3 rounded-xl">
                  <div className="font-semibold text-primary">Reports</div>
                  <div className="text-muted-foreground">Analytics</div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/admin')}
                className="w-full bg-gradient-accent hover:shadow-glow text-white rounded-xl"
              >
                Open Dashboard
              </Button>
            </div>
          </Card>
        </div>

        {/* Backend Integration Notice */}
        <Card className="glass-card p-8 text-center border-accent/50">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ready for Production</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This is a complete UI foundation. To enable real location tracking, user authentication, 
              and data persistence, connect your Lovable project to Supabase using our native integration.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Authentication & User Management</span>
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Real-time Database</span>
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Location APIs</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
