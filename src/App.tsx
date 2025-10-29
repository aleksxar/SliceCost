import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Header from './components/Header';
import WorkDetails from './components/WorkDetails';
import Parameters from './components/Parameters';
import CostBreakdown from './components/CostBreakdown';
import ParameterEditor from './components/ParameterEditor';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGcodeParsing } from './hooks/useGcodeParsing';
import { calculateCosts } from './lib/calculations';
import { ParameterConfig, Parameters, CostBreakdown, WorkDetails } from './types';

export default function App() {
  // State management
  const [workDetails, setWorkDetails] = useState<WorkDetails>({
    grams: '',
    hours: '',
    minutes: '',
  });
  
  const [showParameterEditor, setShowParameterEditor] = useState(false);
  const [parameterConfig, setParameterConfig] = useLocalStorage();
  
  // Custom hooks
  const { handleOpenGcode, isLoading: isGcodeLoading } = useGcodeParsing();

  // Calculate costs
  const gramsNum = parseFloat(workDetails.grams) || 0;
  const hoursNum = parseFloat(workDetails.hours) || 0;
  const minutesNum = parseFloat(workDetails.minutes) || 0;
  
  const costs: CostBreakdown = calculateCosts(
    gramsNum,
    hoursNum,
    minutesNum,
    parameterConfig
  );

  // Event handlers
  const handleWorkDetailsChange = (details: WorkDetails) => {
    setWorkDetails(details);
  };

  const handleGcodeUpload = () => {
    handleOpenGcode((metadata) => {
      // Parse print time (e.g. "4h 51m" or "3h 15m 30s")
      const hoursMatch = metadata.printTime.match(/(\d+)h/);
      const minutesMatch = metadata.printTime.match(/(\d+)m/);
      
      setWorkDetails(prev => ({
        ...prev,
        grams: metadata.filamentUsed.toString(),
        hours: hoursMatch ? hoursMatch[1] : '0',
        minutes: minutesMatch ? minutesMatch[1] : '0',
      }));
    });
  };

  const handleToggleParameter = (key: keyof Parameters) => {
    setParameterConfig(prev => ({
      ...prev,
      enabled: {
        ...prev.enabled,
        [key]: !prev.enabled[key],
      },
    }));
  };

  const handleEditClick = () => {
    setShowParameterEditor(true);
  };

  const handleParameterSave = (config: ParameterConfig) => {
    setParameterConfig(config);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        
        <div className="grid lg:grid-cols-3 gap-8">
          <WorkDetails
            workDetails={workDetails}
            onWorkDetailsChange={handleWorkDetailsChange}
            onGcodeUpload={handleGcodeUpload}
            isGcodeLoading={isGcodeLoading}
          />
          
          <Parameters
            config={parameterConfig}
            onToggleParameter={handleToggleParameter}
            onEditClick={handleEditClick}
          />
          
          <CostBreakdown
            config={parameterConfig}
            costs={costs}
            workDetails={workDetails}
          />
        </div>

        <ParameterEditor
          isOpen={showParameterEditor}
          currentConfig={parameterConfig}
          onSave={handleParameterSave}
          onClose={() => setShowParameterEditor(false)}
        />
      </div>

      <Toaster theme="light" />
    </div>
  );
}
