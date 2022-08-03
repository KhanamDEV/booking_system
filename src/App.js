import RouteConfig from "./routes/routes";
import './scss/app.scss';
function App() {
  if (document.referrer == 'https://agentportal.tweetworldtravel.com/'){
    return <RouteConfig />
  }
  window.location.href =  'https://agentportal.tweetworldtravel.com/'
}

export default App;
