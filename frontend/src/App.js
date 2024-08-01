import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'

import Footer from './components/Footer'  
import Header from './components/Header'  
import HomeScreen from './screens/HomeScreen'  
import LoginScreen from './screens/LoginScreen';
import MyFilesScreen from './screens/MyFilesScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import FileUploadScreen from './screens/FileUploadScreen';
import PasswordChangeScreen from './screens/PasswordChangeScreen';
import ProfileUpdateScreen from './screens/ProfileUpdateScreen';



function App() {
  return (
    <Router>
      <div>
      <Header/>
      <main className='container-fluid'>
      <Routes>
          <Route path='/my-profile'  Component={ProfileUpdateScreen} />
          <Route path='/change-my-password'  Component={PasswordChangeScreen} />
          <Route path='/upload-new-file'  Component={FileUploadScreen} />
          <Route path='/create-new-group'  Component={CreateGroupScreen} />
          <Route path='/all_files'  Component={HomeScreen} />
          <Route path='/my-files'  Component={MyFilesScreen} />
          <Route path='/'  Component={LoginScreen} />
      </Routes>
      </main>
      <Footer/>
      </div>
    </Router>
  );
}

export default App;
