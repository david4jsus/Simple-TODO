// Import React library for creating components
import React from 'react';

// Import our TODO API thingy
import {Item, Project, AppManager} from "./todo";

//==== TEST STUFF ====//
var appManager = new AppManager();
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
            <h1>Simple TODO <span className="stay-right">&#9776;</span></h1>
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

   constructor (props) {
      super (props);
      this.state = {projectForm: false};
      this.openProjectForm = this.openProjectForm.bind (this);
      this.closeProjectForm = this.closeProjectForm.bind (this);
   }

   openProjectForm() {
      this.setState ({projectForm: true});
   }

   closeProjectForm() {
      this.setState ({projectForm: false});
   }

   render () {
      const listProjects = appManager.getProjectList().map (function (project) {
         return <ProjectCard project={project} projectClick={this.props.projectClick} key={project.getID()} />;
      }, this);

      return (
         <>
            <h2>Projects<span className="stay-right"><button className="circle-button" onClick={this.openProjectForm}>+</button> | All items</span></h2>
            {listProjects}
            {this.state.projectForm && <ProjectForm onCreate={this.closeProjectForm} onCancel={this.closeProjectForm} />}
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
      this.state = {itemForm: false, projectEditForm: false};
      this.linkBackClick = this.linkBackClick.bind (this);
      this.openItemForm = this.openItemForm.bind (this);
      this.closeItemForm = this.closeItemForm.bind (this);
      this.openProjectEditForm = this.openProjectEditForm.bind (this);
      this.closeProjectEditForm = this.closeProjectEditForm.bind (this);
   }

   linkBackClick() {
      this.props.linkBack();
   }

   openItemForm() {
      this.setState ({itemForm: true});
      this.setState ({projectEditForm: false});
   }

   closeItemForm() {
      this.setState ({itemForm: false});
   }

   openProjectEditForm() {
      this.setState ({projectEditForm: true});
      this.setState ({itemForm: false});
   }

   closeProjectEditForm() {
      this.setState ({projectEditForm: false});
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
            <h2>
               {this.props.project.getTitle()}
               <span className="stay-right">
                  <span className="circle-button" onClick={this.openItemForm}>+</span>
                  <div className="project-options-menu">
                     <span className="circle-button">&#8942;</span>
                     <div className="project-options-menu-items">
                        <span onClick={this.openProjectEditForm}>Edit project</span>
                        <span>Delete project</span>
                     </div>
                  </div>
               </span>
            </h2>
            {listItems}
            {this.state.itemForm && <ItemForm onCreate={this.closeItemForm} onCancel={this.closeItemForm} projectID={this.props.project.getID()} />}
            {this.state.projectEditForm && <ProjectEditForm onEdit={this.closeProjectEditForm} onCancel={this.closeProjectEditForm} project={this.props.project} />}
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

// Shows form to create a project
class ProjectForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {newTitle: ""};
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.createProject = this.createProject.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   createProject() {
      appManager.addProject (this.state.newTitle);
      this.props.onCreate();
   }

   render() {
      return (
         <div id="newProjectForm" className="form">
            <h3>New Project</h3>
            <p>
               <label htmlFor="newProjectTitle">Title:</label>
               <input id="newProjectTitle" type="text" placeholder="New Project" value={this.state.newTitle} onChange={this.handleTitleChange} />
            </p>
            <button onClick={this.createProject}>Create</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows form to create an item
class ItemForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {newTitle: "", newDescription: "", newDueDate: "", newPriority: ""};
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.handleDescriptionChange = this.handleDescriptionChange.bind (this);
      this.handleDueDateChange = this.handleDueDateChange.bind (this);
      this.handlePriorityChange = this.handlePriorityChange.bind (this);
      this.createItem = this.createItem.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   handleDescriptionChange (evt) {
      this.setState ({newDescription: evt.target.value});
   }

   handleDueDateChange (evt) {
      this.setState ({newDueDate: evt.target.value});
   }

   handlePriorityChange (evt) {
      this.setState ({newPriority: evt.target.value});
   }

   createItem() {
      appManager.addItem (this.props.projectID, this.state.newTitle, this.state.newDescription, this.state.newDueDate, this.state.newPriority);
      this.props.onCreate();
   }

   render() {
      return (
         <div id="newItemForm" className="form">
            <h3>New TODO Item</h3>
            <p>
               <label htmlFor="newItemTitle">Title:</label>
               <input id="newItemTitle" type="text" placeholder="New TODO Item" value={this.state.newTitle} onChange={this.handleTitleChange} />
            </p>
            <p>
               <label htmlFor="newItemDescription">Description:</label>
               <input id="newItemDescription" type="text" value={this.state.newDescription} onChange={this.handleDescriptionChange} />
            </p>
            <p>
               <label htmlFor="newItemDueDate">Due Date:</label>
               <input id="newItemDueDate" type="date" value={this.state.newDueDate} onChange={this.handleDueDateChange} />
            </p>
            <p>
               <label htmlFor="newItemPriority">Priority:</label>
               <select id="newItemPriority" value={this.state.newPriority} onChange={this.handlePriorityChange}>
                  <option value="0">Low</option>
                  <option value="1">Moderate</option>
                  <option value="2">High</option>
               </select>
            </p>
            <button onClick={this.createItem}>Create</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows form to edit a project
class ProjectEditForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {newTitle: this.props.project.getTitle()};
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.createProject = this.createProject.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   createProject() {
      this.props.project.setTitle (this.state.newTitle);
      this.props.onEdit();
   }

   render() {
      return (
         <div id="projectEditForm" className="form">
            <h3>Edit '{this.props.project.getTitle()}'</h3>
            <p>
               <label htmlFor="newProjectTitle">Title:</label>
               <input id="newProjectTitle" type="text" value={this.state.newTitle} onChange={this.handleTitleChange} />
            </p>
            <button onClick={this.createProject}>Create</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Export main component to be used in main.js
export default App;