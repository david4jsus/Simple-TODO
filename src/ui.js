// Import React library for creating components
import React from 'react';

// Import our TODO API thingy
import {Item, Project} from "./todo";

//==== TEST STUFF ====//
var proj1 = new Project ("Proj1", 10);
proj1.addItem (new Item (proj1, "Item 1", "Some description", "2020-08-19", 0, 11));
proj1.addItem (new Item (proj1, "Item 2", "Some more description", "2020-08-20", 3, 12));
proj1.addItem (new Item (proj1, "Item 3", "Even description", "2020-09-23", 2, 13));
var proj2 = new Project ("project 2", 20);
proj2.addItem (new Item (proj2, "Thing 1", "Hello", "2019-05-14", 1, 21));
proj2.addItem (new Item (proj2, "Thing 2", "Burgers", "2020-09-12", 3, 22));
proj2.addItem (new Item (proj2, "Thing 3", "Orange", "2020-10-05", 0, 23));
//====================//


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
      this.enterProject = this.enterProject.bind (this);
      this.enterMainView = this.enterMainView.bind (this);
      this.state = {view: "main_view", project: null};
   }

   enterProject (targetProject) {
      this.setState ({view: "project_view"});
      this.setState ({project: targetProject});
   }

   enterMainView() {
      this.setState ({view: "main_view"});
      this.setState ({project: null});
   }

   render() {
      return (
         <div className="app-content">
            {this.state.view === "main_view" &&
               <MainView projectClick={this.enterProject}/>
            }
            {this.state.view === "project_view" &&
               <ProjectView project={this.state.project} linkBack={this.enterMainView} />
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
            <ProjectCard project={proj1} projectClick={this.props.projectClick} />
            <ProjectCard project={proj2} projectClick={this.props.projectClick} />
         </>
      );
   }
}

// List of items in a specific project
class ProjectView extends React.Component {
   /* TODO
      - Finalize CSS
   */

   constructor (props) {
      super (props);
      this.linkBackClick = this.linkBackClick.bind (this);
   }

   linkBackClick() {
      this.props.linkBack();
   }

   render() {
      const items = [];
      for (let i = 0; i < this.props.project.getNumItems(); i++) {
         items.push (this.props.project.getItemByIndex (i));
      }
      const listItems = items.map (function (item) {
         return <ItemCard item={item} key={item.getID()} />;
      });

      return (
         <>
            <h3 className="link-to-projects" onClick={this.linkBackClick}>&lt; Projects</h3>
            <h2>{this.props.project.getTitle()}</h2>
            {listItems}
         </>
      );
   }
}

// Shows project title, options when hovered
class ProjectCard extends React.Component {
   /* TODO
      - Add options when hovering
      - Finalize CSS
   */

   constructor (props) {
      super (props);
      this.click = this.click.bind (this);
   }

   click (e) {
      e.preventDefault();
      this.props.projectClick (this.props.project);
   }

   render() {
      return (
         <p className="project-card" onClick={this.click}>{this.props.project.getTitle()}</p>
      );
   }
}

// Shows item textbox and title, options when hovered, details when selected
class ItemCard extends React.Component {
   /* TODO
      - Add onclick() to expand/minimize item details + show options
      - Add options when hovering
      - Finalize CSS
   */

   constructor (props) {
      super (props);
      this.toggleExpanded = this.toggleExpanded.bind (this);
      this.state = {expanded: false};
   }

   toggleExpanded() {
      this.setState ({expanded: !this.state.expanded});
   }

   render() {
      let infoClass = this.state.expanded ? "item-info-expanded" : "item-info-collapsed";

      return (
         <div className="item-card" onClick={this.toggleExpanded}>
            <span>{this.props.item.getTitle()}</span>
            <ul className={infoClass}>
               <li>
                  <span className="item-info-label">Description: </span>
                  {this.props.item.getDescription()}
               </li>
               <li>
                  <span className="item-info-label">Due date: </span>
                  {this.props.item.getDueDate()}
               </li>
               <li>
                  <span className="item-info-label">Priority: </span>
                  {this.props.item.getPriority()}
               </li>
            </ul>
         </div>
      );
   }
}

// Export main component to be used in main.js
export default App;