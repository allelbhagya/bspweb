import './App.css';
import IndexPage from './components/IndexPage';
import Layout from './components/Layout';
import {Routes, Route} from "react-router-dom";
import LoginPage from './components/LoginPage';
import RegisterPage from "./components/RegisterPage";
import { UserContextProvider } from './components/UserContext';
import CreateLog from './components/CreateLog';
import AnalysisPage from './components/AnalysisPage';
import EditLog from './components/EditLog';

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path ="/" element={<Layout />}>
        <Route index element={<IndexPage />}/>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/create" element={<CreateLog />}/>
        <Route path="/analysis" element={<AnalysisPage/>}/>
        <Route path="/edit/:id" element={<EditLog/>}/>
      </Route>
    </Routes> 
    </UserContextProvider>


  );
}

export default App;
