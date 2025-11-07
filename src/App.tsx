// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import './App.css';

// 👇 1. 'expedition.provider.tsx' 파일에서 Provider를 가져옵니다.
import { ExpeditionProvider } from './stores/expedition.provider'; 

import ExpeditionSidebar from './ui/ExpeditionSidebar/ExpeditionSidebar';
import HomePage from './pages/HomePage/HomePage';
import ProjectUpload from './pages/ProjectUpload/ProjectUpload';
import CodeAnalysis from './pages/CodeAnalysis/CodeAnalysis';
import TerraformValley from './pages/TerraformValley/TerraformValley';
import AISizing from './pages/AISizing/AISizing';
import TerraformLoading from './pages/TerraformLoading/TerraformLoading';
import Generation from './pages/Generation/Generation';
import Results from './pages/Results/Results'; 
import DeploymentTips from './pages/DeploymentTips/DeploymentTips';

function App() {
  return (
    <div className="appContainer">
      {/* 👇 2. Provider가 사이드바와 mainContent를 모두 감싸도록 수정 */}
      <ExpeditionProvider>
        
        {/* 사이드바가 이제 Provider의 '자식'이 되었음 */}
        <ExpeditionSidebar />

        <main className="mainContent">
          <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/upload" element={<ProjectUpload />} /> 
            <Route path="/analysis" element={<CodeAnalysis />} />
            <Route path="/terraform" element={<TerraformValley />} />
            <Route path="/terraform/sizing" element={<AISizing />} />
            <Route path="/terraform-loading" element={<TerraformLoading />} />
            <Route path="/generation" element={<Generation />} />
            <Route path="/results" element={<Results />} />
            <Route path="/tips" element={<DeploymentTips />} />
          </Routes>
        </main>
        
      </ExpeditionProvider> {/* 👈 Provider가 여기서 닫힘 */}
    </div>
  );
}

export default App;