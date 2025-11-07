// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import './App.css';

// 👇 1. [변경] 새로운 provider.tsx 파일에서 Provider를 가져옵니다.
import { ExpeditionProvider } from './stores/expedition.provider'; 

import ExpeditionSidebar from './ui/ExpeditionSidebar/ExpeditionSidebar';
import HomePage from './pages/HomePage/HomePage';
import ProjectUpload from './pages/ProjectUpload/ProjectUpload';
// ... (다른 페이지 import는 동일)
import CodeAnalysis from './pages/CodeAnalysis/CodeAnalysis';
import TerraformValley from './pages/TerraformValley/TerraformValley';
import AISizing from './pages/AISizing/AISizing';
import TerraformLoading from './pages/TerraformLoading/TerraformLoading';
import Generation from './pages/Generation/Generation';
import Results from './pages/Results/Results'; 

function App() {
  return (
    <div className="appContainer">
      <ExpeditionSidebar />

      <main className="mainContent">
        <ExpeditionProvider>
          <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/upload" element={<ProjectUpload />} /> 
            <Route path="/analysis" element={<CodeAnalysis />} />
            <Route path="/terraform" element={<TerraformValley />} />
            <Route path="/terraform/sizing" element={<AISizing />} />
            <Route path="/terraform-loading" element={<TerraformLoading />} />
            <Route path="/generation" element={<Generation />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </ExpeditionProvider>
      </main>
    </div>
  );
}

export default App;