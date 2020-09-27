// Import React library for creating components
import React from 'react';

// Renders the web app (back to root node)
function App() {
   return (
      <>
         <AppHeader />
         <AppContent />
         <AppFooter />
      </>
  );
}

// Web app title and settings
class AppHeader extends React.Component {
   /* TODO
      - Implement settings
      - Finalize CSS
   */

   render() {
      return(
         <div className="app-header">
            <h1>Simple TODO | &#9776;</h1>
         </div>
      );
   }
}

// Body of the web app
class AppContent extends React.Component {
   /* TODO
      - Work on the other of components that will be invoked from here
   */

   constructor (props) {
      super (props);
      this.state = {view: "main_view"};
   }

   render() {
      return (
         <div className="app-content">
            {this.state.view === "main_view" &&
               <MainView />
            }
            {this.state.view === "project_view" &&
               <ProjectView />
            }
         </div>
      );
   }
}

// Footer of the web app (basic info about... idk)
class AppFooter extends React.Component {
   /* TODO
      - I guess put a link to this project on GitHub
      - Maybe put my name or something idk man
      - Be creative, what are footers for?
   */

   render() {
      return (
         <div className="app-footer">
            <span>Footer here</span>
         </div>
      );
   }
}

// List of projects, opening view when opening app
class MainView extends React.Component {
   /* TODO
      - Work on the other components that will be invoked from here
   */

   render () {
      return (
         <>
            <h2>Projects | + | All items</h2>
            <ProjectCard projectName="Project 1" />
            <ProjectCard projectName="Project 2" />
         </>
      );
   }
}

// List of items in a specific project
class ProjectView extends React.Component {
   /* TODO
      - Use props to determine what project to show
      - Finalize CSS
   */

   render() {
      return (
         <>
            <h2>Project 1</h2>
            <ItemCard />
            <ItemCard />
         </>
      );
   }
}

// Shows project title, options when hovered
class ProjectCard extends React.Component {
   /* TODO
      - Use props to determine what project to show
      - Add onclick() to enter this project's view
      - Add options when hovering
      - Finalize CSS
   */

   render() {
      return (
         <p className="project-card">{this.props.projectName}</p>
      );
   }
}

// Shows item textbox and title, options when hovered, details when selected
class ItemCard extends React.Component {
   /* TODO
      - Use props to determine what item to show
      - Add onclick() to expand/minimize item details + show options
      - Add options when hovering
      - Finalize CSS
   */

   render() {
      return (
         <p className="item-card">Item</p>
      );
   }
}

// Export main component to be used in main.js
export default App;