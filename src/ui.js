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
      this.state = {
         itemForm: false,
         projectEditForm: false,
         projectDeletePrompt: false,
         itemEditForm : false,
         itemDeletePrompt : false,
         targetItem : 0
      };
      this.linkBackClick = this.linkBackClick.bind (this);
      this.openItemForm = this.openItemForm.bind (this);
      this.closeItemForm = this.closeItemForm.bind (this);
      this.openProjectEditForm = this.openProjectEditForm.bind (this);
      this.closeProjectEditForm = this.closeProjectEditForm.bind (this);
      this.openProjectDeletePrompt = this.openProjectDeletePrompt.bind (this);
      this.closeProjectDeletePrompt = this.closeProjectDeletePrompt.bind (this);
      this.deleteProject = this.deleteProject.bind (this);
      this.openItemEditForm = this.openItemEditForm.bind (this);
      this.closeItemEditForm = this.closeItemEditForm.bind (this);
      this.openItemDeletePrompt = this.openItemDeletePrompt.bind (this);
      this.closeItemDeletePrompt = this.closeItemDeletePrompt.bind (this);
      this.deleteItem = this.deleteItem.bind (this);
   }

   linkBackClick() {
      this.props.linkBack();
   }

   openItemForm() {
      this.setState ({itemForm: true});
      this.setState ({projectEditForm: false});
      this.setState ({projectDeletePrompt: false});
      this.setState ({itemEditForm: false});
      this.setState ({itemDeletePrompt : false});
   }

   closeItemForm() {
      this.setState ({itemForm: false});
   }

   openProjectEditForm() {
      this.setState ({projectEditForm: true});
      this.setState ({itemForm: false});
      this.setState ({projectDeletePrompt: false});
      this.setState ({itemEditForm: false});
      this.setState ({itemDeletePrompt : false});
   }

   closeProjectEditForm() {
      this.setState ({projectEditForm: false});
   }

   openProjectDeletePrompt() {
      this.setState ({projectDeletePrompt: true});
      this.setState ({itemForm: false});
      this.setState ({projectEditForm: false});
      this.setState ({itemEditForm: false});
      this.setState ({itemDeletePrompt : false});
   }

   closeProjectDeletePrompt() {
      this.setState ({projectDeletePrompt: false});
   }

   deleteProject() {
      this.props.linkBack();
      appManager.removeProject (this.props.project.getID());
   }

   openItemEditForm (itemID) {
      this.setState ({targetItem : itemID});
      this.setState ({itemEditForm : true});
      this.setState ({itemForm : false});
      this.setState ({projectEditForm : false});
      this.setState ({projectDeletePrompt : false});
      this.setState ({itemDeletePrompt : false});
   }

   closeItemEditForm() {
      this.setState ({itemEditForm: false});
      this.setState ({targetItem: 0});
   }

   openItemDeletePrompt (itemID) {
      this.setState ({targetItem : itemID});
      this.setState ({itemDeletePrompt: true});
      this.setState ({itemForm: false});
      this.setState ({projectEditForm: false});
      this.setState ({projectDeletePrompt: false});
      this.setState ({itemEditForm: false});
   }

   closeItemDeletePrompt() {
      this.setState ({itemDeletePrompt: false});
      this.setState ({targetItem: 0});
   }

   deleteItem () {
      this.props.project.eraseItem (this.state.targetItem);
      this.closeItemDeletePrompt();
   }

   render() {

      // Create list of TODO items to show
      const items = [];
      for (let i = 0; i < this.props.project.getNumItems(); i++) {
         items.push (this.props.project.getItemByIndex (i));
      }
      const listItems = items.map (function (item) {
         return <ItemCard item={item} key={item.getID()} onItemEdit={this.openItemEditForm} onItemDelete={this.openItemDeletePrompt} />;
      }, this);

      // Create warning prompt for project deletion
      const projectDeletePrompt = "Are you sure you want to delete project '" + this.props.project.getTitle() + "'? (There is no undo)";

      return (
         <>
            <h3 className="link-to-projects" onClick={this.linkBackClick}>&lt; Projects</h3>
            <h2>
               {this.props.project.getTitle()}
               <span className="stay-right">
                  <span className="circle-button" onClick={this.openItemForm}>+</span>
                  <div className="options-menu">
                     <span className="circle-button">&#8942;</span>
                     <div className="options-menu-items">
                        <span onClick={this.openProjectEditForm}>Edit project</span>
                        <span onClick={this.openProjectDeletePrompt}>Delete project</span>
                     </div>
                  </div>
               </span>
            </h2>
            {listItems}
            {this.state.itemForm && <ItemForm onCreate={this.closeItemForm} onCancel={this.closeItemForm} projectID={this.props.project.getID()} />}
            {this.state.projectEditForm && <ProjectEditForm onEdit={this.closeProjectEditForm} onCancel={this.closeProjectEditForm} project={this.props.project} />}
            {this.state.projectDeletePrompt && <ConfirmationPrompt prompt={projectDeletePrompt} onAccept={this.deleteProject} onCancel={this.closeProjectDeletePrompt} />}
            {this.state.itemEditForm && <ItemEditForm item={this.props.project.getItem (this.state.targetItem)} onEdit={this.closeItemEditForm} onCancel={this.closeItemEditForm} />}
            {this.state.itemDeletePrompt && <ConfirmationPrompt prompt={"Are you sure you want to delete item '" + this.props.project.getItem (this.state.targetItem).getTitle() + "'? (There is no undo)"} onAccept={this.deleteItem} onCancel={this.closeItemDeletePrompt} />}
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
      - Finalize CSS
   */

   constructor (props) {
      super (props);
      this.state = {expanded: false};
      this.toggleExpanded = this.toggleExpanded.bind (this);
   }

   toggleExpanded() {
      this.setState ({expanded: !this.state.expanded});
   }

   render() {
      // Whether the card is expanded to show detailed information
      const infoClass = this.state.expanded ? "item-info-expanded" : "item-info-collapsed";

      // Priority
      let priorityText = "";
      switch (this.props.item.getPriority()) {
         default:
            priorityText = "Undefined";
            break;
         case "0":
            priorityText = "Low";
            break;
         case "1":
            priorityText = "Moderate";
            break;
         case "2":
            priorityText = "High";
            break;
      }

      return (
         <div className="item-card" onClick={this.toggleExpanded}>
            <span>{this.props.item.getTitle()}</span>
            <div className="options-menu">
               <span className="stay-right">&#8942;</span>
               <div className="options-menu-items">
                  <span onClick={() => {this.props.onItemEdit (this.props.item.getID())}}>Edit item</span>
                  <span onClick={() => {this.props.onItemDelete (this.props.item.getID())}}>Delete item</span>
               </div>
            </div>
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
                  {priorityText}
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
      this.state = {
         newTitle: "",
         newDescription: "",
         newDueDate: "",
         newPriority: ""
      };
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
      this.editProject = this.editProject.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   editProject() {
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
            <button onClick={this.editProject}>Edit</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows floating confirmation menu with customizable text
class ConfirmationPrompt extends React.Component {

   render() {
      return (
         <div className="confirmation-prompt">
            <p>{this.props.prompt}</p>
            <button onClick={this.props.onAccept}>Accept</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows form to edit an item
class ItemEditForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         newTitle: this.props.item.getTitle(),
         newDescription: this.props.item.getDescription(),
         newDueDate: this.props.item.getDueDate(),
         newPriority: this.props.item.getPriority()
      };
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.handleDescriptionChange = this.handleDescriptionChange.bind (this);
      this.handleDueDateChange = this.handleDueDateChange.bind (this);
      this.handlePriorityChange = this.handlePriorityChange.bind (this);
      this.editItem = this.editItem.bind (this);
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

   editItem() {
      this.props.item.setTitle (this.state.newTitle);
      this.props.item.setDescription (this.state.newDescription);
      this.props.item.setDueDate (this.state.newDueDate);
      this.props.item.setPriority (this.state.newPriority);
      this.props.onEdit();
   }

   render() {
      return (
         <div id="itemEditForm" className="form">
            <h3>Edit '{this.props.item.getTitle()}' Item</h3>
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
            <button onClick={this.editItem}>Save</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Export main component to be used in main.js
export default App;