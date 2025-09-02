import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { MapPin, Users, Smartphone, Monitor, ArrowRight, Clock, Activity, Zap } from "lucide-react";

const Index = () => {
  

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

  useEffect(() => {
    document.title = 'Realcon Tracker — Enterprise Location & Time Tracking';
    const desc = 'Minimal, enterprise-grade location and time tracking for teams.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Realcon Tracker
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Enterprise‑grade location and time tracking for modern teams.
            </p>
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


      </div>
    </div>
  );
};

export default Index;
